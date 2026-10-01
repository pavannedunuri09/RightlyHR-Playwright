import { expect, type Locator, type Page } from '@playwright/test';

export type EmployeeListType = 'active' | 'probation';

export class EmployeeInfoPage {
  readonly page: Page;

  selectedEmployeeName = '';
  selectedListType: EmployeeListType = 'active';

  // Employee navigation
  readonly employeesMenu: Locator;
  readonly activeEmployeesTab: Locator;
  readonly probationEmployeesTab: Locator;
  readonly employeeSearch: Locator;
  readonly employeeTableRows: Locator;

  // Employee profile tabs
  readonly personalTab: Locator;
  readonly basicInfo: Locator;
  readonly employeeInfoLink: Locator;

  // Basic Info fields
  readonly employeeId: Locator;
  readonly salutation: Locator;
  readonly gender: Locator;
  readonly maritalStatus: Locator;
  readonly bloodGroup: Locator;
  readonly dateOfBirth: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.employeesMenu = page
      .getByRole('img', { name: 'Icon' })
      .nth(2);

    this.activeEmployeesTab = page
      .locator('a[href="/employee-management/active/employees"]')
      .or(page.getByText(/^Active\(\d+\)$/));

    this.probationEmployeesTab = page.getByRole('listitem').filter({ hasText: /Probation/i })
      .or(page.getByText(/^Probation\s*\(\d+\)$/));

    this.employeeSearch = page
      .getByRole('searchbox', { name: 'Username' })
      .or(page.getByRole('searchbox'));

    this.employeeTableRows = page.locator('table tbody tr')
      .filter({ has: page.locator('td').nth(1) });

    this.personalTab = page.getByText('Personal', { exact: true });
    this.basicInfo = page.getByRole('img', { name: 'Basic Info' })
      .or(page.getByText('Basic Info', { exact: true }));

    this.employeeInfoLink = page.locator('div:nth-child(2) > a');

    this.employeeId = page.getByRole('textbox', {
      name: 'Please enter employee ID',
    });

    this.salutation = page.getByRole('combobox', {
      name: 'Please select salutation',
    });

    this.gender = page.getByRole('combobox', {
      name: 'Please select gender',
    });

    this.maritalStatus = page.getByRole('combobox', {
      name: 'Please select marital status',
    });

    this.bloodGroup = page.getByRole('combobox', {
      name: 'Please select blood group',
    });

    this.dateOfBirth = page.getByRole('textbox', {
      name: 'Date Of Birth*',
    });

