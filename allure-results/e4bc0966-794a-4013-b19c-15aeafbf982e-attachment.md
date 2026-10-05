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

Locator: getByRole('row').filter({ hasText: '789456718471' }).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('row').filter({ hasText: '789456718471' }).first()

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
    - text: Employees
    - img "Icon"
    - text: My Info
    - img "Icon"
    - text: Reports
    - img "Icon"
    - text: Time Off
    - img "Icon"
    - text: Attendance
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
- text: My Info  Identity Info
- img
- button "View History"
- img
- img "edit-icon"
- paragraph: Induu Priyaa
- paragraph: SD302262
- paragraph:
  - link "Iconpavan.nedunuri@snaddevelopers.com":
    - /url: mailto:pavan.nedunuri@snaddevelopers.com
    - img "Icon"
    - text: pavan.nedunuri@snaddevelopers.com
- paragraph:
  - img "Icon"
  - text: Chief Executive Officer
- paragraph:
  - img "Icon"
  - text: Kerala,Kannur
- paragraph:
  - img "Icon"
  - text: Full Time|Morining Test|10:30-19:30
- paragraph:
  - img "Icon"
  - text: +91 9123499798
- paragraph: Team Manager
- paragraph: Induu Priyaa
- paragraph: Reporting Manager
- paragraph: Induu Priyaa
- list:
  - listitem: Personal
  - listitem: Job
  - listitem: Documents
- img "Basic Info"
- text: Basic Info
- img "Contact Info"
- text: Contact Info
- img "Addresses"
- text: Addresses
- img "Emergency Contacts"
- text: Emergency Contacts
- img "Family Members"
- text: Family Members
- img "Identity Info"
- text: Identity Info
- img "Bank Info"
- text: Bank Info
- img "Academics"
- text: Academics
- img "Skills"
- text: "Skills Identity Info  Add New Note: Record addition request sent for approval"
- table:
  - rowgroup:
    - row "Identity Type Identity Number Attachment Action":
      - columnheader "Identity Type":
        - text: Identity Type
        - img
      - columnheader "Identity Number":
        - text: Identity Number
        - img
      - columnheader "Attachment"
      - columnheader "Action"
  - rowgroup:
    - row "Pass Book 456799126645 ":
      - cell "Pass Book"
      - cell "456799126645"
      - cell:
        - img
      - cell ""
    - row "License 445565734546 ":
      - cell "License"
      - cell "445565734546"
      - cell:
        - img
      - cell ""
    - row "Aadhaar 123456789013 ":
      - cell "Aadhaar"
      - cell "123456789013"
      - cell:
        - img
      - cell ""
    - row "PAN ABKBBKB122 ":
      - cell "PAN"
      - cell "ABKBBKB122"
      - cell:
        - img
      - cell ""
