# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-entitlements.spec.ts >> Load Entitlements >> 01. navigates to Load Entitlements and shows read-only employee detail fields
- Location: tests\load-entitlements.spec.ts:41:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByText('Employee Id', { exact: true }) to be visible

```

# Page snapshot

```yaml
- generic [ref=f2e4]:
  - generic [ref=f2e8]:
    - img "Company Logo" [ref=f2e10]
    - generic [ref=f2e11]:
      - generic [ref=f2e12] [cursor=pointer]
      - generic [ref=f2e20] [cursor=pointer]
      - generic [ref=f2e28] [cursor=pointer]: 
      - generic [ref=f2e32] [cursor=pointer]
      - generic [ref=f2e42] [cursor=pointer]:
        - generic [ref=f2e43]:
          - paragraph [ref=f2e44]: saii Pavan Dinesh Tejaa
          - paragraph [ref=f2e45]: QA Tester
        - img "Profile Image" [ref=f2e47]
  - generic [ref=f2e48]:
    - generic [ref=f2e51]:
      - list [ref=f2e53]:
        - listitem [ref=f2e54] [cursor=pointer]:
          - img "Icon" [ref=f2e55]
          - text: Dashboard
        - listitem [ref=f2e56]:
          - generic [ref=f2e57]:
            - generic [ref=f2e58] [cursor=pointer]:
              - img "Icon" [ref=f2e59]
              - text: My Info
            - generic [ref=f2e60] [cursor=pointer]:
              - img "Icon" [ref=f2e61]
              - text: Employees
            - generic [ref=f2e64] [cursor=pointer]:
              - img "Icon" [ref=f2e65]
              - text: Time Off
            - generic [ref=f2e66] [cursor=pointer]:
              - img "Icon" [ref=f2e67]
              - text: Attendance
            - generic [ref=f2e68] [cursor=pointer]:
              - img "Icon" [ref=f2e69]
              - text: Reports
            - generic [ref=f2e72] [cursor=pointer]:
              - img "Icon" [ref=f2e73]
              - text: Project Management
            - generic [ref=f2e74] [cursor=pointer]:
              - img "Icon" [ref=f2e75]
              - text: Skill Set
            - generic [ref=f2e78] [cursor=pointer]:
              - img "Icon" [ref=f2e79]
              - text: On Behalf Of
            - generic [ref=f2e82] [cursor=pointer]:
              - img "Icon" [ref=f2e83]
              - text: Pending Approvals
            - generic [ref=f2e86] [cursor=pointer]:
              - img "Icon" [ref=f2e87]
              - text: PMS
        - listitem [ref=f2e88] [cursor=pointer]:
          - img "Icons" [ref=f2e91]
      - img "Powered By logo" [ref=f2e94]
    - generic [ref=f2e98]:
      - generic [ref=f2e102]:
        - generic [ref=f2e103] [cursor=pointer]: Settings
        - generic [ref=f2e104]: 
        - generic [ref=f2e106]: Time Off
        - generic [ref=f2e107]: 
        - generic [ref=f2e109]: Load Entitlements
      - generic [ref=f2e112]:
        - generic [ref=f2e113]:
          - generic [ref=f2e114]:
            - generic [ref=f2e115]: Load Entitlements
            - generic [ref=f2e116]:
              - generic [ref=f2e117]:
                - generic [ref=f2e118]: Select Employee *
                - generic [ref=f2e120] [cursor=pointer]:
                  - combobox "Please select Employee" [ref=f2e121]
                  - button "dropdown trigger" [ref=f2e122]
              - generic [ref=f2e126]:
                - generic [ref=f2e127]: Work Email
                - textbox "Work Email" [disabled] [ref=f2e128]
              - generic [ref=f2e129]:
                - generic [ref=f2e130]: Date of Joining
                - textbox "Date of Joining" [disabled] [ref=f2e131]
              - generic [ref=f2e132]:
                - generic [ref=f2e133]: Location
                - textbox "Location" [disabled] [ref=f2e134]
              - generic [ref=f2e135]:
                - generic [ref=f2e136]: Sub Location
                - textbox "Sub Location" [disabled] [ref=f2e137]
              - generic [ref=f2e138]:
                - generic [ref=f2e139]: Shift
                - textbox "Shift" [disabled] [ref=f2e140]
          - button "Load Entitlements" [disabled] [ref=f2e142] [cursor=pointer]
        - text:  
```

# Test source

```ts
  128 |       this.shiftInput,
  129 |       this.firstNameInput,
  130 |       this.lastNameInput,
  131 |     ];
  132 |   }
  133 | 
  134 |   categoryTab(categoryName: string) {
  135 |     return this.page
  136 |       .getByRole('listitem')
  137 |       .filter({ hasText: categoryName })
  138 |       .or(this.categoryRow(categoryName))
  139 |       .first();
  140 |   }
  141 | 
  142 |   categoryRow(categoryName: string) {
  143 |     return this.entitlementsTable.getByRole('row').filter({ hasText: categoryName }).first();
  144 |   }
  145 | 
  146 |   completedEntitlementRow(categoryName: string) {
  147 |     return this.page
  148 |       .getByRole('row')
  149 |       .filter({ hasText: categoryName })
  150 |       .filter({ hasText: /Completed/i })
  151 |       .first();
  152 |   }
  153 | 
  154 |   async hasCompletedEntitlements() {
  155 |     const statusHeaderVisible = await this.page
  156 |       .getByRole('columnheader', { name: /Status/i })
  157 |       .isVisible()
  158 |       .catch(() => false);
  159 |     const completedVisible = await this.page
  160 |       .getByRole('cell', { name: /^Completed$/i })
  161 |       .first()
  162 |       .isVisible()
  163 |       .catch(() => false);
  164 |     return statusHeaderVisible && completedVisible;
  165 |   }
  166 | 
  167 |   async expectCompletedEntitlement(
  168 |     categoryName: string,
  169 |     days: string,
  170 |     frequency: string,
  171 |   ) {
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
> 228 |     await this.page.getByText('Employee Id', { exact: true }).waitFor({ state: 'visible', timeout: 15000 });
      |                                                               ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
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
  272 |       await expect(field).toBeVisible();
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
```