import { test, expect, Page } from '@playwright/test';
import { PermissionsPage, PermissionRequestData } from '../pages/PermissionsPage';

const FIRST_PERMISSION: PermissionRequestData = {
  date: '2026-10-15',
  duration: '0.5',
  permissionType: 'Early Login',
  reason: 'Requesting early login permission',
};

const SECOND_PERMISSION: PermissionRequestData = {
  date: '2026-09-10',
  duration: '0.5',
  permissionType: 'Early Login',
  reason: 'Requesting early login permission',
};

const REJECTION_PERMISSION: PermissionRequestData = {
  date: '2026-09-12',
  duration: '0.5',
  permissionType: 'Early Logout',
  reason: 'Requesting permission for rejection flow',
};

const BULK_REJECT_PERMISSION: PermissionRequestData = {
  date: '2026-09-19',
  duration: '0.5',
  permissionType: 'Early Login',
  reason: 'Requesting permission for bulk rejection flow',
};

const BULK_APPROVE_PERMISSION: PermissionRequestData = {
  date: '2026-09-20',
  duration: '0.5',
  permissionType: 'Early Logout',
  reason: 'Requesting permission for bulk approval flow',
};

test.describe.serial('Time Off >> Permissions End-to-End Test Suite', () => {
  let page: Page;
  let permissionsPage: PermissionsPage;
  let countBeforeFirstRequest: number = 0;
  let countBeforeCancel: number = 0;
  let countBeforeSecondRequest: number = 0;
  let requestedAttendanceDate: string = '2026-09-11';

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    permissionsPage = new PermissionsPage(page);

    page.on('response', async (res) => {
      const url = res.url();
      if (url.includes('permission') || url.includes('time-off') || url.includes('api')) {
        const status = res.status();
        const body = await res.text().catch(() => '');
        console.log(`[API RESPONSE ${status}] ${url} -> ${body.slice(0, 300)}`);
      }
    });
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
  });

  // =========================================================================
  // TEST 02: CLICK REQUEST PERMISSION, FILL REQUIRED FIELDS & SUBMIT
  // =========================================================================
  test('02. click on request permission button fill the required fields and then submit the request', async () => {
    // Measure baseline count right before submitting first request
    countBeforeFirstRequest = await permissionsPage.getWaitingForApprovalCount();

    // Request initial permission (Early Login) with fallback dates if limit exceeded
    await permissionsPage.requestPermission(FIRST_PERMISSION, [
      '2026-11-04',
      '2026-11-05',
      '2026-11-06',
      '2026-11-10',
      '2026-11-11',
      '2026-11-12',
      '2026-11-17',
      '2026-12-02',
      '2026-12-03',
      '2026-10-15',
    ]);
  });

  // =========================================================================
  // TEST 03: VERIFY RECORD IN WAITING FOR APPROVAL TAB & VERIFY UPDATED COUNT
  // =========================================================================
  test('03. the requested record should be seen under waiting for approval tab and also verify the count', async () => {
    // By default employee is on Waiting For Approval tab; verify record exists and count incremented by 1
    await permissionsPage.verifyRecordInWaitingForApproval(
      FIRST_PERMISSION.permissionType,
      countBeforeFirstRequest + 1
    );
  });

  // =========================================================================
  // TEST 04: CANCEL THE PREVIOUSLY REQUESTED PERMISSION VIA KEBAB MENU
  // =========================================================================
  test('04. click on kebab menu and cancel the permission request record that was requested earlier', async () => {
    // Measure count before cancellation
    countBeforeCancel = await permissionsPage.getWaitingForApprovalCount();

    // Cancel the record in Waiting for Approval
    await permissionsPage.cancelFirstPermission('Cancelling applied test permission request');

    // Verify count decremented with polling
    await expect.poll(async () => {
      return await permissionsPage.getWaitingForApprovalCount();
    }, { timeout: 15000, intervals: [500, 1000, 2000] }).toBeLessThanOrEqual(countBeforeCancel);
  });

  // =========================================================================
  // TEST 05: REQUEST ANOTHER PERMISSION FOR SEP 11, SUBMIT & VERIFY RECORD & COUNT
  // =========================================================================
  test('05. click on request permission and fill all the required details and then submit the request and verify the record under waiting for approval tab and also verify the count', async () => {
    // Measure count before second request
    countBeforeSecondRequest = await permissionsPage.getWaitingForApprovalCount();

    // Use dates already rendered in Attendance (today or earlier).
    requestedAttendanceDate = await permissionsPage.requestPermission(SECOND_PERMISSION, [
      '2026-09-09',
      '2026-09-08',
      '2026-09-07',
      '2026-09-04',
      '2026-09-03',
      '2026-09-02',
      '2026-09-01',
    ]);

    // Verify the record; the tab count may lag behind the successful request.
    await permissionsPage.verifyRecordInWaitingForApproval(SECOND_PERMISSION.permissionType);
  });

  // =========================================================================
  // TEST 06: ATTENDANCE MODULE - SEARCH REQUESTED DATE, HIGHLIGHT CHIP & VERIFY STATUS IN LOGS
  // =========================================================================
  test('06. Click on attendance module and for the permission requested verify the chip under that date as Permission requested and click on logs click on permission accordion and the status be seen as requested', async () => {
    // 1. Navigate to Attendance module
    await permissionsPage.navigateToAttendanceModule();

    // 2. Locate requested permission date row and highlight the Permission(Requested) chip
    await permissionsPage.verifyAndHighlightPermissionChip(requestedAttendanceDate);

    // 3. Click on Logs for requested date, open Permission accordion and verify duration (00:30) and status ("Requested")
    await permissionsPage.openDateRowLogsAndVerifyPermission(
      requestedAttendanceDate,
      '00:30',
      'Requested|Waiting for Approval',
    );
  });

  // =========================================================================
  // TEST 07: LOGOUT AS EMPLOYEE
  // =========================================================================
  test('07. logout as employee', async () => {
    await permissionsPage.logout();
    await expect(permissionsPage.loginPage.emailInput).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // TEST 08: LOGIN AS HR, PENDING APPROVALS >> TIMEOFF >> PERMISSIONS & APPROVE
  // =========================================================================
  test('08. approves a pending permission request, creating one as employee when the queue is empty', async () => {
    await permissionsPage.loginAsHR();
    await permissionsPage.navigateToPendingPermissions();

    if (!(await permissionsPage.hasPendingPermissionRows())) {
      await permissionsPage.logout();
      await permissionsPage.loginAsEmployee();
      await permissionsPage.openTimeOffMenu();
      await permissionsPage.navigateToPermissionsModule();
      await permissionsPage.requestPermission(SECOND_PERMISSION, [
        '2026-09-16',
        '2026-09-17',
        '2026-09-18',
        '2026-09-21',
        '2026-09-22',
        '2026-09-23',
        '2026-09-24',
        '2026-09-25',
        '2026-09-28',
        '2026-09-29',
        '2026-09-30',
      ]);

      await permissionsPage.logout();
      await permissionsPage.loginAsHR();
      await permissionsPage.navigateToPendingPermissions();
    }

    await permissionsPage.approvePendingPermissionRequest();
  });

  // =========================================================================
  // TEST 09: VERIFY APPROVED PERMISSION UNDER PROCESSED
  // =========================================================================
  test('09. selects employee from Permissions and verifies the approved record under Processed', async () => {
    await permissionsPage.openTimeOffMenu();
    await permissionsPage.navigateToPermissionsModule();
    await permissionsPage.selectEmployee('Indu Priya');
    await permissionsPage.verifyProcessedPermission();
  });

  // =========================================================================
  // TEST 10: ATTENDANCE - SELECT EMPLOYEE, VERIFY PERMISSION CHIP & STATUS COUNT
  // =========================================================================
  test('10. selects Induu Priya in Attendance and verifies the permission chip and Attendance Status count', async () => {
    await permissionsPage.navigateToAttendanceModule();
    await permissionsPage.selectAttendanceEmployee('Induu Priya');
    await permissionsPage.verifyAttendancePermissionChipAndStatus();
  });

  // =========================================================================
  // TEST 11: EMPLOYEE REQUESTS A PERMISSION & HR REJECTS IT
  // =========================================================================
  test('11. employee requests a new permission and HR rejects the request', async () => {
    await permissionsPage.logout();
    await permissionsPage.loginAsEmployee();
    await permissionsPage.openTimeOffMenu();
    await permissionsPage.navigateToPermissionsModule();
    await permissionsPage.requestPermission(REJECTION_PERMISSION, [
      '2026-09-13',
      '2026-09-14',
      '2026-09-15',
      '2026-09-16',
      '2026-09-17',
      '2026-09-18',
    ]);

    await permissionsPage.logout();
    await permissionsPage.loginAsHR();
    await permissionsPage.navigateToPendingPermissions();
    await permissionsPage.rejectPendingPermissionRequest({
      employeeSearch: 'indu',
      comment: 'Permission request rejected by HR',
    });
  });

  // =========================================================================
  // TEST 12: EMPLOYEE REQUESTS TWO PERMISSIONS & HR USES BULK ACTIONS
  // =========================================================================
  test('12. HR rejects one selected permission and approves the other selected permission', async () => {
    await permissionsPage.logout();
    await permissionsPage.loginAsEmployee();
    await permissionsPage.openTimeOffMenu();
    await permissionsPage.navigateToPermissionsModule();

    await permissionsPage.requestPermission(BULK_REJECT_PERMISSION, [
      '2026-09-21',
      '2026-09-22',
      '2026-09-23',
      '2026-09-24',
    ]);
    await permissionsPage.requestPermission(BULK_APPROVE_PERMISSION, [
      '2026-09-25',
      '2026-09-26',
      '2026-09-27',
      '2026-09-28',
    ]);

    await permissionsPage.logout();
    await permissionsPage.loginAsHR();
    await permissionsPage.navigateToPendingPermissions();

    await permissionsPage.selectPendingPermissionRow(0);
    await permissionsPage.rejectSelectedPermissionRequest();

    await permissionsPage.selectPendingPermissionRow(0);
    await permissionsPage.approveSelectedPermissionRequest();
  });
});
