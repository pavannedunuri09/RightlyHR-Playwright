import { type Locator, type Page } from '@playwright/test';

type MailMessage = {
  id: string;
  subject: string;
  body: string;
};

export class YopmailPage {
  readonly page: Page;
  private mailbox = '';
  private cachedMail: MailMessage | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  async openInbox(email: string) {
    this.mailbox = mailboxFromEmail(email);
    this.cachedMail = null;
    await this.gotoInbox();
  }

  async waitForMailSubject(fullName: string, timeoutMs = 180000) {
    const pattern = namePattern(fullName);
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const mail = await this.findMailUi(pattern);
      if (mail) {
        this.cachedMail = mail;
        console.log(`Mail subject: ${mail.subject}`);
        return mail.subject;
      }
      await this.reloadInbox();
      await sleep(8000);
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

  async waitForRerequestMail(fullName: string, previousSubject: string, timeoutMs = 120000) {
    const pattern = namePattern(fullName);
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const mail = await this.findMailUi(pattern);
      if (
        mail &&
        (mail.subject !== previousSubject || /Comments\s*:/i.test(mail.body)) &&
        /Comments\s*:|re-?request/i.test(`${mail.subject}\n${mail.body}`)
      ) {
        this.cachedMail = mail;
        console.log(`Mail subject: ${mail.subject}`);
        return mail.subject;
      }
      await this.reloadInbox();
      await sleep(8000);
    }
    throw new Error(`No re-request Yopmail message for ${fullName}`);
  }

