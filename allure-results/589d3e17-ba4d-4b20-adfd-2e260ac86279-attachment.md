# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: probation.spec.ts >> Probation Flow >> 03. RM Pending Approvals queue >> shows probation employee in Pending Approvals Onboarding Probation
- Location: tests\probation.spec.ts:47:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('row').filter({ hasText: 'harshitha Palagiriii' }).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('row').filter({ hasText: 'harshitha Palagiriii' }).first()

```

```yaml
- img "Company Logo"
- img
- img
- img
- paragraph: Induu Priyaa
- paragraph: Chief Executive Officer
- img
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
- text: Pending Approvals  Onboarding
- img
- list:
  - listitem:
    - img "Icon"
    - text: Offer Letter (0)
  - listitem:
    - img "Icon"
    - text: Contract Offer Letter (0)
  - listitem:
    - img "Icon"
    - text: Trainee Offer Letter (0)
  - listitem:
    - img "Icon"
    - text: Trainee Appointment Letter (0)
  - listitem:
    - img "Icon"
    - text: Appointment Letter (0)
  - listitem:
    - img "Icon"
    - text: Non-Disclosure Agreement Letter (0)
  - listitem:
    - img "Icon"
    - text: Probation (2)
  - listitem:
    - img "Icon"
    - text: Trainees (0)
- text: 
- searchbox "Username"
- table:
  - rowgroup:
    - row "Employee ID Employee Name Probation Start Date Probation End Date Approved History Action":
      - columnheader "Employee ID":
        - text: Employee ID
        - img
      - columnheader "Employee Name":
        - text: Employee Name
        - img
      - columnheader "Probation Start Date":
        - text: Probation Start Date
        - img
      - columnheader "Probation End Date":
        - text: Probation End Date
        - img
      - columnheader "Approved History"
      - columnheader "Action"
  - rowgroup:
    - row "SIST0011 Imran Mar 11, 2026 Mar 29, 2026 - Assessment form":
      - cell "SIST0011"
      - cell "Imran"
      - cell "Mar 11, 2026"
      - cell "Mar 29, 2026"
      - cell "-"
      - cell "Assessment form":
        - button "Assessment form"
    - row "SIS0005 Thanuja Kumari Mar 27, 2026 Apr 14, 2026 - Assessment form":
      - cell "SIS0005"
      - cell "Thanuja Kumari"
      - cell "Mar 27, 2026"
      - cell "Apr 14, 2026"
      - cell "-"
      - cell "Assessment form":
        - button "Assessment form"
