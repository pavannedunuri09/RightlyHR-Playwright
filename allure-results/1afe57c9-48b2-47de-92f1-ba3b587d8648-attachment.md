# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leave-category.spec.ts >> Leave Category Foundation >> Add Leave Category validations >> 07. creates General Leave category with required details and enables Save
- Location: tests\leave-category.spec.ts:108:9

# Error details

```
TimeoutError: locator.getAttribute: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('combobox', { name: 'Select sub-location' })

```

# Page snapshot

```yaml
- generic [ref=f5e4]:
  - generic [ref=f5e8]:
    - img "Company Logo" [ref=f5e10]
    - generic [ref=f5e11]:
      - generic [ref=f5e12] [cursor=pointer]
      - generic [ref=f5e20] [cursor=pointer]: 
      - generic [ref=f5e24] [cursor=pointer]
      - generic [ref=f5e34] [cursor=pointer]:
        - generic [ref=f5e35]:
          - paragraph [ref=f5e36]: Sai Pavan Dinesh
          - paragraph [ref=f5e37]: QA Tester
        - img "Profile Image" [ref=f5e39]
  - generic [ref=f5e40]:
    - generic [ref=f5e43]:
      - list [ref=f5e45]:
        - listitem [ref=f5e46] [cursor=pointer]:
          - img "Icon" [ref=f5e47]
          - text: Dashboard
        - listitem [ref=f5e48]:
          - generic [ref=f5e49]:
            - generic [ref=f5e50] [cursor=pointer]:
              - img "Icon" [ref=f5e51]
              - text: My Info
            - generic [ref=f5e52] [cursor=pointer]:
              - img "Icon" [ref=f5e53]
              - text: Employees
            - generic [ref=f5e54] [cursor=pointer]:
              - img "Icon" [ref=f5e55]
              - text: Policies
            - generic [ref=f5e56] [cursor=pointer]:
              - img "Icon" [ref=f5e57]
              - text: Pending Approvals
            - generic [ref=f5e58] [cursor=pointer]:
              - img "Icon" [ref=f5e59]
              - text: Reports
            - generic [ref=f5e60] [cursor=pointer]:
              - img "Icon" [ref=f5e61]
              - text: Holidays
            - generic [ref=f5e62] [cursor=pointer]:
              - img "Icon" [ref=f5e63]
              - text: Cards Management
            - generic [ref=f5e64] [cursor=pointer]:
              - img "Icon" [ref=f5e65]
              - text: Expenses
            - generic [ref=f5e66] [cursor=pointer]:
              - img "Icon" [ref=f5e67]
              - text: IT Support
            - generic [ref=f5e68] [cursor=pointer]:
              - img "Icon" [ref=f5e69]
              - text: Skill Set
            - generic [ref=f5e72] [cursor=pointer]:
              - img "Icon" [ref=f5e73]
              - text: Project Management
            - generic [ref=f5e76] [cursor=pointer]:
              - img "Icon" [ref=f5e77]
              - text: ATS
            - generic [ref=f5e80] [cursor=pointer]:
              - img "Icon" [ref=f5e81]
              - text: PMS
            - generic [ref=f5e84] [cursor=pointer]:
              - img "Icon" [ref=f5e85]
              - text: Time Off
        - listitem [ref=f5e86] [cursor=pointer]:
          - img "Icons" [ref=f5e89]
      - img "Powered By logo" [ref=f5e92]
    - generic [ref=f5e99]:
      - generic [ref=f5e101]:
        - generic [ref=f5e102] [cursor=pointer]:
          - text: Leave Category
          - generic [ref=f5e103]: 
        - generic [ref=f5e104]: Add Leave Category
      - generic [ref=f5e105]:
        - generic [ref=f5e107]:
          - generic [ref=f5e108]: Location/Shift
          - generic [ref=f5e109]:
            - generic [ref=f5e110]: Year*
            - generic [ref=f5e112] [cursor=pointer]:
              - combobox "2026" [ref=f5e113]
              - button "dropdown trigger" [ref=f5e114]
          - generic [ref=f5e118]:
            - generic [ref=f5e119]: Location*
            - generic [ref=f5e121] [cursor=pointer]:
              - combobox "Hyderabad" [ref=f5e122]
              - button "dropdown trigger" [ref=f5e123]
          - generic [ref=f5e127]:
            - generic [ref=f5e128]: Sub Location*
            - generic [ref=f5e130] [cursor=pointer]:
              - combobox "Ayyappa Society" [active] [ref=f5e131]
              - button "dropdown trigger" [ref=f5e132]
          - generic [ref=f5e136]:
            - generic [ref=f5e137]: Shift*
            - generic [ref=f5e139] [cursor=pointer]:
              - combobox "Select shift" [ref=f5e140]
              - button "dropdown trigger" [ref=f5e141]
          - generic [ref=f5e145]: Leave Category Information
          - generic [ref=f5e146]:
            - generic [ref=f5e147]: Leave Category Type*
            - generic [ref=f5e149] [cursor=pointer]:
              - combobox "General" [ref=f5e150]
              - button "dropdown trigger" [ref=f5e151]
          - generic [ref=f5e155]:
            - generic [ref=f5e156]: Leave Type*
            - generic [ref=f5e158] [cursor=pointer]:
              - combobox "Select Leave Type" [ref=f5e159]
              - button "dropdown trigger" [ref=f5e160]
            - generic [ref=f5e164]: Leave Type is required
          - generic [ref=f5e165]:
            - generic [ref=f5e166]: Leave Category Name*
            - textbox "Please enter name" [ref=f5e167]
            - generic [ref=f5e168]: Leave Category Name is required
          - generic [ref=f5e169]:
            - generic [ref=f5e170]: Leave Category Code*
            - textbox "Please enter code" [ref=f5e171]
            - generic [ref=f5e172]: Leave Category Code is required
          - generic [ref=f5e173]:
            - generic [ref=f5e174]: Valid Days *
            - spinbutton "Please enter valid days" [ref=f5e175]
            - generic [ref=f5e176]: Valid Days is required
          - generic [ref=f5e177]:
            - generic [ref=f5e178]: Leave Category Color*
            - textbox [ref=f5e179]:
              - /placeholder: Please enter color
              - text: "#000000"
          - generic [ref=f5e180]:
            - generic [ref=f5e181]: Is Dependent
            - generic [ref=f5e183] [cursor=pointer]:
              - combobox "Select option" [ref=f5e184]
              - button "dropdown trigger" [ref=f5e185]
          - generic [ref=f5e189]: Additional Information
          - generic [ref=f5e190]:
            - generic [ref=f5e191]: Allowed Gender *
            - generic [ref=f5e193] [cursor=pointer]:
              - combobox "Select gender" [ref=f5e194]
              - button "dropdown trigger" [ref=f5e195]
            - generic [ref=f5e199]: Allowed Gender is required
          - generic [ref=f5e200]:
            - generic [ref=f5e201]: Allowed Marital Status *
            - generic [ref=f5e203] [cursor=pointer]:
              - combobox "Select marital status" [ref=f5e204]
              - button "dropdown trigger" [ref=f5e205]
            - generic [ref=f5e209]: Allowed Marital Status is required
          - generic [ref=f5e210]:
            - generic [ref=f5e211]: Exclude Weekends*
            - generic [ref=f5e213] [cursor=pointer]:
              - combobox "Select option" [ref=f5e214]
              - button "dropdown trigger" [ref=f5e215]
            - generic [ref=f5e219]: Exclude Weekends is required
          - generic [ref=f5e220]:
            - generic [ref=f5e221]: Exclude Holidays*
            - generic [ref=f5e223] [cursor=pointer]:
              - combobox "Select option" [ref=f5e224]
              - button "dropdown trigger" [ref=f5e225]
            - generic [ref=f5e229]: Exclude Holidays is required
          - generic [ref=f5e230]:
            - generic [ref=f5e231]: Is Optional Holiday*
            - generic [ref=f5e233] [cursor=pointer]:
              - combobox "Select option" [ref=f5e234]
              - button "dropdown trigger" [ref=f5e235]
            - generic [ref=f5e239]: Is Optional Holiday is required
          - generic [ref=f5e240]:
            - generic [ref=f5e241]: Half Day Leave Allowed*
            - generic [ref=f5e243] [cursor=pointer]:
              - combobox "Select option" [ref=f5e244]
              - button "dropdown trigger" [ref=f5e245]
            - generic [ref=f5e249]: Half Day Leave Allowed is required
          - generic [ref=f5e250]:
            - generic [ref=f5e251]: Pro Rata Leave Allocation*
            - generic [ref=f5e253] [cursor=pointer]:
              - combobox "Select option" [ref=f5e254]
              - button "dropdown trigger" [ref=f5e255]
            - generic [ref=f5e259]: Pro Rata Leave Allocation is required
          - generic [ref=f5e260]:
            - generic [ref=f5e261]: Advance Notice
            - generic [ref=f5e262]:
              - generic [ref=f5e263]: Minimum Advance Apply Days
              - spinbutton "Minimum Advance Apply Days" [ref=f5e264]
          - generic [ref=f5e265]:
            - generic [ref=f5e266]: Maximum Leave Duration
            - generic [ref=f5e267]:
              - generic [ref=f5e268]: Maximum Leave Duration (Calendar Days)
              - spinbutton "Maximum Leave Duration (Calendar Days)" [ref=f5e269]
            - generic [ref=f5e270]:
              - generic [ref=f5e271]: Include Weekends
              - generic [ref=f5e272]:
                - generic:
                  - combobox "No" [disabled]
                  - button "dropdown trigger"
            - generic [ref=f5e273]:
              - generic [ref=f5e274]: Include Holidays
              - generic [ref=f5e275]:
                - generic:
                  - combobox "No" [disabled]
                  - button "dropdown trigger"
          - generic [ref=f5e276]:
            - generic [ref=f5e277]: Leave Combination
            - generic [ref=f5e278]:
              - generic [ref=f5e279]: Allow Leave Combination
              - generic [ref=f5e281] [cursor=pointer]:
                - combobox "Yes" [ref=f5e282]
                - button "dropdown trigger" [ref=f5e283]
          - generic [ref=f5e287]:
            - generic [ref=f5e288]: Leave Interval
            - generic [ref=f5e289]:
              - generic [ref=f5e290]: Minimum Gap Between Same Leave Type (Days)
              - spinbutton "Minimum Gap Between Same Leave Type (Days)" [ref=f5e291]
            - generic [ref=f5e292]:
              - generic [ref=f5e293]: Gap Calculation Basis
              - generic [ref=f5e295] [cursor=pointer]:
                - combobox "Select basis" [ref=f5e296]
                - button "dropdown trigger" [ref=f5e297]
          - generic [ref=f5e301]:
            - generic [ref=f5e302]: Sandwich Policy
            - generic [ref=f5e303]:
              - generic [ref=f5e304]: Enable Sandwich Policy
              - generic [ref=f5e306] [cursor=pointer]:
                - combobox "No" [ref=f5e307]
                - button "dropdown trigger" [ref=f5e308]
          - generic [ref=f5e312]: Allow Requests For Future Dates
          - generic [ref=f5e313]:
            - generic [ref=f5e314]: Allowed*
            - generic [ref=f5e316] [cursor=pointer]:
              - combobox "Select option" [ref=f5e317]
              - button "dropdown trigger" [ref=f5e318]
            - generic [ref=f5e322]: Future Dates Allowed is required
          - generic [ref=f5e323]:
            - generic [ref=f5e324]: Days*
            - spinbutton "No. of days" [disabled] [ref=f5e325]
          - generic [ref=f5e326]: Allow Requests For Past Dates
          - generic [ref=f5e327]:
            - generic [ref=f5e328]: Allowed*
            - generic [ref=f5e330] [cursor=pointer]:
              - combobox "Select option" [ref=f5e331]
              - button "dropdown trigger" [ref=f5e332]
            - generic [ref=f5e336]: Past Dates Allowed is required
          - generic [ref=f5e337]:
            - generic [ref=f5e338]: Days*
            - spinbutton "No. of days" [disabled] [ref=f5e339]
          - generic [ref=f5e340]: Carry Forward
          - generic [ref=f5e341]:
            - generic [ref=f5e342]: Allowed*
            - generic [ref=f5e344] [cursor=pointer]:
              - combobox "Select option" [ref=f5e345]
              - button "dropdown trigger" [ref=f5e346]
            - generic [ref=f5e350]: Carry Forward Leave is required
          - generic [ref=f5e351]:
            - generic [ref=f5e352]: Days*
            - spinbutton "No. of days" [disabled] [ref=f5e353]
          - generic [ref=f5e354]: Encash
          - generic [ref=f5e355]:
            - generic [ref=f5e356]: Allowed*
            - generic [ref=f5e358] [cursor=pointer]:
              - combobox "Select option" [ref=f5e359]
              - button "dropdown trigger" [ref=f5e360]
            - generic [ref=f5e364]: Encash Allowed is required
          - generic [ref=f5e365]:
            - generic [ref=f5e366]: Days*
            - spinbutton "No. of days" [disabled] [ref=f5e367]
          - generic [ref=f5e368]: Probation Period
          - generic [ref=f5e369]:
            - generic [ref=f5e370]: Probation Period Rules Applicable?*
            - generic [ref=f5e372] [cursor=pointer]:
              - combobox "Select option" [ref=f5e373]
              - button "dropdown trigger" [ref=f5e374]
            - generic [ref=f5e378]: Probation Rules Applicable is required
          - generic [ref=f5e379]:
            - generic [ref=f5e380]: Leaves Allowed*
            - spinbutton "No. of days" [disabled] [ref=f5e381]
          - generic [ref=f5e382]: Notice Period
          - generic [ref=f5e383]:
            - generic [ref=f5e384]: Notice Period Rules Applicable?*
            - generic [ref=f5e386] [cursor=pointer]:
              - combobox "Select option" [ref=f5e387]
              - button "dropdown trigger" [ref=f5e388]
            - generic [ref=f5e392]: Notice Period Rules Applicable is required
          - generic [ref=f5e393]:
            - generic [ref=f5e394]: Leaves Allowed*
            - spinbutton "No. of days" [disabled] [ref=f5e395]
          - generic [ref=f5e396]: Entitlement Frequency
          - generic [ref=f5e397]:
            - generic [ref=f5e398]: Frequency Type *
            - generic [ref=f5e400] [cursor=pointer]:
              - combobox "Select frequency type" [ref=f5e401]
              - button "dropdown trigger" [ref=f5e402]
          - generic [ref=f5e406]:
            - generic [ref=f5e407]: Leave Balance Handling *
            - generic [ref=f5e409] [cursor=pointer]:
              - combobox "Select cycle handling" [ref=f5e410]
              - button "dropdown trigger" [ref=f5e411]
          - generic [ref=f5e415]:
            - generic [ref=f5e416]: Allow Leave for Past Cycle *
            - generic [ref=f5e418] [cursor=pointer]:
              - combobox "Select allow leave for past cycle" [ref=f5e419]
              - button "dropdown trigger" [ref=f5e420]
        - generic [ref=f5e424]:
          - button "Cancel" [ref=f5e425] [cursor=pointer]
          - button "Save" [disabled] [ref=f5e426] [cursor=pointer]
```

