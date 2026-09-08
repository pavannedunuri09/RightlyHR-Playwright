import { expect, type Locator, type Page } from '@playwright/test';

export interface HolidayItem {
  name: string;
  date: string; // YYYY-MM-DD or DD MMM YYYY
  type?: 'Mandatory' | 'Optional' | 'Restricted' | 'Floating' | string;
  description?: string;
}

export interface HolidayGroupData {
  groupName: string;
  year: string;
  location: string;
  description?: string;
  holidays?: HolidayItem[];
}

export class HolidaysPage {
  readonly page: Page;

  // Settings Overview & Navigation
  readonly settingsIcon: Locator;
  readonly settingsPanelEmployeeFields: Locator;
  readonly employeeFieldsCard: Locator;
  readonly manageHolidaysCardLink: Locator;

  // Manage Holidays List Page
  readonly manageHolidaysHeader: Locator;
  readonly addHolidaysButton: Locator;
  readonly pendingForSubmitTab: Locator;
  readonly publishedTab: Locator;
  readonly waitingForApprovalTab: Locator;
  readonly draftTab: Locator;
  readonly searchInput: Locator;
  readonly yearFilterDropdown: Locator;
  readonly locationFilterDropdown: Locator;
  readonly holidaysTable: Locator;
  readonly holidayRows: Locator;

  // Manage Holidays Table Column Headers
  readonly groupNameHeader: Locator;
  readonly yearHeader: Locator;
  readonly locationHeader: Locator;
  readonly totalHolidaysHeader: Locator;
  readonly statusHeader: Locator;
  readonly actionsHeader: Locator;

  // Form Common / Header Inputs (Add / Update / Clone)
  readonly holidayGroupNameInput: Locator;
  readonly yearDropdown: Locator;
  readonly locationDropdown: Locator;
  readonly subLocationDropdown: Locator;
  readonly shiftDropdown: Locator;
  readonly holidayNameInput: Locator;
  readonly holidayDateInput: Locator;
  readonly optionalCheckbox: Locator;
  readonly descriptionInput: Locator;

  // Holiday Rows Form Repeater
  readonly addHolidayRowButton: Locator;
  readonly holidayNameInputs: Locator;
  readonly holidayDateInputs: Locator;
  readonly holidayTypeDropdowns: Locator;
  readonly holidayDescriptionInputs: Locator;
  readonly deleteHolidayRowButtons: Locator;

  // Form Actions
  readonly submitButton: Locator;
  readonly saveDraftButton: Locator;
  readonly updateButton: Locator;
  readonly publishButton: Locator;
  readonly cloneButton: Locator;
  readonly cancelButton: Locator;
  readonly backButton: Locator;
  readonly confirmDialogYesButton: Locator;
  readonly confirmDialogNoButton: Locator;

  // Toast / Status Messages
  readonly successToast: Locator;
  readonly dataUpdatedToast: Locator;
  readonly dataAddedToast: Locator;
  readonly dataClonedToast: Locator;
  readonly requiredFieldError: Locator;
  readonly duplicateDateError: Locator;

  // View Holidays Page Locators
  readonly viewDetailsContainer: Locator;
  readonly viewGroupName: Locator;
  readonly viewYear: Locator;
  readonly viewLocation: Locator;
  readonly viewHolidayListTable: Locator;

