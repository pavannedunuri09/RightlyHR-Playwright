import { expect, type Locator, type Page } from '@playwright/test';

export class PreOnboardingOfferLetterPage {
  readonly page: Page;
  readonly offerLetterEntry: Locator;
  readonly rejectButton: Locator;
  readonly rejectReasonInput: Locator;
  readonly confirmRejectButton: Locator;
  readonly rejectedMessage: Locator;
  readonly acceptButton: Locator;
  readonly acceptedMessage: Locator;
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.offerLetterEntry = page.getByRole('button', { name: /Offer Letter/ }).or(page.getByText('Offer Letter', { exact: true }));
    this.rejectButton = page.getByRole('button', { name: /^Reject$/ });
    this.rejectReasonInput = page.getByRole('textbox', { name: /reject reason|reason|comment/i }).first();
    this.confirmRejectButton = page.getByRole('dialog').getByRole('button', { name: 'Reject' });
    this.rejectedMessage = page.getByText(/offer letter rejected|rejected successfully|rejected the offer/i);
    this.acceptButton = page.getByRole('button', { name: /^Accept$/ });
    this.acceptedMessage = page.getByText(/Offer letter accepted/i);
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async open() {
    const entry = this.offerLetterEntry.first();
    await entry.waitFor({ state: 'visible', timeout: 20000 });
    await entry.click();
    await this.rejectButton.or(this.page.getByRole('button', { name: /Accept/ })).first().waitFor({
      state: 'visible',
      timeout: 20000,
    });
  }

  async reject(reason: string) {
    await this.rejectButton.click();
    await this.rejectReasonInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.rejectReasonInput.fill(reason);

    if (await this.confirmRejectButton.isVisible().catch(() => false)) {
      await expect(this.confirmRejectButton).toBeEnabled({ timeout: 10000 });
      await this.confirmRejectButton.click();
    } else {
      await this.page.getByRole('button', { name: 'Reject' }).last().click();
    }

    const toastVisible = await this.rejectedMessage.first().isVisible({ timeout: 15000 }).catch(() => false);
    if (toastVisible) {
      console.log(`Employee reject: ${(await this.rejectedMessage.first().innerText()).trim()}`);
    } else {
      console.log('Employee offer letter reject submitted');
    }
  }

  async goToOfferDecision() {
    for (let i = 0; i < 8; i++) {
      if (await this.acceptButton.isVisible().catch(() => false)
        || await this.rejectButton.isVisible().catch(() => false)) {
        return;
      }
      if (await this.page.getByRole('textbox', { name: 'Please enter name' }).first().isVisible().catch(() => false)) {
        return;
      }
      if (await this.page.getByRole('button', { name: 'Add' }).isVisible().catch(() => false)) {
        return;
      }
      if (await this.page.getByRole('button', { name: 'Submit' }).isVisible().catch(() => false)) {
        return;
      }
      if (await this.nextButton.isVisible().catch(() => false) && (await this.nextButton.isEnabled().catch(() => false))) {
        await this.nextButton.click();
        await this.page.waitForTimeout(1000);
        continue;
      }
      break;
    }
  }

  async acceptIfNeeded() {
    if (!(await this.acceptButton.isVisible().catch(() => false))) {
      console.log('Offer letter already accepted; continuing remaining steps');
      return;
    }
    await this.accept();
    await this.continueAfterAccept();
  }

  async accept() {
    await this.acceptButton.click();
    const yes = this.page.getByRole('dialog').getByRole('button', { name: 'Yes' })
      .or(this.page.getByRole('button', { name: 'Yes' }));
    await yes.first().waitFor({ state: 'visible', timeout: 10000 });
    await yes.first().click();
    await expect(this.acceptedMessage.first()).toBeVisible({ timeout: 15000 });
    console.log(`Employee accept: ${(await this.acceptedMessage.first().innerText()).trim()}`);
  }

  async continueAfterAccept() {
    await this.nextButton.click();
  }
}
