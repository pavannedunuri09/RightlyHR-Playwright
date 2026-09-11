import { expect, type Locator, type Page } from '@playwright/test';
import { datePartsFromInput, daysFromToday, workedDateToInput } from './WorkFromHomePage';
import { GENERAL_LEAVE_CATEGORY, SICK_LEAVE_CATEGORY } from './LeaveCategoryPage';

export type LeaveEntitlementExpectation = {
  entitledBalance: string;
  frequency: string;
  booked?: string;
  processed?: string;
};

export type LeaveDateParts = ReturnType<typeof datePartsFromInput>;
export type LeaveSession = 'first' | 'second' | 'full';

export type CreatedLeaveRequest = LeaveDateParts & {
  categoryName: string;
  session: LeaveSession;
};

type BookedLeaveState = {
  hasFull: boolean;
  hasFirst: boolean;
  hasSecond: boolean;
};

type RequestLeaveOptions = {
  categoryNames?: string[];
  preferFuture?: boolean;
  session?: LeaveSession;
  nearOffset?: number;
};

export const MAX_LEAVE_PAST_DAYS = 100;
export const MAX_LEAVE_FUTURE_DAYS = 100;

const EMPLOYEE_NAME = 'saii Pavan Dinesh Tejaa';

export function leaveDateRange() {
  return { minOffset: -MAX_LEAVE_PAST_DAYS, maxOffset: MAX_LEAVE_FUTURE_DAYS };
}

export function leaveDateFromOffset(daysOffset: number, preferWeekday = true): LeaveDateParts {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysOffset);
  if (preferWeekday) {
    const step = daysOffset >= 0 ? 1 : -1;
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + step);
    }
  }
  const input = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
  return datePartsFromInput(input);
}

export function weekendDateFromOffset(startOffset: number, jsDay: 0 | 6): LeaveDateParts | null {
  const { minOffset, maxOffset } = leaveDateRange();
  for (let offset = startOffset; offset <= maxOffset; offset += 1) {
    if (offset < minOffset) {
      continue;
    }
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    if (date.getDay() === jsDay) {
      const input = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');
      return datePartsFromInput(input);
    }
  }
  for (let offset = startOffset - 1; offset >= minOffset; offset -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    if (date.getDay() === jsDay) {
      const input = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');
      return datePartsFromInput(input);
    }
  }
  return null;
}

export function leaveOffsetCandidates(preferFuture = true, nearOffset?: number) {
  const { minOffset, maxOffset } = leaveDateRange();
  const offsets: number[] = [];
  if (preferFuture) {
    for (let offset = 1; offset <= maxOffset; offset += 1) {
      offsets.push(offset);
    }
    for (let offset = -1; offset >= minOffset; offset -= 1) {
      offsets.push(offset);
    }
  } else {
    for (let offset = -1; offset >= minOffset; offset -= 1) {
      offsets.push(offset);
    }
    for (let offset = 1; offset <= maxOffset; offset += 1) {
      offsets.push(offset);
    }
  }
  if (nearOffset !== undefined) {
    offsets.sort((left, right) => Math.abs(left - nearOffset) - Math.abs(right - nearOffset));
  }
  return offsets;
}

const DEFAULT_LEAVE_SESSIONS: LeaveSession[] = ['full', 'first', 'second'];
let nextLeaveSessionIndex = 0;

export function nextDefaultLeaveSession(): LeaveSession {
  const session = DEFAULT_LEAVE_SESSIONS[nextLeaveSessionIndex % DEFAULT_LEAVE_SESSIONS.length];
  nextLeaveSessionIndex += 1;
  return session;
}

function emptyBookedState(): BookedLeaveState {
  return { hasFull: false, hasFirst: false, hasSecond: false };
}

function canBookSession(state: BookedLeaveState | undefined, session: LeaveSession) {
  if (!state) {
    return true;
  }
  if (state.hasFull) {
    return false;
  }
  if (session === 'full') {
    return !state.hasFirst && !state.hasSecond;
  }
  if (session === 'first') {
    return !state.hasFirst;
  }
  return !state.hasSecond;
}

