# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: probation.spec.ts >> Probation Flow >> 03. RM Pending Approvals queue >> shows probation employee in Pending Approvals Onboarding Probation
- Location: tests\probation.spec.ts:47:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('row').filter({ hasText: 'harshitha Palagiriii' }).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('row').filter({ hasText: 'harshitha Palagiriii' }).first()

```

```yaml
- img "Company Logo"
- img
- img
- img
- paragraph: Induu Priyaa
- paragraph: Chief Executive Officer
- img
- list:
  - listitem:
    - img "Icon"
    - text: Dashboard
  - listitem:
    - img "Icon"
    - text: My Info
    - img "Icon"
    - text: Employees
    - img "Icon"
    - text: Time Off
    - img "Icon"
    - text: Attendance
    - img "Icon"
    - text: Reports
    - img "Icon"
    - text: Project Management
    - img "Icon"
    - text: Skill Set
    - img "Icon"
    - text: On Behalf Of
    - img "Icon"
    - text: Pending Approvals
    - img "Icon"
    - text: PMS
  - listitem:
    - img "Icons"
- img "Powered By logo"
- text: Pending Approvals  Onboarding
- img
- list:
  - listitem:
    - img "Icon"
    - text: Offer Letter (0)
  - listitem:
    - img "Icon"
    - text: Contract Offer Letter (0)
  - listitem:
    - img "Icon"
    - text: Trainee Offer Letter (0)
  - listitem:
    - img "Icon"
    - text: Trainee Appointment Letter (0)
  - listitem:
    - img "Icon"
    - text: Appointment Letter (0)
  - listitem:
    - img "Icon"
    - text: Non-Disclosure Agreement Letter (0)
  - listitem:
    - img "Icon"
    - text: Probation (2)
  - listitem:
    - img "Icon"
    - text: Trainees (0)
- text: 
- searchbox "Username"
- table:
  - rowgroup:
    - row "Employee ID Employee Name Probation Start Date Probation End Date Approved History Action":
      - columnheader "Employee ID":
        - text: Employee ID
        - img
      - columnheader "Employee Name":
        - text: Employee Name
        - img
      - columnheader "Probation Start Date":
        - text: Probation Start Date
        - img
      - columnheader "Probation End Date":
        - text: Probation End Date
        - img
      - columnheader "Approved History"
      - columnheader "Action"
  - rowgroup:
    - row "SIST0011 Imran Mar 11, 2026 Mar 29, 2026 - Assessment form":
      - cell "SIST0011"
      - cell "Imran"
      - cell "Mar 11, 2026"
      - cell "Mar 29, 2026"
      - cell "-"
      - cell "Assessment form":
        - button "Assessment form"
    - row "SIS0005 Thanuja Kumari Mar 27, 2026 Apr 14, 2026 - Assessment form":
      - cell "SIS0005"
      - cell "Thanuja Kumari"
      - cell "Mar 27, 2026"
      - cell "Apr 14, 2026"
      - cell "-"
      - cell "Assessment form":
        - button "Assessment form"
