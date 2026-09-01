import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login page', () => {
  test('loads with key elements and a disabled Login button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page).toHaveTitle('RightlyHR');
    await expect(loginPage.logo).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.forgotPassword).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeDisabled();
    await expect(loginPage.googleButton).toBeVisible();
    await expect(loginPage.microsoftButton).toBeVisible();
  });

  test('enables Login only after both fields are filled', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.loginButton).toBeDisabled();

    await loginPage.emailInput.fill('user@example.com');
    await expect(loginPage.loginButton).toBeDisabled();

    await loginPage.emailInput.clear();
    await loginPage.passwordInput.fill('SomePassword1');
    await expect(loginPage.loginButton).toBeDisabled();

    await loginPage.emailInput.fill('user@example.com');
    await expect(loginPage.loginButton).toBeEnabled();
  });

  test('toggles password visibility', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.passwordInput.fill('SecretPassword1');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('stays on login after invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('invalid.user@example.com', 'WrongPassword1');

    await expect(loginPage.errorMessage).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/login$/);
  });

  test('logs in with valid credentials and reaches the employee dashboard', async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email!, password!);

    await expect(page).toHaveURL(/\/dashboard\/emp/, { timeout: 30000 });
    await expect(page.getByText('Have a nice day at work!')).toBeVisible();
    await expect(page.getByText('Dashboard', { exact: true }).first()).toBeVisible();
  });
});
