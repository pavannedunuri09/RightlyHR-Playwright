import fs from 'fs';
import { expect, type Locator, type Page } from '@playwright/test';

type OfferTrainee = {
  firstName: string;
  lastName: string;
  employeeId?: string;
  designation?: string;
};

export class PendingTraineeOfferApprovalPage {
  readonly page: Page;
  readonly pendingApprovalsNav: Locator;
  readonly pendingApprovalsToggle: Locator;
  readonly onboardingTab: Locator;
  readonly traineeOfferLetterTab: Locator;
  readonly forYouTab: Locator;
  readonly forYourRoleTab: Locator;
  readonly rejectReasonInput: Locator;
  readonly rejectButton: Locator;
  readonly rejectedToast: Locator;
  readonly approvedToast: Locator;
  readonly releasedToast: Locator;
  readonly searchbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pendingApprovalsNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Pending Approvals' });
    this.pendingApprovalsToggle = this.pendingApprovalsNav.locator('[data-bs-toggle="dropdown"]');
    this.onboardingTab = page.getByText('Onboarding', { exact: true });
    this.traineeOfferLetterTab = page.getByText('Trainee Offer Letter', { exact: true });
    this.forYouTab = page.getByRole('link', { name: /For You \(\d+\)/ });
    this.forYourRoleTab = page.getByRole('link', { name: /For Your Role \(\d+\)/ });
    this.rejectReasonInput = page.getByRole('textbox', { name: 'Please provide reject reason' });
    this.rejectButton = page.getByRole('dialog').getByRole('button', { name: 'Reject', exact: true });
    this.rejectedToast = page.getByText(/Trainee offer letter rejected/i);
    this.approvedToast = page.getByText(/Trainee Offer approved/i);
    this.releasedToast = page.getByText(/Intern offer letter released|offer letter released/i);
    this.searchbox = page.getByRole('searchbox', { name: 'Username' });
  }

  async openTraineeOfferLetterQueue() {
    await this.pendingApprovalsToggle.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForTimeout(2000);
    await this.pendingApprovalsToggle.click();

    const onboarding = this.page.locator('app-pending-approvals-tabs .grid-item, .grid-item').filter({ hasText: /Onboarding/ }).first();
    if (await onboarding.isVisible({ timeout: 8000 }).catch(() => false)) {
      await onboarding.click();
    } else {
      await this.onboardingTab.first().waitFor({ state: 'visible', timeout: 15000 });
      await this.onboardingTab.first().click();
    }

    const offerLetterItem = this.page.getByRole('listitem').filter({ hasText: 'Trainee Offer Letter' }).first();
    await offerLetterItem.waitFor({ state: 'visible', timeout: 15000 });
    await offerLetterItem.click();
    await this.page.waitForURL(/pending-approvals/i, { timeout: 15000 }).catch(() => {});
    await this.page.getByRole('columnheader', { name: 'Action' }).waitFor({ state: 'visible', timeout: 20000 });
  }

  offerRow(trainee: OfferTrainee) {
    const fullName = `${trainee.firstName} ${trainee.lastName}`;
    return this.page.getByRole('row').filter({ hasText: fullName }).first();
  }

  async findOfferRow(trainee: OfferTrainee) {
    const row = await this.findOfferRowOrNull(trainee);
    if (!row) {
      throw new Error(`No pending Trainee Offer Letter found for ${trainee.firstName} ${trainee.lastName}.`);
    }
    return row;
  }

  async findOfferRowOrNull(trainee: OfferTrainee) {
    if (await this.searchbox.isVisible().catch(() => false)) {
      await this.searchbox.fill('');
      await this.searchbox.press('Enter');
      await this.page.waitForTimeout(1000);
    }

    let row = this.offerRow(trainee);
    if (await row.isVisible({ timeout: 8000 }).catch(() => false)) {
      return row;
    }

    const queries = [trainee.employeeId, trainee.firstName].filter((value): value is string => Boolean(value));
    for (const query of queries) {
      if (!(await this.searchbox.isVisible().catch(() => false))) {
        break;
      }
      await this.searchbox.fill(query);
      await this.searchbox.press('Enter');
      await this.page.waitForTimeout(1500);
      row = this.offerRow(trainee);
      if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
        return row;
      }
    }

    if (await this.forYourRoleTab.isVisible().catch(() => false)) {
      await this.forYourRoleTab.click();
      await this.page.waitForTimeout(1000);
      row = this.offerRow(trainee);
      if (await row.isVisible({ timeout: 8000 }).catch(() => false)) {
        return row;
      }
    }

    if (await this.forYouTab.isVisible().catch(() => false)) {
      await this.forYouTab.click();
      await this.page.waitForTimeout(1000);
      row = this.offerRow(trainee);
      if (await row.isVisible({ timeout: 8000 }).catch(() => false)) {
        return row;
      }
    }

    return null;
  }

  async expectTraineeDetails(row: Locator, trainee: OfferTrainee) {
    const fullName = `${trainee.firstName} ${trainee.lastName}`;
    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText(fullName);
    await expect(row).toContainText(trainee.designation ?? 'Front End Developer');
    await expect(row).toContainText('Hyderabad');
    await expect(row).toContainText('Jai Hind Enclave');
    await expect(row).toContainText('Waiting For Approval');
    await expect(row).toContainText(/Offer Letter Generated|Offer Letter Regenerated/i);

    console.log(`Pending offer row: ${(await row.innerText()).replace(/\s+/g, ' ').trim()}`);
  }

  async downloadAndVerifyLetter(row: Locator, trainee: OfferTrainee, downloadPath: string) {
    await this.openKebab(row);

    const resultPromise = Promise.race([
      this.page.waitForEvent('download', { timeout: 20000 }).then((download) => ({ download, popup: null as Page | null })),
      this.page.waitForEvent('popup', { timeout: 20000 }).then((popup) => ({ download: null, popup })),
    ]).catch(() => ({ download: null, popup: null }));
    await this.clickMenuItem('Download');
    const { download, popup } = await resultPromise;

    if (!download && !popup && !(await this.letterViewer().isVisible({ timeout: 5000 }).catch(() => false))) {
      throw new Error('Download did not start and no offer letter preview opened');
    }

    let savedFile = false;
    if (download) {
      await download.saveAs(downloadPath);
      const filename = download.suggestedFilename();
      const size = fs.statSync(downloadPath).size;
      console.log(`Downloaded offer letter: ${filename} (${size} bytes)`);
      expect(filename.toLowerCase()).toMatch(/pdf|offer|letter/);
      expect(size).toBeGreaterThan(1000);
      const header = fs.readFileSync(downloadPath).subarray(0, 4).toString();
      expect(header).toBe('%PDF');
      savedFile = true;
    }

    if (popup) {
      await expect(popup.getByText(new RegExp(trainee.firstName))).toBeVisible({ timeout: 15000 }).catch(() => {});
      await popup.close();
    }

    const viewer = this.letterViewer();
    if (await viewer.isVisible().catch(() => false)) {
      await expect(viewer).toContainText(new RegExp(trainee.firstName));
      await this.closeLetterViewer();
    }

    return savedFile;
  }

  async rejectOffer(row: Locator, comments: string) {
    await this.openKebab(row);
    await this.clickMenuItem('Reject');

    await this.rejectReasonInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.rejectReasonInput.fill(comments);
    await expect(this.rejectButton).toBeEnabled({ timeout: 10000 });
    await this.rejectButton.click();

    await expect(this.rejectedToast).toBeVisible({ timeout: 20000 });
    const text = (await this.rejectedToast.innerText()).trim();
    console.log(`Reject success: ${text}`);
    await this.rejectedToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    return text;
  }

  async approveOffer(row: Locator) {
    await this.openKebab(row);
    await this.clickMenuItem('Approve');
    await expect(this.approvedToast).toBeVisible({ timeout: 20000 });
    const text = (await this.approvedToast.innerText()).trim();
    console.log(`Approve success: ${text}`);
    await this.approvedToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    return text;
  }

  async releaseOffer(row: Locator) {
    await this.openKebab(row);
    await this.clickMenuItem('Release Offer');
    await expect(this.releasedToast).toBeVisible({ timeout: 20000 });
    const text = (await this.releasedToast.innerText()).trim();
    console.log(`Release success: ${text}`);
    await this.releasedToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    return text;
  }

  private letterViewer() {
    return this.page.getByRole('dialog').filter({ hasText: /offer letter|pdf|preview/i }).first();
  }

  private async closeLetterViewer() {
    const viewer = this.letterViewer();
    const close = viewer.getByRole('button', { name: /close|cancel/i }).first();
    if (await close.isVisible().catch(() => false)) {
      await close.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
    await viewer.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
  }

  private async openKebab(row: Locator) {
    await this.closeMenus();
    await this.scrollActionColumnIntoView();
    const actionCell = row.locator('td').last();
    await actionCell.scrollIntoViewIfNeeded();
    const kebab = actionCell.locator('.dropdown > a, .dropdown').last();
    await kebab.waitFor({ state: 'visible', timeout: 10000 });

    for (let attempt = 0; attempt < 3; attempt++) {
      await kebab.click({ force: attempt > 0 });
      const menu = this.page.locator('.dropdown-menu.show');
      const visibleAction = this.page.getByText(/^(Download|Reject|Approve|Release Offer)$/).filter({ visible: true });
      if (
        (await menu.isVisible({ timeout: 2500 }).catch(() => false)) ||
        (await visibleAction.first().isVisible({ timeout: 2500 }).catch(() => false))
      ) {
        return;
      }
      await this.closeMenus();
      await this.page.waitForTimeout(400);
    }

    throw new Error('Could not open pending trainee offer action kebab');
  }

  private async clickMenuItem(name: string) {
    const visible = this.page.getByText(name, { exact: true }).filter({ visible: true }).last();
    if (await visible.isVisible({ timeout: 3000 }).catch(() => false)) {
      await visible.click();
      return;
    }

    const inOpenMenu = this.page.locator('.dropdown-menu.show .dropdown-item, .dropdown-menu.show a').filter({
      hasText: new RegExp(`^${name}$`),
    }).last();
    if (await inOpenMenu.count()) {
      await inOpenMenu.click({ force: true });
      return;
    }

    throw new Error(`Action "${name}" was not visible in the pending offer kebab`);
  }

  private async closeMenus() {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.locator('.dropdown-menu.show').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }

  private async scrollActionColumnIntoView() {
    await this.page.getByRole('columnheader', { name: 'Action' }).scrollIntoViewIfNeeded().catch(() => {});
    const tableWrap = this.page.locator('.p-datatable-wrapper, .table-responsive').first();
    if (await tableWrap.isVisible().catch(() => false)) {
      await tableWrap.evaluate((el) => {
        el.scrollLeft = el.scrollWidth;
      }).catch(() => {});
    }
  }
}