  constructor(page: Page) {
    this.page = page;

    // Settings Navigation
    this.settingsIcon = page.locator('img[src*="setting" i], [aria-label*="Setting" i], .settings-icon').first();
    this.settingsPanelEmployeeFields = page.locator('#settings-panel-1, #settings-panel-employee-fields, .settings-panel').filter({
      hasText: /Employee\s*Fields|Organization/i,
    }).first();
    this.employeeFieldsCard = page.locator('p-accordion-header, [data-pc-name="accordionheader"], .p-accordionheader, button').filter({
      hasText: /Employee Fields/i,
    }).first();
    this.manageHolidaysCardLink = page.locator('.label-name, .card-title, a, div, span').filter({
      hasText: /^Manage Holidays$/i,
    }).first();

    // Manage Holidays List
    this.manageHolidaysHeader = page.locator('.title, .card-title, .header, h1, h2, h3, h4, span, div').filter({
      hasText: /^Manage Holidays$/i,
    }).first().or(page.getByText('Manage Holidays').first());
    this.addHolidaysButton = page.getByRole('link', { name: /Add New|\+?\s*Add Holiday|\+?\s*Add/i }).or(
      page.getByRole('button', { name: /Add New|\+?\s*Add Holiday|\+?\s*Add/i }),
    ).or(
      page.getByText(/Add New/i).first(),
    );

    // Status Tabs
    this.pendingForSubmitTab = page.getByRole('link', { name: /Pending For Submission/i }).or(
      page.getByRole('tab', { name: /Pending (for|to) Submit/i }),
    ).or(
      page.getByText(/Pending (for|to) Submit/i).first(),
    );
    this.publishedTab = page.getByRole('link', { name: /Published/i }).or(
      page.getByRole('tab', { name: /Published|Active/i }),
    ).or(
      page.getByText(/Published|Active/i).first(),
    );
    this.waitingForApprovalTab = page.getByRole('tab', { name: /Waiting (for|to) Approval/i }).or(
      page.getByText(/Waiting (for|to) Approval/i).first(),
    );
    this.draftTab = page.getByRole('tab', { name: /Draft/i }).or(
      page.getByText(/Draft/i).first(),
    );

    // Search & Filters
    this.searchInput = page.getByPlaceholder(/Search|Search by name|Holiday Name/i).or(
      page.getByRole('searchbox'),
    ).first();
    this.yearFilterDropdown = page.getByRole('combobox', { name: /Year|Select Year/i }).or(
      page.locator('ng-select, select').filter({ hasText: /Year|202\d/i }).first(),
    );
    this.locationFilterDropdown = page.getByRole('combobox', { name: /Location|Select Location/i }).or(
      page.locator('ng-select, select').filter({ hasText: /Location|Branch/i }).first(),
    );

    // Table
    this.holidaysTable = page.locator('table, .p-datatable, [role="table"]').first();
    this.holidayRows = this.holidaysTable.locator('tbody tr, [role="row"]').filter({
      hasNotText: /No records found|No data available|No records|No data/i,
    });

    // Headers
    this.groupNameHeader = page.getByRole('columnheader', { name: /Holiday (Group|Name)|Shift Name|Name/i }).first();
    this.yearHeader = page.getByRole('columnheader', { name: 'Year', exact: true }).first();
    this.locationHeader = page.getByRole('columnheader', { name: 'Location', exact: true }).first();
    this.totalHolidaysHeader = page.getByRole('columnheader', { name: /Total Holidays|Sub Location|No\. of Holidays|Count/i }).first();
    this.statusHeader = page.getByRole('columnheader', { name: 'Status', exact: true }).first();
    this.actionsHeader = page.getByRole('columnheader', { name: /Action/i }).first();

    // Form inputs
    this.holidayGroupNameInput = page.getByRole('textbox', { name: /Holiday (Group|List) Name \*/i }).or(
      page.getByPlaceholder(/Holiday Group Name|Enter Name/i),
    ).or(page.locator('input[formcontrolname="groupName"], input[formcontrolname="holidayName"], input[name="groupName"]').first());

    this.yearDropdown = page.locator('p-select[formcontrolname="year"], [formcontrolname="year"]').first();
    this.locationDropdown = page.locator('p-select[formcontrolname="location"], [formcontrolname="location"]').first();
    this.subLocationDropdown = page.locator('p-select[formcontrolname="subLocation"], [formcontrolname="subLocation"]').first();
    this.shiftDropdown = page.locator('p-select[formcontrolname="shift"], [formcontrolname="shift"]').first();
    this.holidayNameInput = page.getByRole('textbox', { name: /Please enter Holiday Name|Holiday Name/i }).or(
      page.locator('input[placeholder*="Please enter Holiday Name" i], input[formcontrolname="holidayName"], input[formcontrolname="name"]')
    ).first();
    this.holidayDateInput = page.locator('input[type="date"], input[formcontrolname="holidayDate"], input[formcontrolname="date"], p-datepicker input').first();
    this.optionalCheckbox = page.getByRole('checkbox', { name: /Optional/i }).or(
      page.locator('input[type="checkbox"]').first()
    );
    this.descriptionInput = page.getByRole('textbox', { name: /Description/i }).or(
      page.locator('textarea[formcontrolname="description"], input[formcontrolname="description"]').first(),
    );

    // Form row repeater
    this.addHolidayRowButton = page.getByRole('button', { name: /\+?\s*Add (Row|Holiday|New)/i }).or(
      page.locator('button').filter({ hasText: /\+ Add Row|\+ Add|Add New/i }).first(),
    );
    this.holidayNameInputs = page.locator('input[formcontrolname="name"], input[formcontrolname="holidayName"], input[placeholder*="Holiday Name" i]');
    this.holidayDateInputs = page.locator('input[formcontrolname="date"], input[formcontrolname="holidayDate"], input[type="date"], input[placeholder*="Date" i]');
    this.holidayTypeDropdowns = page.locator('ng-select[formcontrolname="type"], select[formcontrolname="type"], [formcontrolname="type"]');
    this.holidayDescriptionInputs = page.locator('input[formcontrolname="description"], textarea[formcontrolname="description"]');
    this.deleteHolidayRowButtons = page.locator('button[aria-label*="Delete" i], button.btn-delete, i.fa-trash, i.fa-trash-alt, .delete-row-btn');

    // Action buttons
    this.submitButton = page.getByRole('button', { name: /^(Submit|Save & Submit|Submit for Approval)$/i }).first();
    this.saveDraftButton = page.getByRole('button', { name: /^(Save as Draft|Save Draft|Draft)$/i }).first();
    this.updateButton = page.getByRole('button', { name: /^(Update|Save Changes)$/i }).first();
    this.publishButton = page.getByRole('button', { name: /^(Publish|Submit|Submit for Approval)$/i }).first();
    this.cloneButton = page.getByRole('button', { name: /^(Clone|Clone Holiday)$/i }).first();
    this.cancelButton = page.getByRole('button', { name: /^Cancel$/i }).first();
    this.backButton = page.locator('button.btn-secondary, #submitButton, button:has-text("Cancel"), button:has-text("Back"), .commpoment-name.navigator').first();
    this.confirmDialogYesButton = page.getByRole('dialog').getByRole('button', { name: /^Yes$/i }).or(
      page.getByRole('button', { name: /^Yes$/i }),
    );
    this.confirmDialogNoButton = page.getByRole('dialog').getByRole('button', { name: /^No$/i }).or(
      page.getByRole('button', { name: /^No$/i }),
    );

    // Notifications
    this.successToast = page.getByText(/Successfully|Success/i);
    this.dataUpdatedToast = page.getByText(/(Data|Holiday) Updated Successfully/i);
    this.dataAddedToast = page.getByText(/(Data|Holiday) (Added|Created|Saved) Successfully/i);
    this.dataClonedToast = page.getByText(/(Data|Holiday) Cloned Successfully/i);
    this.requiredFieldError = page.getByText(/is required|cannot be (null|empty)|This field is required/i);
    this.duplicateDateError = page.getByText(/already exists|Duplicate date|Date conflict/i);

    // View Details
    this.viewDetailsContainer = page.locator('.holiday-view-container, .view-details-card, .card').first();
    this.viewGroupName = page.locator('.view-group-name, [data-testid="group-name"]').or(page.getByText(/Holiday Group:/i));
    this.viewYear = page.locator('.view-year, [data-testid="year"]').or(page.getByText(/Year:/i));
    this.viewLocation = page.locator('.view-location, [data-testid="location"]').or(page.getByText(/Location:/i));
    this.viewHolidayListTable = page.locator('table').first();
  }

