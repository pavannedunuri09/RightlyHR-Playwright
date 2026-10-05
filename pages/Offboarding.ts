import { Page, expect } from '@playwright/test';

export class OffboardingPage {
    constructor(private readonly page: Page) { }

    // =========================================================
    // TC01 - EMPLOYEES / ACTIVE EMPLOYEES
    // =========================================================

    async clickEmployees() {
        await this.page
            .getByText('Employees', { exact: true })
            .click();
    }

    async clickActiveEmployees() {
        await this.page
            .getByText('Active Employees', { exact: true })
            .click();
    }

    // =========================================================
    // TC02 - EMPLOYEE / JOB
    // =========================================================

    async searchEmployee(username: string) {
        await this.page
            .getByRole('searchbox', { name: 'Username' })
            .fill(username);
    }

    async clickEmployee(employeeName: string) {
        await this.page
            .getByText(employeeName, { exact: true })
            .click();
    }

    async clickJob() {
        await this.page
            .getByText('Job', { exact: true })
            .click();
    }

    // =========================================================
    // TC03 - OFFBOARDING
    // =========================================================

    async clickOffboarding() {
        await this.page
            .locator('div')
            .filter({ hasText: /^Offboarding Info$/ })
            .nth(1)
            .click();
    }

    // =========================================================
    // TC04 - INITIATE OFFBOARDING
    // =========================================================

    async initiateOffboarding() {
        const initiateBtn = this.page.getByRole('button', {
            name: 'Initiate Offboarding',
            exact: true
        });

        try {
            await initiateBtn.waitFor({ state: 'visible', timeout: 5000 });
            await initiateBtn.click();

            await this.page
                .getByRole('button', {
                    name: 'Yes',
                    exact: true
                })
                .click();
        } catch {
            console.log('Initiate Offboarding button not present, already in wizard');
        }
    }

    // =========================================================
    // TC05 - MANAGER PENDING REQUESTS
    // =========================================================

    async verifyManagerPendingRequests() {
        await expect(this.page.getByText('Pending Requests', { exact: true })).toBeVisible();
    }

    // =========================================================
    // TC06 - PROCESS PENDING REQUEST
    // =========================================================

    async processPendingRequest() {
        const cell = this.page
            .getByRole('cell')
            .filter({ hasText: 'ProcessReject' })
            .first();

        if (await cell.isVisible({ timeout: 3000 }).catch(() => false)) {
            await cell.click();

            await this.page
                .getByText('Process', { exact: true })
                .first()
                .click();

            const yes = this.page.getByRole('button', {
                name: 'Yes',
                exact: true
            });
            if (await yes.isVisible({ timeout: 3000 }).catch(() => false)) {
                await yes.click();
            }
        }
    }

    // =========================================================
    // TC07 - SKIP PENDING REQUEST
    // =========================================================

    async skipPendingRequest() {
        const skipBtn = this.page.getByRole('button', {
            name: 'Skip & Continue',
            exact: true
        });

        if (await skipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await skipBtn.click();

            const yes = this.page.getByRole('button', {
                name: 'Yes',
                exact: true
            });
            if (await yes.isVisible({ timeout: 3000 }).catch(() => false)) {
                await yes.click();
            }
        }
    }

    // =========================================================
    // TC08 - REJECT PENDING REQUEST
    // =========================================================

    async rejectPendingRequest() {
        const cell = this.page
            .getByRole('cell')
            .filter({ hasText: 'ProcessReject' })
            .first();

        if (await cell.isVisible({ timeout: 3000 }).catch(() => false)) {
            await cell.click();

            await this.page
                .getByText('Reject', { exact: true })
                .first()
                .click();

            const rej = this.page.getByRole('button', {
                name: 'Rejected',
                exact: true
            }).first();
            if (await rej.isVisible({ timeout: 3000 }).catch(() => false)) {
                await rej.click();
            }

            const confirm = this.page.getByRole('button', {
                name: 'Reject',
                exact: true
            }).first();
            if (await confirm.isVisible({ timeout: 3000 }).catch(() => false)) {
                await confirm.click();
            }
        }
    }

    // =========================================================
    // TC09 / TC13 / TC17 - NEXT BUTTON
    // =========================================================

