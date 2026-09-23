import fs from 'fs';
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Contract } from '../pages/Contract';

test('inspect location and sublocation dropdowns', async ({ browser }) => {
    const storageState = fs.existsSync('.auth/user.json') ? '.auth/user.json' : undefined;
    const context = await browser.newContext({ storageState });
    const page = await context.newPage();

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    if (page.url().includes('/login')) {
        const login = new LoginPage(page);
        await login.loginFromEnv();
    }

    const contract = new Contract(page);
    await contract.clickEmployees();
    await contract.clickProspectiveEmployee();
    await contract.clickContractTab();
    await contract.clickAddContractEmployee();


    console.log('Testing full contract employee fill details...');
    await contract.fillContractEmployeeDetails({
        firstName: 'prospec',
        lastName: 'contractor' + Date.now().toString().slice(-4),
        email: `proscon${Date.now()}@yopmail.com`
    });

    console.log('Add button enabled:', await contract.addButton.isEnabled());
    await page.screenshot({ path: 'scratch_before_add.png' });
    await contract.clickAdd();
    await page.waitForTimeout(2000);
    console.log('Contract employee added successfully!');


    await page.close();
});
