import fs from 'fs';
import path from 'path';
import { test, expect } from './fixtures/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = path.join(__dirname, '../.auth/user.json');

/** Single HR login used as a project dependency before trainee and other HR suites. */
test('HR login and save session', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginHrFromEnv();

  await expect(page).toHaveURL(/\/dashboard\/emp/, { timeout: 45000 });
  await expect(page.getByText('Have a nice day at work!')).toBeVisible();

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