    this.saveButton = page.getByRole('button', {
      name: 'Save',
      exact: true,
    });
  }

  async openRandomEmployeeList(): Promise<EmployeeListType> {
    const listType: EmployeeListType = Math.random() < 0.5 ? 'active' : 'probation';
    this.selectedListType = listType;

    await this.page.goto('/employee-management/active/employees', {
      waitUntil: 'domcontentloaded',
    });

    if (listType === 'probation') {
      await this.probationEmployeesTab.first().waitFor({ state: 'visible', timeout: 15000 });
      await this.probationEmployeesTab.first().click();
      await this.page.waitForURL(/probation/i, { timeout: 15000 }).catch(() => { });
    } else if (await this.activeEmployeesTab.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.activeEmployeesTab.first().click();
    }

    await this.employeeSearch.waitFor({ state: 'visible', timeout: 20000 });
    await this.employeeTableRows.first().waitFor({ state: 'visible', timeout: 20000 });

    return listType;
  }

  private async readEmployeeNameFromRow(row: Locator): Promise<string | null> {
    const cells = row.getByRole('cell');
    if ((await cells.count()) < 2) {
      return null;
    }

    const nameCell = cells.nth(1);
    let name = ((await nameCell.innerText().catch(() => '')) || '').trim();
    if (!name) {
      name = ((await nameCell.textContent().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    }
    if (!name) {
      const rowLines = ((await row.innerText().catch(() => '')) || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      name = rowLines[1] || rowLines[0] || '';
    }

    if (!name || name === '-' || /no records|no data|loading/i.test(name) || !/[A-Za-z]{2,}/.test(name)) {
      return null;
    }

    return name.replace(/\s+/g, ' ');
  }

  private profileReadyMarker() {
    return this.personalTab
      .or(this.page.getByText('Job', { exact: true }))
      .or(this.page.getByRole('textbox', { name: 'Please enter employee ID' }));
  }

  private async openEmployeeProfile(row: Locator, employeeName: string) {
    await row.scrollIntoViewIfNeeded();

    const profileMarker = this.profileReadyMarker().first();
    const clickTargets = [
      row.getByText(employeeName, { exact: true }).first(),
      this.page.getByText(employeeName, { exact: true }).first(),
      row.locator('td').nth(1).locator('a, span, button, div').first(),
      row.locator('td').nth(1),
    ];

    for (const target of clickTargets) {
      if (await profileMarker.isVisible().catch(() => false)) {
        return;
      }
      if (!(await target.isVisible().catch(() => false))) {
        continue;
      }

      await target.click().catch(() => target.click({ force: true }));
      try {
        await profileMarker.waitFor({ state: 'visible', timeout: 8000 });
        return;
      } catch {
        await this.page.keyboard.press('Escape').catch(() => { });
      }
    }

    throw new Error(`Could not open employee profile for ${employeeName}`);
  }

  async selectRandomEmployee(): Promise<string> {
    await this.page.waitForTimeout(1000);

    const rowCount = await this.employeeTableRows.count();
    const candidates: { index: number; name: string }[] = [];

    for (let i = 0; i < rowCount; i += 1) {
      const row = this.employeeTableRows.nth(i);
      const name = await this.readEmployeeNameFromRow(row);
      if (name) {
        candidates.push({ index: i, name });
      }
    }

    if (candidates.length === 0) {
      throw new Error(`No employees found under ${this.selectedListType} list`);
    }

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    const row = this.employeeTableRows.nth(picked.index);

    await this.openEmployeeProfile(row, picked.name);

    this.selectedEmployeeName = picked.name;
    return picked.name;
  }

  async openPersonalBasicInfo() {
    if (await this.employeeId.isVisible({ timeout: 3000 }).catch(() => false)) {
      return;
    }

    const personalLink = this.page.locator('a[href*="personal" i]')
      .or(this.personalTab)
      .or(this.employeeInfoLink)
      .first();

    if (await personalLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await personalLink.click();
    }

    const basicInfo = this.basicInfo.first();
    if (await basicInfo.isVisible({ timeout: 5000 }).catch(() => false)) {
      await basicInfo.click();
    }

    await expect(this.personalTab.first()).toBeVisible({ timeout: 15000 });
    await expect(this.basicInfo.first()).toBeVisible({ timeout: 15000 });
    await this.employeeId.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openRandomEmployeePersonalBasicInfo(): Promise<string> {
    await this.openRandomEmployeeList();
    const employeeName = await this.selectRandomEmployee();
    await this.openPersonalBasicInfo();
    return employeeName;
  }

  async openEmployees() {
    // await this.employeesMenu.click();
    await this.employeesMenu.click();
  }

  async selectActiveEmployees() {
    await this.activeEmployeesTab.first().click();
  }

  async openEmployee() {
    const employeeName = this.selectedEmployeeName;
    if (!employeeName) {
      throw new Error('No employee selected. Call selectRandomEmployee() first.');
    }
    await this.page.getByText(employeeName, { exact: true }).first().click();
  }

  async openEmployeeInfo() {
    await this.basicInfo.first().click();
    await this.employeeInfoLink.click();
  }

  async enterEmployeeId(value: string) {
    await this.employeeId.fill(value);
  }

  async selectSalutation(value: string) {
    await this.salutation.click();
    await this.page.getByRole('option', { name: value }).click();
  }

  async selectGender(value: string) {
    await this.gender.click();
    await this.page.getByRole('option', { name: value, exact: true }).click();
  }

  async selectMaritalStatus(value: string) {
    await this.maritalStatus.click();
    await this.page.getByText(value, { exact: true }).click();
  }

  async selectBloodGroup(value: string) {
    await this.bloodGroup.click();
    await this.page.getByText(value, { exact: true }).click();
  }

  async enterDateOfBirth(value: string) {
    await this.dateOfBirth.fill(value);
  }

  async save() {
    await this.saveButton.click();
  }
}
