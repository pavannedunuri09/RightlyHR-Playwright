import { expect, type Locator, type Page } from '@playwright/test';

export class WorkFromHomePage {
  readonly page: Page;
  readonly timeOffNav: Locator;
  readonly timeOffToggle: Locator;
  readonly timeOffWfhTab: Locator;
  readonly timeOffRemoteLoginTab: Locator;
  readonly wfhNav: Locator;
  readonly requestWfhButton: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly halfDayRadio: Locator;
  readonly fullDayRadio: Locator;
  readonly firstHalfRadio: Locator;
  readonly secondHalfRadio: Locator;
  readonly reasonInput: Locator;
  readonly requestButton: Locator;
  readonly waitingForApprovalTab: Locator;
  readonly rejectedTab: Locator;
  readonly approvedTab: Locator;
  readonly processedTab: Locator;
  readonly cancelledTab: Locator;
  readonly pendingApprovalsNav: Locator;
  readonly pendingApprovalsToggle: Locator;
  readonly pendingTimeOffTab: Locator;
  readonly wfhPendingTab: Locator;
  readonly forYouTab: Locator;
  readonly forYourRoleTab: Locator;
  readonly rejectAction: Locator;
  readonly rejectConfirmButton: Locator;
  readonly rejectedToast: Locator;
  readonly approveButton: Locator;
  readonly processButton: Locator;
  readonly approvedOption: Locator;
  readonly processedOption: Locator;
  readonly approveConfirmButton: Locator;
  readonly bulkRejectButton: Locator;
  readonly successRecordsHeader: Locator;
  readonly duplicateRequestMessage: Locator;
  readonly weekendRequestMessage: Locator;
  readonly sessionConflictMessage: Locator;
  readonly invalidDateRangeMessage: Locator;
  readonly cancelRequestButton: Locator;
  readonly cancelConfirmMessage: Locator;
  readonly cancelConfirmYes: Locator;
  readonly cancelConfirmNo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timeOffNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Time Off' });
    this.timeOffToggle = this.timeOffNav.locator('[data-bs-toggle="dropdown"]');
    this.timeOffWfhTab = page.locator('app-time-off-tabs').locator('.grid-item').filter({ hasText: /^WFH$/ });
    this.timeOffRemoteLoginTab = page.locator('app-time-off-tabs').locator('.grid-item').filter({ hasText: /Remote\s?Login/i });
    this.wfhNav = this.timeOffWfhTab;
    this.requestWfhButton = page.getByRole('button', { name: 'Request WFH', exact: true });
    this.startDateInput = page.getByRole('textbox', { name: 'Start Date *' });
    this.endDateInput = page.getByRole('textbox', { name: 'End Date *' });
    this.halfDayRadio = page.getByRole('radio', { name: 'Half Day' });
    this.fullDayRadio = page.getByRole('dialog').getByRole('radio', { name: 'Full Day' });
    this.firstHalfRadio = page.getByRole('dialog').getByRole('radio', { name: /First Half/i });
    this.secondHalfRadio = page.getByRole('dialog').getByRole('radio', { name: /Second Half/i });
    this.reasonInput = page.getByRole('textbox', { name: 'Reason *' });
    this.requestButton = page.getByRole('dialog').getByRole('button', { name: 'Request', exact: true });
    this.waitingForApprovalTab = page.getByText(/Waiting For Approval \(\d+\)/).first();
    this.rejectedTab = page.getByText(/Rejected \(\d+\)/).first();
    this.approvedTab = page.getByText(/Approved \(\d+\)/).first();
    this.processedTab = page.getByText(/Processed \(\d+\)/).first();
    this.cancelledTab = page.getByText(/Cancelled \(\d+\)/).first();
    this.pendingApprovalsNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Pending Approvals' });
    this.pendingApprovalsToggle = this.pendingApprovalsNav.locator('[data-bs-toggle="dropdown"]');
    this.pendingTimeOffTab = page.locator('app-pending-approvals-tabs').locator('.grid-item').filter({ hasText: /Time-Off/ });
    this.wfhPendingTab = page.getByText(/WFH\(\d+\)/);
    this.forYouTab = page.getByRole('link', { name: /For You \(\d+\)/ });
    this.forYourRoleTab = page.getByRole('link', { name: /For Your Role \(\d+\)/ });
    this.rejectAction = page.getByText('Reject', { exact: true });
    this.rejectConfirmButton = page.getByRole('button', { name: 'Reject', exact: true });
    this.rejectedToast = page.getByText('WFH request Rejected');
    this.approveButton = page.getByRole('button', { name: 'Approve' });
    this.processButton = page.getByRole('button', { name: 'Process' });
    this.approvedOption = page.getByRole('button', { name: 'Approved' });
    this.processedOption = page.getByRole('button', { name: 'Processed' });
    this.approveConfirmButton = page.getByRole('button', { name: 'Approve', exact: true });
    this.bulkRejectButton = page.getByRole('button', { name: 'Reject', exact: true });
    this.successRecordsHeader = page.getByRole('columnheader', { name: 'Success Records' });
    this.duplicateRequestMessage = page.getByText(/already exist|already applied|already booked|duplicate/i);
    this.weekendRequestMessage = page.getByText(/weekend|weekly off|week off|not a working day|non[- ]working|off day/i);
    this.sessionConflictMessage = page.getByText(/already a half day is applied|already exist|already applied|already booked|duplicate/i);
    this.invalidDateRangeMessage = page.getByText(/end date.*(less|before|greater|after|cannot|prior)|start date.*(greater|after|cannot)|invalid date range|must be (greater|after|on or after)|cannot be (less|before|earlier)/i);
    this.cancelRequestButton = page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true });
    this.cancelConfirmMessage = page.getByText('Are you sure you want to cancel?');
    this.cancelConfirmYes = page.getByRole('dialog').getByRole('button', { name: 'Yes', exact: true });
    this.cancelConfirmNo = page.getByRole('dialog').getByRole('button', { name: 'No', exact: true });
  }

  async validateUserOnDashboard() {
    await this.page.goto('/dashboard/emp');
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible' });
  }

  async openTimeOffMenu() {
    await this.closeRequestDialogIfOpen();
    await this.timeOffToggle.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000);
    await this.timeOffToggle.click();
    await this.timeOffWfhTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openFromDashboard() {
    await this.validateUserOnDashboard();
    await this.openTimeOffMenu();
    await this.timeOffWfhTab.click();
    await this.requestWfhButton.waitFor({ state: 'visible' });
  }

  async gotoWaitingForApproval() {
    await this.closeRequestDialogIfOpen();
    await this.openTimeOffMenu();
    await this.timeOffWfhTab.click();
    await this.requestWfhButton.waitFor({ state: 'visible' });
  }

  async fillWfhRequest(startDate: string, endDate: string, reason: string) {
    await this.closeRequestDialogIfOpen();
    await this.requestWfhButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.startDateInput.fill(startDate);
    await this.startDateInput.blur();
    await this.endDateInput.fill(endDate);
    await this.endDateInput.blur();
    await this.halfDayRadio.check();
    await this.reasonInput.fill(reason);
    await this.requestButton.click();
  }

  async fillRequestForm(startDate: string, reason: string, session: 'first' | 'second' | 'full' = 'first') {
    await this.closeRequestDialogIfOpen();
    await this.requestWfhButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.startDateInput.fill(startDate);
    await this.startDateInput.blur();
    await this.endDateInput.fill(startDate);
    await this.endDateInput.blur();
    await this.selectAvailing(session);
    await this.reasonInput.fill(reason);
    return dialog;
  }

  async fillRequestFormRange(startDate: string, endDate: string, reason: string, session: 'first' | 'second' | 'full' = 'full') {
    await this.closeRequestDialogIfOpen();
    await this.requestWfhButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.selectAvailing(session);
    await this.startDateInput.fill(startDate);
    await this.startDateInput.blur();
    await this.endDateInput.fill(endDate);
    await this.endDateInput.blur();
    await this.reasonInput.fill(reason);
    return dialog;
  }

  async openFilledRequestForm() {
    const date = weekdayDate(octoberSearchRange().startAhead + 2);
    await this.requestWfhButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.startDateInput.fill(date.input);
    await this.startDateInput.blur();
    await this.endDateInput.fill(date.input);
    await this.endDateInput.blur();
    await this.halfDayRadio.check();
    await this.reasonInput.fill(`Cancel WFH ${date.input}`);
    return date;
  }

  async clickRequestFormCancel() {
    await this.cancelRequestButton.click();
    await this.cancelConfirmMessage.waitFor({ state: 'visible', timeout: 15000 });
  }

  async closeRequestDialogIfOpen() {
    const dialog = this.page.getByRole('dialog');
    for (let attempt = 0; attempt < 4; attempt++) {
      if (!(await dialog.isVisible().catch(() => false))) {
        return;
      }
      const yesButton = dialog.getByRole('button', { name: 'Yes', exact: true });
      const cancelButton = dialog.getByRole('button', { name: 'Cancel', exact: true });
      if (await yesButton.isVisible().catch(() => false)) {
        await yesButton.click();
      } else if (await cancelButton.isVisible().catch(() => false)) {
        await cancelButton.click();
        continue;
      } else {
        await this.page.keyboard.press('Escape');
      }
      await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  async requestWfh(
    startDate: string,
    endDate: string,
    reason: string,
    session: 'first' | 'second' = 'first',
  ) {
    const submitted = await this.tryRequestWfh(startDate, endDate, reason, session);
    if (!submitted) {
      throw new Error(`WFH request was not submitted for ${startDate} (${session} half)`);
    }
  }

  sessionRow(workedDateCell: string, session: string) {
    return this.page.locator('table tbody tr').filter({ hasText: workedDateCell }).filter({ hasText: session });
  }

  async selectAvailing(session: 'first' | 'second' | 'full' = 'first') {
    if (session === 'full') {
      await this.fullDayRadio.check();
      return;
    }
    await this.selectHalfDaySession(session);
  }

  async selectHalfDaySession(session: 'first' | 'second' = 'first') {
    await this.halfDayRadio.check();
    const radio = session === 'second' ? this.secondHalfRadio : this.firstHalfRadio;
    await radio.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await radio.isVisible().catch(() => false)) {
      await radio.check();
      return;
    }
    if (session !== 'second') {
      return;
    }
    const dialog = this.page.getByRole('dialog');
    const option = dialog.getByRole('option', { name: /Second Half/i });
    const combo = dialog.getByRole('combobox').filter({ hasText: /First Half|Second Half|Session|Half/i }).first();
    if (await combo.isVisible().catch(() => false)) {
      await combo.click();
      await this.page.getByRole('option', { name: /Second Half/i }).click();
      return;
    }
    const trigger = dialog.getByRole('button', { name: 'dropdown trigger' }).last();
    if (await trigger.isVisible().catch(() => false)) {
      await trigger.click();
      await this.page.getByRole('option', { name: /Second Half/i }).click();
      return;
    }
    if (await option.isVisible().catch(() => false)) {
      await option.click();
      return;
    }
    throw new Error('Could not select Second Half on the Request WFH form');
  }

  async tryRequestWfh(
    startDate: string,
    endDate = startDate,
    reason = `Request WFH ${startDate}`,
    session: 'first' | 'second' = 'first',
  ) {
    await this.closeRequestDialogIfOpen();
    if (!(await this.requestWfhButton.isVisible().catch(() => false))) {
      await this.gotoWaitingForApproval();
    }
    await this.requestWfhButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.startDateInput.fill(startDate);
    await this.startDateInput.blur();
    await this.endDateInput.fill(endDate);
    await this.endDateInput.blur();
    await this.selectHalfDaySession(session);
    await this.reasonInput.fill(reason);

    if (!(await this.waitForRequestSubmitEnabled(2000))) {
      await this.closeRequestDialogIfOpen();
      return false;
    }

    await this.requestButton.click();
    try {
      await dialog.waitFor({ state: 'hidden', timeout: 12000 });
      return true;
    } catch {
      await this.closeRequestDialogIfOpen();
      return false;
    }
  }

  async waitForRequestSubmitEnabled(timeoutMs = 2000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const enabled = await this.requestButton.isEnabled().catch(() => false);
      const className = (await this.requestButton.getAttribute('class').catch(() => '')) || '';
      if (enabled && !className.includes('p-disabled')) {
        return true;
      }
      await this.page.waitForTimeout(250);
    }
    return false;
  }

  async requestAvailableWfh(startAhead?: number) {
    const dates = await this.requestAvailableWfhDates(1, startAhead);
    return dates[0];
  }

  async requestAvailableWfhDates(count: number, startAhead?: number) {
    const created: ReturnType<typeof weekdayDate>[] = [];
    const tried = new Set<string>();

    const tryCandidates = async (candidates: ReturnType<typeof weekdayDate>[]) => {
      for (const date of candidates) {
        if (tried.has(date.input)) {
          continue;
        }
        tried.add(date.input);
        if (await this.tryRequestWfh(date.input)) {
          created.push(date);
        }
        if (created.length === count) {
          return;
        }
      }
    };

    let unused: ReturnType<typeof weekdayDate>[] = [];
    try {
      unused = await this.findAvailableWeekdays(MAX_WFH_ADVANCE_DAYS, startAhead);
    } catch {
      unused = [];
    }
    await tryCandidates(unused);
    if (created.length === count) {
      return created;
    }

    await tryCandidates(await this.reusableRejectedWeekdays());
    if (created.length === count) {
      return created;
    }

    throw new Error(`Could only submit ${created.length} of ${count} WFH requests`);
  }

  async requestWfhDates(dates: { input: string }[]) {
    for (const date of dates) {
      await this.requestWfh(date.input, date.input, `Request WFH ${date.input}`);
    }
  }

  async readTabCount(tab: Locator) {
    const text = (await tab.innerText()).replace(/\s+/g, ' ').trim();
    const match = text.match(/\((\d+)\)\s*$/);
    return match ? Number(match[1]) : 0;
  }

  async readWfhTabCounts() {
    return {
      waiting: await this.readTabCount(this.waitingForApprovalTab),
      approved: await this.readTabCount(this.approvedTab),
      processed: await this.readTabCount(this.processedTab),
      rejected: await this.readTabCount(this.rejectedTab),
      cancelled: await this.readTabCount(this.cancelledTab),
    };
  }

  async collectWorkedDates() {
    const dates = new Set<string>();
    const tabs = [
      this.waitingForApprovalTab,
      this.approvedTab,
      this.processedTab,
      this.rejectedTab,
      this.cancelledTab,
    ];
    for (const tab of tabs) {
      await tab.click();
      await this.page.waitForTimeout(600);
      await this.expandTablePageSize();
      for (const value of await this.collectDatesFromOpenTable()) {
        dates.add(value);
      }
    }
    await this.waitingForApprovalTab.click();
    return dates;
  }

  async expandTablePageSize() {
    const dropdown = this.page.locator('.p-paginator .p-dropdown').first();
    if (!(await dropdown.isVisible().catch(() => false))) {
      return;
    }
    const current = ((await dropdown.innerText().catch(() => '')) || '').trim();
    if (/\b(50|100)\b/.test(current)) {
      return;
    }
    await dropdown.click();
    const option = this.page.getByRole('option').filter({ hasText: /^(50|100)$/ }).last();
    if (await option.isVisible().catch(() => false)) {
      await option.click();
      await this.page.waitForTimeout(500);
    } else {
      await this.page.keyboard.press('Escape');
    }
  }

  async collectDatesFromOpenTable() {
    const dates = new Set<string>();
    const next = this.page.locator('.p-paginator-next').last();
    const first = this.page.locator('.p-paginator-first').last();
    if (await first.isVisible().catch(() => false)) {
      const firstClass = (await first.getAttribute('class')) || '';
      if (!firstClass.includes('p-disabled') && !(await first.isDisabled().catch(() => false))) {
        await first.click();
        await this.page.waitForTimeout(400);
      }
    }
    for (let pageIndex = 0; pageIndex < 25; pageIndex++) {
      const cells = await this.page.locator('table tbody tr td:nth-child(1)').allTextContents();
      for (const cell of cells) {
        const value = cell.replace(/\s+/g, ' ').trim();
        if (value && value !== '-') {
          dates.add(value);
        }
      }
      if (!(await next.isVisible().catch(() => false))) {
        break;
      }
      const className = (await next.getAttribute('class')) || '';
      if (className.includes('p-disabled') || (await next.isDisabled().catch(() => false))) {
        break;
      }
      await next.click();
      await this.page.waitForTimeout(500);
    }
    return dates;
  }

  async firstWaitingWorkedDate() {
    await this.waitingForApprovalTab.click();
    const firstCell = this.page.locator('table tbody tr td:nth-child(1)').first();
    if (await firstCell.count() === 0) {
      return null;
    }
    const text = (await firstCell.textContent())?.trim();
    return text || null;
  }

  async findAvailableWeekday(startAhead?: number) {
    const found = await this.findAvailableWeekdays(1, startAhead);
    return found[0];
  }

  async findAvailableWeekdays(count: number, startAhead?: number) {
    const bookedInputs = bookedDateInputs(await this.collectWorkedDates());
    const found: ReturnType<typeof weekdayDate>[] = [];
    const seen = new Set<string>();
    const currentYear = new Date().getFullYear();
    const { startAhead: octoberStart, endAhead: octoberEnd } = octoberSearchRange();
    const start = startAhead ?? octoberStart;

    const consider = (ahead: number) => {
      if (found.length >= count) {
        return;
      }
      const candidate = weekdayDate(ahead);
      const daysOut = daysFromToday(candidate.input);
      const candidateYear = Number(candidate.input.slice(0, 4));
      if (candidateYear !== currentYear || daysOut < 1 || daysOut > MAX_WFH_ADVANCE_DAYS) {
        return;
      }
      if (seen.has(candidate.input) || bookedInputs.has(candidate.input)) {
        return;
      }
      seen.add(candidate.input);
      found.push(candidate);
    };

    for (let ahead = start; ahead <= octoberEnd; ahead++) {
      const candidate = weekdayDate(ahead);
      if (Number(candidate.input.slice(5, 7)) !== 10) {
        continue;
      }
      consider(ahead);
    }
    for (let ahead = 1; found.length < count && ahead <= MAX_WFH_ADVANCE_DAYS; ahead++) {
      if (ahead >= start && ahead <= octoberEnd) {
        continue;
      }
      consider(ahead);
    }
    if (found.length === 0) {
      throw new Error(`Could not find any available WFH weekdays within ${MAX_WFH_ADVANCE_DAYS} days`);
    }
    return found;
  }

  async reusableRejectedWeekdays() {
    await this.rejectedTab.click();
    await this.page.waitForTimeout(600);
    await this.expandTablePageSize();
    const cells = await this.collectDatesFromOpenTable();
    await this.waitingForApprovalTab.click();
    const candidates: ReturnType<typeof weekdayDate>[] = [];
    const seen = new Set<string>();
    for (const cell of cells) {
      const input = workedDateToInput(cell);
      if (!input || seen.has(input)) {
        continue;
      }
      const daysOut = daysFromToday(input);
      if (daysOut < 1 || daysOut > MAX_WFH_ADVANCE_DAYS) {
        continue;
      }
      seen.add(input);
      candidates.push(datePartsFromInput(input));
    }
    candidates.sort((left, right) => {
      const leftOctober = left.input.slice(5, 7) === '10' ? 0 : 1;
      const rightOctober = right.input.slice(5, 7) === '10' ? 0 : 1;
      return leftOctober - rightOctober || left.input.localeCompare(right.input);
    });
    return candidates;
  }

  async openPendingWfhApprovals() {
    await this.pendingApprovalsToggle.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000);
    await this.pendingApprovalsToggle.click();
    await this.pendingTimeOffTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.pendingTimeOffTab.click();
    await this.wfhPendingTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.wfhPendingTab.click();
    await this.page.waitForURL(/\/pending-approvals\/time-off\/wfh/i, { timeout: 15000 });
    await this.forYouTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.forYourRoleTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async readPendingCounts() {
    await this.forYouTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.forYourRoleTab.waitFor({ state: 'visible', timeout: 15000 });
    return {
      wfh: await this.readTabCount(this.wfhPendingTab),
      forYou: await this.readTabCount(this.forYouTab),
      forYourRole: await this.readTabCount(this.forYourRoleTab),
    };
  }

  async openForYouTab() {
    await this.forYouTab.click();
    await this.page.waitForURL(/\/pending-approvals\/time-off\/wfh\/for-you/i, { timeout: 15000 }).catch(() => {});
  }

  async openForYourRoleTab() {
    await this.forYourRoleTab.click();
    await this.page.waitForURL(/\/pending-approvals\/time-off\/wfh\/for-your-role/i, { timeout: 15000 }).catch(() => {});
  }

  async closeSuccessDialog() {
    await this.successRecordsHeader.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.keyboard.press('Escape');
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(async () => {
      await this.page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden', timeout: 5000 });
    });
  }

  async waitForRequestRows(workedDates: string[]) {
    for (const workedDate of workedDates) {
      await this.requestRow(workedDate).waitFor({ state: 'visible', timeout: 15000 });
    }
  }

  async waitForRequestRowsHidden(workedDates: string[]) {
    for (const workedDate of workedDates) {
      await this.requestRow(workedDate).waitFor({ state: 'hidden', timeout: 15000 });
    }
  }

  async approveAtCurrentQueue(workedDates: string[]) {
    await this.waitForRequestRows(workedDates);
    await this.selectRequests(workedDates);
    if (await this.processButton.isVisible().catch(() => false)) {
      await this.processSelected();
    } else {
      await this.approveSelected();
    }
    await this.closeSuccessDialog();
  }

  async processAtCurrentQueue(workedDates: string[]) {
    await this.waitForRequestRows(workedDates);
    await this.selectRequests(workedDates);
    await this.processSelected();
    await this.closeSuccessDialog();
  }

  async rejectAtCurrentQueue(workedDates: string[]) {
    await this.waitForRequestRows(workedDates);
    await this.selectRequests(workedDates);
    await this.rejectSelected();
    await this.successRecordsHeader.or(this.rejectedToast).waitFor({ state: 'visible', timeout: 15000 });
    await this.page.keyboard.press('Escape');
    await this.page.getByRole('dialog').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  /**
   * When WFH Manager and TM are the same user, one For You approve sends the record to HR.
   */
  async sendToHrQueue(workedDates: string[]) {
    await this.openForYouTab();
    await this.approveAtCurrentQueue(workedDates);
    await this.openForYourRoleTab();
    await this.waitForRequestRows(workedDates);
  }

  requestRow(workedDate: string) {
    const dateLabel = workedDate.replace(/,$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: new RegExp(`^${dateLabel}(,|$)`) }),
    }).filter({ hasText: 'saii Pavan Dinesh Tejaa' });
  }

  async rejectRequest(workedDate: string) {
    const row = this.requestRow(workedDate);
    await row.locator('.dropdown > a').click();
    await row.getByText('Reject', { exact: true }).click();
    const rejectedOption = this.page.getByRole('button', { name: 'Rejected' });
    if (await rejectedOption.isVisible().catch(() => false)) {
      await rejectedOption.click();
    }
    await this.rejectConfirmButton.click();
  }

  async approveRequest(workedDate: string) {
    const row = this.requestRow(workedDate);
    await row.getByRole('checkbox').check();
    await this.approveButton.click();
    if (await this.approvedOption.isVisible().catch(() => false)) {
      await this.approvedOption.click();
    }
    await this.approveConfirmButton.click();
  }

  async selectRequests(workedDates: string[]) {
    for (const workedDate of [...new Set(workedDates)]) {
      const rows = this.requestRow(workedDate);
      const count = await rows.count();
      for (let index = 0; index < count; index++) {
        await rows.nth(index).getByRole('checkbox').check();
      }
    }
  }

  async approveSelected() {
    await this.approveButton.click();
    if (await this.approvedOption.isVisible().catch(() => false)) {
      await this.approvedOption.click();
    }
    await this.approveConfirmButton.click();
  }

  async processSelected() {
    await this.processButton.click();
    if (await this.processedOption.isVisible().catch(() => false)) {
      await this.processedOption.click();
    } else if (await this.approvedOption.isVisible().catch(() => false)) {
      await this.approvedOption.click();
    }
    const dialog = this.page.getByRole('dialog');
    const processConfirm = dialog.getByRole('button', { name: 'Process', exact: true });
    const approveConfirm = dialog.getByRole('button', { name: 'Approve', exact: true });
    if (await processConfirm.isVisible().catch(() => false)) {
      await processConfirm.click();
    } else if (await approveConfirm.isVisible().catch(() => false)) {
      await approveConfirm.click();
    }
  }

  async rejectSelected() {
    await this.bulkRejectButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    const rejectedOption = dialog.getByRole('button', { name: 'Rejected' });
    if (await rejectedOption.isVisible().catch(() => false)) {
      await rejectedOption.click();
    }
    await dialog.getByRole('button', { name: 'Reject', exact: true }).click();
  }

  wfhStatusTabs() {
    return [
      { name: 'Waiting For Approval', tab: this.waitingForApprovalTab },
      { name: 'Approved', tab: this.approvedTab },
      { name: 'Processed', tab: this.processedTab },
      { name: 'Rejected', tab: this.rejectedTab },
      { name: 'Cancelled', tab: this.cancelledTab },
    ];
  }

  async sortableColumns() {
    const headers = this.page.locator('table thead th');
    const columns: { name: string; header: Locator; index: number }[] = [];
    const count = await headers.count();
    for (let index = 0; index < count; index++) {
      const header = headers.nth(index);
      const cls = (await header.getAttribute('class')) || '';
      if (!cls.includes('p-datatable-sortable-column')) {
        continue;
      }
      const name = ((await header.innerText()) || '').replace(/\s+/g, ' ').trim();
      columns.push({ name, header, index });
    }
    return columns;
  }

  dataRows() {
    return this.page.locator('table tbody tr').filter({
      hasNot: this.page.locator('.p-datatable-emptymessage'),
    });
  }

  async readColumnValues(columnIndex: number) {
    const rows = this.dataRows();
    const count = await rows.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      const cellCount = await cells.count();
      if (cellCount <= columnIndex) {
        continue;
      }
      const text = ((await cells.nth(columnIndex).innerText()) || '').replace(/\s+/g, ' ').trim();
      const firstCell = ((await cells.first().innerText()) || '').trim();
      if (!firstCell && !text) {
        continue;
      }
      values.push(text);
    }
    return values;
  }

  async readTableSnapshot() {
    const rows = this.dataRows();
    const count = await rows.count();
    const snapshot: string[] = [];
    for (let i = 0; i < count; i++) {
      const cells = await rows.nth(i).locator('td').allTextContents();
      const line = cells.map((cell) => cell.replace(/\s+/g, ' ').trim()).join('|');
      if (line.replace(/\|/g, '').trim()) {
        snapshot.push(line);
      }
    }
    return snapshot;
  }

  async assertSortableColumnsCycle(tabName: string) {
    const columns = await this.sortableColumns();
    expect(columns.length, `${tabName} should have sortable columns`).toBeGreaterThan(0);

    for (const column of columns) {
      const defaultOrder = await this.readTableSnapshot();
      const defaultValues = await this.readColumnValues(column.index);

      await column.header.click();
      await expect(column.header, `${tabName} > ${column.name} click 1`).toHaveAttribute('aria-sort', 'ascending');
      if (defaultValues.length >= 2) {
        await expect.poll(
          async () => isColumnSorted(await this.readColumnValues(column.index), 'asc'),
          { timeout: 15000 },
        ).toBe(true);
      }

      await column.header.click();
      await expect(column.header, `${tabName} > ${column.name} click 2`).toHaveAttribute('aria-sort', 'descending');
      if (defaultValues.length >= 2) {
        await expect.poll(
          async () => isColumnSorted(await this.readColumnValues(column.index), 'desc'),
          { timeout: 15000 },
        ).toBe(true);
      }

      await column.header.click();
      await expect(column.header, `${tabName} > ${column.name} click 3`).toHaveAttribute('aria-sort', 'none');
      if (defaultOrder.length >= 2) {
        await expect.poll(async () => this.readTableSnapshot(), { timeout: 15000 }).toEqual(defaultOrder);
      }
    }
  }
}

