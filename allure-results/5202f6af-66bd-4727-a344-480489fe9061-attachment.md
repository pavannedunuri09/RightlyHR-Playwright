# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-entitlements.spec.ts >> Load Entitlements >> 01. navigates to Load Entitlements and shows read-only employee detail fields
- Location: tests\load-entitlements.spec.ts:41:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('textbox', { name: /First Name/i }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('textbox', { name: /First Name/i }).first()

```

```yaml
- img "Company Logo"
- img
- img
- text: 
- img
- paragraph: saii Pavan Dinesh Tejaa
- paragraph: QA Tester
- img "Profile Image"
- list:
  - listitem:
    - img "Icon"
    - text: Dashboard
  - listitem:
    - img "Icon"
    - text: My Info
    - img "Icon"
    - text: Employees
    - img "Icon"
    - text: Time Off
    - img "Icon"
    - text: Attendance
    - img "Icon"
    - text: Reports
    - img "Icon"
    - text: Project Management
    - img "Icon"
    - text: Skill Set
    - img "Icon"
    - text: On Behalf Of
    - img "Icon"
    - text: Pending Approvals
    - img "Icon"
    - text: PMS
  - listitem:
    - img "Icons"
- img "Powered By logo"
- text: Settings  Time Off  Load Entitlements Load Entitlements Select Employee *
- combobox "Please select Employee"
- button "dropdown trigger"
- text: Work Email
- textbox "Work Email" [disabled]
- text: Date of Joining
- textbox "Date of Joining" [disabled]
- text: Location
- textbox "Location" [disabled]
- text: Sub Location
- textbox "Sub Location" [disabled]
- text: Shift
- textbox "Shift" [disabled]
- button "Load Entitlements" [disabled]
```

# Test source

```ts
  172 |     const row = this.completedEntitlementRow(categoryName);
  173 |     await expect(row).toBeVisible({ timeout: 15000 });
  174 |     const rowText = (await row.innerText()).replace(/\s+/g, ' ');
  175 |     expect(rowText).toContain(categoryName);
  176 |     expect(rowText).toContain(days);
  177 |     expect(rowText).toContain(frequency);
  178 |     expect(rowText).toMatch(/Completed/i);
  179 |   }
  180 | 
  181 |   entitlementDataRows() {
  182 |     return this.entitlementsTable.locator('tbody tr').filter({
  183 |       hasNotText: /No Data Found/i,
  184 |     });
  185 |   }
  186 | 
  187 |   async openDashboard() {
  188 |     if (!this.page.url().includes('/dashboard/emp')) {
  189 |       await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' });
  190 |     }
  191 |     await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
  192 |     await this.page
  193 |       .getByText('Have a nice day at work!')
  194 |       .waitFor({ state: 'visible', timeout: 15000 });
  195 |   }
  196 | 
  197 |   async openSettingsTimeOff() {
  198 |     await this.settingsIcon.click();
  199 |     await this.page.waitForTimeout(1000);
  200 | 
  201 |     if (!(await this.timeOffPanel.isVisible({ timeout: 5000 }).catch(() => false))) {
  202 |       await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
  203 |       await this.page.waitForURL(/\/settings\/overview|\/settings/, { timeout: 15000 });
  204 |       await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  205 |       await this.page.waitForTimeout(500);
  206 |     }
  207 | 
  208 |     await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
  209 |     await this.timeOffPanel.scrollIntoViewIfNeeded().catch(() => {});
  210 |     await this.timeOffPanel.click({ force: true });
  211 |     await this.page.waitForTimeout(500);
  212 |   }
  213 | 
  214 |   async openFromDashboard() {
  215 |     await this.openDashboard();
  216 |     await this.openSettingsTimeOff();
  217 | 
  218 |     if (!(await this.loadEntitlementsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
  219 |       await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
  220 |       await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  221 |       await this.page.waitForTimeout(500);
  222 |       await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
  223 |       await this.timeOffPanel.click({ force: true });
  224 |     }
  225 | 
  226 |     await this.loadEntitlementsLink.waitFor({ state: 'visible', timeout: 15000 });
  227 |     await this.loadEntitlementsLink.click();
  228 |     await this.page.getByText(/Select Employee/i).first().waitFor({ state: 'visible', timeout: 15000 });
  229 |     await this.employeeCombobox.waitFor({ state: 'visible', timeout: 15000 });
  230 |     await this.loadEntitlementsButton.waitFor({ state: 'visible', timeout: 15000 });
  231 |   }
  232 | 
  233 |   async selectEmployee(
  234 |     searchText: string = LOAD_ENTITLEMENTS_EMPLOYEE.search,
  235 |     optionLabel: string = LOAD_ENTITLEMENTS_EMPLOYEE.optionLabel,
  236 |   ) {
  237 |     await this.employeeCombobox.click();
  238 |     await this.employeeSearchbox.waitFor({ state: 'visible', timeout: 5000 });
  239 |     await this.employeeSearchbox.fill(searchText);
  240 |     await this.page.waitForTimeout(800);
  241 | 
  242 |     const escaped = optionLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  243 |     const option = this.page
  244 |       .getByRole('option', { name: new RegExp(escaped, 'i') })
  245 |       .or(this.page.getByRole('listitem').filter({ hasText: new RegExp(escaped, 'i') }))
  246 |       .or(this.page.getByText(new RegExp(escaped, 'i')));
  247 |     await option.first().click({ timeout: 15000 });
  248 |     await this.page.waitForTimeout(1000);
  249 |   }
  250 | 
  251 |   async expectFieldReadOnly(field: Locator) {
  252 |     const disabled = await field.isDisabled().catch(() => false);
  253 |     const readOnly = (await field.getAttribute('readonly')) !== null;
  254 |     const ariaReadOnly = (await field.getAttribute('aria-readonly')) === 'true';
  255 |     const className = (await field.getAttribute('class').catch(() => '')) || '';
  256 |     const parentDisabled = await field
  257 |       .locator('xpath=ancestor::*[contains(@class,"p-disabled")][1]')
  258 |       .count()
  259 |       .then((count) => count > 0)
  260 |       .catch(() => false);
  261 | 
  262 |     expect(
  263 |       disabled || readOnly || ariaReadOnly || className.includes('p-disabled') || parentDisabled,
  264 |       'field should be read-only or disabled before employee selection',
  265 |     ).toBeTruthy();
  266 |   }
  267 | 
  268 |   async expectReadOnlyFieldsBeforeSelection() {
  269 |     await expect(this.employeeCombobox).toBeEnabled();
  270 | 
  271 |     for (const field of this.readOnlyFields()) {
> 272 |       await expect(field).toBeVisible();
      |                           ^ Error: expect(locator).toBeVisible() failed
  273 |       await this.expectFieldReadOnly(field);
  274 |     }
  275 |   }
  276 | 
  277 |   async expectEmployeeDetailsPopulated(expected: LeaveAllocationBaseFilters) {
  278 |     await expect(this.workEmailInput).not.toHaveValue('');
  279 |     await expect(this.dateOfJoiningInput).not.toHaveValue('');
  280 |     await expect(this.locationInput).toHaveValue(new RegExp(expected.location, 'i'));
  281 |     await expect(this.subLocationInput).toHaveValue(new RegExp(expected.subLocation, 'i'));
  282 |     await expect(this.shiftInput).toHaveValue(new RegExp(expected.shift, 'i'));
  283 |   }
  284 | 
  285 |   async expectCategoryTabsVisible(categoryNames: string[]) {
  286 |     for (const categoryName of categoryNames) {
  287 |       await expect(this.categoryTab(categoryName)).toBeVisible({ timeout: 15000 });
  288 |     }
  289 |   }
  290 | 
  291 |   async selectCategoryTab(categoryName: string) {
  292 |     await this.categoryTab(categoryName).click();
  293 |     await this.page.waitForTimeout(500);
  294 |   }
  295 | 
  296 |   async expectEntitlementsTableVisible() {
  297 |     await expect(this.entitlementsTable).toBeVisible();
  298 |     await expect(this.categoryHeader.or(this.cycleHeader)).toBeVisible();
  299 |     await expect(this.entitlementDaysHeader).toBeVisible();
  300 |     await expect(this.entitlementDataRows().first()).toBeVisible({ timeout: 15000 });
  301 |   }
  302 | 
  303 |   async expectCategoryEntitlement(
  304 |     categoryName: string,
  305 |     expectation: EntitlementRowExpectation,
  306 |   ) {
  307 |     const tab = this.page.getByRole('listitem').filter({ hasText: categoryName }).first();
  308 |     if (await tab.isVisible().catch(() => false)) {
  309 |       await tab.click();
  310 |       await this.page.waitForTimeout(500);
  311 |     }
  312 | 
  313 |     const row = this.categoryRow(categoryName);
  314 |     await expect(row).toBeVisible({ timeout: 15000 });
  315 |     await expect(row).toContainText(expectation.days);
  316 | 
  317 |     if (await this.frequencyTypeLabel.isVisible().catch(() => false)) {
  318 |       await expect(
  319 |         this.page.getByText(new RegExp(`Frequency Type:\\s*${expectation.frequency}`, 'i')),
  320 |       ).toBeVisible();
  321 |     }
  322 | 
  323 |     if (expectation.cyclePattern) {
  324 |       const tableText = (await this.entitlementsTable.innerText()).replace(/\s+/g, ' ');
  325 |       if (expectation.cyclePattern.test(tableText)) {
  326 |         expect(tableText).toMatch(expectation.cyclePattern);
  327 |       }
  328 |     }
  329 | 
  330 |     const spinbutton = row.getByRole('spinbutton');
  331 |     if (await spinbutton.first().isVisible().catch(() => false)) {
  332 |       await expect(spinbutton.first()).toHaveValue(expectation.days);
  333 |     }
  334 |   }
  335 | 
  336 |   async loadEntitlements() {
  337 |     await this.loadEntitlementsButton.click();
  338 | 
  339 |     if (await this.confirmYesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
  340 |       await this.confirmYesButton.click();
  341 |     }
  342 | 
  343 |     await this.expectLoadOutcome();
  344 |   }
  345 | 
  346 |   async expectLoadOutcome() {
  347 |     const successVisible = await this.successToast
  348 |       .isVisible({ timeout: 15000 })
  349 |       .catch(() => false);
  350 | 
  351 |     if (successVisible) {
  352 |       return;
  353 |     }
  354 | 
  355 |     const pageText = (await this.page.locator('body').innerText()).replace(/\s+/g, ' ');
  356 |     const alreadyLoaded =
  357 |       /already|exist|duplicate|loaded|entitled/i.test(pageText) &&
  358 |       !/Leave Entitlement added/i.test(pageText);
  359 | 
  360 |     expect(
  361 |       alreadyLoaded,
  362 |       'expected success toast or an already-loaded entitlement message',
  363 |     ).toBeTruthy();
  364 |   }
  365 | 
  366 |   async expectSuccessToast() {
  367 |     await expect(this.successToast).toBeVisible({ timeout: 15000 });
  368 |   }
  369 | 
  370 |   async dismissToastIfPresent() {
  371 |     const failureIcon = this.page.getByRole('img', { name: /failure icon/i });
  372 |     if (await failureIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
```