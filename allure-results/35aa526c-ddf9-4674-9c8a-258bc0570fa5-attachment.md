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
  - waiting for locator('#settings-panel-2') to be visible

```

# Page snapshot

```yaml
- generic [ref=f2e4]:
  - generic [ref=f2e8]:
    - img "Company Logo" [ref=f2e10]
    - generic [ref=f2e11]:
      - generic [ref=f2e12] [cursor=pointer]: 
      - generic [ref=f2e16] [cursor=pointer]
      - generic [ref=f2e27] [cursor=pointer]:
        - paragraph [ref=f2e28]: Swathi Nair
        - paragraph [ref=f2e29]: QA Tester
  - generic [ref=f2e35]:
    - generic [ref=f2e38]:
      - list [ref=f2e40]:
        - listitem [ref=f2e41] [cursor=pointer]:
          - img "Icon" [ref=f2e42]
          - text: Dashboard
        - listitem [ref=f2e43]:
          - generic [ref=f2e44]:
            - generic [ref=f2e45] [cursor=pointer]:
              - img "Icon" [ref=f2e46]
              - text: My Info
            - generic [ref=f2e47] [cursor=pointer]:
              - img "Icon" [ref=f2e48]
              - text: Employees
            - generic [ref=f2e51] [cursor=pointer]:
              - img "Icon" [ref=f2e52]
              - text: Time Off
            - generic [ref=f2e53] [cursor=pointer]:
              - img "Icon" [ref=f2e54]
              - text: Holidays
            - generic [ref=f2e55] [cursor=pointer]:
              - img "Icon" [ref=f2e56]
              - text: Policies
            - generic [ref=f2e57] [cursor=pointer]:
              - img "Icon" [ref=f2e58]
              - text: Cards Management
            - generic [ref=f2e59] [cursor=pointer]:
              - img "Icon" [ref=f2e60]
              - text: Expenses
            - generic [ref=f2e61] [cursor=pointer]:
              - img "Icon" [ref=f2e62]
              - text: Reports
            - generic [ref=f2e63] [cursor=pointer]:
              - img "Icon" [ref=f2e64]
              - text: IT Support
            - generic [ref=f2e65] [cursor=pointer]:
              - img "Icon" [ref=f2e66]
              - text: Skill Set
            - generic [ref=f2e69] [cursor=pointer]:
              - img "Icon" [ref=f2e70]
              - text: Project Management
            - generic [ref=f2e73] [cursor=pointer]:
              - img "Icon" [ref=f2e74]
              - text: ATS
            - generic [ref=f2e77] [cursor=pointer]:
              - img "Icon" [ref=f2e78]
              - text: PMS
        - listitem [ref=f2e79] [cursor=pointer]:
          - img "Icons" [ref=f2e82]
      - img "Powered By logo" [ref=f2e85]
    - generic [ref=f2e89]:
      - generic [ref=f2e90]: Settings
      - list [ref=f2e94]:
        - listitem [ref=f2e96] [cursor=pointer]:
          - generic [ref=f2e97]:
            - button "Icon PMS Configuration Set up your appraisal cycles with the assessor roles and map rating scales to salary hikes. Configure assessors and increments to ensure transparent performance reviews and structured increment planning — all in one place." [ref=f2e98]:
              - generic [ref=f2e99]:
                - generic [ref=f2e100]:
                  - img "Icon" [ref=f2e101]
                  - generic [ref=f2e102]: PMS Configuration
                - paragraph [ref=f2e103]: Set up your appraisal cycles with the assessor roles and map rating scales to salary hikes. Configure assessors and increments to ensure transparent performance reviews and structured increment planning — all in one place.
            - region "Icon PMS Configuration Set up your appraisal cycles with the assessor roles and map rating scales to salary hikes. Configure assessors and increments to ensure transparent performance reviews and structured increment planning — all in one place." [ref=f2e107]
```

# Test source

```ts
  669 |     const locationValue = await this.readComboboxValue(locationCombo);
  670 |     const subLocationValue = await this.readComboboxValue(subLocationCombo);
  671 |     const shiftValue = await this.readComboboxValue(shiftCombo);
  672 | 
  673 |     expect(locationValue.toLowerCase()).not.toBe(original.location.toLowerCase());
  674 |     expect(subLocationValue.toLowerCase()).not.toBe(original.subLocation.toLowerCase());
  675 |     expect(shiftValue.toLowerCase()).not.toBe(original.shift.toLowerCase());
  676 |   }
  677 | 
  678 |   async fillCloneLocationHierarchyExcludingOriginal(
  679 |     original: LeaveCategoryFormData,
  680 |     maxAttempts = 5,
  681 |   ): Promise<LeaveCategoryLocationHierarchy> {
  682 |     const locationCombo = this.locationHierarchyCombobox('location');
  683 |     const subLocationCombo = this.locationHierarchyCombobox('subLocation');
  684 |     const shiftCombo = this.locationHierarchyCombobox('shift');
  685 | 
  686 |     for (let offset = 0; offset < maxAttempts; offset += 1) {
  687 |       await this.selectDropdownOptionByIndex(locationCombo, offset);
  688 |       await this.selectDropdownOptionByIndex(subLocationCombo, offset);
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
> 769 |     await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
      |                             ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
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
```