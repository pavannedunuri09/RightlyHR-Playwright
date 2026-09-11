/// <reference types="node" />
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RolesPermissionsPage } from "../pages/RolesPermissionsPage";

test.describe("Employee Dashboard RBAC", () => {
  test("Test-01: Employee should not see Dashboard when Dashboard permission is disabled", async ({page}) => {
    // HR/Admin credentials
    const hrEmail = process.env.LOGIN_EMAIL?.trim();
    const hrPassword = process.env.LOGIN_PASSWORD?.trim();

    // Employee credentials
    const employeeEmail = process.env.EMPLOYEE_EMAIL?.trim();
    const employeePassword = process.env.EMPLOYEE_PASSWORD?.trim();

    test.skip(
      !hrEmail || !hrPassword || !employeeEmail || !employeePassword,
      "Required credentials are missing in .env",
    );

    const loginPage = new LoginPage(page);
    const rolesPermissionsPage = new RolesPermissionsPage(page);

    // ========================================
    // STEP 1: Login as HR/Admin
    // ========================================

    await loginPage.goto();

    await loginPage.login(hrEmail!, hrPassword!);

    // ========================================
    // STEP 2: Disable Dashboard permission
    // for Employee role
    // ========================================

    await page.getByText("Roles & Permissions", { exact: true }).click();
    console.log('Opened Roles & Permissions page');
    await rolesPermissionsPage.permissionsTab.click();

    await rolesPermissionsPage.selectRole("Employee");

    await rolesPermissionsPage.searchPermission("dashboard");

    await rolesPermissionsPage.disableDashboardPermission();

    await rolesPermissionsPage.savePermissions();

    // Verify permission update
    await expect(page.getByText("Permissions updated")).toBeVisible({
      timeout: 15000,
    });

    // ========================================
    // STEP 3: Logout HR/Admin
    // ========================================

    await loginPage.logout();

    await expect(page).toHaveURL(/.*login/);

    // ========================================
    // STEP 4: Login as Employee
    // ========================================

    await loginPage.login(employeeEmail!, employeePassword!);

    // ========================================
    // STEP 5: Verify Dashboard is NOT visible
    // ========================================

    await expect(
      page.getByText("Dashboard", { exact: true }),
    ).not.toBeVisible();
  });
  test("Test-02: Employee can login successfully", async ({ page }) => {
    const email = process.env.EMPLOYEE_EMAIL?.trim();
    const password = process.env.EMPLOYEE_PASSWORD?.trim();

    test.skip(
      !email || !password,
      "Set EMPLOYEE_EMAIL and EMPLOYEE_PASSWORD in .env",
    );

    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(email!, password!);

    // Verify Employee Dashboard URL
    await expect(page).toHaveURL(/.*dashboard.*emp/, {
      timeout: 30000,
    });

    // Verify Dashboard is visible
    await expect(
      page.getByText("Dashboard", { exact: true }).first(),
    ).toBeVisible();
  });
});
