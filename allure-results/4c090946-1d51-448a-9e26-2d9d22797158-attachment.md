# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leave-category.spec.ts >> Leave Category Foundation >> Add Leave Category validations >> 07. creates General Leave category with required details and enables Save
- Location: tests\leave-category.spec.ts:107:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('option', { name: 'Morining Test', exact: true }) to be visible

```

# Page snapshot

```yaml
- generic [ref=f2e4]:
  - generic [ref=f2e8]:
    - img "Company Logo" [ref=f2e10]
    - generic [ref=f2e11]:
      - generic [ref=f2e12] [cursor=pointer]
      - generic [ref=f2e20] [cursor=pointer]
      - generic [ref=f2e28] [cursor=pointer]: 
      - generic [ref=f2e32] [cursor=pointer]
      - generic [ref=f2e42] [cursor=pointer]:
        - generic [ref=f2e43]:
          - paragraph [ref=f2e44]: saii Pavan Dinesh Tejaa
          - paragraph [ref=f2e45]: QA Tester
        - img "Profile Image" [ref=f2e47]
  - generic [ref=f2e48]:
    - generic [ref=f2e51]:
      - list [ref=f2e53]:
        - listitem [ref=f2e54] [cursor=pointer]:
          - img "Icon" [ref=f2e55]
          - text: Dashboard
        - listitem [ref=f2e56]:
          - generic [ref=f2e57]:
            - generic [ref=f2e58] [cursor=pointer]:
              - img "Icon" [ref=f2e59]
              - text: My Info
            - generic [ref=f2e60] [cursor=pointer]:
              - img "Icon" [ref=f2e61]
              - text: Employees
            - generic [ref=f2e64] [cursor=pointer]:
              - img "Icon" [ref=f2e65]
              - text: Time Off
            - generic [ref=f2e66] [cursor=pointer]:
              - img "Icon" [ref=f2e67]
              - text: Attendance
            - generic [ref=f2e68] [cursor=pointer]:
              - img "Icon" [ref=f2e69]
              - text: Reports
            - generic [ref=f2e72] [cursor=pointer]:
              - img "Icon" [ref=f2e73]
              - text: Project Management
            - generic [ref=f2e74] [cursor=pointer]:
              - img "Icon" [ref=f2e75]
              - text: Skill Set
            - generic [ref=f2e78] [cursor=pointer]:
              - img "Icon" [ref=f2e79]
              - text: On Behalf Of
            - generic [ref=f2e82] [cursor=pointer]:
              - img "Icon" [ref=f2e83]
              - text: Pending Approvals
            - generic [ref=f2e86] [cursor=pointer]:
              - img "Icon" [ref=f2e87]
              - text: PMS
        - listitem [ref=f2e88] [cursor=pointer]:
          - img "Icons" [ref=f2e91]
      - img "Powered By logo" [ref=f2e94]
    - generic [ref=f2e101]:
      - generic [ref=f2e103]:
        - generic [ref=f2e104] [cursor=pointer]:
          - text: Leave Category
          - generic [ref=f2e105]: 
        - generic [ref=f2e106]: Add Leave Category
      - generic [ref=f2e107]:
        - generic [ref=f2e109]:
          - generic [ref=f2e110]: Location/Shift
          - generic [ref=f2e111]:
            - generic [ref=f2e112]: Year*
            - generic [ref=f2e114] [cursor=pointer]:
              - combobox "2026" [ref=f2e115]
              - button "dropdown trigger" [ref=f2e116]
          - generic [ref=f2e120]:
            - generic [ref=f2e121]: Location*
            - generic [ref=f2e123] [cursor=pointer]:
              - combobox "Kerala" [ref=f2e124]
              - button "dropdown trigger" [ref=f2e125]
          - generic [ref=f2e129]:
            - generic [ref=f2e130]: Sub Location*
            - generic [ref=f2e132] [cursor=pointer]:
              - combobox "Kannur" [ref=f2e133]
              - button "dropdown trigger" [ref=f2e134]
          - generic [ref=f2e138]:
            - generic [ref=f2e139]: Shift*
            - generic [ref=f2e141] [cursor=pointer]:
              - combobox "Select shift" [expanded] [active] [ref=f2e142]
              - button "dropdown trigger" [expanded] [ref=f2e143]
              - listbox "Option List" [ref=f2e152]:
                - option "Early Shift" [ref=f2e154]
                - option "EarlyShift" [ref=f2e157]
                - option "Final Shift" [ref=f2e160]
                - option "Flexible" [ref=f2e163]
                - option "kannur shift" [ref=f2e166]
                - option "Mainn Shift" [ref=f2e169]
                - option "Morning Test" [ref=f2e172]
                - option "Second Shift" [ref=f2e175]
                - option "Support Shift" [ref=f2e178]
                - option "Third Shift" [ref=f2e181]
          - generic [ref=f2e184]: Leave Category Information
          - generic [ref=f2e185]:
            - generic [ref=f2e186]: Leave Category Type*
            - generic [ref=f2e188] [cursor=pointer]:
              - combobox "General" [ref=f2e189]
              - button "dropdown trigger" [ref=f2e190]
          - generic [ref=f2e194]:
            - generic [ref=f2e195]: Leave Type*
            - generic [ref=f2e197] [cursor=pointer]:
              - combobox "Select Leave Type" [ref=f2e198]
              - button "dropdown trigger" [ref=f2e199]
            - generic [ref=f2e203]: Leave Type is required
          - generic [ref=f2e204]:
            - generic [ref=f2e205]: Leave Category Name*
            - textbox "Please enter name" [ref=f2e206]
            - generic [ref=f2e207]: Leave Category Name is required
          - generic [ref=f2e208]:
            - generic [ref=f2e209]: Leave Category Code*
            - textbox "Please enter code" [ref=f2e210]
            - generic [ref=f2e211]: Leave Category Code is required
          - generic [ref=f2e212]:
            - generic [ref=f2e213]: Valid Days *
            - spinbutton "Please enter valid days" [ref=f2e214]
            - generic [ref=f2e215]: Valid Days is required
          - generic [ref=f2e216]:
            - generic [ref=f2e217]: Leave Category Color*
            - textbox [ref=f2e218]:
              - /placeholder: Please enter color
              - text: "#000000"
          - generic [ref=f2e219]:
            - generic [ref=f2e220]: Is Dependent
            - generic [ref=f2e222] [cursor=pointer]:
              - combobox "Select option" [ref=f2e223]
              - button "dropdown trigger" [ref=f2e224]
          - generic [ref=f2e228]: Additional Information
          - generic [ref=f2e229]:
            - generic [ref=f2e230]: Allowed Gender *
            - generic [ref=f2e232] [cursor=pointer]:
              - combobox "Select gender" [ref=f2e233]
              - button "dropdown trigger" [ref=f2e234]
            - generic [ref=f2e238]: Allowed Gender is required
          - generic [ref=f2e239]:
            - generic [ref=f2e240]: Allowed Marital Status *
            - generic [ref=f2e242] [cursor=pointer]:
              - combobox "Select marital status" [ref=f2e243]
              - button "dropdown trigger" [ref=f2e244]
            - generic [ref=f2e248]: Allowed Marital Status is required
          - generic [ref=f2e249]:
            - generic [ref=f2e250]: Exclude Weekends*
            - generic [ref=f2e252] [cursor=pointer]:
              - combobox "Select option" [ref=f2e253]
              - button "dropdown trigger" [ref=f2e254]
            - generic [ref=f2e258]: Exclude Weekends is required
          - generic [ref=f2e259]:
            - generic [ref=f2e260]: Exclude Holidays*
            - generic [ref=f2e262] [cursor=pointer]:
              - combobox "Select option" [ref=f2e263]
              - button "dropdown trigger" [ref=f2e264]
            - generic [ref=f2e268]: Exclude Holidays is required
          - generic [ref=f2e269]:
            - generic [ref=f2e270]: Is Optional Holiday*
            - generic [ref=f2e272] [cursor=pointer]:
              - combobox "Select option" [ref=f2e273]
              - button "dropdown trigger" [ref=f2e274]
            - generic [ref=f2e278]: Is Optional Holiday is required
          - generic [ref=f2e279]:
            - generic [ref=f2e280]: Half Day Leave Allowed*
            - generic [ref=f2e282] [cursor=pointer]:
              - combobox "Select option" [ref=f2e283]
              - button "dropdown trigger" [ref=f2e284]
            - generic [ref=f2e288]: Half Day Leave Allowed is required
          - generic [ref=f2e289]:
            - generic [ref=f2e290]: Pro Rata Leave Allocation*
            - generic [ref=f2e292] [cursor=pointer]:
              - combobox "Select option" [ref=f2e293]
              - button "dropdown trigger" [ref=f2e294]
            - generic [ref=f2e298]: Pro Rata Leave Allocation is required
          - generic [ref=f2e299]:
            - generic [ref=f2e300]: Advance Notice
            - generic [ref=f2e301]:
              - generic [ref=f2e302]: Minimum Advance Apply Days
              - spinbutton "Minimum Advance Apply Days" [ref=f2e303]
          - generic [ref=f2e304]:
            - generic [ref=f2e305]: Maximum Leave Duration
            - generic [ref=f2e306]:
              - generic [ref=f2e307]: Maximum Leave Duration (Calendar Days)
              - spinbutton "Maximum Leave Duration (Calendar Days)" [ref=f2e308]
            - generic [ref=f2e309]:
              - generic [ref=f2e310]: Include Weekends
              - generic [ref=f2e311]:
                - generic:
                  - combobox "No" [disabled]
                  - button "dropdown trigger"
            - generic [ref=f2e312]:
              - generic [ref=f2e313]: Include Holidays
              - generic [ref=f2e314]:
                - generic:
                  - combobox "No" [disabled]
                  - button "dropdown trigger"
          - generic [ref=f2e315]:
            - generic [ref=f2e316]: Leave Combination
            - generic [ref=f2e317]:
              - generic [ref=f2e318]: Allow Leave Combination
              - generic [ref=f2e320] [cursor=pointer]:
                - combobox "Yes" [ref=f2e321]
                - button "dropdown trigger" [ref=f2e322]
          - generic [ref=f2e326]:
            - generic [ref=f2e327]: Leave Interval
            - generic [ref=f2e328]:
              - generic [ref=f2e329]: Minimum Gap Between Same Leave Type (Days)
              - spinbutton "Minimum Gap Between Same Leave Type (Days)" [ref=f2e330]
            - generic [ref=f2e331]:
              - generic [ref=f2e332]: Gap Calculation Basis
              - generic [ref=f2e334] [cursor=pointer]:
                - combobox "Select basis" [ref=f2e335]
                - button "dropdown trigger" [ref=f2e336]
          - generic [ref=f2e340]:
            - generic [ref=f2e341]: Sandwich Policy
            - generic [ref=f2e342]:
              - generic [ref=f2e343]: Enable Sandwich Policy
              - generic [ref=f2e345] [cursor=pointer]:
                - combobox "No" [ref=f2e346]
                - button "dropdown trigger" [ref=f2e347]
          - generic [ref=f2e351]: Allow Requests For Future Dates
          - generic [ref=f2e352]:
            - generic [ref=f2e353]: Allowed*
            - generic [ref=f2e355] [cursor=pointer]:
              - combobox "Select option" [ref=f2e356]
              - button "dropdown trigger" [ref=f2e357]
            - generic [ref=f2e361]: Future Dates Allowed is required
          - generic [ref=f2e362]:
            - generic [ref=f2e363]: Days*
            - spinbutton "No. of days" [disabled] [ref=f2e364]
          - generic [ref=f2e365]: Allow Requests For Past Dates
          - generic [ref=f2e366]:
            - generic [ref=f2e367]: Allowed*
            - generic [ref=f2e369] [cursor=pointer]:
              - combobox "Select option" [ref=f2e370]
              - button "dropdown trigger" [ref=f2e371]
            - generic [ref=f2e375]: Past Dates Allowed is required
          - generic [ref=f2e376]:
            - generic [ref=f2e377]: Days*
            - spinbutton "No. of days" [disabled] [ref=f2e378]
          - generic [ref=f2e379]: Carry Forward
          - generic [ref=f2e380]:
            - generic [ref=f2e381]: Allowed*
            - generic [ref=f2e383] [cursor=pointer]:
              - combobox "Select option" [ref=f2e384]
              - button "dropdown trigger" [ref=f2e385]
            - generic [ref=f2e389]: Carry Forward Leave is required
          - generic [ref=f2e390]:
            - generic [ref=f2e391]: Days*
            - spinbutton "No. of days" [disabled] [ref=f2e392]
          - generic [ref=f2e393]: Encash
          - generic [ref=f2e394]:
            - generic [ref=f2e395]: Allowed*
            - generic [ref=f2e397] [cursor=pointer]:
              - combobox "Select option" [ref=f2e398]
              - button "dropdown trigger" [ref=f2e399]
            - generic [ref=f2e403]: Encash Allowed is required
          - generic [ref=f2e404]:
            - generic [ref=f2e405]: Days*
            - spinbutton "No. of days" [disabled] [ref=f2e406]
          - generic [ref=f2e407]: Probation Period
          - generic [ref=f2e408]:
            - generic [ref=f2e409]: Probation Period Rules Applicable?*
            - generic [ref=f2e411] [cursor=pointer]:
              - combobox "Select option" [ref=f2e412]
              - button "dropdown trigger" [ref=f2e413]
            - generic [ref=f2e417]: Probation Rules Applicable is required
          - generic [ref=f2e418]:
            - generic [ref=f2e419]: Leaves Allowed*
            - spinbutton "No. of days" [disabled] [ref=f2e420]
          - generic [ref=f2e421]: Notice Period
          - generic [ref=f2e422]:
            - generic [ref=f2e423]: Notice Period Rules Applicable?*
            - generic [ref=f2e425] [cursor=pointer]:
              - combobox "Select option" [ref=f2e426]
              - button "dropdown trigger" [ref=f2e427]
            - generic [ref=f2e431]: Notice Period Rules Applicable is required
          - generic [ref=f2e432]:
            - generic [ref=f2e433]: Leaves Allowed*
            - spinbutton "No. of days" [disabled] [ref=f2e434]
          - generic [ref=f2e435]: Entitlement Frequency
          - generic [ref=f2e436]:
            - generic [ref=f2e437]: Frequency Type *
            - generic [ref=f2e439] [cursor=pointer]:
              - combobox "Select frequency type" [ref=f2e440]
              - button "dropdown trigger" [ref=f2e441]
          - generic [ref=f2e445]:
            - generic [ref=f2e446]: Leave Balance Handling *
            - generic [ref=f2e448] [cursor=pointer]:
              - combobox "Select cycle handling" [ref=f2e449]
              - button "dropdown trigger" [ref=f2e450]
          - generic [ref=f2e454]:
            - generic [ref=f2e455]: Allow Leave for Past Cycle *
            - generic [ref=f2e457] [cursor=pointer]:
              - combobox "Select allow leave for past cycle" [ref=f2e458]
              - button "dropdown trigger" [ref=f2e459]
        - generic [ref=f2e463]:
          - button "Cancel" [ref=f2e464] [cursor=pointer]
          - button "Save" [disabled] [ref=f2e465] [cursor=pointer]
