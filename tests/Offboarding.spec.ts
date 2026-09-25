import fs from 'fs';
import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OffboardingPage } from '../pages/Offboarding';

test.describe.serial('Offboarding Flow', () => {

    let page: Page;
    let offboarding: OffboardingPage;

    // =========================================================
    // TEST DATA
    // =========================================================

    const employeeUsername = 'chinni';
    const employeeName = 'Chinni Rohini Reddy';

    const reportingManagerType = 'RM';
    const reportingEmployee = 'SD302099 - Patlolla Akhil';
    const reportingManager = 'RHR1232 - arpitha Bhanja';

    const effectiveDate = '2026-09-16';

    const teamManagerType = 'TM';
    const department = 'Artificial Intelligence';
    const team = 'SDA';
    const subTeam = 'Associate QA';
    const role = 'QA';

    const finalStatus = 'Inactive';


    // =========================================================
    // LOGIN ONCE BEFORE ALL TESTS (REUSING AUTH SESSION)
    // =========================================================

    test.beforeAll(async ({ browser }) => {
        const storageState = fs.existsSync('.auth/user.json') ? '.auth/user.json' : undefined;
        const context = await browser.newContext({ storageState });
        page = await context.newPage();

        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);

        // If not already authenticated and redirected to /login, log in
        if (page.url().includes('/login')) {
            const loginPage = new LoginPage(page);
            await loginPage.loginFromEnv();
        }

        offboarding = new OffboardingPage(page);
    });

    test.afterAll(async () => {
        await page?.close();
    });


    // =========================================================
    // TC01
    // =========================================================

    test('TC01 - HR should be able to click Employees tab and Active Employees tab', async () => {
        await offboarding.clickEmployees();
        await offboarding.clickActiveEmployees();
        console.log('TC01 PASSED');
    });


    // =========================================================
    // TC02
    // =========================================================

    test('TC02 - HR should be able to click Employee Name and Job', async () => {
        await offboarding.searchEmployee(employeeUsername);
        await offboarding.clickEmployee(employeeName);
        await offboarding.clickJob();
        console.log('TC02 PASSED');
    });


    // =========================================================
    // TC03
    // =========================================================

    test('TC03 - HR should be able to click Offboarding tab', async () => {
        await offboarding.clickOffboarding();
        console.log('TC03 PASSED');
    });


    // =========================================================
    // TC04
    // =========================================================

    test('TC04 - HR should be able to click Initiate Offboarding button', async () => {
        await offboarding.initiateOffboarding();
        console.log('TC04 PASSED');
    });


    // =========================================================
    // TC05
    // =========================================================

    test('TC05 - HR should be able to see Manager Pending Requests', async () => {
        await offboarding.verifyManagerPendingRequests();
        console.log('TC05 PASSED');
    });


    // =========================================================
    // TC06
    // =========================================================

    test('TC06 - HR should be able to process pending requests', async () => {
        await offboarding.processPendingRequest();
        console.log('TC06 PASSED');
    });


    // =========================================================
    // TC07
    // =========================================================

    test('TC07 - HR should be able to skip some of the requests', async () => {
        await offboarding.skipPendingRequest();
        console.log('TC07 PASSED');
    });


    // =========================================================
    // TC08
    // =========================================================

    test('TC08 - HR should be able to reject some of the requests', async () => {
        await offboarding.rejectPendingRequest();
        console.log('TC08 PASSED');
    });


    // =========================================================
    // TC09
    // =========================================================

    test('TC09 - Next button should be enabled after all pending requests are processed', async () => {
        await offboarding.verifyNextEnabled();
        await offboarding.clickNext();
        console.log('TC09 PASSED');
    });


    // =========================================================
    // TC10
    // =========================================================

    test('TC10 - HR should be able to process Manager Pending Approval request', async () => {
        await offboarding.processManagerPendingApproval();
        console.log('TC10 PASSED');
    });


    // =========================================================
    // TC11
    // =========================================================

    test('TC11 - HR should be able to skip some Manager Pending Approval requests', async () => {
        await offboarding.skipManagerPendingApproval();
        console.log('TC11 PASSED');
    });


    // =========================================================
    // TC12
    // =========================================================

    test('TC12 - HR should be able to reject some Manager Pending Approval requests', async () => {
        await offboarding.rejectManagerPendingApproval();
        console.log('TC12 PASSED');
    });


    // =========================================================
    // TC13
    // =========================================================

    test('TC13 - Next button should be enabled after all Manager Pending Approval requests are processed', async () => {
        await offboarding.verifyNextEnabled();
        await offboarding.clickNext();
        console.log('TC13 PASSED');
    });


    // =========================================================
    // TC14
    // =========================================================

    test('TC14 - HR should be able to select Reporting Manager from Manager Type dropdown', async () => {
        await offboarding.selectManagerType(reportingManagerType);
        console.log('TC14 PASSED');
    });


    // =========================================================
    // TC15
    // =========================================================

    test('TC15 - HR should be able to select Reporting Employee based on Reporting Manager', async () => {
        await offboarding.selectEmployeeFromDropdown(reportingEmployee);
        await offboarding.selectReportingManager(reportingManager);
        console.log('TC15 PASSED');
    });


    // =========================================================
    // TC16
    // =========================================================

    test('TC16 - HR should be able to select mandatory fields and click Assign', async () => {
        await offboarding.selectEffectiveDate(effectiveDate);
        await offboarding.clickAssign();
        console.log('TC16 PASSED');
    });


    // =========================================================
    // TC17
    // =========================================================

    test('TC17 - HR should be able to click Next button', async () => {
        await offboarding.clickNext();
        console.log('TC17 PASSED');
    });


    // =========================================================
    // TC18
    // =========================================================

    test('TC18 - HR should be able to submit all mandatory fields', async () => {
        // Select TM
        await offboarding.selectManagerType(teamManagerType);

        // Select Employee
        await offboarding.selectEmployeeFromDropdown(reportingEmployee);

        // Select Department
        await offboarding.selectDepartment(department);

        // Select Team
        await offboarding.selectTeam(team);

        // Select Sub Team
        await offboarding.selectSubTeam(subTeam);

        // Select Role
        await offboarding.selectRole(role);

        // Select Effective Date
        await offboarding.selectEffectiveDate(effectiveDate);

        // Assign
        await offboarding.clickAssign();

        console.log('TC18 PASSED');
    });


    // =========================================================
    // TC19
    // =========================================================

    test('TC19 - HR should be able to click Submit button', async () => {
        await offboarding.clickNext();
        await offboarding.selectStatus(finalStatus);
        await offboarding.clickSubmit();
        console.log('TC19 PASSED');
    });


    // =========================================================
    // TC20
    // =========================================================

    test('TC20 - Verify employee is inactivated', async () => {
        await offboarding.verifyEmployeeInactive(
            employeeUsername,
            employeeName,
            finalStatus
        );
        console.log('TC20 PASSED');
    });

});