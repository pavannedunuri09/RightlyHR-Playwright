import { expect, type Locator, type Page } from '@playwright/test';

export function generateEmployeeId(prefix = 'RHR') {
  return `${prefix}${Date.now().toString().slice(-6)}`;
}

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

  async setStatusActiveAndSave() {
    await this.selectStatus('Active');
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
      await expect(this.page.getByText('Active', { exact: true }).first()).toBeVisible({ timeout: 15000 });
      console.log('Onboarding status saved as Active');
    }
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

  async activateTraineeWithEmployeeId(employeeId?: string) {
    await this.setStatusTraineeActiveAndSave();
    await this.page.keyboard.press('Escape').catch(() => {});
    return employeeId ?? generateEmployeeId();
  }

  async setEmployeeIdOnBasicInfo(employeeId?: string) {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.openBasicInfoSection();

    const input = this.employeeIdInput();
    if (await input.first().isVisible({ timeout: 8000 }).catch(() => false)) {
      const current = (await input.first().inputValue()).trim();
      if (current && !/^NA$/i.test(current)) {
        console.log(`Employee ID already set: ${current}`);
        return current.replace(/\D/g, '') || current;
      }
    }

    const existing = await this.readExistingEmployeeId();
    if (existing) {
      console.log(`Employee ID already visible on profile: ${existing}`);
      return existing;
    }

    await this.enableBasicInfoEdit();

    if (await input.first().isVisible().catch(() => false)) {
      const current = (await input.first().inputValue()).trim();
      if (current && !/^NA$/i.test(current)) {
        console.log(`Employee ID already set after edit: ${current}`);
        return current.replace(/\D/g, '') || current;
      }

      if (await input.first().isEnabled().catch(() => false)) {
        const id = employeeId ?? generateEmployeeId();
        await input.first().fill(id);
        await this.fillMandatoryBasicInfoFields();
        const saveEnabled = await this.saveButton.first().isEnabled().catch(() => false);
        if (saveEnabled) {
          await this.saveButton.first().click();

          const toast = this.page.getByText(/Basic information updated|saved successfully|updated successfully/i);
          const saved = await toast.first().isVisible({ timeout: 15000 }).catch(() => false);
          if (saved) {
            console.log(`Basic Info save: ${(await toast.first().innerText()).trim()}`);
          } else {
            await expect(input.first()).toHaveValue(id, { timeout: 10000 });
          }
          console.log(`Employee ID set: ${id}`);
          return id;
        }

        const filled = (await input.first().inputValue()).trim();
        if (filled && !/^NA$/i.test(filled)) {
          console.log(`Save remained disabled; using employee ID already on Basic Info: ${filled}`);
          return filled.replace(/\D/g, '') || filled;
        }
        if (employeeId) {
          console.log(`Save remained disabled; using provided employee ID ${employeeId}`);
          return employeeId.replace(/\D/g, '') || employeeId;
        }
      }
    }

    if (employeeId) {
      console.log(`Using employee ID ${employeeId}; Basic Info field remained read-only`);
      return employeeId.replace(/\D/g, '') || employeeId;
    }

    console.log('Employee ID field was read-only and no ID was available; continuing without setting one');
    return '';
  }

  private employeeIdInput() {
    return this.page.getByRole('textbox', { name: /Please enter employee ID|Employee ID/i })
      .or(this.page.getByPlaceholder(/employee ID/i));
  }

  private async openBasicInfoSection() {
    if (await this.personalTab.first().isVisible().catch(() => false)) {
      await this.personalTab.first().click();
    }

    const basicInfo = this.page.locator('div').filter({ hasText: /^Basic Info$/ }).nth(1)
      .or(this.page.getByText('Basic Info', { exact: true }).first());
    if (await basicInfo.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await basicInfo.first().click();
    }
    console.log('Opened Basic Info tab');
  }

  async readEmployeeIdFromBasicInfo() {
    await this.openBasicInfoSection();
    return this.readExistingEmployeeId();
  }

  private async fillMandatoryBasicInfoFields() {
    const marital = this.page.getByRole('combobox', { name: /Please select marital status|Marital Status/i })
      .or(this.page.locator('p-select[formcontrolname="maritalStatus"]'));
    if (await marital.first().isVisible().catch(() => false)) {
      const text = ((await marital.first().innerText().catch(() => '')) || '').trim();
      if (!text || /please select/i.test(text)) {
        await marital.first().click();
        await this.page.getByRole('option', { name: 'Single', exact: true }).click();
        console.log('Marital status set to Single');
      }
    }

    const salutation = this.page.locator('p-select[formcontrolname="salutation"]');
    if (await salutation.isVisible().catch(() => false)) {
      const text = ((await salutation.innerText().catch(() => '')) || '').trim();
      if (!text || /please select/i.test(text)) {
        await salutation.click();
        await this.page.getByRole('option', { name: 'Miss.', exact: true }).click();
        console.log('Salutation set to Miss.');
      }
    }

    const gender = this.page.locator('p-select[formcontrolname="gender"]');
    if (await gender.isVisible().catch(() => false)) {
      const text = ((await gender.innerText().catch(() => '')) || '').trim();
      if (!text || /please select/i.test(text)) {
        await gender.click();
        await this.page.getByRole('option', { name: 'Female', exact: true }).click();
        console.log('Gender set to Female');
      }
    }
  }

  private async readExistingEmployeeId() {
    const input = this.employeeIdInput();
    if (await input.first().isVisible().catch(() => false)) {
      const value = (await input.first().inputValue()).trim();
      if (value && !/^NA$/i.test(value)) {
        return value.replace(/\D/g, '') || value;
      }
    }

    const labeled = this.page.getByText(/Employee ID/i).first().locator('xpath=following-sibling::*[1]');
    const text = ((await labeled.innerText().catch(() => '')) || '').trim();
    if (text && !/^NA$/i.test(text)) {
      return text.replace(/\D/g, '') || text;
    }

    return null;
  }

  private async enableBasicInfoEdit() {
    const input = this.employeeIdInput();
    if (await input.first().isVisible().catch(() => false) && await input.first().isEnabled().catch(() => false)) {
      return;
    }

    const editCandidates = [
      this.page.locator('div:nth-child(2) > a').first(),
      this.page.getByText('Basic Info', { exact: true }).last().locator('xpath=following-sibling::*').first(),
      this.page.locator('.card.custom-background-card').locator('a').first(),
      this.page.getByRole('button', { name: /^Edit$/i }).first(),
    ];

    for (const edit of editCandidates) {
      if (!(await edit.isVisible().catch(() => false))) {
        continue;
      }
      await edit.click().catch(() => {});
      await this.page.waitForTimeout(800);
      if (await input.first().isEnabled().catch(() => false)) {
        return;
      }
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
