import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const email = (
    process.env.HR_USERNAME
    || process.env.LOGIN_EMAIL
    || process.env.EMPLOYEE_EMAIL
  )?.trim();
  const password = (
    process.env.HR_PASSWORD
    || process.env.LOGIN_PASSWORD
    || process.env.EMPLOYEE_PASSWORD
  )?.trim();

  if (!email || !password) {
    throw new Error(
      'Set HR_USERNAME/HR_PASSWORD or LOGIN_EMAIL/LOGIN_PASSWORD in .env for auth setup',
    );
  }

  await loginPage.login(email, password);
  await page.waitForURL((url) => !url.pathname.includes('/login'), {
    timeout: 45000,
    waitUntil: 'domcontentloaded',
  });
  await page.context().storageState({ path: authFile });
});
