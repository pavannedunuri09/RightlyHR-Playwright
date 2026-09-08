import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { YopmailPage } from '../pages/YopmailPage';
import { PreOnboardingPage } from '../pages/PreOnboardingPage';
import { OnboardingApplicationPage } from '../pages/OnboardingApplicationPage';
import { OnboardingDocumentsHrPage } from '../pages/OnboardingDocumentsHrPage';
import { TraineeOfferLetterPage } from '../pages/TraineeOfferLetterPage';
import { OfferLetterPage } from '../pages/OfferLetterPage';
import { createOnboardingFiles } from './fixtures/onboardingFiles';

const INDIAN_FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sneha', 'Vikram', 'Pooja',
  'Rahul', 'Kavya', 'Siddharth', 'Neha', 'Arjun', 'Divya', 'Varun', 'Riya',
  'Murali', 'Sindhuja', 'Swetha', 'Rajesh', 'Suresh', 'Manish', 'Harini',
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Reddy', 'Patel', 'Rao', 'Nair', 'Gupta', 'Verma', 'Singh',
  'Iyer', 'Joshi', 'Mehta', 'Pillai', 'Desai', 'Menon', 'Raj',
];

type GeneratedEmployee = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  designation: string;
  employmentType: string;
  location: string;
  sublocation: string;
};

