import { expect, type Locator, type Page } from '@playwright/test';

export class PreOnboardingPostOfferPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nextButton: Locator;
  readonly submitButton: Locator;
  readonly reviewHeading: Locator;
  readonly academicAdded: Locator;
  readonly employmentAdded: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.reviewHeading = page.getByText(/^Review$/);
    this.academicAdded = page.getByText('Academic record added');
    this.employmentAdded = page.getByText('Employment history added');
  }

  async addAcademicRecordIfNeeded(attachmentPath: string) {
    if (await this.isEmergencyPage() || await this.isEmploymentPage() || await this.isReviewPage()) {
      return;
    }
    const existing = this.page.getByText(/California University|B\.TECH/i);
    if (await existing.first().isVisible().catch(() => false)
      && !(await this.page.getByRole('textbox', { name: 'University*' }).isVisible().catch(() => false))) {
      console.log('Academic record already present');
      if (await this.nextButton.isEnabled().catch(() => false)) {
        await this.nextButton.click();
      }
      return;
    }
    await this.addAcademicRecord(attachmentPath);
  }

  async fillEmergencyContactsIfNeeded() {
    if (await this.isReviewPage()) {
      return;
    }
    const name = this.page.getByRole('textbox', { name: 'Please enter name' }).first();
    const onEmergency = await name.isVisible({ timeout: 8000 }).catch(() => false);
    if (!onEmergency) {
      return;
    }
    const secondName = this.page.getByRole('textbox', { name: 'Please enter name' }).nth(1);
    const countryPending = await this.page.getByText('Select country', { exact: true }).first().isVisible().catch(() => false);
    const relationPending = await this.page.getByRole('combobox', { name: 'Please select relation' }).first().isVisible().catch(() => false);
    if (
      (await name.inputValue()).trim()
      && (await secondName.inputValue().catch(() => '')).trim()
      && !countryPending
      && !relationPending
    ) {
      console.log('Emergency contacts already filled');
      await this.nextButton.click();
      return;
    }
    await this.fillEmergencyContacts();
  }

  async addEmploymentHistoryIfNeeded(attachmentPath: string) {
    if (await this.isReviewPage()) {
      return;
    }
    if (await this.page.getByText(/SNAD/i).first().isVisible().catch(() => false)
      && !(await this.page.getByRole('textbox', { name: 'Company Name' }).isVisible().catch(() => false))) {
      console.log('Employment history already present');
      if (await this.nextButton.isEnabled().catch(() => false)) {
        await this.nextButton.click();
      }
      return;
    }
    await this.addEmploymentHistory(attachmentPath);
  }

  private async isEmergencyPage() {
    return this.page.getByRole('textbox', { name: 'Please enter name' }).first().isVisible().catch(() => false);
  }

  private async isEmploymentPage() {
    if (await this.isEmergencyPage()) {
      return false;
    }
    return (
      (await this.page.getByRole('textbox', { name: 'Company Name' }).isVisible().catch(() => false)) ||
      (await this.page.getByPlaceholder('From Date').isVisible().catch(() => false)) ||
      (await this.page.getByRole('textbox', { name: 'Job Role' }).isVisible().catch(() => false))
    );
  }

  private async isReviewPage() {
    return this.submitButton.isVisible().catch(() => false);
  }

  async addAcademicRecord(attachmentPath: string) {
    await this.addButton.click();
    await this.page.getByRole('textbox', { name: 'University*' }).waitFor({ state: 'visible', timeout: 15000 });

    await this.selectQualification('B.TECH');
    await this.page.getByRole('textbox', { name: 'University*' }).fill('California University');
    await this.page.getByRole('textbox', { name: 'Specialization*' }).fill('CSE');
    await this.page.getByRole('spinbutton', { name: 'GPA*' }).fill('7');
    await this.page.getByRole('textbox', { name: 'Start Date*' }).fill('2020-06-09');
    await this.page.getByRole('textbox', { name: 'To Date*' }).fill('2024-01-30');
    await this.uploadAttachment(attachmentPath);

    await this.addButton.click();
    await expect(this.academicAdded.first()).toBeVisible({ timeout: 15000 });
    console.log('Academic record added: B.TECH, California University, CSE, GPA 7');
    await this.nextButton.click();
  }

  async fillEmergencyContacts() {
    await this.page.getByRole('textbox', { name: 'Please enter name' }).first().waitFor({
      state: 'visible',
      timeout: 15000,
    });

    await this.fillEmergencyContact(0, {
      name: 'Ravi',
      email: 'Ravi@yopmail.com',
      mobile: '9567564564',
      relation: 'Brother',
    });
    await this.fillEmergencyContact(1, {
      name: 'Sindhu',
      email: 'Sindhu@yopmail.com',
      mobile: '8456757477',
      relation: 'Mother',
    });

    console.log('Emergency contacts: Ravi (Brother), Sindhu (Mother)');
    await this.nextButton.click();
  }

  async addEmploymentHistory(attachmentPath: string) {
    await this.addButton.click();
    await this.page.getByRole('textbox', { name: 'Company Name' }).waitFor({ state: 'visible', timeout: 15000 });
    await this.page.getByRole('textbox', { name: 'Company Name' }).fill('SNAD');
    await this.selectEmploymentType();
    await this.page.getByPlaceholder('From Date').fill('2023-01-09');
    const toDate = this.page.getByPlaceholder(/To Date|End Date/i)
      .or(this.page.getByRole('textbox', { name: /To Date/i }));
    if (await toDate.first().isVisible().catch(() => false)) {
      await toDate.first().fill('2026-01-12');
    } else {
      await this.page.getByRole('textbox').nth(2).fill('2026-01-12');
    }
    await this.page.getByRole('textbox', { name: 'Job Role' }).fill('QA');
    await this.page.getByRole('button', { name: 'Choose File' }).setInputFiles(attachmentPath);

    await this.addButton.click();
    await expect(this.employmentAdded.first()).toBeVisible({ timeout: 15000 });
    console.log('Employment history added: SNAD, QA');
    await this.nextButton.click();
  }

  async expectReviewPage() {
    await expect(this.reviewHeading.first()).toBeVisible({ timeout: 15000 });
    await expect(this.page.getByText('Offer Letter Accepted')).toBeVisible();

    const academicToggle = this.page.getByRole('button', { name: 'Academic Qualifications' });
    if (await academicToggle.isVisible().catch(() => false)) {
      await academicToggle.click();
    }
    await expect(this.page.getByText(/California University/i).first()).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText(/B\.TECH/i).first()).toBeVisible();
    await expect(this.page.getByText(/CSE/i).first()).toBeVisible();

    const employmentToggle = this.page.getByRole('heading', { name: 'Employment History' }).getByRole('button')
      .or(this.page.getByRole('button', { name: 'Employment History' }));
    if (await employmentToggle.first().isVisible().catch(() => false)) {
      await employmentToggle.first().click();
    }
    await expect(this.page.getByText(/SNAD/i).first()).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText(/QA/i).first()).toBeVisible();
    console.log('Review page verified: offer accepted, academic, employment');
  }

  async submitApplication() {
    await this.submitButton.click();
    const yes = this.page.getByRole('dialog').getByRole('button', { name: 'Yes' })
      .or(this.page.getByRole('button', { name: 'Yes' }));
    await yes.first().waitFor({ state: 'visible', timeout: 10000 });
    await yes.first().click();

    const close = this.page.getByRole('button', { name: 'Close' });
    if (await close.isVisible({ timeout: 20000 }).catch(() => false)) {
      await close.click();
    }
    console.log('Pre-onboarding application submitted');
  }

  private async selectQualification(name: string) {
    const named = this.page.getByRole('combobox', { name: /qualification|degree|education/i });
    if (await named.first().isVisible().catch(() => false)) {
      await named.first().click();
    } else {
      await this.page.getByRole('button', { name: 'dropdown trigger' }).first().click();
    }
    await this.page.getByRole('option', { name }).click();
  }

  private async selectEmploymentType() {
    await this.page.getByRole('combobox', { name: 'Please select employment type' }).click();
    const option = this.page.getByRole('option').filter({ hasNotText: /select|please/i }).first();
    const label = ((await option.innerText().catch(() => '')) || '').trim();
    await option.click();
    console.log(`Employment type: ${label || '(selected)'}`);
  }

  private async uploadAttachment(filePath: string) {
    const named = this.page.getByRole('button', { name: /Attachment/ });
    if (await named.first().isVisible().catch(() => false)) {
      await named.first().setInputFiles(filePath);
      return;
    }
    await this.page.locator('input[type="file"]').last().setInputFiles(filePath);
  }

  private async fillEmergencyContact(
    index: number,
    contact: { name: string; email: string; mobile: string; relation: string },
  ) {
    await this.page.getByRole('textbox', { name: 'Please enter name' }).nth(index).fill(contact.name);
    await this.page.getByRole('textbox', { name: 'Please enter personal email ID' }).nth(index).fill(contact.email);
    await this.selectIndiaCountryCode();
    await this.page.getByRole('spinbutton', { name: 'Please enter mobile number' }).nth(index).fill(contact.mobile);
    const relation = this.page.getByRole('combobox', { name: 'Please select relation' }).first();
    if (await relation.isVisible().catch(() => false)) {
      await relation.click();
      await this.page.getByRole('option', { name: contact.relation, exact: true }).click();
    }
  }

  private async selectIndiaCountryCode() {
    const trigger = this.page.getByText('Select country', { exact: true }).first();
    if (!(await trigger.isVisible().catch(() => false))) {
      return;
    }
    await trigger.click();
    const list = this.page.locator('lib-country-list').filter({ hasText: /Afghanistan|India/i }).first();
    const input = list.locator('input').first().or(this.page.locator('lib-country-list input').first());
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.fill('91');
    await this.page.waitForTimeout(500);
    const india = this.page.locator('lib-country-list').getByText('India (भारत)').filter({ visible: true });
    await india.first().click();
  }
}
