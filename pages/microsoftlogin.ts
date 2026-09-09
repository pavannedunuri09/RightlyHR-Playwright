import { type Locator, type Page, expect } from '@playwright/test';

export class MicrosoftLoginPage {

    readonly page: Page;

    // Microsoft Login
    readonly microsoftLoginButton: Locator;
    readonly emailInput: Locator;
    readonly nextButton: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly noButton: Locator;

    // Navigation & Employee
    readonly employeesMenu: Locator;
    readonly employeeSearchInput: Locator;
    readonly generateCredentialsButton: Locator;
    readonly yesButton: Locator;

    // Employee Login
    readonly employeeEmailInput: Locator;
    readonly employeePasswordInput: Locator;
    readonly employeeLoginButton: Locator;

    // New Password
    readonly newPasswordInput: Locator;
    readonly confirmNewPasswordInput: Locator;
    readonly saveProceedButton: Locator;

    // Logout
    readonly profileImage: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Microsoft Login
        this.microsoftLoginButton = page.locator('button.microsoft-login-btn')
            .or(page.locator('button').nth(5));

        this.emailInput = page.getByRole('textbox', {
            name: 'Enter your email, phone, or'
        });

        this.nextButton = page.getByRole('button', {
            name: 'Next'
        });

        this.passwordInput = page.getByRole('textbox', {
            name: 'Enter the password for'
        });

        this.signInButton = page.getByRole('button', {
            name: 'Sign in'
        });

        this.noButton = page.getByRole('button', {
            name: 'No'
        });

        // Navigation & Employee
        this.employeesMenu = page.getByText('Employees', { exact: true })
            .or(page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Employees' }))
            .first();

        this.employeeSearchInput = page.getByRole('searchbox', { name: 'Username' })
            .or(page.getByPlaceholder(/search/i))
            .or(page.locator('input[type="search"]'))
            .first();

        this.generateCredentialsButton = page.getByRole('button', {
            name: 'Generate Credentials'
        });

        this.yesButton = page.getByRole('button', {
            name: 'Yes'
        });

        // Employee Login
        this.employeeEmailInput = page.getByRole('textbox', {
            name: 'Please enter email'
        });

        this.employeePasswordInput = page.getByRole('textbox', {
            name: 'Please enter password'
        });

        this.employeeLoginButton = page.getByRole('button', {
            name: 'Login'
        });

        // New Password
        this.newPasswordInput = page.getByRole('textbox', {
            name: /new password \*/i
        }).or(page.locator('input[placeholder*="New Password"], input[name*="newPassword"], input[type="password"]').first());

        this.confirmNewPasswordInput = page.getByRole('textbox', {
            name: /confirm new password \*/i
        }).or(page.locator('input[placeholder*="Confirm"], input[name*="confirmPassword"]').first());

        this.saveProceedButton = page.getByRole('button', {
            name: /Save & Proceed/i
        }).or(page.getByRole('button', { name: /Save/i }));

        // Logout
        this.profileImage = page.getByRole('img', {
            name: 'Profile Image'
        }).or(page.locator('.profile-img, .user-profile-img, img[alt*="Profile"]').first());

        this.logoutButton = page.getByRole('button', {
            name: /Logout/i
        }).or(page.getByText('Logout', { exact: false })).first();
    }

    // ==========================================
    // Microsoft Admin Login
    // ==========================================

    async openLoginPage(url = 'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login') {
        await this.page.goto(url);
    }

    async loginWithMicrosoft(email: string, pass: string) {
        await this.openLoginPage();

        // Click Microsoft login button
        const msBtn = this.page.locator('button').nth(5);
        await msBtn.waitFor({ state: 'visible', timeout: 15000 });
        await msBtn.click();

        // Enter email
        await this.emailInput.waitFor({ state: 'visible', timeout: 30000 });
        await this.emailInput.fill(email);
        await this.nextButton.click();

        // Enter password
        await this.passwordInput.waitFor({ state: 'visible', timeout: 30000 });
        await this.passwordInput.fill(pass);
        await this.signInButton.click();

        // Handle "Stay signed in?" prompt
        if (await this.noButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await this.noButton.click();
        }

        await this.page.waitForLoadState('networkidle');
        console.log('Microsoft login completed');
    }

