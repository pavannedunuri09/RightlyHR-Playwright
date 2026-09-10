import { expect, type Locator, type Page } from '@playwright/test';
import { LoginPage } from './LoginPage';

export interface PermissionRequestData {
  date?: string; // YYYY-MM-DD
  duration: '0.5' | '1' | '1.5' | '2' | string;
  permissionType: 'Early Logout' | 'In Between Breaks' | 'Early Login' | string;
  reason: string;
}

export class PermissionsPage {
  readonly page: Page;
  readonly loginPage: LoginPage;

  // Navigation Locators
  readonly timeOffNav: Locator;
  readonly timeOffToggle: Locator;
  readonly permissionsTab: Locator;
  readonly attendanceNav: Locator;
  readonly breadcrumb: Locator;
  readonly breadcrumbTimeOff: Locator;
  readonly breadcrumbPermissions: Locator;

  // Permissions Dashboard / List View
  readonly requestPermissionButton: Locator;
  readonly waitingForApprovalTab: Locator;
  readonly rejectedTab: Locator;
  readonly cancelledTab: Locator;
  readonly noDataFoundMessage: Locator;
  readonly permissionsTable: Locator;
  readonly permissionRows: Locator;

  // Table Column Headers
  readonly requestedDateHeader: Locator;
  readonly permissionDateHeader: Locator;
  readonly durationHeader: Locator;
  readonly reasonHeader: Locator;
  readonly permissionTypeHeader: Locator;
  readonly statusHeader: Locator;
  readonly actionHeader: Locator;

  // Request Permission Modal / Form Locators
  readonly requestModal: Locator;
  readonly dateInput: Locator;
  readonly durationDropdown: Locator;
  readonly permissionTypeDropdown: Locator;
  readonly reasonInput: Locator;
  readonly requestButton: Locator;
  readonly modalCancelButton: Locator;

  // Cancellation Modal Locators
  readonly cancelPermissionAction: Locator;
  readonly cancellationModal: Locator;
  readonly cancellationReasonInput: Locator;
  readonly cancellationSubmitButton: Locator;
  readonly cancellationCancelButton: Locator;

  // Approver / Pending Approvals Locators
  readonly pendingApprovalsNav: Locator;
  readonly approverSearchBox: Locator;
  readonly approveButton: Locator;
  readonly rejectButton: Locator;

