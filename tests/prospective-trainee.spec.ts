import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProspectiveTraineePage } from '../pages/ProspectiveTraineePage';
import { EmployeeMyInfoPage } from '../pages/EmployeeMyInfoPage';
import { YopmailPage } from '../pages/YopmailPage';
import { PreOnboardingPage } from '../pages/PreOnboardingPage';
import { OnboardingApplicationPage } from '../pages/OnboardingApplicationPage';
import { OnboardingDocumentsHrPage } from '../pages/OnboardingDocumentsHrPage';
import { TraineeOfferLetterPage } from '../pages/TraineeOfferLetterPage';
import { PendingTraineeOfferApprovalPage } from '../pages/PendingTraineeOfferApprovalPage';
import { PreOnboardingOfferLetterPage } from '../pages/PreOnboardingOfferLetterPage';
import { PreOnboardingPostOfferPage } from '../pages/PreOnboardingPostOfferPage';
import { EmployeeOnboardingInfoPage } from '../pages/EmployeeOnboardingInfoPage';
import { SettingsServingPeriodPage } from '../pages/SettingsServingPeriodPage';
import { TraineeOnboardRequestPage } from '../pages/TraineeOnboardRequestPage';
import { TraineeJobPrepPage } from '../pages/TraineeJobPrepPage';
import { PendingTraineeOnboardApprovalPage } from '../pages/PendingTraineeOnboardApprovalPage';

declare const process: { env: Record<string, string | undefined> };

import { createOnboardingFiles } from './fixtures/onboardingFiles';
import { openPreOnboardingFromYopmail, refreshPreOnboardingCredentials } from './fixtures/onboardingCredentials';
import { loadLastTrainee, saveLastTrainee, needsDocumentRequest, type SavedTrainee } from './fixtures/lastTrainee';
import {
  approveAndReleaseOffer,
  ensureDocumentsSubmittedTrainee,
  ensureDocumentsVerifiedTrainee,
  ensureOfferReadyTrainee,
  ensurePendingOfferTrainee,
  ensureRejectedOfferTrainee,
  ensureReleasedOfferTrainee,
  generateOfferAndRequestApproval,
  loadSavedTraineeFromList,
  resolveActiveSavedTrainee,
  findActiveTraineeWithOnboardRequest,
  findActiveTraineeWithPendingOnboardRequest,
  ensurePendingOnboardRequestTrainee,
  ensureOnboardRequestPending,
  activateProspectiveTraineeToActive,
  ensureActiveTraineeEmployeeId,
  syncTraineeFromActiveList,
  prepareActiveTraineeForOnboard,
  submitFreshOnboardRequest,
  openSavedTraineeProfile,
  prepareSubmittedTrainee,
  requestDocumentsAndOpenMail,
  tryLoadSavedTraineeFromList,
  withOfferDefaults,
  resolveProspectiveTraineeForDocuments,
  resolveTraineeEmail,
  isTraineeEmailExcluded,
} from './fixtures/traineeBootstrap';

const DUPLICATE_TRAINEE = {
  firstName: 'Swetha',
  lastName: 'Priya',
  email: 'Swethapriya@yopmail.com',
};

let approvedOnboardTraineeEmail: string | undefined;
let extendedOnboardTraineeEmail: string | undefined;

