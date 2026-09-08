import { expect, type Locator, type Page } from '@playwright/test';
import { RemoteLoginPage } from './RemoteLoginPage';
import {
  WorkFromHomePage,
  daysFromToday,
  weekdayDate,
  workedDateToInput,
} from './WorkFromHomePage';

const MAX_ADVANCE_DAYS = 120;
const claimedOnBehalfWfhDates = new Set<string>();

function claimOnBehalfWfhDate(input: string) {
  claimedOnBehalfWfhDates.add(input);
}

function onBehalfStartAhead() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const novemberFirst = new Date(now.getFullYear(), 10, 1);
  const daysUntilNovember = Math.round((novemberFirst.getTime() - now.getTime()) / 86400000);
  if (daysUntilNovember >= 1 && daysUntilNovember <= MAX_ADVANCE_DAYS) {
    return daysUntilNovember;
  }
  return 14;
}

function isOnBehalfMonthBlocked(input: string) {
  const month = Number(input.slice(5, 7));
  return month === 9 || month === 10;
}

export class OnBehalfWfhPage {
  readonly page: Page;
  readonly wfhPage: WorkFromHomePage;
  readonly remoteLoginPage: RemoteLoginPage;
  readonly onBehalfNav: Locator;
  readonly onBehalfToggle: Locator;
  readonly onBehalfWfhTab: Locator;
  readonly selectEmployeeCombobox: Locator;
  readonly applyOnBehalfButton: Locator;
  readonly noDataFoundCard: Locator;
  readonly waitingForApprovalTab: Locator;
  readonly approvedTab: Locator;
  readonly processedTab: Locator;
  readonly rejectedTab: Locator;
  readonly cancelledTab: Locator;
  readonly submittedToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.wfhPage = new WorkFromHomePage(page);
    this.remoteLoginPage = new RemoteLoginPage(page);
    this.onBehalfNav = page.locator('#sidenav-main-drop > div:nth-child(8)');
    this.onBehalfToggle = this.onBehalfNav;
    this.onBehalfWfhTab = page.locator('.grid-item:visible').filter({ hasText: /^WFH$/i });
    this.selectEmployeeCombobox = page.getByRole('combobox', { name: /Please select employee|Select employee name/i });
    this.applyOnBehalfButton = page.getByRole('button', { name: /Apply On Behalf Of/i });
    this.noDataFoundCard = page.getByText('No Data Found...');
    this.waitingForApprovalTab = page.getByText(/Waiting For Approval \(\d+\)/).first();
    this.approvedTab = page.getByText(/Approved \(\d+\)/).first();
    this.processedTab = page.getByText(/Processed \(\d+\)/).first();
    this.rejectedTab = page.getByText(/Rejected \(\d+\)/).first();
    this.cancelledTab = page.getByText(/Cancelled \(\d+\)/).first();
    this.submittedToast = page.getByText(/WFH request|WFH processed|Work from home processed/i).filter({
      hasNotText: /already|exist|duplicate|Rejected/i,
    });
  }

  yearCombobox(year?: number) {
    const label = year ?? new Date().getFullYear();
    return this.page.getByRole('combobox', { name: String(label) });
  }

  async validateUserOnDashboard() {
    await this.page.goto('/dashboard/emp');
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible' });
  }

  async openOnBehalfMenu() {
    await this.closeRequestDialogIfOpen();
    await this.onBehalfNav.waitFor({ state: 'visible' });
    if (await this.onBehalfWfhTab.isVisible().catch(() => false)) {
      return;
    }
    await this.onBehalfNav.click();
    await this.onBehalfWfhTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openWfhFromDashboard() {
    await this.validateUserOnDashboard();
    await this.openOnBehalfMenu();
    await this.onBehalfWfhTab.click();
    await this.page.waitForURL(/on-?behalf|\/time-off\/on-behalf/i, { timeout: 15000 });
    await this.applyOnBehalfButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async readTabCount(tab: Locator) {
    const text = (await tab.innerText()).replace(/\s+/g, ' ').trim();
    const match = text.match(/\((\d+)\)\s*$/);
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

  async selectEmployee(employeeName: string, searchText?: string) {
    const filter = searchText ?? employeeName;
    const employeeDropdown = this.page.locator('#pn_id_8').getByRole('button', { name: 'dropdown trigger' });
    if (await employeeDropdown.isVisible().catch(() => false)) {
      await employeeDropdown.click();
    } else {
      await this.selectEmployeeCombobox.click();
    }
    const searchbox = this.page.getByRole('searchbox');
    await searchbox.waitFor({ state: 'visible', timeout: 5000 });
    await searchbox.fill(filter);
    await this.page.waitForTimeout(800);
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
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    return dialog;
  }

  async fillOnBehalfRequestForm(
    workedDate: string,
    reason: string,
    session: 'first' | 'second' | 'full' = 'first',
  ) {
    const rl = this.remoteLoginPage;
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    await rl.workedDateInput.fill(workedDate);
    await rl.workedDateInput.blur();
    await rl.selectAvailing(session);
    await rl.reasonInput.fill(reason);
    return dialog;
  }

  async openFilledOnBehalfRequestForm(startAhead?: number) {
    const dates = await this.findAvailableWeekdays(1, startAhead);
    const date = dates[0];
    await this.openApplyOnBehalfDialog();
    await this.fillOnBehalfRequestForm(date.input, `Cancel on-behalf WFH ${date.input}`, 'first');
    return date;
  }

  async clickRequestFormCancel() {
    await this.remoteLoginPage.cancelRequestButton.click();
    await this.remoteLoginPage.cancelConfirmMessage.waitFor({ state: 'visible', timeout: 15000 });
  }

  async closeRequestDialogIfOpen() {
    await this.remoteLoginPage.closeRequestDialogIfOpen();
  }

  requestRow(workedDateCell: string, employeeName: string) {
    const dateLabel = workedDateCell.replace(/,$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: new RegExp(`^${dateLabel}(,|$)`) }),
    }).filter({ hasText: employeeName });
  }

  sessionRow(workedDateCell: string, session: string, employeeName: string) {
    return this.requestRow(workedDateCell, employeeName).filter({ hasText: session });
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

  async collectWorkedDates() {
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

  isDateUnavailable(input: string, booked: Set<string>) {
    const daysOut = daysFromToday(input);
    return (
      isOnBehalfMonthBlocked(input) ||
      daysOut < 1 ||
      daysOut > MAX_ADVANCE_DAYS ||
      booked.has(input) ||
      claimedOnBehalfWfhDates.has(input)
    );
  }

  async findAvailableWeekdays(count: number, startAhead?: number) {
    const booked = new Set([...claimedOnBehalfWfhDates, ...(await this.collectWorkedDates())]);
    const found: ReturnType<typeof weekdayDate>[] = [];
    const seen = new Set<string>();
    const start = startAhead ?? onBehalfStartAhead();

    for (let ahead = start; found.length < count && ahead <= MAX_ADVANCE_DAYS; ahead++) {
      const candidate = weekdayDate(ahead);
      if (seen.has(candidate.input) || this.isDateUnavailable(candidate.input, booked)) {
        continue;
      }
      seen.add(candidate.input);
      found.push(candidate);
    }
    if (found.length === 0) {
      throw new Error(`Could not find ${count} unused on-behalf WFH weekday(s)`);
    }
    return found;
  }

  async tryApplyWfhOnBehalf(
    workedDate: string,
    reason: string,
    session: 'first' | 'second' | 'full' = 'first',
  ) {
    await this.closeRequestDialogIfOpen();
    const dialog = await this.openApplyOnBehalfDialog();
    await this.fillOnBehalfRequestForm(workedDate, reason, session);
    await this.page.waitForTimeout(400);

    if (!(await this.remoteLoginPage.waitForRequestSubmitEnabled(3000))) {
      claimOnBehalfWfhDate(workedDate);
      await this.closeRequestDialogIfOpen();
      return false;
    }

    await this.remoteLoginPage.requestButton.click();
    const duplicate = await this.remoteLoginPage.duplicateRequestMessage
      .waitFor({ state: 'visible', timeout: 2000 })
      .then(() => true)
      .catch(() => false);
    if (duplicate) {
      claimOnBehalfWfhDate(workedDate);
      await this.closeRequestDialogIfOpen();
      return false;
    }

    try {
      await this.submittedToast.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
      await dialog.waitFor({ state: 'hidden', timeout: 20000 });
      claimOnBehalfWfhDate(workedDate);
      return true;
    } catch {
      claimOnBehalfWfhDate(workedDate);
      await this.closeRequestDialogIfOpen();
      return false;
    }
  }

  async applyWfhOnBehalf(
    workedDate: string,
    reason: string,
    session: 'first' | 'second' | 'full' = 'first',
  ) {
    const submitted = await this.tryApplyWfhOnBehalf(workedDate, reason, session);
    if (!submitted) {
      throw new Error(`On-behalf WFH was not submitted for ${workedDate}`);
    }
  }

  async applyAvailableWfhOnBehalf(startAhead?: number) {
    const dates = await this.findAvailableWeekdays(5, startAhead);
    for (const date of dates) {
      if (await this.tryApplyWfhOnBehalf(date.input, `On-behalf WFH ${date.input}`, 'first')) {
        return date;
      }
    }
    throw new Error('Could not submit on-behalf WFH on any available date');
  }

  dataRows() {
    return this.wfhPage.dataRows();
  }

  async assertSortableColumnsCycle(tabName: string) {
    await this.wfhPage.assertSortableColumnsCycle(tabName);
  }
}
