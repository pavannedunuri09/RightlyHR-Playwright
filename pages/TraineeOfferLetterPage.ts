import { expect, type Locator, type Page } from '@playwright/test';
import type { SavedTrainee } from '../tests/fixtures/lastTrainee';

function isoDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export class TraineeOfferLetterPage {
  readonly page: Page;
  readonly generateButton: Locator;
  readonly requestApprovalButton: Locator;
  readonly optionList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.generateButton = page.getByRole('button', { name: 'Generate Offer Letter' });
    this.requestApprovalButton = page.getByRole('button', { name: 'Request For Approval' });
    this.optionList = page.getByRole('listbox', { name: 'Option List' }).or(page.getByLabel('Option List'));
  }

  async openFromTraineesList() {
    await this.page.getByRole('button', { name: 'Generate Documents' }).click();
    await this.page.getByText('Trainee Offer Letter', { exact: true }).first().click();
    await this.page.waitForURL(/trainee-offer-letter/, { timeout: 20000 });
    await this.generateButton.waitFor({ state: 'visible', timeout: 20000 });
  }

  async selectEmployee(trainee: SavedTrainee) {
    const combo = this.fieldCombo('Select Employee*');
    const selected = new RegExp(`${trainee.firstName}\\s+${trainee.lastName}`, 'i');
    if (selected.test(await this.comboText(combo))) {
      return;
    }
    await this.openField(combo);
    await this.pickOption(selected, combo);
    await expect(combo).toContainText(selected);
  }

  async fillRequiredDetails() {
    const salary = this.page.getByRole('spinbutton', { name: 'Please enter salary' });
    await salary.waitFor({ state: 'visible', timeout: 10000 });
    await salary.fill('300000');
    await salary.blur();

    await this.fillDate('Please enter offer issued date', isoDate());
    await this.fillDate('Please enter expected start date', isoDate(7));
    await this.fillDate('Please enter offer expiry date', isoDate(21));

    await this.selectLabeledField('Select Address *', /current address/i, 'Hyderabad');
    await this.selectLabeledField('Training Period(Months)*');
    await this.selectLabeledField('Reporting Manager *');
    await this.selectLabeledField('Document Type *');
    await this.selectLabeledField('Signature Authority Name*');

    await expect(this.generateButton).toBeEnabled({ timeout: 15000 });
  }

  async generate() {
    await expect(this.generateButton).toBeEnabled({ timeout: 15000 });
    await this.generateButton.click();
    await this.page.getByText(/generated|success/i).first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
    console.log('Generated trainee offer letter');
  }

  async requestApproval() {
    await expect(this.requestApprovalButton).toBeEnabled({ timeout: 15000 });
    await this.requestApprovalButton.click();
    const toast = this.page.getByText(/success|sent|submitted|requested|approval/i).first();
    await expect(toast).toBeVisible({ timeout: 20000 });
    console.log(`Offer approval requested: ${(await toast.innerText()).trim()}`);
  }

  private async selectLabeledField(label: string, option?: RegExp, search?: string) {
    const combo = this.fieldCombo(label);
    await combo.waitFor({ state: 'visible', timeout: 10000 });
    if (!/please select/i.test(await this.comboText(combo))) {
      return;
    }

    await this.page.keyboard.press('Escape');
    await this.optionList.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});

    const trigger = combo.locator('xpath=..').getByRole('button', { name: 'dropdown trigger' });
    if (search) {
      await combo.click();
      await this.page.keyboard.type(search, { delay: 40 });
      await this.page.waitForTimeout(700);
    } else {
      await combo.click();
      if (!(await this.optionList.isVisible().catch(() => false)) && (await trigger.isVisible().catch(() => false))) {
        await trigger.click();
      }
    }

    await this.pickOption(option, combo);
    const value = await this.comboText(combo);
    if (/please select|^$/i.test(value)) {
      throw new Error(`${label} is still unselected after choosing an option`);
    }
    console.log(`Selected ${label}: ${value}`);
  }

  private async openField(combo: Locator) {
    const trigger = combo.locator('xpath=..').getByRole('button', { name: 'dropdown trigger' });
    if (await trigger.isVisible().catch(() => false)) {
      await trigger.click();
    } else {
      await combo.click();
    }
  }

  private async pickOption(option: RegExp | undefined, combo: Locator) {
    const listed = await this.optionList
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (listed) {
      const item = option
        ? this.optionList.getByRole('option').filter({ hasText: option }).first()
        : this.optionList.getByRole('option').first();
      await item.click();
      await this.optionList.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      return;
    }

    await combo.press('ArrowDown');
    await this.page.waitForTimeout(200);
    await combo.press('Enter');
    await this.page.waitForTimeout(400);
  }

  private fieldCombo(label: string) {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .filter({ has: this.page.getByRole('combobox') })
      .last()
      .getByRole('combobox');
  }

  private async fillDate(placeholder: string, value: string) {
    const input = this.page.getByPlaceholder(placeholder);
    await input.fill(value);
    await input.blur();
  }

  private async comboText(combobox: Locator) {
    return (
      (await combobox.inputValue().catch(() => '')) ||
      (await combobox.innerText().catch(() => ''))
    ).trim();
  }
}
