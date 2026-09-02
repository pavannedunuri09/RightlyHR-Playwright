import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProspectiveTraineePage } from '../pages/ProspectiveTraineePage';
import { EmployeeMyInfoPage } from '../pages/EmployeeMyInfoPage';
import { YopmailPage } from '../pages/YopmailPage';
import { PreOnboardingPage } from '../pages/PreOnboardingPage';
import { OnboardingApplicationPage } from '../pages/OnboardingApplicationPage';
import { OnboardingDocumentsHrPage } from '../pages/OnboardingDocumentsHrPage';
import { createOnboardingFiles } from './fixtures/onboardingFiles';
import { loadLastTrainee, saveLastTrainee, isTraineeReusable, needsDocumentRequest, type SavedTrainee } from './fixtures/lastTrainee';

const DUPLICATE_TRAINEE = {
  firstName: 'Swetha',
  lastName: 'Priya',
  email: 'Swethapriya@yopmail.com',
};

test.describe('Prospective Trainees', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.LOGIN_EMAIL?.trim();
    const password = process.env.LOGIN_PASSWORD?.trim();
    test.skip(!email || !password, 'Set LOGIN_EMAIL and LOGIN_PASSWORD in .env');

    const loginPage = new LoginPage(page);
    await loginPage.loginFromEnv();
  });

  test('Test-01: Duplicate Employee email trainee creation', async ({ page }) => {
    const trainees = new ProspectiveTraineePage(page);
    await trainees.openTraineesList();
    await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/);

    await trainees.openAddForm();
    await trainees.fillAndSubmit(DUPLICATE_TRAINEE);

    await expect(trainees.duplicateEmailMessage).toBeVisible({ timeout: 15000 });
    await expect(trainees.addButton).toBeVisible();
  });

  test('Test-02: New trainee creation', async ({ page }) => {
    const trainees = new ProspectiveTraineePage(page);
    const details = ProspectiveTraineePage.uniqueTrainee();

    await trainees.openTraineesList();
    await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/);

    await trainees.openAddForm();
    await trainees.fillAndSubmit(details);

    await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/, { timeout: 20000 });
    await trainees.expectTraineeVisibleInList(details);
  });

  test('Test-03: Request documents and verify yopmail', async ({ page }, testInfo) => {
    test.setTimeout(180000);
    const trainees = new ProspectiveTraineePage(page);
    const details = ProspectiveTraineePage.uniqueTrainee();

    await trainees.openTraineesList();
    await trainees.openAddForm();
    await trainees.fillAndSubmit(details);
    await trainees.expectTraineeVisibleInList(details);

    const createdRow = trainees.employeeCreatedRow(details.email);
    await expect(createdRow).toBeVisible({ timeout: 15000 });
    await trainees.openEmployeeCreated(details);

    const myInfo = new EmployeeMyInfoPage(page);
    await myInfo.expectBasicTab();
    const successText = await myInfo.requestDocuments();
    expect(successText).toContain('Email has been sent');

    const mailTab = await page.context().newPage();
    const yopmail = new YopmailPage(mailTab);
    await yopmail.openInbox(details.email);
    const subject = await yopmail.waitForMailSubject(`${details.firstName} ${details.lastName}`);
    expect(subject).toContain(`RightlyHR - ${details.firstName} ${details.lastName}`);

    const screenshotPath = testInfo.outputPath('yopmail-request-documents.png');
    await yopmail.screenshotMail(screenshotPath);
    await testInfo.attach('yopmail-mail', { path: screenshotPath, contentType: 'image/png' });
  });

  test('Test-04: Pre-onboarding login, application, and document submit', async ({ page }, testInfo) => {
    test.setTimeout(360000);
    const { details, yopmail, reused } = await requestDocumentsAndOpenMail(page);

    const requestSubject = await yopmail.waitForMailSubject(`${details.firstName} ${details.lastName}`);
    const credentials = await yopmail.readCredentials();
    saveLastTrainee({ ...details, username: credentials.username, password: credentials.password });
    expect(credentials.username.toLowerCase()).toContain(details.email.split('@')[0].toLowerCase());

    const onboardingPage = await yopmail.openOnboardingPortal();
    const preOnboarding = new PreOnboardingPage(onboardingPage);
    await preOnboarding.expectLoaded();

    await preOnboarding.login('wrong.user@yopmail.com', credentials.password);
    await preOnboarding.expectInvalidCredentials();

    await preOnboarding.login(credentials.username, 'WrongPassword1');
    await preOnboarding.expectInvalidCredentials();

    await preOnboarding.login(credentials.username, credentials.password);
    await preOnboarding.expectLoggedIn();
    await preOnboarding.goToApplication();

    const application = new OnboardingApplicationPage(onboardingPage);
    const onDocuments = await application.isOnDocumentsPage();
    if (!onDocuments) {
      await application.expectPersonalForm();
      if (!reused) {
        await application.expectInvalidNameRejected(details.firstName);
        await application.expectInvalidMobileRejected();
      }
      await application.fillMandatoryIndianDetails(details.firstName, details.lastName);
      await application.goToDocuments();
    } else {
      console.log(`Reusing in-progress application for ${details.email}`);
    }

    const files = createOnboardingFiles(testInfo.outputDir);
    const validationDoc = (await application.needsUpload('Resume'))
      ? 'Resume'
      : (await application.needsUpload('Aadhaar'))
        ? 'Aadhaar'
        : (await application.needsUpload('PAN'))
          ? 'PAN'
          : null;
    if (validationDoc) {
      await application.expectInvalidFileTypeRejected(files.invalidType, validationDoc);
      await application.expectOversizedFileRejected(files.oversized);
    }
    await application.uploadMissingDocuments(files.pdf, files.image);
    await application.submitAndExpectLogout(preOnboarding.usernameInput);

    await yopmail.page.bringToFront();
    const submittedSubject = await yopmail.waitForNewMail(
      `${details.firstName} ${details.lastName}`,
      requestSubject,
    );
    expect(submittedSubject.length).toBeGreaterThan(0);

    const screenshotPath = testInfo.outputPath('yopmail-documents-submitted.png');
    await yopmail.screenshotMail(screenshotPath);
    await testInfo.attach('yopmail-documents-submitted', { path: screenshotPath, contentType: 'image/png' });
  });

  test('Test-05: Verify onboarding documents for the same trainee', async ({ page }) => {
    test.setTimeout(180000);
    const saved = loadLastTrainee();
    test.skip(!saved, 'No saved trainee. Run Test-04 first.');

    console.log(`Verifying documents for ${saved!.firstName} ${saved!.lastName} (${saved!.email})`);
    const trainees = new ProspectiveTraineePage(page);
    await trainees.openTraineesList();
    await openSavedTraineeProfile(trainees, saved!);

    const onboardingHr = new OnboardingDocumentsHrPage(page);
    await onboardingHr.openFromProfile();
    await onboardingHr.verifyPendingDocuments();

    await trainees.goToTraineesList();
    await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/);
    await expect(trainees.addProspectiveTraineeButton).toBeVisible();
  });

  test('Test-06: Reject document, re-request, re-upload, and verify', async ({ page }, testInfo) => {
    test.setTimeout(480000);
    const saved = loadLastTrainee();
    test.skip(!saved, 'No saved trainee. Run Test-04 first.');

    console.log(`Reject/re-request flow for ${saved!.firstName} ${saved!.lastName} (${saved!.email})`);
    const trainees = new ProspectiveTraineePage(page);
    await trainees.openTraineesList();
    await openSavedTraineeProfile(trainees, saved!);

    const onboardingHr = new OnboardingDocumentsHrPage(page);
    await onboardingHr.openFromProfile();
    const trainee = await resolveRejectableTrainee(page, trainees, saved!, onboardingHr, testInfo);
    const rejectedDoc = await onboardingHr.rejectOneDocument('The uploaded document is not valid.');
    await onboardingHr.reRequestDocuments('Please re-upload the rejected documents.');

    const mailTab = await page.context().newPage();
    const yopmail = new YopmailPage(mailTab);
    await yopmail.openInbox(trainee.email);
    const rerequestSubject = await yopmail.waitForRerequestMail(
      `${trainee.firstName} ${trainee.lastName}`,
      '',
    );
    expect(rerequestSubject.length).toBeGreaterThan(0);

    const rerequestShot = testInfo.outputPath('yopmail-rerequest-documents.png');
    await yopmail.screenshotMail(rerequestShot);
    await testInfo.attach('yopmail-rerequest-documents', { path: rerequestShot, contentType: 'image/png' });

    const credentials = await yopmail.readCredentials();
    saveLastTrainee({ ...trainee, username: credentials.username, password: credentials.password });

    const onboardingPage = await yopmail.openOnboardingPortal();
    const preOnboarding = new PreOnboardingPage(onboardingPage);
    await preOnboarding.expectLoaded();
    await preOnboarding.login(credentials.username, credentials.password);
    await preOnboarding.expectLoggedIn();
    await preOnboarding.goToApplication();

    const application = new OnboardingApplicationPage(onboardingPage);
    await application.goToDocumentsIfNeeded();
    const files = createOnboardingFiles(testInfo.outputDir);
    await application.reUploadRejectedDocuments(files.pdf, files.image);
    await application.submitAndExpectLogout(preOnboarding.usernameInput);

    await yopmail.page.bringToFront();
    const submittedSubject = await yopmail.waitForNewMail(
      `${trainee.firstName} ${trainee.lastName}`,
      rerequestSubject,
    );
    expect(submittedSubject.length).toBeGreaterThan(0);

    const submittedShot = testInfo.outputPath('yopmail-rerequest-submitted.png');
    await yopmail.screenshotMail(submittedShot);
    await testInfo.attach('yopmail-rerequest-submitted', { path: submittedShot, contentType: 'image/png' });

    await page.bringToFront();
    await trainees.goToTraineesList();
    await openSavedTraineeProfile(trainees, trainee);
    await onboardingHr.openFromProfile();
    await onboardingHr.verifyDocumentIfNeeded(rejectedDoc);

    await trainees.goToTraineesList();
    await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/);
    await expect(trainees.addProspectiveTraineeButton).toBeVisible();
  });
});

