import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true
});

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
    '**/codegen.permissions.ts',
    '**/codegen,regularization.ts',
    '**/codegen-wfh.ts',
    '**/codegen-wfh-settings.ts',
    '**/codegent-wfh.ts',
    '**/codegen-remote-login.ts',
    '**/codegen-onbehalf-remote-login.ts',
    '**/codegen-onbehalf-wfh.ts',
    '**/codegen-onbehalf-remote.ts',
    '**/codegen-probtion.ts',
    '**/codegen-onbehalfofapprovalspermissions*',
  ],
  timeout: 120000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: path.resolve(process.env.LOCALAPPDATA || process.cwd(), 'playwright-results'),
  use: {
    baseURL,
    headless: process.env.HEADLESS === 'true' || !!process.env.CI,
    launchOptions: {
      slowMo: process.env.CI ? 0 : (process.env.SLOWMO ? Number(process.env.SLOWMO) : 1500),
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 45000,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
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
      name: '06-separation',
      testMatch: /Separation\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '07-helpdesk',
      testMatch: /(?:^|[\\/])HelpDesk\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '08-separation-rejected',
      testMatch: /SeparationRejected\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '09-recall',
      testMatch: /recall\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '10-extra-log-hours',
      testMatch: /ExtraLogHours\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '11-contract',
      testMatch: /(?:^|[\\/])Contract\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '12-offboarding',
      testMatch: /Offboarding\.spec\.ts$/,
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
