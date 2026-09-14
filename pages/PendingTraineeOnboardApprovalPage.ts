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
  private readonly traineesQueueUrls = [
    '/pending-approvals/on-boarding/trainees/for-you',
    '/pending-approvals/on-boarding/trainees/for-your-role',
    '/pending-approvals/on-boarding/trainees',
  ];

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
      await this.waitForQueueReady().catch(() => {});
      return;
    }

    await this.page.bringToFront();
    await this.ensureHrShell();

    for (const path of this.traineesQueueUrls) {
      await this.page.goto(path, { waitUntil: 'domcontentloaded' }).catch(() => {});
      if (await this.isOnboardTraineesQueue()) {
        await this.waitForQueueReady();
        console.log(`Opened Pending Approvals > Onboarding > Trainees (${path})`);
        return;
      }
    }

    await this.openTraineesQueueViaMenu();
    await this.waitForQueueReady();
    console.log('Opened Pending Approvals > Onboarding > Trainees');
  }

  private async openTraineesQueueViaMenu() {
    if (!await this.pendingApprovalsToggle.isVisible().catch(() => false)) {
      await this.ensureHrShell();
    }

    await this.pendingApprovalsToggle.waitFor({ state: 'visible', timeout: 30000 });
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
  }

  private queueHeader() {
    return this.page.getByRole('columnheader', { name: /Training Start Date/i });
  }

  private async waitForQueueReady(timeout = 20000) {
    await this.queueHeader().waitFor({ state: 'visible', timeout });
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
    return this.queueHeader().isVisible().catch(() => false);
  }

  async waitForRequestRow(trainee: OnboardTrainee, options?: { timeout?: number }) {
    const timeout = options?.timeout ?? 60000;
    const deadline = Date.now() + timeout;
    let onQueue = false;

    while (Date.now() < deadline) {
      if (!onQueue || !(await this.isOnboardTraineesQueue())) {
        await this.openTraineesQueue();
        onQueue = true;
      }

      const row = await this.locateRequestRow(trainee);
      if (row) {
        return row;
      }

      if (onQueue) {
        await this.queueHeader().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      }
      await this.page.waitForTimeout(1000);
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

  async approveThroughAllLevels(trainee: OnboardTrainee) {
    await this.page.bringToFront();
    await this.waitForRequestRow(trainee, { timeout: 120000 });
    await this.approveUntilDone(trainee);
    await this.processAsHr(trainee);
    console.log('Onboard request approved through all levels');
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
      await this.page.waitForTimeout(300);
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
    await this.clickKebabAction(row, 'Ready for Onboard');
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

    const dialog = this.page.getByRole('dialog').or(this.page.locator('ngb-modal-window.show, .modal.show'));
    const dateInput = dialog.getByRole('textbox', { name: /Default select example/i });
    await this.fillExtendDate(dateInput, extendDate);
    await this.page.waitForTimeout(500);

    await this.fillRejectFeedback(comments, 'Extend');
    await expect
      .poll(async () => {
        const reject = this.page.getByRole('dialog').getByRole('button', { name: 'Reject', exact: true })
          .or(this.page.locator('ngb-modal-window.show, .modal.show').getByRole('button', { name: 'Reject', exact: true }));
        return reject.first().isEnabled().catch(() => false);
      }, { timeout: 15000 })
      .toBe(true);
    await this.confirmReject();
    const toast = this.page.getByText(/Trainee request extend|extended/i);
    await expect(toast.first()).toBeVisible({ timeout: 20000 });
    const text = (await toast.first().innerText()).trim();
    console.log(`Onboard extend: ${text}`);
    return text;
  }

  async advanceToHrAfterManagerApproval(trainee: OnboardTrainee) {
    await this.page.bringToFront();
    let row = await this.waitForRequestRow(trainee, { timeout: 120000 });
    if (await this.kebabHas(row, 'Approve')) {
      await this.approveUntilDone(trainee);
      row = await this.waitForRequestRow(trainee, { timeout: 120000 });
    }
    await this.expectKebabActions(row, ['Process', 'Reject']);
    console.log('Onboard request reached HR (L1+L2 treated as one approval when same approver)');
    return row;
  }

  async rejectExtendAtManagerLevel(trainee: OnboardTrainee, extendDate: string, comments: string) {
    await this.page.bringToFront();
    const row = await this.waitForRequestRow(trainee, { timeout: 120000 });
    await this.rejectExtend(row, extendDate, comments);
    console.log('Extended at manager approval level (L1+L2 combined when same approver)');
  }

  async rejectExtendAtHrLevel(trainee: OnboardTrainee, extendDate: string, comments: string) {
    await this.page.bringToFront();
    const row = await this.waitForRequestRow(trainee, { timeout: 120000 });
    console.log('Final approver (HR) kebab shows Process and Reject; selecting Reject > Extend');
    await this.rejectExtend(row, extendDate, comments);
    console.log('Extended at HR approval level (L3)');
  }

  async approveFirstLevelThenRejectExtend(trainee: OnboardTrainee, extendDate: string, comments: string) {
    await this.page.bringToFront();

    let row = await this.waitForRequestRow(trainee, { timeout: 120000 });
    if (await this.clickKebabAction(row, 'Approve', { optional: true })) {
      await this.confirmApproveDialog();
      console.log('First approval level: request approved');
      row = await this.waitForRequestRow(trainee, { timeout: 120000 });
    } else {
      console.log('First approval level already complete; continuing to second level');
    }

    await this.rejectExtend(row, extendDate, comments);
    console.log('Second approval level: request rejected with Extend');
  }

  async kebabHas(row: Locator, name: string) {
    const opened = await this.openKebab(row, { optional: true });
    if (!opened) {
      return false;
    }
    const actions = await this.readOpenMenu(row);
    await this.closeMenus();
    console.log(`Onboard kebab actions: ${actions.join(', ') || '(none)'}`);
    return actions.map((action) => action.toLowerCase()).includes(name.toLowerCase());
  }

  async expectKebabActions(row: Locator, expected: string[], options?: { only?: boolean }) {
    const opened = await this.openKebab(row);
    if (!opened) {
      throw new Error('Could not open onboard action kebab to inspect menu actions');
    }
    const actions = await this.readOpenMenu(row);
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

    const actions = await this.readOpenMenu(row);
    console.log(`Onboard kebab actions: ${actions.join(', ') || '(none)'}`);

    if (options?.inspectOnly) {
      const hasAction = actions.map((action) => action.toLowerCase()).includes(name.toLowerCase());
      await this.closeMenus();
      return hasAction;
    }

    const clicked = await this.clickMenuItem(row, name);
    if (!clicked) {
      await this.closeMenus();
      if (!options?.optional) {
        throw new Error(`Kebab action "${name}" was not visible. Saw: ${actions.join(', ') || '(none)'}`);
      }
      return false;
    }

    return true;
  }

  private rowDropdown(row: Locator) {
    return row.locator('td').last().locator('.dropdown').last();
  }

  private rowMenu(row: Locator) {
    return this.rowDropdown(row).locator('.dropdown-menu');
  }

  private async clickMenuItem(row: Locator, name: string) {
    const menu = this.rowMenu(row);
    if (!(await menu.isVisible().catch(() => false))) {
      return false;
    }
    const item = menu.locator('.dropdown-item, a, button').filter({ hasText: new RegExp(`^${name}$`, 'i') }).first();
    if (await item.isVisible({ timeout: 1000 }).catch(() => false)) {
      await item.click();
      return true;
    }
    const items = menu.locator('.dropdown-item, a, li, button');
    const count = await items.count();
    for (let index = 0; index < count; index++) {
      const candidate = items.nth(index);
      const label = ((await candidate.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      if (label.toLowerCase() === name.toLowerCase()) {
        await candidate.click();
        return true;
      }
    }
    return false;
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

  private async fillExtendDate(input: Locator, extendDate: string) {
    await input.click();
    const inputType = (await input.getAttribute('type')) ?? 'text';
    if (inputType === 'date') {
      const min = await input.getAttribute('min');
      let isoDate = extendDate;
      if (min && isoDate <= min) {
        const adjusted = new Date(min);
        adjusted.setMonth(adjusted.getMonth() + 2);
        isoDate = [
          adjusted.getFullYear(),
          String(adjusted.getMonth() + 1).padStart(2, '0'),
          String(adjusted.getDate()).padStart(2, '0'),
        ].join('-');
        console.log(`Adjusted extend date to ${isoDate} (picker min was ${min})`);
      }
      await input.fill(isoDate);
    } else {
      const [year, month, day] = extendDate.split('-');
      await input.fill(`${month}/${day}/${year}`);
    }
    await input.blur();
  }

  private async openReject(row: Locator) {
    await this.clickKebabAction(row, 'Reject');
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

  private async readOpenMenu(row: Locator) {
    const menu = this.rowMenu(row);
    if (!(await menu.isVisible().catch(() => false))) {
      return [];
    }
    const items = menu.locator('.dropdown-item, a, li, button');
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
    if (!(await this.page.locator('.dropdown-menu.show').isVisible().catch(() => false))) {
      return;
    }
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.locator('.dropdown-menu.show').waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
  }

  private async dismissBlockingDialogs() {
    const dialog = this.page.getByRole('dialog').filter({ hasText: /Are you sure you want to/i });
    if (!(await dialog.first().isVisible().catch(() => false))) {
      return;
    }
    const close = dialog.getByRole('button', { name: /Close|Cancel/i });
    if (await close.first().isVisible().catch(() => false)) {
      await close.first().click();
      await dialog.first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    } else {
      await this.page.keyboard.press('Escape').catch(() => {});
    }
  }

  private async openKebab(row: Locator, options?: { optional?: boolean }) {
    await this.dismissBlockingDialogs();

    const menu = this.rowMenu(row);
    if (await menu.isVisible().catch(() => false)) {
      return true;
    }

    await this.closeMenus();
    const actionCell = row.locator('td').last();
    await actionCell.scrollIntoViewIfNeeded();
    const dropdown = this.rowDropdown(row);
    await dropdown.waitFor({ state: 'visible', timeout: 10000 });

    for (let attempt = 0; attempt < 2; attempt++) {
      const toggle = dropdown.locator(':scope > span, :scope > a').first();
      if (await toggle.isVisible().catch(() => false)) {
        await toggle.click({ force: attempt > 0 });
      } else {
        await dropdown.click({ force: attempt > 0 });
      }
      if (await menu.isVisible({ timeout: 800 }).catch(() => false)) {
        return true;
      }
      await this.closeMenus();
    }

    if (options?.optional) {
      return false;
    }
    throw new Error('Could not open onboard action kebab');
  }
}
