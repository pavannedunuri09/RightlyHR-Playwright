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
            name: 'Login'
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

        this.rejectOption =
            page.getByText(
                'Reject',
                {
                    exact: true
                }
            ).last();

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
            page.getByText(
                'Approve',
                {
                    exact: true
                }
            ).last();

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

    async clickManagerKebabMenu() {

        const table =
            this.page.locator(
                '.custom-table-content'
            );

        await table.evaluate((element) => {
            element.scrollLeft =
                element.scrollWidth;
        });

        await this.page.waitForTimeout(1000);

        const kebab =
            table
                .locator('.dropdown > a')
                .first();

        await kebab.scrollIntoViewIfNeeded();

        await kebab.click();
    }

    // ============================================================
    // MANAGER - REJECT
    // ============================================================

    async clickRejectOption() {

        await this.rejectOption.waitFor({
            state: 'visible'
        });

        await this.rejectOption.click();
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

        await this.approveOption.waitFor({
            state: 'visible'
        });

        await this.approveOption.click();
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

    async clickHRKebabMenu() {

        const table =
            this.page.locator(
                '.custom-table-content'
            );

        await table.evaluate((element) => {
            element.scrollLeft =
                element.scrollWidth;
        });

        await this.page.waitForTimeout(1000);

        const kebab =
            table
                .locator('.dropdown > a')
                .first();

        await kebab.scrollIntoViewIfNeeded();

        await kebab.click();
    }
}