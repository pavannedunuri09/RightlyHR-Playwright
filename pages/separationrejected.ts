import { Page, Locator } from '@playwright/test';

export class SeparationRejected {

    readonly page: Page;

    // ============================================================
    // LOGIN
    // ============================================================

    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    // ============================================================
    // EMPLOYEE
    // ============================================================

    readonly myInfo: Locator;
    readonly job: Locator;
    readonly separationTab: Locator;
    readonly raiseSeparationRequest: Locator;
    readonly separationReason: Locator;
    readonly submitButton: Locator;

    // ============================================================
    // MANAGER
    // ============================================================

    readonly pendingApprovals: Locator;
    readonly offboardingTab!: Locator;
    readonly managerKebabMenu: Locator;
    readonly pendingSearch: Locator;
    readonly rejectOption: Locator;
    readonly rejectedButton: Locator;
    readonly rejectConfirmButton: Locator;

    // ============================================================
    // EMPLOYEE - REJECTED REQUEST
    // ============================================================

    readonly rejectedStatus: Locator;

    // ============================================================
    // MANAGER - APPROVAL
    // ============================================================

    readonly approveOption: Locator;
    readonly regularRadio: Locator;
    readonly approvedButton: Locator;
    readonly approveConfirmButton: Locator;

    // ============================================================
    // HR
    // ============================================================

    readonly forYourRole: Locator;
    readonly hrKebabMenu: Locator;

    private lastEmployeeQuery = '';

    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    constructor(page: Page) {

        this.page = page;

        // ========================================================
        // LOGIN
        // ========================================================

        this.emailInput = page.getByRole('textbox', {
            name: 'Please enter email'
        });

        this.passwordInput = page.getByRole('textbox', {
            name: 'Please enter password'
        });

        this.loginButton = page.getByRole('button', {
            name: 'Login',
            exact: true
        });


        // ========================================================
        // EMPLOYEE
        // ========================================================

        this.myInfo = page
            .locator('#sidenav-main-drop')
            .getByText('My Info', {
                exact: true
            });

        this.job = page.getByText('Job', {
            exact: true
        });

        this.separationTab = page
            .locator('div.grid-item')
            .filter({
                hasText: /^Separation Request$/
            })
            .first();

        this.raiseSeparationRequest =
            page.getByText(
                'Raise Separation Request',
                {
                    exact: true
                }
            );

        this.separationReason =
            page.getByRole('textbox', {
                name: 'Reason for Separation *'
            });

        this.submitButton =
            page.getByRole('button', {
                name: 'Submit',
                exact: true
            });

        // ========================================================
        // MANAGER
        // ========================================================

        this.pendingApprovals =
            page.getByText(
                'Pending Approvals',
                {
                    exact: true
                }
            );

        this.offboardingTab =
            page.getByText(
                /Offboarding/
            ).first();

        this.managerKebabMenu =
            page
                .locator('.custom-table-content')
                .locator('.dropdown > a')
                .first();

        this.pendingSearch =
            page.getByRole('searchbox')
                .or(page.getByPlaceholder(/Search by employee/i))
                .first();

        this.rejectOption =
            page.locator('a.dropdown-item')
                .filter({
                    hasText: /^Reject$/
                })
                .filter({
                    visible: true
                })
                .first();

        this.rejectedButton =
            page.getByRole('button', {
                name: 'Rejected'
            });

        this.rejectConfirmButton =
            page.getByRole('button', {
                name: 'Reject',
                exact: true
            });

        // ========================================================
        // EMPLOYEE - REJECTED STATUS
        // ========================================================

        this.rejectedStatus =
            page.getByRole('cell', {
                name: 'Rejected'
            });

        // ========================================================
        // MANAGER - APPROVAL
        // ========================================================

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

        this.approvedButton =
            page.getByRole('button', {
                name: 'Approved'
            });

        this.approveConfirmButton =
            page.getByRole('button', {
                name: 'Approve',
                exact: true
            });

        // ========================================================
        // HR
        // ========================================================

        this.forYourRole =
            page.getByRole('link', {
                name: /For Your Role/
            });

        this.hrKebabMenu =
            page
                .locator('.custom-table-content')
                .locator('.dropdown > a')
                .first();
    }