const MAX_WFH_ADVANCE_DAYS = 100;

export function daysFromToday(input: string) {
  const [year, month, day] = input.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - now.getTime()) / 86400000);
}

export function octoberSearchRange() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const year = now.getFullYear();
  const octStart = new Date(year, 9, 1);
  const octEnd = new Date(year, 9, 31);
  const daysUntil = (date: Date) => Math.ceil((date.getTime() - now.getTime()) / 86400000);

  let startAhead = daysUntil(octStart);
  let endAhead = daysUntil(octEnd);
  if (endAhead < 1 || startAhead > MAX_WFH_ADVANCE_DAYS) {
    return { startAhead: 1, endAhead: MAX_WFH_ADVANCE_DAYS };
  }
  startAhead = Math.max(1, startAhead);
  endAhead = Math.min(MAX_WFH_ADVANCE_DAYS, Math.max(startAhead, endAhead));
  return { startAhead, endAhead };
}

export function weekdayDate(daysAhead = 42) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return datePartsFromInput([
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-'));
}

export function upcomingWeekendDate(jsDay: 0 | 6) {
  const currentYear = new Date().getFullYear();
  const { startAhead: octoberStart, endAhead: octoberEnd } = octoberSearchRange();
  const consider = (ahead: number) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + ahead);
    if (date.getDay() !== jsDay) {
      return null;
    }
    const input = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
    const daysOut = daysFromToday(input);
    if (date.getFullYear() !== currentYear || daysOut < 1 || daysOut > MAX_WFH_ADVANCE_DAYS) {
      return null;
    }
    return datePartsFromInput(input);
  };

  for (let ahead = octoberStart; ahead <= octoberEnd; ahead++) {
    const found = consider(ahead);
    if (found && Number(found.input.slice(5, 7)) === 10) {
      return found;
    }
  }
  for (let ahead = 1; ahead <= MAX_WFH_ADVANCE_DAYS; ahead++) {
    const found = consider(ahead);
    if (found) {
      return found;
    }
  }
  throw new Error(`Could not find a weekend day (${jsDay === 6 ? 'Saturday' : 'Sunday'}) within ${MAX_WFH_ADVANCE_DAYS} days`);
}

