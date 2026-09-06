import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OnBehalfWfhPage } from '../pages/OnBehalfWfhPage';
const TARGET_EMPLOYEE_NAME = 'SD3021300 - Bhavitha Reddy';
const TARGET_EMPLOYEE_SEARCH = 'bhavitha';
const EMPLOYEE_ROW_NAME = 'Bhavitha Reddy';

const ON_BEHALF_SORT_TABS = [
  'Waiting For Approval',
  'Approved',
  'Processed',
  'Rejected',
  'Cancelled',
] as const;

test.describe('On Behalf Of WFH', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  test.describe('01. Open module and initial state', () => {
    test('opens On Behalf Of WFH and shows empty initial state', async ({ page }) => {
      const oboPage = new OnBehalfWfhPage(page);
      await oboPage.openWfhFromDashboard();

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
      const oboPage = new OnBehalfWfhPage(page);
      await oboPage.openWfhFromDashboard();

      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const counts = await oboPage.readOnBehalfTabCounts();
      expect(counts.waiting).toBeGreaterThanOrEqual(0);
      expect(counts.approved).toBeGreaterThanOrEqual(0);
      expect(counts.processed).toBeGreaterThanOrEqual(0);
      expect(counts.rejected).toBeGreaterThanOrEqual(0);
      expect(counts.cancelled).toBeGreaterThanOrEqual(0);

      if (counts.processed > 0) {
        await oboPage.processedTab.click();
        await expect(oboPage.dataRows().first()).toBeVisible();
      } else if (counts.waiting > 0) {
        await oboPage.waitingForApprovalTab.click();
        await expect(oboPage.dataRows().first()).toBeVisible();
      }
    });
  });

  test.describe('03. Year filter', () => {
    test('filters employee data by selected year', async ({ page }) => {
      const oboPage = new OnBehalfWfhPage(page);
      await oboPage.openWfhFromDashboard();
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
    test('submits on-behalf WFH directly to Processed without approval queue', async ({ page }) => {
      test.setTimeout(240000);
      const oboPage = new OnBehalfWfhPage(page);
      await oboPage.openWfhFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const before = await oboPage.readOnBehalfTabCounts();
      await oboPage.wfhPage.openPendingWfhApprovals();
      const pendingBefore = await oboPage.wfhPage.readPendingCounts();

      await oboPage.openWfhFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const created = await oboPage.applyAvailableWfhOnBehalf();
      await expect.poll(() => oboPage.readTabCount(oboPage.processedTab)).toBe(before.processed + 1);
      await expect.poll(() => oboPage.readTabCount(oboPage.waitingForApprovalTab)).toBe(before.waiting);

      await oboPage.processedTab.click();
      await expect(
        oboPage.sessionRow(created.cell, 'First Half', EMPLOYEE_ROW_NAME).or(
          page.getByRole('cell', { name: created.cell }),
        ),
      ).toBeVisible({ timeout: 15000 });

      await oboPage.wfhPage.openPendingWfhApprovals();
      const pendingAfter = await oboPage.wfhPage.readPendingCounts();
      expect(pendingAfter.forYou + pendingAfter.forYourRole).toBe(pendingBefore.forYou + pendingBefore.forYourRole);
    });
  });

  test.describe('05. Validation', () => {
    test('shows validation when a WFH request already exists for the date', async ({ page }) => {
      test.setTimeout(180000);
      const oboPage = new OnBehalfWfhPage(page);
      await oboPage.openWfhFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const created = await oboPage.applyAvailableWfhOnBehalf();
      await expect.poll(() => oboPage.readTabCount(oboPage.processedTab)).toBeGreaterThan(0);

      const dialog = await oboPage.openApplyOnBehalfDialog();
      await oboPage.fillOnBehalfRequestForm(
        created.input,
        `Duplicate on-behalf WFH ${created.input}`,
        'first',
      );
      if (await oboPage.remoteLoginPage.waitForRequestSubmitEnabled(2000)) {
        await oboPage.remoteLoginPage.requestButton.click({ force: true });
      }
      await expect(oboPage.remoteLoginPage.duplicateRequestMessage).toBeVisible({ timeout: 15000 });
      await expect(dialog).toBeVisible();
      await oboPage.closeRequestDialogIfOpen();
    });

    test('Cancel on Apply WFH On Behalf asks for confirmation, No keeps the form, Yes closes it', async ({ page }) => {
      const oboPage = new OnBehalfWfhPage(page);
      await oboPage.openWfhFromDashboard();
      await oboPage.selectEmployee(TARGET_EMPLOYEE_NAME, TARGET_EMPLOYEE_SEARCH);
      await expect.poll(async () => oboPage.isApplyOnBehalfEnabled()).toBe(true);

      const before = await oboPage.readOnBehalfTabCounts();
      await oboPage.openFilledOnBehalfRequestForm();
      await expect(oboPage.remoteLoginPage.requestButton).toBeVisible();

      await oboPage.clickRequestFormCancel();
      await expect(oboPage.remoteLoginPage.cancelConfirmMessage).toBeVisible();
      await expect(oboPage.remoteLoginPage.cancelConfirmNo).toBeVisible();
      await expect(oboPage.remoteLoginPage.cancelConfirmYes).toBeVisible();

      await oboPage.remoteLoginPage.cancelConfirmNo.click();
      await expect(oboPage.remoteLoginPage.cancelConfirmMessage).toBeHidden();
      await expect(oboPage.remoteLoginPage.requestButton).toBeVisible();
      await expect(oboPage.remoteLoginPage.workedDateInput).toBeVisible();
      await expect(oboPage.remoteLoginPage.reasonInput).toBeVisible();

      await oboPage.clickRequestFormCancel();
      await expect(oboPage.remoteLoginPage.cancelConfirmMessage).toBeVisible();
      await oboPage.remoteLoginPage.cancelConfirmYes.click();
      await expect(page.getByRole('dialog')).toBeHidden({ timeout: 15000 });
      await expect(oboPage.applyOnBehalfButton).toBeVisible();
      await expect.poll(() => oboPage.readTabCount(oboPage.processedTab)).toBe(before.processed);
    });
  });

  test.describe('06. Column sorting', () => {
    for (const tabName of ON_BEHALF_SORT_TABS) {
      test(`sorts sortable columns on the ${tabName} tab`, async ({ page }) => {
        test.setTimeout(180000);
        const oboPage = new OnBehalfWfhPage(page);
        await oboPage.openWfhFromDashboard();
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
