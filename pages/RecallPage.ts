import { expect, Locator, Page } from '@playwright/test';

export class RecallPage {

    readonly page: Page;

    // =========================================================
    // LOGIN
    // =========================================================

    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    // =========================================================
    // EMPLOYEE - MY INFO / JOB / SEPARATION
    // =========================================================

    readonly myInfo: Locator;
    readonly job: Locator;

    readonly separationRequestTab: Locator;
    readonly separationRequestHeading: Locator;

    readonly raiseSeparationRequest: Locator;
    readonly separationReason: Locator;
    readonly separationSubmitButton: Locator;

    // =========================================================
    // EMPLOYEE - RECALL
    // =========================================================

    readonly employeeKebab: Locator;
    readonly recallEarlyRelieving: Locator;
    readonly recallOption: Locator;
    readonly recallReason: Locator;
    readonly recallSubmitButton: Locator;

    // =========================================================
    // MANAGER / HR
    // =========================================================

    readonly pendingApprovals: Locator;
    readonly offboarding: Locator;
    readonly recalls: Locator;

    // =========================================================
    // MANAGER
    // =========================================================

    readonly managerKebab: Locator;
    readonly approveOption: Locator;
    readonly approvedButton: Locator;
    readonly approveConfirmButton: Locator;

    // =========================================================
    // HR
    // =========================================================

