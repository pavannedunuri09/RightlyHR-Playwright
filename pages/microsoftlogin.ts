
import { type Locator, type Page } from '@playwright/test';

export class MicrosoftLoginPage {

    readonly page: Page;

    // Microsoft Login
    readonly microsoftLoginButton: Locator;
    readonly emailInput: Locator;
    readonly nextButton: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly noButton: Locator;

    // Logout
    readonly profileImage: Locator;
    readonly logoutButton: Locator;
    readonly yesButton: Locator;

    // Employee
    readonly employeeIcon: Locator;
    readonly employeeName: Locator;
    readonly generateCredentialsButton: Locator;

    // Employee Login
    readonly employeeEmailInput: Locator;
    readonly employeePasswordInput: Locator;
    readonly employeeLoginButton: Locator;

    // New Password
    readonly newPasswordInput: Locator;
    readonly confirmNewPasswordInput: Locator;
    readonly saveProceedButton: Locator;

    constructor(page: Page) {

        this.page = page;

        // Microsoft Login
        this.microsoftLoginButton = page.locator('button').nth(5);

        this.emailInput = page.getByRole('textbox', {
            name: 'Enter your email, phone, or'
        });

        this.nextButton = page.getByRole('button', {
            name: 'Next'
        });

        this.passwordInput = page.getByRole('textbox', {
            name: 'Enter the password for'
        });

        this.signInButton = page.getByRole('button', {
            name: 'Sign in'
        });

        this.noButton = page.getByRole('button', {
            name: 'No'
        });

        // Logout
        this.profileImage = page.getByRole('img', {
            name: 'Profile Image'
        });

        this.logoutButton = page.getByRole('button', {
            name: 'LogoutLogout'
        });

        this.yesButton = page.getByRole('button', {
            name: 'Yes'
        });

        // Employee
        this.employeeIcon = page.getByRole('img', {
            name: 'Icon'
        }).nth(2);

        this.employeeName = page.getByText('Pankaj Singh');

        this.generateCredentialsButton = page.getByRole('button', {
            name: 'Generate Credentials'
        });

        // Employee Login
        this.employeeEmailInput = page.getByRole('textbox', {
            name: 'Please enter email'
        });

        this.employeePasswordInput = page.getByRole('textbox', {
            name: 'Please enter password'
        });

        this.employeeLoginButton = page.getByRole('button', {
            name: 'Login'
        });

        // New Password
        this.newPasswordInput = page.getByRole('textbox', {
            name: 'New Password *',
            exact: true
        });

        this.confirmNewPasswordInput = page.getByRole('textbox', {
            name: 'Confirm New Password *',
            exact: true
        });

        this.saveProceedButton = page.getByRole('button', {
            name: 'Save & Proceed right Arrow'
        });
    }

    // Microsoft Login
    async openLoginPage() {
        await this.page.goto(
            'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login'
        );
    }

    async clickMicrosoftLogin() {
        await this.microsoftLoginButton.click();
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async clickNext() {
        await this.nextButton.click();
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickSignIn() {
        await this.signInButton.click();
    }

    async clickNo() {
        await this.noButton.click();
    }

    // Employee
    async selectEmployee() {
        await this.employeeIcon.click();
        await this.employeeName.click();
    }

    async clickGenerateCredentials() {
        await this.generateCredentialsButton.click();
    }

    async clickYes() {
        await this.yesButton.click();
    }

    // Employee Login
    async enterEmployeeEmail(email: string) {
        await this.employeeEmailInput.fill(email);
    }

    async enterEmployeePassword(password: string) {
        await this.employeePasswordInput.fill(password);
    }

    async clickEmployeeLogin() {
        await this.employeeLoginButton.click();
    }

    // New Password
    async enterNewPassword(password: string) {
        await this.newPasswordInput.fill(password);
    }

    async enterConfirmNewPassword(password: string) {
        await this.confirmNewPasswordInput.fill(password);
    }

    async clickSaveProceed() {
        await this.saveProceedButton.click();
    }

    // Logout
    async clickProfile() {
        await this.profileImage.click();
    }

    async clickLogout() {
        await this.logoutButton.click();
    }
}

