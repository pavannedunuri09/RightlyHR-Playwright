import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MyInfoPage } from '../pages/MyinfoPage';
import {
  alternateNameSet,
  alternateValidDob,
  alternateBloodGroup,
  alternateMarriageAnniversary,
  MARRIAGE_ANNIVERSARY_A,
  INVALID_DOB_UNDERAGE,
} from './fixtures/myInfoFields';
import { alternateContactSet } from './fixtures/myInfoContactFields';

test('Test 01: Employee should navigate to My Info Basic Info tab', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInfoPage(page);

    // Employee Login
    await loginPage.goto();

    await loginPage.login(
        'Indu@yopmail.com',
        'Indu@123'
    );

    // Navigate to My Info
    await myInfoPage.openMyInfo();
});

test('Test-02: Verify Basic Info details', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInfoPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login(
        'Indu@yopmail.com',
        'Indu@123'
    );

    // Navigate to My Info
    await myInfoPage.openMyInfo();

    // Verify Basic Info breadcrumb/header
    await expect(
        page.locator('.component-header')
            .filter({ hasText: /^Basic Info$/ })
    ).toBeVisible();

    // Verify Basic Info input fields

    // Employee ID
    await expect(
        page.getByText('Employee ID*')
    ).toBeVisible();
    console.log('Verified Employee ID field is visible');

    // Salutation
    await expect(
        page.getByText('Salutation*')
    ).toBeVisible();
    console.log('Verified Salutation field is visible');
    // First Name
    await expect(
        page.getByText('First Name*')
    ).toBeVisible();
    console.log('Verified First Name field is visible');

    // Blood Group
    await expect(
        page.getByText('Blood Group')
    ).toBeVisible();
    console.log('Verified Blood Group field is visible');

});

test('Test-03: Verify Employee can update Salutation', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInfoPage(page);

    const email = process.env.EMPLOYEE_EMAIL?.trim();
    const password = process.env.EMPLOYEE_PASSWORD?.trim();

    test.skip(
        !email || !password,
        'Set EMPLOYEE_EMAIL and EMPLOYEE_PASSWORD in .env'
    );

    // Login as Employee
    await loginPage.goto();
    await loginPage.login(email!, password!);

    // Navigate to My Info
    await myInfoPage.openMyInfo();

    // Click Edit
    await myInfoPage.clickEdit();

    // Toggle salutation/gender pair: Mr. -> Miss./Female, Miss. -> Mr./Male
    const currentSalutation = await myInfoPage.readCurrentSalutation();
    const { salutation: selectedSalutation, gender: selectedGender } = myInfoPage.alternateSalutationPair(
      currentSalutation,
    );
    console.log(`Updating salutation from ${currentSalutation || 'unknown'} to ${selectedSalutation} / ${selectedGender}`);
    await myInfoPage.selectSalutationWithGender(selectedSalutation, selectedGender);

    // Save changes
    await myInfoPage.saveChanges();

    // Verify success message
    await expect(myInfoPage.successMessage).toBeVisible();

    // Verify updated Salutation and matching Gender
    await expect(myInfoPage.salutationValue).toContainText(selectedSalutation);
    await expect(myInfoPage.genderValue).toContainText(selectedGender);

});

test('Test-04: Verify Employee can update name fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInfoPage(page);

    const email = process.env.EMPLOYEE_EMAIL?.trim();
    const password = process.env.EMPLOYEE_PASSWORD?.trim();

    test.skip(
        !email || !password,
        'Set EMPLOYEE_EMAIL and EMPLOYEE_PASSWORD in .env'
    );

    await loginPage.goto();
    await loginPage.login(email!, password!);

    await myInfoPage.openMyInfo();
    await myInfoPage.clickEdit();

    const editable = {
        first: await myInfoPage.isNameFieldEditable('first'),
        middle: await myInfoPage.isNameFieldEditable('middle'),
        last: await myInfoPage.isNameFieldEditable('last'),
    };
    console.log(`Name field editability — First: ${editable.first}, Middle: ${editable.middle}, Last: ${editable.last}`);

    test.skip(
        !editable.first && !editable.middle && !editable.last,
        'No name fields are editable in My Info Basic Info edit mode'
    );

    const currentNames = await myInfoPage.readCurrentNames();
    const updatedNames = alternateNameSet(currentNames);
    console.log(`Updating names from ${JSON.stringify(currentNames)} to ${JSON.stringify(updatedNames)}`);

    await myInfoPage.fillNames(updatedNames);
    await myInfoPage.saveChanges();
    await myInfoPage.verifySavedNames(updatedNames, editable);
});

