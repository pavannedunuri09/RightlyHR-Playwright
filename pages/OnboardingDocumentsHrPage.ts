import { expect, type Locator, type Page } from '@playwright/test';

const DOCUMENTS = ['Resume', 'PAN', 'Aadhaar'] as const;

export class OnboardingDocumentsHrPage {
  readonly page: Page;
  readonly jobTab: Locator;
  readonly verifiedToast: Locator;
  readonly rejectedToast: Locator;
  readonly confirmMessage: Locator;
  readonly yesButton: Locator;
  readonly rejectReasonInput: Locator;
  readonly rejectButton: Locator;
  readonly reRequestButton: Locator;
  readonly reRequestComments: Locator;
  readonly emailSentToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.jobTab = page.getByText('Job', { exact: true });
    this.verifiedToast = page.getByText('Document verified successfully');
    this.rejectedToast = page.getByText('Document rejected successfully');
    this.confirmMessage = page.getByText('Are you sure you want to');
    this.yesButton = page.getByRole('button', { name: 'Yes' });
    this.rejectReasonInput = page.getByRole('textbox', { name: 'Please enter reject reason' });
    this.rejectButton = page.getByRole('dialog').getByRole('button', { name: 'Reject' });
    this.reRequestButton = page.getByRole('button', { name: 'Re-Request Documents' });
    this.reRequestComments = page.getByRole('textbox', { name: 'Please enter comments' });
    this.emailSentToast = page.getByText('Email has been sent');
  }

  async openFromProfile() {
    await this.jobTab.waitFor({ state: 'visible', timeout: 20000 });
    await this.jobTab.click();

    const docs = this.page.getByText('Onboarding Documents', { exact: true });
    await docs.first().waitFor({ state: 'visible', timeout: 15000 });
    const count = await docs.count();
    await (count > 1 ? docs.nth(1) : docs.first()).click();

    await this.page.getByRole('columnheader', { name: 'Document Type' }).waitFor({
      state: 'visible',
      timeout: 20000,
    });
  }

  async verifyPendingDocuments() {
    for (const documentName of DOCUMENTS) {
      await this.verifyDocumentIfNeeded(documentName);
    }
  }

  async hasRejectableDocument() {
    for (const documentName of DOCUMENTS) {
      const row = this.documentRow(documentName);
      if (!(await row.isVisible().catch(() => false))) {
        continue;
      }
      const text = await row.innerText();
      if (/waiting for verification|VerifyReject|Verify\s*Reject/i.test(text)) {
        return true;
      }
      if (/rejected/i.test(text) && !/verified/i.test(text)) {
        return true;
      }
      if (await row.locator('.dropdown > a, .dropdown.ng-star-inserted').first().isVisible().catch(() => false)) {
        return true;
      }
      if (await row.getByRole('cell').filter({ hasText: /Verify|Reject/ }).first().isVisible().catch(() => false)) {
        return true;
      }
    }
    return false;
  }

  async rejectOneDocument(reason: string) {
    for (const documentName of DOCUMENTS) {
      const row = this.documentRow(documentName);
      await row.waitFor({ state: 'visible', timeout: 15000 });
      const text = await row.innerText();
      if (/rejected/i.test(text) && !/waiting for verification/i.test(text)) {
        console.log(`${documentName} already rejected`);
        return documentName;
      }
    }

    for (const documentName of DOCUMENTS) {
      const row = this.documentRow(documentName);
      const text = await row.innerText();
      if (/verified/i.test(text) && !/waiting for verification/i.test(text)) {
        continue;
      }
      await this.rejectDocument(documentName, reason);
      return documentName;
    }

    throw new Error('No document is available to reject');
  }

  async rejectDocument(documentName: string, reason: string) {
    const row = this.documentRow(documentName);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await this.openRowAction(row, 'Reject');
    await this.rejectReasonInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.rejectReasonInput.fill(reason);
    await this.rejectButton.click();
    await expect(this.rejectedToast).toBeVisible({ timeout: 15000 });
    console.log(`Rejected ${documentName}: ${reason}`);
    await this.rejectedToast.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async reRequestDocuments(comments: string) {
    await expect(this.reRequestButton).toBeVisible({ timeout: 15000 });
    await this.reRequestButton.click();
    await this.reRequestComments.waitFor({ state: 'visible', timeout: 10000 });
    await this.reRequestComments.fill(comments);
    await this.page.getByRole('dialog').getByRole('button', { name: 'Submit' }).click();
    await expect(this.emailSentToast).toBeVisible({ timeout: 15000 });
    const text = (await this.emailSentToast.innerText()).trim();
    console.log(`Re-request popup: ${text}`);
    await this.emailSentToast.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    return text;
  }

  async verifyDocumentIfNeeded(documentName: string) {
    const row = this.documentRow(documentName);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    const text = await row.innerText();

    if (/waiting for submission/i.test(text)) {
      throw new Error(`${documentName} is still waiting for submission`);
    }
    if (/verified/i.test(text) && !/waiting for verification/i.test(text)) {
      console.log(`${documentName} already verified`);
      return;
    }

    await this.openRowAction(row, 'Verify');
    await expect(this.confirmMessage).toBeVisible({ timeout: 10000 });
    await this.yesButton.click();
    await expect(this.verifiedToast).toBeVisible({ timeout: 15000 });
    console.log(`Verified ${documentName}`);
    await this.verifiedToast.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  private documentRow(documentName: string) {
    return this.page.getByRole('row').filter({ hasText: documentName }).first();
  }

  private async openRowAction(row: Locator, action: 'Verify' | 'Reject') {
    const dropdown = row.locator('.dropdown > a, .dropdown.ng-star-inserted').first();
    const actionCell = row.getByRole('cell').filter({ hasText: new RegExp(action) }).first();

    if (await dropdown.isVisible().catch(() => false)) {
      await dropdown.click();
    } else {
      await actionCell.click();
    }

    const menuItem = this.page
      .locator('.dropdown-menu.show, .dropdown-menu')
      .getByText(action, { exact: true })
      .last();
    if (await menuItem.isVisible({ timeout: 5000 }).catch(() => false)) {
      await menuItem.click();
      return;
    }

    await this.page.getByText(action, { exact: true }).last().click();
  }
}
