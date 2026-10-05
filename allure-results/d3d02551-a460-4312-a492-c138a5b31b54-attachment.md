# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: personalization.spec.ts >> Personalization module >> TC-02 - Verify user can select and apply a different theme
- Location: tests\personalization.spec.ts:52:9

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "teal"
Received string:    "default-theme roboto-flex modal-open"
```

# Page snapshot

```yaml
- generic [ref=f2e4]:
  - generic [ref=f2e8]:
    - img "Company Logo" [ref=f2e10]
    - generic [ref=f2e11]:
      - generic [ref=f2e12] [cursor=pointer]
      - generic [ref=f2e20] [cursor=pointer]
      - generic [ref=f2e28] [cursor=pointer]
      - generic [ref=f2e39] [cursor=pointer]:
        - paragraph [ref=f2e40]: Induu Priyaa
        - paragraph [ref=f2e41]: Chief Executive Officer
  - generic [ref=f2e47]:
    - generic [ref=f2e50]:
      - list [ref=f2e52]:
        - listitem [ref=f2e53] [cursor=pointer]:
          - img "Icon" [ref=f2e54]
          - text: Dashboard
        - listitem [ref=f2e55]:
          - generic [ref=f2e56]:
            - generic [ref=f2e57] [cursor=pointer]:
              - img "Icon" [ref=f2e58]
              - text: Employees
            - generic [ref=f2e59] [cursor=pointer]:
              - img "Icon" [ref=f2e60]
              - text: My Info
            - generic [ref=f2e61] [cursor=pointer]:
              - img "Icon" [ref=f2e62]
              - text: Reports
            - generic [ref=f2e65] [cursor=pointer]:
              - img "Icon" [ref=f2e66]
              - text: Time Off
            - generic [ref=f2e67] [cursor=pointer]:
              - img "Icon" [ref=f2e68]
              - text: Attendance
            - generic [ref=f2e71] [cursor=pointer]:
              - img "Icon" [ref=f2e72]
              - text: Project Management
            - generic [ref=f2e73] [cursor=pointer]:
              - img "Icon" [ref=f2e74]
              - text: Skill Set
            - generic [ref=f2e77] [cursor=pointer]:
              - img "Icon" [ref=f2e78]
              - text: On Behalf Of
            - generic [ref=f2e81] [cursor=pointer]:
              - img "Icon" [ref=f2e82]
              - text: Pending Approvals
            - generic [ref=f2e85] [cursor=pointer]:
              - img "Icon" [ref=f2e86]
              - text: PMS
        - listitem [ref=f2e87] [cursor=pointer]:
          - img "Icon" [ref=f2e88]
          - text: Personalization
        - listitem [ref=f2e89] [cursor=pointer]:
          - img "Icons" [ref=f2e92]
      - img "Powered By logo" [ref=f2e95]
    - generic [ref=f2e99]:
      - generic [ref=f2e100]:
        - generic [ref=f2e101]:
          - generic [ref=f2e102]:
            - text: Personalization
            - generic [ref=f2e103]: 
          - generic [ref=f2e105]: Theme Personalization
          - generic [ref=f2e107] [cursor=pointer]
        - generic [ref=f2e112]:
          - button "Apply Theme" [active] [ref=f2e113] [cursor=pointer]
          - button "Apply Font" [disabled] [ref=f2e114] [cursor=pointer]
      - generic [ref=f2e115]:
        - list [ref=f2e118]:
          - listitem [ref=f2e119]:
            - generic [ref=f2e120] [cursor=pointer]:
              - img "Icon" [ref=f2e121]
              - generic [ref=f2e122]: Theme Personalization
          - listitem [ref=f2e124]:
            - generic [ref=f2e125] [cursor=pointer]:
              - img "Icon" [ref=f2e126]
              - generic [ref=f2e127]: Menu Personalization
        - generic [ref=f2e130]:
          - generic [ref=f2e131]: Theme Colors
          - generic [ref=f2e132]:
            - generic [ref=f2e133] [cursor=pointer]: Default
            - generic [ref=f2e136] [cursor=pointer]: Lavender
            - generic [ref=f2e139] [cursor=pointer]: Navy Blue
            - generic [ref=f2e142] [cursor=pointer]:
              - generic [ref=f2e143]: 
              - generic [ref=f2e146]: Teal
            - generic [ref=f2e147] [cursor=pointer]: Blue
            - generic [ref=f2e150] [cursor=pointer]: Copper Wood
            - generic [ref=f2e153] [cursor=pointer]: Royal Blue
            - generic [ref=f2e156] [cursor=pointer]: Black
            - generic [ref=f2e159] [cursor=pointer]: Enchanted Wine
            - generic [ref=f2e162] [cursor=pointer]: Flare Red
            - generic [ref=f2e165] [cursor=pointer]: Dark Slate Blue
            - generic [ref=f2e168] [cursor=pointer]: Warm Brown
          - generic [ref=f2e171]: Font Styles
          - generic [ref=f2e172]:
            - generic [ref=f2e173] [cursor=pointer]: Roboto Flex
            - generic [ref=f2e176] [cursor=pointer]: DM Sans
            - generic [ref=f2e178] [cursor=pointer]: DM Sans Italics
            - generic [ref=f2e180] [cursor=pointer]: Lexend
