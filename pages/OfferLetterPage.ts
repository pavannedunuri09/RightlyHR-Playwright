import { expect, type Locator, type Page } from '@playwright/test';

export class OfferLetterPage {
  readonly page: Page;
  readonly generateDocumentsButton: Locator;
  readonly offerLetterCard: Locator;
  readonly employeeCombobox: Locator;
  readonly employeeSearch: Locator;
  readonly personalEmailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressCombobox: Locator;
  readonly salaryInput: Locator;
  readonly variablePayCombobox: Locator;
  readonly variableAmountInput: Locator;
  readonly offerIssuedDate: Locator;
  readonly expectedStartDate: Locator;
  readonly offerExpiryDate: Locator;
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
    this.offerLetterCard = page.locator('div').filter({ hasText: /^Offer Letter$/ }).first();
    this.employeeCombobox = page.getByRole('combobox', { name: /Please select employee/i });
    this.employeeSearch = page.getByRole('searchbox', { name: /Search employee|Select employee/i });
    this.personalEmailInput = page.getByRole('textbox', { name: 'Personal email ID' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    this.addressCombobox = page.getByRole('combobox', { name: 'Please select address' });
    this.salaryInput = page.getByRole('spinbutton', { name: 'Please enter salary' });
    this.variablePayCombobox = page.getByRole('combobox', { name: /Please select variable pay|Variable Pay/i });
    this.variableAmountInput = page.getByRole('textbox', { name: 'Please enter variable amount' });
    this.offerIssuedDate = page.getByPlaceholder('Please enter offer issued date');
    this.expectedStartDate = page.getByPlaceholder(/Please enter expected start date/i);
    this.offerExpiryDate = page.getByPlaceholder('Please enter offer expiry date');
    this.documentTypeCombobox = page.getByRole('combobox', { name: 'Please select document type' });
    this.signatureAuthorityCombobox = page.getByRole('combobox', { name: 'Please select signature authority' });
    this.noteInput = page.getByRole('textbox', { name: 'Please enter note' });
    this.generateButton = page.getByRole('button', { name: /Regenerate Offer Letter|Generate Offer Letter/ });
    this.requestApprovalButton = page.getByRole('button', { name: 'Request For Approval' });
    this.generatedToast = page.getByText(/Offer letter generated/i);
    this.approvalToast = page.getByText('Approval request sent');
    this.expiryError = page.getByText('Offer Expiry Date should be');
  }

  async openFromList() {
    await this.generateDocumentsButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.generateDocumentsButton.click();
    await this.offerLetterCard.waitFor({ state: 'visible', timeout: 15000 });
    await this.offerLetterCard.click();
    await this.employeeCombobox.waitFor({ state: 'visible', timeout: 20000 });
  }

  async selectEmployee(firstName: string, lastName: string, email?: string, employeeId?: string) {
    await this.openEmployeePicker();

    const queries = [employeeId, email, `${firstName} ${lastName}`, firstName, lastName]
      .filter((value): value is string => Boolean(value && value.trim()));
    const nameRe = new RegExp(`${escapeRegExp(firstName)}[\\s\\S]*${escapeRegExp(lastName)}`, 'i');

    for (const query of queries) {
      const search = this.employeeSearch
        .or(this.page.locator('.p-select-overlay input, .p-dropdown-panel input, [role="searchbox"]').last())
        .first();
      await search.waitFor({ state: 'visible', timeout: 10000 });
      await search.fill('');
      await search.fill(query);
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

    throw new Error(`Employee ${firstName} ${lastName} was not found in Offer Letter search`);
  }

  async fillRequiredDetails() {
    await this.selectAddress();
    await this.salaryInput.scrollIntoViewIfNeeded();
    await this.salaryInput.fill('400000');

    await this.ensureComboSelected('Variable Pay*', 'No');
    if (await this.variableAmountNeeded()) {
      await this.variableAmountInput.fill('0');
    }
    await this.ensureComboSelected('Shift*', /[A-Za-z]/);

    const issued = isoDate(0);
    await this.fillDateField(this.offerIssuedDate, issued);
    await this.fillDateField(this.expectedStartDate, issued);
    await this.fillDateField(this.offerExpiryDate, isoDate(14));
    if (await this.expiryError.isVisible().catch(() => false)) {
      await this.fillDateField(this.offerExpiryDate, isoDate(21));
    }

    await this.ensureComboSelected('Reporting Manager *', /Bhavitha Reddy|SD302130/, 'bhav');
    await this.ensureComboSelected('Document Type *', 'Soft Copy');
    if (await this.noteInput.isVisible().catch(() => false)) {
      await this.noteInput.fill('Employee Offer letter');
    }
    await this.ensureComboSelected('Signature Authority Name*', /Pavan|Tejaa|saii/i, 'pavan');

    console.log(`Shift: ${((await this.comboForLabel('Shift*').innerText().catch(() => '')) || '').trim()}`);
    console.log(`Manager: ${((await this.comboForLabel('Reporting Manager *').innerText().catch(() => '')) || '').trim()}`);
    console.log(`Document type: ${((await this.comboForLabel('Document Type *').innerText().catch(() => '')) || '').trim()}`);
    console.log(`Signature: ${((await this.comboForLabel('Signature Authority Name*').innerText().catch(() => '')) || '').trim()}`);

    await this.fillEmptyRequiredCombos();
    if (!(await this.generateButton.isEnabled().catch(() => false))) {
      await this.fillEmptyRequiredCombos();
      await this.fillDateField(this.offerIssuedDate, issued);
      await this.fillDateField(this.expectedStartDate, issued);
      await this.fillDateField(this.offerExpiryDate, isoDate(21));
    }

    await expect(this.generateButton).toBeEnabled({ timeout: 30000 });
  }

  async generateOfferLetter(downloadPath?: string) {
    await expect(this.generateButton).toBeEnabled({ timeout: 15000 });
    const downloadPromise = this.page.waitForEvent('download', { timeout: 45000 }).catch(() => null);
    await this.generateButton.click();
    const confirmYes = this.page.getByRole('dialog').getByRole('button', { name: 'Yes' });
    if (await confirmYes.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmYes.click();
    }
    await expect(this.generatedToast).toBeVisible({ timeout: 60000 });
    const text = (await this.generatedToast.innerText()).trim();
    console.log(`Generate success: ${text}`);

    const download = await downloadPromise;
    if (download && downloadPath) {
      await download.saveAs(downloadPath);
    }

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

  private async openEmployeePicker() {
    for (let attempt = 0; attempt < 3; attempt++) {
      await this.closeOpenOverlays();
      await this.employeeCombobox.click();
      const search = this.employeeSearch.or(this.page.locator('.p-select-overlay input, .p-dropdown-panel input, [role="searchbox"]').last());
      if (await search.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await search.first().click();
        return;
      }
    }
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
    const compact = label.replace(/\s+\*/g, '*');
    const labelNode = this.page.getByText(label, { exact: true })
      .or(this.page.getByText(compact, { exact: true }));
    const selectSibling = labelNode.first().locator(
      'xpath=following-sibling::*[self::p-select or .//p-select or .//*[@role="combobox"] or contains(@class,"p-select") or contains(@class,"p-dropdown")][1]',
    );
    return selectSibling.or(labelNode.first().locator('xpath=..')).first();
  }

  private comboForLabel(label: string) {
    const fieldCombo = this.fieldAfterLabel(label).getByRole('combobox');
    if (label.includes('Reporting Manager')) {
      return fieldCombo.or(this.page.getByRole('combobox', { name: /Please select reporting manager/i })).first();
    }
    if (label.includes('Document Type')) {
      return fieldCombo.or(this.documentTypeCombobox).first();
    }
    if (label.includes('Signature Authority')) {
      return fieldCombo.or(this.signatureAuthorityCombobox).first();
    }
    if (label.includes('Variable Pay')) {
      return fieldCombo.or(this.variablePayCombobox).first();
    }
    if (/^Shift/i.test(label)) {
      return fieldCombo.or(this.page.getByRole('combobox', { name: /Please select Shift/i })).first();
    }
    return fieldCombo.first();
  }

  private async chooseAfterLabel(label: string, optionName: string | RegExp, search?: string) {
    const field = this.fieldAfterLabel(label);
    const combo = this.comboForLabel(label);
    if (!(await combo.isVisible().catch(() => false))) {
      return;
    }

    for (let attempt = 0; attempt < 3; attempt++) {
      await this.closeOpenOverlays();
      await combo.scrollIntoViewIfNeeded();
      const trigger = field.getByRole('button', { name: 'dropdown trigger' }).or(combo.locator('xpath=..').getByRole('button', { name: 'dropdown trigger' }));
      if (await trigger.first().isVisible().catch(() => false)) {
        await trigger.first().click();
      } else {
        await combo.click();
      }

      const opened = await this.selectPanelVisible().catch(() => false);
      if (!opened) {
        await combo.click({ force: true }).catch(() => {});
      }

      const listbox = this.page.getByRole('listbox').last();
      const panelReady = await listbox.isVisible({ timeout: 4000 }).catch(() => false)
        || await this.page.getByRole('option').first().isVisible({ timeout: 2000 }).catch(() => false);
      if (!panelReady) {
        continue;
      }

      if (search) {
        const filter = this.page.getByRole('searchbox').last();
        if (await filter.isVisible({ timeout: 2000 }).catch(() => false)) {
          await filter.fill(search);
          await this.page.waitForTimeout(800);
        }
      }

      const option = typeof optionName === 'string'
        ? this.page.getByRole('option', { name: optionName, exact: true })
        : this.page.getByRole('option').filter({ hasText: optionName });
      const choice = option.last();
      if (await choice.isVisible({ timeout: 3000 }).catch(() => false)) {
        await choice.click();
        await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        return;
      }

      const fallback = this.page.getByRole('option').filter({ hasNotText: /please select/i }).first();
      if (await fallback.isVisible({ timeout: 2000 }).catch(() => false)) {
        await fallback.click();
        await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        return;
      }
    }

    console.log(`${label} dropdown did not yield an option; continuing to fill remaining fields`);
  }

  private async closeOpenOverlays() {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
    await this.page.locator('.p-select-overlay, .p-dropdown-panel, .p-connected-overlay').waitFor({
      state: 'hidden',
      timeout: 2000,
    }).catch(() => {});
  }

  private async variableAmountNeeded() {
    const amount = this.variableAmountInput;
    if (!(await amount.isVisible().catch(() => false))) {
      return false;
    }
    if (await amount.isDisabled().catch(() => false)) {
      return false;
    }
    const current = (await amount.inputValue().catch(() => '')).trim();
    return !current;
  }

  private async selectPanelVisible() {
    return (
      (await this.page.getByRole('listbox').last().isVisible().catch(() => false)) ||
      (await this.page.locator('.p-select-overlay, .p-dropdown-panel').last().isVisible().catch(() => false)) ||
      (await this.page.getByRole('option').first().isVisible().catch(() => false)) ||
      (await this.page.getByRole('searchbox').last().isVisible().catch(() => false))
    );
  }

  private async fillDateField(field: Locator, value: string) {
    await this.closeOpenOverlays();
    await field.scrollIntoViewIfNeeded();
    await field.waitFor({ state: 'visible', timeout: 10000 });
    await field.click({ force: true });
    await field.fill(value);
    await field.press('Tab').catch(() => field.blur());
  }

  private async ensureComboSelected(label: string, optionName: string | RegExp, search?: string) {
    const combo = this.comboForLabel(label);
    if (!(await combo.isVisible().catch(() => false))) {
      return;
    }
    const text = ((await combo.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    const matches = typeof optionName === 'string'
      ? text.toLowerCase().includes(optionName.toLowerCase())
      : optionName.test(text);
    if (matches && text && !/please select/i.test(text)) {
      return;
    }
    await this.chooseAfterLabel(label, optionName, search);
  }

  private async fillEmptyRequiredCombos() {
    for (let attempt = 0; attempt < 8; attempt++) {
      await this.closeOpenOverlays();
      const combo = this.page.getByRole('combobox')
        .filter({ hasText: /please select/i })
        .filter({ hasNotText: /employee/i })
        .first();
      if (!(await combo.isVisible().catch(() => false))) {
        return;
      }

      const current = ((await combo.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      console.log(`Empty combo: ${current}`);
      await combo.scrollIntoViewIfNeeded();
      await combo.click();

      let search: string | undefined;
      let option: RegExp = /^(?!Please select).+/i;
      if (/reporting manager/i.test(current)) {
        search = 'bhav';
        option = /Bhavitha Reddy|SD302130/;
      } else if (/document type/i.test(current)) {
        option = /Soft Copy|Hard Copy/;
      } else if (/signature/i.test(current)) {
        search = 'pavan';
        option = /Pavan|Tejaa|saii/i;
      } else if (/shift/i.test(current)) {
        option = /General Shift/;
      } else if (/variable pay/i.test(current)) {
        option = /^No$/;
      } else if (/\bpf\b/i.test(current)) {
        option = /^Yes$/;
      } else if (/address/i.test(current)) {
        option = /Current Address|Permanent Address/;
      }

      if (search) {
        const filter = this.page.getByRole('searchbox').last();
        if (await filter.isVisible({ timeout: 2000 }).catch(() => false)) {
          await filter.fill(search);
          await this.page.waitForTimeout(800);
        }
      }

      const choice = this.page.getByRole('option').filter({ hasText: option })
        .filter({ hasNotText: /please select/i }).first();
      if (await choice.isVisible({ timeout: 4000 }).catch(() => false)) {
        console.log(`Selecting ${current} -> ${(await choice.innerText()).replace(/\s+/g, ' ').trim()}`);
        await choice.click();
      } else {
        const fallback = this.page.getByRole('option').filter({ hasNotText: /please select/i }).first();
        if (await fallback.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log(`Fallback ${current} -> ${(await fallback.innerText()).replace(/\s+/g, ' ').trim()}`);
          await fallback.click();
        } else {
          console.log(`No option found for ${current}`);
          await this.page.keyboard.press('Escape').catch(() => {});
          return;
        }
      }
      await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 4000 }).catch(() => {});
    }
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