test('Test-05: Verify Employee can update Date of Birth with age validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInfoPage(page);

    const email = process.env.EMPLOYEE_EMAIL?.trim();
    const password = process.env.EMPLOYEE_PASSWORD?.trim();

    test.skip(
        !email || !password,
        'Set EMPLOYEE_EMAIL and EMPLOYEE_PASSWORD in .env'
    );

    await loginPage.goto();
    await loginPage.login(email!, password!);

    await myInfoPage.openMyInfo();
    await myInfoPage.clickEdit();

    const dobEditable = await myInfoPage.isDateOfBirthEditable();
    console.log(`Date Of Birth editable: ${dobEditable}`);
    test.skip(!dobEditable, 'Date Of Birth is not editable in My Info Basic Info edit mode');

    await myInfoPage.fillDateOfBirth(INVALID_DOB_UNDERAGE);
    await myInfoPage.blurBasicInfoForm();
    await expect(myInfoPage.ageValidationMessage).toBeVisible({ timeout: 10000 });
    console.log('Age validation shown for underage DOB');

    const currentDob = await myInfoPage.readCurrentDateOfBirth();
    const validDob = alternateValidDob(currentDob);
    console.log(`Updating DOB from ${currentDob || 'unknown'} to ${validDob}`);

    await myInfoPage.fillDateOfBirth(validDob);
    await myInfoPage.blurBasicInfoForm();
    await expect(myInfoPage.ageValidationMessage).toBeHidden({ timeout: 10000 });

    await myInfoPage.saveChanges();
    await myInfoPage.verifySavedDateOfBirth(validDob);
});

test('Test-06: Verify Employee can update Blood Group', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInfoPage(page);

    const email = process.env.EMPLOYEE_EMAIL?.trim();
    const password = process.env.EMPLOYEE_PASSWORD?.trim();

    test.skip(
        !email || !password,
        'Set EMPLOYEE_EMAIL and EMPLOYEE_PASSWORD in .env'
    );

    await loginPage.goto();
    await loginPage.login(email!, password!);

    await myInfoPage.openMyInfo();
    await myInfoPage.clickEdit();

    const bloodGroupEditable = await myInfoPage.isBloodGroupEditable();
    console.log(`Blood Group editable: ${bloodGroupEditable}`);
    test.skip(!bloodGroupEditable, 'Blood Group is not editable in My Info Basic Info edit mode');

    const currentBloodGroup = await myInfoPage.readCurrentBloodGroup();
    const selectedBloodGroup = alternateBloodGroup(currentBloodGroup);
    console.log(`Updating blood group from ${currentBloodGroup || 'unknown'} to ${selectedBloodGroup}`);

    await myInfoPage.selectBloodGroup(selectedBloodGroup);
    await myInfoPage.saveChanges();
    await myInfoPage.verifySavedBloodGroup(selectedBloodGroup);
});

test('Test-07: Verify Employee can update Marital Status with Marriage Anniversary', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInfoPage(page);

    const email = process.env.EMPLOYEE_EMAIL?.trim();
    const password = process.env.EMPLOYEE_PASSWORD?.trim();

    test.skip(
        !email || !password,
        'Set EMPLOYEE_EMAIL and EMPLOYEE_PASSWORD in .env'
    );

    await loginPage.goto();
    await loginPage.login(email!, password!);

    await myInfoPage.openMyInfo();
    await myInfoPage.clickEdit();

    const maritalStatusEditable = await myInfoPage.isMaritalStatusEditable();
    console.log(`Marital Status editable: ${maritalStatusEditable}`);
    test.skip(!maritalStatusEditable, 'Marital Status is not editable in My Info Basic Info edit mode');

    console.log('Updating marital status to Single');
    await myInfoPage.updateToSingleAndSave();

    await myInfoPage.clickEdit();
    const anniversary = alternateMarriageAnniversary(
        (await myInfoPage.readMarriageAnniversary()) || MARRIAGE_ANNIVERSARY_A,
    );
    console.log(`Updating marital status to Married with anniversary ${anniversary}`);
    await myInfoPage.updateToMarriedAndSave(anniversary);
});

test('Test-08: Verify Contact Info breadcrumb and fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInfoPage(page);

    const email = process.env.EMPLOYEE_EMAIL?.trim();
    const password = process.env.EMPLOYEE_PASSWORD?.trim();

    test.skip(
        !email || !password,
        'Set EMPLOYEE_EMAIL and EMPLOYEE_PASSWORD in .env'
    );

    await loginPage.goto();
    await loginPage.login(email!, password!);

    await myInfoPage.openContactInfo();
    await myInfoPage.verifyContactInfoBreadcrumb();
    await myInfoPage.verifyContactInfoFieldsVisible();
});

test('Test-09: Verify Employee can update Contact Info fields except Work Mail', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const myInfoPage = new MyInfoPage(page);

    const email = process.env.EMPLOYEE_EMAIL?.trim();
    const password = process.env.EMPLOYEE_PASSWORD?.trim();

    test.skip(
        !email || !password,
        'Set EMPLOYEE_EMAIL and EMPLOYEE_PASSWORD in .env'
    );

    await loginPage.goto();
    await loginPage.login(email!, password!);

    await myInfoPage.openContactInfo();
    await myInfoPage.clickContactEdit();

    await myInfoPage.expectWorkMailNotEditable();

    const currentContact = await myInfoPage.readCurrentContactFields();
    const updatedContact = alternateContactSet(currentContact);
    console.log(`Updating contact info from ${JSON.stringify(currentContact)} to ${JSON.stringify(updatedContact)}`);

    await myInfoPage.fillContactFields(updatedContact);
    await myInfoPage.saveContactChanges();
    await myInfoPage.verifySavedContactFields(updatedContact);
});
