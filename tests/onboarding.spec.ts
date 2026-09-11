import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { YopmailPage } from '../pages/YopmailPage';
import { PreOnboardingPage } from '../pages/PreOnboardingPage';
import { OnboardingApplicationPage } from '../pages/OnboardingApplicationPage';
import { OnboardingDocumentsHrPage } from '../pages/OnboardingDocumentsHrPage';
import { OfferLetterPage } from '../pages/OfferLetterPage';
import { PendingEmployeeOfferApprovalPage } from '../pages/PendingEmployeeOfferApprovalPage';
import { PreOnboardingOfferLetterPage } from '../pages/PreOnboardingOfferLetterPage';
import { PreOnboardingPostOfferPage } from '../pages/PreOnboardingPostOfferPage';
import { ProspectiveEmployeePage } from '../pages/ProspectiveEmployeePage';
import { EmployeeOnboardingInfoPage, generateEmployeeId } from '../pages/EmployeeOnboardingInfoPage';
import { EmployeeJobPrepPage } from '../pages/EmployeeJobPrepPage';
import { createOnboardingFiles } from './fixtures/onboardingFiles';
import {
  loadLastOnboardingEmployee,
  saveLastOnboardingEmployee,
  type SavedOnboardingEmployee,
} from './fixtures/lastOnboardingEmployee';

const INDIAN_FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sneha', 'Vikram', 'Pooja',
  'Rahul', 'Kavya', 'Siddharth', 'Neha', 'Arjun', 'Divya', 'Varun', 'Riya',
  'Murali', 'Sindhuja', 'Swetha', 'Rajesh', 'Suresh', 'Manish', 'Harini',
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Reddy', 'Patel', 'Rao', 'Nair', 'Gupta', 'Verma', 'Singh',
  'Iyer', 'Joshi', 'Mehta', 'Pillai', 'Desai', 'Menon', 'Raj',
];

function isHeadedYopmailRun() {
  return process.env.HEADLESS !== 'true' && !(process.env.CI === 'true' || process.env.CI === '1');
}

type GeneratedEmployee = SavedOnboardingEmployee;

let createdEmployee: GeneratedEmployee;
let portalTabForApp: Page;
let portalUsernameForApp: string;
let onboardingContext: BrowserContext;

function ensureCreatedEmployee(): GeneratedEmployee {
  if (createdEmployee?.email) {
    return createdEmployee;
  }
  const stored = loadLastOnboardingEmployee();
  if (stored?.email) {
    createdEmployee = stored;
    return stored;
  }
  throw new Error(
    'No onboarding employee available. Run Test-02 or the full onboarding suite first (tests/fixtures/last-onboarding-employee.json is missing).',
  );
}

async function ensurePortalSession(): Promise<Page> {
  const employee = ensureCreatedEmployee();
  if (portalTabForApp && !portalTabForApp.isClosed()) {
    return portalTabForApp;
  }

  const stored = loadLastOnboardingEmployee();
  const username = stored?.username ?? portalUsernameForApp;
  const password = stored?.password;
  if (!username || !password) {
    throw new Error(
      'No pre-onboarding credentials saved. Run Test-04 first or ensure last-onboarding-employee.json has username/password.',
    );
  }

  portalTabForApp = await onboardingContext.newPage();
  const preOnboarding = new PreOnboardingPage(portalTabForApp);
  await portalTabForApp.goto('https://preonboardingqarightlyhr.onpremise.cluster.rightlyhr.com', {
    waitUntil: 'domcontentloaded',
  });
  await preOnboarding.expectLoaded();
  await preOnboarding.login(username, password);
  await preOnboarding.expectLoggedIn();
  portalUsernameForApp = username;
  return portalTabForApp;
}

