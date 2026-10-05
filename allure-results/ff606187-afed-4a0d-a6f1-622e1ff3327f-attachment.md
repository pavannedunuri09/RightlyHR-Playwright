# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: my-info.spec.ts >> My Info Module Automation Suite >> TC07 - Identity Information CRUD
- Location: tests\my-info.spec.ts:132:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="option"], .p-select-option').filter({ hasText: /^\s*Payslips\s*$/ }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[role="option"], .p-select-option').filter({ hasText: /^\s*Payslips\s*$/ }).first()

```

```yaml
- dialog:
  - document:
    - paragraph: Add Identity Info
    - text: Identity Type*
    - combobox "Please select identity type" [expanded]
    - button "dropdown trigger" [expanded]
    - listbox "Option List":
      - option "PF"
      - option "Pass Book"
      - option "dfh"
      - option "PAN"
      - option "Passport"
      - option "License"
      - option "ESIC"
      - option "Aadhaar"
      - option "UAN"
    - text: Identity Number*
    - textbox "Identity Type* Identity Number*":
      - /placeholder: Please enter Identity Number
    - text: Attachment (Upload the Image/PDF)*
    - button "Choose File"
    - paragraph: "Note: Only Pdf/Image files are allowed. The file size should be less than 25MB."
    - button "Cancel"
    - button "Add" [disabled]