  // ===================== NAVIGATION METHODS ===================== //

  /**
   * Expand Employee Fields panel accordion on /settings/overview
   */
  async expandEmployeeFieldsPanel() {
    const accordionHeader = this.employeeFieldsCard;
    await accordionHeader.waitFor({ state: 'visible', timeout: 15000 });
    const isExpanded = await accordionHeader.getAttribute('aria-expanded');
    const dataActive = await accordionHeader.getAttribute('data-p-active');
    if (isExpanded !== 'true' && dataActive !== 'true') {
      await accordionHeader.click();
      await this.page.waitForTimeout(1000);
    }
  }

  /**
   * Navigate to Dashboard and confirm default dashboard page without reloading if already there
   */
  async openDashboard() {
    if (this.page.url().includes('/dashboard/emp')) {
      await this.page.waitForTimeout(500);
      return;
    }
    await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' });
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  /**
   * Click Settings icon in header to navigate to Settings Overview
   */
  async clickSettingsIcon() {
    await this.page.waitForTimeout(800);
    const settingsBtn = this.page.locator('img[src*="setting" i], [aria-label*="Setting" i], .settings-icon, a[href*="setting"], button[aria-label*="setting" i], rect, svg, path').first();
    if (await settingsBtn.isVisible().catch(() => false)) {
      await settingsBtn.click({ force: true }).catch(() => {});
    }
    try {
      await this.page.waitForURL(/\/settings\/overview|\/settings/, { timeout: 5000 });
    } catch {
      await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
      await this.page.waitForURL(/\/settings\/overview|\/settings/, { timeout: 15000 }).catch(() => {});
    }
    await this.page.waitForTimeout(500);
  }

  /**
   * Open Settings Overview by clicking the Settings icon from dashboard
   */
  async navigateToSettingsFromDashboard() {
    await this.openDashboard();
    await this.clickSettingsIcon();
  }

  /**
   * Navigate to Settings Overview (/settings/overview) without unnecessary reloads
   */
  async openSettingsOverview() {
    if (this.page.url().includes('/settings/overview')) {
      await this.page.waitForTimeout(500);
      return;
    }
    if (this.page.url().includes('/dashboard/emp')) {
      await this.clickSettingsIcon();
    } else {
      await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
      await this.page.waitForURL(/\/settings\/overview|\/settings/, { timeout: 30000 });
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Navigate to Manage Holidays: /settings/employee-fields/manage-holidays/pending-for-submit without full-page reloads
   */
  async openManageHolidays(tab: 'pending-for-submit' | 'published' | 'draft' = 'pending-for-submit') {
    const targetUrl = `/settings/employee-fields/manage-holidays/${tab}`;
    if (this.page.url().includes(targetUrl)) {
      await this.page.waitForTimeout(500);
      return;
    }
    if (this.page.url().includes('/settings/employee-fields/manage-holidays')) {
      if (tab === 'pending-for-submit' && await this.pendingForSubmitTab.isVisible().catch(() => false)) {
        await this.pendingForSubmitTab.click();
      } else if (tab === 'published' && await this.publishedTab.isVisible().catch(() => false)) {
        await this.publishedTab.click();
      } else if (tab === 'draft' && await this.draftTab.isVisible().catch(() => false)) {
        await this.draftTab.click();
      }
      await this.page.waitForTimeout(500);
      return;
    }
    if (this.page.url().includes('/settings/overview') && await this.manageHolidaysCardLink.isVisible().catch(() => false)) {
      await this.manageHolidaysCardLink.click();
      await this.page.waitForURL(/\/settings\/employee-fields\/manage-holidays/, { timeout: 15000 }).catch(() => {});
      if (tab === 'published' && await this.publishedTab.isVisible().catch(() => false)) {
        await this.publishedTab.click();
      }
      await this.page.waitForTimeout(500);
      return;
    }
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForURL(new RegExp(`/settings/employee-fields/manage-holidays`), { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  /**
   * Navigate to Add Holidays: /settings/employee-fields/addholidays
   */
  async openAddHolidays() {
    if (this.page.url().includes('/settings/employee-fields/addholidays')) {
      await this.page.waitForTimeout(500);
      return;
    }
    if (this.page.url().includes('/settings/employee-fields/manage-holidays') && await this.addHolidaysButton.isVisible().catch(() => false)) {
      await this.addHolidaysButton.click();
      await this.page.waitForURL(/\/settings\/employee-fields\/addholidays/, { timeout: 15000 }).catch(() => {});
      await this.page.waitForTimeout(500);
      return;
    }
    await this.page.goto('/settings/employee-fields/addholidays', { waitUntil: 'domcontentloaded' });
    await this.page.waitForURL(/\/settings\/employee-fields\/addholidays/, { timeout: 30000 });
    await this.page.waitForTimeout(500);
  }

  /**
   * Navigate to Update Holidays: /settings/employee-fields/updateholidays
   */
  async openUpdateHolidays(idQuery?: string) {
    const targetUrl = idQuery
      ? `/settings/employee-fields/updateholidays?id=${idQuery}`
      : '/settings/employee-fields/updateholidays';
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForURL(/\/settings\/employee-fields\/updateholidays/, { timeout: 30000 });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Navigate to Clone Holidays: /settings/employee-fields/cloneholidays
   */
  async openCloneHolidays(idQuery?: string) {
    const targetUrl = idQuery
      ? `/settings/employee-fields/cloneholidays?id=${idQuery}`
      : '/settings/employee-fields/cloneholidays';
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForURL(/\/settings\/employee-fields\/cloneholidays/, { timeout: 30000 });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Navigate to View Holidays: /settings/employee-fields/viewholidays
   */
  async openViewHolidays(idQuery?: string) {
    const targetUrl = idQuery
      ? `/settings/employee-fields/viewholidays?id=${idQuery}`
      : '/settings/employee-fields/viewholidays';
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForURL(/\/settings\/employee-fields\/viewholidays/, { timeout: 30000 });
    await this.page.waitForTimeout(1000);
  }

  // ===================== LIST VIEW & ACTION HELPERS ===================== //

  /**
   * Get row matching a holiday group name or text
   */
  getHolidayRow(groupName: string): Locator {
    return this.holidayRows.filter({
      hasText: groupName,
    }).or(
      this.holidayRows.filter({
        has: this.page.getByRole('cell', { name: groupName }),
      })
    ).or(
      this.holidayRows.filter({
        has: this.page.locator('td').filter({ hasText: groupName }),
      })
    ).first();
  }

  /**
   * Scroll down the table and locate a holiday row by identifier (or latest row if fallbackToLast is true)
   */
  /**
   * Scroll down the table and locate a holiday row by identifier (or latest row if fallbackToLast is true)
   */
  async scrollToAndGetHolidayRow(identifier?: string, fallbackToLast = true): Promise<Locator> {
    await this.holidaysTable.waitFor({ state: 'visible', timeout: 15000 });
    await this.holidayRows.first().waitFor({ state: 'visible', timeout: 15000 });

    // Fast scroll down table & window
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
      const tableWrapper = document.querySelector('.p-datatable-wrapper, .table-responsive, [role="region"]');
      if (tableWrapper) tableWrapper.scrollTop = tableWrapper.scrollHeight;
    });

    let targetRow: Locator | null = null;
    if (identifier) {
      const match = this.getHolidayRow(identifier);
      if (await match.isVisible().catch(() => false)) {
        targetRow = match;
      }
    }

    if (!targetRow) {
      targetRow = fallbackToLast ? this.holidayRows.last() : this.holidayRows.first();
    }

    await targetRow.scrollIntoViewIfNeeded().catch(() => {});
    return targetRow;
  }

  /**
   * Locator for a specific action item in the open row dropdown
   */
  kebabMenuItem(name: string): Locator {
    return this.page.locator('a.dropdown-item, button.dropdown-item, .dropdown-item, .p-menuitem-link, [role="menuitem"]').filter({
      hasText: new RegExp(`^\\s*${name}\\s*$`, 'i'),
    });
  }

  /**
   * Open the action kebab / dropdown menu on a specific holiday row
   */
  async openRowKebab(row: Locator): Promise<boolean> {
    await row.scrollIntoViewIfNeeded().catch(() => {});

    const kebab = row.locator('.dropdown > a, .dropdown.ng-star-inserted, [data-bs-toggle="dropdown"], .dropdown-toggle, i.fa-ellipsis-v, i.fa-ellipsis-vertical, td:last-child a, td:last-child button').first();
    if (await kebab.isVisible().catch(() => false)) {
      await kebab.click({ force: true });
      return true;
    }

    const lastCell = row.getByRole('cell').last();
    if (await lastCell.isVisible().catch(() => false)) {
      await lastCell.click({ force: true });
      return true;
    }

    return false;
  }

  /**
   * Click an action item inside row kebab menu (View, Update, Clone, Submit, Delete)
   * Interacts strictly with the row on the page and does NOT navigate via direct URL.
   */
  async clickRowAction(row: Locator, actionName: 'View' | 'Update' | 'Clone' | 'Submit' | 'Delete'): Promise<void> {
    await row.scrollIntoViewIfNeeded().catch(() => {});

    // 1. Open the row's kebab menu
    await this.openRowKebab(row);

    // 2. Action menu item selectors
    const actionItem = this.page.locator('.dropdown-menu.show a, .dropdown-menu.show button, .dropdown-menu.show .dropdown-item, a.dropdown-item, button.dropdown-item, .dropdown-item, [role="menuitem"]').filter({
      hasText: new RegExp(`^\\s*${actionName}\\s*$`, 'i'),
    }).or(
      row.locator('.dropdown-menu a, .dropdown-menu button, .dropdown-item').filter({
        hasText: new RegExp(`^\\s*${actionName}\\s*$`, 'i'),
      })
    ).or(
      this.page.getByRole('link', { name: new RegExp(`^\\s*${actionName}\\s*$`, 'i') })
    ).or(
      this.page.getByText(new RegExp(`^\\s*${actionName}\\s*$`, 'i'))
    ).filter({ visible: true }).first();

    if (await actionItem.isVisible({ timeout: 3000 }).catch(() => false)) {
      await actionItem.click({ force: true });
      return;
    }

    // 3. Inline action button
    const inlineButton = row.getByRole('button', { name: new RegExp(actionName, 'i') }).or(
      row.locator(`a, button`).filter({ hasText: new RegExp(actionName, 'i') }),
    ).first();
    if (await inlineButton.isVisible().catch(() => false)) {
      await inlineButton.click({ force: true });
      return;
    }

    throw new Error(`Failed to click '${actionName}' on the specified holiday row.`);
  }

  /**
   * Search for a holiday group in the list
   */
  async searchHoliday(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  /**
   * Filter table by year
   */
  async selectYearFilter(year: string) {
    if (await this.yearFilterDropdown.isVisible().catch(() => false)) {
      await this.yearFilterDropdown.click({ force: true });
      await this.page.getByRole('option', { name: year }).or(this.page.getByText(year)).first().click({ force: true });
    }
  }

  // ===================== FORM FILLING & SUBMISSION HELPERS ===================== //

  /**
   * Select dropdown value for PrimeNG / Angular dropdown
   */
  async selectDropdownValue(dropdownLocator: Locator, valueText: string) {
    if (await dropdownLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dropdownLocator.click({ force: true }).catch(() => {});
      const option = this.page.locator('.p-select-option, .p-select-item, .p-dropdown-item, .ng-option, [role="option"]').filter({
        hasText: valueText,
      }).first();
      if (await option.isVisible({ timeout: 1500 }).catch(() => false)) {
        await option.click({ force: true });
      }
    }
  }

  /**
   * Select first available option in dropdown
   */
  async selectFirstAvailableDropdownOption(dropdownLocator: Locator) {
    await this.selectDropdownOptionByIndex(dropdownLocator, 0);
  }

  /**
   * Select dropdown option by index (e.g., 0, 1, 2...), filtering out placeholder items and No data found
   */
  async selectDropdownOptionByIndex(dropdownLocator: Locator, index: number) {
    if (await dropdownLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dropdownLocator.click({ force: true }).catch(() => {});

      const optionLocator = this.page.locator('.p-select-overlay [role="option"], .p-dropdown-items [role="option"], .p-select-option, [role="listbox"] [role="option"]').filter({
        hasNotText: /^(Please select|Select year|Select location|Select sub location|Select shift|No result found|No data found|No records found)/i,
      });

      try {
        await optionLocator.first().waitFor({ state: 'visible', timeout: 1500 });
      } catch {
        // Overlay may already be visible
      }

      const count = await optionLocator.count();
      if (count > 0) {
        const safeIdx = index < count ? index : (index % count);
        await optionLocator.nth(safeIdx).click({ force: true }).catch(() => {});
      } else {
        await this.page.keyboard.press('Escape');
      }
    }
  }

  /**
   * Select location, sublocation, and shift by option index offset to test different combinations
   */
  async selectLocationHierarchyByOffset(offset = 0, yearValue?: string) {
    if (yearValue && await this.yearDropdown.isVisible({ timeout: 1000 }).catch(() => false)) {
      await this.selectDropdownValue(this.yearDropdown, yearValue);
    }
    if (await this.locationDropdown.isVisible({ timeout: 1500 }).catch(() => false)) {
      await this.selectDropdownOptionByIndex(this.locationDropdown, offset);
    }
    if (await this.subLocationDropdown.isVisible({ timeout: 1500 }).catch(() => false)) {
      await this.selectDropdownOptionByIndex(this.subLocationDropdown, offset);
    }
    if (await this.shiftDropdown.isVisible({ timeout: 1500 }).catch(() => false)) {
      await this.selectDropdownOptionByIndex(this.shiftDropdown, offset);
    }
  }

  /**
   * Fill the header / group details section
   */
  async fillGroupDetails(data: { groupName?: string; year?: string; location?: string; subLocation?: string; shift?: string; description?: string }) {
    if (data.year) {
      await this.selectDropdownValue(this.yearDropdown, data.year);
    }
    if (data.location) {
      await this.selectDropdownValue(this.locationDropdown, data.location);
    }
    if (data.subLocation) {
      await this.selectDropdownValue(this.subLocationDropdown, data.subLocation);
    }
    if (data.shift) {
      await this.selectDropdownValue(this.shiftDropdown, data.shift);
    }
    if (data.groupName && await this.holidayGroupNameInput.isVisible().catch(() => false)) {
      await this.holidayGroupNameInput.fill(data.groupName);
    }
    if (data.description && await this.descriptionInput.isVisible().catch(() => false)) {
      await this.descriptionInput.fill(data.description);
    }
  }

  /**
   * Add a single holiday entry to the holiday form
   */
  async addHolidayRow(holiday: HolidayItem, rowIndex?: number) {
    if (await this.holidayNameInput.isVisible().catch(() => false)) {
      await this.holidayNameInput.fill(holiday.name);
      if (await this.holidayDateInput.isVisible().catch(() => false)) {
        await this.holidayDateInput.fill(holiday.date);
      }
      return;
    }

    if (await this.addHolidayRowButton.isVisible().catch(() => false)) {
      await this.addHolidayRowButton.click({ force: true });
    }

    const targetIdx = rowIndex !== undefined ? rowIndex : (await this.holidayNameInputs.count()) - 1;
    const nameInput = this.holidayNameInputs.nth(targetIdx);
    const dateInput = this.holidayDateInputs.nth(targetIdx);

    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill(holiday.name);
    }
    if (await dateInput.isVisible().catch(() => false)) {
      await dateInput.fill(holiday.date);
    }
  }

  /**
   * Delete a holiday row by index
   */
  async deleteHolidayRow(rowIndex: number) {
    const deleteBtn = this.deleteHolidayRowButtons.nth(rowIndex);
    await deleteBtn.click({ force: true });
    if (await this.confirmDialogYesButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.confirmDialogYesButton.click({ force: true });
    }
  }

  /**
   * Submit the Add Holiday form
   */
  async submitAddHolidayForm() {
    const submitBtn = this.page.getByRole('button', { name: /^(Submit|Save & Submit|Submit for Approval)$/i }).or(this.submitButton).first();
    await submitBtn.click({ force: true });

    const yesBtn = this.page.getByRole('button', { name: /^Yes$/i }).or(
      this.page.locator('.p-dialog-footer button, .modal-footer button, p-dialog button, button:has-text("Yes")')
    ).first();

    if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await yesBtn.click({ force: true });
    }
  }

  /**
   * Submit the Update Holiday form
   */
  async submitUpdateHolidayForm() {
    const btn = (await this.updateButton.isVisible().catch(() => false)) ? this.updateButton : this.submitButton;
    await btn.click({ force: true });

    const yesBtn = this.page.getByRole('button', { name: /^Yes$/i }).or(
      this.page.locator('.p-dialog-footer button, .modal-footer button, p-dialog button, button:has-text("Yes")')
    ).first();
    if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await yesBtn.click({ force: true });
    }
  }

  /**
   * Submit the Clone Holiday form
   */
  async submitCloneHolidayForm() {
    const btn = (await this.cloneButton.isVisible().catch(() => false)) ? this.cloneButton : this.submitButton;
    await btn.click({ force: true });

    const yesBtn = this.page.getByRole('button', { name: /^Yes$/i }).or(
      this.page.locator('.p-dialog-footer button, .modal-footer button, p-dialog button, button:has-text("Yes")')
    ).first();
    if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await yesBtn.click({ force: true });
    }
  }

  /**
   * Cancel form and return to manage holidays
   */
  async cancelForm() {
    await this.cancelButton.click({ force: true });
    if (await this.confirmDialogYesButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.confirmDialogYesButton.click({ force: true });
    }
    await this.page.waitForURL(/\/settings\/employee-fields\/manage-holidays/, { timeout: 15000 }).catch(() => {});
  }

  /**
   * Helper to generate unique random holiday data
   */
  generateRandomHolidayData(prefix = 'Auto Holiday') {
    const timestamp = Date.now().toString().slice(-5) + Math.floor(Math.random() * 1000);
    const randomMonth = String(Math.floor(Math.random() * 11) + 1).padStart(2, '0');
    const randomDay = String(Math.floor(Math.random() * 26) + 1).padStart(2, '0');
    return {
      name: `${prefix} ${timestamp}`,
      date: `2026-${randomMonth}-${randomDay}`,
    };
  }

  /**
   * Helper to generate a unique holiday group name for test runs
   */
  generateUniqueHolidayGroupName(prefix = 'Auto_Holiday'): string {
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}_${timestamp}`;
  }

  /**
   * Fills and submits Add Holiday form with in-place retry for CURRENT YEAR only until a record is successfully added.
   * If "No data found" appears, iterates to the next available location/shift.
   */
  async fillAndSubmitHolidayUntilAdded(maxRetries = 3): Promise<{ success: boolean; holidayName: string; year: string }> {
    const currentYear = new Date().getFullYear().toString();

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (!this.page.url().includes('/settings/employee-fields/addholidays')) {
        await this.openAddHolidays();
      }

      // 1. Select Current Year (2026)
      if (await this.yearDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.selectDropdownValue(this.yearDropdown, currentYear);
      }

      // 2. Select Location, Sub Location, Shift for Current Year (skipping any with "No data found")
      await this.selectLocationHierarchyByOffset(attempt, currentYear);

      // 3. Fill Holiday Name & Date for current year
      const randomData = this.generateRandomHolidayData(`Holiday_${Date.now().toString().slice(-4)}`);
      const month = String(Math.floor(Math.random() * 11) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 26) + 1).padStart(2, '0');
      randomData.date = `${currentYear}-${month}-${day}`;

      if (await this.holidayGroupNameInput.isVisible().catch(() => false)) {
        await this.holidayGroupNameInput.fill(randomData.name);
      }
      if (await this.holidayNameInput.isVisible().catch(() => false)) {
        await this.holidayNameInput.fill(randomData.name);
      }
      if (await this.holidayDateInput.isVisible().catch(() => false)) {
        await this.holidayDateInput.fill(randomData.date);
        await this.holidayDateInput.dispatchEvent('change').catch(() => {});
        await this.holidayDateInput.dispatchEvent('blur').catch(() => {});
        await this.holidayDateInput.press('Tab');
      }

      // 4. Submit
      const submitBtn = this.page.getByRole('button', { name: /^Submit$/i }).or(this.submitButton).first();
      if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.submitAddHolidayForm();

        try {
          await this.page.waitForURL(/\/settings\/employee-fields\/manage-holidays/, { timeout: 15000 });
          return { success: true, holidayName: randomData.name, year: currentYear };
        } catch {
          if (this.page.url().includes('/settings/employee-fields/manage-holidays') || await this.successToast.isVisible().catch(() => false)) {
            await this.page.waitForURL(/\/settings\/employee-fields\/manage-holidays/, { timeout: 10000 }).catch(() => {});
            return { success: true, holidayName: randomData.name, year: currentYear };
          }
          await this.page.keyboard.press('Escape');
        }
      } else {
        await this.page.keyboard.press('Escape');
      }
    }

    if (this.page.url().includes('/settings/employee-fields/addholidays')) {
      await this.cancelForm().catch(() => {});
    }
    return { success: false, holidayName: '', year: currentYear };
  }

  /**
   * Fills and submits Add Holiday form with in-place retry across different dropdown options and random data
   * if holiday already exists for the selected location, sublocation, and shift.
   */
  async fillAndSubmitHolidayWithRetry(maxRetries = 3): Promise<boolean> {
    const res = await this.fillAndSubmitHolidayUntilAdded(maxRetries);
    return res.success;
  }

  /**
   * Fills target year, location, subLocation, shift on Clone Holidays page with in-place retry across dropdown options
   * if combination already exists for the selected location, sublocation, and shift.
   */
  async submitCloneWithRetry(maxRetries = 3): Promise<boolean> {
    const currentYear = new Date().getFullYear().toString();
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      await this.selectLocationHierarchyByOffset(attempt, currentYear);

      const cloneBtn = this.page.getByRole('button', { name: /^Clone$/i }).or(this.cloneButton).first();
      if (await cloneBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.submitCloneHolidayForm();

        try {
          await this.page.waitForURL(/\/settings\/employee-fields\/manage-holidays/, { timeout: 15000 });
          return true;
        } catch {
          if (this.page.url().includes('/settings/employee-fields/manage-holidays') || await this.successToast.isVisible().catch(() => false)) {
            await this.page.waitForURL(/\/settings\/employee-fields\/manage-holidays/, { timeout: 10000 }).catch(() => {});
            return true;
          }
          await this.page.keyboard.press('Escape');
        }
      }
    }

    if (this.page.url().includes('/settings/employee-fields/cloneholidays')) {
      await this.cancelForm().catch(() => {});
    }
    return false;
  }

  /**
   * Submit Update or Publish on Update Holidays page
   */
  async submitOrPublishUpdate(action: 'Update' | 'Publish' = 'Update') {
    if (action === 'Publish' && await this.publishButton.isVisible().catch(() => false)) {
      await this.publishButton.click({ force: true });
    } else if (await this.updateButton.isVisible().catch(() => false)) {
      await this.updateButton.click({ force: true });
    } else {
      await this.submitButton.click({ force: true });
    }

    const yesBtn = this.page.getByRole('button', { name: /^Yes$/i }).or(
      this.page.locator('.p-dialog-footer button, .modal-footer button, p-dialog button, button:has-text("Yes")')
    ).first();

    if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await yesBtn.click({ force: true });
    }
    await this.page.waitForURL(/\/settings\/employee-fields\/manage-holidays/, { timeout: 15000 }).catch(() => {});
    if (this.page.url().includes('/settings/employee-fields/updateholidays')) {
      await this.cancelForm().catch(() => {});
    }
  }
}
