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
    this.offerLetterEntry = page
      .getByRole('button', { name: /Offer Letter/i })
      .or(page.getByText('Offer Letter', { exact: true }));
    this.rejectButton = page.getByRole('button', { name: /^Reject$/ });
    this.rejectReasonInput = page.getByRole('textbox', {
      name: /Please provide reject reason|Please enter reject reason|reject reason|comment/i,
    });
    this.confirmRejectButton = page
      .getByRole('dialog')
      .getByRole('button', { name: 'Reject', exact: true })
      .or(page.locator('.p-dialog').getByRole('button', { name: 'Reject', exact: true }));
    this.rejectedMessage = page.getByText(/offer letter rejected|rejected successfully|rejected the offer/i);
    this.acceptButton = page.getByRole('button', { name: /^Accept$/ });
    this.acceptedMessage = page.getByText(/Offer letter accepted/i);
    this.nextButton = page.getByRole('button', { name: 'Next' });
  }

  async open() {
    const entry = this.offerLetterEntry.first();
    await entry.waitFor({ state: 'visible', timeout: 20000 });
    await entry.click();
    await this.waitForOfferDecisionScreen();
  }

  async reject(reason: string) {
    await this.navigateToOfferDecision();
    await this.rejectButton.first().click();

    const reasonInput = this.rejectReasonInput.first();
    await reasonInput.waitFor({ state: 'visible', timeout: 10000 });
    await reasonInput.fill(reason);

    const confirmReject = this.confirmRejectButton.first();
    if (await confirmReject.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(confirmReject).toBeEnabled({ timeout: 10000 });
      await confirmReject.click();
    } else {
      const rejectButtons = this.page.getByRole('button', { name: 'Reject', exact: true });
      const count = await rejectButtons.count();
      if (count > 1) {
        await rejectButtons.nth(count - 1).click();
      } else {
        const submit = this.page.getByRole('button', { name: /Submit|Confirm|Save/i }).first();
        await expect(submit).toBeVisible({ timeout: 10000 });
        await submit.click();
      }
    }

    const toastVisible = await this.rejectedMessage.first().isVisible({ timeout: 15000 }).catch(() => false);
    if (toastVisible) {
      console.log(`Employee reject: ${(await this.rejectedMessage.first().innerText()).trim()}`);
    } else {
      console.log('Employee offer letter reject submitted');
    }
  }

  async goToOfferDecision() {
    if (
      (await this.page.getByRole('button', { name: 'Add' }).isVisible().catch(() => false)) ||
      (await this.page.getByRole('button', { name: 'Submit' }).isVisible().catch(() => false)) ||
      (await this.page.getByRole('textbox', { name: 'Please enter name' }).first().isVisible().catch(() => false))
    ) {
      return;
    }

    await this.navigateToOfferDecision();
  }

  async navigateToOfferDecision() {
    if (await this.isOnOfferDecisionScreen()) {
      return;
    }

    if (await this.offerLetterEntry.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.offerLetterEntry.first().click();
      await this.page.waitForTimeout(1000);
      if (await this.isOnOfferDecisionScreen()) {
        return;
      }
    }

    for (let i = 0; i < 12; i += 1) {
      if (await this.isOnOfferDecisionScreen()) {
        return;
      }

      if (await this.offerLetterEntry.first().isVisible().catch(() => false)) {
        await this.offerLetterEntry.first().click();
        await this.page.waitForTimeout(1000);
        if (await this.isOnOfferDecisionScreen()) {
          return;
        }
      }

      if ((await this.nextButton.isVisible().catch(() => false)) && (await this.nextButton.isEnabled().catch(() => false))) {
        await this.nextButton.click();
        await this.page.waitForTimeout(1500);
        continue;
      }

      break;
    }

    await this.waitForOfferDecisionScreen();
  }

  async isOnOfferDecisionScreen() {
    return (
      (await this.acceptButton.first().isVisible().catch(() => false)) ||
      (await this.rejectButton.first().isVisible().catch(() => false))
    );
  }

  async waitForOfferDecisionScreen() {
    await this.rejectButton.or(this.acceptButton).first().waitFor({ state: 'visible', timeout: 20000 });
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
    const yes = this.page
      .getByRole('dialog')
      .getByRole('button', { name: 'Yes' })
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