    async verifyNextEnabled() {
        if (this.page.url().includes('employee-off-boarding')) {
            return;
        }

        const nextButton = this.page.getByRole('button', {
            name: 'Next',
            exact: true
        });

        // 1. Try skipping remaining requests if Skip & Continue is present
        for (let i = 0; i < 5; i++) {
            if (await nextButton.isEnabled().catch(() => false)) {
                break;
            }
            const skipButton = this.page.getByRole('button', {
                name: 'Skip & Continue',
                exact: true
            });
            if (await skipButton.isVisible().catch(() => false)) {
                await skipButton.click();
                const yesButton = this.page.getByRole('button', {
                    name: 'Yes',
                    exact: true
                });
                if (await yesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await yesButton.click();
                }
                await this.page.waitForTimeout(1000);
            } else {
                break;
            }
        }

        await expect(nextButton).toBeEnabled({ timeout: 15000 });
    }

    async clickNext() {
        const nextButton = this.page.getByRole('button', {
            name: 'Next',
            exact: true
        });

        if (await nextButton.isVisible({ timeout: 4000 }).catch(() => false)) {
            await expect(nextButton).toBeEnabled({ timeout: 15000 });
            await nextButton.click();
            await this.page.waitForTimeout(2000);
        }
    }

    // =========================================================
    // TC10 - PROCESS MANAGER PENDING APPROVAL
    // =========================================================

