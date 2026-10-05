# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: my-info.spec.ts >> My Info Module Automation Suite >> TC08 - Bank Information CRUD
- Location: tests\my-info.spec.ts:155:7

# Error details

```
TimeoutError: locator.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('spinbutton', { name: 'Account Number*' })

```

# Page snapshot

```yaml
- generic [ref=f2e1]:
  - generic [ref=f2e4]:
    - generic [ref=f2e11]:
      - generic [ref=f2e12] [cursor=pointer]
      - generic [ref=f2e20] [cursor=pointer]
      - generic [ref=f2e28] [cursor=pointer]
      - generic [ref=f2e39] [cursor=pointer]:
        - paragraph [ref=f2e40]: Induu Priyaa
        - paragraph [ref=f2e41]: Chief Executive Officer
    - generic [ref=f2e47]:
      - list [ref=f2e52]:
        - listitem [ref=f2e53] [cursor=pointer]: Dashboard
        - listitem [ref=f2e55]:
          - generic [ref=f2e56]:
            - generic [ref=f2e57] [cursor=pointer]: Employees
            - generic [ref=f2e59] [cursor=pointer]: My Info
            - generic [ref=f2e61] [cursor=pointer]: Reports
            - generic [ref=f2e63] [cursor=pointer]: Time Off
            - generic [ref=f2e67] [cursor=pointer]: Attendance
            - generic [ref=f2e69] [cursor=pointer]: Project Management
            - generic [ref=f2e73] [cursor=pointer]: Skill Set
            - generic [ref=f2e75] [cursor=pointer]: On Behalf Of
            - generic [ref=f2e79] [cursor=pointer]: Pending Approvals
            - generic [ref=f2e83] [cursor=pointer]: PMS
        - listitem [ref=f2e87] [cursor=pointer]
      - generic [ref=f2e97]:
        - generic [ref=f2e98]:
          - generic [ref=f2e99]:
            - generic [ref=f2e100]:
              - text: My Info
              - generic [ref=f2e101]: 
            - generic [ref=f2e103]: Bank Info
            - generic [ref=f2e106] [cursor=pointer]
          - button [ref=f2e111] [cursor=pointer]: View History
        - generic [ref=f2e112]:
          - generic [ref=f2e115]:
            - generic [ref=f2e116]:
              - img [ref=f2e124] [cursor=pointer]
              - generic [ref=f2e125]:
                - paragraph [ref=f2e126]: Induu Priyaa
                - paragraph [ref=f2e127]: SD302262
                - paragraph [ref=f2e128]:
                  - link [ref=f2e129] [cursor=pointer]:
                    - /url: mailto:pavan.nedunuri@snaddevelopers.com
                    - generic [ref=f2e131]: pavan.nedunuri@snaddevelopers.com
                - paragraph [ref=f2e132]: Chief Executive Officer
                - paragraph [ref=f2e134]: Kerala,Kannur
                - paragraph [ref=f2e136]:
                  - generic [ref=f2e138]: Full Time|Morining Test|10:30-19:30
                - paragraph [ref=f2e139]:
                  - generic [ref=f2e141]: +91 9123499798
            - generic [ref=f2e144]:
              - paragraph [ref=f2e145]: Team Manager
              - paragraph [ref=f2e146]: Induu Priyaa
            - generic [ref=f2e149]:
              - paragraph [ref=f2e150]: Reporting Manager
              - paragraph [ref=f2e151]: Induu Priyaa
            - list [ref=f2e156]:
              - listitem [ref=f2e157]:
                - generic [ref=f2e158] [cursor=pointer]: Personal
              - listitem [ref=f2e159]:
                - generic [ref=f2e160] [cursor=pointer]: Job
              - listitem [ref=f2e161]:
                - generic [ref=f2e162] [cursor=pointer]: Documents
            - generic [ref=f2e166]:
              - generic [ref=f2e167] [cursor=pointer]: Basic Info
              - generic [ref=f2e171] [cursor=pointer]: Contact Info
              - generic [ref=f2e175] [cursor=pointer]: Addresses
              - generic [ref=f2e179] [cursor=pointer]: Emergency Contacts
              - generic [ref=f2e183] [cursor=pointer]: Family Members
              - generic [ref=f2e187] [cursor=pointer]: Identity Info
              - generic [ref=f2e191] [cursor=pointer]: Bank Info
              - generic [ref=f2e195] [cursor=pointer]: Academics
              - generic [ref=f2e199] [cursor=pointer]: Skills
          - generic [ref=f2e205]:
            - generic [ref=f2e206]:
              - generic [ref=f2e207]: Bank Info
              - generic [ref=f2e208] [cursor=pointer]:
                - generic [ref=f2e209]: 
                - text: Add New
            - table [ref=f2e214]:
              - rowgroup [ref=f2e215]:
                - row [ref=f2e216]:
                  - columnheader [ref=f2e217] [cursor=pointer]: Bank Name
                  - columnheader [ref=f2e226] [cursor=pointer]: Account Holder'S Name
                  - columnheader [ref=f2e235] [cursor=pointer]: Account Number
                  - columnheader [ref=f2e244] [cursor=pointer]: Routing Number
                  - columnheader [ref=f2e253]: Proof
                  - columnheader [ref=f2e254] [cursor=pointer]: Primary Bank
                  - columnheader [ref=f2e263]: Action
              - rowgroup [ref=f2e264]:
                - row [ref=f2e265]:
                  - cell [ref=f2e266]: Axis Bank
                  - cell [ref=f2e267]: Pavan Teja
                  - cell [ref=f2e268]: "132432424512443420"
                  - cell [ref=f2e269]: AXB1234556
                  - cell [ref=f2e270]:
                    - generic [ref=f2e273] [cursor=pointer]
                  - cell [ref=f2e276]: "Yes"
                  - cell [ref=f2e277]:
                    - generic [ref=f2e278]:
                      - generic [ref=f2e279] [cursor=pointer]: 
                      - text:  
                - row [ref=f2e281]:
                  - cell [ref=f2e282]: Maharashtra Gramin Bank
                  - cell [ref=f2e283]: Pavan Nedunuri
                  - cell [ref=f2e284]: "3453218763121323"
                  - cell [ref=f2e285]: Tdhh1233483
                  - cell [ref=f2e286]:
                    - generic [ref=f2e289] [cursor=pointer]
                  - cell [ref=f2e292]: "No"
                  - cell [ref=f2e293]:
                    - generic [ref=f2e294]:
                      - generic [ref=f2e295] [cursor=pointer]: 
                      - text:  
  - dialog [ref=f2e298]:
    - document:
      - generic [ref=f2e300]:
        - paragraph [ref=f2e303]: Add Bank Info
        - generic [ref=f2e305]:
          - generic [ref=f2e306]:
            - generic [ref=f2e307]:
              - generic [ref=f2e308]: Bank Name*
              - generic [ref=f2e310] [cursor=pointer]:
                - combobox "Maharashtra Gramin Bank" [ref=f2e311]
                - button "dropdown trigger" [ref=f2e312]
            - generic [ref=f2e316]:
              - generic [ref=f2e317]: Account Holder's Name*
              - textbox "Account Holder's Name*" [active] [ref=f2e318]:
                - /placeholder: Please enter account holder's name
                - text: PW_Bank_21094
            - generic [ref=f2e319]:
              - generic [ref=f2e320]: Account Number*
              - textbox "Account Number*" [ref=f2e321]:
                - /placeholder: Please enter account number
            - generic [ref=f2e322]:
              - generic [ref=f2e323]: IFSC Code*
              - textbox "IFSC Code*" [ref=f2e324]:
                - /placeholder: Please enter IFSC code
            - generic [ref=f2e325]:
              - generic [ref=f2e326]: Attachment (Upload the Pdf/Image)*
              - button "Choose File" [ref=f2e327] [cursor=pointer]
              - paragraph [ref=f2e329]: "Note: Only Pdf/Image files are allowed. The file size should be less than 25MB."
            - generic [ref=f2e331]:
              - checkbox "Primary Bank" [ref=f2e333] [cursor=pointer]
              - generic [ref=f2e334]: Primary Bank
          - generic [ref=f2e335]:
            - button "Cancel" [ref=f2e336] [cursor=pointer]
            - button "Add" [disabled] [ref=f2e337] [cursor=pointer]
```

