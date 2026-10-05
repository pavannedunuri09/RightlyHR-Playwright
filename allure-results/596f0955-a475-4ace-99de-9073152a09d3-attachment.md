# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-entitlements.spec.ts >> Load Entitlements >> 05. displays entitled General Leave and Sick Leave balances
- Location: tests\load-entitlements.spec.ts:116:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Yearly"
Received string:    "General Leave Booked 0 Processed 0 12/12"
```

# Page snapshot

```yaml
- generic [ref=f8e4]:
  - generic [ref=f8e8]:
    - img "Company Logo" [ref=f8e10]
    - generic [ref=f8e11]:
      - generic [ref=f8e12] [cursor=pointer]
      - generic [ref=f8e20] [cursor=pointer]
      - generic [ref=f8e28] [cursor=pointer]
      - generic [ref=f8e39] [cursor=pointer]:
        - paragraph [ref=f8e40]: Saii Pavan Dinesh Teja
        - paragraph [ref=f8e41]: Chief Executive Officer
  - generic [ref=f8e47]:
    - generic [ref=f8e50]:
      - list [ref=f8e52]:
        - listitem [ref=f8e53] [cursor=pointer]:
          - img "Icon" [ref=f8e54]
          - text: Dashboard
        - listitem [ref=f8e55]:
          - generic [ref=f8e56]:
            - generic [ref=f8e57] [cursor=pointer]:
              - img "Icon" [ref=f8e58]
              - text: Employees
            - generic [ref=f8e59] [cursor=pointer]:
              - img "Icon" [ref=f8e60]
              - text: My Info
            - generic [ref=f8e61] [cursor=pointer]:
              - img "Icon" [ref=f8e62]
              - text: Reports
            - generic [ref=f8e65] [cursor=pointer]:
              - img "Icon" [ref=f8e66]
              - text: Time Off
            - generic [ref=f8e67] [cursor=pointer]:
              - img "Icon" [ref=f8e68]
              - text: Attendance
            - generic [ref=f8e71] [cursor=pointer]:
              - img "Icon" [ref=f8e72]
              - text: Project Management
            - generic [ref=f8e73] [cursor=pointer]:
              - img "Icon" [ref=f8e74]
              - text: Skill Set
            - generic [ref=f8e77] [cursor=pointer]:
              - img "Icon" [ref=f8e78]
              - text: On Behalf Of
            - generic [ref=f8e81] [cursor=pointer]:
              - img "Icon" [ref=f8e82]
              - text: Pending Approvals
            - generic [ref=f8e85] [cursor=pointer]:
              - img "Icon" [ref=f8e86]
              - text: PMS
        - listitem [ref=f8e87] [cursor=pointer]:
          - img "Icons" [ref=f8e90]
      - img "Powered By logo" [ref=f8e93]
    - generic [ref=f8e98]:
      - generic [ref=f8e100]:
        - generic [ref=f8e101]:
          - generic [ref=f8e102]:
            - text: Time Off
            - generic [ref=f8e103]: 
          - generic [ref=f8e105]: Leaves
          - generic [ref=f8e108] [cursor=pointer]
        - generic [ref=f8e112]:
          - generic [ref=f8e113]:
            - generic [ref=f8e114]: Select Employee
            - generic [ref=f8e116] [cursor=pointer]:
              - combobox "Select employee name" [ref=f8e117]
              - button "dropdown trigger" [ref=f8e118]
          - generic [ref=f8e122]:
            - generic [ref=f8e123]: Select Year
            - generic [ref=f8e126] [cursor=pointer]:
              - combobox "2026" [ref=f8e127]
              - button "dropdown trigger" [ref=f8e128]
          - button "Request Leave" [ref=f8e133] [cursor=pointer]
          - button "View Leave Summary" [ref=f8e135] [cursor=pointer]
      - generic [ref=f8e138]:
        - generic [ref=f8e139]:
          - generic [ref=f8e140]:
            - paragraph [ref=f8e141]: General Leave
            - generic [ref=f8e142]:
              - generic [ref=f8e143]:
                - paragraph [ref=f8e144]: Booked
                - paragraph [ref=f8e145]: "0"
              - generic [ref=f8e147]:
                - paragraph [ref=f8e148]: Processed
                - paragraph [ref=f8e149]: "0"
          - generic [ref=f8e150]: 12/12
        - generic [ref=f8e153]:
          - generic [ref=f8e154]:
            - paragraph [ref=f8e155]: Sick Leave
            - generic [ref=f8e156]:
              - generic [ref=f8e157]:
                - paragraph [ref=f8e158]: Booked
                - paragraph [ref=f8e159]: "0"
              - generic [ref=f8e161]:
                - paragraph [ref=f8e162]: Processed
                - paragraph [ref=f8e163]: "0"
          - generic [ref=f8e164]: 12/12
      - generic [ref=f8e167]:
        - list [ref=f8e171]:
          - listitem [ref=f8e172]:
            - generic [ref=f8e173] [cursor=pointer]:
              - img "Icon" [ref=f8e174]
              - generic [ref=f8e175]: Waiting For Approval (0)
          - listitem [ref=f8e177]:
            - generic [ref=f8e178] [cursor=pointer]:
              - img "Icon" [ref=f8e179]
              - generic [ref=f8e180]: Approved (0)
          - listitem [ref=f8e182]:
            - generic [ref=f8e183] [cursor=pointer]:
              - img "Icon" [ref=f8e184]
              - generic [ref=f8e185]: Processed (0)
          - listitem [ref=f8e187]:
            - generic [ref=f8e188] [cursor=pointer]:
              - img "Icon" [ref=f8e189]
              - generic [ref=f8e190]: Rejected (0)
          - listitem [ref=f8e192]:
            - generic [ref=f8e193] [cursor=pointer]:
              - img "Icon" [ref=f8e194]
              - generic [ref=f8e195]: Cancelled (0)
        - table [ref=f8e204]:
          - rowgroup [ref=f8e205]:
            - row [ref=f8e206]:
              - columnheader [ref=f8e207] [cursor=pointer]
              - columnheader [ref=f8e216] [cursor=pointer]
              - columnheader [ref=f8e225] [cursor=pointer]
              - columnheader [ref=f8e234] [cursor=pointer]
              - columnheader [ref=f8e243] [cursor=pointer]
              - columnheader [ref=f8e252] [cursor=pointer]
              - columnheader "Reason" [ref=f8e261]
              - columnheader "Status" [ref=f8e262]
              - columnheader "Action" [ref=f8e263]
          - rowgroup [ref=f8e264]:
            - row [ref=f8e266]:
              - cell [ref=f8e267]:
                - paragraph [ref=f8e286]: No Data Found...
