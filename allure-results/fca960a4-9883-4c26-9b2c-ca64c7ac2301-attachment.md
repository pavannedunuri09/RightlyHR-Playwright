# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: my-info.spec.ts >> My Info Module Automation Suite >> TC08 - Bank Information CRUD
- Location: tests\my-info.spec.ts:155:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('row').filter({ hasText: 'PW_Bank_08407' }).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('row').filter({ hasText: 'PW_Bank_08407' }).first()

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
- text: My Info  Bank Info
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
- text: "Skills Bank Info  Add New Note: Record addition request sent for approval"
- table:
  - rowgroup:
    - row "Bank Name Account Holder'S Name Account Number Routing Number Proof Primary Bank Action":
      - columnheader "Bank Name":
        - text: Bank Name
        - img
      - columnheader "Account Holder'S Name":
        - text: Account Holder'S Name
        - img
      - columnheader "Account Number":
        - text: Account Number
        - img
      - columnheader "Routing Number":
        - text: Routing Number
        - img
      - columnheader "Proof"
      - columnheader "Primary Bank":
        - text: Primary Bank
        - img
      - columnheader "Action"
  - rowgroup:
    - row "Axis Bank Pavan Teja 132432424512443420 AXB1234556 Yes ":
      - cell "Axis Bank"
      - cell "Pavan Teja"
      - cell "132432424512443420"
      - cell "AXB1234556"
      - cell:
        - img
      - cell "Yes"
      - cell ""
    - row "Maharashtra Gramin Bank Pavan Nedunuri 3453218763121323 Tdhh1233483 No ":
      - cell "Maharashtra Gramin Bank"
      - cell "Pavan Nedunuri"
      - cell "3453218763121323"
      - cell "Tdhh1233483"
      - cell:
        - img
      - cell "No"
      - cell ""
```

# Test source

```ts
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
  628 |     await expect(this.getTableRow(data.number)).toBeVisible({ timeout: 15000 });
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
  677 |     const accountInput = this.page
  678 |       .getByRole('textbox', { name: 'Account Number*' })
  679 |       .or(this.page.getByRole('spinbutton', { name: 'Account Number*' }))
  680 |       .first();
  681 |     await accountInput.fill(data.accountNumber);
  682 | 
  683 |     const ifscInput = this.page.getByRole('textbox', { name: 'IFSC Code*' });
  684 |     await ifscInput.fill(data.ifsc);
  685 | 
  686 |     const filePath = data.filePath || this.defaultAttachmentPath;
  687 |     await this.setFileInput(this.page.getByRole('button', { name: 'Choose File' }), filePath);
  688 | 
  689 |     if (data.primaryBank) {
  690 |       const primaryCheckbox = this.page.getByRole('checkbox', { name: 'Primary Bank' });
  691 |       await primaryCheckbox.check();
  692 |     }
  693 | 
  694 |     const addButton = this.page.getByRole('button', { name: 'Add', exact: true });
  695 |     await expect(addButton).toBeEnabled();
  696 |     await addButton.click();
  697 | 
  698 |     await this.waitForDialogClose();
> 699 |     await expect(this.getTableRow(data.accountHolder)).toBeVisible({ timeout: 15000 });
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  700 |   }
  701 | 
  702 |   async updateBank(accountHolder: string, newAccountHolder: string) {
  703 |     const row = this.getTableRow(accountHolder);
  704 |     await expect(row).toBeVisible({ timeout: 15000 });
  705 | 
  706 |     await this.clickRowAction(row, 'Update');
  707 | 
  708 |     const holderInput = this.page.getByRole('textbox', { name: "Account Holder's Name*" });
  709 |     await holderInput.fill(newAccountHolder);
  710 | 
  711 |     const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true });
  712 |     await updateBtn.click();
  713 | 
  714 |     await this.waitForDialogClose();
  715 |     await expect(this.getTableRow(newAccountHolder)).toBeVisible({ timeout: 15000 });
  716 |   }
  717 | 
  718 |   async deleteBank(accountHolder: string) {
  719 |     const row = this.getTableRow(accountHolder);
  720 |     await expect(row).toBeVisible({ timeout: 15000 });
  721 | 
  722 |     await this.clickRowAction(row, 'Delete');
  723 | 
  724 |     await this.confirmYes();
  725 |     await expect(this.getTableRow(accountHolder)).toBeHidden({ timeout: 15000 });
  726 |   }
  727 | 
  728 |   // ==========================================
  729 |   // 8. ACADEMICS
  730 |   // ==========================================
  731 | 
  732 |   async openAcademics() {
  733 |     await this.openPersonalSubTab('Academics');
  734 |   }
  735 | 
  736 |   async addAcademic(data: AcademicData) {
  737 |     await this.openAcademics();
  738 |     await this.page.getByText('Add New', { exact: true }).click();
  739 | 
  740 |     const qualDropdown = this.page
  741 |       .getByRole('combobox', { name: /qualification|degree/i })
  742 |       .or(this.page.getByRole('button', { name: 'dropdown trigger' }))
  743 |       .first();
  744 |     await this.selectDropdownOption(qualDropdown, data.qualification);
  745 | 
  746 |     const univInput = this.page.getByRole('textbox', { name: 'University*' });
  747 |     await univInput.fill(data.university);
  748 | 
  749 |     const specInput = this.page.getByRole('textbox', { name: 'Specialization*' });
  750 |     await specInput.fill(data.specialization);
  751 | 
  752 |     const gpaInput = this.page.getByRole('spinbutton', { name: 'GPA/CGPA*' });
  753 |     await gpaInput.fill(data.gpa);
  754 | 
  755 |     const fromDateInput = this.page.getByRole('textbox', { name: 'From Date*' });
  756 |     await fromDateInput.fill(data.fromDate);
  757 | 
  758 |     const toDateInput = this.page.getByRole('textbox', { name: 'To Date*' });
  759 |     await toDateInput.fill(data.toDate);
  760 | 
  761 |     const filePath = data.filePath || this.defaultAttachmentPath;
  762 |     await this.setFileInput(this.page.getByRole('button', { name: 'Choose File' }), filePath);
  763 | 
  764 |     const addButton = this.page.getByRole('button', { name: 'Add', exact: true });
  765 |     await expect(addButton).toBeEnabled();
  766 |     await addButton.click();
  767 | 
  768 |     await this.waitForDialogClose();
  769 |     await expect(this.getTableRow(data.university)).toBeVisible({ timeout: 15000 });
  770 |   }
  771 | 
  772 |   async updateAcademic(university: string, newGpa: string) {
  773 |     const row = this.getTableRow(university);
  774 |     await expect(row).toBeVisible({ timeout: 15000 });
  775 | 
  776 |     await this.clickRowAction(row, 'Update');
  777 | 
  778 |     const gpaInput = this.page.getByRole('spinbutton', { name: 'GPA/CGPA*' });
  779 |     await gpaInput.fill(newGpa);
  780 | 
  781 |     const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true });
  782 |     await updateBtn.click();
  783 | 
  784 |     await this.waitForDialogClose();
  785 |   }
  786 | 
  787 |   async deleteAcademic(university: string) {
  788 |     const row = this.getTableRow(university);
  789 |     await expect(row).toBeVisible({ timeout: 15000 });
  790 | 
  791 |     await this.clickRowAction(row, 'Delete');
  792 | 
  793 |     await this.confirmYes();
  794 |     await expect(this.getTableRow(university)).toBeHidden({ timeout: 15000 });
  795 |   }
  796 | 
  797 |   // ==========================================
  798 |   // 9. SKILLS
  799 |   // ==========================================
```