# Test source

```ts
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
  677 |     const accountInput = this.page.getByRole('spinbutton', { name: 'Account Number*' });
> 678 |     await accountInput.fill(data.accountNumber);
      |                        ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
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
  729 |   async openAcademics() {
  730 |     await this.openPersonalSubTab('Academics');
  731 |   }
  732 | 
  733 |   async addAcademic(data: AcademicData) {
  734 |     await this.openAcademics();
  735 |     await this.page.getByText('Add New', { exact: true }).click();
  736 | 
  737 |     const qualDropdown = this.page
  738 |       .getByRole('combobox', { name: /qualification|degree/i })
  739 |       .or(this.page.getByRole('button', { name: 'dropdown trigger' }))
  740 |       .first();
  741 |     await this.selectDropdownOption(qualDropdown, data.qualification);
  742 | 
  743 |     const univInput = this.page.getByRole('textbox', { name: 'University*' });
  744 |     await univInput.fill(data.university);
  745 | 
  746 |     const specInput = this.page.getByRole('textbox', { name: 'Specialization*' });
  747 |     await specInput.fill(data.specialization);
  748 | 
  749 |     const gpaInput = this.page.getByRole('spinbutton', { name: 'GPA/CGPA*' });
  750 |     await gpaInput.fill(data.gpa);
  751 | 
  752 |     const fromDateInput = this.page.getByRole('textbox', { name: 'From Date*' });
  753 |     await fromDateInput.fill(data.fromDate);
  754 | 
  755 |     const toDateInput = this.page.getByRole('textbox', { name: 'To Date*' });
  756 |     await toDateInput.fill(data.toDate);
  757 | 
  758 |     const filePath = data.filePath || this.defaultAttachmentPath;
  759 |     await this.setFileInput(this.page.getByRole('button', { name: 'Choose File' }), filePath);
  760 | 
  761 |     const addButton = this.page.getByRole('button', { name: 'Add', exact: true });
  762 |     await expect(addButton).toBeEnabled();
  763 |     await addButton.click();
  764 | 
  765 |     await this.waitForDialogClose();
  766 |     await expect(this.getTableRow(data.university)).toBeVisible({ timeout: 15000 });
  767 |   }
  768 | 
  769 |   async updateAcademic(university: string, newGpa: string) {
  770 |     const row = this.getTableRow(university);
  771 |     await expect(row).toBeVisible({ timeout: 15000 });
  772 | 
  773 |     await this.clickRowAction(row, 'Update');
  774 | 
  775 |     const gpaInput = this.page.getByRole('spinbutton', { name: 'GPA/CGPA*' });
  776 |     await gpaInput.fill(newGpa);
  777 | 
  778 |     const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true });
```