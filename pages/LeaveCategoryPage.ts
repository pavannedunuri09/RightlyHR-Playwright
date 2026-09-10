import { expect, type Locator, type Page } from '@playwright/test';

export const LEAVE_CATEGORY_REQUIRED_VALIDATIONS = [
  'Year is required',
  'Location is required',
  'Sub Location is required',
  'Shift is required',
  'Leave Type is required',
  'Leave Category Name is required',
  'Leave Category Code is required',
  'Valid Days is required',
  'Allowed Gender is required',
  'Allowed Marital Status is required',
  'Exclude Weekends is required',
  'Exclude Holidays is required',
  'Is Optional Holiday is required',
  'Half Day Leave Allowed is required',
  'Pro Rata Leave Allocation is required',
  'Past Dates Allowed is required',
  'Future Dates Allowed is required',
  'Carry Forward Leave is required',
  'Encash Allowed is required',
  'Probation Rules Applicable is required',
  'Notice Period Rules Applicable is required',
] as const;

export type LeaveCategoryRequiredValidation = (typeof LEAVE_CATEGORY_REQUIRED_VALIDATIONS)[number];

export interface LeaveCategoryFormData {
  year: string;
  location: string;
  subLocation: string;
  shift: string;
  categoryType: string;
  leaveType: string;
  categoryName: string;
  categoryCode: string;
  validDays: string;
  color: string;
  allowedGender: string;
  allowedMaritalStatus: string;
  excludeWeekends: 'Yes' | 'No';
  excludeHolidays: 'Yes' | 'No';
  isOptionalHoliday: 'Yes' | 'No';
  halfDayLeaveAllowed: 'Yes' | 'No';
  proRataLeaveAllocation: 'Yes' | 'No';
  enableSandwichPolicy: 'Yes' | 'No';
  futureDatesAllowed: 'Yes' | 'No';
  futureDatesDays?: string;
  pastDatesAllowed: 'Yes' | 'No';
  pastDatesDays?: string;
  carryForwardAllowed: 'Yes' | 'No';
  carryForwardDays?: string;
  encashAllowed: 'Yes' | 'No';
  encashDays?: string;
  probationRulesApplicable: 'Yes' | 'No';
  noticePeriodRulesApplicable: 'Yes' | 'No';
  frequencyType: string;
}

export const GENERAL_LEAVE_CATEGORY: LeaveCategoryFormData = {
  year: '2026',
  location: 'Kerala',
  subLocation: 'Kannur',
  shift: 'Morning Test',
  categoryType: 'General',
  leaveType: 'General',
  categoryName: 'General Leave',
  categoryCode: 'GEN-LEAVE',
  validDays: '365',
  color: '#2563eb',
  allowedGender: 'All',
  allowedMaritalStatus: 'All',
  excludeWeekends: 'Yes',
  excludeHolidays: 'Yes',
  isOptionalHoliday: 'No',
  halfDayLeaveAllowed: 'Yes',
  proRataLeaveAllocation: 'Yes',
  enableSandwichPolicy: 'No',
  futureDatesAllowed: 'Yes',
  futureDatesDays: '100',
  pastDatesAllowed: 'Yes',
  pastDatesDays: '100',
  carryForwardAllowed: 'No',
  encashAllowed: 'No',
  probationRulesApplicable: 'No',
  noticePeriodRulesApplicable: 'No',
  frequencyType: 'Yearly',
};

export const UPDATED_GENERAL_LEAVE_CATEGORY: LeaveCategoryFormData = {
  ...GENERAL_LEAVE_CATEGORY,
  validDays: '366',
};

export const SICK_LEAVE_CATEGORY: LeaveCategoryFormData = {
  year: '2026',
  location: 'Kerala',
  subLocation: 'Kannur',
  shift: 'Morning Test',
  categoryType: 'General',
  leaveType: 'Sick Leave',
  categoryName: 'Sick Leave',
  categoryCode: 'SICK-LEAVE',
  validDays: '365',
  color: '#dc2626',
  allowedGender: 'All',
  allowedMaritalStatus: 'All',
  excludeWeekends: 'Yes',
  excludeHolidays: 'Yes',
  isOptionalHoliday: 'No',
  halfDayLeaveAllowed: 'Yes',
  proRataLeaveAllocation: 'Yes',
  enableSandwichPolicy: 'No',
  futureDatesAllowed: 'Yes',
  futureDatesDays: '100',
  pastDatesAllowed: 'Yes',
  pastDatesDays: '100',
  carryForwardAllowed: 'No',
  encashAllowed: 'No',
  probationRulesApplicable: 'No',
  noticePeriodRulesApplicable: 'No',
  frequencyType: 'Yearly',
};

