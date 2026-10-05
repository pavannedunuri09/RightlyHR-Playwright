# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: manage-shifts.spec.ts >> Manage Shifts >> TC14- should change Location and Sub Location while cloning
- Location: tests\manage-shifts.spec.ts:452:7

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.p-select-overlay').last().getByRole('option', { name: 'Cyber City', exact: true }).first()

```

# Page snapshot

```yaml
- generic [ref=f2e4]:
  - generic [ref=f2e8]:
    - img "Company Logo" [ref=f2e10]
    - generic [ref=f2e11]:
      - generic [ref=f2e12] [cursor=pointer]
      - generic [ref=f2e20] [cursor=pointer]: 
      - generic [ref=f2e24] [cursor=pointer]
      - generic [ref=f2e34] [cursor=pointer]:
        - generic [ref=f2e35]:
          - paragraph [ref=f2e36]: Pavan sai Dinesh Nedunuri
          - paragraph [ref=f2e37]: QA Tester
        - img "Profile Image" [ref=f2e39]
  - generic [ref=f2e40]:
    - generic [ref=f2e43]:
      - list [ref=f2e45]:
        - listitem [ref=f2e46] [cursor=pointer]:
          - img "Icon" [ref=f2e47]
          - text: Dashboard
        - listitem [ref=f2e48]:
          - generic [ref=f2e49]:
            - generic [ref=f2e50] [cursor=pointer]:
              - img "Icon" [ref=f2e51]
              - text: My Info
            - generic [ref=f2e52] [cursor=pointer]:
              - img "Icon" [ref=f2e53]
              - text: Employees
            - generic [ref=f2e54] [cursor=pointer]:
              - img "Icon" [ref=f2e55]
              - text: Policies
            - generic [ref=f2e56] [cursor=pointer]:
              - img "Icon" [ref=f2e57]
              - text: Pending Approvals
            - generic [ref=f2e58] [cursor=pointer]:
              - img "Icon" [ref=f2e59]
              - text: Reports
            - generic [ref=f2e60] [cursor=pointer]:
              - img "Icon" [ref=f2e61]
              - text: Holidays
            - generic [ref=f2e62] [cursor=pointer]:
              - img "Icon" [ref=f2e63]
              - text: Cards Management
            - generic [ref=f2e64] [cursor=pointer]:
              - img "Icon" [ref=f2e65]
              - text: Expenses
            - generic [ref=f2e66] [cursor=pointer]:
              - img "Icon" [ref=f2e67]
              - text: IT Support
            - generic [ref=f2e68] [cursor=pointer]:
              - img "Icon" [ref=f2e69]
              - text: Skill Set
            - generic [ref=f2e72] [cursor=pointer]:
              - img "Icon" [ref=f2e73]
              - text: Project Management
            - generic [ref=f2e76] [cursor=pointer]:
              - img "Icon" [ref=f2e77]
              - text: ATS
            - generic [ref=f2e80] [cursor=pointer]:
              - img "Icon" [ref=f2e81]
              - text: PMS
            - generic [ref=f2e84] [cursor=pointer]:
              - img "Icon" [ref=f2e85]
              - text: Time Off
        - listitem [ref=f2e86] [cursor=pointer]:
          - img "Icons" [ref=f2e89]
      - img "Powered By logo" [ref=f2e92]
    - generic [ref=f2e100]:
      - generic [ref=f2e102]:
        - generic [ref=f2e103] [cursor=pointer]:
          - text: Manage Shits
          - generic [ref=f2e104]: 
        - generic [ref=f2e105]: Clone Shifts
      - generic [ref=f2e106]:
        - generic [ref=f2e107]:
          - generic [ref=f2e108]:
            - generic [ref=f2e109]:
              - generic [ref=f2e110]: Year *
              - generic [ref=f2e112] [cursor=pointer]:
                - combobox "2026" [ref=f2e113]
                - button "dropdown trigger" [ref=f2e114]
            - generic [ref=f2e118]:
              - generic [ref=f2e119]: Location *
              - generic [ref=f2e121] [cursor=pointer]:
                - combobox "Delhi" [ref=f2e122]
                - button "dropdown trigger" [ref=f2e123]
            - generic [ref=f2e127]:
              - generic [ref=f2e128]: Sub Location*
              - generic [ref=f2e130] [cursor=pointer]:
                - combobox "Please select sub location" [expanded] [active] [ref=f2e131]
                - button "dropdown trigger" [expanded] [ref=f2e132]
                - listbox "Option List" [ref=f2e141]:
                  - option "New delhi" [ref=f2e143]
                  - option "Ta Mahal" [ref=f2e146]
              - generic [ref=f2e149]: Sub Location is required
            - button " Add New" [ref=f2e152] [cursor=pointer]:
              - generic [ref=f2e153]: 
              - text: Add New
          - generic [ref=f2e155]:
            - generic [ref=f2e156]:
              - generic [ref=f2e157]:
                - generic [ref=f2e158]: Shift Code *
                - textbox "Please enter shift code" [ref=f2e159]
              - generic [ref=f2e160]:
                - generic [ref=f2e161]: Shift Name *
                - textbox "Please enter shift name" [ref=f2e162]: EarlyShif
              - generic [ref=f2e163]:
                - generic [ref=f2e164]: Color
                - textbox [ref=f2e165]: "#aba0a0"
              - generic [ref=f2e166]:
                - generic [ref=f2e167]: Start Time *
                - textbox [ref=f2e168]: 08:00
              - generic [ref=f2e169]:
                - generic [ref=f2e170]:
                  - generic [ref=f2e171]: End Time *
                  - button "" [ref=f2e174] [cursor=pointer]
                - textbox [ref=f2e176]: 17:00
            - generic [ref=f2e177]:
              - generic [ref=f2e178]:
                - generic [ref=f2e179]: Allowed Grace Period (mins) *
                - spinbutton "Please enter grace period" [ref=f2e180]: "15"
              - generic [ref=f2e181]:
                - generic [ref=f2e182]: Lates Allowed(Days) *
                - spinbutton "Please enter lates allowed" [ref=f2e183]: "3"
              - generic [ref=f2e184]:
                - generic [ref=f2e185]: Allowed Break Time(Hrs) *
                - spinbutton "Please enter Break time" [ref=f2e186]: "1"
              - generic [ref=f2e187]:
                - generic [ref=f2e188]: Half Day Min Hrs *
                - spinbutton "Please enter Half day min hrs" [ref=f2e189]: "4"
              - generic [ref=f2e190]:
                - generic [ref=f2e191]: Full Day Min Hrs *
                - spinbutton "Please enter Full day min hrs" [ref=f2e192]: "7.5"
              - generic [ref=f2e193]:
                - generic [ref=f2e194]:
                  - generic [ref=f2e195]: Pre-Shift Buffer (mins) *
                  - generic [ref=f2e197] [cursor=pointer]
                - spinbutton "Please enter pre-shift buffer" [ref=f2e202]: "0"
              - generic [ref=f2e203]:
                - generic [ref=f2e204]:
                  - generic [ref=f2e205]: Post-Shift Buffer (mins)
                  - generic [ref=f2e207] [cursor=pointer]
                - spinbutton "Please enter post-shift buffer" [ref=f2e212]: "0"
        - generic [ref=f2e213]:
          - button "Cancel" [ref=f2e214] [cursor=pointer]
          - button "Submit" [disabled] [ref=f2e215] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect, type Page } from './fixtures/test';
  2   | 
  3   | import { LoginPage } from '../pages/LoginPage';
  4   | import { ManageShiftsPage } from '../pages/ManageShiftsPage';
  5   | 
  6   | async function confirmDialogYes(page: Page) {
  7   |   const yes = page
  8   |     .getByRole('dialog')
  9   |     .getByRole('button', { name: 'Yes', exact: true })
  10  |     .or(page.getByRole('button', { name: 'Yes', exact: true }));
  11  | 
  12  |   if (await yes.first().isVisible({ timeout: 2000 }).catch(() => false)) {
  13  |     await yes.first().click();
  14  |   }
  15  | }
  16  | 
  17  | async function cancelWithYes(page: Page, shiftsPage: ManageShiftsPage) {
  18  |   await shiftsPage.cancelButton.click();
  19  |   await confirmDialogYes(page);
  20  | }
  21  | 
  22  | async function dismissOpenForms(page: Page, shiftsPage: ManageShiftsPage) {
  23  |   for (let attempt = 0; attempt < 3; attempt += 1) {
  24  |     const cancel = page.getByRole('button', { name: 'Cancel', exact: true }).filter({ visible: true });
  25  |     if (!(await cancel.first().isVisible({ timeout: 500 }).catch(() => false))) {
  26  |       break;
  27  |     }
  28  |     await cancelWithYes(page, shiftsPage);
  29  |     await page.waitForTimeout(300);
  30  |   }
  31  | }
  32  | 
  33  | async function selectFormSubLocation(page: Page, subLocation: string) {
  34  |   const field = page.locator('#sublocation');
  35  |   const trigger = field.getByRole('button', { name: 'dropdown trigger' });
  36  |   const combo = field.getByRole('combobox').first()
  37  |     .or(page.getByRole('combobox', { name: /Please select sub\s?location/i }))
  38  |     .or(page.getByRole('combobox', { name: subLocation }))
  39  |     .first();
  40  | 
  41  |   if (await trigger.isVisible({ timeout: 2000 }).catch(() => false)) {
  42  |     await trigger.click();
  43  |   } else {
  44  |     await combo.click();
  45  |   }
  46  | 
  47  |   const panel = page.locator('.p-select-overlay').last();
  48  |   if (await panel.isVisible({ timeout: 2000 }).catch(() => false)) {
> 49  |     await panel.getByRole('option', { name: subLocation, exact: true }).first().click();
      |                                                                                 ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  50  |   } else {
  51  |     await page.getByText(subLocation, { exact: true }).click();
  52  |   }
  53  | }
  54  | 
  55  | async function submitShiftWithConfirm(page: Page, shiftsPage: ManageShiftsPage) {
  56  |   await shiftsPage.submitButton.click();
  57  | 
  58  |   const dialogSubmit = page.getByRole('dialog').getByRole('button', { name: 'Submit', exact: true });
  59  |   if (await dialogSubmit.isVisible({ timeout: 2000 }).catch(() => false)) {
  60  |     await dialogSubmit.click();
  61  |   }
  62  | 
  63  |   await expect(
  64  |     page.getByText(/shift.*(created|submitted|saved|success)|submitted successfully|created successfully|successfully/i).first(),
  65  |   ).toBeVisible({ timeout: 15000 });
  66  | }
  67  | 
  68  | async function expectCreatedShiftByCode(
  69  |   page: Page,
  70  |   shiftsPage: ManageShiftsPage,
  71  |   details: { shiftCode: string; shiftName: string; location: string; subLocation: string },
  72  | ) {
  73  |   await openManageShiftUpdateByCode(page, shiftsPage, details.shiftCode);
  74  |   await expect(shiftsPage.shiftCodeInput).toHaveValue(details.shiftCode);
  75  |   await expect(shiftsPage.shiftNameInput).toHaveValue(details.shiftName);
  76  |   await cancelWithYes(page, shiftsPage);
  77  | }
  78  | 
  79  | async function openManageShiftUpdateByCode(page: Page, shiftsPage: ManageShiftsPage, shiftCode: string) {
  80  |   await shiftsPage.goto();
  81  |   await dismissOpenForms(page, shiftsPage);
  82  |   await page.getByRole('table').first().waitFor({ state: 'visible', timeout: 15000 });
  83  | 
  84  |   for (let index = 0; index < 50; index += 1) {
  85  |     const rows = page.getByRole('row').filter({ has: page.locator('.text-center > .dropdown, .dropdown') });
  86  |     if (index >= await rows.count()) {
  87  |       break;
  88  |     }
  89  | 
  90  |     const row = rows.nth(index);
  91  |     const actionCell = row.getByRole('cell').last();
  92  | 
  93  |     await row.scrollIntoViewIfNeeded();
  94  |     await actionCell.locator('div').first().click();
  95  |     await actionCell.getByText('Update', { exact: true }).filter({ visible: true }).click();
  96  |     await page.getByText('Update Shifts', { exact: true }).waitFor({ state: 'visible', timeout: 10000 });
  97  | 
  98  |     const shiftCodeVisible = await shiftsPage.shiftCodeInput.isVisible({ timeout: 3000 }).catch(() => false);
  99  |     if (!shiftCodeVisible) {
  100 |       await cancelWithYes(page, shiftsPage);
  101 |       await page.getByText('Update Shifts', { exact: true }).waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
  102 |       await page.getByRole('table').first().waitFor({ state: 'visible', timeout: 10000 });
  103 |       continue;
  104 |     }
  105 | 
  106 |     if ((await shiftsPage.shiftCodeInput.inputValue()) === shiftCode) {
  107 |       return;
  108 |     }
  109 | 
  110 |     await cancelWithYes(page, shiftsPage);
  111 |     await page.getByText('Update Shifts', { exact: true }).waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
  112 |     await page.getByRole('table').first().waitFor({ state: 'visible', timeout: 10000 });
  113 |   }
  114 | 
  115 |   throw new Error(`Manage shift with code ${shiftCode} was not found`);
  116 | }
  117 | 
  118 | test.describe('Manage Shifts', () => {
  119 | 
  120 |   test.beforeEach(async ({ page }) => {
  121 |     const loginPage = new LoginPage(page);
  122 | 
  123 |     await loginPage.loginFromEnv();
  124 |   });
  125 | 
  126 |   // =========================================================
  127 |   // TC01 - MANAGE SHIFTS PAGE
  128 |   // =========================================================
  129 | 
  130 |   test('TC01 - should open Manage Shifts page', async ({ page }) => {
  131 | 
  132 |     const shiftsPage = new ManageShiftsPage(page);
  133 | 
  134 |     await shiftsPage.goto();
  135 | 
  136 |     await expect(page).toHaveURL(
  137 |       /\/settings\/employee-fields\/manage-shifts\/pending-for-submit/
  138 |     );
  139 | 
  140 |     await expect(
  141 |       shiftsPage.pendingSubmissionTab
  142 |     ).toBeVisible();
  143 | 
  144 |     await expect(
  145 |       shiftsPage.publishedTab
  146 |     ).toBeVisible();
  147 | 
  148 |     await expect(
  149 |       shiftsPage.addNewButton
```