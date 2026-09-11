import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import {
    PersonalizationPage,
    ALL_THEMES,
    ALL_FONTS,
} from '../pages/personalization';

test.describe.serial('Personalization module', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginFromEnv();
    });


    // TC-01
    test('TC-01 - Verify Theme Personalization page loads with all themes and fonts', async ({ page }) => {
        const personalization = new PersonalizationPage(page);

        await personalization.openPersonalization();

        await expect(page).toHaveURL(/\/theme\/selection/i);
        await expect(personalization.breadcrumbHeading).toBeVisible();
        await expect(personalization.applyThemeButton).toBeVisible();
        await expect(personalization.applyFontButton).toBeVisible();

        const themeCount = await personalization.themeCards.count();
        expect(themeCount).toBe(12);

        for (const themeName of ALL_THEMES) {
            await expect(
                personalization.themeCard(themeName)
            ).toBeVisible();
        }

        const fontCount = await personalization.fontCards.count();
        expect(fontCount).toBe(4);

        for (const fontName of ALL_FONTS) {
            await expect(
                personalization.fontCard(fontName)
            ).toBeVisible();
        }

        await expect(personalization.selectedThemeCard).toBeVisible();
        await expect(personalization.selectedFontCard).toBeVisible();
    });


    // TC-02
    test('TC-02 - Verify user can select and apply a different theme', async ({ page }) => {
        const personalization = new PersonalizationPage(page);

        await personalization.openPersonalization();

        const initialTheme = await personalization.getActiveThemeName();

        const targetTheme =
            initialTheme.toLowerCase().includes('teal')
                ? 'Lavender'
                : 'Teal';

        await personalization.selectTheme(targetTheme);
        await personalization.applyTheme();

        await expect(
            personalization.selectedThemeCard
        ).toContainText(targetTheme);

        const bodyClass = await personalization.getBodyClasses();

        expect(bodyClass.toLowerCase())
            .toContain(targetTheme.toLowerCase().replace(/\s+/g, '-'));

        // Restore original theme
        if (initialTheme && initialTheme !== targetTheme) {
            await personalization.selectTheme(initialTheme);
            await personalization.applyTheme();

            await expect(
                personalization.selectedThemeCard
            ).toContainText(initialTheme);
        }
    });


    // TC-03
    test('TC-03 - Verify user can select and apply a different font style', async ({ page }) => {
        const personalization = new PersonalizationPage(page);

        await personalization.openPersonalization();

        const initialFont = await personalization.getActiveFontName();

        const targetFont =
            initialFont.toLowerCase().includes('roboto')
                ? 'DM Sans'
                : 'Roboto Flex';

        await personalization.selectFont(targetFont);
        await personalization.applyFont();

        await expect(
            personalization.selectedFontCard
        ).toContainText(targetFont);

        const bodyClass = await personalization.getBodyClasses();

        expect(bodyClass.toLowerCase())
            .toContain(targetFont.toLowerCase().replace(/\s+/g, '-'));

        // Restore original font
        if (initialFont && initialFont !== targetFont) {
            await personalization.selectFont(initialFont);
            await personalization.applyFont();

            await expect(
                personalization.selectedFontCard
            ).toContainText(initialFont);
        }
    });


    // TC-04
    test('TC-04 - Verify navigation between Theme and Menu Personalization', async ({ page }) => {
        const personalization = new PersonalizationPage(page);

        await personalization.openPersonalization();

        await personalization.switchToMenuPersonalization();

        await expect(page).toHaveURL(/\/menus\/personalization/i);

        await expect(
            personalization.resetToDefaultButton
        ).toBeVisible();

        await expect(
            personalization.applyChangesButton
        ).toBeVisible();

        await personalization.switchToThemePersonalization();

        await expect(page).toHaveURL(/\/theme\/selection/i);

        await expect(
            personalization.applyThemeButton
        ).toBeVisible();

        await expect(
            personalization.applyFontButton
        ).toBeVisible();
    });


    // TC-05
    test('TC-05 - Verify Menu Personalization layout and fixed Dashboard', async ({ page }) => {
        const personalization = new PersonalizationPage(page);

        await personalization.openPersonalization();

        await personalization.switchToMenuPersonalization();

        await expect(
            personalization.primaryMenuHeading
        ).toBeVisible();

        await expect(
            personalization.ellipsesMenuHeading
        ).toBeVisible();

        await expect(
            personalization.resetToDefaultButton
        ).toBeVisible();

        await expect(
            personalization.resetToDefaultButton
        ).toBeEnabled();

        await expect(
            personalization.applyChangesButton
        ).toBeVisible();

        await expect(
            personalization.dashboardFixedBadge
        ).toBeVisible();

        await expect(
            page.getByText('Dashboard', { exact: true }).first()
        ).toBeVisible();
    });


    // TC-06
    test('TC-06 - Verify Reset to Default dialog can be cancelled', async ({ page }) => {
        const personalization = new PersonalizationPage(page);

        await personalization.openPersonalization();

        await personalization.switchToMenuPersonalization();

        await personalization.openResetToDefaultDialog();

        await expect(
            personalization.resetDialogMessage
        ).toBeVisible();

        await expect(
            personalization.resetDialogYesButton
        ).toBeVisible();

        await expect(
            personalization.resetDialogNoButton
        ).toBeVisible();

        await personalization.cancelResetToDefault();

        await expect(
            personalization.resetDialogMessage
        ).toBeHidden();
    });


    // TC-07
    test('TC-07 - Verify Reset to Default works when clicking Yes', async ({ page }) => {
        const personalization = new PersonalizationPage(page);

        await personalization.openPersonalization();

        await personalization.switchToMenuPersonalization();

        await personalization.openResetToDefaultDialog();

        await expect(
            personalization.resetDialogMessage
        ).toBeVisible();

        await personalization.confirmResetToDefault();

        await expect(
            personalization.resetDialogMessage
        ).toBeHidden();
    });

});