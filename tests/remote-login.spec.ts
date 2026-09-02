import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { JobInfoWfhPage } from '../pages/JobInfoWfhPage';
import { RemoteLoginPage } from '../pages/RemoteLoginPage';
import { upcomingWeekendDate } from '../pages/WorkFromHomePage';

const EMPLOYEE_NAME = 'saii Pavan Dinesh Tejaa';
const EMPLOYEE_SEARCH = 'saii';
const REMOTE_LOGIN_MANAGER = 'SD302262 - saii Pavan Dinesh';

const REMOTE_LOGIN_SORT_TABS = [
  'Waiting For Approval',
  'Approved',
  'Processed',
  'Rejected',
] as const;

test.describe('Remote Login', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  test.describe('01. Open module and Job Info allocation', () => {
    test('allocates Remote Login on Job Info', async ({ page }) => {
      const jobWfh = new JobInfoWfhPage(page);
      await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);

      if (!(await jobWfh.remoteLoginActiveRow.isVisible().catch(() => false))) {
        await jobWfh.allocateRemoteLogin(jobWfh.todayEffectiveFrom(), REMOTE_LOGIN_MANAGER);
      }

      await expect(jobWfh.effectiveFromHeader).toBeVisible();
      await expect(jobWfh.allocationTypeHeader).toBeVisible();
      await expect(jobWfh.allocatedLocationHeader).toBeVisible();
      await expect(jobWfh.allocatedManagerHeader).toBeVisible();
      await expect(jobWfh.statusHeader).toBeVisible();
      await expect(jobWfh.remoteLoginActiveRow).toBeVisible();

      const rlPage = new RemoteLoginPage(page);
      await rlPage.validateUserOnDashboard();
      await rlPage.openTimeOffMenu();
      await expect(rlPage.timeOffRemoteLoginTab).toBeVisible();
      await rlPage.timeOffRemoteLoginTab.click();
      await expect(page).toHaveURL(/\/time-off\/remote(\/|$)/i);
      await expect(rlPage.requestRemoteLoginButton).toBeVisible();
    });

    test('opens the Remote Login module from the dashboard', async ({ page }) => {
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();

      await expect(page).toHaveURL(/\/time-off\/remote(\/|$)/i);
      await expect(rlPage.requestRemoteLoginButton).toBeVisible();
      await expect(rlPage.waitingForApprovalTab).toBeVisible();
      await expect(rlPage.approvedTab).toBeVisible();
      await expect(rlPage.processedTab).toBeVisible();
      await expect(rlPage.rejectedTab).toBeVisible();
      const counts = await rlPage.readRemoteLoginTabCounts();
      expect(counts.waiting).toBeGreaterThanOrEqual(0);
      expect(counts.approved).toBeGreaterThanOrEqual(0);
      expect(counts.processed).toBeGreaterThanOrEqual(0);
      expect(counts.rejected).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('02. Validation', () => {
    test('shows validation when a Remote Login request already exists for the date', async ({ page }) => {
      test.setTimeout(180000);
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();

      const created = await rlPage.requestAvailableRemoteLogin();
      const dialog = await rlPage.fillRequestForm(
        created.input,
        `Duplicate Remote Login ${created.input}`,
        'first',
      );
      if (await rlPage.waitForRequestSubmitEnabled(2000)) {
        await rlPage.requestButton.click({ force: true });
      }
      await expect(rlPage.duplicateRequestMessage).toBeVisible({ timeout: 15000 });
      await expect(dialog).toBeVisible();
      await rlPage.closeRequestDialogIfOpen();
    });

    test('blocks Remote Login requests on Saturday and Sunday shift weekends', async ({ page }) => {
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      const before = await rlPage.readRemoteLoginTabCounts();
      const weekends = [
        { name: 'Saturday', date: upcomingWeekendDate(6) },
        { name: 'Sunday', date: upcomingWeekendDate(0) },
      ];

      for (const weekend of weekends) {
        const dialog = await rlPage.fillRequestForm(weekend.date.input, `Weekend Remote Login ${weekend.name}`);
        expect(
          await rlPage.waitForRequestSubmitEnabled(2000),
          `${weekend.name} ${weekend.date.input} should not be submittable`,
        ).toBe(false);
        await expect(dialog).toBeVisible();
        await rlPage.closeRequestDialogIfOpen();
        await expect(rlPage.requestRemoteLoginButton).toBeVisible();
      }

      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => rlPage.readTabCount(rlPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => rlPage.readTabCount(rlPage.processedTab)).toBe(before.processed);
    });

    test('submits second half Remote Login when first half already exists for the date', async ({ page }) => {
      test.setTimeout(180000);
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      const before = await rlPage.readRemoteLoginTabCounts();

      const date = await rlPage.requestAvailableRemoteLogin();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await rlPage.waitingForApprovalTab.click();
      await expect(rlPage.sessionRow(date.cell, 'First Half')).toBeVisible();

      await rlPage.requestRemoteLogin(date.input, `Request Remote Login second half ${date.input}`, 'second');
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 2);
      await rlPage.waitingForApprovalTab.click();
      await expect(rlPage.sessionRow(date.cell, 'First Half')).toBeVisible();
      await expect(rlPage.sessionRow(date.cell, 'Second Half')).toBeVisible();
    });

    test('shows error when full day Remote Login is requested on a day that already has first half', async ({ page }) => {
      test.setTimeout(180000);
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      const before = await rlPage.readRemoteLoginTabCounts();

      const date = await rlPage.requestAvailableRemoteLogin();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await rlPage.waitingForApprovalTab.click();
      await expect(rlPage.sessionRow(date.cell, 'First Half')).toBeVisible();

      const dialog = await rlPage.fillRequestForm(date.input, `Full day after first half ${date.input}`, 'full');
      await rlPage.requestButton.click({ force: true });
      await expect(rlPage.sessionConflictMessage).toBeVisible({ timeout: 15000 });
      await expect(dialog).toBeVisible();
      await rlPage.closeRequestDialogIfOpen();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await rlPage.waitingForApprovalTab.click();
      await expect(rlPage.sessionRow(date.cell, 'First Half')).toBeVisible();
      await expect(rlPage.sessionRow(date.cell, 'Full Day')).toHaveCount(0);
    });

    test('Cancel on Request Remote Login asks for confirmation, No keeps the form, Yes closes it', async ({ page }) => {
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      const before = await rlPage.readRemoteLoginTabCounts();

      await rlPage.openFilledRequestForm();
      await expect(rlPage.requestButton).toBeVisible();

      await rlPage.clickRequestFormCancel();
      await expect(rlPage.cancelConfirmMessage).toBeVisible();
      await expect(rlPage.cancelConfirmNo).toBeVisible();
      await expect(rlPage.cancelConfirmYes).toBeVisible();

      await rlPage.cancelConfirmNo.click();
      await expect(rlPage.cancelConfirmMessage).toBeHidden();
      await expect(rlPage.requestButton).toBeVisible();
      await expect(rlPage.workedDateInput).toBeVisible();
      await expect(rlPage.reasonInput).toBeVisible();

      await rlPage.clickRequestFormCancel();
      await expect(rlPage.cancelConfirmMessage).toBeVisible();
      await rlPage.cancelConfirmYes.click();
      await expect(page.getByRole('dialog')).toBeHidden({ timeout: 15000 });
      await expect(rlPage.requestRemoteLoginButton).toBeVisible();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting);
    });
  });

  test.describe('03. For You - Remote Login Manager and Team Manager', () => {
    test('requests Remote Login and rejects it from For You', async ({ page }) => {
      test.setTimeout(180000);
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      const before = await rlPage.readRemoteLoginTabCounts();

      await rlPage.openPendingRemoteLoginApprovals();
      const pendingBefore = await rlPage.readPendingCounts();
      const queueBefore = pendingBefore.forYou + pendingBefore.forYourRole;

      await rlPage.gotoWaitingForApproval();
      const { cell } = await rlPage.requestAvailableRemoteLogin();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await expect.poll(() => rlPage.readTabCount(rlPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => rlPage.readTabCount(rlPage.processedTab)).toBe(before.processed);
      await expect.poll(() => rlPage.readTabCount(rlPage.rejectedTab)).toBe(before.rejected);
      await rlPage.waitingForApprovalTab.click();
      await expect(page.getByRole('cell', { name: cell })).toBeVisible();

      await rlPage.openPendingRemoteLoginApprovals();
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore + 1);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin + 1);
      await rlPage.openQueueWithRequests([cell]);
      await expect(rlPage.requestRow(cell)).toBeVisible({ timeout: 15000 });

      await rlPage.rejectRequest(cell);
      await expect(rlPage.rejectedToast.or(rlPage.successRecordsHeader)).toBeVisible({ timeout: 15000 });
      await page.keyboard.press('Escape');
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin);

      await rlPage.gotoWaitingForApproval();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => rlPage.readTabCount(rlPage.rejectedTab)).toBe(before.rejected + 1);
      await expect.poll(() => rlPage.readTabCount(rlPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => rlPage.readTabCount(rlPage.processedTab)).toBe(before.processed);
      await rlPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });

    test('bulk rejects two Remote Login requests from For You', async ({ page }) => {
      test.setTimeout(180000);
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      const before = await rlPage.readRemoteLoginTabCounts();

      await rlPage.openPendingRemoteLoginApprovals();
      const pendingBefore = await rlPage.readPendingCounts();
      const queueBefore = pendingBefore.forYou + pendingBefore.forYourRole;

      await rlPage.gotoWaitingForApproval();
      const dates = await rlPage.requestAvailableRemoteLoginDates(2);
      const cells = dates.map((date) => date.cell);
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 2);

      await rlPage.openPendingRemoteLoginApprovals();
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore + 2);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin + 2);
      await rlPage.openQueueWithRequests(cells);
      await rlPage.selectRequests(cells);
      await expect(rlPage.approveButton.or(rlPage.processButton)).toBeVisible();
      await expect(rlPage.bulkRejectButton).toBeVisible();
      await rlPage.rejectSelected();
      await expect(rlPage.successRecordsHeader.or(rlPage.rejectedToast)).toBeVisible({ timeout: 15000 });
      await page.keyboard.press('Escape');
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin);

      await rlPage.gotoWaitingForApproval();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => rlPage.readTabCount(rlPage.rejectedTab)).toBe(before.rejected + 2);
      await rlPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });

    test('bulk processes first half and second half Remote Login from pending', async ({ page }) => {
      test.setTimeout(180000);
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      const before = await rlPage.readRemoteLoginTabCounts();

      await rlPage.openPendingRemoteLoginApprovals();
      const pendingBefore = await rlPage.readPendingCounts();
      const queueBefore = pendingBefore.forYou + pendingBefore.forYourRole;

      await rlPage.gotoWaitingForApproval();
      const date = await rlPage.requestAvailableRemoteLogin();
      await rlPage.requestRemoteLogin(date.input, `Request Remote Login second half ${date.input}`, 'second');
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 2);
      await rlPage.waitingForApprovalTab.click();
      await expect(rlPage.sessionRow(date.cell, 'First Half')).toBeVisible();
      await expect(rlPage.sessionRow(date.cell, 'Second Half')).toBeVisible();

      await rlPage.openPendingRemoteLoginApprovals();
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore + 2);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin + 2);
      await rlPage.completePendingToProcessed([date.cell]);
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin);

      await rlPage.gotoWaitingForApproval();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(async () => {
        const counts = await rlPage.readRemoteLoginTabCounts();
        return counts.approved + counts.processed;
      }).toBe(before.approved + before.processed + 2);
      await rlPage.processedTab.click();
      if (await rlPage.sessionRow(date.cell, 'First Half').isVisible().catch(() => false)) {
        await expect(rlPage.sessionRow(date.cell, 'First Half')).toBeVisible();
        await expect(rlPage.sessionRow(date.cell, 'Second Half')).toBeVisible();
      } else {
        await rlPage.approvedTab.click();
        await expect(rlPage.sessionRow(date.cell, 'First Half')).toBeVisible();
        await expect(rlPage.sessionRow(date.cell, 'Second Half')).toBeVisible();
      }
    });
  });

  test.describe('04. For Your Role - HR Process and Reject', () => {
    test('requests Remote Login and HR processes it from For Your Role', async ({ page }) => {
      test.setTimeout(180000);
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      const before = await rlPage.readRemoteLoginTabCounts();

      await rlPage.openPendingRemoteLoginApprovals();
      const pendingBefore = await rlPage.readPendingCounts();
      const queueBefore = pendingBefore.forYou + pendingBefore.forYourRole;

      await rlPage.gotoWaitingForApproval();
      const { cell } = await rlPage.requestAvailableRemoteLogin();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await expect.poll(() => rlPage.readTabCount(rlPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => rlPage.readTabCount(rlPage.processedTab)).toBe(before.processed);
      await expect.poll(() => rlPage.readTabCount(rlPage.rejectedTab)).toBe(before.rejected);
      await rlPage.waitingForApprovalTab.click();
      await expect(page.getByRole('cell', { name: cell })).toBeVisible();

      await rlPage.openPendingRemoteLoginApprovals();
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore + 1);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin + 1);
      await rlPage.completePendingToProcessed([cell]);
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin);

      await rlPage.gotoWaitingForApproval();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => rlPage.readTabCount(rlPage.processedTab)).toBe(before.processed + 1);
      await expect.poll(() => rlPage.readTabCount(rlPage.rejectedTab)).toBe(before.rejected);
      await rlPage.processedTab.click();
      await expect(rlPage.processedTab).toBeVisible();
    });

    test('bulk processes two Remote Login requests from For Your Role', async ({ page }) => {
      test.setTimeout(240000);
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      const before = await rlPage.readRemoteLoginTabCounts();

      await rlPage.openPendingRemoteLoginApprovals();
      const pendingBefore = await rlPage.readPendingCounts();
      const queueBefore = pendingBefore.forYou + pendingBefore.forYourRole;

      await rlPage.gotoWaitingForApproval();
      const dates = await rlPage.requestAvailableRemoteLoginDates(2);
      const cells = dates.map((date) => date.cell);
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 2);

      await rlPage.openPendingRemoteLoginApprovals();
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore + 2);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin + 2);
      await rlPage.completePendingToProcessed(cells);
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin);

      await rlPage.gotoWaitingForApproval();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => rlPage.readTabCount(rlPage.processedTab)).toBe(before.processed + 2);
      await rlPage.processedTab.click();
    });

    test('requests Remote Login and HR rejects it from For Your Role', async ({ page }) => {
      test.setTimeout(180000);
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      const before = await rlPage.readRemoteLoginTabCounts();

      await rlPage.openPendingRemoteLoginApprovals();
      const pendingBefore = await rlPage.readPendingCounts();
      const queueBefore = pendingBefore.forYou + pendingBefore.forYourRole;

      await rlPage.gotoWaitingForApproval();
      const { cell } = await rlPage.requestAvailableRemoteLogin();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 1);

      await rlPage.openPendingRemoteLoginApprovals();
      await rlPage.sendToHrQueue([cell]);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin + 1);
      await rlPage.requestRow(cell).getByRole('checkbox').check();
      await expect(rlPage.processButton.or(rlPage.approveButton)).toBeVisible();
      await expect(rlPage.bulkRejectButton).toBeVisible();

      await rlPage.rejectSelected();
      await expect(rlPage.successRecordsHeader.or(rlPage.rejectedToast)).toBeVisible({ timeout: 15000 });
      await page.keyboard.press('Escape');
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin);

      await rlPage.gotoWaitingForApproval();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => rlPage.readTabCount(rlPage.rejectedTab)).toBe(before.rejected + 1);
      await expect.poll(() => rlPage.readTabCount(rlPage.processedTab)).toBe(before.processed);
      await rlPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });

    test('bulk rejects two Remote Login requests from For Your Role', async ({ page }) => {
      test.setTimeout(240000);
      const rlPage = new RemoteLoginPage(page);
      await rlPage.openFromDashboard();
      await expect(rlPage.waitingForApprovalTab).toBeVisible({ timeout: 30000 });
      const before = await rlPage.readRemoteLoginTabCounts();

      await rlPage.openPendingRemoteLoginApprovals();
      const pendingBefore = await rlPage.readPendingCounts();
      const queueBefore = pendingBefore.forYou + pendingBefore.forYourRole;

      await rlPage.gotoWaitingForApproval();
      const dates = await rlPage.requestAvailableRemoteLoginDates(2);
      const cells = dates.map((date) => date.cell);
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting + 2);

      await rlPage.openPendingRemoteLoginApprovals();
      await rlPage.sendToHrQueue(cells);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin + 2);
      await rlPage.selectRequests(cells);
      await expect(rlPage.processButton.or(rlPage.approveButton)).toBeVisible();
      await expect(rlPage.bulkRejectButton).toBeVisible();
      await rlPage.rejectSelected();
      await expect(rlPage.successRecordsHeader.or(rlPage.rejectedToast)).toBeVisible({ timeout: 15000 });
      await page.keyboard.press('Escape');
      await expect.poll(async () => rlPage.pendingQueueTotal(), { timeout: 15000 }).toBe(queueBefore);
      await expect.poll(async () => (await rlPage.readPendingCounts()).remoteLogin, { timeout: 15000 }).toBe(pendingBefore.remoteLogin);

      await rlPage.gotoWaitingForApproval();
      await expect.poll(() => rlPage.readTabCount(rlPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => rlPage.readTabCount(rlPage.rejectedTab)).toBe(before.rejected + 2);
      await rlPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });
  });

  test.describe('05. Column sorting', () => {
    for (const tabName of REMOTE_LOGIN_SORT_TABS) {
      test(`sorts sortable columns on the ${tabName} tab`, async ({ page }) => {
        test.setTimeout(180000);
        const rlPage = new RemoteLoginPage(page);
        await rlPage.openFromDashboard();
        const tab = rlPage.remoteLoginStatusTabs().find((entry) => entry.name === tabName);
        expect(tab, tabName).toBeTruthy();
        await tab!.tab.click();
        await expect(tab!.tab).toBeVisible();
        await page.locator('table thead th.p-datatable-sortable-column').first().waitFor({ state: 'visible' });
        await rlPage.assertSortableColumnsCycle(tabName);
      });
    }
  });
});
