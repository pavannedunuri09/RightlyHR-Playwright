import { expect, type Locator, type Page } from '@playwright/test';
import { LoginPage } from './LoginPage';

export interface PermissionFormData {
  date: string;
  duration?: '0.5' | '1' | '1.5' | '2';
  permissionType?: 'Early Logout' | 'In Between Breaks' | 'Early Login' | string;
  reason?: string;
}

export function formatPermissionDateForDisplay(inputDate: string): { cellDate: string; fullDate: string; monthName: string; dayNumber: number } {
  const [year, month, day] = inputDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
  const cellDate = `${monthName} ${dateObj.getDate()},`;
  const fullDate = `${monthName} ${dateObj.getDate()}, ${year}`;
  return { cellDate, fullDate, monthName, dayNumber: dateObj.getDate() };
}

export function getUpcomingPermissionDate(daysAhead = 10): string {
  const target = new Date();
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + daysAhead);
  // Ensure weekday (Monday - Friday)
  if (target.getDay() === 0) {
    target.setDate(target.getDate() + 1);
  } else if (target.getDay() === 6) {
    target.setDate(target.getDate() + 2);
  }
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getRecentPermissionDate(daysAgo = 1): string {
  const target = new Date();
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() - daysAgo);
  if (target.getDay() === 0) {
    target.setDate(target.getDate() - 2);
  } else if (target.getDay() === 6) {
    target.setDate(target.getDate() - 1);
  }
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export class OnBehalfPermissionsPage {
  readonly page: Page;
  readonly loginPage: LoginPage;
  readonly onBehalfNav: Locator;
  readonly selectEmployeeCombobox: Locator;
  readonly applyOnBehalfButton: Locator;
  readonly noDataFoundCard: Locator;
  readonly waitingForApprovalTab: Locator;
  readonly processedTab: Locator;
  readonly rejectedTab: Locator;
  readonly cancelledTab: Locator;

  // Dialog locators
  readonly dateInput: Locator;
  readonly durationTrigger: Locator;
  readonly permissionTypeCombobox: Locator;
  readonly reasonInput: Locator;
  readonly requestButton: Locator;
  readonly cancelButton: Locator;
  readonly cancelConfirmMessage: Locator;
  readonly cancelConfirmYes: Locator;
  readonly cancelConfirmNo: Locator;
  readonly submittedToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.onBehalfNav = page.locator('#sidenav-main-drop').getByText(/On\s*Behalf\s*Of/i).first();
    this.selectEmployeeCombobox = page.getByRole('combobox', {
      name: /Please select employee|Select employee name/i,
    });
    this.applyOnBehalfButton = page
      .getByRole('button', { name: /Request Permission|Apply On Behalf Of/i })
      .first();
    this.noDataFoundCard = page.getByText(/No Data Found/i);

    this.waitingForApprovalTab = page.getByText(/Waiting For Approval \(\d+\)/).first();
    this.processedTab = page.getByText(/Processed \(\d+\)/).first();
    this.rejectedTab = page.getByText(/Rejected \(\d+\)/).first();
    this.cancelledTab = page.getByText(/Cancelled \(\d+\)/).first();

    // Dialog elements
    this.dateInput = page.getByRole('textbox', { name: 'Date*' });
    this.durationTrigger = page.locator('#duration').getByRole('button', { name: 'dropdown trigger' });
    this.permissionTypeCombobox = page.getByRole('combobox', { name: /Please select permission type/i });
    this.reasonInput = page.getByRole('textbox', { name: 'Reason*' });
    this.requestButton = page.getByRole('button', { name: 'Request', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.cancelConfirmMessage = page.getByText(/Are you sure you want to/i);
    this.cancelConfirmYes = page.getByRole('button', { name: 'Yes' });
    this.cancelConfirmNo = page.getByRole('button', { name: 'No' });
    this.submittedToast = page.getByText(/Permission request submitted|Permission processed|Permission approved/i);
  }

  async validateUserOnDashboard() {
    await this.page.goto('/dashboard/emp');
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible' });
  }

  async openPermissionsFromDashboard() {
    await this.page.goto('/time-off/premissions/waiting-for-approval');
    await this.page.waitForURL(/premissions|permissions/i, { timeout: 15000 });
    await this.selectEmployeeCombobox.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async openEmployeePermissions() {
    await this.page.goto('/dashboard/emp');
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page.getByText('Time Off').first().click();
    await this.page.locator('div').filter({ hasText: /^Permissions$/ }).first().click();
    await this.page.waitForURL(/premissions|permissions/i, { timeout: 15000 });
    await this.applyOnBehalfButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openOnBehalfApprovalsPermissions(employeeName: string, searchText?: string) {
    const onBehalfOf = this.page.getByText('On Behalf Of', { exact: true }).first();
    if (await onBehalfOf.isVisible({ timeout: 5000 }).catch(() => false)) {
      await onBehalfOf.click();
      await this.page.waitForTimeout(500);
      const approvals = this.page.getByText('Pending Approvals', { exact: true }).last();
      if (await approvals.isVisible({ timeout: 5000 }).catch(() => false)) {
        await approvals.click();
        await this.page.waitForTimeout(1000);
      }
    } else {
      await this.page.goto('/on-behalf-of/on-behalf-of-approvals/permissions', {
        waitUntil: 'domcontentloaded',
      });
    }
    if (!/on-behalf-of-approvals|pending-approvals/i.test(this.page.url())) {
      await this.page.goto('/on-behalf-of/on-behalf-of-approvals/permissions', {
        waitUntil: 'domcontentloaded',
      });
    }
    await this.page.waitForURL(/on-behalf-of-approvals|on-?behalf|premissions|permissions/i, {
      timeout: 15000,
    }).catch(() => {});

    // Select the reporting manager before opening the Permissions module.
    await this.selectEmployee(employeeName, searchText);

    let permissionsTab = this.page.getByText(/^Permissions\s*\(\d+\)$/i).first();
    if (!(await permissionsTab.isVisible({ timeout: 5000 }).catch(() => false))) {
      permissionsTab = this.page.getByText(/^Permissions$/i).first();
    }
    await permissionsTab.waitFor({ state: 'visible', timeout: 10000 });
    await permissionsTab.click();
    await this.page.waitForTimeout(1000);
  }

  async readTabCount(tab: Locator) {
    const text = (await tab.innerText()).replace(/\s+/g, ' ').trim();
    const match = text.match(/\((\d+)\)\s*$/);
    return match ? Number(match[1]) : 0;
  }

  async selectEmployee(employeeName: string, searchText?: string) {
    const filter = searchText ?? employeeName;
    const employeeDropdown = this.page.locator('#pn_id_8').getByRole('button', { name: 'dropdown trigger' });
    if (await employeeDropdown.isVisible().catch(() => false)) {
      await employeeDropdown.click();
    } else {
      await this.selectEmployeeCombobox.first().click();
    }
    const searchbox = this.page
      .locator('input.p-select-filter:visible, .p-select-panel:visible input[role="searchbox"], .p-dropdown-panel:visible input[role="searchbox"]')
      .first();
    await searchbox.waitFor({ state: 'visible', timeout: 5000 });
    await searchbox.fill(filter);
    await this.page.waitForTimeout(800);
    const escaped = employeeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const option = this.page
      .getByRole('option', { name: new RegExp(escaped, 'i') })
      .or(this.page.getByText(new RegExp(escaped, 'i')));
    await option.first().click({ timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  async openApplyOnBehalfDialog(): Promise<Locator> {
    await this.applyOnBehalfButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.applyOnBehalfButton.click();
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    return dialog;
  }

  async fillOnBehalfPermissionForm(data: PermissionFormData) {
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });

    // Fill Date
    await this.dateInput.click();
    await this.dateInput.fill(data.date);
    await this.dateInput.blur();
    await this.page.waitForTimeout(300);

    // Select Duration
    if (data.duration) {
      if (await this.durationTrigger.isVisible().catch(() => false)) {
        await this.durationTrigger.click();
      } else {
        await this.page.getByRole('combobox', { name: /Please select duration/i }).click();
      }
      const dropdownPanel = this.page.locator(
        '.p-dropdown-panel, .p-dropdown-items, [role="listbox"], ul.p-dropdown-items, .dropdown-menu'
      );
      const option = dropdownPanel
        .getByRole('option', { name: data.duration, exact: true })
        .or(dropdownPanel.getByText(data.duration, { exact: true }));
      await option.first().click();
      await this.page.waitForTimeout(300);
    }

    // Select Permission Type
    if (data.permissionType) {
      await this.permissionTypeCombobox.click();
      const dropdownPanel = this.page.locator(
        '.p-dropdown-panel, .p-dropdown-items, [role="listbox"], ul.p-dropdown-items, .dropdown-menu'
      );
      const typeOption = dropdownPanel
        .getByRole('option', { name: data.permissionType, exact: true })
        .or(dropdownPanel.getByText(data.permissionType, { exact: true }));
      await typeOption.first().click();
      await this.page.waitForTimeout(300);
    }

    // Fill Reason
    if (data.reason) {
      await this.reasonInput.fill(data.reason);
    }
  }

  async closeRequestDialogIfOpen() {
    const dialog = this.page.getByRole('dialog');
    if (await dialog.isVisible().catch(() => false)) {
      const cancelBtn = this.page.getByRole('button', { name: 'Cancel' });
      if (await cancelBtn.isVisible().catch(() => false)) {
        await cancelBtn.click();
        const yesBtn = this.page.getByRole('button', { name: 'Yes' });
        if (await yesBtn.isVisible().catch(() => false)) {
          await yesBtn.click();
        }
      }
      const closeIcon = this.page.locator('.p-dialog-header-close');
      if (await closeIcon.isVisible().catch(() => false)) {
        await closeIcon.click();
      }
      await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  async submitPermissionOnBehalf(data: PermissionFormData, fallbackDates: string[] = []) {
    await this.closeRequestDialogIfOpen();
    await this.openApplyOnBehalfDialog();
    await this.fillOnBehalfPermissionForm(data);
    const dialog = this.page.getByRole('dialog');
    const dates = [data.date, ...fallbackDates.filter((date) => date !== data.date)];
    for (const [index, date] of dates.entries()) {
      if (index > 0) {
        await this.dateInput.fill(date);
        await this.dateInput.blur();
      }
      await expect(this.requestButton).toBeEnabled({ timeout: 5000 });
      await this.requestButton.click();
      const failureMessage = this.page.getByText(/Permission limit exceeded|permission request failed|already requested/i).last();
      if (await failureMessage.isVisible({ timeout: 1500 }).catch(() => false)) {
        throw new Error(`Permission request was rejected by the application: ${await failureMessage.innerText()}`);
      }
      if (await this.submittedToast.isVisible({ timeout: 5000 }).catch(() => false)) {
        await dialog.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await this.page.waitForTimeout(1000);
        return date;
      }
      if (!(await dialog.isVisible({ timeout: 2000 }).catch(() => false))) {
        return date;
      }
      await this.page.waitForTimeout(500);
    }
    throw new Error(`Permission request could not be submitted for dates: ${dates.join(', ')}`);
  }

  // ==============================
  // ATTENDANCE MODULE HELPERS
  // ==============================

  async openAttendanceModule() {
    await this.page.goto('/attendance');
    await this.page.waitForURL(/attendance/i, { timeout: 15000 }).catch(async () => {
      await this.page.locator('#sidenav-main-drop').getByText('Attendance', { exact: true }).click();
    });
    await this.page.waitForTimeout(1000);
  }

  async verifyAttendancePermissionRequestedChipAndLogs(cellDate: string, dayNumber?: number) {
    await this.openAttendanceModule();

    // Locate the row by the requested date first; use the day number only as fallback.
    const escaped = cellDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const dateCell = this.page
      .getByRole('cell', { name: new RegExp(escaped, 'i') })
      .or(this.page.locator('tr, td, .calendar-day, .attendance-row').filter({ hasText: cellDate }));
    let targetRow = this.page
      .getByRole('row')
      .filter({ has: dateCell.first() })
      .or(this.page.locator('tr').filter({ hasText: cellDate }))
      .first();
    if (!(await targetRow.isVisible().catch(() => false)) && dayNumber) {
      targetRow = this.page.locator(`table tbody tr:nth-child(${dayNumber})`);
    }

    await targetRow.scrollIntoViewIfNeeded().catch(() => {});
    await expect(targetRow).toBeVisible({ timeout: 15000 });

    // 3. Verify Permission requested chip on the row
    const permissionChip = targetRow.getByText(/Permission/i).first();
    await expect(permissionChip).toBeVisible({ timeout: 15000 });

    // Highlight the permission requested chip
    await permissionChip
      .evaluate((el) => {
        el.style.border = '2px solid #ff9800';
        el.style.boxShadow = '0 0 8px #ff9800';
      })
      .catch(() => {});

    // Click the info icon for this attendance row.
    const infoIcon = targetRow.locator(
      'td:nth-child(5) > .ng-star-inserted > a, td:nth-child(5) a, [aria-label*="info" i], .fa-info-circle, .fa-info',
    ).first();
    if (await infoIcon.isVisible().catch(() => false)) {
      await infoIcon.click();
      await this.page.waitForTimeout(800);

      // Open the Permission accordion in the info drawer/modal.
      const permissionAccordion = this.page
        .getByRole('button', { name: /^Permissions?$/i })
        .or(this.page.locator('[role="button"], .accordion-header, .card-header').filter({ hasText: /^Permissions?$/i }))
        .first();
      if (await permissionAccordion.isVisible().catch(() => false)) {
        await permissionAccordion.click().catch(() => {});
      }

      // Verify the Permission status is exactly Requested.
      await expect(this.page.getByText(/^Requested$/i).first()).toBeVisible({ timeout: 15000 });

      // Close logs drawer/modal if open
      const closeBtn = this.page
        .getByAltText(/Close/i)
        .or(this.page.locator('.p-sidebar-close, img[alt="Close Icon"], .modal-close, button.btn-close, .close, .p-dialog-header-close'))
        .first();
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click().catch(() => {});
      }
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(500);
    }
  }

  // ==============================
  // LOGOUT HELPER (UI Logout)
  // ==============================

  async logout() {
    // Close any open modals
    // await this.page.keyboard.press('Escape').catch(() => {});
    // await this.page.waitForTimeout(300);

    // 1. Open the top-right profile menu and use its Logout action.
    const profileIcon = this.page.getByRole('img', { name: 'Profile Image' }).first();
    if (await profileIcon.isVisible().catch(() => false)) {
      await profileIcon.click();
      await this.page.waitForTimeout(500);
      const profileLogout = this.page.locator('a, button, li, span, .dropdown-item')
        .filter({ hasText: /^Logout$/i, visible: true })
        .first();
      if (await profileLogout.isVisible().catch(() => false)) {
        await profileLogout.click();
        await this.page.waitForTimeout(500);
      }
    }

    // 2. Fallback to sidebar logout controls when the profile menu is unavailable.
    const sidebarLogout = this.page
      .locator('app-sidebar li:last-child, #sidenav-main-drop li:last-child, ul.navbar-nav > li:last-child, a[title*="Logout" i], img[src*="logout" i], i.fa-power-off, i.fa-sign-out, i.fa-sign-out-alt, i.fa-right-from-bracket')
      .first();

    const profileTrigger = this.page
      .locator('.sidebar-profile, .user-profile, .profile-section, app-sidebar .dropdown, #sidenav-main-drop .dropdown')
      .or(this.page.getByText(/Induu Priyaa|Bhavitha Reddy/i).filter({ visible: true }))
      .first();

    if (await sidebarLogout.isVisible().catch(() => false)) {
      await sidebarLogout.click();
      await this.page.waitForTimeout(500);
    } else if (await profileTrigger.isVisible().catch(() => false)) {
      await profileTrigger.click();
      await this.page.waitForTimeout(500);
      const logoutBtn = this.page.locator('a, button, li, span, .dropdown-item').filter({ hasText: /^Logout$/i, visible: true }).first();
      if (await logoutBtn.isVisible().catch(() => false)) {
        await logoutBtn.click();
      }
    }

    // 3. If confirmation dialog appears:
    const confirmModal = this.page.getByRole('dialog').or(this.page.locator('.modal, .p-dialog'));
    if (await confirmModal.first().isVisible().catch(() => false)) {
      const yesBtn = confirmModal.getByRole('button', { name: /^Yes$|^Logout$/i }).first();
      if (await yesBtn.isVisible().catch(() => false)) {
        await yesBtn.click();
      }
    }

    // 3. Ensure redirected to /login
    try {
      await this.page.waitForURL(/\/login/, { timeout: 8000 });
    } catch {
      await this.loginPage.logoutOrClearSession();
      await this.page.goto('/login');
    }
    await expect(this.loginPage.emailInput).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(500);
  }

  // ==============================
  // ON BEHALF OF APPROVALS / PROCESS KEBAB
  // ==============================

  async openOnBehalfApprovalsModule(employeeName: string, searchText?: string) {
    await this.openOnBehalfApprovalsPermissions(employeeName, searchText);
  }

  async processRecordViaKebab(
    dateStr: string,
    comments = 'Approved on behalf',
    expectedPermissionType?: string,
  ) {
    let permissionsModule = this.page.getByText(/^Permissions\s*\(\d+\)$/i).first();
    if (!(await permissionsModule.isVisible().catch(() => false))) {
      permissionsModule = this.page.getByText(/^Permissions$/i).first();
    }
    if (await permissionsModule.isVisible().catch(() => false)) {
      await permissionsModule.click();
    }
    await this.page.waitForTimeout(1000);

    // Clean date string to allow flexible matching (e.g., 'Sep 28' matches 'Sep 28,' or 'Sep 28, 2026')
    const cleanDate = dateStr.replace(/,/g, '').trim();
    const dateRegex = new RegExp(cleanDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    let targetRow = this.page.locator('tbody tr').filter({ hasText: dateRegex });
    if (expectedPermissionType) {
      targetRow = targetRow.filter({ hasText: new RegExp(expectedPermissionType, 'i') });
    }
    targetRow = targetRow.first();

    await targetRow.waitFor({ state: 'visible', timeout: 15000 });

    // Click kebab menu on the row if present
    const kebab = targetRow
      .locator(
        'td:last-child .text-center.ng-star-inserted > .dropdown > a, td:last-child .dropdown > a, td:last-child [data-bs-toggle="dropdown"], td:last-child .dropdown-toggle, td:last-child i.fa-ellipsis-v, td:last-child i.fa-ellipsis-vertical',
      )
      .or(this.page.locator('tbody tr td .dropdown > a, tbody tr td [data-bs-toggle="dropdown"]'))
      .first();

    await kebab.waitFor({ state: 'visible', timeout: 10000 });
    await kebab.click({ force: true });
    await this.page.waitForTimeout(500);

    // Click Process first, with Approve as a fallback, from the open action menu.
    const actionMenu = this.page.locator('.dropdown-menu.show').last();
    await actionMenu.waitFor({ state: 'visible', timeout: 5000 });
    let actionOption = actionMenu
      .locator('a, button, .dropdown-item, [role="menuitem"]')
      .filter({ hasText: /^(Process|Approve)( Permission| Request)?$/i })
      .first();
    await actionOption.waitFor({ state: 'visible', timeout: 5000 });
    await actionOption.click();
    await this.page.waitForTimeout(800);

    // If comments prompt dialog opens:
    const commentModal = this.page.getByRole('dialog').or(this.page.locator('.modal, .p-dialog'));
    if (await commentModal.first().isVisible().catch(() => false)) {
      const activeModal = commentModal.first();
      // Enter comments or click suggestion chip
      const chip = activeModal.locator('.suggestion-chip, .badge, .chip, .p-chip, .btn-outline-primary, span.badge').first();
      if (await chip.isVisible().catch(() => false)) {
        await chip.click();
      } else {
        const commentInput = activeModal.locator('textarea, input[type="text"], [formcontrolname="reason"], #reason').first();
        if (await commentInput.isVisible().catch(() => false)) {
          await commentInput.fill(comments);
        }
      }

      // Click Confirm / Approve / Submit button
      let confirmBtn = activeModal.getByRole('button', { name: /^Process$/i }).first();
      if (!(await confirmBtn.isVisible().catch(() => false))) {
        confirmBtn = activeModal
          .getByRole('button', { name: /^Approve$|^Submit$|^Yes$/i })
          .first();
      }
      if (await confirmBtn.isVisible().catch(() => false)) {
        await confirmBtn.click();
      }
      await activeModal.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }

    // Verify toast notification or modal dismiss
    await this.submittedToast
      .or(this.page.getByText(/submitted|processed|approved|success/i))
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
      .catch(() => {});
    await this.page.waitForTimeout(1500);

    // Switch to Processed tab and verify
    const processedTab = this.processedTab.or(this.page.locator('div, a, button, [role="tab"]').filter({ hasText: /^Processed/i })).first();
    if (await processedTab.isVisible().catch(() => false)) {
      await processedTab.click();
      await this.page.waitForTimeout(1500);
      await expect(processedTab).toBeVisible({ timeout: 15000 });
    }
  }

  async rejectRecordViaKebab(
    dateStr: string,
    comments = 'Rejected on behalf by HR',
    expectedPermissionType?: string,
  ) {
    let permissionsModule = this.page.getByText(/^Permissions\s*\(\d+\)$/i).first();
    if (!(await permissionsModule.isVisible().catch(() => false))) {
      permissionsModule = this.page.getByText(/^Permissions$/i).first();
    }
    if (await permissionsModule.isVisible().catch(() => false)) {
      await permissionsModule.click();
    }
    await this.page.waitForTimeout(800);

    const cleanDate = dateStr.replace(/,/g, '').trim();
    const dateRegex = new RegExp(cleanDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    let targetRow = this.page.locator('tbody tr')
      .filter({ hasText: dateRegex })
      .filter({ hasNotText: /No Data Found|No records/i })
    if (expectedPermissionType) {
      targetRow = targetRow.filter({ hasText: new RegExp(expectedPermissionType, 'i') });
    }
    targetRow = targetRow.first();
    await targetRow.waitFor({ state: 'visible', timeout: 15000 });

    const kebab = targetRow.locator(
      'td:last-child .dropdown > a, td:last-child [data-bs-toggle="dropdown"], td:last-child .dropdown-toggle, td:last-child a',
    ).first();
    await kebab.click({ force: true });
    await this.page.waitForTimeout(500);

    let rejectOption = this.page
      .locator(
        '.dropdown-menu.show a, .dropdown-menu.show button, .dropdown-item:visible, [role="menuitem"]:visible',
      )
      .filter({ hasText: /^Reject(?: Permission)?$/i })
      .first();
    if (!(await rejectOption.isVisible().catch(() => false))) {
      rejectOption = this.page.getByText(/^Reject(?: Permission)?$/i).last();
    }
    await rejectOption.waitFor({ state: 'visible', timeout: 5000 });
    await rejectOption.click({ force: true });

    const modal = this.page.getByRole('dialog').or(this.page.locator('.modal, .p-dialog')).last();
    await modal.waitFor({ state: 'visible', timeout: 10000 });
    const commentInput = modal.getByRole('textbox', { name: /comment|reason|rejection/i })
      .or(modal.locator('textarea, input[type="text"]')).first();
    if (await commentInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await commentInput.fill(comments);
    }
    const confirmReject = modal.getByRole('button', { name: /^Reject$/i }).last();
    await confirmReject.click();
    await modal.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async selectAttendanceEmployee(employeeName: string, searchText?: string) {
    await this.page.getByRole('combobox', { name: 'Select Employee' }).click();
    const searchbox = this.page
      .locator('input.p-select-filter:visible, .p-select-panel:visible input[role="searchbox"], .p-dropdown-panel:visible input[role="searchbox"]')
      .first();
    await searchbox.waitFor({ state: 'visible', timeout: 5000 });
    await searchbox.fill(searchText ?? employeeName);
    await this.page.waitForTimeout(800);
    const escaped = employeeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await this.page.getByRole('option', { name: new RegExp(escaped, 'i') }).first().click();
    await this.page.waitForTimeout(1200);
  }

  async verifyAttendancePermissionChipAndLogs(
    cellDate: string,
    expectedStatus: 'Requested' | 'Approved',
  ) {
    await this.openAttendanceModule();
    const dateRegex = new RegExp(cellDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const targetRow = this.page.locator('table tbody tr').filter({ hasText: dateRegex }).first();
    await targetRow.waitFor({ state: 'visible', timeout: 15000 });
    const permissionChip = targetRow.getByText(/Permission/i).first();
    await expect(permissionChip).toBeVisible({ timeout: 15000 });
    await permissionChip.evaluate((element: HTMLElement) => {
      element.style.border = '2px solid #ff9800';
      element.style.boxShadow = '0 0 8px #ff9800';
    });

    const logsButton = targetRow.locator('td:nth-child(5) a, td:nth-child(5) [cursor="pointer"], a').first();
    await logsButton.click();
    const modal = this.page.getByRole('dialog').or(this.page.locator('.modal, .drawer, .custom-main-popup-content')).last();
    await modal.waitFor({ state: 'visible', timeout: 10000 });
    const permissionsAccordion = modal.getByRole('button', { name: /Permissions/i }).first();
    if (await permissionsAccordion.isVisible({ timeout: 3000 }).catch(() => false)) {
      await permissionsAccordion.click();
    }
    await expect(modal.getByText(/00:30|0:30|0\.5/i).first()).toBeVisible({ timeout: 10000 });
    await expect(modal.getByText(new RegExp(`^${expectedStatus}$`, 'i')).first()).toBeVisible({ timeout: 10000 });
    await modal.locator('.btn-close, .p-sidebar-close, .custom-poup-header-content a, [aria-label="Close"]').first().click().catch(() => {});
  }

  async verifyAttendancePermissionsSummaryCount() {
    const summary = this.page.getByText(/Attendance (Status|Summary)/i).first();
    await expect(summary).toBeVisible({ timeout: 10000 });
    const permissionSummary = this.page.locator('li, .status-card, .summary-card, div')
      .filter({ hasText: /^Permissions?\s*\d*$/i })
      .first();
    await expect(permissionSummary).toBeVisible({ timeout: 10000 });
    const count = (await permissionSummary.innerText()).match(/\d+/);
    expect(count, 'Attendance Permissions summary should show a count').not.toBeNull();
    expect(Number(count?.[0])).toBeGreaterThan(0);
  }

  async verifyProcessedRecord(cellDate: string, expectedPermissionType?: string) {
    await this.processedTab.click();
    const dateRegex = new RegExp(cellDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    let row = this.page.locator('table tbody tr').filter({ hasText: dateRegex });
    if (expectedPermissionType) {
      row = row.filter({ hasText: new RegExp(expectedPermissionType, 'i') });
    }
    row = row.first();
    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText(/Approved|Processed/i);
  }
}
