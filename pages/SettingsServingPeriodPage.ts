import { expect, type Locator, type Page } from '@playwright/test';

export class SettingsServingPeriodPage {
  readonly page: Page;
  readonly employeeFieldsButton: Locator;
  readonly servingPeriodLink: Locator;
  readonly addButton: Locator;
  readonly updatedToast: Locator;
  readonly addedToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeFieldsButton = page.getByRole('button', { name: /Employee Fields/i });
    this.servingPeriodLink = page.getByRole('link', { name: /Serving period/i });
    this.addButton = page.getByRole('button', { name: /Add/i }).first();
    this.updatedToast = page.getByText(/Serving Period updated/i);
    this.addedToast = page.getByText(/Serving Period (added|created|saved)/i);
  }

  async open() {
    if (await this.servingPeriodLink.isVisible().catch(() => false)) {
      await this.servingPeriodLink.click();
      return;
    }

    if (!(await this.employeeFieldsButton.first().isVisible().catch(() => false))) {
      await this.openSettingsModule();
    }

    await this.employeeFieldsButton.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.employeeFieldsButton.first().click();

    const jobSection = this.page.getByText(/^Job$/).or(this.page.getByText(/JobThis section is used to/i));
    await jobSection.first().waitFor({ state: 'visible', timeout: 15000 });
    await jobSection.first().click();

    await this.servingPeriodLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.servingPeriodLink.click();
    await this.page.getByRole('columnheader', { name: /Serving Period Type|Type|Duration/i }).first().waitFor({
      state: 'visible',
      timeout: 20000,
    });
    console.log('Opened Settings > Employee Fields > Job > Serving period');
  }

  async ensureButtonBeforeOnboard(days: number) {
    const existing = this.page.getByRole('cell', { name: 'Button Before Onboard' });
    if (await existing.first().isVisible({ timeout: 8000 }).catch(() => false)) {
      console.log('Button Before Onboard already exists; leaving the serving-period row in place');
      const row = this.page.getByRole('row').filter({ hasText: 'Button Before Onboard' }).first();
      console.log(`Serving period row: ${(await row.innerText()).replace(/\s+/g, ' ').trim()}`);
      return;
    }

    await this.addButton.click();
    await this.selectType('Button Before Onboard');
    await this.fillDuration(days);
    const save = this.page.getByRole('button', { name: /^(Add|Save|Update)$/ }).last();
    await save.click();
    const toast = this.addedToast.or(this.updatedToast).or(this.page.getByText(/successfully/i));
    await expect(toast.first()).toBeVisible({ timeout: 15000 });
    console.log(`Added Button Before Onboard (${days} days): ${(await toast.first().innerText()).trim()}`);
  }

  private async openSettingsModule() {
    const named = this.page.getByRole('link', { name: /settings/i })
      .or(this.page.getByText('Settings', { exact: true }))
      .or(this.page.locator('img[src*="setting"]'));
    if (await named.first().isVisible().catch(() => false)) {
      await named.first().click();
      return;
    }

    const gear = this.page.locator('.bi-gear, .pi-cog, [class*="settings"]').first();
    if (await gear.isVisible().catch(() => false)) {
      await gear.click();
      return;
    }

    const headerIcon = this.page.locator('#sidenav-main-drop').locator('svg, rect, img').first();
    if (await headerIcon.isVisible().catch(() => false)) {
      await headerIcon.click();
    }

    await this.page.goto('/settings').catch(() => {});
  }

  private async selectType(name: string) {
    const typeCombobox = this.page.getByRole('combobox', { name: /serving period type/i })
      .or(this.page.getByRole('dialog').getByRole('combobox').first());
    await typeCombobox.first().click();
    await this.page.getByRole('option', { name }).click();
  }

  private async fillDuration(days: number) {
    const duration = this.page.getByRole('spinbutton', { name: /duration/i })
      .or(this.page.getByRole('textbox', { name: /duration/i }))
      .or(this.page.getByRole('dialog').getByRole('spinbutton').first());
    await duration.first().fill(String(days));
  }
}