# Test source

```ts
  550 |     const row = this.getPublishedCategoryRow(data);
  551 |     await this.revealTableRow(row);
  552 |     await expect(row).toBeVisible({ timeout: 30000 });
  553 |     await this.openRowKebab(row);
  554 | 
  555 |     await expect(this.kebabMenuItem('Clone')).toBeVisible();
  556 |     await expect(this.kebabMenuItem('View')).toBeVisible();
  557 |     await expect(this.kebabMenuItem('Update')).toHaveCount(0);
  558 |     await this.closeOpenKebab();
  559 |   }
  560 | 
  561 |   async openViewForCategory(data: LeaveCategoryFormData) {
  562 |     await this.ensureOnPublishedList();
  563 |     const row = this.getPublishedCategoryRow(data);
  564 |     await this.revealTableRow(row);
  565 |     await expect(row).toBeVisible({ timeout: 30000 });
  566 |     await this.clickRowAction(row, 'View');
  567 |     await this.page.getByText('View Leave Category', { exact: false }).first().waitFor({ state: 'visible', timeout: 15000 });
  568 |     await expect(this.categoryNameInput).toHaveValue(data.categoryName, { timeout: 15000 });
  569 |   }
  570 | 
  571 |   async expectViewLeaveCategoryDetails(data: LeaveCategoryFormData) {
  572 |     await expect(this.categoryNameInput).toHaveValue(data.categoryName);
  573 |     await expect(this.categoryCodeInput).toHaveValue(data.categoryCode);
  574 |     await expect(this.validDaysInput).toHaveValue(data.validDays);
  575 |     await expect(this.colorInput).toHaveValue(data.color);
  576 |     await expect(this.page.getByRole('combobox', { name: data.year })).toBeVisible();
  577 |     await expect(this.page.getByRole('textbox', { name: 'Select location' })).toHaveValue(data.location);
  578 |     await expect(this.page.getByRole('textbox', { name: 'Select sub-location' })).toHaveValue(data.subLocation);
  579 |     await expect(this.page.getByRole('textbox', { name: 'Select shift' })).toHaveValue(data.shift);
  580 |     await expect(this.fieldGroupByLabel(/Leave Category Type/i).getByRole('combobox').first()).toHaveAttribute('aria-label', data.categoryType);
  581 |     await expect(this.fieldGroupByLabel(/^Leave Type/i).getByRole('combobox').first()).toHaveAttribute('aria-label', data.leaveType);
  582 |   }
  583 | 
  584 |   async expectViewActionButtons() {
  585 |     await expect(this.cancelButton).toBeEnabled();
  586 |     await expect(this.cloneButton).toBeEnabled();
  587 |   }
  588 | 
  589 |   async openCloneFromViewPage() {
  590 |     await expect(this.cloneButton).toBeEnabled();
  591 |     await this.cloneButton.click();
  592 |     await this.page.getByText('Clone Leave Category', { exact: false }).first().waitFor({ state: 'visible', timeout: 15000 });
  593 |     await expect(this.locationHierarchyCombobox('location')).toBeVisible({ timeout: 15000 });
  594 |     await expect(this.saveButton).toBeVisible({ timeout: 15000 });
  595 |   }
  596 | 
  597 |   async openCloneForCategory(data: LeaveCategoryFormData) {
  598 |     await this.ensureOnPublishedList();
  599 |     const row = this.getPublishedCategoryRow(data);
  600 |     await this.revealTableRow(row);
  601 |     await expect(row).toBeVisible({ timeout: 30000 });
  602 |     await this.clickRowAction(row, 'Clone');
  603 |     await this.page.getByText('Clone Leave Category', { exact: false }).first().waitFor({ state: 'visible', timeout: 15000 });
  604 |     await expect(this.locationHierarchyCombobox('location')).toBeVisible({ timeout: 15000 });
  605 |     await expect(this.saveButton).toBeVisible({ timeout: 15000 });
  606 |   }
  607 | 
  608 |   formComboboxByLabel(label: string | RegExp): Locator {
  609 |     return this.fieldGroupByLabel(label).getByRole('combobox').first();
  610 |   }
  611 | 
  612 |   async fillCloneLeaveCategoryForm(data: LeaveCategoryFormData) {
  613 |     await this.selectDropdownOptionIfNeeded(this.formComboboxByLabel(/^Year/i), data.year);
  614 |     await this.selectDropdownOptionIfNeeded(this.locationHierarchyCombobox('location'), data.location);
  615 |     await this.selectDropdownOptionIfNeeded(this.locationHierarchyCombobox('subLocation'), data.subLocation);
  616 |     await this.selectDropdownOptionIfNeeded(this.locationHierarchyCombobox('shift'), data.shift);
  617 | 
  618 |     await this.selectDropdownOptionIfNeeded(this.formComboboxByLabel(/Leave Category Type/i), data.categoryType);
  619 |     await this.selectDropdownOption(this.formComboboxByLabel(/^Leave Type/i), data.leaveType);
  620 | 
  621 |     await this.categoryNameInput.fill(data.categoryName);
  622 |     await this.categoryCodeInput.fill(data.categoryCode);
  623 |     await this.validDaysInput.fill(data.validDays);
  624 |     await this.colorInput.fill(data.color);
  625 | 
  626 |     await this.selectDropdownOptionIfNeeded(this.formComboboxByLabel(/Allowed Gender/i), data.allowedGender);
  627 |     await this.selectDropdownOptionIfNeeded(this.formComboboxByLabel(/Allowed Marital Status/i), data.allowedMaritalStatus);
  628 | 
  629 |     await this.selectByFieldLabel(/Exclude Weekends/i, data.excludeWeekends);
  630 |     await this.selectByFieldLabel(/Exclude Holidays/i, data.excludeHolidays);
  631 |     await this.selectByFieldLabel(/Is Optional Holiday/i, data.isOptionalHoliday);
  632 |     await this.selectByFieldLabel(/Half Day Leave Allowed/i, data.halfDayLeaveAllowed);
  633 |     await this.selectByFieldLabel(/Pro Rata Leave Allocation/i, data.proRataLeaveAllocation);
  634 | 
  635 |     await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  636 |     await this.page.waitForTimeout(500);
  637 | 
  638 |     await this.selectByFieldLabel(/Enable Sandwich Policy/i, data.enableSandwichPolicy);
  639 |     await this.fillAllowedDaysPair(0, data.futureDatesAllowed, data.futureDatesDays);
  640 |     await this.fillAllowedDaysPair(1, data.pastDatesAllowed, data.pastDatesDays);
  641 |     await this.fillAllowedDaysPair(2, data.carryForwardAllowed, data.carryForwardDays);
  642 |     await this.fillAllowedDaysPair(3, data.encashAllowed, data.encashDays);
  643 | 
  644 |     await this.selectByFieldLabel(/Probation Period Rules Applicable/i, data.probationRulesApplicable);
  645 |     await this.selectByFieldLabel(/Notice Period Rules Applicable/i, data.noticePeriodRulesApplicable);
  646 |     await this.selectDropdownOptionIfNeeded(this.formComboboxByLabel(/Frequency Type/i), data.frequencyType);
  647 |   }
  648 | 
  649 |   async readComboboxValue(dropdown: Locator): Promise<string> {
> 650 |     const ariaLabel = (await dropdown.getAttribute('aria-label'))?.trim() ?? '';
      |                                       ^ TimeoutError: locator.getAttribute: Timeout 15000ms exceeded.
  651 |     if (ariaLabel && !/select (year|location|sub-location|shift|option)/i.test(ariaLabel)) {
  652 |       return ariaLabel;
  653 |     }
  654 | 
  655 |     const text = (await dropdown.innerText()).trim();
  656 |     return text.replace(/\s+/g, ' ');
  657 |   }
  658 | 
  659 |   async selectDropdownOptionByIndex(dropdown: Locator, index: number) {
  660 |     await dropdown.scrollIntoViewIfNeeded().catch(() => {});
  661 |     await dropdown.click({ force: true }).catch(() => {});
  662 | 
  663 |     const optionLocator = this.page
  664 |       .locator('.p-select-overlay [role="option"], .p-dropdown-items [role="option"], .p-select-option, [role="listbox"] [role="option"]')
  665 |       .filter({
  666 |         hasNotText: /^(Please select|Select year|Select location|Select sub location|Select shift|No result found|No data found|No records found)/i,
  667 |       });
  668 | 
  669 |     await optionLocator.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  670 |     const count = await optionLocator.count();
  671 |     if (count === 0) {
  672 |       await this.page.keyboard.press('Escape');
  673 |       return;
  674 |     }
  675 | 
  676 |     const safeIndex = index < count ? index : index % count;
  677 |     await optionLocator.nth(safeIndex).click({ force: true });
  678 |   }
  679 | 
  680 |   async expectCloneLocationFieldsEmpty(original: LeaveCategoryFormData) {
  681 |     const locationCombo = this.locationHierarchyCombobox('location');
  682 |     const subLocationCombo = this.locationHierarchyCombobox('subLocation');
  683 |     const shiftCombo = this.locationHierarchyCombobox('shift');
  684 | 
  685 |     await expect(locationCombo).toBeVisible();
  686 |     await expect(subLocationCombo).toBeVisible();
  687 |     await expect(shiftCombo).toBeVisible();
  688 | 
  689 |     const locationValue = await this.readComboboxValue(locationCombo);
  690 |     const subLocationValue = await this.readComboboxValue(subLocationCombo);
  691 |     const shiftValue = await this.readComboboxValue(shiftCombo);
  692 | 
  693 |     expect(locationValue.toLowerCase()).not.toBe(original.location.toLowerCase());
  694 |     expect(subLocationValue.toLowerCase()).not.toBe(original.subLocation.toLowerCase());
  695 |     expect(shiftValue.toLowerCase()).not.toBe(original.shift.toLowerCase());
  696 |   }
  697 | 
  698 |   async fillCloneLocationHierarchyExcludingOriginal(
  699 |     original: LeaveCategoryFormData,
  700 |     maxAttempts = 5,
  701 |   ): Promise<LeaveCategoryLocationHierarchy> {
  702 |     const locationCombo = this.locationHierarchyCombobox('location');
  703 |     const subLocationCombo = this.locationHierarchyCombobox('subLocation');
  704 |     const shiftCombo = this.locationHierarchyCombobox('shift');
  705 | 
  706 |     for (let offset = 0; offset < maxAttempts; offset += 1) {
  707 |       await this.selectDropdownOptionByIndex(locationCombo, offset);
  708 |       await this.selectDropdownOptionByIndex(subLocationCombo, offset);
  709 |       await this.selectDropdownOptionByIndex(shiftCombo, offset);
  710 | 
  711 |       const location = await this.readComboboxValue(locationCombo);
  712 |       const subLocation = await this.readComboboxValue(subLocationCombo);
  713 |       const shift = await this.readComboboxValue(shiftCombo);
  714 | 
  715 |       const differsFromOriginal =
  716 |         location.toLowerCase() !== original.location.toLowerCase()
  717 |         || subLocation.toLowerCase() !== original.subLocation.toLowerCase()
  718 |         || shift.toLowerCase() !== original.shift.toLowerCase();
  719 | 
  720 |       if (differsFromOriginal && location && subLocation && shift) {
  721 |         if (await this.saveButton.isEnabled().catch(() => false)) {
  722 |           return { location, subLocation, shift };
  723 |         }
  724 |       }
  725 |     }
  726 | 
  727 |     throw new Error('Unable to select a different location hierarchy for clone.');
  728 |   }
  729 | 
  730 |   async submitCloneLeaveCategory() {
  731 |     await expect(this.saveButton).toBeEnabled({ timeout: 15000 });
  732 |     await this.saveButton.click();
  733 | 
  734 |     if (await this.confirmYesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
  735 |       await this.confirmYesButton.click();
  736 |     }
  737 | 
  738 |     await Promise.race([
  739 |       this.dataClonedToast.waitFor({ state: 'visible', timeout: 30000 }),
  740 |       this.successToast.waitFor({ state: 'visible', timeout: 30000 }),
  741 |     ]);
  742 |     await this.dataClonedToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  743 |     await this.successToast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  744 |   }
  745 | 
  746 |   async expectPendingClonedRow(
  747 |     sourceData: LeaveCategoryFormData,
  748 |     cloneLocation: LeaveCategoryLocationHierarchy,
  749 |   ) {
  750 |     await this.ensureOnLeaveCategoryList();
```