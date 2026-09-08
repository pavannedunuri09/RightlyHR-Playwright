import { test, expect } from '@playwright/test';

// Ignored locator recording: On Behalf Of → WFH tab (mirrors codegen-onbehalf-remote.ts).

test('codegen on-behalf WFH', async ({ page }) => {
  await page.goto('https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login');
  await page.getByRole('textbox', { name: 'Please enter email' }).fill('pavan.nedunuri@snaddevelopers.com');
  await page.getByRole('textbox', { name: 'Please enter password' }).fill('Pavan@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.goto('https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/dashboard/emp');

  await page.locator('#sidenav-main-drop > div:nth-child(8)').click();
  await page.locator('div').filter({ hasText: /^WFH$/ }).nth(1).click();

  await page.locator('#pn_id_8').getByRole('button', { name: 'dropdown trigger' }).click();
  await page.getByRole('searchbox').fill('bhavitha');
  await page.getByRole('option', { name: 'SD3021300 - Bhavitha Reddy' }).click();

  await page.getByRole('button', { name: 'Apply On Behalf Of' }).click();
  await page.getByText('Apply WFH On Behalf').click();
  await page.getByRole('textbox', { name: 'Worked Date *' }).fill('2026-08-01');
  await page.getByRole('radio', { name: 'Half Day' }).check();
  await page.getByRole('radio', { name: 'First Half' }).check();
  await page.getByRole('textbox', { name: 'Reason *' }).fill('Request WFH on behalf');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'No' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();

  await page.getByRole('button', { name: 'Apply On Behalf Of' }).click();
  await page.getByRole('textbox', { name: 'Worked Date *' }).fill('2026-07-01');
  await page.getByRole('radio', { name: 'Half Day' }).check();
  await page.getByRole('radio', { name: 'First Half' }).check();
  await page.getByRole('textbox', { name: 'Reason *' }).fill('Request WFH on behalf');
  await page.getByRole('button', { name: 'Request' }).click();

  await expect(page.getByText(/WFH processed|Work from home processed/i)).toBeVisible({ timeout: 15000 });
});
