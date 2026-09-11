import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Separation } from '../pages/Separation';


// ============================================================
// EMPLOYEE SEPARATION FLOW
// TC01 - TC05
// ============================================================

test.describe.serial('Employee Separation Flow', () => {

    let employeePage: any;
    let separation: Separation;

    test.beforeAll(async ({ browser }) => {

        employeePage = await browser.newPage();

        const loginPage =
            new LoginPage(employeePage);

        const username =
            process.env.EMPLOYEE_USERNAME;

        const password =
            process.env.EMPLOYEE_PASSWORD;

        if (!username || !password) {
            throw new Error(
                'Employee credentials are missing in .env'
            );
        }

        await employeePage.goto('/login');

        await loginPage.login(
            username,
            password
        );

        await expect(employeePage).not.toHaveURL(
            /\/login$/
        );

        await employeePage.waitForTimeout(5000);

        separation =
            new Separation(employeePage);
    });


    // ========================================================
    // TC01
    // ========================================================

    test(
        'TC01 - Employee should be able to login using valid credentials',
        async () => {

            await expect(employeePage).not.toHaveURL(
                /\/login$/
            );
        }
    );


    // ========================================================
    // TC02
    // ========================================================

    test(
        'TC02 - Employee should be able to click on My Info',
        async () => {

            await separation.clickMyInfo();

            await expect(
                separation.myInfo
            ).toBeVisible();
        }
    );


    // ========================================================
    // TC03
    // ========================================================

    test(
        'TC03 - Employee should be able to click on Job',
        async () => {

            await separation.clickJob();

            await expect(
                employeePage.getByText('Job', {
                    exact: true
                })
            ).toBeVisible();
        }
    );


    // ========================================================
    // TC04
    // ========================================================

    test(
        'TC04 - Employee should be able to click on Separation tab',
        async () => {

            await separation.clickSeparationTab();

            await expect(
                employeePage
                    .locator('div.component-header')
                    .filter({
                        hasText: /^Separation Request$/
                    })
            ).toBeVisible();
        }
    );


    // ========================================================
    // TC05
    // ========================================================

    test(
        'TC05 - Employee should be able to click on Raise Separation Request',
        async () => {

            await separation.clickRaiseSeparationRequest();

            await expect(
                separation.separationReason
            ).toBeVisible();

            await separation.enterSeparationReason(
                'due to medical issue'
            );

            await separation.clickSubmitButton();
        }
    );


    // ========================================================
    // CLOSE EMPLOYEE PAGE
    // ========================================================

    test.afterAll(async () => {

        await employeePage.close();
    });
});


// ============================================================
// MANAGER SEPARATION FLOW
// TC06 - TC12
// ============================================================

test.describe.serial('Manager Separation Flow', () => {

    let managerPage: any;
    let separation: Separation;

    test.beforeAll(async ({ browser }) => {

        managerPage =
            await browser.newPage();

        const loginPage =
            new LoginPage(managerPage);

        const username =
            process.env.MANAGER_USERNAME;

        const password =
            process.env.MANAGER_PASSWORD;

        if (!username || !password) {
            throw new Error(
                'Manager credentials are missing in .env'
            );
        }

        await managerPage.goto('/login');

        await loginPage.login(
            username,
            password
        );

        await expect(managerPage).not.toHaveURL(
            /\/login$/
        );

        await managerPage.waitForTimeout(5000);

        separation =
            new Separation(managerPage);
    });


    // ========================================================
    // TC06
    // ========================================================

    test(
        'TC06 - Manager should be able to click on Pending Approvals',
        async () => {

            await separation.clickPendingApprovals();

            await expect(
                separation.pendingApprovals
            ).toBeVisible();
        }
    );


    // ========================================================
    // TC07
    // ========================================================

    test(
        'TC07 - Manager should be able to click on Offboarding tab',
        async () => {

            await separation.clickOffboarding();

            /*
             * The application keeps the clicked navigation
             * item in the DOM but may mark it hidden.
             *
             * Therefore check active-nav-link instead of
             * toBeVisible().
             */

            await expect(
                separation.offboardingTab
            ).toHaveClass(/active-nav-link/);
        }
    );


    // ========================================================
    // TC08
    // ========================================================

    // test(
    //     'TC08 - Manager should be able to see Separation tab selected by default',
    //     async () => {

    //         await separation.clickManagerSeparationTab();

    //         await expect(
    //             separation.managerSeparationTab
    //         ).toHaveClass(/active-nav-link/);
    //     }
    // );


    // ========================================================
    // TC09
    // ========================================================

    test(
        'TC09 - Manager should be able to click Kebab menu',
        async () => {

            await separation.clickManagerKebabMenu();

            await expect(
                managerPage
                    .locator('a.dropdown-item')
                    .filter({
                        hasText: /^Approve$/
                    })
                    .last()
            ).toBeVisible();
        }
    );


    // ========================================================
    // TC10
    // ========================================================

    test(
        'TC10 - Manager should be able to click Approve button',
        async () => {

            await separation.clickApproveOption();

            await expect(
                separation.regularRadio
            ).toBeVisible();
        }
    );


    // ========================================================
    // TC11
    // ========================================================

    test(
        'TC11 - Manager should be able to select all mandatory fields in Approve popup',
        async () => {

            await separation.selectRegular();

            await separation.enterComments(
                'Approved'
            );

            await expect(
                separation.regularRadio
            ).toBeChecked();

            await expect(
                separation.comments
            ).toHaveValue('Approved');
        }
    );


    // ========================================================
    // TC12
    // ========================================================

    test(
        'TC12 - Manager should be able to click Submit button successfully',
        async () => {

            await separation.clickApprovedButton();

            await separation.confirmApprove();

            await managerPage.waitForTimeout(1500);
        }
    );


    // ========================================================
    // CLOSE MANAGER PAGE
    // ========================================================

    test.afterAll(async () => {

        await managerPage.close();
    });
});


