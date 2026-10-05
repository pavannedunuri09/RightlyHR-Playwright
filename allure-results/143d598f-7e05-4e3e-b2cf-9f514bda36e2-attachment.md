# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: probation.spec.ts >> Probation Flow — HR Reject and Extend from Rejected >> 08. HR Process Reject probation decision >> rejects probation from HR Process popup in Pending Approvals Probation queue
- Location: tests\probation.spec.ts:141:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('row').filter({ hasText: 'harshitha Palagiriii' }).first().locator('.dropdown > a').last() to be visible

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e8]:
    - img "Company Logo" [ref=e10]
    - generic [ref=e11]:
      - generic [ref=e12] [cursor=pointer]
      - generic [ref=e20] [cursor=pointer]
      - generic [ref=e28] [cursor=pointer]
      - generic [ref=e39] [cursor=pointer]:
        - paragraph [ref=e40]: Induu Priyaa
        - paragraph [ref=e41]: Chief Executive Officer
  - generic [ref=e47]:
    - generic [ref=e50]:
      - list [ref=e52]:
        - listitem [ref=e53] [cursor=pointer]:
          - img "Icon" [ref=e54]
          - text: Dashboard
        - listitem [ref=e55]:
          - generic [ref=e56]:
            - generic [ref=e57] [cursor=pointer]:
              - img "Icon" [ref=e58]
              - text: My Info
            - generic [ref=e59] [cursor=pointer]:
              - img "Icon" [ref=e60]
              - text: Employees
            - generic [ref=e63] [cursor=pointer]:
              - img "Icon" [ref=e64]
              - text: Time Off
            - generic [ref=e65] [cursor=pointer]:
              - img "Icon" [ref=e66]
              - text: Attendance
            - generic [ref=e67] [cursor=pointer]:
              - img "Icon" [ref=e68]
              - text: Reports
            - generic [ref=e71] [cursor=pointer]:
              - img "Icon" [ref=e72]
              - text: Project Management
            - generic [ref=e73] [cursor=pointer]:
              - img "Icon" [ref=e74]
              - text: Skill Set
            - generic [ref=e77] [cursor=pointer]:
              - img "Icon" [ref=e78]
              - text: On Behalf Of
            - generic [ref=e81] [cursor=pointer]:
              - img "Icon" [ref=e82]
              - text: Pending Approvals
            - generic [ref=e85] [cursor=pointer]:
              - img "Icon" [ref=e86]
              - text: PMS
        - listitem [ref=e87] [cursor=pointer]:
          - img "Icons" [ref=e90]
      - img "Powered By logo" [ref=e93]
    - generic [ref=e97]:
      - generic [ref=e99]:
        - generic [ref=e100]:
          - text: Pending Approvals
          - generic [ref=e101]: 
        - generic [ref=e103]: Onboarding
        - generic [ref=e106] [cursor=pointer]
      - generic [ref=e110]:
        - list [ref=e114]:
          - listitem [ref=e115]:
            - generic [ref=e116] [cursor=pointer]:
              - img "Icon" [ref=e117]
              - generic [ref=e118]: Offer Letter
              - generic [ref=e119]: (0)
          - listitem [ref=e121]:
            - generic [ref=e122] [cursor=pointer]:
              - img "Icon" [ref=e123]
              - generic [ref=e124]: Contract Offer Letter
              - generic [ref=e125]: (0)
          - listitem [ref=e127]:
            - generic [ref=e128] [cursor=pointer]:
              - img "Icon" [ref=e129]
              - generic [ref=e130]: Trainee Offer Letter
              - generic [ref=e131]: (0)
          - listitem [ref=e133]:
            - generic [ref=e134] [cursor=pointer]:
              - img "Icon" [ref=e135]
              - generic [ref=e136]: Trainee Appointment Letter
              - generic [ref=e137]: (0)
          - listitem [ref=e139]:
            - generic [ref=e140] [cursor=pointer]:
              - img "Icon" [ref=e141]
              - generic [ref=e142]: Appointment Letter
              - generic [ref=e143]: (0)
          - listitem [ref=e145]:
            - generic [ref=e146] [cursor=pointer]:
              - img "Icon" [ref=e147]
              - generic [ref=e148]: Non-Disclosure Agreement Letter
              - generic [ref=e149]: (0)
          - listitem [ref=e151]:
            - generic [ref=e152] [cursor=pointer]:
              - img "Icon" [ref=e153]
              - generic [ref=e154]: Probation
              - generic [ref=e155]: (3)
          - listitem [ref=e157]:
            - generic [ref=e158] [cursor=pointer]:
              - img "Icon" [ref=e159]
              - generic [ref=e160]: Trainees
              - generic [ref=e161]: (0)
        - generic [ref=e164]:
          - generic [ref=e165]:
            - generic [ref=e166]: 
            - searchbox "Username" [active] [ref=e168]: hars
          - table [ref=e173]:
            - rowgroup [ref=e174]:
              - row [ref=e175]:
                - columnheader [ref=e176] [cursor=pointer]
                - columnheader [ref=e185] [cursor=pointer]
                - columnheader [ref=e194] [cursor=pointer]
                - columnheader [ref=e203] [cursor=pointer]
                - columnheader "Approved History" [ref=e212]
                - columnheader "Action" [ref=e213]
            - rowgroup [ref=e214]:
              - row [ref=e215]:
                - cell "SD3021343" [ref=e216]
                - cell "harshitha Palagiriii" [ref=e217]
                - cell "Feb 2, 2026" [ref=e218]
                - cell "Apr 2, 2026" [ref=e219]
                - cell "-" [ref=e220]
                - cell [ref=e221]:
                  - button "Assessment form" [ref=e223] [cursor=pointer]
