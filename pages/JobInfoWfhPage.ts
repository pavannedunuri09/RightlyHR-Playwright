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
  readonly wfhActiveRow: Locator;
  readonly remoteLoginInactiveRow: Locator;
  readonly duplicateEffectiveDateMessage: Locator;
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
    this.wfhActiveRow = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: 'WFH', exact: true }),
    }).filter({
      has: page.getByRole('cell', { name: 'Active', exact: true }),
    });
    this.remoteLoginInactiveRow = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: 'Remote Login', exact: true }),
    }).filter({
      has: page.getByRole('cell', { name: 'Inactive', exact: true }),
    });
    this.duplicateEffectiveDateMessage = page.getByText('A record already exists for the selected effective date.');
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

  async allocateWfh(effectiveFrom: string, managerLabel: string) {
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
}
