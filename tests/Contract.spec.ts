import fs from 'fs';
    import { expect, type Locator, type Page } from '@playwright/test';
    import { YopmailPage } from '../pages/YopmailPage';

    type ContractEmployee = {
        firstName: string;
        lastName: string;
        email: string;
    };

export class Contract {
    readonly page: Page;

    // Employee / Contract navigation
    readonly employees: Locator;
    readonly prospectiveEmployeeTab: Locator;
    readonly contractorsTab: Locator;
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
        this.employees = page.getByText('Employees', {
            exact: true
        });

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
            { name: 'Please select sublocation' }
        );

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

    // --------------------------------------------------
    // TC01
    // --------------------------------------------------

    async clickEmployees() {
        await this.employees.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.employees.click();

        await this.page.waitForTimeout(1000);
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
        await this.contractorsTab.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.contractorsTab.click();

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

        await this.firstNameInput.fill(employee.firstName);

        await this.lastNameInput.fill(employee.lastName);

        await this.personalEmailInput.fill(employee.email);

        await this.designationDropdown.click();
        await this.selectOpenOption('Front End Developer');

        await this.employmentTypeDropdown.click();
        await this.selectFirstOpenOption();

        await this.locationDropdown.click();
        await this.selectOpenOption('Hyderabad');

        await this.sublocationDropdown.click();
        await this.selectOpenOption('Jai Hind Enclave building');

        await this.page.keyboard.press('Tab');
    }

    async clickAdd() {
        await expect(this.addButton).toBeEnabled({ timeout: 10000 });
        await this.addButton.click();

        await this.page.waitForTimeout(1500);
    }

    private async selectOpenOption(name: string) {
        const option = this.page.getByRole('option', { name, exact: true }).last();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
    }

    private async selectFirstOpenOption() {
        const option = this.page.getByRole('option')
            .filter({ hasNotText: /select|please/i })
            .last();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
    }

    // --------------------------------------------------
    // TC06
    // --------------------------------------------------

    async clickCreatedEmployee(email: string, fullName: string) {
        const searchbox = this.page.getByRole('searchbox', { name: 'Username' }).or(this.page.getByRole('searchbox'));
        await searchbox.first().fill(email);
        await searchbox.first().press('Enter');

        const row = this.page.getByRole('row').filter({ hasText: email }).first();
        await row.waitFor({ state: 'visible', timeout: 15000 });
        await row.getByRole('cell', { name: fullName, exact: true }).click();
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
            throw new Error('Unable to open Yopmail without a browser context');
        }
        const yopmailPage = await browser.newPage();

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
        const mailbox = emailName.includes('@') ? emailName.split('@')[0] : emailName;
        await yopmailPage.bringToFront();
        await yopmailPage.goto(`https://yopmail.com/en/?login=${encodeURIComponent(mailbox)}`, {
            waitUntil: 'domcontentloaded'
        });

        const mailFrame = yopmailPage.locator('iframe[name="ifmail"]');
        await mailFrame.waitFor({ state: 'attached', timeout: 30000 });
        await mailFrame.contentFrame().locator('body').waitFor({
            state: 'visible',
            timeout: 30000
        });
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
        password: string
    ) {

        await onboardingPage.getByRole(
            'textbox',
            { name: 'Username*' }
        ).fill(username);

        await onboardingPage.getByRole(
            'textbox',
            { name: 'Password*' }
        ).fill(password);

        await onboardingPage.getByRole(
            'button',
            { name: 'Login' }
        ).click();

        await onboardingPage.waitForTimeout(2000);
    }

    // --------------------------------------------------
    // TC13
    // --------------------------------------------------

    async fillPersonalDetails(
        onboardingPage: Page
    ) {
        const goToApplicationButton = onboardingPage.getByRole('button', { name: 'Go to Application' });
        if (await goToApplicationButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await goToApplicationButton.click();
        }

        await onboardingPage.getByRole(
            'combobox',
            { name: 'Please select salutation' }
        ).waitFor({ state: 'visible', timeout: 20000 });

        await onboardingPage.getByRole(
            'combobox',
            { name: 'Please select salutation' }
        ).click();

        await onboardingPage.getByText(
            'Mr.',
            { exact: true }
        ).click();

        await onboardingPage.getByRole('combobox', { name: 'Please select gender' }).click();

        await onboardingPage.getByRole(
            'option',
            { name: 'Male', exact: true }
        ).click();

        await onboardingPage.getByRole('combobox', { name: 'Select country' }).click()
            .catch(async () => onboardingPage.getByText('Select country').click());

        await onboardingPage.locator('lib-country-list').getByRole('textbox').fill('91');

        await onboardingPage.getByText(
            'India (भारत)'
        ).click();

        await onboardingPage.getByRole('textbox', { name: /Please enter your mobile/ }).fill('9874544645');

        await onboardingPage.getByRole(
            'textbox',
            { name: 'Date Of Birth *' }
        ).fill('2000-06-06');

        await onboardingPage.getByRole('textbox', { name: 'Zip Code*' }).first().fill('500081');

        await onboardingPage.getByRole('textbox', { name: 'Country*' }).fill('India');

        await onboardingPage.getByRole('textbox', { name: 'Please enter state' }).first().fill('Telangana');

        await onboardingPage.getByRole('textbox', { name: 'City*' }).first().fill('Hyderabad');
        await onboardingPage.getByRole('textbox', { name: 'Address Line 1*' }).first().fill('Meerut colony');

        await onboardingPage.getByRole(
            'checkbox',
            { name: 'Same as Current Address' }
        ).check();

        await onboardingPage.getByRole(
            'button',
            { name: 'Next' }
        ).click();

        await onboardingPage.getByRole('row', { name: /Requested/ }).first().waitFor({ state: 'visible', timeout: 20000 });
    }

    // --------------------------------------------------
    // TC14
    // --------------------------------------------------

    async uploadMandatoryDocuments(onboardingPage: Page, pdfPath: string, imagePath: string) {

        // ================================================
        // 1. AADHAAR
        // ================================================

        const aadhaarRow = onboardingPage
            .getByRole('row')
            .filter({ hasText: 'Aadhaar' })
            .first();

        await aadhaarRow.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await aadhaarRow
            .getByRole('button', {
                name: 'Upload',
                exact: true
            })
            .click();

        const aadhaarDialog = onboardingPage.getByRole('dialog');
        const aadhaarScope = (await aadhaarDialog.isVisible().catch(() => false))
            ? aadhaarDialog
            : onboardingPage.locator('body');

        await aadhaarScope
            .getByRole('button', {
                name: 'Choose File'
            })
            .setInputFiles(imagePath);

        const aadhaarUpload = aadhaarScope
            .getByRole('button', {
                name: 'Upload',
                exact: true
            });

        await expect(aadhaarUpload).toBeEnabled({
            timeout: 10000
        });

        await aadhaarUpload.click();

        await expect(
            onboardingPage.getByText(
                /Document uploaded successfully/i
            ).first()
        ).toBeVisible({
            timeout: 20000
        });

        await onboardingPage.keyboard.press('Escape').catch(() => {});


        // ================================================
        // 2. PAN
        // ================================================

        const panRow = onboardingPage
            .getByRole('row')
            .filter({ hasText: 'PAN' })
            .first();

        await panRow.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await panRow
            .getByRole('button', {
                name: 'Upload',
                exact: true
            })
            .click();

        const panDialog = onboardingPage.getByRole('dialog');
        const panScope = (await panDialog.isVisible().catch(() => false))
            ? panDialog
            : onboardingPage.locator('body');

        await panScope
            .getByRole('textbox', {
                name: /Document Number/i
            })
            .fill('ABCDE1234F');

        await panScope
            .getByRole('button', {
                name: 'Choose File'
            })
            .setInputFiles(imagePath);

        const panUpload = panScope
            .getByRole('button', {
                name: 'Upload',
                exact: true
            });

        await expect(panUpload).toBeEnabled({
            timeout: 10000
        });

        await panUpload.click();

        await expect(
            onboardingPage.getByText(
                /Document uploaded successfully/i
            ).first()
        ).toBeVisible({
            timeout: 20000
        });

        await onboardingPage.keyboard.press('Escape').catch(() => {});


        // ================================================
        // 3. RESUME
        // ================================================

        const resumeRow = onboardingPage
            .getByRole('row')
            .filter({ hasText: 'Resume' })
            .first();

        await resumeRow.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await resumeRow
            .getByRole('button', {
                name: 'Upload',
                exact: true
            })
            .click();

        const resumeDialog = onboardingPage.getByRole('dialog');
        const resumeScope = (await resumeDialog.isVisible().catch(() => false))
            ? resumeDialog
            : onboardingPage.locator('body');

        await resumeScope
            .getByRole('button', {
                name: 'Choose File'
            })
            .setInputFiles(pdfPath);

        const resumeUpload = resumeScope
            .getByRole('button', {
                name: 'Upload',
                exact: true
            });

        await expect(resumeUpload).toBeEnabled({
            timeout: 10000
        });

        await resumeUpload.click();

        await expect(
            onboardingPage.getByText(
                /Document uploaded successfully/i
            ).first()
        ).toBeVisible({
            timeout: 20000
        });

        await onboardingPage.keyboard.press('Escape').catch(() => {});


        // ================================================
        // 4. SUBMIT ALL DOCUMENTS
        // ================================================

        const submitButton = onboardingPage.getByRole('button', {
            name: 'Submit',
            exact: true
        });

        await submitButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await submitButton.click();


        // ================================================
        // 5. CONFIRM SUBMIT IF CONFIRMATION APPEARS
        // ================================================

        const confirmationText = onboardingPage.getByText(
            'Are you sure you want to'
        );

        if (
            await confirmationText
                .isVisible({ timeout: 3000 })
                .catch(() => false)
        ) {
            const confirmationDialog = onboardingPage.getByRole('dialog');

            await confirmationDialog
                .getByRole('button', {
                    name: 'Submit',
                    exact: true
                })
                .click();
        }


        // ================================================
        // 6. VERIFY SUBMISSION
        // ================================================

        await expect(
            onboardingPage.getByText(
                /Submitted successfully/i
            ).first()
        ).toBeVisible({
            timeout: 20000
        });
    }

    // --------------------------------------------------
    // TC15
    // --------------------------------------------------

    async clickEmployeeAfterSubmission(email: string, fullName: string) {

        await this.employees.click();

        await this.page.waitForTimeout(1000);

        await this.clickCreatedEmployee(email, fullName);
    }

    // --------------------------------------------------
    // TC16
    // --------------------------------------------------

    async clickJobAndOnboardingDocuments() {

        await this.jobTab.click();
        const documents = this.page.getByText('Onboarding Documents', { exact: true });
        const count = await documents.count();
        await (count > 1 ? documents.nth(1) : documents.first()).click();
        await this.page.getByRole('columnheader', { name: 'Document Type' }).waitFor({ state: 'visible', timeout: 20000 });
    }

    // --------------------------------------------------
    // TC17
    // --------------------------------------------------

    async clickKebabMenu() {

        const row = this.page.getByRole('row').filter({ hasText: /Bank letter|Resume|PAN/ }).first();
        const kebab = row.locator('td:last-child .dropdown, td .dropdown, .dropdown > a').last();
        await kebab.scrollIntoViewIfNeeded();
        await kebab.click();
    }

    async clickApprove() {

        const approve = this.page.getByText('Approve', { exact: true }).last();
        await approve.waitFor({ state: 'visible', timeout: 8000 });
        await approve.click();
    }

    // --------------------------------------------------
    // TC18
    // --------------------------------------------------

    async verifyAllDocumentsApproved() {

        await expect(this.page.getByRole('cell').filter({ hasText: /Verify|Reject/ })).toHaveCount(0);
    }
}