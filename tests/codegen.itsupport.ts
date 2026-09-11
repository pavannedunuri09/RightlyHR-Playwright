import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ITSupportPage } from '../pages/ITSupportPage';

test('debug status update network and DOM', async ({ page }) => {
  const itSupportPage = new ITSupportPage(page);

  // Intercept network requests
  page.on('request', req => {
    if (req.url().includes('ticket') || req.url().includes('support')) {
      console.log(`[REQ] ${req.method()} ${req.url()}`);
      const postData = req.postData();
      if (postData) console.log(`[POST DATA]`, postData.slice(0, 300));
    }
  });

  page.on('response', async res => {
    if (res.url().includes('ticket') || res.url().includes('support')) {
      console.log(`[RES] ${res.status()} ${res.url()}`);
      try {
        const body = await res.text();
        console.log(`[RES BODY]`, body.slice(0, 300));
      } catch {}
    }
  });

  // Login as IT Support Manager
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    process.env.LOGIN_EMAIL || 'bhavitha.palagiri@snaddevelopers.com',
    process.env.LOGIN_PASSWORD || 'Bhavi@16'
  );
  await page.waitForURL(/\/dashboard|\/settings|\/it-support/, { timeout: 30000 });
  await page.waitForTimeout(2000);
  await itSupportPage.navigateToITSupport();
  await page.waitForTimeout(2000);

  // Click Team Tickets
  await itSupportPage.clickTeamTicketsTab();
  await page.waitForTimeout(1000);

  // Click Open Tickets
  await itSupportPage.clickOpenTicketsTab();
  await page.waitForTimeout(1000);

  // Open kebab for first row -> Update
  await itSupportPage.clickUpdateTicketAction();

  // Click status dropdown and log all available options in the overlay
  const modal = page.locator('dialog, ngb-modal-window, [role="dialog"], .modal, p-dialog').last();
  const statusDropdown = modal.locator('p-select[formcontrolname="ticketStatus"], [formcontrolname="ticketStatus"]').first();
  await statusDropdown.click();
  await page.waitForTimeout(1000);

  const overlay = page.locator('.p-select-overlay, .p-select-panel, .p-dropdown-panel, [role="listbox"]').last();
  await overlay.waitFor({ state: 'visible', timeout: 5000 });
  console.log('Overlay HTML snippet:', (await overlay.innerHTML()).slice(0, 1000));

  const awaitOption = overlay.locator('.p-select-option, [role="option"], li').filter({ hasText: /Await/i }).first();
  console.log('Await option found text:', await awaitOption.innerText());
  console.log('Is modal visible before option click?', await modal.isVisible());

  await awaitOption.click();
  await page.waitForTimeout(1000);

  console.log('Is modal visible after option click?', await modal.isVisible());
  console.log('Status dropdown text after click:', await statusDropdown.innerText());

  // Inspect all form controls and their validation classes
  const formControls = await modal.locator('input, textarea, p-select, select').evaluateAll(els => 
    els.map(el => ({
      tag: el.tagName,
      formcontrolname: el.getAttribute('formcontrolname'),
      className: el.className,
      value: (el as HTMLInputElement).value || el.textContent?.trim(),
      isInvalid: el.classList.contains('ng-invalid'),
      isValid: el.classList.contains('ng-valid'),
      isPristine: el.classList.contains('ng-pristine'),
      isUntouched: el.classList.contains('ng-untouched')
    }))
  );
  console.log('Form controls validation state:', JSON.stringify(formControls, null, 2));

  // Check form element itself
  const formElement = await modal.locator('form').evaluate(f => ({
    className: f.className,
    isInvalid: f.classList.contains('ng-invalid'),
    isValid: f.classList.contains('ng-valid')
  }));
  console.log('Form element state:', formElement);

  // If assignedto is empty, select an employee
  const assignedSelect = modal.locator('p-select[formcontrolname="assignedto"], [formcontrolname="assignedto"]').first();
  console.log('Assigned to text:', await assignedSelect.innerText().catch(() => ''));
  if ((await assignedSelect.innerText().catch(() => '')).includes('Please select')) {
    console.log('Selecting assigned employee...');
    await assignedSelect.click();
    await page.waitForTimeout(600);
    const overlay = page.locator('.p-select-overlay, [role="listbox"]').last();
    await overlay.locator('.p-select-option, [role="option"], li').first().click();
    await page.waitForTimeout(600);
  }

  // Fill comments
  const commentsInput = modal.locator('textarea[formcontrolname="comments"], input[formcontrolname="comments"]').first();
  await commentsInput.click();
  await commentsInput.fill('Updated status for test');
  await page.waitForTimeout(300);

  // Check form element state again before clicking update
  const formElementBeforeClick = await modal.locator('form').evaluate(f => ({
    className: f.className,
    isInvalid: f.classList.contains('ng-invalid'),
    isValid: f.classList.contains('ng-valid')
  }));
  console.log('Form element state before submit:', formElementBeforeClick);

  // Click Update button
  const updateBtn = modal.locator('button[type="submit"], button.btn-primary').filter({ hasText: /^Update$/i }).first();
  console.log('Clicking Update button...');
  await updateBtn.click();
  await page.waitForTimeout(4000);

  // Check toast
  const toasts = await page.locator('.p-toast, .toast, .alert').allInnerTexts().catch(() => []);
  console.log('Toasts appeared after update:', toasts);
});