  // Toast & Status Messages
  readonly requestSubmittedToast: Locator;
  readonly permissionCancelledToast: Locator;
  readonly permissionApprovedToast: Locator;
  readonly permissionRejectedToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);

    // Sidebar & Navigation
    this.timeOffNav = page.locator('#sidenav-main-drop .nav-item, #sidenav-main-drop a, #sidenav-main-drop li, nav .nav-item, .sidebar .nav-item')
      .filter({ hasText: /^Time Off$/i })
      .or(page.getByText('Time Off', { exact: true }))
      .or(page.locator('a, li, div').filter({ hasText: /^Time Off$/i }))
      .first();

    this.timeOffToggle = page.locator('#sidenav-main-drop .nav-item').filter({
      hasText: 'Time Off',
    }).locator('[data-bs-toggle="dropdown"]').first().or(
      page.getByText('Time Off').first(),
    );

    this.permissionsTab = page.locator('.dropdown-menu-text, a.dropdown-item, .nav-link, span, div, li a').filter({
      hasText: /^Permissions$/i,
    }).first().or(
      page.getByText('Permissions', { exact: true }).first(),
    );

    this.attendanceNav = page.locator('#sidenav-main-drop .nav-item, #sidenav-main-drop a, #sidenav-main-drop li, nav .nav-item, .sidebar .nav-item')
      .filter({ hasText: /^Attendance$/i })
      .or(page.getByRole('link', { name: /Attendance/i }))
      .or(page.getByText('Attendance', { exact: true }))
      .first();

    // Breadcrumb Locators
    this.breadcrumb = page.locator('ol.breadcrumb, nav[aria-label="breadcrumb"], app-breadcrumb, .breadcrumb, .page-breadcrumb, .title-container, .card-title').filter({
      hasText: /Time\s*Off/i,
    }).first().or(
      page.getByText(/Time\s*Off\s*(>>|>|\/)?\s*Permissions/i).first(),
    ).or(
      page.getByText('Time OffPermissions').first(),
    );

    this.breadcrumbTimeOff = page.locator('ol.breadcrumb, nav[aria-label="breadcrumb"], app-breadcrumb, .breadcrumb').getByText(/Time\s*Off/i).first().or(
      page.getByText('Time Off').first(),
    );

    this.breadcrumbPermissions = page.locator('ol.breadcrumb, nav[aria-label="breadcrumb"], app-breadcrumb, .breadcrumb').getByText(/Permissions/i).first().or(
      page.getByText('Permissions').first(),
    );

    // List & Tabs
    this.requestPermissionButton = page.getByRole('button', { name: 'Request Permission' }).or(
      page.getByText('Request Permission'),
    ).first();

    this.waitingForApprovalTab = page.locator('li, [role="tab"], .nav-link, button, div, span, a')
      .filter({ hasText: /Waiting For Approval/i })
      .or(page.getByText(/Waiting For Approval/i))
      .first();

    this.rejectedTab = page.locator('li, [role="tab"], .nav-link, button, div, span, a')
      .filter({ hasText: /Rejected/i })
      .or(page.getByText(/Rejected/i))
      .first();

    this.cancelledTab = page.locator('li, [role="tab"], .nav-link, button, div, span, a')
      .filter({ hasText: /Cancelled/i })
      .or(page.getByText(/Cancelled/i))
      .first();

    this.noDataFoundMessage = page.getByText(/No Data Found/i).first();
    this.permissionsTable = page.locator('table, [role="table"], p-table, .p-datatable-table').first();
    this.permissionRows = page.locator('table tbody tr');

    // Table Column Headers
    this.requestedDateHeader = page.getByRole('columnheader', { name: /Requested Date/i }).or(
      page.locator('th').filter({ hasText: /Requested Date/i }),
    ).first();
    this.permissionDateHeader = page.getByRole('columnheader', { name: /Permission Date/i }).or(
      page.locator('th').filter({ hasText: /Permission Date/i }),
    ).first();
    this.durationHeader = page.getByRole('columnheader', { name: /Duration/i }).or(
      page.locator('th').filter({ hasText: /Duration/i }),
    ).first();
    this.reasonHeader = page.getByRole('columnheader', { name: /Reason/i }).or(
      page.locator('th').filter({ hasText: /Reason/i }),
    ).first();
    this.permissionTypeHeader = page.getByRole('columnheader', { name: /Permission Type/i }).or(
      page.locator('th').filter({ hasText: /Permission Type/i }),
    ).first();
    this.statusHeader = page.getByRole('columnheader', { name: /Status/i }).or(
      page.locator('th').filter({ hasText: /Status/i }),
    ).first();
    this.actionHeader = page.getByRole('columnheader', { name: /Action/i }).or(
      page.locator('th').filter({ hasText: /Action/i }),
    ).first();

    // Request Form Modal
    this.requestModal = page.locator('dialog, ngb-modal-window, [role="dialog"], .modal, p-dialog, .p-dialog').last();
    this.dateInput = page.getByRole('textbox', { name: /Date\*/i }).or(
      page.locator('input[placeholder*="date" i], input[type="date"], input[name*="date" i], input[formcontrolname="date"]')
    ).first();

    this.durationDropdown = page.locator('#duration').getByRole('button', { name: 'dropdown trigger' }).or(
      page.getByRole('combobox', { name: /Please select duration|duration/i }),
    ).or(
      page.locator('#duration, [formcontrolname="duration"], p-dropdown[id="duration"], p-select[id="duration"]'),
    ).first();

    this.permissionTypeDropdown = page.getByRole('combobox', { name: /Please select permission type|permission type/i }).or(
      page.locator('[formcontrolname="permissionType"], [formcontrolname="type"], p-dropdown[id="permissionType"], p-select[id="permissionType"]'),
    ).or(
      page.locator('p-dropdown, p-select').filter({ hasText: /permission type/i }),
    ).first();

    this.reasonInput = page.getByRole('textbox', { name: /Reason\*/i }).or(
      page.locator('textarea[placeholder*="Reason" i], textarea[formcontrolname="reason"], textarea, input[name*="reason" i]'),
    ).first();

    this.requestButton = page.getByRole('button', { name: 'Request', exact: true }).or(
      page.getByRole('button', { name: /Submit|Save/i }),
    ).first();

    this.modalCancelButton = page.getByRole('button', { name: 'Cancel' }).or(
      page.getByRole('dialog').getByText('Cancel'),
    ).first();

    // Cancellation Modal
    this.cancelPermissionAction = page.getByText('Cancel Permission', { exact: true }).or(
      page.locator('.dropdown-menu a, .dropdown-menu button, a.dropdown-item, button.dropdown-item, .dropdown-item').filter({ hasText: /Cancel Permission/i }),
    ).first();

    this.cancellationModal = page.locator('dialog, ngb-modal-window, [role="dialog"], .modal, p-dialog, .p-dialog').last();
    this.cancellationReasonInput = page.getByRole('textbox', { name: /cancellation|Please enter cancellation/i }).or(
      page.locator('textarea[placeholder*="cancellation" i], input[placeholder*="cancellation" i], textarea, input[name*="cancel" i]'),
    ).first();
    this.cancellationSubmitButton = page.getByRole('button', { name: 'Submit', exact: true }).or(
      page.locator('button').filter({ hasText: /^Submit$/i }),
    ).first();
    this.cancellationCancelButton = page.getByRole('button', { name: 'Cancel', exact: true }).first();

    // Approver / Pending Approvals
    this.pendingApprovalsNav = page.getByText('Pending Approvals', { exact: true }).or(
      page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Pending Approvals' }),
    ).first();
    this.approverSearchBox = page.getByRole('searchbox', { name: /search/i }).or(
      page.getByPlaceholder(/search/i),
    ).first();
    this.approveButton = page.getByRole('button', { name: 'Approve' }).first();
    this.rejectButton = page.getByRole('button', { name: 'Reject' }).first();

    // Toast Notifications
    this.requestSubmittedToast = page.locator('.toast, .toast-message, .p-toast-detail, .alert-success, ngb-alert, .p-toast-message-content')
      .filter({ hasText: /Permission request submitted|Request submitted successfully|submitted successfully|applied successfully|Success/i })
      .or(page.getByText(/Permission request submitted/i));

    this.permissionCancelledToast = page.locator('.toast, .toast-message, .p-toast-detail, .alert-success, ngb-alert, .p-toast-message-content')
      .filter({ hasText: /Permission cancelled|Cancelled successfully|Success/i })
      .or(page.getByText(/Permission cancelled/i));

    this.permissionApprovedToast = page.getByText(/Permission approved|Approved successfully/i).first();
    this.permissionRejectedToast = page.getByText(/Permission rejected|Rejected successfully/i).first();
  }

  // =========================================================================
  // AUTH & NAVIGATION HELPERS
  // =========================================================================

  async loginAsEmployee(email?: string, password?: string) {
    const empEmail = email || process.env.EMPLOYEE_EMAIL?.trim() || 'indu@yopmail.com';
    const empPassword = password || process.env.EMPLOYEE_PASSWORD?.trim() || 'Indu@123';

    await this.page.goto('/login', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await this.loginPage.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.loginPage.login(empEmail, empPassword);
    await this.page.waitForURL(/\/dashboard|\/time-off|\/attendance/, { timeout: 45000, waitUntil: 'domcontentloaded' }).catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  async logout() {
    await this.page.waitForTimeout(500);
    try {
      const profileTrigger = this.page.locator('.profile-info, .user-profile, .user-info, .profile-img, #profileDropdown, .avatar')
        .or(this.page.getByRole('paragraph').filter({ hasText: /InduQA|QA Tester|Bhavitha|Admin|Manager/i }))
        .or(this.page.locator('header, .navbar, .top-header').locator('[cursor="pointer"]').last()).first();

      if (await profileTrigger.isVisible({ timeout: 4000 }).catch(() => false)) {
        await profileTrigger.click();
        await this.page.waitForTimeout(600);
      }

      const logoutBtn = this.page.getByRole('button', { name: /Logout/i })
        .or(this.page.getByText(/Logout/i))
        .or(this.page.locator('.dropdown-item, .p-menuitem-link, a, button').filter({ hasText: /Logout/i }))
        .first();

      await logoutBtn.waitFor({ state: 'visible', timeout: 6000 });
      await logoutBtn.click();
      await this.page.waitForTimeout(600);

      const confirmYes = this.page.getByRole('button', { name: 'Yes', exact: true })
        .or(this.page.locator('.p-dialog-footer button, .modal-footer button, button').filter({ hasText: /^Yes$/i }))
        .first();

      if (await confirmYes.isVisible({ timeout: 4000 }).catch(() => false)) {
        await confirmYes.click();
      }

      await this.page.waitForURL(/\/login/, { timeout: 15000 }).catch(() => {});
      await this.page.waitForTimeout(1000);
    } catch {
      await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
      await this.page.waitForTimeout(1500);
    }
  }

  async openTimeOffMenu() {
    await this.page.waitForTimeout(500);
    const timeOff = this.timeOffNav.first();
    await timeOff.waitFor({ state: 'visible', timeout: 15000 });
    await timeOff.click();
    await this.page.waitForTimeout(600);
  }

  async navigateToPermissionsModule() {
    // If request button is already visible and on permissions page, return
    if (await this.requestPermissionButton.isVisible({ timeout: 1500 }).catch(() => false)) {
      return;
    }

    // Ensure Time Off menu is opened if permissions tab isn't visible yet
    const permTab = this.permissionsTab.first();
    if (!(await permTab.isVisible({ timeout: 2000 }).catch(() => false))) {
      await this.openTimeOffMenu();
    }

    // Click on Permissions item
    await permTab.waitFor({ state: 'visible', timeout: 10000 });
    await permTab.click();
    await this.page.waitForTimeout(1500);

    // Wait for permissions module to be loaded
    await this.requestPermissionButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  async navigateToAttendanceModule() {
    await this.page.waitForTimeout(500);

    // Scroll sidebar down if needed
    const sidebar = this.page.locator('#sidenav-main-drop, .sidebar, aside, .side-menu, nav').first();
    if (await sidebar.isVisible().catch(() => false)) {
      await sidebar.evaluate(el => el.scrollTop = 0).catch(() => {});
    }

    const attendanceLink = this.attendanceNav.first();
    if (await attendanceLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await attendanceLink.scrollIntoViewIfNeeded().catch(() => {});
      await attendanceLink.click();
    } else {
      await this.page.goto('/attendance', { waitUntil: 'domcontentloaded' }).catch(() => {});
    }

    await this.page.waitForTimeout(1500);
    try {
      await this.page.waitForURL(/\/attendance/, { timeout: 10000 });
    } catch {
      await this.page.goto('/attendance', { waitUntil: 'domcontentloaded' }).catch(() => {});
    }
    await this.page.waitForTimeout(1500);
  }

  // =========================================================================
  // BREADCRUMB ASSERTION HELPERS
  // =========================================================================

  async getBreadcrumbText(): Promise<string> {
    await this.page.waitForTimeout(500);
    if (await this.breadcrumb.isVisible().catch(() => false)) {
      return (await this.breadcrumb.innerText()).trim();
    }
    const combined = `${await this.breadcrumbTimeOff.innerText().catch(() => '')} >> ${await this.breadcrumbPermissions.innerText().catch(() => '')}`;
    return combined.trim();
  }

  async verifyBreadcrumb() {
    const breadcrumbVisible = await this.breadcrumb.isVisible({ timeout: 8000 }).catch(() => false);
    if (breadcrumbVisible) {
      const text = await this.breadcrumb.innerText();
      expect(text.replace(/\s+/g, ' ')).toMatch(/Time\s*Off.*Permissions/i);
    } else {
      await expect(this.breadcrumbTimeOff.or(this.page.getByText('Time Off'))).toBeVisible();
      await expect(this.breadcrumbPermissions.or(this.page.getByText('Permissions'))).toBeVisible();
    }
  }

  // =========================================================================
  // TAB COUNTS & STATUS TABS HELPERS
  // =========================================================================

  async getWaitingForApprovalCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    const tab = this.waitingForApprovalTab;
    await tab.waitFor({ state: 'visible', timeout: 10000 });
    const text = (await tab.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async readTabCount(tab: Locator): Promise<number> {
    const text = (await tab.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async readPermissionTabCounts() {
    return {
      waiting: await this.readTabCount(this.waitingForApprovalTab),
      rejected: await this.readTabCount(this.rejectedTab),
      cancelled: await this.readTabCount(this.cancelledTab),
    };
  }

  async selectTab(tab: 'waiting' | 'rejected' | 'cancelled') {
    const target =
      tab === 'waiting'
        ? this.waitingForApprovalTab
        : tab === 'rejected'
          ? this.rejectedTab
          : this.cancelledTab;
    await target.waitFor({ state: 'visible', timeout: 8000 });
    await target.click();
    await this.page.waitForTimeout(800);
  }

  // =========================================================================
  // REQUEST PERMISSION FLOW
  // =========================================================================

  async openRequestPermissionModal() {
    await this.requestPermissionButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.requestPermissionButton.click();
    await this.dateInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async fillPermissionRequest(data: PermissionRequestData) {
    if (data.date) {
      await this.dateInput.click();
      await this.dateInput.fill(data.date);
      await this.page.waitForTimeout(300);
    }

    // Select duration
    if (data.duration) {
      const durationTrigger = this.page.locator('#duration').getByRole('button', { name: 'dropdown trigger' })
        .or(this.page.getByRole('combobox', { name: /Please select duration|duration/i }))
        .or(this.page.locator('#duration, [formcontrolname="duration"]'))
        .first();

      await durationTrigger.waitFor({ state: 'visible', timeout: 5000 });
      await durationTrigger.click();
      await this.page.waitForTimeout(500);

      const overlay = this.page.locator('.p-dropdown-panel, .p-select-overlay, .p-select-panel, ul[role="listbox"]').last();
      const option = overlay.getByRole('option', { name: data.duration, exact: true })
        .or(overlay.getByText(data.duration, { exact: true }))
        .first();

      await option.waitFor({ state: 'visible', timeout: 5000 });
      await option.click();
      await this.page.waitForTimeout(300);
    }

    // Select permission type (Early Logout, In Between Breaks, Early Login)
    if (data.permissionType) {
      const typeTrigger = this.page.getByRole('combobox', { name: 'Please select permission type' })
        .or(this.page.getByRole('combobox', { name: /permission type/i }))
        .or(this.page.locator('#permissionType, [formcontrolname="permissionType"]'))
        .first();

      await typeTrigger.waitFor({ state: 'visible', timeout: 5000 });
      await typeTrigger.click();
      await this.page.waitForTimeout(500);

      const overlay = this.page.locator('.p-dropdown-panel, .p-select-overlay, .p-select-panel, ul[role="listbox"]').last();
      const option = overlay.getByRole('option', { name: data.permissionType, exact: true })
        .or(overlay.getByText(data.permissionType, { exact: true }))
        .or(overlay.getByText(new RegExp(data.permissionType, 'i')))
        .first();

      await option.waitFor({ state: 'visible', timeout: 5000 });
      await option.click();
      await this.page.waitForTimeout(300);
    }

    // Fill reason
    if (data.reason) {
      await this.reasonInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.reasonInput.click();
      await this.reasonInput.fill(data.reason);
      await this.page.waitForTimeout(300);
    }
  }

  async submitPermissionRequest() {
    await this.requestButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.requestButton.click();
    await this.page.waitForTimeout(1000);

    try {
      await expect(this.requestSubmittedToast).toBeVisible({ timeout: 15000 });
    } catch {
      await expect(this.requestModal).toBeHidden({ timeout: 8000 });
    }
    await this.page.waitForTimeout(1000);
  }

  async requestPermission(data: PermissionRequestData) {
    await this.openRequestPermissionModal();
    await this.fillPermissionRequest(data);
    await this.submitPermissionRequest();
  }

  // =========================================================================
  // CANCEL PERMISSION FLOW
  // =========================================================================

  async openFirstRowActionMenu() {
    const firstRow = this.permissionRows.first();
    await firstRow.waitFor({ state: 'visible', timeout: 15000 });
    const actionCell = firstRow.locator('td').last();
    const actionTrigger = actionCell.locator('.dropdown-toggle, [data-bs-toggle="dropdown"], a, button, i, span, generic').first();
    
    if (await actionTrigger.isVisible().catch(() => false)) {
      await actionTrigger.click({ force: true });
    } else {
      await actionCell.click({ force: true });
    }
    await this.page.waitForTimeout(500);
    await this.cancelPermissionAction.waitFor({ state: 'visible', timeout: 5000 });
  }

  async cancelFirstPermission(reason: string = 'cancellation') {
    await this.openFirstRowActionMenu();
    await this.cancelPermissionAction.click();

    const reasonBox = this.page.getByRole('textbox', { name: /cancellation|Please enter cancellation/i })
      .or(this.cancellationReasonInput);

    await reasonBox.waitFor({ state: 'visible', timeout: 8000 });
    await reasonBox.click();
    await reasonBox.fill(reason);
    await this.page.waitForTimeout(300);

    const submitBtn = this.page.getByRole('button', { name: 'Submit', exact: true })
      .or(this.cancellationSubmitButton);

    await submitBtn.waitFor({ state: 'visible', timeout: 5000 });
    await submitBtn.click();
    await this.page.waitForTimeout(1000);

    try {
      await expect(this.permissionCancelledToast).toBeVisible({ timeout: 15000 });
    } catch {
      await expect(this.cancellationModal).toBeHidden({ timeout: 8000 });
    }
  }

  async verifyRecordInWaitingForApproval(expectedType?: string, expectedCount?: number) {
    await this.page.waitForTimeout(1500);

    // Verify Waiting For Approval tab is visible
    await expect(this.waitingForApprovalTab).toBeVisible({ timeout: 10000 });

    // Verify count in tab header
    const currentCount = await this.getWaitingForApprovalCount();
    if (expectedCount !== undefined) {
      expect(currentCount).toBe(expectedCount);
    } else {
      expect(currentCount).toBeGreaterThanOrEqual(1);
    }

    // Verify table and row
    await expect(this.permissionsTable).toBeVisible({ timeout: 10000 });
    const row = expectedType
      ? this.permissionRows.filter({ hasText: new RegExp(expectedType, 'i') }).first()
      : this.permissionRows.first();

    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(/Waiting for Approval/i);
  }

  // =========================================================================
  // ATTENDANCE MODULE & LOGS VERIFICATION
  // =========================================================================

  async verifyPermissionRequestedChip(targetDateString?: string) {
    await this.page.waitForTimeout(1500);

    // If target date is given (e.g. 2026-09-10), extract the day number
    const dayNumber = targetDateString ? String(parseInt(targetDateString.split('-')[2], 10)) : String(new Date().getDate());

    // Locate date card / cell for that day
    const dateCell = this.page.locator('.calendar-day, .day-cell, .date-cell, .calendar-date, [data-date], tr, td, .card, div')
      .filter({ hasText: new RegExp(`^\\s*${dayNumber}\\b|\\b${dayNumber}\\s*$`, 'i') })
      .filter({ hasText: /Permission/i })
      .first();

    const chip = dateCell.locator('.chip, .badge, .p-badge, .p-tag, span, div, p')
      .filter({ hasText: /Permission requested|Permission/i })
      .or(this.page.locator('.chip, .badge, .p-badge, .p-tag, span, div, p').filter({ hasText: /Permission requested/i }))
      .or(this.page.getByText(/Permission requested/i))
      .first();

    await expect(chip).toBeVisible({ timeout: 15000 });
  }

  async openAttendanceLogsAndVerifyPermissionStatus(expectedStatus: string = 'Requested') {
    // 1. Click on Logs button / tab
    const logsBtn = this.page.getByRole('button', { name: /Logs|View Logs/i })
      .or(this.page.getByRole('tab', { name: /Logs/i }))
      .or(this.page.locator('button, [role="tab"], .nav-link, a, div, span').filter({ hasText: /^Logs$/i }))
      .or(this.page.getByText('Logs', { exact: true }))
      .first();

    await logsBtn.waitFor({ state: 'visible', timeout: 15000 });
    await logsBtn.click();
    await this.page.waitForTimeout(1500);

    // 2. Locate and expand Permission accordion
    const permAccordionHeader = this.page.locator('p-accordion-header, [data-pc-name="accordionheader"], .p-accordion-header, .p-accordionheader, button, div, h2, h3, a')
      .filter({ hasText: /Permission|Permissions/i })
      .first();

    await permAccordionHeader.waitFor({ state: 'visible', timeout: 15000 });

    const isExpanded = await permAccordionHeader.getAttribute('aria-expanded').catch(() => null);
    if (isExpanded !== 'true') {
      await permAccordionHeader.click();
      await this.page.waitForTimeout(1000);
    }

    // 3. Verify status inside accordion shows requested
    const statusElement = this.page.locator('.p-accordion-content, .p-accordioncontent, .p-accordion-panel, [role="region"], div, table, tr, td, span')
      .filter({ hasText: new RegExp(expectedStatus, 'i') })
      .or(this.page.getByText(new RegExp(`^\\s*${expectedStatus}\\s*$|${expectedStatus}`, 'i')))
      .first();

    await expect(statusElement).toBeVisible({ timeout: 10000 });
  }
}

export function formatToDateInput(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFutureDateInput(daysAhead: number = 1): string {
  const target = new Date();
  target.setDate(target.getDate() + daysAhead);
  if (target.getDay() === 0) {
    target.setDate(target.getDate() + 1);
  } else if (target.getDay() === 6) {
    target.setDate(target.getDate() + 2);
  }
  return formatToDateInput(target);
}

export function getPastDateInput(daysPast: number = 1): string {
  const target = new Date();
  target.setDate(target.getDate() - daysPast);
  if (target.getDay() === 0) {
    target.setDate(target.getDate() - 2);
  } else if (target.getDay() === 6) {
    target.setDate(target.getDate() - 1);
  }
  return formatToDateInput(target);
}
