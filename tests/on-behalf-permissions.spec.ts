import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import {
  OnBehalfPermissionsPage,
  formatPermissionDateForDisplay,
  getUpcomingPermissionDate,
} from '../pages/OnBehalfPermissionsPage';

const TARGET_EMPLOYEE_NAME = 'SD302135 - Induu Priyaa';
const TARGET_EMPLOYEE_SEARCH = 'indu';
const REPORTING_MANAGER_NAME = 'saii Pavan Dinesh';
const REPORTING_MANAGER_SEARCH = 'saii pavan';
const DEFAULT_EMPLOYEE_EMAIL = 'indu@yopmail.com';
const DEFAULT_EMPLOYEE_PASSWORD = 'Indu@123';

function employeeCredentials() {
  return {
    email: process.env.EMPLOYEE_EMAIL?.trim() || DEFAULT_EMPLOYEE_EMAIL,
    password: process.env.EMPLOYEE_PASSWORD?.trim() || DEFAULT_EMPLOYEE_PASSWORD,
  };
}

// Shared state for end-to-end multi-step continuation flow
let sharedPage: Page;
let loginPage: LoginPage;
let oboPermissionsPage: OnBehalfPermissionsPage;
let requestedDate: string;
let secondRequestedDate: string;
let formattedDate: { cellDate: string; fullDate: string; monthName: string; dayNumber: number };
let secondFormattedDate: { cellDate: string; fullDate: string; monthName: string; dayNumber: number };
let permissionReason: string;
let secondPermissionReason: string;

test.describe.configure({ mode: 'serial' });

test.describe('On Behalf Of — Permission Flow', () => {
  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();
    loginPage = new LoginPage(sharedPage);
    oboPermissionsPage = new OnBehalfPermissionsPage(sharedPage);

    // Use upcoming weekdays within the current month so Attendance can display them.
    requestedDate = getUpcomingPermissionDate(3);
    secondRequestedDate = getUpcomingPermissionDate(3);
    permissionReason = `Permission request ${Date.now()}`;
    secondPermissionReason = `Permission request ${Date.now()} second`;
  });

  test.afterAll(async () => {
    if (sharedPage) {
      await sharedPage.close().catch(() => {});
    }
  });

  test('test 01: login as employee, open Time Off Permissions, and request a permission', async () => {
    const { email: employeeEmail, password: employeePassword } = employeeCredentials();
    await loginPage.loginWithCredentials(employeeEmail, employeePassword);
    await oboPermissionsPage.openEmployeePermissions();
    requestedDate = await oboPermissionsPage.submitPermissionOnBehalf({
      date: requestedDate,
      duration: '0.5',
      permissionType: 'Early Login',
      reason: permissionReason,
    }, [
      getUpcomingPermissionDate(5),
      getUpcomingPermissionDate(6),
      getUpcomingPermissionDate(7),
    ]);
    formattedDate = formatPermissionDateForDisplay(requestedDate);
  });

  test('test 02: verify the requested permission chip, logs duration, and requested status in Attendance', async () => {
    if (!formattedDate) {
      throw new Error('Test 01 did not set formattedDate. Run this serial suite from test 01.');
    }
    await oboPermissionsPage.verifyAttendancePermissionRequestedChipAndLogs(
      formattedDate.cellDate,
      formattedDate.dayNumber,
    );
  });

  test('test 03: logout as employee', async () => {
    await oboPermissionsPage.logout();
  });

  test('test 04: login as HR and open On Behalf Of Approvals Permissions for the reporting manager', async () => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    await loginPage.login(email, password);
    await sharedPage.waitForURL(/\/dashboard\/emp/, { timeout: 45000 });
    await expect(sharedPage.getByText('Have a nice day at work!')).toBeVisible({ timeout: 15000 });
    await oboPermissionsPage.openOnBehalfApprovalsPermissions(
      REPORTING_MANAGER_NAME,
      REPORTING_MANAGER_SEARCH,
    );
  });

  test('test 05: reject the permission request from the On Behalf Of kebab menu and logout as HR', async () => {
    await oboPermissionsPage.rejectRecordViaKebab(
      formattedDate.cellDate,
      'Permission request rejected by HR',
      'Early Login',
    );
    await oboPermissionsPage.logout();
  });

  test('test 06: request a second permission, verify it in Attendance, and logout as employee', async () => {
    const { email: employeeEmail, password: employeePassword } = employeeCredentials();
    await loginPage.loginWithCredentials(employeeEmail, employeePassword);
    await oboPermissionsPage.openEmployeePermissions();
    secondRequestedDate = await oboPermissionsPage.submitPermissionOnBehalf({
      date: secondRequestedDate,
      duration: '0.5',
      permissionType: 'In Between Breaks',
      reason: secondPermissionReason,
    }, [
      getUpcomingPermissionDate(5),
      getUpcomingPermissionDate(6),
      getUpcomingPermissionDate(7),
    ]);
    secondFormattedDate = formatPermissionDateForDisplay(secondRequestedDate);
    await oboPermissionsPage.verifyAttendancePermissionRequestedChipAndLogs(
      secondFormattedDate.cellDate,
      secondFormattedDate.dayNumber,
    );
    await oboPermissionsPage.logout();
  });

  test('test 07: login as HR, select the reporting manager, and process the second request', async () => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    await loginPage.loginWithCredentials(email, password);
    await oboPermissionsPage.openOnBehalfApprovalsPermissions(
      REPORTING_MANAGER_NAME,
      REPORTING_MANAGER_SEARCH,
    );
    await oboPermissionsPage.processRecordViaKebab(
      secondFormattedDate.cellDate,
      'Permission request processed by HR',
      'In Between Breaks',
    );
  });

  test('test 08: verify the approved employee permission under Time Off Processed', async () => {
    await oboPermissionsPage.openPermissionsFromDashboard();
    await oboPermissionsPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
    await oboPermissionsPage.verifyProcessedRecord(secondFormattedDate.cellDate, 'In Between Breaks');
  });

});