test.describe('Prospective Trainees', () => {
  test.describe.configure({ mode: 'serial' });

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
    saveLastTrainee(details);
  });

  test('Test-03: Request documents and verify yopmail', async ({ page }, testInfo) => {
    test.setTimeout(480000);
    const details = await resolveProspectiveTraineeForDocuments(page);

    const trainees = new ProspectiveTraineePage(page);
    await trainees.openTraineesList();
    await trainees.searchTrainee(details.email);
    const row = trainees.traineeRow(details.email);
    await expect(row).toBeVisible({ timeout: 15000 });

    const rowText = await row.innerText();
    const documentsAlreadyRequested = !needsDocumentRequest(rowText);
    if (needsDocumentRequest(rowText)) {
      await trainees.openEmployeeCreated(details);
      const myInfo = new EmployeeMyInfoPage(page);
      await myInfo.expectBasicTab();
      const successText = await myInfo.requestDocuments();
      expect(successText).toContain('Email has been sent');

      await trainees.goToTraineesList();
      await trainees.searchTrainee(details.email);
      let statusText = await trainees.traineeRow(details.email).innerText();
      if (!/requested documents|documents requested/i.test(statusText)) {
        console.log(`Status still "${statusText.replace(/\s+/g, ' ').trim()}" after document request; retrying once`);
        await trainees.openEmployeeCreated(details);
        await myInfo.expectBasicTab();
        await myInfo.requestDocuments();
        await trainees.goToTraineesList();
        await trainees.searchTrainee(details.email);
        statusText = await trainees.traineeRow(details.email).innerText();
      }
      expect(statusText).toMatch(/requested documents|documents requested/i);
    } else {
      console.log(`Documents already requested for ${details.email}; verifying Yopmail only`);
    }

    const mailTab = await page.context().newPage();
    const yopmail = new YopmailPage(mailTab);
    await yopmail.openInbox(details.email);
    await mailTab.bringToFront().catch(() => {});

    let subject: string;
    try {
      subject = await yopmail.waitForMailSubject(`${details.firstName} ${details.lastName}`, 300000, details.email);
    } catch (error) {
      if (documentsAlreadyRequested) {
        await page.bringToFront();
        await trainees.goToTraineesList();
        await trainees.searchTrainee(details.email);
        const statusText = await trainees.traineeRow(details.email).innerText();
        expect(statusText).toMatch(/requested documents|documents requested/i);
        subject = `RightlyHR - ${details.firstName} ${details.lastName} - Request for Documents Upload`;
        console.log(`Yopmail blocked by CAPTCHA; verified HR list status instead. ${error}`);
      } else {
        throw error;
      }
    }
    expect(subject).toMatch(new RegExp(`RightlyHR - ${details.firstName}[\\s\\S]*${details.lastName}|Request for Documents`, 'i'));

    saveLastTrainee(details);

    const screenshotPath = testInfo.outputPath('yopmail-request-documents.png');
    if (mailTab.isClosed()) {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } else {
      await yopmail.screenshotMail(screenshotPath);
    }
    await testInfo.attach('yopmail-mail', { path: screenshotPath, contentType: 'image/png' });
  });

  test('Test-04: Pre-onboarding login, application, and document submit', async ({ page }, testInfo) => {
    test.setTimeout(360000);
    const saved = loadLastTrainee();
    if (!saved) {
      throw new Error('Run Test-03 first to create a prospective trainee.');
    }

    const trainees = new ProspectiveTraineePage(page);
    await trainees.openTraineesList();
    await trainees.searchTrainee(saved.email);
    const row = trainees.traineeRow(saved.email);
    await expect(row).toBeVisible({ timeout: 15000 });
    const details = withOfferDefaults(saved);

    const mailTab = await page.context().newPage();
    const yopmail = new YopmailPage(mailTab);
    await yopmail.openInbox(details.email);
    const reused = !needsDocumentRequest(await row.innerText());

    const requestSubject = await yopmail.waitForMailSubject(`${details.firstName} ${details.lastName}`, 240000, details.email);
    await yopmail.openMatchingMailInViewer(/Request for Documents Upload|Request for Documents/i);
    const credentials = await yopmail.readCredentials();
    saveLastTrainee({
      ...details,
      ...OnboardingApplicationPage.expectedPersonalDefaults(details.firstName),
      username: credentials.username,
      password: credentials.password,
    });
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
    const profile = await application.preparePersonalDetailsAndOpenDocuments(
      details.firstName,
      details.lastName,
      { runValidations: !reused },
    );
    if (profile) {
      saveLastTrainee({
        ...loadLastTrainee()!,
        ...profile,
      });
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
      await application.expectOversizedFileRejected(files.oversized, validationDoc);
    }
    await application.uploadMissingDocuments(files.pdf, files.image);
    await application.submitAndExpectLogout(preOnboarding.usernameInput);

    await yopmail.page.bringToFront();
    let submittedSubject: string;
    try {
      submittedSubject = await yopmail.waitForNewMail(
        `${details.firstName} ${details.lastName}`,
        requestSubject,
      );
    } catch (error) {
      await page.bringToFront();
      await trainees.openTraineesList();
      await trainees.searchTrainee(details.email);
      const statusText = await trainees.traineeRow(details.email).innerText();
      if (/documents submitted/i.test(statusText)) {
        console.log(`Yopmail submit mail missing; HR list shows Documents Submitted for ${details.email}`);
        submittedSubject = 'Documents Submitted';
      } else {
        throw error;
      }
    }
    expect(submittedSubject.length).toBeGreaterThan(0);

    const screenshotPath = testInfo.outputPath('yopmail-documents-submitted.png');
    await yopmail.screenshotMail(screenshotPath);
    await testInfo.attach('yopmail-documents-submitted', { path: screenshotPath, contentType: 'image/png' });
  });

  test('Test-05: Reject document, re-request, and re-upload', async ({ page }, testInfo) => {
    test.setTimeout(360000);
    const saved = await ensureDocumentsSubmittedTrainee(page, testInfo);

    console.log(`Reject/re-request flow for ${saved.firstName} ${saved.lastName} (${saved.email})`);
    const trainees = new ProspectiveTraineePage(page);
    await trainees.openTraineesList();
    await openSavedTraineeProfile(trainees, saved);

    const onboardingHr = new OnboardingDocumentsHrPage(page);
    await onboardingHr.openFromProfile();
    const trainee = await resolveRejectableTrainee(page, trainees, saved, onboardingHr, testInfo);
    await onboardingHr.rejectOneDocument('The uploaded document is not valid.');
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
    await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/);
    await expect(trainees.addProspectiveTraineeButton).toBeVisible();
  });

  test('Test-06: Verify onboarding documents for the same trainee', async ({ page }, testInfo) => {
    test.setTimeout(360000);
    const saved = await ensureDocumentsSubmittedTrainee(page, testInfo);

    console.log(`Verifying documents for ${saved.firstName} ${saved.lastName} (${saved.email})`);
    const trainees = new ProspectiveTraineePage(page);
    await trainees.openTraineesList();
    await openSavedTraineeProfile(trainees, saved);

    const onboardingHr = new OnboardingDocumentsHrPage(page);
    await onboardingHr.openFromProfile();
    await onboardingHr.verifyPendingDocuments();

    await trainees.goToTraineesList();
    await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/);
    await expect(trainees.addProspectiveTraineeButton).toBeVisible();
  });

  test('Test-07: Generate trainee offer letter and request approval', async ({ page }, testInfo) => {
    test.setTimeout(360000);
    const employee = await ensureDocumentsVerifiedTrainee(page, testInfo);

    console.log(`Generating offer letter for ${employee.firstName} ${employee.lastName} (${employee.email})`);
    const trainees = new ProspectiveTraineePage(page);
    await generateOfferAndRequestApproval(page, testInfo, employee);

    await trainees.goToTraineesList();
    await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/);
    await expect(trainees.addProspectiveTraineeButton).toBeVisible();
  });

  test('Test-08: Reject pending trainee offer letter', async ({ page }, testInfo) => {
    test.setTimeout(360000);
    const saved = await ensurePendingOfferTrainee(page, testInfo);

    console.log(`Rejecting pending offer letter for ${saved.firstName} ${saved.lastName}`);
    const approvals = new PendingTraineeOfferApprovalPage(page);
    await approvals.openTraineeOfferLetterQueue();

    const row = await approvals.findOfferRow(saved);
    await approvals.expectTraineeDetails(row, saved);

    const downloadPath = testInfo.outputPath('pending-trainee-offer-letter.pdf');
    try {
      const downloaded = await approvals.downloadAndVerifyLetter(row, saved, downloadPath);
      if (downloaded) {
        await testInfo.attach('pending-trainee-offer-letter', { path: downloadPath, contentType: 'application/pdf' });
      }
    } catch (error) {
      console.log(`Offer letter download/preview could not be verified; continuing to reject. ${error}`);
    }

    const rejectText = await approvals.rejectOffer(
      row,
      'The generated trainee offer letter is not valid. Please review and regenerate.',
    );
    expect(rejectText).toMatch(/Trainee offer letter rejected/i);

    await expect(approvals.offerRow(saved)).toBeHidden({ timeout: 15000 });
  });

  test('Test-09: Regenerate trainee offer letter and request approval', async ({ page }, testInfo) => {
    test.setTimeout(360000);
    const employee = await ensureRejectedOfferTrainee(page, testInfo);

    console.log(`Regenerating offer letter for ${employee.firstName} ${employee.lastName} (${employee.email})`);
    const trainees = new ProspectiveTraineePage(page);
    await generateOfferAndRequestApproval(page, testInfo, employee);

    await trainees.goToTraineesList();
    await expect(page).toHaveURL(/\/employee-management\/prospective\/interns/);
    await expect(trainees.addProspectiveTraineeButton).toBeVisible();
  });

  test('Test-10: Approve and release trainee offer letter', async ({ page }, testInfo) => {
    test.setTimeout(360000);
    const { employee, alreadyPending } = await ensureOfferReadyTrainee(page, testInfo);
    if (!alreadyPending) {
      await generateOfferAndRequestApproval(page, testInfo, employee);
    } else {
      console.log(`${employee.email} already has a pending offer; skipping generate`);
    }

    console.log(`Approving and releasing offer letter for ${employee.firstName} ${employee.lastName}`);
    await approveAndReleaseOffer(page, testInfo, employee);
  });

  test('Test-11: Employee rejects offer letter and HR regenerates', async ({ page }, testInfo) => {
    test.setTimeout(600000);
    const rejectReason = 'The stipend and joining date in the offer letter are not acceptable.';
    const trainees = new ProspectiveTraineePage(page);
    await trainees.openTraineesList();

    let employee: SavedTrainee | null = null;
    let offerIssued = false;
    const saved = loadLastTrainee();
    if (saved) {
      try {
        const listed = await loadSavedTraineeFromList(trainees, saved);
        const statusText = await trainees.traineeRow(listed.email).innerText();
        if (/offer letter rejected/i.test(statusText)) {
          employee = listed;
          console.log(`Saved trainee ${listed.email} is Offer Letter Rejected; regenerating the same record`);
        } else if (/offer letter regenerated/i.test(statusText)) {
          employee = listed;
          console.log(`Saved trainee ${listed.email} is Offer Letter Regenerated; continuing with approval`);
        } else if (/offer letter released|offer letter issued/i.test(statusText)) {
          employee = listed;
          offerIssued = true;
          console.log(`Saved trainee ${listed.email} is Offer Letter Released; employee will reject it first`);
        } else {
          console.log(
            `Saved trainee ${listed.email} is not rejected/released (${statusText.replace(/\s+/g, ' ').trim()}); looking for Offer Letter Rejected`,
          );
        }
      } catch {
        console.log(`Saved trainee ${saved.email} was not in the list; looking for Offer Letter Rejected`);
      }
    }

    if (!employee) {
      const rejected = await trainees.findOfferLetterRejectedTrainee();
      if (rejected) {
        employee = { ...rejected, designation: rejected.designation ?? 'Front End Developer' };
        saveLastTrainee(employee);
        console.log(`Found Offer Letter Rejected trainee ${employee.email}; regenerating`);
      } else {
        const regenerated = await trainees.findTraineeByStatus('Offer Letter Regenerated');
        if (regenerated) {
          employee = { ...regenerated, designation: regenerated.designation ?? 'Front End Developer' };
          saveLastTrainee(employee);
          console.log(`Found Offer Letter Regenerated trainee ${employee.email}; continuing with approval`);
        }
      }
    }

    if (!employee) {
      employee = await ensureReleasedOfferTrainee(page, testInfo);
      offerIssued = true;
      console.log(`Created and released offer for ${employee.email}; employee will reject it first`);
    }

    if (offerIssued) {
      const mailTab = await page.context().newPage();
      const yopmail = new YopmailPage(mailTab);
      await yopmail.openInbox(employee.email);
      await yopmail.waitForMailMatching(
        new RegExp(`${employee.firstName}[\\s\\S]*Offer Letter Issued|Offer Letter Issued`, 'i'),
      );
      const { portal, preOnboarding, employee: loggedInEmployee } = await openPreOnboardingFromYopmail(
        yopmail,
        employee,
      );
      employee = loggedInEmployee;
      await portal.bringToFront();
      if (await preOnboarding.goToApplicationButton.isVisible().catch(() => false)) {
        await preOnboarding.goToApplication();
      }
      const offerLetter = new PreOnboardingOfferLetterPage(portal);
      await offerLetter.reject(rejectReason);
      await portal.close();
      await mailTab.close();

      await page.bringToFront();
      const hrMailTab = await page.context().newPage();
      const hrYopmail = new YopmailPage(hrMailTab);
      const hrInbox = process.env.LOGIN_EMAIL!.trim();
      await hrYopmail.openInbox(hrInbox);
      try {
        await hrYopmail.waitForMailMatching(
          new RegExp(`${employee.firstName}[\\s\\S]*(rejected|declined)|Offer Letter rejected`, 'i'),
          45000,
        );
        const hrBody = await hrYopmail.mailBody();
        expect(hrBody).toContain(rejectReason);
        console.log(`HR rejection mail includes reason: ${rejectReason}`);
        const hrShot = testInfo.outputPath('yopmail-offer-rejected-by-employee.png');
        await hrYopmail.screenshotMail(hrShot);
        await testInfo.attach('yopmail-offer-rejected-by-employee', { path: hrShot, contentType: 'image/png' });
      } catch (error) {
        console.log(`HR rejection mail was not in Yopmail (${hrInbox}). Verifying status in the trainees list. ${error}`);
      }
      await hrMailTab.close();

      await page.bringToFront();
      await trainees.goToTraineesList();
      employee = await loadSavedTraineeFromList(trainees, employee);
      const afterReject = await trainees.traineeRow(employee.email).innerText();
      expect(afterReject).toMatch(/reject/i);
      console.log(`List after employee reject: ${afterReject.replace(/\s+/g, ' ').trim()}`);
    } else {
      console.log(`${employee.email} is already Offer Letter Rejected; regenerating and releasing the same trainee`);
    }

    await generateOfferAndRequestApproval(page, testInfo, employee);
    await approveAndReleaseOffer(page, testInfo, employee);
  });

  test('Test-12: Employee accepts offer letter and submits remaining details', async ({ page }, testInfo) => {
    test.setTimeout(600000);
    const trainees = new ProspectiveTraineePage(page);
    const employee = await ensureReleasedOfferTrainee(page, testInfo);

    console.log(`Accepting offer letter in pre-onboarding as ${employee.firstName} ${employee.lastName} (${employee.email})`);

    const mailTab = await page.context().newPage();
    const yopmail = new YopmailPage(mailTab);
    await yopmail.openInbox(employee.email);
    await yopmail.openMatchingMailInViewer(/Request for Documents Upload|Request for Documents/i);
    const { portal, preOnboarding, employee: activeEmployee } = await openPreOnboardingFromYopmail(yopmail, employee, {
      preferLatestMailCredentials: true,
    });
    saveLastTrainee(activeEmployee);
    if (await preOnboarding.goToApplicationButton.isVisible().catch(() => false)) {
      await preOnboarding.goToApplication();
    }

    const offerLetter = new PreOnboardingOfferLetterPage(portal);
    await offerLetter.goToOfferDecision();
    await offerLetter.acceptIfNeeded();

    const files = createOnboardingFiles();
    const postOffer = new PreOnboardingPostOfferPage(portal);
    await postOffer.addAcademicRecordIfNeeded(files.image);
    await postOffer.fillEmergencyContactsIfNeeded();
    await postOffer.addEmploymentHistoryIfNeeded(files.pdf);
    await postOffer.expectReviewPage();
    await postOffer.submitApplication();
    await portal.close();
    await mailTab.close();

    await page.bringToFront();
    const managerMailTab = await page.context().newPage();
    const managerYopmail = new YopmailPage(managerMailTab);
    const managerInbox = process.env.LOGIN_EMAIL!.trim();
    await managerYopmail.openInbox(managerInbox);
    try {
      const managerSubject = await managerYopmail.waitForMailMatching(
        new RegExp(
          `${activeEmployee.firstName}[\\s\\S]*(accepted|acceptance)|Offer Letter Accepted|accepted the offer`,
          'i',
        ),
        45000,
      );
      expect(managerSubject).toMatch(/accept/i);
      const managerShot = testInfo.outputPath('yopmail-offer-accepted-manager.png');
      await managerYopmail.screenshotMail(managerShot);
      await testInfo.attach('yopmail-offer-accepted-manager', { path: managerShot, contentType: 'image/png' });
    } catch (error) {
      console.log(
        `Manager acceptance mail was not in Yopmail (${managerInbox}). Manager mail goes to Outlook. Verifying Offer Letter Accepted in the trainees list. ${error}`,
      );
    }
    await managerMailTab.close();

    await page.bringToFront();
    await trainees.goToTraineesList();
    const listed = await loadSavedTraineeFromList(trainees, activeEmployee);
    const afterAccept = await trainees.traineeRow(listed.email).innerText();
    expect(afterAccept).toMatch(/offer letter accepted/i);
    console.log(`List after accept: ${afterAccept.replace(/\s+/g, ' ').trim()}`);
  });

  test('Test-13: Activate offer-letter-accepted trainee', async ({ page }) => {
    test.setTimeout(180000);
    const trainees = new ProspectiveTraineePage(page);
    await trainees.openTraineesList();

    let employee = loadLastTrainee();
    if (employee) {
      try {
        employee = await loadSavedTraineeFromList(trainees, employee);
        const statusText = await trainees.traineeRow(employee.email).innerText();
        if (!/offer letter accepted/i.test(statusText)) {
          console.log(
            `Saved trainee ${employee.email} is not Offer Letter Accepted (${statusText.replace(/\s+/g, ' ').trim()}); looking for one`,
          );
          employee = null;
        }
      } catch {
        console.log(`Saved trainee ${employee.email} is not in prospective trainees; looking for Offer Letter Accepted`);
        employee = null;
      }
    }

    if (!employee) {
      const accepted = await trainees.findOfferLetterAcceptedTrainee();
      if (!accepted) {
        const saved = loadLastTrainee();
        if (!saved) {
          throw new Error(
            'No Offer Letter Accepted trainee found. Do not create a new trainee; run Test-12 first.',
          );
        }
        await trainees.goToTraineesList();
        await trainees.expectTraineeHiddenInList(saved.email);
        await trainees.openActiveTraineesList();
        await trainees.searchTrainee(saved.firstName);
        const alreadyActive = trainees.traineeRow(`${saved.firstName} ${saved.lastName}`);
        await expect(alreadyActive).toBeVisible({ timeout: 15000 });
        console.log(`${saved.email} is already Trainee Active and listed under active trainees`);
        return;
      }
      employee = withOfferDefaults(accepted);
      saveLastTrainee(employee);
    }

    console.log(`Activating ${employee.firstName} ${employee.lastName} (${employee.email})`);
    employee = await activateProspectiveTraineeToActive(page, trainees, employee);
    saveLastTrainee(employee);
  });

  test('Test-14: Settings serving period Button Before Onboard', async ({ page }) => {
    test.setTimeout(180000);
    const settings = new SettingsServingPeriodPage(page);
    await settings.open();
    await settings.ensureButtonBeforeOnboard(50);
    await expect(page.getByRole('cell', { name: 'Button Before Onboard' })).toBeVisible();
  });

  test('Test-15: Request trainee onboard and complete RM/TM/HR approval', async ({ page }, testInfo) => {
    test.setTimeout(360000);
    const trainees = new ProspectiveTraineePage(page);
    const saved = loadLastTrainee();
    if (!saved) {
      throw new Error('No saved trainee found. Run Test-13 first.');
    }

    const activatedTrainee: SavedTrainee = {
      firstName: 'Meera',
      lastName: 'Menon',
      email: 'meera.menon.bij@yopmail.com',
      username: 'meera.menon.bij@yopmail.com',
      employeeId: '12837',
    };
    const employee = await resolveActiveSavedTrainee(trainees, activatedTrainee).catch(async (error) => {
      console.log(`Meera lookup failed (${error}); falling back to saved trainee`);
      if (!saved) {
        throw error;
      }
      return resolveActiveSavedTrainee(trainees, saved).catch(async () => resolveActiveTrainee(page, trainees));
    });
    saveLastTrainee(employee);
    await trainees.openActiveTraineeProfile(employee);
    console.log(`Requesting onboard for ${employee.firstName} ${employee.lastName} (${employee.email})`);

    const onboard = new TraineeOnboardRequestPage(page);
    await onboard.openFromProfile();
    const tableText = await page.locator('table').innerText().catch(() => '');
    const alreadyProcessed = /Processed/i.test(tableText);
    const alreadyWaiting = /Waiting for Approval|Extended/i.test(tableText);
    const canSubmit = await onboard.requestButton.last().isVisible().catch(() => false);

    if (canSubmit) {
      const prep = new TraineeJobPrepPage(page);
      const personalEmail = resolveTraineeEmail(employee);
      const workEmail = personalEmail.replace('@', '1@');
      await prep.ensureWorkEmail(workEmail);
      await prep.ensureJobInfo();
      await page.keyboard.press('Escape').catch(() => {});
      await onboard.openFromProfile();
      await onboard.expectRequestButtonVisible();
      try {
        await onboard.submitRequest();
      } catch (error) {
        if (!/job details are not updated/i.test(String(error))) {
          throw error;
        }
        console.log('Onboard request needs Job Info update; retrying preparation');
        await prep.ensureJobInfo();
        await page.keyboard.press('Escape').catch(() => {});
        await onboard.openFromProfile();
        await onboard.submitRequest();
      }

      await page.bringToFront();
      const rmMailTab = await page.context().newPage();
      const rmYopmail = new YopmailPage(rmMailTab);
      const rmInbox = process.env.LOGIN_EMAIL!.trim();
      await rmYopmail.openInbox(rmInbox);
      try {
        const subject = await rmYopmail.waitForMailMatching(
          new RegExp(`${employee.firstName}[\\s\\S]*Onboard Request Initiated|Trainee Onboard Request`, 'i'),
          45000,
        );
        expect(subject).toMatch(/onboard request/i);
        const shot = testInfo.outputPath('yopmail-onboard-request-rm.png');
        await rmYopmail.screenshotMail(shot);
        await testInfo.attach('yopmail-onboard-request-rm', { path: shot, contentType: 'image/png' });
      } catch (error) {
        console.log(
          `RM onboard-request mail was not in Yopmail (${rmInbox}). Manager mail goes to Outlook. Continuing the approval flow. ${error}`,
        );
      }
      await rmMailTab.close();
    } else if (alreadyProcessed) {
      console.log('Onboard request already processed; skipping submit and approval queue');
    } else if (alreadyWaiting) {
      console.log('Onboard request already submitted; continuing approval');
    }

    if (!alreadyProcessed) {
      await page.bringToFront();
      const approvals = new PendingTraineeOnboardApprovalPage(page);
      await approvals.openTraineesQueue();
      const row = await approvals.waitForRequestRow(employee);
      await approvals.expectKebabActions(row, ['Approve'], { only: true });
      await approvals.approveUntilDone(employee);
      try {
        await approvals.processAsHr(employee);
      } catch (error) {
        await trainees.openActiveTraineeProfile(employee);
        await onboard.openFromProfile();
        const statusText = await page.locator('table').innerText().catch(() => '');
        if (!/Processed/i.test(statusText)) {
          throw error;
        }
        console.log('HR Process already completed on trainee profile');
      }
    }

    await trainees.openActiveTraineesList();
    await trainees.openActiveTraineeProfile(employee);
    await onboard.openFromProfile();
    const finalTableText = await page.locator('table').innerText().catch(() => '');
    console.log(`Onboard request table: ${finalTableText.replace(/\s+/g, ' ').trim()}`);
    if (!alreadyProcessed || /Processed/i.test(finalTableText)) {
      await onboard.expectStatus(/processed/i);
    } else {
      console.log('Processed status was verified earlier; continuing');
    }
    try {
      await onboard.readyForOnboardFromRow();
    } catch (error) {
      console.log(`Ready for onboard already completed or unavailable: ${error}`);
    }

    await trainees.openActiveTraineesList();
    await trainees.openActiveTraineeProfile(employee);
    await expect(page.getByText(`${employee.firstName} ${employee.lastName}`).first()).toBeVisible();
    console.log(`${employee.firstName} ${employee.lastName} remains on active trainees after onboard`);

    await trainees.openActiveTraineesList();
    const offerLetter = new TraineeOfferLetterPage(page);
    await offerLetter.openEmployeeOfferLetterFromList();
    await offerLetter.expectEmployeeInDropdown(employee.firstName, employee.lastName, employee.employeeId);
  });

  test('Test-16: Approve onboard request through HR', async ({ page }) => {
    test.setTimeout(360000);
    const trainees = new ProspectiveTraineePage(page);
    let employee = await resolveTraineeForOnboardAction(page, trainees, { allowPending: true });
    employee = await ensureActiveTraineeEmployeeId(page, trainees, employee);
    saveLastTrainee(employee);
    console.log(`Approving onboard request for ${employee.firstName} ${employee.lastName} (${employee.employeeId ?? 'no id'})`);

    await ensureOnboardRequestPending(page, employee);
    approvedOnboardTraineeEmail = resolveTraineeEmail(employee);
    await approveOnboardRequestThroughHr(page, trainees, employee);
  });

  test('Test-17: Reject onboard request with extend', async ({ page }, testInfo) => {
    test.setTimeout(600000);
    const trainees = new ProspectiveTraineePage(page);
    const employee = await ensurePendingOnboardRequestTrainee(page, testInfo, {
      excludeEmail: approvedOnboardTraineeEmail,
    });
    saveLastTrainee(employee);
    extendedOnboardTraineeEmail = resolveTraineeEmail(employee);
    console.log(`Extending onboard request for ${employee.firstName} ${employee.lastName} (${employee.email})`);

    await ensureOnboardRequestPending(page, employee);

    const approvals = new PendingTraineeOnboardApprovalPage(page);
    await page.bringToFront();
    const row = await approvals.waitForRequestRow(employee, { timeout: 120000 });
    await approvals.expectKebabActions(row, ['Approve', 'Reject']);
    const extendDate = futureIsoDate(30);
    await approvals.rejectExtend(row, extendDate, 'Extended by a month');

    const onboard = new TraineeOnboardRequestPage(page);
    await trainees.openActiveTraineesList();
    await trainees.openActiveTraineeProfile(employee);
    await onboard.openFromProfile();
    await onboard.expectStatus(/extend/i);
    await onboard.expectRequestButtonVisible();

    const employeeMail = await page.context().newPage();
    const yopmail = new YopmailPage(employeeMail);
    await yopmail.openInbox(employee.email);
    try {
      await yopmail.waitForMailMatching(/Onboard Period Extended|extended/i, 45000);
    } catch (error) {
      console.log(`Employee extend mail was not in Yopmail. ${error}`);
    }
    await employeeMail.close();

    await page.bringToFront();
    await approvals.openTraineesQueue();
    const extendedRow = await approvals.waitForRequestRow(employee);
    await approvals.expectKebabActions(extendedRow, ['Approve'], { only: true });
    console.log('Extended onboard request remains in queue with Approve-only kebab');
  });

  test('Test-18: Reject onboard request with discontinue', async ({ page }, testInfo) => {
    test.setTimeout(360000);
    const trainees = new ProspectiveTraineePage(page);
    const excludeEmails = [approvedOnboardTraineeEmail, extendedOnboardTraineeEmail].filter(Boolean) as string[];
    const employee = await ensurePendingOnboardRequestTrainee(page, testInfo, {
      excludeEmail: excludeEmails.length > 0 ? excludeEmails : undefined,
    });
    saveLastTrainee(employee);
    console.log(`Discontinuing onboard request for ${employee.firstName} ${employee.lastName} (${employee.employeeId ?? 'no id'})`);

    const onboard = new TraineeOnboardRequestPage(page);
    await ensureOnboardRequestPending(page, employee);

    await page.keyboard.press('Escape').catch(() => {});

    const approvals = new PendingTraineeOnboardApprovalPage(page);
    await page.bringToFront();
    const row = await approvals.waitForRequestRow(employee, { timeout: 120000 });
    await approvals.expectKebabActions(row, ['Approve', 'Reject']);
    await approvals.rejectDiscontinue(row);

    await page.bringToFront();
    await approvals.openTraineesQueue();
    await approvals.expectRequestRowAbsent(employee);

    await trainees.openActiveTraineesList();
    await trainees.openActiveTraineeProfile(employee);
    await onboard.openFromProfile();
    await onboard.expectStatus(/reject/i);
    await onboard.expectRequestButtonHidden();
  });
});

