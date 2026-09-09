    import { Page, Locator } from '@playwright/test';

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

        this.prospectiveEmployeeTab = page.getByText(
            /Prospective\(\d+\)/,
            { exact: true }
        );

        this.contractorsTab = page.getByRole('link', {
            name: /Contractors \(\d+\)/
        });

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
        await this.prospectiveEmployeeTab.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.prospectiveEmployeeTab.click();

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

    async fillContractEmployeeDetails() {

        await this.firstNameInput.fill('prospec');

        await this.lastNameInput.fill('contractor');

        await this.personalEmailInput.fill(
            'proscon@yopmail.com'
        );

        await this.designationDropdown.click();

        await this.page.getByRole('option', {
            name: 'Director of HR'
        }).click();

        await this.employmentTypeDropdown.click();

        await this.page.getByRole('option', {
            name: 'Fresher'
        }).click();

        await this.locationDropdown.click();

        await this.page.getByRole('option', {
            name: 'Hyderabad'
        }).click();

        await this.sublocationDropdown.click();

        await this.page.getByText(
            'Jai Hind Enclave building'
        ).click();
    }

    async clickAdd() {
        await this.addButton.click();

        await this.page.waitForTimeout(1500);
    }

    // --------------------------------------------------
    // TC06
    // --------------------------------------------------

    async clickCreatedEmployee() {
        await this.page.getByText(
            'prospec contractor',
            { exact: true }
        ).waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.page.getByText(
            'prospec contractor',
            { exact: true }
        ).click();

        await this.page.waitForTimeout(1500);
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

        await this.page.waitForTimeout(1000);
    }

    // --------------------------------------------------
    // TC08
    // --------------------------------------------------

    async openYopmail() {

        const yopmailPage = await this.page.context().newPage();

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

        const loginField = yopmailPage.getByRole(
            'textbox',
            { name: 'Login' }
        );

        await loginField.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await loginField.fill(emailName);

        await yopmailPage.getByTitle(
            'Check Inbox @yopmail.com'
        ).click();

        await yopmailPage.waitForTimeout(3000);
    }

    // --------------------------------------------------
    // TC10
    // --------------------------------------------------

    async getCredentialsFromEmail(
        yopmailPage: Page
    ) {

        const mailFrame = yopmailPage.locator(
            'iframe[name="ifmail"]'
        ).contentFrame();

        await mailFrame.getByRole(
            'cell'
        ).first().waitFor({
            state: 'visible',
            timeout: 15000
        });

        const emailBody =
            await mailFrame.getByRole(
                'cell'
            ).first().innerText();

        const usernameMatch =
            emailBody.match(
                /Username\s*:\s*([^\s]+)/i
            );

        const passwordMatch =
            emailBody.match(
                /Password\s*:\s*([^\s]+)/i
            );

        if (!usernameMatch) {
            throw new Error(
                'Username not found in onboarding email'
            );
        }

        if (!passwordMatch) {
            throw new Error(
                'Password not found in onboarding email'
            );
        }

        return {
            username: usernameMatch[1],
            password: passwordMatch[1]
        };
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

        await onboardingPage.getByRole(
            'combobox',
            { name: 'Please select salutation' }
        ).click();

        await onboardingPage.getByText(
            'Mr.',
            { exact: true }
        ).click();

        await onboardingPage.locator(
            '#gender'
        ).click();

        await onboardingPage.getByRole(
            'option',
            { name: 'Male', exact: true }
        ).click();

        await onboardingPage.getByText(
            'Select country'
        ).click();

        await onboardingPage.locator(
            'lib-country-list'
        ).getByRole('textbox').fill('india');

        await onboardingPage.getByText(
            'India (भारत)'
        ).click();

        await onboardingPage.getByRole(
            'textbox',
            { name: 'Please enter your mobile' }
        ).fill('9874544645');

        await onboardingPage.getByRole(
            'textbox',
            { name: 'Date Of Birth *' }
        ).fill('2000-06-06');

        await onboardingPage.locator(
            '#currentzipCode'
        ).fill('500081');

        await onboardingPage.getByRole(
            'textbox',
            { name: 'Country*' }
        ).fill('india');

        await onboardingPage.locator(
            '#currentState'
        ).fill('TG');

        await onboardingPage.locator(
            '#currentCity'
        ).fill('Hyderabad');

        await onboardingPage.getByRole(
            'textbox',
            { name: 'Address Line2' }
        ).fill('chandha nagar');

        await onboardingPage.locator(
            '#currentAddressLine1'
        ).fill('Meerut colony');

        await onboardingPage.getByRole(
            'checkbox',
            { name: 'Same as Current Address' }
        ).check();

        await onboardingPage.getByRole(
            'button',
            { name: 'Next' }
        ).click();

        await onboardingPage.waitForTimeout(1500);
    }

    // --------------------------------------------------
    // TC14
    // --------------------------------------------------

    async uploadMandatoryDocuments(
        onboardingPage: Page
    ) {

        // Bank letter
        const bankLetter =
            onboardingPage.getByRole(
                'row',
                {
                    name: 'Bank letter - - - Requested'
                }
            );

        await bankLetter.getByRole(
            'button'
        ).click();

        // Use your actual file path here
        await onboardingPage.getByRole(
            'button',
            { name: 'Choose File' }
        ).setInputFiles(
            'Screenshot 2026-06-23 161210.png'
        );

        await onboardingPage.getByRole(
            'button',
            { name: 'Upload' }
        ).click();

        // Resume
        const resume =
            onboardingPage.getByRole(
                'row',
                {
                    name: 'Resume* - - - Requested'
                }
            );

        await resume.getByRole(
            'button'
        ).click();

        await onboardingPage.getByRole(
            'button',
            { name: 'Choose File' }
        ).setInputFiles(
            'Screenshot 2026-06-24 161649.png'
        );

        await onboardingPage.getByRole(
            'button',
            { name: 'Upload' }
        ).click();

        // PAN
        const pan =
            onboardingPage.getByRole(
                'row',
                {
                    name: /PAN\*/
                }
            );

        await pan.getByRole(
            'button'
        ).click();

        await onboardingPage.getByRole(
            'button',
            { name: 'Choose File' }
        ).setInputFiles(
            'Screenshot 2026-06-24 172317.png'
        );

        await onboardingPage.getByRole(
            'textbox',
            {
                name: 'Document Number*'
            }
        ).fill('123SDS3212');

        await onboardingPage.getByRole(
            'button',
            { name: 'Upload' }
        ).click();

        await onboardingPage.getByRole(
            'button',
            { name: 'Submit' }
        ).click();

        await onboardingPage.waitForTimeout(2000);
    }

    // --------------------------------------------------
    // TC15
    // --------------------------------------------------

    async clickEmployeeAfterSubmission() {

        await this.employees.click();

        await this.page.waitForTimeout(1000);

        await this.page.getByText(
            'prospec contractor',
            { exact: true }
        ).click();

        await this.page.waitForTimeout(1000);
    }

    // --------------------------------------------------
    // TC16
    // --------------------------------------------------

    async clickJobAndOnboardingDocuments() {

        await this.jobTab.click();

        await this.page.waitForTimeout(1000);

        await this.onboardingDocuments.click();

        await this.page.waitForTimeout(1500);
    }

    // --------------------------------------------------
    // TC17
    // --------------------------------------------------

    async clickKebabMenu() {

        const kebabMenus =
            this.page.locator('.dropdown > a');

        const count =
            await kebabMenus.count();

        console.log(
            'Kebab menus found:',
            count
        );

        for (let i = 0; i < count; i++) {

            if (
                await kebabMenus.nth(i).isVisible()
            ) {

                await kebabMenus.nth(i)
                    .scrollIntoViewIfNeeded();

                await kebabMenus.nth(i).click();

                await this.page.waitForTimeout(500);

                return;
            }
        }

        throw new Error(
            'No visible kebab menu found'
        );
    }

    async clickApprove() {

        const approveOptions =
            this.page.getByText(
                'Approve',
                { exact: true }
            );

        const count =
            await approveOptions.count();

        for (let i = 0; i < count; i++) {

            if (
                await approveOptions.nth(i).isVisible()
            ) {

                await approveOptions.nth(i).click();

                await this.page.waitForTimeout(1000);

                return;
            }
        }

        throw new Error(
            'No visible Approve option found'
        );
    }

    // --------------------------------------------------
    // TC18
    // --------------------------------------------------

    async verifyAllDocumentsApproved() {

        const verifyReject =
            this.page.getByRole('cell').filter({
                hasText: 'VerifyReject'
            });

        const count =
            await verifyReject.count();

        console.log(
            'Documents requiring verification:',
            count
        );

        if (count > 0) {
            throw new Error(
                'One or more documents are still pending verification'
            );
        }

        console.log(
            'All documents are approved'
        );
    }
}