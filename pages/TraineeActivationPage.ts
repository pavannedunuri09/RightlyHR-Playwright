import { expect, type Locator, type Page } from '@playwright/test';

export class TraineeActivationPage {
  readonly page: Page;
  readonly jobTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.jobTab = page.getByText('Job', { exact: true });
  }

  async openOnboardingInfo() {
    await this.jobTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.jobTab.click();
    const info = this.page.getByText('Onboarding Info', { exact: true });
    await info.first().waitFor({ state: 'visible', timeout: 15000 });
    await info.first().click();
    await this.page.getByText('Date Of Joining', { exact: true }).waitFor({ state: 'visible', timeout: 15000 });
  }

  async activate() {
    const activate = this.page.getByRole('button', { name: /Activate/i }).first();
    if (await activate.isVisible({ timeout: 5000 }).catch(() => false)) {
      await activate.click();
      const confirm = this.page.getByRole('button', { name: /Yes|Activate|Submit/i }).last();
      if (await confirm.isVisible({ timeout: 5000 }).catch(() => false)) {
        await confirm.click();
      }
      await expect(this.page.getByText(/activated|success/i).first()).toBeVisible({ timeout: 20000 });
      console.log('Activated trainee from Onboarding Info');
      return;
    }

    const status = this.page.getByRole('combobox', { name: /status/i }).first();
    if (await status.isVisible().catch(() => false)) {
      await status.click();
      const active = this.page.getByRole('option', { name: /Active/i }).first();
      await active.waitFor({ state: 'visible', timeout: 10000 });
      await active.click();
      const save = this.page.getByRole('button', { name: /Save|Update|Submit/i }).first();
      if (await save.isVisible().catch(() => false)) {
        await save.click();
        await expect(this.page.getByText(/success|updated|saved/i).first()).toBeVisible({ timeout: 20000 });
      }
      console.log('Set onboarding status to Active');
      return;
    }

    throw new Error('Could not find Activate action or Active status on Onboarding Info');
  }

  async continueOnboardRequest() {
    const section = this.page.getByText('Trainee Onboard Request', { exact: true });
    await section.first().waitFor({ state: 'visible', timeout: 15000 });
    await section.first().click();
    await this.page.getByText('Trainee Onboarding Verification', { exact: true }).waitFor({
      state: 'visible',
      timeout: 15000,
    });

    const add = this.page.getByRole('button', { name: /Add|Request|New/i }).first();
    if (await add.isVisible({ timeout: 5000 }).catch(() => false)) {
      await add.click();
    } else {
      await this.page.locator('[class*="add"], [title*="Add"], .fa-plus, i.bi-plus').first().click({ timeout: 8000 }).catch(() => {});
    }

    const start = this.page.getByRole('textbox', { name: /training start date/i }).or(this.page.getByLabel(/training start date/i));
    if (await start.first().isVisible({ timeout: 8000 }).catch(() => false)) {
      const today = new Date().toISOString().slice(0, 10);
      const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      await start.first().fill(today);
      const endInput = this.page.getByRole('textbox', { name: /training end date/i }).or(this.page.getByLabel(/training end date/i));
      if (await endInput.first().isVisible().catch(() => false)) {
        await endInput.first().fill(end);
      }
      await this.page.getByRole('button', { name: /Submit|Save|Request/i }).last().click();
      await expect(this.page.getByText(/success|submitted|requested/i).first()).toBeVisible({ timeout: 20000 });
      console.log('Submitted trainee onboard request');
      return;
    }

    const existing = this.page.getByRole('row').filter({ hasNotText: /request date/i }).nth(1);
    if (await existing.isVisible().catch(() => false) && !/no data found/i.test(await existing.innerText())) {
      console.log('Trainee onboard request already exists');
      return;
    }

    throw new Error('Could not continue trainee onboard request');
  }
}
