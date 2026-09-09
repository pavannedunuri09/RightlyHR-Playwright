import { expect, type Locator, type Page } from '@playwright/test';

export const ALL_THEMES = [
  'Default',
  'Lavender',
  'Navy Blue',
  'Teal',
  'Blue',
  'Copper Wood',
  'Royal Blue',
  'Black',
  'Enchanted Wine',
  'Flare Red',
  'Dark Slate Blue',
  'Warm Brown',
] as const;

export type ThemeName = (typeof ALL_THEMES)[number];

export const ALL_FONTS = [
  'Roboto Flex',
  'DM Sans',
  'DM Sans Italics',
  'Lexend',
] as const;

export type FontName = (typeof ALL_FONTS)[number];

export class PersonalizationPage {
  readonly page: Page;

  // Navigation & Tabs
  readonly ellipsesMenuToggle: Locator;
  readonly personalizationMenuItem: Locator;
  readonly themePersonalizationTab: Locator;
  readonly menuPersonalizationTab: Locator;
  readonly breadcrumbHeading: Locator;

  readonly themeColorsHeading: Locator;
  readonly fontStylesHeading: Locator;

  // Theme Personalization
  readonly applyThemeButton: Locator;
  readonly applyFontButton: Locator;
  readonly themeCards: Locator;
  readonly selectedThemeCard: Locator;
  readonly fontCards: Locator;
  readonly selectedFontCard: Locator;

  // Menu Personalization
  readonly resetToDefaultButton: Locator;
  readonly applyChangesButton: Locator;
  readonly primaryMenuHeading: Locator;
  readonly ellipsesMenuHeading: Locator;
  readonly primaryMenuItems: Locator;
  readonly ellipsesMenuItems: Locator;
  readonly dashboardFixedBadge: Locator;

  // Reset to Default Confirmation Modal
  readonly resetDialog: Locator;
  readonly resetDialogMessage: Locator;
  readonly resetDialogYesButton: Locator;
  readonly resetDialogNoButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation & Tabs
    this.ellipsesMenuToggle = page.locator('#ellipses-menu-toggle');
    this.personalizationMenuItem = page.locator('#menu-item-Personalization p').or(page.locator('#menu-item-Personalization')).first();
    this.themePersonalizationTab = page.locator('div, a, span').filter({ hasText: /^Theme Personalization$/i }).first();
    this.menuPersonalizationTab = page.locator('div, a, span').filter({ hasText: /^Menu Personalization$/i }).first();
    this.breadcrumbHeading = page.getByText('Theme Personalization').first();
    this.themeColorsHeading = page.getByText('Theme Colors');
    this.fontStylesHeading = page.getByText('Font Styles');

    // Theme Personalization
    this.applyThemeButton = page.getByRole('button', { name: 'Apply Theme' });
    this.applyFontButton = page.getByRole('button', { name: 'Apply Font' });
    this.themeCards = page.locator('.themes-grid').first().locator('.theme-content');
    this.selectedThemeCard = page.locator('.themes-grid').first().locator('.theme-content.selected');
    this.fontCards = page.locator('.theme-content.font-content');
    this.selectedFontCard = page.locator('.theme-content.font-content.selected');

    // Menu Personalization
    this.resetToDefaultButton = page.getByRole('button', { name: 'Reset to Default' });
    this.applyChangesButton = page.getByRole('button', { name: 'Apply Changes' });
    this.primaryMenuHeading = page.getByText('Primary Menu', { exact: true }).first();
    this.ellipsesMenuHeading = page.getByText('Ellipses Menu', { exact: true }).first();
    this.primaryMenuItems = page.locator('.primary-menu .grid-item, [id*="primary"] .cdk-drag');
    this.ellipsesMenuItems = page.locator('.ellipses-menu .grid-item, [id*="ellipses"] .cdk-drag');
    this.dashboardFixedBadge = page.getByText(/Fixed/i).first();