async function resolveRejectableTrainee(
  page: import('@playwright/test').Page,
  trainees: ProspectiveTraineePage,
  saved: SavedTrainee,
  onboardingHr: OnboardingDocumentsHrPage,
  testInfo: import('@playwright/test').TestInfo,
) {
  if (await onboardingHr.hasRejectableDocument()) {
    return saved;
  }

  console.log(`${saved.email} has no document available to reject; looking for a Documents Submitted trainee`);
  await trainees.goToTraineesList();
  const submitted = await trainees.findDocumentsSubmittedTrainee();
  if (submitted) {
    console.log(`Using Documents Submitted trainee ${submitted.email}`);
    saveLastTrainee(submitted);
    await openSavedTraineeProfile(trainees, submitted);
    await onboardingHr.openFromProfile();
    return submitted;
  }

  console.log('No Documents Submitted trainee found; creating and submitting a new one');
  return prepareSubmittedTrainee(page, trainees, onboardingHr, testInfo);
}

async function prepareSubmittedTrainee(
  page: import('@playwright/test').Page,
  trainees: ProspectiveTraineePage,
  onboardingHr: OnboardingDocumentsHrPage,
  testInfo: import('@playwright/test').TestInfo,
) {
  const { details, yopmail } = await requestDocumentsAndOpenMail(page);
  const requestSubject = await yopmail.waitForMailSubject(`${details.firstName} ${details.lastName}`);
  const credentials = await yopmail.readCredentials();
  saveLastTrainee({ ...details, username: credentials.username, password: credentials.password });

  const onboardingPage = await yopmail.openOnboardingPortal();
  const preOnboarding = new PreOnboardingPage(onboardingPage);
  await preOnboarding.expectLoaded();
  await preOnboarding.login(credentials.username, credentials.password);
  await preOnboarding.expectLoggedIn();
  await preOnboarding.goToApplication();

  const application = new OnboardingApplicationPage(onboardingPage);
  if (!(await application.isOnDocumentsPage())) {
    if (await application.genderCombobox.isVisible({ timeout: 5000 }).catch(() => false)) {
      await application.fillMandatoryIndianDetails(details.firstName, details.lastName);
    }
    await application.goToDocumentsIfNeeded();
  }
  const files = createOnboardingFiles(testInfo.outputDir);
  await application.uploadMissingDocuments(files.pdf, files.image);
  await application.submitAndExpectLogout(preOnboarding.usernameInput);
  await yopmail.waitForNewMail(`${details.firstName} ${details.lastName}`, requestSubject);

  await page.bringToFront();
  await trainees.goToTraineesList();
  await openSavedTraineeProfile(trainees, details);
  await onboardingHr.openFromProfile();
  return details;
}