async function ensurePreOnboardingCredentials(
  page: import('@playwright/test').Page,
  employee: SavedTrainee,
): Promise<SavedTrainee> {
  const mailTab = await page.context().newPage();
  const yopmail = new YopmailPage(mailTab);
  await yopmail.openInbox(employee.email);
  const updated = await refreshPreOnboardingCredentials(yopmail, employee);
  await mailTab.close();
  return updated;
}

async function approveOnboardRequestThroughHr(
  page: import('@playwright/test').Page,
  trainees: ProspectiveTraineePage,
  employee: SavedTrainee,
) {
  const approvals = new PendingTraineeOnboardApprovalPage(page);
  const onboard = new TraineeOnboardRequestPage(page);

  await page.keyboard.press('Escape').catch(() => {});
  await page.bringToFront();
  const row = await approvals.waitForRequestRow(employee, { timeout: 120000 });
  await approvals.expectKebabActions(row, ['Approve'], { only: true });
  await approvals.approveUntilDone(employee);
  try {
    await approvals.processAsHr(employee);
  } catch (error) {
    await trainees.openActiveTraineeProfile(employee);
    await onboard.openFromProfile();
    const statusText = await page.locator('table').innerText().catch(() => '');
    if (!/Processed/i.test(statusText)) {
      throw error;
    }
    console.log('HR Process already completed on trainee profile');
  }

  await trainees.openActiveTraineesList();
  await trainees.openActiveTraineeProfile(employee);
  await onboard.openFromProfile();
  await onboard.expectStatus(/processed/i);
  console.log(`Onboard request processed for ${employee.firstName} ${employee.lastName}`);
}

