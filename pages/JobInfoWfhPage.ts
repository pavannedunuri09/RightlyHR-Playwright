import { type Locator, type Page } from '@playwright/test';
import { weekdayDate } from './WorkFromHomePage';

export class JobInfoWfhPage {
  readonly page: Page;
  readonly employeesIcon: Locator;
  readonly employeesNav: Locator;
  readonly employeeSearch: Locator;
  readonly jobTab: Locator;
  readonly jobInfo: Locator;
  readonly wfhRemoteLoginLink: Locator;
  readonly allocateButton: Locator;
  readonly workLocation: Locator;
  readonly wfhManager: Locator;
  readonly submitButton: Locator;
  readonly effectiveFromHeader: Locator;
  readonly allocationTypeHeader: Locator;
  readonly allocatedLocationHeader: Locator;
  readonly allocatedManagerHeader: Locator;
  readonly statusHeader: Locator;
  readonly activeStatus: Locator;
  readonly inactiveStatus: Locator;
  readonly availableStatus: Locator;
  readonly wfhActiveRow: Locator;
  readonly wfhInactiveRow: Locator;
  readonly wfhAvailableRow: Locator;
  readonly remoteLoginActiveRow: Locator;
  readonly remoteLoginInactiveRow: Locator;
  readonly remoteLoginAvailableRow: Locator;
  readonly remoteLoginManager: Locator;
  readonly duplicateEffectiveDateMessage: Locator;
  readonly alreadyAllocatedMessage: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeesIcon = page.locator('img[src="/main-menu-icons/employee-management-icon.png"]');
    this.employeesNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Employees' });
    this.employeeSearch = page.getByRole('searchbox', { name: 'Username' });
    this.jobTab = page.getByText('Job', { exact: true });
    this.jobInfo = page.locator('div').filter({ hasText: /^Job Info$/ }).first();
    this.wfhRemoteLoginLink = page.getByRole('link', { name: 'WFH / Remote Login' });
    this.allocateButton = page.getByText('Allocate', { exact: true });
    this.workLocation = page.getByRole('combobox', { name: 'Select Work Location' });
    this.wfhManager = page.getByRole('combobox', { name: 'Select Work From Home Manager' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.effectiveFromHeader = page.getByRole('columnheader', { name: 'Effective From' });
    this.allocationTypeHeader = page.getByRole('columnheader', { name: 'Allocation Type' });
    this.allocatedLocationHeader = page.getByRole('columnheader', { name: 'Allocated Location' });
    this.allocatedManagerHeader = page.getByRole('columnheader', { name: 'Allocated Manager' });
    this.statusHeader = page.getByRole('columnheader', { name: 'Status' });
    this.activeStatus = page.getByRole('cell', { name: 'Active', exact: true });
    this.inactiveStatus = page.getByRole('cell', { name: 'Inactive', exact: true });
    this.availableStatus = page.getByRole('cell', { name: /^(Available|Assigned)$/ });
    this.wfhActiveRow = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: 'WFH', exact: true }),
    }).filter({
      has: page.getByRole('cell', { name: 'Active', exact: true }),
    });
    this.wfhInactiveRow = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: 'WFH', exact: true }),
    }).filter({
      has: page.getByRole('cell', { name: 'Inactive', exact: true }),
    });
    this.wfhAvailableRow = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: 'WFH', exact: true }),
    }).filter({
      has: page.getByRole('cell', { name: /^(Available|Assigned)$/ }),
    });
    this.remoteLoginActiveRow = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: 'Remote Login', exact: true }),
    }).filter({
      has: page.getByRole('cell', { name: 'Active', exact: true }),
    });
    this.remoteLoginInactiveRow = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: 'Remote Login', exact: true }),
    }).filter({
      has: page.getByRole('cell', { name: 'Inactive', exact: true }),
    });
    this.remoteLoginAvailableRow = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: 'Remote Login', exact: true }),
    }).filter({
      has: page.getByRole('cell', { name: /^(Available|Assigned)$/ }),
    });
    this.remoteLoginManager = page.getByRole('combobox', { name: 'Select Remote Login Manager' });
    this.duplicateEffectiveDateMessage = page.getByText('A record already exists for the selected effective date.');
    this.alreadyAllocatedMessage = page.getByText(/already/i);
    this.cancelButton = page.getByRole('dialog').getByRole('button', { name: 'Cancel' });
  }

  async openEmployeeJobWfh(employeeName: string, searchText: string) {
    await this.employeesIcon.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000);
    await this.employeesIcon.click();
    try {
      await this.page.waitForURL(/\/employee-management/, { timeout: 10000 });
    } catch {
      await this.employeesIcon.click();
      try {
        await this.page.waitForURL(/\/employee-management/, { timeout: 8000 });
      } catch {
        await this.page.goto('/employee-management/active/employees');
      }
    }
    await this.employeeSearch.waitFor({ state: 'visible' });

    await this.employeeSearch.click();
    await this.employeeSearch.fill(searchText);
    await this.employeeSearch.press('Enter');

    const employeeInTable = this.page.locator('[id$="-table"]').getByText(employeeName);
    await employeeInTable.click({ timeout: 15000 });

    await this.jobTab.click();
    await this.jobInfo.click();
    await this.wfhRemoteLoginLink.click();
    await this.allocateButton.waitFor({ state: 'visible' });
  }

  async unusedEffectiveFrom(startAhead = 7) {
    const tableText = await this.page.locator('table').innerText();
    for (let ahead = startAhead; ahead < startAhead + 60; ahead++) {
      const candidate = weekdayDate(ahead);
      const [year, month, day] = candidate.input.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const tableDate = `${String(date.getDate()).padStart(2, '0')} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
      if (!tableText.includes(tableDate)) {
        return candidate.input;
      }
    }
    return weekdayDate(startAhead).input;
  }

  todayEffectiveFrom() {
    const date = new Date();
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
  }

  firstExistingEffectiveFrom() {
    return this.page.locator('table tbody tr').first().getByRole('cell').first().textContent().then((text) => {
      if (!text?.trim()) {
        return null;
      }
      const parsed = new Date(text.trim());
      if (Number.isNaN(parsed.getTime())) {
        return null;
      }
      return [
        parsed.getFullYear(),
        String(parsed.getMonth() + 1).padStart(2, '0'),
        String(parsed.getDate()).padStart(2, '0'),
      ].join('-');
    });
  }

  async fillAllocateForm(effectiveFrom: string, managerLabel: string) {
    await this.allocateButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });

    await dialog.getByText('Allow Work From Home *', { exact: true }).locator('..').getByRole('button', { name: 'dropdown trigger' }).click();
    await this.page.getByRole('option', { name: 'Yes', exact: true }).click();

    await dialog.getByText('Allow Remote Login *', { exact: true }).locator('..').getByRole('button', { name: 'dropdown trigger' }).click();
    await this.page.getByRole('option', { name: 'No', exact: true }).click();

    const workLocationTrigger = dialog
      .getByText('Work From Home Work Location *', { exact: true })
      .locator('..')
      .getByRole('button', { name: 'dropdown trigger' });
    await workLocationTrigger.waitFor({ state: 'visible' });
    await workLocationTrigger.click();
    try {
      await this.page.getByLabel('Option List').getByText('Work From Home').click({ timeout: 5000 });
    } catch {
      await this.page.getByRole('option', { name: 'Work From Home' }).click();
    }

    const managerTrigger = dialog
      .getByText('Work From Home Manager *', { exact: true })
      .locator('..')
      .getByRole('button', { name: 'dropdown trigger' });
    await managerTrigger.click();
    try {
      await this.page.getByRole('option').filter({ hasText: managerLabel }).click({ timeout: 5000 });
    } catch {
      await this.page.getByRole('option').filter({ hasText: 'SD302262' }).click();
    }

    const dateInput = dialog.getByRole('textbox').first();
    await dateInput.fill(effectiveFrom);
    return dialog;
  }

  async allocateWfh(effectiveFrom: string, managerLabel: string, options?: { inactivateOther?: boolean }) {
    if (options?.inactivateOther !== false) {
      await this.inactivateActiveRow('Remote Login');
    }
    const dialog = await this.fillAllocateForm(effectiveFrom, managerLabel);
    await this.submitButton.click();
    try {
      await dialog.waitFor({ state: 'hidden', timeout: 8000 });
    } catch {
      await dialog.getByRole('textbox').first().fill(effectiveFrom);
      await this.submitButton.click();
      await dialog.waitFor({ state: 'hidden', timeout: 15000 });
    }
  }

  async submitAllocateKeepingDialog(effectiveFrom: string, managerLabel: string) {
    await this.fillAllocateForm(effectiveFrom, managerLabel);
    await this.submitButton.click();
  }

  activeRow(allocationType: 'WFH' | 'Remote Login') {
    return allocationType === 'WFH' ? this.wfhActiveRow : this.remoteLoginActiveRow;
  }

  async fillAllocateRemoteLoginForm(effectiveFrom: string, managerLabel: string) {
    await this.allocateButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible' });

    await dialog.getByText('Allow Work From Home *', { exact: true }).locator('..').getByRole('button', { name: 'dropdown trigger' }).click();
    await this.page.getByRole('option', { name: 'No', exact: true }).click();

    await dialog.getByText('Allow Remote Login *', { exact: true }).locator('..').getByRole('button', { name: 'dropdown trigger' }).click();
    await this.page.getByRole('option', { name: 'Yes', exact: true }).click();

    const locationTrigger = dialog
      .getByText(/Work Location \*/)
      .locator('..')
      .getByRole('button', { name: 'dropdown trigger' })
      .first();
    await locationTrigger.waitFor({ state: 'visible' });
    await locationTrigger.click();
    try {
      await this.page.getByRole('option', { name: 'Remote', exact: true }).click({ timeout: 5000 });
    } catch {
      await this.page.getByText('Remote', { exact: true }).click();
    }

    const managerCombo = dialog.getByRole('combobox', { name: /Select Remote Login Manager/i });
    if (await managerCombo.isVisible().catch(() => false)) {
      await managerCombo.click();
    } else {
      await dialog
        .getByText(/Remote Login Manager \*/)
        .locator('..')
        .getByRole('button', { name: 'dropdown trigger' })
        .click();
    }
    try {
      await this.page.getByRole('option').filter({ hasText: managerLabel }).click({ timeout: 5000 });
    } catch {
      await this.page.getByText('SD302262 - saii Pavan Dinesh').click();
    }

    const dateInput = dialog.getByRole('textbox').first();
    await dateInput.fill(effectiveFrom);
    return dialog;
  }

  async allocateRemoteLogin(effectiveFrom: string, managerLabel: string, options?: { inactivateOther?: boolean }) {
    if (options?.inactivateOther !== false) {
      await this.inactivateActiveRow('WFH');
    }
    if (await this.remoteLoginActiveRow.isVisible().catch(() => false)) {
      return;
    }
    const dialog = await this.fillAllocateRemoteLoginForm(effectiveFrom, managerLabel);
    await this.submitButton.click();
    try {
      await dialog.waitFor({ state: 'hidden', timeout: 8000 });
    } catch {
      await dialog.getByRole('textbox').first().fill(effectiveFrom);
      await this.submitButton.click();
      await dialog.waitFor({ state: 'hidden', timeout: 15000 });
    }
  }

  kebabMenuItem(name: string) {
    return this.page.locator('a.dropdown-item').getByText(name, { exact: true });
  }

  async openRowKebab(row: Locator) {
    const kebab = row.locator('.dropdown.ng-star-inserted').first();
    if (await kebab.isVisible().catch(() => false)) {
      await kebab.click();
      await this.page.waitForTimeout(300);
      return true;
    }
    const fallback = row.locator('.dropdown').last();
    if (await fallback.isVisible().catch(() => false)) {
      await fallback.click({ timeout: 5000 }).catch(() => {});
      await this.page.waitForTimeout(300);
      return true;
    }
    return false;
  }

  inactiveRow(allocationType: 'WFH' | 'Remote Login') {
    return allocationType === 'WFH' ? this.wfhInactiveRow : this.remoteLoginInactiveRow;
  }

  availableRow(allocationType: 'WFH' | 'Remote Login') {
    return allocationType === 'WFH' ? this.wfhAvailableRow : this.remoteLoginAvailableRow;
  }

  async activeAllocationCount() {
    const wfh = await this.wfhActiveRow.count();
    const remoteLogin = await this.remoteLoginActiveRow.count();
    return (wfh > 0 ? 1 : 0) + (remoteLogin > 0 ? 1 : 0);
  }

  async inactivateActiveRow(allocationType: 'WFH' | 'Remote Login') {
    const row = this.activeRow(allocationType).first();
    if (!(await row.isVisible().catch(() => false))) {
      return;
    }
    const opened = await this.openRowKebab(row);
    if (!opened) {
      return;
    }
    const inactiveItem = this.kebabMenuItem('Inactive');
    if (!(await inactiveItem.isVisible().catch(() => false))) {
      return;
    }
    await inactiveItem.click();
    await this.page.getByRole('button', { name: 'Yes', exact: true }).click();
    await this.page.getByRole('dialog').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  async activateInactiveRow(allocationType: 'WFH' | 'Remote Login') {
    const row = this.inactiveRow(allocationType).first();
    if (!(await row.isVisible().catch(() => false))) {
      return false;
    }
    await this.openRowKebab(row);
    const activateItem = this.page.locator('a.dropdown-item').getByText(/Active|Activate/i);
    const updateItem = this.kebabMenuItem('Update');
    if (await activateItem.first().isVisible().catch(() => false)) {
      await activateItem.first().click();
      const yesButton = this.page.getByRole('button', { name: 'Yes', exact: true });
      if (await yesButton.isVisible().catch(() => false)) {
        await yesButton.click();
      }
      await this.page.getByRole('dialog').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
      return this.activeRow(allocationType).first().isVisible().catch(() => false);
    }
    if (await updateItem.isVisible().catch(() => false)) {
      await updateItem.click();
      const dialog = this.page.getByRole('dialog');
      await dialog.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      if (await dialog.isVisible().catch(() => false)) {
        const dateInput = dialog.getByRole('textbox').first();
        if (await dateInput.isVisible().catch(() => false)) {
          await dateInput.fill(this.todayEffectiveFrom());
        }
        const statusTrigger = dialog.getByRole('button', { name: 'dropdown trigger' }).filter({
          hasText: /Inactive|Available|Assigned|Status/i,
        }).first();
        if (await statusTrigger.isVisible().catch(() => false)) {
          await statusTrigger.click();
          await this.page.getByRole('option', { name: 'Active', exact: true }).click().catch(() => {});
        }
        const updateButton = dialog.getByRole('button', { name: /^(Update|Submit)$/ });
        if (await updateButton.first().isVisible().catch(() => false)) {
          await updateButton.first().click();
        }
        await dialog.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
      }
      return this.activeRow(allocationType).first().isVisible().catch(() => false);
    }
    await this.page.keyboard.press('Escape');
    return false;
  }

  async ensureWfhActiveForToday(managerLabel: string) {
    if (await this.wfhActiveRow.isVisible().catch(() => false)) {
      return;
    }
    await this.inactivateActiveRow('Remote Login');
    await this.allocateWfh(this.todayEffectiveFrom(), managerLabel, { inactivateOther: false });
  }

  async ensureRemoteLoginActiveForToday(managerLabel: string) {
    if (await this.remoteLoginActiveRow.isVisible().catch(() => false)) {
      return;
    }
    await this.inactivateActiveRow('WFH');
    await this.allocateRemoteLogin(this.todayEffectiveFrom(), managerLabel, { inactivateOther: false });
  }

  async allocateFutureAvailable(allocationType: 'WFH' | 'Remote Login', managerLabel: string) {
    const types: Array<'WFH' | 'Remote Login'> = allocationType === 'Remote Login'
      ? ['Remote Login', 'WFH']
      : ['WFH', 'Remote Login'];
    for (const type of types) {
      for (const startAhead of [14, 21, 28, 35]) {
        const effectiveFrom = await this.unusedEffectiveFrom(startAhead);
        try {
          if (type === 'WFH') {
            await this.allocateWfh(effectiveFrom, managerLabel, { inactivateOther: false });
          } else {
            await this.allocateRemoteLogin(effectiveFrom, managerLabel, { inactivateOther: false });
          }
        } catch {
          await this.cancelButton.click().catch(() => {});
          await this.page.keyboard.press('Escape');
          continue;
        }
        const dialog = this.page.getByRole('dialog');
        if (await dialog.isVisible().catch(() => false)) {
          await this.cancelButton.click().catch(() => {});
          await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
          continue;
        }
        if (await this.availableStatus.first().isVisible().catch(() => false)) {
          return effectiveFrom;
        }
      }
    }
    throw new Error('Could not create an Available WFH or Remote Login allocation for a future date');
  }

  async peekTimeOffTabs() {
    const timeOffNav = this.page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Time Off' });
    const toggle = timeOffNav.locator('[data-bs-toggle="dropdown"]');
    await timeOffNav.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(1500);
    if (!(await this.page.locator('app-time-off-tabs').isVisible().catch(() => false))) {
      await toggle.click();
    }
    await this.page.locator('app-time-off-tabs').waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    return {
      wfh: this.page.locator('app-time-off-tabs').locator('.grid-item').filter({ hasText: /^WFH$/ }),
      remoteLogin: this.page.locator('app-time-off-tabs').locator('.grid-item').filter({ hasText: /Remote\s?Login/i }),
    };
  }

  async openUserValidationIfPresent() {
    const nav = this.page.locator('#sidenav-main-drop .nav-item').filter({ hasText: /User Validation/i });
    if (await nav.first().isVisible().catch(() => false)) {
      const toggle = nav.first().locator('[data-bs-toggle="dropdown"]');
      if (await toggle.isVisible().catch(() => false)) {
        await toggle.click();
      } else {
        await nav.first().click();
      }
      await this.page.waitForTimeout(2000);
      return true;
    }
    const link = this.page.getByText(/User Validation/i).first();
    if (await link.isVisible().catch(() => false)) {
      await link.click();
      await this.page.waitForTimeout(2000);
      return true;
    }
    return false;
  }
}