export type LeaveCategoryLocationHierarchy = Pick<
  LeaveCategoryFormData,
  'location' | 'subLocation' | 'shift'
>;

export class LeaveCategoryPage {
  readonly page: Page;

  // Settings navigation
  readonly settingsIcon: Locator;
  readonly timeOffPanel: Locator;
  readonly leaveCategoryLink: Locator;

  // Leave Category list
  readonly pendingTab: Locator;
  readonly publishedTab: Locator;
  readonly addNewButton: Locator;
  readonly table: Locator;
  readonly yearHeader: Locator;
  readonly locationHeader: Locator;
  readonly subLocationHeader: Locator;
  readonly shiftNameHeader: Locator;
  readonly categoryTypeHeader: Locator;
  readonly categoryNameHeader: Locator;
  readonly categoryCodeHeader: Locator;
  readonly displayColorHeader: Locator;
  readonly statusHeader: Locator;

  // Add / Update Leave Category form actions
  readonly locationShiftSection: Locator;
  readonly categoryInformationSection: Locator;
  readonly additionalInformationSection: Locator;
  readonly advanceNoticeSection: Locator;
  readonly maximumDurationSection: Locator;
  readonly leaveIntervalSection: Locator;
  readonly sandwichPolicySection: Locator;
  readonly carryForwardSection: Locator;
  readonly encashSection: Locator;
  readonly probationPeriodSection: Locator;
  readonly noticePeriodSection: Locator;

  readonly yearDropdown: Locator;
  readonly locationDropdown: Locator;
  readonly subLocationDropdown: Locator;
  readonly shiftDropdown: Locator;
  readonly categoryTypeDropdown: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly categoryNameInput: Locator;
  readonly categoryCodeInput: Locator;
  readonly validDaysInput: Locator;
  readonly colorInput: Locator;
  readonly genderDropdown: Locator;
  readonly maritalStatusDropdown: Locator;
  readonly saveButton: Locator;
  readonly updateButton: Locator;
  readonly publishButton: Locator;
  readonly cloneButton: Locator;
  readonly cancelButton: Locator;
  readonly confirmYesButton: Locator;
  readonly requiredErrors: Locator;
  readonly successToast: Locator;
  readonly dataUpdatedToast: Locator;
  readonly dataPublishedToast: Locator;
  readonly dataClonedToast: Locator;
  readonly frequencyTypeDropdown: Locator;

