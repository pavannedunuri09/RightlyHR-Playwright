import type { Page } from '@playwright/test';
import type { PreOnboardingPage } from '../../pages/PreOnboardingPage';
import type { YopmailPage } from '../../pages/YopmailPage';
import { loadLastTrainee, saveLastTrainee, type SavedTrainee } from './lastTrainee';

const CREDENTIAL_MAIL_PATTERN = /Request for Documents|Documents Upload|Document Submitted|Onboarding Portal/i;
const OFFER_LETTER_MAIL_PATTERN = /Offer Letter Issued|Offer Letter Released/i;

export async function readOnboardingCredentials(
  yopmail: YopmailPage,
  email: string,
  saved?: SavedTrainee | null,
  options?: { refresh?: boolean; preferLatestMail?: boolean },
) {
  if (options?.preferLatestMail) {
    return yopmail.findCredentialsInInbox({
      preferPattern: OFFER_LETTER_MAIL_PATTERN,
    });
  }

  if (!options?.refresh) {
    const cached = saved ?? loadLastTrainee();
    if (cached?.username && cached?.password && cached.email.toLowerCase() === email.toLowerCase()) {
      console.log(`Using saved onboarding credentials for ${email}`);
      return { username: cached.username, password: cached.password };
    }
  }

  return yopmail.findCredentialsInInbox({
    skipCached: true,
    preferPattern: CREDENTIAL_MAIL_PATTERN,
  });
}

export async function refreshPreOnboardingCredentials(
  yopmail: YopmailPage,
  employee: SavedTrainee,
): Promise<SavedTrainee> {
  const credentials = await yopmail.findCredentialsInInbox({
    skipCached: true,
    preferPattern: CREDENTIAL_MAIL_PATTERN,
  });
  const updated = { ...employee, username: credentials.username, password: credentials.password };
  saveLastTrainee(updated);
  console.log(`Refreshed onboarding credentials for ${employee.email}`);
  return updated;
}

async function tryPreOnboardingLogin(
  preOnboarding: PreOnboardingPage,
  credentials: { username: string; password: string },
) {
  const needsLogin = await preOnboarding.usernameInput.isVisible({ timeout: 5000 }).catch(() => false);
  if (!needsLogin) {
    await preOnboarding.expectLoggedIn();
    return { ok: true as const, credentials };
  }

  await preOnboarding.usernameInput.fill('');
  await preOnboarding.passwordInput.fill('');
  await preOnboarding.login(credentials.username, credentials.password);
  const invalid = await preOnboarding.invalidCredentialsMessage
    .first()
    .isVisible({ timeout: 8000 })
    .catch(() => false);
  if (!invalid) {
    await preOnboarding.expectLoggedIn();
    return { ok: true as const, credentials };
  }

  const text = (await preOnboarding.invalidCredentialsMessage.first().innerText().catch(() => '')).trim();
  return { ok: false as const, message: text || 'Invalid Credentials' };
}

async function resetPortalLoginPage(preOnboarding: PreOnboardingPage) {
  await preOnboarding.page.reload({ waitUntil: 'domcontentloaded' });
  if (await preOnboarding.usernameInput.isVisible({ timeout: 8000 }).catch(() => false)) {
    await preOnboarding.expectLoaded();
  }
}

export async function loginPreOnboardingPortal(
  preOnboarding: PreOnboardingPage,
  yopmail: YopmailPage,
  credentials: { username: string; password: string },
  options?: { preferLatestMail?: boolean },
) {
  const candidates = options?.preferLatestMail
    ? [...(await yopmail.findAllCredentialsInInbox()), credentials]
    : [credentials, ...(await yopmail.findAllCredentialsInInbox())];
  const tried = new Set<string>();
  let lastMessage = 'Invalid Credentials';

  for (const candidate of candidates) {
    const key = `${candidate.username}|${candidate.password}`;
    if (tried.has(key)) {
      continue;
    }
    tried.add(key);

    const attempt = await tryPreOnboardingLogin(preOnboarding, candidate);
    if (attempt.ok) {
      if (key !== `${credentials.username}|${credentials.password}`) {
        console.log(`Pre-onboarding login succeeded with alternate Yopmail credentials for ${candidate.username}`);
      }
      return candidate;
    }
    lastMessage = attempt.message;
    console.log(`Pre-onboarding login failed for ${candidate.username}; trying next credential mail if available`);
    await resetPortalLoginPage(preOnboarding);
  }

  throw new Error(`Pre-onboarding login failed after credential refresh: ${lastMessage}`);
}

