import { expect, type Locator, type Page } from '@playwright/test';

export class EmployeeMyInfoPage {
  readonly page: Page;
  readonly basicTab: Locator;
  readonly requestDocumentsButton: Locator;
  readonly successPopup: Locator;

  constructor(page: Page) {
    this.page = page;
    this.basicTab = page.getByText('Basic Info').first();
    this.requestDocumentsButton = page.getByRole('button', { name: 'Request for Documents' });
    this.successPopup = page.getByText('Email has been sent');
  }

  async expectBasicTab() {
    await this.basicTab.waitFor({ state: 'visible', timeout: 20000 });
    await expect(this.requestDocumentsButton).toBeVisible({ timeout: 20000 });
  }

  async requestDocuments() {
    await expect(this.requestDocumentsButton).toBeEnabled({ timeout: 10000 });
    await this.requestDocumentsButton.click();
    await expect(this.successPopup.first()).toBeVisible({ timeout: 15000 });
    const text = (await this.successPopup.first().innerText()).trim();
    console.log(`Success popup: ${text}`);
    await this.page.keyboard.press('Escape').catch(() => {});
    return text;
  }

  async regenerateOnboardingCredentials() {
    const button = this.page.getByRole('button', { name: 'Generate Credentials' });
    await expect(button).toBeVisible({ timeout: 15000 });
    await button.click();
    const toast = this.page.getByText(/credential|password|sent|generated|email has been sent/i);
    await expect(toast.first()).toBeVisible({ timeout: 20000 });
    const text = (await toast.first().innerText()).trim();
    console.log(`Generate credentials: ${text}`);
    await this.page.keyboard.press('Escape').catch(() => {});
    return text;
  }
}
