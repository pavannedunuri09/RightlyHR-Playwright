import { expect, type Locator, type Page } from '@playwright/test';
import { JobInfoWfhPage } from './JobInfoWfhPage';

export class ProbationPage {
  readonly page: Page;
  readonly jobInfo: JobInfoWfhPage;
  readonly employeesNav: Locator;
  readonly employeeSearch: Locator;
  readonly jobTab: Locator;
  readonly probationInfoTab: Locator;
  readonly probationEmployeesTab: Locator;
  readonly pendingApprovalsNav: Locator;
  readonly pendingApprovalsToggle: Locator;
  readonly pendingOnboardingTab: Locator;
  readonly probationPendingTab: Locator;
  readonly assessmentFormButton: Locator;
  readonly assessmentTextArea: Locator;
  readonly requestRaisedMessage: Locator;
  readonly assessmentSubmittedMessage: Locator;
  readonly confirmedOption: Locator;
  readonly confirmedRadio: Locator;
  readonly extendOption: Locator;
  readonly rejectOption: Locator;
  readonly rejectRadio: Locator;
  readonly extendRadio: Locator;
  readonly decisionDialog: Locator;
  readonly decisionDescription: Locator;
  readonly extendDateInput: Locator;
  readonly extendFeedbackInput: Locator;
  readonly confirmProbationStatusText: Locator;
  readonly decisionSubmitButton: Locator;
  readonly probationRejectedMessage: Locator;
  readonly probationExtendedMessage: Locator;
  readonly probationApprovedMessage: Locator;
  readonly processButton: Locator;
  readonly hrProcessDialog: Locator;
  readonly hrExtendRadio: Locator;
  readonly hrProcessRadio: Locator;
  readonly hrRejectRadio: Locator;
  readonly hrExtendDateInput: Locator;
  readonly hrExtendFeedbackInput: Locator;
  readonly hrRejectDescription: Locator;
  readonly hrProcessSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.jobInfo = new JobInfoWfhPage(page);
    this.employeesNav = page.getByText('Employees', { exact: true });
    this.employeeSearch = page.getByRole('searchbox', { name: 'Username' });
    this.jobTab = page.getByText('Job', { exact: true });
    this.probationInfoTab = page.locator('div').filter({ hasText: /^Probation Info$/ }).first();
    this.probationEmployeesTab = page.getByText(/^Probation\(\d+\)$/);
    this.pendingApprovalsNav = page.locator('#sidenav-main-drop .nav-item').filter({ hasText: 'Pending Approvals' });
    this.pendingApprovalsToggle = this.pendingApprovalsNav.locator('[data-bs-toggle="dropdown"]');
    this.pendingOnboardingTab = page.locator('app-pending-approvals-tabs').locator('.grid-item').filter({ hasText: /^Onboarding\(\d+\)$/ });
    this.probationPendingTab = page.getByRole('listitem').filter({ hasText: 'Probation' }).filter({ hasText: /\(\d+\)/ });
    this.assessmentFormButton = page.getByRole('button', { name: 'Assessment form' });
    this.assessmentTextArea = page.getByRole('textbox', { name: 'Text area' });
    this.requestRaisedMessage = page.getByText('Probation request raised');
    this.assessmentSubmittedMessage = page.getByText('Assessment form submitted');
    this.confirmProbationStatusText = page.getByText('Confirm Probation status?');
    this.decisionDialog = page.getByRole('dialog').filter({ hasText: 'Confirm Probation status?' });
    this.confirmedOption = this.decisionDialog.getByRole('radio', { name: 'Confirmed' });
    this.confirmedRadio = this.confirmedOption;
    this.extendOption = this.decisionDialog.getByRole('radio', { name: 'Extend' });
    this.rejectOption = this.decisionDialog.getByRole('radio', { name: 'Reject' });
    this.rejectRadio = this.decisionDialog.getByRole('radio', { name: 'Reject' });
    this.extendRadio = this.decisionDialog.getByRole('radio', { name: 'Extend' });
    this.decisionDescription = this.decisionDialog.getByRole('textbox', { name: 'Description' });
    this.extendDateInput = this.decisionDialog.getByRole('textbox', { name: 'Default select example' });
    this.extendFeedbackInput = this.decisionDialog.getByRole('textbox', { name: 'Feedback for Extend *' });
    this.decisionSubmitButton = this.decisionDialog.getByRole('button', { name: 'Submit' });
    this.probationRejectedMessage = page.getByText('Probation request rejected');
    this.probationExtendedMessage = page.getByText(/Probation request (extended|approved|processed)|processed successfully|successfully processed/i);
    this.probationApprovedMessage = page.getByText(/Probation request (approved|confirmed)/i);
    this.processButton = page.getByRole('button', { name: 'Process' });
    this.hrProcessDialog = page.getByRole('dialog').filter({ hasText: /Are you sure you want to Process/i });
    this.hrExtendRadio = this.hrProcessDialog.getByRole('radio', { name: 'Extend' });
    this.hrProcessRadio = this.hrProcessDialog.getByRole('radio', { name: 'Process' });
    this.hrRejectRadio = this.hrProcessDialog.getByRole('radio', { name: 'Reject' });
    this.hrExtendDateInput = this.hrProcessDialog.getByRole('textbox', { name: 'Default select example' });
    this.hrExtendFeedbackInput = this.hrProcessDialog.getByRole('textbox', { name: /Feedback for Extend/i });
    this.hrRejectDescription = this.hrProcessDialog.getByRole('textbox', { name: 'Description' });
    this.hrProcessSubmitButton = this.hrProcessDialog.getByRole('button', { name: 'Submit' });
  }

  async validateUserOnDashboard() {
    await this.page.goto('/dashboard/emp');
    await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
    await this.page.getByText('Have a nice day at work!').waitFor({ state: 'visible' });
  }

  async openEmployeesProbation() {
    await this.jobInfo.employeesIcon.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(2000);
    await this.jobInfo.employeesIcon.click();
    try {
      await this.page.waitForURL(/\/employee-management/, { timeout: 10000 });
    } catch {
      await this.jobInfo.employeesIcon.click();
      try {
        await this.page.waitForURL(/\/employee-management/, { timeout: 8000 });
      } catch {
        await this.page.goto('/employee-management/active/employees');
        await this.page.waitForURL(/\/employee-management/, { timeout: 15000 });
      }
    }

    await this.probationEmployeesTab.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.probationEmployeesTab.first().click();
    await this.page.waitForURL(/\/employee-management\/.*probation/i, { timeout: 15000 }).catch(() => {});
    await this.employeeSearch.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openProbationEmployee(employeeName: string, searchText: string) {
    await this.employeeSearch.click();
    await this.employeeSearch.fill(searchText);
    await this.employeeSearch.press('Enter');
    await this.page.getByText(employeeName, { exact: true }).click({ timeout: 15000 });
  }

  async openProbationInfoTab() {
    await this.jobTab.click();
    await this.probationInfoTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.probationInfoTab.click();
    await this.page.locator('app-probation-details, table').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  currentProbationInfoRow() {
    return this.page.locator('app-probation-details table tbody tr').first();
  }

  currentStatusCell() {
    return this.currentProbationInfoRow().locator('td').filter({
      hasText: /^(Pending|Rejected|Waiting for Approval|Approved|Extended)$/,
    }).first();
  }

  rejectedProbationInfoRow() {
    return this.page.locator('app-probation-details table tbody tr').filter({
      has: this.page.locator('td').filter({ hasText: /^Rejected$/i }),
    }).first();
  }

  approvedProbationInfoRow() {
    return this.page.locator('app-probation-details table tbody tr').filter({
      has: this.page.locator('td').filter({ hasText: /^Approved$/i }),
    }).first();
  }

  extendedProbationInfoRow() {
    return this.page.locator('app-probation-details table tbody tr').filter({
      has: this.page.locator('td').filter({ hasText: /^\s*Extended\s*$/i }),
    }).last();
  }

  approverHistoryIcon(row: Locator) {
    const historyCell = row.locator('td').nth(5);
    return historyCell.locator('[class*="cursor"], i, img, svg, button, a, span, div').first();
  }

  probationInfoRow(status: 'Pending' | 'Rejected' | 'Waiting for Approval') {
    return this.page.locator('app-probation-details table tbody tr').filter({
      has: this.page.locator('td').filter({ hasText: new RegExp(`^\\s*${status}\\s*$`, 'i') }),
    }).first();
  }

  requestMenuItem() {
    return this.page.locator('a.dropdown-item, .dropdown-menu li, .dropdown-menu a').filter({ hasText: /Request for Probation/i }).first();
  }

  reRequestMenuItem() {
    return this.page.locator('a.dropdown-item, .dropdown-menu li, .dropdown-menu a').filter({ hasText: /Re-Request for Probation/i }).first();
  }

  async requestProbationConfirmation() {
    const row = this.currentProbationInfoRow();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await this.jobInfo.openRowKebab(row);

    const item = row.getByRole('listitem').filter({ hasText: /Request for Probation/i }).or(this.requestMenuItem());
    await item.first().click();

    await expect(this.requestRaisedMessage).toBeVisible({ timeout: 15000 });
    await expect(this.currentStatusCell()).toHaveText(/Waiting for Approval/i, { timeout: 15000 });
  }

  async reRequestProbationConfirmation() {
    const row = this.rejectedProbationInfoRow();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await this.jobInfo.openRowKebab(row);

    const item = row.getByRole('listitem').filter({ hasText: /Re-Request for Probation/i }).or(this.reRequestMenuItem());
    await item.first().click();

    await expect(this.requestRaisedMessage).toBeVisible({ timeout: 15000 });
    await expect(this.waitingForApprovalProbationInfoRow()).toBeVisible({ timeout: 15000 });
  }

  async requestProbationFromExtendedRow() {
    const row = this.extendedProbationInfoRow();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await this.jobInfo.openRowKebab(row);

    const item = row.getByRole('listitem').filter({ hasText: /Request for Probation/i }).or(this.requestMenuItem());
    await item.first().click();

    await expect(this.requestRaisedMessage).toBeVisible({ timeout: 15000 });
    await expect(this.waitingForApprovalProbationInfoRow()).toBeVisible({ timeout: 15000 });
  }

  async openProbationInfoForEmployee(employeeName: string, searchText: string) {
    await this.openEmployeesProbation();
    await this.openProbationEmployee(employeeName, searchText);
    await this.openProbationInfoTab();
  }

  waitingForApprovalProbationInfoRow() {
    return this.page.locator('app-probation-details table tbody tr').filter({
      has: this.page.locator('td').filter({ hasText: /^Waiting for Approval$/i }),
    }).first();
  }

  async reRequestFromRejectedProbationInfo(employeeName: string, searchText: string) {
    await this.openProbationInfoForEmployee(employeeName, searchText);

    if (await this.rejectedProbationInfoRow().isVisible().catch(() => false)) {
      await this.reRequestProbationConfirmation();
    } else if (await this.waitingForApprovalProbationInfoRow().isVisible().catch(() => false)) {
      return;
    } else {
      throw new Error(
        'No Rejected probation record found to re-request. Ensure Bhavitha has a Rejected row before running test 08.',
      );
    }

    await expect(this.waitingForApprovalProbationInfoRow()).toBeVisible({ timeout: 15000 });
  }

  async raiseRequestFromExtendedProbationInfo(employeeName: string, searchText: string) {
    await this.openProbationInfoForEmployee(employeeName, searchText);

    if (await this.extendedProbationInfoRow().isVisible().catch(() => false)) {
      await this.requestProbationFromExtendedRow();
    } else if (await this.waitingForApprovalProbationInfoRow().isVisible().catch(() => false)) {
      return;
    } else {
      throw new Error(
        'No Extended probation record found to raise request. Ensure Bhavitha has an Extended row before running test 13.',
      );
    }

    await expect(this.waitingForApprovalProbationInfoRow()).toBeVisible({ timeout: 15000 });
  }

  async ensureProbationRequestRaised() {
    await this.openProbationInfoTab();
    const row = this.currentProbationInfoRow();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await this.currentStatusCell().waitFor({ state: 'visible', timeout: 15000 });

    const status = (await this.currentStatusCell().innerText()).replace(/\s+/g, ' ').trim();
    if (/waiting for approval|rejected/i.test(status)) {
      return;
    }
    if (/pending/i.test(status)) {
      await this.requestProbationConfirmation();
    }
  }

  async readProbationPendingCount() {
    await this.openPendingOnboardingProbation();
    const text = (await this.probationPendingTab.first().innerText()).replace(/\s+/g, ' ').trim();
    const match = text.match(/\((\d+)\)/);
    return match ? Number(match[1]) : 0;
  }

  async openPendingOnboardingProbation() {
    if (/\/pending-approvals\/onboarding\/probation/i.test(this.page.url())) {
      await this.processButton.or(this.assessmentFormButton).or(this.page.getByRole('columnheader', { name: 'Employee ID' })).first()
        .waitFor({ state: 'visible', timeout: 15000 });
      return;
    }

    await this.pendingApprovalsToggle.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(2000);
    await this.pendingApprovalsToggle.click();

    const onboardingTab = this.pendingOnboardingTab.first();
    if (await onboardingTab.isVisible().catch(() => false)) {
      await onboardingTab.click();
    } else {
      const baseUrl = this.page.url().split('/pending-approvals')[0];
      await this.page.goto(`${baseUrl}/pending-approvals/onboarding/probation`);
    }

    await this.probationPendingTab.first().waitFor({ state: 'visible', timeout: 15000 });
    await this.probationPendingTab.first().click();
    await this.page.waitForURL(/\/pending-approvals\/onboarding\/probation/i, { timeout: 15000 }).catch(() => {});
    await this.processButton.or(this.assessmentFormButton).or(this.page.getByRole('columnheader', { name: 'Employee ID' })).first()
      .waitFor({ state: 'visible', timeout: 15000 });
  }

  async openHrProcessDialog(employeeName: string) {
    await this.openPendingOnboardingProbation();
    const row = this.pendingProcessRow(employeeName).first();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.getByRole('button', { name: 'Process' }).click();
    await this.hrProcessDialog.waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectHrApprovalForm(role: 'Reporting Manager' | 'Team Manager') {
    const dropdown = this.hrProcessDialog.locator('.p-dropdown, p-dropdown, p-select, [role="combobox"]').first();
    await dropdown.click();
    const option = this.page.locator('.p-dropdown-panel li, .p-select-option, [role="option"]')
      .filter({ hasText: new RegExp(role === 'Reporting Manager' ? 'Reporting Manager|RM' : 'Team Manager|TM', 'i') })
      .first();
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
    await this.page.keyboard.press('Escape');
  }

  async selectHrExtendOption() {
    await this.hrProcessDialog.getByRole('radio', { name: 'Extend' }).click();
    await expect(this.hrExtendRadio).toBeChecked({ timeout: 10000 });
    await expect(this.hrProcessDialog.getByText(/Extend Date/i)).toBeVisible({ timeout: 10000 });
    await expect(this.hrProcessDialog.getByRole('textbox', { name: 'Default select example' })).toBeVisible({ timeout: 10000 });
    await this.hrExtendFeedbackInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async pickHrExtendDate() {
    const dateField = this.hrProcessDialog.getByRole('textbox', { name: 'Default select example' });
    await dateField.waitFor({ state: 'visible', timeout: 10000 });

    let value = (await dateField.inputValue().catch(() => '')).trim();
    if (value) {
      return;
    }

    const pickFromOpenPanel = async () => {
      const panel = this.page.locator('.p-dropdown-panel, .p-select-overlay, .p-select-list, .p-select-panel, [role="listbox"]').last();
      if (!(await panel.isVisible({ timeout: 3000 }).catch(() => false))) {
        return false;
      }
      const option = panel.locator('li, [role="option"], .p-select-option').filter({ hasText: /\d/ }).first();
      if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.click();
        return true;
      }
      return false;
    };

    const pickFromCalendar = async () => {
      const calendar = this.page.locator('.p-datepicker-panel, .p-datepicker').first();
      if (!(await calendar.isVisible({ timeout: 3000 }).catch(() => false))) {
        return false;
      }
      let day = calendar.locator('td:not(.p-disabled):not(.p-datepicker-other-month) span').first();
      if (!(await day.isVisible({ timeout: 2000 }).catch(() => false))) {
        const nextMonth = calendar.locator('.p-datepicker-next, button[aria-label*="Next" i]').first();
        if (await nextMonth.isVisible().catch(() => false)) {
          await nextMonth.click();
        }
        day = calendar.locator('td:not(.p-disabled):not(.p-datepicker-other-month) span').first();
      }
      if (await day.isVisible({ timeout: 2000 }).catch(() => false)) {
        await day.click();
        return true;
      }
      return false;
    };

    await dateField.click();
    if (await pickFromOpenPanel()) {
      value = (await dateField.inputValue().catch(() => '')).trim();
    }

    if (!value) {
      await dateField.click();
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
      value = (await dateField.inputValue().catch(() => '')).trim();
    }

    if (!value) {
      const extendDateBlock = this.hrProcessDialog.locator('div').filter({ hasText: /Extend Date/i }).last();
      const dateDropdown = extendDateBlock.locator('.p-dropdown, p-dropdown, p-select').first()
        .or(this.hrProcessDialog.locator('.p-dropdown, p-dropdown, p-select').nth(1));
      if (await dateDropdown.isVisible({ timeout: 3000 }).catch(() => false)) {
        await dateDropdown.click();
        if (await pickFromOpenPanel()) {
          value = (await dateField.inputValue().catch(() => '')).trim();
        }
      }
    }

    if (!value && await pickFromCalendar()) {
      value = (await dateField.inputValue().catch(() => '')).trim();
    }

    if (!value) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const formatted = nextMonth.toISOString().slice(0, 10);
      await dateField.fill(formatted);
      await dateField.press('Tab');
      value = (await dateField.inputValue().catch(() => '')).trim();
    }

    await expect.poll(async () => (await dateField.inputValue().catch(() => '')).trim(), { timeout: 5000 }).not.toBe('');
  }

  async hrExtendProbationProcess(
    approvalRole: 'Reporting Manager' | 'Team Manager' = 'Reporting Manager',
    feedback = 'Test Process HR Extend',
    employeeName?: string,
  ) {
    await this.hrProcessDialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.selectHrApprovalForm(approvalRole);
    await this.selectHrExtendOption();
    await this.pickHrExtendDate();

    await this.hrExtendFeedbackInput.click();
    await this.hrExtendFeedbackInput.fill('');
    await this.hrExtendFeedbackInput.pressSequentially(feedback.trim(), { delay: 30 });
    await this.hrExtendFeedbackInput.blur();
    await expect(this.hrProcessSubmitButton).toBeEnabled({ timeout: 15000 });
    await this.hrProcessSubmitButton.click();
    await this.hrProcessDialog.waitFor({ state: 'hidden', timeout: 15000 });

    if (employeeName) {
      await this.openPendingOnboardingProbation();
      await expect(this.pendingProcessRow(employeeName)).toHaveCount(0, { timeout: 15000 });
    }
  }

  async hrRejectProbationProcess(
    approvalRole: 'Reporting Manager' | 'Team Manager' = 'Reporting Manager',
    description = 'HR Process Reject probation',
  ) {
    await this.hrProcessDialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.selectHrApprovalForm(approvalRole);
    await this.hrRejectRadio.check();
    await this.hrRejectDescription.waitFor({ state: 'visible', timeout: 10000 });
    await this.hrRejectDescription.click();
    await this.hrRejectDescription.fill('');
    await this.hrRejectDescription.pressSequentially(description.trim(), { delay: 30 });
    await this.hrRejectDescription.blur();
    await expect(this.hrProcessSubmitButton).toBeEnabled({ timeout: 15000 });
    await this.hrProcessSubmitButton.click();
    await this.probationRejectedMessage.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async hrProcessProbationDecision(
    approvalRole: 'Reporting Manager' | 'Team Manager' = 'Reporting Manager',
    comments = 'HR Process confirm probation',
    employeeName?: string,
  ) {
    await this.hrProcessDialog.waitFor({ state: 'visible', timeout: 15000 });
    await this.selectHrApprovalForm(approvalRole);
    await this.hrProcessRadio.check();
    if (!(await this.hrProcessRadio.isChecked().catch(() => false))) {
      await this.hrProcessDialog.getByText('Process', { exact: true }).click();
    }
    await expect(this.hrProcessRadio).toBeChecked({ timeout: 5000 });

    const commentsInput = this.hrProcessDialog.getByRole('textbox', { name: /Comments/i });
    await commentsInput.waitFor({ state: 'visible', timeout: 10000 });
    await commentsInput.click();
    await commentsInput.fill('');
    await commentsInput.pressSequentially(comments.trim(), { delay: 30 });
    await commentsInput.press('Tab');
    await expect(this.hrProcessSubmitButton).toBeEnabled({ timeout: 15000 });
    await this.hrProcessSubmitButton.click();
    await this.hrProcessDialog.waitFor({ state: 'hidden', timeout: 15000 });

    const toastVisible = await this.probationExtendedMessage.first().isVisible({ timeout: 8000 }).catch(() => false);
    if (!toastVisible && employeeName) {
      await this.openPendingOnboardingProbation();
      await expect(this.pendingProcessRow(employeeName)).toHaveCount(0, { timeout: 15000 });
      return;
    }
    await this.probationExtendedMessage.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  pendingRow(employeeName: string) {
    return this.page.getByRole('row').filter({ hasText: employeeName });
  }

  pendingProcessRow(employeeName: string) {
    return this.pendingRow(employeeName).filter({
      has: this.page.getByRole('button', { name: 'Process' }),
    });
  }

  pendingAssessmentRow(employeeName: string) {
    return this.pendingRow(employeeName).filter({
      has: this.page.getByRole('button', { name: 'Assessment form' }),
    });
  }

  async openAssessmentForm(employeeName: string) {
    const button = this.pendingAssessmentRow(employeeName).first().getByRole('button', { name: 'Assessment form' });
    await button.waitFor({ state: 'visible', timeout: 15000 });
    await button.click();
    await this.page.getByText(/ASSESSMENT FORM FOR PROBATION CONFIRMATION/i).waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillAssessmentForm(comments = 'Test Text Area') {
    const outstanding = this.page.locator('div').filter({ hasText: /^OutStanding$/ });
    if (await outstanding.nth(3).isVisible().catch(() => false)) {
      await outstanding.nth(3).click();
    }

    const headers = this.page.locator('#checkformheader');
    const headerCount = await headers.count();
    for (let index = 0; index < headerCount; index++) {
      const header = headers.nth(index);
      if (await header.isVisible().catch(() => false) && !(await header.isChecked().catch(() => false))) {
        await header.check().catch(() => {});
      }
    }

    await this.assessmentTextArea.fill(comments);

    const noOption = this.page.locator('div').filter({ hasText: /^No$/ });
    if (await noOption.nth(1).isVisible().catch(() => false)) {
      await noOption.nth(1).click();
    }

    const footerChecks = this.page.locator('#checkformfooter');
    if ((await footerChecks.count()) > 1) {
      await footerChecks.nth(1).check().catch(() => {});
    }
  }

  async submitAssessment() {
    await this.page.getByRole('button', { name: 'Submit', exact: true }).click();
    await this.page.getByText(/Are you sure you want to/i).waitFor({ state: 'visible', timeout: 15000 });
    const downloadPromise = this.page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
    await this.page.getByRole('button', { name: 'Yes', exact: true }).click();
    await downloadPromise;
    await this.assessmentSubmittedMessage.waitFor({ state: 'visible', timeout: 30000 });
    await this.page.getByRole('button', { name: 'OK', exact: true }).click();
  }

  async assertDecisionOptionsVisible() {
    await expect(this.confirmedOption).toBeVisible({ timeout: 15000 });
    await expect(this.extendOption).toBeVisible({ timeout: 15000 });
    await expect(this.rejectOption).toBeVisible({ timeout: 15000 });
  }

  async openPostAssessmentDecision(employeeName: string) {
    await this.openPendingOnboardingProbation();
    const row = this.pendingAssessmentRow(employeeName).first();
    await row.waitFor({ state: 'visible', timeout: 15000 });

    if (await this.rejectRadio.isVisible().catch(() => false)) {
      return;
    }

    if (await this.confirmedRadio.isVisible().catch(() => false)) {
      return;
    }

    const formHeading = this.page.getByText(/ASSESSMENT FORM FOR PROBATION CONFIRMATION/i);
    if (!(await formHeading.isVisible().catch(() => false))) {
      await this.openAssessmentForm(employeeName);
    }

    if (await this.rejectRadio.isVisible().catch(() => false)) {
      return;
    }

    if (await this.confirmedRadio.isVisible().catch(() => false)) {
      return;
    }

    await this.fillAssessmentForm();
    await this.submitAssessment();
    await this.confirmProbationStatusText.waitFor({ state: 'visible', timeout: 15000 });
  }

  async rejectProbationDecision(description = 'Reject the Probation') {
    await this.confirmProbationStatusText.waitFor({ state: 'visible', timeout: 15000 });
    await this.rejectRadio.check();
    await this.decisionDescription.waitFor({ state: 'visible', timeout: 10000 });
    await this.decisionDescription.click();
    await this.decisionDescription.fill('');
    await this.decisionDescription.pressSequentially(description.trim());
    await this.decisionDescription.blur();
    await this.confirmProbationStatusText.click();
    await expect(this.decisionSubmitButton).toBeEnabled({ timeout: 15000 });
    await this.decisionSubmitButton.click();
    await this.probationRejectedMessage.waitFor({ state: 'visible', timeout: 15000 });
  }

  async pickExtendDate() {
    await this.extendDateInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.extendDateInput.click();

    let value = (await this.extendDateInput.inputValue().catch(() => '')).trim();
    if (value) {
      return;
    }

    const dropdown = this.decisionDialog.locator('.p-dropdown, p-dropdown, p-select').first();
    if (await dropdown.isVisible().catch(() => false)) {
      await dropdown.click();
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
      value = (await this.extendDateInput.inputValue().catch(() => '')).trim();
    }

    if (!value) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const formatted = nextMonth.toISOString().slice(0, 10);
      await this.extendDateInput.fill(formatted);
      await this.extendDateInput.press('Tab');
    }
  }

  async extendProbationDecision(feedback = 'Extend probation feedback') {
    await this.confirmProbationStatusText.waitFor({ state: 'visible', timeout: 15000 });
    await this.extendRadio.check();
    await this.pickExtendDate();
    await this.extendFeedbackInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.extendFeedbackInput.click();
    await this.extendFeedbackInput.fill('');
    await this.extendFeedbackInput.pressSequentially(feedback.trim(), { delay: 30 });
    await this.extendFeedbackInput.press('Tab');
    await this.confirmProbationStatusText.click();
    await expect(this.decisionSubmitButton).toBeEnabled({ timeout: 15000 });
    await this.decisionSubmitButton.click();
    await this.probationExtendedMessage.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async confirmProbationDecision() {
    await this.confirmProbationStatusText.waitFor({ state: 'visible', timeout: 15000 });
    await this.confirmedRadio.check();
    if (!(await this.confirmedRadio.isChecked().catch(() => false))) {
      await this.decisionDialog.getByText('Confirmed', { exact: true }).click();
    }
    await expect(this.confirmedRadio).toBeChecked({ timeout: 5000 });
    await this.confirmProbationStatusText.click();
    await expect(this.decisionSubmitButton).toBeEnabled({ timeout: 15000 });
    await this.decisionSubmitButton.click();
    await this.probationApprovedMessage.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async assertEmployeeInPendingProbationQueue(employeeName: string) {
    await this.openPendingOnboardingProbation();
    await expect(this.pendingRow(employeeName).first()).toBeVisible({ timeout: 15000 });
  }

  async assertApprovedOnProbationInfo(employeeName: string, searchText: string) {
    await this.openProbationInfoForEmployee(employeeName, searchText);
    const approvedRow = this.approvedProbationInfoRow();
    await expect(approvedRow).toBeVisible({ timeout: 15000 });
    await expect(approvedRow.locator('td').filter({ hasText: /^Approved$/i })).toBeVisible();
  }

  async openApproverHistory(row = this.approvedProbationInfoRow()) {
    await row.waitFor({ state: 'visible', timeout: 15000 });
    const historyCell = row.locator('td').nth(5);
    const trigger = this.approverHistoryIcon(row);
    if (await trigger.isVisible().catch(() => false)) {
      await trigger.click();
    } else {
      await historyCell.click();
    }
    await this.page.getByRole('dialog').filter({ hasText: 'Approver History' })
      .waitFor({ state: 'visible', timeout: 15000 });
  }

  async assertExtendApproverHistory() {
    const panel = this.page.getByRole('dialog').filter({ hasText: 'Approver History' });
    await expect(panel).toBeVisible({ timeout: 15000 });
    await expect(panel.getByRole('columnheader', { name: 'Approver Role' })).toBeVisible();
    await expect(panel.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(panel.getByRole('columnheader', { name: 'Extended Date' })).toBeVisible();
    await expect(panel.getByRole('cell', { name: 'TM', exact: true })).toBeVisible();
    await expect(panel.getByRole('cell', { name: 'RM', exact: true })).toBeVisible();
    await expect(panel.getByRole('cell', { name: 'Extended', exact: true }).first()).toBeVisible();
    await expect(panel.getByRole('cell', { name: 'Extended', exact: true }).nth(1)).toBeVisible();
    await expect(panel.getByText(/saii Pavan Dinesh Tejaa/i).first()).toBeVisible();
  }

  async assertConfirmApproverHistory() {
    const panel = this.page.getByRole('dialog').filter({ hasText: 'Approver History' });
    await expect(panel).toBeVisible({ timeout: 15000 });
    await expect(panel.getByRole('columnheader', { name: 'Approver Role' })).toBeVisible();
    await expect(panel.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(panel.getByRole('cell', { name: 'TM', exact: true })).toBeVisible();
    await expect(panel.getByRole('cell', { name: 'RM', exact: true })).toBeVisible();
    await expect(panel.getByRole('cell', { name: /Confirmed|Approved/i }).first()).toBeVisible();
    await expect(panel.getByText(/saii Pavan Dinesh Tejaa/i).first()).toBeVisible();
  }

  async assertExtendedOnProbationInfo(employeeName: string, searchText: string) {
    await this.openProbationInfoForEmployee(employeeName, searchText);
    const extendedRow = this.extendedProbationInfoRow();
    await expect(extendedRow).toBeVisible({ timeout: 15000 });
    await expect(extendedRow.locator('td').filter({ hasText: /^Extended$/i })).toBeVisible();
  }

  async assertExtendedKebabCanRaiseRequest() {
    const row = this.extendedProbationInfoRow();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await this.jobInfo.openRowKebab(row);
    await expect(this.requestMenuItem()).toBeVisible({ timeout: 10000 });
    await this.page.keyboard.press('Escape');
  }

  async assertRejectedOnProbationInfo(employeeName: string, searchText: string) {
    await this.openEmployeesProbation();
    await this.openProbationEmployee(employeeName, searchText);
    await this.openProbationInfoTab();
    await expect(this.page.getByRole('cell', { name: 'Rejected' }).first()).toBeVisible({ timeout: 15000 });
  }
}
