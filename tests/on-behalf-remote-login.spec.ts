import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OnBehalfRemoteLoginPage } from '../pages/OnBehalfRemoteLoginPage';
import { upcomingWeekendDate } from '../pages/WorkFromHomePage';

const TARGET_EMPLOYEE_NAME = 'Bhavitha Reddy';
const TARGET_EMPLOYEE_SEARCH = 'Bhavitha reddy';

const ON_BEHALF_SORT_TABS = [
  'Waiting For Approval',
  'Approved',
  'Processed',
  'Rejected',
  'Cancelled',
] as const;

test.describe('On Behalf Of Remote Login', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  test.describe('01. Open module and initial state', () => {
    test('opens On Behalf Of Remote Login and shows empty initial state', async ({ page }) => {
      const oboPage = new OnBehalfRemoteLoginPage(page);
      await oboPage.openRemoteLoginFromDashboard();

      await expect(page).toHaveURL(/on-?behalf|\/time-off\/on-behalf/i);
      await expect(oboPage.selectEmployeeCombobox).toBeVisible();
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
    test('enables Apply On Behalf Of and loads employee status counts after selection', async ({ page }) => {
      const oboPage = new OnBehalfRemoteLoginPage(page);
      await oboPage.openRemoteLoginFromDashboard();

      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const counts = await oboPage.readOnBehalfTabCounts();
      expect(counts.waiting).toBeGreaterThanOrEqual(0);
      expect(counts.approved).toBeGreaterThanOrEqual(0);
      expect(counts.processed).toBeGreaterThanOrEqual(0);
      expect(counts.rejected).toBeGreaterThanOrEqual(0);
      expect(counts.cancelled).toBeGreaterThanOrEqual(0);

      const total = counts.waiting + counts.approved + counts.processed + counts.rejected + counts.cancelled;
      if (total > 0) {
        await expect(oboPage.noDataFoundCard).toBeHidden();
      }

      if (counts.processed > 0) {
        await oboPage.processedTab.click();
        await expect(oboPage.dataRows().first()).toBeVisible();
      }
    });
  });

  test.describe('03. Year filter', () => {
    test('filters employee data by selected year', async ({ page }) => {
      const oboPage = new OnBehalfRemoteLoginPage(page);
      await oboPage.openRemoteLoginFromDashboard();
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
    test('submits on-behalf Remote Login directly to Processed without approval queue', async ({ page }) => {
      test.setTimeout(240000);
      const oboPage = new OnBehalfRemoteLoginPage(page);
      await oboPage.openRemoteLoginFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const before = await oboPage.readOnBehalfTabCounts();
      await oboPage.remoteLoginPage.openPendingRemoteLoginApprovals();
      const pendingBefore = await oboPage.remoteLoginPage.readPendingCounts();

      await oboPage.openRemoteLoginFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const created = await oboPage.applyAvailableRemoteLoginOnBehalf();
      await expect.poll(() => oboPage.readTabCount(oboPage.processedTab)).toBe(before.processed + 1);
      await expect.poll(() => oboPage.readTabCount(oboPage.waitingForApprovalTab)).toBe(before.waiting);

      await oboPage.processedTab.click();
      await expect(
        oboPage.sessionRow(created.cell, 'First Half', TARGET_EMPLOYEE_NAME).or(
          page.getByRole('cell', { name: created.cell }),
        ),
      ).toBeVisible({ timeout: 15000 });

      await oboPage.remoteLoginPage.openPendingRemoteLoginApprovals();
      const pendingAfter = await oboPage.remoteLoginPage.readPendingCounts();
      expect(pendingAfter.forYou + pendingAfter.forYourRole).toBe(pendingBefore.forYou + pendingBefore.forYourRole);
    });
  });

  test.describe('05. Validation', () => {
    test('shows validation when a Remote Login request already exists for the date', async ({ page }) => {
      test.setTimeout(180000);
      const oboPage = new OnBehalfRemoteLoginPage(page);
      await oboPage.openRemoteLoginFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const created = await oboPage.applyAvailableRemoteLoginOnBehalf();
      await expect.poll(() => oboPage.readTabCount(oboPage.processedTab)).toBeGreaterThan(0);

      const dialog = await oboPage.openApplyOnBehalfDialog();
      await oboPage.fillOnBehalfRequestForm(
        created.input,
        `Duplicate on-behalf Remote Login ${created.input}`,
        'first',
      );
      if (await oboPage.remoteLoginPage.waitForRequestSubmitEnabled(2000)) {
        await oboPage.remoteLoginPage.requestButton.click({ force: true });
      }
      await expect(oboPage.remoteLoginPage.duplicateRequestMessage).toBeVisible({ timeout: 15000 });
      await expect(dialog).toBeVisible();
      await oboPage.closeRequestDialogIfOpen();
    });

    test.skip('blocks on-behalf Remote Login requests on Saturday and Sunday shift weekends', async ({ page }) => {
      const oboPage = new OnBehalfRemoteLoginPage(page);
      await oboPage.openRemoteLoginFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const before = await oboPage.readOnBehalfTabCounts();
      const weekends = [
        { name: 'Saturday', date: upcomingWeekendDate(6) },
        { name: 'Sunday', date: upcomingWeekendDate(0) },
      ];

      for (const weekend of weekends) {
        const dialog = await oboPage.openApplyOnBehalfDialog();
        await oboPage.fillOnBehalfRequestForm(
          weekend.date.input,
          `Weekend on-behalf Remote Login ${weekend.name}`,
          'first',
        );
        expect(
          await oboPage.remoteLoginPage.waitForRequestSubmitEnabled(2000),
          `${weekend.name} ${weekend.date.input} should not be submittable`,
        ).toBe(false);
        await expect(dialog).toBeVisible();
        await oboPage.closeRequestDialogIfOpen();
      }

      const after = await oboPage.readOnBehalfTabCounts();
      expect(after.processed).toBe(before.processed);
      expect(after.waiting).toBe(before.waiting);
    });
  });

  test.describe('06. Column sorting', () => {
    for (const tabName of ON_BEHALF_SORT_TABS) {
      test(`sorts sortable columns on the ${tabName} tab`, async ({ page }) => {
        test.setTimeout(180000);
        const oboPage = new OnBehalfRemoteLoginPage(page);
        await oboPage.openRemoteLoginFromDashboard();
        await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
        await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

        const tab = oboPage.onBehalfStatusTabs().find((entry) => entry.name === tabName);
        expect(tab, tabName).toBeTruthy();
        await tab!.tab.click();
        await expect(tab!.tab).toBeVisible();
        await page.locator('table thead th.p-datatable-sortable-column').first().waitFor({ state: 'visible' });
        await oboPage.assertSortableColumnsCycle(tabName);
      });
    }
  });
});
