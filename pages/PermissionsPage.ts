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
  readonly breadcrumb: Locator;
  readonly breadcrumbTimeOff: Locator;
  readonly breadcrumbPermissions: Locator;

  // Permissions Dashboard / List View
  readonly requestPermissionButton: Locator;
  readonly waitingForApprovalTab: Locator;
  readonly approvedTab: Locator;
  readonly rejectedTab: Locator;
  readonly cancelledTab: Locator;
  readonly noDataFoundMessage: Locator;
  readonly permissionsTable: Locator;
  readonly permissionRows: Locator;

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
    this.timeOffNav = page.locator('#sidenav-main-drop .nav-item').filter({
      hasText: /^Time Off$/i,
    }).first().or(
      page.getByText('Time Off', { exact: true }).first(),
    );

    this.timeOffToggle = page.locator('#sidenav-main-drop .nav-item').filter({
      hasText: 'Time Off',
    }).locator('[data-bs-toggle="dropdown"]').first().or(
      page.getByText('Time Off').first(),
    );

    this.permissionsTab = page.locator('.dropdown-menu-text, a.dropdown-item, .nav-link, span, div').filter({
      hasText: /^Permissions$/i,
    }).first().or(
      page.getByText('Permissions', { exact: true }).first(),
    );

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

    this.waitingForApprovalTab = page.getByText(/Waiting For Approval/i).first();
    this.rejectedTab = page.getByText(/Rejected/i).first();
    this.cancelledTab = page.getByText(/Cancelled/i).first();
    this.noDataFoundMessage = page.getByText(/No Data Found/i).first();

    this.permissionsTable = page.locator('table, [role="table"], .p-datatable-table').first();
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
    this.requestModal = page.locator('.modal-content, .p-dialog, [role="dialog"]').first();
    this.dateInput = page.getByRole('textbox', { name: 'Date*' }).or(
      page.locator('input[placeholder*="date" i], input[type="date"], input[name*="date" i]'),
    ).first();

    this.durationDropdown = page.locator('#duration').getByRole('button', { name: 'dropdown trigger' }).or(
      page.getByRole('combobox', { name: /duration/i }),
    ).or(
      page.locator('#duration, [formcontrolname="duration"], p-dropdown[id="duration"]'),
    ).first();

    this.permissionTypeDropdown = page.getByRole('combobox', { name: /permission type/i }).or(
      page.locator('[formcontrolname="permissionType"], [formcontrolname="type"], p-dropdown[id="permissionType"]'),
    ).or(
      page.locator('p-dropdown').filter({ hasText: /permission type/i }),
    ).first();

    this.reasonInput = page.getByRole('textbox', { name: 'Reason*' }).or(
      page.locator('textarea[placeholder*="Reason" i], textarea, input[name*="reason" i]'),
    ).first();

    this.requestButton = page.getByRole('button', { name: 'Request', exact: true }).or(
      page.getByRole('button', { name: /Submit|Save/i }),
    ).first();

    this.modalCancelButton = page.getByRole('button', { name: 'Cancel' }).or(
      page.getByRole('dialog').getByText('Cancel'),
    ).first();

    // Cancellation Modal
    this.cancelPermissionAction = page.getByText('Cancel Permission').first();
    this.cancellationModal = page.locator('.modal-content, .p-dialog').filter({
      hasText: /Cancel Permission|cancellation/i,
    }).first();
    this.cancellationReasonInput = page.getByRole('textbox', { name: /cancellation/i }).or(
      page.locator('textarea[placeholder*="cancellation" i], textarea, input[name*="cancel" i]'),
    ).first();
    this.cancellationSubmitButton = page.getByRole('button', { name: 'Submit' }).first();
    this.cancellationCancelButton = page.getByRole('button', { name: 'Cancel' }).first();

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
    this.requestSubmittedToast = page.getByText(/Permission request submitted|Request submitted successfully|submitted successfully|applied successfully/i).first();
    this.permissionCancelledToast = page.getByText(/Permission cancelled|Cancelled successfully/i).first();
    this.permissionApprovedToast = page.getByText(/Permission approved|Approved successfully/i).first();
    this.permissionRejectedToast = page.getByText(/Permission rejected|Rejected successfully/i).first();
  }

  // =========================================================================
  // AUTH & NAVIGATION HELPERS
  // =========================================================================

  async loginAsEmployee(email?: string, password?: string) {
    const empEmail = email || process.env.EMPLOYEE_EMAIL?.trim() || process.env.LOGIN_EMAIL?.trim();
    const empPassword = password || process.env.EMPLOYEE_PASSWORD?.trim() || process.env.LOGIN_PASSWORD?.trim();

    if (!empEmail || !empPassword) {
      throw new Error('Please configure EMPLOYEE_EMAIL/LOGIN_EMAIL and EMPLOYEE_PASSWORD/LOGIN_PASSWORD in .env');
    }

    await this.loginPage.goto();
    await this.loginPage.login(empEmail, empPassword);
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  async openTimeOffMenu() {
    await this.page.waitForTimeout(500);
    const timeOff = this.timeOffNav.first();
    await timeOff.waitFor({ state: 'visible', timeout: 15000 });
    await timeOff.click();
    await this.page.waitForTimeout(500);
  }

  async navigateToPermissionsModule() {
    // If request button is already visible, we are already on permissions page
    if (await this.requestPermissionButton.isVisible({ timeout: 2000 }).catch(() => false)) {
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

    // Wait for permissions module to be loaded
    await this.requestPermissionButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
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
    // Assert both Time Off and Permissions are visible in breadcrumb navigation
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

  async readTabCount(tab: Locator): Promise<number> {
    const text = (await tab.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
    const match = text.match(/\((\d+)\)\s*$/);
    return match ? Number(match[1]) : 0;
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
    await target.click();
    await this.page.waitForTimeout(500);
  }

  // =========================================================================
  // REQUEST PERMISSION FLOW
  // =========================================================================

  async openRequestPermissionModal() {
    await this.requestPermissionButton.click();
    await this.dateInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillPermissionRequest(data: PermissionRequestData) {
    if (data.date) {
      await this.dateInput.fill(data.date);
    }

    // Select duration
    if (data.duration) {
      const durationTrigger = this.page.locator('#duration').getByRole('button', { name: 'dropdown trigger' }).or(
        this.page.getByRole('combobox', { name: /duration/i }),
      ).or(this.page.locator('#duration')).first();
      await durationTrigger.click();
      await this.page.waitForTimeout(300);
      await this.page.locator('.p-dropdown-panel, .p-dropdown-items-wrapper, ul[role="listbox"]').getByText(data.duration, { exact: true }).or(
        this.page.getByRole('option', { name: data.duration }),
      ).first().click();
    }

    // Select permission type (Early Logout, In Between Breaks, Early Login)
    if (data.permissionType) {
      const typeTrigger = this.page.getByRole('combobox', { name: 'Please select permission type' }).or(
        this.page.getByRole('combobox', { name: /permission type/i }),
      ).or(this.page.locator('#permissionType')).first();
      await typeTrigger.click();
      await this.page.waitForTimeout(300);
      await this.page.locator('.p-dropdown-panel, .p-dropdown-items-wrapper, ul[role="listbox"]').getByText(data.permissionType, { exact: true }).or(
        this.page.getByRole('option', { name: data.permissionType }),
      ).first().click();
    }

    // Fill reason
    if (data.reason) {
      await this.reasonInput.fill(data.reason);
    }
  }

  async submitPermissionRequest() {
    await this.requestButton.click();
    await this.page.waitForTimeout(500);
    const toast = this.page.getByText(/Permission request submitted|submitted successfully/i).or(
      this.page.locator('.p-toast-message, .alert, .toast'),
    ).first();
    await toast.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
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
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });
    const actionCell = firstRow.locator('td').last();
    const actionTrigger = actionCell.locator('a, button, i, span, div').first();
    if (await actionTrigger.isVisible().catch(() => false)) {
      await actionTrigger.click();
    } else {
      await actionCell.click();
    }
    await this.cancelPermissionAction.waitFor({ state: 'visible', timeout: 5000 });
  }

  async cancelFirstPermission(reason: string = 'cancellation') {
    await this.openFirstRowActionMenu();
    await this.cancelPermissionAction.click();

    const reasonBox = this.page.getByRole('textbox', { name: /cancellation/i }).or(
      this.cancellationReasonInput,
    );
    await reasonBox.waitFor({ state: 'visible', timeout: 8000 });
    await reasonBox.fill(reason);

    const submitBtn = this.page.getByRole('button', { name: 'Submit' }).or(
      this.cancellationSubmitButton,
    );
    await submitBtn.click();

    await this.permissionCancelledToast.waitFor({ state: 'visible', timeout: 15000 });
  }

  // =========================================================================
  // APPROVER HELPERS (PENDING APPROVALS)
  // =========================================================================

  async gotoPendingApprovalsPermissions() {
    await this.page.goto('/pending-approvals/time-off/permissions/for-you', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
  }

  async filterApproverByEmployee(employeeName: string) {
    if (await this.approverSearchBox.isVisible().catch(() => false)) {
      await this.approverSearchBox.fill(employeeName);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(1000);
    }
  }

  // =========================================================================
  // PERMISSIONS ELIGIBILITY CRITERIA SETTINGS
  // =========================================================================

  async clickSettingsIcon() {
    await this.page.waitForTimeout(500);
    const settingsBtn = this.page.locator('img[src*="setting" i], [aria-label*="Setting" i], .settings-icon, rect').first();
    if (await settingsBtn.isVisible().catch(() => false)) {
      await settingsBtn.click();
    } else {
      await this.page.locator('rect').first().click();
    }
    await this.page.waitForTimeout(500);
  }

  async openPermissionsEligibilitySettings() {
    await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' }).catch(() => {});
    const timeOffPanel = this.page.locator('#settings-panel-2, #settings-panel-time-off').or(
      this.page.locator('p-accordion-header, [data-pc-name="accordionheader"], button').filter({ hasText: /Time Off/i }),
    ).first();
    await timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
    await timeOffPanel.click();

    const attendanceCard = this.page.getByText(/Attendance Eligibility Criteria/i).first();
    await attendanceCard.waitFor({ state: 'visible', timeout: 15000 });
    await attendanceCard.click();

    const permEligibilityLink = this.page.getByRole('link', { name: /Permissions Eligibility/i }).or(
      this.page.getByText('Permissions Eligibility'),
    ).first();
    await permEligibilityLink.waitFor({ state: 'visible', timeout: 15000 });
    await permEligibilityLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  criterionRow(criterion: string) {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: criterion, exact: true }),
    });
  }

  criterionNameCell(criterion: string) {
    return this.page.getByRole('cell', { name: criterion, exact: true });
  }

  criterionValueCell(criterion: string) {
    return this.criterionRow(criterion).getByRole('cell').nth(1);
  }

  criterionKebabMenu(criterion: string) {
    return this.criterionRow(criterion).locator('.dropdown > a, td:last-child a, button.dropdown-toggle').first();
  }

  criterionValueInput(criterion: string) {
    return this.criterionRow(criterion).getByRole('textbox').or(this.page.getByRole('textbox')).first();
  }

  async updateCriterionValue(criterion: string, newValue: string) {
    await this.criterionKebabMenu(criterion).click();
    await this.page.locator('.dropdown-menu.show, .dropdown-menu').getByText('Update', { exact: true }).or(
      this.page.getByText('Update').first(),
    ).first().click();

    const input = this.criterionValueInput(criterion);
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.dblclick();
    await input.fill(newValue);

    await this.page.getByRole('button', { name: 'Update' }).click();
    await this.page.getByText(/Data updated successfully|successfully/i).first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async readCriterionValue(criterion: string): Promise<string> {
    const cell = this.criterionValueCell(criterion);
    await cell.waitFor({ state: 'visible', timeout: 5000 });
    return (await cell.innerText()).trim();
  }

  async readAllPermissionsEligibilityCriteria(): Promise<Record<string, string>> {
    await this.openPermissionsEligibilitySettings();
    const rows = this.page.locator('table tbody tr');
    const count = await rows.count();
    const criteria: Record<string, string> = {};
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const name = (await row.locator('td').first().innerText()).trim();
      const val = (await row.locator('td').nth(1).innerText()).trim();
      if (name) {
        criteria[name] = val;
      }
    }
    return criteria;
  }

  async requestPermissionWithLimitHandling(data: PermissionRequestData, maxFutureDaysAllowed: number = 30) {
    await this.openRequestPermissionModal();
    await this.fillPermissionRequest(data);
    await this.requestButton.click();
    await this.page.waitForTimeout(1000);

    // If limit exceeded or duplicate error prevents submission for that day, request for next available day
    const isModalOpen = await this.dateInput.isVisible({ timeout: 2000 }).catch(() => false);
    if (isModalOpen) {
      for (let daysAhead = 1; daysAhead <= maxFutureDaysAllowed; daysAhead++) {
        const altDate = getFutureDateInput(daysAhead);
        await this.dateInput.fill(altDate);
        await this.requestButton.click();
        await this.page.waitForTimeout(1000);

        const stillOpen = await this.dateInput.isVisible({ timeout: 2000 }).catch(() => false);
        if (!stillOpen) {
          break;
        }
      }
    }
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
  // Advance to next weekday if target falls on a weekend
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

function pageTimeOffLocator(page: Page): Locator {
  return page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Time Off' }).or(
    page.getByText('Time Off', { exact: true }),
  ).first();
}
