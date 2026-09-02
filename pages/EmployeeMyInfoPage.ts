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
    await this.requestDocumentsButton.click();
    await expect(this.successPopup).toBeVisible({ timeout: 15000 });
    const text = (await this.successPopup.innerText()).trim();
    console.log(`Success popup: ${text}`);
    return text;
  }
}