export function datePartsFromInput(input: string) {
  const [year, month, day] = input.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const cell = `${date.toLocaleString('en-US', { month: 'short', day: 'numeric' })},`;
  const full = `${date.toLocaleString('en-US', { month: 'short', day: 'numeric' })}, ${date.getFullYear()}`;
  return { input, cell, full };
}

export function nextWeekdayDate(daysAhead = 42) {
  return weekdayDate(daysAhead);
}

function parseSortValue(text: string) {
  const value = text.replace(/\s+/g, ' ').trim();
  if (!value || value === '-') {
    return '';
  }
  const timestamp = Date.parse(value);
  if (!Number.isNaN(timestamp) && /\d{4}/.test(value)) {
    return timestamp;
  }
  return value.toLowerCase();
}

function compareSortValues(left: string, right: string) {
  const a = parseSortValue(left);
  const b = parseSortValue(right);
  if (a === '' && b === '') {
    return 0;
  }
  if (a === '') {
    return 1;
  }
  if (b === '') {
    return -1;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function isColumnSorted(values: string[], direction: 'asc' | 'desc') {
  for (let i = 1; i < values.length; i++) {
    const cmp = compareSortValues(values[i - 1], values[i]);
    if (direction === 'asc' && cmp > 0) {
      return false;
    }
    if (direction === 'desc' && cmp < 0) {
      return false;
    }
  }
  return true;
}

export function workedDateToInput(workedDate: string) {
  const parsed = new Date(workedDate);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return [
    parsed.getFullYear(),
    String(parsed.getMonth() + 1).padStart(2, '0'),
    String(parsed.getDate()).padStart(2, '0'),
  ].join('-');
}

function bookedDateInputs(cells: Set<string>) {
  const inputs = new Set<string>();
  for (const cell of cells) {
    const input = workedDateToInput(cell);
    if (input) {
      inputs.add(input);
    }
  }
  return inputs;
}