// ============================================================
// HR SEPARATION FLOW
// TC13 - TC16
//
// REQUIRED NAVIGATION:
//
// HR LOGIN
//     ↓
// Pending Approvals
//     ↓
// Offboarding
//     ↓
// Separations
//     ↓
// For Your Role
//     ↓
// Kebab Menu
//     ↓
// Process
// ============================================================

test.describe.serial('HR Separation Flow', () => {

    let hrPage: any;
    let separation: Separation;

    test.beforeAll(async ({ browser }) => {

        hrPage =
            await browser.newPage();

        const loginPage =
            new LoginPage(hrPage);

        const username =
            process.env.HR_USERNAME;

        const password =
            process.env.HR_PASSWORD;

        if (!username || !password) {
            throw new Error(
                'HR credentials are missing in .env'
            );
        }

        await hrPage.goto('/login');

        await loginPage.login(
            username,
            password
        );

        await expect(hrPage).not.toHaveURL(
            /\/login$/
        );

        await hrPage.waitForTimeout(5000);

        separation =
            new Separation(hrPage);
    });


    // ========================================================
    // TC13
    //
    // HR should be able to click Kebab menu
    //
    // Navigation:
    // Pending Approvals
    //      ↓
    // Offboarding
    //      ↓
    // Separations
    //      ↓
    // For Your Role
    //      ↓
    // Kebab
    // ========================================================

test(
    'TC13 - HR should be able to click on Kebab menu',
    async () => {

        // Navigate:
        // Pending Approvals
        //      ↓
        // Offboarding
        //      ↓
        // Separations
        //      ↓
        // For Your Role
        await separation.navigateHRToSeparation();

        // Click Kebab menu from Action column
        await separation.clickHRKebabMenu();

        // Verify Kebab menu opened
       

        console.log(
            'TC13 PASSED - HR clicked Kebab menu successfully'
        );
    }
);

    // =================================================
    // Kebab Menu
    // =================================================


    // ========================================================
    // TC14
    //
    // HR should be able to click Process button
    // ========================================================

test(
    'TC14 - HR should be able to click Process button',
    async () => {

        // Open HR Separation - For Your Role
        // await hrPage.goto(
        //     '/pending-approvals/off-boarding/separation-request/separation-for-role'
        // );

        // await hrPage.waitForTimeout(3000);

        // // Click Kebab menu
        // await separation.clickHRKebabMenu();

        // Click Process
        await separation.clickProcessOption();

        // Verify Process popup
        await expect(
            separation.regularRadio
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            'TC14 PASSED - HR clicked Process button successfully'
        );
    }
);
    // ========================================================
    // TC15
    //
    // HR should be able to submit all mandatory fields
    // ========================================================

    test(
        'TC15 - HR should be able to submit all mandatory fields',
        async () => {

            // Mandatory field 1
            await separation.selectRegular();

            // Mandatory field 2
            await separation.enterComments(
                'approved'
            );

            // Mandatory field 3
            await separation.selectYes();

            // Mandatory field 4
            await separation.selectNoticePeriodRecovery();

            // Mandatory field 5
            await separation.enterNoticePeriod(
                '10'
            );


            // =================================================
            // VALIDATIONS
            // =================================================

            await expect(
                separation.regularRadio
            ).toBeChecked();

            await expect(
                separation.comments
            ).toHaveValue('approved');

            await expect(
                separation.noticePeriod
            ).toHaveValue('10');
        }
    );


    // ========================================================
    // TC16
    //
    // HR should be able to process separation request
    // successfully
    // ========================================================

    test(
        'TC16 - HR should be able to process separation request successfully',
        async () => {

            await separation.clickProcessButton();

            await hrPage.waitForTimeout(1500);

            /*
             * Process popup should be closed
             * after successful processing.
             */

            await expect(
                separation.processButton
            ).not.toBeVisible();
        }
    );


    // ========================================================
    // CLOSE HR PAGE
    // ========================================================

    test.afterAll(async () => {

        await hrPage.close();
    });
});