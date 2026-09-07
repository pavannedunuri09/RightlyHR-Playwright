import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login');
  await page.getByText('My Info').click();
  await page.getByText('My InfoBasic Info').click();
  await page.locator('div:nth-child(2) > a').click();
  await page.getByRole('combobox', { name: 'Miss.' }).click();
  await page.getByRole('option', { name: 'Mr.' }).click();
  await page.getByText('Please select a valid').click();
  await page.locator('#pn_id_8').getByRole('button', { name: 'dropdown trigger' }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('Basic information updated').click();
});