import { test, expect, Page } from '@playwright/test';
import { AuditTrailsPage } from '../pages/AuditTrailsPage';

test.describe.serial('Audit Trails Module - Hansco Environment', () => {
  let page: Page;
  let auditPage: AuditTrailsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    auditPage = new AuditTrailsPage(page);
  });

  test.afterAll(async () => {
    await page?.close();
  });

  // =========================================================================
  // 1. LOGIN & AUTHENTICATION
  // =========================================================================
  test.describe('1. Authentication & Dashboard Access', () => {
    test('01. Login to Hansco RightlyHR with valid credentials and verify dashboard', async () => {
      const email = process.env.HANSCO_LOGIN_EMAIL?.trim() || 'Rahul@yopmail.com';
      const password = process.env.HANSCO_LOGIN_PASSWORD?.trim() || 'Rahul@12';
      const baseUrl = process.env.HANSCO_BASE_URL?.trim() || 'https://hansco.rightlyhr.com';

      // Step 1: Navigate to Hansco login page
      await auditPage.gotoLogin();
      await expect(page).toHaveURL(new RegExp(`${baseUrl}/login|/login`));
      await expect(auditPage.emailInput).toBeVisible();
      await expect(auditPage.passwordInput).toBeVisible();
      await expect(auditPage.loginButton).toBeVisible();

      // Step 2: Fill in user credentials and submit
      await auditPage.login(email, password);

      // Step 3: Verify redirection to dashboard and active session
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
      await expect(page.getByText('Have a nice day at work!').or(page.getByText('Dashboard', { exact: true })).first()).toBeVisible({ timeout: 15000 });

      // Step 4: Verify logged-in user profile
      const profileElement = page.getByText(/Rahul\s*Shetty|Sr\.\s*Director/i).first();
      await expect(profileElement).toBeVisible({ timeout: 10000 });
    });
  });
});