```

# Test source

```ts
  328 |       '/pending-approvals/onboarding/probation',
  329 |     ]) {
  330 |       await this.page.goto(path, { waitUntil: 'domcontentloaded' }).catch(() => {});
  331 |       if (await this.isProbationQueueReady({ timeout: 8000 })) {
  332 |         return;
  333 |       }
  334 |     }
  335 | 
  336 |     await this.pendingQueueReady();
  337 |   }
  338 | 
  339 |   private async openPendingOnboardingProbationViaMenu() {
  340 |     const pendingNav = this.pendingApprovalsToggle.first();
  341 |     if (!(await pendingNav.isVisible().catch(() => false))) {
  342 |       await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' }).catch(() => {});
  343 |       await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
  344 |     }
  345 | 
  346 |     await pendingNav.waitFor({ state: 'visible', timeout: 15000 });
  347 |     await pendingNav.click();
  348 | 
  349 |     const onboardingTab = this.pendingOnboardingTab.first();
  350 |     await onboardingTab.waitFor({ state: 'visible', timeout: 15000 });
  351 |     await onboardingTab.click();
  352 | 
  353 |     const probationTab = this.probationPendingTab.first();
  354 |     await probationTab.waitFor({ state: 'visible', timeout: 15000 });
  355 |     await probationTab.click();
  356 |   }
  357 | 
  358 |   private probationQueueMarker() {
  359 |     return this.page.getByRole('columnheader', { name: 'Employee ID' })
  360 |       .or(this.page.getByRole('columnheader', { name: 'Employee Name' }));
  361 |   }
  362 | 
  363 |   private assessmentFormHeading() {
  364 |     return this.page.getByText(/ASSESSMENT FORM FOR PROBATION CONFIRMATION/i);
  365 |   }
  366 | 
  367 |   async isAssessmentFormVisible() {
  368 |     return this.assessmentFormHeading().isVisible().catch(() => false);
  369 |   }
  370 | 
  371 |   private async filterPendingProbationEmployee(searchText: string) {
  372 |     const search = this.page.getByRole('searchbox', { name: 'Username' });
  373 |     if (!(await search.isVisible().catch(() => false))) {
  374 |       return;
  375 |     }
  376 |     await search.fill(searchText);
  377 |     await this.page.waitForTimeout(800);
  378 |   }
  379 | 
  380 |   private employeeNamePattern(employeeName: string) {
  381 |     return new RegExp(employeeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  382 |   }
  383 | 
  384 |   private async isProbationQueueReady(options?: { timeout?: number }) {
  385 |     if (!/pending-approvals|assessmentform/i.test(this.page.url())) {
  386 |       return false;
  387 |     }
  388 | 
  389 |     if (await this.isAssessmentFormVisible()) {
  390 |       return true;
  391 |     }
  392 | 
  393 |     try {
  394 |       await this.probationQueueMarker().first().waitFor({
  395 |         state: 'visible',
  396 |         timeout: options?.timeout ?? 15000,
  397 |       });
  398 |       return true;
  399 |     } catch {
  400 |       return false;
  401 |     }
  402 |   }
  403 | 
  404 |   private async pendingQueueReady() {
  405 |     await this.probationQueueMarker().first().waitFor({ state: 'visible', timeout: 15000 });
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
> 428 |     await kebab.waitFor({ state: 'visible', timeout: 15000 });
      |                 ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
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
  506 |     await expect(row).toBeVisible({ timeout: 15000 });
  507 |     if (employeeId) {
  508 |       await expect(row.getByRole('cell', { name: employeeId })).toBeVisible();
  509 |     }
  510 |   }
  511 | 
  512 |   async openHrProcessDialog(employeeName: string, searchText?: string) {
  513 |     await this.openPendingOnboardingProbation();
  514 | 
  515 |     let processRow = this.pendingProcessRow(employeeName).first();
  516 |     if (!(await processRow.isVisible().catch(() => false)) && searchText) {
  517 |       await this.filterPendingProbationEmployee(searchText);
  518 |     }
  519 | 
  520 |     processRow = this.pendingProcessRow(employeeName).first();
  521 |     if (await processRow.isVisible().catch(() => false)) {
  522 |       const processButton = processRow.getByRole('button', { name: 'Process' });
  523 |       await processButton.click();
  524 |     } else {
  525 |       await this.clickPendingRowAction(employeeName, 'Process', searchText);
  526 |     }
  527 | 
  528 |     await this.hrProcessDialog.waitFor({ state: 'visible', timeout: 15000 });
```