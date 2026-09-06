import { expect, type Locator, type Page } from '@playwright/test';

type OnboardTrainee = {
  firstName: string;
  lastName: string;
};

export class PendingTraineeOnboardApprovalPage {
  readonly page: Page;
  readonly pendingApprovalsToggle: Locator;
  readonly searchbox: Locator;
  readonly forYouTab: Locator;
  readonly forYourRoleTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pendingApprovalsToggle = page.locator('#sidenav-main-drop .nav-item')
      .filter({ hasText: 'Pending Approvals' })
      .locator('[data-bs-toggle="dropdown"]');
    this.searchbox = page.getByRole('searchbox', { name: 'Username' });
    this.forYouTab = page.getByRole('link', { name: /For You \(\d+\)/ });
    this.forYourRoleTab = page.getByRole('link', { name: /For Your Role \(\d+\)/ });
  }

  async openTraineesQueue() {
    await this.pendingApprovalsToggle.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForTimeout(2000);
    await this.pendingApprovalsToggle.click();

    const onboarding = this.page.locator('app-pending-approvals-tabs .grid-item, .grid-item').filter({ hasText: /Onboarding/ }).first()
      .or(this.page.getByText('Onboarding', { exact: true }));
    await onboarding.first().waitFor({ state: 'visible', timeout: 15000 });
    await onboarding.first().click();

    const traineesItem = this.page.getByRole('listitem').filter({ hasText: /^Trainees/ }).first()
      .or(this.page.getByText(/^Trainees/));
    await traineesItem.first().waitFor({ state: 'visible', timeout: 15000 });
    await traineesItem.first().click();
    await this.page.getByRole('columnheader', { name: 'Action' }).waitFor({ state: 'visible', timeout: 20000 });
    console.log('Opened Pending Approvals > Onboarding > Trainees');
  }

  requestRow(trainee: OnboardTrainee) {
    return this.page.getByRole('row').filter({ hasText: `${trainee.firstName} ${trainee.lastName}` }).first();
  }

  async findRequestRow(trainee: OnboardTrainee) {
    const row = await this.findRequestRowInCurrentView(trainee);
    if (row) {
      return row;
    }

    for (const tab of [this.forYouTab, this.forYourRoleTab]) {
      if (!(await tab.isVisible().catch(() => false))) {
        continue;
      }
      await tab.click();
      await this.page.waitForTimeout(1000);
      const next = await this.findRequestRowInCurrentView(trainee);
      if (next) {
        return next;
      }
    }

    throw new Error(`No trainee onboard request found for ${trainee.firstName} ${trainee.lastName}`);
  }

  async approve(row: Locator) {
    await this.clickKebabAction(row, 'Approve');
    return this.confirmApproveDialog();
  }

  async process(row: Locator) {
    await this.clickKebabAction(row, 'Process');
    const toast = this.page.getByText(/Trainee request processed|processed successfully/i);
    await expect(toast.first()).toBeVisible({ timeout: 20000 });
    const text = (await toast.first().innerText()).trim();
    console.log(`Onboard process: ${text}`);
    await toast.first().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    return text;
  }

  async approveUntilDone(trainee: OnboardTrainee) {
    let approvedAny = false;
    for (let step = 0; step < 3; step++) {
      const row = await this.findRequestRow(trainee);
      await this.logRow(row);
      if (!(await this.clickKebabAction(row, 'Approve', { optional: true }))) {
        break;
      }
      await this.confirmApproveDialog();
      approvedAny = true;
      await this.page.waitForTimeout(1000);
    }
    if (approvedAny) {
      console.log('RM/TM approval complete (same manager is treated as one request)');
    } else {
      console.log('No Approve action left; RM/TM already approved or HR Process is next');
    }
  }

  private async confirmApproveDialog() {
    const dialog = this.page.getByRole('dialog');
    await dialog.getByText(/Are you sure you want to Approve/i).waitFor({ state: 'visible', timeout: 10000 });
    const feedback = dialog.getByRole('textbox', { name: /Feedback/i });
    if (await feedback.isVisible().catch(() => false)) {
      await feedback.fill('Approved');
    }
    const confirm = dialog.getByRole('button', { name: 'Approve', exact: true });
    await expect(confirm).toBeEnabled({ timeout: 10000 });
    await confirm.click();
    const toast = this.page.getByText(/Request has been approved|approved successfully/i);
    await expect(toast.first()).toBeVisible({ timeout: 20000 });
    const text = (await toast.first().innerText()).trim();
    console.log(`Onboard approve: ${text}`);
    await toast.first().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    return text;
  }

  async processAsHr(trainee: OnboardTrainee) {
    const attempts: Array<() => Promise<void>> = [
      async () => {},
      async () => this.openTab(this.forYouTab),
      async () => this.openTab(this.forYourRoleTab),
      async () => {
        await this.openTraineesQueue();
        await this.openTab(this.forYourRoleTab);
      },
    ];

    for (const go of attempts) {
      await go();
      const row = await this.findRequestRowInCurrentView(trainee);
      if (!row) {
        continue;
      }
      await this.logRow(row);
      if (await this.clickKebabAction(row, 'Process', { optional: true })) {
        const toast = this.page.getByText(/Trainee request processed|processed successfully/i);
        await expect(toast.first()).toBeVisible({ timeout: 20000 });
        const text = (await toast.first().innerText()).trim();
        console.log(`Onboard process: ${text}`);
        await toast.first().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        return text;
      }
    }

    throw new Error(`HR Process was not in the kebab for ${trainee.firstName} ${trainee.lastName} after RM/TM approval`);
  }

  async readyForOnboard(row: Locator) {
    await this.openKebab(row);
    await this.visibleMenuItem('Ready for Onboard').click();
    const yes = this.page.getByRole('dialog').getByRole('button', { name: 'Yes' })
      .or(this.page.getByRole('button', { name: 'Yes' }));
    await yes.first().waitFor({ state: 'visible', timeout: 10000 });
    await yes.first().click();
    const toast = this.page.getByText(/Employee onboarded/i);
    await expect(toast.first()).toBeVisible({ timeout: 20000 });
    const text = (await toast.first().innerText()).trim();
    console.log(`Ready for onboard: ${text}`);
    return text;
  }

  async rejectDiscontinue(row: Locator, comments?: string) {
    await this.openReject(row);
    await this.chooseRejectAction('Discontinue');
    await this.fillRejectFeedback(comments ?? 'Discontinuing the trainee onboard request.');
    await this.confirmReject();
    const toast = this.page.getByText(/rejected|discontinue/i);
    await expect(toast.first()).toBeVisible({ timeout: 20000 });
    const text = (await toast.first().innerText()).trim();
    console.log(`Onboard discontinue: ${text}`);
    return text;
  }

  async rejectExtend(row: Locator, extendDate: string, comments: string) {
    await this.openReject(row);
    await this.chooseRejectAction('Extend');
    const dateInput = this.page.getByRole('textbox', { name: /Default select example|extend/i })
      .or(this.page.getByPlaceholder(/date/i));
    await dateInput.first().fill(extendDate);
    const feedback = this.page.getByRole('textbox', { name: /Feedback for Extend/i });
    await feedback.waitFor({ state: 'visible', timeout: 10000 });
    await feedback.fill(comments);
    await this.confirmReject();
    const toast = this.page.getByText(/Trainee request extend|extended/i);
    await expect(toast.first()).toBeVisible({ timeout: 20000 });
    const text = (await toast.first().innerText()).trim();
    console.log(`Onboard extend: ${text}`);
    return text;
  }

  async kebabHas(row: Locator, name: string) {
    return this.clickKebabAction(row, name, { optional: true, inspectOnly: true });
  }

  async clickKebabAction(
    row: Locator,
    name: string,
    options?: { optional?: boolean; inspectOnly?: boolean },
  ) {
    const opened = await this.openKebab(row, { optional: options?.optional });
    if (!opened) {
      return false;
    }
    const actions = await this.readOpenMenu();
    console.log(`Onboard kebab actions: ${actions.join(', ') || '(none)'}`);
    const item = this.visibleMenuItem(name);
    const visible = await item.isVisible().catch(() => false);
    if (options?.inspectOnly || !visible) {
      await this.closeMenus();
      if (!visible && !options?.optional && !options?.inspectOnly) {
        throw new Error(`Kebab action "${name}" was not visible. Saw: ${actions.join(', ') || '(none)'}`);
      }
      return visible;
    }
    await item.click();
    return true;
  }

  private async findRequestRowInCurrentView(trainee: OnboardTrainee) {
    let row = this.requestRow(trainee);
    if (await row.isVisible({ timeout: 4000 }).catch(() => false)) {
      return row;
    }

    if (await this.searchbox.isVisible().catch(() => false)) {
      await this.searchbox.fill('');
      await this.searchbox.press('Enter');
      await this.page.waitForTimeout(800);
      row = this.requestRow(trainee);
      if (await row.isVisible({ timeout: 3000 }).catch(() => false)) {
        return row;
      }

      await this.searchbox.fill(trainee.firstName);
      await this.searchbox.press('Enter');
      await this.page.waitForTimeout(1500);
      row = this.requestRow(trainee);
      if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
        return row;
      }
    }

    return null;
  }

  private async openTab(tab: Locator) {
    if (await tab.isVisible().catch(() => false)) {
      await tab.click();
      await this.page.waitForTimeout(1000);
    }
  }

  private async logRow(row: Locator) {
    const text = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    console.log(`Onboard pending row: ${text}`);
  }

  private async openReject(row: Locator) {
    await this.openKebab(row);
    await this.visibleMenuItem('Reject').click();
    await expect(this.page.getByText(/Are you sure you want to/i).first()).toBeVisible({ timeout: 10000 });
  }

  private async chooseRejectAction(action: 'Extend' | 'Discontinue') {
    await this.page.getByText(action, { exact: true }).first().click();
  }

  private async fillRejectFeedback(comments: string) {
    const feedback = this.page.getByRole('textbox', { name: /feedback|reason|comment/i }).first();
    if (await feedback.isVisible({ timeout: 5000 }).catch(() => false)) {
      await feedback.fill(comments);
    }
  }

  private async confirmReject() {
    await this.page.getByRole('button', { name: 'Reject', exact: true }).click();
  }

  private visibleMenuItem(name: string) {
    return this.page.getByText(name, { exact: true }).filter({ visible: true }).last();
  }

  private async readOpenMenu() {
    const items = this.page.locator('.dropdown-menu.show .dropdown-item, .dropdown-menu.show a, .dropdown-menu.show li')
      .or(this.page.getByText(/^(Approve|Reject|Process|Ready for Onboard)$/).filter({ visible: true }));
    const count = await items.count();
    const actions: string[] = [];
    for (let index = 0; index < count; index++) {
      const label = ((await items.nth(index).innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      if (label && !actions.includes(label)) {
        actions.push(label);
      }
    }
    return actions;
  }

  private async closeMenus() {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.locator('.dropdown-menu.show').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }

  private async openKebab(row: Locator, options?: { optional?: boolean }) {
    await this.closeMenus();
    const kebab = row.locator('td:last-child .dropdown, td .dropdown').last();
    await kebab.scrollIntoViewIfNeeded();
    await kebab.waitFor({ state: 'visible', timeout: 10000 });

    for (let attempt = 0; attempt < 3; attempt++) {
      await kebab.click({ force: attempt > 0 });
      const menu = this.page.locator('.dropdown-menu.show');
      const visibleAction = this.page.getByText(/^(Approve|Reject|Process|Ready for Onboard)$/).filter({ visible: true });
      if (await menu.isVisible({ timeout: 2500 }).catch(() => false)
        || await visibleAction.first().isVisible({ timeout: 2500 }).catch(() => false)) {
        return true;
      }
      await this.closeMenus();
      await this.page.waitForTimeout(400);
    }

    if (options?.optional) {
      return false;
    }
    throw new Error('Could not open onboard action kebab');
  }
}
