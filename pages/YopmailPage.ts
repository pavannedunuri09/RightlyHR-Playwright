import { type Locator, type Page } from '@playwright/test';

type MailMessage = {
  id: string;
  subject: string;
  body: string;
};

const CAPTCHA_WAIT_MS = 120_000;

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
    if (!this.pageUsable()) {
      return;
    }

    const onMailbox = /yopmail\.com/i.test(this.page.url());
    if (onMailbox) {
      await this.bringPageToFront().catch(() => {});
      if (await this.hasCaptcha()) {
        console.log('Yopmail already open with CAPTCHA; waiting up to 2 minutes for it to be solved.');
        await this.handleCaptchaIfVisible(CAPTCHA_WAIT_MS);
        if (await this.inboxReady()) {
          return;
        }
      }
      if (await this.inboxReady()) {
        return;
      }
    }

    await this.gotoInbox({ soft: true }).catch((error) => {
      console.log(`Yopmail open inbox soft-failed: ${error}`);
    });
  }

  async waitForMailSubject(fullName: string, timeoutMs = 180000, email?: string) {
    const patterns = [namePattern(fullName)];
    if (email) {
      const localPart = mailboxFromEmail(email);
      patterns.push(new RegExp(`RightlyHR[\\s\\S]*${escapeRegExp(localPart)}`, 'i'));
      patterns.push(/Request for Documents Upload|Request for Documents/i);
    }

    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      if (!this.pageUsable()) {
        throw new Error('Yopmail tab was closed while waiting for mail');
      }
      await this.bringPageToFront();

      if (await this.hasCaptcha()) {
        const cleared = await this.handleCaptchaIfVisible(CAPTCHA_WAIT_MS);
        if (cleared) {
          continue;
        }
      } else if (!(await this.inboxReady())) {
        const onYopmail = /yopmail\.com/i.test(this.page.url());
        if (!onYopmail) {
          await this.gotoInbox({ soft: true }).catch((error) => {
            console.log(`Yopmail inbox refresh failed: ${error}`);
          });
        } else {
          await sleep(5000);
        }
      }

      try {
        for (const pattern of patterns) {
          const mail = await this.findMailUi(pattern);
          if (mail) {
            this.cachedMail = mail;
            console.log(`Mail subject: ${mail.subject}`);
            return mail.subject;
          }
        }
        if (!(await this.hasCaptcha())) {
          await this.reloadInbox({ soft: true });
        }
      } catch (error) {
        console.log(`Yopmail mail wait interrupted: ${error}`);
      }
      await sleep(5000);
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
      if (await this.hasCaptcha()) {
        const cleared = await this.handleCaptchaIfVisible(CAPTCHA_WAIT_MS);
        if (!cleared) {
          await sleep(5000);
          continue;
        }
      }
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
      await this.reloadInboxIfAllowed();
      await sleep(8000);
    }
    throw new Error(`No re-request Yopmail message for ${fullName}`);
  }

  async waitForMailMatching(pattern: RegExp, timeoutMs = 120000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (await this.hasCaptcha()) {
        const cleared = await this.handleCaptchaIfVisible(CAPTCHA_WAIT_MS);
        if (!cleared) {
          await sleep(5000);
          continue;
        }
      }
      const matches: MailMessage[] = [];
      for (const mail of await this.listAllMailsUi()) {
        const combined = `${mail.subject}\n${mail.body}`;
        if (pattern.test(combined)) {
          matches.push(mail);
        }
      }
      if (matches.length > 0) {
        this.cachedMail = pickBestPortalMail(matches);
        const subject =
          (await this.readCurrentSubjectFromBody(`${this.cachedMail.subject}\n${this.cachedMail.body}`)) ||
          this.cachedMail.subject;
        console.log(`Mail subject: ${subject.replace(/\s+/g, ' ').trim()}`);
        return subject.replace(/\s+/g, ' ').trim();
      }
      await this.reloadInboxIfAllowed();
      await sleep(5000);
    }
    throw new Error(`Yopmail did not receive mail matching ${pattern}`);
  }

  async waitForNewMail(fullName: string, previousSubject: string, timeoutMs = 240000) {
    const namePat = namePattern(fullName);
    const submitPat = /Document Submitted Successfully|Documents Submitted|Submitted successfully|Thank you for submitting/i;
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      if (await this.hasCaptcha()) {
        const cleared = await this.handleCaptchaIfVisible(CAPTCHA_WAIT_MS);
        if (!cleared) {
          await sleep(5000);
          continue;
        }
      }
      for (const mail of await this.listAllMailsUi()) {
        const combined = `${mail.subject}\n${mail.body}`;
        if (!namePat.test(combined)) {
          continue;
        }

        if (submitPat.test(combined)) {
          this.cachedMail = mail;
          console.log(`Mail subject: ${mail.subject}`);
          return mail.subject;
        }

        const isRequestMail =
          mail.subject === previousSubject ||
          (/Request for Documents Upload|Request for Documents/i.test(mail.subject) &&
            !submitPat.test(combined));
        if (isRequestMail) {
          continue;
        }

        this.cachedMail = mail;
        console.log(`Mail subject: ${mail.subject}`);
        return mail.subject;
      }
      await this.reloadInboxIfAllowed();
      await sleep(8000);
    }
    throw new Error(`No new Yopmail message after document submit for ${fullName}`);
  }

  async readCredentials(options?: { skipCached?: boolean; preferPattern?: RegExp }) {
    let lastError = 'Could not read Username/Password from Yopmail';
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        return await this.readCredentialsOnce(options);
      } catch (error) {
        lastError = String(error);
        console.log(`Yopmail credentials not ready yet (attempt ${attempt + 1}/5): ${lastError}`);
        await sleep(attempt === 0 ? 1500 : 3000);
        if (this.cachedMail) {
          await this.ensureCachedMailOpen();
        }
      }
    }
    throw new Error(lastError.includes('Could not read') ? lastError : 'Could not read Username/Password from Yopmail');
  }

  async findCredentialsInInbox(options?: { skipCached?: boolean; preferPattern?: RegExp }) {
    return this.readCredentials(options);
  }

  private async readCredentialsOnce(options?: { skipCached?: boolean; preferPattern?: RegExp }) {
    if (!options?.skipCached && this.cachedMail) {
      await this.ensureCachedMailOpen();
      for (let poll = 0; poll < 10; poll++) {
        const liveBody = await this.readLiveMailContent();
        const parsed = parseCredentials(liveBody) ?? parseCredentials(this.cachedMail.body);
        if (parsed) {
          console.log(`Yopmail username: ${parsed.username}`);
          return parsed;
        }
        await sleep(1000);
      }
    }

    const ranked = await this.collectCredentialMails();
    if (options?.preferPattern) {
      const preferred = ranked.find((entry) => options.preferPattern!.test(`${entry.mail.subject}\n${entry.mail.body}`));
      if (preferred) {
        this.cachedMail = preferred.mail;
        console.log(`Yopmail username: ${preferred.credentials.username}`);
        return preferred.credentials;
      }
    }

    if (ranked.length > 0) {
      this.cachedMail = ranked[0].mail;
      console.log(`Yopmail username: ${ranked[0].credentials.username}`);
      return ranked[0].credentials;
    }

    throw new Error('Could not read Username/Password from Yopmail');
  }

  private async collectCredentialMails() {
    const results: Array<{ mail: MailMessage; credentials: { username: string; password: string }; score: number }> = [];

    for (const pattern of [/Request for Documents Upload|Request for Documents/i, /Offer Letter Issued|Offer Letter Released/i]) {
      try {
        await this.openMatchingMailInViewer(pattern);
        for (let poll = 0; poll < 6; poll++) {
          const live = await this.readLiveMailContent();
          const parsed =
            parseCredentials(live) ??
            (this.cachedMail ? parseCredentials(this.cachedMail.body) : null);
          if (parsed && this.cachedMail) {
            results.push({
              mail: this.cachedMail,
              credentials: parsed,
              score: credentialMailScore(`${this.cachedMail.subject}\n${live}`, 0) + 2000 - poll,
            });
            break;
          }
          await sleep(1000);
        }
      } catch {
        // Try the next credential mail pattern.
      }
    }

    const messages = await this.listAllMailsUi();

    for (let index = 0; index < messages.length; index += 1) {
      const mail = messages[index];
      const parsed = parseCredentials(mail.body);
      if (!parsed) {
        continue;
      }
      const combined = `${mail.subject}\n${mail.body}`;
      if (results.some((entry) => `${entry.credentials.username}|${entry.credentials.password}` === `${parsed.username}|${parsed.password}`)) {
        continue;
      }
      results.push({
        mail,
        credentials: parsed,
        score: credentialMailScore(combined, index),
      });
    }

    return results.sort((left, right) => right.score - left.score);
  }

  async mailBody() {
    if (this.cachedMail) {
      return this.cachedMail.body.replace(/\s+/g, ' ').trim();
    }
    const messages = await this.listMailsUi();
    return messages[0]?.body.replace(/\s+/g, ' ').trim() ?? '';
  }

  async openOnboardingPortal() {
    const cachedCombined = this.cachedMail ? `${this.cachedMail.subject}\n${this.cachedMail.body}` : '';
    if (/Offer Letter Issued|Offer Letter Released/i.test(cachedCombined)) {
      try {
        return await this.openOnboardingPortalFromOfferLetterMail();
      } catch (error) {
        console.log(`Offer-letter portal open failed; trying cached mail body. ${error}`);
      }
    }

    if (this.cachedMail) {
      await this.ensureCachedMailOpen();
      const fromCachedFrame = await this.openPortalViaMailFrame();
      if (fromCachedFrame) {
        return fromCachedFrame;
      }
      const fromCached = await this.openPortalFromMailBody(this.cachedMail.body);
      if (fromCached) {
        return fromCached;
      }
    }

    for (const mail of await this.listAllMailsUi()) {
      this.cachedMail = mail;
      const fromFrame = await this.openPortalViaMailFrame();
      if (fromFrame) {
        return fromFrame;
      }
      const portalUrl = extractPortalUrl(mail.body);
      if (portalUrl) {
        const onboardingPage = await this.page.context().newPage();
        await onboardingPage.goto(portalUrl, { waitUntil: 'domcontentloaded' });
        return onboardingPage;
      }
    }

    try {
      return await this.openOnboardingPortalFromDocumentRequestMail();
    } catch (error) {
      console.log(`Document-request portal fallback failed: ${error}`);
    }

    try {
      return await this.openOnboardingPortalFromCredentialMails();
    } catch (error) {
      console.log(`Credential-mail portal fallback failed: ${error}`);
    }

    const portalUrl = await this.findPortalUrlInInbox();
    if (portalUrl) {
      const onboardingPage = await this.page.context().newPage();
      await onboardingPage.goto(portalUrl, { waitUntil: 'domcontentloaded' });
      return onboardingPage;
    }

    const preOnboardingBase = defaultPreOnboardingBaseUrl();
    console.log(`Opening onboarding portal from default URL: ${preOnboardingBase}`);
    const onboardingPage = await this.page.context().newPage();
    await onboardingPage.goto(preOnboardingBase, { waitUntil: 'domcontentloaded' });
    return onboardingPage;
  }

  async openOnboardingPortalFromOfferLetterMail() {
    await this.openMatchingMailInViewer(/Offer Letter Issued|Offer Letter Released/i);
    const fromOpenMail = await this.openPortalFromOpenMail();
    if (fromOpenMail) {
      return fromOpenMail;
    }
    const fromBody = await this.openPortalFromMailBody(await this.readLiveMailContent());
    if (fromBody) {
      return fromBody;
    }
    throw new Error('Could not open portal from offer letter mail');
  }

  async openOnboardingPortalFromDocumentRequestMail() {
    await this.openMatchingMailInViewer(/Request for Documents Upload|Request for Documents/i);
    const fromOpenMail = await this.openPortalFromOpenMail();
    if (fromOpenMail) {
      return fromOpenMail;
    }
    const fromBody = await this.openPortalFromMailBody(await this.readLiveMailContent());
    if (fromBody) {
      return fromBody;
    }
    throw new Error('Could not open portal from document request mail');
  }

  async findPortalUrlInInbox(): Promise<string | null> {
    if (this.cachedMail && /Offer Letter Issued|Offer Letter Released/i.test(`${this.cachedMail.subject}\n${this.cachedMail.body}`)) {
      await this.ensureCachedMailOpen();
      const cachedUrl = extractPortalUrl(await this.readLiveMailContent());
      if (cachedUrl) {
        return cachedUrl;
      }
    }

    try {
      await this.openMatchingMailInViewer(/Offer Letter Issued|Offer Letter Released/i);
      const offerUrl = extractPortalUrl(await this.readLiveMailContent());
      if (offerUrl) {
        return offerUrl;
      }
    } catch {
      // Try document-request mail next.
    }

    try {
      await this.openMatchingMailInViewer(/Request for Documents Upload|Request for Documents/i);
      const url = extractPortalUrl(await this.readLiveMailContent());
      if (url) {
        return url;
      }
    } catch {
      // Try scanning the rest of the inbox below.
    }

    for (const mail of await this.listAllMailsUi()) {
      const url = extractPortalUrl(`${mail.subject}\n${mail.body}`);
      if (url) {
        return url;
      }
    }

    return null;
  }

  async openOnboardingPortalFromCredentialMails() {
    try {
      return await this.openOnboardingPortalFromDocumentRequestMail();
    } catch {
      // Continue with ranked credential mails.
    }

    const mails = await this.listAllMailsUi();
    const ranked = mails
      .map((mail, index) => ({
        mail,
        index,
        combined: `${mail.subject}\n${mail.body}`,
      }))
      .filter(
        ({ combined }) =>
          parseCredentials(combined) ||
          /Offer Letter Issued|Request for Documents|Onboarding Portal/i.test(combined),
      )
      .sort((left, right) => scorePortalMail(right.combined, right.index) - scorePortalMail(left.combined, left.index));

    for (const { mail } of ranked) {
      this.cachedMail = mail;
      await this.ensureCachedMailOpen();
      const fromFrame = await this.openPortalViaMailFrame();
      if (fromFrame) {
        return fromFrame;
      }
      const portalUrl = extractPortalUrl(`${mail.body}\n${await this.readOpenMailHtml()}`);
      if (portalUrl) {
        const onboardingPage = await this.page.context().newPage();
        await onboardingPage.goto(portalUrl, { waitUntil: 'domcontentloaded' });
        return onboardingPage;
      }
    }

    throw new Error('Could not open onboarding portal from credential mails');
  }

  async openMatchingMailInViewer(pattern: RegExp) {
    await this.ensureInboxVisible();
    const rows = this.mailRows();
    const count = await rows.count();

    for (let index = 0; index < count; index += 1) {
      const row = rows.nth(index);
      if (!(await row.isVisible().catch(() => false))) {
        continue;
      }
      const preview = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      await this.openMailRow(row);
      await sleep(900);
      const body = await this.readOpenMailBody();
      const html = await this.readOpenMailHtml();
      const combined = `${preview}\n${body}\n${html}`;
      if (pattern.test(combined)) {
        this.cachedMail = {
          id: `mail-${index}`,
          subject: preview.match(/RightlyHR[^\n]*/i)?.[0]?.trim() || preview.slice(0, 120),
          body: `${body}\n${html}`,
        };
        console.log(`Opened Yopmail message in viewer: ${this.cachedMail.subject}`);
        return this.cachedMail;
      }
    }

    throw new Error(`Could not open Yopmail message matching ${pattern}`);
  }

  async findAllCredentialsInInbox() {
    const ranked = await this.collectCredentialMails();
    const unique: Array<{ username: string; password: string }> = [];
    const seen = new Set<string>();

    if (this.cachedMail) {
      const parsed = parseCredentials(this.cachedMail.body);
      if (parsed) {
        const key = `${parsed.username}|${parsed.password}`;
        seen.add(key);
        unique.push(parsed);
      }
    }

    for (const entry of ranked) {
      const key = `${entry.credentials.username}|${entry.credentials.password}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      unique.push(entry.credentials);
    }

    return unique;
  }

  private async openPortalFromOpenMail() {
    await sleep(1200);
    const portalUrl = await this.getPortalUrlFromOpenMail();
    if (portalUrl) {
      console.log(`Opening onboarding portal URL from mail: ${portalUrl}`);
      const onboardingPage = await this.page.context().newPage();
      await onboardingPage.goto(portalUrl, { waitUntil: 'domcontentloaded' });
      return onboardingPage;
    }

    const fromFrame = await this.clickPortalViaMailFrameDirect();
    if (fromFrame) {
      return fromFrame;
    }

    return this.openPortalViaMailFrame();
  }

  private async readAnchorHrefsFromMailFrame(): Promise<string[]> {
    const frame = this.page.frame({ name: 'ifmail' });
    if (!frame) {
      return [];
    }
    return frame.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]'))
        .map((anchor) => anchor.getAttribute('href') || '')
        .filter(Boolean),
    );
  }

  private async clickPortalViaMailFrameDirect(): Promise<Page | null> {
    const frame = this.page.frame({ name: 'ifmail' });
    if (!frame) {
      return null;
    }

    const link = frame.getByRole('link', { name: 'Click here' })
      .or(frame.getByRole('link', { name: /^Click$/i }))
      .or(frame.locator('a').filter({ hasText: /^Click$/i }).first());
    if (!(await link.isVisible({ timeout: 5000 }).catch(() => false))) {
      return null;
    }

    const href = ((await link.getAttribute('href').catch(() => '')) || '').trim();
    const normalized = href ? normalizePortalHref(href) : null;
    if (normalized) {
      const onboardingPage = await this.page.context().newPage();
      await onboardingPage.goto(normalized, { waitUntil: 'domcontentloaded' });
      return onboardingPage;
    }

    const popupPromise = this.page.context().waitForEvent('page', { timeout: 20000 }).catch(() => null);
    await link.click();
    const onboardingPage = await popupPromise;
    if (onboardingPage) {
      await onboardingPage.waitForLoadState('domcontentloaded');
      return onboardingPage;
    }

    return null;
  }

  private async getPortalUrlFromOpenMail(): Promise<string | null> {
    const live = await this.readLiveMailContent();
    const fromBody = extractPortalUrl(live);
    if (fromBody) {
      return fromBody;
    }

    for (const href of await this.readAnchorHrefsFromMailFrame()) {
      const normalized = normalizePortalHref(href);
      if (normalized) {
        return normalized;
      }
    }

    const linkLocators = [
      this.mailFrame().getByRole('link', { name: 'Click here' }),
      this.mailFrame().getByRole('link', { name: /^Click$/i }),
      this.mailFrame().locator('a').filter({ hasText: /click here|^click$/i }),
    ];
    for (const locator of linkLocators) {
      const count = await locator.count();
      for (let index = 0; index < count; index += 1) {
        const href = ((await locator.nth(index).getAttribute('href').catch(() => '')) || '').trim();
        const normalized = normalizePortalHref(href);
        if (normalized) {
          return normalized;
        }
      }
    }

    return null;
  }

  private async openPortalFromMailBody(body: string) {
    let portalUrl = extractPortalUrl(body);
    if (!portalUrl) {
      portalUrl = extractPortalUrl(await this.readOpenMailHtml());
    }
    if (!portalUrl) {
      return null;
    }
    console.log(`Opening onboarding portal URL from mail body: ${portalUrl}`);
    const onboardingPage = await this.page.context().newPage();
    await onboardingPage.goto(portalUrl, { waitUntil: 'domcontentloaded' });
    return onboardingPage;
  }

  private async openPortalViaMailFrame() {
    const clickHereLinks = this.mailFrame().locator('a').filter({ hasText: /click here/i });
    const clickHereCount = await clickHereLinks.count();
    for (let index = 0; index < clickHereCount; index += 1) {
      const opened = await this.clickPortalLink(clickHereLinks.nth(index), { allowUnknownHref: true });
      if (opened) {
        return opened;
      }
    }

    const clickHere = this.mailFrame().getByRole('link', { name: 'Click here' });
    const fromClickHere = await this.clickPortalLink(clickHere, { allowUnknownHref: true });
    if (fromClickHere) {
      return fromClickHere;
    }

    const namedPatterns = [/portal link/i, /onboarding portal/i, /view offer/i, /log in/i];
    for (const pattern of namedPatterns) {
      const opened = await this.clickPortalLink(this.mailFrame().getByRole('link', { name: pattern }).first());
      if (opened) {
        return opened;
      }
    }

    const textClickHere = this.mailFrame().getByText(/click here/i).first();
    const fromText = await this.clickPortalLink(textClickHere, { allowUnknownHref: true });
    if (fromText) {
      return fromText;
    }

    const portalLinks = this.mailFrame().locator('a[href]');
    const linkCount = await portalLinks.count();
    for (let index = 0; index < linkCount; index += 1) {
      const link = portalLinks.nth(index);
      const href = ((await link.getAttribute('href').catch(() => '')) || '').trim();
      if (!href || !isPortalHref(href)) {
        continue;
      }
      const opened = await this.clickPortalLink(link);
      if (opened) {
        return opened;
      }
    }

    return null;
  }

  private async clickPortalLink(link: Locator, options?: { allowUnknownHref?: boolean }) {
    if (!(await link.isVisible({ timeout: 5000 }).catch(() => false))) {
      return null;
    }

    const href = ((await link.getAttribute('href').catch(() => '')) || '').trim();
    const normalizedHref = href ? normalizePortalHref(href) : null;
    if (normalizedHref) {
      const onboardingPage = await this.page.context().newPage();
      await onboardingPage.goto(normalizedHref, { waitUntil: 'domcontentloaded' });
      return onboardingPage;
    }
    if (href && isDocumentDownloadHref(href)) {
      return null;
    }
    if (!options?.allowUnknownHref && href && !isPortalHref(href)) {
      return null;
    }

    const popupPromise = this.page.waitForEvent('popup', { timeout: 20000 }).catch(() => null);
    await link.click();
    const onboardingPage = await popupPromise;
    if (onboardingPage) {
      await onboardingPage.waitForLoadState('domcontentloaded');
      return onboardingPage;
    }

    for (let attempt = 0; attempt < 10; attempt += 1) {
      await sleep(500);
      const pages = this.page.context().pages().filter((tab) => tab !== this.page);
      const latest = pages.at(-1);
      if (latest && /onboarding|portal|rightlyhr|pre-onboarding|snaddevelopers/i.test(latest.url())) {
        await latest.waitForLoadState('domcontentloaded');
        return latest;
      }
    }

    return null;
  }

  private async findMailUi(pattern: RegExp) {
    for (const mail of await this.listAllMailsUi()) {
      if (pattern.test(`${mail.subject}\n${mail.body}`)) {
        return mail;
      }
    }

    const openBody = await this.readOpenMailBody();
    if (openBody.length > 20) {
      const subject =
        openBody.match(/RightlyHR[^\n|.]*/i)?.[0]?.trim() ||
        (await this.readOpenMailSubject()) ||
        openBody.slice(0, 120);
      if (pattern.test(`${subject}\n${openBody}`)) {
        return { id: 'open', subject, body: openBody };
      }
    }

    return null;
  }

  private async listMailsUi() {
    await this.ensureInboxVisible();
    return this.listAllMailsUi();
  }

  private async listAllMailsUi() {
    await this.ensureInboxVisible();

    const rows = this.mailRows();
    let count = await rows.count();
    if (count === 0) {
      await this.reloadInboxIfAllowed();
      count = await rows.count();
    }

    const limit = count > 0 ? Math.min(count, 20) : 0;
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
      const html = await this.readOpenMailHtml();
      if (!body && !html) {
        continue;
      }
      const subject =
        preview.match(/RightlyHR[^\n]*/i)?.[0]?.trim() ||
        body.match(/RightlyHR[^\n|.]*/i)?.[0]?.trim() ||
        preview.slice(0, 120);
      messages.push({ id: `mail-${index}`, subject, body: `${body}\n${html}` });
    }

    return messages;
  }

  private mailRows() {
    return this.inboxFrame().locator('div.m[id]');
  }

  private async readOpenMailBody() {
    return (await this.mailFrame().locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  }

  private async readOpenMailHtml() {
    return (await this.mailFrame().locator('body').innerHTML().catch(() => '')) || '';
  }

  private async ensureCachedMailOpen() {
    if (!this.cachedMail) {
      return;
    }

    await this.ensureInboxVisible();
    const subjectNeedle = this.cachedMail.subject.replace(/\s+/g, ' ').trim().slice(0, 40);
    const rows = this.mailRows();
    const count = await rows.count();

    for (let index = 0; index < count; index += 1) {
      const row = rows.nth(index);
      const preview = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      if (!preview) {
        continue;
      }
      if (subjectNeedle && preview.includes(subjectNeedle.slice(0, 20))) {
        await this.openMailRow(row);
        await sleep(900);
        return;
      }
      if (/Offer Letter Issued/i.test(this.cachedMail.subject) && /Offer Letter Issued/i.test(preview)) {
        await this.openMailRow(row);
        await sleep(900);
        return;
      }
      if (/Request for Documents/i.test(this.cachedMail.subject) && /Request for Documents/i.test(preview)) {
        await this.openMailRow(row);
        await sleep(900);
        return;
      }
    }
  }

  private async readLiveMailContent() {
    const body = await this.readOpenMailBody();
    const html = await this.readOpenMailHtml();
    return `${body}\n${html}`;
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

  private async gotoInbox(options?: { soft?: boolean; captchaTimeoutMs?: number }) {
    const headed = isHeadedRun();
    const captchaTimeoutMs = options?.captchaTimeoutMs ?? CAPTCHA_WAIT_MS;

    if (await this.hasCaptcha()) {
      await this.handleCaptchaIfVisible(captchaTimeoutMs);
      if (await this.inboxReady()) {
        return;
      }
      if (await this.hasCaptcha()) {
        console.log('Yopmail CAPTCHA visible; skipping page refresh.');
        if (options?.soft) {
          return;
        }
        throw new Error('Yopmail CAPTCHA blocked inbox access');
      }
    }

    const onMailbox = /yopmail\.com/i.test(this.page.url());
    if (onMailbox) {
      if (await this.hasCaptcha()) {
        console.log('Yopmail CAPTCHA visible; skipping page refresh.');
        if (options?.soft) {
          return;
        }
        throw new Error('Yopmail CAPTCHA blocked inbox access');
      }
      if (await this.inboxReady()) {
        await this.handleCaptchaIfVisible(captchaTimeoutMs);
        return;
      }
      if (options?.soft) {
        await this.handleCaptchaIfVisible(captchaTimeoutMs);
        console.log('Yopmail soft-open on existing tab; waiting for inbox.');
        return;
      }
    }

    let lastError: unknown;
    const maxAttempts = options?.soft ? (headed ? 2 : 1) : 3;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (await this.hasCaptcha()) {
        console.log('Yopmail CAPTCHA visible; skipping page refresh.');
        if (options?.soft) {
          return;
        }
        throw new Error('Yopmail CAPTCHA blocked inbox access');
      }

      try {
        await this.page.goto(`https://yopmail.com/en/?login=${encodeURIComponent(this.mailbox)}`, {
          waitUntil: 'domcontentloaded',
        });
        await this.dismissConsent();
        await this.handleCaptchaIfVisible(captchaTimeoutMs);
        if (await this.hasCaptcha() && options?.soft) {
          console.log('Yopmail CAPTCHA visible after open; waiting for manual solve.');
          return;
        }
        await this.waitForInboxReady({ soft: options?.soft });
        return;
      } catch (error) {
        lastError = error;
        console.log(`Yopmail inbox open attempt ${attempt + 1} failed: ${error}`);
        await this.bringPageToFront().catch(() => {});
        await sleep(3000);
      }
    }
    if (options?.soft) {
      if (await this.hasCaptcha() || /yopmail\.com/i.test(this.page.url())) {
        console.log('Yopmail soft-open continuing despite inbox not fully ready.');
        return;
      }
    }
    if (options?.soft && (await this.inboxReady())) {
      console.log('Yopmail inbox is partially available despite CAPTCHA; continuing.');
      return;
    }
    throw lastError ?? new Error('Yopmail inbox did not open');
  }

  private async reloadInboxIfAllowed(options?: { soft?: boolean }) {
    if (await this.hasCaptcha()) {
      await this.handleCaptchaIfVisible(CAPTCHA_WAIT_MS);
      if (await this.hasCaptcha()) {
        console.log('Yopmail CAPTCHA visible; skipping inbox refresh.');
        return;
      }
    }
    await this.reloadInbox(options);
  }

  private async reloadInbox(options?: { soft?: boolean }) {
    await this.bringPageToFront().catch(() => {});
    if (await this.hasCaptcha()) {
      console.log('Yopmail CAPTCHA visible; skipping inbox refresh.');
      return;
    }

    if (await this.inboxReady()) {
      const refresh = this.page.locator('#refresh');
      if (await refresh.isVisible({ timeout: 3000 }).catch(() => false)) {
        const clicked = await refresh.click({ timeout: 5000 }).then(() => true).catch(() => false);
        if (!clicked) {
          console.log('Yopmail refresh button blocked; skipping page reload.');
          return;
        }
        await this.handleCaptchaIfVisible(CAPTCHA_WAIT_MS);
        await sleep(2500);
        return;
      }
    }

    if (await this.hasCaptcha()) {
      console.log('Yopmail CAPTCHA visible; skipping goto inbox.');
      return;
    }
    await this.gotoInbox(options);
  }

  private async ensureInboxVisible() {
    if (await this.inboxReady()) {
      return;
    }
    if (await this.hasCaptcha()) {
      await this.handleCaptchaIfVisible(CAPTCHA_WAIT_MS);
      return;
    }
    await this.gotoInbox({ soft: true }).catch((error) => {
      console.log(`Yopmail ensure inbox failed: ${error}`);
    });
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

  private async handleCaptchaIfVisible(timeoutMs?: number) {
    if (!(await this.hasCaptcha())) {
      return true;
    }

    console.log('Yopmail CAPTCHA detected — waiting up to 2 minutes. Continuing as soon as it is solved.');
    await this.tryClickRecaptcha();

    const headed = isHeadedRun();
    if (headed) {
      await this.bringPageToFront().catch(() => {});
      console.log('If CAPTCHA remains, click "I\'m not a robot" in the Yopmail tab.');
    }

    const waitMs = timeoutMs ?? CAPTCHA_WAIT_MS;
    const cleared = await this.waitForCaptchaCleared(waitMs);
    if (!cleared) {
      console.log('Yopmail CAPTCHA still visible after 2 minutes; will retry inbox access.');
      return false;
    }

    console.log('Yopmail CAPTCHA resolved; pausing debugger then reading mail credentials.');
    debugger;
    if (headed) {
      await this.page.pause();
    }
    return true;
  }

  private async hasCaptcha() {
    if (!this.pageUsable()) {
      return false;
    }
    if (await this.page.locator('#r_parent.r_popup, .r_popup').isVisible({ timeout: 500 }).catch(() => false)) {
      return true;
    }
    const captchaText = this.page.getByText(
      /I'm not a robot|verify you are human|just a moment|checking your browser|complete the captcha|are you a robot/i,
    );
    return captchaText.first().isVisible({ timeout: 1000 }).catch(() => false);
  }

  private async tryClickRecaptcha() {
    const popup = this.page.locator('#r_parent, .r_popup').first();
    if (await popup.isVisible({ timeout: 1500 }).catch(() => false)) {
      const box = await popup.boundingBox().catch(() => null);
      if (box) {
        await this.page.mouse.click(box.x + Math.min(28, box.width / 4), box.y + box.height / 2);
        await sleep(1500);
      }
    }

    const popupTargets = this.page.locator('#r_parent, .r_popup');
    const popupClickTargets = [
      popupTargets.locator('input[type="checkbox"]'),
      popupTargets.locator('[role="checkbox"]'),
      popupTargets.getByText(/not a robot/i),
      popupTargets.locator('iframe').first(),
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
      if (!(await this.hasCaptcha()) && (await this.inboxReady().catch(() => false) || /yopmail\.com/i.test(this.page.url()))) {
        return true;
      }
      await this.tryClickRecaptcha();
      await sleep(1000);
    }
    return !(await this.hasCaptcha());
  }

  private async waitForInboxReady(options?: { soft?: boolean }) {
    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      if (await this.inboxReady()) {
        return;
      }
      if (await this.hasCaptcha()) {
        await this.handleCaptchaIfVisible(CAPTCHA_WAIT_MS);
        if (options?.soft && (await this.hasCaptcha())) {
          console.log('Yopmail inbox waiting on CAPTCHA resolution.');
          return;
        }
      }
      await sleep(1000);
    }
    if (options?.soft && ((await this.hasCaptcha()) || /yopmail\.com/i.test(this.page.url()))) {
      console.log('Yopmail inbox not ready yet; continuing to wait on CAPTCHA.');
      return;
    }
    throw new Error('Yopmail inbox did not load after login');
  }

  private async bringPageToFront() {
    if (this.page.isClosed()) {
      throw new Error('Yopmail tab was closed');
    }
    await this.page.bringToFront();
  }

  private pageUsable() {
    return !this.page.isClosed();
  }

  private async inboxReady() {
    if (await this.hasCaptcha()) {
      return false;
    }
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

function pickBestPortalMail(mails: MailMessage[]) {
  for (const mail of mails) {
    const combined = `${mail.subject}\n${mail.body}`;
    if (/Offer Letter Issued/i.test(combined) && parseCredentials(combined) && hasPortalLink(combined)) {
      return mail;
    }
  }
  for (const mail of mails) {
    const combined = `${mail.subject}\n${mail.body}`;
    if (/Offer Letter Issued/i.test(combined) && hasPortalLink(combined)) {
      return mail;
    }
  }
  for (const mail of mails) {
    const combined = `${mail.subject}\n${mail.body}`;
    if (/Request for Documents|Onboarding Portal/i.test(combined) && hasPortalLink(combined)) {
      return mail;
    }
  }
  return mails[0];
}

function scorePortalMail(combined: string, index: number) {
  let score = 1000 - index;
  if (/Request for Documents|Documents Upload/i.test(combined)) {
    score += 900;
  }
  if (/Offer Letter Issued/i.test(combined) && parseCredentials(combined)) {
    score += 700;
  } else if (/Offer Letter Issued/i.test(combined)) {
    score += 500;
  }
  if (/Onboarding Portal/i.test(combined)) {
    score += 400;
  }
  if (hasPortalLink(combined)) {
    score += 300;
  }
  return score;
}

function hasPortalLink(text: string) {
  return !!extractPortalUrl(text) || /click here|portal link|onboarding portal/i.test(text);
}

function isDocumentDownloadHref(href: string) {
  return /\.pdf|FusionDocuments|Documents\/Employee|Offer Letter\//i.test(href);
}

function isPortalHref(href: string) {
  return !!normalizePortalHref(href);
}

function normalizePortalHref(href: string): string | null {
  const decoded = href.replace(/&amp;/g, '&').trim();
  if (!decoded || isDocumentDownloadHref(decoded)) {
    return null;
  }
  if (/^https?:\/\//i.test(decoded)) {
    return /rightlyhr|snaddevelopers/i.test(decoded) ? decoded : null;
  }
  if (decoded.startsWith('/')) {
    return `${defaultPreOnboardingBaseUrl()}${decoded}`;
  }
  if (/onboarding|portal|pre-onboarding|employeeportal|login/i.test(decoded)) {
    return decoded;
  }
  return null;
}

function defaultPreOnboardingBaseUrl() {
  return (
    process.env.PRE_ONBOARDING_BASE_URL?.trim() ||
    process.env.RHR_BASE_URL?.trim() ||
    'https://preonboardingqarightlyhr.onpremise.cluster.rightlyhr.com'
  ).replace(/\/$/, '');
}

function parseCredentials(body: string) {
  const normalized = body
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  const username =
    normalized.match(/Username\s*[:*]\s*([^\s]+@[^\s]+)/i)?.[1] ??
    normalized.match(/User\s*Name\s*[:*]\s*([^\s]+@[^\s]+)/i)?.[1] ??
    normalized.match(/Username\s*[:*]\s*(\S+)/i)?.[1];
  const password =
    normalized.match(/Password\s*[:*]\s*(\S+)/i)?.[1]?.replace(/[.,;]+$/, '') ??
    normalized.match(/Password\s*[:*]\s*([^\s<]+)/i)?.[1]?.replace(/[.,;]+$/, '');
  if (!username || !password) {
    return null;
  }
  return { username, password };
}

function isLikelyCredentialMail(text: string) {
  return /Request for Documents|Documents Upload|Document Submitted|Onboarding Portal|pre-onboarding/i.test(text);
}

function credentialMailScore(text: string, index: number) {
  let score = 1000 - index;
  if (/Request for Documents|Documents Upload/i.test(text)) {
    score += 500;
  }
  if (/Document Submitted Successfully/i.test(text)) {
    score += 250;
  }
  if (/Offer Letter Issued/i.test(text)) {
    score += 600;
  }
  if (/Offer Letter Approved|Offer Letter rejected/i.test(text)) {
    score -= 200;
  }
  return score;
}

function extractPortalUrl(body: string) {
  const hrefs = [...body.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1].replace(/&amp;/g, '&'));
  for (const href of hrefs) {
    const normalized = normalizePortalHref(href);
    if (normalized) {
      return normalized;
    }
  }

  const urls = body.match(/https?:\/\/[^\s"'<>]+/gi) ?? [];
  for (const url of urls) {
    const normalized = normalizePortalHref(url);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function isHeadedRun() {
  return process.env.HEADLESS !== 'true' && !(process.env.CI === 'true' || process.env.CI === '1');
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
