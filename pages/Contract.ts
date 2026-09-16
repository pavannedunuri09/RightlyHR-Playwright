import { Page, Locator } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { YopmailPage } from './YopmailPage';

export class Contract {
    readonly page: Page;
    createdEmployeeName = '';
    createdEmployeeEmail = '';

    private createRandomUploadFile(documentName: string): string {
        const fileName = `${documentName}-${Date.now()}-${Math.floor(Math.random() * 100000)}.png`;
        const filePath = path.join(os.tmpdir(), fileName);
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
        const firstNames = [
            'Ramesh', 'Suresh', 'Arjun', 'Kiran', 'Vikram',
            'Mahesh', 'Naveen', 'Prakash', 'Anil', 'Ravi',
        ];
        const lastNames = [
            'Chandra', 'Kumar', 'Sharma', 'Reddy', 'Rao',
            'Patel', 'Verma', 'Gupta', 'Iyer', 'Naidu',
        ];
        const seed = Date.now() + Math.floor(Math.random() * 1000);
        const firstName = firstNames[seed % firstNames.length];
        const lastName = lastNames[Math.floor(seed / firstNames.length) % lastNames.length];
        this.createdEmployeeName = `${firstName} ${lastName}`;

        await this.firstNameInput.fill(firstName);

        await this.lastNameInput.fill(lastName);

        this.createdEmployeeEmail = `${firstName}.${lastName}@yopmail.com`;
        await this.personalEmailInput.fill(this.createdEmployeeEmail);

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

        await this.page.getByRole('option', {
            name: 'Jai Hind Enclave building',
            exact: true
        }).click();
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
            this.createdEmployeeName,
            { exact: true }
        ).waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.page.getByText(
            this.createdEmployeeName,
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
        return await yopmail.readCredentials({
            preferPattern: /Request for Documents Upload|Request for Documents/i,
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

        await onboardingPage.getByRole(
            'button',
            { name: 'Choose File' }
        ).setInputFiles(
            this.createRandomUploadFile('bank-letter')
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
            this.createRandomUploadFile('resume')
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
            this.createRandomUploadFile('pan')
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

        // Aadhaar
        const aadhaar =
            onboardingPage.getByRole(
                'row',
                {
                    name: /Aadhaar\*/
                }
            );

        await aadhaar.getByRole(
            'button'
        ).click();

        await onboardingPage.getByRole(
            'button',
            { name: 'Choose File' }
        ).setInputFiles(
            this.createRandomUploadFile('aadhaar')
        );

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
            this.createdEmployeeName,
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