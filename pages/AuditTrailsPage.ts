import { expect, type Locator, type Page } from '@playwright/test';
import { LoginPage } from './LoginPage';

export interface AuditTrailFilterOptions {
  moduleName?: string;
  actionType?: string;
  user?: string;
  fromDate?: string;
  toDate?: string;
  searchKeyword?: string;
}

export class AuditTrailsPage {
  readonly page: Page;
  readonly loginPage: LoginPage;

  // Base URL & Credentials
  readonly baseUrl: string;

  // Login Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly dashboardGreeting: Locator;
  readonly profileDropdown: Locator;
  readonly userProfileName: Locator;
  readonly logoutButton: Locator;
  readonly logoutConfirmYes: Locator;

  // Sidebar & Navigation Locators
  readonly sidebar: Locator;
  readonly reportsNav: Locator;
  readonly settingsNav: Locator;
  readonly auditTrailNav: Locator;
  readonly breadcrumb: Locator;

  // Audit Trails Page Elements
  readonly pageHeaderTitle: Locator;
  readonly searchInput: Locator;
  readonly moduleFilterDropdown: Locator;
  readonly actionFilterDropdown: Locator;
  readonly dateRangePicker: Locator;
  readonly applyFilterButton: Locator;
  readonly resetFilterButton: Locator;
  readonly exportButton: Locator;
  readonly refreshButton: Locator;

  // Audit Table Locators
  readonly auditTable: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;
  readonly paginationControls: Locator;
  readonly noDataMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.baseUrl = process.env.HANSCO_BASE_URL || 'https://hansco.rightlyhr.com';

    // Login Elements
    this.emailInput = page.getByRole('textbox', { name: 'Please enter email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Please enter password' });
    this.loginButton = page.locator('button[type="submit"].custom-btn, button.custom-btn.btn-primary, button[type="submit"]').filter({ hasText: /^Login$/i }).first();
    this.dashboardGreeting = page.getByText('Have a nice day at work!').or(page.getByText('Dashboard', { exact: true })).first();
    this.profileDropdown = page.locator('.profile-dropdown, .user-profile, .profile-section').first();
    this.userProfileName = page.getByText(/Rahul\s*Shetty/i).first();
    this.logoutButton = page.getByRole('button', { name: /Logout/i }).or(page.getByText(/^Logout$/i)).first();
    this.logoutConfirmYes = page.getByRole('button', { name: /^Yes$/i }).first();

    // Sidebar & Navigation
    this.sidebar = page.locator('#sidenav-main-drop, .sidebar, app-sidebar');
    this.reportsNav = page.locator('#sidenav-main-drop, .sidebar').getByText('Reports', { exact: true }).first();
    this.settingsNav = page.locator('#sidenav-main-drop, .sidebar').getByText('Settings', { exact: true }).first();
    this.auditTrailNav = page.locator('a, span, li, button, .dropdown-item').filter({ hasText: /Audit\s*Trail/i }).first();
    this.breadcrumb = page.locator('ol.breadcrumb, nav[aria-label="breadcrumb"], .breadcrumb, .page-breadcrumb').first();

    // Audit Trails Page Elements
    this.pageHeaderTitle = page.locator('h1, h2, h3, h4, .page-title, .title-container').filter({ hasText: /Audit/i }).first();
    this.searchInput = page.getByPlaceholder(/Search/i).or(page.locator('input[type="search"], input.search-input')).first();
    this.moduleFilterDropdown = page.locator('[formcontrolname="module"], select[name="module"], .module-select, p-dropdown').first();
    this.actionFilterDropdown = page.locator('[formcontrolname="action"], select[name="action"], .action-select').first();
    this.dateRangePicker = page.locator('input[placeholder*="Date" i], .date-picker, p-calendar').first();
    this.applyFilterButton = page.getByRole('button', { name: /Apply|Filter/i }).first();
    this.resetFilterButton = page.getByRole('button', { name: /Reset|Clear/i }).first();
    this.exportButton = page.getByRole('button', { name: /Export|Download/i }).first();
    this.refreshButton = page.getByRole('button', { name: /Refresh/i }).or(page.locator('.fa-sync, .fa-redo, [title*="Refresh" i]')).first();

    // Table Locators
    this.auditTable = page.locator('table, .p-datatable-table, .custom-table').first();
    this.tableHeaders = page.locator('thead th, .p-datatable-thead th');
    this.tableRows = page.locator('tbody tr, .p-datatable-tbody tr');
    this.paginationControls = page.locator('.p-paginator, .pagination, .page-controls').first();
    this.noDataMessage = page.getByText(/No records found|No data available|No Data/i).first();
  }

  /**
   * Navigate to Hansco login page
   */
  async gotoLogin() {
    await this.page.goto(`${this.baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await this.emailInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Perform login with specific credentials
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Clear active browser storage and session
   */
  async clearSession() {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});
  }

  /**
   * Log in to Hansco application using environment variables
   */
  async loginFromEnv() {
    const email = process.env.HANSCO_LOGIN_EMAIL?.trim() || 'Rahul@yopmail.com';
    const password = process.env.HANSCO_LOGIN_PASSWORD?.trim() || 'Rahul@12';

    await this.clearSession();
    await this.gotoLogin();
    await this.login(email, password);

    await this.page.waitForURL(/\/dashboard/, {
      timeout: 45000,
      waitUntil: 'domcontentloaded',
    });
  }

  /**
   * Navigate to Audit Trails section
   */
  async navigateToAuditTrail() {
    // If direct navigation or via menu
    if (await this.auditTrailNav.isVisible().catch(() => false)) {
      await this.auditTrailNav.click();
    } else if (await this.reportsNav.isVisible().catch(() => false)) {
      await this.reportsNav.click();
      await this.page.waitForTimeout(1000);
      if (await this.auditTrailNav.isVisible().catch(() => false)) {
        await this.auditTrailNav.click();
      }
    } else {
      await this.page.goto(`${this.baseUrl}/audit-trail`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    }
  }

  /**
   * Search audit trail logs by keyword
   */
  async searchAuditLogs(keyword: string) {
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(keyword);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  /**
   * Export audit trail report
   */
  async exportAuditReport() {
    await this.exportButton.waitFor({ state: 'visible', timeout: 10000 });
    const downloadPromise = this.page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
    await this.exportButton.click();
    return await downloadPromise;
  }

  /**
   * Log out of Hansco application
   */
  async logout() {
    if (await this.profileDropdown.isVisible().catch(() => false)) {
      await this.profileDropdown.click();
      await this.page.waitForTimeout(500);
    }
    if (await this.logoutButton.isVisible().catch(() => false)) {
      await this.logoutButton.click();
    }
    if (await this.logoutConfirmYes.isVisible().catch(() => false)) {
      await this.logoutConfirmYes.click();
    }
    await this.page.waitForURL(/\/login/, { timeout: 15000 }).catch(() => {});
  }
}
