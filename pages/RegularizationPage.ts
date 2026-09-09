import { expect, type Locator, type Page } from '@playwright/test';
import { LoginPage } from './LoginPage';

export interface RegularizationRequestData {
  duration?: string;
  regularizationType?: string;
  reason?: string;
}

export class RegularizationPage {
  readonly page: Page;
  readonly loginPage: LoginPage;

  // Sidebar & Profile Nav
  readonly attendanceNav: Locator;
  readonly timeOffNav: Locator;
  readonly pendingApprovalsNav: Locator;
  readonly profileImage: Locator;
  readonly logoutButton: Locator;
  readonly logoutConfirmYes: Locator;

  // Attendance Page Locators (Current Month)
  readonly attendanceTable: Locator;
  readonly attendanceRows: Locator;
  readonly regularizeButtons: Locator;
  readonly durationLogPopup: Locator;
  readonly regularizationAccordionButton: Locator;
  readonly regularizationChips: Locator;

  // Request Regularization Form Modal
  readonly requestModal: Locator;
  readonly durationDropdown: Locator;
  readonly regularizationTypeDropdown: Locator;
  readonly reasonInput: Locator;
  readonly submitRequestButton: Locator;
  readonly cancelRequestButton: Locator;
  readonly requestSuccessToast: Locator;

  // Time Off -> Regularization Module Tabs & Table
  readonly waitingForApprovalTab: Locator;
  readonly approvedTab: Locator;
  readonly processedTab: Locator;
  readonly rejectedTab: Locator;
  readonly cancelledTab: Locator;
  readonly regularizationTable: Locator;
  readonly regularizationRows: Locator;
  readonly noDataFoundMessage: Locator;