```

# Test source

```ts
  144 |     await this.navigateToMyInfo();
  145 |     await this.openPersonalTab();
  146 | 
  147 |     const tabRouteMap: Record<string, string> = {
  148 |       'Basic Info': '/myinfo/personal/basic-info',
  149 |       'Contact Info': '/myinfo/personal/contact-details',
  150 |       'Addresses': '/myinfo/personal/address-info',
  151 |       'Emergency Contacts': '/myinfo/personal/emergency-contact-details',
  152 |       'Family Members': '/myinfo/personal/family-details',
  153 |       'Identity Info': '/myinfo/personal/identity-details',
  154 |       'Bank Info': '/myinfo/personal/bank-details',
  155 |       'Academics': '/myinfo/personal/education-details',
  156 |       'Skills': '/myinfo/personal/my-skills',
  157 |     };
  158 | 
  159 |     const targetRoute = tabRouteMap[tabName];
  160 |     if (targetRoute && this.page.url().includes(targetRoute)) {
  161 |       return;
  162 |     }
  163 | 
  164 |     const subTab = this.page.locator(`img[alt="${tabName}"]`).first();
  165 |     if (await subTab.isVisible({ timeout: 3000 }).catch(() => false)) {
  166 |       await subTab.click();
  167 |     } else if (targetRoute) {
  168 |       await this.page.goto(targetRoute, { waitUntil: 'domcontentloaded' });
  169 |     }
  170 | 
  171 |     if (targetRoute) {
  172 |       await expect(this.page).toHaveURL(new RegExp(targetRoute), { timeout: 15000 });
  173 |     }
  174 |   }
  175 | 
  176 |   async openJobTab() {
  177 |     await this.navigateToMyInfo();
  178 |     const jobTab = this.page.locator('a.nav-link').filter({ hasText: 'Job' }).first();
  179 |     await expect(jobTab).toBeVisible({ timeout: 15000 });
  180 |     await jobTab.click();
  181 |     await expect(this.page).toHaveURL(/\/myinfo\/job/, { timeout: 15000 });
  182 |   }
  183 | 
  184 |   async openDocumentsTab() {
  185 |     await this.navigateToMyInfo();
  186 |     if (this.page.url().includes('/myinfo/documents')) return;
  187 |     const docsTab = this.page.locator('a.nav-link').filter({ hasText: 'Documents' }).first();
  188 |     if (await docsTab.isVisible({ timeout: 3000 }).catch(() => false)) {
  189 |       await docsTab.click();
  190 |     } else {
  191 |       await this.page.goto('/myinfo/documents/general-documents', { waitUntil: 'domcontentloaded' });
  192 |     }
  193 |     await expect(this.page).toHaveURL(/\/myinfo\/documents/, { timeout: 15000 });
  194 |   }
  195 | 
  196 |   // ==========================================
  197 |   // HELPERS
  198 |   // ==========================================
  199 | 
  200 |   private async clickEditIcon(_container?: string) {
  201 |     const saveBtn = this.page.getByRole('button', { name: 'Save', exact: true });
  202 |     if (await saveBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  203 |       return;
  204 |     }
  205 | 
  206 |     const editBtn = this.page.locator('app-edit-icon').first();
  207 |     await expect(editBtn).toBeVisible({ timeout: 15000 });
  208 |     await editBtn.click();
  209 |     await expect(saveBtn).toBeVisible({ timeout: 15000 });
  210 |   }
  211 | 
  212 |   private async openDropdown(dropdown: Locator) {
  213 |     const trigger = dropdown.locator('.custom-p-select-content, .p-select-dropdown, [role="combobox"]').first();
  214 |     if (await trigger.isVisible({ timeout: 3000 }).catch(() => false)) {
  215 |       await trigger.click();
  216 |     } else {
  217 |       await dropdown.click();
  218 |     }
  219 |   }
  220 | 
  221 |   private async selectIndiaCountryCode(phoneInput: Locator) {
  222 |     const countryCombo = phoneInput.locator('xpath=preceding::*[@role="combobox"][1]');
  223 |     await countryCombo.click();
  224 | 
  225 |     const search = this.page.locator('lib-country-list input').first();
  226 |     if (await search.isVisible().catch(() => false)) {
  227 |       await search.fill('India');
  228 |     }
  229 | 
  230 |     const india = this.page.getByRole('listbox').getByText('India (भारत)', { exact: true });
  231 |     await india.scrollIntoViewIfNeeded();
  232 |     await india.click();
  233 |     await this.page.locator('lib-country-list').first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  234 |   }
  235 | 
  236 |   private async selectDropdownOption(dropdown: Locator, optionText: string) {
  237 |     await this.openDropdown(dropdown);
  238 | 
  239 |     const option = this.page
  240 |       .locator('[role="option"], .p-select-option')
  241 |       .filter({ hasText: new RegExp(`^\\s*${optionText}\\s*$`) })
  242 |       .first();
  243 | 
> 244 |     await expect(option).toBeVisible({ timeout: 10000 });
      |                          ^ Error: expect(locator).toBeVisible() failed
  245 |     await option.click();
  246 |   }
  247 | 
  248 |   private async setFileInput(buttonOrInput: Locator, filePath: string) {
  249 |     const dialog = this.page.locator('.modal.show, ngb-modal-window, [role="dialog"], .p-dialog').first();
  250 |     const modalInput = dialog.locator('input[type="file"]').first();
  251 | 
  252 |     if (await modalInput.count() > 0) {
  253 |       await modalInput.setInputFiles(filePath);
  254 |       await modalInput.evaluate((el: HTMLInputElement) => {
  255 |         el.dispatchEvent(new Event('input', { bubbles: true }));
  256 |         el.dispatchEvent(new Event('change', { bubbles: true }));
  257 |       }).catch(() => {});
  258 |     } else if (await buttonOrInput.isVisible({ timeout: 1000 }).catch(() => false)) {
  259 |       await buttonOrInput.setInputFiles(filePath);
  260 |       await buttonOrInput.evaluate((el: HTMLInputElement) => {
  261 |         el.dispatchEvent(new Event('input', { bubbles: true }));
  262 |         el.dispatchEvent(new Event('change', { bubbles: true }));
  263 |       }).catch(() => {});
  264 |     } else {
  265 |       const lastInput = this.page.locator('input[type="file"]').last();
  266 |       await lastInput.setInputFiles(filePath);
  267 |       await lastInput.evaluate((el: HTMLInputElement) => {
  268 |         el.dispatchEvent(new Event('input', { bubbles: true }));
  269 |         el.dispatchEvent(new Event('change', { bubbles: true }));
  270 |       }).catch(() => {});
  271 |     }
  272 |   }
  273 | 
  274 |   private async confirmYes() {
  275 |     const yesButton = this.page
  276 |       .getByRole('dialog')
  277 |       .getByRole('button', { name: 'Yes', exact: true })
  278 |       .or(this.page.getByRole('button', { name: 'Yes', exact: true }))
  279 |       .first();
  280 | 
  281 |     await expect(yesButton).toBeVisible({ timeout: 10000 });
  282 |     await yesButton.click();
  283 |   }
  284 | 
  285 |   private async waitForDialogClose() {
  286 |     const dialog = this.page.getByRole('dialog').or(this.page.locator('ngb-modal-window'));
  287 |     await expect(dialog).toBeHidden({ timeout: 15000 }).catch(() => {});
  288 |   }
  289 | 
  290 |   // ==========================================
  291 |   // 1. PERSONAL INFORMATION (BASIC INFO)
  292 |   // ==========================================
  293 | 
  294 |   async openBasicInfo() {
  295 |     await this.openPersonalSubTab('Basic Info');
  296 |   }
  297 | 
  298 |   async selectSalutation(value: string) {
  299 |     const dropdown = this.page.locator('p-select[formcontrolname="salutation"]');
  300 |     await expect(dropdown).toBeVisible({ timeout: 15000 });
  301 |     await this.openDropdown(dropdown);
  302 |     await this.page.getByRole('option', { name: value, exact: true }).click();
  303 |   }
  304 | 
  305 |   async selectGender(gender: 'Male' | 'Female') {
  306 |     const dropdown = this.page.locator('p-select[formcontrolname="gender"]');
  307 |     await expect(dropdown).toBeVisible({ timeout: 15000 });
  308 |     await this.openDropdown(dropdown);
  309 |     await this.page.getByRole('option', { name: gender, exact: true }).click();
  310 |   }
  311 | 
  312 |   async selectBloodGroup(value: string) {
  313 |     const dropdown = this.page.locator('p-select[formcontrolname="bloodGroup"]');
  314 |     await expect(dropdown).toBeVisible({ timeout: 15000 });
  315 |     await this.openDropdown(dropdown);
  316 |     await this.page.getByRole('option', { name: value, exact: true }).click();
  317 |   }
  318 | 
  319 |   async selectMaritalStatus(value: 'Single' | 'Married') {
  320 |     const dropdown = this.page.locator('p-select[formcontrolname="maritalStatus"]');
  321 |     await expect(dropdown).toBeVisible({ timeout: 15000 });
  322 |     await this.openDropdown(dropdown);
  323 |     await this.page.getByRole('option', { name: value, exact: true }).click();
  324 |   }
  325 | 
  326 |   async updatePersonalInfo(data: PersonalInfoData) {
  327 |     await this.openBasicInfo();
  328 |     await this.clickEditIcon();
  329 | 
  330 |     if (data.salutation) {
  331 |       await this.selectSalutation(data.salutation);
  332 |     }
  333 | 
  334 |     if (data.gender) {
  335 |       await this.selectGender(data.gender);
  336 |     }
  337 | 
  338 |     if (data.firstName) {
  339 |       const firstNameInput = this.page.locator('input[formcontrolname="firstName"]');
  340 |       await firstNameInput.fill(data.firstName);
  341 |     }
  342 | 
  343 |     if (data.middleName !== undefined) {
  344 |       const middleNameInput = this.page.locator('input[formcontrolname="middleName"]');
```