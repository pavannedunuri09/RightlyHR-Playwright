# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: my-info.spec.ts >> My Info Module Automation Suite >> TC04 - Update Address Information
- Location: tests\my-info.spec.ts:66:7

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  getByRole('button', { name: 'Save', exact: true })
Expected: enabled
Received: disabled
Timeout:  10000ms

Call log:
  - Expect "toBeEnabled" with timeout 10000ms
  - waiting for getByRole('button', { name: 'Save', exact: true })
    23 × locator resolved to <button disabled type="submit" _ngcontent-ng-c2882649551="" class="custom-btn btn-primary">Save</button>
       - unexpected value "disabled"

```

```yaml
- button "Save" [disabled]
```

# Test source

```ts
  355 |     if (data.dateOfBirth) {
  356 |       const dobInput = this.page.locator('input[formcontrolname="dob"]');
  357 |       await dobInput.fill(data.dateOfBirth);
  358 |     }
  359 | 
  360 |     if (data.bloodGroup) {
  361 |       await this.selectBloodGroup(data.bloodGroup);
  362 |     }
  363 | 
  364 |     if (data.maritalStatus) {
  365 |       await this.selectMaritalStatus(data.maritalStatus);
  366 |     }
  367 | 
  368 |     if (data.maritalStatus === 'Married' && data.marriageAnniversary) {
  369 |       const anniversaryInput = this.page.locator('input[formcontrolname="marriageDate"]');
  370 |       if (await anniversaryInput.isVisible({ timeout: 3000 }).catch(() => false)) {
  371 |         await anniversaryInput.fill(data.marriageAnniversary);
  372 |       }
  373 |     }
  374 | 
  375 |     // Save
  376 |     const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
  377 |     await expect(saveButton).toBeEnabled({ timeout: 10000 });
  378 |     await saveButton.click();
  379 | 
  380 |     await expect(
  381 |       this.page.getByText(/Basic information updated|saved successfully|updated successfully/i).first()
  382 |     ).toBeVisible({ timeout: 15000 });
  383 |   }
  384 | 
  385 |   // ==========================================
  386 |   // 2. CONTACT INFORMATION
  387 |   // ==========================================
  388 | 
  389 |   async openContactInfo() {
  390 |     await this.openPersonalSubTab('Contact Info');
  391 |   }
  392 | 
  393 |   async updateContactInfo(data: ContactInfoData) {
  394 |     await this.openContactInfo();
  395 |     await this.clickEditIcon();
  396 | 
  397 |     if (data.workNumber) {
  398 |       const workNumberInput = this.page.locator('input[formcontrolname="workNumber"]');
  399 |       await workNumberInput.fill(data.workNumber);
  400 |     }
  401 | 
  402 |     if (data.phoneNumber) {
  403 |       const phoneInput = this.page.locator('input[formcontrolname="phoneNumber"]');
  404 |       await phoneInput.fill(data.phoneNumber);
  405 |     }
  406 | 
  407 |     if (data.personalEmail) {
  408 |       const emailInput = this.page.locator('input[formcontrolname="personalEmail"]');
  409 |       await emailInput.fill(data.personalEmail);
  410 |     }
  411 | 
  412 |     const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
  413 |     await expect(saveButton).toBeEnabled({ timeout: 10000 });
  414 |     await saveButton.click();
  415 | 
  416 |     await expect(
  417 |       this.page.getByText(/Contact Details updated|Contact Information updated|saved successfully|updated successfully/i).first()
  418 |     ).toBeVisible({ timeout: 15000 });
  419 |   }
  420 | 
  421 |   // ==========================================
  422 |   // 3. ADDRESS INFORMATION
  423 |   // ==========================================
  424 | 
  425 |   async openAddresses() {
  426 |     await this.openPersonalSubTab('Addresses');
  427 |   }
  428 | 
  429 |   async updateAddress(data: AddressData) {
  430 |     await this.openAddresses();
  431 |     await this.clickEditIcon();
  432 | 
  433 |     const sameAsPermCheckbox = this.page.locator('input[formcontrolname="sameAsPermanent"]');
  434 |     if (data.sameAsPermanent !== undefined) {
  435 |       if (data.sameAsPermanent) {
  436 |         await sameAsPermCheckbox.check();
  437 |       } else {
  438 |         await sameAsPermCheckbox.uncheck();
  439 |       }
  440 |     }
  441 | 
  442 |     if (data.permanentZip) {
  443 |       const permZip = this.page.locator('#permanentZipCode');
  444 |       await permZip.fill(data.permanentZip);
  445 |     }
  446 | 
  447 |     if (!data.sameAsPermanent && data.currentZip) {
  448 |       const currZip = this.page.locator('#currentZipCode');
  449 |       if (await currZip.isVisible()) {
  450 |         await currZip.fill(data.currentZip);
  451 |       }
  452 |     }
  453 | 
  454 |     const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
> 455 |     await expect(saveButton).toBeEnabled({ timeout: 10000 });
      |                              ^ Error: expect(locator).toBeEnabled() failed
  456 |     await saveButton.click();
  457 |     await expect(saveButton).toBeHidden({ timeout: 15000 });
  458 |   }
  459 | 
  460 |   // ==========================================
  461 |   // 4. EMERGENCY CONTACTS
  462 |   // ==========================================
  463 | 
  464 |   async openEmergencyContacts() {
  465 |     await this.openPersonalSubTab('Emergency Contacts');
  466 |   }
  467 | 
  468 |   async updateEmergencyContacts(data: EmergencyContactsData) {
  469 |     await this.openEmergencyContacts();
  470 |     await this.clickEditIcon();
  471 | 
  472 |     // Contact 1
  473 |     const contact1Name = this.page.locator('input[formcontrolname="contact1Name"]');
  474 |     await contact1Name.fill(data.contact1.name);
  475 | 
  476 |     const contact1Email = this.page.locator('input[formcontrolname="contact1Email"]');
  477 |     await contact1Email.fill(data.contact1.email);
  478 | 
  479 |     const phone1Input = this.page.locator('input[formcontrolname="contact1Phone"]');
  480 |     await this.selectIndiaCountryCode(phone1Input);
  481 |     await phone1Input.fill(data.contact1.phone);
  482 | 
  483 |     if (data.contact1.relationship) {
  484 |       const rel1 = this.page.locator('p-select[formcontrolname="contact1Relationship"]');
  485 |       await this.selectDropdownOption(rel1, data.contact1.relationship);
  486 |     }
  487 | 
  488 |     // Contact 2
  489 |     if (data.contact2) {
  490 |       const contact2Name = this.page.locator('input[formcontrolname="contact2Name"]');
  491 |       if (await contact2Name.isVisible()) {
  492 |         await contact2Name.fill(data.contact2.name);
  493 |       }
  494 | 
  495 |       const contact2Email = this.page.locator('input[formcontrolname="contact2Email"]');
  496 |       if (await contact2Email.isVisible()) {
  497 |         await contact2Email.fill(data.contact2.email);
  498 |       }
  499 | 
  500 |       const phone2Input = this.page.locator('input[formcontrolname="contact2Phone"]');
  501 |       if (await phone2Input.isVisible()) {
  502 |         await this.selectIndiaCountryCode(phone2Input);
  503 |         await phone2Input.fill(data.contact2.phone);
  504 |       }
  505 | 
  506 |       if (data.contact2.relationship) {
  507 |         const rel2 = this.page.locator('p-select[formcontrolname="contact2Relationship"]');
  508 |         await this.selectDropdownOption(rel2, data.contact2.relationship);
  509 |       }
  510 |     }
  511 | 
  512 |     const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
  513 |     await expect(saveButton).toBeEnabled({ timeout: 10000 });
  514 |     await saveButton.click();
  515 |     await expect(saveButton).toBeHidden({ timeout: 15000 });
  516 |   }
  517 | 
  518 |   // ==========================================
  519 |   // 5. FAMILY MEMBERS
  520 |   // ==========================================
  521 | 
  522 |   async openFamilyMembers() {
  523 |     await this.openPersonalSubTab('Family Members');
  524 |   }
  525 | 
  526 |   async addFamilyMember(data: FamilyMemberData) {
  527 |     await this.openFamilyMembers();
  528 |     await this.page.getByText('Add New', { exact: true }).click();
  529 | 
  530 |     const nameInput = this.page.getByRole('textbox', { name: 'Name*' });
  531 |     await nameInput.fill(data.name);
  532 | 
  533 |     const dobInput = this.page.getByRole('textbox', { name: 'Date of Birth*' });
  534 |     await dobInput.fill(data.dob);
  535 | 
  536 |     const relDropdown = this.page.getByRole('combobox', { name: 'Please select relationship' });
  537 |     await this.selectDropdownOption(relDropdown, data.relationship);
  538 | 
  539 |     if (data.dependent) {
  540 |       const depCheckbox = this.page.getByRole('checkbox', { name: 'Dependent' });
  541 |       await depCheckbox.check();
  542 |     }
  543 | 
  544 |     const addButton = this.page.getByRole('button', { name: 'Add', exact: true });
  545 |     await expect(addButton).toBeEnabled();
  546 |     await addButton.click();
  547 | 
  548 |     await this.waitForDialogClose();
  549 |     await expect(this.getTableRow(data.name)).toBeVisible({ timeout: 15000 });
  550 |   }
  551 | 
  552 |   async updateFamilyMember(searchName: string, updatedName: string) {
  553 |     const row = this.getTableRow(searchName);
  554 |     await expect(row).toBeVisible({ timeout: 15000 });
  555 | 
```