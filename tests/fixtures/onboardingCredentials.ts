import type { YopmailPage } from '../../pages/YopmailPage';
import { loadLastTrainee, type SavedTrainee } from './lastTrainee';

export async function readOnboardingCredentials(
  yopmail: YopmailPage,
  email: string,
  saved?: SavedTrainee | null,
) {
  const cached = saved ?? loadLastTrainee();
  if (cached?.username && cached?.password && cached.email.toLowerCase() === email.toLowerCase()) {
    console.log(`Using saved onboarding credentials for ${email}`);
    return { username: cached.username, password: cached.password };
  }

  return yopmail.readCredentials();
}
