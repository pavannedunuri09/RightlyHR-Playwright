import { expect, type Locator, type Page } from '@playwright/test';

type OfferEmployee = {
  firstName: string;
  lastName: string;
  email?: string;
  employeeId?: string;
  designation?: string;
};

export class PendingEmployeeOfferApprovalPage {
  readonly page: Page;
  readonly pendingApprovalsNav: Locator;
  readonly pendingApprovalsToggle: Locator;
  readonly onboardingTab: Locator;
  readonly forYouTab: Locator;
  readonly forYourRoleTab: Locator;
  readonly approvedToast: Locator;
  readonly releasedToast: Locator;
  readonly searchbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pendingApprovalsNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Pending Approvals' });
    this.pendingApprovalsToggle = this.pendingApprovalsNav.locator('[data-bs-toggle="dropdown"]');
    this.onboardingTab = page.getByText('Onboarding', { exact: true });
    this.forYouTab = page.getByRole('link', { name: /For You \(\d+\)/ });
    this.forYourRoleTab = page.getByRole('link', { name: /For Your Role \(\d+\)/ });
    this.approvedToast = page.getByText(/Offer (letter )?approved/i);
    this.releasedToast = page.getByText(/offer letter released|Release Letter/i);
    this.searchbox = page.getByRole('searchbox', { name: 'Username' });
  }

  async openEmployeeOfferLetterQueue() {
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

    const offerLetterItem = this.page.getByRole('listitem')
      .filter({ has: this.page.getByText('Offer Letter', { exact: true }) })
      .filter({ hasNotText: /Trainee|Contract/ });
    await offerLetterItem.first().waitFor({ state: 'visible', timeout: 15000 });
    await offerLetterItem.first().click();
    await this.page.waitForURL(/pending-approvals/i, { timeout: 15000 }).catch(() => {});
    await this.page.getByRole('columnheader', { name: 'Action' }).waitFor({ state: 'visible', timeout: 20000 });
  }

  offerRow(employee: OfferEmployee) {
    const fullName = `${employee.firstName} ${employee.lastName}`;
    return this.page.getByRole('row').filter({ hasText: fullName }).first();
  }

  async findOfferRow(employee: OfferEmployee) {
    const row = await this.findOfferRowOrNull(employee);
    if (!row) {
      throw new Error(`No pending Offer Letter found for ${employee.firstName} ${employee.lastName}.`);
    }
    return row;
  }

  async findOfferRowOrNull(employee: OfferEmployee) {
    if (await this.searchbox.isVisible().catch(() => false)) {
      await this.searchbox.fill('');
      await this.searchbox.press('Enter');
      await this.page.waitForTimeout(1000);
    }

    let row = this.offerRow(employee);
    if (await row.isVisible({ timeout: 8000 }).catch(() => false)) {
      return row;
    }

    const queries = [employee.email, employee.employeeId, employee.firstName]
      .filter((value): value is string => Boolean(value));
    for (const query of queries) {
      if (!(await this.searchbox.isVisible().catch(() => false))) {
        break;
      }
      await this.searchbox.fill(query);
      await this.searchbox.press('Enter');
      await this.page.waitForTimeout(1500);
      row = this.offerRow(employee);
      if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
        return row;
      }
    }

    if (await this.forYourRoleTab.isVisible().catch(() => false)) {
      await this.forYourRoleTab.click();
      await this.page.waitForTimeout(1000);
      row = this.offerRow(employee);
      if (await row.isVisible({ timeout: 8000 }).catch(() => false)) {
        return row;
      }
    }

    if (await this.forYouTab.isVisible().catch(() => false)) {
      await this.forYouTab.click();
      await this.page.waitForTimeout(1000);
      row = this.offerRow(employee);
      if (await row.isVisible({ timeout: 8000 }).catch(() => false)) {
        return row;
      }
    }

    return null;
  }

  async expectEmployeeDetails(row: Locator, employee: OfferEmployee) {
    const fullName = `${employee.firstName} ${employee.lastName}`;
    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText(fullName);
    if (employee.designation) {
      await expect(row).toContainText(employee.designation);
    }
    await expect(row).toContainText(/Waiting For Approval|Approved|Release/i);

    console.log(`Pending offer row: ${(await row.innerText()).replace(/\s+/g, ' ').trim()}`);
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

    throw new Error('Could not open pending employee offer action kebab');
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
