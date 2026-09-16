import { expect, type Locator, type Page } from '@playwright/test';

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
    this.verifiedToast = page.getByText(/Document verified successfully|Document approved successfully|approved successfully/i);
    this.rejectedToast = page.getByText('Document rejected successfully');
    this.confirmMessage = page.getByText('Are you sure you want to');
    this.yesButton = page.getByRole('button', { name: 'Yes' });
    this.rejectReasonInput = page.getByRole('textbox', { name: /Please provide reason for rejection|Please enter reject reason/i });
    this.rejectButton = page.getByRole('dialog').getByRole('button', { name: /^(Submit|Reject)$/ });
    this.reRequestButton = page.getByRole('button', { name: 'Re-Request Documents' });
    this.reRequestComments = page.getByRole('textbox', { name: /Leave a comment here|Please enter comments/i });
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
    await this.page.getByText(/Aadhar|Aadhaar|Resume|PAN|Driving/i).first().waitFor({
      state: 'visible',
      timeout: 20000,
    });
  }

  async verifyPendingDocuments() {
    const names = await this.listDocumentNames();
    if (!names.length) {
      throw new Error('No onboarding document rows found on the HR documents page');
    }
    for (const documentName of names) {
      await this.verifyDocumentIfNeeded(documentName);
    }
  }

  async hasRejectableDocument() {
    for (const documentName of await this.listDocumentNames()) {
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
    const names = await this.listDocumentNames();
    if (!names.length) {
      const tableText = (await this.page.locator('table, [role="table"]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      throw new Error(`No onboarding document rows found to reject. Table: ${tableText}`);
    }
    console.log(`HR documents on page: ${names.join(', ')}`);

    for (const documentName of names) {
      const row = this.documentRow(documentName);
      await row.scrollIntoViewIfNeeded().catch(() => {});
      if (!(await row.isVisible({ timeout: 5000 }).catch(() => false))) {
        continue;
      }
      const text = await row.innerText();
      if (/rejected/i.test(text) && !/waiting for verification/i.test(text)) {
        console.log(`${documentName} already rejected`);
        return documentName;
      }
    }

    for (const documentName of names) {
      const row = this.documentRow(documentName);
      await row.scrollIntoViewIfNeeded().catch(() => {});
      if (!(await row.isVisible({ timeout: 5000 }).catch(() => false))) {
        continue;
      }
      const text = await row.innerText();
      if (/verified/i.test(text) && !/waiting for verification/i.test(text)) {
        continue;
      }
      await this.rejectDocument(documentName, reason);
      return documentName;
    }

    throw new Error(`No document is available to reject. Found: ${names.join(', ')}`);
  }

  async rejectDocument(documentName: string, reason: string) {
    const row = this.documentRow(documentName);
    await row.scrollIntoViewIfNeeded();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await this.openRowAction(row, 'Reject');
    await this.rejectReasonInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.rejectReasonInput.fill(reason);
    await expect(this.rejectButton).toBeEnabled({ timeout: 10000 });
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
    const submit = this.page.getByRole('dialog').getByRole('button', { name: 'Submit' });
    await expect(submit).toBeEnabled({ timeout: 10000 });
    await submit.click();
    await expect(this.emailSentToast).toBeVisible({ timeout: 15000 });
    const text = (await this.emailSentToast.innerText()).trim();
    console.log(`Re-request popup: ${text}`);
    await this.emailSentToast.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    return text;
  }

  async verifyDocumentIfNeeded(documentName: string) {
    const row = this.documentRow(documentName);
    await row.scrollIntoViewIfNeeded();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    const text = await row.innerText();

    if (/waiting for submission/i.test(text)) {
      throw new Error(`${documentName} is still waiting for submission`);
    }
    if (/rejected/i.test(text) && !/submitted|waiting for verification/i.test(text)) {
      console.log(`${documentName} is rejected; skipping verify`);
      return;
    }
    if (/verified|approved/i.test(text) && !/waiting for verification|submitted/i.test(text)) {
      console.log(`${documentName} already verified`);
      return;
    }

    await this.openRowAction(row, 'Verify');
    const confirm = this.confirmMessage.or(this.page.getByText(/Are you sure|approve this document|verify this document/i));
    if (await confirm.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      const yes = this.yesButton.or(this.page.getByRole('dialog').getByRole('button', { name: /^(Yes|Approve|Verify|Submit)$/ }));
      await yes.first().click();
    }
    await expect(this.verifiedToast.first()).toBeVisible({ timeout: 15000 });
    console.log(`Verified ${documentName}`);
    await this.verifiedToast.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
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

  private documentRow(documentName: string) {
    return this.page.getByRole('row', { name: this.documentNamePattern(documentName) }).first();
  }

  private extractDocumentName(rowText: string) {
    const match = rowText.match(/Aadhaar|Aadhar|Resume|PAN|Driving\s*L[Ii]cense/i);
    return match?.[0]?.replace(/\s+/g, ' ').trim() ?? null;
  }

  private async listDocumentNames() {
    const rows = this.page.getByRole('row');
    const count = await rows.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      await row.scrollIntoViewIfNeeded().catch(() => {});
      const text = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      if (/document type/i.test(text)) {
        continue;
      }
      const name = this.extractDocumentName(text);
      if (name && !names.some((existing) => existing.toLowerCase() === name.toLowerCase())) {
        names.push(name);
      }
    }
    return names;
  }

  private async openRowAction(row: Locator, action: 'Verify' | 'Reject') {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.getByRole('listitem').filter({ hasText: /Approve|Reject|Verify/i }).first()
      .waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});

    const kebab = row.getByRole('cell').last().locator('a, [class*="dropdown"]').first();
    await kebab.scrollIntoViewIfNeeded();
    await kebab.click();

    const label = action === 'Verify' ? /Approve|Verify/i : /Reject/i;
    const menuItem = row.getByRole('listitem').filter({ hasText: label })
      .or(this.page.getByRole('listitem').filter({ hasText: label }));
    await expect(menuItem.first()).toBeVisible({ timeout: 8000 });
    await menuItem.first().click();
  }
}
