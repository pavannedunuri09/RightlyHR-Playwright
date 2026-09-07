import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MyInfoPage } from '../pages/MyInfoPage';

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

    // Open Basic Info tab
    // await myInfoPage.openBasicInfo();
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
    await page.waitForURL(/\/dashboard\/emp/, { timeout: 45000, waitUntil: 'commit' });

    // Navigate to My Info
    await myInfoPage.openMyInfo();

    // Click Edit
    await myInfoPage.clickEdit();

    // Select a value different from the current one so this test proves an update.
    const selectedSalutation = 'Mr.';
    await myInfoPage.selectSalutation(selectedSalutation);

    // Save changes
    await myInfoPage.saveChanges();

    // Verify success message
    await expect(myInfoPage.successMessage).toBeVisible();

    // Verify updated Salutation
    await expect(myInfoPage.salutationValue).toContainText(selectedSalutation);

});



    


