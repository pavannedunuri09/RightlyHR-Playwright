import { expect, type Page, test } from '@playwright/test';
import {
  DEFAULT_ALLOCATION_DAYS,
  GENERAL_LEAVE_ALLOCATION_BASE,
  LeaveAllocationPage,
} from '../pages/LeaveAllocationPage';
import { LoginPage } from '../pages/LoginPage';

test.describe.serial('Leave Allocation', () => {
  let page: Page;
  let leaveAllocationPage: LeaveAllocationPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await new LoginPage(page).loginFromEnv();
    leaveAllocationPage = new LeaveAllocationPage(page);
  });

  test.afterAll(async () => {
    await page?.close();
  });

  test('01. navigates to Leave Allocation and shows filter controls', async () => {
    await leaveAllocationPage.openFromDashboard();

    await expect(leaveAllocationPage.yearDropdown).toBeVisible();
    await expect(leaveAllocationPage.locationDropdown).toBeVisible();
    await expect(leaveAllocationPage.subLocationDropdown).toBeVisible();
    await expect(leaveAllocationPage.shiftDropdown).toBeVisible();
    await expect(leaveAllocationPage.categoryDropdown).toBeVisible();
    await expect(leaveAllocationPage.saveButton).toBeVisible();
  });

  test('02. selects published leave filters and shows grade/day grid for first category', async () => {
    await leaveAllocationPage.selectBaseAllocationFilters(GENERAL_LEAVE_ALLOCATION_BASE);

    const categories = await leaveAllocationPage.getAvailableCategoryNames();
    expect(categories.length).toBeGreaterThan(0);

    await leaveAllocationPage.selectCategory(categories[0]);
    await expect.poll(() => leaveAllocationPage.selectedCategoryLabel()).toContain(categories[0]);
    await leaveAllocationPage.expectAllocationGridVisible();
  });

  test('03. allocates days for all published leave categories and shows success toast', async () => {
    test.setTimeout(300000);

    const categories = await leaveAllocationPage.allocateForAllPublishedCategories(
      GENERAL_LEAVE_ALLOCATION_BASE,
      DEFAULT_ALLOCATION_DAYS,
    );

    expect(categories.length).toBeGreaterThan(0);
  });
});