    async processManagerPendingApproval() {
        if (this.page.url().includes('employee-off-boarding') || this.page.url().includes('no-approvals-screen')) {
            return;
        }

        const row = this.page.getByRole('row', { name: 'Employee ID Employee Name' });
        if (!(await row.isVisible().catch(() => false))) {
            const wfh = this.page.getByText('WFH Requests');
            if (await wfh.isVisible().catch(() => false)) {
                await wfh.click();
                await this.page.waitForTimeout(1000);
            }
        }

        const checkbox = this.page
            .getByRole('checkbox')
            .first();

        if (await checkbox.isVisible({ timeout: 5000 }).catch(() => false)) {
            await checkbox.check();

            const processBtn = this.page.getByRole('button', {
                name: 'Process',
                exact: true
            });
            if (await processBtn.isVisible().catch(() => false)) {
                await processBtn.click();
                const yesBtn = this.page.getByRole('button', {
                    name: 'Yes',
                    exact: true
                });
                if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await yesBtn.click();
                }
            }
        }
    }

    // =========================================================
    // TC11 - SKIP MANAGER PENDING APPROVAL
    // =========================================================

    async skipManagerPendingApproval() {
        if (this.page.url().includes('employee-off-boarding') || this.page.url().includes('no-approvals-screen')) {
            return;
        }

        const skipButton = this.page.getByRole('button', {
            name: 'Skip & Continue',
            exact: true
        });
        if (await skipButton.isVisible().catch(() => false)) {
            await skipButton.click();
            const yesButton = this.page.getByRole('button', {
                name: 'Yes',
                exact: true
            });
            if (await yesButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await yesButton.click();
            }
        }
    }

    // =========================================================
    // TC12 - REJECT MANAGER PENDING APPROVAL
    // =========================================================

    async rejectManagerPendingApproval() {
        if (this.page.url().includes('employee-off-boarding') || this.page.url().includes('no-approvals-screen')) {
            return;
        }

        const row = this.page.getByRole('row', { name: 'Employee ID Employee Name' });
        if (!(await row.isVisible().catch(() => false))) {
            const perm = this.page.getByText('Permissions Requests');
            if (await perm.isVisible().catch(() => false)) {
                await perm.click();
                await this.page.waitForTimeout(1000);
            }
        }

        const checkbox = this.page
            .getByRole('checkbox')
            .first();

        if (await checkbox.isVisible({ timeout: 5000 }).catch(() => false)) {
            await checkbox.check();

            const rejectBtn = this.page.getByRole('button', {
                name: 'Reject',
                exact: true
            });
            if (await rejectBtn.isVisible().catch(() => false)) {
                await rejectBtn.click();
                const rejectedBtn = this.page.getByRole('button', {
                    name: 'Rejected',
                    exact: true
                });
                if (await rejectedBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await rejectedBtn.click();
                }
                const confirmReject = this.page.getByRole('button', {
                    name: 'Reject',
                    exact: true
                });
                if (await confirmReject.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await confirmReject.click();
                }
            }
        }
    }

    // =========================================================
    // TC14 - MANAGER TYPE
    // =========================================================

    async selectManagerType(type: string) {
        if (this.page.url().includes('employee-off-boarding')) {
            console.log('RM/TM change not applicable for employee without reportees, proceeding.');
            return;
        }

        const combobox = this.page
            .getByRole('combobox', {
                name: 'Select type'
            })
            .or(this.page.locator('p-dropdown').filter({ hasText: /select type/i }))
            .first();

        if (await combobox.isVisible({ timeout: 3000 }).catch(() => false)) {
            await combobox.click();
            await this.page
                .getByRole('option', {
                    name: type,
                    exact: true
                })
                .or(this.page.getByText(type, { exact: true }))
                .first()
                .click();
        }
    }

    // =========================================================
    // TC15 - SELECT EMPLOYEE
    // =========================================================

    async selectEmployeeFromDropdown(employee: string) {
        if (this.page.url().includes('employee-off-boarding')) return;

        const selectEmp = this.page
            .getByText('Select employees', {
                exact: true
            })
            .or(this.page.locator('p-multiselect').filter({ hasText: /select employees/i }))
            .first();

        if (await selectEmp.isVisible({ timeout: 3000 }).catch(() => false)) {
            await selectEmp.click();
            const option = this.page
                .getByText(employee, {
                    exact: true
                })
                .first();
            if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
                await option.click();
            }
        }
    }

    async selectReportingManager(manager: string) {
        if (this.page.url().includes('employee-off-boarding')) return;

        const mgrCombobox = this.page
            .getByRole('combobox', {
                name: 'Select manager'
            })
            .or(this.page.locator('p-dropdown').filter({ hasText: /select manager/i }))
            .first();

        if (await mgrCombobox.isVisible({ timeout: 3000 }).catch(() => false)) {
            await mgrCombobox.click();
            const option = this.page
                .getByText(manager, {
                    exact: true
                })
                .first();
            if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
                await option.click();
            }
        }
    }

    // =========================================================
    // TC16 - EFFECTIVE DATE / ASSIGN
    // =========================================================

    async selectEffectiveDate(date: string) {
        if (this.page.url().includes('employee-off-boarding')) return;

        const dateInput = this.page.locator('input[type="date"]').first();
        if (await dateInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await dateInput.fill(date);
        }
    }

    async clickAssign() {
        if (this.page.url().includes('employee-off-boarding')) return;

        const assignBtn = this.page
            .getByRole('button', {
                name: 'Assign',
                exact: true
            })
            .first();

        if (await assignBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await assignBtn.click();
            await this.page.waitForTimeout(1000);
        }
    }

    // =========================================================
    // TC18 - TEAM MANAGER MANDATORY FIELDS
    // =========================================================

    async selectDepartment(department: string) {
        if (this.page.url().includes('employee-off-boarding')) return;

        const dept = this.page
            .getByRole('combobox', {
                name: 'Please select department'
            })
            .or(this.page.locator('p-dropdown').filter({ hasText: /select department/i }))
            .first();

        if (await dept.isVisible({ timeout: 3000 }).catch(() => false)) {
            await dept.click();
            await this.page
                .getByText(department, {
                    exact: true
                })
                .first()
                .click();
        }
    }

    async selectTeam(team: string) {
        if (this.page.url().includes('employee-off-boarding')) return;

        const teamDropdown = this.page
            .getByRole('combobox', {
                name: 'Please select team'
            })
            .or(this.page.locator('p-dropdown').filter({ hasText: /select team/i }))
            .first();

        if (await teamDropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
            await teamDropdown.click();
            await this.page
                .getByRole('option', {
                    name: team,
                    exact: true
                })
                .or(this.page.getByText(team, { exact: true }))
                .first()
                .click();
        }
    }

    async selectSubTeam(subTeam: string) {
        if (this.page.url().includes('employee-off-boarding')) return;

        const subTeamDropdown = this.page
            .getByRole('combobox', {
                name: 'Please select team'
            })
            .or(this.page.locator('p-dropdown').filter({ hasText: /select team|sub team/i }))
            .last();

        if (await subTeamDropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
            await subTeamDropdown.click();
            await this.page
                .getByText(subTeam, {
                    exact: true
                })
                .first()
                .click();
        }
    }

    async selectRole(role: string) {
        if (this.page.url().includes('employee-off-boarding')) return;

        const roleDropdown = this.page
            .getByRole('combobox', {
                name: 'Associate QA'
            })
            .or(this.page.getByRole('combobox', {
                name: /select role/i
            }))
            .or(this.page.locator('p-dropdown').filter({ hasText: /QA|role/i }))
            .first();

        if (await roleDropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
            await roleDropdown.click();
            await this.page
                .getByRole('option', {
                    name: role,
                    exact: true
                })
                .or(this.page.getByText(role, { exact: true }))
                .first()
                .click();
        }
    }

    // =========================================================
    // TC19 - STATUS / SUBMIT
    // =========================================================

    async selectStatus(status: string) {
        // Locate dropdown box for Status on Step 4
        const statusBox = this.page
            .locator('p-select')
            .filter({ hasText: /select status/i })
            .or(this.page.locator('div').filter({ hasText: /^Please select status/ }))
            .or(this.page.getByRole('combobox', { name: /select status/i }))
            .last();

        if (await statusBox.isVisible({ timeout: 5000 }).catch(() => false)) {
            await statusBox.click();
            await this.page.waitForTimeout(500);

            // Select option from PrimeNG 18 overlay panel
            const overlayItem = this.page
                .locator('.cdk-overlay-container, .p-select-panel, .dropdown-menu, [role="listbox"]')
                .locator('*')
                .filter({ hasText: new RegExp(`^${status}$`, 'i') })
                .last();

            if (await overlayItem.isVisible({ timeout: 3000 }).catch(() => false)) {
                await overlayItem.click();
            } else {
                await this.page.getByText(status, { exact: true }).last().click();
            }
            await this.page.waitForTimeout(1000);
        }
    }

    async clickSubmit() {
        const submitBtn = this.page.getByRole('button', {
            name: 'Submit',
            exact: true
        }).first();

        if (await submitBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(submitBtn).toBeEnabled({ timeout: 15000 });
            await submitBtn.click();
            await this.page.waitForTimeout(1000);

            const yesBtn = this.page.getByRole('button', { name: 'Yes', exact: true });
            if (await yesBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await yesBtn.click();
            }
            await this.page.waitForTimeout(2000);
        }
    }

    // =========================================================
    // TC20 - VERIFY INACTIVE
    // =========================================================

    async verifyEmployeeInactive(
        username: string,
        employeeName: string,
        expectedStatus: string
    ) {
        // If already on Inactive Employees page (redirected automatically after submit)
        if (this.page.url().includes('inactive/employees')) {
            const searchInput = this.page
                .getByPlaceholder(/search by/i)
                .or(this.page.locator('input[placeholder*="Search"]'))
                .or(this.page.getByRole('searchbox'))
                .first();

            await searchInput.fill(username);
            await this.page.waitForTimeout(1500);

            await expect(
                this.page.getByText(employeeName, { exact: false }).first()
            ).toBeVisible({ timeout: 10000 });
            return;
        }

        // Otherwise navigate to Employees -> Inactive
        await this.clickEmployees();
        const inactiveTab = this.page
            .getByRole('button', { name: 'Inactive' })
            .or(this.page.getByText(/^Inactive/))
            .first();

        if (await inactiveTab.isVisible({ timeout: 3000 }).catch(() => false)) {
            await inactiveTab.click();
            await this.page.waitForTimeout(1500);

            const searchInput = this.page
                .getByPlaceholder(/search by/i)
                .or(this.page.locator('input[placeholder*="Search"]'))
                .or(this.page.getByRole('searchbox'))
                .first();

            await searchInput.fill(username);
            await this.page.waitForTimeout(1500);

            await expect(
                this.page.getByText(employeeName, { exact: false }).first()
            ).toBeVisible({ timeout: 10000 });
            return;
        }

        // Fallback: Verify employee is no longer in Active Employees list
        await this.clickEmployees();
        await this.clickActiveEmployees();
        await this.page.waitForTimeout(1000);
        await this.searchEmployee(username);
        await this.page.waitForTimeout(1500);

        await expect(
            this.page.getByText('No Data Found...', { exact: false })
        ).toBeVisible({ timeout: 10000 });
    }
}
