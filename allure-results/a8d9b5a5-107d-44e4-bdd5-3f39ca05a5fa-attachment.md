# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leave-category.spec.ts >> Leave Category Foundation >> 01. navigates from Dashboard through Settings and Time Off to Leave Category
- Location: tests\leave-category.spec.ts:27:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /Pending\s+For\s+Submission\s*\(\d+\)/i }).or(getByRole('tab', { name: /Pending\s+For\s+Submission\s*\(\d+\)/i })).first() to be visible

```

# Page snapshot

```yaml
- generic [ref=f3e4]:
  - generic [ref=f3e8]:
    - img "Company Logo" [ref=f3e10]
    - generic [ref=f3e11]:
      - generic [ref=f3e12] [cursor=pointer]
      - generic [ref=f3e20] [cursor=pointer]
      - generic [ref=f3e28] [cursor=pointer]: 
      - generic [ref=f3e32] [cursor=pointer]
      - generic [ref=f3e42] [cursor=pointer]:
        - generic [ref=f3e43]:
          - paragraph [ref=f3e44]: saii Pavan Dinesh Tejaa
          - paragraph [ref=f3e45]: QA Tester
        - img "Profile Image" [ref=f3e47]
  - generic [ref=f3e48]:
    - generic [ref=f3e51]:
      - list [ref=f3e53]:
        - listitem [ref=f3e54] [cursor=pointer]:
          - img "Icon" [ref=f3e55]
          - text: Dashboard
        - listitem [ref=f3e56]:
          - generic [ref=f3e57]:
            - generic [ref=f3e58] [cursor=pointer]:
              - img "Icon" [ref=f3e59]
              - text: My Info
            - generic [ref=f3e60] [cursor=pointer]:
              - img "Icon" [ref=f3e61]
              - text: Employees
            - generic [ref=f3e64] [cursor=pointer]:
              - img "Icon" [ref=f3e65]
              - text: Time Off
            - generic [ref=f3e66] [cursor=pointer]:
              - img "Icon" [ref=f3e67]
              - text: Attendance
            - generic [ref=f3e68] [cursor=pointer]:
              - img "Icon" [ref=f3e69]
              - text: Reports
            - generic [ref=f3e72] [cursor=pointer]:
              - img "Icon" [ref=f3e73]
              - text: Project Management
            - generic [ref=f3e74] [cursor=pointer]:
              - img "Icon" [ref=f3e75]
              - text: Skill Set
            - generic [ref=f3e78] [cursor=pointer]:
              - img "Icon" [ref=f3e79]
              - text: On Behalf Of
            - generic [ref=f3e82] [cursor=pointer]:
              - img "Icon" [ref=f3e83]
              - text: Pending Approvals
            - generic [ref=f3e86] [cursor=pointer]:
              - img "Icon" [ref=f3e87]
              - text: PMS
        - listitem [ref=f3e88] [cursor=pointer]:
          - img "Icons" [ref=f3e91]
      - img "Powered By logo" [ref=f3e94]
    - generic [ref=f3e98]:
      - generic [ref=f3e99]: Settings
      - list [ref=f3e103]:
        - generic [ref=f3e104]:
          - listitem [ref=f3e105] [cursor=pointer]:
            - generic [ref=f3e106]:
              - button "Icon Employee Fields Define and manage core employee data sections such as personal details, job info, documents, and policies. Central hub for configuring fields that shape the employee profile structure." [ref=f3e107]:
                - generic [ref=f3e108]:
                  - generic [ref=f3e109]:
                    - img "Icon" [ref=f3e110]
                    - generic [ref=f3e111]: Employee Fields
                  - paragraph [ref=f3e112]: Define and manage core employee data sections such as personal details, job info, documents, and policies. Central hub for configuring fields that shape the employee profile structure.
              - region "Icon Employee Fields Define and manage core employee data sections such as personal details, job info, documents, and policies. Central hub for configuring fields that shape the employee profile structure." [ref=f3e116]
          - listitem [ref=f3e117] [cursor=pointer]:
            - generic [ref=f3e118]:
              - button "Icon Roles & Permissions Define user roles and assign permissions to control access across modules. Manage role hierarchies and streamline data security through role-based access." [ref=f3e119]:
                - generic [ref=f3e120]:
                  - generic [ref=f3e121]:
                    - img "Icon" [ref=f3e122]
                    - generic [ref=f3e123]: Roles & Permissions
                  - paragraph [ref=f3e124]: Define user roles and assign permissions to control access across modules. Manage role hierarchies and streamline data security through role-based access.
              - region "Icon Roles & Permissions Define user roles and assign permissions to control access across modules. Manage role hierarchies and streamline data security through role-based access." [ref=f3e128]
          - listitem [ref=f3e129] [cursor=pointer]:
            - generic [ref=f3e130]:
              - button "Icon Time Off Manage employee leave lifecycle from application to approval, including comp-offs, permissions, and regularization. Enables smooth tracking, manager actions, and real-time balance visibility." [ref=f3e131]:
                - generic [ref=f3e132]:
                  - generic [ref=f3e133]:
                    - img "Icon" [ref=f3e134]
                    - generic [ref=f3e135]: Time Off
                  - paragraph [ref=f3e136]: Manage employee leave lifecycle from application to approval, including comp-offs, permissions, and regularization. Enables smooth tracking, manager actions, and real-time balance visibility.
              - region "Icon Time Off Manage employee leave lifecycle from application to approval, including comp-offs, permissions, and regularization. Enables smooth tracking, manager actions, and real-time balance visibility." [ref=f3e140]
          - listitem [ref=f3e141] [cursor=pointer]:
            - generic [ref=f3e142]:
              - button "Icon Asset Configuration This module allows managing asset vendor details along with associated asset categories and subcategories. Admins can add or edit vendor information such as name, contact, status, email, and address, and organize assets under defined software and hardware categories." [ref=f3e143]:
                - generic [ref=f3e144]:
                  - generic [ref=f3e145]:
                    - img "Icon" [ref=f3e146]
                    - generic [ref=f3e147]: Asset Configuration
                  - paragraph [ref=f3e148]: This module allows managing asset vendor details along with associated asset categories and subcategories. Admins can add or edit vendor information such as name, contact, status, email, and address, and organize assets under defined software and hardware categories.
              - region "Icon Asset Configuration This module allows managing asset vendor details along with associated asset categories and subcategories. Admins can add or edit vendor information such as name, contact, status, email, and address, and organize assets under defined software and hardware categories." [ref=f3e152]
          - listitem [ref=f3e153] [cursor=pointer]:
            - generic [ref=f3e154]:
              - button "Icon PMS Configuration Set up your appraisal cycles with the assessor roles and map rating scales to salary hikes. Configure assessors and increments to ensure transparent performance reviews and structured increment planning — all in one place." [ref=f3e155]:
                - generic [ref=f3e156]:
                  - generic [ref=f3e157]:
                    - img "Icon" [ref=f3e158]
                    - generic [ref=f3e159]: PMS Configuration
                  - paragraph [ref=f3e160]: Set up your appraisal cycles with the assessor roles and map rating scales to salary hikes. Configure assessors and increments to ensure transparent performance reviews and structured increment planning — all in one place.
              - region "Icon PMS Configuration Set up your appraisal cycles with the assessor roles and map rating scales to salary hikes. Configure assessors and increments to ensure transparent performance reviews and structured increment planning — all in one place." [ref=f3e164]
          - listitem [ref=f3e165] [cursor=pointer]:
            - generic [ref=f3e166]:
              - button "Icon Dynamic Forms This module displays a categorized list of forms under Active, Inactive, and Draft statuses for PMS, allowing admins to search, view, and manage form configurations. Each form lists its module, name, creator, last updater, and current status for easy tracking and control." [ref=f3e167]:
                - generic [ref=f3e168]:
                  - generic [ref=f3e169]:
                    - img "Icon" [ref=f3e170]
                    - generic [ref=f3e171]: Dynamic Forms
                  - paragraph [ref=f3e172]: This module displays a categorized list of forms under Active, Inactive, and Draft statuses for PMS, allowing admins to search, view, and manage form configurations. Each form lists its module, name, creator, last updater, and current status for easy tracking and control.
              - region "Icon Dynamic Forms This module displays a categorized list of forms under Active, Inactive, and Draft statuses for PMS, allowing admins to search, view, and manage form configurations. Each form lists its module, name, creator, last updater, and current status for easy tracking and control." [ref=f3e176]
          - listitem [ref=f3e177] [cursor=pointer]:
            - button "Icon Project Management Configurations Attendance Configuration module allows administrators to set up and manage attendance policies, including attendance lock dates, shift configurations, and holiday calendars. It provides options to create, update, and publish attendance settings for accurate time tracking and compliance." [ref=f3e179]:
              - generic [ref=f3e180]:
                - generic [ref=f3e181]:
                  - img "Icon" [ref=f3e182]
                  - generic [ref=f3e183]: Project Management Configurations
                - paragraph [ref=f3e184]: Attendance Configuration module allows administrators to set up and manage attendance policies, including attendance lock dates, shift configurations, and holiday calendars. It provides options to create, update, and publish attendance settings for accurate time tracking and compliance.
          - listitem [ref=f3e188] [cursor=pointer]:
            - generic [ref=f3e189]:
              - button "Icon Locking System The Locking System module manages data access by defining restricted periods during which modifications are not allowed. Once a period is locked, users are prevented from adding or updating information within that timeframe." [ref=f3e190]:
                - generic [ref=f3e191]:
                  - generic [ref=f3e192]:
                    - img "Icon" [ref=f3e193]
                    - generic [ref=f3e194]: Locking System
                  - paragraph [ref=f3e195]: The Locking System module manages data access by defining restricted periods during which modifications are not allowed. Once a period is locked, users are prevented from adding or updating information within that timeframe.
              - region "Icon Locking System The Locking System module manages data access by defining restricted periods during which modifications are not allowed. Once a period is locked, users are prevented from adding or updating information within that timeframe." [ref=f3e199]
          - listitem [ref=f3e200] [cursor=pointer]:
            - generic [ref=f3e201]:
              - button "Icon IT Support Configurations Efficiently manage all IT support settings from one place. Configure categories, subcategories, and priority levels, and define escalation rules to streamline ticket handling. Ensure all configurations reflect instantly in the Support Ticket module for seamless issue reporting and resolution." [ref=f3e202]:
                - generic [ref=f3e203]:
                  - generic [ref=f3e204]:
                    - img "Icon" [ref=f3e205]
                    - generic [ref=f3e206]: IT Support Configurations
                  - paragraph [ref=f3e207]: Efficiently manage all IT support settings from one place. Configure categories, subcategories, and priority levels, and define escalation rules to streamline ticket handling. Ensure all configurations reflect instantly in the Support Ticket module for seamless issue reporting and resolution.
              - region "Icon IT Support Configurations Efficiently manage all IT support settings from one place. Configure categories, subcategories, and priority levels, and define escalation rules to streamline ticket handling. Ensure all configurations reflect instantly in the Support Ticket module for seamless issue reporting and resolution." [ref=f3e211]
          - listitem [ref=f3e212] [cursor=pointer]:
            - generic [ref=f3e213]:
              - button "Icon Employee Field Update Configuration The Employee Info Update allows HR/Admin to configure which employee profile fields require approval when an employee submits an update request from the My Info page. HR/Admin can define approval authorities, set validation rules, and control the overall workflow for updating employee information, ensuring accuracy and compliance across the system." [ref=f3e214]:
                - generic [ref=f3e215]:
                  - generic [ref=f3e216]:
                    - img "Icon" [ref=f3e217]
                    - generic [ref=f3e218]: Employee Field Update Configuration
                  - paragraph [ref=f3e219]: The Employee Info Update allows HR/Admin to configure which employee profile fields require approval when an employee submits an update request from the My Info page. HR/Admin can define approval authorities, set validation rules, and control the overall workflow for updating employee information, ensuring accuracy and compliance across the system.
              - region "Icon Employee Field Update Configuration The Employee Info Update allows HR/Admin to configure which employee profile fields require approval when an employee submits an update request from the My Info page. HR/Admin can define approval authorities, set validation rules, and control the overall workflow for updating employee information, ensuring accuracy and compliance across the system." [ref=f3e223]
          - listitem [ref=f3e224] [cursor=pointer]:
            - button "Icon Rate Card Configuration The Rate Card Configuration module allows HR and Finance teams to define and manage role-based rate cards for employees. Rates can be configured based on job roles and applied consistently across projects to ensure accurate and transparent billing." [ref=f3e226]:
              - generic [ref=f3e227]:
                - generic [ref=f3e228]:
                  - img "Icon" [ref=f3e229]
                  - generic [ref=f3e230]: Rate Card Configuration
                - paragraph [ref=f3e231]: The Rate Card Configuration module allows HR and Finance teams to define and manage role-based rate cards for employees. Rates can be configured based on job roles and applied consistently across projects to ensure accurate and transparent billing.
          - listitem [ref=f3e235] [cursor=pointer]:
            - button "Icon Help Desk Configuration The Help Desk Configuration module enables admins to create and manage categories and subcategories used by employees when raising support tickets, ensuring proper routing and efficient issue resolution." [ref=f3e237]:
              - generic [ref=f3e238]:
                - generic [ref=f3e239]:
                  - img "Icon" [ref=f3e240]
                  - generic [ref=f3e241]: Help Desk Configuration
                - paragraph [ref=f3e242]: The Help Desk Configuration module enables admins to create and manage categories and subcategories used by employees when raising support tickets, ensuring proper routing and efficient issue resolution.
          - listitem [ref=f3e246] [cursor=pointer]:
            - button "Icon Bulk Import / Upload Configurations The Bulk Import / Upload Data feature enables users to upload large volumes of HR and organizational data at once using supported file formats such as Excel or CSV. It simplifies bulk data entry by allowing users to upload records across different areas of the application, with built-in validation to identify errors and ensure the data is accurate before it is imported." [ref=f3e248]:
              - generic [ref=f3e249]:
                - generic [ref=f3e250]:
                  - img "Icon" [ref=f3e251]
                  - generic [ref=f3e252]: Bulk Import / Upload Configurations
                - paragraph [ref=f3e253]: The Bulk Import / Upload Data feature enables users to upload large volumes of HR and organizational data at once using supported file formats such as Excel or CSV. It simplifies bulk data entry by allowing users to upload records across different areas of the application, with built-in validation to identify errors and ensure the data is accurate before it is imported.
