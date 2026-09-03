import { expect, type Locator, type Page } from '@playwright/test';
import { OnboardingApplicationPage } from './OnboardingApplicationPage';

export class TraineeOfferLetterPage {
  readonly page: Page;
  readonly generateDocumentsButton: Locator;
  readonly traineeOfferLetterCard: Locator;
  readonly employeeOfferLetterCard: Locator;
  readonly employeeCombobox: Locator;
  readonly employeeSearch: Locator;
  readonly personalEmailInput: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly designationInput: Locator;
  readonly addressLine1Input: Locator;
  readonly addressLine2Input: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countryInput: Locator;
  readonly pincodeInput: Locator;
  readonly addressCombobox: Locator;
  readonly salaryInput: Locator;
  readonly offerIssuedDate: Locator;
  readonly expectedStartDate: Locator;
  readonly offerExpiryDate: Locator;
  readonly trainingPeriodCombobox: Locator;
  readonly reportingManagerCombobox: Locator;
  readonly documentTypeCombobox: Locator;
  readonly signatureAuthorityCombobox: Locator;
  readonly noteInput: Locator;
  readonly generateButton: Locator;
  readonly requestApprovalButton: Locator;
  readonly generatedToast: Locator;
  readonly approvalToast: Locator;
  readonly expiryError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.generateDocumentsButton = page.getByRole('button', { name: 'Generate Documents' });
    this.traineeOfferLetterCard = page.locator('div').filter({ hasText: /^Trainee Offer Letter$/ }).first();
    this.employeeOfferLetterCard = page.locator('div').filter({ hasText: /^Offer Letter$/ }).first();
    this.employeeCombobox = page.getByRole('combobox', { name: 'Please select employee' });
    this.employeeSearch = page.getByRole('searchbox', { name: 'Search employee' });
    this.personalEmailInput = page.getByRole('textbox', { name: 'Personal email ID' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.middleNameInput = page.getByRole('textbox', { name: 'Middle name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    this.designationInput = page.getByRole('textbox', { name: 'Designation' });
    this.addressLine1Input = page.getByRole('textbox', { name: 'Address line 1' });
    this.addressLine2Input = page.getByRole('textbox', { name: 'Address line 2' });
    this.cityInput = page.getByRole('textbox', { name: 'City' });
    this.stateInput = page.getByRole('textbox', { name: 'State' });
    this.countryInput = page.getByRole('textbox', { name: 'Country' });
    this.pincodeInput = page.getByRole('textbox', { name: 'Pincode' });
    this.addressCombobox = page.getByRole('combobox', { name: 'Please select address' });
    this.salaryInput = page.getByRole('spinbutton', { name: 'Please enter salary' });
    this.offerIssuedDate = page.getByPlaceholder('Please enter offer issued date');
    this.expectedStartDate = page.getByPlaceholder('Please enter expected start');
    this.offerExpiryDate = page.getByPlaceholder('Please enter offer expiry date');
    this.trainingPeriodCombobox = page.getByRole('combobox', { name: 'Please select training period' });
    this.reportingManagerCombobox = page.getByRole('combobox', { name: 'Please select reporting manager' });
    this.documentTypeCombobox = page.getByRole('combobox', { name: 'Please select document type' });
    this.signatureAuthorityCombobox = page.getByRole('combobox', { name: 'Please select signature authority' });
    this.noteInput = page.getByRole('textbox', { name: 'Please enter note' });
    this.generateButton = page.getByRole('button', { name: /Regenerate Offer Letter|Generate Offer Letter/ });
    this.requestApprovalButton = page.getByRole('button', { name: 'Request For Approval' });
    this.generatedToast = page.getByText('Trainee Offer letter generated successfully');
    this.approvalToast = page.getByText('Approval request sent');
    this.expiryError = page.getByText('Offer Expiry Date should be');
  }

  async openFromTraineesList() {
    await this.generateDocumentsButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.generateDocumentsButton.click();
    await this.traineeOfferLetterCard.waitFor({ state: 'visible', timeout: 15000 });
    await this.traineeOfferLetterCard.click();
    await this.employeeCombobox.waitFor({ state: 'visible', timeout: 20000 });
  }

  async openEmployeeOfferLetterFromList() {
    await this.generateDocumentsButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.generateDocumentsButton.click();
    await this.employeeOfferLetterCard.waitFor({ state: 'visible', timeout: 15000 });
    await this.employeeOfferLetterCard.click();
    await this.employeeCombobox.waitFor({ state: 'visible', timeout: 20000 });
  }

  async expectEmployeeInDropdown(firstName: string, lastName: string, employeeId?: string) {
    await this.employeeCombobox.click();
    await this.employeeSearch.waitFor({ state: 'visible', timeout: 10000 });
    const queries = [employeeId, firstName, lastName].filter((value): value is string => Boolean(value));
    for (const query of queries) {
      await this.employeeSearch.fill(query);
      await this.page.waitForTimeout(1500);
      const option = this.page.getByRole('option').filter({ hasText: new RegExp(`${firstName}|${lastName}`) }).first();
      if (await option.isVisible().catch(() => false)) {
        const label = ((await option.innerText().catch(() => '')) || '').trim();
        console.log(`Offer Letter dropdown has: ${label}`);
        await this.page.keyboard.press('Escape').catch(() => {});
        return;
      }
    }
    throw new Error(`${firstName} ${lastName} was not found in the Offer Letter employee dropdown`);
  }

  async selectEmployee(firstName: string, lastName: string, email?: string, employeeId?: string) {
    await this.openEmployeePicker();

    const queries = [employeeId, email, `${firstName} ${lastName}`, firstName, lastName]
      .filter((value): value is string => Boolean(value && value.trim()));
    const nameRe = new RegExp(`${escapeRegExp(firstName)}[\\s\\S]*${escapeRegExp(lastName)}`, 'i');

    for (const query of queries) {
      await this.employeeSearch.fill('');
      await this.employeeSearch.fill(query);
      await this.page.waitForTimeout(1500);
      if (await this.page.getByRole('option', { name: 'No results found' }).isVisible().catch(() => false)) {
        continue;
      }

      const options = this.page.getByRole('option');
      const count = await options.count();
      for (let index = 0; index < count; index++) {
        const option = options.nth(index);
        if (!(await option.isVisible().catch(() => false))) {
          continue;
        }
        const label = ((await option.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
        const matchesId = Boolean(employeeId && label.includes(employeeId));
        const matchesName = nameRe.test(label);
        const matchesEmail = Boolean(email && label.toLowerCase().includes(email.toLowerCase()));
        if (!matchesId && !matchesName && !matchesEmail) {
          continue;
        }

        await option.click();
        await this.firstNameInput.waitFor({ state: 'visible', timeout: 15000 });
        const loaded = await this.waitForSelectedEmployee(firstName, email);
        if (loaded) {
          console.log(`Selected employee: ${label}`);
          await this.page.waitForTimeout(1500);
          return;
        }

        await this.openEmployeePicker();
      }
    }

    throw new Error(`Employee ${firstName} ${lastName} was not found in Trainee Offer Letter search`);
  }

  private async openEmployeePicker() {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.employeeCombobox.click();
    await this.employeeSearch.waitFor({ state: 'visible', timeout: 10000 });
  }

  private async waitForSelectedEmployee(firstName: string, email?: string) {
    const deadline = Date.now() + 12000;
    while (Date.now() < deadline) {
      const loadedEmail = (await this.personalEmailInput.inputValue().catch(() => '')).trim();
      const loadedFirst = (await this.firstNameInput.inputValue().catch(() => '')).trim();
      if (email && loadedEmail.toLowerCase() === email.toLowerCase()) {
        return true;
      }
      if (loadedEmail && loadedFirst.toLowerCase() === firstName.toLowerCase()) {
        return true;
      }
      await this.page.waitForTimeout(400);
    }
    return false;
  }

  async expectEmployeeDefaults(details: {
    firstName: string;
    lastName: string;
    email: string;
    salutation?: string;
    middleName?: string;
    gender?: string;
    designation?: string;
  }) {
    const expected = {
      ...OnboardingApplicationPage.expectedPersonalDefaults(details.firstName),
      ...details,
    };

    await expect(this.personalEmailInput).toHaveValue(expected.email, { timeout: 15000 });
    await expect(this.firstNameInput).toHaveValue(expected.firstName);
    await expect(this.middleNameInput).toHaveValue(expected.middleName ?? '');
    await expect(this.lastNameInput).toHaveValue(expected.lastName);
    await expect(this.designationInput).toHaveValue(expected.designation ?? 'Front End Developer');

    const salutation = (await this.labeledCombobox('Salutation*').innerText()).trim();
    const gender = (await this.labeledCombobox('Gender*').innerText()).trim();

    console.log(`Default email: ${await this.personalEmailInput.inputValue()}`);
    console.log(`Default salutation: ${salutation}`);
    console.log(`Default first name: ${await this.firstNameInput.inputValue()}`);
    console.log(`Default middle name: ${(await this.middleNameInput.inputValue()).trim() || '(empty)'}`);
    console.log(`Default last name: ${await this.lastNameInput.inputValue()}`);
    console.log(`Default gender: ${gender}`);
    console.log(`Default designation: ${await this.designationInput.inputValue()}`);

    expect(salutation).toMatch(/^(Mr\.|Miss\.|Mrs\.|Ms\.)$/);
    expect(gender).toMatch(/^(Male|Female|Other)$/);
  }

  async expectAddressAutofill(details?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  }) {
    await expect(this.addressLine1Input).not.toHaveValue('', { timeout: 10000 });
    await expect(this.cityInput).not.toHaveValue('');
    await expect(this.stateInput).not.toHaveValue('');
    await expect(this.countryInput).not.toHaveValue('');
    await expect(this.pincodeInput).not.toHaveValue('');

    if (details?.addressLine1) {
      await expect(this.addressLine1Input).toHaveValue(details.addressLine1);
    }
    if (details?.city) {
      await expect(this.cityInput).toHaveValue(details.city);
    }
    if (details?.state) {
      await expect(this.stateInput).toHaveValue(details.state);
    }
    if (details?.country) {
      await expect(this.countryInput).toHaveValue(details.country);
    }
    if (details?.pincode) {
      await expect(this.pincodeInput).toHaveValue(details.pincode);
    }

    console.log(`Default address line 1: ${await this.addressLine1Input.inputValue()}`);
    console.log(`Default address line 2: ${(await this.addressLine2Input.inputValue()).trim() || '(empty)'}`);
    console.log(`Default city: ${await this.cityInput.inputValue()}`);
    console.log(`Default state: ${await this.stateInput.inputValue()}`);
    console.log(`Default country: ${await this.countryInput.inputValue()}`);
    console.log(`Default pincode: ${await this.pincodeInput.inputValue()}`);
  }

  private labeledCombobox(label: string) {
    return this.page.getByText(label, { exact: true }).locator('..').getByRole('combobox');
  }

  async selectAddress() {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});

    const currentAddress = this.page.getByRole('option', { name: 'Current Address' });
    const permanentAddress = this.page.getByRole('option', { name: 'Permanent Address' });
    const addressOption = currentAddress.or(permanentAddress).first();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (await addressOption.isVisible().catch(() => false)) {
        break;
      }
      if (await this.addressCombobox.isVisible().catch(() => false)) {
        await this.addressCombobox.click();
      } else {
        const field = this.page.locator('div').filter({ hasText: /^Select Address/ }).first();
        await field.getByRole('button', { name: 'dropdown trigger' }).click();
      }
      if (await addressOption.isVisible({ timeout: 5000 }).catch(() => false)) {
        break;
      }
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(1000);
    }

    if (!(await addressOption.isVisible().catch(() => false))) {
      throw new Error('Address dropdown did not show Current/Permanent Address after selecting the employee');
    }

    if (await currentAddress.isVisible().catch(() => false)) {
      console.log('Selecting address: Current Address');
      await currentAddress.click();
    } else {
      console.log('Selecting address: Permanent Address');
      await permanentAddress.click();
    }

    await expect(this.page.getByRole('combobox', { name: /Current Address|Permanent Address/i })).toBeVisible({
      timeout: 10000,
    });
  }

  private fieldAfterLabel(label: string) {
    return this.page.getByText(label, { exact: true }).locator('xpath=following-sibling::*[1]');
  }

  private async chooseAfterLabel(label: string, optionName: string | RegExp, search?: string) {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});

