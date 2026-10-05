# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: probation.spec.ts >> Probation Flow — Confirm from Extended >> 12. Verify Extended status on Probation Info >> shows Extended status with Request for Probation kebab menu
- Location: tests\probation.spec.ts:212:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('app-probation-details table tbody tr').filter({ has: locator('td').filter({ hasText: /^\s*Extended\s*$/i }) }).last()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('app-probation-details table tbody tr').filter({ has: locator('td').filter({ hasText: /^\s*Extended\s*$/i }) }).last()

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
    - row "Feb 2, 2026 50 Feb 2, 2026 Apr 2, 2026 - Withdrawn -":
      - cell "Feb 2, 2026"
      - cell "50"
      - cell "Feb 2, 2026"
      - cell "Apr 2, 2026"
      - cell "-"
      - cell:
        - img
      - cell "Withdrawn"
      - cell "-"
    - row "Feb 2, 2026 50 Feb 2, 2026 Apr 2, 2026 Nov 1, 2026 Approved -":
      - cell "Feb 2, 2026"
      - cell "50"
      - cell "Feb 2, 2026"
      - cell "Apr 2, 2026"
      - cell "Nov 1, 2026"
      - cell:
        - img
      - cell "Approved"
      - cell "-"
```

# Test source

```ts
  908  | 
  909  |     const dropdown = this.decisionDialog.locator('.p-dropdown, p-dropdown, p-select').first();
  910  |     if (await dropdown.isVisible().catch(() => false)) {
  911  |       await dropdown.click();
  912  |       await this.page.keyboard.press('ArrowDown');
  913  |       await this.page.keyboard.press('Enter');
  914  |       value = (await this.extendDateInput.inputValue().catch(() => '')).trim();
  915  |     }
  916  | 
  917  |     if (!value) {
  918  |       const nextMonth = new Date();
  919  |       nextMonth.setMonth(nextMonth.getMonth() + 1);
  920  |       const formatted = nextMonth.toISOString().slice(0, 10);
  921  |       await this.extendDateInput.fill(formatted);
  922  |       await this.extendDateInput.press('Tab');
  923  |     }
  924  |   }
  925  | 
  926  |   async extendProbationDecision(feedback = 'Extend probation feedback') {
  927  |     await this.confirmProbationStatusText.waitFor({ state: 'visible', timeout: 15000 });
  928  |     await this.extendRadio.check();
  929  |     await this.pickExtendDate();
  930  |     await this.extendFeedbackInput.waitFor({ state: 'visible', timeout: 10000 });
  931  |     await this.extendFeedbackInput.click();
  932  |     await this.extendFeedbackInput.fill('');
  933  |     await this.extendFeedbackInput.pressSequentially(feedback.trim(), { delay: 30 });
  934  |     await this.extendFeedbackInput.press('Tab');
  935  |     await this.confirmProbationStatusText.click();
  936  |     await expect(this.decisionSubmitButton).toBeEnabled({ timeout: 15000 });
  937  |     await this.decisionSubmitButton.click();
  938  |     await this.probationExtendedMessage.first().waitFor({ state: 'visible', timeout: 15000 });
  939  |   }
  940  | 
  941  |   async confirmProbationDecision(comments = 'Confirm probation decision') {
  942  |     await this.confirmProbationStatusText.waitFor({ state: 'visible', timeout: 15000 });
  943  |     await this.confirmedRadio.check();
  944  |     if (!(await this.confirmedRadio.isChecked().catch(() => false))) {
  945  |       await this.decisionDialog.getByText('Confirmed', { exact: true }).click();
  946  |     }
  947  |     await expect(this.confirmedRadio).toBeChecked({ timeout: 5000 });
  948  | 
  949  |     const commentsInput = this.decisionDialog.getByRole('textbox', { name: /Description|Comments/i }).first();
  950  |     await commentsInput.waitFor({ state: 'visible', timeout: 10000 });
  951  |     await commentsInput.click();
  952  |     await commentsInput.fill('');
  953  |     await commentsInput.pressSequentially(comments.trim(), { delay: 30 });
  954  |     await commentsInput.blur();
  955  |     await this.confirmProbationStatusText.click();
  956  |     await expect(this.decisionSubmitButton).toBeEnabled({ timeout: 15000 });
  957  |     await this.decisionSubmitButton.click();
  958  |     await this.probationApprovedMessage.first().waitFor({ state: 'visible', timeout: 15000 });
  959  |   }
  960  | 
  961  |   async assertApprovedOnProbationInfo(employeeName: string, searchText: string) {
  962  |     await this.openProbationInfoForEmployee(employeeName, searchText);
  963  |     const approvedRow = this.approvedProbationInfoRow();
  964  |     await expect(approvedRow).toBeVisible({ timeout: 15000 });
  965  |     await expect(approvedRow.locator('td').filter({ hasText: /^Approved$/i })).toBeVisible();
  966  |   }
  967  | 
  968  |   async openApproverHistory(row = this.approvedProbationInfoRow()) {
  969  |     await row.waitFor({ state: 'visible', timeout: 15000 });
  970  |     const historyCell = row.locator('td').nth(5);
  971  |     const trigger = this.approverHistoryIcon(row);
  972  |     if (await trigger.isVisible().catch(() => false)) {
  973  |       await trigger.click();
  974  |     } else {
  975  |       await historyCell.click();
  976  |     }
  977  |     await this.page.getByRole('dialog').filter({ hasText: 'Approver History' })
  978  |       .waitFor({ state: 'visible', timeout: 15000 });
  979  |   }
  980  | 
  981  |   async assertExtendApproverHistory() {
  982  |     const panel = this.page.getByRole('dialog').filter({ hasText: 'Approver History' });
  983  |     await expect(panel).toBeVisible({ timeout: 15000 });
  984  |     await expect(panel.getByRole('columnheader', { name: 'Approver Role' })).toBeVisible();
  985  |     await expect(panel.getByRole('columnheader', { name: 'Status' })).toBeVisible();
  986  |     await expect(panel.getByRole('columnheader', { name: 'Extended Date' })).toBeVisible();
  987  |     await expect(panel.getByRole('cell', { name: 'TM', exact: true })).toBeVisible();
  988  |     await expect(panel.getByRole('cell', { name: 'RM', exact: true })).toBeVisible();
  989  |     await expect(panel.getByRole('cell', { name: 'Extended', exact: true }).first()).toBeVisible();
  990  |     await expect(panel.getByRole('cell', { name: 'Extended', exact: true }).nth(1)).toBeVisible();
  991  |     await expect(panel.getByText(/saii Pavan Dinesh Tejaa/i).first()).toBeVisible();
  992  |   }
  993  | 
  994  |   async assertConfirmApproverHistory() {
  995  |     const panel = this.page.getByRole('dialog').filter({ hasText: 'Approver History' });
  996  |     await expect(panel).toBeVisible({ timeout: 15000 });
  997  |     await expect(panel.getByRole('columnheader', { name: 'Approver Role' })).toBeVisible();
  998  |     await expect(panel.getByRole('columnheader', { name: 'Status' })).toBeVisible();
  999  |     await expect(panel.getByRole('cell', { name: 'TM', exact: true })).toBeVisible();
  1000 |     await expect(panel.getByRole('cell', { name: 'RM', exact: true })).toBeVisible();
  1001 |     await expect(panel.getByRole('cell', { name: /Confirmed|Approved/i }).first()).toBeVisible();
  1002 |     await expect(panel.getByText(/saii Pavan Dinesh Tejaa/i).first()).toBeVisible();
  1003 |   }
  1004 | 
  1005 |   async assertExtendedOnProbationInfo(employeeName: string, searchText: string) {
  1006 |     await this.openProbationInfoForEmployee(employeeName, searchText);
  1007 |     const extendedRow = this.extendedProbationInfoRow();
> 1008 |     await expect(extendedRow).toBeVisible({ timeout: 15000 });
       |                               ^ Error: expect(locator).toBeVisible() failed
  1009 |     await expect(extendedRow.locator('td').filter({ hasText: /^Extended$/i })).toBeVisible();
  1010 |   }
  1011 | 
  1012 |   async assertExtendedKebabCanRaiseRequest() {
  1013 |     const row = this.extendedProbationInfoRow();
  1014 |     await row.waitFor({ state: 'visible', timeout: 15000 });
  1015 |     await this.jobInfo.openRowKebab(row);
  1016 |     await expect(this.requestMenuItem()).toBeVisible({ timeout: 10000 });
  1017 |     await this.page.keyboard.press('Escape');
  1018 |   }
  1019 | 
  1020 |   async assertRejectedOnProbationInfo(employeeName: string, searchText: string) {
  1021 |     await this.openEmployeesProbation();
  1022 |     await this.openProbationEmployee(employeeName, searchText);
  1023 |     await this.openProbationInfoTab();
  1024 |     await expect(this.page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible({ timeout: 15000 });
  1025 |   }
  1026 | 
  1027 |   async selectComboboxOption(combobox: Locator, optionName?: string) {
  1028 |     await combobox.click();
  1029 | 
  1030 |     if (optionName) {
  1031 |       const named = this.page.getByRole('option', { name: optionName });
  1032 |       if (await named.isVisible({ timeout: 3000 }).catch(() => false)) {
  1033 |         await named.click();
  1034 |         return optionName;
  1035 |       }
  1036 |     }
  1037 | 
  1038 |     const option = this.page.getByRole('option').first();
  1039 |     await option.waitFor({ state: 'visible', timeout: 10000 });
  1040 |     const selected = ((await option.innerText()) || '').replace(/\s+/g, ' ').trim();
  1041 |     await option.click();
  1042 |     return selected;
  1043 |   }
  1044 | 
  1045 |   async openGenerateDocuments() {
  1046 |     await this.openEmployeesManagement();
  1047 |     await this.generateDocumentsButton.waitFor({ state: 'visible', timeout: 15000 });
  1048 |     await this.generateDocumentsButton.click();
  1049 |     await this.probationConfirmationLetterCard.waitFor({ state: 'visible', timeout: 15000 });
  1050 |   }
  1051 | 
  1052 |   async selectProbationConfirmationLetter() {
  1053 |     await this.probationConfirmationLetterCard.click();
  1054 |     await this.employeeCombobox.waitFor({ state: 'visible', timeout: 15000 });
  1055 |   }
  1056 | 
  1057 |   async fillProbationConfirmationLetterForm(options: {
  1058 |     employeeOption: string;
  1059 |     issuedDate?: string;
  1060 |     effectiveDate?: string;
  1061 |     documentType?: string;
  1062 |     signatureAuthority?: string;
  1063 |   }) {
  1064 |     const issuedDate = options.issuedDate ?? this.todayDateString();
  1065 |     const effectiveDate = options.effectiveDate ?? this.todayDateString();
  1066 |     const documentType = options.documentType ?? 'Soft Copy';
  1067 | 
  1068 |     await this.selectComboboxOption(this.employeeCombobox, options.employeeOption);
  1069 |     await this.issuedDateInput.fill(issuedDate);
  1070 |     await this.effectiveDateInput.fill(effectiveDate);
  1071 |     await this.selectComboboxOption(this.documentTypeCombobox, documentType);
  1072 |     return this.selectComboboxOption(this.signatureCombobox, options.signatureAuthority);
  1073 |   }
  1074 | 
  1075 |   async generateProbationConfirmationLetter() {
  1076 |     const downloadPromise = this.page.waitForEvent('download');
  1077 |     await this.generateDocumentButton.click();
  1078 |     const download = await downloadPromise;
  1079 |     await expect(this.letterGeneratedMessage).toBeVisible({ timeout: 30000 });
  1080 |     return download;
  1081 |   }
  1082 | 
  1083 |   async releaseProbationConfirmationLetter() {
  1084 |     await this.releaseLetterButton.waitFor({ state: 'visible', timeout: 15000 });
  1085 |     await this.releaseLetterButton.click();
  1086 |     await expect(this.emailSentMessage).toBeVisible({ timeout: 30000 });
  1087 |   }
  1088 | 
  1089 |   async openActiveEmployees() {
  1090 |     await this.openEmployeesManagement();
  1091 |     await this.activeEmployeesTab.first().waitFor({ state: 'visible', timeout: 15000 });
  1092 |     await this.activeEmployeesTab.first().click();
  1093 |     await this.page.waitForURL(/\/employee-management\/.*active/i, { timeout: 15000 }).catch(() => {});
  1094 |     await this.employeeSearch.waitFor({ state: 'visible', timeout: 15000 });
  1095 |   }
  1096 | 
  1097 |   async assertEmployeeInActiveList(employeeName: string, searchText: string, employeeId: string) {
  1098 |     await this.openActiveEmployees();
  1099 |     await this.employeeSearch.click();
  1100 |     await this.employeeSearch.fill(searchText);
  1101 |     await this.employeeSearch.press('Enter');
  1102 | 
  1103 |     const employeeRow = this.page.getByRole('row').filter({ hasText: employeeName });
  1104 |     await expect(employeeRow.first()).toBeVisible({ timeout: 15000 });
  1105 |     await expect(employeeRow.first().getByRole('cell', { name: employeeId })).toBeVisible();
  1106 |   }
  1107 | }
  1108 | 
```