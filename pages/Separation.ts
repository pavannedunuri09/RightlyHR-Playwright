import { Page, Locator } from '@playwright/test';

export class Separation {

    readonly page: Page;

    // =====================================================
    // EMPLOYEE
    // =====================================================

    readonly myInfo: Locator;
    readonly job: Locator;
    readonly separationTab: Locator;
    readonly raiseSeparationRequest: Locator;
    readonly separationReason: Locator;
    readonly submitButton: Locator;

    // =====================================================
    // MANAGER
    // =====================================================

    readonly pendingApprovals: Locator;
    readonly offboardingTab: Locator;
    readonly managerSeparationTab: Locator;
    readonly managerKebabMenu: Locator;
    readonly pendingSearch: Locator;
    readonly approveOption: Locator;
    readonly regularRadio: Locator;
    readonly comments: Locator;
    readonly approvedButton: Locator;
    readonly approveConfirmButton: Locator;

    // =====================================================
    // HR
    // =====================================================

    readonly hrSeparationTab: Locator;
    readonly forYourRole: Locator;
    readonly hrKebabMenu: Locator;
    readonly processOption: Locator;
    readonly processButton: Locator;

    readonly yesDropdown: Locator;
    readonly noticePeriodRecovery: Locator;
    readonly noticePeriod: Locator;

    constructor(page: Page) {

        this.page = page;

        // =====================================================
        // EMPLOYEE
        // =====================================================

        this.myInfo = page
            .locator('#sidenav-main-drop')
            .getByText('My Info', {
                exact: true
            });

        this.job = page.getByText('Job', {
            exact: true
        });

        /*
         * Important:
         * Use the grid-item because "Separation Request"
         * appears in more than one place.
         */
        this.separationTab = page
            .locator('div.grid-item')
            .filter({
                hasText: /^Separation Request$/
            })
            .first();

        this.raiseSeparationRequest =
            page.getByText('Raise Separation Request', {
                exact: true
            });

        this.separationReason =
            page.getByRole('textbox', {
                name: 'Reason for Separation *'
            });

        this.submitButton =
            page.getByRole('button', {
                name: 'Submit',
                exact: true
            });


        // =====================================================
        // MANAGER / HR - PENDING APPROVALS
        // =====================================================

        this.pendingApprovals =
            page.getByText('Pending Approvals', {
                exact: true
            });


        // =====================================================
        // OFFBOARDING
        // =====================================================

        this.offboardingTab =
            page.locator('div.grid-item')
                .filter({
                    hasText: /^Offboarding/
                })
                .first();


        // =====================================================
        // MANAGER - SEPARATIONS
        // =====================================================

        this.managerSeparationTab =
            page.locator('div.grid-item')
                .filter({
                    hasText: /^Separations/
                })
                .first();


        // =====================================================
        // MANAGER - KEBAB
        // =====================================================

        this.managerKebabMenu =
            page.locator('.custom-table-content')
                .locator('.dropdown > a')
                .first();

        this.pendingSearch =
            page.getByRole('searchbox')
                .or(page.getByPlaceholder(/Search by employee/i))
                .first();


        // =====================================================
        // MANAGER - APPROVAL
        // =====================================================

        this.approveOption =
            page.locator('a.dropdown-item')
                .filter({
                    hasText: /^Approve$/
                })
                .filter({
                    visible: true
                })
                .first();

        this.regularRadio =
            page.getByRole('radio', {
                name: 'Regular'
            });

        this.comments =
            page.getByRole('textbox', {
                name: 'Please enter comments'
            });

        this.approvedButton =
            page.getByRole('button', {
                name: 'Approved'
            });

        this.approveConfirmButton =
            page.getByRole('button', {
                name: 'Approve',
                exact: true
            });


        // =====================================================
        // HR - SEPARATIONS
        // =====================================================

        this.hrSeparationTab =
            page.getByText('Separations', {
                exact: true
            });


        /*
         * WFH Codegen showed:
         * For Your Role (0)
         *
         * Separation screen shows:
         * For Your Role (4)
         *
         * Therefore don't hardcode the count.
         */
        this.forYourRole =
            page.getByRole('link', {
                name: /For Your Role \(\d+\)/
            })
            .last();


        // =====================================================
        // HR - KEBAB
        // =====================================================

        this.hrKebabMenu =
            page.locator('.custom-table-content')
                .locator('.dropdown > a')
                .first();


        // =====================================================
        // HR - PROCESS
        // =====================================================
this.processOption =
    page
        .locator('a.dropdown-item')
        .filter({ hasText: /Process/ })
        .filter({ visible: true })
        .last();

        this.processButton =
            page.getByRole('button', {
                name: 'Process',
                exact: true
            });


        // =====================================================
        // HR - PROCESS POPUP FIELDS
        // =====================================================

        this.yesDropdown =
            page.getByRole('combobox', {
                name: 'Select',
                exact: true
            });

        this.noticePeriodRecovery =
            page.getByLabel('Default select example');

        this.noticePeriod =
            page.getByRole('spinbutton', {
                name: 'Please enter notice period'
            });
    }


