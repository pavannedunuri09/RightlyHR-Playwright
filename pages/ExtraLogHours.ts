import { Page, Locator } from '@playwright/test';

export class ExtraLogHours {

    readonly page: Page;

    // =====================================================
    // EMPLOYEE
    // =====================================================

    readonly attendance: Locator;
    readonly logExtraHours: Locator;
    readonly dateInput: Locator;
    readonly durationDropdown: Locator;
    readonly descriptionInput: Locator;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;
    readonly yesButton: Locator;
    readonly noButton: Locator;

    // =====================================================
    // MANAGER
    // =====================================================

    readonly pendingApprovals: Locator;
    readonly timeOffTab: Locator;
    readonly extraHoursTab: Locator;
    readonly kebabMenu: Locator;
    readonly approveOption: Locator;
    readonly rejectOption: Locator;
    readonly approvedButton: Locator;
    readonly approveConfirmButton: Locator;
    readonly rejectedButton: Locator;
    readonly rejectConfirmButton: Locator;


    constructor(page: Page) {

        this.page = page;

        // =====================================================
        // EMPLOYEE LOCATORS
        // =====================================================

        this.attendance =
            page.getByText('Attendance', {
                exact: true
            });

        this.logExtraHours =
            page.getByText('Log Extra Hours', {
                exact: true
            });

        this.dateInput =
            page.locator('input[type="date"]');

        this.durationDropdown =
            page.getByRole('combobox', {
                name: 'Please select duration'
            });

        this.descriptionInput =
            page.getByRole('textbox', {
                name: 'Please enter description'
            });

        this.submitButton =
            page.getByRole('button', {
                name: 'Submit',
                exact: true
            });

        this.cancelButton =
            page.getByRole('button', {
                name: 'Cancel',
                exact: true
            });

        this.yesButton =
            page.getByRole('button', {
                name: 'Yes',
                exact: true
            });

        this.noButton =
            page.getByRole('button', {
                name: 'No',
                exact: true
            });


        // =====================================================
        // MANAGER LOCATORS
        // =====================================================

        this.pendingApprovals =
            page.getByText('Pending Approvals', {
                exact: true
            }).first();

        this.timeOffTab = page.getByText(/Time-Off/i).first();

        /*
         * Extra Hours tab.
         *
         * Use text containing Extra Hours because
         * the count may change dynamically.
         */
   this.extraHoursTab = page
    .getByText('Extra Hours', { exact: true })
    .locator('..');

        this.kebabMenu =
            page
                .locator('.p-datatable-table-container')
                .locator('.dropdown > a')
                .first();

        this.approveOption =
            page
                .getByText('Approve', {
                    exact: true
                })
                .nth(1);

        this.rejectOption =
            page
                .getByText('Reject', {
                    exact: true
                })
                .first();

        this.approvedButton =
            page.getByRole('button', {
                name: 'Approved',
                exact: true
            });

        this.approveConfirmButton =
            page.getByRole('button', {
                name: 'Approve',
                exact: true
            });

        this.rejectedButton =
            page.getByRole('button', {
                name: 'Rejected',
                exact: true
            });

        this.rejectConfirmButton =
            page.getByRole('button', {
                name: 'Reject',
                exact: true
            });
    }


    // =====================================================
    // EMPLOYEE METHODS
    // =====================================================

    async clickAttendance() {

        await this.attendance.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.attendance.click();

        await this.page.waitForTimeout(1000);
    }


    async clickLogExtraHours() {

        await this.logExtraHours.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.logExtraHours.click();

        await this.page.waitForTimeout(1000);
    }


    async enterDate(date: string) {

        await this.dateInput.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.dateInput.fill(date);
    }


    async selectDuration(duration: string) {

        await this.durationDropdown.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.durationDropdown.click();

        await this.page
            .getByRole('option', {
                name: duration,
                exact: true
            })
            .click();
    }


    async enterDescription(description: string) {

        await this.descriptionInput.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.descriptionInput.fill(description);
    }


    async clickSubmit() {

        await this.submitButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.submitButton.click();

        await this.page.waitForTimeout(1500);
    }


    async clickCancel() {

        await this.cancelButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.cancelButton.click();

        await this.page.waitForTimeout(500);
    }


    async clickYes() {

        await this.yesButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.yesButton.click();

        await this.page.waitForTimeout(1000);
    }


    async clickNo() {

        await this.noButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.noButton.click();

        await this.page.waitForTimeout(1000);
    }


    // =====================================================
    // MANAGER METHODS
    // =====================================================

    async clickPendingApprovals() {

        await this.pendingApprovals.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.pendingApprovals.click();

        await this.page.waitForTimeout(1000);
    }


    async clickTimeOff() {

        await this.timeOffTab.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.timeOffTab.click();

        await this.page.waitForTimeout(1000);
    }


   async clickExtraHours() {

    const extraHoursTab = this.page
        .getByText('Extra Hours', { exact: true })
        .last();

    await extraHoursTab.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await extraHoursTab.click();

    await this.page.waitForTimeout(1500);
}

    async clickKebabMenu() {

    const kebabMenus = this.page.locator('.dropdown > a');

    const count = await kebabMenus.count();

    console.log('Kebab menus found:', count);

    for (let i = 0; i < count; i++) {

        const kebab = kebabMenus.nth(i);

        if (await kebab.isVisible()) {

            console.log(
                `Clicking visible kebab menu at index ${i}`
            );

            await kebab.scrollIntoViewIfNeeded();

            await kebab.click();

            await this.page.waitForTimeout(1000);

            return;
        }
    }

    throw new Error('No visible kebab menu found');
}


    async clickApproveOption() {

    const approveOptions = this.page.getByText(
        'Approve',
        { exact: true }
    );

    const count = await approveOptions.count();

    console.log('Approve options found:', count);

    for (let i = 0; i < count; i++) {

        if (await approveOptions.nth(i).isVisible()) {

            console.log(
                `Clicking visible Approve option at index ${i}`
            );

            await approveOptions.nth(i).click();

            await this.page.waitForTimeout(1000);

            return;
        }
    }

    throw new Error('No visible Approve option found');
}

    async clickRejectOption() {

        await this.rejectOption.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.rejectOption.click();

        await this.page.waitForTimeout(1000);
    }


    async clickApprovedButton() {

        await this.approvedButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.approvedButton.click();

        await this.page.waitForTimeout(500);
    }


    async confirmApprove() {

        await this.approveConfirmButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.approveConfirmButton.click();

        await this.page.waitForTimeout(1500);
    }


    async clickRejectedButton() {

        await this.rejectedButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.rejectedButton.click();

        await this.page.waitForTimeout(500);
    }


    async confirmReject() {

        await this.rejectConfirmButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.rejectConfirmButton.click();

        await this.page.waitForTimeout(1500);
    }
}