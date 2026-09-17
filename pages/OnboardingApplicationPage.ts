import fs from 'fs';
import { expect, type Locator, type Page } from '@playwright/test';
import {
  genderSalutationForFirstName,
  randomDocumentNumber,
  randomMobile,
} from '../tests/fixtures/randomTestData';

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
  readonly addressLine2: Locator;
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
    this.mobileInput = page.getByRole('textbox', { name: /Please enter your mobile/i });
    this.mobileError = page.getByText(/invalid.*mobile|10 digit|mobile.*valid|enter a valid|valid mobile/i);
    this.genderCombobox = page.locator('#gender');
    this.salutationCombobox = page.locator('#salutation').or(page.locator('p-select[formcontrolname="salutation"]'));
    this.dobInput = page.getByRole('textbox', { name: 'Date Of Birth *' });
    this.bloodGroupCombobox = page.locator('#bloodGroup');
    this.addressLine1 = page.getByRole('textbox', { name: 'Address Line 1*' }).first();
    this.addressLine2 = page.getByRole('textbox', { name: 'Address Line 2*' }).first();
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
    if (await this.isOnDocumentsPage()) {
      return;
    }
    await this.genderCombobox.waitFor({ state: 'visible', timeout: 20000 });
  }

  private async openComboboxField(field: Locator) {
    await this.page.locator('.p-select-overlay').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    const combobox = field.getByRole('combobox');
    const trigger = field.getByRole('button', { name: 'dropdown trigger' });
    if (await trigger.isVisible({ timeout: 1000 }).catch(() => false)) {
      await trigger.click();
      return;
    }
    await combobox.click();
  }

  private async selectComboboxOption(field: Locator, optionName: string) {
    const combobox = field.getByRole('combobox');
    const escaped = optionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    for (let attempt = 0; attempt < 2; attempt++) {
      await this.openComboboxField(field);
      const controlsId = await combobox.getAttribute('aria-controls');
      const panel = controlsId
        ? this.page.locator(`#${controlsId}`)
        : this.page.locator('.p-select-overlay').last();
      await expect(panel).toBeVisible({ timeout: 5000 });

      const option = panel.getByRole('option', { name: optionName, exact: true })
        .or(panel.locator('[role="option"]').filter({ hasText: new RegExp(`^\\s*${escaped}\\s*$`) }))
        .or(panel.getByText(optionName, { exact: true }));
      await option.first().click();
      await panel.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      await this.page.waitForTimeout(300);

      const selectedText = ((await field.innerText().catch(() => '')) || '').trim();
      if (selectedText.includes(optionName) || !/please select/i.test(selectedText)) {
        return;
      }
    }

    await expect(field).toContainText(optionName, { timeout: 5000 });
  }

  private async selectMobileCountryCode() {
    const countryCombo = this.page.getByRole('combobox', { name: /Select country|India|91/i }).first();
    await countryCombo.click().catch(async () => {
      await this.page.getByText('Select country').click();
    });
    const search = this.page.locator('lib-country-list').getByRole('textbox');
    await search.waitFor({ state: 'visible', timeout: 5000 });
    await search.fill('91');
    await this.page.getByText('India (भारत)').click();
    await this.page.locator('lib-country-list').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async isPersonalFormEditable() {
    const genderInput = this.genderCombobox.getByRole('combobox');
    if (!(await genderInput.isVisible({ timeout: 5000 }).catch(() => false))) {
      return false;
    }
    return genderInput.isEnabled().catch(() => false);
  }

  async preparePersonalDetailsAndOpenDocuments(
    firstName: string,
    lastName: string,
    options?: { runValidations?: boolean },
  ) {
    if (await this.isOnDocumentsPage()) {
      console.log('Already on documents page');
      return null;
    }

    await this.page.waitForTimeout(1500);
    if (await this.isOnDocumentsPage()) {
      return null;
    }

    if (await this.isPersonalFormEditable()) {
      await this.expectPersonalForm();
      if (options?.runValidations) {
        await this.expectInvalidNameRejected(firstName);
        await this.expectInvalidMobileRejected();
      }
      const profile = await this.fillMandatoryIndianDetails(firstName, lastName);
      await this.goToDocuments();
      return profile;
    }

    console.log('Personal details already saved; navigating to documents');
    await this.goToDocumentsIfNeeded();
    return null;
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
    await this.mobileInput.fill('');
    await this.mobileInput.blur();
  }

  static expectedPersonalDefaults(firstName: string) {
    const { gender, salutation } = genderSalutationForFirstName(firstName);
    return {
      gender,
      salutation,
      middleName: '',
      designation: 'Front End Developer',
    };
  }

  async fillMandatoryIndianDetails(firstName: string, lastName: string) {
    const place = CITIES[Math.floor(Math.random() * CITIES.length)];
    const mobile = randomMobile();
    const plot = Math.floor(Math.random() * 80) + 10;
    const details = {
      ...OnboardingApplicationPage.expectedPersonalDefaults(firstName),
      firstName,
      lastName,
      addressLine1: `Road no.${plot}`,
      addressLine2: `Sector ${plot}`,
      city: place.city,
      state: place.state,
      country: 'India',
      pincode: place.zip,
    };

    if (await this.firstNameInput.isVisible().catch(() => false) && await this.firstNameInput.isEnabled().catch(() => false)) {
      await this.firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
    }

    const { gender, salutation } = genderSalutationForFirstName(firstName);

    await this.selectComboboxOption(this.genderCombobox, gender);
    const salutationText = ((await this.salutationCombobox.innerText().catch(() => '')) || '').trim();
    if (!salutationText.includes(salutation)) {
      await this.selectComboboxOption(this.salutationCombobox, salutation);
    }

    await this.selectMobileCountryCode();

    await this.mobileInput.fill(mobile);
    await this.mobileInput.blur();
    await this.dobInput.fill('1998-05-15');
    await this.dobInput.blur();

    await this.selectComboboxOption(this.bloodGroupCombobox, 'B+');

    const addressLine1 = this.page.locator('#currentAddressLine1').or(this.addressLine1);
    const addressLine2 = this.page.locator('#currentAddressLine2').or(this.addressLine2);
    const cityInput = this.page.locator('#currentCity').or(this.cityInput);
    const stateInput = this.page.locator('#currentState').or(this.stateInput);
    const zipInput = this.page.locator('#currentzipCode').or(this.zipInput);
    const countryInput = this.page.getByRole('textbox', { name: 'Country*' }).first();

    await addressLine1.fill(details.addressLine1);
    await addressLine2.fill(details.addressLine2);
    await cityInput.fill(details.city);
    await stateInput.fill(details.state);
    await countryInput.fill(details.country);
    await zipInput.fill(details.pincode);
    await zipInput.blur();
    await this.sameAsCurrentAddress.check();
    return details;
  }

  async goToDocuments() {
    await expect(this.nextButton).toBeEnabled({ timeout: 30000 });
    await this.nextButton.click();
    await this.page.getByRole('row', { name: /Resume/ }).waitFor({ state: 'visible', timeout: 20000 });
  }

  async goToDocumentsIfNeeded() {
    if (await this.isOnDocumentsPage()) {
      return;
    }

    const documentsTab = this.page.getByText(/^Documents$/).first();
    if (await documentsTab.isVisible().catch(() => false)) {
      await documentsTab.click();
    }

    if (await this.nextButton.isVisible().catch(() => false)) {
      const enabled = await this.nextButton.isEnabled().catch(() => false);
      if (enabled) {
        await this.nextButton.click();
      }
    }

    await this.page.getByRole('row', { name: /Resume/ }).waitFor({ state: 'visible', timeout: 20000 });
  }

  async expectInvalidFileTypeRejected(filePath: string, documentName = 'Resume') {
    await this.openDocumentUpload(documentName);
    const scope = await this.activeUploadScope();
    await scope.getByRole('button', { name: 'Choose File' }).setInputFiles(filePath);
    await expect(scope.getByText(/only pdf and image are allowed/i).first()).toBeVisible({ timeout: 10000 });
    console.log(`File type validation: ${(await scope.getByText(/only pdf and image are allowed/i).first().innerText()).trim()}`);
    await this.closeUploadDialog();
  }

  async expectOversizedFileRejected(filePath: string, documentName = 'Resume') {
    if (!(await this.hasOpenUploadUi())) {
      await this.openDocumentUpload(documentName);
    }
    const scope = await this.activeUploadScope();
    await scope.getByRole('button', { name: 'Choose File' }).setInputFiles(filePath);
    await expect(scope.getByText(/file size should be less than 25mb|less than 25mb/i).first()).toBeVisible({ timeout: 10000 });
    console.log(`File size validation: ${(await scope.getByText(/file size should be less than 25mb|less than 25mb/i).first().innerText()).trim()}`);
    await this.closeUploadDialog();
  }

  async isOnDocumentsPage() {
    return this.page.getByRole('row', { name: /Resume/ }).isVisible({ timeout: 8000 }).catch(() => false);
  }

  async firstDocumentNeedingUpload() {
    await this.goToDocumentsIfNeeded();
    for (const name of await this.listDocumentNames()) {
      if (await this.needsUpload(name)) {
        return name;
      }
    }
    return null;
  }

  async needsUpload(documentName: string) {
    const status = await this.getDocumentRowStatus(documentName);
    if (!status) {
      return true;
    }
    return !this.isDocumentComplete(status);
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
    await this.goToDocumentsIfNeeded();
    let uploaded = 0;
    for (const name of await this.listDocumentNames()) {
      if (!(await this.needsReUpload(name)) && !(await this.needsUpload(name))) {
        continue;
      }
      await this.uploadDocument(
        name,
        this.filePathForDocument(name, pdfPath, imagePath),
        this.documentNumberForDocument(name),
        this.alternateFilePathForDocument(name, imagePath),
      );
      uploaded += 1;
    }
    if (!uploaded) {
      throw new Error('No rejected documents were available to re-upload');
    }
  }

  async uploadMissingDocuments(
    pdfPath: string,
    imagePath: string,
    perDocFiles?: Record<string, string>,
  ) {
    await this.goToDocumentsIfNeeded();
    const documentNames = await this.listDocumentNames();
    console.log(`Documents on page: ${documentNames.join(', ') || '(none found)'}`);
    if (!documentNames.length) {
      throw new Error('No onboarding document rows found on the documents page');
    }

    for (const name of documentNames) {
      const status = await this.getDocumentRowStatus(name);
      console.log(`${name} status before upload: ${status ?? '(row not found)'}`);
      if (status && this.isDocumentComplete(status)) {
        console.log(`${name} already uploaded, reusing it`);
        continue;
      }
      await this.uploadDocument(
        name,
        this.resolveFilePathForDocument(name, pdfPath, imagePath, perDocFiles),
        this.documentNumberForDocument(name),
        this.alternateFilePathForDocument(name, imagePath),
      );
    }

    for (const name of documentNames) {
      const status = await this.getDocumentRowStatus(name);
      if (!status || !this.isDocumentComplete(status)) {
        throw new Error(`${name} is still incomplete after upload attempt. Status: ${status ?? 'row not found'}`);
      }
    }
  }

  async submitAndExpectLogout(loginUsername: Locator) {
    try {
      await expect(this.submitButton).toBeEnabled({ timeout: 30000 });
    } catch (error) {
      await this.logDocumentStatuses();
      throw error;
    }
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
    await this.page.waitForTimeout(300);
  }

  private documentRow(documentName: string) {
    return this.page.getByRole('row', { name: this.documentNamePattern(documentName) }).first();
  }

  private documentNamePattern(documentName: string): RegExp {
    const normalized = documentName.trim().toLowerCase();
    if (/aadha?r/.test(normalized)) {
      return /Aadhaar|Aadhar/i;
    }
    if (/driving\s*l/.test(normalized)) {
      return /Driving\s*L[Ii]cense/i;
    }
    const escaped = documentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
  }

  private documentTableRows() {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('button', { name: /Upload|Re-Upload|Download|View/i }),
    });
  }

  private extractDocumentName(rowText: string) {
    const match = rowText.match(/^([A-Za-z][A-Za-z\s]*?)\*/);
    return match?.[1]?.trim() ?? null;
  }

  private async listDocumentNames() {
    await this.goToDocumentsIfNeeded();
    const rows = this.documentTableRows();
    const count = await rows.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      await row.scrollIntoViewIfNeeded().catch(() => {});
      const text = (await row.innerText()).replace(/\s+/g, ' ').trim();
      const name = this.extractDocumentName(text);
      if (name) {
        names.push(name);
      }
    }
    return names;
  }

  private filePathForDocument(documentName: string, pdfPath: string, imagePath: string) {
    if (/resume/i.test(documentName)) {
      return pdfPath;
    }
    return imagePath;
  }

  private resolveFilePathForDocument(
    documentName: string,
    pdfPath: string,
    imagePath: string,
    perDocFiles?: Record<string, string>,
  ) {
    if (perDocFiles) {
      const direct = perDocFiles[documentName];
      if (direct) {
        return direct;
      }
      const matchedKey = Object.keys(perDocFiles).find((key) =>
        new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(documentName),
      );
      if (matchedKey && perDocFiles[matchedKey]) {
        return perDocFiles[matchedKey];
      }
    }
    return this.filePathForDocument(documentName, pdfPath, imagePath);
  }

  private documentNumberForDocument(documentName: string) {
    return randomDocumentNumber(documentName);
  }

  private alternateFilePathForDocument(documentName: string, imagePath: string) {
    return /resume|driving\s*l/i.test(documentName) ? imagePath : undefined;
  }

  private async fillDocumentNumberIfRequired(
    scope: Locator,
    documentName: string,
    documentNumber?: string,
  ) {
    const numberInput = scope.getByRole('textbox', { name: /Document Number/i }).first();
    if (!(await numberInput.isVisible({ timeout: 3000 }).catch(() => false))) {
      return;
    }

    const value = documentNumber ?? this.documentNumberForDocument(documentName);
    if (!value) {
      return;
    }
    await numberInput.click();
    await numberInput.fill('');
    await numberInput.fill(value);
    await numberInput.blur();
    console.log(`${documentName} document number: ${value}`);
  }

  private isDocumentComplete(status: string) {
    return /Waiting for submission|Verified/i.test(status) && !/Rejected/i.test(status);
  }

  private async getDocumentRowStatus(documentName: string) {
    const row = this.documentRow(documentName);
    await row.scrollIntoViewIfNeeded().catch(() => {});
    if (!(await row.isVisible({ timeout: 5000 }).catch(() => false))) {
      return null;
    }
    return (await row.innerText()).replace(/\s+/g, ' ').trim();
  }

  private async logDocumentStatuses() {
    for (const name of await this.listDocumentNames()) {
      const status = await this.getDocumentRowStatus(name);
      console.log(`Document status - ${name}: ${status ?? '(row not found)'}`);
    }
  }

  private async hasOpenUploadUi() {
    const dialog = this.page.getByRole('dialog');
    if (await dialog.isVisible().catch(() => false)) {
      return true;
    }
    return this.page.getByRole('button', { name: 'Choose File' }).isVisible().catch(() => false);
  }

  private async activeUploadScope() {
    const uploadDialog = this.page.getByRole('dialog').filter({
      has: this.page.getByRole('button', { name: 'Choose File' }).or(this.page.locator('input[type="file"]')),
    }).last();
    if (await uploadDialog.isVisible().catch(() => false)) {
      return uploadDialog;
    }
    return this.page.locator('body');
  }

  private async openDocumentUpload(documentName: string) {
    await this.closeUploadDialog();
    await this.page.bringToFront();
    await this.goToDocumentsIfNeeded();

    const row = this.documentRow(documentName);
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible({ timeout: 10000 });

    const reUpload = row.getByRole('button', { name: /Re-Upload/i })
      .or(row.locator('button, a').filter({ hasText: /Re-Upload/i }));
    const upload = row.getByRole('button', { name: /Upload/i })
      .or(row.locator('button').filter({ hasText: /Upload/i }));

    if (await reUpload.first().isVisible().catch(() => false)) {
      await reUpload.first().click();
    } else if (await upload.first().isVisible().catch(() => false)) {
      await upload.first().click();
    } else {
      await row.getByRole('button').last().click();
    }

    const chooseFile = this.page.getByRole('button', { name: 'Choose File' })
      .or(this.page.locator('input[type="file"]'));
    await chooseFile.first().waitFor({ state: 'attached', timeout: 15000 });
  }

  private async attachUploadFile(scope: Locator, filePath: string) {
    const fileInput = scope.locator('input[type="file"]').first();
    if (await fileInput.count()) {
      await fileInput.setInputFiles(filePath);
      return;
    }
    await scope.getByRole('button', { name: 'Choose File' }).setInputFiles(filePath);
  }

  private async uploadDocument(
    documentName: string,
    filePath: string,
    documentNumber?: string,
    alternateFilePath?: string,
  ) {
    const row = this.documentRow(documentName);
    await row.scrollIntoViewIfNeeded().catch(() => {});
    const current = await this.getDocumentRowStatus(documentName);
    if (current && this.isDocumentComplete(current)) {
      console.log(`${documentName} already uploaded, reusing it`);
      return;
    }

    const candidates = [filePath, alternateFilePath].filter((value): value is string => Boolean(value));
    let lastError = 'Upload did not succeed';

    for (const candidate of candidates) {
      try {
        if (!fs.existsSync(candidate)) {
          throw new Error(`ENOENT: no such file or directory, stat '${candidate}'`);
        }
        await this.openDocumentUpload(documentName);
        const scope = await this.activeUploadScope();
        const docNum = documentNumber ?? this.documentNumberForDocument(documentName);

        // Portal expects document number first, then file, then Upload.
        await this.fillDocumentNumberIfRequired(scope, documentName, docNum);
        await this.page.waitForTimeout(500);
        await this.attachUploadFile(scope, candidate);
        await this.page.waitForTimeout(1000);

        if (!/resume/i.test(documentName)) {
          await this.fillDocumentNumberIfRequired(scope, documentName, docNum);
        }

        const note = scope.getByText(/Only Pdf and image are allowed/i);
        if (await note.isVisible().catch(() => false)) {
          await note.click().catch(() => {});
        }

        const upload = scope.getByRole('button', { name: 'Upload', exact: true });
        await expect(upload).toBeEnabled({ timeout: 15000 });
        await upload.click();

        if (await this.waitForUploadSuccess(scope, row)) {
          console.log(`Uploaded ${documentName}`);
          await this.closeUploadDialog();
          await this.page.waitForTimeout(500);
          return;
        }

        lastError = `${documentName} upload did not succeed with ${pathBasename(candidate)}`;
        await this.closeUploadDialog();
      } catch (error) {
        lastError = `${documentName} upload failed with ${pathBasename(candidate)}: ${error}`;
        await this.closeUploadDialog();
      }
    }

    const scope = await this.activeUploadScope();
    const dialogText = await scope.innerText().catch(() => '');
    throw new Error(`${lastError}. Dialog: ${dialogText.replace(/\s+/g, ' ').trim()}`);
  }

  private async waitForUploadSuccess(scope: Locator, row: Locator) {
    const deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      const scopeText = await scope.innerText().catch(() => '');
      if (/Document uploaded successfully|uploaded successfully/i.test(scopeText)) {
        return true;
      }
      if (await this.uploadedMessage.isVisible().catch(() => false)) {
        return true;
      }
      await row.scrollIntoViewIfNeeded().catch(() => {});
      const rowText = await row.innerText().catch(() => '');
      if (/Waiting for submission/i.test(rowText) && !/Rejected/i.test(rowText)) {
        return true;
      }
      await this.page.waitForTimeout(400);
    }
    return false;
  }
}

function pathBasename(filePath: string) {
  return filePath.split(/[/\\]/).pop() ?? filePath;
}
