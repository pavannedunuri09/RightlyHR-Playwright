import { type Locator, type Page } from '@playwright/test';

export type EntitlementCriterion =
  | 'allowedPerMonth'
  | 'pastDatesAllowed'
  | 'futureDatesAllowed'
  | 'minHalfDayHours'
  | 'minFullDayHours';

export class WfhEntitlementCriteriaPage {
  readonly page: Page;
  readonly settingsIcon: Locator;
  readonly timeOffSettingsPanel: Locator;
  readonly attendanceEligibilityCard: Locator;
  readonly wfhEntitlementLink: Locator;
  readonly updateMenuItem: Locator;
  readonly updateButton: Locator;
  readonly cancelButton: Locator;
  readonly successToast: Locator;
  readonly nullValueError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.settingsIcon = page.locator('img[src*="setting" i]').first();
    this.timeOffSettingsPanel = page.locator('#settings-panel-2');
    this.attendanceEligibilityCard = page.getByText(/Attendance Eligibility Criteria/i).first();
    this.wfhEntitlementLink = page.getByRole('link', { name: 'WFH Entitlement Criteria' });
    this.updateMenuItem = page.locator('a.dropdown-item').filter({ hasText: /^Update$/ });
    this.updateButton = page.getByRole('button', { name: 'Update' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.successToast = page.getByText('Data Updated Successfully');
    this.nullValueError = page.getByText('Value cannot be null');
  }

  criterionRow(criterion: EntitlementCriterion) {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: criterion, exact: true }),
    });
  }

  criterionNameCell(criterion: EntitlementCriterion) {
    return this.page.getByRole('cell', { name: criterion, exact: true });
  }

  criterionValueCell(criterion: EntitlementCriterion) {
    return this.criterionRow(criterion).getByRole('cell').nth(1);
  }

  kebabMenu(criterion: EntitlementCriterion) {
    return this.criterionRow(criterion).locator('.dropdown > a');
  }

  valueInput(criterion: EntitlementCriterion) {
    return this.criterionRow(criterion).getByRole('textbox').or(this.page.getByRole('textbox'));
  }

  async openFromDashboard() {
    await this.page.goto('/dashboard/emp');
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible' });
    await this.openSettingsTimeOff();
    await this.attendanceEligibilityCard.waitFor({ state: 'visible', timeout: 15000 });
    await this.attendanceEligibilityCard.click();
    await this.wfhEntitlementLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.wfhEntitlementLink.click();
    await this.page.waitForURL(/settings|eligibility|entitlement|wfh/i, { timeout: 15000 }).catch(() => {});
    await this.criterionNameCell('allowedPerMonth').waitFor({ state: 'visible', timeout: 15000 });
  }

  async openSettingsTimeOff() {
    await this.page.waitForTimeout(2000);
    if (!(await this.timeOffSettingsPanel.isVisible().catch(() => false))) {
      if (await this.settingsIcon.isVisible().catch(() => false)) {
        await this.settingsIcon.click();
      } else {
        await this.page.locator('rect').first().click();
      }
      await this.timeOffSettingsPanel.waitFor({ state: 'visible', timeout: 15000 });
    }
    await this.timeOffSettingsPanel.click();
  }

  async readValue(criterion: EntitlementCriterion) {
    const input = this.criterionRow(criterion).getByRole('textbox');
    if (await input.isVisible().catch(() => false)) {
      return (await input.inputValue()).trim();
    }
    await this.criterionValueCell(criterion).waitFor({ state: 'visible' });
    return (await this.criterionValueCell(criterion).innerText()).trim();
  }

  visibleUpdateMenuItem() {
    return this.updateMenuItem.filter({ visible: true }).first();
  }

  async openKebab(criterion: EntitlementCriterion) {
    await this.kebabMenu(criterion).click();
    await this.visibleUpdateMenuItem().waitFor({ state: 'visible', timeout: 15000 });
  }

  async openUpdate(criterion: EntitlementCriterion) {
    await this.openKebab(criterion);
    await this.visibleUpdateMenuItem().click();
    await this.updateButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.valueInput(criterion).waitFor({ state: 'visible', timeout: 15000 });
  }

  async cancelUpdate() {
    await this.cancelButton.click();
    await this.updateButton.waitFor({ state: 'hidden', timeout: 15000 }).catch(async () => {
      await this.page.keyboard.press('Escape');
      await this.updateButton.waitFor({ state: 'hidden', timeout: 5000 });
    });
  }

  async submitUpdate() {
    await this.updateButton.click();
  }

  async updateValue(criterion: EntitlementCriterion, value: string) {
    await this.openUpdate(criterion);
    await this.valueInput(criterion).fill(value);
    await this.submitUpdate();
    await this.successToast.waitFor({ state: 'visible', timeout: 15000 });
    await this.successToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  nextValue(current: string) {
    const parsed = Number(current);
    if (Number.isNaN(parsed)) {
      return '1';
    }
    return String(parsed + 1);
  }
}