let createdEmployee: GeneratedEmployee;
let portalTabForApp: Page;
let portalUsernameForApp: string;

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
    context = await browser.newContext({ storageState: '.auth/user.json' });
    page = await context.newPage();
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
      .catch(() => {});

    // 5. Search for the newly created employee by full email
    const searchbox = page.getByRole('searchbox', { name: 'Username' }).or(page.getByRole('searchbox'));
    await searchbox.fill(createdEmployee.email);
    await searchbox.press('Enter');

    await expect(page.getByRole('cell', { name: createdEmployee.fullName }).first()).toBeVisible({ timeout: 15000 });
  });

  test('Test-03: Filter/find prospective employee with Employee Created status and request documents', async () => {
    test.skip(!createdEmployee, 'No prospective employee created in Test-02');

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
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(1000);
  });

  test('Test-04: Open Yopmail, click link from Request for Documents email, and login to Pre-onboarding portal', async () => {
    test.setTimeout(180000);
    test.skip(!createdEmployee, 'No prospective employee created in Test-02');

    // 1. Open Yopmail in a new page/tab for the employee's personal email
    const mailTab = await context.newPage();
    const yopmail = new YopmailPage(mailTab);
    await yopmail.openInbox(createdEmployee.email);

    // 2. Wait for document request mail & open it in viewer
    await yopmail.waitForMailSubject(createdEmployee.fullName, 120000, createdEmployee.email);
    await yopmail.openMatchingMailInViewer(/Request for Documents Upload|Request for Documents/i);

    // 3. Extract credentials via YopmailPage helper
    const mailFrame = mailTab.frameLocator('iframe[name="ifmail"]');

    const credentials = await yopmail.findCredentialsInInbox({
      skipCached: true,
      preferPattern: /Request for Documents Upload|Request for Documents/i,
    }).catch(async () => {
      // Fallback: parse from live iframe body if helper poll missed
      await mailFrame.locator('body').waitFor({ state: 'visible', timeout: 15000 });
      const mailBodyText = await mailFrame.locator('body').innerText();
      const uMatch = mailBodyText.match(/Username\s*[:*]\s*([^\s]+@[^\s]+)/i) || mailBodyText.match(/Username\s*[:*]\s*(\S+)/i);
      const pMatch = mailBodyText.match(/Password\s*[:*]\s*(\S+)/i);
      return {
        username: uMatch ? uMatch[1].trim() : createdEmployee.email,
        password: pMatch ? pMatch[1].trim() : '',
      };
    });

    const { username, password } = credentials;
    console.log(`Extracted credentials for ${createdEmployee.fullName} -> Username: ${username}, Password: ${password}`);

    // 4. Open Pre-onboarding portal from email link
    const portalTab = await yopmail.openOnboardingPortal();

    // 5. Fill login credentials received via Yopmail and log in
    const preOnboarding = new PreOnboardingPage(portalTab);
    await preOnboarding.expectLoaded();
    await preOnboarding.login(username, password);

    // 6. Verify successful login to Pre-onboarding portal
    await preOnboarding.expectLoggedIn();

    // Store portal tab and username for Test-05
    portalTabForApp = portalTab;
    portalUsernameForApp = username;

    await mailTab.close().catch(() => {});
  });

  test('Test-05: Click Go to Application, fill personal details, upload documents, and submit', async ({}, testInfo) => {
    test.setTimeout(180000);
    test.skip(!createdEmployee || !portalTabForApp, 'No pre-onboarding portal session active');

    const preOnboarding = new PreOnboardingPage(portalTabForApp);
    await preOnboarding.goToApplication();

    const application = new OnboardingApplicationPage(portalTabForApp);
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
    test.skip(!createdEmployee, 'No prospective employee created in Test-02');

    // 1. Ensure HR session is active
    if (page.url().includes('/login') || (await page.getByRole('textbox', { name: 'Please enter email' }).isVisible().catch(() => false))) {
      const loginPage = new LoginPage(page);
      await loginPage.loginFromEnv();
    }

    // 2. Click Employees -> Prospective Employees in navigation menu
    const employeesNav = page.getByText('Employees', { exact: true }).or(page.getByText('Employees'));
    await employeesNav.first().click();

    const prospectiveNav = page.getByText('Prospective Employees', { exact: true })
      .or(page.getByRole('link', { name: 'Prospective' }))
      .or(page.locator('a[href*="prospective"]'));
    if (await prospectiveNav.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await prospectiveNav.first().click();
    } else {
      await page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });
    }

    // 3. Search for the employee who submitted documents by email
    const searchbox = page.getByRole('searchbox', { name: 'Username' }).or(page.getByRole('searchbox'));
    await searchbox.fill(createdEmployee.email);
    await searchbox.press('Enter');
    await page.waitForTimeout(1000);

    // 4. Select employee record and click full name to open profile drawer
    const row = page.getByRole('row').filter({
      has: page.getByRole('cell', { name: createdEmployee.email, exact: true })
        .or(page.getByText(createdEmployee.email)),
    }).first();

    await row.waitFor({ state: 'visible', timeout: 15000 });

    const nameCell = row.getByRole('cell', { name: createdEmployee.fullName }).first();
    await nameCell.click();

    // 5. Navigate through profile under Job tab -> Onboarding Documents tab, verify documents via kebab menu
    const docsHr = new OnboardingDocumentsHrPage(page);
    await docsHr.openFromProfile();
    await docsHr.verifyPendingDocuments();

    // 6. Close drawer & navigate back to prospective employees list
    await page.keyboard.press('Escape').catch(() => {});
    await page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });

    // 7. Search employee and verify status is updated to "Documents verified"
    await searchbox.fill(createdEmployee.email);
    await searchbox.press('Enter');

    await expect(page.getByRole('cell', { name: /Documents verified/i }).first())
      .toBeVisible({ timeout: 20000 });
  });

  test('Test-07: Generate offer letter from prospective employees list view and request for approval', async () => {
    test.setTimeout(180000);
    test.skip(!createdEmployee, 'No prospective employee created in Test-02');

    // 1. Ensure HR session & navigate to prospective employees list
    if (page.url().includes('/login') || (await page.getByRole('textbox', { name: 'Please enter email' }).isVisible().catch(() => false))) {
      const loginPage = new LoginPage(page);
      await loginPage.loginFromEnv();
    }

    await page.goto('/employee-management/prospective/employees', { waitUntil: 'domcontentloaded' });

    // 2. Click "Generate Documents" button and select "Offer Letter"
    const offerLetterPage = new OfferLetterPage(page);
    await offerLetterPage.openFromList();

    // 3. Select the created employee from dropdown
    await offerLetterPage.selectEmployee(createdEmployee.firstName, createdEmployee.lastName, createdEmployee.email);

    // 4. Fill required offer details
    await offerLetterPage.fillRequiredDetails();

    // 5. Click "Generate Offer Letter"
    await offerLetterPage.generateOfferLetter();

    // 6. Click "Request For Approval" button
    await offerLetterPage.requestApproval();
  });
});
