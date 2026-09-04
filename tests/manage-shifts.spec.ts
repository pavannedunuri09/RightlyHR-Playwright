import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { ManageShiftsPage } from '../pages/ManageShiftsPage';

test.describe('Manage Shifts', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginFromEnv();
  });

  // =========================================================
  // TC01 - MANAGE SHIFTS PAGE
  // =========================================================

  test('TC01 - should open Manage Shifts page', async ({ page }) => {

    const shiftsPage = new ManageShiftsPage(page);

    await shiftsPage.goto();

    await expect(page).toHaveURL(
      /\/settings\/employee-fields\/manage-shifts\/pending-for-submit/
    );

    await expect(
      shiftsPage.pendingSubmissionTab
    ).toBeVisible();

    await expect(
      shiftsPage.publishedTab
    ).toBeVisible();

    await expect(
      shiftsPage.addNewButton
    ).toBeVisible();
  });


  // =========================================================
  // TC02 - PUBLISHED TAB
  // =========================================================

  test('TC02 - should open Published shifts', async ({ page }) => {

    const shiftsPage = new ManageShiftsPage(page);

    await shiftsPage.goto();

    await shiftsPage.openPublished();

    await expect(
      shiftsPage.publishedTab
    ).toBeVisible();
  });


  // =========================================================
  // TC03 - ADD NEW
  // =========================================================

  test('TC03 - should open Add Shifts page', async ({ page }) => {

    const shiftsPage = new ManageShiftsPage(page);

    await shiftsPage.goto();

    await shiftsPage.clickAddNew();

    await expect(
      page.getByText('Add Shifts', {
        exact: true
      })
    ).toBeVisible();

    await expect(
      shiftsPage.shiftCodeInput
    ).toBeVisible();

    await expect(
      shiftsPage.shiftNameInput
    ).toBeVisible();

    await expect(
      shiftsPage.submitButton
    ).toBeVisible();
  });


  // =========================================================
  // TC04 - VALIDATION
  // =========================================================

  test('TC04 - should keep Submit disabled when mandatory fields are empty', async ({ page }) => {

    const shiftsPage = new ManageShiftsPage(page);

    await shiftsPage.goto();

    await shiftsPage.clickAddNew();

    await expect(
      shiftsPage.submitButton
    ).toBeDisabled();
  });


  // =========================================================
  // TC05 - CREATE SHIFT
  // =========================================================

  test('TC05 - should create a new shift', async ({ page }) => {

    const shiftsPage = new ManageShiftsPage(page);

    await shiftsPage.goto();

    await shiftsPage.clickAddNew();

    const shiftCode = `AUTO${Date.now()}`;

    const shiftName = `Automation Shift ${Date.now()}`;

    await shiftsPage.selectLocation('Kerala');

    await shiftsPage.selectSubLocation('Kannur');

    await shiftsPage.fillShiftDetails({
      shiftCode,
      shiftName,
      startTime: '09:00',
      endTime: '18:00',
      allowedGracePeriod: '15',
      latesAllowed: '3',
      allowedBreakTime: '1',
      halfDayMinHrs: '3',
      fullDayMinHrs: '6',
      preShiftBuffer: '0',
      postShiftBuffer: '0'
    });

    await expect(
      shiftsPage.submitButton
    ).toBeEnabled();

    await shiftsPage.submit();

    // Verify that the created shift appears.
    await expect(
      page.getByText(shiftCode, {
        exact: true
      })
    ).toBeVisible({
      timeout: 15000
    });
  });
// =========================================================
// TC06 - CANCEL ADD SHIFT
// =========================================================

test('TC06 - should cancel Add Shift', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();
  await shiftsPage.clickAddNew();

  await expect(
    page.getByText('Add Shifts', { exact: true })
  ).toBeVisible();

  await shiftsPage.cancel();

  await expect(
    shiftsPage.addNewButton
  ).toBeVisible();
});
test('TC07 - should validate mandatory fields', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();
  await shiftsPage.clickAddNew();

  await expect(shiftsPage.submitButton).toBeDisabled();

  await shiftsPage.shiftCodeInput.fill('TEST001');

  await expect(shiftsPage.submitButton).toBeDisabled();

  await shiftsPage.shiftNameInput.fill('Test Shift');

  await expect(shiftsPage.submitButton).toBeDisabled();
});
// =========================================================
// TC08 - OPEN UPDATE SHIFT
// =========================================================

test('TC08 - should open Update Shift', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openUpdate();

  await expect(
    page.getByText('Update Shifts', { exact: true })
  ).toBeVisible();

  await expect(
    shiftsPage.shiftNameInput
  ).toBeVisible();

  await expect(
    shiftsPage.updateButton
  ).toBeVisible();
});
// =========================================================
// TC09 - VERIFY EXISTING SHIFT DATA
// =========================================================

