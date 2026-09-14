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
    await expect(this.successMessage).toBeVisible({ timeout: 15000 });
    await this.waitForViewMode();
  }

  async verifySavedNames(
    names: { firstName: string; middleName: string; lastName: string },
    editable: { first: boolean; middle: boolean; last: boolean },
  ) {
    await this.waitForViewMode();

    if (editable.first) {
      await this.expectNameValue('first', names.firstName);
    }
    if (editable.middle) {
      await this.expectNameValue('middle', names.middleName);
    }
    if (editable.last) {
      await this.expectNameValue('last', names.lastName);
    }
  }

  private async expectNameValue(field: 'first' | 'middle' | 'last', expected: string) {
    await expect
      .poll(async () => this.readNameField(field), { timeout: 15000 })
      .toBe(expected);
  }

  async waitForViewMode() {
    await expect(this.salutationDropdown()).toHaveClass(/p-disabled/, { timeout: 15000 });
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

  get firstNameValue() {
    return this.firstNameInput();
  }

  get middleNameValue() {
    return this.middleNameInput();
  }

  get lastNameValue() {
    return this.lastNameInput();
  }

  async isNameFieldEditable(field: 'first' | 'middle' | 'last') {
    const input = this.nameInput(field);
    if (!(await input.isVisible({ timeout: 3000 }).catch(() => false))) {
      return false;
    }
    return input.isEnabled();
  }

  async readCurrentNames(): Promise<{ firstName: string; middleName: string; lastName: string }> {
    return {
      firstName: await this.readNameField('first'),
      middleName: await this.readNameField('middle'),
      lastName: await this.readNameField('last'),
    };
  }

  async fillNames(names: { firstName: string; middleName: string; lastName: string }) {
    const fields: Array<{ key: 'first' | 'middle' | 'last'; value: string; label: string }> = [
      { key: 'first', value: names.firstName, label: 'First Name' },
      { key: 'middle', value: names.middleName, label: 'Middle Name' },
      { key: 'last', value: names.lastName, label: 'Last Name' },
    ];

    for (const { key, value, label } of fields) {
      const input = this.nameInput(key);
      if (!(await input.isVisible({ timeout: 3000 }).catch(() => false))) {
        console.log(`${label} field not visible; skipping`);
        continue;
      }
      if (!(await input.isEnabled())) {
        console.log(`${label} field is not editable; skipping`);
        continue;
      }
      await input.fill(value);
      console.log(`Updated ${label}: ${value || '(empty)'}`);
    }
  }

  get ageValidationMessage() {
    return this.page.getByText(/Age must be between 18 and/i).first();
  }

  async isDateOfBirthEditable() {
    const input = this.dateOfBirthInput();
    if (!(await input.isVisible({ timeout: 3000 }).catch(() => false))) {
      return false;
    }
    return input.isEnabled();
  }

  async fillDateOfBirth(value: string) {
    const input = this.dateOfBirthInput();
    await expect(input).toBeVisible({ timeout: 15000 });
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.fill(value);
    console.log(`Updated Date Of Birth: ${value}`);
  }

  async blurBasicInfoForm() {
    const mainContent = this.page.locator('.myinfo-main-content');
    if (await mainContent.isVisible({ timeout: 3000 }).catch(() => false)) {
      await mainContent.click();
      return;
    }
    await this.page.getByText('Salutation*', { exact: true }).click();
  }

  async readCurrentDateOfBirth() {
    const input = this.dateOfBirthInput();
    if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
      const value = ((await input.inputValue().catch(() => '')) || '').trim();
      if (value) {
        return value;
      }
    }

    const row = this.page.getByText('Date Of Birth*', { exact: true }).locator('..');
    const rowText = ((await row.innerText().catch(() => '')) || '').replace(/Date Of Birth\*/i, '').trim();
    const isoMatch = rowText.match(/\d{4}-\d{2}-\d{2}/);
    if (isoMatch) {
      return isoMatch[0];
    }

    return ((await input.inputValue().catch(() => '')) || '').trim();
  }

  async verifySavedDateOfBirth(expected: string) {
    await expect.poll(async () => this.readCurrentDateOfBirth(), { timeout: 15000 }).toBe(expected);
  }

  get bloodGroupValue() {
    return this.bloodGroupField();
  }

  async isBloodGroupEditable() {
    const dropdown = this.bloodGroupDropdown();
    if (!(await dropdown.isVisible({ timeout: 3000 }).catch(() => false))) {
      return false;
    }
    const className = (await dropdown.getAttribute('class')) ?? '';
    return !/p-disabled/.test(className);
  }

  async readCurrentBloodGroup() {
    const dropdown = this.bloodGroupDropdown();
    if (await dropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
      const fromDropdown = parseBloodGroup((await dropdown.innerText().catch(() => '')) || '');
      if (fromDropdown) {
        return fromDropdown;
      }
    }

    const combobox = this.page.getByRole('combobox', { name: /^(A|B|O|AB)[+-]$|blood group|please select blood group/i }).first();
    if (await combobox.isVisible({ timeout: 2000 }).catch(() => false)) {
      const fromCombobox = parseBloodGroup((await combobox.innerText().catch(() => '')) || '');
      if (fromCombobox) {
        return fromCombobox;
      }
    }

    const field = this.bloodGroupField();
    return parseBloodGroup(((await field.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim()) ?? '';
  }

  async selectBloodGroup(value: string) {
    const dropdown = this.bloodGroupDropdown();
    await expect(dropdown).toBeVisible({ timeout: 15000 });
    await expect(dropdown).not.toHaveClass(/p-disabled/);

    await this.openDropdown(dropdown);
    console.log('Opened Blood Group dropdown');

    await this.page.getByRole('option', { name: value, exact: true }).click();
    console.log(`Selected Blood Group: ${value}`);
    await expect(dropdown).toContainText(value);
  }

  async verifySavedBloodGroup(expected: string) {
    await this.waitForViewMode();
    await expect(this.bloodGroupField()).toContainText(expected, { timeout: 15000 });
  }

  get marriageAnniversaryInput() {
    return this.marriageAnniversaryInputLocator();
  }

  private marriageAnniversaryInputLocator(): Locator {
    return this.page
      .getByRole('textbox', { name: /Marriage Anniversary|Anniversary Date|Married Date|Date of Marriage/i })
      .or(this.page.locator('input[formcontrolname="marriageAnniversaryDate"]'))
      .or(this.page.locator('input[formcontrolname="marriageAnniversary"]'))
      .or(this.page.locator('p-datepicker[formcontrolname*="marriage"] input, p-calendar[formcontrolname*="marriage"] input'))
      .or(this.marriageAnniversaryField().locator('input, [role="textbox"]'))
      .first();
  }

  private marriageAnniversaryField(): Locator {
    return this.page.getByText(/Marriage Anniversary|Married Date|Date of Marriage/i).first().locator('..');
  }

  private marriageAnniversaryLabel() {
    return this.page.getByText(/Marriage Anniversary|Married Date|Date of Marriage/i).first();
  }

  async isMaritalStatusEditable() {
    const dropdown = this.maritalStatusDropdown();
    if (!(await dropdown.isVisible({ timeout: 3000 }).catch(() => false))) {
      return false;
    }
    const className = (await dropdown.getAttribute('class')) ?? '';
    return !/p-disabled/.test(className);
  }

  async readCurrentMaritalStatus() {
    const dropdown = this.maritalStatusDropdown();
    if (await dropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
      const fromDropdown = parseMaritalStatus((await dropdown.innerText().catch(() => '')) || '');
      if (fromDropdown) {
        return fromDropdown;
      }
    }

    const combobox = this.page
      .getByRole('combobox', { name: /marital status|single|married/i })
      .first();
    if (await combobox.isVisible({ timeout: 2000 }).catch(() => false)) {
      const fromCombobox = parseMaritalStatus((await combobox.innerText().catch(() => '')) || '');
      if (fromCombobox) {
        return fromCombobox;
      }
    }

    const label = this.page.getByText(/^Marital Status\*?$/i).first();
    if (await label.isVisible({ timeout: 2000 }).catch(() => false)) {
      const row = label.locator('..');
      return parseMaritalStatus(((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim()) ?? '';
    }

    return '';
  }

  async selectMaritalStatus(value: MaritalStatus) {
    const dropdown = this.maritalStatusDropdown();
    await expect(dropdown).toBeVisible({ timeout: 15000 });
    await expect(dropdown).not.toHaveClass(/p-disabled/);

    await this.openDropdown(dropdown);
    console.log('Opened Marital Status dropdown');

    await this.page.getByRole('option', { name: value, exact: true }).click();
    console.log(`Selected Marital Status: ${value}`);
    await expect(dropdown).toContainText(value);
    await this.blurBasicInfoForm();
  }

  async isMarriageAnniversaryVisible() {
    if (await this.marriageAnniversaryLabel().isVisible({ timeout: 1000 }).catch(() => false)) {
      return this.marriageAnniversaryInputLocator().isVisible({ timeout: 1000 }).catch(() => false);
    }
    return false;
  }

  async waitForMarriageAnniversaryField(visible: boolean) {
    if (visible) {
      await expect(this.marriageAnniversaryLabel()).toBeVisible({ timeout: 15000 });
      await expect(this.marriageAnniversaryInputLocator()).toBeVisible({ timeout: 15000 });
      return;
    }
    await expect(this.marriageAnniversaryLabel()).toBeHidden({ timeout: 10000 });
  }

  async fillMarriageAnniversary(value: string) {
    const input = this.marriageAnniversaryInputLocator();
    await expect(input).toBeVisible({ timeout: 15000 });
    await expect(input).toBeEnabled({ timeout: 15000 });
    await input.fill(value);
    console.log(`Updated Marriage Anniversary: ${value}`);
  }

  async readMarriageAnniversary() {
    const input = this.marriageAnniversaryInputLocator();
    if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
      return ((await input.inputValue().catch(() => '')) || '').trim();
    }

    const row = this.marriageAnniversaryField();
    const rowText = ((await row.innerText().catch(() => '')) || '').replace(/Marriage Anniversary/i, '').trim();
    const isoMatch = rowText.match(/\d{4}-\d{2}-\d{2}/);
    return isoMatch?.[0] ?? rowText;
  }

  async verifySavedMaritalStatus(expected: MaritalStatus) {
    await this.waitForViewMode();
    const dropdown = this.maritalStatusDropdown();
    if (await dropdown.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(dropdown).toContainText(expected, { timeout: 15000 });
      return;
    }
    await expect.poll(async () => this.readCurrentMaritalStatus(), { timeout: 15000 }).toBe(expected);
  }

  async verifySavedMarriageAnniversary(expected: string) {
    await expect.poll(async () => this.readMarriageAnniversary(), { timeout: 15000 }).toBe(expected);
  }

  async updateToSingleAndSave() {
    await this.selectMaritalStatus('Single');
    await this.waitForMarriageAnniversaryField(false);
    console.log('Marriage Anniversary field hidden for Single status');
    await this.saveChanges();
    await this.verifySavedMaritalStatus('Single');
  }

  async updateToMarriedAndSave(anniversary: string) {
    await this.selectMaritalStatus('Married');
    await this.waitForMarriageAnniversaryField(true);
    console.log('Marriage Anniversary field visible for Married status');
    await this.fillMarriageAnniversary(anniversary);
    await this.blurBasicInfoForm();
    await this.saveChanges();
    await this.verifySavedMaritalStatus('Married');
    await this.verifySavedMarriageAnniversary(anniversary);
  }

  private dateOfBirthInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Date Of Birth*' });
  }

  private async readNameField(field: 'first' | 'middle' | 'last') {
    const input = this.nameInput(field);
    const label =
      field === 'first' ? 'First Name*' : field === 'middle' ? 'Middle Name' : 'Last Name*';

    if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
      const enabled = await input.isEnabled().catch(() => false);
      const value = ((await input.inputValue().catch(() => '')) || '').trim();
      if (enabled || value) {
        return value;
      }
    }

    const row = this.page.getByText(label, { exact: true }).locator('..');
    const rowText = ((await row.innerText().catch(() => '')) || '')
      .replace(label, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (rowText) {
      return rowText;
    }

    return ((await input.inputValue().catch(() => '')) || '').trim();
  }

  private basicInfoSection(): Locator {
    return this.page
      .locator('.component-header')
      .filter({ hasText: /^Basic Info$/ })
      .locator('xpath=ancestor::*[contains(@class,"card") or contains(@class,"component")][1]');
  }

  private nameInput(field: 'first' | 'middle' | 'last'): Locator {
    if (field === 'first') {
      return this.firstNameInput();
    }
    if (field === 'middle') {
      return this.middleNameInput();
    }
    return this.lastNameInput();
  }

  private firstNameInput(): Locator {
    return this.basicInfoSection()
      .getByRole('textbox', { name: 'First Name*' })
      .or(this.page.getByRole('textbox', { name: 'First Name*' }))
      .first();
  }

  private middleNameInput(): Locator {
    return this.basicInfoSection()
      .getByRole('textbox', { name: 'Middle Name' })
      .or(this.page.getByRole('textbox', { name: 'Middle Name' }))
      .first();
  }

  private lastNameInput(): Locator {
    return this.basicInfoSection()
      .getByRole('textbox', { name: 'Last Name*' })
      .or(this.page.getByRole('textbox', { name: 'Last Name*' }))
      .first();
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

  private bloodGroupField(): Locator {
    return this.page.getByText('Blood Group', { exact: true }).locator('..');
  }

  private bloodGroupDropdown(): Locator {
    return this.page
      .locator('p-select[formcontrolname="bloodGroup"]')
      .or(this.bloodGroupField().locator('p-select'))
      .first();
  }

  private maritalStatusField(): Locator {
    return this.page.getByText(/^Marital Status\*?$/i).first().locator('..');
  }

  private maritalStatusDropdown(): Locator {
    return this.page
      .locator('p-select[formcontrolname="maritalStatus"]')
      .or(this.page.locator('p-select[formcontrolname="maritalstatus"]'))
      .or(this.maritalStatusField().locator('p-select'))
      .first();
  }

  async openContactInfo() {
    await this.ensureMyInfoPanelOpen();

    if (await this.contactInfoReady().isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Already on My Info Contact Info');
      return;
    }

    const contactNav = this.page.locator('div').filter({ hasText: /^Contact Info$/ }).nth(1);
    await expect(contactNav).toBeVisible({ timeout: 10000 });
    await contactNav.click();

    await expect(this.contactInfoReady()).toBeVisible({ timeout: 15000 });
    console.log('Opened My Info Contact Info');
  }

  async verifyContactInfoBreadcrumb() {
    const breadcrumb = this.page
      .getByText(/My Info\s*>>\s*Contact Info|My InfoContact Info/i)
      .or(
        this.page
          .locator('.breadcrumb, .component-breadcrumb')
          .filter({ hasText: /My Info/i })
          .filter({ hasText: /Contact Info/i }),
      )
      .first();
    await expect(breadcrumb).toBeVisible({ timeout: 10000 });
    await expect(this.contactInfoHeader()).toBeVisible();
    console.log('Verified breadcrumb: My Info >> Contact Info');
  }

  async verifyContactInfoFieldsVisible() {
    await expect(this.page.getByText(/Personal Email/i)).toBeVisible();
    await expect(this.page.getByText(/Phone Number/i)).toBeVisible();
    await expect(this.page.getByText(/Work Mail/i)).toBeVisible();
    await expect(this.page.getByText(/Work Number/i)).toBeVisible();
    await expect(this.page.getByText(/LinkedIn/i)).toBeVisible();
    console.log('Verified Contact Info fields are visible');
  }

  async clickContactEdit() {
    await expect(this.contactInfoReady()).toBeVisible({ timeout: 15000 });

    if (await this.personalEmailInput().isEnabled().catch(() => false)) {
      console.log('Contact Info already in edit mode');
      return;
    }

    const editCandidates = [
      this.page.locator('app-contact-details').locator('div:nth-child(2) > a').first(),
      this.page.getByText('Contact Info', { exact: true }).last().locator('xpath=following-sibling::*').first(),
      this.page.locator('app-contact-details').getByRole('button', { name: /^Edit$/i }).first(),
      this.page.getByRole('button', { name: /^Edit$/i }).first(),
    ];

    for (const edit of editCandidates) {
      if (!(await edit.isVisible().catch(() => false))) {
        continue;
      }
      await edit.click().catch(() => {});
      await this.page.waitForTimeout(800);
      if (await this.personalEmailInput().isEnabled({ timeout: 2000 }).catch(() => false)) {
        console.log('Clicked Contact Info Edit icon');
        return;
      }
    }

    await expect(this.personalEmailInput()).toBeEnabled({ timeout: 15000 });
    console.log('Clicked Contact Info Edit icon');
  }

  async expectWorkMailNotEditable() {
    const workMail = this.workMailInput();
    await expect(workMail).toBeVisible({ timeout: 10000 });
    await expect(workMail).toBeDisabled();
    console.log('Verified Work Mail is not editable');
  }

  async fillContactFields(fields: {
    personalEmail: string;
    phoneNumber: string;
    workNumber: string;
    linkedInUrl: string;
  }) {
    await expect(this.personalEmailInput()).toBeEnabled({ timeout: 10000 });

    await this.personalEmailInput().fill(fields.personalEmail);
    console.log(`Filled Personal Email: ${fields.personalEmail}`);

    await this.phoneNumberInput().fill(fields.phoneNumber);
    console.log(`Filled Phone Number: ${fields.phoneNumber}`);

    await this.workNumberInput().fill(fields.workNumber);
    console.log(`Filled Work Number: ${fields.workNumber}`);

    await this.linkedInInput().fill(fields.linkedInUrl);
    console.log(`Filled LinkedIn URL: ${fields.linkedInUrl}`);
  }

  async readCurrentContactFields(): Promise<{
    personalEmail: string;
    phoneNumber: string;
    workNumber: string;
    linkedInUrl: string;
  }> {
    return {
      personalEmail: await this.readContactValue(this.personalEmailInput()),
      phoneNumber: await this.readContactValue(this.phoneNumberInput()),
      workNumber: await this.readContactValue(this.workNumberInput()),
      linkedInUrl: await this.readContactValue(this.linkedInInput()),
    };
  }

  async saveContactChanges() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await expect(this.contactSuccessMessage).toBeVisible({ timeout: 15000 });
    await this.waitForContactViewMode();
  }

  async verifySavedContactFields(fields: {
    personalEmail: string;
    phoneNumber: string;
    workNumber: string;
    linkedInUrl: string;
  }) {
    await this.waitForContactViewMode();

    await expect
      .poll(async () => this.readContactValue(this.personalEmailInput()), { timeout: 15000 })
      .toBe(fields.personalEmail);
    await expect
      .poll(async () => this.readContactValue(this.phoneNumberInput()), { timeout: 15000 })
      .toBe(fields.phoneNumber);
    await expect
      .poll(async () => this.readContactValue(this.workNumberInput()), { timeout: 15000 })
      .toBe(fields.workNumber);
    await expect
      .poll(async () => this.readContactValue(this.linkedInInput()), { timeout: 15000 })
      .toBe(fields.linkedInUrl);
    console.log('Verified saved Contact Info fields');
  }

  get contactSuccessMessage() {
    return this.page.getByText(/Contact Information updated|Contact information updated/i).first();
  }

  private async waitForContactViewMode() {
    await expect(this.personalEmailInput()).toBeDisabled({ timeout: 15000 });
  }

  private async readContactValue(input: Locator): Promise<string> {
    if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
      const value = (await input.inputValue().catch(() => '')).trim();
      if (value) {
        return value;
      }
      const text = ((await input.innerText().catch(() => '')) || '').trim();
      if (text) {
        return text;
      }
    }
    return '';
  }

  private async ensureMyInfoPanelOpen() {
    const myInfoContent = this.page.locator('.myinfo-main-content');

    if (await myInfoContent.isVisible({ timeout: 2000 }).catch(() => false)) {
      return;
    }

    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 45000 }).catch(() => {});
    await this.page.getByText('My Info', { exact: true }).click();
    await expect(myInfoContent).toBeVisible({ timeout: 15000 });
  }

  private contactInfoReady(): Locator {
    return this.page
      .locator('app-contact-details')
      .or(this.page.getByRole('textbox', { name: /Personal Email/i }))
      .or(this.page.getByText(/Work Mail/i))
      .first();
  }

  private contactInfoHeader(): Locator {
    return this.page
      .locator('app-contact-details')
      .getByText('Contact Info', { exact: true })
      .or(this.page.locator('.component-header').filter({ hasText: /^Contact Info$/ }))
      .or(this.page.getByText(/My InfoContact Info|My Info\s*>>\s*Contact Info/i))
      .first();
  }

  private contactSection(): Locator {
    return this.page.locator('app-contact-details');
  }

  private personalEmailInput(): Locator {
    return this.contactSection()
      .getByRole('textbox', { name: /Personal Email/i })
      .or(this.page.getByRole('textbox', { name: /Personal Email/i }))
      .first();
  }

  private phoneNumberInput(): Locator {
    return this.contactSection()
      .getByRole('textbox', { name: /Please enter phone number|Phone Number/i })
      .or(this.page.getByRole('spinbutton', { name: /phone number/i }))
      .or(this.page.getByRole('textbox', { name: /Please enter phone number|Phone Number/i }))
      .first();
  }

  private workMailInput(): Locator {
    return this.contactSection()
      .getByRole('textbox', { name: /Work Mail/i })
      .or(this.page.getByRole('textbox', { name: /Work Mail/i }))
      .first();
  }

  private workNumberInput(): Locator {
    return this.contactSection()
      .getByRole('textbox', { name: /Please enter work number|Work Number/i })
      .or(this.page.getByRole('spinbutton', { name: /work number/i }))
      .or(this.page.getByRole('textbox', { name: /Please enter work number|Work Number/i }))
      .first();
  }

  private linkedInInput(): Locator {
    return this.contactSection()
      .getByRole('textbox', { name: /LinkedIn/i })
      .or(this.page.getByRole('textbox', { name: /LinkedIn/i }))
      .first();
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

function parseBloodGroup(value: string): string | null {
  const match = value.match(/(A|B|O|AB)[+-]/i);
  return match ? match[0].toUpperCase() : null;
}

function parseMaritalStatus(value: string): MaritalStatus | null {
  if (/married/i.test(value)) {
    return 'Married';
  }
  if (/single/i.test(value)) {
    return 'Single';
  }
  return null;
}

export type Salutation = 'Mr.' | 'Miss.' | 'Mrs.' | 'Ms.';
export type Gender = 'Male' | 'Female';
export type MaritalStatus = 'Single' | 'Married';

export const SALUTATION_GENDER_MAP: Record<Salutation, Gender> = {
  'Mr.': 'Male',
  'Miss.': 'Female',
  'Mrs.': 'Female',
  'Ms.': 'Female',
};