  constructor(page: Page) {
    this.page = page;

    // The header Settings control is an unlabeled SVG in the current UI.
    this.settingsIcon = page.locator('rect').first();
    this.timeOffPanel = page.locator('#settings-panel-2');
    this.leaveCategoryLink = page.getByText('Leave Category', { exact: true }).first();

    this.pendingTab = page
      .getByRole('link', { name: /Pending\s+For\s+Submission\s*\(\d+\)/i })
      .or(page.getByRole('tab', { name: /Pending\s+For\s+Submission\s*\(\d+\)/i }))
      .first();
    this.publishedTab = page
      .getByRole('link', { name: /Published\s*\(\d+\)/i })
      .or(page.getByRole('tab', { name: /Published\s*\(\d+\)/i }))
      .first();
    this.addNewButton = page
      .getByRole('link', { name: /^Add New$/i })
      .or(page.getByRole('button', { name: /^Add New$/i }))
      .or(page.getByText('Add New', { exact: true }))
      .first();
    this.table = page.locator('table, [role="table"], .p-datatable').first();
    this.yearHeader = page.getByRole('columnheader', { name: 'Year', exact: true });
    this.locationHeader = page.getByRole('columnheader', { name: 'Location', exact: true });
    this.subLocationHeader = page.getByRole('columnheader', { name: 'Sub Location', exact: true });
    this.shiftNameHeader = page.getByRole('columnheader', { name: 'Shift Name', exact: true });
    this.categoryTypeHeader = page.getByRole('columnheader', { name: 'Leave Category Type', exact: true });
    this.categoryNameHeader = page.getByRole('columnheader', { name: 'Leave Category Name', exact: true });
    this.categoryCodeHeader = page.getByRole('columnheader', { name: 'Leave Category Code', exact: true });
    this.displayColorHeader = page.getByRole('columnheader', { name: 'Display Color', exact: true });
    this.statusHeader = page.getByRole('columnheader', { name: /Status/i }).first();

    this.locationShiftSection = page.getByText(/Location\s*\/\s*Shift/i).first();
    this.categoryInformationSection = page.getByText('Leave Category Information', { exact: true });
    this.additionalInformationSection = page.getByText('Additional Information', { exact: true });
    this.advanceNoticeSection = page.getByText('Advance Notice', { exact: true });
    this.maximumDurationSection = page.getByText('Maximum Leave Duration', { exact: true });
    this.leaveIntervalSection = page.getByText('Leave Interval', { exact: true });
    this.sandwichPolicySection = page.getByText('Sandwich Policy', { exact: true });
    this.carryForwardSection = page.getByText('Carry Forward', { exact: true });
    this.encashSection = page.getByText('Encash', { exact: true });
    this.probationPeriodSection = page.getByText('Probation Period', { exact: true });
    this.noticePeriodSection = page.getByText('Notice Period', { exact: true });

    this.yearDropdown = page.getByRole('combobox', { name: 'Select year' });
    this.locationDropdown = page.getByRole('combobox', { name: 'Select location' });
    this.subLocationDropdown = page.getByRole('combobox', { name: 'Select sub-location' });
    this.shiftDropdown = page.getByRole('combobox', { name: 'Select shift' });
    this.categoryTypeDropdown = page.getByRole('combobox', { name: /Select Category|General/i }).first();
    this.leaveTypeDropdown = page.getByRole('combobox', { name: 'Select Leave Type' });
    this.categoryNameInput = page.getByRole('textbox', { name: 'Please enter name' });
    this.categoryCodeInput = page.getByRole('textbox', { name: 'Please enter code' });
    this.validDaysInput = page.getByRole('spinbutton', { name: 'Please enter valid days' });
    this.colorInput = page.getByPlaceholder('Please enter color');
    this.genderDropdown = page.getByRole('combobox', { name: 'Select gender' });
    this.maritalStatusDropdown = page.getByRole('combobox', { name: 'Select marital status' });
    this.saveButton = page.getByRole('button', { name: /^Save$/i }).first();
    this.updateButton = page.getByRole('button', { name: /^Update$/i }).first();
    this.publishButton = page.getByRole('button', { name: /^Publish$/i }).first();
    this.cloneButton = page.getByRole('button', { name: /^Clone$/i }).first();
    this.cancelButton = page.getByRole('button', { name: /^Cancel$/i }).first();
    this.confirmYesButton = page
      .getByRole('dialog')
      .getByRole('button', { name: /^Yes$/i })
      .or(page.getByRole('button', { name: /^Yes$/i }))
      .first();
    this.requiredErrors = page.getByText(/\bis required\b/i);
    this.successToast = page.getByText(/(Data|Leave Category) (Added|Saved|Created) Successfully/i);
    this.dataUpdatedToast = page.getByText(/(Data|Leave Category) Updated Successfully/i);
    this.dataPublishedToast = page.getByText(/Leave [Cc]ategory published successfully/i);
    this.dataClonedToast = page.getByText(/Leave [Cc]ategory cloned successfully/i);
    this.frequencyTypeDropdown = page.getByRole('combobox', { name: 'Select frequency type' });
  }

  fieldGroupByLabel(label: string | RegExp): Locator {
    return this.page
      .locator('.form-label, label')
      .filter({ hasText: label })
      .first()
      .locator('xpath=ancestor::*[contains(@class,"col-")][1]');
  }

  locationHierarchyCombobox(field: 'location' | 'subLocation' | 'shift'): Locator {
    const labels = {
      location: /^Location\s*\*?$/i,
      subLocation: /^Sub Location\s*\*?$/i,
      shift: /^Shift\s*\*?$/i,
    };
    return this.fieldGroupByLabel(labels[field]).getByRole('combobox').first();
  }

  allowedDaysGroup(index: number): Locator {
    return this.page
      .locator('.form-label')
      .filter({ hasText: /^Allowed\*$/ })
      .nth(index)
      .locator('xpath=ancestor::*[contains(@class,"col-")][1]');
  }

  daysGroup(index: number): Locator {
    return this.page
      .locator('.form-label')
      .filter({ hasText: /^Days\*$/ })
      .nth(index)
      .locator('xpath=ancestor::*[contains(@class,"col-")][1]');
  }

  getCategoryRow(categoryName: string): Locator {
    return this.table.locator('tbody tr, [role="row"]').filter({ hasText: categoryName }).first();
  }

  kebabMenuItem(name: string): Locator {
    return this.page
      .locator('a.dropdown-item, button.dropdown-item, .dropdown-item, [role="menuitem"]')
      .filter({ hasText: new RegExp(`^\\s*${name}\\s*$`, 'i') })
      .filter({ visible: true })
      .first();
  }

