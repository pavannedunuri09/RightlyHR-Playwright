import { expect, type Locator, type Page } from '@playwright/test';

export class EmployeeJobPrepPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async ensureWorkEmail(workEmail: string) {
    await this.openPersonalContactInfo();

    const workMail = this.page.getByRole('textbox', { name: /Work Mail/i });
    if (!(await workMail.isVisible({ timeout: 8000 }).catch(() => false))) {
      await this.enableContactEdit();
    }
    await workMail.waitFor({ state: 'visible', timeout: 15000 });
    if (await workMail.isDisabled().catch(() => true)) {
      await this.enableContactEdit();
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

  async ensureEmployeeJobInfo() {
    const jobTab = this.page.getByText('Job', { exact: true });
    await jobTab.click();

    const reportingManager = await this.readProfileFieldValue('Reporting Manager');
    const teamManager = await this.readProfileFieldValue('Team Manager')
      ?? await this.readProfileFieldValue('Team');
    if (this.isAssignedValue(reportingManager) && this.isAssignedValue(teamManager)) {
      console.log(`Job Info skipped; RM (${reportingManager}) and TM (${teamManager}) already set`);
      return;
    }

    const jobInfo = this.page.getByRole('img', { name: 'Job Info' })
      .or(this.page.locator('div').filter({ hasText: /^Job Info$/ }).nth(1));
    await jobInfo.first().click();
    await this.page.getByRole('columnheader', { name: /Job Role|Department|Effective Date/i })
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
      .catch(() => {});

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
    await this.selectIfNeeded(this.page.getByRole('combobox', { name: /Reporting/i }).first(), /Bhavitha Reddy|SD302130/, 'bhav');
    await this.selectIfNeeded(this.page.getByRole('combobox', { name: /shift/i }).first(), /General Shift/i);
    await this.selectIfNeeded(this.page.getByRole('combobox', { name: /job type/i }), /Permanent|Full Time|Confirmed|Regular|Employee/);

    const save = this.page.getByRole('button', { name: 'Update' });
    if (await save.isEnabled({ timeout: 8000 }).catch(() => false)) {
      await save.click();
      await expect(this.page.getByText(/Job details updated|updated|success/i).first()).toBeVisible({ timeout: 15000 }).catch(() => {});
      console.log('Job Info updated for employee');
    } else {
      console.log('Job Info Update stayed disabled; continuing');
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.getByRole('button', { name: /Close|Cancel/i }).first().click().catch(() => {});
      await this.dismissBlockingModals();
    }
  }

  private async openPersonalContactInfo() {
    await this.dismissBlockingModals();

    const personal = this.page.getByText('Personal', { exact: true });
    if (await personal.isVisible({ timeout: 5000 }).catch(() => false)) {
      await personal.click({ timeout: 10000 });
    }

    const contactImg = this.page.getByRole('img', { name: 'Contact Info', exact: true });
    if (await contactImg.isVisible({ timeout: 8000 }).catch(() => false)) {
      await contactImg.click({ timeout: 10000 });
      return;
    }

    const contactNav = this.page.locator('div').filter({ hasText: /^Contact Info$/ }).nth(1)
      .or(this.page.getByText('Contact Info', { exact: true }).last());
    await contactNav.first().click({ timeout: 10000 });
  }

  private async enableContactEdit() {
    const workMail = this.page.getByRole('textbox', { name: /Work Mail/i });
    if (await workMail.isEnabled().catch(() => false)) {
      return;
    }

    const editCandidates = [
      this.page.getByText('Contact Info', { exact: true }).last().locator('xpath=following-sibling::*').first(),
      this.page.locator('div:nth-child(2) > a').first(),
      this.page.locator('img[alt="edit-icon"], img[title="edit-icon"]').first(),
      this.page.locator('.ng-star-inserted > a').first(),
    ];
    for (const edit of editCandidates) {
      if (!(await edit.isVisible().catch(() => false))) {
        continue;
      }
      await edit.click({ timeout: 5000 });
      if (await workMail.isEnabled({ timeout: 3000 }).catch(() => false)) {
        return;
      }
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

  private isAssignedValue(value: string | null) {
    const trimmed = (value ?? '').trim();
    return trimmed.length > 0
      && !/^NA$/i.test(trimmed)
      && !/please select/i.test(trimmed)
      && !/^[-–—]+$/i.test(trimmed);
  }

  private async readProfileFieldValue(label: string) {
    const value = (await this.page.getByText(label, { exact: true })
      .locator('xpath=following-sibling::*[1]')
      .innerText()
      .catch(() => '')).trim();
    return value || null;
  }

  private async selectIfNeeded(combobox: Locator, option: string | RegExp, search?: string) {
    if (!(await combobox.isVisible().catch(() => false))) {
      return;
    }
    await combobox.click();
    if (search) {
      const filter = this.page.getByRole('searchbox').last();
      if (await filter.isVisible({ timeout: 3000 }).catch(() => false)) {
        await filter.fill(search);
        await this.page.waitForTimeout(800);
      }
    }
    const named = typeof option === 'string'
      ? this.page.getByRole('option', { name: option })
      : this.page.getByRole('option').filter({ hasText: option });
    if (await named.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await named.first().click();
    } else {
      const fallback = this.page.getByRole('option').nth(1);
      if (await fallback.isVisible({ timeout: 3000 }).catch(() => false)) {
        await fallback.click();
      } else {
        await this.page.keyboard.press('Escape').catch(() => {});
      }
    }
  }
}
