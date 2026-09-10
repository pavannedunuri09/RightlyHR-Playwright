import { test, expect, Page } from '@playwright/test';
import { PermissionsPage, PermissionRequestData, formatToDateInput } from '../pages/PermissionsPage';

const TODAY_DATE = formatToDateInput(new Date());

const FIRST_PERMISSION: PermissionRequestData = {
  date: TODAY_DATE,
  duration: '0.5',
  permissionType: 'Early Logout',
  reason: 'Requesting for early Logout',
};

const SECOND_PERMISSION: PermissionRequestData = {
  date: TODAY_DATE,
  duration: '0.5',
  permissionType: 'In Between Breaks',
  reason: 'Break exceeded for personal work',
};

test.describe.serial('Time Off >> Permissions End-to-End Test Suite', () => {
  let page: Page;
  let permissionsPage: PermissionsPage;
  let initialWaitingCount: number = 0;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    permissionsPage = new PermissionsPage(page);
  });

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`[DEBUG] Test "${testInfo.title}" failed.`);
    }
  });

  test.afterAll(async () => {
    await page?.close();
  });

  // =========================================================================
  // TEST 01: LOGIN AS EMPLOYEE & NAVIGATE TO TIME OFF >> PERMISSIONS
  // =========================================================================
  test('01. login as employee and click on time off module, permission module', async () => {
    // 1. Login as employee
    await permissionsPage.loginAsEmployee();

    // 2. Click on Time Off module in sidebar
    await permissionsPage.openTimeOffMenu();

    // 3. Click on Permissions module
    await permissionsPage.navigateToPermissionsModule();

    // 4. Verify breadcrumb and Request Permission button
    await permissionsPage.verifyBreadcrumb();
    await expect(permissionsPage.requestPermissionButton).toBeVisible({ timeout: 15000 });

    // 5. Read initial count of Waiting For Approval
    initialWaitingCount = await permissionsPage.getWaitingForApprovalCount();
  });

  // =========================================================================
  // TEST 02: CLICK REQUEST PERMISSION, FILL REQUIRED FIELDS & SUBMIT
  // =========================================================================
  test('02. click on request permission button fill the required fields and then submit the request', async () => {
    // 1. Open Request Permission modal
    await permissionsPage.openRequestPermissionModal();

    // 2. Fill required fields (Date, Duration, Permission Type, Reason)
    await permissionsPage.fillPermissionRequest(FIRST_PERMISSION);

    // 3. Submit request
    await permissionsPage.submitPermissionRequest();
  });

  // =========================================================================
  // TEST 03: VERIFY RECORD IN WAITING FOR APPROVAL TAB & VERIFY UPDATED COUNT
  // =========================================================================
  test('03. the requested record should be seen under waiting for approval tab and also verify the count', async () => {
    // By default employee is on Waiting For Approval tab; verify record exists and count updated
    await permissionsPage.verifyRecordInWaitingForApproval(
      FIRST_PERMISSION.permissionType,
      initialWaitingCount + 1
    );
  });

  // =========================================================================
  // TEST 04: CANCEL THE PREVIOUSLY REQUESTED PERMISSION VIA KEBAB MENU
  // =========================================================================
  test('04. click on kebab menu and cancel the permission request record that was requested earlier', async () => {
    // Cancel the record in Waiting for Approval
    await permissionsPage.cancelFirstPermission('Cancelling applied test permission request');
    await page.waitForTimeout(1000);

    // Verify count decremented back
    const countAfterCancel = await permissionsPage.getWaitingForApprovalCount();
    expect(countAfterCancel).toBe(initialWaitingCount);
  });

  // =========================================================================
  // TEST 05: REQUEST ANOTHER PERMISSION, SUBMIT & VERIFY RECORD & COUNT
  // =========================================================================
  test('05. click on request permission and fill all the required details and then submit the request and verify the record under waiting for approval tab and also verify the count', async () => {
    // 1. Open Request Permission modal
    await permissionsPage.openRequestPermissionModal();

    // 2. Fill required details
    await permissionsPage.fillPermissionRequest(SECOND_PERMISSION);

    // 3. Submit request
    await permissionsPage.submitPermissionRequest();

    // 4. Verify record is visible under Waiting for Approval and check count
    await permissionsPage.verifyRecordInWaitingForApproval(
      SECOND_PERMISSION.permissionType,
      initialWaitingCount + 1
    );
  });

  // =========================================================================
  // TEST 06: ATTENDANCE MODULE - VERIFY CHIP & LOGS PERMISSION ACCORDION
  // =========================================================================
  test('06. Click on attendance module and for the permission requested verify the chip under that date as Permission requested and click on logs click on permission accordion and the status be seen as requested', async () => {
    // 1. Navigate to Attendance module
    await permissionsPage.navigateToAttendanceModule();

    // 2. Verify the chip under the requested date displays "Permission requested"
    await permissionsPage.verifyPermissionRequestedChip(TODAY_DATE);

    // 3. Click on Logs, click on Permission accordion and verify status as "Requested"
    await permissionsPage.openAttendanceLogsAndVerifyPermissionStatus('Requested');
  });

  // =========================================================================
  // TEST 07: LOGOUT AS EMPLOYEE
  // =========================================================================
  test('07. logout as employee', async () => {
    await permissionsPage.logout();
    await expect(permissionsPage.loginPage.emailInput).toBeVisible({ timeout: 15000 });
  });
});