async function resolvePreOnboardingLoginPage(context: import('@playwright/test').BrowserContext): Promise<Page> {
  const base = (
    process.env.RHR_BASE_URL?.trim() ||
    process.env.PRE_ONBOARDING_BASE_URL?.trim() ||
    'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com'
  ).replace(/\/$/, '');
  const candidates = [
    process.env.PRE_ONBOARDING_URL?.trim(),
    `${base}/pre-onboarding/login`,
    `${base}/onboarding/login`,
    `${base}/onboarding-portal/login`,
    `${base}/employee-onboarding/login`,
  ].filter((url): url is string => !!url);

  for (const url of candidates) {
    const portal = await context.newPage();
    try {
      await portal.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      const loginVisible = await portal
        .getByRole('textbox', { name: 'Username*' })
        .isVisible({ timeout: 8000 })
        .catch(() => false);
      if (loginVisible) {
        console.log(`Resolved pre-onboarding login page: ${url}`);
        return portal;
      }
    } catch (error) {
      console.log(`Pre-onboarding URL candidate failed (${url}): ${error}`);
    }
    await portal.close().catch(() => {});
  }

  throw new Error('Could not resolve pre-onboarding login page URL');
}

async function openPreOnboardingPortalDirect(yopmail: YopmailPage): Promise<Page> {
  const portalUrl = await yopmail.findPortalUrlInInbox();
  if (portalUrl) {
    console.log(`Opening pre-onboarding portal from mail URL: ${portalUrl}`);
    const portal = await yopmail.page.context().newPage();
    await portal.goto(portalUrl, { waitUntil: 'domcontentloaded' });
    return portal;
  }

  return resolvePreOnboardingLoginPage(yopmail.page.context());
}

export async function openPreOnboardingFromYopmail(
  yopmail: YopmailPage,
  employee: SavedTrainee,
  options?: { preferLatestMailCredentials?: boolean },
): Promise<{
  portal: Page;
  preOnboarding: PreOnboardingPage;
  employee: SavedTrainee;
}> {
  const { PreOnboardingPage } = await import('../../pages/PreOnboardingPage');
  const portalOpeners = [
    () => openPreOnboardingPortalDirect(yopmail),
    () => yopmail.openOnboardingPortalFromDocumentRequestMail(),
    () => yopmail.openOnboardingPortal(),
    () => yopmail.openOnboardingPortalFromCredentialMails(),
  ];

  let portal: Page | null = null;
  let lastError: unknown = new Error('Could not open onboarding portal from Yopmail');
  for (const openPortal of portalOpeners) {
    try {
      portal = await openPortal();
      break;
    } catch (error) {
      lastError = error;
      console.log(`Portal open attempt failed: ${error}`);
    }
  }

  if (!portal) {
    throw lastError;
  }

  const preOnboarding = new PreOnboardingPage(portal);

  const needsLogin = await preOnboarding.usernameInput.isVisible({ timeout: 8000 }).catch(() => false);
  if (!needsLogin) {
    await preOnboarding.expectLoggedIn();
    return { portal, preOnboarding, employee };
  }

  await preOnboarding.expectLoaded();
  const initialCredentials = await readOnboardingCredentials(yopmail, employee.email, employee, {
    preferLatestMail: options?.preferLatestMailCredentials,
  });
  const credentials = await loginPreOnboardingPortal(preOnboarding, yopmail, initialCredentials, {
    preferLatestMail: options?.preferLatestMailCredentials,
  });
  const updated = { ...employee, ...credentials };
  saveLastTrainee(updated);
  return { portal, preOnboarding, employee: updated };
}