    const field = this.fieldAfterLabel(label);
    await field.getByRole('combobox').click();
    if (!(await this.selectPanelVisible())) {
      await field.getByRole('button', { name: 'dropdown trigger' }).click();
    }
    await expect.poll(async () => this.selectPanelVisible(), { timeout: 8000 }).toBeTruthy();

    const listbox = this.page.getByRole('listbox').last();
    if (search) {
      const filter = this.page.getByRole('searchbox').last();
      if (await filter.isVisible({ timeout: 5000 }).catch(() => false)) {
        await filter.fill(search);
        await this.page.waitForTimeout(1000);
      }
    }

    const option = typeof optionName === 'string'
      ? listbox.getByRole('option', { name: optionName, exact: true })
      : listbox.getByRole('option').filter({ hasText: optionName }).first();
    if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
      await option.click();
    } else {
      const fallback = listbox.getByRole('option').first();
      if (await fallback.isVisible({ timeout: 5000 }).catch(() => false)) {
        const labelText = ((await fallback.innerText().catch(() => '')) || '').trim();
        console.log(`Using first available option for ${label}: ${labelText}`);
        await fallback.click();
      } else {
        throw new Error(`No option matching ${String(optionName)} found for ${label}`);
      }
    }
    await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  private async selectPanelVisible() {
    return (
      (await this.page.getByRole('listbox').last().isVisible().catch(() => false)) ||
      (await this.page.locator('.p-select-overlay, .p-dropdown-panel').last().isVisible().catch(() => false)) ||
      (await this.page.getByRole('option').first().isVisible().catch(() => false)) ||
      (await this.page.getByRole('searchbox').last().isVisible().catch(() => false))
    );
  }

  async fillRequiredDetails(address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  }) {
    await this.selectAddress();
    await this.expectAddressAutofill(address);
    await this.salaryInput.fill('200000');
    await this.salaryInput.blur();

    const issued = isoDate(0);
    await this.offerIssuedDate.fill(issued);
    await this.expectedStartDate.fill(issued);
    await this.offerExpiryDate.fill(isoDate(7));
    await this.offerExpiryDate.blur();
    if (await this.expiryError.isVisible().catch(() => false)) {
      await this.offerExpiryDate.fill(isoDate(14));
      await this.offerExpiryDate.blur();
    }

    const trainingCombo = this.fieldAfterLabel('Training Period(Months)*').getByRole('combobox');
    if (!/^\d+$/.test((await trainingCombo.innerText()).trim())) {
      await this.chooseAfterLabel('Training Period(Months)*', '1');
      await expect(trainingCombo).toHaveText('1');
    }

    const managerCombo = this.fieldAfterLabel('Reporting Manager *').getByRole('combobox');
    if (/please select/i.test(await managerCombo.innerText())) {
      await this.chooseAfterLabel('Reporting Manager *', /Bhavitha Reddy|SD302130/, 'bhav');
    }

    await this.chooseAfterLabel('Document Type *', 'Soft Copy');
    await this.noteInput.fill('Trainee Offer letter');

    const signatureCombo = this.fieldAfterLabel('Signature Authority Name*').getByRole('combobox');
    if (await signatureCombo.isVisible().catch(() => false) && /please select/i.test(await signatureCombo.innerText())) {
      await this.chooseAfterLabel('Signature Authority Name*', /Pavan|Tejaa|saii|[A-Za-z]/);
    }

    const required = this.page.getByText(/is required/i);
    if (await required.first().isVisible().catch(() => false)) {
      console.log(`Still required: ${(await required.allInnerTexts()).join(' | ')}`);
    }
    console.log(`Training: ${(await this.fieldAfterLabel('Training Period(Months)*').getByRole('combobox').innerText()).trim()}`);
    console.log(`Manager: ${(await this.fieldAfterLabel('Reporting Manager *').getByRole('combobox').innerText()).trim()}`);
    console.log(`Document type: ${(await this.fieldAfterLabel('Document Type *').getByRole('combobox').innerText()).trim()}`);
    console.log(`Note: ${await this.noteInput.inputValue()}`);

    if (!(await this.generateButton.isEnabled())) {
      await this.chooseAfterLabel('Document Type *', 'Hard Copy');
      await this.chooseAfterLabel('Signature Authority Name*', /Pavan|Tejaa|saii|[A-Za-z]/);
    }

    await expect(this.generateButton).toBeEnabled({ timeout: 15000 });
  }

  async generateOfferLetter(downloadPath: string) {
    await expect(this.generateButton).toBeEnabled({ timeout: 15000 });
    const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
    await this.generateButton.click();
    const confirmYes = this.page.getByRole('dialog').getByRole('button', { name: 'Yes' });
    if (await confirmYes.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmYes.click();
    }
    const download = await downloadPromise;
    await download.saveAs(downloadPath);
    await expect(this.generatedToast).toBeVisible({ timeout: 20000 });
    const text = (await this.generatedToast.innerText()).trim();
    console.log(`Generate success: ${text}`);
    await this.generatedToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    return text;
  }

  async requestApproval() {
    await expect(this.requestApprovalButton).toBeEnabled({ timeout: 15000 });
    await this.requestApprovalButton.click();
    await expect(this.approvalToast).toBeVisible({ timeout: 20000 });
    const text = (await this.approvalToast.innerText()).trim();
    console.log(`Approval success: ${text}`);
    await this.approvalToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    return text;
  }
}

function isoDate(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
