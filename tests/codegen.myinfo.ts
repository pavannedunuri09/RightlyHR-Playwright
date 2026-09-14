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

test('Test 02: Employee should navigate to My Info Basic Info tab', async ({ page }) => {
  await page.goto('https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login');
  await page.getByRole('img', { name: 'Icon' }).nth(1).click();
  await page.locator('div').filter({ hasText: /^Basic Info$/ }).nth(1).click();
  await page.locator('div:nth-child(2) > a').click();
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill('Indhu');
  await page.getByRole('textbox', { name: 'Last Name*' }).click();
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('Kumari');
  await page.getByRole('textbox', { name: 'Middle Name' }).click();
  await page.getByRole('textbox', { name: 'Middle Name' }).fill('sree');
  await page.getByText('Basic InfoCloseSaveEmployee').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('Basic information updated').click();
});

test('test', async ({ page }) => {
  await page.goto('https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login');
  await page.getByRole('textbox', { name: 'Please enter email' }).click();
  await page.goto('https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/dashboard/emp');
  await page.getByText('My Info').click();
  await page.getByText('Gender*Male').click();
  await page.locator('div:nth-child(2) > a').click();
  await page.getByRole('textbox', { name: 'Date Of Birth*' }).fill('2020-07-08');
  await page.locator('.myinfo-main-content').click();
  await page.getByText('Age must be between 18 and').click();
  await page.getByRole('textbox', { name: 'Date Of Birth*' }).fill('2001-07-08');
  await page.locator('.myinfo-main-content').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('Basic information updated').click();
});

test('Test 03: Employee should navigate to My Info Contact Info tab', async ({ page }) => {
  await page.goto('https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login');
  await page.getByText('My Info').click();
  await page.locator('div').filter({ hasText: /^Contact Info$/ }).nth(1).click();
  await page.getByText('My InfoContact Info').click();
  await page.locator('app-contact-details').getByText('Contact Info').click();
  await page.getByText('Work Number').click();
  await page.getByText('Phone Number *').click();
  await page.getByText('Work Mail*').click();
  await page.getByRole('textbox', { name: 'Personal Email*' }).fill('indu1@yopmail.com');
  await page.getByRole('textbox', { name: 'Please enter phone number' }).fill('9886577745');
});

