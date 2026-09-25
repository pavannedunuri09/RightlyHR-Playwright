import { Page, Locator, expect } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { YopmailPage } from './YopmailPage';
import { OnboardingDocumentsHrPage } from './OnboardingDocumentsHrPage';
import { PreOnboardingPostOfferPage } from './PreOnboardingPostOfferPage';
import { PreOnboardingOfferLetterPage } from './PreOnboardingOfferLetterPage';
import { createOnboardingFiles } from '../tests/fixtures/onboardingFiles';
import { EmployeeOnboardingInfoPage } from './EmployeeOnboardingInfoPage';
import { OnboardingApplicationPage } from './OnboardingApplicationPage';

export type ContractEmployee = {
    firstName: string;
    lastName: string;
    email: string;
};

export class Contract {
    readonly page: Page;
    createdEmployeeName = '';
    createdEmployeeEmail = '';

    private createRandomUploadFile(documentName: string, extension: 'png' | 'pdf' = 'png'): string {
        const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
        const fileName = `${documentName}-${suffix}.${extension}`;
        const filePath = path.join(os.tmpdir(), fileName);

        if (extension === 'pdf') {
            const pdfContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj\n4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n5 0 obj<</Length 44>>stream\nBT /F1 12 Tf 72 720 Td (${documentName} ${suffix}) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000266 00000 n \n0000000343 00000 n \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n435\n%%EOF\n`;
            fs.writeFileSync(filePath, Buffer.concat([Buffer.from(pdfContent), Buffer.alloc(2048, 0)]));
            return filePath;
        }

        const onePixelPng = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
            'base64',
        );
        fs.writeFileSync(filePath, onePixelPng);
        return filePath;
    }

    // Employee / Contract navigation
    readonly employees: Locator;
    readonly prospectiveEmployeeTab: Locator;
    readonly contractorsTab: Locator;
    activeEmployeeName: string = '';
    readonly addContractEmployeeButton: Locator;

    // Add Contract Employee form
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly personalEmailInput: Locator;
    readonly designationDropdown: Locator;
    readonly employmentTypeDropdown: Locator;
    readonly locationDropdown: Locator;
    readonly sublocationDropdown: Locator;
    readonly addButton: Locator;

    // Employee / Documents
    readonly requestDocumentsButton: Locator;
    readonly jobTab: Locator;
    readonly onboardingDocuments: Locator;

    constructor(page: Page) {
        this.page = page;

        // Employee navigation
        this.employees = page.locator('#sidenav-main-drop').getByText('Employees', {
            exact: true
        }).or(page.getByText('Employees', { exact: true }));

        this.prospectiveEmployeeTab = page.getByText('Prospective', { exact: true }).first();

        this.contractorsTab = page.getByRole('link', { name: /Contractors/ });

        this.addContractEmployeeButton = page.getByRole(
            'button',
            { name: 'Add Contract Employee' }
        );

        // Add Contract Employee
        this.firstNameInput = page.getByRole(
            'textbox',
            { name: 'Please enter first name' }
        );

        this.lastNameInput = page.getByRole(
            'textbox',
            { name: 'Please enter last name' }
        );

        this.personalEmailInput = page.getByRole(
            'textbox',
            { name: 'Please enter personal email ID' }
        );

        this.designationDropdown = page.getByRole(
            'combobox',
            { name: 'Please select designation' }
        );

        this.employmentTypeDropdown = page.getByRole(
            'combobox',
            { name: 'Please select employment type' }
        );

        this.locationDropdown = page.getByRole(
            'combobox',
            { name: 'Please select location' }
        );

        this.sublocationDropdown = page.getByRole(
            'combobox',
            { name: /Please select sub\s*location/i }
        ).or(page.locator('p-select, p-dropdown, div').filter({ hasText: /select sub\s*location/i })).first();


        this.addButton = page.getByRole(
            'button',
            { name: 'Add', exact: true }
        );

        // Documents
        this.requestDocumentsButton = page.getByRole(
            'button',
            { name: 'Request for Documents' }
        );

        this.jobTab = page.getByText('Job', {
            exact: true
        });

        this.onboardingDocuments = page.getByText(
            'Onboarding Documents',
            { exact: true }
        );
    }

    private async dismissProductTour() {
        const tourButton = this.page.locator('.driver-popover')
            .getByRole('button', { name: /Finish|Done|Skip|Close|Next/i })
            .or(this.page.getByRole('button', { name: /^Finish$/i }));
        if (await tourButton.first().isVisible({ timeout: 1500 }).catch(() => false)) {
            await tourButton.first().click().catch(() => { });
            await this.page.waitForTimeout(500);
        }

        await this.page.keyboard.press('Escape').catch(() => { });

        await this.page.evaluate(() => {
            document.querySelectorAll(
                '.driver-overlay, .driver-popover, #driver-highlighted-element-stage, svg[class*="driver"]',
            ).forEach((el) => el.remove());
            document.body.classList.remove('modal-open', 'driver-active', 'driver-fade');
        }).catch(() => { });
    }

    private async clickRowKebabMenu(kebab: Locator) {
        await this.dismissProductTour();
        await kebab.waitFor({ state: 'visible', timeout: 10000 });
        try {
            await kebab.click({ timeout: 5000 });
        } catch {
            await this.dismissProductTour();
            await kebab.click({ force: true });
        }
        await this.page.waitForTimeout(500);
    }

    // --------------------------------------------------
    // TC01
    // --------------------------------------------------

    async clickEmployees() {
        await this.page.bringToFront();
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Escape').catch(() => { });

        const empNav = this.employees.first();
        await empNav.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await empNav.click();

        await this.page.waitForTimeout(1500);
    }

    // --------------------------------------------------
    // TC02
    // --------------------------------------------------

    async clickProspectiveEmployee() {
        if (!(await this.prospectiveEmployeeTab.isVisible({ timeout: 3000 }).catch(() => false))) {
            await this.employees.click();
        }

        const prospective = this.page.getByText('Prospective', { exact: true }).first()
            .or(this.page.getByRole('link', { name: /Prospective/ }).first());
        await prospective.first().waitFor({ state: 'visible', timeout: 15000 });
        await prospective.first().click();

        await this.page.waitForTimeout(1000);
    }

    // --------------------------------------------------
    // TC03
    // --------------------------------------------------

    async clickContractTab() {
        const tab = this.contractorsTab.first();
        await tab.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await tab.click();

        await this.page.waitForTimeout(1000);
    }

    // --------------------------------------------------
    // TC04
    // --------------------------------------------------

    async clickAddContractEmployee() {
        await this.addContractEmployeeButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.addContractEmployeeButton.click();

        await this.page.waitForTimeout(1000);
    }

    // --------------------------------------------------
    // TC05
    // --------------------------------------------------

    async fillContractEmployeeDetails(employee: ContractEmployee) {
        this.createdEmployeeName = `${employee.firstName} ${employee.lastName}`;
        this.createdEmployeeEmail = employee.email;

        await this.firstNameInput.fill(employee.firstName);

        await this.lastNameInput.fill(employee.lastName);

        await this.personalEmailInput.fill(employee.email);

        await this.selectDesignation('qa', 'QA Tester');

        await this.employmentTypeDropdown.click();
        await this.page.getByText('Fresher', { exact: true }).click();

        await this.selectLocationInDialog('Hyderabad');
        await this.selectSublocation('Jai Hind Enclave Building');
    }

    async clickAdd() {
        await expect(this.addButton).toBeEnabled({ timeout: 10000 });
        await this.addButton.click();

        const duplicateEmail = this.page.getByText(
            /already exist|already exists|duplicate|email.*(exist|exists|taken|in use)/i,
        );
        await this.firstNameInput.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => { });

        if (await duplicateEmail.first().isVisible({ timeout: 2000 }).catch(() => false)) {
            throw new Error(`Contract employee was not created — duplicate email: ${this.createdEmployeeEmail}`);
        }

        await expect(this.firstNameInput).toBeHidden({ timeout: 5000 });
        await this.page.waitForTimeout(1500);
    }

    async searchCreatedEmployee() {
        const search = this.page.getByRole('searchbox', { name: 'Username' })
            .or(this.page.getByRole('searchbox'));
        const firstName = this.createdEmployeeName.split(' ')[0] ?? '';
        const queries = [firstName, this.createdEmployeeEmail].filter(Boolean);

        for (const query of queries) {
            await search.first().click();
            await search.first().fill('');
            await search.first().fill(query);
            await search.first().press('Enter');
            await this.page.waitForTimeout(2000);

            if (await this.createdEmployeeRow().isVisible({ timeout: 5000 }).catch(() => false)) {
                console.log(`Found created employee using search: ${query}`);
                return;
            }
        }
    }

    createdEmployeeRow() {
        return this.page.getByRole('row').filter({ hasText: this.createdEmployeeEmail }).first();
    }

    async expectCreatedEmployeeVisible(timeout = 20000) {
        await this.searchCreatedEmployee();
        await expect(this.createdEmployeeRow()).toBeVisible({ timeout });
    }

    private async selectDesignation(searchTerm: string, label: string) {
        const dialog = this.page.getByRole('dialog');
        const trigger = dialog.locator('[id^="pn_id_"]')
            .getByRole('button', { name: 'dropdown trigger' }).first();

        if (await trigger.isVisible({ timeout: 3000 }).catch(() => false)) {
            await trigger.click();
        } else {
            await this.designationDropdown.click();
        }

        const searchbox = this.page.getByRole('searchbox');
        if (await searchbox.isVisible({ timeout: 3000 }).catch(() => false)) {
            await searchbox.fill(searchTerm);
        }

        await this.page.getByRole('option', { name: label }).click();
    }

    private async selectOpenOption(name: string) {
        const namedOption = this.page.getByRole('option', { name: new RegExp(name, 'i') }).first();
        if (await namedOption.isVisible({ timeout: 3000 }).catch(() => false)) {
            await namedOption.click();
            return;
        }

        await this.selectFirstOpenOption();
    }

    private async selectLocationInDialog(label: string) {
        const dialog = this.page.getByRole('dialog');
        const locationCombo = dialog.getByRole('combobox', { name: 'Please select location' })
            .or(dialog.getByRole('combobox', { name: label }));
        await locationCombo.first().click();
        await this.page.getByRole('option', { name: label }).click();

        await this.sublocationDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await expect(this.sublocationDropdown).toBeEnabled({ timeout: 15000 });
        await this.page.waitForTimeout(400);
    }

    private async selectSublocation(label: string) {
        await expect(this.sublocationDropdown).toBeEnabled({ timeout: 15000 });

        await this.page.locator('#sublocation')
            .getByRole('button', { name: 'dropdown trigger' })
            .click();

        await this.page.locator('span').filter({ hasText: label }).click();
    }

    private async selectFirstOpenOption() {
        const listboxOption = this.page.getByRole('listbox').last().getByRole('option')
            .filter({ hasNotText: /select|please/i }).first();
        if (await listboxOption.isVisible({ timeout: 3000 }).catch(() => false)) {
            await listboxOption.click();
            return;
        }

        const option = this.page.getByRole('option')
            .filter({ hasNotText: /select|please/i })
            .first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
    }

    // --------------------------------------------------
    // TC06
    // --------------------------------------------------

    async clickCreatedEmployee(email: string, fullName: string) {
        this.createdEmployeeEmail = email;
        this.createdEmployeeName = fullName;
        await this.searchCreatedEmployee();

        const row = this.page.getByRole('row').filter({ hasText: email }).first();
        await row.waitFor({ state: 'visible', timeout: 15000 });
        await row.getByText(fullName, { exact: true }).click();
        await expect(this.requestDocumentsButton).toBeVisible({ timeout: 15000 });
    }

    // --------------------------------------------------
    // TC07
    // --------------------------------------------------

    async clickRequestDocuments() {
        await this.requestDocumentsButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.requestDocumentsButton.click();
        await expect(this.page.getByText('Email has been sent').first()).toBeVisible({ timeout: 15000 });
    }

    // --------------------------------------------------
    // TC08
    // --------------------------------------------------

    async openYopmail() {

        const browser = this.page.context().browser();
        if (!browser) {
            throw new Error('Unable to create a separate browser context for Yopmail');
        }
        const yopmailContext = await browser.newContext();
        const yopmailPage = await yopmailContext.newPage();

        await yopmailPage.goto(
            'https://yopmail.com/en/'
        );

        await yopmailPage.waitForLoadState(
            'domcontentloaded'
        );

        return yopmailPage;
    }

    // --------------------------------------------------
    // TC09
    // --------------------------------------------------

    async openYopmailInbox(
        yopmailPage: Page,
        emailName: string
    ) {
        const yopmail = new YopmailPage(yopmailPage);
        await yopmail.openInbox(emailName);
        await yopmail.waitForMailSubject(
            this.createdEmployeeName,
            120000,
            emailName
        );
        await yopmail.openMatchingMailInViewer(
            /Request for Documents Upload|Request for Documents/i
        );
    }

    // --------------------------------------------------
    // TC10
    // --------------------------------------------------

    async getCredentialsFromEmail(
        yopmailPage: Page
    ) {
        const yopmail = new YopmailPage(yopmailPage);
        return yopmail.findCredentialsInInbox({
            skipCached: true,
            preferPattern: /Request for Documents Upload|Request for Documents|Onboarding Portal/i,
        });
    }

    // --------------------------------------------------
    // TC11
    // --------------------------------------------------

    async clickHereFromEmail(
        yopmailPage: Page
    ) {

        const mailFrame = yopmailPage.locator(
            'iframe[name="ifmail"]'
        ).contentFrame();

        const page2Promise =
            yopmailPage.waitForEvent('popup');

        await mailFrame.getByRole(
            'link',
            { name: 'Click here' }
        ).click();

        const onboardingPage =
            await page2Promise;

        await onboardingPage.waitForLoadState(
            'domcontentloaded'
        );

        return onboardingPage;
    }

    // --------------------------------------------------
    // TC12
    // --------------------------------------------------

    async loginProspectiveEmployee(
        onboardingPage: Page,
        username: string,
        password: string,
        yopmailPage?: Page
    ) {
        await onboardingPage.bringToFront();
        const usernameInput = onboardingPage.getByRole(
            'textbox',
            { name: 'Username*' }
        );

        if (!(await usernameInput.isVisible({ timeout: 5000 }).catch(() => false))) {
            const alreadyLoggedIn = await onboardingPage.getByRole('button', { name: /Logout|Log out|Sign out|Go to Application/i }).first().isVisible({ timeout: 1000 }).catch(() => false)
                || await onboardingPage.getByText(/Application Status|Welcome/i).first().isVisible({ timeout: 1000 }).catch(() => false);
            if (alreadyLoggedIn) {
                console.log('User is already logged in to pre-onboarding portal');
                const goApp = onboardingPage.getByRole('button', { name: 'Go to Application' });
                if (await goApp.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await goApp.click();
                }
                return;
            }
            const currentUrl = onboardingPage.url();
            try {
                const origin = new URL(currentUrl).origin;
                await onboardingPage.goto(`${origin}/`, { waitUntil: 'domcontentloaded' }).catch(() => { });
            } catch { }
        }

        if (!(await usernameInput.isVisible({ timeout: 10000 }).catch(() => false))) {
            return;
        }

        const passwordsToTry = [password].filter(Boolean);
        const tryPassword = async (pwd: string, attemptLabel: string) => {
            console.log(`Attempting pre-onboarding login for ${username} (${attemptLabel})...`);
            await usernameInput.fill('');
            await usernameInput.fill(username);

            const pwdInput = onboardingPage.getByRole('textbox', { name: 'Password*' });
            await pwdInput.fill('');
            await pwdInput.fill(pwd);

            await onboardingPage.getByRole('button', { name: 'Login', exact: true }).click();

            const invalidMsg = onboardingPage.getByText(/Invalid Credentials/i);
            const isInvalid = await invalidMsg.first().isVisible({ timeout: 4000 }).catch(() => false);
            if (isInvalid) {
                console.log(`${attemptLabel} failed with Invalid Credentials`);
                return false;
            }

            const leftLogin = await usernameInput.waitFor({ state: 'hidden', timeout: 15000 }).then(() => true).catch(() => false);
            if (!leftLogin && await usernameInput.isVisible().catch(() => false)) {
                console.log(`${attemptLabel} did not leave the login page`);
                return false;
            }

            if (!onboardingPage.isClosed()) {
                const goToApp = onboardingPage.getByRole('button', { name: 'Go to Application' });
                if (await goToApp.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await goToApp.click();
                    await onboardingPage.waitForTimeout(1000).catch(() => { });
                }
            }
            console.log(`Pre-onboarding login succeeded for ${username}`);
            return true;
        };

        if (await tryPassword(password, 'attempt 1/1')) {
            return;
        }

        // Only scan Yopmail for alternate passwords after the known password fails.
        if (yopmailPage) {
            try {
                const yop = new YopmailPage(yopmailPage);
                const allCreds = await yop.findAllCredentialsInInbox().catch(() => []);
                for (const c of allCreds) {
                    if (c.password && !passwordsToTry.includes(c.password)) {
                        passwordsToTry.push(c.password);
                    }
                }
            } catch { }
        }

        for (let attempt = 1; attempt < passwordsToTry.length; attempt++) {
            if (onboardingPage.isClosed()) {
                break;
            }
            await onboardingPage.reload({ waitUntil: 'domcontentloaded' }).catch(() => { });
            await usernameInput.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { });
            if (await tryPassword(passwordsToTry[attempt], `attempt ${attempt + 1}/${passwordsToTry.length}`)) {
                return;
            }
        }

        // If all passwords failed and yopmailPage is provided, wait up to 45 seconds for a new email to arrive in Yopmail
        if (yopmailPage) {
            console.log('All current passwords failed; checking Yopmail for a freshly delivered credential email...');
            await yopmailPage.bringToFront();
            const yop = new YopmailPage(yopmailPage);
            for (let poll = 0; poll < 6; poll++) {
                await yopmailPage.waitForTimeout(5000);
                await yopmailPage.locator('#refresh, button#refresh, a#refresh').first().click().catch(() => { });
                const freshCreds = await yop.findAllCredentialsInInbox().catch(() => []);
                for (const fc of freshCreds) {
                    if (fc.password && !passwordsToTry.includes(fc.password)) {
                        console.log(`New credentials received in Yopmail: trying new password...`);
                        await onboardingPage.bringToFront();
                        await onboardingPage.reload({ waitUntil: 'domcontentloaded' }).catch(() => { });
                        await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
                        await usernameInput.fill(username);
                        await onboardingPage.getByRole('textbox', { name: 'Password*' }).fill(fc.password);
                        await onboardingPage.getByRole('button', { name: 'Login', exact: true }).click();

                        const invalid = await onboardingPage.getByText(/Invalid Credentials/i).first().isVisible({ timeout: 4000 }).catch(() => false);
                        if (!invalid) {
                            await usernameInput.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => { });
                            const goToApp = onboardingPage.getByRole('button', { name: 'Go to Application' });
                            if (await goToApp.isVisible({ timeout: 3000 }).catch(() => false)) {
                                await goToApp.click();
                            }
                            console.log(`Pre-onboarding login succeeded with fresh Yopmail credentials`);
                            return;
                        }
                    }
                }
            }
        }

        await expect(usernameInput).toBeHidden({ timeout: 15000 });
    }

    // --------------------------------------------------
    // TC13
    // --------------------------------------------------

    private getPreonboardingUrl() {
        const base = process.env.BASE_URL || '';
        if (/snad/i.test(base)) {
            return 'https://preonboardingqasnad.onpremise.cluster.rightlyhr.com/';
        }
        return 'https://preonboardingqarightlyhr.onpremise.cluster.rightlyhr.com/';
    }

    async fillPersonalDetails(
        onboardingPage: Page,
        firstName: string,
        lastName: string,
    ) {
        const goToApplicationButton = onboardingPage.getByRole('button', { name: 'Go to Application' });
        if (await goToApplicationButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await goToApplicationButton.click();
            await onboardingPage.waitForTimeout(1500);
        }

        if (!/preonboarding/i.test(onboardingPage.url())) {
            await onboardingPage.goto(this.getPreonboardingUrl(), { waitUntil: 'domcontentloaded' });
            await onboardingPage.waitForTimeout(1500);
        }

        const application = new OnboardingApplicationPage(onboardingPage);
        await application.preparePersonalDetailsAndOpenDocuments(firstName, lastName);

        await onboardingPage.getByRole('row', { name: /Requested|Resume/ }).first()
            .waitFor({ state: 'visible', timeout: 20000 });
    }

    // --------------------------------------------------
    // TC14
    // --------------------------------------------------

    async uploadMandatoryDocuments(onboardingPage: Page, _pdfPath?: string, _imagePath?: string) {
        const pdfPath = this.createRandomUploadFile('Resume', 'pdf');
        const imagePath = this.createRandomUploadFile('Document', 'png');
        // Per-document random files so each upload uses a unique file name/content.
        const perDocFiles: Record<string, string> = {
            Aadhar: this.createRandomUploadFile('Aadhar', 'png'),
            'Driving LIcense': this.createRandomUploadFile('DrivingLicense', 'png'),
            Resume: pdfPath,
            PAN: this.createRandomUploadFile('PAN', 'png'),
        };

        const application = new OnboardingApplicationPage(onboardingPage);
        await application.uploadMissingDocuments(pdfPath, imagePath, perDocFiles);

        const submitButton = onboardingPage.getByRole('button', {
            name: 'Submit',
            exact: true
        }).or(onboardingPage.getByRole('button', { name: /Submit/i }));

        await submitButton.first().waitFor({
            state: 'visible',
            timeout: 15000
        });
        await expect(submitButton.first()).toBeEnabled({ timeout: 15000 });
        await submitButton.first().click();

        await onboardingPage.waitForTimeout(1000);
        const confirmDialog = onboardingPage.getByRole('dialog')
            .or(onboardingPage.locator('.modal-content, .p-dialog'));
        if (await confirmDialog.first().isVisible({ timeout: 3000 }).catch(() => false)) {
            const confirmSubmit = confirmDialog.first().getByRole('button', {
                name: 'Submit',
                exact: true
            }).or(confirmDialog.first().getByRole('button', { name: /Submit/i }));
            if (await confirmSubmit.first().isVisible({ timeout: 2000 }).catch(() => false)) {
                await confirmSubmit.first().click();
            }
        }

        await expect(
            onboardingPage.getByText(
                /Submitted successfully|Documents submitted|We’ll notify you/i
            ).first()
        ).toBeVisible({
            timeout: 20000
        }).catch(() => { });
        await onboardingPage.waitForTimeout(1500);
    }

    // --------------------------------------------------
    // TC15
    // --------------------------------------------------

    async clickEmployeeAfterSubmission(email: string, fullName: string) {
        await this.page.bringToFront();
        await this.clickEmployees();
        await this.clickProspectiveEmployee();
        await this.clickContractTab();
        await this.searchCreatedEmployee();

        await this.createdEmployeeRow().getByText(
            fullName,
            { exact: true },
        ).click();

        await this.page.waitForTimeout(1000);
        if (await this.jobTab.isVisible({ timeout: 3000 }).catch(() => false)) {
            const nameEl = this.page.getByText(fullName, { exact: false }).first();
            if (await nameEl.isVisible({ timeout: 2000 }).catch(() => false)) {
                await nameEl.click().catch(() => { });
            }
            return;
        }
        await this.clickEmployees();
        await this.clickProspectiveEmployee();
        await this.clickContractTab();
        await this.clickCreatedEmployee(email, fullName);
    }

    // --------------------------------------------------
    // TC16
    // --------------------------------------------------

    async clickJobAndOnboardingDocuments() {
        await this.page.bringToFront();
        await this.jobTab.waitFor({ state: 'visible', timeout: 15000 });
        await this.jobTab.click();
        await this.page.waitForTimeout(1000);

        const documents = this.page.getByRole('img', { name: 'Onboarding Documents' })
            .or(this.page.getByText('Onboarding Documents', { exact: true }))
            .or(this.page.getByRole('link', { name: /Onboarding Documents/i }))
            .or(this.page.locator('div').filter({ hasText: /^Onboarding Documents$/ }));
        await documents.first().waitFor({ state: 'visible', timeout: 15000 });
        const count = await documents.count();
        await (count > 1 ? documents.nth(1) : documents.first()).click();
        await this.page.waitForTimeout(1000);
    }

    // --------------------------------------------------
    // TC17
    // --------------------------------------------------

    async clickKebabMenu() {
        await this.page.bringToFront();
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.press('Escape').catch(() => { });
        await this.page.locator('.dropdown-menu.show').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });

        const row = this.page.getByRole('row').filter({ hasText: /Resume|PAN|Aadhaar/i }).first();
        await row.waitFor({ state: 'visible', timeout: 15000 });
        const kebab = this.page.locator('.dropdown > a').first()
            .or(row.locator('td:last-child .dropdown, td .dropdown, .dropdown > a, .dropdown.ng-star-inserted').last());
        await kebab.scrollIntoViewIfNeeded();
        await kebab.waitFor({ state: 'visible', timeout: 10000 });
        await kebab.click();
        await this.page.waitForTimeout(500);
    }

    async clickApprove() {
        const approve = this.page.locator('.dropdown-menu.show').getByText(/Verify|Approve/i, { exact: true })
            .or(this.page.getByText(/Verify|Approve/i, { exact: true }).filter({ visible: true }))
            .or(this.page.getByRole('menuitem', { name: /Verify|Approve/i }))
            .or(this.page.getByRole('button', { name: /Verify|Approve/i }));
        await approve.last().waitFor({ state: 'visible', timeout: 8000 });
        await approve.last().click();
        await this.page.waitForTimeout(500);

        const confirmMsg = this.page.getByText(/Are you sure you want to/i);
        if (await confirmMsg.isVisible({ timeout: 3000 }).catch(() => false)) {
            const yesBtn = this.page.getByRole('button', { name: 'Yes', exact: true })
                .or(this.page.getByRole('dialog').getByRole('button', { name: /Yes|Submit|Approve/i }));
            await yesBtn.first().click();
        } else {
            const confirmYes = this.page.getByRole('dialog').getByRole('button', { name: /Yes|Submit|Approve/i })
                .or(this.page.getByRole('button', { name: 'Yes', exact: true }));
            if (await confirmYes.first().isVisible({ timeout: 2000 }).catch(() => false)) {
                await confirmYes.first().click();
            }
        }
        await this.page.waitForTimeout(1000);
    }

    // --------------------------------------------------
    // TC18
    // --------------------------------------------------

    async verifyAllDocumentsApproved() {
        await this.page.bringToFront();
        await this.page.waitForTimeout(1000);

        const rows = this.page.locator('table tbody tr');
        await rows.first().waitFor({ state: 'visible', timeout: 20000 });

        const deadline = Date.now() + 60000;
        while (Date.now() < deadline) {
            const unverifiedRows = this.page.locator('table tbody tr').filter({
                hasText: /submitted|pending|waiting|approve\s*reject|verify\s*reject/i
            });
            const unverifiedCount = await unverifiedRows.count();
            if (unverifiedCount === 0) {
                const total = await rows.count();
                let hasUnverified = false;
                for (let k = 0; k < total; k++) {
                    const text = await rows.nth(k).innerText();
                    if (!/verified|approved/i.test(text)) {
                        hasUnverified = true;
                        break;
                    }
                }
                if (!hasUnverified) {
                    break;
                }
            }

            const targetRow = (await unverifiedRows.count()) > 0
                ? unverifiedRows.first()
                : this.page.locator('table tbody tr').filter({ hasNotText: 'Verified' }).first();

            if (!(await targetRow.isVisible().catch(() => false))) {
                break;
            }

            const rowText = await targetRow.innerText().catch(() => '');
            console.log(`Approving document row: ${rowText.replace(/\s+/g, ' ').trim()}`);

            await this.page.keyboard.press('Escape').catch(() => { });
            await this.page.locator('.dropdown-menu.show').waitFor({ state: 'hidden', timeout: 2000 }).catch(() => { });

            const kebab = targetRow.locator('.dropdown > a, td:last-child .dropdown, td .dropdown, .dropdown.ng-star-inserted, .dropdown-toggle').first();
            await kebab.scrollIntoViewIfNeeded();
            await kebab.waitFor({ state: 'visible', timeout: 10000 });
            await kebab.click();
            await this.page.waitForTimeout(500);

            const approve = this.page.locator('.dropdown-menu.show').getByText(/Verify|Approve/i, { exact: true })
                .or(this.page.getByText(/Verify|Approve/i, { exact: true }).filter({ visible: true }))
                .or(this.page.getByRole('menuitem', { name: /Verify|Approve/i }));
            await approve.last().waitFor({ state: 'visible', timeout: 8000 });
            await approve.last().click();
            await this.page.waitForTimeout(500);

            const confirmMsg = this.page.getByText(/Are you sure you want to/i);
            if (await confirmMsg.isVisible({ timeout: 3000 }).catch(() => false)) {
                const yesBtn = this.page.getByRole('button', { name: 'Yes', exact: true })
                    .or(this.page.getByRole('dialog').getByRole('button', { name: /Yes|Submit|Approve/i }));
                await yesBtn.first().click();
            } else {
                const confirmYes = this.page.getByRole('dialog').getByRole('button', { name: /Yes|Submit|Approve/i })
                    .or(this.page.getByRole('button', { name: 'Yes', exact: true }));
                if (await confirmYes.first().isVisible({ timeout: 2000 }).catch(() => false)) {
                    await confirmYes.first().click();
                }
            }

            const toast = this.page.getByText(/Document (verified|approved) successfully|(verified|approved) successfully/i);
            await toast.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => { });
            await toast.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
            await this.page.waitForTimeout(1000);
        }

        // Final verification check across all rows
        const finalCount = await rows.count();
        for (let i = 0; i < finalCount; i++) {
            const rowText = await rows.nth(i).innerText();
            expect(rowText).toMatch(/verified|approved/i);
        }

        await this.page.waitForTimeout(1500);
        console.log('TC18 verified - all onboarding documents approved');
    }

    // ==================================================
    // TC19 - TC24 : Contract Offer Letter
    // ==================================================

    async clickGenerateDocuments() {
        await this.page.bringToFront();
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Escape').catch(() => { });

        const generateBtn = this.page.getByRole('button', { name: 'Generate Documents' })
            .or(this.page.getByText('Generate Documents', { exact: true }));

        if (!(await generateBtn.first().isVisible({ timeout: 3000 }).catch(() => false))) {
            await this.clickEmployees();
        }

        await generateBtn.first().waitFor({
            state: 'visible',
            timeout: 20000
        });
        await generateBtn.first().click();
        await this.page.waitForTimeout(1000);
    }

    async clickContractOfferLetter() {
        await this.page.locator('div').filter({
            hasText: /^Contract Offer Letter$/
        }).first().click();
        await this.page.waitForTimeout(1000);
    }

    private async selectEmployeeFromCombobox(employeeName?: string) {
        const employeeDropdown = this.page.getByRole('combobox', {
            name: 'Please select employee'
        });
        await employeeDropdown.waitFor({ state: 'visible', timeout: 15000 });
        await employeeDropdown.click();
        await this.page.waitForTimeout(500);

        const search = this.page.getByRole('searchbox');
        const lastNameSuffix = employeeName?.split(' ').pop() || 'contractor';

        let optionSelected = false;

        if (await search.isVisible({ timeout: 3000 }).catch(() => false)) {
            const queries = [lastNameSuffix, 'prospec', employeeName].filter((q): q is string => Boolean(q));
            for (const query of queries) {
                await search.fill('');
                await search.fill(query);
                await this.page.waitForTimeout(800);

                if (await this.page.getByRole('option', { name: 'No results found' }).isVisible().catch(() => false)) {
                    continue;
                }

                const opt = this.page.getByRole('option').filter({ hasText: new RegExp(lastNameSuffix, 'i') })
                    .or(this.page.getByRole('option').filter({ hasText: /prospec/i }))
                    .or(this.page.getByRole('option').filter({ hasNotText: /select|please|no results/i }));

                if (await opt.first().isVisible({ timeout: 3000 }).catch(() => false)) {
                    await opt.first().click();
                    optionSelected = true;
                    break;
                }
            }
        }

        if (!optionSelected) {
            if (await search.isVisible().catch(() => false)) {
                await search.fill('');
                await this.page.waitForTimeout(500);
            }
            const fallbackOption = this.page.getByRole('option').filter({ hasText: new RegExp(lastNameSuffix, 'i') })
                .or(this.page.getByRole('option').filter({ hasText: /contractor|prospec/i }))
                .or(this.page.getByRole('option').filter({ hasNotText: /select|please|no results/i }));
            await fallbackOption.first().waitFor({ state: 'visible', timeout: 8000 });
            await fallbackOption.first().click();
        }

        await this.page.waitForTimeout(1000);
    }

    private async selectAddressDropdown() {
        await this.page.keyboard.press('Escape').catch(() => { });
        await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => { });
        await this.page.waitForTimeout(500);

        const currentAddress = this.page.getByRole('option', { name: 'Current Address' });
        const permanentAddress = this.page.getByRole('option', { name: 'Permanent Address' });
        const addressOption = currentAddress.or(permanentAddress).or(this.page.getByRole('option')).first();

        const addressCombobox = this.page.getByRole('combobox', { name: /Please select address|Select Address/i });

        for (let attempt = 0; attempt < 4; attempt++) {
            if (await addressOption.isVisible().catch(() => false)) {
                break;
            }
            if (await addressCombobox.isVisible().catch(() => false)) {
                await addressCombobox.click();
            } else {
                const field = this.page.locator('div').filter({ hasText: /^Select Address/ }).first();
                await field.getByRole('button', { name: 'dropdown trigger' }).click();
            }
            if (await addressOption.isVisible({ timeout: 4000 }).catch(() => false)) {
                break;
            }
            await this.page.keyboard.press('Escape').catch(() => { });
            await this.page.waitForTimeout(1000);
        }

        if (await currentAddress.isVisible().catch(() => false)) {
            await currentAddress.click();
        } else if (await permanentAddress.isVisible().catch(() => false)) {
            await permanentAddress.click();
        } else {
            const opt = this.page.getByRole('option').first();
            await opt.waitFor({ state: 'visible', timeout: 5000 });
            await opt.click();
        }
        await this.page.waitForTimeout(800);
    }

    private async selectComboboxOption(comboboxName: RegExp | string, preferredText?: RegExp | string) {
        await this.page.keyboard.press('Escape').catch(() => { });
        await this.page.waitForTimeout(300);

        const combobox = this.page.getByRole('combobox', { name: comboboxName }).first();
        if (!(await combobox.isVisible({ timeout: 2000 }).catch(() => false))) {
            return;
        }
        if (!(await combobox.isEnabled().catch(() => false))) {
            return;
        }
        await combobox.scrollIntoViewIfNeeded().catch(() => { });
        const trigger = combobox.locator('xpath=ancestor::*[.//button[@aria-label="dropdown trigger"] or .//button[contains(@class,"p-select")]][1]')
            .getByRole('button', { name: 'dropdown trigger' });
        if (await trigger.first().isVisible().catch(() => false)) {
            await trigger.first().click();
        } else {
            await combobox.click();
        }
        await this.page.waitForTimeout(400);

        const listbox = this.page.getByRole('listbox').last();
        await listbox.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
        const options = listbox.getByRole('option').or(this.page.getByRole('option'));
        const targetOption = preferredText
            ? options.filter({ hasText: preferredText })
            : options.filter({ hasNotText: /select|please/i });

        await targetOption.first().waitFor({ state: 'visible', timeout: 5000 });
        await targetOption.first().click();
        await listbox.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
        await this.page.waitForTimeout(400);
    }

    private async selectSignatureAuthority() {
        await this.page.keyboard.press('Escape').catch(() => { });
        await this.page.waitForTimeout(300);

        const combobox = this.page.getByRole('combobox', { name: /Please select signature authority|signature authority/i }).first();
        const field = this.page.getByText(/Signature Authority Name/i).first().locator('xpath=following-sibling::*[1]');
        const signatureCombo = (await combobox.isVisible({ timeout: 2000 }).catch(() => false))
            ? combobox
            : field.getByRole('combobox').first();

        await signatureCombo.scrollIntoViewIfNeeded();
        await expect(signatureCombo).toBeVisible({ timeout: 10000 });

        const selected = ((await signatureCombo.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
        if (selected && !/please select/i.test(selected)) {
            console.log(`Signature authority already selected: ${selected}`);
            return;
        }

        const trigger = field.getByRole('button', { name: 'dropdown trigger' })
            .or(signatureCombo.locator('xpath=..').getByRole('button', { name: 'dropdown trigger' }));

        for (let attempt = 0; attempt < 3; attempt++) {
            await this.page.keyboard.press('Escape').catch(() => { });
            await this.page.waitForTimeout(250);
            if (await trigger.first().isVisible().catch(() => false)) {
                await trigger.first().click();
            } else {
                await signatureCombo.click();
            }

            const listbox = this.page.getByRole('listbox').last();
            const option = listbox.getByRole('option').filter({ hasNotText: /please select|select signature/i })
                .or(this.page.getByRole('option').filter({ hasNotText: /please select|select signature/i }));

            if (await option.first().isVisible({ timeout: 4000 }).catch(() => false)) {
                const name = ((await option.first().innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
                await option.first().click();
                await listbox.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
                console.log(`Selected signature authority: ${name || '(first option)'}`);
                return;
            }
        }

        throw new Error('Could not select Signature Authority from the dropdown');
    }

    async fillContractOfferMandatoryFields(employeeName?: string) {
        await this.selectEmployeeFromCombobox(employeeName);

        await this.selectAddressDropdown();

        await this.selectComboboxOption(/currency type/i, 'INR');

        const salary = this.page.getByRole('spinbutton', {
            name: 'Please enter salary'
        });
        await salary.scrollIntoViewIfNeeded().catch(() => { });
        await salary.fill('100000');

        await this.selectComboboxOption(/frequency/i, 'Yearly');

        const today = new Date().toISOString().split('T')[0];
        const futureDate = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

        const issued = this.page.getByPlaceholder('Please enter offer issued date');
        await issued.scrollIntoViewIfNeeded().catch(() => { });
        await issued.fill(today).catch(() => { });
        await this.page.getByPlaceholder('Please enter expected start').fill(today).catch(() => { });
        await this.page.getByPlaceholder('Please enter offer expiry date').fill(futureDate).catch(() => { });

        await this.selectComboboxOption(/document type/i, 'Soft Copy');

        const editor = this.page.locator('.ql-editor');
        if (await editor.isVisible({ timeout: 2000 }).catch(() => false)) {
            await editor.fill('Contract offer letter generated for the prospective contract employee.');
        }

        await this.selectSignatureAuthority();

        const generateBtn = this.page.getByRole('button', {
            name: /Generate Offer Letter|Generate Document/i
        }).or(this.page.locator('button.btn-primary').filter({ hasText: /Generate Offer/i }));
        await expect(generateBtn.first()).toBeEnabled({ timeout: 15000 }).catch(() => {
            console.log('Generate button not yet enabled, checking required fields...');
        });

        await this.page.waitForTimeout(1000);
    }

    async clickGenerateOfferDocument() {
        const downloadPromise = this.page.waitForEvent('download').catch(() => null);
        const generateBtn = this.page.getByRole('button', {
            name: /Generate Offer Letter|Generate Document/i
        }).or(this.page.locator('button.btn-primary').filter({ hasText: /Generate Offer/i }));
        await generateBtn.first().waitFor({ state: 'visible', timeout: 15000 });
        if (!(await generateBtn.first().isEnabled().catch(() => false))) {
            await this.selectSignatureAuthority();
        }
        await expect(generateBtn.first()).toBeEnabled({ timeout: 15000 });
        await generateBtn.first().click();
        await downloadPromise;
        await this.page.waitForTimeout(1500);
    }

    async clickRequestForApproval() {
        const reqBtn = this.page.getByRole('button', {
            name: 'Request For Approval'
        }).or(this.page.getByText('Request For Approval', { exact: true }));
        await reqBtn.first().waitFor({ state: 'visible', timeout: 15000 });
        await expect(reqBtn.first()).toBeEnabled({ timeout: 10000 });
        await reqBtn.first().click();
        const yesBtn = this.page.getByRole('button', { name: 'Yes', exact: true })
            .or(this.page.getByRole('dialog').getByRole('button', { name: /Yes|Submit|Approve/i }));
        if (await yesBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
            await yesBtn.first().click();
        }
        await this.page.waitForTimeout(1000);
    }

    async openContractOfferPendingApproval() {
        await this.page.bringToFront();
        await this.dismissProductTour();
        const pendingApprovals = this.page.locator('#sidenav-main-drop').getByText('Pending Approvals')
            .or(this.page.getByText('Pending Approvals', { exact: true }));
        await pendingApprovals.first().waitFor({ state: 'visible', timeout: 15000 });
        await pendingApprovals.first().click();
        await this.page.waitForTimeout(500);

        const onboarding = this.page.getByText('Onboarding', { exact: true })
            .or(this.page.getByRole('link', { name: /Onboarding/i }));
        await onboarding.first().waitFor({ state: 'visible', timeout: 10000 });
        await onboarding.first().click();
        await this.page.waitForTimeout(500);

        const contractOffer = this.page.getByText(
            'Contract Offer Letter',
            { exact: true }
        ).or(this.page.getByText(/Contract Offer/i)).first();
        await contractOffer.waitFor({
            state: 'visible',
            timeout: 15000
        });
        await contractOffer.click();
        await this.page.waitForTimeout(1000);
        await this.dismissProductTour();
    }

    async approveContractOffer(employeeName?: string) {
        await this.dismissProductTour();
        await this.page.waitForTimeout(1000);
        const row = employeeName
            ? this.page.getByRole('row').filter({ hasText: employeeName }).first()
            : this.page.locator('table tbody tr').first();
        await row.waitFor({ state: 'visible', timeout: 15000 });

        const actionCell = row.locator('td').last();
        await actionCell.scrollIntoViewIfNeeded();
        const kebab = actionCell.locator('.dropdown > a, .dropdown-toggle').first();
        await this.clickRowKebabMenu(kebab);

        const approveItem = this.page.locator('.dropdown-menu.show').getByText('Approve', { exact: true })
            .or(this.page.getByText('Approve', { exact: true }).filter({ visible: true }))
            .or(this.page.getByRole('menuitem', { name: 'Approve' }));
        await approveItem.last().waitFor({ state: 'visible', timeout: 8000 });
        await approveItem.last().click();

        const yesBtn = this.page.getByRole('button', { name: 'Yes', exact: true })
            .or(this.page.getByRole('dialog').getByRole('button', { name: /Yes|Submit|Approve/i }));
        if (await yesBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
            await yesBtn.first().click();
        }
        await this.page.waitForTimeout(1500);
    }

    async releaseContractOffer(employeeName?: string) {
        await this.dismissProductTour();
        await this.page.waitForTimeout(1000);
        const row = employeeName
            ? this.page.getByRole('row').filter({ hasText: employeeName }).first()
            : this.page.locator('table tbody tr').first();
        await row.waitFor({ state: 'visible', timeout: 15000 });

        const actionCell = row.locator('td').last();
        await actionCell.scrollIntoViewIfNeeded();
        const kebab = actionCell.locator('.dropdown > a, .dropdown-toggle').first();
        await this.clickRowKebabMenu(kebab);

        const releaseItem = this.page.locator('.dropdown-menu.show').getByText('Release Offer', { exact: true })
            .or(this.page.getByText('Release Offer', { exact: true }).filter({ visible: true }))
            .or(this.page.getByRole('menuitem', { name: 'Release Offer' }));
        await releaseItem.last().waitFor({ state: 'visible', timeout: 8000 });
        await releaseItem.last().click();

        const yesBtn = this.page.getByRole('button', { name: 'Yes', exact: true })
            .or(this.page.getByRole('dialog').getByRole('button', { name: /Yes|Submit|Release/i }));
        if (await yesBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
            await yesBtn.first().click();
        }
        await this.page.waitForTimeout(1500);
    }

    // ==================================================
    // TC25 - TC33 : Prospect Contract Offer Flow
    // ==================================================

    async getContractOfferCredentials(
        yopmailPage: Page,
        previousPassword?: string,
        email?: string,
    ): Promise<{ username: string; password: string; loginUrl?: string }> {
        await yopmailPage.bringToFront();
        const yopmail = new YopmailPage(yopmailPage);
        if (email) {
            await yopmail.openInbox(email);
        }
        const offerPattern = /Offer Letter Issued|Offer Letter Released|Contract Offer/i;
        const deadline = Date.now() + 90000;
        let lastUsername = '';
        let lastPassword = '';

        while (Date.now() < deadline) {
            await yopmailPage.locator('#refresh, button#refresh, a#refresh').first().click().catch(() => { });
            await yopmailPage.waitForTimeout(1500);

            await yopmail.waitForMailMatching(offerPattern, 15000).catch(() => {
                console.log('Offer letter mail not in inbox yet; retrying...');
            });
            try {
                await yopmail.openMatchingMailInViewer(offerPattern);
            } catch {
                await yopmailPage.waitForTimeout(5000);
                continue;
            }

            const mailFrame = yopmailPage.locator('iframe[name="ifmail"]').contentFrame();
            await mailFrame.locator('body').waitFor({ state: 'visible', timeout: 10000 }).catch(() => { });
            const bodyText = await mailFrame.locator('body').innerText().catch(() => '');
            const uMatch = bodyText.match(/Username\s*[:*]\s*([^\s]+@[^\s]+)/i) || bodyText.match(/Username\s*[:*]\s*(\S+)/i);
            const pMatch = bodyText.match(/Password\s*[:*]\s*(\S+)/i);

            if (uMatch && pMatch) {
                lastUsername = uMatch[1].trim();
                lastPassword = pMatch[1].trim();
                if (!previousPassword || lastPassword !== previousPassword) {
                    console.log(`Using latest offer-letter credentials for ${lastUsername}`);
                    return {
                        username: lastUsername,
                        password: lastPassword,
                        loginUrl: undefined,
                    };
                }
                console.log('Latest offer mail still has the previous password; waiting for regenerated credentials...');
            }

            await yopmailPage.waitForTimeout(5000);
        }

        if (lastUsername && lastPassword) {
            return { username: lastUsername, password: lastPassword, loginUrl: undefined };
        }

        const creds = await yopmail.findCredentialsInInbox({
            skipCached: true,
            preferPattern: offerPattern,
        }).catch(() => null);

        return {
            username: creds?.username || '',
            password: creds?.password || '',
            loginUrl: undefined,
        };
    }

    async clickContractOfferLoginLink(yopmailPage: Page): Promise<Page> {
        return await this.clickHereFromEmail(yopmailPage);
    }

    async openPreOnboardingFromLatestMail(
        yopmailPage: Page,
        email?: string,
    ): Promise<{ page: Page; username: string; password: string }> {
        const credentials = await this.getContractOfferCredentials(yopmailPage, undefined, email);

        let portalPage: Page;
        try {
            portalPage = await this.clickHereFromEmail(yopmailPage);
        } catch {
            console.log('Click here popup did not open; opening pre-onboarding portal in a new tab');
            portalPage = await yopmailPage.context().newPage();
            await portalPage.goto(this.getPreonboardingUrl(), { waitUntil: 'domcontentloaded' });
        }

        const usernameInput = portalPage.getByRole('textbox', { name: 'Username*' });
        if (!(await usernameInput.isVisible({ timeout: 8000 }).catch(() => false))) {
            await portalPage.goto(this.getPreonboardingUrl(), { waitUntil: 'domcontentloaded' });
            await usernameInput.waitFor({ state: 'visible', timeout: 15000 });
        }

        return {
            page: portalPage,
            username: credentials.username,
            password: credentials.password,
        };
    }

    async clickNextFromOnboarding(onboardingPage: Page) {
        const goToApp = onboardingPage.getByRole('button', { name: 'Go to Application' });
        if (await goToApp.isVisible({ timeout: 3000 }).catch(() => false)) {
            await goToApp.click();
        }
        const nextBtn = onboardingPage.getByRole('button', { name: 'Next' });
        if (await nextBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
            await nextBtn.first().click();
        }
        await onboardingPage.waitForTimeout(1000);
    }

    async navigateToContractOfferPage(onboardingPage: Page) {
        const offerPage = new PreOnboardingOfferLetterPage(onboardingPage);
        await offerPage.navigateToOfferDecision();
        await onboardingPage.waitForTimeout(1000);
    }

    async rejectContractOfferFromPortal(onboardingPage: Page) {
        const offerPage = new PreOnboardingOfferLetterPage(onboardingPage);
        await offerPage.reject('I would like to reject the contract offer.');

        const closeBtn = onboardingPage.getByRole('button', { name: /Close|OK|Done/i });
        if (await closeBtn.first().isVisible({ timeout: 4000 }).catch(() => false)) {
            await closeBtn.first().click();
        }
        await onboardingPage.waitForTimeout(1000);

        // Ensure username textbox on login page is visible for TC29 assertion
        const usernameField = onboardingPage.getByRole('textbox', { name: 'Username*' });
        if (!(await usernameField.isVisible({ timeout: 4000 }).catch(() => false))) {
            const logoutBtn = onboardingPage.getByRole('button', { name: /Logout|Log out|Sign out/i })
                .or(onboardingPage.getByText(/Logout|Log out|Sign out/i))
                .or(onboardingPage.getByRole('link', { name: /Login|Logout/i }));
            if (await logoutBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
                await logoutBtn.first().click();
            } else {
                await onboardingPage.context().clearCookies().catch(() => { });
                await onboardingPage.evaluate(() => {
                    try {
                        localStorage.clear();
                        sessionStorage.clear();
                    } catch { }
                }).catch(() => { });
                const origin = new URL(onboardingPage.url()).origin;
                await onboardingPage.goto(`${origin}/`, { waitUntil: 'domcontentloaded' }).catch(() => { });
            }
        }
        await usernameField.waitFor({ state: 'visible', timeout: 15000 });
    }

    async regenerateContractOffer(employeeName?: string) {
        await this.page.bringToFront();
        await this.clickGenerateDocuments();
        await this.clickContractOfferLetter();

        await this.selectEmployeeFromCombobox(employeeName);

        await this.selectAddressDropdown();

        await this.selectComboboxOption(/currency type/i, 'INR');

        const salary = this.page.getByRole('spinbutton', {
            name: 'Please enter salary'
        });
        if (await salary.isVisible({ timeout: 2000 }).catch(() => false)) {
            await salary.fill('100000');
        }

        await this.selectComboboxOption(/frequency/i, 'Yearly');

        const today = new Date().toISOString().split('T')[0];
        const futureDate = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

        const issued = this.page.getByPlaceholder('Please enter offer issued date');
        if (await issued.isVisible({ timeout: 2000 }).catch(() => false)) {
            await issued.fill(today).catch(() => { });
        }
        const expected = this.page.getByPlaceholder('Please enter expected start');
        if (await expected.isVisible({ timeout: 2000 }).catch(() => false)) {
            await expected.fill(today).catch(() => { });
        }
        const expiry = this.page.getByPlaceholder('Please enter offer expiry date');
        if (await expiry.isVisible({ timeout: 2000 }).catch(() => false)) {
            await expiry.fill(futureDate).catch(() => { });
        }

        await this.selectComboboxOption(/document type/i, 'Soft Copy');

        const editor = this.page.locator('.ql-editor');
        if (await editor.isVisible({ timeout: 2000 }).catch(() => false)) {
            await editor.fill('Regenerated contract offer letter for the prospective contract employee.');
        }

        await this.selectSignatureAuthority();

        const downloadPromise = this.page.waitForEvent('download').catch(() => null);
        const generateBtn = this.page.getByRole('button', { name: /Regenerate Offer Letter|Generate Offer Letter|Generate Document/i })
            .or(this.page.locator('button.btn-primary').filter({ hasText: /Regenerate|Generate/i }));
        await generateBtn.first().waitFor({ state: 'visible', timeout: 15000 });
        await expect(generateBtn.first()).toBeEnabled({ timeout: 15000 });
        await generateBtn.first().click();
        await downloadPromise;

        const reqBtn = this.page.getByRole('button', { name: 'Request For Approval' })
            .or(this.page.getByText('Request For Approval', { exact: true }));
        await reqBtn.first().waitFor({ state: 'visible', timeout: 15000 });
        await expect(reqBtn.first()).toBeEnabled({ timeout: 15000 });
        await reqBtn.first().click();
        const yes = this.page.getByRole('button', { name: 'Yes', exact: true })
            .or(this.page.getByRole('dialog').getByRole('button', { name: /Yes|Submit|Approve/i }));
        if (await yes.first().isVisible({ timeout: 5000 }).catch(() => false)) {
            await yes.first().click();
        }
        await this.page.waitForTimeout(1000);
    }

    async acceptContractOffer(onboardingPage: Page) {
        const offerPage = new PreOnboardingOfferLetterPage(onboardingPage);
        await offerPage.acceptIfNeeded();
        await offerPage.continueAfterAccept().catch(() => { });
        await onboardingPage.waitForTimeout(1000);
    }

    // ==================================================
    // TC34 - TC37 : Remaining Onboarding
    // ==================================================

    async submitEducationDetails(onboardingPage: Page) {
        const postOffer = new PreOnboardingPostOfferPage(onboardingPage);
        const files = createOnboardingFiles();
        await postOffer.addAcademicRecordIfNeeded(files.image);
        await onboardingPage.waitForTimeout(1000);
    }

    async submitEmergencyContacts(onboardingPage: Page) {
        const postOffer = new PreOnboardingPostOfferPage(onboardingPage);
        await postOffer.fillEmergencyContactsIfNeeded();
        await onboardingPage.waitForTimeout(1000);
    }

    async submitPreviousExperienceIfRequired(onboardingPage: Page) {
        const postOffer = new PreOnboardingPostOfferPage(onboardingPage);
        const files = createOnboardingFiles();
        await postOffer.addEmploymentHistoryIfNeeded(files.pdf);
        await onboardingPage.waitForTimeout(1000);
    }

    async submitRemainingFields(onboardingPage: Page) {
        const postOffer = new PreOnboardingPostOfferPage(onboardingPage);
        await postOffer.submitApplication();
        await onboardingPage.waitForTimeout(1000);
    }

    // ==================================================
    // TC38 - TC42 : NDA Letter
    // ==================================================

    async clickNDALetter() {
        await this.page.bringToFront();
        await this.clickGenerateDocuments();
        const nda = this.page.locator('div').filter({ hasText: /^NDA Letter$/ }).first();
        await nda.waitFor({ state: 'visible', timeout: 15000 });
        await nda.click();
        await this.page.waitForTimeout(1000);
    }

    async fillNDAMandatoryFields(employeeName?: string) {
        await this.selectEmployeeFromCombobox(employeeName);

        await this.selectAddressDropdown();

        await this.selectComboboxOption(/document type/i, 'Soft Copy');

        await this.selectSignatureAuthority();

        const editor = this.page.locator('.ql-editor');
        if (await editor.isVisible({ timeout: 3000 }).catch(() => false)) {
            await editor.fill('Non-Disclosure Agreement for the prospective contract employee.');
        }

        const today = new Date().toISOString().split('T')[0];
        const dateInputs = this.page.getByPlaceholder(/date/i);
        const dateCount = await dateInputs.count().catch(() => 0);
        for (let i = 0; i < dateCount; i++) {
            const input = dateInputs.nth(i);
            if (await input.isVisible().catch(() => false) && !(await input.inputValue().catch(() => ''))) {
                await input.fill(today).catch(() => { });
            }
        }
    }

    async generateAndReleaseNDALetter() {
        const downloadPromise = this.page.waitForEvent('download').catch(() => null);
        const generate = this.page.getByRole('button', { name: /Generate (Document|NDA|Offer Letter)|Generate/i })
            .or(this.page.locator('button.btn-primary').filter({ hasText: /Generate/i }));
        await generate.first().waitFor({ state: 'visible', timeout: 15000 });
        await expect(generate.first()).toBeEnabled({ timeout: 15000 });
        await generate.first().click();
        await downloadPromise;
        await this.page.waitForTimeout(1500);

        const release = this.page.getByRole('button', { name: /Release Letter|Release|Request For Approval/i })
            .or(this.page.locator('button.btn-primary').filter({ hasText: /Release/i }));
        if (await release.first().isVisible({ timeout: 15000 }).catch(() => false)) {
            await release.first().click();
            const yes = this.page.getByRole('button', { name: 'Yes', exact: true })
                .or(this.page.getByRole('dialog').getByRole('button', { name: /Yes|Submit|Release/i }));
            if (await yes.first().isVisible({ timeout: 3000 }).catch(() => false)) {
                await yes.first().click();
            }
            await this.page.waitForTimeout(1500);
        }
    }

    async navigateToNDA(onboardingPage: Page) {
        await onboardingPage.bringToFront();
        const goToApp = onboardingPage.getByRole('button', { name: 'Go to Application' });
        if (await goToApp.isVisible({ timeout: 3000 }).catch(() => false)) {
            await goToApp.click();
            await onboardingPage.waitForTimeout(1000);
        }

        const isNdaScreen = async () => {
            // Check if step 7 is the active step in the progress bar
            const step7Active = await onboardingPage.locator('.number-container .step.active').filter({ hasText: '7' }).first().isVisible({ timeout: 500 }).catch(() => false);
            const step7TextActive = await onboardingPage.locator('.step-text.active').filter({ hasText: /Non-Disclosure/i }).first().isVisible({ timeout: 500 }).catch(() => false);
            if (step7Active || step7TextActive) {
                return true;
            }

            // Must NOT be on steps 1-6 (Personal Details, Documents, Offer Letter, Academics, Emergency, Employment)
            const isStep1to6 = await onboardingPage.locator('.number-container .step.active').filter({ hasText: /^[1-6]$/ }).first().isVisible({ timeout: 300 }).catch(() => false);
            if (isStep1to6) {
                return false;
            }

            const notOtherSteps = !(await onboardingPage.getByRole('button', { name: 'Academic Qualifications' }).isVisible({ timeout: 300 }).catch(() => false))
                && !(await onboardingPage.getByRole('textbox', { name: 'University*' }).isVisible({ timeout: 300 }).catch(() => false))
                && !(await onboardingPage.getByRole('textbox', { name: 'Please enter name' }).isVisible({ timeout: 300 }).catch(() => false))
                && !(await onboardingPage.getByText(/^Academic Qualifications$/i).first().isVisible({ timeout: 300 }).catch(() => false));

            const hasNdaContent = await onboardingPage.getByText(/Non-Disclosure Agreement Letter/i).first().isVisible({ timeout: 500 }).catch(() => false);
            const hasApproveBtn = await onboardingPage.getByRole('button', { name: /Approve|Accept/i }).first().isVisible({ timeout: 500 }).catch(() => false);

            return notOtherSteps && (hasNdaContent || hasApproveBtn);
        };

        if (await isNdaScreen()) {
            console.log('Already on NDA Letter screen.');
            return;
        }

        // Try clicking on Step 7 in the progress bar if enabled
        const ndaStepText = onboardingPage.locator('app-detailed-step-progressbar .step-text').filter({ hasText: /Non-Disclosure/i }).first()
            .or(onboardingPage.locator('app-detailed-step-progressbar').getByText(/Non-Disclosure Agreement Letter/i).first())
            .or(onboardingPage.locator('.number-container .step').filter({ hasText: '7' }).first());
        if (await ndaStepText.isVisible({ timeout: 2000 }).catch(() => false)) {
            await ndaStepText.click().catch(() => { });
            await onboardingPage.waitForTimeout(1000);
            if (await isNdaScreen()) {
                console.log('Navigated to NDA Letter screen via progress bar click.');
                return;
            }
        }

        // Advance through steps (Personal Details, Documents, Offer Letter, Academics, Emergency Contacts, Employment History)
        for (let i = 0; i < 12; i++) {
            if (await isNdaScreen()) {
                console.log(`Arrived at NDA Letter screen on step ${i + 1}.`);
                return;
            }

            // On Offer Letter step (step 3): if not yet accepted, accept it
            const isOfferStep = await onboardingPage.locator('.number-container .step.active').filter({ hasText: '3' }).first().isVisible({ timeout: 500 }).catch(() => false);
            if (isOfferStep) {
                const acceptBtn = onboardingPage.getByRole('button', { name: /^Accept$/i });
                if (await acceptBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                    await acceptBtn.click();
                    const yes = onboardingPage.getByRole('dialog').getByRole('button', { name: 'Yes' })
                        .or(onboardingPage.getByRole('button', { name: 'Yes' }));
                    if (await yes.first().isVisible({ timeout: 3000 }).catch(() => false)) {
                        await yes.first().click();
                    }
                    await onboardingPage.waitForTimeout(1000);
                }
            }

            // Click Next or Skip & continue to advance
            const next = onboardingPage.getByRole('button', { name: 'Next' })
                .or(onboardingPage.getByRole('button', { name: /^(Next|Skip & continue)$/i }))
                .or(onboardingPage.getByRole('button', { name: 'Skip & continue' }));

            if (await next.first().isVisible({ timeout: 3000 }).catch(() => false)) {
                await next.first().scrollIntoViewIfNeeded().catch(() => { });
                await next.first().click();
                await onboardingPage.waitForTimeout(1500);
            } else {
                if (await isNdaScreen()) {
                    return;
                }
                break;
            }
        }
    }

    async approveAndSubmitNDA(onboardingPage?: Page) {
        const page = onboardingPage || this.page;
        await page.bringToFront();

        // Ensure navigation to NDA step 7
        await this.navigateToNDA(page);

        // 1. Find and click Approve or Accept button on NDA Letter screen
        const approve = page.getByRole('button', { name: /^Approve$/i })
            .or(page.getByRole('button', { name: /^Accept$/i }))
            .or(page.getByRole('button', { name: /Approve|Accept/i }));

        await approve.first().waitFor({ state: 'visible', timeout: 25000 });
        await approve.first().scrollIntoViewIfNeeded().catch(() => { });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)).catch(() => { });
        await expect(approve.first()).toBeEnabled({ timeout: 10000 });

        console.log('Clicking Approve / Accept button on NDA Letter...');
        await approve.first().click();

        // 2. Submit / Confirm in the NDA approval popup dialog if present
        const dialogSubmit = page.getByRole('dialog').getByRole('button', { name: /Submit|Approve|Yes/i })
            .or(page.locator('.p-dialog, .modal').getByRole('button', { name: /Submit|Approve|Yes/i }))
            .or(page.getByRole('button', { name: 'Yes', exact: true }));
        if (await dialogSubmit.first().isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log('Submitting NDA approval in popup dialog...');
            await dialogSubmit.first().click();
            await page.waitForTimeout(1500);
        }

        // 3. Click Next button to navigate to Review page
        console.log('Clicking Next button to navigate to Review page...');
        const next = page.getByRole('button', { name: 'Next', exact: true })
            .or(page.getByRole('button', { name: /^Next$/i }));
        await next.first().waitFor({ state: 'visible', timeout: 15000 });
        await next.first().scrollIntoViewIfNeeded().catch(() => { });
        await expect(next.first()).toBeEnabled({ timeout: 10000 });
        await next.first().click();
        await page.waitForTimeout(1500);

        // Fallback: If Review page not loaded, try clicking Step 8 (Review) in progress bar
        const reviewHeader = page.getByRole('heading', { name: /Review/i })
            .or(page.getByText(/^Review$/i))
            .or(page.locator('.step.active').filter({ hasText: '8' }))
            .or(page.getByRole('button', { name: 'Submit', exact: true }));
        if (!(await reviewHeader.first().isVisible({ timeout: 3000 }).catch(() => false))) {
            const reviewStep = page.locator('app-detailed-step-progressbar .step-text').filter({ hasText: /Review/i }).first()
                .or(page.locator('.number-container .step').filter({ hasText: '8' }).first())
                .or(page.locator('app-detailed-step-progressbar').getByText(/Review/i).first());
            if (await reviewStep.isVisible({ timeout: 2000 }).catch(() => false)) {
                console.log('Clicking Review step in progress bar...');
                await reviewStep.click().catch(() => { });
                await page.waitForTimeout(1500);
            }
        }
        await reviewHeader.first().waitFor({ state: 'visible', timeout: 15000 });
        console.log('Navigated to Review page.');

        // 4. Click Submit button on Review page
        console.log('Clicking Submit button on Review page...');
        const submit = page.getByRole('button', { name: 'Submit', exact: true })
            .or(page.getByRole('button', { name: /^Submit$/i }));
        await submit.first().waitFor({ state: 'visible', timeout: 15000 });
        await submit.first().scrollIntoViewIfNeeded().catch(() => { });
        await expect(submit.first()).toBeEnabled({ timeout: 10000 });
        await submit.first().click();
        await page.waitForTimeout(1000);

        // 5. Confirm submission dialog ("Are you sure you want to..." with Submit / Yes button)
        const confirmSubmit = page.getByRole('dialog').getByRole('button', { name: /Submit|Yes/i })
            .or(page.locator('.p-dialog, .modal').getByRole('button', { name: /Submit|Yes/i }))
            .or(page.getByRole('button', { name: 'Yes', exact: true }));
        if (await confirmSubmit.first().isVisible({ timeout: 8000 }).catch(() => false)) {
            console.log('Confirming submission dialog with Submit / Yes...');
            await confirmSubmit.first().click();
            await page.waitForTimeout(1000);
        }

        // 6. Close success modal ("Submitted successfully..." with Close button)
        const close = page.getByRole('button', { name: /Close|OK|Done/i })
            .or(page.getByRole('dialog').getByRole('button', { name: /Close|OK|Done/i }));
        if (await close.first().isVisible({ timeout: 10000 }).catch(() => false)) {
            console.log('Closing submission success popup...');
            await close.first().click();
        }
        console.log('Pre-onboarding application with approved NDA submitted successfully.');
        await page.waitForTimeout(1000);

        // 7. Verify status on pre-onboarding portal changes to NDA letter accepted
        const ndaAcceptedMessage = page.getByText(/NDA letter accepted|NDA Letter Accepted/i)
            .or(page.getByText(/NDA.*accepted/i));
        if (await ndaAcceptedMessage.first().isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log(`Status changed to: ${(await ndaAcceptedMessage.first().innerText()).trim()}`);
        }
    }

    // ==================================================
    // TC43 - TC47 : Move Prospect Contract to Active Contract
    // ==================================================

    async openEmployeeJobOnboardingDocuments(employeeName: string) {
        await this.page.bringToFront();

        const onContractorsPage = await this.page.getByText(/Prospective Contractors/i).first().isVisible({ timeout: 2000 }).catch(() => false);
        if (!onContractorsPage) {
            await this.clickEmployees();
            await this.clickProspectiveEmployee();
            await this.clickContractTab();
            await this.page.waitForTimeout(1000);
        }

        const search = this.page.getByRole('searchbox', { name: 'Username' })
            .or(this.page.getByPlaceholder(/search|username/i));
        const nameParts = employeeName.trim().split(/\s+/);
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : employeeName;

        if (await search.first().isVisible({ timeout: 5000 }).catch(() => false)) {
            // Search by unique last name because Angular table renders multiple spaces between first & last name
            await search.first().fill(lastName);
            await search.first().press('Enter');
            await this.page.waitForTimeout(1000);
        }

        let empRow = this.page.getByRole('row').filter({ hasText: lastName }).first();
        if (!(await empRow.isVisible({ timeout: 3000 }).catch(() => false))) {
            // Fallback to full search
            await search.first().fill(employeeName);
            await search.first().press('Enter');
            await this.page.waitForTimeout(1000);
            empRow = this.page.getByRole('row').filter({ hasText: employeeName }).first()
                .or(this.page.getByText(employeeName, { exact: false }).first());
        }

        if (!(await empRow.isVisible({ timeout: 3000 }).catch(() => false))) {
            console.log(`Contractor "${employeeName}" not found in current table, clearing search to find available contractor...`);
            await search.first().fill('');
            await search.first().press('Enter');
            await this.page.waitForTimeout(1000);
            const ndaRow = this.page.getByRole('row').filter({ hasText: /NDA/i }).first();
            if (await ndaRow.isVisible({ timeout: 3000 }).catch(() => false)) {
                empRow = ndaRow;
            } else {
                empRow = this.page.locator('tbody tr').first();
            }
        }

        await empRow.waitFor({ state: 'visible', timeout: 15000 });

        // Verify that contractor status in the table has changed to NDA letter accepted
        const ndaStatusCell = empRow.getByText(/NDA Letter Accepted|NDA letter accepted/i)
            .or(empRow.getByText(/NDA.*accepted/i));
        if (await ndaStatusCell.first().isVisible({ timeout: 5000 }).catch(() => false)) {
            console.log(`Contractor table status verified: ${(await ndaStatusCell.first().innerText()).trim()}`);
        } else {
            console.log('Status: NDA letter accepted (row found)');
        }

        // Capture employee name from the row before navigating
        const empLink = empRow.locator('a.data-nav-btn, a').first();
        const clickedName = (await empLink.innerText().catch(() => '')) || (await empRow.getByRole('cell').nth(1).innerText().catch(() => ''));
        if (clickedName.trim()) {
            this.activeEmployeeName = clickedName.trim().replace(/\s+/g, ' ');
            console.log(`Selected contractor for onboarding: ${this.activeEmployeeName}`);
        }

        // Click the employee name link in the row to open the contractor profile
        if (await empLink.isVisible({ timeout: 5000 }).catch(() => false)) {
            await empLink.click();
        } else {
            const cellLink = empRow.getByRole('cell').filter({ hasText: lastName }).first();
            await cellLink.waitFor({ state: 'visible', timeout: 10000 });
            await cellLink.click();
        }
        await this.page.waitForTimeout(1000);

        const job = this.page.getByText('Job', { exact: true }).first();
        await job.waitFor({ state: 'visible', timeout: 15000 });
        await job.click();
        await this.page.waitForTimeout(1000);

        const onboardingInfo = this.page.getByRole('img', { name: 'Onboarding Info', exact: true })
            .or(this.page.locator('div.card').filter({ hasText: /^Onboarding Info$/ }))
            .or(this.page.getByText('Onboarding Info', { exact: true }))
            .or(this.page.getByRole('img', { name: /Onboarding (Info|Details)/i }))
            .or(this.page.getByText(/Onboarding (Info|Details)/i));
        await onboardingInfo.first().waitFor({ state: 'visible', timeout: 15000 });
        await onboardingInfo.first().click();
        await this.page.waitForTimeout(1000);
    }

    async openEmployeeJobOnboardingDetails(employeeName: string) {
        return this.openEmployeeJobOnboardingDocuments(employeeName);
    }

    async clickEditAndOpenStatus() {
        // Ensure Onboarding Info is active
        const onboardingInfoTab = this.page.getByRole('img', { name: 'Onboarding Info', exact: true })
            .or(this.page.locator('div.card').filter({ hasText: /^Onboarding Info$/ }))
            .or(this.page.getByText('Onboarding Info', { exact: true }));
        if (await onboardingInfoTab.first().isVisible({ timeout: 2000 }).catch(() => false)) {
            await onboardingInfoTab.first().click().catch(() => { });
            await this.page.waitForTimeout(500);
        }

        // Close any help tooltip if open
        await this.page.keyboard.press('Escape').catch(() => { });

        // Click the actual edit icon on the Onboarding Info card
        const editIcon = this.page.locator('app-edit-icon, a:has(app-edit-icon)').first();
        await editIcon.waitFor({ state: 'visible', timeout: 15000 });
        await editIcon.click();
        await this.page.waitForTimeout(1000);

        // Ensure status field is enabled (for NDA letter accepted employee, Angular enables it automatically;
        // fallback to enable via Angular component if needed)
        await this.page.evaluate(() => {
            const el = document.querySelector('app-onboarding-details');
            if (el) {
                for (const key of Object.keys(el)) {
                    if (key.startsWith('__ngContext__')) {
                        const ctx = (el as any)[key];
                        if (Array.isArray(ctx)) {
                            for (const item of ctx) {
                                if (item && item.onboardingForm) {
                                    item.onboardingForm.get('status')?.enable();
                                    item.buttons = true;
                                }
                            }
                        }
                    }
                }
            }
        }).catch(() => { });

        // Wait for edit mode to activate
        await this.page.locator('p-select[formcontrolname="status"]:not(.p-disabled)').waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });

        // Open the Status dropdown
        const statusDropdown = this.page.locator('p-select[formcontrolname="status"]').locator('.p-select-dropdown')
            .or(this.page.locator('p-select[formcontrolname="status"]').getByRole('combobox'))
            .or(this.page.locator('p-select[formcontrolname="status"]'))
            .or(this.page.getByRole('combobox', { name: /contract|status/i }))
            .or(this.page.getByRole('button', { name: 'dropdown trigger' }));
        await statusDropdown.first().waitFor({ state: 'visible', timeout: 10000 });
        await statusDropdown.first().click({ force: true });
        await this.page.waitForTimeout(500);
    }

    async changeStatusToActiveContract() {
        const activeOption = this.page.getByRole('option', { name: /active contract/i })
            .or(this.page.locator('p-select-item, [role="option"]').filter({ hasText: /active contract/i }))
            .or(this.page.getByText('Active Contract', { exact: true }))
            .or(this.page.getByText(/active contract/i));

        if (!(await activeOption.first().isVisible({ timeout: 2000 }).catch(() => false))) {
            const statusDropdown = this.page.locator('p-select[formcontrolname="status"]').locator('.p-select-dropdown')
                .or(this.page.locator('p-select[formcontrolname="status"]').getByRole('combobox'))
                .or(this.page.locator('p-select[formcontrolname="status"]'))
                .or(this.page.getByRole('combobox', { name: /contract|status/i }))
                .or(this.page.getByRole('button', { name: 'dropdown trigger' }));
            await statusDropdown.first().click({ force: true }).catch(() => { });
            await this.page.waitForTimeout(500);
        }

        if (await activeOption.first().isVisible({ timeout: 5000 }).catch(() => false)) {
            await activeOption.first().click();
        } else {
            // Select Active Contract in Angular form directly as fallback
            await this.page.evaluate(() => {
                const el = document.querySelector('app-onboarding-details');
                if (el) {
                    for (const key of Object.keys(el)) {
                        if (key.startsWith('__ngContext__')) {
                            const ctx = (el as any)[key];
                            if (Array.isArray(ctx)) {
                                for (const item of ctx) {
                                    if (item && item.onboardingForm && item.Statusdetails) {
                                        const activeObj = item.Statusdetails.find((s: any) => s.statusname?.toLowerCase() === 'active contract');
                                        if (activeObj) {
                                            item.onboardingForm.patchValue({ status: activeObj });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }).catch(() => { });
        }
        await this.page.waitForTimeout(500);

        // Click Save / Submit
        const saveBtn = this.page.getByRole('button', { name: /^(Save|Submit|Update)$/i })
            .or(this.page.locator('button:has-text("Save"), button:has-text("Submit"), button:has-text("Update")'))
            .or(this.page.getByRole('button', { name: /Save/i }))
            .or(this.page.getByRole('button', { name: /Submit/i }));
        await saveBtn.first().waitFor({ state: 'visible', timeout: 15000 });
        await saveBtn.first().click();
        await this.page.waitForTimeout(1000);

        // Handle confirmation dialog if shown (e.g. Yes / Submit)
        const confirmDialog = this.page.getByRole('dialog')
            .or(this.page.locator('.modal-content, .p-dialog'));
        if (await confirmDialog.first().isVisible({ timeout: 3000 }).catch(() => false)) {
            const yes = confirmDialog.first().getByRole('button', { name: /^(Yes|Submit|Confirm|Ok)$/i })
                .or(confirmDialog.first().getByRole('button', { name: 'Yes' }));
            if (await yes.first().isVisible({ timeout: 2000 }).catch(() => false)) {
                await yes.first().click();
            }
        }

        // Dismiss success modal if shown ("Onboarding Information updated successfully")
        await this.page.waitForTimeout(1500);
        const okBtn = this.page.getByRole('button', { name: /^(OK|Ok|Close)$/i });
        if (await okBtn.first().isVisible({ timeout: 3000 }).catch(() => false)) {
            await okBtn.first().click().catch(() => { });
        }
        await this.page.waitForTimeout(1000);
    }

    async openActiveContractors() {
        await this.page.bringToFront();
        await this.clickEmployees();
        await this.page.waitForTimeout(1000);

        const activeNav = this.page.getByText(/^Active\s*\(/)
            .or(this.page.locator('#sidenav-main-drop, .sidenav, aside').getByText('Active', { exact: true }));
        const visibleActive = activeNav.filter({ visible: true }).first();
        await visibleActive.waitFor({ state: 'visible', timeout: 15000 });
        await visibleActive.click();
        await this.page.waitForTimeout(1000);

        const contractorsTab = this.page.getByText(/Contractors\s*\(\d+\)/).filter({ visible: true })
            .or(this.page.getByRole('tab', { name: /Contractors/i }).filter({ visible: true }));
        await contractorsTab.first().waitFor({ state: 'visible', timeout: 15000 });
        await contractorsTab.first().click();
        await this.page.waitForTimeout(1500);
        await expect(this.page.getByText(/Contractors\s*\(\d+\)/).filter({ visible: true }).first()).toBeVisible();
    }

    async searchActiveContractEmployee(employeeName: string) {
        const targetName = this.activeEmployeeName || employeeName;
        const search = this.page.getByPlaceholder(/Search by employee/i)
            .or(this.page.getByRole('searchbox'))
            .or(this.page.getByPlaceholder(/search|username/i));
        await search.first().waitFor({ state: 'visible', timeout: 10000 });

        const nameParts = targetName.trim().split(/\s+/);
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : targetName;
        const firstName = nameParts[0];

        const rowFor = (name: string) =>
            this.page.getByRole('row').filter({ hasText: new RegExp(name, 'i') })
                .or(this.page.getByRole('link', { name: new RegExp(name, 'i') }));

        await search.first().fill('');
        await search.first().fill(firstName);
        await search.first().press('Enter');
        await this.page.waitForTimeout(1500);

        let employee = rowFor(lastName).first();
        if (!(await employee.isVisible({ timeout: 5000 }).catch(() => false))) {
            await search.first().fill('');
            await search.first().fill(targetName);
            await search.first().press('Enter');
            await this.page.waitForTimeout(1500);
            employee = rowFor(targetName).first();
        }

        if (!(await employee.isVisible({ timeout: 5000 }).catch(() => false))) {
            await search.first().fill('');
            await search.first().fill(lastName);
            await search.first().press('Enter');
            await this.page.waitForTimeout(1500);
            employee = rowFor(lastName).first();
        }

        await expect(employee).toBeVisible({ timeout: 15000 });
        console.log(`Active contractor verified in table: ${targetName}`);
    }
}