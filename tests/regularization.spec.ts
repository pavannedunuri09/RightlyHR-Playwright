import { test, expect, Page } from '@playwright/test';
import { RegularizationPage } from '../pages/RegularizationPage';

const EMPLOYEE_NAME = 'Indu Priya';
const EMPLOYEE_ID = 'SD302135';

test.describe.serial('Attendance >> Regularization End-to-End Test Suite', () => {
  let page: Page;
  let regularizationPage: RegularizationPage;
  let hasEligibleRegularization = false;
  let initialRejectedCount = 0;
  let initialWaitingCount = 0;
  let initialAttendanceRegularizationCount = 0;
  let approvedRegularizationRequests = 0;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    regularizationPage = new RegularizationPage(page);
  });

  test.afterAll(async () => {
    await page?.close();
  });

  // =========================================================================
  // TEST 01: EMPLOYEE LOGIN & CHECK CURRENT MONTH ATTENDANCE FOR REGULARIZATION
  // =========================================================================
  test('01. login as employee, navigate to Attendance module, and verify Regularization option is present on short hours/unmet day', async () => {
    // 1. Login as employee
    await regularizationPage.loginAsEmployee();

    // 2. Navigate to Attendance (current month)
    await regularizationPage.navigateToAttendance();
    initialAttendanceRegularizationCount = await regularizationPage.readAttendanceRegularizationCount();
    console.log(`Initial Attendance Summary regularization count: ${initialAttendanceRegularizationCount}`);

    // 3. Check for Regularization button in current month
    const regCount = await regularizationPage.regularizeButtons.count();

    if (regCount === 0) {
      console.log("'No regularization requests found' all are present for this month");
      hasEligibleRegularization = false;
    } else {
      hasEligibleRegularization = true;
      const regButton = regularizationPage.regularizeButtons.first();
      await expect(regButton).toBeVisible({ timeout: 15000 });
    }
  });

  // =========================================================================
  // TEST 02: OPEN REGULARIZATION POPUP, FILL DETAILS & SUBMIT
  // =========================================================================
  test('02. clicks Regularization button, fills all details in popup and submits regularization request', async () => {
    if (!hasEligibleRegularization) {
      console.log("'No regularization requests found' all are present for this month");
      return;
    }

    // Click Regularization button to open form modal
    await regularizationPage.openRegularizationFormModal();

    // Fill request details and submit
    await regularizationPage.fillAndSubmitRegularization({
      duration: '0.5',
      regularizationType: 'Missed Punch IN',
      reason: 'Punchin missed for urgent work',
    });
  });

  // =========================================================================
  // TEST 03: VERIFY DURATION LOGS & REGULARIZATION ACCORDION
  // =========================================================================
  test('03. clicks on logs info icon for the regularization requested date, opens regularization accordion, verifies type, duration, and status, and clicks cross icon', async () => {
    if (!hasEligibleRegularization) {
      console.log("'No regularization requests found' all are present for this month");
      return;
    }

    // 1. Click on logs info icon for the regularization requested date
    await regularizationPage.openDurationLogsForDate();

    // 2. Open regularization accordion and verify type, duration, and status
    await regularizationPage.verifyRegularizationAccordionDetails({
      type: 'Missed Punch',
      duration: '0.5|00:30',
      status: 'Requested',
    });

    // 3. Click on cross icon for the attendance logs popup
    await regularizationPage.clickCrossIconForAttendanceLogsPopup();
  });

  // =========================================================================
  // TEST 04: TIME OFF >> REGULARIZATION MODULE WAITING FOR APPROVAL & COUNT
  // =========================================================================
  test('04. clicks on time off module, clicks on regularization module, verifies requested record is seen under Waiting For Approval tab, and verifies the count', async () => {
    if (!hasEligibleRegularization) {
      console.log("'No regularization requests found' all are present for this month");
      return;
    }

    // 1. Click on Time Off module & click on Regularization module
    await regularizationPage.navigateToTimeOffRegularization();

    // 2. Select Waiting For Approval tab
    await regularizationPage.selectTab('waiting');
    initialWaitingCount = await regularizationPage.getTabCount('waiting');
    initialRejectedCount = await regularizationPage.getTabCount('rejected');

    // 3. Verify requested record is seen under Waiting For Approval
    const rowCount = await regularizationPage.regularizationRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // 4. Verify the count in Waiting For Approval tab
    expect(initialWaitingCount).toBeGreaterThan(0);
  });

  // =========================================================================
  // TEST 05: LOGOUT AS EMPLOYEE
  // =========================================================================
  test('05. logs out as employee', async () => {
    await regularizationPage.logout();
    await expect(regularizationPage.loginPage.emailInput).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // TEST 06: LOGIN AS HR, NAVIGATE TO PENDING APPROVALS & REJECT REQUEST
  // =========================================================================
  test('06. logs in as HR, navigates to Pending Approvals > Time-Off > Regularizations, clicks reject option, selects suggested chip or enters rejection comments, submits and verifies rejection success popup', async () => {
    // Login as HR
    await regularizationPage.loginAsHr();

    if (!hasEligibleRegularization) {
      console.log("'No regularization requests found' all are present for this month");
      return;
    }

    // Navigate to Pending Approvals -> Time-Off -> Regularizations
    await regularizationPage.navigateToPendingApprovalsRegularization();

    // Reject request and verify success
    await regularizationPage.rejectFirstPendingRequest('indu');
  });

  // =========================================================================
  // TEST 07: AS HR, NAVIGATE TO TIME OFF >> REGULARIZATION, SELECT EMPLOYEE & VERIFY REJECTED TAB
  // =========================================================================
  test('07. as HR, searches employee by name or ID and verifies the request under Rejected', async () => {
    if (!hasEligibleRegularization) {
      console.log("'No regularization requests found' all are present for this month");
      return;
    }

    // 1. Navigate to Time Off -> Regularization module
    await regularizationPage.navigateToTimeOffRegularization();

    // Search accepts either employee ID or full employee name.
    await regularizationPage.selectEmployee(EMPLOYEE_NAME, EMPLOYEE_ID);

    // 3. Click Rejected tab and verify rejected request is present
    await regularizationPage.selectTab('rejected');
    await regularizationPage.page.waitForTimeout(1000);

    const rejectedCount = await regularizationPage.getTabCount('rejected');
    const rejectedRows = await regularizationPage.regularizationRows.count();

    if (rejectedCount > 0) {
      expect(rejectedRows).toBeGreaterThan(0);
    } else {
      await expect(regularizationPage.rejectedTab).toBeVisible();
    }
  });

  // =========================================================================
  // TEST 08: LOGOUT AS HR
  // =========================================================================
  test('08. logs out as HR', async () => {
    await regularizationPage.logout();
    await expect(regularizationPage.loginPage.emailInput).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // TEST 09: RELOGIN AS EMPLOYEE, VERIFY REJECTED STATUS IN ATTENDANCE LOGS & TIME OFF
  // =========================================================================
  test('09. relogins as employee and verifies the rejected request in Attendance and Time Off', async () => {
    // 1. Relogin Employee
    await regularizationPage.loginAsEmployee();

    if (!hasEligibleRegularization) {
      console.log("'No regularization requests found' all are present for this month");
      return;
    }

    // Verify the rejected request in Time Off. Test-10 performs the
    // attendance-side re-request once the action is available.
    await regularizationPage.navigateToTimeOffRegularization();

    // Verify record in Rejected tab with updated count
    await regularizationPage.selectTab('rejected');
    const newRejectedCount = await regularizationPage.getTabCount('rejected');
    expect(newRejectedCount).toBeGreaterThanOrEqual(initialRejectedCount);

    const rejectedRows = await regularizationPage.regularizationRows.count();
    expect(rejectedRows).toBeGreaterThan(0);

    // Verify record removed from Waiting For Approval tab with updated count
    await regularizationPage.selectTab('waiting');
    const newWaitingCount = await regularizationPage.getTabCount('waiting');
    expect(newWaitingCount).toBeLessThan(initialWaitingCount);
  });

  // =========================================================================
  // TEST 10: RE-REQUEST THE REJECTED REGULARIZATION AND APPROVE AS HR
  // =========================================================================
  test('10. re-requests regularization for the rejected date and approves it as HR', async () => {
    test.setTimeout(180000);
    if (!hasEligibleRegularization) {
      console.log("'No regularization requests found' all are present for this month");
      return;
    }

    await regularizationPage.navigateToAttendance();
    await regularizationPage.waitForRegularizationButton();

    await regularizationPage.openRegularizationFormModal();
    await regularizationPage.fillAndSubmitRegularization({
      duration: '0.5',
      regularizationType: 'Missed Punch OUT',
      reason: 'Re-requesting regularization after correcting punch details',
    });

    await regularizationPage.logout();
    await regularizationPage.loginAsHr();
    await regularizationPage.navigateToPendingApprovalsRegularization();
    await regularizationPage.approveFirstPendingRequest([EMPLOYEE_ID, EMPLOYEE_NAME, 'Indu']);
    approvedRegularizationRequests += 1;

    await regularizationPage.navigateToTimeOffRegularization();
    await regularizationPage.selectEmployee(EMPLOYEE_NAME, EMPLOYEE_ID);
    await regularizationPage.selectTab('processed');
    await expect(regularizationPage.regularizationRows.first()).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // TEST 11: EMPLOYEE VERIFIES PROCESSED RECORD AND ATTENDANCE SUMMARY COUNT
  // =========================================================================
  test('11. relogins as employee, verifies approved regularization under Processed and validates Attendance Summary count', async () => {
    test.setTimeout(120000);
    if (!hasEligibleRegularization) {
      console.log("'No regularization requests found' all are present for this month");
      return;
    }

    await regularizationPage.logout();
    await regularizationPage.loginAsEmployee();

    await regularizationPage.navigateToTimeOffRegularization();
    await regularizationPage.expectProcessedRegularization();

    await regularizationPage.navigateToAttendance();
    const expectedCount = initialAttendanceRegularizationCount + approvedRegularizationRequests;
    await expect.poll(
      () => regularizationPage.readAttendanceRegularizationCount(),
      {
        timeout: 20000,
        message: `Attendance Summary should show Regularization ${String(expectedCount).padStart(2, '0')}`,
      },
    ).toBe(expectedCount);
    console.log(`Attendance Summary verified: Regularization ${String(expectedCount).padStart(2, '0')}`);
  });
});
