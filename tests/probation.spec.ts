import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProbationPage } from '../pages/ProbationPage';

const PROBATION_EMPLOYEE_NAME = 'Bhavitha Reddy';
const PROBATION_EMPLOYEE_SEARCH = 'bhav';
const PROBATION_EMPLOYEE_ID = 'SD3021300';
const PROBATION_EMPLOYEE_OPTION = `${PROBATION_EMPLOYEE_ID}-${PROBATION_EMPLOYEE_NAME}`;
const SIGNATURE_AUTHORITY = 'saii Pavan Dinesh Tejaa';

test.describe.serial('Probation Flow', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  test.describe('01. Open Probation employee and Probation Info tab', () => {
    test('navigates to Employees Probation and opens Probation Info tab', async ({ page }) => {
      const probationPage = new ProbationPage(page);
      await probationPage.openEmployeesProbation();
      await probationPage.openProbationEmployee(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
      await probationPage.openProbationInfoTab();

      await expect(page.getByRole('columnheader', { name: 'Probation Period(In days)' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Probation start date' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Probation end date' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'status' })).toBeVisible();
    });
  });

  test.describe('02. Raise probation confirmation request', () => {
    test('raises Request for Probation from Probation Info kebab menu', async ({ page }) => {
      test.setTimeout(180000);
      const probationPage = new ProbationPage(page);
      await probationPage.openEmployeesProbation();
      await probationPage.openProbationEmployee(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
      await probationPage.ensureProbationRequestRaised();

      await expect(probationPage.currentStatusCell()).toHaveText(/Waiting for Approval/i, { timeout: 15000 });
    });
  });

  test.describe('03. RM Pending Approvals queue', () => {
    test('shows probation employee in Pending Approvals Onboarding Probation', async ({ page }) => {
      test.setTimeout(180000);
      const probationPage = new ProbationPage(page);
      await probationPage.openPendingOnboardingProbation();

      const employeeRow = page.getByRole('row').filter({ hasText: PROBATION_EMPLOYEE_NAME });
      await expect(employeeRow.first()).toBeVisible({ timeout: 15000 });
      await expect(employeeRow.first().getByRole('cell', { name: PROBATION_EMPLOYEE_ID })).toBeVisible();
      await expect(probationPage.assessmentFormButton.first()).toBeVisible();
    });
  });

  test.describe('04. RM Assessment form submit', () => {
    test('submits assessment and shows Confirmed, Extend, and Reject options', async ({ page }) => {
      test.setTimeout(240000);
      const probationPage = new ProbationPage(page);
      await probationPage.openPendingOnboardingProbation();
      const employeeRow = page.getByRole('row').filter({ hasText: PROBATION_EMPLOYEE_NAME });
      await expect(employeeRow.first()).toBeVisible({ timeout: 15000 });

      await probationPage.openAssessmentForm(PROBATION_EMPLOYEE_NAME);
      await probationPage.fillAssessmentForm();
      await probationPage.submitAssessment();
      await probationPage.assertDecisionOptionsVisible();
    });
  });

  test.describe('05. RM Reject probation decision', () => {
    test('rejects RM assessment and leaves request waiting for TM approval', async ({ page }) => {
      test.setTimeout(240000);
      const probationPage = new ProbationPage(page);

      await probationPage.openPostAssessmentDecision(PROBATION_EMPLOYEE_NAME);
      await probationPage.rejectProbationDecision('Reject the Probation');
      await expect(probationPage.probationRejectedMessage).toBeVisible({ timeout: 15000 });

      await probationPage.openPendingOnboardingProbation();
      await expect(page.getByRole('row').filter({ hasText: PROBATION_EMPLOYEE_NAME }).first()).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('06. TM Reject probation decision', () => {
    test('rejects second pending record after RM reject and verifies Rejected status', async ({ page }) => {
      test.setTimeout(240000);
      const probationPage = new ProbationPage(page);

      await probationPage.openPostAssessmentDecision(PROBATION_EMPLOYEE_NAME);
      await probationPage.rejectProbationDecision('Reject the Probation TM');
      await expect(probationPage.probationRejectedMessage).toBeVisible({ timeout: 15000 });

      await probationPage.assertRejectedOnProbationInfo(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
      await expect(probationPage.currentStatusCell()).toHaveText(/Rejected/i);
    });
  });
});

test.describe.serial('Probation Flow — HR Reject and Extend from Rejected', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  test.describe('07. HR Process Reject probation decision', () => {
    test('rejects probation from HR Process popup in Pending Approvals Probation queue', async ({ page }) => {
      test.setTimeout(240000);
      const probationPage = new ProbationPage(page);

      await probationPage.openPendingOnboardingProbation();
      const processRow = probationPage.pendingProcessRow(PROBATION_EMPLOYEE_NAME).first();
      await expect(processRow).toBeVisible({ timeout: 15000 });
      await expect(processRow.getByRole('button', { name: 'Process' })).toBeVisible();

      await processRow.getByRole('button', { name: 'Process' }).click();
      await probationPage.hrRejectProbationProcess('Reporting Manager', 'HR Process Reject probation');
      await expect(probationPage.probationRejectedMessage.first()).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('08. Re-request from Rejected Probation Info', () => {
    test('re-requests rejected probation and shows employee in Pending Approvals queue', async ({ page }) => {
      test.setTimeout(180000);
      const probationPage = new ProbationPage(page);

      await probationPage.reRequestFromRejectedProbationInfo(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
      await probationPage.assertEmployeeInPendingProbationQueue(PROBATION_EMPLOYEE_NAME);
      await expect(probationPage.assessmentFormButton.first()).toBeVisible();
    });
  });

  test.describe('09. RM Extend probation decision', () => {
    test('submits assessment and extends probation when RM and TM are the same user', async ({ page }) => {
      test.setTimeout(240000);
      const probationPage = new ProbationPage(page);

      await probationPage.openPostAssessmentDecision(PROBATION_EMPLOYEE_NAME);
      await probationPage.extendProbationDecision('Extend probation feedback RM');
      await expect(probationPage.probationExtendedMessage.first()).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('10. Verify Approved status and approver history', () => {
    test('shows Approved on Probation Info and TM/RM Extended entries in Approver History', async ({ page }) => {
      test.setTimeout(180000);
      const probationPage = new ProbationPage(page);

      await probationPage.assertApprovedOnProbationInfo(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
      await probationPage.openApproverHistory();
      await probationPage.assertExtendApproverHistory();
    });
  });

  test.describe('11. HR Process Extend probation decision', () => {
    test('extends probation from HR Process popup in Pending Approvals Probation queue', async ({ page }) => {
      test.setTimeout(240000);
      const probationPage = new ProbationPage(page);

      await probationPage.openHrProcessDialog(PROBATION_EMPLOYEE_NAME);
      await probationPage.hrExtendProbationProcess('Reporting Manager', 'Test Process HR Extend', PROBATION_EMPLOYEE_NAME);
      await probationPage.assertExtendedOnProbationInfo(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
      await probationPage.assertExtendedKebabCanRaiseRequest();
    });
  });
});

test.describe.serial('Probation Flow — Confirm from Extended', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  test.describe('12. Verify Extended status on Probation Info', () => {
    test('shows Extended status with Request for Probation kebab menu', async ({ page }) => {
      test.setTimeout(180000);
      const probationPage = new ProbationPage(page);

      await probationPage.assertExtendedOnProbationInfo(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
      await probationPage.assertExtendedKebabCanRaiseRequest();
    });
  });

  test.describe('13. Raise probation request from Extended', () => {
    test('raises Request for Probation from Extended Probation Info kebab menu', async ({ page }) => {
      test.setTimeout(180000);
      const probationPage = new ProbationPage(page);

      await probationPage.raiseRequestFromExtendedProbationInfo(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
      await probationPage.assertEmployeeInPendingProbationQueue(PROBATION_EMPLOYEE_NAME);
      await expect(probationPage.assessmentFormButton.first()).toBeVisible();
    });
  });

  test.describe('14. RM Confirm probation decision', () => {
    test('submits assessment and confirms probation when RM and TM are the same user', async ({ page }) => {
      test.setTimeout(240000);
      const probationPage = new ProbationPage(page);

      await probationPage.openPostAssessmentDecision(PROBATION_EMPLOYEE_NAME);
      await probationPage.confirmProbationDecision();
      await expect(probationPage.probationApprovedMessage.first()).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('15. Verify Approved status and confirm approver history', () => {
    test('shows Approved on Probation Info and TM/RM Confirmed entries in Approver History', async ({ page }) => {
      test.setTimeout(180000);
      const probationPage = new ProbationPage(page);

      await probationPage.assertApprovedOnProbationInfo(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
      await probationPage.openApproverHistory();
      await probationPage.assertConfirmApproverHistory();
    });
  });

  test.describe('16. HR Process probation decision', () => {
    test('processes probation from HR Process popup with Process option in Pending Approvals Probation queue', async ({ page }) => {
      test.setTimeout(240000);
      const probationPage = new ProbationPage(page);

      await probationPage.openPendingOnboardingProbation();
      const processRow = probationPage.pendingProcessRow(PROBATION_EMPLOYEE_NAME).first();
      await expect(processRow).toBeVisible({ timeout: 15000 });
      await expect(processRow.getByRole('button', { name: 'Process' })).toBeVisible();

      await processRow.getByRole('button', { name: 'Process' }).click();
      await probationPage.hrProcessProbationDecision('Reporting Manager', 'HR Process confirm probation', PROBATION_EMPLOYEE_NAME);
    });
  });
});

test.describe.serial('Probation Flow — Generate Document and Move to Active', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  test.describe('17. Fill Probation Confirmation Letter form', () => {
    test('opens Generate Documents and fills Probation Confirmation letter form for Bhavitha Reddy', async ({ page }) => {
      test.setTimeout(180000);
      const probationPage = new ProbationPage(page);
      const today = probationPage.todayDateString();

      await probationPage.openGenerateDocuments();
      await probationPage.selectProbationConfirmationLetter();
      await probationPage.fillProbationConfirmationLetterForm({
        employeeOption: PROBATION_EMPLOYEE_OPTION,
        issuedDate: today,
        effectiveDate: today,
        documentType: 'Soft Copy',
        signatureAuthority: SIGNATURE_AUTHORITY,
      });

      await expect(page.getByRole('combobox', { name: PROBATION_EMPLOYEE_OPTION })).toBeVisible();
      await expect(page.getByRole('combobox', { name: 'Soft Copy' })).toBeVisible();
      await expect(page.getByRole('combobox', { name: SIGNATURE_AUTHORITY })).toBeVisible();
      await expect(probationPage.issuedDateInput).toHaveValue(today);
      await expect(probationPage.effectiveDateInput).toHaveValue(today);
      await expect(probationPage.generateDocumentButton).toBeVisible();
      await expect(probationPage.releaseLetterButton).toBeDisabled();
    });
  });

  test.describe('18. Generate and release Probation Confirmation Letter', () => {
    test('generates Probation Confirmation letter, waits for download, and releases letter via email', async ({ page }) => {
      test.setTimeout(240000);
      const probationPage = new ProbationPage(page);
      const today = probationPage.todayDateString();

      await probationPage.openGenerateDocuments();
      await probationPage.selectProbationConfirmationLetter();
      await probationPage.fillProbationConfirmationLetterForm({
        employeeOption: PROBATION_EMPLOYEE_OPTION,
        issuedDate: today,
        effectiveDate: today,
        documentType: 'Soft Copy',
        signatureAuthority: SIGNATURE_AUTHORITY,
      });

      const download = await probationPage.generateProbationConfirmationLetter();
      expect(download.suggestedFilename()).toBeTruthy();
      await probationPage.releaseProbationConfirmationLetter();
    });
  });

  test.describe('19. Verify employee in Active employees list', () => {
    test('shows Bhavitha Reddy in Employees Active tab after letter release', async ({ page }) => {
      test.setTimeout(180000);
      const probationPage = new ProbationPage(page);

      await probationPage.assertEmployeeInActiveList(
        PROBATION_EMPLOYEE_NAME,
        PROBATION_EMPLOYEE_SEARCH,
        PROBATION_EMPLOYEE_ID,
      );
    });
  });
});
