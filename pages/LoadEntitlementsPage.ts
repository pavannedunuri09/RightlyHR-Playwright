import { expect, type Locator, type Page } from '@playwright/test';
import type { LeaveAllocationBaseFilters } from './LeaveAllocationPage';

export const LOAD_ENTITLEMENTS_EMPLOYEE = {
  search: 'saii',
  optionLabel: 'SD302262 - saii Pavan Dinesh Tejaa',
};

export type EntitlementRowExpectation = {
  days: string;
  frequency: string;
  cyclePattern?: RegExp;
};

export class LoadEntitlementsPage {
  readonly page: Page;

  readonly settingsIcon: Locator;
  readonly timeOffPanel: Locator;
  readonly loadEntitlementsLink: Locator;

  readonly employeeCombobox: Locator;
  readonly employeeSearchbox: Locator;
  readonly workEmailInput: Locator;
  readonly dateOfJoiningInput: Locator;
  readonly locationInput: Locator;
  readonly subLocationInput: Locator;
  readonly shiftInput: Locator;

  readonly cycleHeader: Locator;
  readonly entitlementDaysHeader: Locator;
  readonly frequencyTypeLabel: Locator;
  readonly entitlementsTable: Locator;

  readonly loadEntitlementsButton: Locator;
  readonly confirmYesButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;

    this.settingsIcon = page.locator('rect').first();
    this.timeOffPanel = page.locator('#settings-panel-2');
    this.loadEntitlementsLink = page
      .getByText('Load Entitlements', { exact: true })
      .or(page.getByText(/Load EntitlementsThis module allows/i))
      .first();

    this.employeeCombobox = page.getByRole('combobox', { name: /Please select Employee/i });
    this.employeeSearchbox = page.getByRole('searchbox', {
      name: /Search by Employee Id or Name/i,
    });
    this.workEmailInput = this.fieldInputByLabel(/Work Email/i);
    this.dateOfJoiningInput = this.fieldInputByLabel(/Date of Joining/i);
    this.locationInput = this.fieldInputByLabel(/^Location$/i);
    this.subLocationInput = this.fieldInputByLabel(/Sub Location/i);
    this.shiftInput = this.fieldInputByLabel(/^Shift$/i);

    this.cycleHeader = page.getByRole('columnheader', { name: /Cycle/i });
    this.entitlementDaysHeader = page.getByRole('columnheader', {
      name: /Entitlement Days/i,
    });
    this.frequencyTypeLabel = page.getByText(/Frequency Type:/i);
    this.entitlementsTable = page
      .locator('table')
      .filter({ has: this.cycleHeader })
      .first();

