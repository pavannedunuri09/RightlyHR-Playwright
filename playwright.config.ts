import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

const baseURL = process.env.BASE_URL?.trim();
if (!baseURL) {
  throw new Error('Set BASE_URL in .env (e.g. https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com)');
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  testIgnore: [
    '**/pages/codegen-wfh.ts',
    '**/pages/codegen-wfh-settings.ts',
    '**/pages/codegent-wfh.ts',
    '**/pages/codegen-remote-login.ts',
    '**/pages/codegen-onbehalf-remote-login.ts',
    '**/pages/codegen-onbehalf-wfh.ts',
    '**/pages/codegen-onbehalf-remote.ts',
    '**/pages/codegen-probtion.ts',
    '**/codegen.addtrainee.ts',
  ],
  timeout: 120000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    headless: process.env.HEADLESS === 'true' || !!process.env.CI,
    launchOptions: {
      slowMo: process.env.CI ? 0 : (process.env.SLOWMO ? Number(process.env.SLOWMO) : 1500),
    },
    trace: 'on-first-retry',
    video: 'on',
    actionTimeout: 15000,
    navigationTimeout: 45000,
  },

  projects: [
    {
      name: '01-login',
      testMatch: /(?:^|[\\/])login\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '02-allocation',
      testMatch: /job-info-allocation\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '03-remote-login',
      testMatch: /remote-login\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '04-wfh',
      testMatch: /work-from-home\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '05-wfh-settings',
      testMatch: /wfh-entitlement-criteria\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '06-onbehalf-remote-login',
      testMatch: /on-behalf-remote-login\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '07-onbehalf-wfh',
      testMatch: /on-behalf-wfh\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '08-probation',
      testMatch: /probation\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '09-holidays',
      testMatch: /holidays\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '10-codegen-holidays',
      testDir: './pages',
      testMatch: /codegen-holidays\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '11-leave-category',
      testMatch: /leave-category\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '12-leave-allocation',
      testMatch: /leave-allocation\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '13-load-entitlements',
      testMatch: /load-entitlements\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '14-manage-shifts',
      testMatch: /manage-shifts\.spec\.ts$/,
    },
    {
      name: '15-leaves',
      testMatch: /(?:^|[\\/])leaves\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '16-onbehalf-leaves',
      testMatch: /(?:^|[\\/])on-behalf-leaves\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '17-prospective-trainee',
      testMatch: /prospective-trainee\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '18-onboarding',
      testMatch: /(?:^|[\\/])onboarding\.spec\.ts$/
    },
    {
      name: '19-personalization',
      testMatch: /personalization\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '20-microsoft-login',
      testMatch: /microsoftlogin\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