  async waitForMailMatching(pattern: RegExp, timeoutMs = 120000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      for (const mail of await this.listMailsUi()) {
        const combined = `${mail.subject}\n${mail.body}`;
        if (pattern.test(combined)) {
          this.cachedMail = mail;
          const subject = (await this.readCurrentSubjectFromBody(combined)) || mail.subject;
          console.log(`Mail subject: ${subject.replace(/\s+/g, ' ').trim()}`);
          return subject.replace(/\s+/g, ' ').trim();
        }
      }
      await this.reloadInbox();
      await sleep(8000);
    }
    throw new Error(`Yopmail did not receive mail matching ${pattern}`);
  }

  async waitForNewMail(fullName: string, previousSubject: string, timeoutMs = 120000) {
    const pattern = namePattern(fullName);
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const mail = await this.findMailUi(pattern);
      if (
        mail &&
        mail.subject !== previousSubject &&
        !/Request for Documents Upload/i.test(mail.subject)
      ) {
        this.cachedMail = mail;
        console.log(`Mail subject: ${mail.subject}`);
        return mail.subject;
      }
      await this.reloadInbox();
      await sleep(8000);
    }
    throw new Error(`No new Yopmail message after document submit for ${fullName}`);
  }

  async readCredentials() {
    if (this.cachedMail) {
      const parsed = parseCredentials(this.cachedMail.body);
      if (parsed) {
        console.log(`Yopmail username: ${parsed.username}`);
        return parsed;
      }
    }

    for (const mail of await this.listAllMailsUi()) {
      const parsed = parseCredentials(mail.body);
      if (parsed) {
        this.cachedMail = mail;
        console.log(`Yopmail username: ${parsed.username}`);
        return parsed;
      }
    }

    throw new Error('Could not read Username/Password from Yopmail');
  }

  async findCredentialsInInbox() {
    return this.readCredentials();
  }

  async mailBody() {
    if (this.cachedMail) {
      return this.cachedMail.body.replace(/\s+/g, ' ').trim();
    }
    const messages = await this.listMailsUi();
    return messages[0]?.body.replace(/\s+/g, ' ').trim() ?? '';
  }

  async openOnboardingPortal() {
    for (const mail of await this.listAllMailsUi()) {
      const portalUrl = extractPortalUrl(mail.body);
      if (portalUrl && parseCredentials(mail.body)) {
        this.cachedMail = mail;
        const onboardingPage = await this.page.context().newPage();
        await onboardingPage.goto(portalUrl, { waitUntil: 'domcontentloaded' });
        return onboardingPage;
      }
    }

    if (!this.cachedMail) {
      await this.listMailsUi();
    }
    const body = this.cachedMail?.body ?? '';
    const portalUrl = extractPortalUrl(body);
    if (portalUrl) {
      const onboardingPage = await this.page.context().newPage();
      await onboardingPage.goto(portalUrl, { waitUntil: 'domcontentloaded' });
      return onboardingPage;
    }

    const popupPromise = this.page.waitForEvent('popup');
    const clickHere = this.mailFrame().getByRole('link', { name: 'Click here' });
    const portalLink = this.mailFrame().getByRole('link', { name: /portal|onboarding|click here/i }).first();
    if (await clickHere.isVisible().catch(() => false)) {
      await clickHere.click();
    } else {
      await portalLink.click();
    }
    const onboardingPage = await popupPromise;
    await onboardingPage.waitForLoadState('domcontentloaded');
    return onboardingPage;
  }

  private async findMailUi(pattern: RegExp) {
    for (const mail of await this.listMailsUi()) {
      if (pattern.test(`${mail.subject}\n${mail.body}`)) {
        return mail;
      }
    }
    return null;
  }

  private async listMailsUi() {
    await this.ensureInboxVisible();

    const openBody = await this.readOpenMailBody();
    if (openBody.length > 20) {
      const subject =
        openBody.match(/RightlyHR[^\n|.]*/i)?.[0]?.trim() ||
        (await this.readOpenMailSubject()) ||
        openBody.slice(0, 120);
      return [{ id: 'open', subject, body: openBody }];
    }

    return this.listAllMailsUi();
  }

  private async listAllMailsUi() {
    await this.ensureInboxVisible();

    const rows = this.mailRows();
    const count = await rows.count();
    const limit = count > 0 ? Math.min(count, 12) : 0;
    const messages: MailMessage[] = [];

    for (let index = 0; index < limit; index += 1) {
      const row = rows.nth(index);
      if (!(await row.isVisible().catch(() => false))) {
        continue;
      }
      const preview = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      if (!preview) {
        continue;
      }

      await this.openMailRow(row);
      await sleep(900);
      const body = await this.readOpenMailBody();
      if (!body) {
        continue;
      }
      const subject =
        preview.match(/RightlyHR[^\n]*/i)?.[0]?.trim() ||
        body.match(/RightlyHR[^\n|.]*/i)?.[0]?.trim() ||
        preview.slice(0, 120);
      messages.push({ id: `mail-${index}`, subject, body });
    }

    return messages;
  }

  private mailRows() {
    return this.inboxFrame().locator('div.m[id]');
  }

  private async readOpenMailBody() {
    return (await this.mailFrame().locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  }

  private async readOpenMailSubject() {
    const selected = this.inboxFrame().locator('div.m[id].s, div.m[id][class*=" s"]');
    const preview = ((await selected.first().innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    return preview.match(/RightlyHR[^\n]*/i)?.[0]?.trim() || preview.slice(0, 120) || null;
  }

  private async openMailRow(row: Locator) {
    const subjectLink = row.locator('.lms, .lsub, button.lm, .lm').first();
    if (await subjectLink.isVisible().catch(() => false)) {
      await subjectLink.click({ timeout: 5000 });
      return;
    }
    await row.evaluate((el) => (el as HTMLElement).click());
  }

  private async gotoInbox() {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await this.page.goto(`https://yopmail.com/en/?login=${encodeURIComponent(this.mailbox)}`, {
          waitUntil: 'domcontentloaded',
        });
        await this.dismissConsent();
        await this.handleCaptchaIfVisible();
        await this.waitForInboxReady();
        return;
      } catch (error) {
        lastError = error;
        console.log(`Yopmail inbox open attempt ${attempt + 1} failed: ${error}`);
        await sleep(5000);
      }
    }
    throw lastError;
  }

  private async reloadInbox() {
    await this.gotoInbox();
  }

  private async ensureInboxVisible() {
    if (!(await this.inboxReady())) {
      await this.gotoInbox();
    }
  }

  private async openLatestInboxMail() {
    const firstMail = this.mailRows().first();
    if (await firstMail.isVisible().catch(() => false)) {
      await this.openMailRow(firstMail);
      await sleep(900);
    }
  }

  private inboxFrame() {
    return this.page.frameLocator('iframe[name="ifinbox"]');
  }

  private mailFrame() {
    return this.page.frameLocator('iframe[name="ifmail"]');
  }

  private async dismissConsent() {
    const consent = this.page.getByRole('button', { name: /agree|accept|ok|got it/i }).first();
    if (await consent.isVisible({ timeout: 3000 }).catch(() => false)) {
      await consent.click();
    }
  }

  private async handleCaptchaIfVisible() {
    if (!(await this.hasCaptcha())) {
      return;
    }

    console.log('Yopmail CAPTCHA detected — trying automated checkbox click...');
    await this.tryClickRecaptcha();

    const headed = process.env.HEADLESS !== 'true' && !(process.env.CI === 'true' || process.env.CI === '1');
    if (headed) {
      await this.page.bringToFront();
      console.log('If CAPTCHA remains, click "I\'m not a robot" in the Yopmail tab.');
    }

    const timeoutMs = headed ? 180000 : 45000;
    const cleared = await this.waitForCaptchaCleared(timeoutMs);
    if (!cleared) {
      throw new Error(
        'Yopmail CAPTCHA blocked inbox access. Run with --headed and complete the checkbox, or retry after a short wait.',
      );
    }
    console.log('Yopmail CAPTCHA cleared; continuing.');
  }

  private async hasCaptcha() {
    if (await this.page.locator('#r_parent.r_popup, .r_popup').isVisible({ timeout: 500 }).catch(() => false)) {
      return true;
    }
    const captchaText = this.page.getByText(
      /I'm not a robot|verify you are human|just a moment|checking your browser|complete the captcha|are you a robot/i,
    );
    return captchaText.first().isVisible({ timeout: 1000 }).catch(() => false);
  }

  private async tryClickRecaptcha() {
    const popup = this.page.locator('#r_parent, .r_popup');
    const popupClickTargets = [
      popup.locator('input[type="checkbox"]'),
      popup.locator('[role="checkbox"]'),
      popup.getByText(/not a robot/i),
      popup.locator('iframe').first(),
    ];
    for (const target of popupClickTargets) {
      if (await target.isVisible({ timeout: 1500 }).catch(() => false)) {
        await target.click({ timeout: 3000 }).catch(() => {});
        await sleep(1500);
      }
    }

    for (const frame of this.page.frames()) {
      if (!/recaptcha|challenges\.cloudflare|turnstile/i.test(frame.url())) {
        continue;
      }
      const checkbox = frame
        .locator(
          '#recaptcha-anchor, .recaptcha-checkbox-border, .ctp-checkbox-label, input[type="checkbox"], [role="checkbox"]',
        )
        .first();
      if (await checkbox.isVisible({ timeout: 2000 }).catch(() => false)) {
        await checkbox.click({ timeout: 3000 }).catch(() => {});
        await sleep(1500);
      }
    }
  }

  private async waitForCaptchaCleared(timeoutMs: number) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (await this.inboxReady() && !(await this.hasCaptcha())) {
        return true;
      }
      await this.tryClickRecaptcha();
      await sleep(2000);
    }
    return false;
  }

  private async waitForInboxReady() {
    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      if (await this.inboxReady()) {
        return;
      }
      await this.handleCaptchaIfVisible();
      await sleep(1000);
    }
    throw new Error('Yopmail inbox did not load after login');
  }

  private async inboxReady() {
    const inbox = this.inboxFrame();
    if (await inbox.locator('body').isVisible().catch(() => false)) {
      return true;
    }
    return this.page.locator('#refresh').isVisible().catch(() => false);
  }

  private async readCurrentSubjectFromBody(combined: string) {
    const rightly = combined.match(/RightlyHR[^\n]*/i);
    if (rightly?.[0]) {
      return rightly[0].trim();
    }
    const offer = combined.match(/[^\n]*Offer Letter[^\n]*/i);
    return offer?.[0]?.trim();
  }
}

