import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RecallPage } from '../pages/RecallPage';


// ============================================================
// EMPLOYEE RECALL FLOW
// ============================================================

test.describe.serial('Employee Recall Flow', () => {

    let employeePage: Page;


    // ========================================================
    // EMPLOYEE LOGIN
    // ========================================================

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

        await expect(
            employeePage
        ).not.toHaveURL(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        await employeePage.waitForTimeout(10000);
    });


    // ========================================================
    // TC01
    // Employee should be able to raise Separation Request
    // ========================================================

    test(
        'TC01 - Employee should be able to raise Separation Request',
        async () => {

            const recall =
                new RecallPage(employeePage);

            // My Info
            await recall.clickMyInfo();

            // Job
            await recall.clickJob();

            // Separation
            await recall.clickSeparationTab();

            await recall.verifySeparationRequest();

            // Raise Separation Request
            await recall.clickRaiseSeparationRequest();

            // Fill mandatory reason
            await recall.enterSeparationReason(
                'raised separation'
            );

            // Submit
            await recall.submitSeparationRequest();

            console.log(
                'TC01 PASSED - Employee raised Separation Request'
            );
        }
    );


    // ========================================================
    // TC02
    // Employee should be able to raise Recall Request
    // My Info -> Job -> Separation -> Kebab -> Recall
    // ========================================================

    test(
        'TC02 - Employee should be able to raise Recall Request',
        async () => {

            const recall =
                new RecallPage(employeePage);

            // =================================================
            // My Info
            // =================================================

            await recall.clickMyInfo();

            // =================================================
            // Job
            // =================================================

            await recall.clickJob();

            // =================================================
            // Separation Request
            // =================================================

            await recall.clickSeparationTab();

            await recall.verifySeparationRequest();

            // =================================================
            // Click Kebab Menu
            // =================================================

            await recall.clickEmployeeKebab();

            // =================================================
            // Click Recall
            // =================================================

            await expect(
                recall.recallOption
            ).toBeVisible({
                timeout: 15000
            });

            await recall.clickRecall();

            // =================================================
            // Click Recall Reason
            // =================================================

            await recall.clickRecallReason();

            // =================================================
            // Enter Recall Reason
            // =================================================

            await recall.enterRecallReason(
                'taking back my separation'
            );

            // =================================================
            // Submit Recall Request
            // =================================================

            await recall.submitRecallRequest();

            console.log(
                'TC02 PASSED - Employee raised Recall Request'
            );
        }
    );


    // ========================================================
    // CLOSE EMPLOYEE PAGE
    // ========================================================

    test.afterAll(async () => {

        if (employeePage) {
            await employeePage.close();
        }
    });

});


// ============================================================
// MANAGER RECALL FLOW
// ============================================================

test.describe.serial('Manager Recall Flow', () => {

    let managerPage: Page;


    // ========================================================
    // MANAGER LOGIN
    // ========================================================

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

        await expect(
            managerPage
        ).not.toHaveURL(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        await managerPage.waitForTimeout(10000);
    });


    // ========================================================
    // TC03
    // Manager should be able to navigate:
    // Pending Approvals -> Offboarding -> Recall
    // ========================================================

    test(
        'TC03 - Manager should be able to navigate to Pending Approvals -> Offboarding -> Recall',
        async () => {

            const recall =
                new RecallPage(managerPage);

            // =================================================
            // Pending Approvals
            // =================================================

            await recall.clickPendingApprovals();

            // =================================================
            // Offboarding
            // =================================================

            await recall.clickOffboarding();

            // =================================================
            // Recalls
            // =================================================

            await recall.clickRecalls();

            // =================================================
            // Verify Recalls
            // =================================================

            await recall.verifyRecalls();

            console.log(
                'TC03 PASSED - Manager navigated to Recalls'
            );
        }
    );


    // ========================================================
    // TC04
    // Manager should be able to approve Recall Request
    // ========================================================

    test(
        'TC04 - Manager should be able to approve Recall request',
        async () => {

            const recall =
                new RecallPage(managerPage);

            // Click Kebab
            await recall.clickManagerKebab();

            // Click Approve
            await recall.clickApprove();

            // Select Approved
            await recall.selectApproved();

            // Confirm Approve
            await recall.confirmApprove();

            console.log(
                'TC04 PASSED - Manager approved Recall request'
            );
        }
    );


    // ========================================================
    // CLOSE MANAGER PAGE
    // ========================================================

    test.afterAll(async () => {

        if (managerPage) {
            await managerPage.close();
        }
    });

});


// ============================================================
// HR RECALL FLOW
// ============================================================

test.describe.serial('HR Recall Flow', () => {

    let hrPage: Page;


    // ========================================================
    // HR LOGIN
    // ========================================================

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

        await expect(
            hrPage
        ).not.toHaveURL(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        await hrPage.waitForTimeout(10000);
    });


    // ========================================================
    // TC05
    // HR should be able to navigate:
    // Pending Approvals -> Offboarding -> Recall -> For Your Role
    // ========================================================

   test(
    'TC05 - HR should be able to navigate to Pending Approvals -> Offboarding -> Recall -> For Your Role',
    async () => {

        const recall =
            new RecallPage(hrPage);

        // =================================================
        // Pending Approvals
        // =================================================

        await recall.clickPendingApprovals();

        // =================================================
        // Offboarding
        // =================================================

        await recall.clickOffboarding();

        // =================================================
        // Recall Tab
        // =================================================

        await recall.clickRecalls();

        await recall.verifyRecalls();

        // =================================================
        // For Your Role
        // =================================================

        await recall.clickForYourRole();

        await expect(
            recall.forYourRole
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            'TC05 PASSED - HR navigated to For Your Role'
        );
    }
);


    // ========================================================
    // TC06
    // HR should be able to process Recall Request
    // ========================================================

    test(
        'TC06 - HR should be able to process Recall request',
        async () => {

            const recall =
                new RecallPage(hrPage);

            // Click Kebab
            await recall.clickHRKebab();

            // Click Process
            await recall.clickProcess();

            // Select Approved
            await recall.selectProcessApproved();

            // Confirm Process
            await recall.confirmProcess();

            console.log(
                'TC06 PASSED - HR processed Recall request'
            );
        }
    );


    // ========================================================
    // CLOSE HR PAGE
    // ========================================================

    test.afterAll(async () => {

        if (hrPage) {
            await hrPage.close();
        }
    });

});


// ============================================================
// EMPLOYEE FINAL VERIFICATION
// ============================================================

test.describe.serial('Employee Recall Verification', () => {

    let employeePage: Page;


    // ========================================================
    // EMPLOYEE LOGIN
    // ========================================================

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

        await expect(
            employeePage
        ).not.toHaveURL(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );

        await employeePage.waitForTimeout(10000);
    });


    // ========================================================
    // TC07
    // Employee should be able to see Recall request processed
    // ========================================================

    test(
        'TC07 - Employee should be able to see Recall request processed',
        async () => {

            const recall =
                new RecallPage(employeePage);

            // My Info
            await recall.clickMyInfo();

            // Job
            await recall.clickJob();

            // Separation
            await recall.clickSeparationTab();

            await recall.verifySeparationRequest();

            console.log(
                'TC07 PASSED - Employee can see Recall request processed'
            );
        }
    );


    // ========================================================
    // CLOSE EMPLOYEE PAGE
    // ========================================================

    test.afterAll(async () => {

        if (employeePage) {
            await employeePage.close();
        }
    });

});