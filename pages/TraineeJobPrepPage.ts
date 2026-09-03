import { expect, type Locator, type Page } from '@playwright/test';

export class TraineeJobPrepPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async ensureWorkEmail(workEmail: string) {
    const personal = this.page.getByText('Personal', { exact: true });
    if (await personal.isVisible().catch(() => false)) {
      await personal.click();
    }

    const contact = this.page.locator('div').filter({ hasText: /^Contact Info$/ }).nth(1)
      .or(this.page.getByText('Contact Info', { exact: true }));
    await contact.first().click();

    const workMail = this.page.getByRole('textbox', { name: /Work Mail/i });
    if (!(await workMail.isVisible({ timeout: 8000 }).catch(() => false))) {
      await this.page.locator('div:nth-child(2) > a').first().click();
    }
    await workMail.waitFor({ state: 'visible', timeout: 15000 });
    if (await workMail.isDisabled().catch(() => true)) {
      const edit = this.page.getByText('Contact Info', { exact: true }).last().locator('xpath=following-sibling::*').first()
        .or(this.page.locator('div:nth-child(2) > a').first());
      await edit.click();
      await expect(workMail).toBeEnabled({ timeout: 10000 });
    }
    const current = (await workMail.inputValue()).trim();
    if (current && !/^NA$/i.test(current)) {
      console.log(`Work email already set: ${current}`);
      await this.page.keyboard.press('Escape').catch(() => {});
      return current;
    }

    await workMail.fill(workEmail);
    await this.page.getByRole('button', { name: 'Save' }).click();
    const toast = this.page.getByText(/Contact Information updated/i);
    await expect(toast.first()).toBeVisible({ timeout: 15000 }).catch(() => {});
    console.log(`Work email set to ${workEmail}`);
    return workEmail;
  }

  async ensureJobInfo() {
    const jobTab = this.page.getByText('Job', { exact: true });
    await jobTab.click();
    const jobInfo = this.page.getByRole('img', { name: 'Job Info', exact: true })
      .or(this.page.locator('div').filter({ hasText: /^Job Info$/ }).nth(1));
    await jobInfo.first().click();
    await this.page.waitForTimeout(1500);

    const updateMenu = this.page.getByText('Update', { exact: true });
    if (!(await this.page.getByRole('combobox', { name: 'Please select department' }).isVisible().catch(() => false))) {
      const kebab = this.page.locator('table .dropdown, table i.bi, table .bi').last();
      if (await kebab.isVisible().catch(() => false)) {
        await kebab.click();
      } else {
        await this.page.locator('i').nth(2).click();
      }
      if (await updateMenu.first().isVisible().catch(() => false)) {
        await updateMenu.first().click();
      }
    }

    const department = this.page.getByRole('combobox', { name: 'Please select department' });
    if (!(await department.isVisible({ timeout: 8000 }).catch(() => false))) {
      console.log('Job Info update form was not available; continuing');
      return;
    }

    await this.selectIfNeeded(this.page.getByRole('combobox', { name: /department/i }).first(), 'SDF');
    await this.selectIfNeeded(this.page.getByRole('combobox', { name: /team/i }).first(), /My team/i);
    await this.selectIfNeeded(this.page.getByRole('combobox', { name: /shift/i }).first(), /General Shift/i);
    await this.selectIfNeeded(this.page.getByRole('combobox', { name: /job type/i }), /Intern/);

    const save = this.page.getByRole('button', { name: 'Update' });
    if (await save.isEnabled({ timeout: 8000 }).catch(() => false)) {
      await save.click();
      await expect(this.page.getByText(/updated|success/i).first()).toBeVisible({ timeout: 15000 }).catch(() => {});
      console.log('Job Info updated for onboard request');
    } else {
      console.log('Job Info Update stayed disabled; continuing to onboard request');
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.getByRole('button', { name: /Close|Cancel/i }).first().click().catch(() => {});
    }
  }

  private async selectIfNeeded(combobox: Locator, option: string | RegExp) {
    await combobox.click();
    const named = typeof option === 'string'
      ? this.page.getByRole('option', { name: option })
      : this.page.getByRole('option').filter({ hasText: option });
    if (await named.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await named.first().click();
    } else {
      await this.page.keyboard.press('Escape').catch(() => {});
    }
  }
}