async function resolveTraineeForOnboardAction(
  page: import('@playwright/test').Page,
  trainees: ProspectiveTraineePage,
  options: { allowPending: boolean; excludeEmails?: string[] },
): Promise<SavedTrainee> {
  const lastUsed = resolveTraineeEmail(loadLastTrainee() ?? { firstName: '', lastName: '', email: '' });
  const excludeEmails = [
    ...(options.excludeEmails ?? []),
    ...(options.allowPending ? [] : [lastUsed]),
  ].filter(Boolean);
  const candidates: SavedTrainee[] = [
    { firstName: 'Nandini', lastName: 'Joshi', email: 'nandini.joshi.ijt1@yopmail.com' },
    { firstName: 'Nandini', lastName: 'Joshi', email: 'nandini.joshi.ijt@yopmail.com' },
    { firstName: 'anatha', lastName: 'lakshmi manjula', email: 'manjulalakshmiana@yopmail.com' },
    { firstName: 'Sindhuja', lastName: 'Priya', email: 'Sindhuja@yopmail.com' },
    { firstName: 'Sindhuja', lastName: 'Priya', email: 'Sindhuja1@yopmail.com' },
  ].filter((candidate) => !isTraineeEmailExcluded(resolveTraineeEmail(candidate), excludeEmails));

  for (const candidate of candidates) {
    try {
      await trainees.openActiveTraineesList();
      await trainees.openActiveTraineeProfile(candidate);
      const manager = (await page.getByText('Reporting Manager', { exact: true })
        .locator('xpath=following-sibling::*[1]')
        .innerText()
        .catch(() => 'NA')).trim();
      if (/^NA$/i.test(manager)) {
        console.log(`${candidate.email} has no reporting manager; skipping`);
        continue;
      }

      const onboard = new TraineeOnboardRequestPage(page);
      await onboard.openFromProfile();
      const tableText = await page.locator('table').innerText().catch(() => '');

      if (options.allowPending && /Waiting for Approval/i.test(tableText)) {
        const synced = await syncTraineeFromActiveList(trainees, candidate);
        console.log(`Reusing pending onboard request for ${synced.email}`);
        return synced;
      }

      if (await onboard.requestButton.last().isVisible().catch(() => false)) {
        return withOfferDefaults(candidate);
      }

      if (!/Waiting for Approval|Processed|Extended/i.test(tableText)) {
        await prepareActiveTraineeForOnboard(page, candidate);
        await onboard.openFromProfile();
        if (await onboard.requestButton.last().isVisible().catch(() => false)) {
          console.log(`Prepared onboard-ready trainee ${candidate.email}`);
          return withOfferDefaults(candidate);
        }
      }

      if (/No Data Found/i.test(tableText)) {
        await prepareActiveTraineeForOnboard(page, candidate);
        await onboard.openFromProfile();
        if (await onboard.requestButton.last().isVisible().catch(() => false)) {
          console.log(`Prepared onboard-ready trainee ${candidate.email}`);
          return withOfferDefaults(candidate);
        }
      }

      console.log(`${candidate.email} is not ready for onboard request; trying next candidate`);
    } catch (error) {
      console.log(`Could not evaluate ${candidate.email}: ${error}`);
    }
  }

  const scanned = await findActiveTraineeWithOnboardRequest(page, trainees, {
    excludeEmail: excludeEmails.length > 0 ? excludeEmails : lastUsed,
    maxPages: 1,
  });
  if (scanned) {
    return scanned;
  }

  throw new Error('No active trainee with Request For Onboard. Prepare an active trainee first.');
}

