# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leave-category.spec.ts >> Leave Category Foundation >> 01. navigates from Dashboard through Settings and Time Off to Leave Category
- Location: tests\leave-category.spec.ts:28:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 45000ms exceeded.
=========================== logs ===========================
waiting for navigation until "domcontentloaded"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/uservalidation"
  navigated to "https://hrmsqadimcon.onpremise.cluster.rightlyhr.com/unauthorized"
============================================================
```

# Page snapshot

```yaml
- generic [ref=f2e13]:
  - img "Icon" [ref=f2e14]
  - paragraph [ref=f2e15]: Please Contact Administrator
  - img "Powered By Image" [ref=f2e17]
```

# Test source

```ts
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
  30  |     await this.emailInput.waitFor({ state: 'visible' });
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
  62  |   /** HR / admin login for settings suites (Leave Category, Load Entitlements, etc.). */
  63  |   async loginAsHrFromEnv() {
  64  |     const email = (
  65  |       process.env.HR_USERNAME
  66  |       || process.env.LOGIN_EMAIL
  67  |       || process.env.EMPLOYEE_EMAIL
  68  |     )?.trim();
  69  |     const password = (
  70  |       process.env.HR_PASSWORD
  71  |       || process.env.LOGIN_PASSWORD
  72  |       || process.env.EMPLOYEE_PASSWORD
  73  |     )?.trim();
  74  |     if (!email || !password) {
  75  |       throw new Error(
  76  |         'Set HR_USERNAME/HR_PASSWORD or LOGIN_EMAIL/LOGIN_PASSWORD in .env for HR login',
  77  |       );
  78  |     }
  79  |     await this.logoutOrClearSession();
  80  |     await this.goto();
  81  |     await this.login(email, password);
  82  |     try {
  83  |       await this.page.waitForURL(/\/dashboard\/emp/, {
  84  |         timeout: 45000,
  85  |         waitUntil: 'domcontentloaded',
  86  |       });
  87  |     } catch {
  88  |       await this.logoutOrClearSession();
  89  |       await this.goto();
  90  |       await this.login(email, password);
  91  |       await this.page.waitForURL(/\/dashboard\/emp/, {
  92  |         timeout: 45000,
  93  |         waitUntil: 'domcontentloaded',
  94  |       });
  95  |     }
  96  |     await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  97  |   }
  98  | 
  99  |   async loginFromEnv() {
  100 |     const email = (process.env.EMPLOYEE_EMAIL || process.env.LOGIN_EMAIL)?.trim();
  101 |     const password = (process.env.EMPLOYEE_PASSWORD || process.env.LOGIN_PASSWORD)?.trim();
  102 |     if (!email || !password) {
  103 |       throw new Error('Set EMPLOYEE_EMAIL / LOGIN_EMAIL and EMPLOYEE_PASSWORD / LOGIN_PASSWORD in .env');
  104 |     }
  105 |     await this.logoutOrClearSession();
  106 |     await this.goto();
  107 |     await this.login(email, password);
  108 |     try {
  109 |       await this.page.waitForURL(/\/dashboard\/emp/, {
  110 |         timeout: 45000,
  111 |         waitUntil: 'domcontentloaded',
  112 |       });
  113 |     } catch {
  114 |       await this.logoutOrClearSession();
  115 |       await this.goto();
  116 |       await this.login(email, password);
> 117 |       await this.page.waitForURL(/\/dashboard\/emp/, {
      |                       ^ TimeoutError: page.waitForURL: Timeout 45000ms exceeded.
  118 |         timeout: 45000,
  119 |         waitUntil: 'domcontentloaded',
  120 |       });
  121 |     }
  122 |     await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible' });
  123 |   }
  124 | 
  125 |   async validateUserSession() {
  126 |     await this.page.context().clearCookies();
  127 |     await this.page.evaluate(() => {
  128 |       localStorage.clear();
  129 |       sessionStorage.clear();
  130 |     }).catch(() => {});
  131 |     await this.loginFromEnv();
  132 |   }
  133 | 
  134 |   async logout() {
  135 |     await this.page.locator('.profile-dropdown').click();
  136 | 
  137 |     await this.page
  138 |         .getByRole('button', { name: 'LogoutLogout' })
  139 |         .click();
  140 | 
  141 |     await this.page
  142 |         .getByRole('button', { name: 'Yes' })
  143 |         .click();
  144 |   }
  145 | }
  146 | 
```