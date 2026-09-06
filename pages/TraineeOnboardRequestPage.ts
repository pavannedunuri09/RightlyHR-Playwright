import { expect, type Locator, type Page } from '@playwright/test';

export class TraineeOnboardRequestPage {
  readonly page: Page;
  readonly jobTab: Locator;
  readonly onboardRequestTab: Locator;
  readonly requestButton: Locator;
  readonly submittedToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.jobTab = page.getByText('Job', { exact: true });
    this.onboardRequestTab = page.getByRole('img', { name: 'Trainee Onboard Request', exact: true })
      .or(page.locator('div').filter({ hasText: /^Trainee Onboard Request$/ }));
    this.requestButton = page.locator('.custom-add-btn').filter({ hasText: 'Request For Onboard' })
      .or(page.getByText('Request For Onboard', { exact: true }));
    this.submittedToast = page.getByText(/Onboarding request submitted|request submitted/i);
  }

  async openFromProfile() {
    await this.jobTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.jobTab.click();
    await this.page.getByRole('img', { name: 'Trainee Onboard Request', exact: true }).waitFor({
      state: 'visible',
      timeout: 15000,
    });
    await this.page.getByRole('img', { name: 'Trainee Onboard Request', exact: true }).click();
    await this.page.getByText(/Trainee Onboarding Verification|Request For Onboard|Waiting for Approval|Extended|Rejected|Processed/i)
      .first()
      .waitFor({ state: 'visible', timeout: 20000 });
    console.log('Opened Trainee Onboard Request tab');
  }

  async expectRequestButtonVisible() {
    await expect(this.requestButton.last()).toBeVisible({ timeout: 15000 });
    console.log('Request For Onboard is visible');
  }

  async expectRequestButtonHidden() {
    await expect(this.requestButton.last()).toBeHidden({ timeout: 10000 });
    console.log('Request For Onboard is not available (no re-request)');
  }

  async submitRequest() {
    const addBtn = this.page.locator('.custom-add-btn').filter({ hasText: 'Request For Onboard' });
    await addBtn.waitFor({ state: 'visible', timeout: 15000 });
    await addBtn.click();

    const confirm = this.page.getByRole('dialog').getByRole('button', { name: /Yes|Submit|Confirm/i })
      .or(this.page.getByRole('button', { name: 'Yes' }));
    if (await confirm.first().isVisible({ timeout: 4000 }).catch(() => false)) {
      await confirm.first().click();
    }

    const toast = this.submittedToast
      .or(this.page.locator('.p-toast-message, .p-toast, [role="alert"], .toast-body').filter({ hasText: /.+/ }));
    const waiting = this.page.getByText(/Waiting for Approval/i);
    const appeared = await toast.first().isVisible({ timeout: 15000 }).catch(() => false)
      || await waiting.first().isVisible({ timeout: 5000 }).catch(() => false);
    if (!appeared) {
      await addBtn.locator('i').click({ force: true });
    }
    await expect(waiting.or(toast).first()).toBeVisible({ timeout: 20000 });
    const text = ((await toast.first().innerText().catch(() => '')) || 'Onboarding request submitted').trim();
    console.log(`Onboard request: ${text}`);
    await expect(waiting.first()).toBeVisible({ timeout: 15000 });
    return text;
  }

  async readyForOnboardFromRow() {
    const processed = this.page.getByRole('cell').filter({ hasText: /^Processed$/i });
    await expect(processed.first()).toBeVisible({ timeout: 15000 });
    const row = this.page.getByRole('row').filter({ hasText: /Processed/i }).first();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    console.log(`Onboard row: ${(await row.innerText()).replace(/\s+/g, ' ').trim()}`);

    const actionCell = row.getByRole('cell').last();
    await actionCell.scrollIntoViewIfNeeded();
    const kebab = actionCell.locator('i, .bi, .dropdown > span, .dropdown').first();
    await kebab.click();

    const ready = this.page.locator('.dropdown-menu.show').getByText('Ready for Onboard', { exact: true })
      .or(this.page.getByText('Ready for Onboard').filter({ visible: true }));
    await ready.first().waitFor({ state: 'visible', timeout: 8000 });
    await ready.first().click();
    const yes = this.page.getByRole('dialog').getByRole('button', { name: 'Yes' })
      .or(this.page.getByRole('button', { name: 'Yes' }));
    await yes.first().click();
    const toast = this.page.getByText(/Employee onboarded/i);
    await expect(toast.first()).toBeVisible({ timeout: 20000 });
    const text = (await toast.first().innerText()).trim();
    console.log(`Ready for onboard: ${text}`);
    return text;
  }

  async expectStatus(status: RegExp | string) {
    const pattern = typeof status === 'string' ? new RegExp(status, 'i') : status;
    await expect(this.page.getByRole('cell').filter({ hasText: pattern }).or(this.page.getByText(pattern)).first())
      .toBeVisible({ timeout: 15000 });
    console.log(`Onboard request status: ${String(status)}`);
  }
}
