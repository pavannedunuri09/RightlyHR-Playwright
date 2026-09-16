import { expect, type Locator, type Page } from '@playwright/test';

export class TraineeJobPrepPage {
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

  async ensureJobInfo() {
    const jobTab = this.page.getByText('Job', { exact: true });
    await jobTab.click();

    const reportingManager = await this.readProfileFieldValue('Reporting Manager');
    const teamManager = await this.readProfileFieldValue('Team Manager')
      ?? await this.readProfileFieldValue('Team');
    if (this.isAssignedValue(reportingManager) && this.isAssignedValue(teamManager)) {
      console.log(`Job Info skipped; RM (${reportingManager}) and TM (${teamManager}) already set`);
      return;
    }

    await this.page.locator('div').filter({ hasText: /^Job Info$/ }).nth(1).click();
    await this.page.getByRole('columnheader', { name: /Job Role|Department|Effective Date/i })
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });
    await this.page.locator('#pn_id_3').click().catch(() => {});
    for (let step = 0; step < 24; step++) {
      await this.page.keyboard.press('ArrowRight');
    }

    const dialog = this.jobInfoDialog();
    if (!(await dialog.isVisible().catch(() => false))) {
      await this.openJobInfoUpdateDialog();
    }
    await expect(dialog).toBeVisible({ timeout: 15000 });

    await this.selectDialogOption('Department', 'SDA');
    await this.selectDialogOption('Team', 'Test Department');
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.waitForTeamManagerAutofill(dialog);
    await this.selectDialogOption('Reporting Manager', /saii Pavan Dinesh Tejaa/i);
    await this.selectJobType(dialog, 'Full Time');

    const save = dialog.getByRole('button', { name: 'Update' });
    await expect(save).toBeEnabled({ timeout: 15000 });
    await save.click();
    await expect(this.page.getByText(/Job details updated|updated successfully|success/i).first())
      .toBeVisible({ timeout: 15000 });
    console.log('Job Info updated: Department SDA, Team Test Department, RM saii Pavan Dinesh Tejaa, Job Type Full Time');
  }

  private jobInfoDialog() {
    return this.page.getByRole('dialog').filter({ hasText: /Update Job Info/i })
      .or(this.page.locator('ngb-modal-window.show, .modal.show').filter({ hasText: /Update Job Info/i }))
      .first();
  }

  private async openJobInfoUpdateDialog() {
    const updateMenu = this.page.getByText('Update', { exact: true });
    const kebabCandidates = [
      this.page.locator('table .dropdown > span > .bi').last(),
      this.page.locator('table i.bi').last(),
      this.page.locator('i').nth(2),
    ];
    for (const kebab of kebabCandidates) {
      if (!(await kebab.isVisible().catch(() => false))) {
        continue;
      }
      await kebab.click();
      if (await updateMenu.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await updateMenu.first().click();
        return;
      }
    }
    throw new Error('Job Info kebab Update menu was not available');
  }

  private comboAfterLabel(dialog: Locator, label: string) {
    const labelNode = dialog.getByText(new RegExp(`^${label}\\s*\\*?$`)).first();
    return labelNode.locator('xpath=following::*[@role="combobox"][1]')
      .or(labelNode.locator('xpath=..').getByRole('combobox'))
      .first();
  }

  private async selectDialogOption(label: string, option: string | RegExp) {
    const dialog = this.jobInfoDialog();
    const combo = this.comboAfterLabel(dialog, label);
    const current = ((await combo.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    const alreadySelected = typeof option === 'string'
      ? current.toLowerCase() === option.toLowerCase()
      : option.test(current);
    if (alreadySelected) {
      return;
    }

    await this.page.keyboard.press('Escape').catch(() => {});
    const trigger = combo.locator('xpath=..').getByRole('button', { name: 'dropdown trigger' });
    if (await trigger.isVisible().catch(() => false)) {
      await trigger.click();
    } else {
      await combo.click();
    }

    const named = typeof option === 'string'
      ? this.page.getByRole('option', { name: option, exact: true })
      : this.page.getByRole('option').filter({ hasText: option });
    await named.first().waitFor({ state: 'visible', timeout: 10000 });
    await named.first().click();
    await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  private async selectJobType(dialog: Locator, jobType: string) {
    const combo = dialog.getByRole('combobox', { name: new RegExp(`Please select job type|^${jobType}$`, 'i') });
    const current = ((await combo.innerText().catch(() => '')) || '').trim();
    if (new RegExp(`^${jobType}$`, 'i').test(current)) {
      return;
    }

    await this.page.keyboard.press('Escape').catch(() => {});
    const trigger = combo.locator('xpath=..').getByRole('button', { name: 'dropdown trigger' });
    if (await trigger.isVisible().catch(() => false)) {
      await trigger.click();
    } else {
      await combo.click();
    }
    const option = this.page.getByRole('option', { name: jobType, exact: true });
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
    await expect(dialog.getByRole('combobox', { name: new RegExp(jobType, 'i') })).toBeVisible({ timeout: 8000 });
  }

  private async waitForTeamManagerAutofill(dialog: Locator) {
    const tm = dialog.getByRole('textbox', { name: /Team Manager/i });
    await expect(tm).toBeVisible({ timeout: 10000 });
    await expect.poll(async () => {
      const text = (
        (await tm.innerText().catch(() => ''))
        || (await tm.inputValue().catch(() => ''))
        || ''
      ).replace(/\s+/g, ' ').trim();
      return this.isAssignedValue(text) ? text : '';
    }, { timeout: 15000 }).not.toEqual('');
    const filled = (
      (await tm.innerText().catch(() => ''))
      || (await tm.inputValue().catch(() => ''))
      || ''
    ).replace(/\s+/g, ' ').trim();
    console.log(`Team Manager autofilled: ${filled}`);
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

  private isAssignedValue(value: string) {
    const trimmed = value.trim();
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
}