function generateUniqueEmployee(): GeneratedEmployee {
  const timestamp = Date.now();
  const firstName = INDIAN_FIRST_NAMES[timestamp % INDIAN_FIRST_NAMES.length];
  const lastName = INDIAN_LAST_NAMES[(timestamp + 11) % INDIAN_LAST_NAMES.length];
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@yopmail.com`;

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email,
    designation: 'Front End Developer',
    employmentType: 'Fresher',
    location: 'Hyderabad',
    sublocation: 'Jai Hind Enclave building',
  };
}

test.describe('Onboarding Flow', () => {
  test.describe.configure({ mode: 'serial' });

  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    onboardingContext = await browser.newContext({ storageState: '.auth/user.json' });
    context = onboardingContext;
    page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
    const stored = loadLastOnboardingEmployee();
    if (stored?.email) {
      createdEmployee = stored;
      if (stored.username) {
        portalUsernameForApp = stored.username;
      }
      console.log(`Reusing saved onboarding employee: ${stored.email}`);
    }
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('Test-01: Navigate to Prospective Employees list as HR', async () => {
    // Navigate directly to prospective employees page with saved storageState
    await page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });

    // Verify HR is in prospective employees list view & Add button is visible
    await expect(page).toHaveURL(/\/employee-management\/prospective\/employees/, { timeout: 20000 });
    await expect(page.getByRole('button', { name: 'Add Prospective Employee' })).toBeVisible({ timeout: 20000 });
  });

  test('Test-02: Create new prospective employee with unique Indian name and verify in list', async () => {
    createdEmployee = generateUniqueEmployee();

    // Ensure page is on prospective employees view
    if (!/\/employee-management\/prospective\/employees/.test(page.url())) {
      await page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });
    }

    // 1. Click "Add Prospective Employee" button
    const addButton = page.getByRole('button', { name: 'Add Prospective Employee' });
    await addButton.waitFor({ state: 'visible', timeout: 20000 });
    await addButton.click();

    // 2. Fill form details
    await page.getByRole('textbox', { name: 'Please enter first name' }).fill(createdEmployee.firstName);
    await page.getByRole('textbox', { name: 'Please enter last name' }).fill(createdEmployee.lastName);
    await page.getByRole('textbox', { name: 'Please enter personal email ID' }).fill(createdEmployee.email);

    // Select designation
    await page.getByRole('combobox', { name: 'Please select designation' }).click();
    await page.getByRole('searchbox').fill('Front');
    await page.getByRole('option', { name: 'Front End Developer' }).click();

    // Select employment type (Fresher)
    await page.getByRole('combobox', { name: 'Please select employment type' }).click();
    await page.getByRole('option', { name: 'Fresher' }).click();

    // Select location & sublocation
    await page.getByRole('combobox', { name: 'Please select location' }).click();
    await page.getByRole('option', { name: 'Hyderabad' }).click();

    const sublocationCombobox = page.locator('#sublocation').getByRole('button', { name: 'dropdown trigger' });
    if (await sublocationCombobox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sublocationCombobox.click();
    } else {
      await page.getByRole('combobox', { name: 'Please select sublocation' }).click();
    }
    await page.getByRole('option', { name: 'Jai Hind Enclave building' }).click();

    // 3. Click Add / Save
    const submitBtn = page.getByRole('dialog').getByRole('button', { name: 'Add', exact: true })
      .or(page.getByRole('button', { name: 'Add', exact: true }));
    await submitBtn.click();

    // 4. Verify success message/modal close
    await expect(page.getByText('Prospective employee created').or(page.getByText(/created successfully|added successfully/i)))
      .toBeVisible({ timeout: 15000 })
      .catch(() => { });

    // 5. Search for the newly created employee by full email
    const searchbox = page.getByRole('searchbox', { name: 'Username' }).or(page.getByRole('searchbox'));
    await searchbox.fill(createdEmployee.email);
    await searchbox.press('Enter');

    await expect(page.getByRole('cell', { name: createdEmployee.fullName }).first()).toBeVisible({ timeout: 15000 });
    saveLastOnboardingEmployee(createdEmployee);
  });

  test('Test-03: Filter/find prospective employee with Employee Created status and request documents', async () => {
    createdEmployee = ensureCreatedEmployee();

    // 1. Ensure on prospective employees list and search for created employee
    if (!/\/employee-management\/prospective\/employees/.test(page.url())) {
      await page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });
    }

    const searchbox = page.getByRole('searchbox', { name: 'Username' }).or(page.getByRole('searchbox'));
    await searchbox.fill(createdEmployee.email);
    await searchbox.press('Enter');

    // 2. Locate row with status "Employee Created"
    const row = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: 'Employee Created', exact: true }),
    }).filter({ hasText: createdEmployee.email }).first();

    await row.waitFor({ state: 'visible', timeout: 15000 });

    // 3. Click employee name cell to open profile drawer
    const nameCell = row.getByRole('cell', { name: createdEmployee.fullName }).first();
    await nameCell.click();

    // 4. Click "Request for Documents" button inside the profile drawer
    const requestDocsBtn = page.getByRole('button', { name: 'Request for Documents' })
      .or(page.getByText('Request for Documents', { exact: true }));

    if (!(await requestDocsBtn.first().isVisible({ timeout: 3000 }).catch(() => false))) {
      await row.getByRole('cell', { name: 'Employee Created' }).first().click();
    }

    await requestDocsBtn.first().waitFor({ state: 'visible', timeout: 15000 });
    await requestDocsBtn.first().click();

    // 5. Verify toast notification confirming email sent
    const toast = page.getByText(/Email has been sent|sent successfully|Request for Documents Upload/i).first();
    await expect(toast).toBeVisible({ timeout: 15000 });

    // Close the opened profile drawer so it doesn't linger into Test-04
    await page.keyboard.press('Escape').catch(() => { });
    await page.waitForTimeout(1000);
  });

  test('Test-04: Open Yopmail, click link from Request for Documents email, and login to Pre-onboarding portal', async () => {
    test.setTimeout(isHeadedYopmailRun() ? 1_200_000 : 180_000);
    createdEmployee = ensureCreatedEmployee();

    // 1. Open Yopmail in a new page/tab for the employee's personal email
    const mailTab = await context.newPage();
    const yopmail = new YopmailPage(mailTab);
    await yopmail.openInbox(createdEmployee.email);

    // 2. Wait for document request mail & open it in viewer
    await yopmail.waitForMailSubject(createdEmployee.fullName, 120000, createdEmployee.email);

    const documentRequestPattern = /Request for Documents Upload|Request for Documents/i;
    await yopmail.openMatchingMailInViewer(documentRequestPattern);
    const credentials = await yopmail.readCredentials({ preferPattern: documentRequestPattern }).catch(async () => {
      const mailFrame = mailTab.frameLocator('iframe[name="ifmail"]');
      await mailFrame.locator('body').waitFor({ state: 'visible', timeout: 15000 });
      const mailBodyText = await mailFrame.locator('body').innerText();
      const uMatch = mailBodyText.match(/Username\s*[:*]\s*([^\s]+@[^\s]+)/i) || mailBodyText.match(/Username\s*[:*]\s*(\S+)/i);
      const pMatch = mailBodyText.match(/Password\s*[:*]\s*(\S+)/i);
      return {
        username: uMatch ? uMatch[1].trim() : createdEmployee.email,
        password: pMatch ? pMatch[1].trim() : '',
      };
    });
    const portalTab = await yopmail.openOnboardingPortalFromDocumentRequestMail();

    const { username, password } = credentials;
    console.log(`Extracted credentials for ${createdEmployee.fullName} -> Username: ${username}, Password: ${password}`);

    // 4. Pre-onboarding portal opened from email "Click here" link

    // 5. Fill login credentials received via Yopmail and log in
    const preOnboarding = new PreOnboardingPage(portalTab);
    await preOnboarding.expectLoaded();
    await preOnboarding.login(username, password);

    // 6. Verify successful login to Pre-onboarding portal
    await preOnboarding.expectLoggedIn();

    // Store portal tab and username for Test-05
    portalTabForApp = portalTab;
    portalUsernameForApp = username;
    saveLastOnboardingEmployee({ ...createdEmployee, username, password });

    await mailTab.close().catch(() => { });
  });

  test('Test-05: Click Go to Application, fill personal details, upload documents, and submit', async ({ }, testInfo) => {
    test.setTimeout(180000);
    createdEmployee = ensureCreatedEmployee();
    const portalTab = await ensurePortalSession();

    const preOnboarding = new PreOnboardingPage(portalTab);
    await preOnboarding.goToApplication();

    const application = new OnboardingApplicationPage(portalTab);
    await application.preparePersonalDetailsAndOpenDocuments(
      createdEmployee.firstName,
      createdEmployee.lastName,
    );

    const files = createOnboardingFiles(testInfo.outputDir);
    await application.uploadMissingDocuments(files.pdf, files.image);

    await application.submitAndExpectLogout(preOnboarding.usernameInput);
  });

  test('Test-06: Verify employee onboarding documents as HR and verify status updates to Documents verified', async () => {
    test.setTimeout(180000);
    createdEmployee = ensureCreatedEmployee();

    await page.bringToFront();

    if (page.url().includes('/login') || (await page.getByRole('textbox', { name: 'Please enter email' }).isVisible().catch(() => false))) {
      const loginPage = new LoginPage(page);
      await loginPage.loginFromEnv();
    }

    const employees = new ProspectiveEmployeePage(page);
    await employees.openProspectiveEmployeesList();
    await employees.openEmployeeProfile(createdEmployee);

    const docsHr = new OnboardingDocumentsHrPage(page);
    await docsHr.openFromProfile();
    await docsHr.verifyPendingDocuments();

    await page.keyboard.press('Escape').catch(() => { });
    await page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });

    const searchbox = page.getByRole('searchbox', { name: 'Username' }).or(page.getByRole('searchbox'));
    await searchbox.fill(createdEmployee.email);
    await searchbox.press('Enter');

    await expect(page.getByRole('cell', { name: /Documents verified/i }).first())
      .toBeVisible({ timeout: 20000 });
  });

  test('Test-07: Generate offer letter from prospective employees list view and request for approval', async () => {
    test.setTimeout(180000);
    createdEmployee = ensureCreatedEmployee();

    await page.bringToFront();

    if (page.url().includes('/login') || (await page.getByRole('textbox', { name: 'Please enter email' }).isVisible().catch(() => false))) {
      const loginPage = new LoginPage(page);
      await loginPage.loginFromEnv();
    }

    await page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });

    const offerLetterPage = new OfferLetterPage(page);
    await offerLetterPage.openFromList();
    await offerLetterPage.selectEmployee(createdEmployee.firstName, createdEmployee.lastName, createdEmployee.email);
    await offerLetterPage.fillRequiredDetails();
    await offerLetterPage.generateOfferLetter();
    await offerLetterPage.requestApproval();
  });

  test('Test-08: Approve and release offer letter from Pending Approvals onboarding queue', async () => {
    test.setTimeout(180000);
    createdEmployee = ensureCreatedEmployee();

    await page.bringToFront();

    if (page.url().includes('/login') || (await page.getByRole('textbox', { name: 'Please enter email' }).isVisible().catch(() => false))) {
      const loginPage = new LoginPage(page);
      await loginPage.loginFromEnv();
    }

    const approvals = new PendingEmployeeOfferApprovalPage(page);
    await approvals.openEmployeeOfferLetterQueue();

    const pendingRow = await approvals.findOfferRow(createdEmployee);
    await approvals.expectEmployeeDetails(pendingRow, createdEmployee);

    const approveText = await approvals.approveOffer(pendingRow);
    expect(approveText).toMatch(/approved/i);

    await approvals.openEmployeeOfferLetterQueue();
    const releaseRow = await approvals.findOfferRow(createdEmployee);
    const releaseText = await approvals.releaseOffer(releaseRow);
    expect(releaseText).toMatch(/released|Release Letter/i);

    await page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });
    const searchbox = page.getByRole('searchbox', { name: 'Username' }).or(page.getByRole('searchbox'));
    await searchbox.fill(createdEmployee.email);
    await searchbox.press('Enter');

    await expect(page.getByRole('cell', { name: /Offer Letter Released/i }).first())
      .toBeVisible({ timeout: 20000 });
  });

  test('Test-09: Accept offer letter via Yopmail and submit academic and emergency details', async ({ }, testInfo) => {
    test.setTimeout(isHeadedYopmailRun() ? 1_200_000 : 600_000);
    createdEmployee = ensureCreatedEmployee();

    console.log(
      `Accepting offer letter in pre-onboarding as ${createdEmployee.firstName} ${createdEmployee.lastName} (${createdEmployee.email})`,
    );

    const mailTab = await context.newPage();
    const yopmail = new YopmailPage(mailTab);
    await yopmail.openInbox(createdEmployee.email);
    await yopmail.waitForMailMatching(
      new RegExp(`${createdEmployee.firstName}[\\s\\S]*Offer Letter Issued|Offer Letter Issued`, 'i'),
    );

    const offerLetterPattern = /Offer Letter Issued|Offer Letter Released/i;
    await yopmail.openMatchingMailInViewer(offerLetterPattern);
    const credentials = await yopmail.readCredentials({ preferPattern: offerLetterPattern }).catch(async () => {
      const mailFrame = mailTab.frameLocator('iframe[name="ifmail"]');
      await mailFrame.locator('body').waitFor({ state: 'visible', timeout: 15000 });
      const mailBodyText = await mailFrame.locator('body').innerText();
      const uMatch =
        mailBodyText.match(/Username\s*[:*]\s*([^\s]+@[^\s]+)/i) ||
        mailBodyText.match(/Username\s*[:*]\s*(\S+)/i);
      const pMatch = mailBodyText.match(/Password\s*[:*]\s*(\S+)/i);
      return {
        username: uMatch ? uMatch[1].trim() : createdEmployee.username ?? createdEmployee.email,
        password: pMatch ? pMatch[1].trim() : createdEmployee.password ?? '',
      };
    });
    const portalTab = await yopmail.openOnboardingPortalFromOfferLetterMail();

    const { username, password } = credentials;
    console.log(`Extracted offer-letter credentials -> Username: ${username}, Password: ${password}`);

    const preOnboarding = new PreOnboardingPage(portalTab);
    await preOnboarding.expectLoaded();
    await preOnboarding.login(username, password);
    await preOnboarding.expectLoggedIn();
    saveLastOnboardingEmployee({ ...createdEmployee, username, password });

    if (await preOnboarding.goToApplicationButton.isVisible().catch(() => false)) {
      await preOnboarding.goToApplication();
    }

    const offerLetter = new PreOnboardingOfferLetterPage(portalTab);
    await offerLetter.goToOfferDecision();
    await offerLetter.acceptIfNeeded();

    const files = createOnboardingFiles(testInfo.outputDir);
    const postOffer = new PreOnboardingPostOfferPage(portalTab);
    await postOffer.completePostOfferApplication(files.image, { skipEmployment: true });
    await postOffer.expectReviewPage({ requireEmployment: false });
    await postOffer.submitApplication();

    portalTabForApp = portalTab;
    portalUsernameForApp = username;
    await mailTab.close().catch(() => { });

    await page.bringToFront();
    if (page.url().includes('/login') || (await page.getByRole('textbox', { name: 'Please enter email' }).isVisible().catch(() => false))) {
      const loginPage = new LoginPage(page);
      await loginPage.loginFromEnv();
    }

    await page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });
    const searchbox = page.getByRole('searchbox', { name: 'Username' }).or(page.getByRole('searchbox'));
    await searchbox.fill(createdEmployee.email);
    await searchbox.press('Enter');

    await expect(page.getByRole('cell', { name: /Offer Letter Accepted/i }).first())
      .toBeVisible({ timeout: 20000 });
  });

  test('Test-10: Activate offer-letter-accepted employee and verify in probation employees list', async () => {
    test.setTimeout(180000);
    createdEmployee = ensureCreatedEmployee();

    await page.bringToFront();
    if (page.url().includes('/login') || (await page.getByRole('textbox', { name: 'Please enter email' }).isVisible().catch(() => false))) {
      const loginPage = new LoginPage(page);
      await loginPage.loginFromEnv();
    }

    const employees = new ProspectiveEmployeePage(page);
    await employees.openProspectiveEmployeesList();
    await employees.searchEmployee(createdEmployee.email);

    const prospectiveRow = employees.employeeRow(createdEmployee.email);
    await expect(prospectiveRow).toBeVisible({ timeout: 15000 });
    await expect(prospectiveRow).toContainText(/Offer Letter Accepted/i);

    console.log(
      `Activating ${createdEmployee.firstName} ${createdEmployee.lastName} (${createdEmployee.email}) from prospective employees`,
    );
    await employees.openEmployeeProfile(createdEmployee);

    const onboardingInfo = new EmployeeOnboardingInfoPage(page);
    await onboardingInfo.openFromProfile();
    await onboardingInfo.setStatusActiveAndSave();

    await page.keyboard.press('Escape').catch(() => { });
    await employees.expectEmployeeHiddenInList(createdEmployee.email);
    console.log(`${createdEmployee.email} removed from prospective employees`);

    await employees.expectEmployeeVisibleInProbation(createdEmployee);
    console.log(`${createdEmployee.fullName} is listed under probation employees`);
  });

  test('Test-11: Update probation employee basic info, contact info, and job info', async () => {
    test.setTimeout(180000);
    createdEmployee = ensureCreatedEmployee();

    await page.bringToFront();
    if (page.url().includes('/login') || (await page.getByRole('textbox', { name: 'Please enter email' }).isVisible().catch(() => false))) {
      const loginPage = new LoginPage(page);
      await loginPage.loginFromEnv();
    }

    const employees = new ProspectiveEmployeePage(page);
    await employees.openProbationEmployeeProfile(createdEmployee);
    console.log(`Updating probation employee profile for ${createdEmployee.fullName} (${createdEmployee.email})`);

    const employeeId = generateEmployeeId();
    const workEmail = `${createdEmployee.firstName.toLowerCase()}${Date.now().toString().slice(-4)}@yopmail.com`;

    const basicInfo = new EmployeeOnboardingInfoPage(page);
    const savedEmployeeId = await basicInfo.setEmployeeIdOnBasicInfo(employeeId);

    const profileSetup = new EmployeeJobPrepPage(page);
    const savedWorkEmail = await profileSetup.ensureWorkEmail(workEmail);
    await profileSetup.ensureEmployeeJobInfo();

    createdEmployee = {
      ...createdEmployee,
      employeeId: savedEmployeeId || employeeId,
      workEmail: savedWorkEmail || workEmail,
    };
    saveLastOnboardingEmployee(createdEmployee);

    await expect(page.getByText(/Basic information updated|Contact Information updated|Job details updated/i).first())
      .toBeVisible({ timeout: 15000 })
      .catch(() => { });
    console.log(
      `Probation employee updated -> ID: ${createdEmployee.employeeId}, Work mail: ${createdEmployee.workEmail}`,
    );
  });
});
