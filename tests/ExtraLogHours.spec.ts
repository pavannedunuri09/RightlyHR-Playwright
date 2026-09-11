import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ExtraLogHours } from '../pages/ExtraLogHours';


// ============================================================
// EMPLOYEE EXTRA LOG HOURS FLOW
// TC01 - TC06
// ============================================================

test.describe.serial('Employee Extra Log Hours Flow', () => {

    let employeePage: Page;
    let extraLogHours: ExtraLogHours;


    // ========================================================
    // EMPLOYEE LOGIN
    // ========================================================

    test.beforeAll(async ({ browser }) => {

        employeePage =
            await browser.newPage();

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
        ).not.toHaveURL(/\/login$/);

        await employeePage.waitForTimeout(5000);

        extraLogHours =
            new ExtraLogHours(employeePage);
    });


    // ========================================================
    // TC01
    // Employee able to click on Attendance module
    // ========================================================

    test(
        'TC01 - Employee should be able to click on Attendance module',
        async () => {

            await extraLogHours.clickAttendance();

            await expect(
                extraLogHours.attendance
            ).toBeVisible();

            console.log(
                'TC01 PASSED - Employee clicked Attendance module'
            );
        }
    );


    // ========================================================
    // TC02
    // Employee able to click on Extra Log Hours button
    // ========================================================

    test(
        'TC02 - Employee should be able to click on Extra Log Hours button',
        async () => {

            await extraLogHours.clickLogExtraHours();

            await expect(
                extraLogHours.dateInput
            ).toBeVisible({
                timeout: 15000
            });

            console.log(
                'TC02 PASSED - Employee clicked Extra Log Hours'
            );
        }
    );


    // ========================================================
    // TC03
    // Employee able to submit Extra Log Hours
    // ========================================================

    test(
        'TC03 - Employee should be able to submit Extra Log Hours',
        async () => {

            // Date
            await extraLogHours.enterDate(
                '2026-09-01'
            );

            // Duration
            await extraLogHours.selectDuration(
                '1'
            );

            // Description
            await extraLogHours.enterDescription(
                'Applied extra log hours'
            );

            // Submit
            await extraLogHours.clickSubmit();

            console.log(
                'TC03 PASSED - Employee submitted Extra Log Hours'
            );
        }
    );


    // ========================================================
    // TC04
    // Employee able to add another record
    // ========================================================

    test(
        'TC04 - Employee should be able to add another record for Extra Log Hours',
        async () => {

            // Open Log Extra Hours again
            await extraLogHours.clickLogExtraHours();

            // Date
            await extraLogHours.enterDate(
                '2026-09-02'
            );

            // Duration
            await extraLogHours.selectDuration(
                '0.5'
            );

            // Description
            await extraLogHours.enterDescription(
                'Applied extra hours'
            );

            // Submit
            await extraLogHours.clickSubmit();

            console.log(
                'TC04 PASSED - Employee added another Extra Log Hours record'
            );
        }
    );


    // ========================================================
    // TC05
    // Employee able to cancel after entering data
    // ========================================================

    test(
        'TC05 - Employee should be able to cancel after submitting data',
        async () => {

            // Open Log Extra Hours
            await extraLogHours.clickLogExtraHours();

            // Date
            await extraLogHours.enterDate(
                '2026-09-03'
            );

            // Duration
            await extraLogHours.selectDuration(
                '1'
            );

            // Description
            await extraLogHours.enterDescription(
                'Applied extra'
            );

            // Click Cancel
            await extraLogHours.clickCancel();

            // Confirm cancellation
            await extraLogHours.clickYes();

            console.log(
                'TC05 PASSED - Employee cancelled Extra Log Hours record'
            );
        }
    );


    // ========================================================
    // TC06
    // Employee able to click Cancel → No → Submit
    // ========================================================

    test(
        'TC06 - Employee should be able to click Cancel then No and submit data',
        async () => {

            // Open Log Extra Hours
            await extraLogHours.clickLogExtraHours();

            // Date
            await extraLogHours.enterDate(
                '2026-09-04'
            );

            // Duration
            await extraLogHours.selectDuration(
                '1'
            );

            // Description
            await extraLogHours.enterDescription(
                'Applied log hours'
            );

            // Click Cancel
            await extraLogHours.clickCancel();

            // Select No
            await extraLogHours.clickNo();

            // Submit the data
            await extraLogHours.clickSubmit();

            console.log(
                'TC06 PASSED - Employee selected No and submitted Extra Log Hours'
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
// MANAGER EXTRA LOG HOURS FLOW
// TC07 - TC11
// ============================================================

test.describe.serial('Manager Extra Log Hours Flow', () => {

    let managerPage: Page;
    let extraLogHours: ExtraLogHours;


    // ========================================================
    // MANAGER LOGIN
    // ========================================================

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
        ).not.toHaveURL(/\/login$/);

        await managerPage.waitForTimeout(5000);

        extraLogHours =
            new ExtraLogHours(managerPage);
    });


    // ========================================================
    // TC07
    // Manager able to click Pending Approvals
    // ========================================================

    test(
        'TC07 - Manager should be able to click on Pending Approvals',
        async () => {

            await extraLogHours.clickPendingApprovals();

            await expect(
                extraLogHours.pendingApprovals
            ).toBeVisible();

            console.log(
                'TC07 PASSED - Manager clicked Pending Approvals'
            );
        }
    );


    // ========================================================
    // TC08
    // Manager able to click Time-Off module
    // ========================================================
test(
    'TC08 - Manager should be able to click on Time-Off module',
    async () => {

        await extraLogHours.clickTimeOff();

        console.log(
            'TC08 PASSED - Manager clicked Time-Off module successfully'
        );
    }
);


    // ========================================================
    // TC09
    // Manager able to click Extra Hours tab
    // ========================================================

    test(
        'TC09 - Manager should be able to click on Extra Hours tab',
        async () => {

            await extraLogHours.clickExtraHours();

            console.log(
                'TC09 PASSED - Manager clicked Extra Hours tab'
            );
        }
    );


    // ========================================================
    // TC10
    // Manager able to click Kebab and Approve request
    // ========================================================

    test(
        'TC10 - Manager should be able to click Kebab menu and Approve request',
        async () => {

            // Kebab
            await extraLogHours.clickKebabMenu();

            // Approve
            await extraLogHours.clickApproveOption();

            // Approved
            await extraLogHours.clickApprovedButton();

            // Confirm Approve
            await extraLogHours.confirmApprove();

            console.log(
                'TC10 PASSED - Manager approved Extra Log Hours request'
            );
        }
    );


    // ========================================================
    // TC11
    // Manager able to click Kebab and Reject request
    // ========================================================

    test(
        'TC11 - Manager should be able to click Kebab menu and Reject request',
        async () => {

            // Kebab
            await extraLogHours.clickKebabMenu();

            // Reject
            await extraLogHours.clickRejectOption();

            // Rejected
            await extraLogHours.clickRejectedButton();

            // Confirm Reject
            await extraLogHours.confirmReject();

            console.log(
                'TC11 PASSED - Manager rejected Extra Log Hours request'
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