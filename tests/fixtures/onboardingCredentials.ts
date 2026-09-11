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
    for (const pattern of [OFFER_LETTER_MAIL_PATTERN, CREDENTIAL_MAIL_PATTERN]) {
      try {
        return await yopmail.findCredentialsInInbox({
          skipCached: true,
          preferPattern: pattern,
        });
      } catch {
        // Try the next mail pattern.
      }
    }
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
    preferPattern: options?.preferLatestMail ? OFFER_LETTER_MAIL_PATTERN : CREDENTIAL_MAIL_PATTERN,
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
  options?: { preferLatestMail?: boolean; employeeEmail?: string },
) {
  const all = await yopmail.findAllCredentialsInInbox();
  const usernames = new Set<string>([credentials.username]);
  if (options?.employeeEmail) {
    usernames.add(options.employeeEmail);
  }
  const passwords = new Set<string>([credentials.password, ...all.map((entry) => entry.password)]);

  const candidates: Array<{ username: string; password: string }> = [];
  const seen = new Set<string>();
  for (const username of usernames) {
    for (const password of passwords) {
      const key = `${username}|${password}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      candidates.push({ username, password });
    }
  }
  if (options?.preferLatestMail) {
    candidates.push(...all.filter((entry) => !seen.has(`${entry.username}|${entry.password}`)));
  }

  let lastMessage = 'Invalid Credentials';

  for (const candidate of candidates) {
    const attempt = await tryPreOnboardingLogin(preOnboarding, candidate);
    if (attempt.ok) {
      if (`${candidate.username}|${candidate.password}` !== `${credentials.username}|${credentials.password}`) {
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
  const hrmsBase = (process.env.RHR_BASE_URL?.trim() || 'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com').replace(
    /\/$/,
    '',
  );
  const preOnboardingBase = (
    process.env.PRE_ONBOARDING_BASE_URL?.trim() ||
    'https://preonboardingqarightlyhr.onpremise.cluster.rightlyhr.com'
  ).replace(/\/$/, '');
  const candidates = [
    process.env.PRE_ONBOARDING_URL?.trim(),
    preOnboardingBase,
    `${preOnboardingBase}/login`,
    `${hrmsBase}/pre-onboarding/login`,
    `${hrmsBase}/onboarding/login`,
    `${hrmsBase}/onboarding-portal/login`,
    `${hrmsBase}/employee-onboarding/login`,
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
  try {
    return await yopmail.openOnboardingPortalFromOfferLetterMail();
  } catch (error) {
    console.log(`Offer-letter portal direct open failed: ${error}`);
  }

  const portalUrl = await yopmail.findPortalUrlInInbox();
  if (portalUrl) {
    console.log(`Opening pre-onboarding portal from mail URL: ${portalUrl}`);
    const portal = await yopmail.page.context().newPage();
    await portal.goto(portalUrl, { waitUntil: 'domcontentloaded' });
    return portal;
  }

  return resolvePreOnboardingLoginPage(yopmail.page.context());
}

export async function openOnboardingLoginPage(yopmail: YopmailPage): Promise<Page> {
  const portalOpeners = [
    () => yopmail.openOnboardingPortalFromOfferLetterMail(),
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

  return portal;
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
    () => yopmail.openOnboardingPortalFromOfferLetterMail(),
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
    employeeEmail: employee.email,
  });
  const updated = { ...employee, ...credentials };
  saveLastTrainee(updated);
  return { portal, preOnboarding, employee: updated };
}

export async function openPreOnboardingForReleasedOffer(
  yopmail: YopmailPage,
  employee: SavedTrainee,
): Promise<{
  portal: Page;
  preOnboarding: PreOnboardingPage;
  employee: SavedTrainee;
}> {
  await yopmail.openMatchingMailInViewer(/Request for Documents Upload|Request for Documents/i);
  const refreshed = await readOnboardingCredentials(yopmail, employee.email, employee, { refresh: true });
  const updated = { ...employee, ...refreshed };
  saveLastTrainee(updated);
  await yopmail.openMatchingMailInViewer(/Offer Letter Issued|Offer Letter Released/i);
  return openPreOnboardingFromYopmail(yopmail, updated);
}
