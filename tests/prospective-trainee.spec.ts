import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProspectiveTraineePage } from '../pages/ProspectiveTraineePage';
import { EmployeeMyInfoPage } from '../pages/EmployeeMyInfoPage';
import { YopmailPage } from '../pages/YopmailPage';
import { PreOnboardingPage } from '../pages/PreOnboardingPage';
import { OnboardingApplicationPage } from '../pages/OnboardingApplicationPage';
import { OnboardingDocumentsHrPage } from '../pages/OnboardingDocumentsHrPage';
import { TraineeOfferLetterPage } from '../pages/TraineeOfferLetterPage';
import { TraineeOnboardingApprovalsPage } from '../pages/TraineeOnboardingApprovalsPage';
import { TraineeActivationPage } from '../pages/TraineeActivationPage';
import { createOnboardingFiles } from './fixtures/onboardingFiles';
import { loadLastTrainee, saveLastTrainee, type SavedTrainee } from './fixtures/lastTrainee';

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

  test.describe('Single trainee journey', () => {
    test.describe.configure({ mode: 'serial' });

    test('Test-02: New trainee creation', async ({ page }) => {
      const trainees = new ProspectiveTraineePage(page);
      const details = ProspectiveTraineePage.uniqueTrainee();

      await trainees.openTraineesList();
      await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/);

      await trainees.openAddForm();
      await trainees.fillAndSubmit(details);

      await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/, { timeout: 20000 });
      await trainees.expectTraineeVisibleInList(details);
      const employeeId = await trainees.readEmployeeId(details.email);
      saveLastTrainee({ ...details, employeeId });
    });

    test('Test-03: Request, submit, reject, re-request, and re-upload documents', async ({ page }, testInfo) => {
      test.setTimeout(480000);
      const saved = requireSavedTrainee();
      const trainees = new ProspectiveTraineePage(page);
      await trainees.openTraineesList();
      await trainees.searchTrainee(saved.email);
      const created = trainees.employeeCreatedRow(saved.email);
      if (await created.isVisible({ timeout: 8000 }).catch(() => false)) {
        await trainees.openEmployeeCreated(saved);
      } else {
        await openSavedTraineeProfile(trainees, saved);
      }

      const myInfo = new EmployeeMyInfoPage(page);
      if (await myInfo.requestDocumentsButton.isVisible({ timeout: 8000 }).catch(() => false)) {
        await myInfo.expectBasicTab();
        const successText = await myInfo.requestDocuments();
        expect(successText).toContain('Email has been sent');
      }

      const mailTab = await page.context().newPage();
      const yopmail = new YopmailPage(mailTab);
      await yopmail.openInbox(saved.email);
      const requestSubject = await yopmail.waitForMailSubject(`${saved.firstName} ${saved.lastName}`);
      const credentials = saved.username && saved.password
        ? { username: saved.username, password: saved.password }
        : await yopmail.readCredentials();
      saveLastTrainee({ ...saved, username: credentials.username, password: credentials.password });

      const onboardingPage = await yopmail.openOnboardingPortal();
      const preOnboarding = new PreOnboardingPage(onboardingPage);
      await preOnboarding.expectLoaded();
      await preOnboarding.login(credentials.username, credentials.password);
      await preOnboarding.expectLoggedIn();
      await preOnboarding.goToApplication();

      const application = new OnboardingApplicationPage(onboardingPage);
      if (!(await application.isOnDocumentsPage())) {
        await application.expectPersonalForm();
        await application.expectInvalidNameRejected(saved.firstName);
        await application.expectInvalidMobileRejected();
        await application.fillMandatoryIndianDetails(saved.firstName, saved.lastName);
        await application.goToDocuments();
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
      await yopmail.waitForNewMail(`${saved.firstName} ${saved.lastName}`, requestSubject);

      await page.bringToFront();
      await trainees.goToTraineesList();
      await openSavedTraineeProfile(trainees, saved);
      const onboardingHr = new OnboardingDocumentsHrPage(page);
      await onboardingHr.openFromProfile();
      const rejectedDoc = await onboardingHr.rejectOneDocument('The uploaded document is not valid.');
      await onboardingHr.reRequestDocuments('Please re-upload the rejected documents.');

      await yopmail.page.bringToFront();
      const rerequestSubject = await yopmail.waitForRerequestMail(
        `${saved.firstName} ${saved.lastName}`,
        requestSubject,
      );
      expect(rerequestSubject.length).toBeGreaterThan(0);
      const rerequestShot = testInfo.outputPath('yopmail-rerequest-documents.png');
      await yopmail.screenshotMail(rerequestShot);
      await testInfo.attach('yopmail-rerequest-documents', { path: rerequestShot, contentType: 'image/png' });

      const reuploadPage = await yopmail.openOnboardingPortal();
      const reuploadPortal = new PreOnboardingPage(reuploadPage);
      await reuploadPortal.expectLoaded();
      await reuploadPortal.login(credentials.username, credentials.password);
      await reuploadPortal.expectLoggedIn();
      await reuploadPortal.goToApplication();
      const reuploadApp = new OnboardingApplicationPage(reuploadPage);
      await reuploadApp.goToDocumentsIfNeeded();
      await reuploadApp.reUploadRejectedDocuments(files.pdf, files.image);
      await reuploadApp.submitAndExpectLogout(reuploadPortal.usernameInput);
      await yopmail.waitForNewMail(`${saved.firstName} ${saved.lastName}`, rerequestSubject);
      saveLastTrainee({ ...saved, username: credentials.username, password: credentials.password, rejectedDoc });
    });

    test('Test-04: Verify onboarding documents for the same trainee', async ({ page }) => {
      test.setTimeout(180000);
      const saved = requireSavedTrainee();
      const trainees = new ProspectiveTraineePage(page);
      await trainees.openTraineesList();
      await openSavedTraineeProfile(trainees, saved);

      const onboardingHr = new OnboardingDocumentsHrPage(page);
      await onboardingHr.openFromProfile();
      await onboardingHr.verifyPendingDocuments();

      await trainees.goToTraineesList();
      await trainees.searchTrainee(saved.email);
      await trainees.expectStatus(saved.email, /Documents Verified/i);
    });

    test('Test-05: Generate offer letter, reject it, then approve it', async ({ page }) => {
      test.setTimeout(300000);
      const saved = requireSavedTrainee();
      const trainees = new ProspectiveTraineePage(page);
      await trainees.openTraineesList();

      const offer = new TraineeOfferLetterPage(page);
      await offer.openFromTraineesList();
      await offer.selectEmployee(saved);
      await offer.fillRequiredDetails();
      await offer.generate();
      await offer.requestApproval();

      const approvals = new TraineeOnboardingApprovalsPage(page);
      await approvals.openTraineeOfferLetters();
      await approvals.rejectOffer(saved, 'Offer details need correction.');

      await trainees.openTraineesList();
      await offer.openFromTraineesList();
      await offer.selectEmployee(saved);
      await offer.fillRequiredDetails();
      await offer.generate();
      await offer.requestApproval();

      await approvals.openTraineeOfferLetters();
      await approvals.approveOffer(saved);

      await trainees.openTraineesList();
      await trainees.searchTrainee(saved.email);
      await trainees.expectStatus(saved.email, /Offer Letter (Released|Approved|Generated|Regenerated)/i);
    });

    test('Test-06: Activate trainee and continue onboard request', async ({ page }) => {
      test.setTimeout(180000);
      const saved = requireSavedTrainee();
      const trainees = new ProspectiveTraineePage(page);
      await trainees.openTraineesList();
      await openSavedTraineeProfile(trainees, saved);

      const activation = new TraineeActivationPage(page);
      await activation.openOnboardingInfo();
      await activation.activate();
      await activation.continueOnboardRequest();

      await trainees.goToTraineesList();
      await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/);
      await expect(trainees.addProspectiveTraineeButton).toBeVisible();
    });
  });
});

function requireSavedTrainee(): SavedTrainee {
  const saved = loadLastTrainee();
  test.skip(!saved, 'No saved trainee. Run Test-02 first.');
  return saved!;
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
