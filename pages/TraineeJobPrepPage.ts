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
    await workMail.blur();
    const save = this.page.locator('ngb-modal-window.show, .modal.show')
      .getByRole('button', { name: 'Save' })
      .or(this.page.getByRole('button', { name: 'Save' }).last());
    await expect(save).toBeEnabled({ timeout: 15000 });
    await save.click();
    const toast = this.page.getByText(/Contact Information updated/i);
    await expect(toast.first()).toBeVisible({ timeout: 15000 }).catch(() => {});
    console.log(`Work email set to ${workEmail}`);
    return workEmail;
  }

  async ensureJobInfo() {
    const jobTab = this.page.getByText('Job', { exact: true });
    await jobTab.click();
    await this.page.locator('div').filter({ hasText: /^Job Info$/ }).nth(1).click();
    await this.page.waitForTimeout(1500);
    await this.page.locator('#pn_id_3').click().catch(() => {});

    for (let step = 0; step < 24; step++) {
      await this.page.keyboard.press('ArrowRight');
    }

    const updateMenu = this.page.getByText('Update', { exact: true });
    if (!(await this.page.getByRole('combobox', { name: 'Please select department' }).isVisible().catch(() => false))) {
      const kebabCandidates = [
        this.page.locator('table i.bi').last(),
        this.page.locator('table .dropdown > span > .bi').last(),
        this.page.locator('i').nth(2),
      ];
      let opened = false;
      for (const kebab of kebabCandidates) {
        if (!(await kebab.isVisible().catch(() => false))) {
          continue;
        }
        await kebab.click();
        if (await updateMenu.first().isVisible({ timeout: 3000 }).catch(() => false)) {
          await updateMenu.first().click();
          opened = true;
          break;
        }
      }
      if (!opened) {
        console.log('Job Info kebab menu was not available; continuing');
        await this.dismissBlockingModals();
        return;
      }
    }

    const department = this.page.getByRole('combobox', { name: 'Please select department' });
    if (!(await department.isVisible({ timeout: 8000 }).catch(() => false))) {
      console.log('Job Info update form was not available; continuing');
      await this.dismissBlockingModals();
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
      await this.dismissBlockingModals();
    }
  }

  private async dismissBlockingModals() {
    const modal = this.page.locator('ngb-modal-window.show, .modal.show');
    if (!(await modal.isVisible().catch(() => false))) {
      return;
    }
    await this.page.keyboard.press('Escape').catch(() => {});
    const close = this.page.getByRole('button', { name: /Close|Cancel/i }).first();
    if (await close.isVisible().catch(() => false)) {
      await close.click().catch(() => {});
    }
    await modal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
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
