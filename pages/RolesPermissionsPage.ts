import { Page,Locator,Expect, expect } from "@playwright/test";

export class RolesPermissionsPage {
  

    readonly page: Page;
    readonly permissionsTab: Locator;

    constructor(page: Page) {
        this.page = page;

        this.permissionsTab = page
            .locator('app-settings-role-permissions-module-tabs')
            .locator('.settings-sub-tabs-card')
            .filter({
                has: page.locator('.label-name', {
                    hasText: /^Permissions$/
                })
            });
    }

    async clickPermissions() {
         expect(this.permissionsTab).toBeVisible();
        await this.permissionsTab.click();
    }

  async selectRole(role: string) {
    await this.page.getByRole("button").filter({ hasText: /^$/ }).click();

    await this.page.getByRole("option", { name: role, exact: true }).click();
  }

  async searchPermission(permission: string) {
    await this.page
      .getByRole("searchbox", {
        name: "Search by section name/",
      })
      .fill(permission);
  }

  async disableDashboardPermission() {
    await this.page
      .locator("tr:nth-child(7) > td:nth-child(2) > input")
      .uncheck();
  }

  async savePermissions() {
    await this.page.getByRole("button", { name: "Save" }).click();
  }
}
