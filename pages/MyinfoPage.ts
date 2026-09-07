import { expect, type Locator, type Page } from '@playwright/test';

export class MyInfoPage {
  constructor(private page: Page) {}

  async openMyInfo() {
    await this.page.getByText('My Info', { exact: true }).click();
    await expect(this.page.getByText('Salutation*', { exact: true })).toBeVisible({ timeout: 15000 });
    console.log('Opened My Info Basic Info');
  }

  async clickEdit() {
    await expect(this.page.getByText('Salutation*', { exact: true })).toBeVisible({ timeout: 15000 });

    if (await this.salutationEditable()) {
      console.log('Basic Info already in edit mode');
      return;
    }

    const editCandidates = [
      this.page.getByText('Basic Info', { exact: true }).last().locator('xpath=following-sibling::*').first(),
      this.page.locator('.card.custom-background-card').locator('a').first(),
      this.page.locator('.card.custom-background-card').locator("svg[width='20'][height='20'][viewBox='0 0 20 20']").first(),
      this.page.getByRole('button', { name: /^Edit$/i }).first(),
    ];

    for (const edit of editCandidates) {
      if (!(await edit.isVisible().catch(() => false))) {
        continue;
      }
      await edit.click().catch(() => {});
      await this.page.waitForTimeout(800);
      if (!(await this.page.getByText('Salutation*', { exact: true }).isVisible({ timeout: 2000 }).catch(() => false))) {
        await this.openMyInfo();
        continue;
      }
      if (await this.salutationEditable()) {
        console.log('Clicked on Edit icon');
        return;
      }
    }

    await expect(this.salutationDropdown()).toBeVisible({ timeout: 15000 });
    await expect(this.salutationDropdown()).not.toHaveClass(/p-disabled/);
    console.log('Clicked on Edit icon');
  }

  async selectSalutation(value: string) {
    const dropdown = this.salutationDropdown();
    await expect(dropdown).toBeVisible({ timeout: 15000 });
    await expect(dropdown).not.toHaveClass(/p-disabled/);

    await this.openDropdown(dropdown);
    console.log('Opened Salutation dropdown');

    await this.page.getByRole('option', { name: value, exact: true }).click();
    console.log(`Selected Salutation: ${value}`);

    const expectedGender = salutationGender(value);
    if (expectedGender) {
      await this.selectGender(expectedGender);
    }

    await expect(dropdown).toContainText(value);
  }

  async selectGender(gender: 'Male' | 'Female') {
    const dropdown = this.genderDropdown();
    await expect(dropdown).toBeVisible({ timeout: 15000 });
    await expect(dropdown).not.toHaveClass(/p-disabled/);

    const current = ((await dropdown.innerText().catch(() => '')) || '').trim();
    if (current.includes(gender)) {
      console.log(`Gender already ${gender}`);
      return;
    }

    await this.openDropdown(dropdown);
    await this.page.getByRole('option', { name: gender, exact: true }).click();
    console.log(`Selected Gender: ${gender}`);
    await expect(dropdown).toContainText(gender);
  }

  async selectSalutationWithGender(salutation: Salutation, gender: Gender) {
    const mappedGender = salutationGender(salutation);
    if (mappedGender !== gender) {
      throw new Error(`Salutation ${salutation} must be paired with ${mappedGender}, not ${gender}`);
    }
    await this.selectSalutation(salutation);
  }

  async readCurrentSalutation() {
    const dropdown = this.salutationDropdown();
    if (await dropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
      const fromDropdown = parseSalutation((await dropdown.innerText().catch(() => '')) || '');
      if (fromDropdown) {
        return fromDropdown;
      }
    }

    const field = this.salutationField();
    return parseSalutation(((await field.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim()) ?? '';
  }

  alternateSalutationPair(current: string): { salutation: Salutation; gender: Gender } {
    const salutation = parseSalutation(current);
    if (salutation === 'Mr.') {
      return { salutation: 'Miss.', gender: 'Female' };
    }
    if (salutation === 'Miss.' || salutation === 'Mrs.' || salutation === 'Ms.') {
      return { salutation: 'Mr.', gender: 'Male' };
    }
    return { salutation: 'Miss.', gender: 'Female' };
  }

  async saveChanges() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  get successMessage() {
    return this.page.getByText(/Basic information updated|saved successfully|updated successfully/i).first();
  }

  get salutationValue() {
    return this.salutationField();
  }

  get genderValue() {
    return this.genderField();
  }

  private async openDropdown(dropdown: Locator) {
    const trigger = dropdown.locator('.custom-p-select-content, .p-select-dropdown, [role="combobox"]').first();
    if (await trigger.isVisible({ timeout: 3000 }).catch(() => false)) {
      await trigger.click();
    } else {
      await dropdown.click();
    }
  }

  private salutationField(): Locator {
    return this.page.getByText('Salutation*', { exact: true }).locator('..');
  }

  private genderField(): Locator {
    return this.page.getByText('Gender*', { exact: true }).locator('..');
  }

  private salutationDropdown(): Locator {
    return this.page.locator('p-select[formcontrolname="salutation"]');
  }

  private async salutationEditable() {
    const dropdown = this.salutationDropdown();
    if (!(await dropdown.isVisible({ timeout: 2000 }).catch(() => false))) {
      return false;
    }
    const className = (await dropdown.getAttribute('class')) ?? '';
    return !/p-disabled/.test(className);
  }

  private genderDropdown(): Locator {
    return this.page.locator('p-select[formcontrolname="gender"]');
  }
}

function parseSalutation(value: string): Salutation | null {
  const trimmed = value.trim();
  if (/^Mr\.?$/i.test(trimmed)) {
    return 'Mr.';
  }
  if (/^Miss\.?$/i.test(trimmed)) {
    return 'Miss.';
  }
  if (/^Mrs\.?$/i.test(trimmed)) {
    return 'Mrs.';
  }
  if (/^Ms\.?$/i.test(trimmed)) {
    return 'Ms.';
  }

  const match = trimmed.match(/(Mr\.|Miss\.|Mrs\.|Ms\.)/i);
  if (!match) {
    return null;
  }

  const token = match[1].toLowerCase();
  if (token.startsWith('mr')) {
    return 'Mr.';
  }
  if (token.startsWith('miss')) {
    return 'Miss.';
  }
  if (token.startsWith('mrs')) {
    return 'Mrs.';
  }
  return 'Ms.';
}

function salutationGender(value: string): Gender | null {
  const salutation = parseSalutation(value);
  if (!salutation) {
    return null;
  }
  return SALUTATION_GENDER_MAP[salutation];
}

export type Salutation = 'Mr.' | 'Miss.' | 'Mrs.' | 'Ms.';
export type Gender = 'Male' | 'Female';

export const SALUTATION_GENDER_MAP: Record<Salutation, Gender> = {
  'Mr.': 'Male',
  'Miss.': 'Female',
  'Mrs.': 'Female',
  'Ms.': 'Female',
};