    // Reset Dialog Modal
    this.resetDialog = page.locator('.modal, [role="dialog"], .swal2-popup, .confirmation-dialog').first();
    this.resetDialogMessage = page.getByText('Are you sure you want to reset the menu order?');
    this.resetDialogYesButton = page.getByRole('button', { name: 'Yes' });
    this.resetDialogNoButton = page.getByRole('button', { name: 'No' });
  }

  /**
   * Navigates to Personalization page from dashboard via direct route or ellipses menu
   */
  async openPersonalization() {
    if (this.page.url().includes('/theme/selection') || this.page.url().includes('/menus/personalization')) {
      return;
    }

    try {
      await this.page.goto('/theme/selection', { waitUntil: 'domcontentloaded' });
      await this.applyThemeButton.waitFor({ state: 'visible', timeout: 15000 });
    } catch {
      if (await this.ellipsesMenuToggle.isVisible({ timeout: 5000 }).catch(() => false)) {
        await this.ellipsesMenuToggle.click();
        await this.personalizationMenuItem.waitFor({ state: 'visible', timeout: 8000 });
        await this.personalizationMenuItem.click();
        await this.page.waitForURL(/\/theme\/selection|\/personalization/i, { timeout: 15000 }).catch(() => { });
      }
      await this.applyThemeButton.or(this.themePersonalizationTab).first().waitFor({ state: 'visible', timeout: 15000 });
    }
  }

  /**
   * Switches to Theme Personalization sub-tab
   */
  async switchToThemePersonalization() {
    await this.themePersonalizationTab.click();
    await this.page.waitForURL(/\/theme\/selection/i, { timeout: 15000 }).catch(() => { });
    await this.applyThemeButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  /**
   * Switches to Menu Personalization sub-tab
   */
  async switchToMenuPersonalization() {
    await this.menuPersonalizationTab.click();
    await this.page.waitForURL(/\/menus\/personalization/i, { timeout: 15000 }).catch(() => { });
    await this.resetToDefaultButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  /**
   * Returns locator for a specific theme card by name
   */
  themeCard(name: string): Locator {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return this.themeCards
      .filter({
        hasText: new RegExp(`^\\s*${escapedName}\\s*$`, 'i')
      })
      .first();
  }

  /**
   * Returns locator for a specific font style card by name
   */
  fontCard(name: string): Locator {
    return this.fontCards.filter({ hasText: new RegExp(`^${name}$|${name}`, 'i') }).first();
  }

  /**
   * Selects a theme by name
   */
  async selectTheme(name: string) {
    const card = this.themeCard(name);

    await card.waitFor({ state: 'visible', timeout: 10000 });
    await card.scrollIntoViewIfNeeded();

    const cardText = (await card.innerText()).trim();

    console.log(`Selecting theme: ${name}`);
    console.log(`Matched card: ${cardText}`);

    expect(cardText.toLowerCase()).toContain(name.toLowerCase());

    await card.click();

    await this.page.waitForTimeout(400);
  }

  /**
   * Applies the currently selected theme
   */
  async applyTheme() {
    await this.applyThemeButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Selects a font style by name
   */
  async selectFont(name: string) {
    const card = this.fontCard(name);
    await card.scrollIntoViewIfNeeded().catch(() => { });
    await card.click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Applies the currently selected font
   */
  async applyFont() {
    await this.applyFontButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Returns the name of the currently selected theme
   */
  async getActiveThemeName(): Promise<string> {
    if (await this.selectedThemeCard.isVisible().catch(() => false)) {
      return (await this.selectedThemeCard.innerText()).trim();
    }
    return '';
  }

  /**
   * Returns the name of the currently selected font
   */
  async getActiveFontName(): Promise<string> {
    if (await this.selectedFontCard.isVisible().catch(() => false)) {
      return (await this.selectedFontCard.innerText()).trim();
    }
    return '';
  }

  /**
   * Returns the body element's classes (where theme and font classes are applied)
   */
  async getBodyClasses(): Promise<string> {
    return await this.page.evaluate(() => document.body.className);
  }

  /**
   * Opens the Reset to Default confirmation dialog in Menu Personalization
   */
  async openResetToDefaultDialog() {
    await this.resetToDefaultButton.click();
    await this.resetDialogMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Confirms the Reset to Default modal by clicking 'Yes'
   */
  async confirmResetToDefault() {
    await this.resetDialogYesButton.click();
    await this.resetDialogMessage.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
  }

  /**
   * Cancels the Reset to Default modal by clicking 'No'
   */
  async cancelResetToDefault() {
    await this.resetDialogNoButton.click();
    await this.resetDialogMessage.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
  }

  /**
   * Full reset helper for backward compatibility
   */
  async resetToDefault() {
    await this.openResetToDefaultDialog();
    await this.confirmResetToDefault();
  }
}