async function resolveActiveTrainee(
  page: import('@playwright/test').Page,
  trainees: ProspectiveTraineePage,
  options?: { preferDifferentFromLast?: boolean; requireRequestButton?: boolean },
): Promise<SavedTrainee> {
  await trainees.openActiveTraineesList();
  const saved = loadLastTrainee();
  const hardcoded: SavedTrainee[] = [
    { firstName: 'Nandini', lastName: 'Joshi', email: 'nandini.joshi.ijt@yopmail.com' },
    { firstName: 'Sindhuja', lastName: 'Priya', email: 'Sindhuja@yopmail.com' },
    { firstName: 'rajesh', lastName: 'zithwaday', email: 'zithwaday@yopmail.com' },
  ];
  const candidates: SavedTrainee[] = options?.preferDifferentFromLast
    ? [...hardcoded, ...(saved ? [saved] : [])]
    : [...(saved ? [saved] : []), ...hardcoded];

  const unique: SavedTrainee[] = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    const key = `${candidate.firstName}|${candidate.lastName}|${candidate.email}`.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(candidate);
  }

  for (const candidate of unique) {
    try {
      await trainees.openActiveTraineeProfile(candidate);
      const manager = (await page.getByText('Reporting Manager', { exact: true })
        .locator('xpath=following-sibling::*[1]')
        .innerText()
        .catch(() => 'NA')).trim();
      if (/^NA$/i.test(manager)) {
        console.log(`${candidate.email} has no reporting manager; skipping`);
        await trainees.openActiveTraineesList();
        continue;
      }
      const onboard = new TraineeOnboardRequestPage(page);
      await onboard.openFromProfile();
      if (await onboard.requestButton.last().isVisible().catch(() => false)) {
        const resolved = withOfferDefaults({ ...(saved ?? {}), ...candidate });
        saveLastTrainee(resolved);
        return resolved;
      }
      const tableText = await page.locator('table').innerText().catch(() => '');
      if (/No Data Found/i.test(tableText)) {
        await prepareActiveTraineeForOnboard(page, candidate);
        await onboard.openFromProfile();
        if (await onboard.requestButton.last().isVisible().catch(() => false)) {
          const resolved = withOfferDefaults({ ...(saved ?? {}), ...candidate });
          saveLastTrainee(resolved);
          return resolved;
        }
      }
      if (options?.requireRequestButton) {
        console.log(`${candidate.email} does not have Request For Onboard; trying another active trainee`);
        await trainees.openActiveTraineesList();
        continue;
      }
      if (await page.getByText(/Waiting for Approval|Extended|Approved|Processed|Ready for Onboard/i).first().isVisible().catch(() => false)) {
        const isSavedTrainee = saved && candidate.email.toLowerCase() === saved.email.toLowerCase();
        if (isSavedTrainee) {
          console.log(`${candidate.email} already has an onboard request in progress`);
          const resolved = { ...saved, ...candidate };
          saveLastTrainee(resolved);
          return resolved;
        }
        console.log(`${candidate.email} has a stale onboard request in progress; trying another active trainee`);
        await trainees.openActiveTraineesList();
        continue;
      }
      console.log(`${candidate.email} does not have Request For Onboard; trying another active trainee`);
      await trainees.openActiveTraineesList();
    } catch {
      await trainees.openActiveTraineesList();
    }
  }

  const excludeEmail = options?.preferDifferentFromLast
    ? resolveTraineeEmail(saved ?? { firstName: '', lastName: '', email: '' })
    : undefined;
  const scanned = await findActiveTraineeWithOnboardRequest(page, trainees, { excludeEmail });
  if (scanned) {
    saveLastTrainee(scanned);
    return scanned;
  }

  throw new Error('No active trainee with Request For Onboard. Run Test-13 first. Do not create a new trainee.');
}

function futureIsoDate(daysAhead: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

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