  async openRowKebab(row: Locator): Promise<boolean> {
    await row.scrollIntoViewIfNeeded().catch(() => {});

    const kebab = row
      .locator('.dropdown > a, [data-bs-toggle="dropdown"], .dropdown-toggle, i.fa-ellipsis-v, td:last-child a, td:last-child button')
      .first();
    if (await kebab.isVisible().catch(() => false)) {
      await kebab.click({ force: true });
      return true;
    }

    const lastCell = row.getByRole('cell').last();
    if (await lastCell.isVisible().catch(() => false)) {
      await lastCell.click({ force: true });
      return true;
    }

    return false;
  }

  async clickRowAction(row: Locator, actionName: 'Update' | 'Clone' | 'Publish' | 'View' | 'Delete') {
    await this.openRowKebab(row);
    const actionItem = this.kebabMenuItem(actionName);
    await actionItem.waitFor({ state: 'visible', timeout: 10000 });
    await actionItem.click({ force: true });
  }

  async ensureOnLeaveCategoryList() {
    if (!(await this.pendingTab.isVisible({ timeout: 3000 }).catch(() => false))) {
      await this.openFromDashboard();
      return;
    }

    await this.switchToPending();
  }

  async expectPendingSubmissionRow(data: LeaveCategoryFormData) {
    await this.ensureOnLeaveCategoryList();
    const row = this.getCategoryRow(data.categoryName);
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible({ timeout: 30000 });
    await expect(row.getByRole('cell', { name: /Pending\s*for\s*submission/i })).toBeVisible();
    await expect(row).toContainText(data.year);
    await expect(row).toContainText(data.location);
    await expect(row).toContainText(data.subLocation);
    await expect(row).toContainText(data.shift);
    await expect(row).toContainText(data.categoryType);
    await expect(row).toContainText(data.categoryName);
    await expect(row).toContainText(data.categoryCode);
  }

