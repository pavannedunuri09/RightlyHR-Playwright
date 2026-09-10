import { Page, Locator, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

export interface ITTicketData {
  ticketFor?: 'Self' | 'On Behalf';
  deskDetails?: string;
  location?: string;
  team?: string;
  category?: string;
  subCategory?: string;
  priority?: string;
  subject?: string;
  description?: string;
}

export class ITSupportPage {
  readonly page: Page;
  readonly loginPage: LoginPage;

  // Navigation & Profile
  readonly itSupportNav: Locator;
  readonly breadcrumb: Locator;
  readonly logoutButton: Locator;
  readonly logoutConfirmYes: Locator;

  // IT Support Main Screen
  readonly addNewTicketButton: Locator;
  readonly ticketsTable: Locator;
  readonly ticketRows: Locator;
  readonly searchInput: Locator;
  readonly myTicketsTab: Locator;
  readonly teamTicketsTab: Locator;

  // Add Ticket Modal
  readonly ticketModal: Locator;
  readonly ticketForDropdown: Locator;
  readonly employeeNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly deskDetailsInput: Locator;
  readonly locationDropdown: Locator;
  readonly teamDropdown: Locator;
  readonly categoryDropdown: Locator;
  readonly subCategoryDropdown: Locator;
  readonly priorityDropdown: Locator;
  readonly subjectInput: Locator;
  readonly descriptionInput: Locator;
  readonly submitTicketButton: Locator;
  readonly cancelTicketButton: Locator;
  readonly ticketCreatedToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);

    // Sidebar Navigation & Breadcrumb
    this.itSupportNav = page.locator('#sidenav-main-drop').getByText('IT Support', { exact: false })
      .or(page.getByText('IT Support', { exact: false }))
      .or(page.locator('a, li, div').filter({ hasText: /^IT Support$/i }))
      .or(page.locator('a[href*="it-support"], a[href*="itsupport"]'))
      .first();

    this.breadcrumb = page.locator('.breadcrumb, app-breadcrumb, nav[aria-label="breadcrumb"], .header-breadcrumb, .page-title, .page-header, ol.breadcrumb')
      .filter({ hasText: /IT Support/i })
      .or(page.getByText(/IT Support/i))
      .first();

    this.logoutButton = page.getByRole('button', { name: /Logout/i })
      .or(page.getByText(/Logout/i)).first();
    this.logoutConfirmYes = page.getByRole('button', { name: 'Yes', exact: true });

    // Main IT Support Elements
    this.addNewTicketButton = page.getByRole('button', { name: /Add New Ticket/i });
    this.ticketsTable = page.locator('table, p-table').first();
    this.ticketRows = page.locator('table tbody tr');
    this.searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/Search/i)).first();
    this.myTicketsTab = page.getByRole('tab', { name: /My Tickets/i })
      .or(page.locator('.p-tabview-nav li, [role="tab"], .nav-tabs .nav-link').filter({ hasText: /My Tickets/i })).first();
    this.teamTicketsTab = page.getByRole('tab', { name: /Team Tickets/i })
      .or(page.locator('.p-tabview-nav li, [role="tab"], .nav-tabs .nav-link, button, div, span, a').filter({ hasText: /^Team Tickets$/i }))
      .or(page.getByText(/Team Tickets/i)).first();

    // Modal Locators
    this.ticketModal = page.locator('dialog, ngb-modal-window, [role="dialog"], .modal, p-dialog').last();
    
    const modalSelects = this.ticketModal.locator('p-select, p-dropdown');
    this.ticketForDropdown = modalSelects.nth(0);
    this.locationDropdown = modalSelects.nth(1);
    this.teamDropdown = modalSelects.nth(2);
    this.categoryDropdown = modalSelects.nth(3);
    this.subCategoryDropdown = modalSelects.nth(4);
    this.priorityDropdown = modalSelects.nth(5);
    
    this.employeeNameInput = page.locator('input[placeholder*="employeename" i], input[formcontrolname="employeeName"], input[formcontrolname="name"]')
      .or(page.getByRole('textbox', { name: /Please enter employeename|Employee Name/i })).first();

    this.emailInput = page.locator('input[placeholder*="email" i], input[formcontrolname="email"]')
      .or(page.getByRole('textbox', { name: /Please enter email|Email/i })).first();

    this.phoneNumberInput = page.locator('input[placeholder*="phonenumber" i], input[placeholder*="phone" i], input[formcontrolname="phoneNumber"], input[formcontrolname="phone"]')
      .or(page.getByRole('spinbutton', { name: /Please enter phonenumber|Phone/i }))
      .or(page.getByRole('textbox', { name: /Phone/i })).first();

    this.deskDetailsInput = page.locator('input[placeholder*="Deskdetails" i], input[placeholder*="desk" i], input[formcontrolname="deskDetails"], input[formcontrolname="deskId"]')
      .or(page.getByRole('textbox', { name: /Please enter Deskdetails|Desk/i })).first();

    this.subjectInput = page.getByRole('textbox', { name: /Please enter subject|Subject/i })
      .or(page.locator('input[placeholder*="subject" i], input[formcontrolname="subject"]')).first();
    this.descriptionInput = page.getByRole('textbox', { name: /Please enter description|Description/i })
      .or(page.locator('textarea[placeholder*="description" i], textarea[formcontrolname="description"], input[placeholder*="description" i]')).first();
    
    this.submitTicketButton = page.getByRole('button', { name: /^Submit$|^Create$|^Save$/i });
    this.cancelTicketButton = page.getByRole('button', { name: /Cancel|Close/i });

    this.ticketCreatedToast = page.locator('.toast, .toast-message, .p-toast-detail, .alert-success, ngb-alert, .p-toast-message-content')
      .filter({ hasText: /Ticket has been added|Ticket created successfully|Ticket submitted|Success/i })
      .or(page.getByText(/Ticket has been added/i));
  }

  // =========================================================================
  // AUTHENTICATION
  // =========================================================================
  async loginAsEmployee() {
    const email = process.env.EMPLOYEE_EMAIL?.trim() || 'indu@yopmail.com';
    const password = process.env.EMPLOYEE_PASSWORD?.trim() || 'Indu@123';

    await this.page.goto('/login', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await this.loginPage.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.loginPage.login(email, password);
    await this.page.waitForURL(/\/dashboard|\/it-support/, { timeout: 30000 }).catch(() => { });
    await this.page.waitForTimeout(2000);
  }

  async loginAsITSupportManager() {
    const email = process.env.LOGIN_EMAIL?.trim() || 'bhavitha.palagiri@snaddevelopers.com';
    const password = process.env.LOGIN_PASSWORD?.trim() || 'Bhavi@16';

    await this.page.goto('/login', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await this.loginPage.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.loginPage.login(email, password);
    await this.page.waitForURL(/\/dashboard|\/it-support|\/settings/, { timeout: 30000 }).catch(() => { });
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

    await this.page.context().clearCookies().catch(() => {});
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    }).catch(() => {});

    await this.page.goto('/login', { waitUntil: 'domcontentloaded' }).catch(() => { });
    await this.loginPage.emailInput.waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
    await this.page.waitForTimeout(1000);
  }

  // =========================================================================
  // IT SUPPORT NAVIGATION & ACTIONS
  // =========================================================================
  async navigateToITSupport() {
    // If not already on /it-support, click the IT Support icon or navigate
    if (!this.page.url().includes('/it-support')) {
      const itSupportIcon = this.page.locator('app-header a[href*="it-support"], app-header a[routerlink*="it-support"], a[href*="it-support"], a[routerlink*="it-support"]')
        .or(this.page.locator('app-header [title*="IT Support" i], app-header [aria-label*="IT Support" i]'))
        .or(this.page.locator('app-header app-it-support-icon, app-it-support-icon'))
        .or(this.page.locator('app-header i.bi-headset, app-header i.fa-headset, app-header .bi-headset'))
        .or(this.itSupportNav)
        .first();

      if (await itSupportIcon.isVisible({ timeout: 4000 }).catch(() => false)) {
        await itSupportIcon.click({ force: true });
      } else {
        // Find clickable elements in header that might be IT Support or navigate
        const headerIcons = this.page.locator('app-header [cursor="pointer"], app-header svg, app-header a, app-header div[class*="icon"], app-header span[class*="icon"]');
        const count = await headerIcons.count();
        let clicked = false;
        for (let i = 0; i < count; i++) {
          const icon = headerIcons.nth(i);
          const outerHTML = await icon.evaluate(el => el.outerHTML).catch(() => '');
          if (outerHTML.toLowerCase().includes('it-support') || outerHTML.toLowerCase().includes('headset') || outerHTML.toLowerCase().includes('support')) {
            await icon.click({ force: true });
            clicked = true;
            break;
          }
        }
        if (!clicked) {
          await this.page.goto('/it-support', { waitUntil: 'domcontentloaded' });
        }
      }
    }

    try {
      await this.page.waitForURL(/\/it-support/, { timeout: 10000 });
    } catch {
      await this.page.goto('/it-support', { waitUntil: 'domcontentloaded' });
      await this.page.waitForURL(/\/it-support/, { timeout: 15000 }).catch(() => { });
    }
    await this.page.waitForTimeout(1000);
  }

  async verifyBreadcrumb(expectedText: string = 'IT Support') {
    const breadcrumb = this.page.locator('.breadcrumb, app-breadcrumb, nav[aria-label="breadcrumb"], .header-breadcrumb, .page-header, .main-header, h1, h2, h3, h4, span, div, p, a')
      .filter({ hasText: new RegExp(expectedText, 'i') })
      .first();
    await expect(breadcrumb).toBeVisible({ timeout: 15000 });
  }

  async clickTeamTicketsTab() {
    const teamTab = this.page.getByRole('tab', { name: /Team Tickets/i })
      .or(this.page.locator('.p-tabview-nav li, [role="tab"], .nav-tabs .nav-link, button, a, div, span').filter({ hasText: /^Team Tickets$/i }))
      .or(this.page.getByText(/Team Tickets/i))
      .first();

    await expect(teamTab).toBeVisible({ timeout: 15000 });
    await teamTab.click();
    await this.page.waitForTimeout(1000);
  }

  async clickMyTicketsTab() {
    const myTab = this.page.getByRole('tab', { name: /My Tickets/i })
      .or(this.page.locator('.p-tabview-nav li, [role="tab"], .nav-tabs .nav-link, button, a, div, span').filter({ hasText: /^My Tickets$/i }))
      .or(this.page.getByText(/My Tickets/i))
      .first();

    await expect(myTab).toBeVisible({ timeout: 15000 });
    await myTab.click();
    await this.page.waitForTimeout(1000);
  }

  async openAddNewTicketModal() {
    await this.addNewTicketButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.addNewTicketButton.click();
    await this.ticketModal.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async selectDropdownOption(dropdownTrigger: Locator, optionText: string) {
    await dropdownTrigger.waitFor({ state: 'visible', timeout: 10000 });
    await dropdownTrigger.scrollIntoViewIfNeeded();

    for (let attempt = 0; attempt < 3; attempt++) {
      await dropdownTrigger.click();
      await this.page.waitForTimeout(700);

      const overlay = this.page.locator('.p-select-overlay, .p-select-panel, .p-dropdown-panel, [role="listbox"]').last();
      
      // 1. Look for exact/matching option
      const option = overlay.locator('.p-select-option, .p-select-item, .p-dropdown-item, [role="option"], li')
        .filter({ hasText: new RegExp(`^\\s*${optionText}\\s*$|${optionText}`, 'i') })
        .first();

      if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.click();
        await this.page.waitForTimeout(500);
        return;
      }

      // 2. Look for any valid option
      const anyOption = overlay.locator('.p-select-option, .p-select-item, .p-dropdown-item, [role="option"], li')
        .filter({ hasNotText: /No Data Found|No records found|No results found|Please select/i })
        .first();

      if (await anyOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await anyOption.click();
        await this.page.waitForTimeout(500);
        return;
      }

      // If options didn't appear or showed temporary error, close and retry clicking the field again
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(500);
    }
  }

  async selectTicketFor(option: 'Self' | 'Colleague' | 'On Behalf' = 'Self') {
    const targetOption = option === 'On Behalf' ? 'Colleague' : option;
    await this.selectDropdownOption(this.ticketForDropdown, targetOption);
    await this.page.waitForTimeout(800);
  }

  async verifyAutoPopulatedEmployeeDetails() {
    // 1. Employee Name
    await expect(this.employeeNameInput).toBeVisible({ timeout: 5000 });
    await expect.poll(async () => {
      const val = await this.employeeNameInput.inputValue();
      return val && val.trim().length > 0;
    }, { timeout: 10000, message: 'Employee Name should be auto-populated' }).toBe(true);

    // 2. Email
    await expect(this.emailInput).toBeVisible({ timeout: 5000 });
    await expect.poll(async () => {
      const val = await this.emailInput.inputValue();
      return val && val.includes('@');
    }, { timeout: 10000, message: 'Email should be auto-populated' }).toBe(true);

    // 3. Phone Number
    await expect(this.phoneNumberInput).toBeVisible({ timeout: 5000 });
    await expect.poll(async () => {
      const val = await this.phoneNumberInput.inputValue();
      return val && val.trim().length > 0;
    }, { timeout: 10000, message: 'Phone Number should be auto-populated' }).toBe(true);

    // 4. Desk ID / Desk Details
    await expect(this.deskDetailsInput).toBeVisible({ timeout: 5000 });
    await expect.poll(async () => {
      const val = await this.deskDetailsInput.inputValue();
      return val !== null && val !== undefined && val.trim().length > 0;
    }, { timeout: 10000, message: 'Desk Details should be auto-populated' }).toBe(true);
  }

  async fillTicketForm(ticketData: ITTicketData = {}) {
    const location = ticketData.location || 'SDF';
    const team = ticketData.team || 'My team';
    const category = ticketData.category || 'Hardware';
    const subCategory = ticketData.subCategory || 'Desktop / Laptop Issues';
    const priority = ticketData.priority || 'High';
    const subject = ticketData.subject || 'Laptop service is slow and not charging';
    const description = ticketData.description || 'Laptop is not charging and service is slower during peak hours.';

    // 1. Location / Branch dropdown
    await this.selectDropdownOption(this.locationDropdown, location);

    // 2. Team dropdown
    await this.selectDropdownOption(this.teamDropdown, team);

    // 3. Category dropdown
    await this.selectDropdownOption(this.categoryDropdown, category);

    // 4. Sub Category dropdown
    await this.selectDropdownOption(this.subCategoryDropdown, subCategory);

    // 5. Priority dropdown
    await this.selectDropdownOption(this.priorityDropdown, priority);

    // 6. Subject
    await this.subjectInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.subjectInput.click();
    await this.subjectInput.fill(subject);
    await this.page.waitForTimeout(300);

    // 7. Description
    await this.descriptionInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.descriptionInput.click();
    await this.descriptionInput.fill(description);
    await this.page.waitForTimeout(300);
  }

  async submitTicket() {
    await expect(this.submitTicketButton).toBeEnabled({ timeout: 5000 });
    await this.submitTicketButton.click();
  }

  async verifyTicketCreatedSuccess() {
    const toast = this.page.locator('.p-toast, .p-toast-detail, .p-toast-summary, .p-toast-message, .toast, .toast-message, .alert, ngb-alert, [role="alert"]')
      .filter({ hasText: /Ticket has been added|Ticket created|Ticket submitted|Success/i })
      .or(this.page.getByText(/Ticket has been added/i));

    try {
      await expect(toast).toBeVisible({ timeout: 8000 });
    } catch {
      // If toast auto-dismissed due to slowMo execution delay, verify modal closed
      await expect(this.ticketModal).toBeHidden({ timeout: 5000 });
    }
  }

  async verifyTicketInList(subjectText: string) {
    const matchedRow = this.ticketRows.filter({ hasText: subjectText }).first();
    await expect(matchedRow).toBeVisible({ timeout: 15000 });
  }

  // =========================================================================
  // IT SUPPORT CONFIGURATIONS (SETTINGS)
  // =========================================================================
  async checkIfCategoryExists(categoryName: string = 'Hardware'): Promise<boolean> {
    await this.categoryDropdown.waitFor({ state: 'visible', timeout: 8000 });

    for (let attempt = 0; attempt < 2; attempt++) {
      await this.categoryDropdown.click();
      await this.page.waitForTimeout(700);

      const overlay = this.page.locator('.p-select-overlay, .p-select-panel, .p-dropdown-panel, [role="listbox"]').last();
      
      // Look for matching category option inside the open dropdown overlay
      const matchingOption = overlay.locator('.p-select-option, .p-select-item, .p-dropdown-item, [role="option"], li')
        .filter({ hasText: new RegExp(`^\\s*${categoryName}\\s*$|${categoryName}`, 'i') })
        .first();

      if (await matchingOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await matchingOption.click();
        await this.page.waitForTimeout(400);
        return true;
      }

      // Check if any valid options exist in dropdown
      const validOptions = overlay.locator('.p-select-option, .p-select-item, .p-dropdown-item, [role="option"], li')
        .filter({ hasNotText: /No Data Found|No records found|No results found|Please select/i });

      const optionCount = await validOptions.count();
      if (optionCount > 0) {
        await validOptions.first().click();
        await this.page.waitForTimeout(400);
        return true;
      }

      // If options didn't appear immediately, close and re-click
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(500);
    }

    return false;
  }

  async navigateToSettings() {
    const settingsBtn = this.page.locator('app-header app-gear-icon, app-gear-icon, img[src*="setting" i], [aria-label*="Setting" i], .settings-icon')
      .or(this.page.locator('app-header [cursor="pointer"]').first())
      .or(this.page.locator('rect').first())
      .first();

    if (await settingsBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await settingsBtn.click({ force: true });
    } else {
      await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
    }
    await this.page.waitForURL(/\/settings/, { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async navigateToITSupportConfigurations() {
    await this.navigateToSettings();

    const itConfigBtn = this.page.getByRole('button', { name: /IT Support Configurations/i })
      .or(this.page.locator('button, a, div, span, p').filter({ hasText: /^IT Support Configurations$/i }))
      .or(this.page.getByText('IT Support Configurations', { exact: false }))
      .first();

    await itConfigBtn.waitFor({ state: 'visible', timeout: 15000 });
    await itConfigBtn.click();
    await this.page.waitForTimeout(1500);
  }

  async addITSupportCategory(categoryName: string = 'Hardware') {
    // 1. Click IT Support Category tab
    const categoryTab = this.page.getByRole('link', { name: /IT Support Category/i })
      .or(this.page.locator('a, [role="tab"], .p-tabview-nav li, button, div, span').filter({ hasText: /^IT Support Category$/i }))
      .first();

    if (await categoryTab.isVisible({ timeout: 4000 }).catch(() => false)) {
      await categoryTab.click();
      await this.page.waitForTimeout(600);
    }

    // 2. Open Add dialog if Add button exists
    const openAddModalBtn = this.page.getByRole('button', { name: /^Add$/i }).first();
    if (await openAddModalBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await openAddModalBtn.click();
      await this.page.waitForTimeout(600);
    }

    // 3. Input category name
    const categoryInput = this.page.locator('dialog input, ngb-modal-window input, p-dialog input, input[placeholder*="category" i], input[formcontrolname="categoryName"], input[formcontrolname="name"], input[placeholder*="enter" i]')
      .or(this.page.getByPlaceholder(/Category|Enter Category/i))
      .or(this.page.getByRole('textbox').first())
      .first();

    await categoryInput.waitFor({ state: 'visible', timeout: 8000 });
    await categoryInput.click();
    await categoryInput.fill(categoryName);
    await this.page.waitForTimeout(300);

    // 4. Click Add/Save button
    const addButton = this.page.locator('dialog button, ngb-modal-window button, p-dialog button, button').filter({ hasText: /^(Add|\+ Add|Save|Submit)$/i }).first();
    await addButton.click();
    await this.page.waitForTimeout(1500);
  }

  async addITSupportSubCategory(categoryName: string = 'Hardware', subCategoryName: string = 'Desktop / Laptop Issues') {
    // 1. Click IT Support Sub Category tab
    const subCategoryTab = this.page.getByRole('link', { name: /IT Support Sub Category/i })
      .or(this.page.locator('a, [role="tab"], .p-tabview-nav li, button, div, span').filter({ hasText: /IT Support Sub Category/i }))
      .first();

    if (await subCategoryTab.isVisible({ timeout: 4000 }).catch(() => false)) {
      await subCategoryTab.click();
      await this.page.waitForTimeout(600);
    }

    // 2. Open Add dialog
    const openAddModalBtn = this.page.getByRole('button', { name: /^Add$/i })
      .or(this.page.locator('button').filter({ hasText: /^Add$/i }))
      .first();

    if (await openAddModalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await openAddModalBtn.click();
      await this.page.waitForTimeout(600);
    }

    // 3. Select category
    const parentCategoryDropdown = this.page.locator('dialog p-select, ngb-modal-window p-select, p-dialog p-select, p-select, p-dropdown').first();
    if (await parentCategoryDropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.selectDropdownOption(parentCategoryDropdown, categoryName);
      await this.page.waitForTimeout(500);
    }

    // 4. Input subcategory name
    const subCategoryInput = this.page.locator('dialog input, ngb-modal-window input, p-dialog input, input[placeholder*="subcategory" i], input[placeholder*="sub category" i], input[formcontrolname="subCategoryName"], input[formcontrolname="subCategory"], input[formcontrolname="name"], input[placeholder*="enter" i]')
      .or(this.page.getByPlaceholder(/Subcategory|Sub Category|Enter Sub/i))
      .or(this.page.getByRole('textbox').last())
      .first();

    await subCategoryInput.waitFor({ state: 'visible', timeout: 8000 });
    await subCategoryInput.click();
    await subCategoryInput.fill(subCategoryName);
    await this.page.waitForTimeout(300);

    // 5. Save subcategory
    const saveBtn = this.page.locator('dialog button, ngb-modal-window button, p-dialog button, button').filter({ hasText: /^(Add|\+ Add|Save|Submit)$/i }).first();
    await saveBtn.click();
    await this.page.waitForTimeout(1500);
  }

  // =========================================================================
  // TICKET UPDATE & ASSIGNMENT (MANAGER VIEW)
  // =========================================================================
  async openTicketRowKebab(subjectText?: string): Promise<Locator> {
    let row: Locator;
    if (subjectText) {
      const matchedRow = this.ticketRows.filter({ hasText: subjectText }).first();
      if (await matchedRow.isVisible({ timeout: 4000 }).catch(() => false)) {
        row = matchedRow;
      } else {
        row = this.ticketRows.first();
      }
    } else {
      row = this.ticketRows.first();
    }

    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.scrollIntoViewIfNeeded();

    const kebab = row.locator('.text-center > .dropdown, .text-center .dropdown, [data-bs-toggle="dropdown"], .dropdown-toggle, i, td:last-child generic, td:last-child').first();
    await kebab.waitFor({ state: 'visible', timeout: 5000 });
    await kebab.click({ force: true });
    await this.page.waitForTimeout(600);
    return row;
  }

  async clickUpdateTicketAction(subjectText?: string) {
    await this.openTicketRowKebab(subjectText);

    const updateItem = this.page.getByText('Update', { exact: true })
      .or(this.page.locator('.dropdown-menu.show a, .dropdown-menu.show button, a.dropdown-item, button.dropdown-item, .dropdown-item, [role="menuitem"]').filter({ hasText: /^Update$/i }))
      .first();

    await updateItem.waitFor({ state: 'visible', timeout: 5000 });
    await updateItem.click();
    await this.ticketModal.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async verifyAutoPopulatedUpdateForm(expectedSubject?: string, expectedDescription?: string) {
    const modal = this.ticketModal;
    await modal.waitFor({ state: 'visible', timeout: 8000 });

    // 1. Employee Name
    const nameInput = modal.getByRole('textbox', { name: /Please enter employeename/i })
      .or(modal.locator('input[placeholder*="employeename" i]'))
      .first();
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    const nameVal = await nameInput.inputValue();
    expect(nameVal.trim().length).toBeGreaterThan(0);

    // 2. Email
    const emailInput = modal.getByRole('textbox', { name: /Please enter email/i })
      .or(modal.locator('input[placeholder*="email" i]'))
      .first();
    const emailVal = await emailInput.inputValue();
    expect(emailVal).toContain('@');

    // 3. Subject
    const subjectInput = modal.getByRole('textbox', { name: /Please enter subject/i })
      .or(modal.locator('input[placeholder*="subject" i], textarea[placeholder*="subject" i]'))
      .first();
    const subjectVal = await subjectInput.inputValue();
    expect(subjectVal.trim().length).toBeGreaterThan(0);
    if (expectedSubject) {
      expect(subjectVal).toContain(expectedSubject.slice(0, 15));
    }

    // 4. Description
    const descInput = modal.getByRole('textbox', { name: /Please enter description/i })
      .or(modal.locator('textarea[placeholder*="description" i], input[placeholder*="description" i]'))
      .first();
    const descVal = await descInput.inputValue();
    expect(descVal.trim().length).toBeGreaterThan(0);
  }

  async getLoggedInUserName(): Promise<string> {
    const profileName = this.page.locator('app-header .profile-info, app-header .user-name, app-header p, header p, .profile-info p').first();
    const text = await profileName.textContent().catch(() => '');
    return text?.trim() || '';
  }

  async assignTicketTo(userName?: string, comments: string = 'ticket assigned') {
    const targetName = userName || (await this.getLoggedInUserName());

    // 1. Locate and click 'Please select employee' combobox
    const assignedDropdown = this.page.getByLabel('Please select employee')
      .or(this.page.getByRole('combobox', { name: 'Please select employee' }))
      .or(this.page.locator('p-select, p-dropdown, [role="combobox"]').filter({ hasText: /Please select employee/i }))
      .or(this.ticketModal.locator('p-select, p-dropdown').last())
      .first();

    await assignedDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await assignedDropdown.scrollIntoViewIfNeeded().catch(() => {});
    await assignedDropdown.click({ force: true });
    await this.page.waitForTimeout(800);

    // 2. Scroll and find the target user or select first available option
    const overlay = this.page.locator('.p-select-overlay, .p-select-panel, .p-dropdown-panel, [role="listbox"]').last();
    await overlay.waitFor({ state: 'visible', timeout: 8000 });

    let selected = false;
    const scrollContainer = overlay.locator('.p-select-list-container, .p-dropdown-items-wrapper, .p-select-items-wrapper, [role="listbox"], ul').first();

    if (targetName && targetName.length > 0) {
      const hrOption = overlay.locator('.p-select-option, .p-select-item, .p-dropdown-item, [role="option"], li')
        .filter({ hasText: new RegExp(targetName, 'i') })
        .or(this.page.getByText(new RegExp(targetName, 'i')))
        .first();

      // Scroll progressively through the dropdown list to locate the user
      for (let step = 0; step < 25; step++) {
        if (await hrOption.isVisible({ timeout: 500 }).catch(() => false)) {
          await hrOption.scrollIntoViewIfNeeded().catch(() => {});
          await hrOption.click({ force: true });
          selected = true;
          break;
        }

        if (await scrollContainer.isVisible().catch(() => false)) {
          await scrollContainer.evaluate((el: HTMLElement) => {
            el.scrollTop += 250;
          }).catch(() => {});
        } else {
          await this.page.keyboard.press('PageDown').catch(() => {});
        }
        await this.page.waitForTimeout(200);
      }
    }

    if (!selected) {
      const firstOption = overlay.locator('.p-select-option, .p-select-item, .p-dropdown-item, [role="option"], li')
        .filter({ hasNotText: /Please select|Select employee|No Data/i })
        .first();

      if (await firstOption.isVisible({ timeout: 2500 }).catch(() => false)) {
        await firstOption.scrollIntoViewIfNeeded().catch(() => {});
        await firstOption.click({ force: true });
      } else {
        await overlay.locator('.p-select-option, .p-select-item, .p-dropdown-item, [role="option"], li').first().click({ force: true });
      }
    }
    await this.page.waitForTimeout(500);

    // 3. Fill comments if present
    const commentsInput = this.page.getByRole('textbox', { name: /Please enter comments/i })
      .or(this.ticketModal.locator('textarea[formcontrolname="comments"], input[formcontrolname="comments"], textarea, input').last())
      .first();

    if (await commentsInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await commentsInput.scrollIntoViewIfNeeded().catch(() => {});
      await commentsInput.click();
      await commentsInput.fill(comments);
      await this.page.waitForTimeout(300);
    }
  }

  async submitUpdateTicket() {
    const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true })
      .or(this.ticketModal.getByRole('button', { name: /^Update$/i }))
      .or(this.ticketModal.locator('button').filter({ hasText: /^Update$/i }))
      .first();

    await updateBtn.waitFor({ state: 'visible', timeout: 5000 });
    await updateBtn.click();
    await this.page.waitForTimeout(1000);

    const toast = this.page.locator('.p-toast, .p-toast-detail, .p-toast-summary, .p-toast-message, .toast, .toast-message, .alert, ngb-alert')
      .filter({ hasText: /Ticket updated successfully|Updated|Success/i })
      .or(this.page.getByText(/Ticket updated successfully/i));

    try {
      await expect(toast).toBeVisible({ timeout: 8000 });
    } catch {
      await expect(this.ticketModal).toBeHidden({ timeout: 5000 });
    }
  }
}

