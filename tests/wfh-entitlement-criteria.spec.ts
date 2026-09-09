import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { type EntitlementCriterion, WfhEntitlementCriteriaPage } from '../pages/WfhEntitlementCriteriaPage';

const CRITERIA: EntitlementCriterion[] = [
  'allowedPerMonth',
  'pastDatesAllowed',
  'futureDatesAllowed',
  'minHalfDayHours',
  'minFullDayHours',
];

test.describe('WFH Entitlement Criteria', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  for (const criterion of CRITERIA) {
    test.describe(criterion, () => {
      test(`01. opens WFH Entitlement Criteria and shows ${criterion}`, async ({ page }) => {
        const settingsPage = new WfhEntitlementCriteriaPage(page);
        await settingsPage.openFromDashboard();

        await expect(settingsPage.criterionNameCell(criterion)).toBeVisible();
        await expect(settingsPage.criterionValueCell(criterion)).toBeVisible();
        await expect(settingsPage.kebabMenu(criterion)).toBeVisible();
      });

      test(`02. kebab menu on ${criterion} shows Update`, async ({ page }) => {
        const settingsPage = new WfhEntitlementCriteriaPage(page);
        await settingsPage.openFromDashboard();

        await settingsPage.openKebab(criterion);
        await expect(settingsPage.visibleUpdateMenuItem()).toBeVisible();
      });

      test(`03. Update on ${criterion} enables the value column`, async ({ page }) => {
        const settingsPage = new WfhEntitlementCriteriaPage(page);
        await settingsPage.openFromDashboard();

        await expect(settingsPage.criterionRow(criterion).getByRole('textbox')).toHaveCount(0);
        await settingsPage.openUpdate(criterion);

        await expect(settingsPage.valueInput(criterion)).toBeVisible();
        await expect(settingsPage.valueInput(criterion)).toBeEnabled();
        await expect(settingsPage.updateButton).toBeVisible();
      });

      test(`04. updates ${criterion} to another number`, async ({ page }) => {
        const settingsPage = new WfhEntitlementCriteriaPage(page);
        await settingsPage.openFromDashboard();
        const original = await settingsPage.readValue(criterion);
        const updated = settingsPage.nextValue(original);

        await settingsPage.openUpdate(criterion);
        await settingsPage.valueInput(criterion).fill(updated);
        await settingsPage.submitUpdate();
        await settingsPage.successToast.waitFor({ state: 'visible', timeout: 15000 });
        await settingsPage.successToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});

        await expect.poll(() => settingsPage.readValue(criterion)).toBe(updated);

        await settingsPage.updateValue(criterion, original);
        await expect.poll(() => settingsPage.readValue(criterion)).toBe(original);
      });

      test(`05. shows Data Updated Successfully after updating ${criterion}`, async ({ page }) => {
        const settingsPage = new WfhEntitlementCriteriaPage(page);
        await settingsPage.openFromDashboard();
        const original = await settingsPage.readValue(criterion);
        const updated = settingsPage.nextValue(original);

        await settingsPage.openUpdate(criterion);
        await settingsPage.valueInput(criterion).fill(updated);
        await settingsPage.submitUpdate();
        await expect(settingsPage.successToast).toBeVisible();

        await settingsPage.successToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await settingsPage.updateValue(criterion, original);
        await expect.poll(() => settingsPage.readValue(criterion)).toBe(original);
      });

      test(`06. Cancel is shown only after clicking Update on ${criterion}`, async ({ page }) => {
        const settingsPage = new WfhEntitlementCriteriaPage(page);
        await settingsPage.openFromDashboard();

        await expect(settingsPage.cancelButton).toHaveCount(0);

        await settingsPage.openKebab(criterion);
        await expect(settingsPage.visibleUpdateMenuItem()).toBeVisible();
        await expect(settingsPage.cancelButton).toHaveCount(0);

        await settingsPage.visibleUpdateMenuItem().click();
        await expect(settingsPage.cancelButton).toBeVisible();
        await expect(settingsPage.updateButton).toBeVisible();
      });

      test(`07. Cancel on Update closes edit and keeps ${criterion}`, async ({ page }) => {
        const settingsPage = new WfhEntitlementCriteriaPage(page);
        await settingsPage.openFromDashboard();
        const before = await settingsPage.readValue(criterion);
        const typed = settingsPage.nextValue(before);

        await settingsPage.openUpdate(criterion);
        await settingsPage.valueInput(criterion).fill(typed);
        await expect(settingsPage.cancelButton).toBeVisible();
        await settingsPage.cancelUpdate();

        await expect(settingsPage.cancelButton).toHaveCount(0);
        await expect(settingsPage.criterionRow(criterion).getByRole('textbox')).toHaveCount(0);
        await expect.poll(() => settingsPage.readValue(criterion)).toBe(before);
      });

      test(`08. empty ${criterion} shows Value cannot be null and restores the previous value`, async ({ page }) => {
        const settingsPage = new WfhEntitlementCriteriaPage(page);
        await settingsPage.openFromDashboard();
        const before = await settingsPage.readValue(criterion);

        await settingsPage.openUpdate(criterion);
        await settingsPage.valueInput(criterion).clear();
        await settingsPage.submitUpdate();

        await expect(settingsPage.nullValueError).toBeVisible();
        await expect.poll(() => settingsPage.readValue(criterion)).toBe(before);
      });
    });
  }
});