    this.loadEntitlementsButton = page.getByRole('button', { name: /^Load Entitlements$/i });
    this.confirmYesButton = page
      .getByRole('dialog')
      .getByRole('button', { name: /^Yes$/i })
      .or(page.getByRole('button', { name: /^Yes$/i }))
      .first();
    this.successToast = page.getByText(/Leave Entitlement added/i);
  }

  fieldGroupByLabel(label: string | RegExp): Locator {
    return this.page
      .locator('.form-label, label')
      .filter({ hasText: label })
      .first()
      .locator('xpath=ancestor::*[contains(@class,"col-")][1]');
  }

  fieldInputByLabel(label: string | RegExp): Locator {
    return this.fieldGroupByLabel(label)
      .locator('input, textarea')
      .or(this.fieldGroupByLabel(label).getByRole('textbox'))
      .first();
  }

  readOnlyFields() {
    return [
      this.workEmailInput,
      this.dateOfJoiningInput,
      this.locationInput,
      this.subLocationInput,
      this.shiftInput,
    ];
  }

  categoryTab(categoryName: string) {
    return this.page.getByRole('listitem').filter({ hasText: categoryName }).first();
  }

  completedEntitlementRow(categoryName: string) {
    return this.page
      .getByRole('row')
      .filter({ hasText: categoryName })
      .filter({ hasText: /Completed/i })
      .first();
  }

  async hasCompletedEntitlements() {
    const statusHeaderVisible = await this.page
      .getByRole('columnheader', { name: /Status/i })
      .isVisible()
      .catch(() => false);
    const completedVisible = await this.page
      .getByRole('cell', { name: /^Completed$/i })
      .first()
      .isVisible()
      .catch(() => false);
    return statusHeaderVisible && completedVisible;
  }

  async expectCompletedEntitlement(
    categoryName: string,
    days: string,
    frequency: string,
  ) {
    const row = this.completedEntitlementRow(categoryName);
    await expect(row).toBeVisible({ timeout: 15000 });
    const rowText = (await row.innerText()).replace(/\s+/g, ' ');
    expect(rowText).toContain(categoryName);
    expect(rowText).toContain(days);
    expect(rowText).toContain(frequency);
    expect(rowText).toMatch(/Completed/i);
  }

  entitlementDataRows() {
    return this.entitlementsTable.locator('tbody tr').filter({
      has: this.page.getByRole('spinbutton'),
    });
  }

  async openDashboard() {
    if (!this.page.url().includes('/dashboard/emp')) {
      await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' });
    }
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page
      .getByText('Have a nice day at work!')
      .waitFor({ state: 'visible', timeout: 15000 });
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

    if (!(await this.loadEntitlementsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
      await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(500);
      await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
      await this.timeOffPanel.click({ force: true });
    }

    await this.loadEntitlementsLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.loadEntitlementsLink.click();
    await this.employeeCombobox.waitFor({ state: 'visible', timeout: 15000 });
    await this.loadEntitlementsButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectEmployee(
    searchText: string = LOAD_ENTITLEMENTS_EMPLOYEE.search,
    optionLabel: string = LOAD_ENTITLEMENTS_EMPLOYEE.optionLabel,
  ) {
    await this.employeeCombobox.click();
    await this.employeeSearchbox.waitFor({ state: 'visible', timeout: 5000 });
    await this.employeeSearchbox.fill(searchText);
    await this.page.waitForTimeout(800);

    const escaped = optionLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const option = this.page
      .getByRole('option', { name: new RegExp(escaped, 'i') })
      .or(this.page.getByText(new RegExp(escaped, 'i')));
    await option.first().click({ timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  async expectFieldReadOnly(field: Locator) {
    const disabled = await field.isDisabled().catch(() => false);
    const readOnly = (await field.getAttribute('readonly')) !== null;
    const ariaReadOnly = (await field.getAttribute('aria-readonly')) === 'true';
    const className = (await field.getAttribute('class').catch(() => '')) || '';
    const parentDisabled = await field
      .locator('xpath=ancestor::*[contains(@class,"p-disabled")][1]')
      .count()
      .then((count) => count > 0)
      .catch(() => false);

    expect(
      disabled || readOnly || ariaReadOnly || className.includes('p-disabled') || parentDisabled,
      'field should be read-only or disabled before employee selection',
    ).toBeTruthy();
  }

  async expectReadOnlyFieldsBeforeSelection() {
    await expect(this.employeeCombobox).toBeEnabled();

    for (const field of this.readOnlyFields()) {
      await expect(field).toBeVisible();
      await this.expectFieldReadOnly(field);
    }
  }

  async expectEmployeeDetailsPopulated(expected: LeaveAllocationBaseFilters) {
    await expect(this.workEmailInput).not.toHaveValue('');
    await expect(this.dateOfJoiningInput).not.toHaveValue('');
    await expect(this.locationInput).toHaveValue(new RegExp(expected.location, 'i'));
    await expect(this.subLocationInput).toHaveValue(new RegExp(expected.subLocation, 'i'));
    await expect(this.shiftInput).toHaveValue(new RegExp(expected.shift, 'i'));
  }

  async expectCategoryTabsVisible(categoryNames: string[]) {
    for (const categoryName of categoryNames) {
      await expect(this.categoryTab(categoryName)).toBeVisible({ timeout: 15000 });
    }
  }

  async selectCategoryTab(categoryName: string) {
    await this.categoryTab(categoryName).click();
    await this.page.waitForTimeout(500);
  }

  async expectEntitlementsTableVisible() {
    await expect(this.cycleHeader).toBeVisible();
    await expect(this.entitlementDaysHeader).toBeVisible();
    await expect(this.entitlementsTable).toBeVisible();
    await expect(this.entitlementDataRows().first()).toBeVisible({ timeout: 15000 });
  }

  async expectCategoryEntitlement(
    categoryName: string,
    expectation: EntitlementRowExpectation,
  ) {
    await this.selectCategoryTab(categoryName);
    await expect(this.frequencyTypeLabel).toBeVisible();
    await expect(
      this.page.getByText(new RegExp(`Frequency Type:\\s*${expectation.frequency}`, 'i')),
    ).toBeVisible();

    const tableText = (await this.entitlementsTable.innerText()).replace(/\s+/g, ' ');
    expect(tableText).toContain(expectation.days);

    if (expectation.cyclePattern) {
      expect(tableText).toMatch(expectation.cyclePattern);
    }

    await expect(this.entitlementDataRows().first().getByRole('spinbutton')).toHaveValue(
      expectation.days,
    );
  }

  async loadEntitlements() {
    await this.loadEntitlementsButton.click();

    if (await this.confirmYesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.confirmYesButton.click();
    }

    await this.expectLoadOutcome();
  }

  async expectLoadOutcome() {
    const successVisible = await this.successToast
      .isVisible({ timeout: 15000 })
      .catch(() => false);

    if (successVisible) {
      return;
    }

    const pageText = (await this.page.locator('body').innerText()).replace(/\s+/g, ' ');
    const alreadyLoaded =
      /already|exist|duplicate|loaded|entitled/i.test(pageText) &&
      !/Leave Entitlement added/i.test(pageText);

    expect(
      alreadyLoaded,
      'expected success toast or an already-loaded entitlement message',
    ).toBeTruthy();
  }

  async expectSuccessToast() {
    await expect(this.successToast).toBeVisible({ timeout: 15000 });
  }

  async dismissToastIfPresent() {
    const failureIcon = this.page.getByRole('img', { name: /failure icon/i });
    if (await failureIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
      await failureIcon.click().catch(() => {});
    }

    await this.successToast.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.page.keyboard.press('Escape').catch(() => {});
  }
}
