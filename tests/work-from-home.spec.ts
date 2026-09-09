import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { JobInfoWfhPage } from '../pages/JobInfoWfhPage';
import { WorkFromHomePage, workedDateToInput, upcomingWeekendDate, weekdayDate, octoberSearchRange } from '../pages/WorkFromHomePage';

const EMPLOYEE_NAME = 'saii Pavan Dinesh Tejaa';
const EMPLOYEE_SEARCH = 'saii';
const WFH_MANAGER = 'SD302262 - saii Pavan Dinesh';

const WFH_SORT_TABS = [
  'Waiting For Approval',
  'Approved',
  'Processed',
  'Rejected',
  'Cancelled',
] as const;

test.describe('Work from Home', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  test.describe.serial('01. Open module and Job Info allocation', () => {
    test('activates WFH on Job Info and shows the WFH tab after user validation', async ({ page }) => {
      test.setTimeout(180000);
      const jobWfh = new JobInfoWfhPage(page);
      await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);

      await jobWfh.ensureWfhActiveForToday(WFH_MANAGER);
      await expect(jobWfh.wfhActiveRow).toBeVisible();
      await expect(jobWfh.remoteLoginActiveRow).toHaveCount(0);

      const loginPage = new LoginPage(page);
      await loginPage.validateUserSession();
      const tabs = await jobWfh.peekTimeOffTabs();
      await expect(tabs.wfh).toBeVisible();
      await expect(tabs.remoteLogin).toHaveCount(0);
      await tabs.wfh.click();
      await expect(page).toHaveURL(/\/time-off\/wfh/i);
      const wfhPage = new WorkFromHomePage(page);
      await expect(wfhPage.requestWfhButton).toBeVisible();
    });

    test('opens the WFH module from the dashboard', async ({ page }) => {
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();

      await expect(page).toHaveURL(/\/time-off\/wfh/i);
      await expect(wfhPage.requestWfhButton).toBeVisible();
      await expect(wfhPage.waitingForApprovalTab).toBeVisible();
      await expect(wfhPage.approvedTab).toBeVisible();
      await expect(wfhPage.processedTab).toBeVisible();
      await expect(wfhPage.rejectedTab).toBeVisible();
      await expect(wfhPage.cancelledTab).toBeVisible();
      const counts = await wfhPage.readWfhTabCounts();
      expect(counts.waiting).toBeGreaterThanOrEqual(0);
      expect(counts.approved).toBeGreaterThanOrEqual(0);
      expect(counts.processed).toBeGreaterThanOrEqual(0);
      expect(counts.rejected).toBeGreaterThanOrEqual(0);
      expect(counts.cancelled).toBeGreaterThanOrEqual(0);
    });

    test('allocates WFH / Remote Login on Job Info', async ({ page }) => {
      const jobWfh = new JobInfoWfhPage(page);
      await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);

      if (!(await jobWfh.wfhActiveRow.isVisible().catch(() => false))) {
        await jobWfh.allocateWfh(jobWfh.todayEffectiveFrom(), WFH_MANAGER);
      }

      await expect(jobWfh.effectiveFromHeader).toBeVisible();
      await expect(jobWfh.allocationTypeHeader).toBeVisible();
      await expect(jobWfh.allocatedLocationHeader).toBeVisible();
      await expect(jobWfh.allocatedManagerHeader).toBeVisible();
      await expect(jobWfh.statusHeader).toBeVisible();
      await expect(jobWfh.wfhActiveRow).toBeVisible();
      await expect(jobWfh.remoteLoginInactiveRow.first()).toBeVisible();

      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.validateUserOnDashboard();
      await wfhPage.openTimeOffMenu();
      await expect(wfhPage.timeOffWfhTab).toBeVisible();
      await expect(wfhPage.timeOffRemoteLoginTab).toHaveCount(0);
      await wfhPage.timeOffWfhTab.click();
      await expect(page).toHaveURL(/\/time-off\/wfh/i);
      await expect(wfhPage.requestWfhButton).toBeVisible();
    });
  });

  test.describe('02. Validation', () => {
    test('shows error when a WFH allocation already exists for the effective date', async ({ page }) => {
      const jobWfh = new JobInfoWfhPage(page);
      await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);

      const existingDate = await jobWfh.firstExistingEffectiveFrom();
      test.skip(!existingDate, 'No existing allocation date to reuse for duplicate validation');

      await jobWfh.submitAllocateKeepingDialog(existingDate!, WFH_MANAGER);
      await expect(jobWfh.duplicateEffectiveDateMessage).toBeVisible({ timeout: 15000 });
      await jobWfh.cancelButton.click();
    });

    test('shows validation when a WFH request already exists for the date', async ({ page }) => {
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();

      const existingDate = await wfhPage.firstWaitingWorkedDate();
      test.skip(!existingDate, 'No existing WFH request to reuse for duplicate validation');
      const input = workedDateToInput(existingDate!);
      test.skip(!input, `Could not parse existing WFH date: ${existingDate}`);

      await wfhPage.fillWfhRequest(input!, input!, `Duplicate WFH ${input}`);
      await expect(wfhPage.duplicateRequestMessage).toBeVisible({ timeout: 15000 });
      await wfhPage.cancelRequestButton.click();
    });

    test('blocks WFH requests on Saturday and Sunday shift weekends', async ({ page }) => {
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();
      const weekends = [
        { name: 'Saturday', date: upcomingWeekendDate(6) },
        { name: 'Sunday', date: upcomingWeekendDate(0) },
      ];

      for (const weekend of weekends) {
        const dialog = await wfhPage.fillRequestForm(weekend.date.input, `Weekend WFH ${weekend.name}`);
        expect(
          await wfhPage.waitForRequestSubmitEnabled(2000),
          `${weekend.name} ${weekend.date.input} should not be submittable`,
        ).toBe(false);
        await expect(dialog).toBeVisible();
        await wfhPage.closeRequestDialogIfOpen();
        await expect(wfhPage.requestWfhButton).toBeVisible();
      }

      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.processedTab)).toBe(before.processed);
    });

    test('shows validation when WFH end date is before start date', async ({ page }) => {
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();
      const { startAhead } = octoberSearchRange();
      const start = weekdayDate(startAhead + 14);
      const end = weekdayDate(startAhead + 5);
      expect(end.input < start.input, `end ${end.input} should be before start ${start.input}`).toBe(true);

      const dialog = await wfhPage.fillRequestFormRange(start.input, end.input, `End before start ${start.input}`);
      await wfhPage.requestButton.click({ force: true });
      await expect(wfhPage.invalidDateRangeMessage).toBeVisible({ timeout: 15000 });
      await expect(dialog).toBeVisible();
      await wfhPage.closeRequestDialogIfOpen();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting);
    });

    test('submits second half WFH when first half already exists for the date', async ({ page }) => {
      test.setTimeout(180000);
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();

      const date = await wfhPage.requestAvailableWfh();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await wfhPage.waitingForApprovalTab.click();
      await expect(wfhPage.sessionRow(date.cell, 'First Half')).toBeVisible();

      await wfhPage.requestWfh(date.input, date.input, `Request WFH second half ${date.input}`, 'second');
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 2);
      await wfhPage.waitingForApprovalTab.click();
      await expect(wfhPage.sessionRow(date.cell, 'First Half')).toBeVisible();
      await expect(wfhPage.sessionRow(date.cell, 'Second Half')).toBeVisible();
    });

    test('shows error when full day WFH is requested on a day that already has first half', async ({ page }) => {
      test.setTimeout(180000);
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();

      const date = await wfhPage.requestAvailableWfh();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await wfhPage.waitingForApprovalTab.click();
      await expect(wfhPage.sessionRow(date.cell, 'First Half')).toBeVisible();

      const dialog = await wfhPage.fillRequestForm(date.input, `Full day after first half ${date.input}`, 'full');
      await wfhPage.requestButton.click({ force: true });
      await expect(wfhPage.sessionConflictMessage).toBeVisible({ timeout: 15000 });
      await expect(dialog).toBeVisible();
      await wfhPage.closeRequestDialogIfOpen();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await wfhPage.waitingForApprovalTab.click();
      await expect(wfhPage.sessionRow(date.cell, 'First Half')).toBeVisible();
      await expect(wfhPage.sessionRow(date.cell, 'Full Day')).toHaveCount(0);
    });

    test('Cancel on Request WFH asks for confirmation, No keeps the form, Yes closes it', async ({ page }) => {
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();

      await wfhPage.openFilledRequestForm();
      await expect(wfhPage.requestButton).toBeVisible();

      await wfhPage.clickRequestFormCancel();
      await expect(wfhPage.cancelConfirmMessage).toBeVisible();
      await expect(wfhPage.cancelConfirmNo).toBeVisible();
      await expect(wfhPage.cancelConfirmYes).toBeVisible();

      await wfhPage.cancelConfirmNo.click();
      await expect(wfhPage.cancelConfirmMessage).toBeHidden();
      await expect(wfhPage.requestButton).toBeVisible();
      await expect(wfhPage.startDateInput).toBeVisible();
      await expect(wfhPage.reasonInput).toBeVisible();

      await wfhPage.clickRequestFormCancel();
      await expect(wfhPage.cancelConfirmMessage).toBeVisible();
      await wfhPage.cancelConfirmYes.click();
      await expect(page.getByRole('dialog')).toBeHidden({ timeout: 15000 });
      await expect(wfhPage.requestWfhButton).toBeVisible();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting);
    });
  });

  test.describe('03. For You - WFH Manager and Team Manager', () => {
    test('requests WFH and rejects it from For You', async ({ page }) => {
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();

      await wfhPage.openPendingWfhApprovals();
      const pendingBefore = await wfhPage.readPendingCounts();

      await wfhPage.gotoWaitingForApproval();
      const { cell } = await wfhPage.requestAvailableWfh();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.processedTab)).toBe(before.processed);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.rejectedTab)).toBe(before.rejected);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.cancelledTab)).toBe(before.cancelled);
      await wfhPage.waitingForApprovalTab.click();
      await expect(page.getByRole('cell', { name: cell })).toBeVisible();

      await wfhPage.openPendingWfhApprovals();
      await wfhPage.openForYouTab();
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou + 1);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh + 1);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole);
      await expect(wfhPage.requestRow(cell)).toBeVisible({ timeout: 15000 });

      await wfhPage.rejectRequest(cell);
      await expect(wfhPage.rejectedToast).toBeVisible({ timeout: 15000 });
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole);

      await wfhPage.gotoWaitingForApproval();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.rejectedTab)).toBe(before.rejected + 1);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.processedTab)).toBe(before.processed);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.cancelledTab)).toBe(before.cancelled);
      await wfhPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });

    test('bulk rejects two WFH requests from For You', async ({ page }) => {
      test.setTimeout(180000);
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();

      await wfhPage.openPendingWfhApprovals();
      const pendingBefore = await wfhPage.readPendingCounts();

      await wfhPage.gotoWaitingForApproval();
      const dates = await wfhPage.requestAvailableWfhDates(2);
      const cells = dates.map((date) => date.cell);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 2);

      await wfhPage.openPendingWfhApprovals();
      await wfhPage.openForYouTab();
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou + 2);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh + 2);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole);
      await wfhPage.selectRequests(cells);
      await expect(wfhPage.approveButton).toBeVisible();
      await expect(wfhPage.bulkRejectButton).toBeVisible();
      await wfhPage.rejectSelected();
      await expect(wfhPage.successRecordsHeader.or(wfhPage.rejectedToast)).toBeVisible({ timeout: 15000 });
      await page.keyboard.press('Escape');
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh);

      await wfhPage.gotoWaitingForApproval();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.rejectedTab)).toBe(before.rejected + 2);
      await wfhPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });

    test('bulk approves first half and second half WFH from For You', async ({ page }) => {
      test.setTimeout(180000);
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();

      await wfhPage.openPendingWfhApprovals();
      const pendingBefore = await wfhPage.readPendingCounts();

      await wfhPage.gotoWaitingForApproval();
      const date = await wfhPage.requestAvailableWfh();
      await wfhPage.requestWfh(date.input, date.input, `Request WFH second half ${date.input}`, 'second');
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 2);
      await wfhPage.waitingForApprovalTab.click();
      await expect(wfhPage.sessionRow(date.cell, 'First Half')).toBeVisible();
      await expect(wfhPage.sessionRow(date.cell, 'Second Half')).toBeVisible();

      await wfhPage.openPendingWfhApprovals();
      await wfhPage.openForYouTab();
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou + 2);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh + 2);
      await expect(wfhPage.requestRow(date.cell)).toHaveCount(2, { timeout: 15000 });
      await wfhPage.selectRequests([date.cell]);
      await expect(wfhPage.approveButton).toBeVisible();
      await expect(wfhPage.bulkRejectButton).toBeVisible();
      await wfhPage.approveSelected();
      await wfhPage.closeSuccessDialog();
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole + 2);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh + 2);

      await wfhPage.gotoWaitingForApproval();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.approvedTab)).toBe(before.approved + 2);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.processedTab)).toBe(before.processed);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.rejectedTab)).toBe(before.rejected);
      await wfhPage.approvedTab.click();
      await expect(wfhPage.sessionRow(date.cell, 'First Half')).toBeVisible();
      await expect(wfhPage.sessionRow(date.cell, 'Second Half')).toBeVisible();
    });
  });

  test.describe('04. For Your Role - HR Process and Reject', () => {
    test('requests WFH and HR processes it from For Your Role', async ({ page }) => {
      test.setTimeout(180000);
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();

      await wfhPage.openPendingWfhApprovals();
      const pendingBefore = await wfhPage.readPendingCounts();

      await wfhPage.gotoWaitingForApproval();
      const { cell } = await wfhPage.requestAvailableWfh();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.processedTab)).toBe(before.processed);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.rejectedTab)).toBe(before.rejected);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.cancelledTab)).toBe(before.cancelled);
      await wfhPage.waitingForApprovalTab.click();
      await expect(page.getByRole('cell', { name: cell })).toBeVisible();

      await wfhPage.openPendingWfhApprovals();
      await wfhPage.openForYouTab();
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou + 1);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh + 1);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole);
      await expect(wfhPage.requestRow(cell)).toBeVisible({ timeout: 15000 });

      await wfhPage.approveAtCurrentQueue([cell]);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole + 1);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh + 1);
      await wfhPage.openForYourRoleTab();
      await expect(wfhPage.requestRow(cell)).toBeVisible({ timeout: 15000 });
      await wfhPage.requestRow(cell).getByRole('checkbox').check();
      await expect(wfhPage.processButton).toBeVisible();
      await expect(wfhPage.bulkRejectButton).toBeVisible();
      await expect(wfhPage.approveButton).toHaveCount(0);

      await wfhPage.processSelected();
      await wfhPage.closeSuccessDialog();
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh);

      await wfhPage.gotoWaitingForApproval();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.processedTab)).toBe(before.processed + 1);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.rejectedTab)).toBe(before.rejected);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.cancelledTab)).toBe(before.cancelled);
      await wfhPage.processedTab.click();
      await expect(wfhPage.processedTab).toBeVisible();
    });

    test('bulk processes two WFH requests from For Your Role', async ({ page }) => {
      test.setTimeout(240000);
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();

      await wfhPage.openPendingWfhApprovals();
      const pendingBefore = await wfhPage.readPendingCounts();

      await wfhPage.gotoWaitingForApproval();
      const dates = await wfhPage.requestAvailableWfhDates(2);
      const cells = dates.map((date) => date.cell);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 2);

      await wfhPage.openPendingWfhApprovals();
      await wfhPage.openForYouTab();
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou + 2);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh + 2);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole);
      await wfhPage.waitForRequestRows(cells);
      await wfhPage.selectRequests(cells);
      await expect(wfhPage.approveButton).toBeVisible();
      await expect(wfhPage.bulkRejectButton).toBeVisible();
      await wfhPage.approveSelected();
      await wfhPage.closeSuccessDialog();
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole + 2);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh + 2);
      await wfhPage.openForYourRoleTab();
      await wfhPage.waitForRequestRows(cells);
      await wfhPage.selectRequests(cells);
      await expect(wfhPage.processButton).toBeVisible();
      await expect(wfhPage.bulkRejectButton).toBeVisible();
      await expect(wfhPage.approveButton).toHaveCount(0);
      await wfhPage.processSelected();
      await wfhPage.closeSuccessDialog();
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh);

      await wfhPage.gotoWaitingForApproval();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.processedTab)).toBe(before.processed + 2);
      await wfhPage.processedTab.click();
    });

    test('requests WFH and HR rejects it from For Your Role', async ({ page }) => {
      test.setTimeout(180000);
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();

      await wfhPage.openPendingWfhApprovals();
      const pendingBefore = await wfhPage.readPendingCounts();

      await wfhPage.gotoWaitingForApproval();
      const { cell } = await wfhPage.requestAvailableWfh();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 1);

      await wfhPage.openPendingWfhApprovals();
      await wfhPage.sendToHrQueue([cell]);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole + 1);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh + 1);
      await wfhPage.requestRow(cell).getByRole('checkbox').check();
      await expect(wfhPage.processButton).toBeVisible();
      await expect(wfhPage.bulkRejectButton).toBeVisible();
      await expect(wfhPage.approveButton).toHaveCount(0);

      await wfhPage.rejectSelected();
      await expect(wfhPage.successRecordsHeader.or(wfhPage.rejectedToast)).toBeVisible({ timeout: 15000 });
      await page.keyboard.press('Escape');
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(pendingBefore.forYou);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh);

      await wfhPage.gotoWaitingForApproval();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.rejectedTab)).toBe(before.rejected + 1);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.processedTab)).toBe(before.processed);
      await wfhPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });

    test('bulk rejects two WFH requests from For Your Role', async ({ page }) => {
      test.setTimeout(240000);
      const wfhPage = new WorkFromHomePage(page);
      await wfhPage.openFromDashboard();
      const before = await wfhPage.readWfhTabCounts();

      await wfhPage.openPendingWfhApprovals();
      const pendingBefore = await wfhPage.readPendingCounts();

      await wfhPage.gotoWaitingForApproval();
      const dates = await wfhPage.requestAvailableWfhDates(2);
      const cells = dates.map((date) => date.cell);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting + 2);

      await wfhPage.openPendingWfhApprovals();
      await wfhPage.sendToHrQueue(cells);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole + 2);
      await wfhPage.selectRequests(cells);
      await expect(wfhPage.processButton).toBeVisible();
      await expect(wfhPage.bulkRejectButton).toBeVisible();
      await expect(wfhPage.approveButton).toHaveCount(0);
      await wfhPage.rejectSelected();
      await expect(wfhPage.successRecordsHeader.or(wfhPage.rejectedToast)).toBeVisible({ timeout: 15000 });
      await page.keyboard.press('Escape');
      await expect.poll(async () => (await wfhPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(pendingBefore.forYourRole);
      await expect.poll(async () => (await wfhPage.readPendingCounts()).wfh, { timeout: 15000 }).toBe(pendingBefore.wfh);

      await wfhPage.gotoWaitingForApproval();
      await expect.poll(() => wfhPage.readTabCount(wfhPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => wfhPage.readTabCount(wfhPage.rejectedTab)).toBe(before.rejected + 2);
      await wfhPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });
  });

  test.describe('05. Column sorting', () => {
    for (const tabName of WFH_SORT_TABS) {
      test(`sorts sortable columns on the ${tabName} tab`, async ({ page }) => {
        test.setTimeout(180000);
        const wfhPage = new WorkFromHomePage(page);
        await wfhPage.openFromDashboard();
        const tab = wfhPage.wfhStatusTabs().find((entry) => entry.name === tabName);
        expect(tab, tabName).toBeTruthy();
        await tab!.tab.click();
        await expect(tab!.tab).toBeVisible();
        await page.locator('table thead th.p-datatable-sortable-column').first().waitFor({ state: 'visible' });
        await wfhPage.assertSortableColumnsCycle(tabName);
      });
    }
  });
});