    readonly forYourRole: Locator;
    readonly hrKebab: Locator;
    readonly processOption: Locator;
    readonly processApprovedButton: Locator;
    readonly processConfirmButton: Locator;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    constructor(page: Page) {

        this.page = page;


        // =====================================================
        // LOGIN
        // =====================================================

        this.emailInput = page.getByRole(
            'textbox',
            {
                name: 'Please enter email'
            }
        );

        this.passwordInput = page.getByRole(
            'textbox',
            {
                name: 'Please enter password'
            }
        );

        this.loginButton = page.getByRole(
            'button',
            {
                name: 'Login',
                exact: true
            }
        );


        // =====================================================
        // EMPLOYEE - MY INFO
        // =====================================================

        this.myInfo = page
            .locator('#sidenav-main-drop')
            .getByText(
                'My Info',
                {
                    exact: true
                }
            );


        // =====================================================
        // EMPLOYEE - JOB
        // =====================================================

        this.job = page.getByText(
            'Job',
            {
                exact: true
            }
        );


        // =====================================================
        // SEPARATION REQUEST TAB
        // =====================================================

        this.separationRequestTab = page
            .locator('div.grid-item')
            .filter({
                hasText: /^Separation Request$/
            })
            .first();


        // =====================================================
        // SEPARATION REQUEST HEADING
        // =====================================================

        this.separationRequestHeading = page
            .locator('div.component-header')
            .filter({
                hasText: /^Separation Request$/
            })
            .first();


        // =====================================================
        // RAISE SEPARATION REQUEST
        // =====================================================

        this.raiseSeparationRequest =
            page.getByText(
                'Raise Separation Request',
                {
                    exact: true
                }
            );


        // =====================================================
        // SEPARATION REASON
        // =====================================================

        this.separationReason =
            page.getByRole(
                'textbox',
                {
                    name: 'Reason for Separation *'
                }
            );


        // =====================================================
        // SEPARATION SUBMIT BUTTON
        // =====================================================

        this.separationSubmitButton =
            page.getByRole(
                'button',
                {
                    name: 'Submit',
                    exact: true
                }
            );


        // =====================================================
        // EMPLOYEE - KEBAB
        // =====================================================

        this.employeeKebab =
            page
                .locator('.custom-table-content')
                .locator('.dropdown > a')
                .first();


        // =====================================================
        // RECALL EARLY RELIEVING
        // =====================================================

        this.recallEarlyRelieving =
            page.getByRole(
                'cell'
            ).filter({
                hasText: 'Recall Early Relieving'
            }).last();


        // =====================================================
        // RECALL OPTION
        // =====================================================

        this.recallOption =
            page.getByText(
                'Recall',
                {
                    exact: true
                }
            ).last();


        // =====================================================
        // RECALL REASON
        // =====================================================

        this.recallReason =
            page.getByRole(
                'textbox',
                {
                    name: 'Please enter recall reason'
                }
            );


        // =====================================================
        // RECALL SUBMIT BUTTON
        // =====================================================

        this.recallSubmitButton =
            page.getByRole(
                'button',
                {
                    name: 'Submit',
                    exact: true
                }
            ).last();


        // =====================================================
        // PENDING APPROVALS
        // =====================================================

        this.pendingApprovals =
            page.getByText(
                'Pending Approvals',
                {
                    exact: true
                }
            );


        // =====================================================
        // OFFBOARDING
        // =====================================================
        //
        // Dynamic count:
        // Offboarding (1)
        // Offboarding (4)
        // Offboarding (6)
        //
        // Do not use :visible in the base locator.
        //

        this.offboarding =
            page
                .locator('div.grid-item')
                .filter({
                    hasText: /^Offboarding\s*\(\d+\)$/
                })
                .first();


        // =====================================================
        // RECALLS
        // =====================================================
        //
        // IMPORTANT:
        // Recalls is NOT a div.grid-item.
        //
        // Actual DOM structure from the application:
        //
        // <li class="cdk-drag nav-item ...">
        //     <div class="nav-link ...">
        //         Recalls (1)
        //     </div>
        // </li>
        //
        // Therefore use the nav-item structure.
        //

        this.recalls =
            page
                .locator('li.cdk-drag.nav-item')
                .filter({
                    hasText: /^\s*Recalls\s*\(\d+\)\s*$/
                })
                .locator('div.nav-link')
                .first();


        // =====================================================
        // MANAGER - KEBAB
        // =====================================================

        this.managerKebab =
            page
                .locator('.custom-table-content')
                .locator('.dropdown > a')
                .first();


        // =====================================================
        // MANAGER - APPROVE OPTION
        // =====================================================

        this.approveOption =
            page.getByText(
                'Approve',
                {
                    exact: true
                }
            ).last();


        // =====================================================
        // MANAGER - APPROVED
        // =====================================================

        this.approvedButton =
            page.getByRole(
                'button',
                {
                    name: 'Approved',
                    exact: true
                }
            );


        // =====================================================
        // MANAGER - CONFIRM APPROVE
        // =====================================================

        this.approveConfirmButton =
            page.getByRole(
                'button',
                {
                    name: 'Approve',
                    exact: true
                }
            );


        // =====================================================
        // HR - FOR YOUR ROLE
        // =====================================================

        this.forYourRole =
            page.getByRole(
                'link',
                {
                    name: /For Your Role/
                }
            );


        // =====================================================
        // HR - KEBAB
        // =====================================================

        this.hrKebab =
            page
                .locator('.custom-table-content')
                .locator('.dropdown > a')
                .first();


        // =====================================================
        // HR - PROCESS
        // =====================================================

        this.processOption =
            page.getByText(
                'Process',
                {
                    exact: true
                }
            ).last();


        // =====================================================
        // HR - APPROVED
        // =====================================================

        this.processApprovedButton =
            page.getByRole(
                'button',
                {
                    name: 'Approved',
                    exact: true
                }
            );


        // =====================================================
        // HR - CONFIRM PROCESS
        // =====================================================

        this.processConfirmButton =
            page.getByRole(
                'button',
                {
                    name: 'Process',
                    exact: true
                }
            );
    }


    // =========================================================
    // EMPLOYEE - MY INFO
    // =========================================================

    async clickMyInfo(): Promise<void> {

        await this.myInfo.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.myInfo.click();

        await this.page.waitForTimeout(1000);
    }


    // =========================================================
    // EMPLOYEE - JOB
    // =========================================================

    async clickJob(): Promise<void> {

        await this.job.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.job.click();

        await this.page.waitForTimeout(1000);
    }


