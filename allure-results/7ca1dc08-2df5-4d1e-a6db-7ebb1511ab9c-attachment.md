# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: my-info.spec.ts >> My Info Module Automation Suite >> TC06 - Family Member CRUD
- Location: tests\my-info.spec.ts:106:7

# Error details

```
TimeoutError: locator.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'Name*' })

```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]:
  - generic [ref=f2e4]:
    - generic [ref=f2e11]:
      - generic [ref=f2e12] [cursor=pointer]
      - generic [ref=f2e20] [cursor=pointer]: 
      - generic [ref=f2e24] [cursor=pointer]
      - generic [ref=f2e35] [cursor=pointer]:
        - paragraph [ref=f2e36]: Induu sai Dinesh Priyaa
        - paragraph [ref=f2e37]: QA Tester
    - generic [ref=f2e40]:
      - list [ref=f2e45]:
        - listitem [ref=f2e46] [cursor=pointer]: Dashboard
        - listitem [ref=f2e48]:
          - generic [ref=f2e49]:
            - generic [ref=f2e50] [cursor=pointer]: My Info
            - generic [ref=f2e52] [cursor=pointer]: Employees
            - generic [ref=f2e54] [cursor=pointer]: Policies
            - generic [ref=f2e56] [cursor=pointer]: Pending Approvals
            - generic [ref=f2e58] [cursor=pointer]: Reports
            - generic [ref=f2e60] [cursor=pointer]: Holidays
            - generic [ref=f2e62] [cursor=pointer]: Cards Management
            - generic [ref=f2e64] [cursor=pointer]: Expenses
            - generic [ref=f2e66] [cursor=pointer]: IT Support
            - generic [ref=f2e68] [cursor=pointer]: Skill Set
            - generic [ref=f2e70] [cursor=pointer]: Project Management
            - generic [ref=f2e74] [cursor=pointer]: ATS
            - generic [ref=f2e78] [cursor=pointer]: PMS
            - generic [ref=f2e82] [cursor=pointer]: Time Off
        - listitem [ref=f2e86] [cursor=pointer]
      - generic [ref=f2e96]:
        - generic [ref=f2e98]:
          - generic [ref=f2e99]:
            - text: My Info
            - generic [ref=f2e100]: 
          - generic [ref=f2e102]: Family Members
          - generic [ref=f2e105] [cursor=pointer]
        - generic [ref=f2e109]:
          - generic [ref=f2e112]:
            - generic [ref=f2e116]:
              - paragraph [ref=f2e117]: Induu sai Dinesh Priyaa
              - paragraph [ref=f2e118]: Dimcon20221
              - paragraph [ref=f2e119]:
                - link [ref=f2e120] [cursor=pointer]:
                  - /url: mailto:pavan.nedunuri@snaddevelopers.com
                  - generic [ref=f2e122]: pavan.nedunuri@snaddevelopers.com
              - paragraph [ref=f2e123]: QA Tester
              - paragraph [ref=f2e125]: Hyderabad,Jai Hind Enclave building
              - paragraph [ref=f2e127]:
                - generic [ref=f2e129]: Full-Time|General Shift |10:00-07:00
              - paragraph [ref=f2e130]:
                - link [ref=f2e131] [cursor=pointer]:
                  - /url: tel:+19123499798
                  - generic [ref=f2e133]: +1 (912) 349-9798
            - generic [ref=f2e137]:
              - paragraph [ref=f2e138]: Team Manager
              - paragraph [ref=f2e139]: Bhavitha Sri Palagiri Palagiri
            - generic [ref=f2e142]:
              - paragraph [ref=f2e143]: Reporting Manager
              - paragraph [ref=f2e144]: Bhavitha Sri Palagiri Palagiri
            - list [ref=f2e149]:
              - listitem [ref=f2e150]:
                - generic [ref=f2e151] [cursor=pointer]: Personal
              - listitem [ref=f2e152]:
                - generic [ref=f2e153] [cursor=pointer]: Job
              - listitem [ref=f2e154]:
                - generic [ref=f2e155] [cursor=pointer]: Documents
            - generic [ref=f2e159]:
              - generic [ref=f2e160] [cursor=pointer]: Basic Info
              - generic [ref=f2e164] [cursor=pointer]: Contact Info
              - generic [ref=f2e168] [cursor=pointer]: Addresses
              - generic [ref=f2e172] [cursor=pointer]: Emergency Contacts
              - generic [ref=f2e176] [cursor=pointer]: Family Members
              - generic [ref=f2e180] [cursor=pointer]: Identity Info
              - generic [ref=f2e184] [cursor=pointer]: Bank info
              - generic [ref=f2e188] [cursor=pointer]: Academics
              - generic [ref=f2e192] [cursor=pointer]: Visa Details
              - generic [ref=f2e196] [cursor=pointer]: Skills
          - generic [ref=f2e202]:
            - generic [ref=f2e203]:
              - generic [ref=f2e204]: Family Members
              - generic [ref=f2e205] [cursor=pointer]:
                - generic [ref=f2e206]: 
                - text: Add New
            - table [ref=f2e211]:
              - rowgroup [ref=f2e212]:
                - row [ref=f2e213]:
                  - columnheader [ref=f2e214] [cursor=pointer]: Name
                  - columnheader [ref=f2e223] [cursor=pointer]: Relationship
                  - columnheader [ref=f2e232] [cursor=pointer]: Date of Birth
                  - columnheader [ref=f2e241] [cursor=pointer]: Dependent
                  - columnheader [ref=f2e250]: Action
              - rowgroup [ref=f2e251]:
                - row [ref=f2e252]:
                  - cell [ref=f2e253]:
                    - generic [ref=f2e254]:
                      - generic:
                        - generic:
                          - paragraph: No Data Found...
  - dialog [ref=f2e256]:
    - document:
      - generic [ref=f2e258]:
        - paragraph [ref=f2e261]: Add Family Member
        - generic [ref=f2e263]:
          - generic [ref=f2e264]:
            - generic [ref=f2e265]:
              - generic [ref=f2e266]: Name *
              - textbox "Name *" [ref=f2e267]:
                - /placeholder: Please enter name
            - generic [ref=f2e268]:
              - generic [ref=f2e269]: Date of Birth*
              - textbox "Date of Birth*" [ref=f2e270]
            - generic [ref=f2e271]:
              - generic [ref=f2e272]: Relationship *
              - generic [ref=f2e274] [cursor=pointer]:
                - combobox "Please select relationship" [ref=f2e275]
                - button "dropdown trigger" [ref=f2e276]
            - generic [ref=f2e281]:
              - checkbox "Dependent" [ref=f2e283] [cursor=pointer]
              - generic [ref=f2e284]: Dependent
          - generic [ref=f2e285]:
            - button "Cancel" [ref=f2e286] [cursor=pointer]
            - button "Add" [disabled] [ref=f2e287] [cursor=pointer]