```

# Test source

```ts
  722 |     await this.dataClonedToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  723 |     await this.successToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  724 |   }
  725 | 
  726 |   async expectPendingClonedRow(
  727 |     sourceData: LeaveCategoryFormData,
  728 |     cloneLocation: LeaveCategoryLocationHierarchy,
  729 |   ) {
  730 |     await this.ensureOnLeaveCategoryList();
  731 |     const clonedRowData: LeaveCategoryFormData = {
  732 |       ...sourceData,
  733 |       location: cloneLocation.location,
  734 |       subLocation: cloneLocation.subLocation,
  735 |       shift: cloneLocation.shift,
  736 |     };
  737 |     const row = this.getCategoryRowByHierarchy(clonedRowData);
  738 |     await row.scrollIntoViewIfNeeded();
  739 |     await expect(row).toBeVisible({ timeout: 30000 });
  740 |     await expect(row.getByRole('cell', { name: /Pending\s*for\s*submission/i })).toBeVisible();
  741 |     await expect(row).toContainText(sourceData.year);
  742 |     await expect(row).toContainText(cloneLocation.location);
  743 |     await expect(row).toContainText(cloneLocation.subLocation);
  744 |     await expect(row).toContainText(cloneLocation.shift);
  745 |     await expect(row).toContainText(sourceData.categoryType);
  746 |     await expect(row).toContainText(sourceData.categoryName);
  747 |     await expect(row).toContainText(sourceData.categoryCode);
  748 |   }
  749 | 
  750 |   async openDashboard() {
  751 |     if (!this.page.url().includes('/dashboard/emp')) {
  752 |       await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' });
  753 |     }
  754 |     await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
  755 |     await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible', timeout: 15000 });
  756 |   }
  757 | 
  758 |   async openSettingsTimeOff() {
  759 |     await this.settingsIcon.click();
  760 |     await this.page.waitForTimeout(1000);
  761 | 
  762 |     if (!(await this.timeOffPanel.isVisible({ timeout: 5000 }).catch(() => false))) {
  763 |       await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
  764 |       await this.page.waitForURL(/\/settings\/overview|\/settings/, { timeout: 15000 });
  765 |       await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  766 |       await this.page.waitForTimeout(500);
  767 |     }
  768 | 
  769 |     await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
  770 |     await this.timeOffPanel.scrollIntoViewIfNeeded().catch(() => {});
  771 |     await this.timeOffPanel.click({ force: true });
  772 |     await this.page.waitForTimeout(500);
  773 |   }
  774 | 
  775 |   async openFromDashboard() {
  776 |     await this.openDashboard();
  777 |     await this.openSettingsTimeOff();
  778 | 
  779 |     if (!(await this.leaveCategoryLink.isVisible({ timeout: 5000 }).catch(() => false))) {
  780 |       await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
  781 |       await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  782 |       await this.page.waitForTimeout(500);
  783 |       await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
  784 |       await this.timeOffPanel.click({ force: true });
  785 |     }
  786 | 
  787 |     await this.leaveCategoryLink.waitFor({ state: 'visible', timeout: 15000 });
  788 |     await this.leaveCategoryLink.click();
  789 |     await this.pendingTab.waitFor({ state: 'visible', timeout: 15000 });
  790 |     await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  791 |   }
  792 | 
  793 |   async switchToPending() {
  794 |     await this.pendingTab.click();
  795 |     await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  796 |   }
  797 | 
  798 |   async switchToPublished() {
  799 |     await this.publishedTab.click();
  800 |     await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  801 |   }
  802 | 
  803 |   async tabCount(tab: Locator): Promise<number> {
  804 |     const label = (await tab.innerText()).trim();
  805 |     const match = label.match(/\((\d+)\)/);
  806 |     if (!match) {
  807 |       throw new Error(`No record count found in tab label: "${label}"`);
  808 |     }
  809 |     return Number(match[1]);
  810 |   }
  811 | 
  812 |   async openAddForm() {
  813 |     await this.addNewButton.click();
  814 |     await this.yearDropdown.waitFor({ state: 'visible', timeout: 15000 });
  815 |     await this.cancelButton.waitFor({ state: 'visible', timeout: 15000 });
  816 |   }
  817 | 
  818 |   async selectDropdownOption(dropdown: Locator, optionName: string) {
  819 |     await dropdown.scrollIntoViewIfNeeded().catch(() => {});
  820 |     await dropdown.click();
  821 |     const option = this.page.getByRole('option', { name: optionName, exact: true });
> 822 |     await option.waitFor({ state: 'visible', timeout: 10000 });
      |                  ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  823 |     await option.click();
  824 |   }
  825 | 
  826 |   async selectDropdownOptionIfNeeded(dropdown: Locator, optionName: string) {
  827 |     const currentValue = await this.readComboboxValue(dropdown);
  828 |     if (currentValue.toLowerCase() === optionName.toLowerCase()) {
  829 |       return;
  830 |     }
  831 | 
  832 |     await this.selectDropdownOption(dropdown, optionName);
  833 |   }
  834 | 
  835 |   async selectByFieldLabel(label: string | RegExp, optionName: string) {
  836 |     const group = this.fieldGroupByLabel(label);
  837 |     await group.scrollIntoViewIfNeeded();
  838 |     await this.selectDropdownOptionIfNeeded(group.getByRole('combobox').first(), optionName);
  839 |   }
  840 | 
  841 |   async fillAllowedDaysPair(
  842 |     index: number,
  843 |     allowed: 'Yes' | 'No',
  844 |     days?: string,
  845 |   ) {
  846 |     const allowedGroup = this.allowedDaysGroup(index);
  847 |     await allowedGroup.scrollIntoViewIfNeeded();
  848 |     await this.selectDropdownOptionIfNeeded(allowedGroup.getByRole('combobox').first(), allowed);
  849 | 
  850 |     if (days !== undefined) {
  851 |       const daysField = this.daysGroup(index).getByRole('spinbutton').first();
  852 |       if (await daysField.isEnabled().catch(() => false)) {
  853 |         const currentDays = await daysField.inputValue().catch(() => '');
  854 |         if (currentDays !== days) {
  855 |           await daysField.fill(days);
  856 |         }
  857 |       }
  858 |     }
  859 |   }
  860 | 
  861 |   async fillAddLeaveCategoryForm(data: LeaveCategoryFormData) {
  862 |     await this.selectDropdownOption(this.yearDropdown, data.year);
  863 |     await this.selectDropdownOption(this.locationDropdown, data.location);
  864 |     await this.selectDropdownOption(this.subLocationDropdown, data.subLocation);
  865 |     await this.selectDropdownOption(this.shiftDropdown, data.shift);
  866 | 
  867 |     await this.selectDropdownOption(this.categoryTypeDropdown, data.categoryType);
  868 |     await this.selectDropdownOption(this.leaveTypeDropdown, data.leaveType);
  869 | 
  870 |     await this.categoryNameInput.fill(data.categoryName);
  871 |     await this.categoryCodeInput.fill(data.categoryCode);
  872 |     await this.validDaysInput.fill(data.validDays);
  873 |     await this.colorInput.fill(data.color);
  874 | 
  875 |     await this.selectDropdownOption(this.genderDropdown, data.allowedGender);
  876 |     await this.selectDropdownOption(this.maritalStatusDropdown, data.allowedMaritalStatus);
  877 | 
  878 |     await this.selectByFieldLabel(/Exclude Weekends/i, data.excludeWeekends);
  879 |     await this.selectByFieldLabel(/Exclude Holidays/i, data.excludeHolidays);
  880 |     await this.selectByFieldLabel(/Is Optional Holiday/i, data.isOptionalHoliday);
  881 |     await this.selectByFieldLabel(/Half Day Leave Allowed/i, data.halfDayLeaveAllowed);
  882 |     await this.selectByFieldLabel(/Pro Rata Leave Allocation/i, data.proRataLeaveAllocation);
  883 | 
  884 |     await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  885 |     await this.page.waitForTimeout(500);
  886 | 
  887 |     await this.selectByFieldLabel(/Enable Sandwich Policy/i, data.enableSandwichPolicy);
  888 |     await this.fillAllowedDaysPair(0, data.futureDatesAllowed, data.futureDatesDays);
  889 |     await this.fillAllowedDaysPair(1, data.pastDatesAllowed, data.pastDatesDays);
  890 |     await this.fillAllowedDaysPair(2, data.carryForwardAllowed, data.carryForwardDays);
  891 |     await this.fillAllowedDaysPair(3, data.encashAllowed, data.encashDays);
  892 | 
  893 |     await this.selectByFieldLabel(/Probation Period Rules Applicable/i, data.probationRulesApplicable);
  894 |     await this.selectByFieldLabel(/Notice Period Rules Applicable/i, data.noticePeriodRulesApplicable);
  895 |     await this.selectDropdownOption(this.frequencyTypeDropdown, data.frequencyType);
  896 |   }
  897 | 
  898 |   async saveLeaveCategory() {
  899 |     await expect(this.saveButton).toBeEnabled({ timeout: 30000 });
  900 |     await this.saveButton.click();
  901 | 
  902 |     if (await this.confirmYesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
  903 |       await this.confirmYesButton.click();
  904 |     }
  905 | 
  906 |     await Promise.race([
  907 |       this.pendingTab.waitFor({ state: 'visible', timeout: 30000 }),
  908 |       this.successToast.waitFor({ state: 'visible', timeout: 30000 }),
  909 |     ]).catch(() => {});
  910 |   }
  911 | 
  912 |   validationMessage(message: LeaveCategoryRequiredValidation | string): Locator {
  913 |     return this.page.getByText(message, { exact: true });
  914 |   }
  915 | 
  916 |   async touchRequiredFields() {
  917 |     const comboboxNames = [
  918 |       'Select year',
  919 |       'Select location',
  920 |       'Select sub-location',
  921 |       'Select shift',
  922 |       'Select Category',
```