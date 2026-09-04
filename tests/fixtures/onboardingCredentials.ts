import type { PreOnboardingPage } from '../../pages/PreOnboardingPage';
import type { YopmailPage } from '../../pages/YopmailPage';
import { loadLastTrainee, saveLastTrainee, type SavedTrainee } from './lastTrainee';

export async function readOnboardingCredentials(
  yopmail: YopmailPage,
  email: string,
  saved?: SavedTrainee | null,
  options?: { refresh?: boolean },
) {
  if (!options?.refresh) {
    const cached = saved ?? loadLastTrainee();
    if (cached?.username && cached?.password && cached.email.toLowerCase() === email.toLowerCase()) {
      console.log(`Using saved onboarding credentials for ${email}`);
      return { username: cached.username, password: cached.password };
    }
  }

  return yopmail.findCredentialsInInbox();
}

export async function refreshPreOnboardingCredentials(
  yopmail: YopmailPage,
  employee: SavedTrainee,
): Promise<SavedTrainee> {
  const credentials = await yopmail.findCredentialsInInbox();
  const updated = { ...employee, username: credentials.username, password: credentials.password };
  saveLastTrainee(updated);
  console.log(`Refreshed onboarding credentials for ${employee.email}`);
  return updated;
}

export async function loginPreOnboardingPortal(
  preOnboarding: PreOnboardingPage,
  yopmail: YopmailPage,
  credentials: { username: string; password: string },
) {
  await preOnboarding.login(credentials.username, credentials.password);

  const invalid = await preOnboarding.invalidCredentialsMessage
    .first()
    .isVisible({ timeout: 8000 })
    .catch(() => false);
  if (invalid) {
    console.log('Pre-onboarding login failed; re-reading credentials from Yopmail and retrying...');
    const fresh = await yopmail.findCredentialsInInbox();
    await preOnboarding.usernameInput.fill(fresh.username);
    await preOnboarding.passwordInput.fill(fresh.password);
    await preOnboarding.loginButton.click();

    const stillInvalid = await preOnboarding.invalidCredentialsMessage
      .first()
      .isVisible({ timeout: 8000 })
      .catch(() => false);
    if (stillInvalid) {
      const text = (await preOnboarding.invalidCredentialsMessage.first().innerText().catch(() => '')).trim();
      throw new Error(`Pre-onboarding login failed after credential refresh: ${text || 'Invalid Credentials'}`);
    }

    credentials.username = fresh.username;
    credentials.password = fresh.password;
  }

  await preOnboarding.expectLoggedIn();
  return credentials;
}
