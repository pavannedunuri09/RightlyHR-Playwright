import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe.serial('Settings Suite', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
    });

    test.afterAll(async () => {
        await page?.close();
    });

    test('TC01 - Login to application using .env credentials', async () => {
        const email = (
            process.env.LOGIN_EMAIL ||
            process.env.LOGIN_USERNAME ||
            process.env.EMPLOYEE_EMAIL ||
            process.env.EMPLOYEE_USERNAME
        )?.trim();
        const password = (
            process.env.LOGIN_PASSWORD ||
            process.env.EMPLOYEE_PASSWORD
        )?.trim();

        test.skip(
            !email || !password,
            'Credentials missing: Set LOGIN_EMAIL (or LOGIN_USERNAME) and LOGIN_PASSWORD in .env'
        );

        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(email!, password!);

        // Verify navigation to the employee dashboard
        await expect(page).toHaveURL(/\/dashboard\/emp/, { timeout: 45000 });
        await expect(page.getByText('Have a nice day at work!')).toBeVisible({ timeout: 15000 });
    });

    test('TC02 - Click on Settings module and verify salutation CRUD operations', async () => {
        await page.locator('rect').first().click();
        await page.getByRole('button', { name: 'Icon Employee Fields Define' }).click();
        await page.getByText('PersonalThis section allows').click();
        await page.getByRole('link', { name: 'Salutation' }).click();
        // await page.getByRole('textbox', { name: 'saluation' }).fill('Test');
        // await page.getByRole('button', { name: 'Add' }).click();
        // await page.locator('tr:nth-child(11) > .w-25 > .dropdown > .cursor-pointer').click();
        // await page.locator('.dropdown-menu.custom-dropdown-menu.show > li > .dropdown-item').first().click();
        // await page.getByRole('textbox', { name: 'Please enter salutation' }).fill('Test.');
        // await page.getByRole('button', { name: 'Update' }).click();
        // await page.locator('tr:nth-child(11) > .w-25 > .dropdown > .cursor-pointer').click();
        // await page.locator('.dropdown-menu.custom-dropdown-menu.show > li:nth-child(2) > .dropdown-item').click();
        // await page.getByRole('button', { name: 'Yes' }).click();
        // await page.locator('div').filter({ hasText: 'Salutation deleted' }).nth(3).click();
        // await page.getByRole('textbox', { name: 'saluation' }).fill('Mr.');
        // await page.getByRole('button', { name: 'Add' }).click();
        // await page.getByText('Salutation already exists.').click();
    });
    // test('TC03 - Verify Employee Fields-Status CRUD Operations', async () => {
    //     await page.getByRole('link', { name: 'Status', exact: true }).click();
    //     await page.getByRole('textbox', { name: 'stat' }).fill('Test');
    //     await page.getByRole('button', { name: 'Add' }).click();
    //     await page.getByText('Status added successfully').click();
    //     await page.locator('tr:nth-child(10) > .w-25 > .dropdown > .cursor-pointer').click();
    //     await page.locator('.dropdown-menu.custom-dropdown-menu.show > li > .dropdown-item').first().click();
    //     await page.getByRole('textbox', { name: 'Please enter status' }).fill('TestR');
    //     await page.getByRole('button', { name: 'Update' }).click();
    //     await page.locator('div').filter({ hasText: 'Status updated successfully' }).nth(2).click();
    //     await page.locator('tr:nth-child(10) > .w-25 > .dropdown > .cursor-pointer').click();
    //     await page.locator('.dropdown-menu.custom-dropdown-menu.show > li:nth-child(2) > .dropdown-item').click();
    //     await page.getByRole('button', { name: 'No' }).click();
    //     await page.locator('tr:nth-child(10) > .w-25 > .dropdown').click();
    //     await page.locator('tr:nth-child(10) > .w-25 > .dropdown > .cursor-pointer').click();
    //     await page.locator('.dropdown-menu.custom-dropdown-menu.show > li:nth-child(2) > .dropdown-item').click();
    //     await page.getByRole('button', { name: 'Yes' }).click();
    //     await page.getByText('Status deleted successfully').click();
    //     await page.getByRole('textbox', { name: 'stat' }).fill('Active');
    //     await page.getByRole('button', { name: 'Add' }).click();
    //     await page.getByText('Status already exists').click();
    //     await page.locator('.cursor-pointer').first().click();
    //     await page.getByText('Update').first().click();
    //     await page.getByRole('textbox', { name: 'Please enter status' }).fill('');
    //     await page.getByRole('textbox', { name: 'Please enter status' }).fill('Active');
    //     await page.getByRole('button', { name: 'Update' }).click();
    //     await page.getByText('Status already exists.').click();
    // });
    test('TC04 - Verify Employee Fields-Gender CRUD Operations', async () => {
        const addedGender = 'Test';
        const updatedGender = 'TestR';

        await page.getByRole('link', { name: 'Gender', exact: true }).click();

        // 1. Add new Gender record
        await page.getByRole('textbox', { name: 'gen' }).fill(addedGender);
        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page.getByText('Gender added successfully')).toBeVisible();

        // 2. Dynamically locate the row containing the added value and update it
        const rowToUpdate = page.locator('tr').filter({ hasText: addedGender }).first();
        await rowToUpdate.locator('.dropdown .cursor-pointer, .cursor-pointer').click();
        await page.locator('.dropdown-menu.show .dropdown-item, .dropdown-menu.show > li > .dropdown-item').filter({ hasText: /Update/i }).first().click();

        await page.getByRole('textbox', { name: /Please enter status|Please enter gender/i }).fill(updatedGender);
        await page.getByRole('button', { name: 'Update' }).click();
        await expect(page.getByText('Gender updated successfully')).toBeVisible();

        // 3. Dynamically locate the updated row and test Cancel Delete ("No")
        const rowToDelete = page.locator('tr').filter({ hasText: updatedGender }).first();
        await rowToDelete.locator('.dropdown .cursor-pointer, .cursor-pointer').click();
        await page.locator('.dropdown-menu.show .dropdown-item, .dropdown-menu.show > li > .dropdown-item').filter({ hasText: /Delete/i }).first().click();
        await page.getByRole('button', { name: 'No' }).click();

        // 4. Confirm Delete ("Yes")
        await rowToDelete.locator('.dropdown .cursor-pointer, .cursor-pointer').click();
        await page.locator('.dropdown-menu.show .dropdown-item, .dropdown-menu.show > li > .dropdown-item').filter({ hasText: /Delete/i }).first().click();
        await page.getByRole('button', { name: 'Yes' }).click();
        await expect(page.getByText('Gender deleted successfully')).toBeVisible();

        // 5. Verify duplicate validation on Add
        await page.getByRole('textbox', { name: 'gen' }).or(page.getByRole('textbox', { name: 'stat' })).fill('Active');
        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page.getByText(/Gender already exists/i)).toBeVisible();

        // 6. Verify duplicate validation on Update
        const existingRow = page.locator('tr').filter({ hasText: /Male|Female|Active/i }).first();
        await existingRow.locator('.dropdown .cursor-pointer, .cursor-pointer').click();
        await page.locator('.dropdown-menu.show .dropdown-item, .dropdown-menu.show > li > .dropdown-item').filter({ hasText: /Update/i }).first().click();
        await page.getByRole('textbox', { name: /Please enter status|Please enter gender/i }).fill('');
        await page.getByRole('textbox', { name: /Please enter status|Please enter gender/i }).fill('Active');
        await page.getByRole('button', { name: 'Update' }).click();
        await expect(page.getByText(/Gender already exists/i)).toBeVisible();
    });
})



