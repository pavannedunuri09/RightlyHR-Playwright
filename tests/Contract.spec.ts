import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Contract } from '../pages/Contract';

test.describe.serial(
    'Contract Flow - Part 1',
    () => {

        let hrPage: Page;
        let yopmailPage: Page;
        let onboardingPage: Page;

        let contract: Contract;

        let onboardingUsername = '';
        let onboardingPassword = '';

        // ==================================================
        // HR LOGIN
        // ==================================================

        test.beforeAll(
            async ({ browser }) => {

                hrPage = await browser.newPage();

                const login =
                    new LoginPage(hrPage);

                await hrPage.goto('/login');

                await login.login(
                    process.env.HR_USERNAME!,
                    process.env.HR_PASSWORD!
                );

                await hrPage.waitForTimeout(3000);

                contract =
                    new Contract(hrPage);
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
                    contract.employees
                ).toBeVisible();

                console.log(
                    'TC01 PASSED - HR clicked Employee'
                );
                await employeePage.waitForTimeout(5000);
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

                await contract.fillContractEmployeeDetails();

                await contract.clickAdd();

                await expect(
                    hrPage.getByText(
                        'prospec contractor',
                        { exact: true }
                    )
                ).toBeVisible({
                    timeout: 15000
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

                await contract.clickCreatedEmployee();

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
                    'proscon'
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
            async () => {

                await contract.uploadMandatoryDocuments(
                    onboardingPage
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

                await contract.clickEmployeeAfterSubmission();

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
                    contract.onboardingDocuments
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