# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> Login page >> loads with key elements and a disabled Login button
- Location: tests\login.spec.ts:5:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'Please enter email' }) to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]: 404 page not found
```

# Test source

```ts
  1   | import { type Locator, type Page } from '@playwright/test';
  2   | 
  3   | export class LoginPage {
  4   |   readonly page: Page;
  5   |   readonly emailInput: Locator;
  6   |   readonly passwordInput: Locator;
  7   |   readonly passwordVisibilityToggle: Locator;
  8   |   readonly forgotPassword: Locator;
  9   |   readonly loginButton: Locator;
  10  |   readonly logo: Locator;
  11  |   readonly googleButton: Locator;
  12  |   readonly microsoftButton: Locator;
  13  |   readonly errorMessage: Locator;
  14  | 
  15  |   constructor(page: Page) {
  16  |     this.page = page;
  17  |     this.emailInput = page.getByRole('textbox', { name: 'Please enter email' });
  18  |     this.passwordInput = page.getByRole('textbox', { name: 'Please enter password' });
  19  |     this.passwordVisibilityToggle = page.locator('.input-group-text');
  20  |     this.forgotPassword = page.getByText('Forgot Password?');
  21  |     this.loginButton = page.locator('button[type="submit"].custom-btn, button.custom-btn.btn-primary, button[type="submit"]').filter({ hasText: /^Login$/i }).first();
  22  |     this.logo = page.getByAltText('RightlyHr Logo');
  23  |     this.googleButton = page.getByRole('button', { name: 'Google Icon' });
  24  |     this.microsoftButton = page.locator('button.microsoft-login-btn');
  25  |     this.errorMessage = page.getByText('Invalid email or inactive employee');
  26  |   }
  27  | 
  28  |   async goto() {
  29  |     await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
> 30  |     await this.emailInput.waitFor({ state: 'visible' });
      |                           ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  31  |   }
  32  | 
  33  |   async login(email: string, password: string) {
  34  |     await this.emailInput.fill(email);
  35  |     await this.passwordInput.fill(password);
  36  |     await this.loginButton.click();
  37  |   }
  38  | 
  39  |   async logoutOrClearSession() {
  40  |     await this.page.context().clearCookies();
  41  |     await this.page.evaluate(() => {
  42  |       localStorage.clear();
  43  |       sessionStorage.clear();
  44  |     }).catch(() => {});
  45  |   }
  46  | 
  47  |   async loginWithCredentials(email: string, password: string) {
  48  |     await this.logoutOrClearSession();
  49  |     await this.goto();
  50  |     await this.login(email, password);
  51  |     await this.page.waitForURL(/\/dashboard\/emp/, {
  52  |       timeout: 45000,
  53  |       waitUntil: 'domcontentloaded',
  54  |     });
  55  |     await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible' });
  56  |   }
  57  | 
  58  |   async togglePasswordVisibility() {
  59  |     await this.passwordVisibilityToggle.click();
  60  |   }
  61  | 
  62  |   async loginFromEnv() {
  63  |     const email = (process.env.EMPLOYEE_EMAIL || process.env.LOGIN_EMAIL)?.trim();
  64  |     const password = (process.env.EMPLOYEE_PASSWORD || process.env.LOGIN_PASSWORD)?.trim();
  65  |     if (!email || !password) {
  66  |       throw new Error('Set EMPLOYEE_EMAIL / LOGIN_EMAIL and EMPLOYEE_PASSWORD / LOGIN_PASSWORD in .env');
  67  |     }
  68  |     await this.logoutOrClearSession();
  69  |     await this.goto();
  70  |     await this.login(email, password);
  71  |     try {
  72  |       await this.page.waitForURL(/\/dashboard\/emp/, {
  73  |         timeout: 45000,
  74  |         waitUntil: 'domcontentloaded',
  75  |       });
  76  |     } catch {
  77  |       await this.logoutOrClearSession();
  78  |       await this.goto();
  79  |       await this.login(email, password);
  80  |       await this.page.waitForURL(/\/dashboard\/emp/, {
  81  |         timeout: 45000,
  82  |         waitUntil: 'domcontentloaded',
  83  |       });
  84  |     }
  85  |     await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible' });
  86  |   }
  87  | 
  88  |   async validateUserSession() {
  89  |     await this.page.context().clearCookies();
  90  |     await this.page.evaluate(() => {
  91  |       localStorage.clear();
  92  |       sessionStorage.clear();
  93  |     }).catch(() => {});
  94  |     await this.loginFromEnv();
  95  |   }
  96  | 
  97  |   async logout() {
  98  |     await this.page.locator('.profile-dropdown').click();
  99  | 
  100 |     await this.page
  101 |         .getByRole('button', { name: 'LogoutLogout' })
  102 |         .click();
  103 | 
  104 |     await this.page
  105 |         .getByRole('button', { name: 'Yes' })
  106 |         .click();
  107 |   }
  108 | }
  109 | 
```