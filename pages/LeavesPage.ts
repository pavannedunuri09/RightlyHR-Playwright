import { expect, type Locator, type Page } from '@playwright/test';

export type LeaveEntitlementExpectation = {
  entitledBalance: string;
  frequency: string;
  booked?: string;
  processed?: string;
};

export class LeavesPage {
  readonly page: Page;
  readonly timeOffNav: Locator;
  readonly timeOffToggle: Locator;
  readonly timeOffLeavesTab: Locator;
  readonly requestLeaveButton: Locator;
  readonly viewLeaveSummaryButton: Locator;
  readonly entitlementSummaryHeader: Locator;
  readonly waitingForApprovalTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timeOffNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Time Off' });
    this.timeOffToggle = this.timeOffNav.locator('[data-bs-toggle="dropdown"]');
    this.timeOffLeavesTab = page
      .locator('app-time-off-tabs')
      .locator('.grid-item')
      .filter({ hasText: /^Leaves$/i });
    this.requestLeaveButton = page.getByRole('button', { name: /Request Leave/i });
    this.viewLeaveSummaryButton = page.getByRole('button', { name: /View Leave Summary/i });
    this.entitlementSummaryHeader = page.getByText(/Entitlement Summary/i);
    this.waitingForApprovalTab = page
      .getByRole('listitem')
      .filter({ hasText: /Waiting For Approval/i })
      .first();
  }

  leaveEntitlementBlock(categoryName: string) {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText(categoryName, { exact: true }) })
      .filter({ hasText: /\d+\s*\/\s*\d+/ })
      .first();
  }

  async waitForEntitlementCards(categoryNames: string[], timeoutMs = 30000) {
    for (const categoryName of categoryNames) {
      await expect
        .poll(
          async () => this.leaveEntitlementBlock(categoryName).isVisible().catch(() => false),
          { timeout: timeoutMs },
        )
        .toBeTruthy();
    }
  }

  async openTimeOffMenu() {
    await this.timeOffNav.waitFor({ state: 'visible' });
    await this.timeOffToggle.waitFor({ state: 'visible' });

    if (await this.timeOffLeavesTab.isVisible().catch(() => false)) {
      return;
    }

    await this.page.waitForTimeout(1500);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await this.timeOffToggle.click();
      try {
        await this.timeOffLeavesTab.waitFor({ state: 'visible', timeout: 8000 });
        return;
      } catch {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);
      }
    }

    await this.timeOffNav.click();
    await this.timeOffLeavesTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openLeavesTab() {
    await this.openTimeOffMenu();
    await this.timeOffLeavesTab.click();
    await this.page.waitForURL(/\/time-off\/leaves/i, { timeout: 15000 });
    await this.requestLeaveButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openFromDashboard() {
    if (!this.page.url().includes('/dashboard/emp')) {
      await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' });
    }
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page
      .getByText('Have a nice day at work!')
      .waitFor({ state: 'visible', timeout: 15000 });
    await this.openLeavesTab();
  }

  async expectLeavesPageLoaded() {
    await expect(this.page).toHaveURL(/\/time-off\/leaves/i);
    await expect(this.requestLeaveButton).toBeVisible({ timeout: 15000 });
    await expect(this.viewLeaveSummaryButton).toBeVisible();
  }

  async validateUserSessionAndOpenLeaves(
    loginPage: { validateUserSession: () => Promise<void> },
    categoryNames: string[] = [],
  ) {
    await loginPage.validateUserSession();
    await this.page.goto('/time-off/leaves/waiting-for-approval', {
      waitUntil: 'domcontentloaded',
    });
    await this.expectLeavesPageLoaded();

    if (categoryNames.length > 0) {
      await this.waitForEntitlementCards(categoryNames);
    }
  }

  async expectEntitledLeave(categoryName: string, expectation: LeaveEntitlementExpectation) {
    const block = this.leaveEntitlementBlock(categoryName);
    await expect(block).toBeVisible({ timeout: 15000 });

    const blockText = (await block.innerText()).replace(/\s+/g, ' ');
    const normalizedBlockText = blockText.replace(/\s/g, '');
    const normalizedBalance = expectation.entitledBalance.replace(/\s/g, '');
    expect(blockText).toContain(categoryName);
    expect(normalizedBlockText).toContain(normalizedBalance);
    expect(blockText).toContain(expectation.frequency);

    if (expectation.booked !== undefined) {
      expect(blockText).toMatch(new RegExp(`Booked\\s*${expectation.booked}`, 'i'));
    }

    if (expectation.processed !== undefined) {
      expect(blockText).toMatch(new RegExp(`Processed\\s*${expectation.processed}`, 'i'));
    }
  }
}
