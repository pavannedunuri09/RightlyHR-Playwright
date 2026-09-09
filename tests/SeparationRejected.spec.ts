import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SeparationRejected } from '../pages/separationrejected';


// ============================================================
// EMPLOYEE - INITIAL REQUEST
// TC01 - TC03
// ============================================================

test.describe.serial('Employee Separation Rejection Flow', () => {

    let employeePage: Page;

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
                'EMPLOYEE_USERNAME or EMPLOYEE_PASSWORD is not configured in .env'
            );
        }

        await employeePage.goto('/login');

        await loginPage.login(
            username,
            password
        );

        await expect(employeePage).not.toHaveURL(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        // Same as Separation success code
        await employeePage.waitForTimeout(10000);
    });


    // ========================================================
    // TC01
    // ========================================================

    test(
        'TC01 - Employee should be able to login successfully to RightlyHR portal',
        async () => {

            await expect(employeePage).not.toHaveURL(
                'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
            );
        }
    );


    // ========================================================
    // TC02
    // ========================================================

    test(
        'TC02 - Employee should be able to navigate to Separation Request tab',
        async () => {

            const separation =
                new SeparationRejected(
                    employeePage
                );

            await separation.clickMyInfo();

            await separation.clickJob();

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
    // TC03
    // ========================================================

    test(
        'TC03 - Employee should be able to raise separation request',
        async () => {

            const separation =
                new SeparationRejected(
                    employeePage
                );

            await separation.clickRaiseSeparationRequest();

            await expect(
                separation.separationReason
            ).toBeVisible();

            await separation.enterSeparationReason(
                'raised Separation due to personals'
            );

            await separation.clickSubmitButton();
        }
    );


    test.afterAll(async () => {

        await employeePage.close();
    });

});


// ============================================================
// MANAGER - REJECT
// TC04
// ============================================================

test.describe.serial('Manager Separation Rejection Flow', () => {

    let managerPage: Page;

    test.beforeAll(async ({ browser }) => {

        managerPage = await browser.newPage();

        const loginPage =
            new LoginPage(managerPage);

        const username =
            process.env.MANAGER_USERNAME;

        const password =
            process.env.MANAGER_PASSWORD;

        if (!username || !password) {
            throw new Error(
                'MANAGER_USERNAME or MANAGER_PASSWORD is not configured in .env'
            );
        }

        await managerPage.goto('/login');

        await loginPage.login(
            username,
            password
        );

        await expect(managerPage).not.toHaveURL(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        await managerPage.waitForTimeout(10000);
    });


    // ========================================================
    // TC04
    // ========================================================

    test(
        'TC04 - Manager should be able to reject the Separation request',
        async () => {

            const separation =
                new SeparationRejected(
                    managerPage
                );

            await separation.clickPendingApprovals();

            await separation.clickOffboarding();

            await separation.clickManagerKebabMenu();

            await separation.clickRejectOption();

            await separation.clickRejectedButton();

            await separation.confirmReject();
        }
    );


    test.afterAll(async () => {

        await managerPage.close();
    });

});


// ============================================================
// EMPLOYEE - VERIFY REJECTION AND RAISE AGAIN
// TC05
// ============================================================

test.describe.serial('Employee Rejected Separation Flow', () => {

    let employeePage: Page;

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
                'EMPLOYEE_USERNAME or EMPLOYEE_PASSWORD is not configured in .env'
            );
        }

        await employeePage.goto('/login');

        await loginPage.login(
            username,
            password
        );

        await expect(employeePage).not.toHaveURL(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        await employeePage.waitForTimeout(10000);
    });


    // ========================================================
    // TC05
    // ========================================================

    test(
        'TC05 - After manager rejection employee separation request status should be rejected and able to raise separation request again',
        async () => {

            const separation =
                new SeparationRejected(
                    employeePage
                );

            await separation.clickMyInfo();

            await separation.clickJob();

            await separation.clickSeparationTab();

            await expect(
                separation.rejectedStatus
            ).toBeVisible();

            await separation.clickRaiseSeparationRequest();

            await separation.enterSeparationReason(
                'due to medical issue'
            );

            await separation.clickSubmitButton();
        }
    );


    test.afterAll(async () => {

        await employeePage.close();
    });

});


// ============================================================
// MANAGER - APPROVE SECOND REQUEST
// TC06
// ============================================================

test.describe.serial('Manager Separation Approval Flow', () => {

    let managerPage: Page;

    test.beforeAll(async ({ browser }) => {

        managerPage = await browser.newPage();

        const loginPage =
            new LoginPage(managerPage);

        const username =
            process.env.MANAGER_USERNAME;

        const password =
            process.env.MANAGER_PASSWORD;

        if (!username || !password) {
            throw new Error(
                'MANAGER_USERNAME or MANAGER_PASSWORD is not configured in .env'
            );
        }

        await managerPage.goto('/login');

        await loginPage.login(
            username,
            password
        );

        await expect(managerPage).not.toHaveURL(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        await managerPage.waitForTimeout(10000);
    });


    // ========================================================
    // TC06
    // ========================================================

    test(
        'TC06 - Manager should be able to approve separation request',
        async () => {

            const separation =
                new SeparationRejected(
                    managerPage
                );

            await separation.clickPendingApprovals();

            await separation.clickOffboarding();

            await separation.clickManagerKebabMenu();

            await separation.clickApproveOption();

            await separation.selectRegular();

            await separation.clickApprovedButton();

            await separation.confirmApprove();
        }
    );


    test.afterAll(async () => {

        await managerPage.close();
    });

});


// ============================================================
// HR - REJECT
// TC07
// ============================================================

test.describe.serial('HR Separation Rejection Flow', () => {

    let hrPage: Page;

    test.beforeAll(async ({ browser }) => {

        hrPage = await browser.newPage();

        const loginPage =
            new LoginPage(hrPage);

        const username =
            process.env.HR_USERNAME;

        const password =
            process.env.HR_PASSWORD;

        if (!username || !password) {
            throw new Error(
                'HR_USERNAME or HR_PASSWORD is not configured in .env'
            );
        }

        await hrPage.goto('/login');

        await loginPage.login(
            username,
            password
        );

        await expect(hrPage).not.toHaveURL(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        await hrPage.waitForTimeout(10000);
    });


    // ========================================================
    // TC07
    // ========================================================

    test(
        'TC07 - HR should be able to reject the separation request',
        async () => {

            const separation =
                new SeparationRejected(
                    hrPage
                );

            await separation.clickForYourRole();

            await separation.clickHRKebabMenu();

            await separation.clickRejectOption();

            await separation.clickRejectedButton();

            await separation.confirmReject();

            await expect(
                hrPage.getByText(
                    'Separation request rejected',
                    {
                        exact: true
                    }
                )
            ).toBeVisible();
        }
    );


    test.afterAll(async () => {

        await hrPage.close();
    });

});