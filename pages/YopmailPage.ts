import { type Page } from '@playwright/test';

export class YopmailPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openInbox(email: string) {
    await this.page.goto('https://yopmail.com/');
    await this.dismissConsent();

    const login = this.page.getByRole('textbox', { name: 'Login' });
    await login.waitFor({ state: 'visible', timeout: 20000 });
    await login.fill(email);
    await this.page.getByTitle('Check Inbox @yopmail.com').click();
    await this.page.waitForTimeout(2000);
  }

  async waitForMailSubject(fullName: string, timeoutMs = 90000) {
    const expected = `RightlyHR - ${fullName}`;
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const subject = this.mailFrame().getByText(new RegExp(`RightlyHR - ${fullName}`));
      if (await subject.first().isVisible().catch(() => false)) {
        const text = (await subject.first().innerText()).trim();
        console.log(`Mail subject: ${text}`);
        return text || expected;
      }
      await this.refreshInbox();
      await this.page.waitForTimeout(5000);
    }
    throw new Error(`Yopmail did not receive mail for ${fullName}`);
  }

  async screenshotMail(path: string) {
    try {
      await this.mailFrame().locator('body').screenshot({ path });
    } catch {
      await this.page.screenshot({ path, fullPage: true });
    }
  }

  async waitForRerequestMail(fullName: string, previousSubject: string, timeoutMs = 90000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      await this.refreshInbox();
      await this.page.waitForTimeout(2000);
      await this.openLatestInboxMail();

      const subject = await this.readCurrentSubject(fullName);
      const body = await this.mailFrame().locator('body').innerText().catch(() => '');
      if (
        subject &&
        (subject !== previousSubject || /Comments\s*:/i.test(body)) &&
        /Comments\s*:|re-?request/i.test(`${subject}\n${body}`)
      ) {
        console.log(`Mail subject: ${subject}`);
        return subject;
      }
      await this.page.waitForTimeout(5000);
    }
    throw new Error(`No re-request Yopmail message for ${fullName}`);
  }

  async waitForNewMail(fullName: string, previousSubject: string, timeoutMs = 90000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      await this.refreshInbox();
      await this.page.waitForTimeout(2000);
      await this.openLatestInboxMail();

      const subject = await this.readCurrentSubject(fullName);
      if (subject && subject !== previousSubject && !/Request for Documents Upload/i.test(subject)) {
        console.log(`Mail subject: ${subject}`);
        return subject;
      }
      await this.page.waitForTimeout(5000);
    }
    throw new Error(`No new Yopmail message after document submit for ${fullName}`);
  }

  private async openLatestInboxMail() {
    const inbox = this.page.frameLocator('iframe[name="ifinbox"]');
    const firstMail = inbox.locator('button, .m, div[class*="m"]').first();
    if (await firstMail.isVisible().catch(() => false)) {
      await firstMail.click();
      await this.page.waitForTimeout(1000);
    }
  }

  private async readCurrentSubject(fullName: string) {
    const inMail = this.mailFrame().getByText(new RegExp(`RightlyHR - ${fullName}`));
    if (await inMail.first().isVisible().catch(() => false)) {
      return (await inMail.first().innerText()).trim();
    }
    const inbox = this.page.frameLocator('iframe[name="ifinbox"]');
    const firstMail = inbox.locator('button, .m, div[class*="m"]').first();
    return (await firstMail.innerText().catch(() => '')).trim().split('\n')[0];
  }

  async readCredentials() {
    const body = (await this.mailFrame().locator('body').innerText()).replace(/\s+/g, ' ');
    const username = body.match(/Username\s*:\s*(\S+)/i)?.[1];
    const password = body.match(/Password\s*:\s*(\S+)/i)?.[1];
    if (!username || !password) {
      throw new Error(`Could not read Username/Password from Yopmail. Mail text: ${body}`);
    }
    console.log(`Yopmail username: ${username}`);
    return { username, password };
  }

  async openOnboardingPortal() {
    const popupPromise = this.page.waitForEvent('popup');
    await this.mailFrame().getByRole('link', { name: 'Click here' }).click();
    const onboardingPage = await popupPromise;
    await onboardingPage.waitForLoadState('domcontentloaded');
    return onboardingPage;
  }

  private mailFrame() {
    return this.page.frameLocator('iframe[name="ifmail"]');
  }

  private async refreshInbox() {
    const refresh = this.page.locator('#refresh');
    if (await refresh.isVisible().catch(() => false)) {
      await refresh.click();
    }
  }

  private async dismissConsent() {
    const consent = this.page.getByRole('button', { name: /agree|accept|ok|got it/i }).first();
    if (await consent.isVisible({ timeout: 3000 }).catch(() => false)) {
      await consent.click();
    }
  }
}
