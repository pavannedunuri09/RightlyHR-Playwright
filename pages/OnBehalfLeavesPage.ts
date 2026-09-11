import { expect, type Locator, type Page } from '@playwright/test';
import {
  LeavesPage,
  leaveDateFromOffset,
  type CreatedLeaveRequest,
  type LeaveDateParts,
  type LeaveSession,
} from './LeavesPage';
import { daysFromToday, workedDateToInput } from './WorkFromHomePage';

const claimedOnBehalfLeaveDates = new Set<string>();
const KNOWN_HOLIDAYS = new Set(['2026-09-14']);

function claimOnBehalfLeaveDate(input: string) {
  claimedOnBehalfLeaveDates.add(input);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function isoToDmy(isoDate: string) {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function randomFutureWeekdays(count: number): LeaveDateParts[] {
  const pool: LeaveDateParts[] = [];
  const seen = new Set<string>();
  for (let offset = 14; offset <= 56; offset += 1) {
    const candidate = leaveDateFromOffset(offset);
    if (seen.has(candidate.input) || KNOWN_HOLIDAYS.has(candidate.input) || claimedOnBehalfLeaveDates.has(candidate.input)) {
      continue;
    }
    if (daysFromToday(candidate.input) < 14) {
      continue;
    }
    seen.add(candidate.input);
    pool.push(candidate);
  }
  if (pool.length === 0) {
    throw new Error('Could not find a future weekday at least 14 days from today');
  }
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

export class OnBehalfLeavesPage {
  readonly page: Page;
  readonly leavesPage: LeavesPage;
  readonly onBehalfNav: Locator;
  readonly onBehalfToggle: Locator;
  readonly onBehalfLeavesTab: Locator;
  readonly selectEmployeeCombobox: Locator;
  readonly applyOnBehalfButton: Locator;
  readonly noDataFoundCard: Locator;
  readonly waitingForApprovalTab: Locator;
  readonly approvedTab: Locator;
  readonly processedTab: Locator;
  readonly rejectedTab: Locator;
  readonly cancelledTab: Locator;
  readonly commentsInput: Locator;
  readonly applyButton: Locator;
  readonly submittedToast: Locator;
  readonly insufficientBalanceMessage: Locator;
  readonly holidayRequestMessage: Locator;
  readonly dateColumnHeader: Locator;
  readonly leaveTypeColumnHeader: Locator;
  readonly durationColumnHeader: Locator;
  readonly availedColumnHeader: Locator;
  readonly startDateColumnHeader: Locator;
  readonly endDateColumnHeader: Locator;
  readonly reasonColumnHeader: Locator;
  readonly statusColumnHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leavesPage = new LeavesPage(page);
    this.onBehalfNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: /On\s*Behalf\s*Of/i });
    this.onBehalfToggle = this.onBehalfNav.locator('[data-bs-toggle="dropdown"]');
    this.onBehalfLeavesTab = page.locator('.grid-item:visible').filter({ hasText: /^Leaves$/i });
    this.selectEmployeeCombobox = page.getByRole('combobox', {
      name: /Please select employee|Select employee name/i,
    });
    this.applyOnBehalfButton = page.getByRole('button', { name: /Apply On Behalf Of/i });
    this.noDataFoundCard = page.getByText(/No Data Found/i);
    this.waitingForApprovalTab = this.statusTab('Waiting For Approval');
    this.approvedTab = this.statusTab('Approved');
    this.processedTab = this.statusTab('Processed');
    this.rejectedTab = this.statusTab('Rejected');
    this.cancelledTab = this.statusTab('Cancelled');
    this.commentsInput = page.getByRole('textbox', { name: /Please enter comments/i });
    this.applyButton = page.getByRole('dialog').getByRole('button', { name: 'Apply', exact: true });
    this.submittedToast = page.getByText(/Leave processed successfully/i);
    this.insufficientBalanceMessage = page.getByText(/The leave balance for/i);
    this.holidayRequestMessage = page.getByText(
      /holiday|public holiday|selected (date|day) is a holiday|is a holiday|falls on a holiday/i,
    );
    this.dateColumnHeader = page.getByRole('columnheader', { name: 'Date', exact: true });
    this.leaveTypeColumnHeader = page.getByRole('columnheader', { name: 'Leave Type' });
    this.durationColumnHeader = page.getByRole('columnheader', { name: /Duration/i });
    this.availedColumnHeader = page.getByRole('columnheader', { name: 'Availed' });
    this.startDateColumnHeader = page.getByRole('columnheader', { name: 'Start Date' });
    this.endDateColumnHeader = page.getByRole('columnheader', { name: 'End Date' });
    this.reasonColumnHeader = page.getByRole('columnheader', { name: 'Reason', exact: true });
    this.statusColumnHeader = page.getByRole('columnheader', { name: 'Status' });
  }

  yearCombobox(year?: number) {
    const label = year ?? new Date().getFullYear();
    return this.page.getByRole('combobox', { name: String(label) });
  }

  requestDialog() {
    return this.leavesPage.requestDialog();
  }

  statusTab(name: string) {
    return this.page
      .getByRole('listitem')
      .filter({ hasText: new RegExp(`${name}\\s*\\(\\d+\\)`, 'i') })
      .filter({ visible: true })
      .first();
  }

  async validateUserOnDashboard() {
    await this.page.goto('/dashboard/emp');
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible' });
  }

  async openOnBehalfMenu() {
    await this.closeRequestDialogIfOpen();
    await this.onBehalfNav.waitFor({ state: 'visible' });
    await this.onBehalfToggle.waitFor({ state: 'visible' });
    if (await this.onBehalfLeavesTab.isVisible().catch(() => false)) {
      return;
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await this.onBehalfToggle.click();
      try {
        await this.onBehalfLeavesTab.waitFor({ state: 'visible', timeout: 8000 });
        return;
      } catch {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);
      }
    }

    await this.onBehalfNav.click();
    await this.onBehalfLeavesTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openLeavesFromDashboard() {
    await this.validateUserOnDashboard();
    await this.openOnBehalfMenu();
    await this.onBehalfLeavesTab.click();
    await this.page.waitForURL(/on-?behalf/i, { timeout: 15000 });
    await this.applyOnBehalfButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.waitingForApprovalTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async readTabCount(tab: Locator) {
    await tab.waitFor({ state: 'visible', timeout: 15000 });
    const text = (await tab.innerText()).replace(/\s+/g, ' ').trim();
    const match = text.match(/\((\d+)\)/);
    return match ? Number(match[1]) : 0;
  }

  async readOnBehalfTabCounts() {
    return {
      waiting: await this.readTabCount(this.waitingForApprovalTab),
      approved: await this.readTabCount(this.approvedTab),
      processed: await this.readTabCount(this.processedTab),
      rejected: await this.readTabCount(this.rejectedTab),
      cancelled: await this.readTabCount(this.cancelledTab),
    };
  }

  onBehalfStatusTabs() {
    return [
      { name: 'Waiting For Approval', tab: this.waitingForApprovalTab },
      { name: 'Approved', tab: this.approvedTab },
      { name: 'Processed', tab: this.processedTab },
      { name: 'Rejected', tab: this.rejectedTab },
      { name: 'Cancelled', tab: this.cancelledTab },
    ];
  }

  async readCurrentYear() {
    const combobox = this.page.getByRole('combobox', { name: /^\d{4}$/ });
    const count = await combobox.count();
    for (let index = 0; index < count; index++) {
      const candidate = combobox.nth(index);
      if (await candidate.isVisible().catch(() => false)) {
        const name = (await candidate.getAttribute('aria-label')) || (await candidate.innerText()).trim();
        const match = name.match(/\d{4}/);
        if (match) {
          return Number(match[0]);
        }
      }
    }
    return new Date().getFullYear();
  }

  employeeDropdownTrigger() {
    return this.page
      .getByText('Select Employee', { exact: true })
      .locator('xpath=following-sibling::*[1]')
      .getByRole('button', { name: 'dropdown trigger' });
  }

  async selectEmployee(employeeName: string, searchText?: string) {
    const filter = searchText ?? employeeName;
    if (await this.selectEmployeeCombobox.isVisible().catch(() => false)) {
      await this.selectEmployeeCombobox.click();
    } else {
      await this.employeeDropdownTrigger().click();
    }

    const searchbox = this.page.getByRole('searchbox');
    if (!(await searchbox.isVisible().catch(() => false))) {
      await this.employeeDropdownTrigger().click();
    }
    await searchbox.waitFor({ state: 'visible', timeout: 10000 });
    await searchbox.fill(filter);
    await this.page.waitForTimeout(1000);

    const escaped = employeeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const option = this.page
      .getByRole('option', { name: new RegExp(escaped, 'i') })
      .or(this.page.getByText(new RegExp(escaped, 'i')));
    await option.first().click({ timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  async selectYear(year: number) {
    const current = await this.readCurrentYear();
    if (current === year) {
      return;
    }
    const combobox = this.page.getByRole('combobox', { name: String(current) });
    await combobox.click();
    await this.page.getByRole('option', { name: String(year), exact: true }).click();
    await this.page.waitForTimeout(800);
  }

  async isApplyOnBehalfDisabled() {
    const disabled = await this.applyOnBehalfButton.isDisabled().catch(() => true);
    const className = (await this.applyOnBehalfButton.getAttribute('class').catch(() => '')) || '';
    return disabled || className.includes('p-disabled') || className.includes('disabled');
  }

  async isApplyOnBehalfEnabled() {
    return !(await this.isApplyOnBehalfDisabled());
  }

  async openApplyOnBehalfDialog() {
    await expect(this.applyOnBehalfButton).toBeEnabled({ timeout: 10000 });
    await this.applyOnBehalfButton.click();
    const dialog = this.requestDialog();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    return dialog;
  }

  async waitForApplyEnabled(timeoutMs = 2000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const enabled = await this.applyButton.isEnabled().catch(() => false);
      const className = (await this.applyButton.getAttribute('class').catch(() => '')) || '';
      if (enabled && !className.includes('p-disabled')) {
        return true;
      }
      await this.page.waitForTimeout(250);
    }
    return false;
  }

  async openLeaveTypeDropdown() {
    const dialog = this.requestDialog();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    const selectedCombo = dialog.getByRole('combobox').first();
    const leaveTypeTrigger = dialog.getByText(/Leave Type\*Please select/i).first();
    if (await selectedCombo.isVisible().catch(() => false)) {
      await selectedCombo.click();
    } else {
      await leaveTypeTrigger.waitFor({ state: 'visible', timeout: 15000 });
      await leaveTypeTrigger.click();
    }
    await this.page.getByRole('option').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async readEntitledLeaveTypesFromOpenDialog() {
    await this.openLeaveTypeDropdown();
    const options = await this.page.getByRole('option').allTextContents();
    await this.page.keyboard.press('Escape');
    return [...new Set(options.map((option) => option.trim()).filter(Boolean))];
  }

  async readEntitledLeaveTypes() {
    const openedHere = !(await this.requestDialog().isVisible().catch(() => false));
    if (openedHere) {
      await this.openApplyOnBehalfDialog();
    }
    const types = await this.readEntitledLeaveTypesFromOpenDialog();
    if (openedHere) {
      await this.closeRequestDialogIfOpen();
    }
    return types;
  }

  async readSelectedLeaveBalance() {
    const dialog = this.requestDialog();
    const dialogText = ((await dialog.innerText().catch(() => '')) || '').replace(/\s+/g, ' ');
    const match = dialogText.match(/Balance\s+.+?\s*:\s*(\d+(?:\.\d+)?)\s*Days/i);
    return match ? Number(match[1]) : null;
  }

  dateInput(field: 'start' | 'end') {
    const dialog = this.requestDialog();
    const label = field === 'start' ? /Start Date\s*\*/ : /End Date\s*\*/;
    return dialog
      .getByRole('textbox', { name: label })
      .or(dialog.locator('p-calendar, p-datepicker').filter({ hasText: label }).locator('input').first())
      .or(dialog.getByText(label).locator('xpath=following::input[1]'))
      .first();
  }

  dateValueMatches(shown: string, isoDate: string) {
    const [year, month, day] = isoDate.split('-');
    const compact = shown.replace(/\s/g, '');
    return (
      compact.includes(isoDate) ||
      compact.includes(`${day}/${month}/${year}`) ||
      compact.includes(`${day}-${month}-${year}`) ||
      compact.includes(`${month}/${day}/${year}`)
    );
  }

  async fillDateField(field: 'start' | 'end', isoDate: string) {
    const input = this.dateInput(field);
    await input.waitFor({ state: 'visible', timeout: 15000 });
    await input.click();
    await this.page.keyboard.press('Escape').catch(() => {});
    const inputType = ((await input.getAttribute('type').catch(() => '')) || '').toLowerCase();
    const value = inputType === 'date' ? isoDate : isoToDmy(isoDate);
    await input.fill('');
    await input.fill(value);
    const shown = ((await input.inputValue().catch(() => '')) || '').trim();
    if (!this.dateValueMatches(shown, isoDate)) {
      await input.fill(isoDate);
    }
    await input.press('Tab');
  }

  async fillStartDate(isoDate: string) {
    await this.fillDateField('start', isoDate);
  }

  async fillEndDate(isoDate: string) {
    await this.fillDateField('end', isoDate);
  }

  async selectOnBehalfAvailing(session: LeaveSession = 'full'): Promise<LeaveSession> {
    const dialog = this.requestDialog();
    const fullDay = this.leavesPage.fullDayRadio;
    await fullDay.waitFor({ state: 'visible', timeout: 10000 });

    if (session === 'full') {
      if (await fullDay.isEnabled().catch(() => false)) {
        await fullDay.check();
        return 'full';
      }
      await fullDay.check({ force: true }).catch(() => {});
      return 'full';
    }

    await this.leavesPage.halfDayRadio.check();
    const halfLabel = session === 'second' ? 'Second Half' : 'First Half';
    const halfRadio = dialog.getByRole('radio', { name: halfLabel });
    if (await halfRadio.isVisible().catch(() => false)) {
      await halfRadio.check();
    }
    return session;
  }

  async isBlockedDateValidation() {
    return (
      (await this.holidayRequestMessage.isVisible().catch(() => false)) ||
      (await this.leavesPage.weekendRequestMessage.isVisible().catch(() => false))
    );
  }

  async fillOnBehalfLeaveForm(
    startDate: string,
    endDate: string,
    reason: string,
    categoryName: string,
    session: LeaveSession = 'full',
  ): Promise<'ok' | 'holiday' | 'no-balance'> {
    const dialog = this.requestDialog();
    if (!(await dialog.isVisible().catch(() => false))) {
      await this.openApplyOnBehalfDialog();
    }
    await this.leavesPage.selectLeaveCategory(categoryName);
    const balance = await this.readSelectedLeaveBalance();
    if (balance !== null && balance <= 0) {
      return 'no-balance';
    }

    await this.fillStartDate(startDate);
    await this.fillEndDate(endDate);
    await this.page.waitForTimeout(400);
    if (await this.isBlockedDateValidation()) {
      return 'holiday';
    }

    await this.selectOnBehalfAvailing(session);
    await this.commentsInput.fill(reason);
    return 'ok';
  }

  async closeRequestDialogIfOpen() {
    await this.leavesPage.closeRequestDialogIfOpen();
  }

  dataRows() {
    return this.page.locator('table tbody tr').filter({
      hasNot: this.page.locator('.p-datatable-emptymessage'),
    });
  }

  leaveRow(dateCell: string, session?: string) {
    return this.leavesPage.leaveRow(dateCell, session);
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

  async collectBookedDates() {
    const dates = new Set<string>();
    for (const { tab } of this.onBehalfStatusTabs()) {
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

  async collectDatesFromOpenTable() {
    const dates = new Set<string>();
    const rows = await this.page.locator('table tbody tr').allTextContents();
    for (const row of rows) {
      const month = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
      const matches = row.match(new RegExp(`(?:${month})[a-z]*\\.?\\s+\\d{1,2}(?:,?\\s*\\d{4})?`, 'gi')) || [];
      for (const match of matches) {
        const parsed = workedDateToInput(match);
        if (parsed) {
          dates.add(parsed);
        }
      }
      const iso = row.match(/\b\d{4}-\d{2}-\d{2}\b/g) || [];
      for (const match of iso) {
        dates.add(match);
      }
    }
    return dates;
  }

  async tryApplyLeaveOnBehalf(
    startDate: string,
    endDate: string,
    categoryName: string,
    session: LeaveSession = 'full',
  ): Promise<'submitted' | 'holiday' | 'skipped'> {
    await this.closeRequestDialogIfOpen();
    const dialog = await this.openApplyOnBehalfDialog();
    const filled = await this.fillOnBehalfLeaveForm(
      startDate,
      endDate,
      `On-behalf leave ${startDate}`,
      categoryName,
      session,
    );

    if (filled === 'no-balance') {
      await this.closeRequestDialogIfOpen();
      return 'skipped';
    }

    if (filled === 'holiday' || (await this.isBlockedDateValidation())) {
      claimOnBehalfLeaveDate(startDate);
      claimOnBehalfLeaveDate(endDate);
      await this.closeRequestDialogIfOpen();
      return 'holiday';
    }

    if (await this.insufficientBalanceMessage.isVisible().catch(() => false)) {
      await this.closeRequestDialogIfOpen();
      return 'skipped';
    }

    if (!(await this.waitForApplyEnabled(5000))) {
      if (await this.isBlockedDateValidation()) {
        claimOnBehalfLeaveDate(startDate);
        await this.closeRequestDialogIfOpen();
        return 'holiday';
      }
      await this.closeRequestDialogIfOpen();
      return 'skipped';
    }

    await this.applyButton.click();

    if (await this.isBlockedDateValidation()) {
      claimOnBehalfLeaveDate(startDate);
      await this.closeRequestDialogIfOpen();
      return 'holiday';
    }

    const blocked = await this.insufficientBalanceMessage
      .or(this.leavesPage.duplicateRequestMessage)
      .waitFor({ state: 'visible', timeout: 2500 })
      .then(() => true)
      .catch(() => false);
    if (blocked) {
      claimOnBehalfLeaveDate(startDate);
      await this.closeRequestDialogIfOpen();
      return 'skipped';
    }

    try {
      await this.submittedToast.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
      await dialog.waitFor({ state: 'hidden', timeout: 20000 });
      return 'submitted';
    } catch {
      await this.closeRequestDialogIfOpen();
      return 'skipped';
    }
  }

  async applyAvailableLeaveOnBehalf(): Promise<CreatedLeaveRequest> {
    const types = await this.readEntitledLeaveTypes();
    if (types.length === 0) {
      throw new Error('No entitled leave types in Leave Type dropdown');
    }

    const dates = randomFutureWeekdays(8);
    for (const date of dates) {
      for (const categoryName of types) {
        const result = await this.tryApplyLeaveOnBehalf(date.input, date.input, categoryName, 'full');
        if (result === 'submitted') {
          return { ...date, categoryName, session: 'full' };
        }
        if (result === 'holiday') {
          break;
        }
      }
    }

    throw new Error('Could not submit on-behalf leave on any entitled type or available date');
  }
}