    // =====================================================
    // EMPLOYEE METHODS
    // =====================================================

    async clickMyInfo() {
        await this.myInfo.click();
    }

    async clickJob() {
        await this.job.click();
    }

    async clickSeparationTab() {
        await this.separationTab.click();
    }

    async clickRaiseSeparationRequest() {
        await this.raiseSeparationRequest.click();
    }

    async enterSeparationReason(reason: string) {
        await this.separationReason.fill(reason);
    }

    async clickSubmitButton() {
        await this.submitButton.click();
    }

    async getLoggedInEmployeeName(): Promise<string> {
        const fromEnv =
            process.env.EMPLOYEE_NAME?.trim() ||
            process.env.EMP_NAME?.trim();

        if (fromEnv) {
            return fromEnv;
        }

        const nameNearProfile = this.page
            .getByRole('img', {
                name: 'Profile Image'
            })
            .locator('xpath=ancestor::*[.//p][1]//p[1]');

        await nameNearProfile.waitFor({
            state: 'visible',
            timeout: 15000
        });

        const name = (await nameNearProfile.innerText()).trim();

        if (!name) {
            throw new Error(
                'Could not read the logged-in employee name. Set EMPLOYEE_NAME or EMPLOYEE_ID in .env'
            );
        }

        return name;
    }


    // =====================================================
    // PENDING APPROVALS - FIND THE RAISED RECORD
    // =====================================================

    resolveEmployeeQuery(employeeQuery?: string): string {
        const query =
            employeeQuery?.trim() ||
            process.env.EMPLOYEE_ID?.trim() ||
            process.env.EMPLOYEE_NAME?.trim() ||
            process.env.EMP_NAME?.trim();

        if (!query) {
            throw new Error(
                'Pass the employee who raised the request, or set EMPLOYEE_NAME / EMPLOYEE_ID in .env'
            );
        }

        return query;
    }

    employeeRow(employeeQuery: string): Locator {
        const pattern = new RegExp(
            employeeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            'i'
        );

        return this.page
            .locator('table tbody tr, .custom-table-content tbody tr')
            .filter({
                hasText: pattern
            })
            .first();
    }

    async searchPendingRecord(employeeQuery: string) {
        const query = this.resolveEmployeeQuery(employeeQuery);

        await this.pendingSearch.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.pendingSearch.click();
        await this.pendingSearch.fill('');
        await this.pendingSearch.fill(query);
        await this.pendingSearch.press('Enter').catch(() => {});

        const row = this.employeeRow(query);

        await row.waitFor({
            state: 'visible',
            timeout: 15000
        });
    }

    async openKebabForEmployee(employeeQuery?: string) {
        const query = this.resolveEmployeeQuery(employeeQuery);

        await this.searchPendingRecord(query);

        const row = this.employeeRow(query);
        const table = this.page.locator('.custom-table-content');

        await table.evaluate((element) => {
            element.scrollLeft = element.scrollWidth;
        });

        const kebabMenu = row.locator('.dropdown > a').first();

        await kebabMenu.scrollIntoViewIfNeeded();
        await kebabMenu.click();
    }


    // =====================================================
    // MANAGER NAVIGATION
    // =====================================================


    async clickPendingApprovals() {
        await this.pendingApprovals.waitFor({
            state: 'visible'
        });

        await this.pendingApprovals.click();

        await this.page.waitForTimeout(1000);
    }

    async clickOffboarding() {
        await this.offboardingTab.waitFor({
            state: 'visible'
        });

        await this.offboardingTab.click();

        await this.page.waitForTimeout(1000);
    }

    async clickHRSeparationTab() {
        await this.hrSeparationTab.waitFor({
            state: 'visible'
        });

        await this.hrSeparationTab.click();

        await this.page.waitForTimeout(1000);
    }

