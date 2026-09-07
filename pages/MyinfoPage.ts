import { expect, type Locator, type Page } from '@playwright/test';

export class MyInfoPage {
  constructor(private page: Page) {}

  async openMyInfo() {
    await this.page.getByText('My Info', { exact: true }).click();
    console.log('Clicked on My Info tab');
  }

  async clickEdit() {
    await this.page.locator("svg[width='20'][height='20'][viewBox='0 0 20 20']").click();
    await expect(this.salutationCombobox()).toBeVisible({ timeout: 15000 });
    console.log('Clicked on Edit icon');
  }

  async selectSalutation(value: string) {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});

    const field = this.salutationField();
    const combobox = this.salutationCombobox();
    await expect(combobox).toBeVisible({ timeout: 15000 });
    await combobox.click();

    if (!(await this.selectPanelVisible())) {
      const trigger = field
        .getByRole('button', { name: /dropdown trigger/i })
        .or(field.locator('.p-select-dropdown, .p-dropdown-trigger, [data-pc-section="dropdown"]'));
      if (await trigger.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await trigger.first().click();
      }
    }

    await expect.poll(async () => this.selectPanelVisible(), { timeout: 10000 }).toBeTruthy();
    console.log('Opened Salutation dropdown');

    const listbox = this.page.getByRole('listbox').last();
    const option = listbox.getByRole('option', { name: value, exact: true });
    if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
      await option.click();
    } else {
      await this.page.getByRole('option', { name: value, exact: true }).click();
    }

    await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await expect(combobox).toContainText(value);
    console.log(`Selected Salutation: ${value}`);
  }

  async saveChanges() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  get successMessage() {
    return this.page.getByText(/Basic information updated|saved successfully|updated successfully/i).first();
  }

  get salutationValue() {
    return this.salutationField();
  }

  private salutationField(): Locator {
    return this.page.getByText('Salutation*', { exact: true }).locator('..');
  }

  private salutationCombobox(): Locator {
    return this.salutationField()
      .getByRole('combobox')
      .or(this.page.getByRole('combobox', { name: /please select salutation|salutation|Mr\.|Miss\.|Mrs\.|Ms\./i }))
      .first();
  }

  private async selectPanelVisible() {
    return (
      (await this.page.getByRole('listbox').last().isVisible().catch(() => false)) ||
      (await this.page.locator('.p-select-overlay, .p-dropdown-panel').last().isVisible().catch(() => false)) ||
      (await this.page.getByRole('option').first().isVisible().catch(() => false))
    );
  }
}
