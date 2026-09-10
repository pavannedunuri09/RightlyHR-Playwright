/**
 * Prerequisites: run `npm run test:leave-category` then `npm run test:leave-allocation` first.
 * This suite assumes published leave categories are allocated for the same location/shift base.
 */
import { expect, type Page, test } from '@playwright/test';
import {
  DEFAULT_ALLOCATION_DAYS,
  GENERAL_LEAVE_ALLOCATION_BASE,
} from '../pages/LeaveAllocationPage';
import {
  GENERAL_LEAVE_CATEGORY,
  SICK_LEAVE_CATEGORY,
} from '../pages/LeaveCategoryPage';
import {
  LOAD_ENTITLEMENTS_EMPLOYEE,
  LoadEntitlementsPage,
} from '../pages/LoadEntitlementsPage';
import { LeavesPage } from '../pages/LeavesPage';
import { LoginPage } from '../pages/LoginPage';

const DEFAULT_CYCLE_PATTERN = /Year \(Jan 01 2026/i;

test.describe.serial('Load Entitlements', () => {
  let page: Page;
  let loadEntitlementsPage: LoadEntitlementsPage;
  let leavesPage: LeavesPage;
  let loginPage: LoginPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await new LoginPage(page).loginFromEnv();
    loadEntitlementsPage = new LoadEntitlementsPage(page);
    leavesPage = new LeavesPage(page);
    loginPage = new LoginPage(page);
  });

  test.afterAll(async () => {
    await page?.close();
  });

  test('01. navigates to Load Entitlements and shows read-only employee detail fields', async () => {
    await loadEntitlementsPage.openFromDashboard();

    await expect(loadEntitlementsPage.employeeCombobox).toBeVisible();
    await expect(loadEntitlementsPage.workEmailInput).toBeVisible();
    await expect(loadEntitlementsPage.dateOfJoiningInput).toBeVisible();
    await expect(loadEntitlementsPage.locationInput).toBeVisible();
    await expect(loadEntitlementsPage.subLocationInput).toBeVisible();
    await expect(loadEntitlementsPage.shiftInput).toBeVisible();
    await expect(loadEntitlementsPage.loadEntitlementsButton).toBeVisible();

    await loadEntitlementsPage.expectReadOnlyFieldsBeforeSelection();
  });

  test('02. selects employee, auto-populates details, and shows entitlement grid', async () => {
    await loadEntitlementsPage.selectEmployee(
      LOAD_ENTITLEMENTS_EMPLOYEE.search,
      LOAD_ENTITLEMENTS_EMPLOYEE.optionLabel,
    );

    await loadEntitlementsPage.expectEmployeeDetailsPopulated(GENERAL_LEAVE_ALLOCATION_BASE);

    if (await loadEntitlementsPage.hasCompletedEntitlements()) {
      await loadEntitlementsPage.expectCompletedEntitlement(
        GENERAL_LEAVE_CATEGORY.categoryName,
        DEFAULT_ALLOCATION_DAYS,
        GENERAL_LEAVE_CATEGORY.frequencyType,
      );
      await loadEntitlementsPage.expectCompletedEntitlement(
        SICK_LEAVE_CATEGORY.categoryName,
        DEFAULT_ALLOCATION_DAYS,
        SICK_LEAVE_CATEGORY.frequencyType,
      );
      return;
    }

    await loadEntitlementsPage.expectCategoryTabsVisible([
      GENERAL_LEAVE_CATEGORY.categoryName,
      SICK_LEAVE_CATEGORY.categoryName,
    ]);
    await loadEntitlementsPage.expectEntitlementsTableVisible();

    const rowExpectation = {
      days: DEFAULT_ALLOCATION_DAYS,
      frequency: GENERAL_LEAVE_CATEGORY.frequencyType,
      cyclePattern: DEFAULT_CYCLE_PATTERN,
    };

    await loadEntitlementsPage.expectCategoryEntitlement(
      GENERAL_LEAVE_CATEGORY.categoryName,
      rowExpectation,
    );
    await loadEntitlementsPage.expectCategoryEntitlement(SICK_LEAVE_CATEGORY.categoryName, {
      ...rowExpectation,
      frequency: SICK_LEAVE_CATEGORY.frequencyType,
    });
  });

  test('03. loads entitlements and shows success toast', async () => {
    if (await loadEntitlementsPage.hasCompletedEntitlements()) {
      return;
    }

    await loadEntitlementsPage.loadEntitlements();
    await loadEntitlementsPage.dismissToastIfPresent();
  });

  test('04. validates user session and opens Time Off Leaves tab', async () => {
    await leavesPage.validateUserSessionAndOpenLeaves(loginPage, [
      GENERAL_LEAVE_CATEGORY.categoryName,
      SICK_LEAVE_CATEGORY.categoryName,
    ]);
  });

  test('05. displays entitled General Leave and Sick Leave balances', async () => {
    await leavesPage.waitForEntitlementCards([
      GENERAL_LEAVE_CATEGORY.categoryName,
      SICK_LEAVE_CATEGORY.categoryName,
    ]);

    const entitledBalance = `${DEFAULT_ALLOCATION_DAYS}/${DEFAULT_ALLOCATION_DAYS}`;

    await leavesPage.expectEntitledLeave(GENERAL_LEAVE_CATEGORY.categoryName, {
      entitledBalance,
      frequency: GENERAL_LEAVE_CATEGORY.frequencyType,
      booked: '0',
      processed: '0',
    });
    await leavesPage.expectEntitledLeave(SICK_LEAVE_CATEGORY.categoryName, {
      entitledBalance,
      frequency: SICK_LEAVE_CATEGORY.frequencyType,
      booked: '0',
      processed: '0',
    });
  });
});
