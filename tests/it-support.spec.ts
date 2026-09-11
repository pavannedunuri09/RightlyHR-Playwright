import { test, expect, Page } from '@playwright/test';
import { ITSupportPage } from '../pages/ITSupportPage';

test.describe.serial('IT Support Module End-to-End Test Suite', () => {
  let page: Page;
  let itSupportPage: ITSupportPage;

  const subjectTitles = [
    'Laptop Battery Drainage Issue',
    'Screen Flickering and Display Problem',
    'Keyboard and Touchpad Not Working',
    'System Running Very Slow During Peak Hours',
    'VPN Connection Dropping Frequently',
    'Headset Microphone Not Recognized',
  ];
  const randomTitle = subjectTitles[Math.floor(Math.random() * subjectTitles.length)];
  const testSubject = `${randomTitle} - ${Date.now().toString().slice(-4)}`;
  const testDescription = `${randomTitle}. Requesting IT team support for troubleshooting and resolution.`;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    itSupportPage = new ITSupportPage(page);
  });

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`[DEBUG] Test "${testInfo.title}" failed. Pausing execution for analysis...`);
      await page?.pause();
    }
  });

  test.afterAll(async () => {
    await page?.close();
  });

  // =========================================================================
  // TEST 01: EMPLOYEE LOGIN, CLICK IT SUPPORT IN NAVBAR & VERIFY BREADCRUMB
  // =========================================================================
  test('01. login as employee, click on itsupport module in the navigation bar, and verify the breadcrumb text', async () => {
    // 1. Login as employee
    await itSupportPage.loginAsEmployee();

    // 2. Click on IT Support module in the navigation bar
    await itSupportPage.navigateToITSupport();

    // 3. Verify the breadcrumb text
    await itSupportPage.verifyBreadcrumb('IT Support');

    // 4. Verify 'Add New Ticket' button is present
    await expect(itSupportPage.addNewTicketButton).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // TEST 02: ADD NEW TICKET (SELF), VERIFY AUTO-POPULATED DETAILS & SUBMIT
  // =========================================================================
  test('02. click on Add new ticket, verify category availability (configure via settings if missing), fill required fields, submit and verify success popup', async () => {
    const targetLocation = 'SDF';
    const targetTeam = 'My team';
    const targetCategory = 'Hardware';
    const targetSubCategory = 'Desktop / Laptop Issues';

    // 1. Click Add New Ticket button
    await itSupportPage.openAddNewTicketModal();

    // 2. Select Self in Ticket Raised For dropdown
    await itSupportPage.selectTicketFor('Self');

    // 3. Verify logged in employee details (name, email, phone, desk id) are auto-populated
    await itSupportPage.verifyAutoPopulatedEmployeeDetails();

    // 4. Select Location and Team to load category dependencies
    await itSupportPage.selectDropdownOption(itSupportPage.locationDropdown, targetLocation);
    await itSupportPage.selectDropdownOption(itSupportPage.teamDropdown, targetTeam);

    // 5. Check if Category values exist in Category dropdown
    const categoryExists = await itSupportPage.checkIfCategoryExists(targetCategory);

    if (!categoryExists) {
      console.log(`[INFO] Category "${targetCategory}" not found in dropdown. Navigating to Settings to configure Category and Subcategory...`);

      // Close current ticket modal
      if (await itSupportPage.cancelTicketButton.isVisible().catch(() => false)) {
        await itSupportPage.cancelTicketButton.click();
        await itSupportPage.page.waitForTimeout(500);
      }

      // Switch to HR / Manager to configure Settings (Employee does not have Settings icon)
      await itSupportPage.logout();
      await itSupportPage.loginAsITSupportManager();

      // Navigate to Settings -> IT Support Configurations
      await itSupportPage.navigateToITSupportConfigurations();

      // Configure Category
      await itSupportPage.addITSupportCategory(targetCategory);

      // Configure Subcategory
      await itSupportPage.addITSupportSubCategory(targetCategory, targetSubCategory);

      // Log out as HR and log back in as Employee
      await itSupportPage.logout();
      await itSupportPage.loginAsEmployee();

      // Navigate back to IT Support and reopen Add New Ticket modal
      await itSupportPage.navigateToITSupport();
      await itSupportPage.openAddNewTicketModal();
      await itSupportPage.selectTicketFor('Self');
      await itSupportPage.selectDropdownOption(itSupportPage.locationDropdown, targetLocation);
      await itSupportPage.selectDropdownOption(itSupportPage.teamDropdown, targetTeam);
    } else {
      console.log(`[INFO] Category values are already available in dropdown. Skipping configuration step.`);
    }

    // 6. Fill Sub Category, Priority, Subject, and Description
    await itSupportPage.selectDropdownOption(itSupportPage.subCategoryDropdown, targetSubCategory);
    await itSupportPage.selectDropdownOption(itSupportPage.priorityDropdown, 'High');

    await itSupportPage.subjectInput.waitFor({ state: 'visible', timeout: 5000 });
    await itSupportPage.subjectInput.click();
    await itSupportPage.subjectInput.fill(testSubject);
    await itSupportPage.page.waitForTimeout(300);

    await itSupportPage.descriptionInput.waitFor({ state: 'visible', timeout: 5000 });
    await itSupportPage.descriptionInput.click();
    await itSupportPage.descriptionInput.fill(testDescription);
    await itSupportPage.page.waitForTimeout(300);

    // 7. Click Submit button
    await itSupportPage.submitTicket();

    // 8. Verify success popup
    await itSupportPage.verifyTicketCreatedSuccess();
  });

  // =========================================================================
  // TEST 03: VERIFY NEWLY CREATED TICKET IN TICKET LIST
  // =========================================================================
  test('03. verify newly created ticket is displayed in the tickets list', async () => {
    // Verify ticket row exists with the matching subject
    await itSupportPage.verifyTicketInList(testSubject);
  });

  // =========================================================================
  // TEST 04: LOGOUT AS EMPLOYEE
  // =========================================================================
  test('04. logout as employee', async () => {
    await itSupportPage.logout();
    await expect(itSupportPage.loginPage.emailInput).toBeVisible({ timeout: 15000 });
  });

  // =========================================================================
  // TEST 05: LOGIN AS IT SUPPORT MANAGER (HR) & NAVIGATE TO TEAM TICKETS TAB
  // =========================================================================
  test('05. login as itsupport manager using hr credentials, click on it support and click on team tickets tab', async () => {
    // 1. Login as IT Support Manager using HR credentials
    await itSupportPage.loginAsITSupportManager();

    // 2. Click on IT Support module in the navigation bar
    await itSupportPage.navigateToITSupport();

    // 3. Verify the breadcrumb text
    await itSupportPage.verifyBreadcrumb('IT Support');

    // 4. Click on Team Tickets tab
    await itSupportPage.clickTeamTicketsTab();

    // 5. Verify Team Tickets tab is displayed
    await expect(itSupportPage.teamTicketsTab).toBeVisible({ timeout: 10000 });
  });

  // =========================================================================
  // TEST 06: TEAM TICKETS - KEBAB MENU -> UPDATE -> VERIFY VALUES -> ASSIGN TO BHAVITHA REDDY -> UPDATE
  // =========================================================================
  test('06. in team tickets click on kebab menu for the ticket raised, click update, verify auto-populated values, select bhavitha reddy in ticket assigned to, and click update', async () => {
    // 1. Click on the kebab menu for the ticket raised and click Update
    await itSupportPage.clickUpdateTicketAction(testSubject);

    // 2. Verify all auto-populated values in update modal
    await itSupportPage.verifyAutoPopulatedUpdateForm(testSubject, testDescription);

    // 3. Open Ticket Assigned To and select Bhavitha Reddy
    await itSupportPage.assignTicketTo('Bhavitha Reddy');

    // 4. Click on Update button
    await itSupportPage.submitUpdateTicket();
  });

  // =========================================================================
  // TEST 07: OPEN TICKETS - KEBAB MENU -> UPDATE -> VERIFY DETAILS -> ASSIGN TO SAII PAVAN -> UPDATE
  // =========================================================================
  test('07. in open tickets tab, click update option, verify details filled while raising ticket, select saii pavan in ticket assigned to, and click update', async () => {
    // 1. Click on Open Tickets tab
    await itSupportPage.clickOpenTicketsTab();

    // 2. Click on the kebab menu for the ticket and click Update
    await itSupportPage.clickUpdateTicketAction(testSubject);

    // 3. Verify details that employee filled while raising the ticket
    await itSupportPage.verifyAutoPopulatedUpdateForm(testSubject, testDescription);

    // 4. Click on ticket assigned to dropdown and select saii pavan
    await itSupportPage.assignTicketTo('saii pavan');

    // 5. Click on Update button
    await itSupportPage.submitUpdateTicket();
  });

  // =========================================================================
  // TEST 08: CLICK UPDATE POPUP, CLICK STATUS FIELD AND CHANGE FROM OPEN TO AWAIT ON USER, VERIFY MOVED TO AWAIT ON USER TAB & COUNTS
  // =========================================================================
  test('08. click on update popup, click on status field and change the status from open to await on user, verify ticket moved to await on user tab and verify counts', async () => {
    // 1. Log tab counts before update
    const allCountBefore = await itSupportPage.getAllTicketsCount();
    const openCountBefore = await itSupportPage.getOpenTicketsCount();
    const awaitCountBefore = await itSupportPage.getAwaitOnUserTicketsCount();
    console.log(`All Tickets count before update: ${allCountBefore}`);
    console.log(`Open Tickets count before update: ${openCountBefore}`);
    console.log(`Await on User count before update: ${awaitCountBefore}`);

    // 2. Click on the kebab menu for the ticket and click Update to open update popup
    await itSupportPage.clickUpdateTicketAction(testSubject);

    // 3. Click on status field, change status from Open to Await on User, and click on Await on User option
    await itSupportPage.updateTicketStatus('Await on User');

    // 4. Click on Update button
    await itSupportPage.submitUpdateTicket();

    // 5. Verify request is moved from open tickets tab to await on user tab
    await itSupportPage.verifyTicketInAwaitOnUserTab(testSubject);

    // 6. Log tab counts after update reflecting moved ticket
    const rawAll = await itSupportPage.getAllTicketsCount();
    const rawOpen = await itSupportPage.getOpenTicketsCount();
    const rawAwait = await itSupportPage.getAwaitOnUserTicketsCount();
    
    expect(rawAll).toBe(allCountBefore);
    expect(rawOpen).toBe(openCountBefore - 1);
    expect(rawAwait).toBe(awaitCountBefore + 1);
  });

  // =========================================================================
  // TEST 09: CLICK UPDATE POPUP, CLICK STATUS FIELD AND CHANGE FROM AWAIT ON USER TO REJECTED, VERIFY MOVED TO REJECTED TAB & COUNTS
  // =========================================================================
  test('09. click on update popup, click on status field and change the status from await on user to rejected, verify ticket moved to rejected tab and verify counts', async () => {
    // 1. Log tab counts before update
    const allCountBefore = await itSupportPage.getAllTicketsCount();
    const awaitCountBefore = await itSupportPage.getAwaitOnUserTicketsCount();
    const rejectedCountBefore = await itSupportPage.getRejectedTicketsCount();
    console.log(`All Tickets count before update: ${allCountBefore}`);
    console.log(`Await on User count before update: ${awaitCountBefore}`);
    console.log(`Rejected Tickets count before update: ${rejectedCountBefore}`);

    // 2. Click on the kebab menu for the ticket and click Update to open update popup
    await itSupportPage.clickUpdateTicketAction(testSubject);

    // 3. Click on status field, change status from Await on User to Rejected, and click on Rejected option
    await itSupportPage.updateTicketStatus('Rejected', 'Ticket rejected by manager');

    // 4. Click on Update button
    await itSupportPage.submitUpdateTicket();

    // 5. Verify request is moved from await on user tab to rejected tab
    await itSupportPage.verifyTicketInRejectedTab(testSubject);

    // 6. Log tab counts after update reflecting moved ticket
    const allCountAfter = await itSupportPage.getAllTicketsCount();
    const awaitCountAfter = await itSupportPage.getAwaitOnUserTicketsCount();
    const rejectedCountAfter = await itSupportPage.getRejectedTicketsCount();

    expect(allCountAfter).toBe(allCountBefore);
    expect(awaitCountAfter).toBe(awaitCountBefore - 1);
    expect(rejectedCountAfter).toBe(rejectedCountBefore + 1);
  });

  test('10. move the rejected ticket back to Open and verify tab and counts', async () => {
    const allCountBefore = await itSupportPage.getAllTicketsCount();
    const rejectedCountBefore = await itSupportPage.getRejectedTicketsCount();
    const openCountBefore = await itSupportPage.getOpenTicketsCount();

    await itSupportPage.clickRejectedTicketsTab();
    await itSupportPage.clickUpdateTicketAction(testSubject);
    await itSupportPage.updateTicketStatus('Open', 'Reopening ticket');
    await itSupportPage.submitUpdateTicket();

    await itSupportPage.verifyTicketInOpenTab(testSubject);
    expect(await itSupportPage.getAllTicketsCount()).toBe(allCountBefore);
    expect(await itSupportPage.getRejectedTicketsCount()).toBe(rejectedCountBefore - 1);
    expect(await itSupportPage.getOpenTicketsCount()).toBe(openCountBefore + 1);
  });

  test('11. assign the open ticket to Bhavitha Reddy, close it, and verify Closed counts', async () => {
    const allCountBefore = await itSupportPage.getAllTicketsCount();
    const openCountBefore = await itSupportPage.getOpenTicketsCount();
    const closedCountBefore = await itSupportPage.getClosedTicketsCount();

    await itSupportPage.clickOpenTicketsTab();
    await itSupportPage.clickUpdateTicketAction(testSubject);
    await itSupportPage.assignTicketTo('Bhavitha Reddy');
    await itSupportPage.updateTicketStatus('Closed', 'Ticket closed by manager');
    await itSupportPage.submitUpdateTicket();

    await itSupportPage.verifyTicketInClosedTab(testSubject);
    expect(await itSupportPage.getAllTicketsCount()).toBe(allCountBefore);
    expect(await itSupportPage.getOpenTicketsCount()).toBe(openCountBefore - 1);
    expect(await itSupportPage.getClosedTicketsCount()).toBe(closedCountBefore + 1);
  });

  test('12. verify Closed tickets do not display the Update action', async () => {
    await itSupportPage.verifyClosedTicketHasNoUpdate(testSubject);
  });
});