```

# Test source

```ts
  1   | import { test, expect } from './fixtures/test';
  2   | import { LoginPage } from '../pages/LoginPage';
  3   | import {
  4   |     PersonalizationPage,
  5   |     ALL_THEMES,
  6   |     ALL_FONTS,
  7   | } from '../pages/personalization';
  8   | 
  9   | test.describe.serial('Personalization module', () => {
  10  | 
  11  |     test.beforeEach(async ({ page }) => {
  12  |         const loginPage = new LoginPage(page);
  13  |         await loginPage.loginFromEnv();
  14  |     });
  15  | 
  16  | 
  17  |     // TC-01
  18  |     test('TC-01 - Verify Theme Personalization page loads with all themes and fonts', async ({ page }) => {
  19  |         const personalization = new PersonalizationPage(page);
  20  | 
  21  |         await personalization.openPersonalization();
  22  | 
  23  |         await expect(page).toHaveURL(/\/theme\/selection/i);
  24  |         await expect(personalization.breadcrumbHeading).toBeVisible();
  25  |         await expect(personalization.applyThemeButton).toBeVisible();
  26  |         await expect(personalization.applyFontButton).toBeVisible();
  27  | 
  28  |         const themeCount = await personalization.themeCards.count();
  29  |         expect(themeCount).toBe(12);
  30  | 
  31  |         for (const themeName of ALL_THEMES) {
  32  |             await expect(
  33  |                 personalization.themeCard(themeName)
  34  |             ).toBeVisible();
  35  |         }
  36  | 
  37  |         const fontCount = await personalization.fontCards.count();
  38  |         expect(fontCount).toBe(4);
  39  | 
  40  |         for (const fontName of ALL_FONTS) {
  41  |             await expect(
  42  |                 personalization.fontCard(fontName)
  43  |             ).toBeVisible();
  44  |         }
  45  | 
  46  |         await expect(personalization.selectedThemeCard).toBeVisible();
  47  |         await expect(personalization.selectedFontCard).toBeVisible();
  48  |     });
  49  | 
  50  | 
  51  |     // TC-02
  52  |     test('TC-02 - Verify user can select and apply a different theme', async ({ page }) => {
  53  |         const personalization = new PersonalizationPage(page);
  54  | 
  55  |         await personalization.openPersonalization();
  56  | 
  57  |         const initialTheme = await personalization.getActiveThemeName();
  58  | 
  59  |         const targetTheme =
  60  |             initialTheme.toLowerCase().includes('teal')
  61  |                 ? 'Lavender'
  62  |                 : 'Teal';
  63  | 
  64  |         await personalization.selectTheme(targetTheme);
  65  |         await personalization.applyTheme();
  66  | 
  67  |         await expect(
  68  |             personalization.selectedThemeCard
  69  |         ).toContainText(targetTheme);
  70  | 
  71  |         const bodyClass = await personalization.getBodyClasses();
  72  | 
  73  |         expect(bodyClass.toLowerCase())
> 74  |             .toContain(targetTheme.toLowerCase().replace(/\s+/g, '-'));
      |              ^ Error: expect(received).toContain(expected) // indexOf
  75  | 
  76  |         // Restore original theme
  77  |         if (initialTheme && initialTheme !== targetTheme) {
  78  |             await personalization.selectTheme(initialTheme);
  79  |             await personalization.applyTheme();
  80  | 
  81  |             await expect(
  82  |                 personalization.selectedThemeCard
  83  |             ).toContainText(initialTheme);
  84  |         }
  85  |     });
  86  | 
  87  | 
  88  |     // TC-03
  89  |     test('TC-03 - Verify user can select and apply a different font style', async ({ page }) => {
  90  |         const personalization = new PersonalizationPage(page);
  91  | 
  92  |         await personalization.openPersonalization();
  93  | 
  94  |         const initialFont = await personalization.getActiveFontName();
  95  | 
  96  |         const targetFont =
  97  |             initialFont.toLowerCase().includes('roboto')
  98  |                 ? 'DM Sans'
  99  |                 : 'Roboto Flex';
  100 | 
  101 |         await personalization.selectFont(targetFont);
  102 |         await personalization.applyFont();
  103 | 
  104 |         await expect(
  105 |             personalization.selectedFontCard
  106 |         ).toContainText(targetFont);
  107 | 
  108 |         const bodyClass = await personalization.getBodyClasses();
  109 | 
  110 |         expect(bodyClass.toLowerCase())
  111 |             .toContain(targetFont.toLowerCase().replace(/\s+/g, '-'));
  112 | 
  113 |         // Restore original font
  114 |         if (initialFont && initialFont !== targetFont) {
  115 |             await personalization.selectFont(initialFont);
  116 |             await personalization.applyFont();
  117 | 
  118 |             await expect(
  119 |                 personalization.selectedFontCard
  120 |             ).toContainText(initialFont);
  121 |         }
  122 |     });
  123 | 
  124 | 
  125 |     // TC-04
  126 |     test('TC-04 - Verify navigation between Theme and Menu Personalization', async ({ page }) => {
  127 |         const personalization = new PersonalizationPage(page);
  128 | 
  129 |         await personalization.openPersonalization();
  130 | 
  131 |         await personalization.switchToMenuPersonalization();
  132 | 
  133 |         await expect(page).toHaveURL(/\/menus\/personalization/i);
  134 | 
  135 |         await expect(
  136 |             personalization.resetToDefaultButton
  137 |         ).toBeVisible();
  138 | 
  139 |         await expect(
  140 |             personalization.applyChangesButton
  141 |         ).toBeVisible();
  142 | 
  143 |         await personalization.switchToThemePersonalization();
  144 | 
  145 |         await expect(page).toHaveURL(/\/theme\/selection/i);
  146 | 
  147 |         await expect(
  148 |             personalization.applyThemeButton
  149 |         ).toBeVisible();
  150 | 
  151 |         await expect(
  152 |             personalization.applyFontButton
  153 |         ).toBeVisible();
  154 |     });
  155 | 
  156 | 
  157 |     // TC-05
  158 |     test('TC-05 - Verify Menu Personalization layout and fixed Dashboard', async ({ page }) => {
  159 |         const personalization = new PersonalizationPage(page);
  160 | 
  161 |         await personalization.openPersonalization();
  162 | 
  163 |         await personalization.switchToMenuPersonalization();
  164 | 
  165 |         await expect(
  166 |             personalization.primaryMenuHeading
  167 |         ).toBeVisible();
  168 | 
  169 |         await expect(
  170 |             personalization.ellipsesMenuHeading
  171 |         ).toBeVisible();
  172 | 
  173 |         await expect(
  174 |             personalization.resetToDefaultButton
```