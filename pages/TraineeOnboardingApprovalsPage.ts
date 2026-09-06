import { expect, type Locator, type Page } from '@playwright/test';
import type { SavedTrainee } from '../tests/fixtures/lastTrainee';

export class TraineeOnboardingApprovalsPage {
  readonly page: Page;
  readonly commentsInput: Locator;
  readonly confirmMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.commentsInput = page.getByRole('textbox', { name: /comment|reason|remark/i }).first();
    this.confirmMessage = page.getByText('Are you sure you want to');
  }

  async openTraineeOfferLetters() {
    await this.page.getByText('Pending Approvals', { exact: true }).click();
    const onboarding = this.page.getByText('Onboarding', { exact: true }).first();
    if (await onboarding.isVisible({ timeout: 5000 }).catch(() => false)) {
      await onboarding.click();
    } else {
      await this.page.goto('/pending-approvals/on-boarding/trainee-approvals');
    }
    await this.page.waitForURL(/pending-approvals\/on-boarding/, { timeout: 20000 });
    const tab = this.page.getByText(/Trainee Offer Letter/i).first();
    await tab.waitFor({ state: 'visible', timeout: 20000 });
    await tab.click();
    await this.page.waitForTimeout(1500);
  }

  async rejectOffer(trainee: SavedTrainee, reason: string) {
    const row = await this.traineeRow(trainee);
    await this.openAction(row, 'Reject');
    if (await this.commentsInput.isVisible({ timeout: 8000 }).catch(() => false)) {
      await this.commentsInput.fill(reason);
    }
    await this.clickDialogButton(/Reject|Submit|Yes/i);
    await expect(this.page.getByText(/rejected|success/i).first()).toBeVisible({ timeout: 20000 });
    console.log(`Rejected trainee offer letter for ${trainee.email}`);
  }

  async approveOffer(trainee: SavedTrainee) {
    const row = await this.traineeRow(trainee);
    await this.openAction(row, 'Approve');
    if (await this.confirmMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.page.getByRole('button', { name: /Yes|Approve|Submit/i }).last().click();
    } else {
      await this.clickDialogButton(/Approve|Submit|Yes/i);
    }
    await expect(this.page.getByText(/approved|released|success/i).first()).toBeVisible({ timeout: 20000 });
    console.log(`Approved trainee offer letter for ${trainee.email}`);
  }

  private async traineeRow(trainee: SavedTrainee) {
    const row = this.page.getByRole('row').filter({
      hasText: new RegExp(`${trainee.firstName}|${trainee.email}|${trainee.employeeId ?? '___'}`, 'i'),
    }).first();
    await expect(row).toBeVisible({ timeout: 20000 });
    return row;
  }

  private async openAction(row: Locator, action: 'Reject' | 'Approve') {
    const visible = row.getByText(action, { exact: true });
    if (await visible.isVisible().catch(() => false)) {
      await visible.click();
      return;
    }
    const kebab = row.getByRole('cell').last().locator('a, button, [class*="dropdown"]').first();
    await kebab.click();
    await this.page.getByText(action, { exact: true }).last().click();
  }

  private async clickDialogButton(name: RegExp) {
    const dialog = this.page.getByRole('dialog');
    if (await dialog.isVisible().catch(() => false)) {
      await dialog.getByRole('button', { name }).last().click();
      return;
    }
    await this.page.getByRole('button', { name }).last().click();
  }
}
