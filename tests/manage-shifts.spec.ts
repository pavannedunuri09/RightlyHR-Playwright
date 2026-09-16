import { test, expect, type Page } from './fixtures/test';

import { LoginPage } from '../pages/LoginPage';
import { ManageShiftsPage } from '../pages/ManageShiftsPage';

async function confirmDialogYes(page: Page) {
  const yes = page
    .getByRole('dialog')
    .getByRole('button', { name: 'Yes', exact: true })
    .or(page.getByRole('button', { name: 'Yes', exact: true }));

  if (await yes.first().isVisible({ timeout: 2000 }).catch(() => false)) {
    await yes.first().click();
  }
}

async function cancelWithYes(page: Page, shiftsPage: ManageShiftsPage) {
  await shiftsPage.cancelButton.click();
  await confirmDialogYes(page);
}

async function dismissOpenForms(page: Page, shiftsPage: ManageShiftsPage) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const cancel = page.getByRole('button', { name: 'Cancel', exact: true }).filter({ visible: true });
    if (!(await cancel.first().isVisible({ timeout: 500 }).catch(() => false))) {
      break;
    }
    await cancelWithYes(page, shiftsPage);
    await page.waitForTimeout(300);
  }
}

async function selectFormSubLocation(page: Page, subLocation: string) {
  const field = page.locator('#sublocation');
  const trigger = field.getByRole('button', { name: 'dropdown trigger' });
  const combo = field.getByRole('combobox').first()
    .or(page.getByRole('combobox', { name: /Please select sub\s?location/i }))
    .or(page.getByRole('combobox', { name: subLocation }))
    .first();

  if (await trigger.isVisible({ timeout: 2000 }).catch(() => false)) {
    await trigger.click();
  } else {
    await combo.click();
  }

  const panel = page.locator('.p-select-overlay').last();
  if (await panel.isVisible({ timeout: 2000 }).catch(() => false)) {
    await panel.getByRole('option', { name: subLocation, exact: true }).first().click();
  } else {
    await page.getByText(subLocation, { exact: true }).click();
  }
}

async function submitShiftWithConfirm(page: Page, shiftsPage: ManageShiftsPage) {
  await shiftsPage.submitButton.click();

  const dialogSubmit = page.getByRole('dialog').getByRole('button', { name: 'Submit', exact: true });
  if (await dialogSubmit.isVisible({ timeout: 2000 }).catch(() => false)) {
    await dialogSubmit.click();
  }

  await expect(
    page.getByText(/shift.*(created|submitted|saved|success)|submitted successfully|created successfully|successfully/i).first(),
  ).toBeVisible({ timeout: 15000 });
}

async function expectCreatedShiftByCode(
  page: Page,
  shiftsPage: ManageShiftsPage,
  details: { shiftCode: string; shiftName: string; location: string; subLocation: string },
) {
  await openManageShiftUpdateByCode(page, shiftsPage, details.shiftCode);
  await expect(shiftsPage.shiftCodeInput).toHaveValue(details.shiftCode);
  await expect(shiftsPage.shiftNameInput).toHaveValue(details.shiftName);
  await cancelWithYes(page, shiftsPage);
}

async function openManageShiftUpdateByCode(page: Page, shiftsPage: ManageShiftsPage, shiftCode: string) {
  await shiftsPage.goto();
  await dismissOpenForms(page, shiftsPage);
  await page.getByRole('table').first().waitFor({ state: 'visible', timeout: 15000 });

  for (let index = 0; index < 50; index += 1) {
    const rows = page.getByRole('row').filter({ has: page.locator('.text-center > .dropdown, .dropdown') });
    if (index >= await rows.count()) {
      break;
    }

    const row = rows.nth(index);
    const actionCell = row.getByRole('cell').last();

    await row.scrollIntoViewIfNeeded();
    await actionCell.locator('div').first().click();
    await actionCell.getByText('Update', { exact: true }).filter({ visible: true }).click();
    await page.getByText('Update Shifts', { exact: true }).waitFor({ state: 'visible', timeout: 10000 });

    const shiftCodeVisible = await shiftsPage.shiftCodeInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (!shiftCodeVisible) {
      await cancelWithYes(page, shiftsPage);
      await page.getByText('Update Shifts', { exact: true }).waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
      await page.getByRole('table').first().waitFor({ state: 'visible', timeout: 10000 });
      continue;
    }

    if ((await shiftsPage.shiftCodeInput.inputValue()) === shiftCode) {
      return;
    }

    await cancelWithYes(page, shiftsPage);
    await page.getByText('Update Shifts', { exact: true }).waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
    await page.getByRole('table').first().waitFor({ state: 'visible', timeout: 10000 });
  }

  throw new Error(`Manage shift with code ${shiftCode} was not found`);
}

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

    await submitShiftWithConfirm(page, shiftsPage);

    await expectCreatedShiftByCode(page, shiftsPage, {
      shiftCode,
      shiftName,
      location: 'Kerala',
      subLocation: 'Kannur',
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
  // TC11 - PUBLISH SHIFT
  // TC09 - VERIFY EXISTING SHIFT DATA
  // =========================================================

  // =========================================================
  // TC12 - PUBLISH SHIFT
  // =========================================================

  test('TC09 - should publish a shift', async ({ page }) => {
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

  test('TC10 - should open Published shifts after publishing', async ({ page }) => {
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

  test('TC11 - should open View Shift', async ({ page }) => {
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

  test('TC12- should display View Shift fields as read-only', async ({ page }) => {
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

  test('TC13- should open Clone Shift', async ({ page }) => {
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
  // TC16 - CHANGE CLONE LOCATION AND SUB LOCATION
  // =========================================================

  test('TC14- should change Location and Sub Location while cloning', async ({ page }) => {
    const shiftsPage = new ManageShiftsPage(page);

    await shiftsPage.goto();
    await shiftsPage.openPublished();
    await shiftsPage.openClone();

    await shiftsPage.selectLocation('Delhi');
    await selectFormSubLocation(page, 'Cyber City');

    await cancelWithYes(page, shiftsPage);
  });
  // =========================================================
  // TC17 - SUBMIT CLONED SHIFT AND DISPLAY
  // =========================================================

  test('TC15- should submit cloned shift and display it', async ({ page }) => {
    const shiftsPage = new ManageShiftsPage(page);
    const clonedShiftCode = `CLONE${Date.now()}`;

    await shiftsPage.goto();
    await shiftsPage.openPublished();
    await shiftsPage.openClone();

    await shiftsPage.selectLocation('Delhi');
    await selectFormSubLocation(page, 'Cyber City');
    await shiftsPage.shiftCodeInput.fill(clonedShiftCode);

    await expect(shiftsPage.submitButton).toBeEnabled();

    await shiftsPage.submit();

    await expect(
      page.getByText(/shift.*(created|submitted|saved|success)|submitted successfully|created successfully|successfully/i).first(),
    ).toBeVisible({ timeout: 15000 });

    await openManageShiftUpdateByCode(page, shiftsPage, clonedShiftCode);
    await expect(shiftsPage.shiftCodeInput).toHaveValue(clonedShiftCode);
    await cancelWithYes(page, shiftsPage);
  });

});