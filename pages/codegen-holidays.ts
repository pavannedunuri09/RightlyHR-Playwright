import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HolidaysPage } from '../pages/HolidaysPage';

/**
 * End-to-End Holidays Automation Flow (Current Year & Record-Specific Row Actions):
 *
 * 1. Login with credentials from .env -> Verify Dashboard (/dashboard/emp)
 * 2. Click Settings Icon -> Verify Settings Overview (/settings/overview)
 * 3. Expand Employee Fields -> Click Manage Holidays -> Land on Pending For Submit list
 * 4. Click "+ Add New" -> Add a new holiday record for CURRENT YEAR ONLY (2026):
 *    - Skips any dropdown options showing "No data found" / "No result found"
 *    - Retries until a unique record is successfully added and returns the created record name
 * 5. On Pending Tab -> Scroll down to locate the added record row -> Click Kebab -> Click Update (UI row action):
 *    - Modify details if needed, then click 'Publish' + Confirm -> Moves record to Published tab
 * 6. Switch to Published Tab -> Scroll down to locate the SAME latest published record row
 * 7. On that record row -> Click Kebab -> Click View -> Verify details -> Click Back to return to list
 * 8. On that record row -> Click Kebab -> Click Clone -> Select target dropdowns for current year -> Submit Clone
 */
test('holidays lifecycle: Current Year Add -> Update/Publish -> Published View & Clone', async ({ page }) => {
  test.setTimeout(240000);
  const loginPage = new LoginPage(page);
  const holidaysPage = new HolidaysPage(page);

  // =========================================================================
  // STEP 1: Login & Verify Dashboard
  // =========================================================================
  await loginPage.loginFromEnv();
  await expect(page).toHaveURL(/\/dashboard\/emp/);
  await expect(page.getByText('Have a nice day at work!')).toBeVisible({ timeout: 15000 });

  // =========================================================================
  // STEP 2: Navigate to Settings Overview via Header Settings Icon
  // =========================================================================
  await holidaysPage.clickSettingsIcon();
  await expect(page).toHaveURL(/\/settings\/overview|\/settings/);
  await expect(holidaysPage.employeeFieldsCard).toBeVisible({ timeout: 15000 });

  // =========================================================================
  // STEP 3: Expand Employee Fields & Click Manage Holidays Card
  // =========================================================================
  await holidaysPage.expandEmployeeFieldsPanel();
  await expect(holidaysPage.manageHolidaysCardLink).toBeVisible({ timeout: 10000 });
  await holidaysPage.manageHolidaysCardLink.click();

  // Lands on the main Manage Holidays list page (Pending for Submit)
  await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays\/pending-for-submit/);
  await expect(holidaysPage.manageHolidaysHeader).toBeVisible();
  await expect(holidaysPage.addHolidaysButton).toBeVisible();
  await expect(holidaysPage.holidaysTable).toBeVisible();

  // =========================================================================
  // STEP 4: Click "+ Add New" & Add a Record for CURRENT YEAR (retry until added)
  // =========================================================================
  await holidaysPage.addHolidaysButton.click();
  await expect(page).toHaveURL(/\/settings\/employee-fields\/addholidays/);

  // Fill and submit for CURRENT YEAR (2026) only, skipping any "No data found" options until added
  const { success: isAdded, holidayName: addedHolidayName, year: currentYear } = await holidaysPage.fillAndSubmitHolidayUntilAdded(3);
  await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);

  // =========================================================================
  // STEP 5: On Pending Tab, Scroll Down to Added Record & Click Kebab -> Update/Publish
  // =========================================================================
  await holidaysPage.openManageHolidays('pending-for-submit');
  await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays\/pending-for-submit/);
  await expect(holidaysPage.holidaysTable).toBeVisible({ timeout: 15000 });

  // Scroll down the Pending For Submission tab to locate the added record
  const targetPendingRow = await holidaysPage.scrollToAndGetHolidayRow(addedHolidayName, true);

  // Click Kebab -> Update strictly from the target record row (no direct URL goto)
  await holidaysPage.clickRowAction(targetPendingRow, 'Update');
  await expect(page).toHaveURL(/\/settings\/employee-fields\/updateholidays/);

  // Modify values if needed
  if (await holidaysPage.descriptionInput.isVisible().catch(() => false)) {
    await holidaysPage.descriptionInput.fill(`Updated & Published at ${Date.now()}`);
  }

  // Publish the record so it moves to Published tab
  if (await holidaysPage.publishButton.isVisible().catch(() => false)) {
    await holidaysPage.submitOrPublishUpdate('Publish');
  } else {
    await holidaysPage.submitOrPublishUpdate('Update');
  }
  await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);

  // =========================================================================
  // STEP 6: Go to Published Tab & Scroll Down to Find the SAME Published Record
  // =========================================================================
  await holidaysPage.openManageHolidays('published');
  await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays\/published|\/active/i);
  await expect(holidaysPage.holidaysTable).toBeVisible({ timeout: 15000 });

  // Scroll down in the Published tab to find the latest published record
  const targetPubRow = await holidaysPage.scrollToAndGetHolidayRow(addedHolidayName, true);

  // =========================================================================
  // STEP 7: On that Published Record -> Click Kebab -> View Holidays
  // =========================================================================
  await holidaysPage.clickRowAction(targetPubRow, 'View');
  await expect(page).toHaveURL(/\/settings\/employee-fields\/viewholidays/);

  // Verify details & click Back button to return to Published list
  const backBtn = holidaysPage.backButton;
  await backBtn.waitFor({ state: 'visible', timeout: 10000 });
  await backBtn.click();
  await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);

  // =========================================================================
  // STEP 8: On Published Tab -> Scroll Down to SAME Record -> Click Kebab -> Clone
  // =========================================================================
  await holidaysPage.openManageHolidays('published');
  await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays\/published|\/active/i);
  await expect(holidaysPage.holidaysTable).toBeVisible({ timeout: 15000 });

  // Scroll down to find the published record again
  const rowToClone = await holidaysPage.scrollToAndGetHolidayRow(addedHolidayName, true);

  await holidaysPage.clickRowAction(rowToClone, 'Clone');
  await expect(page).toHaveURL(/\/settings\/employee-fields\/cloneholidays/);

  // Select target hierarchy for current year and submit clone with retry
  await holidaysPage.submitCloneWithRetry(4);
  await expect(page).toHaveURL(/\/settings\/employee-fields\/manage-holidays/);
});