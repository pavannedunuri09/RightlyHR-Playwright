import { test, expect, type Page } from '@playwright/test';
import { MicrosoftLoginPage } from '../pages/microsoftlogin';

test.describe('Employee Credential Flow', () => {

    let page: Page;
    let temporaryPassword: string;

    test.beforeAll(async ({ browser }) => {

        page = await browser.newPage();

        // Open RightlyHR login page
        await page.goto(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        // Click Microsoft Login
        await page.locator('button').nth(5).click();

        // Enter Microsoft email
        await page.getByRole('textbox', {
            name: 'Enter your email, phone, or'
        }).fill(process.env.MS_EMAIL!);

        // Click Next
        await page.getByRole('button', {
            name: 'Next'
        }).click();

        // Enter Microsoft password
        await page.getByRole('textbox', {
            name: 'Enter the password for'
        }).fill(process.env.MS_PASSWORD!);

        // Click Sign in
        await page.getByRole('button', {
            name: 'Sign in'
        }).click();

        // Handle "Stay signed in?" popup
        if (
            await page
                .getByRole('button', { name: 'No' })
                .isVisible({ timeout: 5000 })
                .catch(() => false)
        ) {
            await page
                .getByRole('button', { name: 'No' })
                .click();
        }

        // Wait for application to load
        await page.waitForLoadState('networkidle');

        console.log('Microsoft login completed');
    });

    test.afterAll(async () => {
        await page?.close();
    });


    // =========================================================
    // TC-01 - Generate credentials and verify credential email
    // =========================================================

    test('TC-01 - Generate credentials and verify credential email', async () => {

        test.setTimeout(300000);

        // Navigate to Employees
        await page.getByText('Employees').click();

        await page.getByText('Pankaj Singh').click();

        await page.locator('.myinfo-main-content').click();

        // Generate Credentials
        await page.getByRole('button', {
            name: 'Generate Credentials'
        }).click();

        const downloadPromise = page.waitForEvent('download');

        await page.getByRole('button', {
            name: 'Yes'
        }).click();

        const download = await downloadPromise;

        console.log(
            `Credentials Excel downloaded: ${download.suggestedFilename()}`
        );


        // =====================================================
        // Open Yopmail in a separate browser context
        // =====================================================

        const yopmailContext =
            await page.context().browser()!.newContext();

        const yopmailPage =
            await yopmailContext.newPage();

        await yopmailPage.goto('https://yopmail.com/');

        // Enter employee email
        await yopmailPage.getByRole('textbox', {
            name: 'Login'
        }).fill(process.env.EMP_MAIL!);

        // Open inbox
        await yopmailPage.getByTitle(
            'Check Inbox @yopmail.com'
        ).click();


        // =====================================================
        // Open Inbox
        // =====================================================

        const inboxFrame =
            yopmailPage
                .locator('iframe[name="ifinbox"]')
                .contentFrame();

        await expect(
            inboxFrame.getByRole('button').first()
        ).toBeVisible({
            timeout: 60000
        });

        await inboxFrame
            .getByRole('button')
            .first()
            .click();


        // =====================================================
        // Read Email (handle CAPTCHA if shown)
        // =====================================================

        const mailFrame =
            yopmailPage
                .locator('iframe[name="ifmail"]')
                .contentFrame();

        const captcha = mailFrame.getByText(
            'Complete the CAPTCHA to continue',
            { exact: false }
        );

        if (await captcha.isVisible({ timeout: 3000 }).catch(() => false)) {
            console.log('Please complete CAPTCHA manually in Yopmail, then click Resume in the Playwright Inspector');

            // Pause execution — opens Playwright Inspector
            // Solve the CAPTCHA, then click "Resume" to continue
            await yopmailPage.pause();

            // After CAPTCHA is solved, re-click the email to reload content
            await inboxFrame
                .getByRole('button')
                .first()
                .click();
        }

        await expect(
            mailFrame.getByText(
                'Temporary Password',
                { exact: false }
            )
        ).toBeVisible({
            timeout: 180000
        });

        const emailBody =
            await mailFrame
                .locator('body')
                .innerText();

        console.log('Credential email received successfully');

        // Verify employee email
        expect(emailBody).toContain(
            `Username (Email ID): ${process.env.EMP_MAIL}`
        );


        // =====================================================
        // Extract Temporary Password
        // =====================================================

        const passwordMatch =
            emailBody.match(
                /Temporary\s+Password\s*:\s*(\S+)/i
            );

        expect(passwordMatch).toBeTruthy();

        temporaryPassword = passwordMatch![1];

        console.log(
            'Temporary password extracted successfully'
        );

        // Close Yopmail context
        await yopmailContext.close();
    });


    // =========================================================
    // TC-02 - Login with temporary password and set new password
    // =========================================================

    test('TC-02 - Login with temporary password and set new password', async () => {

        test.setTimeout(300000);

        expect(temporaryPassword).toBeTruthy();

        // Create a fresh browser context (no admin session cookies)
        const empContext =
            await page.context().browser()!.newContext();
        const empPage = await empContext.newPage();
        const employeeLogin = new MicrosoftLoginPage(empPage);

        // Navigate to login page
        await empPage.goto(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        await empPage.waitForLoadState('networkidle');

        // Enter employee email
        await employeeLogin.enterEmployeeEmail(
            process.env.EMP_MAIL!
        );

        // Enter temporary password
        await employeeLogin.enterEmployeePassword(
            temporaryPassword
        );

        // Click Login
        await employeeLogin.clickEmployeeLogin();

        // Wait for page to load after login
        await empPage.waitForLoadState('networkidle');

        // Wait for the New Password form to appear
        await expect(
            empPage.getByRole('textbox', {
                name: /new password/i
            }).first()
        ).toBeVisible({
            timeout: 30000
        });

        // Enter new password
        await employeeLogin.enterNewPassword(
            process.env.EMP_PASSWORD!
        );

        // Enter confirm new password
        await employeeLogin.enterConfirmNewPassword(
            process.env.EMP_PASSWORD!
        );

        // Click Save & Proceed
        await employeeLogin.clickSaveProceed();

        // Wait for navigation after password change
        await empPage.waitForLoadState('networkidle');

        // Verify redirected to dashboard
        await expect(empPage).toHaveURL(/dashboard/, {
            timeout: 30000
        });

        console.log('New password set successfully');

        await empContext.close();
    });


    // =========================================================
    // TC-03 - Login with new password and logout
    // =========================================================

    test('TC-03 - Login with new password and logout', async () => {

        test.setTimeout(120000);

        // Create a fresh browser context (no admin session cookies)
        const empContext =
            await page.context().browser()!.newContext();
        const empPage = await empContext.newPage();
        const employeeLogin = new MicrosoftLoginPage(empPage);

        // Navigate to login page
        await empPage.goto(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        await empPage.waitForLoadState('networkidle');

        // Enter employee email
        await employeeLogin.enterEmployeeEmail(
            process.env.EMP_MAIL!
        );

        // Enter new password
        await employeeLogin.enterEmployeePassword(
            process.env.EMP_PASSWORD!
        );

        // Click Login
        await employeeLogin.clickEmployeeLogin();

        // Wait for dashboard to load
        await empPage.waitForLoadState('networkidle');

        await expect(empPage).toHaveURL(/dashboard/, {
            timeout: 30000
        });

        console.log('Employee logged in with new password');

        // Logout
        await employeeLogin.clickProfile();

        await employeeLogin.clickLogout();

        // Verify redirected to login page
        await expect(empPage).toHaveURL(/login/, {
            timeout: 30000
        });

        console.log('Employee logged out successfully');

        await empContext.close();
    });

});

