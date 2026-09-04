import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/codegen-wfh.ts', '**/codegen-wfh-settings.ts', '**/codegent-wfh.ts', '**/codegen-remote-login.ts'],
  timeout: 120000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com',
    headless: !!process.env.CI,
    launchOptions: {
      slowMo: process.env.CI ? 0 : 1000,
    },
    trace: 'on-first-retry',
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
  name: '06-manage-shifts',
  testMatch: /manage-shifts\.spec\.ts$/,
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