```

# Test source

```ts
  528 |     await expect(saveButton).toBeEnabled({ timeout: 10000 });
  529 |     await saveButton.click();
  530 |     await expect(saveButton).toBeHidden({ timeout: 15000 });
  531 |   }
  532 | 
  533 |   // ==========================================
  534 |   // 5. FAMILY MEMBERS
  535 |   // ==========================================
  536 | 
  537 |   async openFamilyMembers() {
  538 |     await this.openPersonalSubTab('Family Members');
  539 |   }
  540 | 
  541 |   async addFamilyMember(data: FamilyMemberData) {
  542 |     await this.openFamilyMembers();
  543 |     await this.page.getByText('Add New', { exact: true }).click();
  544 | 
  545 |     const nameInput = this.page.getByRole('textbox', { name: 'Name*' });
  546 |     await nameInput.fill(data.name);
  547 | 
  548 |     const dobInput = this.page.getByRole('textbox', { name: 'Date of Birth*' });
  549 |     await dobInput.fill(data.dob);
  550 | 
  551 |     const relDropdown = this.page.getByRole('combobox', { name: 'Please select relationship' });
  552 |     await this.selectDropdownOption(relDropdown, data.relationship);
  553 | 
  554 |     if (data.dependent) {
  555 |       const depCheckbox = this.page.getByRole('checkbox', { name: 'Dependent' });
  556 |       await depCheckbox.check();
  557 |     }
  558 | 
  559 |     const addButton = this.page.getByRole('button', { name: 'Add', exact: true });
  560 |     await expect(addButton).toBeEnabled();
  561 |     await addButton.click();
  562 | 
  563 |     await this.waitForDialogClose();
  564 |     await expect(this.getTableRow(data.name)).toBeVisible({ timeout: 15000 });
  565 |   }
  566 | 
  567 |   async updateFamilyMember(searchName: string, updatedName: string) {
  568 |     const row = this.getTableRow(searchName);
  569 |     await expect(row).toBeVisible({ timeout: 15000 });
  570 | 
  571 |     await this.clickRowAction(row, 'Update');
  572 | 
  573 |     const nameInput = this.page.getByRole('textbox', { name: 'Name*' });
  574 |     await nameInput.fill(updatedName);
  575 | 
  576 |     const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true });
  577 |     await updateBtn.click();
  578 | 
  579 |     await this.waitForDialogClose();
  580 |     await expect(this.getTableRow(updatedName)).toBeVisible({ timeout: 15000 });
  581 |   }
  582 | 
  583 |   async deleteFamilyMember(searchName: string) {
  584 |     const row = this.getTableRow(searchName);
  585 |     await expect(row).toBeVisible({ timeout: 15000 });
  586 | 
  587 |     await this.clickRowAction(row, 'Delete');
  588 | 
  589 |     await this.confirmYes();
  590 |     await expect(this.getTableRow(searchName)).toBeHidden({ timeout: 15000 });
  591 |   }
  592 | 
  593 |   // ==========================================
  594 |   // 6. IDENTITY INFORMATION
  595 |   // ==========================================
  596 | 
  597 |   async openIdentityInfo() {
  598 |     await this.openPersonalSubTab('Identity Info');
  599 |   }
  600 | 
  601 |   async addIdentity(data: IdentityData) {
  602 |     await this.openIdentityInfo();
  603 | 
  604 |     const existingTypeRow = this.getTableRow(data.type);
  605 |     if (await existingTypeRow.isVisible({ timeout: 2000 }).catch(() => false)) {
  606 |       await this.deleteIdentity(data.type).catch(() => {});
  607 |     }
  608 | 
  609 |     await this.page.getByText('Add New', { exact: true }).click();
  610 | 
  611 |     const typeDropdown = this.page.getByRole('combobox', { name: 'Please select identity type' });
  612 |     await this.selectDropdownOption(typeDropdown, data.type);
  613 | 
  614 |     const numInput = this.page
  615 |       .getByRole('textbox', { name: /Identity Number|Identity Type\* Identity/i })
  616 |       .first();
  617 |     await numInput.fill(data.number);
  618 | 
  619 |     const filePath = data.filePath || this.defaultAttachmentPath;
  620 |     await this.setFileInput(this.page.getByRole('button', { name: 'Choose File' }), filePath);
  621 | 
  622 |     const dialog = this.page.locator('.modal.show, ngb-modal-window, [role="dialog"], .p-dialog').first();
  623 |     const addButton = dialog.getByRole('button', { name: 'Add', exact: true });
  624 |     await expect(addButton).toBeEnabled();
  625 |     await addButton.click();
  626 | 
  627 |     await this.waitForDialogClose();
> 628 |     await expect(this.getTableRow(data.number)).toBeVisible({ timeout: 15000 });
      |                                                 ^ Error: expect(locator).toBeVisible() failed
  629 |   }
  630 | 
  631 |   async updateIdentity(identityNumber: string, filePath?: string) {
  632 |     const row = this.getTableRow(identityNumber);
  633 |     await expect(row).toBeVisible({ timeout: 15000 });
  634 | 
  635 |     await this.clickRowAction(row, 'Update');
  636 | 
  637 |     const file = filePath || this.defaultAttachmentPath;
  638 |     await this.setFileInput(this.page.getByRole('button', { name: 'Choose File' }), file).catch(() => {});
  639 | 
  640 |     const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true });
  641 |     await updateBtn.click();
  642 | 
  643 |     await this.waitForDialogClose();
  644 |   }
  645 | 
  646 |   async deleteIdentity(identityNumber: string) {
  647 |     const row = this.getTableRow(identityNumber);
  648 |     await expect(row).toBeVisible({ timeout: 15000 });
  649 | 
  650 |     await this.clickRowAction(row, 'Delete');
  651 | 
  652 |     await this.confirmYes();
  653 |     await expect(this.getTableRow(identityNumber)).toBeHidden({ timeout: 15000 });
  654 |   }
  655 | 
  656 |   // ==========================================
  657 |   // 7. BANK INFORMATION
  658 |   // ==========================================
  659 | 
  660 |   async openBankInfo() {
  661 |     await this.openPersonalSubTab('Bank Info');
  662 |   }
  663 | 
  664 |   async addBank(data: BankData) {
  665 |     await this.openBankInfo();
  666 |     await this.page.getByText('Add New', { exact: true }).click();
  667 | 
  668 |     const bankDropdown = this.page
  669 |       .getByRole('combobox', { name: /bank name/i })
  670 |       .or(this.page.getByRole('button', { name: 'dropdown trigger' }))
  671 |       .first();
  672 |     await this.selectDropdownOption(bankDropdown, data.bankName);
  673 | 
  674 |     const holderInput = this.page.getByRole('textbox', { name: "Account Holder's Name*" });
  675 |     await holderInput.fill(data.accountHolder);
  676 | 
  677 |     const accountInput = this.page.getByRole('spinbutton', { name: 'Account Number*' });
  678 |     await accountInput.fill(data.accountNumber);
  679 | 
  680 |     const ifscInput = this.page.getByRole('textbox', { name: 'IFSC Code*' });
  681 |     await ifscInput.fill(data.ifsc);
  682 | 
  683 |     const filePath = data.filePath || this.defaultAttachmentPath;
  684 |     await this.setFileInput(this.page.getByRole('button', { name: 'Choose File' }), filePath);
  685 | 
  686 |     if (data.primaryBank) {
  687 |       const primaryCheckbox = this.page.getByRole('checkbox', { name: 'Primary Bank' });
  688 |       await primaryCheckbox.check();
  689 |     }
  690 | 
  691 |     const addButton = this.page.getByRole('button', { name: 'Add', exact: true });
  692 |     await expect(addButton).toBeEnabled();
  693 |     await addButton.click();
  694 | 
  695 |     await this.waitForDialogClose();
  696 |     await expect(this.getTableRow(data.accountHolder)).toBeVisible({ timeout: 15000 });
  697 |   }
  698 | 
  699 |   async updateBank(accountHolder: string, newAccountHolder: string) {
  700 |     const row = this.getTableRow(accountHolder);
  701 |     await expect(row).toBeVisible({ timeout: 15000 });
  702 | 
  703 |     await this.clickRowAction(row, 'Update');
  704 | 
  705 |     const holderInput = this.page.getByRole('textbox', { name: "Account Holder's Name*" });
  706 |     await holderInput.fill(newAccountHolder);
  707 | 
  708 |     const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true });
  709 |     await updateBtn.click();
  710 | 
  711 |     await this.waitForDialogClose();
  712 |     await expect(this.getTableRow(newAccountHolder)).toBeVisible({ timeout: 15000 });
  713 |   }
  714 | 
  715 |   async deleteBank(accountHolder: string) {
  716 |     const row = this.getTableRow(accountHolder);
  717 |     await expect(row).toBeVisible({ timeout: 15000 });
  718 | 
  719 |     await this.clickRowAction(row, 'Delete');
  720 | 
  721 |     await this.confirmYes();
  722 |     await expect(this.getTableRow(accountHolder)).toBeHidden({ timeout: 15000 });
  723 |   }
  724 | 
  725 |   // ==========================================
  726 |   // 8. ACADEMICS
  727 |   // ==========================================
  728 | 
```