    // ==========================================
    // Employee Navigation & Selection
    // ==========================================

    async navigateToEmployees() {
        if (await this.employeesMenu.isVisible({ timeout: 5000 }).catch(() => false)) {
            await this.employeesMenu.click();
        } else {
            await this.page.goto('/employee-management/active/employees');
        }
        await this.page.waitForLoadState('networkidle');
    }

    async selectEmployee(targetEmployeeName?: string): Promise<{ name: string; email: string }> {
        await this.navigateToEmployees();

        const searchName = targetEmployeeName || process.env.EMP_NAME;
        let selectedName = '';
        let selectedEmail = '';

        if (searchName && searchName.trim()) {
            // Check if already visible in table
            const matchingRow = this.page.locator('table tbody tr')
                .filter({ hasNotText: 'No Data Found' })
                .filter({ hasText: searchName.trim() })
                .first();

            if (await matchingRow.isVisible({ timeout: 3000 }).catch(() => false)) {
                selectedName = (await matchingRow.locator('td').nth(1).innerText()).trim();
                selectedEmail = (await matchingRow.locator('td').nth(3).innerText()).trim();
                await matchingRow.locator('td').nth(1).click();
            } else {
                // Try searching
                if (await this.employeeSearchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await this.employeeSearchInput.click();
                    await this.employeeSearchInput.fill(searchName.trim());
                    await this.employeeSearchInput.press('Enter');
                    await this.page.waitForTimeout(1500);

                    const searchedRow = this.page.locator('table tbody tr')
                        .filter({ hasNotText: 'No Data Found' })
                        .first();

                    if (await searchedRow.isVisible({ timeout: 4000 }).catch(() => false)) {
                        selectedName = (await searchedRow.locator('td').nth(1).innerText()).trim();
                        selectedEmail = (await searchedRow.locator('td').nth(3).innerText()).trim();
                        await searchedRow.locator('td').nth(1).click();
                    } else {
                        // Reset search
                        await this.employeeSearchInput.fill('');
                        await this.employeeSearchInput.press('Enter');
                        await this.page.waitForTimeout(1500);
                    }
                }
            }
        }

        // If no employee selected yet, pick first available row from table
        if (!selectedName) {
            const firstRow = this.page.locator('table tbody tr')
                .filter({ hasNotText: 'No Data Found' })
                .first();

            await firstRow.waitFor({ state: 'visible', timeout: 15000 });
            selectedName = (await firstRow.locator('td').nth(1).innerText()).trim();
            selectedEmail = (await firstRow.locator('td').nth(3).innerText()).trim();
            await firstRow.locator('td').nth(1).click();
        }

        // Wait for profile view and Generate Credentials button
        await this.generateCredentialsButton.waitFor({ state: 'visible', timeout: 20000 });

        // If EMP_MAIL is specified in .env, prioritize it over table email
        const finalEmail = (process.env.EMP_MAIL && process.env.EMP_MAIL.trim()) || selectedEmail;

        console.log(`Selected Employee: ${selectedName} | Email: ${finalEmail}`);
        return { name: selectedName, email: finalEmail };
    }

    async generateCredentials(): Promise<void> {
        await this.generateCredentialsButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.generateCredentialsButton.click();

        const downloadPromise = this.page.waitForEvent('download').catch(() => null);
        await this.yesButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.yesButton.click();

        const download = await downloadPromise;
        if (download) {
            console.log(`Credentials Excel downloaded: ${download.suggestedFilename()}`);
        }
        await this.page.waitForTimeout(3000);
    }

    // ==========================================
    // Yopmail Extraction
    // ==========================================

