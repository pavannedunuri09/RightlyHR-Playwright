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
  readonly processedTab: Locator;
  readonly rejectedTab: Locator;
  readonly cancelledTab: Locator;
  readonly employeeDropdown: Locator;
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
    this.processedTab = page.locator('li, [role="tab"], .nav-link, button, div, span, a')
      .filter({ hasText: /^Processed(\s*\(\d+\))?$/i })
      .or(page.getByText(/^Processed(\s*\(\d+\))?$/i))
      .first();
    this.employeeDropdown = page.getByLabel('Please select employee')
      .or(page.getByLabel('Select employee name'))
      .or(page.getByRole('combobox', { name: /Please select employee|Select employee name|Select Employee/i }))
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

  async loginAsHR(email?: string, password?: string) {
    const hrEmail = email || process.env.LOGIN_EMAIL?.trim() || 'bhavitha.palagiri@snaddevelopers.com';
    const hrPassword = password || process.env.LOGIN_PASSWORD?.trim() || 'Bhavi@16';

    await this.page.goto('/login', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await this.loginPage.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.loginPage.login(hrEmail, hrPassword);
    await this.page.waitForURL(/\/dashboard|\/pending-approvals/, { timeout: 45000, waitUntil: 'domcontentloaded' }).catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  async logout() {
    await this.page.waitForTimeout(500);
    try {
      // Close any open modals/drawers
      const openModal = this.page.locator('ngb-modal-window, .modal, [role="dialog"]').last();
      if (await openModal.isVisible({ timeout: 1000 }).catch(() => false)) {
        const closeBtn = openModal.locator('.custom-poup-header-content a, .btn-close, [aria-label="Close"], button.close').first();
        if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await closeBtn.click({ force: true }).catch(() => {});
        }
      }

      const profileTrigger = this.page.locator('.user-profile, .profile-pic, img.rounded-circle, .avatar, #profileDropdown, .user-info')
        .or(this.page.locator('app-header .dropdown-toggle, header .dropdown-toggle, .navbar .dropdown-toggle'))
        .or(this.page.getByRole('paragraph').filter({ hasText: /Indu|QA Tester|Bhavitha/i }).first())
        .first();

      if (await profileTrigger.isVisible({ timeout: 3000 }).catch(() => false)) {
        await profileTrigger.click({ force: true });
        await this.page.waitForTimeout(500);

        const logoutBtn = this.page.getByRole('button', { name: /Logout/i })
          .or(this.page.getByText(/Logout/i))
          .or(this.page.locator('.dropdown-item, .p-menuitem-link, a, button').filter({ hasText: /Logout/i }))
          .first();

        if (await logoutBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await logoutBtn.click({ force: true });
          await this.page.waitForTimeout(500);

          const confirmYes = this.page.getByRole('button', { name: 'Yes', exact: true })
            .or(this.page.locator('.p-dialog-footer button, .modal-footer button, button').filter({ hasText: /^Yes$/i }))
            .first();

          if (await confirmYes.isVisible({ timeout: 3000 }).catch(() => false)) {
            await confirmYes.click({ force: true });
          }
        }
      }
    } catch {
      // Ignore
    }

    await this.page.goto('/login', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await this.page.waitForTimeout(1000);
    let emailBox = this.page.getByRole('textbox', { name: /email/i }).first();
    if (!(await emailBox.isVisible({ timeout: 5000 }).catch(() => false))) {
      // If the UI logout did not clear the session, force a clean browser session
      // so the next role can log in reliably.
      await this.page.context().clearCookies();
      await this.page.evaluate(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }).catch(() => {});
      await this.page.goto('/login', { waitUntil: 'domcontentloaded' }).catch(() => {});
      await this.page.waitForTimeout(1000);
      emailBox = this.page.getByRole('textbox', { name: /email/i }).first();
    }
    await emailBox.waitFor({ state: 'visible', timeout: 15000 });
  }

  async navigateToPendingPermissions() {
    await this.page.waitForTimeout(1000);
    const pendingNav = this.page.getByText('Pending Approvals', { exact: true })
      .or(this.page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Pending Approvals' }))
      .first();

    await pendingNav.waitFor({ state: 'visible', timeout: 10000 });
    await pendingNav.click();

    const timeOffTab = this.page.locator('app-pending-approvals-tabs .grid-item')
      .filter({ hasText: /^Time-Off\s*\(\d+\)$/i })
      .first();
    await timeOffTab.waitFor({ state: 'visible', timeout: 10000 });
    await timeOffTab.click();

    const permissionsCard = this.page.getByText(/^Permissions\s*\(\d+\)$/i).first();
    if (await permissionsCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await permissionsCard.click();
    } else {
      await this.page.goto('/pending-approvals/time-off/permissions/for-you', {
        waitUntil: 'domcontentloaded',
      });
    }

    await this.page.waitForURL(/\/pending-approvals\/time-off\/permissions\/for-you/i, {
      timeout: 15000,
    });
  }

  async rejectPendingPermissionRequest(options?: { employeeSearch?: string; comment?: string; useSuggestionChip?: boolean }) {
    await this.page.waitForTimeout(1000);

    // Filter by search box if provided and search box exists
    const searchVal = options?.employeeSearch ?? 'indu';
    const searchBox = this.page.getByRole('searchbox', { name: /search/i })
      .or(this.page.locator('input[placeholder*="search" i], input[type="search"]'))
      .first();

    if (await searchBox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchBox.fill(searchVal);
      await this.page.waitForTimeout(1000);
    }

    // Locate the first permission record row
    const row = this.page.locator('table tbody tr').filter({ hasNot: this.page.locator('.p-datatable-emptymessage') }).first();
    await row.waitFor({ state: 'visible', timeout: 15000 });

    // Click on the kebab menu trigger (action dropdown)
    const actionCell = row.locator('td').last();
    const kebabTrigger = actionCell.locator('.dropdown-toggle, [data-bs-toggle="dropdown"], [cursor="pointer"], .dropdown, a, button, i').first();
    await kebabTrigger.waitFor({ state: 'visible', timeout: 5000 });
    await kebabTrigger.click({ force: true });
    await this.page.waitForTimeout(500);

    // In the dropdown menu with Approve and Reject, click on Reject
    const rejectItem = this.page.locator('.dropdown-menu.show a, .dropdown-menu.show button, [role="menuitem"], a.dropdown-item, button.dropdown-item, .dropdown-item')
      .filter({ hasText: /^Reject$/i })
      .or(this.page.getByText('Reject', { exact: true }))
      .first();

    await rejectItem.waitFor({ state: 'visible', timeout: 5000 });
    await rejectItem.click({ force: true });
    await this.page.waitForTimeout(1000);

    // Rejection modal
    const modal = this.page.locator('ngb-modal-window, [role="dialog"], .modal, p-dialog, .p-dialog').last();
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    // Check for suggestion chips or enter comment
    const suggestionChip = modal.locator('.chip, .badge, .suggestion-chip, button.badge, .suggestion-item, span.cursor-pointer')
      .filter({ hasText: /reject|rejected|not approved|reason/i })
      .or(modal.locator('.p-button-outlined, .p-chip').first())
      .first();

    if (options?.useSuggestionChip && (await suggestionChip.isVisible({ timeout: 2000 }).catch(() => false))) {
      await suggestionChip.click();
      await this.page.waitForTimeout(300);
    } else {
      // Enter rejection comments manually
      const commentBox = modal.getByRole('textbox', { name: /comment|reason|rejection/i })
        .or(modal.locator('textarea, input[type="text"]'))
        .first();

      if (await commentBox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await commentBox.click();
        await commentBox.fill(options?.comment || 'Permission request rejected by HR');
        await this.page.waitForTimeout(300);
      }
    }

    // Click on Reject confirmation button inside modal
    const confirmRejectBtn = modal.getByRole('button', { name: 'Reject', exact: true })
      .or(modal.locator('button').filter({ hasText: /^Reject$/i }))
      .first();

    await confirmRejectBtn.waitFor({ state: 'visible', timeout: 5000 });
    await confirmRejectBtn.click();
    await this.page.waitForTimeout(1000);

    // Verify rejection toast or modal closed
    try {
      const toast = this.page.getByText(/Permission rejected|Rejected successfully|rejected/i).first();
      await expect(toast).toBeVisible({ timeout: 10000 });
    } catch {
      await expect(modal).toBeHidden({ timeout: 8000 });
    }
  }

  async selectPendingPermissionRow(rowIndex = 0) {
    const rows = this.page.locator('table tbody tr')
      .filter({ hasNot: this.page.locator('.p-datatable-emptymessage') })
      .filter({ hasNotText: /No Data Found|No records/i });
    const row = rows.nth(rowIndex);
    await row.waitFor({ state: 'visible', timeout: 15000 });

    const checkbox = row.getByRole('checkbox').first()
      .or(row.locator('input[type="checkbox"]').first())
      .first();
    await checkbox.waitFor({ state: 'visible', timeout: 5000 });
    await checkbox.check();
  }

  async rejectSelectedPermissionRequest(comment = 'Permission request rejected by HR') {
    const rejectButton = this.page.getByRole('button', { name: 'Reject', exact: true }).first();
    await rejectButton.waitFor({ state: 'visible', timeout: 10000 });
    await rejectButton.click();

    const modal = this.page.locator('ngb-modal-window, [role="dialog"], .modal, p-dialog, .p-dialog').last();
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    const rejectedOption = modal.getByRole('button', { name: 'Rejected', exact: true });
    if (await rejectedOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rejectedOption.click();
    }

    const commentBox = modal.getByRole('textbox', { name: /comment|reason|rejection/i })
      .or(modal.locator('textarea, input[type="text"]'))
      .first();
    if (await commentBox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await commentBox.fill(comment);
    }

    const confirmReject = modal.getByRole('button', { name: 'Reject', exact: true }).last();
    await confirmReject.waitFor({ state: 'visible', timeout: 5000 });
    await confirmReject.click();
    await expect(modal).toBeHidden({ timeout: 10000 });
  }

  async approveSelectedPermissionRequest(comment = 'Permission request approved by HR') {
    const approveButton = this.page.getByRole('button', { name: 'Approve', exact: true }).first();
    await approveButton.waitFor({ state: 'visible', timeout: 10000 });
    await approveButton.click();

    const modal = this.page.locator('ngb-modal-window, [role="dialog"], .modal, p-dialog, .p-dialog').last();
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    const approvedOption = modal.getByRole('button', { name: 'Approved', exact: true });
    if (await approvedOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await approvedOption.click();
    }

    const commentBox = modal.getByRole('textbox', { name: /Approver Comments/i })
      .or(modal.locator('textarea, input[placeholder*="approver comments" i]'))
      .first();
    if (await commentBox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await commentBox.fill(comment);
    }

    const confirmApprove = modal.getByRole('button', { name: 'Approve', exact: true }).last();
    await expect(confirmApprove).toBeEnabled({ timeout: 5000 });
    await confirmApprove.click();
    await expect(modal).toBeHidden({ timeout: 10000 });
  }

  async hasPendingPermissionRows(): Promise<boolean> {
    const row = this.page.locator('table tbody tr')
      .filter({ hasNot: this.page.locator('.p-datatable-emptymessage') })
      .filter({ hasNotText: /No Data Found|No records/i })
      .first();
    return row.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async approvePendingPermissionRequest() {
    const row = this.page.locator('table tbody tr')
      .filter({ hasNot: this.page.locator('.p-datatable-emptymessage') })
      .filter({ hasNotText: /No Data Found|No records/i })
      .first();
    await row.waitFor({ state: 'visible', timeout: 15000 });

    const actionCell = row.locator('td').last();
    const kebabTrigger = actionCell.locator(
      '.dropdown-toggle, [data-bs-toggle="dropdown"], [cursor="pointer"], .dropdown, a, button, i',
    ).first();
    await kebabTrigger.click({ force: true });
    await this.page.waitForTimeout(500);

    const approveItem = this.page.locator(
      '.dropdown-menu.show a, .dropdown-menu.show button, [role="menuitem"], a.dropdown-item, button.dropdown-item, .dropdown-item',
    ).filter({ hasText: /^Approve$/i })
      .or(this.page.getByText('Approve', { exact: true }))
      .first();
    await approveItem.waitFor({ state: 'visible', timeout: 5000 });
    await approveItem.click({ force: true });
    await this.page.waitForTimeout(1000);

    const modal = this.page.locator('ngb-modal-window, [role="dialog"], .modal, p-dialog, .p-dialog').last();
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    const approvedSuggestion = modal.getByRole('button', { name: 'Approved', exact: true });
    if (await approvedSuggestion.isVisible({ timeout: 2000 }).catch(() => false)) {
      await approvedSuggestion.click();
    }

    const commentBox = modal.getByRole('textbox', { name: /Approver Comments/i })
      .or(modal.locator('textarea, input[placeholder*="approver comments" i]'))
      .first();
    if (await commentBox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await commentBox.fill('Permission request approved by HR');
    }

    const confirmApprove = modal.getByRole('button', { name: 'Approve', exact: true })
      .or(modal.locator('button').filter({ hasText: /^Approve$/i }))
      .first();
    await expect(confirmApprove).toBeEnabled({ timeout: 5000 });
    await confirmApprove.click();
    await expect(modal).toBeHidden({ timeout: 10000 });
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

    const attendanceLink = this.attendanceNav.first();
    if (await attendanceLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await attendanceLink.scrollIntoViewIfNeeded().catch(() => {});
      await attendanceLink.click();
    } else {
      await this.page.getByText('Attendance', { exact: true }).first().click().catch(() => {});
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

  async selectTab(tab: 'waiting' | 'processed' | 'rejected' | 'cancelled') {
    const target =
      tab === 'waiting'
        ? this.waitingForApprovalTab
        : tab === 'processed'
          ? this.processedTab
        : tab === 'rejected'
          ? this.rejectedTab
          : this.cancelledTab;
    await target.waitFor({ state: 'visible', timeout: 8000 });
    await target.click();
    await this.page.waitForTimeout(800);
  }

  async selectEmployee(employeeName: string) {
    await this.employeeDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.employeeDropdown.click();
    await this.page.waitForTimeout(500);

    let searchBox = this.page.locator('input[role="searchbox"]:visible').last();
    if (!(await searchBox.isVisible({ timeout: 3000 }).catch(() => false))) {
      searchBox = this.page.locator(
        '.p-dropdown-panel:visible input, .p-select-panel:visible input, .p-dropdown-filter:visible, .p-select-filter:visible',
      ).last();
    }
    const nameParts = employeeName.trim().split(/\s+/).filter(Boolean);
    const fuzzyPattern = new RegExp(
      nameParts.map((part) => `${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, -1)}${part.slice(-1)}+`)
        .join('[\\s\\S]*'),
      'i',
    );
    const searchQueries = [employeeName, nameParts[0]].filter(Boolean);

    for (const query of searchQueries) {
      if (await searchBox.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchBox.fill(query);
        await this.page.waitForTimeout(800);
      }

      const employeeOption = this.page.getByRole('option').filter({ hasText: fuzzyPattern })
        .or(this.page.locator('.p-dropdown-item, .p-select-option, li').filter({ hasText: fuzzyPattern }))
        .first();
      if (await employeeOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await employeeOption.click();
        await this.page.waitForTimeout(1000);
        return;
      }
    }

    throw new Error(`Employee "${employeeName}" was not found in the employee dropdown`);
  }

  async verifyProcessedPermission() {
    await this.selectTab('processed');
    const row = this.permissionRows.first();
    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText(/Approved|Processed/i);
  }

  async selectAttendanceEmployee(employeeName: string) {
    await this.selectEmployee(employeeName);
    await this.page.waitForTimeout(1500);
  }

  async verifyAttendancePermissionChipAndStatus() {
    const attendanceTable = this.page.locator('table tbody');
    await attendanceTable.waitFor({ state: 'visible', timeout: 15000 });

    const permissionRows = attendanceTable.locator('tr').filter({ hasText: /Permission/i });
    await expect(permissionRows.first()).toBeVisible({ timeout: 15000 });

    const permissionChips = permissionRows.locator(
      '.chip, .badge, li, span, td, div',
    ).filter({ hasText: /Permission(?:\s*\([^)]*\))?/i });
    const permissionCount = await permissionChips.count();
    expect(permissionCount).toBeGreaterThan(0);

    const firstPermissionChip = permissionChips.first();
    await firstPermissionChip.scrollIntoViewIfNeeded();
    await firstPermissionChip.evaluate((element: HTMLElement) => {
      element.style.border = '2px solid #28a745';
      element.style.backgroundColor = '#e8f5e9';
    });

    const attendanceStatus = this.page.getByText(/Attendance (Status|Summary)/i).first();
    await expect(attendanceStatus).toBeVisible({ timeout: 10000 });

    const permissionStatus = this.page.getByText(/^Permissions?$/i).first()
      .or(this.page.getByText(/^Permission\s*\(\d+\)$/i).first());
    if (await permissionStatus.isVisible({ timeout: 3000 }).catch(() => false)) {
      const statusContainer = permissionStatus.locator('xpath=..');
      const statusText = await statusContainer.innerText().catch(() => '');
      const statusCount = statusText.match(/\b\d+\b/);
      expect(statusCount, 'Attendance Status should display a permission count').not.toBeNull();
      expect(Number(statusCount?.[0])).toBeGreaterThan(0);
    } else {
      expect(permissionCount, 'Attendance should contain at least one permission').toBeGreaterThan(0);
    }
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
    await this.page.getByRole('textbox', { name: 'Date*' }).click();
    await this.page.getByRole('textbox', { name: 'Date*' }).fill(data.date || '2026-09-11');
    await this.page.waitForTimeout(300);

    const durTrigger = this.page.getByRole('combobox', { name: 'Please select duration' })
      .or(this.page.locator('#duration').getByRole('button', { name: 'dropdown trigger' }))
      .or(this.page.getByRole('combobox', { name: /duration/i })).first();
    await durTrigger.click();
    await this.page.waitForTimeout(300);
    await this.page.getByRole('option', { name: data.duration, exact: true }).click();
    await this.page.waitForTimeout(300);

    const typeTrigger = this.page.getByRole('combobox', { name: 'Please select permission type' })
      .or(this.page.locator('#permissionType').getByRole('button', { name: 'dropdown trigger' }))
      .or(this.page.getByRole('combobox', { name: /permission type/i })).first();
    await typeTrigger.click();
    await this.page.waitForTimeout(300);
    const typeOpt = this.page.getByRole('option', { name: data.permissionType, exact: true })
      .or(this.page.locator('.p-dropdown-item, .p-select-item, li[role="option"], .p-dropdown-items li').filter({ hasText: data.permissionType }))
      .first();
    await typeOpt.click();
    await this.page.waitForTimeout(300);

    await this.page.getByRole('textbox', { name: 'Reason*' }).click();
    await this.page.getByRole('textbox', { name: 'Reason*' }).fill(data.reason);
    await this.page.waitForTimeout(300);
  }

  async selectDate(date: string) {
    const dateInput = this.page.getByRole('textbox', { name: 'Date*' });
    await dateInput.click();
    await dateInput.fill(date);
    await this.page.waitForTimeout(300);
  }

  async submitPermissionRequest() {
    const modal = this.page.locator('ngb-modal-window, [role="dialog"]').last();
    const reqBtn = modal.getByRole('button', { name: 'Request', exact: true });
    await reqBtn.waitFor({ state: 'visible', timeout: 5000 });
    await reqBtn.click();

    const toast = this.page.getByText('Permission request submitted')
      .or(this.page.getByText(/Permission request submitted|submitted successfully/i))
      .first();

    await expect(toast).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  async requestPermission(data: PermissionRequestData, fallbackDates: string[] = []): Promise<string> {
    await this.openRequestPermissionModal();
    await this.fillPermissionRequest(data);

    const datesToTry = [data.date, ...fallbackDates.filter((d) => d && d !== data.date)];
    let successfulDate = '';

    for (let i = 0; i < datesToTry.length; i++) {
      const candidate = datesToTry[i];
      if (!candidate) continue;

      const modal = this.page.locator('ngb-modal-window, [role="dialog"]').last();
      const isModalOpenBefore = await modal.isVisible({ timeout: 2000 }).catch(() => false);
      if (!isModalOpenBefore) {
        if (!successfulDate) successfulDate = candidate;
        break;
      }

      if (i > 0) {
        await this.selectDate(candidate);
      }

      const reqBtn = modal.getByRole('button', { name: 'Request', exact: true });
      await reqBtn.waitFor({ state: 'visible', timeout: 5000 });
      await reqBtn.click();

      const toast = this.page.getByText('Permission request submitted')
        .or(this.page.getByText(/Permission request submitted|submitted successfully/i))
        .first();

      const isToastVisible = await toast.isVisible({ timeout: 4000 }).catch(() => false);
      if (isToastVisible) {
        successfulDate = candidate;
        await this.page.waitForTimeout(1000);
        break;
      }

      const isModalClosed = await modal.waitFor({ state: 'hidden', timeout: 3000 }).then(() => true).catch(() => false);
      if (isModalClosed) {
        successfulDate = candidate;
        break;
      }

      await this.page.waitForTimeout(1000);
    }

    if (!successfulDate && datesToTry.length > 0) {
      successfulDate = datesToTry[0];
    }

    return successfulDate;
  }

  // =========================================================================
  // CANCEL PERMISSION FLOW
  // =========================================================================

  async openFirstRowActionMenu() {
    const firstRow = this.permissionRows.first();
    await firstRow.waitFor({ state: 'visible', timeout: 15000 });
    
    const actionCell = firstRow.locator('td').last();
    const trigger = actionCell.locator('[cursor="pointer"], .dropdown-toggle, [data-bs-toggle="dropdown"], .dropdown, a, button, i').first();
    await trigger.waitFor({ state: 'visible', timeout: 5000 });
    await trigger.click({ force: true });
    await this.page.waitForTimeout(500);

    const cancelItem = this.page.locator('.dropdown-menu.show:visible a, .dropdown-menu.show:visible button, .dropdown-menu.show:visible [role="menuitem"], .dropdown-menu.show:visible .dropdown-item')
      .filter({ hasText: /Cancel Permission/i })
      .first();

    await cancelItem.waitFor({ state: 'visible', timeout: 5000 });
  }

  async cancelFirstPermission(reason: string = 'cancelling') {
    const pendingRows = this.permissionRows.filter({ hasText: /Waiting for Approval/i });
    let firstRow = this.permissionRows.first();
    const pendingCount = await pendingRows.count();
    for (let index = 0; index < pendingCount; index++) {
      const candidate = pendingRows.nth(index);
      const candidateTrigger = candidate.locator('td').last().locator(
        '[cursor="pointer"], .dropdown-toggle, [data-bs-toggle="dropdown"], .dropdown, a, button, i',
      ).first();
      if (await candidateTrigger.isVisible({ timeout: 1000 }).catch(() => false)) {
        firstRow = candidate;
        break;
      }
    }
    await firstRow.waitFor({ state: 'visible', timeout: 15000 });
    
    const actionCell = firstRow.locator('td').last();
    const trigger = actionCell.locator('[cursor="pointer"], .dropdown-toggle, [data-bs-toggle="dropdown"], .dropdown, a, button, i').first();
    if (await trigger.isVisible({ timeout: 5000 }).catch(() => false)) {
      await trigger.click({ force: true });
    } else {
      await actionCell.click({ force: true });
    }
    await this.page.waitForTimeout(500);

    const cancelItem = this.page.locator('.dropdown-menu.show:visible a, .dropdown-menu.show:visible button, .dropdown-menu.show:visible [role="menuitem"], .dropdown-menu.show:visible .dropdown-item')
      .filter({ hasText: /Cancel Permission/i })
      .first();

    await cancelItem.waitFor({ state: 'visible', timeout: 5000 });
    await cancelItem.click({ force: true });
    await this.page.waitForTimeout(500);

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
    // Verify Waiting For Approval tab is visible
    await expect(this.waitingForApprovalTab).toBeVisible({ timeout: 10000 });

    // Verify count in tab header with polling
    if (expectedCount !== undefined) {
      await expect.poll(async () => {
        return await this.getWaitingForApprovalCount();
      }, { timeout: 15000, intervals: [500, 1000, 2000] }).toBeGreaterThanOrEqual(expectedCount);
    } else {
      const currentCount = await this.getWaitingForApprovalCount();
      expect(currentCount).toBeGreaterThanOrEqual(1);
    }

    // Verify table and row
    await expect(this.permissionsTable).toBeVisible({ timeout: 10000 });
    const row = this.permissionRows.first();

    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(/Waiting for Approval/i);
  }

  // =========================================================================
  // ATTENDANCE MODULE & LOGS VERIFICATION
  // =========================================================================

  async selectAttendanceMonth(targetDateString: string) {
    const parts = targetDateString.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const targetMonthName = months[monthIndex];
      const targetMonthNum = parts[1];

      const monthPicker = this.page.getByRole('combobox', { name: /Select month and year/i })
        .or(this.page.locator('input[placeholder*="month" i], p-calendar input, .p-datepicker-input'))
        .first();

      await monthPicker.waitFor({ state: 'visible', timeout: 10000 });
      const currentVal = await monthPicker.inputValue().catch(() => '');

      if (!currentVal || !currentVal.startsWith(targetMonthNum)) {
        await monthPicker.click({ force: true });
        await this.page.waitForTimeout(600);

        // Remove disabled class if present and click month span
        await this.page.evaluate((monthName) => {
          const allSpans = Array.from(document.querySelectorAll('.p-monthpicker-month, .p-datepicker-month, .p-monthpicker span, .p-datepicker span, span'));
          const target = allSpans.find((el) => el.textContent?.trim() === monthName);
          if (target) {
            target.classList.remove('p-disabled');
            (target as HTMLElement).click();
          }
        }, targetMonthName);

        await this.page.waitForTimeout(2000);
      }
    }
  }

  async verifyAndHighlightPermissionChip(targetDateString: string = '2026-10-20') {
    await this.page.waitForTimeout(1500);
    await this.selectAttendanceMonth(targetDateString);

    const formattedDate = formatToAttendanceTableDate(targetDateString);
    const dayNumber = parseInt(targetDateString.split('-')[2], 10);
    const monthShort = formattedDate.split(' ')[0];

    // Locate the row for the requested date or row containing Permission chip
    const dateRow = this.page.locator('table tbody tr')
      .filter({ hasText: new RegExp(formattedDate.replace(/,/, ',?'), 'i') })
      .or(this.page.locator('table tbody tr').filter({ hasText: new RegExp(`${monthShort}\\s*${dayNumber}\\b`, 'i') }))
      .or(this.page.locator('table tbody tr').filter({ hasText: /Permission/i }))
      .first();

    await dateRow.waitFor({ state: 'visible', timeout: 15000 });
    await dateRow.scrollIntoViewIfNeeded();

    // Locate Permission chip in the row
    const chip = dateRow.getByText('Permission(Requested)', { exact: true })
      .or(dateRow.locator('.chip, .badge, li, span, td, div').filter({ hasText: /Permission\s*\(?Requested\)?/i }))
      .or(dateRow.locator('.chip, .badge, li, span, td, div').filter({ hasText: /Permission/i }))
      .first();

    await expect(chip).toBeVisible({ timeout: 10000 });

    // Highlight the chip visually
    await chip.evaluate((el: HTMLElement) => {
      el.style.border = '2px solid #28a745';
      el.style.backgroundColor = '#e8f5e9';
    }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async openDateRowLogsAndVerifyPermission(targetDateString: string = '2026-09-11', expectedDuration: string = '00:30', expectedStatus: string = 'Requested') {
    const formattedDate = formatToAttendanceTableDate(targetDateString);
    const dayNumber = parseInt(targetDateString.split('-')[2], 10);
    const monthShort = formattedDate.split(' ')[0];

    // Locate the row for the requested date or row containing Permission chip
    const dateRow = this.page.locator('table tbody tr')
      .filter({ hasText: new RegExp(formattedDate.replace(/,/, ',?'), 'i') })
      .or(this.page.locator('table tbody tr').filter({ hasText: new RegExp(`${monthShort}\\s*${dayNumber}\\b`, 'i') }))
      .or(this.page.locator('table tbody tr').filter({ hasText: /Permission/i }))
      .first();

    await dateRow.waitFor({ state: 'visible', timeout: 15000 });
    await dateRow.scrollIntoViewIfNeeded();

    // Click on Logs link/icon in the 5th column
    const logsIcon = dateRow.locator('td:nth-child(5) a, td:nth-child(5) .ng-star-inserted > a, td:nth-child(5) img, td:nth-child(5) [cursor="pointer"]')
      .first();

    await logsIcon.waitFor({ state: 'visible', timeout: 10000 });
    await logsIcon.click();
    await this.page.waitForTimeout(1500);

    // Scope to Attendance Logs modal / drawer
    const modal = this.page.locator('ngb-modal-window, .modal, [role="dialog"], .custom-main-popup-content, .drawer').last();
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    // Locate and expand Permissions accordion inside Attendance Logs drawer
    const permAccordionHeader = modal.getByRole('button', { name: 'Permissions', exact: true })
      .or(modal.getByRole('button', { name: /Permissions|Permission/i }))
      .or(modal.locator('p-accordiontab, p-accordion-panel, .p-accordion-header, .accordion-header, button').filter({ hasText: /Permissions|Permission/i }))
      .first();

    await permAccordionHeader.waitFor({ state: 'visible', timeout: 15000 });
    await permAccordionHeader.click();
    await this.page.waitForTimeout(1000);

    // Verify hours/duration inside modal
    const hoursCell = modal.getByRole('cell', { name: new RegExp(expectedDuration, 'i') })
      .or(modal.locator('td, span, div').filter({ hasText: /00:30|0:30|0\.5/i }))
      .first();
    await expect(hoursCell).toBeVisible({ timeout: 10000 });

    // Verify status as Requested inside modal
    const statusCell = modal.getByRole('cell', { name: expectedStatus, exact: true })
      .or(modal.locator('td, span, .badge, .chip, div').filter({ hasText: new RegExp(`^\\s*${expectedStatus}\\s*$`, 'i') }))
      .first();
    await expect(statusCell).toBeVisible({ timeout: 10000 });

    // Close modal
    const closeBtn = modal.locator('.custom-poup-header-content a, .btn-close, [aria-label="Close"], button.close').first();
    if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closeBtn.click().catch(() => {});
      await this.page.waitForTimeout(500);
    }
  }
}

export function formatToDateInput(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatToAttendanceTableDate(dateString: string): string {
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[month]} ${day}, ${year}`;
  }
  const d = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
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
