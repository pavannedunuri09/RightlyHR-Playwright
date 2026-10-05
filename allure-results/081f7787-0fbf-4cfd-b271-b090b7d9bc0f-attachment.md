# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: probation.spec.ts >> Probation Flow >> 06. TM Reject probation decision >> rejects second pending record after RM reject and verifies Approved status on Probation Info
- Location: tests\probation.spec.ts:97:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('app-probation-details table tbody tr').filter({ has: locator('td').filter({ hasText: /^Approved$/i }) }).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('app-probation-details table tbody tr').filter({ has: locator('td').filter({ hasText: /^Approved$/i }) }).first()

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
- text: Probation Employee  Probation Info
- img
- button "View History"
- button "Generate Credentials"
- img "Profile Image"
- img "edit-icon"
- paragraph: harshitha Palagiriii
- paragraph: SD3021343
- paragraph:
  - link "IconBhavitha.palagiri@snaddevelopers.com":
    - /url: mailto:Bhavitha.palagiri@snaddevelopers.com
    - img "Icon"
    - text: Bhavitha.palagiri@snaddevelopers.com
- paragraph:
  - img "Icon"
  - text: Chief Executive Officer
- paragraph:
  - img "Icon"
  - text: Hyderabad,Jai Hind Enclave building
- paragraph:
  - img "Icon"
  - text: Full Time|GraveyardShift|18:30-03:30
- paragraph:
  - img "Icon"
  - text: +91 9875755554
- paragraph: Team Manager
- paragraph: Induu Priyaa
- paragraph: Reporting Manager
- paragraph: Induu Priyaa
- list:
  - listitem: Personal
  - listitem: Job
  - listitem: Documents
- img "Pre Onboarding Info"
- text: Pre Onboarding Info
- img "Onboarding Info"
- text: Onboarding Info
- img "Compensations"
- text: Compensations
- img "Probation Info"
- text: Probation Info
- img "Job Info"
- text: Job Info
- img "Team Members"
- text: Team Members
- img "Assigned Assets"
- text: Assigned Assets
- img "Employment History"
- text: Employment History
- img "Certifications"
- text: Certifications
- img "Desk Info"
- text: Desk Info
- img "Separation Request"
- text: Separation Request
- img "No Due Clearance Info"
- text: No Due Clearance Info
- img "Onboarding Documents"
- text: Onboarding Documents
- img "Trainee Onboard Request"
- text: Trainee Onboard Request
- img "Offboarding Info"
- text: Offboarding Info
- img "Cards"
- text: Cards
- img "Assigned Projects"
- text: Assigned Projects Probation Info
- table:
  - rowgroup:
    - row "Applied Date Probation Period(In days) Probation start date Probation end date Probation extended date Approver History status Action(s)":
      - columnheader "Applied Date":
        - text: Applied Date
        - img
      - columnheader "Probation Period(In days)":
        - text: Probation Period(In days)
        - img
      - columnheader "Probation start date":
        - text: Probation start date
        - img
      - columnheader "Probation end date":
        - text: Probation end date
        - img
      - columnheader "Probation extended date":
        - text: Probation extended date
        - img
      - columnheader "Approver History"
      - columnheader "status":
        - text: status
        - img
      - columnheader "Action(s)"
  - rowgroup:
    - row "Feb 2, 2026 50 Feb 2, 2026 Apr 2, 2026 May 2, 2026 Rejected ":
      - cell "Feb 2, 2026"
      - cell "50"
      - cell "Feb 2, 2026"
      - cell "Apr 2, 2026"
      - cell "May 2, 2026"
      - cell:
        - img
      - cell "Rejected"
      - cell ""
