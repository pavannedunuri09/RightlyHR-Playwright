import { expect, type Locator, type Page } from '@playwright/test';

type OnboardTrainee = {
  firstName: string;
  lastName: string;
  employeeId?: string;
  email?: string;
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
    if (await this.isOnboardTraineesQueue()) {
      return;
    }

    await this.page.bringToFront();
    await this.ensureHrShell();

    const directUrls = [
      '/pending-approvals/on-boarding/trainees/for-you',
      '/pending-approvals/on-boarding/trainees/for-your-role',
      '/pending-approvals/on-boarding/trainees',
      '/pending-approvals/on-boarding/trainee-onboard-requests/for-you',
      '/pending-approvals/on-boarding/trainee-onboard-requests',
      '/pending-approvals/on-boarding/trainee-onboarding-requests',
      '/pending-approvals/on-boarding',
    ];
    for (const path of directUrls) {
      await this.page.goto(path, { waitUntil: 'domcontentloaded' }).catch(() => {});
      await this.page.waitForTimeout(1500);
      if (await this.isOnboardTraineesQueue()) {
        console.log(`Opened Pending Approvals > Onboarding > Trainees (${path})`);
        return;
      }
      if (/pending-approvals/i.test(this.page.url()) && !/trainee-approvals/i.test(this.page.url())) {
        await this.openOnboardingTraineesFromGrid();
        if (await this.isOnboardTraineesQueue()) {
          console.log(`Opened Pending Approvals > Onboarding > Trainees via grid (${path})`);
          return;
        }
      }
    }

    if (!await this.pendingApprovalsToggle.isVisible().catch(() => false)) {
      await this.ensureHrShell();
    }

    await this.pendingApprovalsToggle.waitFor({ state: 'visible', timeout: 30000 });
    await this.page.waitForTimeout(2000);
    await this.pendingApprovalsToggle.click();

    const onboarding = this.page.getByText(/^Onboarding\s*\(\d+\)/i).first()
      .or(this.page.locator('app-pending-approvals-tabs .grid-item, .grid-item').filter({ hasText: /^Onboarding\s*\(\d+\)/i }).first())
      .or(this.page.getByText('Onboarding', { exact: true }));
    await onboarding.first().waitFor({ state: 'visible', timeout: 15000 });
    await onboarding.first().click();

    const onboardTrainees = this.page.getByText(/^Trainees\s*\(\d+\)/i).first()
      .or(this.page.locator('app-pending-approvals-tabs .grid-item, .grid-item').filter({ hasText: /^Trainees\s*\(\d+\)/i }).first());
    if (await onboardTrainees.isVisible({ timeout: 8000 }).catch(() => false)) {
      await onboardTrainees.click();
    } else {
      await this.page.getByRole('listitem').filter({
        has: this.page.getByText('Trainees', { exact: true }),
      }).first().click();
    }

    if (/trainee-approvals/i.test(this.page.url())) {
      const queueTab = this.page.getByRole('link', { name: /^Trainees\s*\(\d+\)/i })
        .or(this.page.getByRole('tab', { name: /^Trainees\s*\(\d+\)/i }));
      if (await queueTab.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await queueTab.first().click();
      }
    }

    await this.page.getByRole('columnheader', { name: /Training Start Date/i })
      .waitFor({ state: 'visible', timeout: 20000 });
    console.log('Opened Pending Approvals > Onboarding > Trainees');
  }

  private async ensureHrShell() {
    const shell = this.page.locator('#sidenav-main-drop, .profile-dropdown').first();
    if (await shell.isVisible().catch(() => false)) {
      return;
    }
    await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await shell.waitFor({ state: 'visible', timeout: 30000 });
  }

  private async openOnboardingTraineesFromGrid() {
    const onboarding = this.page.getByText(/^Onboarding\s*\(\d+\)/i).first()
      .or(this.page.locator('app-pending-approvals-tabs .grid-item, .grid-item').filter({ hasText: /^Onboarding\s*\(\d+\)/i }).first())
      .or(this.page.getByText('Onboarding', { exact: true }));
    if (!(await onboarding.first().isVisible({ timeout: 8000 }).catch(() => false))) {
      return;
    }
    await onboarding.first().click();

    const onboardTrainees = this.page.getByText(/^Trainees\s*\(\d+\)/i).first()
      .or(this.page.locator('app-pending-approvals-tabs .grid-item, .grid-item').filter({ hasText: /^Trainees\s*\(\d+\)/i }).first());
    if (await onboardTrainees.isVisible({ timeout: 8000 }).catch(() => false)) {
      await onboardTrainees.click();
    } else {
      await this.page.getByRole('listitem').filter({
        has: this.page.getByText('Trainees', { exact: true }),
      }).first().click().catch(() => {});
    }
  }

  private async isOnboardTraineesQueue() {
    if (!/pending-approvals/i.test(this.page.url()) || /trainee-approvals/i.test(this.page.url())) {
      return false;
    }
    return this.page.getByRole('columnheader', { name: /Training Start Date/i }).isVisible().catch(() => false);
  }

  async waitForRequestRow(trainee: OnboardTrainee, options?: { timeout?: number }) {
    const timeout = options?.timeout ?? 60000;
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      await this.openTraineesQueue();
      const row = await this.locateRequestRow(trainee);
      if (row) {
        return row;
      }
      await this.page.waitForTimeout(3000);
    }
    throw new Error(`No trainee onboard request found for ${trainee.firstName} ${trainee.lastName}`);
  }

  async expectRequestRowAbsent(trainee: OnboardTrainee) {
    await this.openTraineesQueue();
    const row = await this.locateRequestRow(trainee);
    expect(row).toBeNull();
    console.log(`No pending onboard request in queue for ${trainee.firstName} ${trainee.lastName}`);
  }

  requestRow(trainee: OnboardTrainee) {
    const fullName = `${trainee.firstName} ${trainee.lastName}`.trim();
    return this.page.getByRole('row').filter({ hasText: new RegExp(fullName.replace(/\s+/g, '\\s+'), 'i') }).first();
  }

  private async findMatchingRequestRow(trainee: OnboardTrainee) {
    const terms = [
      trainee.employeeId,
      trainee.email,
      trainee.email?.split('@')[0],
      `${trainee.firstName} ${trainee.lastName}`.trim(),
      trainee.lastName,
      trainee.lastName.split(/\s+/).pop(),
      trainee.firstName,
    ].filter((term): term is string => !!term && term.length >= 3);

    for (const term of terms) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rows = this.page.getByRole('row').filter({ hasText: new RegExp(escaped, 'i') });
      const count = await rows.count();
      for (let index = 0; index < count; index++) {
        const row = rows.nth(index);
        const text = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
        if (!text || /Training Start Date|Username|Showing \d+|Request Date/i.test(text)) {
          continue;
        }
        console.log(`Matched onboard queue row via "${term}": ${text}`);
        return row;
      }
    }

    return null;
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
      const row = await this.locateRequestRow(trainee);
      if (!row) {
        break;
      }
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
      const row = await this.locateRequestRow(trainee);
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
    await this.expectRejectOptions('Discontinue');
    await this.fillRejectFeedback(comments ?? 'Discontinuing the trainee onboard request.', 'Discontinue');
    await this.confirmReject();
    const toast = this.page.getByText(/rejected|discontinue/i);
    await expect(toast.first()).toBeVisible({ timeout: 20000 });
    const text = (await toast.first().innerText()).trim();
    console.log(`Onboard discontinue: ${text}`);
    return text;
  }

  async rejectExtend(row: Locator, extendDate: string, comments: string) {
    await this.openReject(row);
    await this.expectRejectOptions('Extend');
    const dateInput = this.page.getByRole('textbox', { name: /Default select example|extend/i })
      .or(this.page.getByPlaceholder(/date/i));
    await dateInput.first().fill(extendDate);
    await this.fillRejectFeedback(comments, 'Extend');
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

  async expectKebabActions(row: Locator, expected: string[], options?: { only?: boolean }) {
    const opened = await this.openKebab(row);
    if (!opened) {
      throw new Error('Could not open onboard action kebab to inspect menu actions');
    }
    const actions = await this.readOpenMenu();
    await this.closeMenus();
    console.log(`Onboard kebab actions: ${actions.join(', ') || '(none)'}`);
    for (const name of expected) {
      expect(actions.map((action) => action.toLowerCase())).toContain(name.toLowerCase());
    }
    if (options?.only) {
      expect(actions).toHaveLength(expected.length);
    }
    return actions;
  }

  async expectRejectOptions(action: 'Extend' | 'Discontinue') {
    await expect(this.page.getByText('Extend', { exact: true }).first()).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText('Discontinue', { exact: true }).first()).toBeVisible({ timeout: 10000 });
    await this.chooseRejectAction(action);
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

  private async locateRequestRow(trainee: OnboardTrainee) {
    let row = await this.findRequestRowInCurrentView(trainee);
    if (row) {
      return row;
    }

    for (const tab of [this.forYouTab, this.forYourRoleTab]) {
      if (!(await tab.isVisible().catch(() => false))) {
        continue;
      }
      await tab.click();
      await this.page.waitForTimeout(1000);
      row = await this.findRequestRowInCurrentView(trainee);
      if (row) {
        return row;
      }
    }

    return null;
  }

  private async findRequestRowInCurrentView(trainee: OnboardTrainee) {
    let row = await this.findMatchingRequestRow(trainee);
    if (row) {
      return row;
    }

    row = this.requestRow(trainee);
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
      row = await this.findMatchingRequestRow(trainee) ?? this.requestRow(trainee);
      if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
        return row;
      }

      if (trainee.employeeId) {
        await this.searchbox.fill(trainee.employeeId);
        await this.searchbox.press('Enter');
        await this.page.waitForTimeout(1500);
        row = await this.findMatchingRequestRow(trainee) ?? this.requestRow(trainee);
        if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
          return row;
        }
      }

      if (trainee.email) {
        await this.searchbox.fill(trainee.email);
        await this.searchbox.press('Enter');
        await this.page.waitForTimeout(1500);
        row = await this.findMatchingRequestRow(trainee) ?? this.requestRow(trainee);
        if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
          return row;
        }

        const emailLocal = trainee.email.split('@')[0]?.replace(/\d+$/, '') ?? '';
        if (emailLocal) {
          await this.searchbox.fill(emailLocal);
          await this.searchbox.press('Enter');
          await this.page.waitForTimeout(1500);
          row = await this.findMatchingRequestRow(trainee) ?? this.requestRow(trainee);
          if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
            return row;
          }
        }
      }

      const lastPart = trainee.lastName.split(/\s+/).pop();
      if (lastPart && lastPart.length >= 3) {
        await this.searchbox.fill(lastPart);
        await this.searchbox.press('Enter');
        await this.page.waitForTimeout(1500);
        row = await this.findMatchingRequestRow(trainee) ?? this.requestRow(trainee);
        if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
          return row;
        }
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

  private async fillRejectFeedback(comments: string, action?: 'Extend' | 'Discontinue') {
    const dialog = this.page.getByRole('dialog').or(this.page.locator('ngb-modal-window.show, .modal.show'));
    const candidates = [
      action === 'Discontinue'
        ? dialog.getByRole('textbox', { name: /Feedback for Discontinue/i })
        : null,
      action === 'Extend'
        ? dialog.getByRole('textbox', { name: /Feedback for Extend/i })
        : null,
      dialog.getByRole('textbox').last(),
      this.page.getByRole('textbox', { name: /feedback|reason|comment/i }).first(),
    ].filter((locator): locator is Locator => !!locator);

    for (const feedback of candidates) {
      if (!(await feedback.isVisible({ timeout: 5000 }).catch(() => false))) {
        continue;
      }
      await feedback.fill(comments);
      await feedback.blur();
      console.log(`Filled reject feedback using ${action ?? 'generic'} field`);
      return;
    }

    throw new Error(`Reject feedback field was not found for ${action ?? 'reject'} action`);
  }

  private async confirmReject() {
    const reject = this.page.getByRole('dialog').getByRole('button', { name: 'Reject', exact: true })
      .or(this.page.locator('ngb-modal-window.show, .modal.show').getByRole('button', { name: 'Reject', exact: true }));
    await expect(reject.first()).toBeEnabled({ timeout: 15000 });
    await reject.first().click();
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
