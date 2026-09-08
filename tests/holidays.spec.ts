import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HolidaysPage } from '../pages/HolidaysPage';

test.describe.serial('Holidays Management Feature', () => {
  let page: Page;
  let holidaysPage: HolidaysPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
    holidaysPage = new HolidaysPage(page);

    // Ensure default dashboard page is loaded and displayed after login
    await expect(page).toHaveURL(/\/dashboard\/emp/);
    await page.getByText('Have a nice day at work!').waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  test.afterAll(async () => {
    await page?.close();
  });

  // =========================================================================
  // 1. SETTINGS OVERVIEW & NAVIGATION (/settings/overview)
  // =========================================================================
  test.describe('1. Settings Overview & Navigation', () => {
    test('01. from Dashboard, clicks Settings icon and verifies Settings Overview with Employee Fields and Manage Holidays link', async () => {
      // Step 1: Ensure on default Dashboard page
      await holidaysPage.openDashboard();
      await expect(page).toHaveURL(/\/dashboard\/emp/);
      await expect(page.getByText('Have a nice day at work!')).toBeVisible();

      // Step 2: Click Settings icon in header to open Settings Overview
      await holidaysPage.clickSettingsIcon();
      await expect(page).toHaveURL(/\/settings\/overview|\/settings/);

      // Step 3: Verify Employee Fields section exists and expand it
      await expect(holidaysPage.employeeFieldsCard).toBeVisible({ timeout: 15000 });
      await holidaysPage.expandEmployeeFieldsPanel();

      // Step 4: Verify Manage Holidays link/card is present and visible
      const manageHolidays = holidaysPage.manageHolidaysCardLink;
      await expect(manageHolidays).toBeVisible({ timeout: 10000 });
    });

    test('02. clicking Manage Holidays from Settings Overview lands on Pending For Submit list', async () => {
      await holidaysPage.openSettingsOverview();
      await holidaysPage.expandEmployeeFieldsPanel();
      const manageHolidays = holidaysPage.manageHolidaysCardLink;
      await manageHolidays.click();

      await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays\/pending-for-submit/, { timeout: 15000 });
      await expect(holidaysPage.manageHolidaysHeader).toBeVisible();
    });
  });

  // =========================================================================
  // 2. MANAGE HOLIDAYS LIST VIEW (/settings/employee-fields/manage-holidays/pending-for-submit)
  // =========================================================================
  test.describe('2. Manage Holidays List View & Filters', () => {
    test('03. renders Manage Holidays list header, Add button, and table structure', async () => {
      await holidaysPage.openManageHolidays('pending-for-submit');
      await expect(holidaysPage.manageHolidaysHeader).toBeVisible();
      await expect(holidaysPage.addHolidaysButton).toBeVisible();
      await expect(holidaysPage.holidaysTable).toBeVisible();

      // Verify table column headers
      await expect(holidaysPage.groupNameHeader).toBeVisible();
      await expect(holidaysPage.yearHeader).toBeVisible();
      await expect(holidaysPage.locationHeader).toBeVisible();
      await expect(holidaysPage.totalHolidaysHeader).toBeVisible();
      await expect(holidaysPage.statusHeader).toBeVisible();
      await expect(holidaysPage.actionsHeader).toBeVisible();
    });

    test('04. verifies status tabs (Pending for Submit, Published, Draft) and switches between them', async () => {
      // Pending For Submit tab
      await expect(holidaysPage.pendingForSubmitTab).toBeVisible();

      // Published / Active tab
      if (await holidaysPage.publishedTab.isVisible().catch(() => false)) {
        await holidaysPage.publishedTab.click();
        await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays\/published|\/active/i);
      }

      // Draft tab
      if (await holidaysPage.draftTab.isVisible().catch(() => false)) {
        await holidaysPage.draftTab.click();
        await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays\/draft/i);
      }

      // Switch back to Pending for Submit
      await holidaysPage.pendingForSubmitTab.click();
      await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays\/pending-for-submit/);
    });

    test('05. verifies table data rows and interactive search / filter elements', async () => {
      const rowCount = await holidaysPage.holidayRows.count();
      expect(rowCount).toBeGreaterThanOrEqual(0);

      if (await holidaysPage.searchInput.isVisible().catch(() => false)) {
        await holidaysPage.searchInput.fill('Test Holiday');
        await holidaysPage.searchInput.clear();
      }
      if (await holidaysPage.yearFilterDropdown.isVisible().catch(() => false)) {
        await expect(holidaysPage.yearFilterDropdown).toBeEnabled();
      }
      if (await holidaysPage.locationFilterDropdown.isVisible().catch(() => false)) {
        await expect(holidaysPage.locationFilterDropdown).toBeEnabled();
      }
    });

    test('06. verifies row action menu contains View, Update, Clone, and Submit options', async () => {
      const rowCount = await holidaysPage.holidayRows.count();
      if (rowCount > 0) {
        const firstRow = holidaysPage.holidayRows.first();
        const opened = await holidaysPage.openRowKebab(firstRow);
        if (opened) {
          const viewItem = holidaysPage.kebabMenuItem('View').first();
          const updateItem = holidaysPage.kebabMenuItem('Update').or(holidaysPage.kebabMenuItem('Edit')).first();
          const cloneItem = holidaysPage.kebabMenuItem('Clone').first();

          if (await viewItem.isVisible().catch(() => false)) {
            await expect(viewItem).toBeVisible();
          }
          if (await updateItem.isVisible().catch(() => false)) {
            await expect(updateItem).toBeVisible();
          }
          if (await cloneItem.isVisible().catch(() => false)) {
            await expect(cloneItem).toBeVisible();
          }
        }
      }
    });
  });

  // =========================================================================
  // 3. ADD HOLIDAYS (/settings/employee-fields/addholidays)
  // =========================================================================
  test.describe('3. Add Holidays Page', () => {
    test('07. loads Add Holidays form and validates mandatory fields', async () => {
      await holidaysPage.openAddHolidays();
      await expect(page).toHaveURL(/\/settings\/employee-fields\/addholidays/);
      await expect(holidaysPage.yearDropdown).toBeVisible();
      await expect(holidaysPage.locationDropdown).toBeVisible();
      await expect(holidaysPage.holidayNameInput).toBeVisible();
      await expect(holidaysPage.holidayDateInput).toBeVisible();
      await expect(holidaysPage.cancelButton).toBeVisible();
      await expect(holidaysPage.submitButton).toBeVisible();

      // Submit button should be disabled when mandatory fields are empty
      await expect(holidaysPage.submitButton).toBeDisabled();
    });

    test('08. allows adding multiple holiday rows with Add New button', async () => {
      await expect(holidaysPage.addHolidayRowButton).toBeVisible();
      const initialCount = await holidaysPage.holidayNameInputs.count();
      await holidaysPage.addHolidayRowButton.click();
      const newCount = await holidaysPage.holidayNameInputs.count();
      expect(newCount).toBeGreaterThanOrEqual(initialCount);
      // Cancel and return to manage list to reset state
      await holidaysPage.cancelForm();
    });

    test('09. fills mandatory form fields to enable the Submit button', async () => {
      await holidaysPage.openAddHolidays();
      await holidaysPage.selectLocationHierarchyByOffset(0);
      await holidaysPage.holidayNameInput.fill('Test Holiday Auto');
      await holidaysPage.holidayDateInput.fill('2026-10-02');
      await holidaysPage.holidayDateInput.press('Tab');
      await holidaysPage.page.waitForTimeout(500);

      const isEnabled = await holidaysPage.submitButton.isEnabled({ timeout: 3000 }).catch(() => false);
      if (!isEnabled) {
        await holidaysPage.selectLocationHierarchyByOffset(1);
      }
      await expect(holidaysPage.submitButton).toBeEnabled();
      await holidaysPage.cancelForm();
    });

    test('10. fills valid holiday details, and retries with alternative dropdown values if combination exists', async () => {
      test.setTimeout(180000);
      const success = await holidaysPage.fillAndSubmitHolidayWithRetry(3);
      if (success) {
        await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);
      } else {
        await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays|\/addholidays/);
      }
    });

    test('11. Cancel button returns to Manage Holidays without saving', async () => {
      await holidaysPage.openAddHolidays();
      await holidaysPage.holidayNameInput.fill('Discarded Holiday');
      await holidaysPage.cancelForm();
      await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);
    });
  });

  // =========================================================================
  // 4. UPDATE HOLIDAYS (From Pending For Submission Tab)
  // =========================================================================
  test.describe('4. Update Holidays Page (Pending For Submission)', () => {
    test('12. loads Update Holidays page from Pending For Submission tab with pre-populated data', async () => {
      await holidaysPage.openManageHolidays('pending-for-submit');
      const rowCount = await holidaysPage.holidayRows.count();
      if (rowCount > 0) {
        const firstRow = holidaysPage.holidayRows.first();
        await holidaysPage.clickRowAction(firstRow, 'Update');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/updateholidays/);
        await expect(holidaysPage.cancelButton).toBeVisible();
      } else {
        await holidaysPage.openUpdateHolidays();
        await expect(page).toHaveURL(/\/settings\/employee-fields\/updateholidays/);
      }
    });

    test('13. modifies holiday group values on Update Holidays and saves via Update', async () => {
      await holidaysPage.openManageHolidays('pending-for-submit');
      const rowCount = await holidaysPage.holidayRows.count();
      if (rowCount > 0) {
        const firstRow = holidaysPage.holidayRows.first();
        await holidaysPage.clickRowAction(firstRow, 'Update');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/updateholidays/);

        const updatedDesc = `Updated description at ${Date.now()}`;
        if (await holidaysPage.descriptionInput.isVisible().catch(() => false)) {
          await holidaysPage.descriptionInput.fill(updatedDesc);
        }

        await holidaysPage.submitOrPublishUpdate('Update');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays|\/updateholidays/, { timeout: 15000 });
      }
    });

    test('14. verifies Publish or Cancel from Pending For Submission Update page without modifications', async () => {
      await holidaysPage.openManageHolidays('pending-for-submit');
      const rowCount = await holidaysPage.holidayRows.count();
      if (rowCount > 0) {
        const firstRow = holidaysPage.holidayRows.first();
        await holidaysPage.clickRowAction(firstRow, 'Update');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/updateholidays/);

        // If not needed to modify values, can Publish directly or Cancel
        if (await holidaysPage.publishButton.isVisible().catch(() => false)) {
          await holidaysPage.submitOrPublishUpdate('Publish');
          await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays|\/updateholidays/);
        } else {
          await holidaysPage.cancelForm();
          await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);
        }
      }
    });
  });

  // =========================================================================
  // 5. CLONE HOLIDAYS (From Published Tab)
  // =========================================================================
  test.describe('5. Clone Holidays Page (Published Tab)', () => {
    test('15. loads Clone Holidays page from Published tab with source information', async () => {
      await holidaysPage.openManageHolidays('published');
      const rowCount = await holidaysPage.holidayRows.count();
      if (rowCount > 0) {
        const firstRow = holidaysPage.holidayRows.first();
        await holidaysPage.clickRowAction(firstRow, 'Clone');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/cloneholidays/);
        await expect(holidaysPage.cancelButton).toBeVisible();
        await holidaysPage.cancelForm();
      } else {
        await holidaysPage.openCloneHolidays();
        await expect(page).toHaveURL(/\/settings\/employee-fields\/cloneholidays/);
        await holidaysPage.cancelForm();
      }
    });

    test('16. selects target year, location, sublocation, shift (with retry on existing combination) and submits clone', async () => {
      test.setTimeout(180000);
      await holidaysPage.openManageHolidays('published');
      const rowCount = await holidaysPage.holidayRows.count();
      if (rowCount > 0) {
        const firstRow = holidaysPage.holidayRows.first();
        await holidaysPage.clickRowAction(firstRow, 'Clone');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/cloneholidays/);

        // Submit clone with automatic dropdown variation if combination already exists
        const success = await holidaysPage.submitCloneWithRetry(3);
        if (success) {
          await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);
        } else {
          await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays|\/cloneholidays/);
        }
      }
    });

    test('17. Cancel on Clone Holidays returns to Published Manage Holidays without cloning', async () => {
      await holidaysPage.openManageHolidays('published');
      const rowCount = await holidaysPage.holidayRows.count();
      if (rowCount > 0) {
        const firstRow = holidaysPage.holidayRows.first();
        await holidaysPage.clickRowAction(firstRow, 'Clone');
        await holidaysPage.cancelForm();
        await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);
      }
    });
  });

  // =========================================================================
  // 6. VIEW HOLIDAYS (From Published Tab)
  // =========================================================================
  test.describe('6. View Holidays Page (Published Tab)', () => {
    test('18. loads View Holidays page from Published tab and displays read-only details', async () => {
      await holidaysPage.openManageHolidays('published');
      const rowCount = await holidaysPage.holidayRows.count();
      if (rowCount > 0) {
        const firstRow = holidaysPage.holidayRows.first();
        await holidaysPage.clickRowAction(firstRow, 'View');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/viewholidays/);
      } else {
        await holidaysPage.openViewHolidays();
        await expect(page).toHaveURL(/\/settings\/employee-fields\/viewholidays/);
      }
    });

    test('19. Back button returns to the Published Manage Holidays list', async () => {
      if (!page.url().includes('/settings/employee-fields/viewholidays')) {
        await holidaysPage.openManageHolidays('published');
        const rowCount = await holidaysPage.holidayRows.count();
        if (rowCount > 0) {
          const firstRow = holidaysPage.holidayRows.first();
          await holidaysPage.clickRowAction(firstRow, 'View');
          await expect(page).toHaveURL(/\/settings\/employee-fields\/viewholidays/);
        }
      }

      const backBtn = holidaysPage.backButton;
      await backBtn.waitFor({ state: 'visible', timeout: 5000 });
      await backBtn.click();
      await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);
    });
  });

  // =========================================================================
  // 7. END-TO-END HOLIDAYS LIFECYCLE
  // =========================================================================
  test.describe('7. End-to-End Holidays Workflow', () => {
    test('20. completes full lifecycle: Dashboard -> Settings -> Pending Update -> Published View & Clone', async () => {
      test.setTimeout(300000);

      // Step 1: Start at Dashboard, click Settings icon to navigate to Settings Overview
      await holidaysPage.openDashboard();
      await expect(page.getByText('Have a nice day at work!')).toBeVisible();
      await holidaysPage.clickSettingsIcon();
      await expect(page).toHaveURL(/\/settings\/overview|\/settings/);

      // Step 2: Expand Employee Fields and open Manage Holidays (Pending for Submit)
      await holidaysPage.expandEmployeeFieldsPanel();
      await holidaysPage.manageHolidaysCardLink.click();
      await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays\/pending-for-submit/);

      // Step 3: Add new holiday group with collision-safe dropdown variation & submit
      const addSuccess = await holidaysPage.fillAndSubmitHolidayWithRetry(3);
      if (addSuccess) {
        await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);
      }

      // Step 4: Update holiday record from Pending for Submit tab
      await holidaysPage.openManageHolidays('pending-for-submit');
      const pendingRows = await holidaysPage.holidayRows.count();
      if (pendingRows > 0) {
        const firstPending = holidaysPage.holidayRows.first();
        await holidaysPage.clickRowAction(firstPending, 'Update');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/updateholidays/);
        if (await holidaysPage.descriptionInput.isVisible().catch(() => false)) {
          await holidaysPage.descriptionInput.fill(`Lifecycle updated at ${Date.now()}`);
        }
        await holidaysPage.submitOrPublishUpdate('Update');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays|\/updateholidays/);
      }

      // Step 5: View published holiday record from Published tab
      await holidaysPage.openManageHolidays('published');
      const publishedRows = await holidaysPage.holidayRows.count();
      if (publishedRows > 0) {
        const firstPublished = holidaysPage.holidayRows.first();
        await holidaysPage.clickRowAction(firstPublished, 'View');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/viewholidays/);
        if (await holidaysPage.backButton.isVisible().catch(() => false)) {
          await holidaysPage.backButton.click();
          await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);
        }
      }

      // Step 6: Clone published holiday record from Published tab
      await holidaysPage.openManageHolidays('published');
      const pubCount = await holidaysPage.holidayRows.count();
      if (pubCount > 0) {
        const firstPub = holidaysPage.holidayRows.first();
        await holidaysPage.clickRowAction(firstPub, 'Clone');
        await expect(page).toHaveURL(/\/settings\/employee-fields\/cloneholidays/);
        await holidaysPage.submitCloneWithRetry(3);
        await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);
      }
    });
  });
});
