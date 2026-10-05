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
                  - generic [ref=f2e138]: Full-Time|Morining Test|10:30-19:30
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
                - text: PW_Bank_64969
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
  632 |     const row = this.getTableRow(identityNumber);
  633 |     await expect(row).toBeVisible({ timeout: 15000 });
  634 | 
  635 |     await this.clickRowAction(row, 'Delete');
  636 | 
  637 |     await this.confirmYes();
  638 |     await expect(this.getTableRow(identityNumber)).toBeHidden({ timeout: 15000 });
  639 |   }
  640 | 
  641 |   // ==========================================
  642 |   // 7. BANK INFORMATION
  643 |   // ==========================================
  644 | 
  645 |   async openBankInfo() {
  646 |     await this.openPersonalSubTab('Bank Info');
  647 |   }
  648 | 
  649 |   async addBank(data: BankData) {
  650 |     await this.openBankInfo();
  651 |     await this.page.getByText('Add New', { exact: true }).click();
  652 | 
  653 |     const bankDropdown = this.page
  654 |       .getByRole('combobox', { name: /bank name/i })
  655 |       .or(this.page.getByRole('button', { name: 'dropdown trigger' }))
  656 |       .first();
  657 |     await this.selectDropdownOption(bankDropdown, data.bankName);
  658 | 
  659 |     const holderInput = this.page.getByRole('textbox', { name: "Account Holder's Name*" });
  660 |     await holderInput.fill(data.accountHolder);
  661 | 
  662 |     const accountInput = this.page.getByRole('spinbutton', { name: 'Account Number*' });
> 663 |     await accountInput.fill(data.accountNumber);
      |                        ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
  664 | 
  665 |     const ifscInput = this.page.getByRole('textbox', { name: 'IFSC Code*' });
  666 |     await ifscInput.fill(data.ifsc);
  667 | 
  668 |     const filePath = data.filePath || this.defaultAttachmentPath;
  669 |     await this.setFileInput(this.page.getByRole('button', { name: 'Choose File' }), filePath);
  670 | 
  671 |     if (data.primaryBank) {
  672 |       const primaryCheckbox = this.page.getByRole('checkbox', { name: 'Primary Bank' });
  673 |       await primaryCheckbox.check();
  674 |     }
  675 | 
  676 |     const addButton = this.page.getByRole('button', { name: 'Add', exact: true });
  677 |     await expect(addButton).toBeEnabled();
  678 |     await addButton.click();
  679 | 
  680 |     await this.waitForDialogClose();
  681 |     await expect(this.getTableRow(data.accountHolder)).toBeVisible({ timeout: 15000 });
  682 |   }
  683 | 
  684 |   async updateBank(accountHolder: string, newAccountHolder: string) {
  685 |     const row = this.getTableRow(accountHolder);
  686 |     await expect(row).toBeVisible({ timeout: 15000 });
  687 | 
  688 |     await this.clickRowAction(row, 'Update');
  689 | 
  690 |     const holderInput = this.page.getByRole('textbox', { name: "Account Holder's Name*" });
  691 |     await holderInput.fill(newAccountHolder);
  692 | 
  693 |     const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true });
  694 |     await updateBtn.click();
  695 | 
  696 |     await this.waitForDialogClose();
  697 |     await expect(this.getTableRow(newAccountHolder)).toBeVisible({ timeout: 15000 });
  698 |   }
  699 | 
  700 |   async deleteBank(accountHolder: string) {
  701 |     const row = this.getTableRow(accountHolder);
  702 |     await expect(row).toBeVisible({ timeout: 15000 });
  703 | 
  704 |     await this.clickRowAction(row, 'Delete');
  705 | 
  706 |     await this.confirmYes();
  707 |     await expect(this.getTableRow(accountHolder)).toBeHidden({ timeout: 15000 });
  708 |   }
  709 | 
  710 |   // ==========================================
  711 |   // 8. ACADEMICS
  712 |   // ==========================================
  713 | 
  714 |   async openAcademics() {
  715 |     await this.openPersonalSubTab('Academics');
  716 |   }
  717 | 
  718 |   async addAcademic(data: AcademicData) {
  719 |     await this.openAcademics();
  720 |     await this.page.getByText('Add New', { exact: true }).click();
  721 | 
  722 |     const qualDropdown = this.page
  723 |       .getByRole('combobox', { name: /qualification|degree/i })
  724 |       .or(this.page.getByRole('button', { name: 'dropdown trigger' }))
  725 |       .first();
  726 |     await this.selectDropdownOption(qualDropdown, data.qualification);
  727 | 
  728 |     const univInput = this.page.getByRole('textbox', { name: 'University*' });
  729 |     await univInput.fill(data.university);
  730 | 
  731 |     const specInput = this.page.getByRole('textbox', { name: 'Specialization*' });
  732 |     await specInput.fill(data.specialization);
  733 | 
  734 |     const gpaInput = this.page.getByRole('spinbutton', { name: 'GPA/CGPA*' });
  735 |     await gpaInput.fill(data.gpa);
  736 | 
  737 |     const fromDateInput = this.page.getByRole('textbox', { name: 'From Date*' });
  738 |     await fromDateInput.fill(data.fromDate);
  739 | 
  740 |     const toDateInput = this.page.getByRole('textbox', { name: 'To Date*' });
  741 |     await toDateInput.fill(data.toDate);
  742 | 
  743 |     const filePath = data.filePath || this.defaultAttachmentPath;
  744 |     await this.setFileInput(this.page.getByRole('button', { name: 'Choose File' }), filePath);
  745 | 
  746 |     const addButton = this.page.getByRole('button', { name: 'Add', exact: true });
  747 |     await expect(addButton).toBeEnabled();
  748 |     await addButton.click();
  749 | 
  750 |     await this.waitForDialogClose();
  751 |     await expect(this.getTableRow(data.university)).toBeVisible({ timeout: 15000 });
  752 |   }
  753 | 
  754 |   async updateAcademic(university: string, newGpa: string) {
  755 |     const row = this.getTableRow(university);
  756 |     await expect(row).toBeVisible({ timeout: 15000 });
  757 | 
  758 |     await this.clickRowAction(row, 'Update');
  759 | 
  760 |     const gpaInput = this.page.getByRole('spinbutton', { name: 'GPA/CGPA*' });
  761 |     await gpaInput.fill(newGpa);
  762 | 
  763 |     const updateBtn = this.page.getByRole('button', { name: 'Update', exact: true });
```