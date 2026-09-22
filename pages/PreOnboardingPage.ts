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
    const onFailed = (request: { url: () => string; method: () => string; failure: () => { errorText?: string } | null }) => {
      console.log(`Login request failed: ${request.method()} ${request.url()} (${request.failure()?.errorText || 'unknown'})`);
    };
    this.page.on('requestfailed', onFailed);
    try {
      await this.loginButton.click();
      await this.page
        .getByText(/invalid|ProgressEvent|Go to Application|Offer Letter/i)
        .first()
        .waitFor({ state: 'visible', timeout: 8000 })
        .catch(() => {});
    } finally {
      this.page.off('requestfailed', onFailed);
    }
  }

  async expectInvalidCredentials() {
    const progressEvent = this.page.getByText(/\[object ProgressEvent\]/i);
    const invalid = this.invalidCredentialsMessage.or(
      this.page.getByText(/invalid credentials|authentication failed|unauthorized|user not found/i),
    );

    await expect(invalid.or(progressEvent).first()).toBeVisible({ timeout: 15000 });

    if (await progressEvent.first().isVisible().catch(() => false)) {
      throw new Error(
        `Pre-onboarding login API failed with "[object ProgressEvent]" on ${this.page.url()}. The request was blocked (mixed content/CORS/network), so the app never returned Invalid Credentials.`,
      );
    }

    const text = (await invalid.first().innerText()).trim();
    console.log(`Login validation: ${text}`);
    await expect(this.usernameInput).toBeVisible();
    return text;
  }

  async expectLoggedIn() {
    const loggedIn = this.goToApplicationButton
      .or(this.offerLetterButton)
      .or(this.page.getByRole('button', { name: /^Accept$/ }))
      .or(this.page.getByRole('button', { name: /^Reject$/ }))
      .or(this.page.getByText('Offer Letter', { exact: true }));
    await expect(loggedIn.first()).toBeVisible({ timeout: 20000 });
  }

  async goToApplication() {
    await this.goToApplicationButton.click();
  }
}