    static async extractTemporaryPasswordFromYopmail(yopmailPage: Page, email: string): Promise<string> {
        await yopmailPage.goto('https://yopmail.com/');

        const loginName = email.includes('@') ? email.split('@')[0] : email;

        // Enter email/login in Yopmail
        const loginInput = yopmailPage.getByRole('textbox', { name: 'Login' });
        await loginInput.waitFor({ state: 'visible', timeout: 15000 });
        await loginInput.fill(loginName);

        // Click check inbox
        await yopmailPage.getByTitle('Check Inbox @yopmail.com').click();
        await yopmailPage.waitForLoadState('domcontentloaded');

        const inboxFrame = yopmailPage.locator('iframe[name="ifinbox"]').contentFrame();
        const mailFrame = yopmailPage.locator('iframe[name="ifmail"]').contentFrame();

        const handleCaptcha = async () => {
            const captcha = mailFrame.getByText('Complete the CAPTCHA to continue', { exact: false })
                .or(yopmailPage.getByText('Complete the CAPTCHA to continue', { exact: false }));
            if (await captcha.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log('Please complete CAPTCHA manually in Yopmail, then click Resume in Playwright Inspector');
                await yopmailPage.pause();
                await inboxFrame.getByRole('button').first().click().catch(() => { });
            }
        };

        let temporaryPassword = '';

        // Poll for email up to 12 attempts (60s total)
        for (let attempt = 1; attempt <= 12; attempt++) {
            await handleCaptcha();

            const mailButton = inboxFrame.getByRole('button').first();
            const hasMail = await mailButton.isVisible({ timeout: 4000 }).catch(() => false);

            if (hasMail) {
                await mailButton.click();
                await yopmailPage.waitForTimeout(1500);
                await handleCaptcha();

                const mailBody = mailFrame.locator('body');
                if (await mailBody.isVisible({ timeout: 8000 }).catch(() => false)) {
                    const text = await mailBody.innerText();
                    const passwordMatch = text.match(/Temporary\s+Password\s*:\s*([^\s\r\n]+)/i);
                    if (passwordMatch && passwordMatch[1]) {
                        temporaryPassword = passwordMatch[1].trim();
                        console.log('Temporary password extracted successfully from Yopmail');
                        break;
                    }
                }
            }

            console.log(`Waiting for fresh credential email in Yopmail (attempt ${attempt}/12)...`);
            const refreshBtn = yopmailPage.locator('#refresh');
            if (await refreshBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await refreshBtn.click();
            } else {
                await yopmailPage.reload();
            }
            await yopmailPage.waitForTimeout(4000);
        }

        if (!temporaryPassword) {
            throw new Error(`Could not extract temporary password from Yopmail for ${email}`);
        }

        return temporaryPassword;
    }

    // ==========================================
    // Employee Login & Password Set
    // ==========================================

    async enterEmployeeEmail(email: string) {
        await this.employeeEmailInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.employeeEmailInput.fill(email);
    }

    async enterEmployeePassword(password: string) {
        await this.employeePasswordInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.employeePasswordInput.fill(password);
    }

    async clickEmployeeLogin() {
        await this.employeeLoginButton.click();
    }

    async enterNewPassword(password: string) {
        await this.newPasswordInput.waitFor({ state: 'visible', timeout: 30000 });
        await this.newPasswordInput.fill(password);
    }

    async enterConfirmNewPassword(password: string) {
        await this.confirmNewPasswordInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.confirmNewPasswordInput.fill(password);
    }

    async clickSaveProceed() {
        await this.saveProceedButton.click();
    }

    // ==========================================
    // Logout
    // ==========================================

    async clickProfile() {
        await this.profileImage.waitFor({ state: 'visible', timeout: 15000 });
        await this.profileImage.click();
    }

    async clickLogout() {
        await this.logoutButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.logoutButton.click();

        // Handle logout confirmation if displayed
        if (await this.yesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await this.yesButton.click();
        }
    }
}

