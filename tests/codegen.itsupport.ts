import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('inspect IT Support Configurations in Settings', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    process.env.LOGIN_EMAIL || 'bhavitha.palagiri@snaddevelopers.com',
    process.env.LOGIN_PASSWORD || 'Bhavi@16'
  );
  await page.waitForURL(/\/dashboard|\/settings/, { timeout: 30000 });
  await page.waitForTimeout(2000);

  // Click Settings icon
  const settingsIcon = page.locator('app-header app-gear-icon, app-gear-icon, img[src*="setting" i], .settings-icon, a[href*="setting"]')
    .or(page.locator('app-header div[cursor="pointer"]').first())
    .or(page.locator('rect').first())
    .first();
  await settingsIcon.click();
  await page.waitForURL(/\/settings/, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);

  console.log('Current URL after settings click:', page.url());

  // Click IT Support Configurations
  const itConfigBtn = page.getByRole('button', { name: /IT Support Configurations/i })
    .or(page.getByText('IT Support Configurations', { exact: false }))
    .first();
  await itConfigBtn.click();
  await page.waitForTimeout(2000);
  console.log('Current URL after IT Support Configurations click:', page.url());

  // Log visible text and buttons/inputs on the IT Support Configurations page
  const pageText = await page.locator('body').innerText().catch(() => '');
  console.log('Page text snippet:\n', pageText.slice(0, 1500));

  const buttons = await page.locator('button, a, [role="tab"], .p-tabview-nav li').allInnerTexts().catch(() => []);
  console.log('Visible buttons/tabs:', buttons);

  const inputs = await page.locator('input, textarea, p-select, ng-select').evaluateAll(els => 
    els.map(el => ({ tag: el.tagName, placeholder: (el as HTMLInputElement).placeholder, formcontrolname: el.getAttribute('formcontrolname'), name: (el as HTMLInputElement).name }))
  ).catch(() => []);
  console.log('Form controls found:', JSON.stringify(inputs));
});
