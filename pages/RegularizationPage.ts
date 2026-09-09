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
    this.approvedTab = page.locator('li.nav-item, li, [role="tab"]').filter({ hasText: /Approved|Processed/i }).first();
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

  async openRegularizationFormModal() {
    const regButton = this.regularizeButtons.first();
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
    await this.page.waitForTimeout(1500);
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
    await logTrigger.click();
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

  async selectTab(tab: 'waiting' | 'approved' | 'rejected' | 'cancelled') {
    const tabLocator = tab === 'waiting' ? this.waitingForApprovalTab
      : tab === 'approved' ? this.approvedTab
        : tab === 'rejected' ? this.rejectedTab
          : this.cancelledTab;

    await tabLocator.click();
    await this.page.waitForTimeout(1000);
  }

  async getTabCount(tab: 'waiting' | 'approved' | 'rejected' | 'cancelled'): Promise<number> {
    const tabLocator = tab === 'waiting' ? this.waitingForApprovalTab
      : tab === 'approved' ? this.approvedTab
        : tab === 'rejected' ? this.rejectedTab
          : this.cancelledTab;

    const text = (await tabLocator.textContent()) || '';
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async selectEmployee(employeeName: string = 'Indu', searchText?: string) {
    const filter = searchText ?? employeeName;
    const employeeDropdown = this.page.getByRole('combobox', { name: /Please select employee|Select employee|Select employee name/i })
      .or(this.page.locator('p-dropdown, .p-dropdown, [role="combobox"]').filter({ hasText: /select employee/i }))
      .or(this.page.locator('p-dropdown, .p-dropdown, [role="combobox"]').first());

    if (await employeeDropdown.isVisible({ timeout: 5000 }).catch(() => false)) {
      await employeeDropdown.click();
      await this.page.waitForTimeout(500);

      const searchbox = this.page.getByRole('searchbox')
        .or(this.page.locator('.p-dropdown-filter, input[type="text"]')).first();
      if (await searchbox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchbox.fill(filter);
        await this.page.waitForTimeout(800);
      }

      const escaped = employeeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const option = this.page
        .getByRole('option', { name: new RegExp(escaped, 'i') })
        .or(this.page.locator('.p-dropdown-item, li').filter({ hasText: new RegExp(escaped, 'i') }))
        .or(this.page.getByText(new RegExp(escaped, 'i')));
      await option.first().click({ timeout: 15000 });
      await this.page.waitForTimeout(1000);
    }
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

    const kebab = this.page.locator('table tbody tr .dropdown > a, table tbody tr .dropdown button, table tbody tr a:has(.fa-ellipsis-v)').first();
    await kebab.waitFor({ state: 'visible', timeout: 10000 });
    await kebab.click();
    await this.page.waitForTimeout(500);

    await expect(this.approveActionOption.first()).toBeVisible();
    await expect(this.rejectActionOption.first()).toBeVisible();

    // Click reject option from kebab menu
    await this.rejectActionOption.first().click();
    await this.page.waitForTimeout(500);

    const modal = this.page.locator('ngb-modal-window, [role="dialog"], .modal-dialog, .modal').last();
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    // Look for suggested reason chips inside the rejection dialog
    const suggestedChip = modal.getByRole('button', { name: /Rejected|Duplicate|Policy|Invalid/i })
      .or(modal.locator('.suggestion-chip, .chip, .suggested-reason, app-chip, .badge, button.chip, span.cursor-pointer, .badge-secondary, .badge-outline-primary, .suggested-reasons *'))
      .or(this.page.getByRole('button', { name: 'Rejected' }))
      .first();

    if (await suggestedChip.isVisible({ timeout: 2000 }).catch(() => false)) {
      await suggestedChip.click();
      await this.page.waitForTimeout(500);
    }

    // Enter rejection comments in textarea / remarks field
    const commentInput = modal.locator('textarea, input[type="text"], [formcontrolname="reason"], [formcontrolname="remarks"], [formcontrolname="comments"]')
      .or(this.rejectionReasonInput).first();
    if (await commentInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await commentInput.click();
      await commentInput.fill('Rejected - Attendance regularization policy not met');
      await commentInput.press('Tab');
      await this.page.waitForTimeout(500);
    }

    // Click Reject confirm button in the modal
    const rejectConfirmBtn = modal.getByRole('button', { name: 'Reject', exact: true })
      .or(modal.getByRole('button', { name: /Reject|Submit/i }))
      .or(modal.locator('button').filter({ hasText: /^Reject$/i }))
      .or(this.page.locator('.modal-footer button, ngb-modal-window button').filter({ hasText: /^Reject$/i }))
      .or(this.rejectConfirmButton)
      .first();

    await rejectConfirmBtn.waitFor({ state: 'visible', timeout: 10000 });
    await expect(rejectConfirmBtn).toBeEnabled({ timeout: 10000 });
    await rejectConfirmBtn.click({ force: true });
    console.log('Reject confirmation button clicked successfully');

    // Verify rejection success popup / toast
    await expect(
      this.actionSuccessToast
        .or(this.page.locator('.toast, .toast-message, .p-toast-detail, .alert-success, ngb-alert'))
        .or(this.page.getByText(/Rejected|success|Regularization rejected/i))
        .first()
    ).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(3000);
  }
}
