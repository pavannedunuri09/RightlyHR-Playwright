import { expect, type Locator, type Page } from '@playwright/test';
import {
  datePartsFromInput,
  daysFromToday,
  weekdayDate,
  workedDateToInput,
} from './WorkFromHomePage';

const MAX_ADVANCE_DAYS = 120;
const claimedRemoteLoginDates = new Set<string>();

function claimRemoteLoginDate(input: string) {
  claimedRemoteLoginDates.add(input);
}

function remoteLoginStartAhead() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const novemberFirst = new Date(now.getFullYear(), 10, 1);
  const daysUntilNovember = Math.round((novemberFirst.getTime() - now.getTime()) / 86400000);
  if (daysUntilNovember >= 1 && daysUntilNovember <= MAX_ADVANCE_DAYS) {
    return daysUntilNovember;
  }
  return 14;
}

function isRemoteLoginMonthBlocked(input: string) {
  const month = Number(input.slice(5, 7));
  return month === 9 || month === 10;
}

export class RemoteLoginPage {
  readonly page: Page;
  readonly timeOffNav: Locator;
  readonly timeOffToggle: Locator;
  readonly timeOffWfhTab: Locator;
  readonly timeOffRemoteLoginTab: Locator;
  readonly requestRemoteLoginButton: Locator;
  readonly workedDateInput: Locator;
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
  readonly pendingApprovalsNav: Locator;
  readonly pendingApprovalsToggle: Locator;
  readonly pendingTimeOffTab: Locator;
  readonly remoteLoginPendingTab: Locator;
  readonly forYouTab: Locator;
  readonly forYourRoleTab: Locator;
  readonly rejectAction: Locator;
  readonly rejectConfirmButton: Locator;
  readonly submittedToast: Locator;
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
    this.requestRemoteLoginButton = page.getByRole('button', { name: /Request Remote Login/ });
    this.workedDateInput = page.getByRole('textbox', { name: /Worked Date \*/ });
    this.halfDayRadio = page.getByRole('radio', { name: 'Half Day' });
    this.fullDayRadio = page.getByRole('dialog').getByRole('radio', { name: 'Full Day' });
    this.firstHalfRadio = page.getByRole('dialog').getByRole('radio', { name: /First Half/i });
    this.secondHalfRadio = page.getByRole('dialog').getByRole('radio', { name: /Second Half/i });
    this.reasonInput = page.getByRole('textbox', { name: /Reason\s*\*/ });
    this.requestButton = page.getByRole('dialog').getByRole('button', { name: 'Request', exact: true });
    this.waitingForApprovalTab = page.getByText(/Waiting For Approval \(\d+\)/).first();
    this.rejectedTab = page.getByText(/Rejected \(\d+\)/).first();
    this.approvedTab = page.getByText(/Approved \(\d+\)/).first();
    this.processedTab = page.getByText(/Processed \(\d+\)/).first();
    this.pendingApprovalsNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Pending Approvals' });
    this.pendingApprovalsToggle = this.pendingApprovalsNav.locator('[data-bs-toggle="dropdown"]');
    this.pendingTimeOffTab = page.locator('app-pending-approvals-tabs').locator('.grid-item').filter({ hasText: /Time-Off/ });
    this.remoteLoginPendingTab = page.getByText(/Remote Login\(\d+\)/);
    this.forYouTab = page.getByRole('link', { name: /For You \(\d+\)/ });
    this.forYourRoleTab = page.getByRole('link', { name: /For Your Role \(\d+\)/ });
    this.rejectAction = page.getByText('Reject', { exact: true });
    this.rejectConfirmButton = page.getByRole('button', { name: 'Reject', exact: true });
    this.submittedToast = page.getByText(/Remote Login request/i).filter({ hasNotText: /already|exist|duplicate/i });
    this.rejectedToast = page.getByText(/Remote Login request Rejected/i);
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
    await this.timeOffNav.waitFor({ state: 'visible' });
    await this.timeOffToggle.waitFor({ state: 'visible' });
    if (await this.timeOffRemoteLoginTab.isVisible().catch(() => false)) {
      return;
    }
    await this.page.waitForTimeout(2000);
    for (let attempt = 0; attempt < 3; attempt++) {
      await this.timeOffToggle.click();
      try {
        await this.timeOffRemoteLoginTab.waitFor({ state: 'visible', timeout: 8000 });
        return;
      } catch {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);
      }
    }
    await this.timeOffNav.click();
    await this.timeOffRemoteLoginTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openFromDashboard() {
    await this.validateUserOnDashboard();
    await this.openTimeOffMenu();
    await this.timeOffRemoteLoginTab.click();
    await this.requestRemoteLoginButton.waitFor({ state: 'visible' });
  }

  async gotoWaitingForApproval() {
    await this.closeRequestDialogIfOpen();
    await this.openTimeOffMenu();
    await this.timeOffRemoteLoginTab.click();
    await this.requestRemoteLoginButton.waitFor({ state: 'visible' });
  }

  async fillRemoteLoginRequest(workedDate: string, reason: string) {
    await this.fillRequestForm(workedDate, reason);
  }

  async fillRequestForm(workedDate: string, reason: string, session: 'first' | 'second' | 'full' = 'first') {
    await this.closeRequestDialogIfOpen();
    await this.requestRemoteLoginButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.workedDateInput.fill(workedDate);
    await this.workedDateInput.blur();
    await this.selectAvailing(session);
    await this.reasonInput.fill(reason);
    return dialog;
  }

  async openFilledRequestForm() {
    const unused = await this.findAvailableWeekdays(1);
    const date = unused[0];
    claimRemoteLoginDate(date.input);
    await this.requestRemoteLoginButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.workedDateInput.fill(date.input);
    await this.workedDateInput.blur();
    await this.halfDayRadio.check();
    await this.reasonInput.fill(`Cancel Remote Login ${date.input}`);
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

  async requestRemoteLogin(
    workedDate: string,
    reason: string,
    session: 'first' | 'second' = 'first',
  ) {
    const submitted = await this.tryRequestRemoteLogin(workedDate, reason, session);
    if (!submitted) {
      throw new Error(`Remote Login request was not submitted for ${workedDate} (${session} half)`);
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
    throw new Error('Could not select Second Half on the Request Remote Login form');
  }

  async tryRequestRemoteLogin(
    workedDate: string,
    reason = `Request Remote Login ${workedDate}`,
    session: 'first' | 'second' = 'first',
  ) {
    await this.closeRequestDialogIfOpen();
    if (!(await this.requestRemoteLoginButton.isVisible().catch(() => false))) {
      await this.gotoWaitingForApproval();
    }
    await this.requestRemoteLoginButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.workedDateInput.fill(workedDate);
    await this.workedDateInput.blur();
    await this.selectHalfDaySession(session);
    await this.reasonInput.fill(reason);
    await this.page.waitForTimeout(400);

    if (session === 'first' && (await this.isAlreadyRequestedMessageVisible())) {
      claimRemoteLoginDate(workedDate);
      await this.closeRequestDialogIfOpen();
      return false;
    }

    if (!(await this.waitForRequestSubmitEnabled(2000))) {
      claimRemoteLoginDate(workedDate);
      await this.closeRequestDialogIfOpen();
      return false;
    }

    await this.requestButton.click();
    const duplicate = await this.duplicateRequestMessage.waitFor({ state: 'visible', timeout: 2000 }).then(() => true).catch(() => false);
    if (duplicate) {
      claimRemoteLoginDate(workedDate);
      await this.closeRequestDialogIfOpen();
      return false;
    }
    try {
      await this.submittedToast.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      if (await this.isAlreadyRequestedMessageVisible()) {
        claimRemoteLoginDate(workedDate);
        await this.closeRequestDialogIfOpen();
        return false;
      }
      await dialog.waitFor({ state: 'hidden', timeout: 12000 });
      claimRemoteLoginDate(workedDate);
      return true;
    } catch {
      claimRemoteLoginDate(workedDate);
      await this.closeRequestDialogIfOpen();
      return false;
    }
  }

  async isAlreadyRequestedMessageVisible() {
    return this.duplicateRequestMessage.isVisible().catch(() => false);
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

  async requestAvailableRemoteLogin(startAhead?: number) {
    const dates = await this.requestAvailableRemoteLoginDates(1, startAhead);
    return dates[0];
  }

  async requestAvailableRemoteLoginDates(count: number, startAhead?: number) {
    const created: ReturnType<typeof weekdayDate>[] = [];
    const booked = bookedDateInputs(await this.collectWorkedDates());
    const start = startAhead ?? remoteLoginStartAhead();
    let formOpen = false;

    const ensureFormOpen = async () => {
      const dialog = this.page.getByRole('dialog');
      if (formOpen && (await dialog.isVisible().catch(() => false))) {
        return dialog;
      }
      await this.closeRequestDialogIfOpen();
      if (!(await this.requestRemoteLoginButton.isVisible().catch(() => false))) {
        await this.gotoWaitingForApproval();
      }
      await this.requestRemoteLoginButton.click();
      await dialog.waitFor({ state: 'visible', timeout: 15000 });
      formOpen = true;
      return dialog;
    };

    for (let ahead = start; created.length < count && ahead <= MAX_ADVANCE_DAYS; ahead++) {
      const date = weekdayDate(ahead);
      if (this.isDateUnavailable(date.input, booked)) {
        continue;
      }

      const dialog = await ensureFormOpen();
      await this.workedDateInput.fill('');
      await this.workedDateInput.fill(date.input);
      await this.workedDateInput.blur();
      await this.duplicateRequestMessage.waitFor({ state: 'hidden', timeout: 1500 }).catch(() => {});
      await this.selectHalfDaySession('first');
      await this.reasonInput.fill(`Request Remote Login ${date.input}`);
      await this.page.waitForTimeout(500);

      if (await this.isAlreadyRequestedMessageVisible()) {
        claimRemoteLoginDate(date.input);
        booked.add(date.input);
        continue;
      }
      if (!(await this.waitForRequestSubmitEnabled(3000))) {
        continue;
      }

      await this.requestButton.click();
      const outcome = await Promise.race([
        this.duplicateRequestMessage.waitFor({ state: 'visible', timeout: 8000 }).then(() => 'duplicate' as const),
        dialog.waitFor({ state: 'hidden', timeout: 8000 }).then(() => 'closed' as const),
      ]).catch(() => 'unknown' as const);

      if (outcome !== 'closed' || (await this.isAlreadyRequestedMessageVisible())) {
        claimRemoteLoginDate(date.input);
        booked.add(date.input);
        formOpen = await dialog.isVisible().catch(() => false);
        continue;
      }

      claimRemoteLoginDate(date.input);
      booked.add(date.input);
      created.push(date);
      formOpen = false;
    }

    if (formOpen) {
      await this.closeRequestDialogIfOpen();
    }
    if (created.length < count) {
      throw new Error(`Could only submit ${created.length} of ${count} unused Remote Login dates`);
    }
    return created;
  }

  isDateUnavailable(input: string, booked: Set<string>) {
    const daysOut = daysFromToday(input);
    return (
      isRemoteLoginMonthBlocked(input) ||
      daysOut < 1 ||
      daysOut > MAX_ADVANCE_DAYS ||
      booked.has(input) ||
      claimedRemoteLoginDates.has(input)
    );
  }

  async readTabCount(tab: Locator) {
    const text = (await tab.innerText()).replace(/\s+/g, ' ').trim();
    const match = text.match(/\((\d+)\)\s*$/);
    return match ? Number(match[1]) : 0;
  }

  async readRemoteLoginTabCounts() {
    return {
      waiting: await this.readTabCount(this.waitingForApprovalTab),
      approved: await this.readTabCount(this.approvedTab),
      processed: await this.readTabCount(this.processedTab),
      rejected: await this.readTabCount(this.rejectedTab),
    };
  }

  async collectWorkedDates() {
    const dates = new Set<string>();
    const tabs = [
      this.waitingForApprovalTab,
      this.approvedTab,
      this.processedTab,
      this.rejectedTab,
    ];
    for (const tab of tabs) {
      await tab.click();
      await this.page.waitForTimeout(400);
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

  async workedDateColumnIndex() {
    const headers = this.page.locator('table thead th');
    const count = await headers.count();
    for (let index = 0; index < count; index++) {
      const name = ((await headers.nth(index).innerText()) || '').replace(/\s+/g, ' ').trim();
      if (/worked\s*date|work\s*date/i.test(name)) {
        return index;
      }
    }
    return -1;
  }

  async collectDatesFromOpenTable() {
    const dates = new Set<string>();
    const next = this.page.locator('.p-paginator-next').last();
    const first = this.page.locator('.p-paginator-first').last();
    if (await first.isVisible().catch(() => false)) {
      const firstClass = (await first.getAttribute('class')) || '';
      if (!firstClass.includes('p-disabled') && !(await first.isDisabled().catch(() => false))) {
        await first.click();
        await this.page.waitForTimeout(250);
      }
    }
    for (let pageIndex = 0; pageIndex < 8; pageIndex++) {
      const rows = await this.page.locator('table tbody tr').allTextContents();
      for (const row of rows) {
        for (const input of extractBookedDateInputs(row)) {
          dates.add(input);
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
      await this.page.waitForTimeout(250);
    }
    return dates;
  }

  async firstWaitingWorkedDate() {
    await this.waitingForApprovalTab.click();
    const columnIndex = await this.workedDateColumnIndex();
    const cells = await this.page.locator(
      columnIndex >= 0 ? `table tbody tr td:nth-child(${columnIndex + 1})` : 'table tbody tr',
    ).allTextContents();
    for (const cell of cells) {
      const value = cell.replace(/\s+/g, ' ').trim();
      if (value && workedDateToInput(value)) {
        return value;
      }
    }
    return null;
  }

  async findAvailableWeekdays(count: number, startAhead?: number) {
    const bookedInputs = bookedDateInputs(await this.collectWorkedDates());
    const found: ReturnType<typeof weekdayDate>[] = [];
    const seen = new Set<string>();
    const start = startAhead ?? remoteLoginStartAhead();

    for (let ahead = start; found.length < count && ahead <= MAX_ADVANCE_DAYS; ahead++) {
      const candidate = weekdayDate(ahead);
      if (seen.has(candidate.input) || this.isDateUnavailable(candidate.input, bookedInputs)) {
        continue;
      }
      seen.add(candidate.input);
      found.push(candidate);
    }
    if (found.length === 0) {
      throw new Error(`Could not find any unused Remote Login weekdays in November/December`);
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
      if (daysOut < 1 || daysOut > MAX_ADVANCE_DAYS) {
        continue;
      }
      seen.add(input);
      candidates.push(datePartsFromInput(input));
    }
    candidates.sort((left, right) => left.input.localeCompare(right.input));
    return candidates;
  }

  async openPendingRemoteLoginApprovals() {
    await this.pendingApprovalsToggle.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000);
    await this.pendingApprovalsToggle.click();
    await this.pendingTimeOffTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.pendingTimeOffTab.click();
    await this.remoteLoginPendingTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.remoteLoginPendingTab.click();
    await this.page.waitForURL(/\/pending-approvals\/time-off\/remote(\/|$)/i, { timeout: 15000 }).catch(() => {});
    await this.forYouTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.forYourRoleTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async readPendingCounts() {
    await this.forYouTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.forYourRoleTab.waitFor({ state: 'visible', timeout: 15000 });
    return {
      remoteLogin: await this.readTabCount(this.remoteLoginPendingTab),
      forYou: await this.readTabCount(this.forYouTab),
      forYourRole: await this.readTabCount(this.forYourRoleTab),
    };
  }

  async pendingQueueTotal() {
    const counts = await this.readPendingCounts();
    return counts.forYou + counts.forYourRole;
  }

  async openForYouTab() {
    await this.forYouTab.click();
    await this.page.waitForURL(/\/pending-approvals\/time-off\/remote\/for-you/i, { timeout: 15000 }).catch(() => {});
  }

  async openForYourRoleTab() {
    await this.forYourRoleTab.click();
    await this.page.waitForURL(/\/pending-approvals\/time-off\/remote\/for-your-role/i, { timeout: 15000 }).catch(() => {});
  }

  async openQueueWithRequests(workedDates: string[]) {
    await this.openForYouTab();
    if (await this.requestRow(workedDates[0]).first().isVisible().catch(() => false)) {
      return 'forYou' as const;
    }
    await this.openForYourRoleTab();
    await this.waitForRequestRows(workedDates);
    return 'forYourRole' as const;
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
      await this.requestRow(workedDate).first().waitFor({ state: 'visible', timeout: 15000 });
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

  async sendToHrQueue(workedDates: string[]) {
    const queue = await this.openQueueWithRequests(workedDates);
    if (queue === 'forYou' && await this.approveButton.isVisible().catch(() => false)) {
      await this.approveAtCurrentQueue(workedDates);
      await this.openForYourRoleTab();
      await this.waitForRequestRows(workedDates);
      return;
    }
    await this.waitForRequestRows(workedDates);
  }

  async completePendingToProcessed(workedDates: string[]) {
    const queue = await this.openQueueWithRequests(workedDates);
    if (queue === 'forYou' && await this.approveButton.isVisible().catch(() => false) && !(await this.processButton.isVisible().catch(() => false))) {
      await this.approveAtCurrentQueue(workedDates);
      await this.openForYourRoleTab();
      await this.processAtCurrentQueue(workedDates);
      return;
    }
    await this.processAtCurrentQueue(workedDates);
  }

  requestRow(workedDate: string) {
    const dateLabel = workedDate.replace(/,$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: new RegExp(`^${dateLabel}(,|$)`) }),
    }).filter({ hasText: 'saii Pavan Dinesh Tejaa' });
  }

  async rejectRequest(workedDate: string) {
    const row = this.requestRow(workedDate).first();
    const kebab = row.locator('.dropdown > a');
    if (await kebab.isVisible().catch(() => false)) {
      await kebab.click();
      await row.getByText('Reject', { exact: true }).click();
      const rejectedOption = this.page.getByRole('button', { name: 'Rejected' });
      if (await rejectedOption.isVisible().catch(() => false)) {
        await rejectedOption.click();
      }
      await this.rejectConfirmButton.click();
      return;
    }
    await this.rejectAtCurrentQueue([workedDate]);
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

  remoteLoginStatusTabs() {
    return [
      { name: 'Waiting For Approval', tab: this.waitingForApprovalTab },
      { name: 'Approved', tab: this.approvedTab },
      { name: 'Processed', tab: this.processedTab },
      { name: 'Rejected', tab: this.rejectedTab },
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
      const checkValues = tabName !== 'Processed' && tabName !== 'Rejected';
      const comparable = comparableSortValues(defaultValues);
      if (checkValues && comparable.length >= 2) {
        await expect.poll(
          async () => isRemoteLoginColumnSorted(await this.readColumnValues(column.index), 'asc'),
          { timeout: 15000 },
        ).toBe(true);
      }

      await column.header.click();
      await expect(column.header, `${tabName} > ${column.name} click 2`).toHaveAttribute('aria-sort', 'descending');
      if (checkValues && comparable.length >= 2) {
        await expect.poll(
          async () => isRemoteLoginColumnSorted(await this.readColumnValues(column.index), 'desc'),
          { timeout: 15000 },
        ).toBe(true);
      }

      await column.header.click();
      const thirdSort = await column.header.getAttribute('aria-sort');
      if (thirdSort === 'none') {
        if (defaultOrder.length >= 2) {
          await expect.poll(async () => this.readTableSnapshot(), { timeout: 15000 }).toEqual(defaultOrder);
        }
      } else {
        await expect(column.header, `${tabName} > ${column.name} click 3`).toHaveAttribute('aria-sort', 'ascending');
      }
    }
  }
}

function comparableSortValues(values: string[]) {
  return values
    .map((value) => value.replace(/\s+/g, ' ').trim())
    .filter((value) => value && value !== '-');
}

const SESSION_ORDER = ['first half', 'second half', 'full day'];

function parseRemoteLoginSortValue(text: string) {
  const value = text.replace(/\s+/g, ' ').trim();
  if (!value || value === '-') {
    return '';
  }
  const sessionIndex = SESSION_ORDER.indexOf(value.toLowerCase());
  if (sessionIndex >= 0) {
    return sessionIndex;
  }
  const dated = /\d{4}/.test(value) ? value : `${value.replace(/,$/, '')} ${new Date().getFullYear()}`;
  const timestamp = Date.parse(dated);
  if (!Number.isNaN(timestamp) && /[A-Za-z]{3}/.test(value)) {
    return timestamp;
  }
  return value.toLowerCase();
}

function compareRemoteLoginSortValues(left: string, right: string) {
  const a = parseRemoteLoginSortValue(left);
  const b = parseRemoteLoginSortValue(right);
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

function isRemoteLoginColumnSorted(values: string[], direction: 'asc' | 'desc') {
  const comparable = comparableSortValues(values);
  for (let i = 1; i < comparable.length; i++) {
    const cmp = compareRemoteLoginSortValues(comparable[i - 1], comparable[i]);
    if (direction === 'asc' && cmp > 0) {
      return false;
    }
    if (direction === 'desc' && cmp < 0) {
      return false;
    }
  }
  return true;
}

function extractBookedDateInputs(text: string) {
  const value = text.replace(/\s+/g, ' ').trim();
  if (!value || value === '-') {
    return [];
  }
  const month = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
  const matches = value.match(
    new RegExp(`(?:${month})[a-z]*\\.?\\s+\\d{1,2}(?:,?\\s*\\d{4})?`, 'gi'),
  ) || [];
  const inputs = new Set<string>();
  for (const match of matches) {
    const parsed = parseTableWorkedDate(match);
    if (parsed) {
      inputs.add(parsed);
    }
  }
  const iso = value.match(/\b\d{4}-\d{2}-\d{2}\b/g) || [];
  for (const match of iso) {
    inputs.add(match);
  }
  return [...inputs];
}

function parseTableWorkedDate(text: string) {
  const value = text.replace(/\s+/g, ' ').trim();
  if (!value || value === '-') {
    return null;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const month = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
  const match = value.match(
    new RegExp(
      `\\b(?:(?:${month})[a-z]*\\.?\\s+\\d{1,2}(?:,?\\s*\\d{4})?|\\d{1,2}[-/\\s](?:${month})[a-z]*[-/,\\s]+\\d{2,4}|\\d{4}-\\d{2}-\\d{2})\\b`,
      'i',
    ),
  );
  return workedDateToInput(match?.[0] || value);
}

function bookedDateInputs(cells: Set<string>) {
  const inputs = new Set<string>(claimedRemoteLoginDates);
  for (const cell of cells) {
    for (const parsed of extractBookedDateInputs(cell)) {
      inputs.add(parsed);
    }
    const fallback = parseTableWorkedDate(cell);
    if (fallback) {
      inputs.add(fallback);
    }
  }
  return inputs;
}
