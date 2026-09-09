import { test, expect } from '@playwright/test';
import { HelpDesk } from '../pages/helpdesk';
import { LoginPage } from '../pages/LoginPage';


// ======================================================
// HR HELP DESK CONFIGURATION FLOW
// TC01 - TC04
// ======================================================

test.describe.serial('HR Helpdesk Configuration Flow', () => {

    let hrPage: any;
    let helpDesk: HelpDesk;


    test.beforeAll(async ({ browser }) => {

        hrPage = await browser.newPage();

        const loginPage = new LoginPage(hrPage);

        await hrPage.goto('/login');

        await loginPage.login(
            process.env.HR_USERNAME!,
            process.env.HR_PASSWORD!
        );

        await hrPage.waitForTimeout(10000);

        helpDesk = new HelpDesk(hrPage);
    });


    // ==================================================
    // TC01
    // ==================================================

    test(
        'TC01 - HR should be able to click on settings module',
        async () => {

            await helpDesk.clickSettingsModule();
        }
    );


    // ==================================================
    // TC02
    // ==================================================

    test(
        'TC02 - HR should be able to click on Helpdesk configurations',
        async () => {

            await helpDesk.clickHelpDeskConfiguration();
        }
    );


    // ==================================================
    // TC03
    // ==================================================

    test(
        'TC03 - HR should be able to add Helpdesk category',
        async () => {

            await helpDesk.clickAddButton();

            await helpDesk.enterCategory('Employee issue');

            await helpDesk.clickAddButton();
        }
    );


    // ==================================================
    // TC04
    // ==================================================

    test(
        'TC04 - HR should be able to add Helpdesk subcategory based on category',
        async () => {

            await helpDesk.clickSubcategoryTab();

            await helpDesk.clickAddButton();

            await helpDesk.selectCategory('Employee issue');

            await helpDesk.enterSubcategory('Offer downnload');

            await helpDesk.clickAddButton();
        }
    );


    test.afterAll(async () => {

        await hrPage.close();
    });
});


// ======================================================
// EMPLOYEE HELP DESK FLOW
// TC05 - TC10
// ======================================================

test.describe.serial('Employee Helpdesk Flow', () => {

    let employeePage: any;
    let helpDesk: HelpDesk;


    test.beforeAll(async ({ browser }) => {

        employeePage = await browser.newPage();

        const loginPage = new LoginPage(employeePage);

        await employeePage.goto('/login');

        await loginPage.login(
            process.env.EMPLOYEE_USERNAME!,
            process.env.EMPLOYEE_PASSWORD!
        );

        await employeePage.waitForTimeout(10000);

        helpDesk = new HelpDesk(employeePage);
    });


    // ==================================================
    // TC05
    // ==================================================

    test(
        'TC05 - Employee should be able to click on Helpdesk module',
        async () => {

            await helpDesk.clickHelpDeskModule();
        }
    );


    // ==================================================
    // TC06
    // ==================================================

    test(
        'TC06 - Employee should be able to click on Raise query button',
        async () => {

            await helpDesk.clickRaiseQuery();
        }
    );


    // ==================================================
    // TC07
    // ==================================================

    test(
        'TC07 - Employee should be able to select helpdesk category',
        async () => {

            await helpDesk.selectEmployeeCategory(
                'Employee issue'
            );
        }
    );


    // ==================================================
    // TC08
    // ==================================================

    test(
        'TC08 - Employee should be able to select helpdesk sub category',
        async () => {

            await helpDesk.selectEmployeeSubcategory(
                'Offer downnload'
            );
        }
    );


    // ==================================================
    // TC09
    // ==================================================

    test(
        'TC09 - Employee should be able to add description',
        async () => {

            await helpDesk.enterDescription(
                'unable to login portal'
            );
        }
    );


    // ==================================================
    // TC10
    // ==================================================

    test(
        'TC10 - Employee should be able to click on Submit button and raise query',
        async () => {

            await helpDesk.clickSubmit();

            await employeePage.waitForTimeout(2000);
        }
    );


    test.afterAll(async () => {

        await employeePage.close();
    });
});


// ======================================================
// HR TEAM QUERIES FLOW
// TC11 - TC16
// ======================================================

test.describe.serial('HR Team Queries Flow', () => {

    let hrPage: any;
    let helpDesk: HelpDesk;


    test.beforeAll(async ({ browser }) => {

        hrPage = await browser.newPage();

        const loginPage = new LoginPage(hrPage);

        await hrPage.goto('/login');

        await loginPage.login(
            process.env.HR_USERNAME!,
            process.env.HR_PASSWORD!
        );

        await hrPage.waitForTimeout(10000);

        helpDesk = new HelpDesk(hrPage);
    });


    // ==================================================
    // TC11
    // ==================================================

    test(
    'TC11 - HR can add employee in HR admin role and view all queries in team tickets',
    async () => {

        // Step 1 - Click Settings
        await helpDesk.clickSettingsModule();

        // Step 2 - Click Roles & Permissions
        await helpDesk.clickRolesPermissions();

        // Step 3 - Click Assignee
        await helpDesk.clickAssignee();

        // Step 4 - Select HR Admin
        await hrPage
            .getByText('HR Admin', {
                exact: true
            })
            .click();

        // Step 5 - Select Employee
        await helpDesk.selectEmployee();

        // Step 6 - Click Add
        await helpDesk.clickAddEmployee();

        // Step 7 - Open Helpdesk module
        await hrPage
            .locator('.icon-wrapper')
            .click();

        // Step 8 - Click Team Queries
        await helpDesk.clickTeamQueries();

        // Verify Team Queries page header
        await expect(
            helpDesk.teamQueriesHeader
        ).toBeVisible();
    }
);


    // ==================================================
    // TC12
    // ==================================================

    test(
        'TC12 - HR able to click on helpdesk module',
        async () => {

            await hrPage
                .locator('.icon-wrapper')
                .click();
        }
    );


    // ==================================================
    // TC13
    // ==================================================

    test(
        'TC13 - HR able to click on Team queries',
        async () => {

            await helpDesk.clickTeamQueries();
        }
    );


    // ==================================================
    // TC14
    // ==================================================

    test(
        'TC14 - HR should be able to click on ticket id',
        async () => {

            await helpDesk.clickTicketId(
                'TKT - 13'
            );
        }
    );


    // ==================================================
    // TC15
    // ==================================================

    test(
        'TC15 - HR able to submit all mandatory fields',
        async () => {

            await helpDesk.selectAssignTo();

            await helpDesk.selectPriority(
                'Urgent'
            );

            await helpDesk.selectStatus(
                'Closed'
            );

            await helpDesk.enterAdditionalInformation(
                'closed this ticket'
            );
        }
    );


    // ==================================================
    // TC16
    // ==================================================

    test(
        'TC16 - HR should be able to click on submit button and close the ticket',
        async () => {

            await helpDesk.submitTicketUpdate();

            await hrPage.waitForTimeout(2000);
        }
    );


    test.afterAll(async () => {

        await hrPage.close();
    });
});