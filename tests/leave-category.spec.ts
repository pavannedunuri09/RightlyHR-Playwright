import { expect, type Page, test } from '@playwright/test';
import {
  GENERAL_LEAVE_CATEGORY,
  LEAVE_CATEGORY_REQUIRED_VALIDATIONS,
  LeaveCategoryPage,
  UPDATED_GENERAL_LEAVE_CATEGORY,
} from '../pages/LeaveCategoryPage';
import { LoginPage } from '../pages/LoginPage';

test.describe.serial('Leave Category Foundation', () => {
  let page: Page;
  let leaveCategoryPage: LeaveCategoryPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await new LoginPage(page).loginFromEnv();
    leaveCategoryPage = new LeaveCategoryPage(page);
  });

  test.afterAll(async () => {
    await page?.close();
  });

  test('01. navigates from Dashboard through Settings and Time Off to Leave Category', async () => {
    await leaveCategoryPage.openFromDashboard();

    await expect(leaveCategoryPage.pendingTab).toBeVisible();
    await expect(leaveCategoryPage.publishedTab).toBeVisible();
    await expect(leaveCategoryPage.addNewButton).toBeVisible();
  });

  test('02. displays record counts and switches between Pending and Published', async () => {
    const pendingCount = await leaveCategoryPage.tabCount(leaveCategoryPage.pendingTab);
    const publishedCount = await leaveCategoryPage.tabCount(leaveCategoryPage.publishedTab);

    expect(pendingCount).toBeGreaterThanOrEqual(0);
    expect(publishedCount).toBeGreaterThanOrEqual(0);

    await leaveCategoryPage.switchToPublished();
    await expect(leaveCategoryPage.publishedTab).toBeVisible();

    await leaveCategoryPage.switchToPending();
    await expect(leaveCategoryPage.pendingTab).toBeVisible();
  });

  test('03. displays the Leave Category table structure', async () => {
    await leaveCategoryPage.switchToPending();

    await expect(leaveCategoryPage.table).toBeVisible();
    await expect(leaveCategoryPage.yearHeader).toBeVisible();
    await expect(leaveCategoryPage.locationHeader).toBeVisible();
    await expect(leaveCategoryPage.subLocationHeader).toBeVisible();
    await expect(leaveCategoryPage.shiftNameHeader).toBeVisible();
    await expect(leaveCategoryPage.categoryTypeHeader).toBeVisible();
    await expect(leaveCategoryPage.categoryNameHeader).toBeVisible();
    await expect(leaveCategoryPage.categoryCodeHeader).toBeVisible();
    await expect(leaveCategoryPage.displayColorHeader).toBeVisible();
  });

  test('04. Add New opens the Leave Category form with required controls and sections', async () => {
    await leaveCategoryPage.openAddForm();

    await expect(leaveCategoryPage.locationShiftSection).toBeVisible();
    await expect(leaveCategoryPage.categoryInformationSection).toBeVisible();
    await expect(leaveCategoryPage.additionalInformationSection).toBeVisible();
    await expect(leaveCategoryPage.advanceNoticeSection).toBeVisible();
    await expect(leaveCategoryPage.maximumDurationSection).toBeVisible();
    await expect(leaveCategoryPage.leaveIntervalSection).toBeVisible();
    await expect(leaveCategoryPage.sandwichPolicySection).toBeVisible();
    await expect(leaveCategoryPage.carryForwardSection).toBeVisible();
    await expect(leaveCategoryPage.encashSection).toBeVisible();
    await expect(leaveCategoryPage.probationPeriodSection).toBeVisible();
    await expect(leaveCategoryPage.noticePeriodSection).toBeVisible();

    await expect(leaveCategoryPage.yearDropdown).toBeVisible();
    await expect(leaveCategoryPage.locationDropdown).toBeVisible();
    await expect(leaveCategoryPage.subLocationDropdown).toBeVisible();
    await expect(leaveCategoryPage.shiftDropdown).toBeVisible();
    await expect(leaveCategoryPage.categoryTypeDropdown).toBeVisible();
    await expect(leaveCategoryPage.leaveTypeDropdown).toBeVisible();
    await expect(leaveCategoryPage.categoryNameInput).toBeVisible();
    await expect(leaveCategoryPage.categoryCodeInput).toBeVisible();
    await expect(leaveCategoryPage.validDaysInput).toBeVisible();
    await expect(leaveCategoryPage.colorInput).toBeVisible();
    await expect(leaveCategoryPage.genderDropdown).toBeVisible();
    await expect(leaveCategoryPage.maritalStatusDropdown).toBeVisible();
    await expect(leaveCategoryPage.saveButton).toBeVisible();
    await expect(leaveCategoryPage.cancelButton).toBeVisible();
  });

  test.describe('Add Leave Category validations', () => {
    test('05. shows all required field validations on empty form submit', async () => {
      await leaveCategoryPage.submitEmptyForm();
      await leaveCategoryPage.expectAllRequiredValidations();
      expect(LEAVE_CATEGORY_REQUIRED_VALIDATIONS).toHaveLength(21);
    });

    for (const message of LEAVE_CATEGORY_REQUIRED_VALIDATIONS) {
      test(`06. validation message: ${message}`, async () => {
        await expect(leaveCategoryPage.validationMessage(message)).toBeVisible();
      });
    }

    test('07. creates General Leave category with required details and enables Save', async () => {
      test.setTimeout(180000);

      if (!(await leaveCategoryPage.yearDropdown.isVisible().catch(() => false))) {
        await leaveCategoryPage.switchToPending();
        await leaveCategoryPage.openAddForm();
      }

      await leaveCategoryPage.fillAddLeaveCategoryForm(GENERAL_LEAVE_CATEGORY);
      await expect(leaveCategoryPage.saveButton).toBeEnabled();
      await leaveCategoryPage.saveLeaveCategory();
    });

    test('08. displays General Leave in Pending For Submission list with status', async () => {
      await leaveCategoryPage.expectPendingSubmissionRow(GENERAL_LEAVE_CATEGORY);
      await expect(leaveCategoryPage.statusHeader).toBeVisible();
    });

    test('09. opens Update from kebab, verifies prefilled data and button states, then updates record', async () => {
      test.setTimeout(180000);

      await leaveCategoryPage.openUpdateForCategory(GENERAL_LEAVE_CATEGORY.categoryName);
      await leaveCategoryPage.expectUpdateFormPrefilled(GENERAL_LEAVE_CATEGORY);
      await leaveCategoryPage.expectInitialUpdateActionButtons();

      const updatedValidDays = '366';
      await leaveCategoryPage.validDaysInput.fill(updatedValidDays);
      await leaveCategoryPage.expectDirtyUpdateActionButtons();

      await leaveCategoryPage.submitUpdateLeaveCategory();
      await leaveCategoryPage.expectPendingSubmissionRow({
        ...GENERAL_LEAVE_CATEGORY,
        validDays: updatedValidDays,
      });
    });

    test('10. publishes General Leave from Update page and shows success message', async () => {
      test.setTimeout(120000);

      await leaveCategoryPage.ensureOnLeaveCategoryList();
      await leaveCategoryPage.openUpdateForCategory(GENERAL_LEAVE_CATEGORY.categoryName);
      await leaveCategoryPage.expectInitialUpdateActionButtons();
      await leaveCategoryPage.publishLeaveCategoryFromUpdatePage();
    });

    test('11. displays published General Leave in Published tab with status', async () => {
      await leaveCategoryPage.expectPublishedRow(UPDATED_GENERAL_LEAVE_CATEGORY);
    });

    test('12. Cancel returns to Pending list without saving', async () => {
      await leaveCategoryPage.openAddForm();
      await leaveCategoryPage.cancelAddForm();
      await expect(leaveCategoryPage.pendingTab).toBeVisible();
      await expect(leaveCategoryPage.addNewButton).toBeVisible();
    });
  });
});
