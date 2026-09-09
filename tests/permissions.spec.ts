import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PermissionsPage, PermissionRequestData, getFutureDateInput } from '../pages/PermissionsPage';

const TODAY_DATE = new Date().toISOString().split('T')[0];
const NEXT_DAY_DATE = getFutureDateInput(1);

const FIRST_PERMISSION: PermissionRequestData = {
  date: TODAY_DATE,
  duration: '0.5',
  permissionType: 'Early Logout',
  reason: 'Requesting for early Logout',
};

const SECOND_PERMISSION: PermissionRequestData = {
  date: NEXT_DAY_DATE,
  duration: '0.5',
  permissionType: 'In Between Breaks',
  reason: 'Break exceeded for urgent personal work',
};

test.describe.serial('Time Off >> Permissions Test Suite', () => {
  let page: Page;
  let loginPage: LoginPage;
  let permissionsPage: PermissionsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    permissionsPage = new PermissionsPage(page);
  });

  test.afterAll(async () => {
    await page?.close();
  });

  // =========================================================================
  // 1. LOGIN & BREADCRUMB VERIFICATION (FIRST TEST)
  // =========================================================================
  test('01. login as an employee, click on Time Off, click on Permissions module and verify the breadcrumb as TimeOff >> Permissions', async () => {
    // 1. Login as an employee
    const empEmail = process.env.EMPLOYEE_EMAIL?.trim() || process.env.LOGIN_EMAIL?.trim();
    const empPassword = process.env.EMPLOYEE_PASSWORD?.trim() || process.env.LOGIN_PASSWORD?.trim();
    test.skip(!empEmail || !empPassword, 'Set EMPLOYEE_EMAIL/LOGIN_EMAIL and EMPLOYEE_PASSWORD/LOGIN_PASSWORD in .env');

    await permissionsPage.loginAsEmployee(empEmail, empPassword);
    await expect(page).toHaveURL(/\/dashboard\/emp/);

    // 2. Click on Time Off in sidebar / menu
    await permissionsPage.openTimeOffMenu();

    // 3. Click on Permissions module
    await permissionsPage.navigateToPermissionsModule();

    // 4. Verify breadcrumb as TimeOff >> Permissions
    await permissionsPage.verifyBreadcrumb();
    const breadcrumbText = await permissionsPage.getBreadcrumbText();
    expect(breadcrumbText.replace(/\s+/g, ' ')).toMatch(/Time\s*Off.*Permissions/i);

    // Verify Request Permission button is visible
    await expect(permissionsPage.requestPermissionButton).toBeVisible({ timeout: 10000 });
  });

  // =========================================================================
  // 2. MODULE TABS & COUNT & LIST VIEW VERIFICATION
  // =========================================================================
  test('02. verifies module tabs, tab counts, list view headers and No Data Found empty state when no records are present', async () => {
    // 1. Assert status tabs and Request Permission button are present
    await expect(permissionsPage.waitingForApprovalTab).toBeVisible();
    await expect(permissionsPage.rejectedTab).toBeVisible();
    await expect(permissionsPage.cancelledTab).toBeVisible();
    await expect(permissionsPage.requestPermissionButton).toBeVisible();

    // 2. Read counts for each status tab
    const counts = await permissionsPage.readPermissionTabCounts();
    expect(counts.waiting).toBeGreaterThanOrEqual(0);
    expect(counts.rejected).toBeGreaterThanOrEqual(0);
    expect(counts.cancelled).toBeGreaterThanOrEqual(0);

    // 3. Verify each tab's view and empty state when count is 0
    const tabConfigs: { name: 'waiting' | 'rejected' | 'cancelled'; count: number }[] = [
      { name: 'waiting', count: counts.waiting },
      { name: 'rejected', count: counts.rejected },
      { name: 'cancelled', count: counts.cancelled },
    ];

    for (const tab of tabConfigs) {
      await permissionsPage.selectTab(tab.name);

      if (tab.count === 0) {
        // When no records are found, No Data Found should be visible
        await expect(permissionsPage.noDataFoundMessage).toBeVisible({ timeout: 5000 });
      } else {
        // When records are present, verify table and column headers
        await expect(permissionsPage.permissionsTable).toBeVisible({ timeout: 5000 });
        await expect(permissionsPage.requestedDateHeader).toBeVisible();
        await expect(permissionsPage.permissionDateHeader).toBeVisible();
        await expect(permissionsPage.durationHeader).toBeVisible();
        await expect(permissionsPage.reasonHeader).toBeVisible();
        await expect(permissionsPage.permissionTypeHeader).toBeVisible();
        await expect(permissionsPage.statusHeader).toBeVisible();
        if (tab.name === 'waiting') {
          await expect(permissionsPage.actionHeader).toBeVisible();
        }
      }
    }

    // 4. Return to Waiting For Approval tab
    await permissionsPage.selectTab('waiting');
  });

  // =========================================================================
  // 3. APPLY JUST ONE PERMISSION (WITH SETTINGS LIMIT HANDLING IF NEEDED)
  // =========================================================================
  test('03. applies just one permission (if limit exceeded error occurs, updates configuration in Settings > Attendance Eligibility Criteria and applies)', async () => {
    await permissionsPage.requestPermissionWithLimitHandling(FIRST_PERMISSION, 30);
    await expect(permissionsPage.requestModal).not.toBeVisible();
  });

  // =========================================================================
  // 4. CANCEL THE APPLIED PERMISSION
  // =========================================================================
  test('04. cancels the applied permission request with cancellation reason', async () => {
    // Switch to Waiting For Approval tab
    await permissionsPage.selectTab('waiting');

    // If there is an active row, cancel it
    const rowCount = await permissionsPage.permissionRows.count();
    if (rowCount > 0) {
      await permissionsPage.cancelFirstPermission('Cancelling applied test permission');
    }
  });

  // =========================================================================
  // 5. APPLY ONE MORE PERMISSION
  // =========================================================================
  test('05. applies one more permission after cancelling the previous one', async () => {
    await permissionsPage.requestPermissionWithLimitHandling(SECOND_PERMISSION, 30);
    await expect(permissionsPage.requestModal).not.toBeVisible();
  });
});