  async openUpdateForCategory(categoryName: string) {
    await this.ensureOnLeaveCategoryList();
    const row = this.getCategoryRow(categoryName);
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible({ timeout: 30000 });
    await this.clickRowAction(row, 'Update');
    await this.categoryNameInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.updateButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async expectUpdateFormPrefilled(data: LeaveCategoryFormData) {
    await expect(this.categoryNameInput).toHaveValue(data.categoryName);
    await expect(this.categoryCodeInput).toHaveValue(data.categoryCode);
    await expect(this.validDaysInput).toHaveValue(data.validDays);
    await expect(this.colorInput).toHaveValue(data.color);
  }

  async expectInitialUpdateActionButtons() {
    await expect(this.updateButton).toBeDisabled();
    await expect(this.cancelButton).toBeEnabled();
    await expect(this.cloneButton).toBeEnabled();
    await expect(this.publishButton).toBeEnabled();
  }

  async expectDirtyUpdateActionButtons() {
    await expect(this.updateButton).toBeEnabled();
    await expect(this.cloneButton).toBeDisabled();
    await expect(this.publishButton).toBeDisabled();
  }

  async submitUpdateLeaveCategory() {
    await expect(this.updateButton).toBeEnabled({ timeout: 15000 });
    await this.updateButton.click();

    if (await this.confirmYesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.confirmYesButton.click();
    }

    await this.dataUpdatedToast.waitFor({ state: 'visible', timeout: 30000 });
    await this.dataUpdatedToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  async publishLeaveCategoryFromUpdatePage() {
    await expect(this.publishButton).toBeEnabled({ timeout: 15000 });
    await this.publishButton.click();

    if (await this.confirmYesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.confirmYesButton.click();
    }

    await this.dataPublishedToast.waitFor({ state: 'visible', timeout: 30000 });
    await this.dataPublishedToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  async expectPublishedRow(data: LeaveCategoryFormData) {
    await this.ensureOnPublishedList();
    const row = this.getPublishedCategoryRow(data.categoryName);
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible({ timeout: 30000 });
    await expect(row.getByRole('cell', { name: /^Published$/i })).toBeVisible();
    await expect(row).toContainText(data.year);
    await expect(row).toContainText(data.location);
    await expect(row).toContainText(data.subLocation);
    await expect(row).toContainText(data.shift);
    await expect(row).toContainText(data.categoryType);
    await expect(row).toContainText(data.categoryName);
    await expect(row).toContainText(data.categoryCode);
    await expect(this.statusHeader).toBeVisible();
  }

  async ensureOnPublishedList() {
    if (!(await this.pendingTab.isVisible({ timeout: 3000 }).catch(() => false))) {
      await this.openFromDashboard();
    }

    await this.switchToPublished();
  }

  getPublishedCategoryRow(categoryName: string): Locator {
    return this.table
      .locator('tbody tr, [role="row"]')
      .filter({ hasText: categoryName })
      .filter({ hasText: /Published/i })
      .first();
  }

  getCategoryRowByHierarchy(data: LeaveCategoryFormData): Locator {
    return this.table
      .locator('tbody tr, [role="row"]')
      .filter({ hasText: data.categoryName })
      .filter({ hasText: data.location })
      .filter({ hasText: data.subLocation })
      .filter({ hasText: data.shift })
      .first();
  }

  async expectPublishedKebabOptions(categoryName: string) {
    await this.ensureOnPublishedList();
    const row = this.getPublishedCategoryRow(categoryName);
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible({ timeout: 30000 });
    await this.openRowKebab(row);

    await expect(this.kebabMenuItem('Clone')).toBeVisible();
    await expect(this.kebabMenuItem('View')).toBeVisible();
    await expect(this.kebabMenuItem('Update')).toHaveCount(0);
    await this.page.keyboard.press('Escape');
  }

  async openViewForCategory(categoryName: string) {
    await this.ensureOnPublishedList();
    const row = this.getPublishedCategoryRow(categoryName);
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible({ timeout: 30000 });
    await this.clickRowAction(row, 'View');
    await this.page.getByText('View Leave Category', { exact: false }).first().waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.categoryNameInput).toHaveValue(categoryName, { timeout: 15000 });
  }

  async expectViewLeaveCategoryDetails(data: LeaveCategoryFormData) {
    await expect(this.categoryNameInput).toHaveValue(data.categoryName);
    await expect(this.categoryCodeInput).toHaveValue(data.categoryCode);
    await expect(this.validDaysInput).toHaveValue(data.validDays);
    await expect(this.colorInput).toHaveValue(data.color);
    await expect(this.page.getByRole('combobox', { name: data.year })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Select location' })).toHaveValue(data.location);
    await expect(this.page.getByRole('textbox', { name: 'Select sub-location' })).toHaveValue(data.subLocation);
    await expect(this.page.getByRole('textbox', { name: 'Select shift' })).toHaveValue(data.shift);
    await expect(this.fieldGroupByLabel(/Leave Category Type/i).getByRole('combobox').first()).toHaveAttribute('aria-label', data.categoryType);
    await expect(this.fieldGroupByLabel(/^Leave Type/i).getByRole('combobox').first()).toHaveAttribute('aria-label', data.leaveType);
  }

  async expectViewActionButtons() {
    await expect(this.cancelButton).toBeEnabled();
    await expect(this.cloneButton).toBeEnabled();
  }

  async openCloneFromViewPage() {
    await expect(this.cloneButton).toBeEnabled();
    await this.cloneButton.click();
    await this.page.getByText('Clone Leave Category', { exact: false }).first().waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.locationHierarchyCombobox('location')).toBeVisible({ timeout: 15000 });
    await expect(this.saveButton).toBeVisible({ timeout: 15000 });
  }

  async openCloneForCategory(categoryName: string) {
    await this.ensureOnPublishedList();
    const row = this.getPublishedCategoryRow(categoryName);
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible({ timeout: 30000 });
    await this.clickRowAction(row, 'Clone');
    await this.page.getByText('Clone Leave Category', { exact: false }).first().waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.locationHierarchyCombobox('location')).toBeVisible({ timeout: 15000 });
    await expect(this.saveButton).toBeVisible({ timeout: 15000 });
  }

  formComboboxByLabel(label: string | RegExp): Locator {
    return this.fieldGroupByLabel(label).getByRole('combobox').first();
  }

  async fillCloneLeaveCategoryForm(data: LeaveCategoryFormData) {
    await this.selectDropdownOptionIfNeeded(this.formComboboxByLabel(/^Year/i), data.year);
    await this.selectDropdownOptionIfNeeded(this.locationHierarchyCombobox('location'), data.location);
    await this.selectDropdownOptionIfNeeded(this.locationHierarchyCombobox('subLocation'), data.subLocation);
    await this.selectDropdownOptionIfNeeded(this.locationHierarchyCombobox('shift'), data.shift);

    await this.selectDropdownOptionIfNeeded(this.formComboboxByLabel(/Leave Category Type/i), data.categoryType);
    await this.selectDropdownOption(this.formComboboxByLabel(/^Leave Type/i), data.leaveType);

    await this.categoryNameInput.fill(data.categoryName);
    await this.categoryCodeInput.fill(data.categoryCode);
    await this.validDaysInput.fill(data.validDays);
    await this.colorInput.fill(data.color);

    await this.selectDropdownOptionIfNeeded(this.formComboboxByLabel(/Allowed Gender/i), data.allowedGender);
    await this.selectDropdownOptionIfNeeded(this.formComboboxByLabel(/Allowed Marital Status/i), data.allowedMaritalStatus);

    await this.selectByFieldLabel(/Exclude Weekends/i, data.excludeWeekends);
    await this.selectByFieldLabel(/Exclude Holidays/i, data.excludeHolidays);
    await this.selectByFieldLabel(/Is Optional Holiday/i, data.isOptionalHoliday);
    await this.selectByFieldLabel(/Half Day Leave Allowed/i, data.halfDayLeaveAllowed);
    await this.selectByFieldLabel(/Pro Rata Leave Allocation/i, data.proRataLeaveAllocation);

    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);

    await this.selectByFieldLabel(/Enable Sandwich Policy/i, data.enableSandwichPolicy);
    await this.fillAllowedDaysPair(0, data.futureDatesAllowed, data.futureDatesDays);
    await this.fillAllowedDaysPair(1, data.pastDatesAllowed, data.pastDatesDays);
    await this.fillAllowedDaysPair(2, data.carryForwardAllowed, data.carryForwardDays);
    await this.fillAllowedDaysPair(3, data.encashAllowed, data.encashDays);

    await this.selectByFieldLabel(/Probation Period Rules Applicable/i, data.probationRulesApplicable);
    await this.selectByFieldLabel(/Notice Period Rules Applicable/i, data.noticePeriodRulesApplicable);
    await this.selectDropdownOptionIfNeeded(this.formComboboxByLabel(/Frequency Type/i), data.frequencyType);
  }

