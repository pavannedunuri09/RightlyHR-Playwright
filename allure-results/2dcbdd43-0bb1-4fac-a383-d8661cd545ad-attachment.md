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
  - waiting for getByRole('option', { name: 'Kerala', exact: true }) to be visible

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e8]:
    - img "Company Logo" [ref=e10]
    - generic [ref=e11]:
      - generic [ref=e12] [cursor=pointer]
      - generic [ref=e20] [cursor=pointer]: 
      - generic [ref=e24] [cursor=pointer]
      - generic [ref=e34] [cursor=pointer]:
        - generic [ref=e35]:
          - paragraph [ref=e36]: Induu sai Dinesh Priyaa
          - paragraph [ref=e37]: QA Tester
        - img "Profile Image" [ref=e39]
  - generic [ref=e40]:
    - generic [ref=e43]:
      - list [ref=e45]:
        - listitem [ref=e46] [cursor=pointer]:
          - img "Icon" [ref=e47]
          - text: Dashboard
        - listitem [ref=e48]:
          - generic [ref=e49]:
            - generic [ref=e50] [cursor=pointer]:
              - img "Icon" [ref=e51]
              - text: My Info
            - generic [ref=e52] [cursor=pointer]:
              - img "Icon" [ref=e53]
              - text: Employees
            - generic [ref=e54] [cursor=pointer]:
              - img "Icon" [ref=e55]
              - text: Policies
            - generic [ref=e56] [cursor=pointer]:
              - img "Icon" [ref=e57]
              - text: Pending Approvals
            - generic [ref=e58] [cursor=pointer]:
              - img "Icon" [ref=e59]
              - text: Reports
            - generic [ref=e60] [cursor=pointer]:
              - img "Icon" [ref=e61]
              - text: Holidays
            - generic [ref=e62] [cursor=pointer]:
              - img "Icon" [ref=e63]
              - text: Cards Management
            - generic [ref=e64] [cursor=pointer]:
              - img "Icon" [ref=e65]
              - text: Expenses
            - generic [ref=e66] [cursor=pointer]:
              - img "Icon" [ref=e67]
              - text: IT Support
            - generic [ref=e68] [cursor=pointer]:
              - img "Icon" [ref=e69]
              - text: Skill Set
            - generic [ref=e72] [cursor=pointer]:
              - img "Icon" [ref=e73]
              - text: Project Management
            - generic [ref=e76] [cursor=pointer]:
              - img "Icon" [ref=e77]
              - text: ATS
            - generic [ref=e80] [cursor=pointer]:
              - img "Icon" [ref=e81]
              - text: PMS
            - generic [ref=e84] [cursor=pointer]:
              - img "Icon" [ref=e85]
              - text: Time Off
        - listitem [ref=e86] [cursor=pointer]:
          - img "Icons" [ref=e89]
      - img "Powered By logo" [ref=e92]
    - generic [ref=e99]:
      - generic [ref=e101]:
        - generic [ref=e102] [cursor=pointer]:
          - text: Leave Category
          - generic [ref=e103]: 
        - generic [ref=e104]: Add Leave Category
      - generic [ref=e105]:
        - generic [ref=e107]:
          - generic [ref=e108]: Location/Shift
          - generic [ref=e109]:
            - generic [ref=e110]: Year*
            - generic [ref=e112] [cursor=pointer]:
              - combobox "2026" [ref=e113]
              - button "dropdown trigger" [ref=e114]
          - generic [ref=e118]:
            - generic [ref=e119]: Location*
            - generic [ref=e121] [cursor=pointer]:
              - combobox "Select location" [expanded] [active] [ref=e122]
              - button "dropdown trigger" [expanded] [ref=e123]
              - listbox "Option List" [ref=e132]:
                - option "Hyderabad" [ref=e134]
                - option "Delhi" [ref=e137]
                - option "Tamilnadu" [ref=e140]
                - option "Mumbai" [ref=e143]
                - option "Gujarat" [ref=e146]
                - option "Coimbatore" [ref=e149]
                - option "Bangalore" [ref=e152]
                - option "California" [ref=e155]
                - option "Vijayawada" [ref=e158]
                - option "Kerela" [ref=e161]
                - option "Pune" [ref=e164]
                - option "Andhra Prades" [ref=e167]
                - option "USA" [ref=e170]
                - option "sdsd" [ref=e173]
            - generic [ref=e176]: Location is required
          - generic [ref=e177]:
            - generic [ref=e178]: Sub Location*
            - generic [ref=e180] [cursor=pointer]:
              - combobox "Select sub-location" [ref=e181]
              - button "dropdown trigger" [ref=e182]
            - generic [ref=e186]: Sub Location is required
          - generic [ref=e187]:
            - generic [ref=e188]: Shift*
            - generic [ref=e190] [cursor=pointer]:
              - combobox "Select shift" [ref=e191]
              - button "dropdown trigger" [ref=e192]
            - generic [ref=e196]: Shift is required
          - generic [ref=e197]: Leave Category Information
          - generic [ref=e198]:
            - generic [ref=e199]: Leave Category Type*
            - generic [ref=e201] [cursor=pointer]:
              - combobox "General" [ref=e202]
              - button "dropdown trigger" [ref=e203]
          - generic [ref=e207]:
            - generic [ref=e208]: Leave Type*
            - generic [ref=e210] [cursor=pointer]:
              - combobox "Select Leave Type" [ref=e211]
              - button "dropdown trigger" [ref=e212]
            - generic [ref=e216]: Leave Type is required
          - generic [ref=e217]:
            - generic [ref=e218]: Leave Category Name*
            - textbox "Please enter name" [ref=e219]
            - generic [ref=e220]: Leave Category Name is required
          - generic [ref=e221]:
            - generic [ref=e222]: Leave Category Code*
            - textbox "Please enter code" [ref=e223]
            - generic [ref=e224]: Leave Category Code is required
          - generic [ref=e225]:
            - generic [ref=e226]: Valid Days *
            - spinbutton "Please enter valid days" [ref=e227]
            - generic [ref=e228]: Valid Days is required
          - generic [ref=e229]:
            - generic [ref=e230]: Leave Category Color*
            - textbox [ref=e231]:
              - /placeholder: Please enter color
              - text: "#000000"
          - generic [ref=e232]:
            - generic [ref=e233]: Is Dependent
            - generic [ref=e235] [cursor=pointer]:
              - combobox "Select option" [ref=e236]
              - button "dropdown trigger" [ref=e237]
          - generic [ref=e241]: Additional Information
          - generic [ref=e242]:
            - generic [ref=e243]: Allowed Gender *
            - generic [ref=e245] [cursor=pointer]:
              - combobox "Select gender" [ref=e246]
              - button "dropdown trigger" [ref=e247]
            - generic [ref=e251]: Allowed Gender is required
          - generic [ref=e252]:
            - generic [ref=e253]: Allowed Marital Status *
            - generic [ref=e255] [cursor=pointer]:
              - combobox "Select marital status" [ref=e256]
              - button "dropdown trigger" [ref=e257]
            - generic [ref=e261]: Allowed Marital Status is required
          - generic [ref=e262]:
            - generic [ref=e263]: Exclude Weekends*
            - generic [ref=e265] [cursor=pointer]:
              - combobox "Select option" [ref=e266]
              - button "dropdown trigger" [ref=e267]
            - generic [ref=e271]: Exclude Weekends is required
          - generic [ref=e272]:
            - generic [ref=e273]: Exclude Holidays*
            - generic [ref=e275] [cursor=pointer]:
              - combobox "Select option" [ref=e276]
              - button "dropdown trigger" [ref=e277]
            - generic [ref=e281]: Exclude Holidays is required
          - generic [ref=e282]:
            - generic [ref=e283]: Is Optional Holiday*
            - generic [ref=e285] [cursor=pointer]:
              - combobox "Select option" [ref=e286]
              - button "dropdown trigger" [ref=e287]
            - generic [ref=e291]: Is Optional Holiday is required
          - generic [ref=e292]:
            - generic [ref=e293]: Half Day Leave Allowed*
            - generic [ref=e295] [cursor=pointer]:
              - combobox "Select option" [ref=e296]
              - button "dropdown trigger" [ref=e297]
            - generic [ref=e301]: Half Day Leave Allowed is required
          - generic [ref=e302]:
            - generic [ref=e303]: Pro Rata Leave Allocation*
            - generic [ref=e305] [cursor=pointer]:
              - combobox "Select option" [ref=e306]
              - button "dropdown trigger" [ref=e307]
            - generic [ref=e311]: Pro Rata Leave Allocation is required
          - generic [ref=e312]:
            - generic [ref=e313]: Advance Notice
            - generic [ref=e314]:
              - generic [ref=e315]: Minimum Advance Apply Days
              - spinbutton "Minimum Advance Apply Days" [ref=e316]
          - generic [ref=e317]:
            - generic [ref=e318]: Maximum Leave Duration
            - generic [ref=e319]:
              - generic [ref=e320]: Maximum Leave Duration (Calendar Days)
              - spinbutton "Maximum Leave Duration (Calendar Days)" [ref=e321]
            - generic [ref=e322]:
              - generic [ref=e323]: Include Weekends
              - generic [ref=e324]:
                - generic:
                  - combobox "No" [disabled]
                  - button "dropdown trigger"
            - generic [ref=e325]:
              - generic [ref=e326]: Include Holidays
              - generic [ref=e327]:
                - generic:
                  - combobox "No" [disabled]
                  - button "dropdown trigger"
          - generic [ref=e328]:
            - generic [ref=e329]: Leave Combination
            - generic [ref=e330]:
              - generic [ref=e331]: Allow Leave Combination
              - generic [ref=e333] [cursor=pointer]:
                - combobox "Yes" [ref=e334]
                - button "dropdown trigger" [ref=e335]
          - generic [ref=e339]:
            - generic [ref=e340]: Leave Interval
            - generic [ref=e341]:
              - generic [ref=e342]: Minimum Gap Between Same Leave Type (Days)
              - spinbutton "Minimum Gap Between Same Leave Type (Days)" [ref=e343]
            - generic [ref=e344]:
              - generic [ref=e345]: Gap Calculation Basis
              - generic [ref=e347] [cursor=pointer]:
                - combobox "Select basis" [ref=e348]
                - button "dropdown trigger" [ref=e349]
          - generic [ref=e353]:
            - generic [ref=e354]: Sandwich Policy
            - generic [ref=e355]:
              - generic [ref=e356]: Enable Sandwich Policy
              - generic [ref=e358] [cursor=pointer]:
                - combobox "No" [ref=e359]
                - button "dropdown trigger" [ref=e360]
          - generic [ref=e364]: Allow Requests For Future Dates
          - generic [ref=e365]:
            - generic [ref=e366]: Allowed*
            - generic [ref=e368] [cursor=pointer]:
              - combobox "Select option" [ref=e369]
              - button "dropdown trigger" [ref=e370]
            - generic [ref=e374]: Future Dates Allowed is required
          - generic [ref=e375]:
            - generic [ref=e376]: Days*
            - spinbutton "No. of days" [disabled] [ref=e377]
          - generic [ref=e378]: Allow Requests For Past Dates
          - generic [ref=e379]:
            - generic [ref=e380]: Allowed*
            - generic [ref=e382] [cursor=pointer]:
              - combobox "Select option" [ref=e383]
              - button "dropdown trigger" [ref=e384]
            - generic [ref=e388]: Past Dates Allowed is required
          - generic [ref=e389]:
            - generic [ref=e390]: Days*
            - spinbutton "No. of days" [disabled] [ref=e391]
          - generic [ref=e392]: Carry Forward
          - generic [ref=e393]:
            - generic [ref=e394]: Allowed*
            - generic [ref=e396] [cursor=pointer]:
              - combobox "Select option" [ref=e397]
              - button "dropdown trigger" [ref=e398]
            - generic [ref=e402]: Carry Forward Leave is required
          - generic [ref=e403]:
            - generic [ref=e404]: Days*
            - spinbutton "No. of days" [disabled] [ref=e405]
          - generic [ref=e406]: Encash
          - generic [ref=e407]:
            - generic [ref=e408]: Allowed*
            - generic [ref=e410] [cursor=pointer]:
              - combobox "Select option" [ref=e411]
              - button "dropdown trigger" [ref=e412]
            - generic [ref=e416]: Encash Allowed is required
          - generic [ref=e417]:
            - generic [ref=e418]: Days*
            - spinbutton "No. of days" [disabled] [ref=e419]
          - generic [ref=e420]: Probation Period
          - generic [ref=e421]:
            - generic [ref=e422]: Probation Period Rules Applicable?*
            - generic [ref=e424] [cursor=pointer]:
              - combobox "Select option" [ref=e425]
              - button "dropdown trigger" [ref=e426]
            - generic [ref=e430]: Probation Rules Applicable is required
          - generic [ref=e431]:
            - generic [ref=e432]: Leaves Allowed*
            - spinbutton "No. of days" [disabled] [ref=e433]
          - generic [ref=e434]: Notice Period
          - generic [ref=e435]:
            - generic [ref=e436]: Notice Period Rules Applicable?*
            - generic [ref=e438] [cursor=pointer]:
              - combobox "Select option" [ref=e439]
              - button "dropdown trigger" [ref=e440]
            - generic [ref=e444]: Notice Period Rules Applicable is required
          - generic [ref=e445]:
            - generic [ref=e446]: Leaves Allowed*
            - spinbutton "No. of days" [disabled] [ref=e447]
          - generic [ref=e448]: Entitlement Frequency
          - generic [ref=e449]:
            - generic [ref=e450]: Frequency Type *
            - generic [ref=e452] [cursor=pointer]:
              - combobox "Select frequency type" [ref=e453]
              - button "dropdown trigger" [ref=e454]
          - generic [ref=e458]:
            - generic [ref=e459]: Leave Balance Handling *
            - generic [ref=e461] [cursor=pointer]:
              - combobox "Select cycle handling" [ref=e462]
              - button "dropdown trigger" [ref=e463]
          - generic [ref=e467]:
            - generic [ref=e468]: Allow Leave for Past Cycle *
            - generic [ref=e470] [cursor=pointer]:
              - combobox "Select allow leave for past cycle" [ref=e471]
              - button "dropdown trigger" [ref=e472]
        - generic [ref=e476]:
          - button "Cancel" [ref=e477] [cursor=pointer]
          - button "Save" [disabled] [ref=e478] [cursor=pointer]
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