function mailboxFromEmail(email: string) {
  return email.includes('@') ? email.split('@')[0] : email;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function namePattern(fullName: string) {
  const [first, ...rest] = fullName.trim().split(/\s+/);
  const last = rest.join(' ');
  return last
    ? new RegExp(`RightlyHR[\\s\\S]*${escapeRegExp(first)}[\\s\\S]*${escapeRegExp(last)}`, 'i')
    : new RegExp(`RightlyHR[\\s\\S]*${escapeRegExp(first)}`, 'i');
}

function parseCredentials(body: string) {
  const normalized = body.replace(/&nbsp;/gi, ' ').replace(/&amp;/g, '&');
  const username = normalized.match(/Username\s*:\s*(\S+)/i)?.[1];
  const password = normalized.match(/Password\s*:\s*([^\s<]+)/i)?.[1]?.replace(/[.,;]+$/, '');
  if (!username || !password) {
    return null;
  }
  return { username, password };
}

function extractPortalUrl(body: string) {
  const href = body.match(/href="([^"]+)"/i)?.[1];
  if (href && /onboarding|portal|rightlyhr|cluster\.rightlyhr/i.test(href)) {
    return href.replace(/&amp;/g, '&');
  }
  const url = body.match(/(https?:\/\/[^\s"'<>]+(?:onboarding|portal|pre-onboarding)[^\s"'<>]*)/i)?.[1];
  return url?.replace(/&amp;/g, '&') ?? null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
