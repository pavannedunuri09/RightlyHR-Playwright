import { expect, type Locator, type Page } from '@playwright/test';

export class EmployeeOnboardingInfoPage {
  readonly page: Page;
  readonly personalTab: Locator;
  readonly jobTab: Locator;
  readonly onboardingInfoTab: Locator;
  readonly saveButton: Locator;
  readonly savedMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.personalTab = page.getByText('Personal', { exact: true }).or(page.getByText('Basic Info', { exact: true }));
    this.jobTab = page.getByText('Job', { exact: true });
    this.onboardingInfoTab = page.getByRole('img', { name: 'Onboarding Info', exact: true })
      .or(page.getByText('Onboarding Info', { exact: true }));
    this.saveButton = page.getByRole('button', { name: /^(Save|Update)$/ });
    this.savedMessage = page.getByText(/saved successfully|updated successfully/i);
  }

  async openFromProfile() {
    await this.personalTab.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.personalTab.first().click();
    console.log('Opened Personal tab');

    await this.jobTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.jobTab.click();
    console.log('Opened Job tab');

    await this.page.getByRole('img', { name: 'Onboarding Info', exact: true }).waitFor({ state: 'visible', timeout: 15000 });
    await this.page.getByRole('img', { name: 'Onboarding Info', exact: true }).click();
    await this.page.getByText('Status', { exact: true }).waitFor({ state: 'visible', timeout: 15000 });
    await this.enableEdit();
    console.log('Opened Onboarding Info tab');
  }

  private async enableEdit() {
    if (await this.saveButton.first().isVisible().catch(() => false)) {
      return;
    }

    const breadcrumbEdit = this.page.getByText('Onboarding Info', { exact: true }).first().locator('xpath=following-sibling::*').first();
    const formEdit = this.page.getByText('Onboarding Info', { exact: true }).last().locator('xpath=following-sibling::*').first();
    const headerLink = this.page.locator('div:nth-child(2) > a').first();

    for (const edit of [breadcrumbEdit, formEdit, headerLink]) {
      if (!(await edit.isVisible().catch(() => false))) {
        continue;
      }
      await edit.click();
      if (await this.saveButton.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        return;
      }
    }

    await this.saveButton.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async setStatusTraineeActiveAndSave() {
    await this.selectStatus('Trainee Active');
    await this.saveButton.first().click();

    const yes = this.page.getByRole('dialog').getByRole('button', { name: 'Yes' })
      .or(this.page.getByRole('button', { name: 'Yes' }));
    if (await yes.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await yes.first().click();
    }

    const toastVisible = await this.savedMessage.first().isVisible({ timeout: 15000 }).catch(() => false);
    if (toastVisible) {
      console.log(`Save: ${(await this.savedMessage.first().innerText()).trim()}`);
    } else {
      await expect(this.page.getByText('Trainee Active').first()).toBeVisible({ timeout: 15000 });
      console.log('Onboarding status saved as Trainee Active');
    }
  }

  private async selectStatus(status: string) {
    const trigger = this.statusField().getByRole('button', { name: 'dropdown trigger' });
    await trigger.click();
    await this.page.getByRole('option', { name: status, exact: true }).click();
    console.log(`Status selected: ${status}`);
  }

  private statusField() {
    return this.page.getByText('Status', { exact: true }).locator('..');
  }
}