```

# Test source

```ts
  380 |       await expect
  381 |         .poll(
  382 |           async () => this.leaveEntitlementBlock(categoryName).isVisible().catch(() => false),
  383 |           { timeout: timeoutMs },
  384 |         )
  385 |         .toBeTruthy();
  386 |     }
  387 |   }
  388 | 
  389 |   async openTimeOffMenu() {
  390 |     await this.closeRequestDialogIfOpen();
  391 |     await this.timeOffNav.waitFor({ state: 'visible' });
  392 |     await this.timeOffToggle.waitFor({ state: 'visible' });
  393 | 
  394 |     if (await this.timeOffLeavesTab.isVisible().catch(() => false)) {
  395 |       return;
  396 |     }
  397 | 
  398 |     await this.page.waitForTimeout(1500);
  399 |     for (let attempt = 0; attempt < 3; attempt += 1) {
  400 |       await this.timeOffToggle.click();
  401 |       try {
  402 |         await this.timeOffLeavesTab.waitFor({ state: 'visible', timeout: 8000 });
  403 |         return;
  404 |       } catch {
  405 |         await this.page.keyboard.press('Escape');
  406 |         await this.page.waitForTimeout(1000);
  407 |       }
  408 |     }
  409 | 
  410 |     await this.timeOffNav.click();
  411 |     await this.timeOffLeavesTab.waitFor({ state: 'visible', timeout: 15000 });
  412 |   }
  413 | 
  414 |   async waitForLeavesPageReady() {
  415 |     await this.requestLeaveButton.waitFor({ state: 'visible', timeout: 20000 });
  416 |     const skeleton = this.page.locator('.p-skeleton').first();
  417 |     if (await skeleton.isVisible().catch(() => false)) {
  418 |       await skeleton.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  419 |     }
  420 |     await this.waitingForApprovalTab.waitFor({ state: 'visible', timeout: 30000 });
  421 |   }
  422 | 
  423 |   async openLeavesTab() {
  424 |     await this.closeRequestDialogIfOpen();
  425 |     if (/\/time-off\/leaves/i.test(this.page.url()) && (await this.requestLeaveButton.isVisible().catch(() => false))) {
  426 |       await this.waitForLeavesPageReady();
  427 |       return;
  428 |     }
  429 | 
  430 |     await this.openTimeOffMenu();
  431 |     await this.timeOffLeavesTab.click();
  432 |     await this.page.waitForURL(/\/time-off\/leaves/i, { timeout: 15000 });
  433 |     await this.waitForLeavesPageReady();
  434 |   }
  435 | 
  436 |   async openFromDashboard() {
  437 |     if (!this.page.url().includes('/dashboard/emp')) {
  438 |       await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' });
  439 |     }
  440 |     await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
  441 |     await this.page
  442 |       .getByText('Have a nice day at work!')
  443 |       .waitFor({ state: 'visible', timeout: 15000 });
  444 |     await this.openLeavesTab();
  445 |   }
  446 | 
  447 |   async gotoWaitingForApproval() {
  448 |     await this.closeRequestDialogIfOpen();
  449 |     await this.openLeavesTab();
  450 |   }
  451 | 
  452 |   async expectLeavesPageLoaded() {
  453 |     await expect(this.page).toHaveURL(/\/time-off\/leaves/i);
  454 |     await expect(this.requestLeaveButton).toBeVisible({ timeout: 15000 });
  455 |     await expect(this.viewLeaveSummaryButton).toBeVisible();
  456 |   }
  457 | 
  458 |   async validateUserSessionAndOpenLeaves(
  459 |     loginPage: { validateUserSession: () => Promise<void> },
  460 |     categoryNames: string[] = [],
  461 |   ) {
  462 |     await loginPage.validateUserSession();
  463 |     await this.page.goto('/time-off/leaves/waiting-for-approval', {
  464 |       waitUntil: 'domcontentloaded',
  465 |     });
  466 |     await this.expectLeavesPageLoaded();
  467 | 
  468 |     if (categoryNames.length > 0) {
  469 |       await this.waitForEntitlementCards(categoryNames);
  470 |     }
  471 |   }
  472 | 
  473 |   async expectEntitledLeave(categoryName: string, expectation: LeaveEntitlementExpectation) {
  474 |     const block = this.leaveEntitlementBlock(categoryName);
  475 |     await expect(block).toBeVisible({ timeout: 15000 });
  476 | 
  477 |     const blockText = (await block.innerText()).replace(/\s+/g, ' ');
  478 |     const normalizedBlockText = blockText.replace(/\s/g, '');
  479 |     expect(blockText).toContain(categoryName);
> 480 |     expect(blockText).toContain(expectation.frequency);
      |                       ^ Error: expect(received).toContain(expected) // indexOf
  481 | 
  482 |     const afterProcessed = normalizedBlockText.split(/Processed/i).pop() || normalizedBlockText;
  483 |     const balanceMatch = afterProcessed.match(/(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)/);
  484 |     expect(balanceMatch, `Expected remaining/total balance on the ${categoryName} card`).toBeTruthy();
  485 |     expect(blockText).toMatch(/Booked\s*\d/i);
  486 |     expect(blockText).toMatch(/Processed\s*\d/i);
  487 | 
  488 |     if (expectation.entitledTotal) {
  489 |       expect(balanceMatch![2]).toBe(String(expectation.entitledTotal).replace(/\s/g, ''));
  490 |     }
  491 | 
  492 |     if (expectation.entitledBalance) {
  493 |       const expected = expectation.entitledBalance.replace(/\s/g, '');
  494 |       const parts = expected.split('/');
  495 |       if (parts.length === 2 && parts[0] === parts[1]) {
  496 |         expect(balanceMatch![2]).toBe(parts[1]);
  497 |         expect(Number(balanceMatch![1])).toBeLessThanOrEqual(Number(parts[1]));
  498 |       } else {
  499 |         expect(normalizedBlockText).toContain(expected);
  500 |       }
  501 |     }
  502 | 
  503 |     if (expectation.booked !== undefined) {
  504 |       expect(blockText).toMatch(new RegExp(`Booked\\s*${expectation.booked}`, 'i'));
  505 |     }
  506 | 
  507 |     if (expectation.processed !== undefined) {
  508 |       expect(blockText).toMatch(new RegExp(`Processed\\s*${expectation.processed}`, 'i'));
  509 |     }
  510 |   }
  511 | 
  512 |   async openRequestLeaveDialog() {
  513 |     await this.closeRequestDialogIfOpen();
  514 |     await this.requestLeaveButton.click();
  515 |     const dialog = this.requestDialog();
  516 |     await dialog.waitFor({ state: 'visible', timeout: 15000 });
  517 |     await dialog.getByText(/Request Leave/i).waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  518 |     return dialog;
  519 |   }
  520 | 
  521 |   async selectLeaveCategory(categoryName: string) {
  522 |     const dialog = this.requestDialog();
  523 |     const selectedCombo = dialog.getByRole('combobox', { name: categoryName });
  524 |     if (await selectedCombo.isVisible().catch(() => false)) {
  525 |       return;
  526 |     }
  527 | 
  528 |     const existingCombo = dialog.getByRole('combobox').first();
  529 |     const leaveTypeTrigger = dialog.getByText(/Leave Type\*Please select/i).first();
  530 |     if (await existingCombo.isVisible().catch(() => false)) {
  531 |       await existingCombo.click();
  532 |     } else {
  533 |       await leaveTypeTrigger.waitFor({ state: 'visible', timeout: 15000 });
  534 |       await leaveTypeTrigger.click();
  535 |     }
  536 | 
  537 |     const option = this.page.getByRole('option', { name: categoryName, exact: true }).first();
  538 |     await option.waitFor({ state: 'visible', timeout: 15000 });
  539 |     await option.click();
  540 | 
  541 |     await dialog.getByText(/Start Date\s*\*/i).waitFor({ state: 'visible', timeout: 15000 });
  542 |   }
  543 | 
  544 |   async selectAvailing(session: 'first' | 'second' | 'full' = 'first') {
  545 |     if (session === 'full') {
  546 |       await this.fullDayRadio.check();
  547 |       return;
  548 |     }
  549 |     await this.selectHalfDaySession(session);
  550 |   }
  551 | 
  552 |   async selectHalfDaySession(session: 'first' | 'second' = 'first') {
  553 |     const dialog = this.requestDialog();
  554 |     await this.halfDayRadio.check();
  555 |     const halfLabel = session === 'second' ? 'Second Half' : 'First Half';
  556 |     const halfRadio = dialog.getByRole('radio', { name: halfLabel });
  557 |     await halfRadio.waitFor({ state: 'visible', timeout: 10000 });
  558 |     await halfRadio.check();
  559 |   }
  560 | 
  561 |   async fillRequestForm(
  562 |     startDate: string,
  563 |     reason: string,
  564 |     categoryName: string,
  565 |     session: 'first' | 'second' | 'full' = 'first',
  566 |   ) {
  567 |     await this.openRequestLeaveDialog();
  568 |     const dialog = this.requestDialog();
  569 |     await this.selectLeaveCategory(categoryName);
  570 |     await this.fillStartDate(startDate);
  571 |     await this.fillEndDate(startDate);
  572 |     await this.selectAvailing(session);
  573 |     await this.reasonInput.fill(reason);
  574 |     return dialog;
  575 |   }
  576 | 
  577 |   async fillRequestFormRange(
  578 |     startDate: string,
  579 |     endDate: string,
  580 |     reason: string,
```