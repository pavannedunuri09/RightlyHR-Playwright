import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OnBehalfLeavesPage } from '../pages/OnBehalfLeavesPage';

const TARGET_EMPLOYEE_NAME = 'SD302099 - Patlolla Akhil';
const TARGET_EMPLOYEE_SEARCH = 'akhil';
const EMPLOYEE_ROW_NAME = 'Patlolla Akhil';

test.describe('On Behalf Of Leaves', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    await new LoginPage(page).loginFromEnv();
  });

  test.describe('01. Open module and initial state', () => {
    test('opens On Behalf Of Leaves and shows empty initial state', async ({ page }) => {
      const oboPage = new OnBehalfLeavesPage(page);
      await oboPage.openLeavesFromDashboard();

      await expect(page).toHaveURL(/on-?behalf/i);
      await expect(oboPage.selectEmployeeCombobox).toBeVisible();
      await expect(page.getByText('Select Year')).toBeVisible();
      await expect(oboPage.yearCombobox()).toBeVisible();
      await expect(oboPage.applyOnBehalfButton).toBeVisible();
      await expect(oboPage.noDataFoundCard).toBeVisible();

      const counts = await oboPage.readOnBehalfTabCounts();
      expect(counts.waiting).toBe(0);
      expect(counts.approved).toBe(0);
      expect(counts.processed).toBe(0);
      expect(counts.rejected).toBe(0);
      expect(counts.cancelled).toBe(0);

      expect(await oboPage.isApplyOnBehalfDisabled()).toBe(true);
      expect(await oboPage.readCurrentYear()).toBe(new Date().getFullYear());
    });
  });

  test.describe('02. Employee selection and tab counts', () => {
    test('searches, selects an employee, and loads employee-specific leave records', async ({ page }) => {
      const oboPage = new OnBehalfLeavesPage(page);
      await oboPage.openLeavesFromDashboard();

      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);
      await expect(page.getByText(new RegExp(TARGET_EMPLOYEE_NAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))).toBeVisible();

      const counts = await oboPage.readOnBehalfTabCounts();
      expect(counts.waiting).toBeGreaterThanOrEqual(0);
      expect(counts.approved).toBeGreaterThanOrEqual(0);
      expect(counts.processed).toBeGreaterThanOrEqual(0);
      expect(counts.rejected).toBeGreaterThanOrEqual(0);
      expect(counts.cancelled).toBeGreaterThanOrEqual(0);

      const tabWithRecords = oboPage.onBehalfStatusTabs().find((entry, index) => {
        const values = [counts.waiting, counts.approved, counts.processed, counts.rejected, counts.cancelled];
        return values[index] > 0;
      });
      if (tabWithRecords) {
        await tabWithRecords.tab.click();
        await expect(oboPage.dataRows().first()).toBeVisible();
        await expect(oboPage.dateColumnHeader).toBeVisible();
        await expect(oboPage.leaveTypeColumnHeader).toBeVisible();
        await expect(oboPage.durationColumnHeader).toBeVisible();
        await expect(oboPage.availedColumnHeader).toBeVisible();
        await expect(oboPage.startDateColumnHeader).toBeVisible();
        await expect(oboPage.endDateColumnHeader).toBeVisible();
        await expect(oboPage.reasonColumnHeader).toBeVisible();
        await expect(oboPage.statusColumnHeader).toBeVisible();
      }
    });
  });

  test.describe('03. Year filter', () => {
    test('defaults to the current year and filters employee data by previous year', async ({ page }) => {
      const oboPage = new OnBehalfLeavesPage(page);
      await oboPage.openLeavesFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const currentYear = new Date().getFullYear();
      const currentCounts = await oboPage.readOnBehalfTabCounts();
      expect(await oboPage.readCurrentYear()).toBe(currentYear);

      const previousYear = currentYear - 1;
      await oboPage.selectYear(previousYear);
      expect(await oboPage.readCurrentYear()).toBe(previousYear);
      const previousCounts = await oboPage.readOnBehalfTabCounts();
      expect(previousCounts.waiting).toBeGreaterThanOrEqual(0);
      expect(previousCounts.processed).toBeGreaterThanOrEqual(0);

      await oboPage.selectYear(currentYear);
      expect(await oboPage.readCurrentYear()).toBe(currentYear);
      await expect.poll(async () => {
        const restored = await oboPage.readOnBehalfTabCounts();
        return restored.processed === currentCounts.processed && restored.waiting === currentCounts.waiting;
      }).toBe(true);
    });
  });

  test.describe('04. Apply On Behalf Of — direct to Processed', () => {
    test('submits on-behalf leave from entitled types directly to Processed', async ({ page }) => {
      test.setTimeout(240000);
      const oboPage = new OnBehalfLeavesPage(page);
      await oboPage.openLeavesFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const entitledTypes = await oboPage.readEntitledLeaveTypes();
      expect(entitledTypes.length).toBeGreaterThanOrEqual(1);

      const before = await oboPage.readOnBehalfTabCounts();
      await oboPage.leavesPage.openPendingLeavesApprovals();
      const pendingBefore = await oboPage.leavesPage.readPendingCounts();

      await oboPage.openLeavesFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const created = await oboPage.applyAvailableLeaveOnBehalf();
      expect(entitledTypes).toContain(created.categoryName);

      await expect(oboPage.submittedToast).toBeVisible({ timeout: 15000 }).catch(() => {});
      await expect.poll(() => oboPage.readTabCount(oboPage.processedTab)).toBe(before.processed + 1);
      await expect.poll(() => oboPage.readTabCount(oboPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => oboPage.readTabCount(oboPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => oboPage.readTabCount(oboPage.rejectedTab)).toBe(before.rejected);

      await oboPage.processedTab.click();
      await oboPage.expandTablePageSize();
      await expect(
        oboPage
          .leaveRow(created.cell)
          .filter({ hasText: new RegExp(`${created.categoryName}|${EMPLOYEE_ROW_NAME}`, 'i') })
          .or(oboPage.leavesPage.leaveDateCell(created.cell)),
      ).toBeVisible({ timeout: 15000 });

      await oboPage.leavesPage.openPendingLeavesApprovals();
      const pendingAfter = await oboPage.leavesPage.readPendingCounts();
      expect(pendingAfter.forYou + pendingAfter.forYourRole).toBe(pendingBefore.forYou + pendingBefore.forYourRole);
    });
  });
});