  async readComboboxValue(dropdown: Locator): Promise<string> {
    const ariaLabel = (await dropdown.getAttribute('aria-label'))?.trim() ?? '';
    if (ariaLabel && !/select (year|location|sub-location|shift|option)/i.test(ariaLabel)) {
      return ariaLabel;
    }

    const text = (await dropdown.innerText()).trim();
    return text.replace(/\s+/g, ' ');
  }

  async selectDropdownOptionByIndex(dropdown: Locator, index: number) {
    await dropdown.scrollIntoViewIfNeeded().catch(() => {});
    await dropdown.click({ force: true }).catch(() => {});

    const optionLocator = this.page
      .locator('.p-select-overlay [role="option"], .p-dropdown-items [role="option"], .p-select-option, [role="listbox"] [role="option"]')
      .filter({
        hasNotText: /^(Please select|Select year|Select location|Select sub location|Select shift|No result found|No data found|No records found)/i,
      });

    await optionLocator.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    const count = await optionLocator.count();
    if (count === 0) {
      await this.page.keyboard.press('Escape');
      return;
    }

    const safeIndex = index < count ? index : index % count;
    await optionLocator.nth(safeIndex).click({ force: true });
  }

  async expectCloneLocationFieldsEmpty(original: LeaveCategoryFormData) {
    const locationCombo = this.locationHierarchyCombobox('location');
    const subLocationCombo = this.locationHierarchyCombobox('subLocation');
    const shiftCombo = this.locationHierarchyCombobox('shift');

    await expect(locationCombo).toBeVisible();
    await expect(subLocationCombo).toBeVisible();
    await expect(shiftCombo).toBeVisible();

    const locationValue = await this.readComboboxValue(locationCombo);
    const subLocationValue = await this.readComboboxValue(subLocationCombo);
    const shiftValue = await this.readComboboxValue(shiftCombo);

    expect(locationValue.toLowerCase()).not.toBe(original.location.toLowerCase());
    expect(subLocationValue.toLowerCase()).not.toBe(original.subLocation.toLowerCase());
    expect(shiftValue.toLowerCase()).not.toBe(original.shift.toLowerCase());
  }

  async fillCloneLocationHierarchyExcludingOriginal(
    original: LeaveCategoryFormData,
    maxAttempts = 5,
  ): Promise<LeaveCategoryLocationHierarchy> {
    const locationCombo = this.locationHierarchyCombobox('location');
    const subLocationCombo = this.locationHierarchyCombobox('subLocation');
    const shiftCombo = this.locationHierarchyCombobox('shift');

    for (let offset = 0; offset < maxAttempts; offset += 1) {
      await this.selectDropdownOptionByIndex(locationCombo, offset);
      await this.selectDropdownOptionByIndex(subLocationCombo, offset);
      await this.selectDropdownOptionByIndex(shiftCombo, offset);

      const location = await this.readComboboxValue(locationCombo);
      const subLocation = await this.readComboboxValue(subLocationCombo);
      const shift = await this.readComboboxValue(shiftCombo);

      const differsFromOriginal =
        location.toLowerCase() !== original.location.toLowerCase()
        || subLocation.toLowerCase() !== original.subLocation.toLowerCase()
        || shift.toLowerCase() !== original.shift.toLowerCase();

      if (differsFromOriginal && location && subLocation && shift) {
        if (await this.saveButton.isEnabled().catch(() => false)) {
          return { location, subLocation, shift };
        }
      }
    }

    throw new Error('Unable to select a different location hierarchy for clone.');
  }