```

# Test source

```ts
  1   | import { test, expect } from './fixtures/test';
  2   | import { LoginPage } from '../pages/LoginPage';
  3   | import { ProbationPage } from '../pages/ProbationPage';
  4   | 
  5   | const PROBATION_EMPLOYEE_NAME = 'harshitha Palagiriii';
  6   | const PROBATION_EMPLOYEE_SEARCH = 'hars';
  7   | const PROBATION_EMPLOYEE_ID = 'SD3021343';
  8   | const PROBATION_EMPLOYEE_OPTION = `${PROBATION_EMPLOYEE_ID}-${PROBATION_EMPLOYEE_NAME}`;
  9   | 
  10  | test.describe.serial('Probation Flow', () => {
  11  |   test.beforeEach(async ({ page }) => {
  12  |     const email = process.env.LOGIN_EMAIL?.trim();
  13  |     const password = process.env.LOGIN_PASSWORD?.trim();
  14  |     test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');
  15  | 
  16  |     const loginPage = new LoginPage(page);
  17  |     await loginPage.loginFromEnv();
  18  |   });
  19  | 
  20  |   test.describe('01. Open Probation employee and Probation Info tab', () => {
  21  |     test('navigates to Employees Probation and opens Probation Info tab', async ({ page }) => {
  22  |       const probationPage = new ProbationPage(page);
  23  |       await probationPage.openEmployeesProbation();
  24  |       await probationPage.openProbationEmployee(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
  25  |       await probationPage.openProbationInfoTab();
  26  | 
  27  |       await expect(page.getByRole('columnheader', { name: 'Probation Period(In days)' })).toBeVisible();
  28  |       await expect(page.getByRole('columnheader', { name: 'Probation start date' })).toBeVisible();
  29  |       await expect(page.getByRole('columnheader', { name: 'Probation end date' })).toBeVisible();
  30  |       await expect(page.getByRole('columnheader', { name: 'status' })).toBeVisible();
  31  |     });
  32  |   });
  33  | 
  34  |   test.describe('02. Raise probation confirmation request', () => {
  35  |     test('raises Request for Probation from Probation Info kebab menu', async ({ page }) => {
  36  |       test.setTimeout(180000);
  37  |       const probationPage = new ProbationPage(page);
  38  |       await probationPage.openEmployeesProbation();
  39  |       await probationPage.openProbationEmployee(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
  40  |       await probationPage.ensureProbationRequestRaised();
  41  | 
  42  |       await expect(probationPage.currentStatusCell()).toHaveText(/Waiting for Approval/i, { timeout: 15000 });
  43  |     });
  44  |   });
  45  | 
  46  |   test.describe('03. RM Pending Approvals queue', () => {
  47  |     test('shows probation employee in Pending Approvals Onboarding Probation', async ({ page }) => {
  48  |       test.setTimeout(180000);
  49  |       const probationPage = new ProbationPage(page);
  50  |       await probationPage.openPendingOnboardingProbation();
  51  | 
  52  |       const employeeRow = page.getByRole('row').filter({ hasText: PROBATION_EMPLOYEE_NAME });
> 53  |       await expect(employeeRow.first()).toBeVisible({ timeout: 15000 });
      |                                         ^ Error: expect(locator).toBeVisible() failed
  54  |       await expect(employeeRow.first().getByRole('cell', { name: PROBATION_EMPLOYEE_ID })).toBeVisible();
  55  |       await probationPage.openAssessmentForm(PROBATION_EMPLOYEE_NAME);
  56  |       await expect(page.getByText(/ASSESSMENT FORM FOR PROBATION CONFIRMATION/i)).toBeVisible();
  57  |     });
  58  |   });
  59  | 
  60  |   test.describe('04. RM Assessment form submit', () => {
  61  |     test('submits assessment and shows Confirmed, Extend, and Reject options', async ({ page }) => {
  62  |       test.setTimeout(240000);
  63  |       const probationPage = new ProbationPage(page);
  64  |       await probationPage.openPendingOnboardingProbation();
  65  |       const employeeRow = page.getByRole('row').filter({ hasText: PROBATION_EMPLOYEE_NAME });
  66  |       await expect(employeeRow.first()).toBeVisible({ timeout: 15000 });
  67  | 
  68  |       await probationPage.openAssessmentForm(PROBATION_EMPLOYEE_NAME);
  69  |       await probationPage.fillAssessmentForm();
  70  |       await probationPage.submitAssessment();
  71  |       await probationPage.assertDecisionOptionsVisible();
  72  |     });
  73  |   });
  74  | 
  75  |   test.describe('05. RM Reject probation decision', () => {
  76  |     test('rejects RM assessment and leaves request waiting for TM approval', async ({ page }) => {
  77  |       test.setTimeout(240000);
  78  |       const probationPage = new ProbationPage(page);
  79  | 
  80  |       await probationPage.openPostAssessmentDecision(PROBATION_EMPLOYEE_NAME);
  81  |       await probationPage.rejectProbationDecision('Reject the Probation');
  82  |       await expect(probationPage.probationRejectedMessage).toBeVisible({ timeout: 15000 });
  83  | 
  84  |       await probationPage.openPendingOnboardingProbation();
  85  |       await expect(page.getByRole('row').filter({ hasText: PROBATION_EMPLOYEE_NAME }).first()).toBeVisible({ timeout: 15000 });
  86  |     });
  87  |   });
  88  | 
  89  |   test.describe('06. TM Reject probation decision', () => {
  90  |     test('rejects second pending record after RM reject and verifies Approved status on Probation Info', async ({ page }) => {
  91  |       test.setTimeout(240000);
  92  |       const probationPage = new ProbationPage(page);
  93  | 
  94  |       await probationPage.openPostAssessmentDecision(PROBATION_EMPLOYEE_NAME);
  95  |       await probationPage.rejectProbationDecision('Reject the Probation TM');
  96  |       await expect(probationPage.probationRejectedMessage).toBeVisible({ timeout: 15000 });
  97  | 
  98  |       await probationPage.assertApprovedOnProbationInfo(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
  99  |       await expect(probationPage.currentStatusCell()).toHaveText(/Approved/i);
  100 |     });
  101 |   });
  102 | });
  103 | 
  104 | test.describe.serial('Probation Flow — HR Reject and Extend from Rejected', () => {
  105 |   test.beforeEach(async ({ page }) => {
  106 |     const email = process.env.LOGIN_EMAIL?.trim();
  107 |     const password = process.env.LOGIN_PASSWORD?.trim();
  108 |     test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');
  109 | 
  110 |     const loginPage = new LoginPage(page);
  111 |     await loginPage.loginFromEnv();
  112 |   });
  113 | 
  114 |   test.describe('07. HR Process Reject probation decision', () => {
  115 |     test('rejects probation from HR Process popup in Pending Approvals Probation queue', async ({ page }) => {
  116 |       test.setTimeout(240000);
  117 |       const probationPage = new ProbationPage(page);
  118 | 
  119 |       await probationPage.openHrProcessDialog(PROBATION_EMPLOYEE_NAME);
  120 |       await expect(probationPage.hrProcessDialog).toBeVisible();
  121 |       await expect(probationPage.hrRejectRadio).toBeVisible();
  122 |       await probationPage.hrRejectProbationProcess('Reporting Manager', 'HR Process Reject probation');
  123 |       await expect(probationPage.probationRejectedMessage.first()).toBeVisible({ timeout: 15000 });
  124 |     });
  125 |   });
  126 | 
  127 |   test.describe('08. Re-request from Rejected Probation Info', () => {
  128 |     test('re-requests rejected probation and shows employee in Pending Approvals queue', async ({ page }) => {
  129 |       test.setTimeout(180000);
  130 |       const probationPage = new ProbationPage(page);
  131 | 
  132 |       await probationPage.reRequestFromRejectedProbationInfo(PROBATION_EMPLOYEE_NAME, PROBATION_EMPLOYEE_SEARCH);
  133 |       await probationPage.assertEmployeeInPendingProbationQueue(PROBATION_EMPLOYEE_NAME);
  134 |       await probationPage.assertPendingRowActionVisible(PROBATION_EMPLOYEE_NAME, 'Assessment form');
  135 |     });
  136 |   });
  137 | 
  138 |   test.describe('09. RM Extend probation decision', () => {
  139 |     test('submits assessment and extends probation when RM and TM are the same user', async ({ page }) => {
  140 |       test.setTimeout(240000);
  141 |       const probationPage = new ProbationPage(page);
  142 | 
  143 |       await probationPage.openPostAssessmentDecision(PROBATION_EMPLOYEE_NAME);
  144 |       await probationPage.extendProbationDecision('Extend probation feedback RM');
  145 |       await expect(probationPage.probationExtendedMessage.first()).toBeVisible({ timeout: 15000 });
  146 |     });
  147 |   });
  148 | 
  149 |   test.describe('10. Verify Approved status and approver history', () => {
  150 |     test('shows Approved on Probation Info and TM/RM Extended entries in Approver History', async ({ page }) => {
  151 |       test.setTimeout(180000);
  152 |       const probationPage = new ProbationPage(page);
  153 | 
```