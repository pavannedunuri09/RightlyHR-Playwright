import { expect, type Locator, type Page } from '@playwright/test';

const FEMALE_NAMES = new Set([
  'Kavya', 'Meera', 'Sneha', 'Pooja', 'Anjali', 'Divya', 'Isha', 'Neha', 'Shreya', 'Nandini',
]);

const CITIES = [
  { city: 'Hyderabad', state: 'Telangana', zip: '500012' },
  { city: 'Bengaluru', state: 'Karnataka', zip: '560001' },
  { city: 'Pune', state: 'Maharashtra', zip: '411001' },
  { city: 'Chennai', state: 'Tamil Nadu', zip: '600001' },
];

export class OnboardingApplicationPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly nameError: Locator;
  readonly mobileInput: Locator;
  readonly mobileError: Locator;
  readonly genderCombobox: Locator;
  readonly salutationCombobox: Locator;
  readonly dobInput: Locator;
  readonly bloodGroupCombobox: Locator;
  readonly addressLine1: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countryInput: Locator;
  readonly zipInput: Locator;
  readonly sameAsCurrentAddress: Locator;
  readonly nextButton: Locator;
  readonly chooseFileButton: Locator;
  readonly documentNumberInput: Locator;
  readonly requiredDocumentNumberInput: Locator;
  readonly uploadButton: Locator;
  readonly invalidFileTypeMessage: Locator;
  readonly oversizedFileMessage: Locator;
  readonly uploadedMessage: Locator;
  readonly submitButton: Locator;
  readonly confirmMessage: Locator;
  readonly submittedMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name*' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name*' });
    this.nameError = page.getByText(/only alphabets|should not contain|invalid|valid first name|valid last name|numbers|special|not allowed|alphabet/i);
    this.mobileInput = page.getByRole('textbox', { name: 'Please enter your mobile number' });
    this.mobileError = page.getByText(/invalid.*mobile|10 digit|mobile.*valid|enter a valid|valid mobile/i);
    this.genderCombobox = page.getByRole('combobox', { name: 'Please select gender' });
    this.salutationCombobox = page.getByRole('combobox', { name: 'Please select salutation' });
    this.dobInput = page.getByRole('textbox', { name: 'Date Of Birth *' });
    this.bloodGroupCombobox = page.getByRole('combobox', { name: 'Please select blood group' });
    this.addressLine1 = page.getByRole('textbox', { name: 'Address Line 1*' }).first();
    this.cityInput = page.getByRole('textbox', { name: 'City*' }).first();
    this.stateInput = page.getByRole('textbox', { name: 'Please enter state' }).first();
    this.countryInput = page.getByRole('textbox', { name: 'Country*' });
    this.zipInput = page.getByRole('textbox', { name: 'Zip Code*' }).first();
    this.sameAsCurrentAddress = page.getByRole('checkbox', { name: 'Same as Current Address' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.chooseFileButton = page.getByRole('button', { name: 'Choose File' });
    this.documentNumberInput = page.getByRole('textbox', { name: 'Document Number' });
    this.requiredDocumentNumberInput = page.getByRole('textbox', { name: 'Document Number*' });
    this.uploadButton = page.getByRole('button', { name: 'Upload', exact: true });
    this.invalidFileTypeMessage = page.getByText(/only pdf and image are allowed/i);
    this.oversizedFileMessage = page.getByText(/file size should be less than 25mb|less than 25mb/i);
    this.uploadedMessage = page.getByText('Document uploaded successfully');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.confirmMessage = page.getByText('Are you sure you want to');
    this.submittedMessage = page.getByText(/Submitted successfully/i);
  }

  async expectPersonalForm() {
    await this.genderCombobox.waitFor({ state: 'visible', timeout: 20000 });
  }

  async expectInvalidNameRejected(validFirstName: string) {
    await this.firstNameInput.fill('Kavya@123');
    await this.firstNameInput.blur();
    const errorVisible = await this.nameError.first().isVisible().catch(() => false);
    if (errorVisible) {
      console.log(`Name validation: ${(await this.nameError.first().innerText()).trim()}`);
    } else {
      await expect(this.nextButton).toBeDisabled();
      console.log('Name validation: Next stays disabled for invalid first name');
    }
    await this.firstNameInput.fill(validFirstName);
    await this.firstNameInput.blur();
  }

  async expectInvalidMobileRejected() {
    await this.mobileInput.fill('12345');
    await this.mobileInput.blur();
    const shortError = await this.mobileError.first().isVisible().catch(() => false);
    if (shortError) {
      console.log(`Mobile validation: ${(await this.mobileError.first().innerText()).trim()}`);
    } else {
      await expect(this.nextButton).toBeDisabled();
      console.log('Mobile validation: Next stays disabled for invalid mobile');
    }
    await this.mobileInput.fill('abcdefghij');
    await this.mobileInput.blur();
    const letterError = await this.mobileError.first().isVisible().catch(() => false);
    if (letterError) {
      console.log(`Mobile validation: ${(await this.mobileError.first().innerText()).trim()}`);
    }
  }

  async fillMandatoryIndianDetails(firstName: string, lastName: string) {
    const female = FEMALE_NAMES.has(firstName);
    const place = CITIES[Math.floor(Math.random() * CITIES.length)];
    const mobile = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const plot = Math.floor(Math.random() * 80) + 10;

    if (await this.firstNameInput.isVisible().catch(() => false) && await this.firstNameInput.isEnabled().catch(() => false)) {
      await this.firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
    }

    await this.genderCombobox.click();
    await this.page.getByRole('option', { name: female ? 'Female' : 'Male', exact: true }).click();

    await this.salutationCombobox.click();
    await this.page.getByRole('option', { name: female ? 'Miss.' : 'Mr.', exact: true }).click();

    await this.page.getByRole('combobox', { name: 'Select country' }).click().catch(async () => {
      await this.page.getByText('Select country').click();
    });
    await this.page.locator('lib-country-list').getByRole('textbox').fill('91');
    await this.page.getByText('India (भारत)').click();

    await this.mobileInput.fill(mobile);
    await this.dobInput.fill('1998-05-15');

    await this.bloodGroupCombobox.click();
    await this.page.getByRole('option', { name: 'B+', exact: true }).click();

    await this.addressLine1.fill(`Road no.${plot}`);
    await this.cityInput.fill(place.city);
    await this.stateInput.fill(place.state);
    await this.countryInput.fill('India');
    await this.zipInput.fill(place.zip);
    await this.sameAsCurrentAddress.check();
  }

  async goToDocuments() {
    await this.nextButton.click();
    await this.page.getByRole('row', { name: /Resume/ }).waitFor({ state: 'visible', timeout: 20000 });
  }

  async goToDocumentsIfNeeded() {
    if (await this.isOnDocumentsPage()) {
      return;
    }
    if (await this.nextButton.isVisible().catch(() => false)) {
      await this.nextButton.click();
    }
    await this.page.getByRole('row', { name: /Resume/ }).waitFor({ state: 'visible', timeout: 20000 });
  }

  async expectInvalidFileTypeRejected(filePath: string, documentName = 'Resume') {
    await this.openDocumentUpload(documentName);
    await this.chooseFileButton.setInputFiles(filePath);
    await expect(this.invalidFileTypeMessage.first()).toBeVisible({ timeout: 10000 });
    console.log(`File type validation: ${(await this.invalidFileTypeMessage.first().innerText()).trim()}`);
  }

  async expectOversizedFileRejected(filePath: string) {
    await this.chooseFileButton.setInputFiles(filePath);
    await expect(this.oversizedFileMessage.first()).toBeVisible({ timeout: 10000 });
    console.log(`File size validation: ${(await this.oversizedFileMessage.first().innerText()).trim()}`);
    await this.closeUploadDialog();
  }

  async isOnDocumentsPage() {
    return this.page.getByRole('row', { name: /Resume/ }).isVisible({ timeout: 8000 }).catch(() => false);
  }

  async needsUpload(documentName: string) {
    const row = this.documentRow(documentName);
    if (!(await row.isVisible().catch(() => false))) {
      return false;
    }
    const text = await row.innerText();
    return /Requested/i.test(text) && !/Waiting for submission/i.test(text);
  }

  async needsReUpload(documentName: string) {
    const row = this.documentRow(documentName);
    if (!(await row.isVisible().catch(() => false))) {
      return false;
    }
    const text = await row.innerText();
    if (/Waiting for submission|Verified/i.test(text) && !/Rejected/i.test(text)) {
      return false;
    }
    return /Rejected|Re-Upload/i.test(text);
  }

  async reUploadRejectedDocuments(pdfPath: string, imagePath: string) {
    let uploaded = 0;
    if (await this.needsReUpload('Resume') || await this.needsUpload('Resume')) {
      await this.uploadDocument('Resume', pdfPath);
      uploaded += 1;
    }
    if (await this.needsReUpload('PAN') || await this.needsUpload('PAN')) {
      await this.uploadDocument('PAN', imagePath, randomPan());
      uploaded += 1;
    }
    if (await this.needsReUpload('Aadhaar') || await this.needsUpload('Aadhaar')) {
      await this.uploadDocument('Aadhaar', pdfPath, randomAadhaar());
      uploaded += 1;
    }
    if (!uploaded) {
      throw new Error('No rejected documents were available to re-upload');
    }
  }

  async uploadMissingDocuments(pdfPath: string, imagePath: string) {
    if (await this.needsUpload('Resume')) {
      await this.uploadDocument('Resume', pdfPath);
    } else {
      console.log('Resume already uploaded, reusing it');
    }
    if (await this.needsUpload('PAN')) {
      await this.uploadDocument('PAN', imagePath, randomPan());
    } else {
      console.log('PAN already uploaded, reusing it');
    }
    if (await this.needsUpload('Aadhaar')) {
      await this.uploadDocument('Aadhaar', pdfPath, randomAadhaar());
    } else {
      console.log('Aadhaar already uploaded, reusing it');
    }
  }

  async submitAndExpectLogout(loginUsername: Locator) {
    await this.submitButton.click();
    await expect(this.confirmMessage).toBeVisible({ timeout: 10000 });
    await this.page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click();
    await expect(this.submittedMessage).toBeVisible({ timeout: 20000 });
    await expect(loginUsername).toBeVisible({ timeout: 20000 });
  }

  private async closeUploadDialog() {
    const dialog = this.page.getByRole('dialog');
    if (!(await dialog.isVisible().catch(() => false))) {
      return;
    }
    const close = dialog.getByRole('button', { name: /close|cancel/i }).first();
    if (await close.isVisible().catch(() => false)) {
      await close.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
    await dialog.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
  }

  private documentRow(documentName: string) {
    return this.page.getByRole('row').filter({ hasText: documentName }).first();
  }

  private async openDocumentUpload(documentName: string) {
    await this.closeUploadDialog();
    const row = this.documentRow(documentName);
    const reUpload = row.getByRole('button', { name: /Re-Upload/ });
    if (await reUpload.isVisible().catch(() => false)) {
      await reUpload.click();
    } else {
      await row.getByRole('button', { name: /Upload/ }).click();
    }
    await this.page.getByRole('dialog').waitFor({ state: 'visible', timeout: 10000 });
    await this.chooseFileButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  private async uploadDocument(documentName: string, filePath: string, documentNumber?: string) {
    const row = this.documentRow(documentName);
    const current = await row.innerText();
    if (/Waiting for submission/i.test(current) && !/Rejected/i.test(current)) {
      console.log(`${documentName} already uploaded, reusing it`);
      return;
    }

    await this.openDocumentUpload(documentName);
    if (documentNumber) {
      const numberInput = (await this.requiredDocumentNumberInput.isVisible().catch(() => false))
        ? this.requiredDocumentNumberInput
        : this.documentNumberInput;
      if (await numberInput.isVisible().catch(() => false)) {
        await numberInput.fill(documentNumber);
      }
    }
    await this.chooseFileButton.setInputFiles(filePath);
    await expect(this.uploadButton).toBeEnabled({ timeout: 10000 });
    await this.uploadButton.click();
    const uploaded = await this.uploadedMessage.isVisible({ timeout: 15000 }).catch(() => false);
    const waiting = await row.getByText(/Waiting for submission/i).isVisible().catch(() => false);
    if (!uploaded && !waiting) {
      const dialogText = await this.page.getByRole('dialog').innerText().catch(() => '');
      throw new Error(`${documentName} upload did not succeed. Dialog: ${dialogText.replace(/\s+/g, ' ')}`);
    }
    console.log(`Uploaded ${documentName}`);
    await this.page.getByRole('dialog').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }
}

function randomPan() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const pick = (count: number) => Array.from({ length: count }, () => letters[Math.floor(Math.random() * 26)]).join('');
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  return `${pick(5)}${digits}${pick(1)}`;
}

function randomAadhaar() {
  return `8${Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join('')}`;
}