```

# Test source

```ts
  431 |     await this.clickEditIcon();
  432 | 
  433 |     const sameAsPermCheckbox = this.page.locator('input[formcontrolname="sameAsPermanent"]');
  434 |     if (data.sameAsPermanent !== undefined) {
  435 |       if (data.sameAsPermanent) {
  436 |         await sameAsPermCheckbox.check();
  437 |       } else {
  438 |         await sameAsPermCheckbox.uncheck();
  439 |       }
  440 |     }
  441 | 
  442 |     if (data.permanentZip) {
  443 |       const permZip = this.page.locator('#permanentZipCode');
  444 |       await permZip.fill(data.permanentZip);
  445 |     }
  446 | 
  447 |     if (!data.sameAsPermanent && data.currentZip) {
  448 |       const currZip = this.page.locator('#currentZipCode');
  449 |       if (await currZip.isVisible()) {
  450 |         await currZip.fill(data.currentZip);
  451 |       }
  452 |     }
  453 | 
  454 |     const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
  455 |     await expect(saveButton).toBeEnabled({ timeout: 10000 });
  456 |     await saveButton.click();
  457 |     await expect(saveButton).toBeHidden({ timeout: 15000 });
  458 |   }
  459 | 
  460 |   // ==========================================
  461 |   // 4. EMERGENCY CONTACTS
  462 |   // ==========================================
  463 | 
  464 |   async openEmergencyContacts() {
  465 |     await this.openPersonalSubTab('Emergency Contacts');
  466 |   }
  467 | 
  468 |   async updateEmergencyContacts(data: EmergencyContactsData) {
  469 |     await this.openEmergencyContacts();
  470 |     await this.clickEditIcon();
  471 | 
  472 |     // Contact 1
  473 |     const contact1Name = this.page.locator('input[formcontrolname="contact1Name"]');
  474 |     await contact1Name.fill(data.contact1.name);
  475 | 
  476 |     const contact1Email = this.page.locator('input[formcontrolname="contact1Email"]');
  477 |     await contact1Email.fill(data.contact1.email);
  478 | 
  479 |     const phone1Input = this.page.locator('input[formcontrolname="contact1Phone"]');
  480 |     await this.selectIndiaCountryCode(phone1Input);
  481 |     await phone1Input.fill(data.contact1.phone);
  482 | 
  483 |     if (data.contact1.relationship) {
  484 |       const rel1 = this.page.locator('p-select[formcontrolname="contact1Relationship"]');
  485 |       await this.selectDropdownOption(rel1, data.contact1.relationship);
  486 |     }
  487 | 
  488 |     // Contact 2
  489 |     if (data.contact2) {
  490 |       const contact2Name = this.page.locator('input[formcontrolname="contact2Name"]');
  491 |       if (await contact2Name.isVisible()) {
  492 |         await contact2Name.fill(data.contact2.name);
  493 |       }
  494 | 
  495 |       const contact2Email = this.page.locator('input[formcontrolname="contact2Email"]');
  496 |       if (await contact2Email.isVisible()) {
  497 |         await contact2Email.fill(data.contact2.email);
  498 |       }
  499 | 
  500 |       const phone2Input = this.page.locator('input[formcontrolname="contact2Phone"]');
  501 |       if (await phone2Input.isVisible()) {
  502 |         await this.selectIndiaCountryCode(phone2Input);
  503 |         await phone2Input.fill(data.contact2.phone);
  504 |       }
  505 | 
  506 |       if (data.contact2.relationship) {
  507 |         const rel2 = this.page.locator('p-select[formcontrolname="contact2Relationship"]');
  508 |         await this.selectDropdownOption(rel2, data.contact2.relationship);
  509 |       }
  510 |     }
  511 | 
  512 |     const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
  513 |     await expect(saveButton).toBeEnabled({ timeout: 10000 });
  514 |     await saveButton.click();
  515 |     await expect(saveButton).toBeHidden({ timeout: 15000 });
  516 |   }
  517 | 
  518 |   // ==========================================
  519 |   // 5. FAMILY MEMBERS
  520 |   // ==========================================
  521 | 
  522 |   async openFamilyMembers() {
  523 |     await this.openPersonalSubTab('Family Members');
  524 |   }
  525 | 
  526 |   async addFamilyMember(data: FamilyMemberData) {
  527 |     await this.openFamilyMembers();
  528 |     await this.page.getByText('Add New', { exact: true }).click();
  529 | 
  530 |     const nameInput = this.page.getByRole('textbox', { name: 'Name*' });
> 531 |     await nameInput.fill(data.name);
      |                     ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
  532 | 
  533 |     const dobInput = this.page.getByRole('textbox', { name: 'Date of Birth*' });
  534 |     await dobInput.fill(data.dob);
  535 | 
  536 |     const relDropdown = this.page.getByRole('combobox', { name: 'Please select relationship' });
  537 |     await this.selectDropdownOption(relDropdown, data.relationship);
  538 | 
  539 |     if (data.dependent) {
  540 |       const depCheckbox = this.page.getByRole('checkbox', { name: 'Dependent' });
  541 |       await depCheckbox.check();
  542 |     }
  543 | 
  544 |     const addButton = this.page.getByRole('button', { name: 'Add', exact: true });
  545 |     await expect(addButton).toBeEnabled();
  546 |     await addButton.click();
  547 | 
  548 |     await this.waitForDialogClose();
  549 |     await expect(this.getTableRow(data.name)).toBeVisible({ timeout: 15000 });
  550 |   }
  551 | 
  552 |   async updateFamilyMember(searchName: string, updatedName: string) {
  553 |     const row = this.getTableRow(searchName);
  554 |     await expect(row).toBeVisible({ timeout: 15000 });
  555 | 
  556 |     await this.clickRowAction(row, 'Update');
  557 | 
  558 |     const nameInput = this.page.getByRole('textbox', { name: 'Name*' });
  559 |     await nameInput.fill(updatedName);
  560 | 
  561 |     const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true });
  562 |     await updateBtn.click();
  563 | 
  564 |     await this.waitForDialogClose();
  565 |     await expect(this.getTableRow(updatedName)).toBeVisible({ timeout: 15000 });
  566 |   }
  567 | 
  568 |   async deleteFamilyMember(searchName: string) {
  569 |     const row = this.getTableRow(searchName);
  570 |     await expect(row).toBeVisible({ timeout: 15000 });
  571 | 
  572 |     await this.clickRowAction(row, 'Delete');
  573 | 
  574 |     await this.confirmYes();
  575 |     await expect(this.getTableRow(searchName)).toBeHidden({ timeout: 15000 });
  576 |   }
  577 | 
  578 |   // ==========================================
  579 |   // 6. IDENTITY INFORMATION
  580 |   // ==========================================
  581 | 
  582 |   async openIdentityInfo() {
  583 |     await this.openPersonalSubTab('Identity Info');
  584 |   }
  585 | 
  586 |   async addIdentity(data: IdentityData) {
  587 |     await this.openIdentityInfo();
  588 | 
  589 |     const existingTypeRow = this.getTableRow(data.type);
  590 |     if (await existingTypeRow.isVisible({ timeout: 2000 }).catch(() => false)) {
  591 |       await this.deleteIdentity(data.type).catch(() => {});
  592 |     }
  593 | 
  594 |     await this.page.getByText('Add New', { exact: true }).click();
  595 | 
  596 |     const typeDropdown = this.page.getByRole('combobox', { name: 'Please select identity type' });
  597 |     await this.selectDropdownOption(typeDropdown, data.type);
  598 | 
  599 |     const numInput = this.page
  600 |       .getByRole('textbox', { name: /Identity Number|Identity Type\* Identity/i })
  601 |       .first();
  602 |     await numInput.fill(data.number);
  603 | 
  604 |     const filePath = data.filePath || this.defaultAttachmentPath;
  605 |     await this.setFileInput(this.page.getByRole('button', { name: 'Choose File' }), filePath);
  606 | 
  607 |     const dialog = this.page.locator('.modal.show, ngb-modal-window, [role="dialog"], .p-dialog').first();
  608 |     const addButton = dialog.getByRole('button', { name: 'Add', exact: true });
  609 |     await expect(addButton).toBeEnabled();
  610 |     await addButton.click();
  611 | 
  612 |     await this.waitForDialogClose();
  613 |     await expect(this.getTableRow(data.number)).toBeVisible({ timeout: 15000 });
  614 |   }
  615 | 
  616 |   async updateIdentity(identityNumber: string, filePath?: string) {
  617 |     const row = this.getTableRow(identityNumber);
  618 |     await expect(row).toBeVisible({ timeout: 15000 });
  619 | 
  620 |     await this.clickRowAction(row, 'Update');
  621 | 
  622 |     const file = filePath || this.defaultAttachmentPath;
  623 |     await this.setFileInput(this.page.getByRole('button', { name: 'Choose File' }), file).catch(() => {});
  624 | 
  625 |     const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true });
  626 |     await updateBtn.click();
  627 | 
  628 |     await this.waitForDialogClose();
  629 |   }
  630 | 
  631 |   async deleteIdentity(identityNumber: string) {
```