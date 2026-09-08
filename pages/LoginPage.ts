import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordVisibilityToggle: Locator;
  readonly forgotPassword: Locator;
  readonly loginButton: Locator;
  readonly logo: Locator;
  readonly googleButton: Locator;
  readonly microsoftButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Please enter email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Please enter password' });
    this.passwordVisibilityToggle = page.locator('.input-group-text');
    this.forgotPassword = page.getByText('Forgot Password?');
    this.loginButton = page.locator('button[type="submit"].custom-btn, button.custom-btn.btn-primary, button[type="submit"]').filter({ hasText: /^Login$/i }).first();
    this.logo = page.getByAltText('RightlyHr Logo');
    this.googleButton = page.getByRole('button', { name: 'Google Icon' });
    this.microsoftButton = page.locator('button.microsoft-login-btn');
    this.errorMessage = page.getByText('Invalid email or inactive employee');
  }

  async goto() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
    await this.emailInput.waitFor({ state: 'visible' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async togglePasswordVisibility() {
    await this.passwordVisibilityToggle.click();
  }

  async loginFromEnv() {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    if (!email || !password) {
      throw new Error('Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');
    }
    await this.goto();
    await this.login(email, password);
    try {
      await this.page.waitForURL(/\/dashboard\/emp/, {
        timeout: 45000,
        waitUntil: 'domcontentloaded',
      });
    } catch {
      await this.goto();
      await this.login(email, password);
      await this.page.waitForURL(/\/dashboard\/emp/, {
        timeout: 45000,
        waitUntil: 'domcontentloaded',
      });
    }
    await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible' });
  }

  async validateUserSession() {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});
    await this.loginFromEnv();
  }
}
