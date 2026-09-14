import { expect, type Locator, type Page } from '@playwright/test';

export type EmployeeDetails = {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  employeeId?: string;
};

export class ProspectiveEmployeePage {
  readonly page: Page;
  readonly employeesIcon: Locator;
  readonly employeesTab: Locator;
  readonly prospectiveTab: Locator;
  readonly employeesListTab: Locator;
  readonly activeEmployeesTab: Locator;
  readonly probationTab: Locator;
  readonly employeeSearch: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeesIcon = page.locator('img[src="/main-menu-icons/employee-management-icon.png"]');
    this.employeesTab = page.locator('#sidenav-main-drop').getByText('Employees', { exact: true });
    this.prospectiveTab = page.getByText('Prospective', { exact: true });
    this.employeesListTab = page.locator('a[href="/employee-management/prospective/employees"]');
    this.activeEmployeesTab = page.locator('a[href="/employee-management/active/employees"]');
    this.probationTab = page.getByText(/^Probation\(\d+\)$/);
    this.employeeSearch = page.getByRole('searchbox', { name: 'Username' }).or(page.getByRole('searchbox'));
  }

  async openProspectiveEmployeesList() {
    if (/\/employee-management\/prospective\/employees/.test(this.page.url())) {
      await this.employeeSearch.waitFor({ state: 'visible', timeout: 20000 });
      return;
    }

    await this.openEmployeesModule();
    await this.prospectiveTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.prospectiveTab.click();
    await this.page.waitForURL(/\/employee-management\/prospective/, {
      timeout: 15000,
      waitUntil: 'commit',
    }).catch(() => {});

    if (await this.employeesListTab.isVisible().catch(() => false)) {
      await this.employeesListTab.click();
    } else {
      await this.page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });
    }

    await this.page.waitForURL(/\/employee-management\/prospective\/employees/, {
      timeout: 15000,
      waitUntil: 'commit',
    }).catch(() => {});
    await this.employeeSearch.waitFor({ state: 'visible', timeout: 20000 });
  }

  async searchEmployee(query: string) {
    await this.employeeSearch.waitFor({ state: 'visible', timeout: 20000 });
    await this.employeeSearch.click();
    await this.employeeSearch.fill(query);
    await this.employeeSearch.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  employeeRow(query: string) {
    return this.page.getByRole('row').filter({ hasText: query }).first();
  }

  async openEmployeeProfile(details: EmployeeDetails) {
    const query = details.email || `${details.firstName} ${details.lastName}`;
    await this.searchEmployee(query);
    const row = this.employeeRow(query);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    const fullName = details.fullName ?? `${details.firstName} ${details.lastName}`;
    const nameCell = row.getByRole('cell', { name: fullName }).or(row.getByText(fullName));
    await nameCell.first().click();
    await this.page.getByText('Personal', { exact: true }).or(this.page.getByText('Job', { exact: true })).first()
      .waitFor({ state: 'visible', timeout: 20000 });
  }

  async expectEmployeeHiddenInList(email: string) {
    await this.openProspectiveEmployeesList();
    await this.searchEmployee(email);
    await expect(this.employeeRow(email)).toBeHidden({ timeout: 15000 });
  }

  async expectEmployeeVisibleInProbation(details: EmployeeDetails) {
    await this.openProbationEmployeesList();
    const query = details.email || details.firstName;
    await this.searchEmployee(query);
    const fullName = details.fullName ?? `${details.firstName} ${details.lastName}`;
    const row = this.employeeRow(fullName).or(this.employeeRow(details.email));
    await expect(row.first()).toBeVisible({ timeout: 15000 });
  }

  async openProbationEmployeeProfile(details: EmployeeDetails) {
    await this.openProbationEmployeesList();
    const query = details.email || details.firstName;
    await this.searchEmployee(query);
    const fullName = details.fullName ?? `${details.firstName} ${details.lastName}`;
    let row = this.employeeRow(fullName);
    if (!(await row.isVisible({ timeout: 8000 }).catch(() => false))) {
      await this.searchEmployee(details.firstName);
      row = this.employeeRow(fullName);
    }
    await expect(row).toBeVisible({ timeout: 15000 });
    await row.getByText(fullName).click();
    await this.page.getByText('Personal', { exact: true }).or(this.page.getByText('Job', { exact: true })).first()
      .waitFor({ state: 'visible', timeout: 20000 });
  }

  private async openProbationEmployeesList() {
    await this.openEmployeesModule();

    if (await this.probationTab.first().isVisible().catch(() => false)) {
      await this.probationTab.first().click();
    } else {
      await this.page.goto('/employee-management/active/employees', { waitUntil: 'domcontentloaded' });
      await this.probationTab.first().waitFor({ state: 'visible', timeout: 15000 });
      await this.probationTab.first().click();
    }

    await this.page.waitForURL(/\/employee-management\/.*probation|\/employee-management\/active/i, {
      timeout: 15000,
    }).catch(() => {});
    await this.employeeSearch.waitFor({ state: 'visible', timeout: 20000 });
  }

  private async openEmployeesModule() {
    if (/\/employee-management/.test(this.page.url())) {
      return;
    }

    await this.employeesIcon.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForTimeout(2000);
    await this.employeesIcon.click();
    try {
      await this.page.waitForURL(/\/employee-management/, { timeout: 10000, waitUntil: 'commit' });
    } catch {
      await this.employeesTab.click();
      try {
        await this.page.waitForURL(/\/employee-management/, { timeout: 8000, waitUntil: 'commit' });
      } catch {
        await this.page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });
      }
    }
  }
}
