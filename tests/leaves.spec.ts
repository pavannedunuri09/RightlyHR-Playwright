/**
 * Prerequisites: run `npm run test:leave-category` then `npm run test:leave-allocation`
 * then `npm run test:load-entitlements` first.
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DEFAULT_ALLOCATION_DAYS } from '../pages/LeaveAllocationPage';
import { GENERAL_LEAVE_CATEGORY, SICK_LEAVE_CATEGORY } from '../pages/LeaveCategoryPage';
import {
  LeavesPage,
  leaveDateFromOffset,
  MAX_LEAVE_FUTURE_DAYS,
  MAX_LEAVE_PAST_DAYS,
  weekendDateFromOffset,
} from '../pages/LeavesPage';
import { daysFromToday, workedDateToInput } from '../pages/WorkFromHomePage';

const DEFAULT_CATEGORY = GENERAL_LEAVE_CATEGORY.categoryName;

test.describe('Leaves', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    await new LoginPage(page).loginFromEnv();
  });

  test.describe('01. Open module and entitlements', () => {
    test('opens the Leaves module from the dashboard', async ({ page }) => {
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();

      await expect(page).toHaveURL(/\/time-off\/leaves/i);
      await expect(leavesPage.requestLeaveButton).toBeVisible();
      await expect(leavesPage.waitingForApprovalTab).toBeVisible({ timeout: 15000 });
      await expect(leavesPage.approvedTab).toBeVisible({ timeout: 15000 });
      await expect(leavesPage.processedTab).toBeVisible({ timeout: 15000 });
      await expect(leavesPage.rejectedTab).toBeVisible({ timeout: 15000 });
      await expect(leavesPage.cancelledTab).toBeVisible({ timeout: 15000 });

      const counts = await leavesPage.readLeavesTabCounts();
      expect(counts.waiting).toBeGreaterThanOrEqual(0);
      expect(counts.approved).toBeGreaterThanOrEqual(0);
      expect(counts.processed).toBeGreaterThanOrEqual(0);
      expect(counts.rejected).toBeGreaterThanOrEqual(0);
      expect(counts.cancelled).toBeGreaterThanOrEqual(0);
    });

    test('displays entitled General Leave and Sick Leave balances', async ({ page }) => {
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();

      await leavesPage.waitForEntitlementCards([
        GENERAL_LEAVE_CATEGORY.categoryName,
        SICK_LEAVE_CATEGORY.categoryName,
      ]);

      const entitledBalance = `${DEFAULT_ALLOCATION_DAYS}/${DEFAULT_ALLOCATION_DAYS}`;

      await leavesPage.expectEntitledLeave(GENERAL_LEAVE_CATEGORY.categoryName, {
        entitledBalance,
        frequency: GENERAL_LEAVE_CATEGORY.frequencyType,
      });
      await leavesPage.expectEntitledLeave(SICK_LEAVE_CATEGORY.categoryName, {
        entitledBalance,
        frequency: SICK_LEAVE_CATEGORY.frequencyType,
      });
    });
  });

  test.describe('02. Validation', () => {
    test('keeps Submit disabled until all required fields are filled', async ({ page }) => {
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const date = leaveDateFromOffset(14);

      await leavesPage.openRequestLeaveDialog();
      expect(await leavesPage.waitForSubmitEnabled(1500)).toBe(false);

      await leavesPage.selectLeaveCategory(DEFAULT_CATEGORY);
      expect(await leavesPage.waitForSubmitEnabled(1500)).toBe(false);

      await leavesPage.fillStartDate(date.input);
      expect(await leavesPage.waitForSubmitEnabled(1500)).toBe(false);

      await leavesPage.fillEndDate(date.input);
      expect(await leavesPage.waitForSubmitEnabled(1500)).toBe(false);

      await leavesPage.halfDayRadio.check();
      expect(await leavesPage.waitForSubmitEnabled(1500)).toBe(false);

      await leavesPage.reasonInput.fill(`Validation submit enabled ${date.input}`);
      expect(await leavesPage.waitForSubmitEnabled(5000)).toBe(true);

      await leavesPage.closeRequestDialogIfOpen();
    });

    test('shows validation when a leave request already exists for the date', async ({ page }) => {
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();

      const existingDate = await leavesPage.firstWaitingLeaveDate();
      test.skip(!existingDate, 'No existing leave request to reuse for duplicate validation');
      const input = workedDateToInput(existingDate!);
      test.skip(!input, `Could not parse existing leave date: ${existingDate}`);

      const dialog = await leavesPage.fillRequestForm(input!, `Duplicate leave ${input}`, DEFAULT_CATEGORY);
      await leavesPage.submitButton.click({ force: true });
      await expect(leavesPage.duplicateRequestMessage).toBeVisible({ timeout: 15000 });
      await expect(dialog).toBeVisible();
      await leavesPage.closeRequestDialogIfOpen();
    });

    test('blocks leave requests on Saturday and Sunday shift weekends', async ({ page }) => {
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();
      const weekends = [
        { name: 'Saturday', date: weekendDateFromOffset(1, 6) },
        { name: 'Sunday', date: weekendDateFromOffset(1, 0) },
      ];

      for (const weekend of weekends) {
        test.skip(!weekend.date, `No ${weekend.name} found within ±${MAX_LEAVE_FUTURE_DAYS} days`);
        const dialog = await leavesPage.fillRequestForm(
          weekend.date!.input,
          `Weekend leave ${weekend.name}`,
          DEFAULT_CATEGORY,
        );
        expect(
          await leavesPage.waitForSubmitEnabled(2000),
          `${weekend.name} ${weekend.date!.input} should not be submittable`,
        ).toBe(false);
        await expect(dialog).toBeVisible();
        await leavesPage.closeRequestDialogIfOpen();
        await expect(leavesPage.requestLeaveButton).toBeVisible();
      }

      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.processedTab)).toBe(before.processed);
    });

    test('shows validation when leave end date is before start date', async ({ page }) => {
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();
      const start = leaveDateFromOffset(20);
      const end = leaveDateFromOffset(5);
      expect(end.input < start.input, `end ${end.input} should be before start ${start.input}`).toBe(true);

      const dialog = await leavesPage.fillRequestFormRange(
        start.input,
        end.input,
        `End before start ${start.input}`,
        DEFAULT_CATEGORY,
      );
      await leavesPage.submitButton.click({ force: true });
      await expect(leavesPage.invalidDateRangeMessage).toBeVisible({ timeout: 15000 });
      await expect(dialog).toBeVisible();
      await leavesPage.closeRequestDialogIfOpen();
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting);
    });

    test('submits leave for a date at the 100-day past boundary', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();
      const { cell, input } = await leavesPage.requestLeaveNearBoundary('past', DEFAULT_CATEGORY);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await leavesPage.waitingForApprovalTab.click();
      await expect(leavesPage.leaveDateCell(cell)).toBeVisible();
      expect(Math.abs(daysFromToday(input))).toBeLessThanOrEqual(MAX_LEAVE_PAST_DAYS);
    });

    test('submits leave for a date at the 100-day future boundary', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();
      const { input } = await leavesPage.requestLeaveNearBoundary('future', DEFAULT_CATEGORY);
      expect(Math.abs(daysFromToday(input))).toBeLessThanOrEqual(MAX_LEAVE_FUTURE_DAYS);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);
    });

    test('submits a past-date leave within the 100-day window', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      const { cell } = await leavesPage.requestAvailablePastLeave(DEFAULT_CATEGORY);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await leavesPage.waitingForApprovalTab.click();
      await expect(leavesPage.leaveDateCell(cell)).toBeVisible();
    });

    test('submits a future-date leave within the 100-day window', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      const { cell } = await leavesPage.requestAvailableFutureLeave(DEFAULT_CATEGORY);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await leavesPage.waitingForApprovalTab.click();
      await expect(leavesPage.leaveDateCell(cell)).toBeVisible();
    });

    test('shows error when full day leave is requested on a day that already has first half', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      const date = await leavesPage.requestAvailableLeave(DEFAULT_CATEGORY, true, 'first');
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await leavesPage.waitingForApprovalTab.click();
      await expect(leavesPage.leaveRow(date.cell, 'First Half')).toBeVisible();

      const dialog = await leavesPage.fillRequestForm(
        date.input,
        `Full day after first half ${date.input}`,
        DEFAULT_CATEGORY,
        'full',
      );
      await leavesPage.submitButton.click({ force: true });
      await expect(leavesPage.sessionConflictMessage).toBeVisible({ timeout: 15000 });
      await expect(dialog).toBeVisible();
      await leavesPage.closeRequestDialogIfOpen();
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);
    });

    test('submits second half leave when first half already exists for the date', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      const date = await leavesPage.requestAvailableLeave(DEFAULT_CATEGORY, true, 'first');
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await leavesPage.waitingForApprovalTab.click();
      await expect(leavesPage.leaveRow(date.cell, 'First Half')).toBeVisible();

      await leavesPage.requestLeave(
        date.input,
        date.input,
        `Request leave second half ${date.input}`,
        date.categoryName,
        'second',
      );
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 2);
      await leavesPage.waitingForApprovalTab.click();
      await expect(leavesPage.leaveRow(date.cell, 'First Half')).toBeVisible();
      await expect(leavesPage.leaveRow(date.cell, 'Second Half')).toBeVisible();
    });

    test('Cancel on Request Leave asks for confirmation, No keeps the form, Yes closes it', async ({ page }) => {
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      await leavesPage.openFilledRequestForm(DEFAULT_CATEGORY);
      await expect(leavesPage.submitButton).toBeVisible();

      await leavesPage.clickRequestFormCancel();
      await expect(leavesPage.cancelConfirmMessage).toBeVisible();
      await expect(leavesPage.cancelConfirmNo).toBeVisible();
      await expect(leavesPage.cancelConfirmYes).toBeVisible();

      await leavesPage.cancelConfirmNo.click();
      await expect(leavesPage.cancelConfirmMessage).toBeHidden();
      await expect(leavesPage.submitButton).toBeVisible();
      await expect(leavesPage.requestDialog().getByText(/Start Date\s*\*/i)).toBeVisible();
      await expect(leavesPage.reasonInput).toBeVisible();

      await leavesPage.clickRequestFormCancel();
      await expect(leavesPage.cancelConfirmMessage).toBeVisible();
      await leavesPage.cancelConfirmYes.click();
      await expect(page.getByRole('dialog')).toBeHidden({ timeout: 15000 });
      await expect(leavesPage.requestLeaveButton).toBeVisible();
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting);
    });
  });

  test.describe('03. For You - RM/TM', () => {
    test('requests leave and rejects it from For You', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      await leavesPage.openPendingLeavesApprovals();
      const pendingBefore = await leavesPage.readPendingCounts();

      await leavesPage.gotoWaitingForApproval();
      const { cell } = await leavesPage.requestAvailableLeave(DEFAULT_CATEGORY);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.approvedTab)).toBe(before.approved);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.processedTab)).toBe(before.processed);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.rejectedTab)).toBe(before.rejected);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.cancelledTab)).toBe(before.cancelled);
      await leavesPage.waitingForApprovalTab.click();
      await expect(leavesPage.leaveDateCell(cell)).toBeVisible();

      await leavesPage.openPendingLeavesApprovals();
      await leavesPage.openForYouTab();
      await expect.poll(async () => (await leavesPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(
        pendingBefore.forYou + 1,
      );
      await expect.poll(async () => (await leavesPage.readPendingCounts()).leaves, { timeout: 15000 }).toBe(
        pendingBefore.leaves + 1,
      );
      await expect.poll(async () => (await leavesPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(
        pendingBefore.forYourRole,
      );
      await expect(leavesPage.requestRow(cell)).toBeVisible({ timeout: 15000 });

      await leavesPage.rejectRequest(cell);
      await expect.poll(async () => (await leavesPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(
        pendingBefore.forYou,
      );
      await expect.poll(async () => (await leavesPage.readPendingCounts()).leaves, { timeout: 15000 }).toBe(
        pendingBefore.leaves,
      );

      await leavesPage.gotoWaitingForApproval();
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.rejectedTab)).toBe(before.rejected + 1);
      await leavesPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });

    test('bulk rejects two leave requests from For You', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      await leavesPage.openPendingLeavesApprovals();
      const pendingBefore = await leavesPage.readPendingCounts();

      await leavesPage.gotoWaitingForApproval();
      const dates = await leavesPage.requestAvailableLeaveDates(2, DEFAULT_CATEGORY);
      const cells = dates.map((date) => date.cell);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 2);

      await leavesPage.openPendingLeavesApprovals();
      await leavesPage.openForYouTab();
      await expect.poll(async () => (await leavesPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(
        pendingBefore.forYou + 2,
      );
      await expect.poll(async () => (await leavesPage.readPendingCounts()).leaves, { timeout: 15000 }).toBe(
        pendingBefore.leaves + 2,
      );
      await leavesPage.selectRequests(cells);
      await expect(leavesPage.approveButton).toBeVisible();
      await expect(leavesPage.bulkRejectButton).toBeVisible();
      await leavesPage.rejectSelected();
      await expect(leavesPage.successRecordsHeader.or(leavesPage.rejectedToast)).toBeVisible({ timeout: 15000 });
      await page.keyboard.press('Escape');

      await leavesPage.gotoWaitingForApproval();
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.rejectedTab)).toBe(before.rejected + 2);
      await leavesPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });

    test('bulk approves first half and second half leave from For You', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      await leavesPage.openPendingLeavesApprovals();
      const pendingBefore = await leavesPage.readPendingCounts();

      await leavesPage.gotoWaitingForApproval();
      const date = await leavesPage.requestAvailableLeave(DEFAULT_CATEGORY, true, 'first');
      await leavesPage.requestLeave(
        date.input,
        date.input,
        `Request leave second half ${date.input}`,
        date.categoryName,
        'second',
      );
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 2);
      await leavesPage.waitingForApprovalTab.click();
      await expect(leavesPage.leaveRow(date.cell, 'First Half')).toBeVisible();
      await expect(leavesPage.leaveRow(date.cell, 'Second Half')).toBeVisible();

      await leavesPage.openPendingLeavesApprovals();
      await leavesPage.openForYouTab();
      await expect.poll(async () => (await leavesPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(
        pendingBefore.forYou + 2,
      );
      await expect.poll(async () => (await leavesPage.readPendingCounts()).leaves, { timeout: 15000 }).toBe(
        pendingBefore.leaves + 2,
      );
      await expect(leavesPage.requestRow(date.cell)).toHaveCount(2, { timeout: 15000 });
      await leavesPage.selectRequests([date.cell]);
      await leavesPage.approveSelected();
      await leavesPage.closeSuccessDialog();
      await expect.poll(async () => (await leavesPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(
        pendingBefore.forYou,
      );
      await expect.poll(async () => (await leavesPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(
        pendingBefore.forYourRole + 2,
      );

      await leavesPage.gotoWaitingForApproval();
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.approvedTab)).toBe(before.approved + 2);
      await leavesPage.approvedTab.click();
      await expect(leavesPage.leaveRow(date.cell, 'First Half')).toBeVisible();
      await expect(leavesPage.leaveRow(date.cell, 'Second Half')).toBeVisible();
    });
  });

  test.describe('04. For Your Role - HR Process and Reject', () => {
    test('requests leave and HR processes it from For Your Role', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      await leavesPage.openPendingLeavesApprovals();
      const pendingBefore = await leavesPage.readPendingCounts();

      await leavesPage.gotoWaitingForApproval();
      const { cell } = await leavesPage.requestAvailableLeave(DEFAULT_CATEGORY);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);

      await leavesPage.openPendingLeavesApprovals();
      await leavesPage.openForYouTab();
      await expect.poll(async () => (await leavesPage.readPendingCounts()).forYou, { timeout: 15000 }).toBe(
        pendingBefore.forYou + 1,
      );
      await expect(leavesPage.requestRow(cell)).toBeVisible({ timeout: 15000 });

      await leavesPage.approveAtCurrentQueue([cell]);
      await expect.poll(async () => (await leavesPage.readPendingCounts()).forYourRole, { timeout: 15000 }).toBe(
        pendingBefore.forYourRole + 1,
      );
      await leavesPage.openForYourRoleTab();
      await expect(leavesPage.requestRow(cell)).toBeVisible({ timeout: 15000 });
      await leavesPage.requestRow(cell).getByRole('checkbox').check();
      await expect(leavesPage.processButton).toBeVisible();
      await leavesPage.processSelected();
      await leavesPage.closeSuccessDialog();

      await leavesPage.gotoWaitingForApproval();
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.processedTab)).toBe(before.processed + 1);
      await leavesPage.processedTab.click();
      await expect(leavesPage.processedTab).toBeVisible();
    });

    test('bulk processes two leave requests from For Your Role', async ({ page }) => {
      test.setTimeout(240000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      await leavesPage.openPendingLeavesApprovals();
      const pendingBefore = await leavesPage.readPendingCounts();

      await leavesPage.gotoWaitingForApproval();
      const dates = await leavesPage.requestAvailableLeaveDates(2, DEFAULT_CATEGORY);
      const cells = dates.map((date) => date.cell);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 2);

      await leavesPage.openPendingLeavesApprovals();
      await leavesPage.sendToHrQueue(cells);
      await leavesPage.openForYourRoleTab();
      await leavesPage.selectRequests(cells);
      await leavesPage.processSelected();
      await leavesPage.closeSuccessDialog();

      await leavesPage.gotoWaitingForApproval();
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.processedTab)).toBe(before.processed + 2);
      await leavesPage.processedTab.click();
    });

    test('requests leave and HR rejects it from For Your Role', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      await leavesPage.openPendingLeavesApprovals();
      const pendingBefore = await leavesPage.readPendingCounts();

      await leavesPage.gotoWaitingForApproval();
      const { cell } = await leavesPage.requestAvailableLeave(DEFAULT_CATEGORY);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);

      await leavesPage.openPendingLeavesApprovals();
      await leavesPage.sendToHrQueue([cell]);
      await leavesPage.openForYourRoleTab();
      await leavesPage.requestRow(cell).getByRole('checkbox').check();
      await expect(leavesPage.processButton).toBeVisible();
      await leavesPage.rejectSelected();
      await expect(leavesPage.successRecordsHeader.or(leavesPage.rejectedToast)).toBeVisible({ timeout: 15000 });
      await page.keyboard.press('Escape');

      await leavesPage.gotoWaitingForApproval();
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.rejectedTab)).toBe(before.rejected + 1);
      await leavesPage.rejectedTab.click();
      await expect(page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible();
    });
  });

  test.describe('05. Cancel via kebab', () => {
    test('cancels a future-dated leave from Waiting For Approval via kebab menu', async ({ page }) => {
      test.setTimeout(180000);
      const leavesPage = new LeavesPage(page);
      await leavesPage.openFromDashboard();
      const before = await leavesPage.readLeavesTabCounts();

      await leavesPage.gotoWaitingForApproval();
      const { cell } = await leavesPage.requestAvailableFutureLeave(DEFAULT_CATEGORY, 'full');
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab)).toBe(before.waiting + 1);
      await leavesPage.waitingForApprovalTab.click();
      await leavesPage.expandTablePageSize();
      await expect(leavesPage.leaveDateCell(cell)).toBeVisible();

      await leavesPage.cancelLeaveRequest(cell);
      await expect.poll(() => leavesPage.readTabCount(leavesPage.waitingForApprovalTab), { timeout: 15000 }).toBe(
        before.waiting,
      );
      await expect.poll(() => leavesPage.readTabCount(leavesPage.cancelledTab), { timeout: 15000 }).toBe(
        before.cancelled + 1,
      );
      await leavesPage.cancelledTab.click();
      await leavesPage.expandTablePageSize();
      await expect(leavesPage.leaveDateCell(cell)).toBeVisible();
    });
  });
});