    // =========================================================
    // EMPLOYEE - SEPARATION TAB
    // =========================================================

    async clickSeparationTab(): Promise<void> {

        await this.separationRequestTab.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.separationRequestTab.scrollIntoViewIfNeeded();

        await this.separationRequestTab.click();

        await this.page.waitForTimeout(1500);
    }


    // =========================================================
    // VERIFY SEPARATION REQUEST
    // =========================================================

    async verifySeparationRequest(): Promise<void> {

        await expect(
            this.separationRequestHeading
        ).toBeVisible({
            timeout: 15000
        });
    }


    // =========================================================
    // EMPLOYEE - RAISE SEPARATION REQUEST
    // =========================================================

    async clickRaiseSeparationRequest(): Promise<void> {

        await this.raiseSeparationRequest.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.raiseSeparationRequest.scrollIntoViewIfNeeded();

        await this.raiseSeparationRequest.click();

        await this.page.waitForTimeout(1000);
    }


    // =========================================================
    // ENTER SEPARATION REASON
    // =========================================================

    async enterSeparationReason(
        reason: string
    ): Promise<void> {

        await this.separationReason.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.separationReason.fill(reason);
    }


    // =========================================================
    // SUBMIT SEPARATION REQUEST
    // =========================================================

    async submitSeparationRequest(): Promise<void> {

        await this.separationSubmitButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.separationSubmitButton.click();

        await this.page.waitForTimeout(2000);
    }


    // =========================================================
    // EMPLOYEE - CLICK KEBAB
    // =========================================================

    async clickEmployeeKebab(): Promise<void> {

        const table =
            this.page.locator(
                '.custom-table-content'
            );

        await table.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await table.evaluate(
            (element) => {
                element.scrollLeft =
                    element.scrollWidth;
            }
        );

        await this.page.waitForTimeout(1000);

        const kebab =
            table
                .locator('tbody tr')
                .last()
                .locator('td')
                .last()
                .locator('div')
                .first();

        await kebab.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await kebab.scrollIntoViewIfNeeded();

        await kebab.click();

        await this.page.waitForTimeout(1000);
    }


    // =========================================================
    // EMPLOYEE - SELECT RECALL EARLY RELIEVING
    // =========================================================

    async selectRecallEarlyRelieving(): Promise<void> {

        await this.recallEarlyRelieving.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.recallEarlyRelieving.scrollIntoViewIfNeeded();

        await this.recallEarlyRelieving.click();

        await this.page.waitForTimeout(1000);
    }


    // =========================================================
    // EMPLOYEE - CLICK RECALL
    // =========================================================

    async clickRecall(): Promise<void> {

        await this.recallOption.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.recallOption.scrollIntoViewIfNeeded();

        await this.recallOption.click();

        await this.page.waitForTimeout(1000);
    }


    // =========================================================
    // EMPLOYEE - CLICK RECALL REASON
    // =========================================================

    async clickRecallReason(): Promise<void> {

        await this.recallReason.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.recallReason.click();
    }


    // =========================================================
    // EMPLOYEE - ENTER RECALL REASON
    // =========================================================

    async enterRecallReason(
        reason: string
    ): Promise<void> {

        await this.recallReason.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.recallReason.fill(reason);
    }


    // =========================================================
    // EMPLOYEE - SUBMIT RECALL REQUEST
    // =========================================================

    async submitRecallRequest(): Promise<void> {

        await this.recallSubmitButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await expect(
            this.recallSubmitButton
        ).toBeEnabled({
            timeout: 15000
        });

        await this.recallSubmitButton.click();

        await this.page.waitForTimeout(2000);
    }


    // =========================================================
    // MANAGER / HR - PENDING APPROVALS
    // =========================================================

    async clickPendingApprovals(): Promise<void> {

        await this.pendingApprovals.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.pendingApprovals.click();

        await this.page.waitForTimeout(1000);
    }


    // =========================================================
    // OFFBOARDING
    // =========================================================