```

# Test source

```ts
  790 | 
  791 |     if (await this.confirmedRadio.isVisible().catch(() => false)) {
  792 |       return;
  793 |     }
  794 | 
  795 |     if (!(await this.isAssessmentFormVisible())) {
  796 |       await this.openAssessmentForm(employeeName, searchText);
  797 |     }
  798 | 
  799 |     if (await this.rejectRadio.isVisible().catch(() => false)) {
  800 |       return;
  801 |     }
  802 | 
  803 |     if (await this.confirmedRadio.isVisible().catch(() => false)) {
  804 |       return;
  805 |     }
  806 | 
  807 |     await this.fillAssessmentForm();
  808 |     await this.submitAssessment();
  809 |     await this.confirmProbationStatusText.waitFor({ state: 'visible', timeout: 15000 });
  810 |   }
  811 | 
  812 |   async rejectProbationDecision(description = 'Reject the Probation') {
  813 |     await this.confirmProbationStatusText.waitFor({ state: 'visible', timeout: 15000 });
  814 |     await this.rejectRadio.check();
  815 |     await this.decisionDescription.waitFor({ state: 'visible', timeout: 10000 });
  816 |     await this.decisionDescription.click();
  817 |     await this.decisionDescription.fill('');
  818 |     await this.decisionDescription.pressSequentially(description.trim());
  819 |     await this.decisionDescription.blur();
  820 |     await this.confirmProbationStatusText.click();
  821 |     await expect(this.decisionSubmitButton).toBeEnabled({ timeout: 15000 });
  822 |     await this.decisionSubmitButton.click();
  823 |     await this.probationRejectedMessage.waitFor({ state: 'visible', timeout: 15000 });
  824 |   }
  825 | 
  826 |   async pickExtendDate() {
  827 |     await this.extendDateInput.waitFor({ state: 'visible', timeout: 10000 });
  828 |     await this.extendDateInput.click();
  829 | 
  830 |     let value = (await this.extendDateInput.inputValue().catch(() => '')).trim();
  831 |     if (value) {
  832 |       return;
  833 |     }
  834 | 
  835 |     const dropdown = this.decisionDialog.locator('.p-dropdown, p-dropdown, p-select').first();
  836 |     if (await dropdown.isVisible().catch(() => false)) {
  837 |       await dropdown.click();
  838 |       await this.page.keyboard.press('ArrowDown');
  839 |       await this.page.keyboard.press('Enter');
  840 |       value = (await this.extendDateInput.inputValue().catch(() => '')).trim();
  841 |     }
  842 | 
  843 |     if (!value) {
  844 |       const nextMonth = new Date();
  845 |       nextMonth.setMonth(nextMonth.getMonth() + 1);
  846 |       const formatted = nextMonth.toISOString().slice(0, 10);
  847 |       await this.extendDateInput.fill(formatted);
  848 |       await this.extendDateInput.press('Tab');
  849 |     }
  850 |   }
  851 | 
  852 |   async extendProbationDecision(feedback = 'Extend probation feedback') {
  853 |     await this.confirmProbationStatusText.waitFor({ state: 'visible', timeout: 15000 });
  854 |     await this.extendRadio.check();
  855 |     await this.pickExtendDate();
  856 |     await this.extendFeedbackInput.waitFor({ state: 'visible', timeout: 10000 });
  857 |     await this.extendFeedbackInput.click();
  858 |     await this.extendFeedbackInput.fill('');
  859 |     await this.extendFeedbackInput.pressSequentially(feedback.trim(), { delay: 30 });
  860 |     await this.extendFeedbackInput.press('Tab');
  861 |     await this.confirmProbationStatusText.click();
  862 |     await expect(this.decisionSubmitButton).toBeEnabled({ timeout: 15000 });
  863 |     await this.decisionSubmitButton.click();
  864 |     await this.probationExtendedMessage.first().waitFor({ state: 'visible', timeout: 15000 });
  865 |   }
  866 | 
  867 |   async confirmProbationDecision(comments = 'Confirm probation decision') {
  868 |     await this.confirmProbationStatusText.waitFor({ state: 'visible', timeout: 15000 });
  869 |     await this.confirmedRadio.check();
  870 |     if (!(await this.confirmedRadio.isChecked().catch(() => false))) {
  871 |       await this.decisionDialog.getByText('Confirmed', { exact: true }).click();
  872 |     }
  873 |     await expect(this.confirmedRadio).toBeChecked({ timeout: 5000 });
  874 | 
  875 |     const commentsInput = this.decisionDialog.getByRole('textbox', { name: /Description|Comments/i }).first();
  876 |     await commentsInput.waitFor({ state: 'visible', timeout: 10000 });
  877 |     await commentsInput.click();
  878 |     await commentsInput.fill('');
  879 |     await commentsInput.pressSequentially(comments.trim(), { delay: 30 });
  880 |     await commentsInput.blur();
  881 |     await this.confirmProbationStatusText.click();
  882 |     await expect(this.decisionSubmitButton).toBeEnabled({ timeout: 15000 });
  883 |     await this.decisionSubmitButton.click();
  884 |     await this.probationApprovedMessage.first().waitFor({ state: 'visible', timeout: 15000 });
  885 |   }
  886 | 
  887 |   async assertApprovedOnProbationInfo(employeeName: string, searchText: string) {
  888 |     await this.openProbationInfoForEmployee(employeeName, searchText);
  889 |     const approvedRow = this.approvedProbationInfoRow();
> 890 |     await expect(approvedRow).toBeVisible({ timeout: 15000 });
      |                               ^ Error: expect(locator).toBeVisible() failed
  891 |     await expect(approvedRow.locator('td').filter({ hasText: /^Approved$/i })).toBeVisible();
  892 |   }
  893 | 
  894 |   async openApproverHistory(row = this.approvedProbationInfoRow()) {
  895 |     await row.waitFor({ state: 'visible', timeout: 15000 });
  896 |     const historyCell = row.locator('td').nth(5);
  897 |     const trigger = this.approverHistoryIcon(row);
  898 |     if (await trigger.isVisible().catch(() => false)) {
  899 |       await trigger.click();
  900 |     } else {
  901 |       await historyCell.click();
  902 |     }
  903 |     await this.page.getByRole('dialog').filter({ hasText: 'Approver History' })
  904 |       .waitFor({ state: 'visible', timeout: 15000 });
  905 |   }
  906 | 
  907 |   async assertExtendApproverHistory() {
  908 |     const panel = this.page.getByRole('dialog').filter({ hasText: 'Approver History' });
  909 |     await expect(panel).toBeVisible({ timeout: 15000 });
  910 |     await expect(panel.getByRole('columnheader', { name: 'Approver Role' })).toBeVisible();
  911 |     await expect(panel.getByRole('columnheader', { name: 'Status' })).toBeVisible();
  912 |     await expect(panel.getByRole('columnheader', { name: 'Extended Date' })).toBeVisible();
  913 |     await expect(panel.getByRole('cell', { name: 'TM', exact: true })).toBeVisible();
  914 |     await expect(panel.getByRole('cell', { name: 'RM', exact: true })).toBeVisible();
  915 |     await expect(panel.getByRole('cell', { name: 'Extended', exact: true }).first()).toBeVisible();
  916 |     await expect(panel.getByRole('cell', { name: 'Extended', exact: true }).nth(1)).toBeVisible();
  917 |     await expect(panel.getByText(/saii Pavan Dinesh Tejaa/i).first()).toBeVisible();
  918 |   }
  919 | 
  920 |   async assertConfirmApproverHistory() {
  921 |     const panel = this.page.getByRole('dialog').filter({ hasText: 'Approver History' });
  922 |     await expect(panel).toBeVisible({ timeout: 15000 });
  923 |     await expect(panel.getByRole('columnheader', { name: 'Approver Role' })).toBeVisible();
  924 |     await expect(panel.getByRole('columnheader', { name: 'Status' })).toBeVisible();
  925 |     await expect(panel.getByRole('cell', { name: 'TM', exact: true })).toBeVisible();
  926 |     await expect(panel.getByRole('cell', { name: 'RM', exact: true })).toBeVisible();
  927 |     await expect(panel.getByRole('cell', { name: /Confirmed|Approved/i }).first()).toBeVisible();
  928 |     await expect(panel.getByText(/saii Pavan Dinesh Tejaa/i).first()).toBeVisible();
  929 |   }
  930 | 
  931 |   async assertExtendedOnProbationInfo(employeeName: string, searchText: string) {
  932 |     await this.openProbationInfoForEmployee(employeeName, searchText);
  933 |     const extendedRow = this.extendedProbationInfoRow();
  934 |     await expect(extendedRow).toBeVisible({ timeout: 15000 });
  935 |     await expect(extendedRow.locator('td').filter({ hasText: /^Extended$/i })).toBeVisible();
  936 |   }
  937 | 
  938 |   async assertExtendedKebabCanRaiseRequest() {
  939 |     const row = this.extendedProbationInfoRow();
  940 |     await row.waitFor({ state: 'visible', timeout: 15000 });
  941 |     await this.jobInfo.openRowKebab(row);
  942 |     await expect(this.requestMenuItem()).toBeVisible({ timeout: 10000 });
  943 |     await this.page.keyboard.press('Escape');
  944 |   }
  945 | 
  946 |   async assertRejectedOnProbationInfo(employeeName: string, searchText: string) {
  947 |     await this.openEmployeesProbation();
  948 |     await this.openProbationEmployee(employeeName, searchText);
  949 |     await this.openProbationInfoTab();
  950 |     await expect(this.page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible({ timeout: 15000 });
  951 |   }
  952 | 
  953 |   async selectComboboxOption(combobox: Locator, optionName?: string) {
  954 |     await combobox.click();
  955 | 
  956 |     if (optionName) {
  957 |       const named = this.page.getByRole('option', { name: optionName });
  958 |       if (await named.isVisible({ timeout: 3000 }).catch(() => false)) {
  959 |         await named.click();
  960 |         return optionName;
  961 |       }
  962 |     }
  963 | 
  964 |     const option = this.page.getByRole('option').first();
  965 |     await option.waitFor({ state: 'visible', timeout: 10000 });
  966 |     const selected = ((await option.innerText()) || '').replace(/\s+/g, ' ').trim();
  967 |     await option.click();
  968 |     return selected;
  969 |   }
  970 | 
  971 |   async openGenerateDocuments() {
  972 |     await this.openEmployeesManagement();
  973 |     await this.generateDocumentsButton.waitFor({ state: 'visible', timeout: 15000 });
  974 |     await this.generateDocumentsButton.click();
  975 |     await this.probationConfirmationLetterCard.waitFor({ state: 'visible', timeout: 15000 });
  976 |   }
  977 | 
  978 |   async selectProbationConfirmationLetter() {
  979 |     await this.probationConfirmationLetterCard.click();
  980 |     await this.employeeCombobox.waitFor({ state: 'visible', timeout: 15000 });
  981 |   }
  982 | 
  983 |   async fillProbationConfirmationLetterForm(options: {
  984 |     employeeOption: string;
  985 |     issuedDate?: string;
  986 |     effectiveDate?: string;
  987 |     documentType?: string;
  988 |     signatureAuthority?: string;
  989 |   }) {
  990 |     const issuedDate = options.issuedDate ?? this.todayDateString();
```