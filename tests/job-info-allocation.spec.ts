import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { JobInfoWfhPage } from '../pages/JobInfoWfhPage';
import { WorkFromHomePage } from '../pages/WorkFromHomePage';
import { RemoteLoginPage } from '../pages/RemoteLoginPage';

const EMPLOYEE_NAME = 'saii Pavan Dinesh Tejaa';
const EMPLOYEE_SEARCH = 'saii';
const WFH_MANAGER = 'SD302262 - saii Pavan Dinesh';
const REMOTE_LOGIN_MANAGER = 'SD302262 - saii Pavan Dinesh';

test.describe.serial('Job Info WFH / Remote Login allocation', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  test('shows Job Info list columns and Active / Inactive statuses', async ({ page }) => {
    const jobWfh = new JobInfoWfhPage(page);
    await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);

    await expect(jobWfh.effectiveFromHeader).toBeVisible();
    await expect(jobWfh.allocationTypeHeader).toBeVisible();
    await expect(jobWfh.allocatedLocationHeader).toBeVisible();
    await expect(jobWfh.allocatedManagerHeader).toBeVisible();
    await expect(jobWfh.statusHeader).toBeVisible();
    await expect(jobWfh.allocateButton).toBeVisible();

    const wfhActive = await jobWfh.wfhActiveRow.isVisible().catch(() => false);
    const remoteLoginActive = await jobWfh.remoteLoginActiveRow.isVisible().catch(() => false);
    const hasInactive = (await jobWfh.inactiveStatus.count()) > 0;
    const hasAssigned = (await jobWfh.availableStatus.count()) > 0;
    expect(
      wfhActive || remoteLoginActive || hasInactive || hasAssigned,
      'list should show Active, Inactive, or Assigned allocations',
    ).toBe(true);
  });

  test('allows only one Active allocation at a time', async ({ page }) => {
    const jobWfh = new JobInfoWfhPage(page);
    await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);

    expect(await jobWfh.activeAllocationCount()).toBeLessThanOrEqual(1);
    const wfhActive = await jobWfh.wfhActiveRow.count();
    const remoteLoginActive = await jobWfh.remoteLoginActiveRow.count();
    expect(wfhActive > 0 && remoteLoginActive > 0).toBe(false);
  });

  test('hides WFH and Remote Login Time Off tabs when both allocations are Inactive', async ({ page }) => {
    test.setTimeout(180000);
    const jobWfh = new JobInfoWfhPage(page);
    await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);

    await jobWfh.inactivateActiveRow('WFH');
    await jobWfh.inactivateActiveRow('Remote Login');
    expect(await jobWfh.activeAllocationCount()).toBe(0);

    const loginPage = new LoginPage(page);
    await loginPage.validateUserSession();
    const tabs = await jobWfh.peekTimeOffTabs();
    await expect(tabs.wfh).toHaveCount(0);
    await expect(tabs.remoteLogin).toHaveCount(0);
  });

  test('replaces Time Off with WFH only after user validation', async ({ page }) => {
    test.setTimeout(180000);
    const jobWfh = new JobInfoWfhPage(page);
    await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);

    if (!(await jobWfh.wfhActiveRow.isVisible().catch(() => false))) {
      await jobWfh.ensureWfhActiveForToday(WFH_MANAGER);
    }
    await expect(jobWfh.wfhActiveRow).toBeVisible();
    await expect(jobWfh.remoteLoginActiveRow).toHaveCount(0);

    const tabsBeforeValidation = await jobWfh.peekTimeOffTabs();
    await expect(tabsBeforeValidation.wfh).toHaveCount(0);
    await expect(tabsBeforeValidation.remoteLogin).toHaveCount(0);

    await jobWfh.openUserValidationIfPresent();
    const loginPage = new LoginPage(page);
    await loginPage.validateUserSession();

    const tabsAfterValidation = await jobWfh.peekTimeOffTabs();
    await expect(tabsAfterValidation.wfh).toBeVisible();
    await expect(tabsAfterValidation.remoteLogin).toHaveCount(0);
    await tabsAfterValidation.wfh.click();
    await expect(page).toHaveURL(/\/time-off\/wfh/i);
    const wfhPage = new WorkFromHomePage(page);
    await expect(wfhPage.requestWfhButton).toBeVisible();
  });

  test('future effective date shows Available and does not replace the Time Off tab', async ({ page }) => {
    test.setTimeout(180000);
    const jobWfh = new JobInfoWfhPage(page);
    await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);

    if (!(await jobWfh.wfhActiveRow.isVisible().catch(() => false))) {
      await jobWfh.ensureWfhActiveForToday(WFH_MANAGER);
    }

    if (!(await jobWfh.availableStatus.first().isVisible().catch(() => false))) {
      await jobWfh.allocateFutureAvailable('Remote Login', REMOTE_LOGIN_MANAGER);
    }

    await expect(jobWfh.availableStatus.first()).toBeVisible();
    await expect(jobWfh.wfhActiveRow).toBeVisible();

    const loginPage = new LoginPage(page);
    await loginPage.validateUserSession();
    const tabs = await jobWfh.peekTimeOffTabs();
    await expect(tabs.wfh).toBeVisible();
    await expect(tabs.remoteLogin).toHaveCount(0);
    await tabs.wfh.click();
    await expect(page).toHaveURL(/\/time-off\/wfh/i);
  });

  test('switches WFH to Remote Login after user validation then restores WFH', async ({ page }) => {
    test.setTimeout(240000);
    const jobWfh = new JobInfoWfhPage(page);
    await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);

    await jobWfh.ensureRemoteLoginActiveForToday(REMOTE_LOGIN_MANAGER);
    await expect(jobWfh.remoteLoginActiveRow).toBeVisible();
    await expect(jobWfh.wfhActiveRow).toHaveCount(0);

    const loginPage = new LoginPage(page);
    await loginPage.validateUserSession();
    const rlTabs = await jobWfh.peekTimeOffTabs();
    await expect(rlTabs.remoteLogin).toBeVisible();
    await expect(rlTabs.wfh).toHaveCount(0);
    await rlTabs.remoteLogin.click();
    await expect(page).toHaveURL(/\/time-off\/remote(\/|$)/i);
    const rlPage = new RemoteLoginPage(page);
    await expect(rlPage.requestRemoteLoginButton).toBeVisible();

    await jobWfh.openEmployeeJobWfh(EMPLOYEE_NAME, EMPLOYEE_SEARCH);
    await jobWfh.ensureWfhActiveForToday(WFH_MANAGER);
    await expect(jobWfh.wfhActiveRow).toBeVisible();
    await expect(jobWfh.remoteLoginActiveRow).toHaveCount(0);

    await loginPage.validateUserSession();
    const wfhTabs = await jobWfh.peekTimeOffTabs();
    await expect(wfhTabs.wfh).toBeVisible();
    await expect(wfhTabs.remoteLogin).toHaveCount(0);
    await wfhTabs.wfh.click();
    await expect(page).toHaveURL(/\/time-off\/wfh/i);
    const wfhPage = new WorkFromHomePage(page);
    await expect(wfhPage.requestWfhButton).toBeVisible();
  });
});
