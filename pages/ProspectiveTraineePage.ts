import { expect, type Locator, type Page } from '@playwright/test';

export type TraineeDetails = {
  firstName: string;
  lastName: string;
  email: string;
  designation?: string;
  employmentType?: string;
  location?: string;
  sublocation?: string;
};

export class ProspectiveTraineePage {
  readonly page: Page;
  readonly employeesIcon: Locator;
  readonly employeesTab: Locator;
  readonly prospectiveTab: Locator;
  readonly traineesTab: Locator;
  readonly addProspectiveTraineeButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly personalEmailInput: Locator;
  readonly designationCombobox: Locator;
  readonly employmentTypeCombobox: Locator;
  readonly locationCombobox: Locator;
  readonly sublocationCombobox: Locator;
  readonly addButton: Locator;
  readonly traineeSearch: Locator;
  readonly duplicateEmailMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeesIcon = page.locator('img[src="/main-menu-icons/employee-management-icon.png"]');
    this.employeesTab = page.locator('#sidenav-main-drop').getByText('Employees', { exact: true });
    this.prospectiveTab = page.getByText('Prospective', { exact: true });
    this.traineesTab = page.locator('a[href="/employee-management/prospective/interns"]');
    this.addProspectiveTraineeButton = page.getByRole('button', { name: 'Add Prospective Trainee' });
    this.firstNameInput = page.getByRole('textbox', { name: 'Please enter first name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Please enter last name' });
    this.personalEmailInput = page.getByRole('textbox', { name: 'Please enter personal email ID' });
    this.designationCombobox = page.getByRole('combobox', { name: 'Please select designation' });
    this.employmentTypeCombobox = page.getByRole('combobox', { name: 'Please select employment type' });
    this.locationCombobox = page.getByRole('combobox', { name: 'Please select location' });
    this.sublocationCombobox = page.getByRole('combobox', { name: 'Please select sublocation' });
    this.addButton = page.getByRole('dialog').getByRole('button', { name: 'Add', exact: true });
    this.traineeSearch = page.getByRole('searchbox');
    this.duplicateEmailMessage = page.getByText(
      /already exist|already registered|duplicate|email.*(exist|taken|in use)/i,
    );
  }

  static uniqueTrainee(): TraineeDetails {
    const firstName = pickIndianName(INDIAN_FIRST_NAMES, Date.now());
    const lastName = pickIndianName(INDIAN_LAST_NAMES, Date.now() + 11);
    const suffix = shortAlphaId(3);
    return {
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${suffix}@yopmail.com`,
    };
  }

  async openTraineesList() {
    await this.openEmployeesModule();

    await this.prospectiveTab.waitFor({ state: 'visible' });
    await this.prospectiveTab.click();
    await this.page.waitForURL(/\/employee-management\/prospective/, {
      timeout: 15000,
      waitUntil: 'commit',
    });

    await this.traineesTab.waitFor({ state: 'visible' });
    await this.traineesTab.click();
    await this.page.waitForURL(/\/employee-management\/prospective\/interns/, {
      timeout: 15000,
      waitUntil: 'commit',
    });
    await this.addProspectiveTraineeButton.waitFor({ state: 'visible' });
  }

  async goToTraineesList() {
    if (await this.traineesTab.isVisible().catch(() => false)) {
      await this.traineesTab.click();
    } else {
      await this.openTraineesList();
      return;
    }

    await this.page.waitForURL(/\/employee-management\/prospective\/interns/, {
      timeout: 15000,
      waitUntil: 'commit',
    });
    await this.addProspectiveTraineeButton.waitFor({ state: 'visible', timeout: 20000 });
  }

  private async openEmployeesModule() {
    await this.employeesIcon.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(2000);
    await this.employeesIcon.click();
    try {
      await this.page.waitForURL(/\/employee-management/, { timeout: 10000, waitUntil: 'commit' });
    } catch {
      await this.employeesTab.click();
      try {
        await this.page.waitForURL(/\/employee-management/, { timeout: 8000, waitUntil: 'commit' });
      } catch {
        await this.employeesIcon.click();
        await this.page.waitForURL(/\/employee-management/, { timeout: 8000, waitUntil: 'commit' });
      }
    }
  }

  async openAddForm() {
    await this.addProspectiveTraineeButton.click();
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async fillAndSubmit(details: TraineeDetails) {
    if (!/^[A-Za-z]+$/.test(details.firstName) || !/^[A-Za-z]+$/.test(details.lastName)) {
      throw new Error('First and last name must contain only alphabets');
    }

    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.personalEmailInput.fill(details.email);

    await this.selectDesignation(details.designation ?? 'Front End Developer');
    await this.selectEmploymentType(details.employmentType ?? 'Trainee');
    await this.selectLocation(details.location ?? 'Hyderabad');
    await this.selectSublocation(details.sublocation ?? 'Jai Hind Enclave building');

    await expect(this.addButton).toBeEnabled({ timeout: 10000 });
    await this.addButton.click();
  }

  async expectTraineeVisibleInList(details: TraineeDetails) {
    await this.page.getByRole('dialog').waitFor({ state: 'hidden', timeout: 20000 });
    await this.addProspectiveTraineeButton.waitFor({ state: 'visible' });

    await this.searchTrainee(details.firstName);

    const row = this.traineeRow(details.email);
    await expect(row).toBeVisible({ timeout: 15000 });
    await row.scrollIntoViewIfNeeded();
    await expect(row).toContainText(details.firstName);
    await expect(row).toContainText(details.lastName);
    await expect(row).toContainText(details.email);
  }

  async searchTrainee(query: string) {
    await this.traineeSearch.waitFor({ state: 'visible' });
    await this.traineeSearch.click();
    await this.traineeSearch.fill(query);
    await this.traineeSearch.press('Enter');
  }

  traineeRow(query: string) {
    return this.page.getByRole('row').filter({ hasText: query }).first();
  }

  employeeCreatedRow(email?: string) {
    const rows = this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: 'Employee Created', exact: true }),
    });
    return email ? rows.filter({ hasText: email }).first() : rows.first();
  }

  async openEmployeeCreated(details: { firstName: string; lastName: string; email: string }) {
    const row = this.employeeCreatedRow(details.email);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.getByText('Employee Created', { exact: true }).click();
    await row.getByText(`${details.firstName} ${details.lastName}`).click();
  }

  async openTraineeProfile(details: { firstName: string; lastName: string; email: string }) {
    const row = this.traineeRow(details.email);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.getByText(`${details.firstName} ${details.lastName}`).click();
  }

  async findDocumentsSubmittedTrainee(): Promise<{ firstName: string; lastName: string; email: string } | null> {
    await this.searchTrainee('Documents Submitted');
    const row = this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: 'Documents Submitted', exact: true }),
    }).first();
    if (!(await row.isVisible({ timeout: 8000 }).catch(() => false))) {
      return null;
    }
    const name = (await row.getByRole('cell').nth(1).innerText()).trim();
    const email = (await row.getByRole('cell').nth(3).innerText()).trim();
    const parts = name.split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] ?? name,
      lastName: parts.slice(1).join(' ') || parts[0] || name,
      email,
    };
  }

  async openEmployeeFromRow(row: Locator) {
    const email = (await row.getByRole('cell').nth(3).innerText()).trim();
    const name = (await row.getByRole('cell').nth(1).innerText()).trim();
    await row.getByRole('cell').nth(1).click();
    return { name, email };
  }

  private async selectDesignation(label: string) {
    await this.designationCombobox.click();
    await this.page.getByRole('option', { name: label }).click();
  }

  private async selectEmploymentType(label: string) {
    await this.employmentTypeCombobox.click();
    await this.optionList().getByText(label, { exact: true }).click();
  }

  private async selectLocation(label: string) {
    await this.locationCombobox.click();
    await this.page.getByRole('option', { name: label }).click();
  }

  private async selectSublocation(label: string) {
    await this.sublocationCombobox.click();
    await this.optionList().getByText(label).click();
  }

  private optionList() {
    return this.page.getByLabel('Option List');
  }
}

const INDIAN_FIRST_NAMES = [
  'Kavya', 'Rohan', 'Meera', 'Arjun', 'Sneha', 'Rahul', 'Pooja', 'Nikhil',
  'Anjali', 'Varun', 'Divya', 'Sanjay', 'Isha', 'Harish', 'Neha', 'Amit',
  'Shreya', 'Karthik', 'Nandini', 'Deepak',
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Reddy', 'Patel', 'Rao', 'Nair', 'Gupta', 'Verma', 'Singh',
  'Iyer', 'Joshi', 'Mehta', 'Pillai', 'Desai', 'Menon',
];

function pickIndianName(names: readonly string[], seed: number) {
  const name = names[Math.abs(seed) % names.length];
  if (!/^[A-Za-z]+$/.test(name)) {
    throw new Error(`Name must contain only alphabets: ${name}`);
  }
  return name;
}

function shortAlphaId(length: number) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let suffix = '';
  for (let i = 0; i < length; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return suffix;
}