    async clickManagerSeparationTab() {
        await this.managerSeparationTab.waitFor({
            state: 'visible'
        });

        await this.managerSeparationTab.click();

        await this.page.waitForTimeout(1000);
    }


    // =====================================================
    // MANAGER KEBAB
    // =====================================================

    async clickManagerKebabMenu(employeeQuery?: string) {
        await this.openKebabForEmployee(employeeQuery);
    }


    // =====================================================
    // MANAGER APPROVAL
    // =====================================================

    async clickApproveOption() {

        const approveOption =
            this.page
                .locator('a.dropdown-item')
                .filter({
                    hasText: /^Approve$/
                })
                .filter({
                    visible: true
                })
                .first();

        await approveOption.waitFor({
            state: 'visible'
        });

        await approveOption.click();
    }

    async selectRegular() {

        await this.regularRadio.waitFor({
            state: 'visible'
        });

        await this.regularRadio.check();
    }

    async enterComments(comment: string) {

        await this.comments.waitFor({
            state: 'visible'
        });

        await this.comments.fill(comment);
    }

    async clickApprovedButton() {

        await this.approvedButton.waitFor({
            state: 'visible'
        });

        await this.approvedButton.click();
    }

    async confirmApprove() {

        await this.approveConfirmButton.waitFor({
            state: 'visible'
        });

        await this.approveConfirmButton.click();
    }


    // =====================================================
    // HR NAVIGATION
    // =====================================================

    async navigateHRToSeparation() {

        // Step 1 - Pending Approvals
        await this.pendingApprovals.waitFor({
            state: 'visible'
        });

        await this.pendingApprovals.click();

        await this.page.waitForTimeout(1000);


        // Step 2 - Offboarding
        await this.offboardingTab.waitFor({
            state: 'visible'
        });

        await this.offboardingTab.click();

        await this.page.waitForTimeout(1000);


        // Step 3 - Separations
        await this.hrSeparationTab.waitFor({
            state: 'visible'
        });

        await this.hrSeparationTab.click();

        await this.page.waitForTimeout(1000);


        // Step 4 - For Your Role
        await this.forYourRole.waitFor({
            state: 'visible'
        });

        await this.forYourRole.scrollIntoViewIfNeeded();

        await this.forYourRole.click();

        await this.page.waitForTimeout(1000);
    }


    // =====================================================
    // HR FOR YOUR ROLE
    // =====================================================

    async clickForYourRole() {

        await this.forYourRole.waitFor({
            state: 'visible'
        });

        await this.forYourRole.scrollIntoViewIfNeeded();

        await this.forYourRole.click();

        await this.page.waitForTimeout(1000);
    }


    // =====================================================
    // HR KEBAB
    // =====================================================

    async clickHRKebabMenu(employeeQuery?: string) {
        await this.openKebabForEmployee(employeeQuery);
    }


    // =====================================================
    // HR PROCESS
    // =====================================================

   async clickProcessOption() {

    const processOption =
        this.page
            .locator('a.dropdown-item')
            .filter({ hasText: /Process/ })
            .filter({ visible: true })
            .first();

    await processOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await processOption.scrollIntoViewIfNeeded();

    await processOption.click();

    await this.page.waitForTimeout(1000);
}

    // =====================================================
    // HR - SELECT YES
    // =====================================================

    async selectYes() {

        await this.yesDropdown.waitFor({
            state: 'visible'
        });

        await this.yesDropdown.click();

        await this.page
            .getByRole('option', {
                name: 'Yes',
                exact: true
            })
            .click();
    }


    // =====================================================
    // HR - NOTICE PERIOD RECOVERY
    // =====================================================

    async selectNoticePeriodRecovery() {

        await this.noticePeriodRecovery.waitFor({
            state: 'visible'
        });

        await this.noticePeriodRecovery.selectOption(
            '1: Notice Period Recovery'
        );
    }


    // =====================================================
    // HR - NOTICE PERIOD
    // =====================================================

    async enterNoticePeriod(days: string) {

        await this.noticePeriod.waitFor({
            state: 'visible'
        });

        await this.noticePeriod.fill(days);
    }


    // =====================================================
    // HR - PROCESS BUTTON
    // =====================================================

    async clickProcessButton() {

        await this.processButton.waitFor({
            state: 'visible'
        });

        await this.processButton.click();
    }
}