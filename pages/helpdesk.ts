import { Page, Locator } from '@playwright/test';

export class HelpDesk {

    readonly page: Page;

    // =====================================================
    // HR - SETTINGS / HELPDESK CONFIGURATION
    // =====================================================

    readonly settingsModule: Locator;
    readonly helpDeskConfiguration: Locator;
    readonly addButton: Locator;
    readonly categoryInput: Locator;
    readonly subcategoryTab: Locator;
    readonly categoryDropdown: Locator;
    readonly subcategoryInput: Locator;

    // =====================================================
    // HR - ROLES & PERMISSIONS
    // =====================================================

    readonly rolesPermissions: Locator;
    readonly assignee: Locator;
    readonly employeeDropdown: Locator;
    readonly employeeSearch: Locator;
    readonly employeeOption: Locator;

    // =====================================================
    // EMPLOYEE - HELPDESK
    // =====================================================

    readonly helpDeskModule: Locator;
    readonly raiseQueryButton: Locator;
    readonly employeeCategoryDropdown: Locator;
    readonly employeeSubcategoryDropdown: Locator;
    readonly descriptionInput: Locator;
    readonly submitButton: Locator;

    // =====================================================
    // HR - TEAM QUERIES
    // =====================================================

 readonly teamQueries: Locator;
readonly teamQueriesHeader: Locator;
readonly ticketId: Locator;
readonly assignToDropdown: Locator;
readonly priorityDropdown: Locator;
readonly statusDropdown: Locator;
readonly additionalInput: Locator;

    constructor(page: Page) {

        this.page = page;

        // =====================================================
        // HR - SETTINGS / HELPDESK CONFIGURATION
        // =====================================================

        this.settingsModule = page.locator('rect').first();

        this.helpDeskConfiguration =
            page.getByRole('button', {
                name: 'Icon Help Desk Configuration'
            });

        this.addButton =
            page.getByRole('button', {
                name: 'Add',
                exact: true
            });

        this.categoryInput =
            page.getByRole('textbox', {
                name: 'Please enter category'
            });

        this.subcategoryTab =
            page.getByRole('link', {
                name: 'Subcategory'
            });

        this.categoryDropdown =
            page.getByRole('combobox', {
                name: 'Please select category'
            });

        this.subcategoryInput =
            page.getByRole('textbox', {
                name: 'Please enter subcategory'
            });

        // =====================================================
        // HR - ROLES & PERMISSIONS
        // =====================================================

        this.rolesPermissions =
            page.getByRole('button', {
                name: 'Icon Roles & Permissions'
            });

        this.assignee =
            page.getByText('Assignee', {
                exact: true
            });

        this.employeeDropdown =
            page.getByRole('combobox', {
                name: 'Please select employee'
            });

        this.employeeSearch =
            page.getByRole('searchbox', {
                name: 'Search employee'
            });

        this.employeeOption =
            page.getByRole('option', {
                name: 'SD302099 - Patlolla Akhil'
            });

        // =====================================================
        // EMPLOYEE - HELPDESK
        // =====================================================

        this.helpDeskModule =
            page.locator('.icon-wrapper').first();

        this.raiseQueryButton =
            page.getByRole('button', {
                name: 'Raise a query'
            });

        this.employeeCategoryDropdown =
            page.getByRole('combobox', {
                name: 'Please select category'
            });

        this.employeeSubcategoryDropdown =
            page.getByRole('combobox', {
                name: 'Please select subcategory'
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

        // =====================================================
        // HR - TEAM QUERIES
        // =====================================================

        this.teamQueries =
            page.getByText('Team Queries', {
                exact: true
            });
            this.teamQueriesHeader =
    page.locator('div.component-header')
        .filter({ hasText: /^Team Queries$/ });

        this.ticketId =
            page.getByText('TKT - 14', {
                exact: true
            });

        this.assignToDropdown =
            page.getByRole('combobox', {
                name: 'Please select assign to'
            });

        this.priorityDropdown =
            page.getByRole('combobox', {
                name: 'Please select priority'
            });

        this.statusDropdown =
            page.getByRole('combobox', {
                name: 'Open'
            });

        this.additionalInput =
            page.getByRole('textbox', {
                name: 'Please enter additional'
            });
    }

    // =====================================================
    // HR - SETTINGS METHODS
    // =====================================================

    async clickSettingsModule() {
        await this.settingsModule.click();
    }

    async clickHelpDeskConfiguration() {
        await this.helpDeskConfiguration.click();
    }

    async clickAddButton() {
        await this.addButton.click();
    }

    async enterCategory(category: string) {
        await this.categoryInput.fill(category);
    }

    async clickSubcategoryTab() {
        await this.subcategoryTab.click();
    }

    async selectCategory(category: string) {
        await this.categoryDropdown.click();

        await this.page
            .getByRole('option', {
                name: category,
                exact: true
            })
            .click();
    }

    async enterSubcategory(subcategory: string) {
        await this.subcategoryInput.fill(subcategory);
    }

    // =====================================================
    // HR - ROLES & PERMISSIONS METHODS
    // =====================================================

    async clickRolesPermissions() {
        await this.rolesPermissions.click();
    }

    async clickAssignee() {
        await this.assignee.click();
    }

    async selectEmployee() {

        await this.employeeDropdown.click();

        await this.employeeSearch.fill('patlolla');

        await this.employeeOption.click();
    }

    async clickAddEmployee() {

        await this.page
            .getByRole('button', {
                name: 'Add',
                exact: true
            })
            .click();
    }

    // =====================================================
    // EMPLOYEE METHODS
    // =====================================================

    async clickHelpDeskModule() {
        await this.helpDeskModule.click();
    }

    async clickRaiseQuery() {
        await this.raiseQueryButton.click();
    }

    async selectEmployeeCategory(category: string) {

        await this.employeeCategoryDropdown.click();

        await this.page
            .getByRole('option', {
                name: category,
                exact: true
            })
            .click();
    }

    async selectEmployeeSubcategory(subcategory: string) {

        await this.employeeSubcategoryDropdown.click();

        await this.page
            .getByRole('option', {
                name: subcategory,
                exact: true
            })
            .click();
    }

    async enterDescription(description: string) {
        await this.descriptionInput.fill(description);
    }

    async clickSubmit() {
        await this.submitButton.click();
    }

    // =====================================================
    // TEAM QUERIES METHODS
    // =====================================================

    async clickTeamQueries() {
        await this.teamQueries.click();
    }

    async clickTicketId(ticketId: string) {

        await this.page
            .getByText(ticketId, {
                exact: true
            })
            .click();
    }

    async selectAssignTo() {

        await this.assignToDropdown.click();

        const searchBox =
            this.page.getByRole('searchbox').last();

        await searchBox.fill('kus');

        await this.page
            .getByText(
                'FPST0020 - kushitha bhuvanam',
                {
                    exact: true
                }
            )
            .click();
    }

    async selectPriority(priority: string) {

        await this.priorityDropdown.click();

        await this.page
            .getByText(priority, {
                exact: true
            })
            .click();
    }

    async selectStatus(status: string) {

        await this.statusDropdown.click();

        await this.page
            .getByRole('option', {
                name: status,
                exact: true
            })
            .click();
    }

    async enterAdditionalInformation(
        information: string
    ) {

        await this.additionalInput.fill(
            information
        );
    }

    async submitTicketUpdate() {
        await this.submitButton.click();
    }
}