```

# Test source

```ts
  406 |   }
  407 | 
  408 |   pendingRowKebab(row: Locator) {
  409 |     return row.locator('.dropdown > a').last();
  410 |   }
  411 | 
  412 |   pendingActionOption(row: Locator, actionName: string) {
  413 |     const pattern = new RegExp(actionName, 'i');
  414 |     return this.page.locator('.dropdown-menu.show a.dropdown-item, .dropdown-menu.show .dropdown-item, .show a.dropdown-item')
  415 |       .filter({ hasText: pattern })
  416 |       .or(row.locator('a.dropdown-item, .dropdown-item, button').filter({ hasText: pattern }))
  417 |       .or(this.page.getByRole('menuitem', { name: actionName }))
  418 |       .or(this.page.getByRole('button', { name: actionName }));
  419 |   }
  420 | 
  421 |   async openPendingRowKebab(row: Locator) {
  422 |     const openMenu = row.locator('ul.dropdown-menu.show, .dropdown-menu.show').first();
  423 |     if (await openMenu.isVisible().catch(() => false)) {
  424 |       return;
  425 |     }
  426 | 
  427 |     const kebab = this.pendingRowKebab(row);
  428 |     await kebab.waitFor({ state: 'visible', timeout: 15000 });
  429 |     await kebab.click();
  430 |     await openMenu.waitFor({ state: 'visible', timeout: 10000 });
  431 |   }
  432 | 
  433 |   async clickPendingRowAction(
  434 |     employeeName: string,
  435 |     actionName: 'Assessment form' | 'Process',
  436 |     searchText?: string,
  437 |   ) {
  438 |     if (actionName === 'Assessment form' && (await this.isAssessmentFormVisible())) {
  439 |       await expect(this.page.getByText(this.employeeNamePattern(employeeName)).first()).toBeVisible({
  440 |         timeout: 15000,
  441 |       });
  442 |       return;
  443 |     }
  444 | 
  445 |     let row = this.pendingRow(employeeName).first();
  446 |     if (!(await row.isVisible().catch(() => false)) && searchText) {
  447 |       await this.filterPendingProbationEmployee(searchText);
  448 |     }
  449 |     await row.waitFor({ state: 'visible', timeout: 15000 });
  450 | 
  451 |     const rowButton = row.getByRole('button', { name: actionName });
  452 |     if (await rowButton.isVisible().catch(() => false)) {
  453 |       await rowButton.click();
  454 |       return;
  455 |     }
  456 | 
  457 |     await this.openPendingRowKebab(row);
  458 |     await row.locator('ul.dropdown-menu.show, .dropdown-menu.show')
  459 |       .getByText(actionName, { exact: true })
  460 |       .click();
  461 |   }
  462 | 
  463 |   async assertPendingRowActionVisible(
  464 |     employeeName: string,
  465 |     actionName: 'Assessment form' | 'Process',
  466 |     searchText?: string,
  467 |   ) {
  468 |     if (actionName === 'Assessment form' && (await this.isAssessmentFormVisible())) {
  469 |       await expect(this.page.getByText(this.employeeNamePattern(employeeName)).first()).toBeVisible({
  470 |         timeout: 15000,
  471 |       });
  472 |       return;
  473 |     }
  474 | 
  475 |     let row = this.pendingRow(employeeName).first();
  476 |     if (!(await row.isVisible().catch(() => false)) && searchText) {
  477 |       await this.filterPendingProbationEmployee(searchText);
  478 |     }
  479 |     await expect(row).toBeVisible({ timeout: 15000 });
  480 | 
  481 |     const rowButton = row.getByRole('button', { name: actionName });
  482 |     if (await rowButton.isVisible().catch(() => false)) {
  483 |       await expect(rowButton).toBeVisible();
  484 |       return;
  485 |     }
  486 | 
  487 |     await this.openPendingRowKebab(row);
  488 |     await expect(this.pendingActionOption(row, actionName).first()).toBeVisible({ timeout: 10000 });
  489 |   }
  490 | 
  491 |   async assertEmployeeInPendingProbationQueue(employeeName: string, employeeId?: string, searchText?: string) {
  492 |     await this.openPendingOnboardingProbation();
  493 | 
  494 |     if (await this.isAssessmentFormVisible()) {
  495 |       await expect(this.page.getByText(this.employeeNamePattern(employeeName)).first()).toBeVisible({
  496 |         timeout: 15000,
  497 |       });
  498 |       return;
  499 |     }
  500 | 
  501 |     if (searchText) {
  502 |       await this.filterPendingProbationEmployee(searchText);
  503 |     }
  504 | 
  505 |     const row = this.pendingRow(employeeName).first();
> 506 |     await expect(row).toBeVisible({ timeout: 15000 });
      |                       ^ Error: expect(locator).toBeVisible() failed
  507 |     if (employeeId) {
  508 |       await expect(row.getByRole('cell', { name: employeeId })).toBeVisible();
  509 |     }
  510 |   }
  511 | 
  512 |   async openHrProcessDialog(employeeName: string) {
  513 |     await this.openPendingOnboardingProbation();
  514 |     await this.clickPendingRowAction(employeeName, 'Process');
  515 |     await this.hrProcessDialog.waitFor({ state: 'visible', timeout: 15000 });
  516 |   }
  517 | 
  518 |   async selectHrApprovalForm(role: 'Reporting Manager' | 'Team Manager') {
  519 |     const dropdown = this.hrProcessDialog.getByRole('combobox', { name: 'Please select' });
  520 |     await dropdown.click();
  521 | 
  522 |     const rolePattern = role === 'Reporting Manager' ? /Reporting Manager|\bRM\b/i : /Team Manager|\bTM\b/i;
  523 |     const option = this.page.getByRole('option').filter({ hasText: rolePattern }).first();
  524 |     if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
  525 |       await option.click();
  526 |       return;
  527 |     }
  528 | 
  529 |     await this.page.getByRole('option').first().click();
  530 |   }
  531 | 
  532 |   async selectHrExtendOption() {
  533 |     await this.hrProcessDialog.getByRole('radio', { name: 'Extend' }).click();
  534 |     await expect(this.hrExtendRadio).toBeChecked({ timeout: 10000 });
  535 |     await expect(this.hrProcessDialog.getByText(/Extend Date/i)).toBeVisible({ timeout: 10000 });
  536 |     await expect(this.hrProcessDialog.getByRole('textbox', { name: 'Default select example' })).toBeVisible({ timeout: 10000 });
  537 |     await this.hrExtendFeedbackInput.waitFor({ state: 'visible', timeout: 10000 });
  538 |   }
  539 | 
  540 |   async pickHrExtendDate() {
  541 |     const dateField = this.hrProcessDialog.getByRole('textbox', { name: 'Default select example' });
  542 |     await dateField.waitFor({ state: 'visible', timeout: 10000 });
  543 | 
  544 |     let value = (await dateField.inputValue().catch(() => '')).trim();
  545 |     if (value) {
  546 |       return;
  547 |     }
  548 | 
  549 |     const pickFromOpenPanel = async () => {
  550 |       const panel = this.page.locator('.p-dropdown-panel, .p-select-overlay, .p-select-list, .p-select-panel, [role="listbox"]').last();
  551 |       if (!(await panel.isVisible({ timeout: 3000 }).catch(() => false))) {
  552 |         return false;
  553 |       }
  554 |       const option = panel.locator('li, [role="option"], .p-select-option').filter({ hasText: /\d/ }).first();
  555 |       if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
  556 |         await option.click();
  557 |         return true;
  558 |       }
  559 |       return false;
  560 |     };
  561 | 
  562 |     const pickFromCalendar = async () => {
  563 |       const calendar = this.page.locator('.p-datepicker-panel, .p-datepicker').first();
  564 |       if (!(await calendar.isVisible({ timeout: 3000 }).catch(() => false))) {
  565 |         return false;
  566 |       }
  567 |       let day = calendar.locator('td:not(.p-disabled):not(.p-datepicker-other-month) span').first();
  568 |       if (!(await day.isVisible({ timeout: 2000 }).catch(() => false))) {
  569 |         const nextMonth = calendar.locator('.p-datepicker-next, button[aria-label*="Next" i]').first();
  570 |         if (await nextMonth.isVisible().catch(() => false)) {
  571 |           await nextMonth.click();
  572 |         }
  573 |         day = calendar.locator('td:not(.p-disabled):not(.p-datepicker-other-month) span').first();
  574 |       }
  575 |       if (await day.isVisible({ timeout: 2000 }).catch(() => false)) {
  576 |         await day.click();
  577 |         return true;
  578 |       }
  579 |       return false;
  580 |     };
  581 | 
  582 |     await dateField.click();
  583 |     if (await pickFromOpenPanel()) {
  584 |       value = (await dateField.inputValue().catch(() => '')).trim();
  585 |     }
  586 | 
  587 |     if (!value) {
  588 |       await dateField.click();
  589 |       await this.page.keyboard.press('ArrowDown');
  590 |       await this.page.keyboard.press('Enter');
  591 |       value = (await dateField.inputValue().catch(() => '')).trim();
  592 |     }
  593 | 
  594 |     if (!value) {
  595 |       const extendDateBlock = this.hrProcessDialog.locator('div').filter({ hasText: /Extend Date/i }).last();
  596 |       const dateDropdown = extendDateBlock.locator('.p-dropdown, p-dropdown, p-select').first()
  597 |         .or(this.hrProcessDialog.locator('.p-dropdown, p-dropdown, p-select').nth(1));
  598 |       if (await dateDropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
  599 |         await dateDropdown.click();
  600 |         if (await pickFromOpenPanel()) {
  601 |           value = (await dateField.inputValue().catch(() => '')).trim();
  602 |         }
  603 |       }
  604 |     }
  605 | 
  606 |     if (!value && await pickFromCalendar()) {
```