# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> Login page >> logs in with valid credentials and reaches the employee dashboard
- Location: tests\login.spec.ts:62:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/dashboard\/emp/
Received string:  "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"

Call log:
  - Expect "toHaveURL" with timeout 30000ms
    6 × locator resolved to <html lang="en" data-beasties-container="">…</html>
      - unexpected value "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/login"
    3 × locator resolved to <html lang="en" data-beasties-container="">…</html>
      - unexpected value "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  - Test ended.

```

```yaml
- paragraph: Welcome, Pavan sai Dinesh Nedunuri
- text: Please wait while we setup your dashboard
- img "Powered By Image"
```

# Test source

```ts
  1  | import { test, expect } from './fixtures/test';
  2  | import { LoginPage } from '../pages/LoginPage';
  3  | 
  4  | test.describe('Login page', () => {
  5  |   test('loads with key elements and a disabled Login button', async ({ page }) => {
  6  |     const loginPage = new LoginPage(page);
  7  |     await loginPage.goto();
  8  | 
  9  |     await expect(page).toHaveURL(/\/login$/);
  10 |     await expect(page).toHaveTitle('RightlyHR');
  11 |     await expect(loginPage.logo).toBeVisible();
  12 |     await expect(loginPage.emailInput).toBeVisible();
  13 |     await expect(loginPage.passwordInput).toBeVisible();
  14 |     await expect(loginPage.forgotPassword).toBeVisible();
  15 |     await expect(loginPage.loginButton).toBeVisible();
  16 |     await expect(loginPage.loginButton).toBeDisabled();
  17 |     await expect(loginPage.googleButton).toBeVisible();
  18 |     await expect(loginPage.microsoftButton).toBeVisible();
  19 |   });
  20 | 
  21 |   test('enables Login only after both fields are filled', async ({ page }) => {
  22 |     const loginPage = new LoginPage(page);
  23 |     await loginPage.goto();
  24 | 
  25 |     await expect(loginPage.loginButton).toBeDisabled();
  26 | 
  27 |     await loginPage.emailInput.fill('user@example.com');
  28 |     await expect(loginPage.loginButton).toBeDisabled();
  29 | 
  30 |     await loginPage.emailInput.clear();
  31 |     await loginPage.passwordInput.fill('SomePassword1');
  32 |     await expect(loginPage.loginButton).toBeDisabled();
  33 | 
  34 |     await loginPage.emailInput.fill('user@example.com');
  35 |     await expect(loginPage.loginButton).toBeEnabled();
  36 |   });
  37 | 
  38 |   test('toggles password visibility', async ({ page }) => {
  39 |     const loginPage = new LoginPage(page);
  40 |     await loginPage.goto();
  41 | 
  42 |     await loginPage.passwordInput.fill('SecretPassword1');
  43 |     await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  44 | 
  45 |     await loginPage.togglePasswordVisibility();
  46 |     await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
  47 | 
  48 |     await loginPage.togglePasswordVisibility();
  49 |     await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  50 |   });
  51 | 
  52 |   test('stays on login after invalid credentials', async ({ page }) => {
  53 |     const loginPage = new LoginPage(page);
  54 |     await loginPage.goto();
  55 | 
  56 |     await loginPage.login('invalid.user@example.com', 'WrongPassword1');
  57 | 
  58 |     await expect(loginPage.errorMessage).toBeVisible({ timeout: 15000 });
  59 |     await expect(page).toHaveURL(/\/login$/);
  60 |   });
  61 | 
  62 |   test('logs in with valid credentials and reaches the employee dashboard', async ({ page }) => {
  63 |     const email = process.env.LOGIN_EMAIL?.trim();
  64 |     const password = process.env.LOGIN_PASSWORD?.trim();
  65 |     test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');
  66 | 
  67 |     const loginPage = new LoginPage(page);
  68 |     await loginPage.goto();
  69 |     await loginPage.login(email!, password!);
  70 | 
> 71 |     await expect(page).toHaveURL(/\/dashboard\/emp/, { timeout: 30000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  72 |     await expect(page.getByText('Have a nice day at work!')).toBeVisible();
  73 |     await expect(page.getByText('Dashboard', { exact: true }).first()).toBeVisible();
  74 |   });
  75 | });
  76 | 
```