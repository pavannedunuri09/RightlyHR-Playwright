import { expect, type Locator, type Page } from '@playwright/test';

export class PreOnboardingPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly invalidCredentialsMessage: Locator;
  readonly goToApplicationButton: Locator;
  readonly offerLetterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username*' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.invalidCredentialsMessage = page.getByText(
      /invalid|incorrect|wrong (email|mail|password|username|credentials)|unable to login|login failed/i,
    );
    this.goToApplicationButton = page.getByRole('button', { name: 'Go to Application' });
    this.offerLetterButton = page.getByRole('button', { name: /Offer Letter/ });
  }

  async expectLoaded() {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 20000 });
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectInvalidCredentials() {
    await expect(this.invalidCredentialsMessage.first()).toBeVisible({ timeout: 15000 });
    const text = (await this.invalidCredentialsMessage.first().innerText()).trim();
    console.log(`Login validation: ${text}`);
    await expect(this.usernameInput).toBeVisible();
    return text;
  }

  async expectLoggedIn() {
    await expect(this.goToApplicationButton.or(this.offerLetterButton).first()).toBeVisible({ timeout: 20000 });
  }

  async goToApplication() {
    await this.goToApplicationButton.click();
  }
}