    async clickOffboarding(): Promise<void> {

        await this.offboarding.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.offboarding.scrollIntoViewIfNeeded();

        await this.offboarding.click();

        await this.page.waitForTimeout(5000);
    }


    // =========================================================
    // VERIFY OFFBOARDING
    // =========================================================

    async verifyOffboarding(): Promise<void> {

        await expect(
            this.offboarding
        ).toBeVisible({
            timeout: 15000
        });
    }


    // =========================================================
    // CLICK RECALLS
    // =========================================================

    async clickRecalls(): Promise<void> {

        await this.recalls.waitFor({
            state: 'visible',
            timeout: 20000
        });

        await this.recalls.scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(1000);

        await this.recalls.click();

        await this.page.waitForTimeout(3000);
    }


    // =========================================================
    // VERIFY RECALLS
    // =========================================================

    async verifyRecalls(): Promise<void> {

        await expect(
            this.recalls
        ).toBeVisible({
            timeout: 15000
        });
    }


    // =========================================================
    // MANAGER - KEBAB
    // =========================================================

    async clickManagerKebab(): Promise<void> {

        const table =
            this.page.locator(
                '.custom-table-content'
            );

        await table.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await table.evaluate(
            (element) => {
                element.scrollLeft =
                    element.scrollWidth;
            }
        );

        await this.page.waitForTimeout(1000);

        const kebab =
            table
                .locator('.dropdown:visible')
                .last()
                .locator(
                    'a, button, [role="button"]'
                )
                .first();

        await kebab.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await kebab.scrollIntoViewIfNeeded();

        await kebab.click();

        await this.page.waitForTimeout(500);
    }


    // =========================================================
    // MANAGER - APPROVE
    // =========================================================

    async clickApprove(): Promise<void> {

        await this.approveOption.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.approveOption.click();

        await this.page.waitForTimeout(1000);
    }


    // =========================================================
    // MANAGER - SELECT APPROVED
    // =========================================================

    async selectApproved(): Promise<void> {

        await this.approvedButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.approvedButton.click();

        await this.page.waitForTimeout(500);
    }


    // =========================================================
    // MANAGER - CONFIRM APPROVE
    // =========================================================

    async confirmApprove(): Promise<void> {

        await this.approveConfirmButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.approveConfirmButton.click();

        await this.page.waitForTimeout(2000);
    }


    // =========================================================
    // HR - FOR YOUR ROLE
    // =========================================================

    async clickForYourRole(): Promise<void> {

        await this.forYourRole.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.forYourRole.scrollIntoViewIfNeeded();

        await this.forYourRole.click();

        await this.page.waitForTimeout(1500);
    }


    // =========================================================
    // HR - KEBAB
    // =========================================================

    async clickHRKebab(): Promise<void> {

        const table =
            this.page.locator(
                '.custom-table-content'
            );

        await table.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await table.evaluate(
            (element) => {
                element.scrollLeft =
                    element.scrollWidth;
            }
        );

        await this.page.waitForTimeout(1000);

        const kebab =
            table
                .locator('.dropdown:visible')
                .last()
                .locator(
                    'a, button, [role="button"]'
                )
                .first();

        await kebab.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await kebab.scrollIntoViewIfNeeded();

        await kebab.click();

        await this.page.waitForTimeout(500);
    }


    // =========================================================
    // HR - PROCESS
    // =========================================================

    async clickProcess(): Promise<void> {

        await this.processOption.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.processOption.click();

        await this.page.waitForTimeout(1000);
    }


    // =========================================================
    // HR - SELECT APPROVED
    // =========================================================

    async selectProcessApproved(): Promise<void> {

        await this.processApprovedButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.processApprovedButton.click();

        await this.page.waitForTimeout(500);
    }


    // =========================================================
    // HR - CONFIRM PROCESS
    // =========================================================

    async confirmProcess(): Promise<void> {

        await this.processConfirmButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.processConfirmButton.click();

        await this.page.waitForTimeout(2000);
    }
}