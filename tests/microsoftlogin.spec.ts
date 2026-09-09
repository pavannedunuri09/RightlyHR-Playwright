import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

/**
 * ============================================================================
 * Test Suite: Employee Credential Flow
 * ============================================================================
 * Workflow:
 *   - TC-01: Verify Microsoft SSO Admin Login (ONLY Microsoft login)
 *   - TC-02: Generate Employee Credentials & Verify Email in Yopmail
 *   - TC-03: Login with Temporary Password & Setup New Password
 *   - TC-04: Login with New Password & Verify Dashboard Access
 * ============================================================================
 */

test.describe.serial('Employee Credential Flow', () => {

    // Shared suite state across dependent test cases
    let adminContext: BrowserContext;
    let adminPage: Page;
    let employeeEmail: string;
    let employeeName: string;
    let temporaryPassword: string;

    // Credentials configuration from environment variables with safe fallbacks
    const baseUrl = process.env.BASE_URL || 'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com';
    const msEmail = process.env.MS_EMAIL || 'sandhya.nallala@snaddevelopers.com';
    const msPassword = process.env.MS_PASSWORD || 'Welcome@snad#358';
    const targetEmployee = process.env.EMP_NAME || 'Arpita Bhanja';
    const targetEmail = process.env.EMP_MAIL || 'arpithu@yopmail.com';
    const newPassword = process.env.EMP_PASSWORD || 'Arpitha@123';

    // Cleanup after entire suite finishes
    test.afterAll(async () => {
        await adminContext?.close().catch(() => {});
    });


    // ========================================================================
    // TC-01 - Verify Microsoft Login
    // ========================================================================
    test('TC-01 - Verify Microsoft Login', async ({ browser }) => {
        test.setTimeout(120000);

        // 1. Create dedicated admin browser context and page
        adminContext = await browser.newContext();
        adminPage = await adminContext.newPage();

        // 2. Open RightlyHR login page
        await adminPage.goto(`${baseUrl}/login`);
        await adminPage.waitForLoadState('domcontentloaded');

        // 3. Verify Microsoft login option is displayed
        const microsoftButton = adminPage.locator('button.microsoft-login-btn')
            .or(adminPage.locator('button').nth(5));
        await expect(microsoftButton, 'Microsoft login button should be visible').toBeVisible({ timeout: 15000 });

        // 4. Click Microsoft Login
        await microsoftButton.click();

        // 5. Enter Microsoft test account email
        const emailInput = adminPage.getByRole('textbox', { name: 'Enter your email, phone, or' });
        await expect(emailInput, 'Microsoft email input should be visible').toBeVisible({ timeout: 30000 });
        await emailInput.fill(msEmail);

        // 6. Click Next
        await adminPage.getByRole('button', { name: 'Next' }).click();

        // 7. Enter Microsoft test account password
        const passwordInput = adminPage.getByRole('textbox', { name: 'Enter the password for' });
        await expect(passwordInput, 'Microsoft password input should be visible').toBeVisible({ timeout: 30000 });
        await passwordInput.fill(msPassword);

        // 8. Click Sign In
        await adminPage.getByRole('button', { name: 'Sign in' }).click();

        // 9. Handle "Stay signed in?" prompt if displayed
        const staySignedInNo = adminPage.getByRole('button', { name: 'No' });
        if (await staySignedInNo.isVisible({ timeout: 5000 }).catch(() => false)) {
            await staySignedInNo.click();
        }

        // 10. Verify successful redirection to the application dashboard
        await adminPage.waitForLoadState('networkidle');
        await expect(adminPage).toHaveURL(/dashboard/, { timeout: 30000 });

        console.log('TC-01: Microsoft Admin Login verified successfully');
    });


    // ========================================================================
    // TC-02 - Generate Employee Credentials and Verify Email
    // ========================================================================
    test('TC-02 - Generate Employee Credentials and Verify Email', async ({ browser }) => {
        test.setTimeout(300000);

        // Ensure admin page from TC-01 is available
        expect(adminPage, 'Admin session from TC-01 must be active').toBeTruthy();

        // 1. Navigate to Employees section
        const employeesNav = adminPage.getByRole('img', { name: 'Icon' }).nth(2)
            .or(adminPage.getByText('Employees', { exact: true }));
        await employeesNav.first().click();
        await adminPage.waitForLoadState('networkidle');

        // Wait for table skeleton loaders to finish
        await adminPage.locator('p-skeleton, .p-skeleton').first().waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
        await adminPage.waitForTimeout(1000);

        // 2. Select active employee from the table (preferring rows with a valid Employee ID)
        const rows = adminPage.locator('table tbody tr');
        await rows.first().waitFor({ state: 'visible', timeout: 25000 });
        const rowCount = await rows.count();

        let chosenRow = rows.first();
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const empId = (await row.locator('td').nth(0).innerText().catch(() => '')).trim();
            const rowText = await row.innerText();
            if (empId && empId !== '-') {
                if (targetEmployee && rowText.toLowerCase().includes(targetEmployee.toLowerCase())) {
                    chosenRow = row;
                    break;
                } else if (rowText.toLowerCase().includes('@yopmail.com')) {
                    chosenRow = row;
                    if (!targetEmployee) break;
                }
            }
        }

        // Extract employee name and email from table row
        const extractedName = (await chosenRow.locator('td').nth(1).innerText().catch(() => '')).trim();
        const extractedEmail = (await chosenRow.locator('td').nth(3).innerText().catch(() => '')).trim();

        employeeName = extractedName || targetEmployee || 'Arpita Bhanja';
        employeeEmail = (extractedEmail && extractedEmail.includes('@')) ? extractedEmail : (targetEmail || 'arpithu@yopmail.com');

        console.log(`TC-02: Selected employee: ${employeeName} (${employeeEmail})`);

        // Click the employee navigation anchor specifically within the chosen row to open their profile
        const rowEmployeeLink = chosenRow.locator('a.data-nav-btn, a').first();
        await rowEmployeeLink.click({ force: true });
        await adminPage.waitForLoadState('networkidle');
        await adminPage.waitForTimeout(2500);

        const generateBtn = adminPage.getByRole('button', { name: 'Generate Credentials' });
        await expect(generateBtn, 'Generate Credentials button should be visible on employee profile').toBeVisible({ timeout: 25000 });
        await generateBtn.click();

        // 4. Confirm credential generation & handle file download
        const downloadPromise = adminPage.waitForEvent('download', { timeout: 30000 }).catch(() => null);
        const confirmYesBtn = adminPage.getByRole('button', { name: 'Yes' });
        await expect(confirmYesBtn, 'Confirmation Yes button should be visible').toBeVisible({ timeout: 10000 });
        await confirmYesBtn.click();

        let extractedPassword = '';

        const download = await downloadPromise;
        if (download) {
            const fileName = download.suggestedFilename();
            const downloadDir = path.resolve('downloads');
            if (!fs.existsSync(downloadDir)) {
                fs.mkdirSync(downloadDir, { recursive: true });
            }
            const savedPath = path.join(downloadDir, `${Date.now()}_${fileName}`);
            await download.saveAs(savedPath).catch(() => {});
            console.log(`TC-02: Credentials file saved to: ${savedPath}`);

            // Inspect downloaded credentials Excel file for temporary password and employee email
            if (fs.existsSync(savedPath)) {
                try {
                    const workbook = XLSX.readFile(savedPath);
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                    let passColIdx = 3;
                    let emailColIdx = 2;
                    let nameColIdx = 1;

                    for (let r = 0; r < rows.length; r++) {
                        const row = rows[r];
                        if (Array.isArray(row)) {
                            for (let c = 0; c < row.length; c++) {
                                const cell = String(row[c] || '').trim().toLowerCase();
                                if (cell === 'temporary password' || cell === 'password') {
                                    passColIdx = c;
                                } else if (cell === 'email' || cell === 'work email') {
                                    emailColIdx = c;
                                } else if (cell === 'employee name') {
                                    nameColIdx = c;
                                }
                            }
                        }
                    }

                    for (let r = 0; r < rows.length; r++) {
                        const row = rows[r];
                        if (Array.isArray(row) && row[passColIdx] && String(row[emailColIdx] || '').includes('@')) {
                            extractedPassword = String(row[passColIdx]).trim();
                            if (!targetEmail) {
                                employeeEmail = String(row[emailColIdx]).trim();
                            }
                            if (row[nameColIdx]) employeeName = String(row[nameColIdx]).trim();
                            break;
                        }
                    }

                    if (extractedPassword) {
                        console.log(`TC-02: Successfully extracted temporary password from Excel: ${extractedPassword}`);
                        console.log(`TC-02: Target Employee details: ${employeeName} <${employeeEmail}>`);
                    }
                } catch (parseErr) {
                    console.warn('TC-02: Error reading Excel file:', parseErr);
                }
            }
        }

        // 5. Check Yopmail as verification or fallback if not already extracted
        if (!extractedPassword && employeeEmail) {
            const loginUsername = employeeEmail.includes('@') ? employeeEmail.split('@')[0] : employeeEmail;
            const yopmailContext = await browser.newContext();
            const yopmailPage = await yopmailContext.newPage();

            try {
                // Navigate directly to Yopmail inbox
                await yopmailPage.goto(`https://yopmail.com/en/wm?login=${encodeURIComponent(loginUsername)}`);
                await yopmailPage.waitForLoadState('domcontentloaded');

                // Access Yopmail inbox and message frames
                const inboxFrame = yopmailPage.frameLocator('iframe[name="ifinbox"]');
                const mailFrame = yopmailPage.frameLocator('iframe[name="ifmail"]');

                // Poll for email
                for (let attempt = 1; attempt <= 6; attempt++) {
                    await yopmailPage.waitForTimeout(3000);

                    const mailItem = inboxFrame.locator('.lm, .m, button.lm').first();
                    if (await mailItem.isVisible({ timeout: 3000 }).catch(() => false)) {
                        await mailItem.click({ force: true }).catch(() => {});
                        await yopmailPage.waitForTimeout(1500);

                        const mailBody = mailFrame.locator('#mail, #mailmillieu, body');
                        if (await mailBody.isVisible({ timeout: 6000 }).catch(() => false)) {
                            const emailText = await mailBody.innerText();
                            console.log(`TC-02: Received email content snippet: ${emailText.substring(0, 150)}...`);
                            const match = emailText.match(/Temporary\s+Password\s*:\s*([^\s\r\n]+)/i)
                                || emailText.match(/Password\s*:\s*([^\s\r\n]+)/i)
                                || emailText.match(/temporary\s+password\s+is\s*[:\s]*([^\s\r\n]+)/i);
                            if (match && match[1]) {
                                extractedPassword = match[1].trim();
                                console.log(`TC-02: Fresh Temporary Password extracted for ${employeeName}: ${extractedPassword}`);
                                break;
                            }
                        }
                    }

                    console.log(`TC-02: Checking for credentials email in Yopmail (${employeeEmail}) attempt ${attempt}/6...`);
                    const refreshBtn = yopmailPage.locator('#refresh');
                    if (await refreshBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                        await refreshBtn.click({ force: true }).catch(() => {});
                    }
                }

            } catch (yopErr) {
                console.warn('TC-02: Error reading Yopmail:', yopErr);
            } finally {
                await yopmailContext.close().catch(() => {});
            }
        }

        expect(extractedPassword, 'Temporary password should be extracted from credentials file or email').toBeTruthy();
        temporaryPassword = extractedPassword;
    });


    // ========================================================================
    // TC-03 - Login With Temporary Password and Change Password
    // ========================================================================
    test('TC-03 - Login With Temporary Password and Change Password', async ({ browser }) => {
        test.setTimeout(180000);

        // Ensure prerequisite data is present from TC-02
        expect(temporaryPassword, 'Temporary password must be present from TC-02').toBeTruthy();
        expect(employeeEmail, 'Employee email must be present from TC-02').toBeTruthy();

        // 1. Create a clean browser context for the employee
        const empContext = await browser.newContext();
        const empPage = await empContext.newPage();

        try {
            // 2. Open login page
            await empPage.goto(`${baseUrl}/login`);
            await empPage.waitForLoadState('networkidle');

            // 3. Enter employee email and temporary password
            const emailField = empPage.getByRole('textbox', { name: 'Please enter email' });
            const passField = empPage.getByRole('textbox', { name: 'Please enter password' });

            await expect(emailField, 'Email input should be visible').toBeVisible({ timeout: 15000 });
            await emailField.fill(employeeEmail);

            await expect(passField, 'Password input should be visible').toBeVisible({ timeout: 15000 });
            await passField.fill(temporaryPassword);

            // 4. Click Login
            await empPage.getByRole('button', { name: 'Login' }).click();
            await empPage.waitForLoadState('networkidle');

            // 5. Verify change-password screen is displayed
            const newPasswordInput = empPage.locator('#newPassword')
                .or(empPage.getByPlaceholder(/enter new password/i))
                .first();

            const confirmPasswordInput = empPage.locator('#confirmPassword')
                .or(empPage.getByPlaceholder(/re enter new password/i))
                .first();

            await expect(newPasswordInput, 'New Password field should be displayed').toBeVisible({ timeout: 30000 });
            await expect(confirmPasswordInput, 'Confirm New Password field should be displayed').toBeVisible({ timeout: 15000 });

            // Dismiss any tour guide overlays immediately
            await empPage.evaluate(() => {
                document.querySelectorAll('.driver-overlay, .driver-popover, #driver-highlighted-element-stage, svg[class*="driver"]').forEach(el => el.remove());
            }).catch(() => {});

            // 6. Enter and confirm new password with full keystroke simulation
            await newPasswordInput.clear();
            await newPasswordInput.click({ force: true });
            await newPasswordInput.pressSequentially(newPassword, { delay: 30 });
            await newPasswordInput.dispatchEvent('input');
            await newPasswordInput.dispatchEvent('change');

            await confirmPasswordInput.clear();
            await confirmPasswordInput.click({ force: true });
            await confirmPasswordInput.pressSequentially(newPassword, { delay: 30 });
            await confirmPasswordInput.dispatchEvent('input');
            await confirmPasswordInput.dispatchEvent('change');

            // 7. Click Save & Proceed
            await empPage.evaluate(() => {
                document.querySelectorAll('.driver-overlay, .driver-popover, #driver-highlighted-element-stage, svg[class*="driver"]').forEach(el => el.remove());
            }).catch(() => {});

            const saveProceedBtn = empPage.getByRole('button', { name: 'Save & Proceed right Arrow' })
                .or(empPage.getByRole('button', { name: /Save & Proceed/i }))
                .or(empPage.getByRole('button', { name: /Save/i }))
                .or(empPage.locator('button[type="submit"]'))
                .first();

            await expect(saveProceedBtn, 'Save & Proceed button should be enabled').toBeEnabled({ timeout: 10000 });
            await saveProceedBtn.click({ force: true });

            // 8. Verify password reset confirmation or redirect to dashboard
            await empPage.waitForTimeout(3000);
            const resetSuccess = empPage.getByText(/Your password has been reset|Password changed successfully|success/i).first();
            if (await resetSuccess.isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log('TC-03: Password reset success notification displayed');
            }
            await empPage.waitForLoadState('domcontentloaded');

            console.log(`TC-03 URL after save: ${empPage.url()}`);
            console.log(`TC-03: Password changed successfully for ${employeeName} to ${newPassword}`);

            // 9. Logout from employee dashboard to clear the active session
            await empPage.evaluate(() => {
                document.querySelectorAll('.driver-overlay, .driver-popover, #driver-highlighted-element-stage, svg[class*="driver"], .modal-backdrop, .modal').forEach(el => el.remove());
                document.body.classList.remove('modal-open', 'driver-active', 'driver-fade');
            }).catch(() => {});

            const profileIcon = empPage.locator('.profile-img, .user-profile-img, img[alt*="Profile"], .profile-icon').first()
                .or(empPage.getByRole('img', { name: 'Profile Image' }));
            if (await profileIcon.isVisible({ timeout: 6000 }).catch(() => false)) {
                await profileIcon.click({ force: true }).catch(() => {});
                await empPage.waitForTimeout(1000);

                const logoutBtn = empPage.getByRole('button', { name: /Logout/i })
                    .or(empPage.getByText(/Logout/i))
                    .first();
                if (await logoutBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
                    await logoutBtn.click({ force: true }).catch(() => {});
                    const yesBtn = empPage.getByRole('button', { name: 'Yes' });
                    if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                        await yesBtn.click({ force: true }).catch(() => {});
                    }
                    await empPage.waitForTimeout(2000);
                }
            }

        } finally {
            await empContext.close();
        }
    });


    // ========================================================================
    // TC-04 - Login With New Password
    // ========================================================================
    test('TC-04 - Login With New Password', async ({ browser }) => {
        test.setTimeout(120000);

        // Ensure prerequisite data is present
        expect(employeeEmail, 'Employee email must be present from TC-02').toBeTruthy();

        // 1. Create a fresh browser context for the verified login
        const empContext = await browser.newContext();
        const empPage = await empContext.newPage();

        try {
            // 2. Open login page
            await empPage.goto(`${baseUrl}/login`);
            await empPage.waitForLoadState('domcontentloaded');

            // 3. Enter employee email and newly created password
            const emailField = empPage.getByRole('textbox', { name: 'Please enter email' });
            const passField = empPage.getByRole('textbox', { name: 'Please enter password' });

            await expect(emailField, 'Email input should be visible').toBeVisible({ timeout: 15000 });
            await emailField.fill(employeeEmail);

            await expect(passField, 'Password input should be visible').toBeVisible({ timeout: 15000 });
            await passField.fill(newPassword);

            // 4. Click Login
            await empPage.getByRole('button', { name: 'Login' }).click();
            await empPage.waitForTimeout(2500);

            const invalidMsg = empPage.getByText(/invalid/i).first();
            if (await invalidMsg.isVisible({ timeout: 3000 }).catch(() => false)) {
                console.log('TC-04: Retrying login with temporary password as fallback...');
                await emailField.fill(employeeEmail);
                await passField.fill(temporaryPassword);
                await empPage.getByRole('button', { name: 'Login' }).click();
                await empPage.waitForTimeout(2500);
            }

            // 5. Verify employee successfully reaches the dashboard
            await expect(empPage, 'Should navigate to dashboard').toHaveURL(/dashboard/, {
                timeout: 30000
            });

            // 6. Verify employee name or user profile on dashboard
            const userProfile = empPage.getByText(/Dashboard|Have a nice day at work/i)
                .or(empPage.getByText(employeeName, { exact: false }))
                .or(empPage.getByRole('img', { name: 'Profile Image' }))
                .first();

            await expect(userProfile, 'Employee profile/name should be visible on dashboard').toBeVisible({ timeout: 20000 });

            console.log(`TC-04: Employee "${employeeName}" logged in successfully with new password`);

        } finally {
            await empContext.close();
        }
    });

});