async function openSavedTraineeProfile(
  trainees: ProspectiveTraineePage,
  saved: SavedTrainee,
) {
  await trainees.searchTrainee(saved.email);
  let row = trainees.traineeRow(saved.email);
  if (!(await row.isVisible({ timeout: 8000 }).catch(() => false))) {
    await trainees.searchTrainee(saved.firstName);
    row = trainees.traineeRow(saved.email);
  }
  await expect(row).toBeVisible({ timeout: 15000 });
  await trainees.openTraineeProfile(saved);
}

async function requestDocumentsAndOpenMail(page: import('@playwright/test').Page) {
  const trainees = new ProspectiveTraineePage(page);
  await trainees.openTraineesList();

  const saved = loadLastTrainee();
  if (saved) {
    const reused = await tryReuseTrainee(page, trainees, saved);
    if (reused) {
      return reused;
    }
    console.log(`Could not reuse ${saved.email}; creating a new trainee`);
  }

  const details = ProspectiveTraineePage.uniqueTrainee();
  await trainees.openAddForm();
  await trainees.fillAndSubmit(details);
  await trainees.expectTraineeVisibleInList(details);
  saveLastTrainee(details);

  await trainees.openEmployeeCreated(details);
  await requestDocumentsFromProfile(page);

  const mailTab = await page.context().newPage();
  const yopmail = new YopmailPage(mailTab);
  await yopmail.openInbox(details.email);
  return { details, yopmail, mailTab, reused: false };
}

async function tryReuseTrainee(
  page: import('@playwright/test').Page,
  trainees: ProspectiveTraineePage,
  saved: SavedTrainee,
) {
  await trainees.searchTrainee(saved.email);
  const row = trainees.traineeRow(saved.email);
  if (!(await row.isVisible({ timeout: 8000 }).catch(() => false))) {
    return null;
  }

  const rowText = await row.innerText();
  if (!isTraineeReusable(rowText)) {
    console.log(`Saved trainee is already completed (${rowText.replace(/\s+/g, ' ').trim()})`);
    return null;
  }

  console.log(`Reusing trainee ${saved.email}`);
  if (needsDocumentRequest(rowText)) {
    await trainees.openEmployeeCreated(saved);
    await requestDocumentsFromProfile(page);
  }

  const mailTab = await page.context().newPage();
  const yopmail = new YopmailPage(mailTab);
  await yopmail.openInbox(saved.email);
  return { details: saved, yopmail, mailTab, reused: true };
}

async function requestDocumentsFromProfile(page: import('@playwright/test').Page) {
  const myInfo = new EmployeeMyInfoPage(page);
  await myInfo.expectBasicTab();
  const successText = await myInfo.requestDocuments();
  expect(successText).toContain('Email has been sent');
}