  // HR Pending Approvals -> Time-Off -> Regularizations
  readonly pendingTimeOffTab: Locator;
  readonly pendingRegularizationsTab: Locator;
  readonly pendingSearchInput: Locator;
  readonly pendingTableRows: Locator;
  readonly pendingKebabMenu: Locator;
  readonly approveActionOption: Locator;
  readonly rejectActionOption: Locator;
  readonly rejectionReasonInput: Locator;
  readonly rejectConfirmButton: Locator;
  readonly actionSuccessToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);

    // Sidebar & Profile Navigation
    this.attendanceNav = page.locator('#sidenav-main-drop').getByText('Attendance', { exact: true })
      .or(page.getByText('Attendance', { exact: true })).first();
    this.timeOffNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Time Off' })
      .or(page.getByText('Time Off', { exact: true })).first();
    this.pendingApprovalsNav = page.getByText('Pending Approvals').first();
    this.profileImage = page.getByRole('img', { name: 'Profile Image' })
      .or(page.locator('.profile-img, #profileDropdown, .user-profile-img, img.rounded-circle')).first();
    this.logoutButton = page.getByRole('button', { name: /Logout/i })
      .or(page.getByText(/Logout/i)).first();
    this.logoutConfirmYes = page.getByRole('button', { name: 'Yes', exact: true });

    // Attendance Table Locators (strictly current month)
    this.attendanceTable = page.locator('table').first();
    this.attendanceRows = page.locator('table tbody tr');
    this.regularizeButtons = this.attendanceTable.locator('tbody tr a, tbody tr u, tbody tr button')
      .filter({ hasText: /^Regularization$|^Regularize$/i });
    this.durationLogPopup = page.locator('ngb-modal-window, [role="dialog"], .modal').first();
    this.regularizationAccordionButton = page.getByRole('button', { name: /Regularizations|Regularization/i })
      .or(page.locator('.accordion-header, .accordion-button, a, button').filter({ hasText: /Regularization/i })).first();
    this.regularizationChips = page.locator('span, div, app-badge')
      .filter({ hasText: /Regularized\s*\(Requested\)|Regularization\s*Requested|Requested/i });

    // Request Form Modal
    this.requestModal = page.locator('ngb-modal-window, [role="dialog"], .modal').last();
    this.durationDropdown = page.getByRole('combobox', { name: /duration/i })
      .or(page.locator('#duration').getByRole('button', { name: 'dropdown trigger' }))
      .or(page.locator('#duration, [formcontrolname="duration"]')).first();
    this.regularizationTypeDropdown = page.getByRole('combobox', { name: /regularization/i })
      .or(page.locator('#regularizationType, [formcontrolname="regularizationType"], #leaveType_0')).first();
    this.reasonInput = page.getByRole('textbox', { name: /Reason/i })
      .or(page.locator('textarea[formcontrolname="reason"], input[formcontrolname="reason"], textarea')).first();
    this.submitRequestButton = page.getByRole('button', { name: /Request|Submit/i }).first();
    this.cancelRequestButton = page.getByRole('button', { name: /Cancel|Close/i }).first();
    this.requestSuccessToast = page.locator('.toast, .toast-message, .p-toast-detail, .alert-success')
      .filter({ hasText: /Regularization request|submitted successfully|created successfully/i })
      .or(page.getByText(/Regularization request/i));

    // Time Off -> Regularization Module Tabs & Table
    this.waitingForApprovalTab = page.locator('li.nav-item, li, [role="tab"]').filter({ hasText: /Waiting For Approval/i }).first();
    this.approvedTab = page.locator('li.nav-item, li, [role="tab"]').filter({ hasText: /Approved/i }).first();
    this.processedTab = page.locator('li.nav-item, li, [role="tab"]').filter({ hasText: /Processed/i }).first();
    this.rejectedTab = page.locator('li.nav-item, li, [role="tab"]').filter({ hasText: /Rejected/i }).first();
    this.cancelledTab = page.locator('li.nav-item, li, [role="tab"]').filter({ hasText: /Cancelled/i }).first();
    this.regularizationTable = page.locator('table, p-table').first();
    this.regularizationRows = page.locator('table tbody tr').filter({ hasNotText: /No Data Found/i });
    this.noDataFoundMessage = page.getByText(/No Data Found/i);

    // HR Pending Approvals Locators
    this.pendingTimeOffTab = page.locator('div, button, a').filter({ hasText: /^Time-Off\(\d+\)$|^Time-Off$/i }).first();
    this.pendingRegularizationsTab = page.getByText(/Regularizations/i).first();
    this.pendingSearchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/Search/i)).first();
    this.pendingTableRows = page.locator('table tbody tr');
    this.pendingKebabMenu = page.locator('table tbody tr .dropdown > a, table tbody tr button.dropdown-toggle').first();
    this.approveActionOption = page.getByText('Approve', { exact: true }).or(page.getByRole('button', { name: 'Approve' }));
    this.rejectActionOption = page.getByText('Reject', { exact: true }).or(page.getByRole('button', { name: 'Reject' }));
    this.rejectionReasonInput = page.getByRole('textbox', { name: /Reason|Remarks|Comments/i })
      .or(page.locator('textarea[formcontrolname="reason"], textarea[formcontrolname="remarks"], textarea[formcontrolname="comments"], textarea')).first();
    this.rejectConfirmButton = page.getByRole('button', { name: /Reject|Submit|Confirm/i }).first();
    this.actionSuccessToast = page.locator('.toast, .toast-message, .p-toast-detail, .alert-success, ngb-alert')
      .filter({ hasText: /success|Rejected|Approved|Updated/i })
      .or(page.getByText(/Rejected successfully|Data updated successfully|Regularization rejected/i));
  }

  // =========================================================================
  // AUTHENTICATION HELPERS
  // =========================================================================
  async loginAsEmployee() {
    const email = process.env.EMPLOYEE_EMAIL?.trim() || 'Indu@yopmail.com';
    const password = process.env.EMPLOYEE_PASSWORD?.trim() || 'Indu@123';

    await this.loginPage.goto();
    await this.loginPage.login(email, password);
    await this.page.waitForURL(/\/dashboard\/emp|\/attendance/, { timeout: 30000 }).catch(() => { });
    await this.page.waitForTimeout(2000);
  }

  async loginAsHr() {
    const email = process.env.LOGIN_EMAIL?.trim() || 'bhavitha.palagiri@snaddevelopers.com';
    const password = process.env.LOGIN_PASSWORD?.trim() || 'Bhavi@16';

    await this.loginPage.goto();
    await this.loginPage.login(email, password);
    await this.page.waitForURL(/\/dashboard|\/pending-approvals/, { timeout: 30000 }).catch(() => { });
    await this.page.waitForTimeout(2000);
  }

  async logout() {
    await this.page.waitForTimeout(1000);
    try {
      const profileTrigger = this.page.locator('.profile-info, .user-profile, .user-info, .profile-img, #profileDropdown, .avatar')
        .or(this.page.getByRole('paragraph').filter({ hasText: /InduQA|QA Tester|Bhavitha|Admin|Manager/i }))
        .or(this.page.locator('header, .navbar, .top-header').locator('[cursor="pointer"]').last()).first();

      if (await profileTrigger.isVisible({ timeout: 5000 }).catch(() => false)) {
        await profileTrigger.click();
        await this.page.waitForTimeout(500);
        if (await this.logoutButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await this.logoutButton.click();
          if (await this.logoutConfirmYes.isVisible({ timeout: 3000 }).catch(() => false)) {
            await this.logoutConfirmYes.click();
          }
        }
      }
    } catch {
      // Direct navigation fallback
    }

    await this.page.goto('/login', { waitUntil: 'domcontentloaded' }).catch(() => { });
    await this.loginPage.emailInput.waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
    await this.page.waitForTimeout(1000);
  }

  // =========================================================================
  // ATTENDANCE MODULE INTERACTIONS (CURRENT MONTH ONLY)
  // =========================================================================
  async navigateToAttendance() {
    try {
      await this.attendanceNav.click({ timeout: 5000 });
    } catch {
      await this.page.goto('/attendance', { waitUntil: 'domcontentloaded' });
    }
    await this.page.waitForURL(/\/attendance/, { timeout: 15000 }).catch(() => { });
    await this.attendanceTable.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(1500);
  }

  /**
   * Checks current month attendance table for Regularization buttons or half days.
   * If none are found, outputs: "'No regularization requests found' all are present for this month"
   */
  async checkCurrentMonthRegularization(): Promise<boolean> {
    const count = await this.regularizeButtons.count();
    const halfDayCount = await this.page.locator('table tbody tr').filter({ hasText: /Half Day/i }).count();

    if (count === 0 && halfDayCount === 0) {
      console.log("'No regularization requests found' all are present for this month");
      return false;
    }
    return count > 0;
  }

  async waitForRegularizationButton(timeout = 30000) {
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
      if (await this.regularizeButtons.first().isVisible().catch(() => false)) {
        return;
      }

      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.page.waitForURL(/\/attendance/, { timeout: 15000 }).catch(() => { });
      await this.attendanceTable.waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
      await this.page.waitForTimeout(1500);
    }

    await expect(this.regularizeButtons.first()).toBeVisible({ timeout: 1000 });
  }

  async readAttendanceRegularizationCount() {
    const summaryItem = this.page.locator('li, .summary-item, .attendance-summary-item')
      .filter({ hasText: /^Regularizations?\s*\d+$/i })
      .first()
      .or(this.page.getByText(/^Regularizations?\s*\d+$/i).first());
    if (!(await summaryItem.first().isVisible({ timeout: 3000 }).catch(() => false))) {
      console.log('Attendance Summary has no Regularizations item; count is 0');
      return 0;
    }
    const text = (await summaryItem.first().innerText()).replace(/\s+/g, ' ').trim();
    const match = text.match(/Regularizations?\s*(\d+)/i);
    if (!match) {
      throw new Error(`Could not read Attendance Summary regularization count from "${text}"`);
    }
    return Number(match[1]);
  }

  requestedDate: string = '';

  /**
   * Clicks on the Regularization button in the current month table
   */
  async clickRegularizationButton() {
    const regButton = this.regularizeButtons.first();
    const row = regButton.locator('xpath=ancestor::tr');
    this.requestedDate = (await row.locator('td').first().textContent().catch(() => ''))?.trim() || '';
    await regButton.click();
    await this.page.waitForTimeout(1000);
  }

  async openRegularizationFormModal(dateText?: string) {
    const targetDate = dateText || this.requestedDate;
    const targetRow = targetDate
      ? this.attendanceRows.filter({ hasText: targetDate }).first()
      : null;
    const rowButton = targetRow
      ? targetRow.locator('a, u, button').filter({ hasText: /^Regularization$|^Regularize$/i }).first()
      : null;
    const regButton = rowButton && await rowButton.isVisible().catch(() => false)
      ? rowButton
      : this.regularizeButtons.first();
    const row = regButton.locator('xpath=ancestor::tr');
    this.requestedDate = (await row.locator('td').first().textContent().catch(() => ''))?.trim() || '';
    await regButton.click();
    await this.requestModal.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async fillAndSubmitRegularization(data: RegularizationRequestData = {}) {
    const duration = data.duration || '0.5';
    const regType = data.regularizationType || 'Missed Punch';
    const reason = data.reason || 'Punchin missed for urgent work';

    const modal = this.page.locator('dialog, ngb-modal-window, [role="dialog"], .modal').first();
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    // 1. Duration dropdown (First dropdown in the form modal)
    const durationDropdown = modal.locator('p-dropdown, .p-dropdown, [role="combobox"]').first();
    if (await durationDropdown.isVisible({ timeout: 5000 }).catch(() => false)) {
      await durationDropdown.click();
      await this.page.waitForTimeout(500);
      const option = this.page.locator('.p-dropdown-item, [role="option"], li').filter({ hasText: new RegExp(`^${duration}$|${duration}`, 'i') }).first();
      if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
        await option.click();
      } else {
        await this.page.locator('.p-dropdown-item, [role="option"], li').first().click();
      }
      await this.page.waitForTimeout(500);
    }

    // 2. Regularization Category / Type dropdown (Second dropdown in modal)
    const categoryDropdown = modal.locator('p-dropdown, .p-dropdown, [role="combobox"]').nth(1);
    if (await categoryDropdown.isVisible({ timeout: 5000 }).catch(() => false)) {
      await categoryDropdown.click();
      await this.page.waitForTimeout(500);
      const typeOption = this.page.locator('.p-dropdown-item, [role="option"], li').filter({ hasText: new RegExp(regType, 'i') }).first();
      if (await typeOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await typeOption.click();
      } else {
        await this.page.locator('.p-dropdown-item, [role="option"], li').first().click();
      }
      await this.page.waitForTimeout(500);
    }

    // 3. Reason textarea
    const reasonBox = modal.getByRole('textbox', { name: /Reason/i })
      .or(modal.locator('textarea, input[formcontrolname="reason"]')).first();
    await reasonBox.fill(reason);
    await this.page.waitForTimeout(500);

    // 4. Click Submit / Request button
    const submitBtn = modal.getByRole('button', { name: /Request|Submit/i }).first();
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    await submitBtn.click();

    const toastSeen = await this.requestSuccessToast
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    await modal.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });

    const requestedRow = this.requestedDate
      ? this.attendanceRows.filter({ hasText: this.requestedDate }).first()
      : this.attendanceRows.filter({ hasText: /Regularized\s*\(?Requested\)?/i }).first();
    await expect(requestedRow).toContainText(/Regularized\s*\(?Requested\)?/i, {
      timeout: 15000,
    });
    console.log(
      toastSeen
        ? 'Regularization request success message displayed'
        : `Regularization request confirmed in attendance row for ${this.requestedDate}`,
    );
  }

  async openDurationLogsForDate(dateText?: string) {
    await this.closeLogsModalIfOpen();
    const targetDate = dateText || this.requestedDate;
    let row = this.attendanceRows.first();

    if (targetDate) {
      const matchedRow = this.attendanceRows.filter({ hasText: targetDate }).first();
      if (await matchedRow.isVisible().catch(() => false)) {
        row = matchedRow;
      }
    } else {
      const reqRow = this.attendanceRows.filter({ hasText: /Requested/i }).first();
      if (await reqRow.isVisible().catch(() => false)) {
        row = reqRow;
      }
    }

    const logTrigger = row.locator('td:nth-child(5)').locator('[cursor="pointer"], img, i, a, div, span').first();
    await logTrigger.waitFor({ state: 'visible', timeout: 10000 });
    await logTrigger.click({ force: true });

    if (!(await this.durationLogPopup.isVisible({ timeout: 3000 }).catch(() => false))) {
      await logTrigger.click({ force: true });
    }

    await this.durationLogPopup.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async openDurationLogsForFirstRow() {
    await this.openDurationLogsForDate();
  }

  async openRegularizationAccordionInModal() {
    const modal = this.durationLogPopup;
    const accordionBtn = modal.locator('.accordion-header, .accordion-button, button, a, [role="button"]')
      .filter({ hasText: /Regularization|Regularizations/i }).first();
    if (await accordionBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await accordionBtn.click().catch(() => { });
      await this.page.waitForTimeout(500);
    }
  }

  async verifyRegularizationAccordionDetails(expected?: { type?: string; duration?: string; status?: string }) {
    const modal = this.durationLogPopup;
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    await this.openRegularizationAccordionInModal();

    if (expected?.type) {
      await expect(modal.locator('body, .modal-body, .accordion-body, .modal-content, ngb-modal-window').filter({ hasText: new RegExp(expected.type, 'i') }).first()).toBeVisible({ timeout: 10000 });
    }
    if (expected?.duration) {
      await expect(modal.locator('body, .modal-body, .accordion-body, .modal-content, ngb-modal-window').filter({ hasText: new RegExp(expected.duration, 'i') }).first()).toBeVisible({ timeout: 10000 });
    }
    if (expected?.status) {
      await expect(modal.locator('body, .modal-body, .accordion-body, .modal-content, ngb-modal-window').filter({ hasText: new RegExp(expected.status, 'i') }).first()).toBeVisible({ timeout: 10000 });
    }
  }

  async clickCrossIconForAttendanceLogsPopup() {
    const modal = this.durationLogPopup;
    if (await modal.isVisible({ timeout: 5000 }).catch(() => false)) {
      const crossBtn = modal.locator('img[alt*="Close"], img.close-icon, button.close, button.btn-close, .close, i.fa-times, [aria-label="Close"], .modal-header button, .modal-header img, span[aria-hidden="true"]').first();
      if (await crossBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await crossBtn.click();
      } else {
        await this.page.keyboard.press('Escape');
      }
      await modal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
      await this.page.waitForTimeout(500);
    }
  }

  async closeLogsModalIfOpen() {
    await this.clickCrossIconForAttendanceLogsPopup();
  }

  // =========================================================================
  // TIME OFF -> REGULARIZATION MODULE INTERACTIONS
  // =========================================================================
  async navigateToTimeOffRegularization() {
    try {
      await this.timeOffNav.click();
      await this.page.waitForTimeout(500);
      const regLink = this.page.locator('a, .grid-item, div').filter({ hasText: /^Regularization$|^Regularizations$/i }).first();
      await regLink.click();
    } catch {
      await this.page.goto('/time-off/regularization/process', { waitUntil: 'domcontentloaded' });
    }
    await this.page.waitForURL(/\/time-off\/regularization/, { timeout: 15000 }).catch(() => { });
    await this.page.waitForTimeout(1000);
  }

  async selectTab(tab: 'waiting' | 'approved' | 'processed' | 'rejected' | 'cancelled') {
    const tabLocator = tab === 'waiting' ? this.waitingForApprovalTab
      : tab === 'approved' ? this.approvedTab
        : tab === 'processed' ? this.processedTab
        : tab === 'rejected' ? this.rejectedTab
          : this.cancelledTab;

    await tabLocator.click();
    await this.page.waitForTimeout(1000);
  }

  async getTabCount(tab: 'waiting' | 'approved' | 'processed' | 'rejected' | 'cancelled'): Promise<number> {
    const tabLocator = tab === 'waiting' ? this.waitingForApprovalTab
      : tab === 'approved' ? this.approvedTab
        : tab === 'processed' ? this.processedTab
        : tab === 'rejected' ? this.rejectedTab
          : this.cancelledTab;

    const text = (await tabLocator.textContent()) || '';
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async expectProcessedRegularization(dateText?: string) {
    await this.selectTab('processed');
    const targetDate = dateText || this.requestedDate;
    const row = targetDate
      ? this.regularizationRows.filter({ hasText: targetDate }).first()
      : this.regularizationRows.first();
    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText(/Approved|Processed/i);
    console.log(`Processed regularization: ${(await row.innerText()).replace(/\s+/g, ' ').trim()}`);
  }

  async selectEmployee(employeeName: string = 'Indu Priya', employeeId?: string) {
    const employeeDropdown = this.page.getByRole('combobox', { name: /Please select employee|Select employee|Select employee name/i })
      .or(this.page.locator('p-dropdown, .p-dropdown, [role="combobox"]').filter({ hasText: /select employee/i }))
      .or(this.page.locator('p-dropdown, .p-dropdown, [role="combobox"]').first());

    await employeeDropdown.waitFor({ state: 'visible', timeout: 10000 });
    const nameParts = employeeName.trim().split(/\s+/).filter(Boolean);
    const looseName = nameParts
      .map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('[\\s\\S]*');
    const queries = [employeeId, employeeName, ...nameParts]
      .filter((value): value is string => Boolean(value));
    const employeePattern = new RegExp(
      [employeeId?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), looseName]
        .filter(Boolean)
        .join('|'),
      'i',
    );

    for (const query of queries) {
      await employeeDropdown.click();
      const searchbox = this.page.getByRole('searchbox')
        .or(this.page.locator('.p-dropdown-filter, input[type="text"]')).first();
      await searchbox.waitFor({ state: 'visible', timeout: 5000 });
      await searchbox.fill(query);
      await this.page.waitForTimeout(800);

      const option = this.page.getByRole('option').filter({ hasText: employeePattern }).first()
        .or(this.page.locator('.p-dropdown-item, li').filter({ hasText: employeePattern }).first());
      if (await option.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        const selectedText = (await option.first().innerText()).replace(/\s+/g, ' ').trim();
        await option.first().click();
        await expect(employeeDropdown).toContainText(employeePattern, { timeout: 10000 });
        console.log(`Selected employee: ${selectedText}`);
        return;
      }
      await this.page.keyboard.press('Escape');
    }

    throw new Error(`Employee ${employeeId ?? ''} ${employeeName} was not found`);
  }

  // =========================================================================
  // HR PENDING APPROVALS INTERACTIONS
  // =========================================================================
  async navigateToPendingApprovalsRegularization() {
    try {
      await this.pendingApprovalsNav.click();
      await this.page.waitForTimeout(1000);
      if (await this.pendingTimeOffTab.isVisible().catch(() => false)) {
        await this.pendingTimeOffTab.click();
      }
      await this.pendingRegularizationsTab.click();
    } catch {
      await this.page.goto('/pending-approvals/time-off/regularization-request/for-you', { waitUntil: 'domcontentloaded' });
    }
    await this.page.waitForURL(/\/pending-approvals\/time-off\/regularization/, { timeout: 15000 }).catch(() => { });
    await this.page.waitForTimeout(1500);
  }

  async rejectFirstPendingRequest(searchQuery: string = 'indu') {
    if (await this.pendingSearchInput.isVisible().catch(() => false)) {
      await this.pendingSearchInput.fill(searchQuery);
      await this.page.waitForTimeout(1000);
    }

    const row = this.page.locator('table tbody tr').filter({ hasText: new RegExp(searchQuery, 'i') }).first()
      .or(this.page.locator('table tbody tr').first());
    await row.waitFor({ state: 'visible', timeout: 15000 });

    const kebab = row.locator('.dropdown > a, .dropdown button, a:has(.fa-ellipsis-v), button.dropdown-toggle').first();
    await kebab.waitFor({ state: 'visible', timeout: 10000 });
    await kebab.click();
    await this.page.waitForTimeout(500);

    // Kebab menu options
    const rejectMenuItem = this.page.getByText('Reject', { exact: true })
      .or(row.getByText('Reject', { exact: true }))
      .or(this.page.getByRole('menuitem', { name: 'Reject' }))
      .first();
    await rejectMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    await rejectMenuItem.click();
    await this.page.waitForTimeout(1000);

    // Rejection Modal
    const modal = this.page.locator('ngb-modal-window, [role="dialog"], .modal-dialog, .modal').last();
    await modal.waitFor({ state: 'visible', timeout: 15000 });

    // 1. Click on the suggested reason chip (e.g. "Rejected" button)
    const rejectedChip = modal.getByRole('button', { name: 'Rejected', exact: true })
      .or(this.page.getByRole('button', { name: 'Rejected', exact: true }))
      .or(modal.getByRole('button', { name: /Rejected|Policy|Duplicate|Invalid/i }))
      .or(modal.locator('app-chip, .suggestion-chip, .chip, button.chip, span.badge, .badge-secondary'))
      .first();

    if (await rejectedChip.isVisible({ timeout: 5000 }).catch(() => false)) {
      await rejectedChip.click();
      await this.page.waitForTimeout(500);
    }

    // 2. Also enter comments in textarea if available
    const commentInput = modal.locator('textarea, input[formcontrolname="reason"], input[formcontrolname="remarks"], input[formcontrolname="comments"], textarea[formcontrolname="reason"]')
      .or(this.page.locator('textarea').last())
      .first();

    if (await commentInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await commentInput.click();
      await commentInput.fill('Rejected - Attendance regularization policy not met');
      await commentInput.blur();
      await this.page.waitForTimeout(500);
    }

    // 3. Click the confirm Reject button
    const rejectConfirmBtn = modal.getByRole('button', { name: 'Reject', exact: true })
      .or(modal.locator('button.btn-danger, button.btn-primary, button[type="submit"]').filter({ hasText: /^Reject$/i }))
      .or(this.page.getByRole('button', { name: 'Reject', exact: true }).last())
      .first();

    await rejectConfirmBtn.waitFor({ state: 'visible', timeout: 10000 });

    if (await rejectConfirmBtn.isDisabled().catch(() => false)) {
      if (await rejectedChip.isVisible().catch(() => false)) {
        await rejectedChip.click();
        await this.page.waitForTimeout(500);
      }
    }

    await expect(rejectConfirmBtn).toBeEnabled({ timeout: 10000 });
    await rejectConfirmBtn.click({ force: true });
    console.log('Reject confirmation button clicked successfully');

    // 4. Verify rejection success popup / toast
    await expect(
      this.actionSuccessToast
        .or(this.page.locator('.toast, .toast-message, .p-toast-detail, .alert-success, ngb-alert'))
        .or(this.page.getByText(/Rejected|success|Regularization rejected/i))
        .first()
    ).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(2000);
  }

  async approveFirstPendingRequest(searchQueries: string[] = ['SD302133', 'Indu Priya']) {
    const row = await this.findPendingRequestRow(searchQueries);
    const kebab = row.locator('.dropdown > a, .dropdown button, a:has(.fa-ellipsis-v), button.dropdown-toggle').first();
    await kebab.waitFor({ state: 'visible', timeout: 10000 });
    await kebab.click();

    const approveMenuItem = this.page.getByText('Approve', { exact: true })
      .or(this.page.getByRole('menuitem', { name: 'Approve' }))
      .first();
    await approveMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    await approveMenuItem.click();

    const dialog = this.page.getByRole('dialog').last();
    if (await dialog.isVisible({ timeout: 5000 }).catch(() => false)) {
      const approvedOption = dialog.getByText('Approved', { exact: true })
        .or(dialog.getByRole('button', { name: 'Approved', exact: true }));
      if (await approvedOption.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await approvedOption.first().click();
      }

      const confirm = dialog.getByRole('button', { name: /Approve|Submit|Confirm/i }).last();
      if (await confirm.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(confirm).toBeEnabled({ timeout: 10000 });
        await confirm.click();
      }
    }

    const success = this.page.getByText(/Regularization.*approved|approved successfully|request.*approved/i)
      .or(this.page.locator('.toast, .toast-message, .p-toast-detail, .alert-success'));
    await expect(success.first()).toBeVisible({ timeout: 15000 });
    console.log(`Approved regularization request for ${searchQueries.join(' / ')}`);
  }

  private async findPendingRequestRow(searchQueries: string[]) {
    for (const query of searchQueries) {
      if (await this.pendingSearchInput.isVisible().catch(() => false)) {
        await this.pendingSearchInput.fill('');
        await this.pendingSearchInput.fill(query);
        await this.pendingSearchInput.press('Enter').catch(() => {});
        await this.page.waitForTimeout(1000);
      }

      const row = this.pendingTableRows.filter({ hasText: new RegExp(
        query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i',
      ) }).first();
      if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
        return row;
      }
    }
    throw new Error(`No pending regularization found for ${searchQueries.join(' / ')}`);
  }
}
