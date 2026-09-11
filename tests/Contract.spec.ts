import fs from 'fs';
import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Contract, type ContractEmployee } from '../pages/Contract';
import { createOnboardingFiles } from './fixtures/onboardingFiles';

test.describe.serial(
    'Contract Flow - Part 1',
    () => {

        let hrPage: Page;
        let yopmailPage: Page;
        let onboardingPage: Page;

        let contract: Contract;

        let onboardingUsername = '';
        let onboardingPassword = '';

        const suffix = Array.from({ length: 4 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
        const employee: ContractEmployee & { fullName: string } = {
            firstName: 'prospec',
            lastName: `contractor${suffix}`,
            fullName: `prospec contractor${suffix}`,
            email: `proscon${Date.now()}@yopmail.com`,
        };

        // ==================================================
        // HR LOGIN
        // ==================================================

        test.beforeAll(
            async ({ browser }) => {
                const hrUsername = process.env.HR_USERNAME || process.env.LOGIN_EMAIL;
                const hrPassword = process.env.HR_PASSWORD || process.env.LOGIN_PASSWORD;

                if (hrUsername && hrPassword) {
                    hrPage = await browser.newPage();
                    const login = new LoginPage(hrPage);
                    await hrPage.goto('/login');
                    await login.login(hrUsername, hrPassword);
                    await hrPage.waitForURL(url => !url.pathname.includes('/login'), { timeout: 30000 }).catch(() => { });
                    await hrPage.waitForTimeout(2000);
                    await hrPage.context().storageState({ path: '.auth/user.json' }).catch(() => { });
                } else if (fs.existsSync('.auth/user.json')) {
                    const context = await browser.newContext({ storageState: '.auth/user.json' });
                    hrPage = await context.newPage();
                    await hrPage.goto('/', { waitUntil: 'domcontentloaded' });
                    await hrPage.waitForTimeout(2000);
                } else {
                    hrPage = await browser.newPage();
                    await hrPage.goto('/login');
                }

                contract = new Contract(hrPage);
            }
        );

        // ==================================================
        // TC01
        // ==================================================

        test(
            'TC01 - HR should be able to click Employee',
            async () => {

                await contract.clickEmployees();

                await expect(
                    contract.employees.first()
                ).toBeVisible();

                console.log(
                    'TC01 PASSED - HR clicked Employee'
                );
            }
        );

        // ==================================================
        // TC02
        // ==================================================

        test(
            'TC02 - HR should be able to click Prospective employee tab',
            async () => {

                await contract.clickProspectiveEmployee();

                await expect(
                    contract.prospectiveEmployeeTab
                ).toBeVisible();

                console.log(
                    'TC02 PASSED - HR clicked Prospective employee tab'
                );
            }
        );

        // ==================================================
        // TC03
        // ==================================================

        test(
            'TC03 - HR should be able to click Contract tab',
            async () => {

                await contract.clickContractTab();

                await expect(
                    contract.contractorsTab
                ).toBeVisible();

                console.log(
                    'TC03 PASSED - HR clicked Contract tab'
                );
            }
        );

        // ==================================================
        // TC04
        // ==================================================

        test(
            'TC04 - HR should be able to click Add Contract Employee button',
            async () => {

                await contract.clickAddContractEmployee();

                await expect(
                    contract.firstNameInput
                ).toBeVisible();

                console.log(
                    'TC04 PASSED - HR clicked Add Contract Employee'
                );
            }
        );

        // ==================================================
        // TC05
        // ==================================================

        test(
            'TC05 - HR should submit mandatory fields and click Submit button',
            async () => {

                await contract.fillContractEmployeeDetails(employee);

                await contract.clickAdd();

                const employeeRow = hrPage.getByRole('row').filter({ hasText: employee.email });
                await expect(
                    employeeRow
                ).toBeVisible({
                    timeout: 20000
                });

                console.log(
                    'TC05 PASSED - Contract employee created successfully'
                );
            }
        );

        // ==================================================
        // TC06
        // ==================================================

        test(
            'TC06 - HR should click on employee name which he created before',
            async () => {

                await contract.clickCreatedEmployee(
                    employee.email,
                    employee.fullName
                );

                console.log(
                    'TC06 PASSED - HR clicked created employee'
                );
            }
        );

        // ==================================================
        // TC07
        // ==================================================

        test(
            'TC07 - HR should click on Request Documents button',
            async () => {

                await contract.clickRequestDocuments();

                console.log(
                    'TC07 PASSED - HR clicked Request for Documents'
                );
            }
        );

        // ==================================================
        // TC08
        // ==================================================

        test(
            'TC08 - HR should be able to open Yopmail in new window',
            async () => {

                yopmailPage =
                    await contract.openYopmail();

                await expect(
                    yopmailPage
                ).toHaveURL(
                    /yopmail\.com/
                );

                console.log(
                    'TC08 PASSED - Yopmail opened in new window'
                );
            }
        );

        // ==================================================
        // TC09
        // ==================================================

        test(
            'TC09 - HR should navigate to prospective employee Yopmail inbox',
            async () => {

                await contract.openYopmailInbox(
                    yopmailPage,
                    employee.email
                );

                console.log(
                    'TC09 PASSED - Yopmail inbox opened'
                );
            }
        );

        // ==================================================
        // TC10
        // ==================================================

        test(
            'TC10 - HR should get email and password from email',
            async () => {

                const credentials =
                    await contract.getCredentialsFromEmail(
                        yopmailPage
                    );

                onboardingUsername =
                    credentials.username;

                onboardingPassword =
                    credentials.password;

                expect(
                    onboardingUsername
                ).toBeTruthy();

                expect(
                    onboardingPassword
                ).toBeTruthy();

                console.log(
                    'TC10 PASSED - Credentials retrieved from onboarding email'
                );
            }
        );

        // ==================================================
        // TC11
        // ==================================================

        test(
            'TC11 - HR should click Click Here and navigate to login page',
            async () => {

                onboardingPage =
                    await contract.clickHereFromEmail(
                        yopmailPage
                    );

                await expect(
                    onboardingPage.getByRole(
                        'textbox',
                        { name: 'Username*' }
                    )
                ).toBeVisible({
                    timeout: 15000
                });

                console.log(
                    'TC11 PASSED - Click Here navigated to login page'
                );
            }
        );

        // ==================================================
        // TC12
        // ==================================================

        test(
            'TC12 - Enter email and password from Yopmail and login',
            async () => {

                await contract.loginProspectiveEmployee(
                    onboardingPage,
                    onboardingUsername,
                    onboardingPassword
                );

                console.log(
                    'TC12 PASSED - Prospective employee logged in'
                );
            }
        );

        // ==================================================
        // TC13
        // ==================================================

        test(
            'TC13 - Submit mandatory fields and click Next button',
            async () => {

                await contract.fillPersonalDetails(
                    onboardingPage
                );

                console.log(
                    'TC13 PASSED - Mandatory fields submitted and Next clicked'
                );
            }
        );

        // ==================================================
        // TC14
        // ==================================================

        test(
            'TC14 - Submit mandatory documents and click Submit button',
            async ({ }, testInfo) => {
                const files = createOnboardingFiles(testInfo.outputDir);

                await contract.uploadMandatoryDocuments(
                    onboardingPage,
                    files.pdf,
                    files.image
                );

                console.log(
                    'TC14 PASSED - Mandatory documents submitted'
                );
            }
        );

        // ==================================================
        // TC15
        // ==================================================

        test(
            'TC15 - HR should be able to click on employee name',
            async () => {

                await contract.clickEmployeeAfterSubmission(
                    employee.email,
                    employee.fullName
                );

                console.log(
                    'TC15 PASSED - HR clicked employee name'
                );
            }
        );

        // ==================================================
        // TC16
        // ==================================================

        test(
            'TC16 - HR should click Job tab and Onboarding Documents',
            async () => {

                await contract.clickJobAndOnboardingDocuments();

                await expect(
                    contract.onboardingDocuments.first()
                ).toBeVisible();

                console.log(
                    'TC16 PASSED - HR opened Onboarding Documents'
                );
            }
        );

        // ==================================================
        // TC17
        // ==================================================

        test(
            'TC17 - HR should click Kebab menu and Approve button',
            async () => {

                await contract.clickKebabMenu();

                await contract.clickApprove();

                console.log(
                    'TC17 PASSED - HR clicked Kebab menu and Approve'
                );
            }
        );

        // ==================================================
        // TC18
        // ==================================================

        test(
            'TC18 - HR should check all documents are approved',
            async () => {

                await contract.verifyAllDocumentsApproved();

                console.log(
                    'TC18 PASSED - All documents are approved'
                );
            }
        );

        // ==================================================
        // TC19
        // ==================================================

        test(
            'TC19 - HR should click Generate Documents button',
            async () => {
                await contract.clickEmployees();
                await contract.clickGenerateDocuments();

                await expect(
                    hrPage.getByText('Contract Offer Letter', { exact: true }).first()
                ).toBeVisible({ timeout: 15000 });

                console.log(
                    'TC19 PASSED - Generate Documents clicked'
                );
            }
        );

        // ==================================================
        // TC20
        // ==================================================

        test(
            'TC20 - HR should click Contract Offer Letter tab',
            async () => {
                await contract.clickContractOfferLetter();

                await expect(
                    hrPage.getByRole('combobox', {
                        name: 'Please select employee'
                    })
                ).toBeVisible({ timeout: 15000 });

                console.log(
                    'TC20 PASSED - Contract Offer Letter page opened'
                );
            }
        );

        // ==================================================
        // TC21
        // ==================================================

        test(
            'TC21 - HR should select employee and submit mandatory fields',
            async () => {
                await contract.fillContractOfferMandatoryFields(
                    employee.fullName
                );

                console.log(
                    'TC21 PASSED - Contract Offer mandatory fields submitted'
                );
            }
        );

        // ==================================================
        // TC22
        // ==================================================

        test(
            'TC22 - HR should generate Contract Offer document and request approval',
            async () => {
                await contract.clickGenerateOfferDocument();
                await contract.clickRequestForApproval();

                console.log(
                    'TC22 PASSED - Contract Offer generated and approval requested'
                );
            }
        );

        // ==================================================
        // TC23
        // ==================================================

        test(
            'TC23 - HR should open Pending Approvals Onboarding Contract Offer',
            async () => {
                await contract.openContractOfferPendingApproval();

                await expect(
                    hrPage.getByText(/Contract Offer/i).first()
                ).toBeVisible({ timeout: 15000 });

                console.log(
                    'TC23 PASSED - Contract Offer approval request opened'
                );
            }
        );

        // ==================================================
        // TC24
        // ==================================================

        test(
            'TC24 - HR should approve and release Contract Offer',
            async () => {
                await contract.approveContractOffer(employee.fullName);
                await contract.releaseContractOffer(employee.fullName);

                console.log(
                    'TC24 PASSED - Contract Offer approved and released'
                );
            }
        );

        // ==================================================
        // TC25
        // ==================================================

        test(
            'TC25 - Prospective contract employee should receive email and credentials',
            async () => {
                await hrPage.bringToFront();

                if (!yopmailPage) {
                    yopmailPage = await contract.openYopmail();
                }

                await contract.openYopmailInbox(
                    yopmailPage,
                    employee.email
                );

                const credentials =
                    await contract.getContractOfferCredentials(
                        yopmailPage
                    );

                onboardingUsername = credentials.username;
                onboardingPassword = credentials.password;

                expect(onboardingUsername).toBeTruthy();
                expect(onboardingPassword).toBeTruthy();

                console.log(
                    'TC25 PASSED - Contract prospective credentials received'
                );
            }
        );

        // ==================================================
        // TC26
        // ==================================================

        test(
            'TC26 - Prospective contract employee should click login link',
            async () => {
                onboardingPage =
                    await contract.clickContractOfferLoginLink(
                        yopmailPage
                    );

                await expect(
                    onboardingPage.getByRole('textbox', {
                        name: 'Username*'
                    })
                ).toBeVisible({
                    timeout: 15000
                });

                console.log(
                    'TC26 PASSED - Contract prospective login page opened'
                );
            }
        );

        // ==================================================
        // TC27
        // ==================================================

        test(
            'TC27 - Prospective contract employee should login with received credentials',
            async () => {
                await contract.loginProspectiveEmployee(
                    onboardingPage,
                    onboardingUsername,
                    onboardingPassword
                );

                console.log(
                    'TC27 PASSED - Contract prospective employee logged in'
                );
            }
        );


        // ==================================================
        // TC28
        // ==================================================

        test(
            'TC28 - Prospective contract employee should navigate to Contract Offer Letter',
            async () => {
                await contract.clickNextFromOnboarding(onboardingPage);
                await contract.navigateToContractOfferPage(onboardingPage);

                console.log(
                    'TC28 PASSED - Contract Offer Letter page displayed'
                );
            }
        );

        // ==================================================
        // TC29
        // ==================================================

        test(
            'TC29 - Prospective contract employee should reject Contract Offer',
            async () => {
                await contract.rejectContractOfferFromPortal(
                    onboardingPage
                );

                await expect(
                    onboardingPage.getByRole('textbox', {
                        name: 'Username*'
                    })
                ).toBeVisible({
                    timeout: 15000
                });

                console.log(
                    'TC29 PASSED - Contract Offer rejected and login page displayed'
                );
            }
        );

        // ==================================================
        // TC30
        // ==================================================

        test(
            'TC30 - HR should regenerate Contract Offer Letter',
            async () => {
                await hrPage.bringToFront();

                await contract.regenerateContractOffer(
                    employee.fullName
                );

                // The regenerated offer must go through approval and release
                // before the prospective employee can receive new credentials.
                await contract.openContractOfferPendingApproval();
                await contract.approveContractOffer(employee.fullName);
                await contract.releaseContractOffer(employee.fullName);

                console.log(
                    'TC30 PASSED - Contract Offer Letter regenerated, approved and released'
                );
            }
        );

        // ==================================================
        // TC31
        // ==================================================

        test(
            'TC31 - Prospective contract employee should login with regenerated credentials',
            async () => {
                if (!yopmailPage) {
                    yopmailPage = await contract.openYopmail();
                }

                await contract.openYopmailInbox(
                    yopmailPage,
                    employee.email
                );

                const credentials =
                    await contract.getContractOfferCredentials(
                        yopmailPage
                    );

                onboardingUsername = credentials.username;
                onboardingPassword = credentials.password;

                if (!onboardingPage || onboardingPage.isClosed()) {
                    onboardingPage =
                        await contract.clickContractOfferLoginLink(
                            yopmailPage
                        );
                } else {
                    await onboardingPage.goto(
                        credentials.loginUrl || onboardingPage.url()
                    ).catch(() => { });
                }

                await contract.loginProspectiveEmployee(
                    onboardingPage,
                    onboardingUsername,
                    onboardingPassword,
                    yopmailPage
                );

                console.log(
                    'TC31 PASSED - Prospective contract employee logged in with regenerated credentials'
                );
            }
        );

        // ==================================================
        // TC32
        // ==================================================

        test(
            'TC32 - Prospective contract employee should navigate again to Contract Offer Letter',
            async () => {
                await contract.clickNextFromOnboarding(
                    onboardingPage
                );

                await contract.clickNextFromOnboarding(
                    onboardingPage
                );

                await contract.navigateToContractOfferPage(
                    onboardingPage
                );

                console.log(
                    'TC32 PASSED - Contract Offer Letter page opened again'
                );
            }
        );

        // ==================================================
        // TC33
        // ==================================================

        test(
            'TC33 - Prospective contract employee should accept Contract Offer',
            async () => {
                await contract.acceptContractOffer(
                    onboardingPage
                );

                console.log(
                    'TC33 PASSED - Contract Offer accepted'
                );
            }
        );

        // ==================================================
        // TC34
        // ==================================================

        test(
            'TC34 - Prospective contract employee should submit education details',
            async () => {
                await contract.submitEducationDetails(
                    onboardingPage
                );

                console.log(
                    'TC34 PASSED - Education details submitted'
                );
            }
        );

        // ==================================================
        // TC35
        // ==================================================

        test(
            'TC35 - Prospective contract employee should submit emergency contact details',
            async () => {
                await contract.submitEmergencyContacts(
                    onboardingPage
                );

                console.log(
                    'TC35 PASSED - Emergency contact details submitted'
                );
            }
        );

        // ==================================================
        // TC36
        // ==================================================

        test(
            'TC36 - Prospective contract employee should submit or skip previous experience',
            async () => {
                await contract.submitPreviousExperienceIfRequired(
                    onboardingPage
                );

                console.log(
                    'TC36 PASSED - Previous experience handled'
                );
            }
        );

        // ==================================================
        // TC37
        // ==================================================

        test(
            'TC37 - Prospective contract employee should submit all remaining fields',
            async () => {
                await contract.submitRemainingFields(
                    onboardingPage
                );

                console.log(
                    'TC37 PASSED - All remaining fields submitted'
                );
            }
        );

        // ==================================================
        // TC38
        // ==================================================

        test(
            'TC38 - HR should generate NDA Letter',
            async () => {
                await hrPage.bringToFront();

                await contract.clickNDALetter();

                console.log(
                    'TC38 PASSED - NDA Letter page opened'
                );
            }
        );

        // ==================================================
        // TC39
        // ==================================================

        test(
            'TC39 - HR should generate and release NDA Letter',
            async () => {
                await contract.fillNDAMandatoryFields(
                    employee.fullName
                );

                await contract.generateAndReleaseNDALetter();

                console.log(
                    'TC39 PASSED - NDA Letter generated and released'
                );
            }
        );

        // ==================================================
        // TC40
        // ==================================================

        test(
            'TC40 - Prospective contract employee should login to onboarding portal',
            async () => {
                await onboardingPage.bringToFront();

                await contract.loginProspectiveEmployee(
                    onboardingPage,
                    onboardingUsername,
                    onboardingPassword,
                    yopmailPage
                );

                console.log(
                    'TC40 PASSED - Prospective contract employee logged in'
                );
            }
        );

        // ==================================================
        // TC41
        // ==================================================

        test(
            'TC41 - Prospective contract employee should navigate to NDA Letter',
            async () => {
                await contract.navigateToNDA(
                    onboardingPage
                );

                console.log(
                    'TC41 PASSED - NDA Letter page displayed'
                );
            }
        );

        // ==================================================
        // TC42
        // ==================================================

        test(
            'TC42 - Prospective contract employee should approve and submit NDA Letter',
            async () => {
                await contract.approveAndSubmitNDA(
                    onboardingPage
                );

                console.log(
                    'TC42 PASSED - NDA Letter approved and submitted'
                );
            }
        );

        // ==================================================
        // TC43
        // ==================================================

        test(
            'TC43 - HR clicks Employees -> Prospective -> Contract -> searches employee -> clicks employee name -> clicks Job Tab -> clicks Onboarding details tab',
            async () => {
                await hrPage.bringToFront();

                // 1. HR clicks on Employees tab
                await contract.clickEmployees();
                await expect(
                    contract.employees.first()
                ).toBeVisible();

                // 2. HR clicks on Prospective
                await contract.clickProspectiveEmployee();
                await expect(
                    contract.prospectiveEmployeeTab
                ).toBeVisible();

                // 3. HR clicks on Contract tab
                await contract.clickContractTab();
                await expect(
                    contract.contractorsTab.first()
                ).toBeVisible();

                // 4. Search employee, click employee name, click Job Tab and click Onboarding details tab
                await contract.openEmployeeJobOnboardingDocuments(
                    employee.fullName
                );

                console.log(
                    'TC43 PASSED - HR opened employee Job Tab and Onboarding details tab'
                );
            }
        );

        // ==================================================
        // TC44
        // ==================================================

        test(
            'TC44 - HR should click Edit and open Status field',
            async () => {
                await contract.clickEditAndOpenStatus();

                console.log(
                    'TC44 PASSED - Edit and Status field opened'
                );
            }
        );

        // ==================================================
        // TC45
        // ==================================================

        test(
            'TC45 - HR should change status to Active Contract',
            async () => {
                await contract.changeStatusToActiveContract();

                console.log(
                    'TC45 PASSED - Status changed to Active Contract'
                );
            }
        );

        // ==================================================
        // TC46
        // ==================================================

        test(
            'TC46 - HR should open Active Contractors',
            async () => {
                await contract.openActiveContractors();

                console.log(
                    'TC46 PASSED - Active Contractors opened'
                );
            }
        );

        // ==================================================
        // TC47
        // ==================================================

        test(
            'TC47 - HR should search employee in Active Contractors',
            async () => {
                await contract.searchActiveContractEmployee(
                    employee.fullName
                );

                console.log(
                    'TC47 PASSED - Employee displayed in Active Contractors'
                );
            }
        );


        // ==================================================
        // CLEANUP
        // ==================================================

        test.afterAll(
            async () => {

                if (onboardingPage) {
                    await onboardingPage.close();
                }

                if (yopmailPage) {
                    await yopmailPage.close();
                }

                if (hrPage) {
                    await hrPage.close();
                }
            }
        );
    }
);