test('TC09 - should display existing shift data in Update', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openUpdate();

  await expect(
    shiftsPage.shiftCodeInput
  ).toHaveValue('234345');

  await expect(
    shiftsPage.shiftNameInput
  ).toHaveValue('Nampally');
});
// =========================================================
// TC10 - UPDATE SHIFT
// =========================================================

test('TC10 - should update shift name', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openUpdate();

  await shiftsPage.shiftNameInput.fill('Nampally Shift');

  await shiftsPage.update();

  await expect(
    page.getByText('Nampally Shift', { exact: true })
  ).toBeVisible({
    timeout: 15000
  });
});
// =========================================================
// TC12 - PUBLISH SHIFT
// =========================================================

test('TC11 - should publish a shift', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openUpdate();

  await expect(
    shiftsPage.publishButton
  ).toBeVisible();

  await shiftsPage.publish();

  await expect(
    shiftsPage.publishedTab
  ).toBeVisible();
});
// =========================================================
// TC13 - VERIFY PUBLISHED TAB
// =========================================================

test('TC12 - should open Published shifts after publishing', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openPublished();

  await expect(
    page.getByRole('link', { name: /Published \(\d+\)/ })
  ).toBeVisible();
});
// =========================================================
// TC13- OPEN VIEW SHIFT
// =========================================================

test('TC13 - should open View Shift', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openPublished();

  await shiftsPage.openView();

  await expect(
    page.getByText('View Shifts', { exact: true })
  ).toBeVisible();

  await expect(
    shiftsPage.shiftCodeInput
  ).toBeVisible();

  await expect(
    shiftsPage.shiftNameInput
  ).toBeVisible();
});
// =========================================================
// TC14 - VIEW SHIFT SHOULD BE READ ONLY
// =========================================================

test('TC14 - should display View Shift fields as read-only', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openPublished();

  await shiftsPage.openView();

  await expect(
    shiftsPage.shiftCodeInput
  ).toBeDisabled();

  await expect(
    shiftsPage.shiftNameInput
  ).toBeDisabled();
});
// =========================================================
// TC15 - OPEN CLONE SHIFT
// =========================================================

test('TC15 - should open Clone Shift', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openPublished();

  await shiftsPage.openClone();

  await expect(
    page.getByText('Clone Shifts', { exact: true })
  ).toBeVisible();

  await expect(
    shiftsPage.locationDropdown
  ).toBeVisible();

  await expect(
    shiftsPage.subLocationDropdown
  ).toBeVisible();

  await expect(
    shiftsPage.shiftCodeInput
  ).toBeVisible();

  await expect(
    shiftsPage.submitButton
  ).toBeVisible();
});
// =========================================================
// TC16 - CHANGE CLONE LOCATION
// =========================================================

test('TC16 - should change Location while cloning', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openPublished();

  await shiftsPage.openClone();

  await shiftsPage.selectLocation('Delhi');

  await expect(
    shiftsPage.locationDropdown
  ).toHaveValue(/Delhi/i);
});
// =========================================================
// TC17 - CHANGE CLONE SUB LOCATION
// =========================================================

test('TC17 - should change Sub Location while cloning', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openPublished();

  await shiftsPage.openClone();

  await shiftsPage.selectLocation('Delhi');
  await shiftsPage.selectSubLocation('New delhi');

  await expect(
    shiftsPage.subLocationDropdown
  ).toBeVisible();
});
// =========================================================
// TC18 - SUBMIT CLONE
// =========================================================

test('TC18 - should submit cloned shift', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();

  await shiftsPage.openPublished();

  await shiftsPage.openClone();

  const clonedShiftCode = `CLONE${Date.now()}`;

  await shiftsPage.selectLocation('Delhi');
  await shiftsPage.selectSubLocation('New delhi');

  await shiftsPage.shiftCodeInput.fill(clonedShiftCode);

  await expect(
    shiftsPage.submitButton
  ).toBeEnabled();

  await shiftsPage.submit();
});
// =========================================================
// TC19 - SUBMIT CLONE
// =========================================================

test('TC19 - should submit cloned shift', async ({ page }) => {
  const shiftsPage = new ManageShiftsPage(page);

  await shiftsPage.goto();
  await shiftsPage.openPublished();
  await shiftsPage.openClone();

  const clonedShiftCode = `CLONE${Date.now()}`;

  await shiftsPage.selectLocation('Delhi');
  await shiftsPage.selectSubLocation('New delhi');

  await shiftsPage.shiftCodeInput.fill(clonedShiftCode);

  await expect(
    shiftsPage.submitButton
  ).toBeEnabled();

  await shiftsPage.submit();
});

});