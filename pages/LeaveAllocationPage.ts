import { expect, type Locator, type Page } from '@playwright/test';
import {
  GENERAL_LEAVE_CATEGORY,
  type LeaveCategoryFormData,
} from './LeaveCategoryPage';

export type LeaveAllocationBaseFilters = Pick<
  LeaveCategoryFormData,
  'year' | 'location' | 'subLocation' | 'shift'
>;

export const GENERAL_LEAVE_ALLOCATION_BASE: LeaveAllocationBaseFilters = {
  year: GENERAL_LEAVE_CATEGORY.year,
  location: GENERAL_LEAVE_CATEGORY.location,
  subLocation: GENERAL_LEAVE_CATEGORY.subLocation,
  shift: GENERAL_LEAVE_CATEGORY.shift,
};

export const DEFAULT_ALLOCATION_DAYS = '12';

const PLACEHOLDER_CATEGORY_PATTERN = /^select\s+category/i;

const DROPDOWN_OPTION_TIMEOUT_MS = 15000;

export class LeaveAllocationPage {
  readonly page: Page;

  readonly settingsIcon: Locator;
  readonly timeOffPanel: Locator;
  readonly leaveAllocationLink: Locator;

  readonly yearDropdown: Locator;
  readonly locationDropdown: Locator;
  readonly subLocationDropdown: Locator;
  readonly shiftDropdown: Locator;
  readonly categoryDropdown: Locator;

  readonly gradeHeader: Locator;
  readonly daysHeader: Locator;
  readonly allocationTable: Locator;

  readonly saveButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;

    this.settingsIcon = page.locator('rect').first();
    this.timeOffPanel = page.locator('#settings-panel-2');
    this.leaveAllocationLink = page
      .getByText('Leave Allocation', { exact: true })
      .or(page.getByText(/Leave AllocationConfigure/i))
      .first();

    this.yearDropdown = page.locator('#year');
    this.locationDropdown = page.locator('#jobLocation');
    this.subLocationDropdown = page.locator('#jobSubLocation');
    this.shiftDropdown = page.locator('#shift');
    this.categoryDropdown = page.locator('#visatype');

    this.gradeHeader = page.getByRole('columnheader', { name: 'GRADE' });
    this.daysHeader = page.getByRole('columnheader', { name: 'DAYS' });
    this.allocationTable = page.locator('table').filter({ has: this.gradeHeader }).first();

    this.saveButton = page.getByRole('button', { name: /^Save$/i }).first();
    this.successToast = page.getByText(/Data updated successfully/i);
  }

  gradeRows() {
    return this.allocationTable.locator('tbody tr').filter({
      has: this.page.getByPlaceholder('No of days'),
    });
  }

  daysInputForRow(row: Locator) {
    return row
      .getByPlaceholder('No of days')
      .or(row.getByRole('spinbutton', { name: 'No of days' }))
      .first();
  }

  async openDashboard() {
    if (!this.page.url().includes('/dashboard/emp')) {
      await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' });
    }
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible', timeout: 15000 });
  }

  async openSettingsTimeOff() {
    await this.settingsIcon.click();
    await this.page.waitForTimeout(1000);

    if (!(await this.timeOffPanel.isVisible({ timeout: 5000 }).catch(() => false))) {
      await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
      await this.page.waitForURL(/\/settings\/overview|\/settings/, { timeout: 15000 });
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(500);
    }

    await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
    await this.timeOffPanel.scrollIntoViewIfNeeded().catch(() => {});
    await this.timeOffPanel.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async openFromDashboard() {
    await this.openDashboard();
    await this.openSettingsTimeOff();

    if (!(await this.leaveAllocationLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(500);
      await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
      await this.timeOffPanel.click({ force: true });
    }

    await this.leaveAllocationLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.leaveAllocationLink.click();
    await this.yearDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await this.saveButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectDropdownByLabel(dropdown: Locator, label: string) {
    await dropdown.scrollIntoViewIfNeeded().catch(() => {});
    await dropdown.selectOption({ label });
    await this.page.waitForTimeout(500);
  }

  async waitForDropdownOption(dropdown: Locator, label: string) {
    await expect
      .poll(
        async () => {
          const options = await dropdown.locator('option').allTextContents();
          return options.some((option) => option.trim() === label || option.includes(label));
        },
        { timeout: DROPDOWN_OPTION_TIMEOUT_MS },
      )
      .toBeTruthy();
  }

  async selectBaseAllocationFilters(data: LeaveAllocationBaseFilters) {
    await this.selectDropdownByLabel(this.yearDropdown, data.year);
    await this.waitForDropdownOption(this.locationDropdown, data.location);
    await this.selectDropdownByLabel(this.locationDropdown, data.location);
    await this.waitForDropdownOption(this.subLocationDropdown, data.subLocation);
    await this.selectDropdownByLabel(this.subLocationDropdown, data.subLocation);
    await this.waitForDropdownOption(this.shiftDropdown, data.shift);
    await this.selectDropdownByLabel(this.shiftDropdown, data.shift);
    await expect.poll(() => this.getAvailableCategoryNames()).not.toEqual([]);
  }

  async getAvailableCategoryNames(): Promise<string[]> {
    const options = await this.categoryDropdown.locator('option').allTextContents();
    return options
      .map((text) => text.trim())
      .filter((text) => text.length > 0 && !PLACEHOLDER_CATEGORY_PATTERN.test(text));
  }

  async selectCategory(categoryName: string) {
    await this.waitForDropdownOption(this.categoryDropdown, categoryName);
    await this.selectDropdownByLabel(this.categoryDropdown, categoryName);
  }

  async expectAllocationGridVisible() {
    await expect(this.gradeHeader).toBeVisible();
    await expect(this.daysHeader).toBeVisible();
    await expect(this.gradeRows().first()).toBeVisible({ timeout: 15000 });
  }

  async selectedCategoryLabel() {
    const selectedOption = this.categoryDropdown.locator('option:checked');
    return (await selectedOption.textContent())?.trim() ?? '';
  }

  async fillDaysForAllGrades(days: string) {
    const rows = this.gradeRows();
    const rowCount = await rows.count();

    for (let index = 0; index < rowCount; index += 1) {
      const row = rows.nth(index);
      await row.scrollIntoViewIfNeeded().catch(() => {});
      const daysInput = this.daysInputForRow(row);
      await daysInput.waitFor({ state: 'visible', timeout: 10000 });
      await daysInput.fill(days);
    }
  }

  async saveAllocation() {
    await this.saveButton.click();
  }

  async expectSuccessToast() {
    await expect(this.successToast).toBeVisible({ timeout: 15000 });
  }

  async dismissSuccessToast() {
    await this.successToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  async allocateForCategory(categoryName: string, days: string) {
    await this.selectCategory(categoryName);
    await this.expectAllocationGridVisible();
    await this.fillDaysForAllGrades(days);
    await this.saveAllocation();
    await this.expectSuccessToast();
    await this.dismissSuccessToast();
  }

  async allocateForAllPublishedCategories(
    data: LeaveAllocationBaseFilters,
    days: string,
  ): Promise<string[]> {
    await this.selectBaseAllocationFilters(data);
    const categories = await this.getAvailableCategoryNames();

    for (const categoryName of categories) {
      await this.selectBaseAllocationFilters(data);
      await this.allocateForCategory(categoryName, days);
    }

    return categories;
  }
}