  async submitCloneLeaveCategory() {
    await expect(this.saveButton).toBeEnabled({ timeout: 15000 });
    await this.saveButton.click();

    if (await this.confirmYesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.confirmYesButton.click();
    }

    await Promise.race([
      this.dataClonedToast.waitFor({ state: 'visible', timeout: 30000 }),
      this.successToast.waitFor({ state: 'visible', timeout: 30000 }),
    ]);
    await this.dataClonedToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    await this.successToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  async expectPendingClonedRow(
    sourceData: LeaveCategoryFormData,
    cloneLocation: LeaveCategoryLocationHierarchy,
  ) {
    await this.ensureOnLeaveCategoryList();
    const clonedRowData: LeaveCategoryFormData = {
      ...sourceData,
      location: cloneLocation.location,
      subLocation: cloneLocation.subLocation,
      shift: cloneLocation.shift,
    };
    const row = this.getCategoryRowByHierarchy(clonedRowData);
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible({ timeout: 30000 });
    await expect(row.getByRole('cell', { name: /Pending\s*for\s*submission/i })).toBeVisible();
    await expect(row).toContainText(sourceData.year);
    await expect(row).toContainText(cloneLocation.location);
    await expect(row).toContainText(cloneLocation.subLocation);
    await expect(row).toContainText(cloneLocation.shift);
    await expect(row).toContainText(sourceData.categoryType);
    await expect(row).toContainText(sourceData.categoryName);
    await expect(row).toContainText(sourceData.categoryCode);
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

    if (!(await this.leaveCategoryLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(500);
      await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
      await this.timeOffPanel.click({ force: true });
    }

    await this.leaveCategoryLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.leaveCategoryLink.click();
    await this.pendingTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async switchToPending() {
    await this.pendingTab.click();
    await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async switchToPublished() {
    await this.publishedTab.click();
    await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async tabCount(tab: Locator): Promise<number> {
    const label = (await tab.innerText()).trim();
    const match = label.match(/\((\d+)\)/);
    if (!match) {
      throw new Error(`No record count found in tab label: "${label}"`);
    }
    return Number(match[1]);
  }

  async openAddForm() {
    await this.addNewButton.click();
    await this.yearDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await this.cancelButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectDropdownOption(dropdown: Locator, optionName: string) {
    await dropdown.scrollIntoViewIfNeeded().catch(() => {});
    await dropdown.click();
    const option = this.page.getByRole('option', { name: optionName, exact: true });
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
  }

  async selectDropdownOptionIfNeeded(dropdown: Locator, optionName: string) {
    const currentValue = await this.readComboboxValue(dropdown);
    if (currentValue.toLowerCase() === optionName.toLowerCase()) {
      return;
    }

    await this.selectDropdownOption(dropdown, optionName);
  }

  async selectByFieldLabel(label: string | RegExp, optionName: string) {
    const group = this.fieldGroupByLabel(label);
    await group.scrollIntoViewIfNeeded();
    await this.selectDropdownOptionIfNeeded(group.getByRole('combobox').first(), optionName);
  }

  async fillAllowedDaysPair(
    index: number,
    allowed: 'Yes' | 'No',
    days?: string,
  ) {
    const allowedGroup = this.allowedDaysGroup(index);
    await allowedGroup.scrollIntoViewIfNeeded();
    await this.selectDropdownOptionIfNeeded(allowedGroup.getByRole('combobox').first(), allowed);

    if (days !== undefined) {
      const daysField = this.daysGroup(index).getByRole('spinbutton').first();
      if (await daysField.isEnabled().catch(() => false)) {
        const currentDays = await daysField.inputValue().catch(() => '');
        if (currentDays !== days) {
          await daysField.fill(days);
        }
      }
    }
  }

  async fillAddLeaveCategoryForm(data: LeaveCategoryFormData) {
    await this.selectDropdownOption(this.yearDropdown, data.year);
    await this.selectDropdownOption(this.locationDropdown, data.location);
    await this.selectDropdownOption(this.subLocationDropdown, data.subLocation);
    await this.selectDropdownOption(this.shiftDropdown, data.shift);

    await this.selectDropdownOption(this.categoryTypeDropdown, data.categoryType);
    await this.selectDropdownOption(this.leaveTypeDropdown, data.leaveType);

    await this.categoryNameInput.fill(data.categoryName);
    await this.categoryCodeInput.fill(data.categoryCode);
    await this.validDaysInput.fill(data.validDays);
    await this.colorInput.fill(data.color);

    await this.selectDropdownOption(this.genderDropdown, data.allowedGender);
    await this.selectDropdownOption(this.maritalStatusDropdown, data.allowedMaritalStatus);

    await this.selectByFieldLabel(/Exclude Weekends/i, data.excludeWeekends);
    await this.selectByFieldLabel(/Exclude Holidays/i, data.excludeHolidays);
    await this.selectByFieldLabel(/Is Optional Holiday/i, data.isOptionalHoliday);
    await this.selectByFieldLabel(/Half Day Leave Allowed/i, data.halfDayLeaveAllowed);
    await this.selectByFieldLabel(/Pro Rata Leave Allocation/i, data.proRataLeaveAllocation);

    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);

    await this.selectByFieldLabel(/Enable Sandwich Policy/i, data.enableSandwichPolicy);
    await this.fillAllowedDaysPair(0, data.futureDatesAllowed, data.futureDatesDays);
    await this.fillAllowedDaysPair(1, data.pastDatesAllowed, data.pastDatesDays);
    await this.fillAllowedDaysPair(2, data.carryForwardAllowed, data.carryForwardDays);
    await this.fillAllowedDaysPair(3, data.encashAllowed, data.encashDays);

    await this.selectByFieldLabel(/Probation Period Rules Applicable/i, data.probationRulesApplicable);
    await this.selectByFieldLabel(/Notice Period Rules Applicable/i, data.noticePeriodRulesApplicable);
    await this.selectDropdownOption(this.frequencyTypeDropdown, data.frequencyType);
  }

  async saveLeaveCategory() {
    await expect(this.saveButton).toBeEnabled({ timeout: 30000 });
    await this.saveButton.click();

    if (await this.confirmYesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.confirmYesButton.click();
    }

    await Promise.race([
      this.pendingTab.waitFor({ state: 'visible', timeout: 30000 }),
      this.successToast.waitFor({ state: 'visible', timeout: 30000 }),
    ]).catch(() => {});
  }

  validationMessage(message: LeaveCategoryRequiredValidation | string): Locator {
    return this.page.getByText(message, { exact: true });
  }

  async touchRequiredFields() {
    const comboboxNames = [
      'Select year',
      'Select location',
      'Select sub-location',
      'Select shift',
      'Select Category',
      'Select Leave Type',
      'Select gender',
      'Select marital status',
    ];

    for (const name of comboboxNames) {
      const combo = this.page.getByRole('combobox', { name: new RegExp(name, 'i') }).first();
      if (await combo.isVisible().catch(() => false)) {
        await combo.click().catch(() => {});
        await this.page.keyboard.press('Escape');
      }
    }

    if (await this.categoryTypeDropdown.isVisible().catch(() => false)) {
      await this.selectDropdownOption(this.categoryTypeDropdown, 'General').catch(async () => {
        await this.categoryTypeDropdown.click().catch(() => {});
        const general = this.page.getByRole('option', { name: 'General' });
        if (await general.isVisible({ timeout: 2000 }).catch(() => false)) {
          await general.click();
        }
      });
    }

    await this.categoryNameInput.click().catch(() => {});
    await this.categoryCodeInput.click().catch(() => {});
    await this.validDaysInput.click().catch(() => {});
    await this.colorInput.click().catch(() => {});

    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);

    const yesNoCombos = this.page.getByRole('combobox', { name: /Select option|Yes|No/i });
    const count = await yesNoCombos.count();
    for (let index = 0; index < count; index += 1) {
      const combo = yesNoCombos.nth(index);
      if (await combo.isVisible().catch(() => false)) {
        await combo.click().catch(() => {});
        await this.page.keyboard.press('Escape');
      }
    }
  }

  async submitEmptyForm() {
    if (await this.saveButton.isEnabled().catch(() => false)) {
      await this.saveButton.click();
    } else {
      await this.touchRequiredFields();
      if (await this.saveButton.isEnabled().catch(() => false)) {
        await this.saveButton.click();
      } else {
        await this.saveButton.click({ force: true });
      }
    }

    await expect(this.requiredErrors.first()).toBeVisible({ timeout: 10000 });
  }

  async expectAllRequiredValidations() {
    for (const message of LEAVE_CATEGORY_REQUIRED_VALIDATIONS) {
      await expect(this.validationMessage(message)).toBeVisible();
    }
  }

  async cancelAddForm() {
    await this.cancelButton.click();
    await this.confirmYesButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.confirmYesButton.click();
    await this.pendingTab.waitFor({ state: 'visible', timeout: 15000 });
  }
}