```

# Test source

```ts
  689 |       await this.selectDropdownOptionByIndex(shiftCombo, offset);
  690 | 
  691 |       const location = await this.readComboboxValue(locationCombo);
  692 |       const subLocation = await this.readComboboxValue(subLocationCombo);
  693 |       const shift = await this.readComboboxValue(shiftCombo);
  694 | 
  695 |       const differsFromOriginal =
  696 |         location.toLowerCase() !== original.location.toLowerCase()
  697 |         || subLocation.toLowerCase() !== original.subLocation.toLowerCase()
  698 |         || shift.toLowerCase() !== original.shift.toLowerCase();
  699 | 
  700 |       if (differsFromOriginal && location && subLocation && shift) {
  701 |         if (await this.saveButton.isEnabled().catch(() => false)) {
  702 |           return { location, subLocation, shift };
  703 |         }
  704 |       }
  705 |     }
  706 | 
  707 |     throw new Error('Unable to select a different location hierarchy for clone.');
  708 |   }
  709 | 
  710 |   async submitCloneLeaveCategory() {
  711 |     await expect(this.saveButton).toBeEnabled({ timeout: 15000 });
  712 |     await this.saveButton.click();
  713 | 
  714 |     if (await this.confirmYesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
  715 |       await this.confirmYesButton.click();
  716 |     }
  717 | 
  718 |     await Promise.race([
  719 |       this.dataClonedToast.waitFor({ state: 'visible', timeout: 30000 }),
  720 |       this.successToast.waitFor({ state: 'visible', timeout: 30000 }),
  721 |     ]);
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
> 789 |     await this.pendingTab.waitFor({ state: 'visible', timeout: 15000 });
      |                           ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
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
  822 |     await option.waitFor({ state: 'visible', timeout: 10000 });
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
```