export class LeavesPage {
  readonly page: Page;
  readonly timeOffNav: Locator;
  readonly timeOffToggle: Locator;
  readonly timeOffLeavesTab: Locator;
  readonly requestLeaveButton: Locator;
  readonly viewLeaveSummaryButton: Locator;
  readonly entitlementSummaryHeader: Locator;
  readonly waitingForApprovalTab: Locator;
  readonly approvedTab: Locator;
  readonly processedTab: Locator;
  readonly rejectedTab: Locator;
  readonly cancelledTab: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly halfDayRadio: Locator;
  readonly fullDayRadio: Locator;
  readonly firstHalfRadio: Locator;
  readonly secondHalfRadio: Locator;
  readonly reasonInput: Locator;
  readonly submitButton: Locator;
  readonly cancelRequestButton: Locator;
  readonly pendingApprovalsNav: Locator;
  readonly pendingApprovalsToggle: Locator;
  readonly pendingTimeOffTab: Locator;
  readonly leavesPendingTab: Locator;
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
  readonly outOfRangeDateMessage: Locator;
  readonly cancelConfirmMessage: Locator;
  readonly cancelConfirmYes: Locator;
  readonly cancelConfirmNo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timeOffNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Time Off' });
    this.timeOffToggle = this.timeOffNav.locator('[data-bs-toggle="dropdown"]');
    this.timeOffLeavesTab = page
      .locator('app-time-off-tabs')
      .locator('.grid-item')
      .filter({ hasText: /^Leaves$/i });
    this.requestLeaveButton = page.getByRole('button', { name: /Request Leave/i });
    this.viewLeaveSummaryButton = page.getByRole('button', { name: /View Leave Summary/i });
    this.entitlementSummaryHeader = page.getByText(/Entitlement Summary/i);
    this.waitingForApprovalTab = this.leaveStatusTab('Waiting For Approval');
    this.approvedTab = this.leaveStatusTab('Approved');
    this.processedTab = this.leaveStatusTab('Processed');
    this.rejectedTab = this.leaveStatusTab('Rejected');
    this.cancelledTab = this.leaveStatusTab('Cancelled');
    this.startDateInput = page
      .getByRole('dialog')
      .getByText('Start Date *', { exact: true })
      .locator('..')
      .getByRole('textbox');
    this.endDateInput = page
      .getByRole('dialog')
      .getByText('End Date *', { exact: true })
      .locator('..')
      .getByRole('textbox');
    this.halfDayRadio = page.getByRole('radio', { name: 'Half Day' });
    this.fullDayRadio = page.getByRole('dialog').getByRole('radio', { name: 'Full Day' });
    this.firstHalfRadio = page.getByRole('dialog').getByText('First Half', { exact: true });
    this.secondHalfRadio = page.getByRole('dialog').getByText('Second Half', { exact: true });
    this.reasonInput = page.getByRole('textbox', { name: 'Please enter reason' });
    this.submitButton = page.getByRole('dialog').getByRole('button', { name: 'Submit', exact: true });
    this.cancelRequestButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.pendingApprovalsNav = page.getByText('Pending Approvals');
    this.pendingApprovalsToggle = this.pendingApprovalsNav;
    this.pendingTimeOffTab = page.locator('div').filter({ hasText: /^Time-Off\(\d+\)$/ }).first();
    this.leavesPendingTab = page.getByText(/^Leaves\(\d+\)$/);
    this.forYouTab = page.getByRole('link', { name: /For You \(\d+\)/ });
    this.forYourRoleTab = page.getByRole('link', { name: /For Your Role \(\d+\)/ });
    this.rejectAction = page.getByText('Reject', { exact: true });
    this.rejectConfirmButton = page.getByRole('button', { name: 'Reject', exact: true });
    this.rejectedToast = page.getByText(/leave request Rejected|Leave request Rejected/i);
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
    this.invalidDateRangeMessage = page.getByText(
      /end date.*(less|before|greater|after|cannot|prior|is required)|start date.*(greater|after|cannot|is required)|invalid date range|must be (greater|after|on or after)|cannot be (less|before|earlier)/i,
    );
    this.outOfRangeDateMessage = page.getByText(
      /100 day|past date|future date|not allowed|out of range|cannot apply|maximum|minimum|allowed range/i,
    );
    this.cancelConfirmMessage = page.getByText(/Are you sure you want to/i);
    this.cancelConfirmYes = page.getByRole('button', { name: 'Yes', exact: true });
    this.cancelConfirmNo = page.getByRole('button', { name: 'No', exact: true });
  }

  requestDialog() {
    return this.page.getByRole('dialog');
  }

  leaveStatusTab(name: string) {
    return this.page
      .getByRole('listitem')
      .filter({ hasText: new RegExp(`${name}\\s*\\(\\d+\\)`, 'i') })
      .first();
  }

  private dateInput(field: 'start' | 'end') {
    const dialog = this.requestDialog();
    const label = field === 'start' ? 'Start Date *' : 'End Date *';
    return dialog.getByText(label, { exact: true }).locator('..').getByRole('textbox');
  }

  async fillStartDate(isoDate: string) {
    const input = this.dateInput('start');
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.click();
    await input.fill(isoDate);
    await input.press('Tab');
  }

  async fillEndDate(isoDate: string) {
    const input = this.dateInput('end');
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.click();
    await input.fill(isoDate);
    await input.press('Tab');
  }

  leaveEntitlementBlock(categoryName: string) {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText(categoryName, { exact: true }) })
      .filter({ hasText: /\d+\s*\/\s*\d+/ })
      .first();
  }

  async waitForEntitlementCards(categoryNames: string[], timeoutMs = 30000) {
    for (const categoryName of categoryNames) {
      await expect
        .poll(
          async () => this.leaveEntitlementBlock(categoryName).isVisible().catch(() => false),
          { timeout: timeoutMs },
        )
        .toBeTruthy();
    }
  }

  async openTimeOffMenu() {
    await this.closeRequestDialogIfOpen();
    await this.timeOffNav.waitFor({ state: 'visible' });
    await this.timeOffToggle.waitFor({ state: 'visible' });

    if (await this.timeOffLeavesTab.isVisible().catch(() => false)) {
      return;
    }

    await this.page.waitForTimeout(1500);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await this.timeOffToggle.click();
      try {
        await this.timeOffLeavesTab.waitFor({ state: 'visible', timeout: 8000 });
        return;
      } catch {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);
      }
    }

    await this.timeOffNav.click();
    await this.timeOffLeavesTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openLeavesTab() {
    await this.openTimeOffMenu();
    await this.timeOffLeavesTab.click();
    await this.page.waitForURL(/\/time-off\/leaves/i, { timeout: 15000 });
    await this.requestLeaveButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.waitingForApprovalTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openFromDashboard() {
    if (!this.page.url().includes('/dashboard/emp')) {
      await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' });
    }
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page
      .getByText('Have a nice day at work!')
      .waitFor({ state: 'visible', timeout: 15000 });
    await this.openLeavesTab();
  }

  async gotoWaitingForApproval() {
    await this.closeRequestDialogIfOpen();
    await this.openLeavesTab();
  }

  async expectLeavesPageLoaded() {
    await expect(this.page).toHaveURL(/\/time-off\/leaves/i);
    await expect(this.requestLeaveButton).toBeVisible({ timeout: 15000 });
    await expect(this.viewLeaveSummaryButton).toBeVisible();
  }

  async validateUserSessionAndOpenLeaves(
    loginPage: { validateUserSession: () => Promise<void> },
    categoryNames: string[] = [],
  ) {
    await loginPage.validateUserSession();
    await this.page.goto('/time-off/leaves/waiting-for-approval', {
      waitUntil: 'domcontentloaded',
    });
    await this.expectLeavesPageLoaded();

    if (categoryNames.length > 0) {
      await this.waitForEntitlementCards(categoryNames);
    }
  }

  async expectEntitledLeave(categoryName: string, expectation: LeaveEntitlementExpectation) {
    const block = this.leaveEntitlementBlock(categoryName);
    await expect(block).toBeVisible({ timeout: 15000 });

    const blockText = (await block.innerText()).replace(/\s+/g, ' ');
    const normalizedBlockText = blockText.replace(/\s/g, '');
    const normalizedBalance = expectation.entitledBalance.replace(/\s/g, '');
    expect(blockText).toContain(categoryName);
    expect(normalizedBlockText).toContain(normalizedBalance);
    expect(blockText).toContain(expectation.frequency);

    if (expectation.booked !== undefined) {
      expect(blockText).toMatch(new RegExp(`Booked\\s*${expectation.booked}`, 'i'));
    }

    if (expectation.processed !== undefined) {
      expect(blockText).toMatch(new RegExp(`Processed\\s*${expectation.processed}`, 'i'));
    }
  }

  async openRequestLeaveDialog() {
    await this.closeRequestDialogIfOpen();
    await this.requestLeaveButton.click();
    const dialog = this.requestDialog();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await dialog.getByText(/Request Leave/i).waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    return dialog;
  }

  async selectLeaveCategory(categoryName: string) {
    const dialog = this.requestDialog();
    const selectedCombo = dialog.getByRole('combobox', { name: categoryName });
    if (await selectedCombo.isVisible().catch(() => false)) {
      return;
    }

    const existingCombo = dialog.getByRole('combobox').first();
    const leaveTypeTrigger = dialog.getByText(/Leave Type\*Please select/i).first();
    if (await existingCombo.isVisible().catch(() => false)) {
      await existingCombo.click();
    } else {
      await leaveTypeTrigger.waitFor({ state: 'visible', timeout: 15000 });
      await leaveTypeTrigger.click();
    }

    const option = this.page.getByRole('option', { name: categoryName, exact: true });
    await option.waitFor({ state: 'visible', timeout: 15000 });
    await option.click();

    await dialog.getByText(/Start Date\s*\*/i).waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectAvailing(session: 'first' | 'second' | 'full' = 'first') {
    if (session === 'full') {
      await this.fullDayRadio.check();
      return;
    }
    await this.selectHalfDaySession(session);
  }

  async selectHalfDaySession(session: 'first' | 'second' = 'first') {
    const dialog = this.requestDialog();
    await this.halfDayRadio.check();
    const halfLabel = session === 'second' ? 'Second Half' : 'First Half';
    const halfRadio = dialog.getByRole('radio', { name: halfLabel });
    await halfRadio.waitFor({ state: 'visible', timeout: 10000 });
    await halfRadio.check();
  }

  async fillRequestForm(
    startDate: string,
    reason: string,
    categoryName: string,
    session: 'first' | 'second' | 'full' = 'first',
  ) {
    await this.openRequestLeaveDialog();
    const dialog = this.requestDialog();
    await this.selectLeaveCategory(categoryName);
    await this.fillStartDate(startDate);
    await this.fillEndDate(startDate);
    await this.selectAvailing(session);
    await this.reasonInput.fill(reason);
    return dialog;
  }

  async fillRequestFormRange(
    startDate: string,
    endDate: string,
    reason: string,
    categoryName: string,
    session: 'first' | 'second' | 'full' = 'first',
  ) {
    await this.openRequestLeaveDialog();
    const dialog = this.requestDialog();
    await this.selectLeaveCategory(categoryName);
    await this.fillStartDate(startDate);
    await this.fillEndDate(endDate);
    await this.selectAvailing(session);
    await this.reasonInput.fill(reason);
    return dialog;
  }

  async openFilledRequestForm(categoryName: string) {
    const date = leaveDateFromOffset(14);
    await this.openRequestLeaveDialog();
    await this.selectLeaveCategory(categoryName);
    await this.fillStartDate(date.input);
    await this.fillEndDate(date.input);
    await this.selectAvailing('first');
    await this.reasonInput.fill(`Cancel leave ${date.input}`);
    return date;
  }

  leaveDateCell(dateCell: string) {
    return this.page.getByRole('cell', { name: dateCell }).first();
  }

  async clickRequestFormCancel() {
    await this.cancelRequestButton.click();
    await this.cancelConfirmMessage.waitFor({ state: 'visible', timeout: 15000 });
  }

  async closeRequestDialogIfOpen() {
    const dialog = this.requestDialog();
    for (let attempt = 0; attempt < 4; attempt += 1) {
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

  async waitForSubmitEnabled(timeoutMs = 2000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const enabled = await this.submitButton.isEnabled().catch(() => false);
      const className = (await this.submitButton.getAttribute('class').catch(() => '')) || '';
      if (enabled && !className.includes('p-disabled')) {
        return true;
      }
      await this.page.waitForTimeout(250);
    }
    return false;
  }

  async tryRequestLeave(
    startDate: string,
    endDate = startDate,
    reason = `Request leave ${startDate}`,
    categoryName: string,
    session: LeaveSession = 'first',
  ) {
    await this.closeRequestDialogIfOpen();
    if (!(await this.requestLeaveButton.isVisible().catch(() => false))) {
      await this.gotoWaitingForApproval();
    }
    await this.requestLeaveButton.click();
    const dialog = this.requestDialog();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.selectLeaveCategory(categoryName);
    await this.fillStartDate(startDate);
    await this.fillEndDate(endDate);
    await this.selectAvailing(session);
    await this.reasonInput.fill(reason);

    if (!(await this.waitForSubmitEnabled(5000))) {
      await this.closeRequestDialogIfOpen();
      return false;
    }

    await this.submitButton.click();
    const duplicateVisible = await this.duplicateRequestMessage.isVisible({ timeout: 3000 }).catch(() => false);
    if (duplicateVisible) {
      await this.closeRequestDialogIfOpen();
      return false;
    }
    try {
      await dialog.waitFor({ state: 'hidden', timeout: 15000 });
      return true;
    } catch {
      await this.closeRequestDialogIfOpen();
      return false;
    }
  }

  async requestLeave(
    startDate: string,
    endDate: string,
    reason: string,
    categoryName: string,
    session: 'first' | 'second' | 'full' = 'first',
  ) {
    const submitted = await this.tryRequestLeave(startDate, endDate, reason, categoryName, session);
    if (!submitted) {
      throw new Error(`Leave request was not submitted for ${startDate} (${session})`);
    }
  }

  async readTabCount(tab: Locator) {
    await tab.waitFor({ state: 'visible', timeout: 15000 });
    const text = (await tab.innerText()).replace(/\s+/g, ' ').trim();
    const parenMatch = text.match(/\((\d+)\)/);
    if (parenMatch) {
      return Number(parenMatch[1]);
    }
    const trailingMatch = text.match(/(\d+)\s*$/);
    return trailingMatch ? Number(trailingMatch[1]) : 0;
  }

  async readLeavesTabCounts() {
    return {
      waiting: await this.readTabCount(this.waitingForApprovalTab),
      approved: await this.readTabCount(this.approvedTab),
      processed: await this.readTabCount(this.processedTab),
      rejected: await this.readTabCount(this.rejectedTab),
      cancelled: await this.readTabCount(this.cancelledTab),
    };
  }

  leaveRow(dateCell: string, session?: string) {
    let row = this.page.locator('table tbody tr').filter({ hasText: dateCell });
    if (session) {
      row = row.filter({ hasText: session });
    }
    return row;
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

  async startDateColumnIndex() {
    const headers = this.page.locator('table thead th');
    const count = await headers.count();
    for (let index = 0; index < count; index += 1) {
      const text = ((await headers.nth(index).innerText()) || '').replace(/\s+/g, ' ').trim();
      if (/Start Date/i.test(text)) {
        return index + 1;
      }
    }
    return 6;
  }

  async collectDatesFromOpenTable() {
    const dates = new Set<string>();
    const columnIndex = await this.startDateColumnIndex();
    const next = this.page.locator('.p-paginator-next').last();
    const first = this.page.locator('.p-paginator-first').last();
    if (await first.isVisible().catch(() => false)) {
      const firstClass = (await first.getAttribute('class')) || '';
      if (!firstClass.includes('p-disabled') && !(await first.isDisabled().catch(() => false))) {
        await first.click();
        await this.page.waitForTimeout(400);
      }
    }
    for (let pageIndex = 0; pageIndex < 25; pageIndex += 1) {
      const cells = await this.page
        .locator(`table tbody tr td:nth-child(${columnIndex})`)
        .allTextContents();
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

  async collectBookedLeaveState() {
    const booked = new Map<string, BookedLeaveState>();
    const tabs = [this.waitingForApprovalTab, this.approvedTab, this.processedTab];

    for (const tab of tabs) {
      await tab.click();
      await this.page.waitForTimeout(600);
      await this.expandTablePageSize();
      const columnIndex = await this.startDateColumnIndex();
      const rows = this.page.locator('table tbody tr').filter({ hasNotText: /No Data Found/i });
      const rowCount = await rows.count();
      for (let index = 0; index < rowCount; index += 1) {
        const row = rows.nth(index);
        const cellCount = await row.locator('td').count();
        if (cellCount < columnIndex) {
          continue;
        }
        const dateCellLocator = row.locator(`td:nth-child(${columnIndex})`);
        const dateCell = ((await dateCellLocator.innerText({ timeout: 5000 }).catch(() => '')) || '')
          .replace(/\s+/g, ' ')
          .trim();
        const input = workedDateToInput(dateCell);
        if (!input) {
          continue;
        }
        const rowText = ((await row.innerText()) || '').replace(/\s+/g, ' ');
        const state = booked.get(input) || emptyBookedState();
        if (/Full Day/i.test(rowText)) {
          state.hasFull = true;
        }
        if (/First Half/i.test(rowText)) {
          state.hasFirst = true;
        }
        if (/Second Half/i.test(rowText)) {
          state.hasSecond = true;
        }
        booked.set(input, state);
      }
    }

    await this.waitingForApprovalTab.click();
    return booked;
  }

  async readCategoryRemainingBalance(categoryName: string) {
    const block = this.leaveEntitlementBlock(categoryName);
    if (!(await block.isVisible().catch(() => false))) {
      return null;
    }
    const blockText = (await block.innerText()).replace(/\s+/g, ' ');
    const balanceMatch = blockText.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if (!balanceMatch) {
      return null;
    }
    return Number(balanceMatch[1]);
  }

  async readEntitledCategoryNames() {
    const preferred = [GENERAL_LEAVE_CATEGORY.categoryName, SICK_LEAVE_CATEGORY.categoryName];
    const categories: string[] = [];
    for (const categoryName of preferred) {
      if (await this.leaveEntitlementBlock(categoryName).isVisible().catch(() => false)) {
        categories.push(categoryName);
      }
    }
    if (categories.length > 0) {
      return categories;
    }
    return preferred;
  }

  async categoriesWithBalance(categoryNames?: string[]) {
    const names = categoryNames?.length ? categoryNames : await this.readEntitledCategoryNames();
    const available: string[] = [];
    for (const categoryName of names) {
      const remaining = await this.readCategoryRemainingBalance(categoryName);
      if (remaining === null || remaining > 0) {
        available.push(categoryName);
      }
    }
    return available.length > 0 ? available : names;
  }

  async readDialogCategoryNames() {
    await this.openRequestLeaveDialog();
    const dialog = this.requestDialog();
    const combo = dialog.getByRole('combobox').first();
    await combo.click();
    const options = await this.page.getByRole('option').allTextContents();
    await this.page.keyboard.press('Escape');
    await this.closeRequestDialogIfOpen();
    return options.map((option) => option.trim()).filter(Boolean);
  }

  resolveCategoryOrder(primaryCategory?: string, extraCategories?: string[]) {
    const ordered = [
      ...(primaryCategory ? [primaryCategory] : []),
      ...(extraCategories || []),
      GENERAL_LEAVE_CATEGORY.categoryName,
      SICK_LEAVE_CATEGORY.categoryName,
    ];
    return [...new Set(ordered)];
  }

  normalizeRequestOptions(
    categoryNameOrOptions?: string | RequestLeaveOptions,
    preferFuture = true,
    session?: LeaveSession,
  ): RequestLeaveOptions {
    if (typeof categoryNameOrOptions === 'string') {
      return {
        categoryNames: this.resolveCategoryOrder(categoryNameOrOptions),
        preferFuture,
        session,
      };
    }
    return {
      preferFuture,
      session,
      ...categoryNameOrOptions,
      categoryNames: categoryNameOrOptions?.categoryNames
        ? this.resolveCategoryOrder(categoryNameOrOptions.categoryNames[0], categoryNameOrOptions.categoryNames.slice(1))
        : undefined,
    };
  }

  findAvailableLeaveDates(
    count: number,
    booked: Map<string, BookedLeaveState>,
    options: RequestLeaveOptions,
  ) {
    const preferFuture = options.preferFuture ?? true;
    const session = options.session ?? nextDefaultLeaveSession();
    const found: LeaveDateParts[] = [];
    const seen = new Set<string>();

    for (const offset of leaveOffsetCandidates(preferFuture, options.nearOffset)) {
      const candidate = leaveDateFromOffset(offset);
      const daysOut = daysFromToday(candidate.input);
      if (daysOut < -MAX_LEAVE_PAST_DAYS || daysOut > MAX_LEAVE_FUTURE_DAYS) {
        continue;
      }
      if (seen.has(candidate.input) || !canBookSession(booked.get(candidate.input), session)) {
        continue;
      }
      seen.add(candidate.input);
      found.push(candidate);
      if (found.length >= count) {
        return found;
      }
    }

    if (found.length === 0) {
      throw new Error(
        `Could not find any available ${session} leave dates within ±${MAX_LEAVE_FUTURE_DAYS} days`,
      );
    }
    return found;
  }

  async requestAvailableLeave(
    categoryNameOrOptions?: string | RequestLeaveOptions,
    preferFuture = true,
    session?: LeaveSession,
  ): Promise<CreatedLeaveRequest> {
    const dates = await this.requestAvailableLeaveDates(1, categoryNameOrOptions, preferFuture, session);
    return dates[0];
  }

  async requestAvailablePastLeave(categoryNameOrOptions?: string | RequestLeaveOptions, session?: LeaveSession) {
    const options =
      typeof categoryNameOrOptions === 'string' || categoryNameOrOptions === undefined
        ? this.normalizeRequestOptions(categoryNameOrOptions, false, session)
        : { ...categoryNameOrOptions, preferFuture: false, session: session ?? categoryNameOrOptions.session };
    return this.requestAvailableLeave(options);
  }

  async requestAvailableFutureLeave(categoryNameOrOptions?: string | RequestLeaveOptions, session?: LeaveSession) {
    const options =
      typeof categoryNameOrOptions === 'string' || categoryNameOrOptions === undefined
        ? this.normalizeRequestOptions(categoryNameOrOptions, true, session)
        : { ...categoryNameOrOptions, preferFuture: true, session: session ?? categoryNameOrOptions.session };
    return this.requestAvailableLeave(options);
  }

  async requestLeaveNearBoundary(
    direction: 'past' | 'future',
    categoryNameOrOptions?: string | RequestLeaveOptions,
    session: LeaveSession = 'full',
  ): Promise<CreatedLeaveRequest> {
    const nearOffset = direction === 'past' ? -(MAX_LEAVE_PAST_DAYS - 1) : MAX_LEAVE_FUTURE_DAYS - 1;
    const options = this.normalizeRequestOptions(categoryNameOrOptions, direction === 'future', session);
    options.nearOffset = nearOffset;
    options.preferFuture = direction === 'future';
    return this.requestAvailableLeave(options);
  }

  async requestAvailableLeaveDates(
    count: number,
    categoryNameOrOptions?: string | RequestLeaveOptions,
    preferFuture = true,
    session?: LeaveSession,
  ): Promise<CreatedLeaveRequest[]> {
    const options = this.normalizeRequestOptions(categoryNameOrOptions, preferFuture, session);
    const created: CreatedLeaveRequest[] = [];
    const tried = new Set<string>();

    const sessionsToTry: LeaveSession[] = options.session
      ? [options.session]
      : ['full', 'first', 'second'];

    while (created.length < count) {
      const booked = await this.collectBookedLeaveState();
      const categories = await this.categoriesWithBalance(options.categoryNames);
      let submitted = false;

      for (const requestSession of sessionsToTry) {
        let candidates: LeaveDateParts[] = [];
        try {
          candidates = this.findAvailableLeaveDates(1, booked, {
            ...options,
            session: requestSession,
          });
        } catch {
          continue;
        }

        for (const date of candidates) {
          const attemptKey = `${date.input}:${requestSession}`;
          if (tried.has(attemptKey)) {
            continue;
          }
          tried.add(attemptKey);

          for (const categoryName of categories) {
            if (
              await this.tryRequestLeave(
                date.input,
                date.input,
                `Request leave ${requestSession} ${date.input}`,
                categoryName,
                requestSession,
              )
            ) {
              created.push({ ...date, categoryName, session: requestSession });
              submitted = true;
              break;
            }
          }
          if (submitted) {
            break;
          }
        }
        if (submitted) {
          break;
        }
      }

      if (!submitted) {
        throw new Error(`Could only submit ${created.length} of ${count} leave requests`);
      }
    }

    return created;
  }

  async firstWaitingLeaveDate() {
    await this.waitingForApprovalTab.click();
    const columnIndex = await this.startDateColumnIndex();
    const firstCell = this.page.locator(`table tbody tr td:nth-child(${columnIndex})`).first();
    if ((await firstCell.count()) === 0) {
      return null;
    }
    const text = (await firstCell.textContent())?.trim();
    return text || null;
  }

  async openPendingLeavesApprovals() {
    await this.pendingApprovalsNav.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000);
    await this.pendingApprovalsNav.click();
    await this.pendingTimeOffTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.pendingTimeOffTab.click();
    await this.leavesPendingTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.leavesPendingTab.click();
    await this.page.waitForURL(/\/pending-approvals\/time-off\/leaves/i, { timeout: 15000 });
    await this.forYouTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.forYourRoleTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async readPendingCounts() {
    await this.forYouTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.forYourRoleTab.waitFor({ state: 'visible', timeout: 15000 });
    return {
      leaves: await this.readTabCount(this.leavesPendingTab),
      forYou: await this.readTabCount(this.forYouTab),
      forYourRole: await this.readTabCount(this.forYourRoleTab),
    };
  }

  async openForYouTab() {
    await this.forYouTab.click();
    await this.page.waitForURL(/\/pending-approvals\/time-off\/leaves\/for-you/i, { timeout: 15000 }).catch(() => {});
  }

  async openForYourRoleTab() {
    await this.forYourRoleTab.click();
    await this.page
      .waitForURL(/\/pending-approvals\/time-off\/leaves\/for-your-role/i, { timeout: 15000 })
      .catch(() => {});
  }

  async closeSuccessDialog() {
    await this.successRecordsHeader.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.keyboard.press('Escape');
    const dialog = this.requestDialog();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(async () => {
      await this.page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden', timeout: 5000 });
    });
  }

  requestRow(workedDate: string) {
    const dateLabel = workedDate.replace(/,$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: new RegExp(`^${dateLabel}(,|$)`) }),
    }).filter({ hasText: EMPLOYEE_NAME });
  }

  leaveRequestRow(dateCell: string) {
    return this.leaveRow(dateCell).first();
  }

  async openLeaveRowKebab(dateCell: string) {
    const row = this.leaveRequestRow(dateCell);
    await row.locator('.dropdown > a').click();
  }

  async cancelLeaveRequest(dateCell: string) {
    await this.waitingForApprovalTab.click();
    await this.expandTablePageSize();
    const row = this.leaveRequestRow(dateCell);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.scrollIntoViewIfNeeded();
    await this.openLeaveRowKebab(dateCell);

    const cancelLeave = this.page
      .locator('.dropdown-menu.show, .dropdown-menu[style*="display: block"]')
      .getByText('Cancel Leave', { exact: true })
      .or(row.locator('a.dropdown-item', { hasText: 'Cancel Leave' }).locator('visible=true'));
    await cancelLeave.first().click({ timeout: 15000 });

    const dialog = this.requestDialog();
    await dialog.getByText(/Are you sure you want to cancel this leave request/i).waitFor({
      state: 'visible',
      timeout: 15000,
    });
    await dialog.getByRole('textbox', { name: 'Please enter cancellation reason' }).fill(
      `Cancel future leave ${dateCell}`,
    );
    const submit = dialog.getByRole('button', { name: 'Submit', exact: true });
    await expect(submit).toBeEnabled({ timeout: 10000 });
    await submit.click();
    await dialog.waitFor({ state: 'hidden', timeout: 15000 });
  }

  async waitForRequestRows(workedDates: string[]) {
    for (const workedDate of workedDates) {
      await this.requestRow(workedDate).waitFor({ state: 'visible', timeout: 15000 });
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
    await this.requestDialog().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  /**
   * When RM and TM are the same user, one For You approve sends the record to HR.
   */
  async sendToHrQueue(workedDates: string[]) {
    await this.openForYouTab();
    await this.approveAtCurrentQueue(workedDates);
    await this.openForYourRoleTab();
    await this.waitForRequestRows(workedDates);
  }

  async rejectRequest(workedDate: string) {
    const row = this.requestRow(workedDate).first();
    const kebab = row.locator('.dropdown > a');
    if (await kebab.isVisible().catch(() => false)) {
      await kebab.click();
      await row.getByText('Reject', { exact: true }).click();
      const dialog = this.requestDialog();
      await dialog.waitFor({ state: 'visible', timeout: 15000 });
      const rejectedOption = dialog.getByRole('button', { name: 'Rejected' });
      if (await rejectedOption.isVisible().catch(() => false)) {
        await rejectedOption.click();
      }
      await dialog.getByRole('button', { name: 'Reject', exact: true }).click();
      await this.successRecordsHeader.or(this.rejectedToast).waitFor({ state: 'visible', timeout: 15000 });
      return;
    }
    await this.rejectAtCurrentQueue([workedDate]);
  }

  async selectRequests(workedDates: string[]) {
    for (const workedDate of [...new Set(workedDates)]) {
      const rows = this.requestRow(workedDate);
      const count = await rows.count();
      for (let index = 0; index < count; index += 1) {
        await rows.nth(index).getByRole('checkbox').check();
      }
    }
  }

  async selectPlannedLeaveInDialog(planned: 'Yes' | 'No' = 'Yes') {
    const dialog = this.requestDialog();
    const plannedLabel = dialog.getByText(/Is it a planned leave/i);
    if (!(await plannedLabel.isVisible().catch(() => false))) {
      return;
    }
    const radio = dialog.getByRole('radio', { name: planned, exact: true });
    if (await radio.isVisible().catch(() => false)) {
      await radio.check();
      return;
    }
    await dialog.getByText(planned, { exact: true }).click();
  }

  async fillApprovalDialog(planned: 'Yes' | 'No' = 'Yes') {
    const dialog = this.requestDialog();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    const approvedOption = dialog.getByRole('button', { name: 'Approved' });
    if (await approvedOption.isVisible().catch(() => false)) {
      await approvedOption.click();
    }
    await this.selectPlannedLeaveInDialog(planned);
  }

  async approveSelected(planned: 'Yes' | 'No' = 'Yes') {
    await this.approveButton.click();
    await this.fillApprovalDialog(planned);
    const dialog = this.requestDialog();
    const approveConfirm = dialog.getByRole('button', { name: 'Approve', exact: true });
    await expect(approveConfirm).toBeEnabled({ timeout: 15000 });
    await approveConfirm.click();
  }

  async processSelected() {
    await this.processButton.click();
    if (await this.processedOption.isVisible().catch(() => false)) {
      await this.processedOption.click();
    } else if (await this.approvedOption.isVisible().catch(() => false)) {
      await this.approvedOption.click();
    }
    const dialog = this.requestDialog();
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
    const dialog = this.requestDialog();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    const rejectedOption = dialog.getByRole('button', { name: 'Rejected' });
    if (await rejectedOption.isVisible().catch(() => false)) {
      await rejectedOption.click();
    }
    await dialog.getByRole('button', { name: 'Reject', exact: true }).click();
  }

  leavesStatusTabs() {
    return [
      { name: 'Waiting For Approval', tab: this.waitingForApprovalTab },
      { name: 'Approved', tab: this.approvedTab },
      { name: 'Processed', tab: this.processedTab },
      { name: 'Rejected', tab: this.rejectedTab },
      { name: 'Cancelled', tab: this.cancelledTab },
    ];
  }
}