    // ============================================================
    // LOGIN
    // ============================================================

    async login(
        username: string,
        password: string
    ) {

        await this.emailInput.fill(username);
        await this.passwordInput.fill(password);

        await this.loginButton.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );
    }

    // ============================================================
    // EMPLOYEE - NAVIGATION
    // ============================================================

    async clickMyInfo() {

        await this.myInfo.click();
    }

    async clickJob() {

        await this.job.click();
    }

    async clickSeparationTab() {

        await this.separationTab.waitFor({
            state: 'visible'
        });

        await this.separationTab.click();
    }

    async clickRaiseSeparationRequest() {

        await this.raiseSeparationRequest.waitFor({
            state: 'visible'
        });

        await this.raiseSeparationRequest.click();
    }

    async enterSeparationReason(
        reason: string
    ) {

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

    async resolveEmployeeQuery(employeeQuery?: string): Promise<string> {
        const query =
            employeeQuery?.trim() ||
            process.env.EMPLOYEE_ID?.trim() ||
            process.env.EMPLOYEE_NAME?.trim() ||
            process.env.EMP_NAME?.trim();

        if (query) {
            return query;
        }

        return this.getLoggedInEmployeeName();
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

    async searchPendingRecord(employeeQuery?: string) {
        const query = await this.resolveEmployeeQuery(employeeQuery);

        await this.pendingSearch.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.pendingSearch.click();
        await this.pendingSearch.fill('');
        await this.pendingSearch.fill(query);
        await this.pendingSearch.press('Enter').catch(() => {});

        await this.employeeRow(query).waitFor({
            state: 'visible',
            timeout: 15000
        });
    }

    async openKebabForEmployee(employeeQuery?: string) {
        const query = await this.resolveEmployeeQuery(employeeQuery);
        this.lastEmployeeQuery = query;

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

    // ============================================================
    // MANAGER - NAVIGATION
    // ============================================================

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

    // ============================================================
    // MANAGER - KEBAB
    // ============================================================

    async clickManagerKebabMenu(employeeQuery?: string) {
        await this.openKebabForEmployee(employeeQuery);
    }

    // ============================================================
    // MANAGER - REJECT
    // ============================================================

    async clickRejectOption() {
        const row = this.lastEmployeeQuery
            ? this.employeeRow(this.lastEmployeeQuery)
            : this.page.locator('table tbody tr').first();

        const rejectOption = row
            .getByRole('listitem')
            .filter({ hasText: /Reject/i })
            .or(
                row.getByText('Reject', { exact: true })
            )
            .or(
                this.page.getByRole('listitem').filter({ hasText: /Reject/i })
            )
            .last();

        await rejectOption.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await rejectOption.click();
    }

    async clickRejectedButton() {

        await this.rejectedButton.waitFor({
            state: 'visible'
        });

        await this.rejectedButton.click();
    }

    async confirmReject() {

        await this.rejectConfirmButton.waitFor({
            state: 'visible'
        });

        await this.rejectConfirmButton.click();
    }

    // ============================================================
    // EMPLOYEE - REJECTED STATUS
    // ============================================================

    async verifyRejectedStatus() {

        await this.rejectedStatus.waitFor({
            state: 'visible'
        });
    }

    // ============================================================
    // MANAGER - APPROVAL
    // ============================================================

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

        await this.regularRadio.check();
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

    // ============================================================
    // HR
    // ============================================================

    async clickForYourRole() {

        await this.forYourRole.waitFor({
            state: 'visible'
        });

        await this.forYourRole.click();

        await this.page.waitForTimeout(1000);
    }

    async clickHRKebabMenu(employeeQuery?: string) {
        await this.openKebabForEmployee(employeeQuery);
    }
}