import { test, expect } from '@playwright/test';
import { ITSupportPage } from '../pages/ITSupportPage';

test('debug IT Support Manager Team Tickets and Update Modal', async ({ page }) => {
  const itSupportPage = new ITSupportPage(page);

  // 1. Login as IT Support Manager
  await itSupportPage.loginAsITSupportManager();
  await itSupportPage.navigateToITSupport();
  await page.waitForTimeout(2000);

  // Log all visible tabs / buttons on IT Support
  const tabs = await page.locator('button, [role="tab"], .nav-link, .p-tabview-nav li, ul li, .p-button').allInnerTexts().catch(() => []);
  console.log('Visible tabs/buttons in IT Support:', tabs);

  // Click Team Tickets
  await itSupportPage.clickTeamTicketsTab();
  await page.waitForTimeout(2000);

  const subTabs = await page.locator('button, [role="tab"], .nav-link, .p-tabview-nav li, ul li, .p-button').allInnerTexts().catch(() => []);
  console.log('Visible tabs/buttons after Team Tickets:', subTabs);

  // Check if there is an "All Tickets" tab
  const allTicketsTab = page.locator('button, [role="tab"], .nav-link, .p-tabview-nav li, a, div, span').filter({ hasText: /^All Tickets$/i }).first();
  if (await allTicketsTab.isVisible().catch(() => false)) {
    console.log('Found All Tickets tab, clicking it...');
    await allTicketsTab.click();
    await page.waitForTimeout(1000);
  }

  // Find rows
  const rowCount = await itSupportPage.ticketRows.count();
  console.log('Ticket rows found:', rowCount);

  // Open first row kebab -> Update
  await itSupportPage.openTicketRowKebab();
  const updateItem = page.getByText('Update', { exact: true })
    .or(page.locator('.dropdown-menu.show a, .dropdown-menu.show button, a.dropdown-item, button.dropdown-item, .dropdown-item, [role="menuitem"]').filter({ hasText: /^Update$/i }))
    .first();
  await updateItem.click();
  await page.waitForTimeout(2000);

  // Log all inputs, selects, dropdowns, buttons inside modal
  const modalHTML = await page.locator('dialog, ngb-modal-window, [role="dialog"], .modal, p-dialog').last().innerHTML().catch(() => '');
  console.log('--- MODAL INNER HTML SNIPPET ---');
  console.log(modalHTML.slice(0, 3000));

  // Find all form controls and dropdowns inside modal
  const modalControls = await page.locator('dialog, ngb-modal-window, [role="dialog"], .modal, p-dialog').last().locator('input, textarea, p-select, p-dropdown, [role="combobox"], select, button').evaluateAll(els => 
    els.map(el => ({
      tag: el.tagName,
      role: el.getAttribute('role'),
      ariaLabel: el.getAttribute('aria-label'),
      formcontrolname: el.getAttribute('formcontrolname'),
      placeholder: (el as HTMLInputElement).placeholder,
      id: el.id,
      className: el.className,
      innerText: el.textContent?.trim().slice(0, 50)
    }))
  ).catch(() => []);
  console.log('Modal form controls:', JSON.stringify(modalControls, null, 2));
});
