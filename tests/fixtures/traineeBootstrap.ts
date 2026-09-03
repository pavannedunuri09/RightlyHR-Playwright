import { expect, type Page, type TestInfo } from '@playwright/test';
import { ProspectiveTraineePage } from '../../pages/ProspectiveTraineePage';
import { EmployeeMyInfoPage } from '../../pages/EmployeeMyInfoPage';
import { YopmailPage } from '../../pages/YopmailPage';
import { PreOnboardingPage } from '../../pages/PreOnboardingPage';
import { OnboardingApplicationPage } from '../../pages/OnboardingApplicationPage';
import { OnboardingDocumentsHrPage } from '../../pages/OnboardingDocumentsHrPage';
import { TraineeOfferLetterPage } from '../../pages/TraineeOfferLetterPage';
import { PendingTraineeOfferApprovalPage } from '../../pages/PendingTraineeOfferApprovalPage';
import { loadLastTrainee, saveLastTrainee, isTraineeReusable, needsDocumentRequest, type SavedTrainee } from './lastTrainee';
import { createOnboardingFiles } from './onboardingFiles';

export function withOfferDefaults(trainee: SavedTrainee): SavedTrainee {
  const defaults = OnboardingApplicationPage.expectedPersonalDefaults(trainee.firstName);
  return {
    middleName: trainee.middleName ?? defaults.middleName,
    designation: trainee.designation ?? 'Front End Developer',
    ...trainee,
    salutation: trainee.salutation,
    gender: trainee.gender,
  };
}

export async function tryLoadSavedTraineeFromList(
  trainees: ProspectiveTraineePage,
  saved: SavedTrainee,
): Promise<SavedTrainee | null> {
  await trainees.searchTrainee(saved.email);
  let row = trainees.traineeRow(saved.email);
  if (!(await row.isVisible({ timeout: 8000 }).catch(() => false))) {
    await trainees.searchTrainee(saved.firstName);
    row = trainees.traineeRow(saved.email);
  }
  if (!(await row.isVisible({ timeout: 8000 }).catch(() => false))) {
    return null;
  }
  const fromSaved = await trainees.readTraineeFromRow(row);
  console.log(`Reusing ${saved.email} (${(await row.innerText()).replace(/\s+/g, ' ').trim()})`);
  return { ...saved, ...fromSaved };
}

export async function readTraineeStatus(trainees: ProspectiveTraineePage, email: string) {
  const row = trainees.traineeRow(email);
  if (!(await row.isVisible({ timeout: 5000 }).catch(() => false))) {
    return '';
  }
  return (await row.innerText()).replace(/\s+/g, ' ').trim();
}

function isManagedTrainee(trainee: SavedTrainee) {
  const first = trainee.firstName ?? '';
  const last = trainee.lastName ?? '';
  const email = trainee.email ?? '';
  if (!/^[A-Za-z]+$/.test(first) || first.length < 3) {
    return false;
  }
  if (!last.split(/\s+/).every((part) => /^[A-Za-z]+$/.test(part) && part.length >= 3)) {
    return false;
  }
  if (!/@yopmail\.com$/i.test(email)) {
    return false;
  }
  return !/(fsdf|asdf|testreport|vif|xxxx|dummy|reportingtest|fgh|dfgh|hjf|hjgh)/i.test(`${first}${last}${email}`);
}

async function createNewVerifiedTrainee(page: Page, testInfo: TestInfo): Promise<SavedTrainee> {
  console.log('Creating a new trainee, submitting documents, and verifying them');
  const trainees = new ProspectiveTraineePage(page);
  await trainees.openTraineesList();
  const onboardingHr = new OnboardingDocumentsHrPage(page);
  const details = await prepareSubmittedTrainee(page, trainees, onboardingHr, testInfo);
  await onboardingHr.verifyPendingDocuments();
  await trainees.goToTraineesList();
  const employee = withOfferDefaults({ ...loadLastTrainee()!, ...details });
  saveLastTrainee(employee);
  return employee;
}

export async function ensureDocumentsSubmittedTrainee(
  page: Page,
  testInfo: TestInfo,
): Promise<SavedTrainee> {
  const trainees = new ProspectiveTraineePage(page);
  await trainees.openTraineesList();

  const saved = loadLastTrainee();
  if (saved && isManagedTrainee(saved)) {
    const listed = await tryLoadSavedTraineeFromList(trainees, saved);
    if (listed) {
      const status = await readTraineeStatus(trainees, listed.email);
      if (/documents submitted|documents verified|documents rejected|offer letter/i.test(status)) {
        saveLastTrainee(withOfferDefaults(listed));
        return withOfferDefaults(listed);
      }
      if (/employee created|documents requested/i.test(status)) {
        console.log(`${listed.email} exists but documents are not submitted yet; continuing onboarding`);
        return withOfferDefaults(listed);
      }
    }
  }

  console.log('No reusable Documents Submitted trainee found; creating a new trainee');
  const onboardingHr = new OnboardingDocumentsHrPage(page);
  const details = await prepareSubmittedTrainee(page, trainees, onboardingHr, testInfo);
  saveLastTrainee(withOfferDefaults({ ...loadLastTrainee()!, ...details }));
  return withOfferDefaults(loadLastTrainee()!);
}

export async function ensureDocumentsVerifiedTrainee(
  page: Page,
  testInfo: TestInfo,
): Promise<SavedTrainee> {
  const trainees = new ProspectiveTraineePage(page);
  await trainees.openTraineesList();

  const saved = loadLastTrainee();
  if (saved && isManagedTrainee(saved)) {
    const listed = await tryLoadSavedTraineeFromList(trainees, saved);
    if (listed) {
      const status = await readTraineeStatus(trainees, listed.email);
      if (/documents verified|offer letter generated|waiting for approval|offer letter approved|offer letter issued|offer letter rejected/i.test(status)) {
        saveLastTrainee(withOfferDefaults(listed));
        return withOfferDefaults(listed);
      }
      if (/documents submitted/i.test(status)) {
        console.log(`${listed.email} documents are submitted; verifying them`);
        await openSavedTraineeProfile(trainees, listed);
        const onboardingHr = new OnboardingDocumentsHrPage(page);
        await onboardingHr.openFromProfile();
        await onboardingHr.verifyPendingDocuments();
        await trainees.goToTraineesList();
        saveLastTrainee(withOfferDefaults(listed));
        return withOfferDefaults(listed);
      }
    }
  }

  return createNewVerifiedTrainee(page, testInfo);
}

export async function ensurePendingOfferTrainee(
  page: Page,
  testInfo: TestInfo,
): Promise<SavedTrainee> {
  const trainees = new ProspectiveTraineePage(page);
  const approvals = new PendingTraineeOfferApprovalPage(page);

  const saved = loadLastTrainee();
  if (saved && isManagedTrainee(saved)) {
    await trainees.openTraineesList();
    const listed = await tryLoadSavedTraineeFromList(trainees, saved);
    if (listed) {
      const status = await readTraineeStatus(trainees, listed.email);
      if (/offer letter generated|waiting for approval/i.test(status) && !/reject/i.test(status)) {
        await approvals.openTraineeOfferLetterQueue();
        const row = await approvals.findOfferRowOrNull(listed);
        if (row) {
          saveLastTrainee(withOfferDefaults(listed));
          return withOfferDefaults(listed);
        }
        console.log(`${listed.email} shows pending in list but is not in the approval queue; regenerating approval`);
      }
    }
  }

  console.log('No pending offer found; creating a verified trainee and requesting approval');
  let employee = await createNewVerifiedTrainee(page, testInfo);
  try {
    await generateOfferAndRequestApproval(page, testInfo, employee);
    return employee;
  } catch (error) {
    console.log(`Could not generate offer for ${employee.email}; creating another trainee. ${error}`);
    employee = await createNewVerifiedTrainee(page, testInfo);
    await generateOfferAndRequestApproval(page, testInfo, employee);
    return employee;
  }
}

export async function ensureRejectedOfferTrainee(
  page: Page,
  testInfo: TestInfo,
): Promise<SavedTrainee> {
  const trainees = new ProspectiveTraineePage(page);
  await trainees.openTraineesList();

  const saved = loadLastTrainee();
  if (saved && isManagedTrainee(saved)) {
    const listed = await tryLoadSavedTraineeFromList(trainees, saved);
    if (listed) {
      const status = await readTraineeStatus(trainees, listed.email);
      if (/offer letter rejected/i.test(status)) {
        saveLastTrainee(withOfferDefaults(listed));
        return withOfferDefaults(listed);
      }
    }
  }

  console.log('No Offer Letter Rejected trainee found; creating one through pending-offer rejection');
  const pending = await ensurePendingOfferTrainee(page, testInfo);
  const approvals = new PendingTraineeOfferApprovalPage(page);
  await approvals.openTraineeOfferLetterQueue();
  const row = await approvals.findOfferRow(pending);
  await approvals.rejectOffer(row, 'The generated trainee offer letter is not valid. Please review and regenerate.');
  await trainees.openTraineesList();
  saveLastTrainee(pending);
  return pending;
}

export async function ensureOfferReadyTrainee(
  page: Page,
  testInfo: TestInfo,
): Promise<{ employee: SavedTrainee; alreadyPending: boolean }> {
  const trainees = new ProspectiveTraineePage(page);
  await trainees.openTraineesList();

  const saved = loadLastTrainee();
  if (saved && isManagedTrainee(saved)) {
    await trainees.openTraineesList();
    const listed = await tryLoadSavedTraineeFromList(trainees, saved);
    if (listed) {
      const status = await readTraineeStatus(trainees, listed.email);
      if (/offer letter generated|waiting for approval/i.test(status) && !/reject/i.test(status)) {
        saveLastTrainee(withOfferDefaults(listed));
        return { employee: withOfferDefaults(listed), alreadyPending: true };
      }
      if (/documents verified|offer letter rejected/i.test(status)) {
        saveLastTrainee(withOfferDefaults(listed));
        return { employee: withOfferDefaults(listed), alreadyPending: false };
      }
    }
  }

  console.log('No offer-ready trainee found; creating a new verified trainee');
  const employee = await createNewVerifiedTrainee(page, testInfo);
  return { employee, alreadyPending: false };
}

export async function ensureReleasedOfferTrainee(
  page: Page,
  testInfo: TestInfo,
): Promise<SavedTrainee> {
  const trainees = new ProspectiveTraineePage(page);
  await trainees.openTraineesList();

  const saved = loadLastTrainee();
  if (saved && isManagedTrainee(saved)) {
    const listed = await tryLoadSavedTraineeFromList(trainees, saved);
    if (listed) {
      const status = await readTraineeStatus(trainees, listed.email);
      if (/offer letter released|offer letter issued/i.test(status)) {
        saveLastTrainee(withOfferDefaults(listed));
        return withOfferDefaults(listed);
      }
    }
  }

  console.log('No Offer Letter Released trainee found; approving and releasing a pending offer');
  const { employee, alreadyPending } = await ensureOfferReadyTrainee(page, testInfo);
  if (!alreadyPending) {
    await generateOfferAndRequestApproval(page, testInfo, employee);
  }
  await approveAndReleaseOffer(page, testInfo, employee);
  return employee;
}

export async function generateOfferAndRequestApproval(
  page: Page,
  testInfo: TestInfo,
  employee: SavedTrainee,
) {
  const approvals = new PendingTraineeOfferApprovalPage(page);
  const trainees = new ProspectiveTraineePage(page);
  const offerLetter = new TraineeOfferLetterPage(page);

  await approvals.openTraineeOfferLetterQueue();
  if (await approvals.findOfferRowOrNull(employee)) {
    console.log(`${employee.email} already has a pending approval request; skipping generate`);
    return;
  }

  await trainees.goToTraineesList();
  await offerLetter.openFromTraineesList();
  await offerLetter.selectEmployee(employee.firstName, employee.lastName, employee.email, employee.employeeId);

  if (await offerLetter.requestApprovalButton.isEnabled({ timeout: 8000 }).catch(() => false)) {
    console.log(`Offer letter already generated for ${employee.email}; requesting approval`);
    const approvalText = await offerLetter.requestApproval();
    expect(approvalText).toContain('Approval request sent');
    return;
  }

  await offerLetter.expectEmployeeDefaults(employee);
  await offerLetter.fillRequiredDetails(employee);

  const downloadPath = testInfo.outputPath('trainee-offer-letter.pdf');
  const generateText = await offerLetter.generateOfferLetter(downloadPath);
  expect(generateText).toContain('Trainee Offer letter generated successfully');
  await testInfo.attach('trainee-offer-letter', { path: downloadPath, contentType: 'application/pdf' });

  const approvalText = await offerLetter.requestApproval();
  expect(approvalText).toContain('Approval request sent');
}

export async function approveAndReleaseOffer(
  page: Page,
  testInfo: TestInfo,
  employee: SavedTrainee,
) {
  const approvals = new PendingTraineeOfferApprovalPage(page);
  await approvals.openTraineeOfferLetterQueue();
  const pendingRow = await approvals.findOfferRow(employee);
  await approvals.expectTraineeDetails(pendingRow, employee);

  const approveText = await approvals.approveOffer(pendingRow);
  expect(approveText).toMatch(/Trainee Offer approved/i);

  const hrMailTab = await page.context().newPage();
  const hrYopmail = new YopmailPage(hrMailTab);
  const hrInbox = process.env.LOGIN_EMAIL!.trim();
  await hrYopmail.openInbox(hrInbox);
  try {
    const hrSubject = await hrYopmail.waitForMailMatching(
      new RegExp(`${employee.firstName}[\\s\\S]*Offer Letter[\\s\\S]*Approved|Offer Letter Approved`, 'i'),
      45000,
    );
    expect(hrSubject).toMatch(/Approved/i);
    const hrShot = testInfo.outputPath('yopmail-offer-approved.png');
    await hrYopmail.screenshotMail(hrShot);
    await testInfo.attach('yopmail-offer-approved', { path: hrShot, contentType: 'image/png' });
  } catch (error) {
    console.log(`HR approval mail was not in Yopmail (${hrInbox}). Continuing as HR executive to release the offer. ${error}`);
  }

  await page.bringToFront();
  await approvals.openTraineeOfferLetterQueue();
  const releaseRow = await approvals.findOfferRow(employee);
  const releaseText = await approvals.releaseOffer(releaseRow);
  expect(releaseText).toMatch(/released/i);
  await expect(approvals.offerRow(employee)).toBeHidden({ timeout: 15000 });

  const employeeMailTab = await page.context().newPage();
  const employeeYopmail = new YopmailPage(employeeMailTab);
  await employeeYopmail.openInbox(employee.email);
  const issuedSubject = await employeeYopmail.waitForMailMatching(
    new RegExp(`${employee.firstName}[\\s\\S]*${employee.lastName}[\\s\\S]*(Offer Letter|issued)|Offer Letter issued|issued`, 'i'),
  );
  expect(issuedSubject).toMatch(/offer letter|issued/i);
  const issuedShot = testInfo.outputPath('yopmail-offer-issued.png');
  await employeeYopmail.screenshotMail(issuedShot);
  await testInfo.attach('yopmail-offer-issued', { path: issuedShot, contentType: 'image/png' });
  await employeeMailTab.close();
}

export async function loadSavedTraineeFromList(
  trainees: ProspectiveTraineePage,
  saved: SavedTrainee,
): Promise<SavedTrainee> {
  const listed = await tryLoadSavedTraineeFromList(trainees, saved);
  if (!listed) {
    throw new Error(`Trainee ${saved.email} was not found in the prospective trainees list`);
  }
  return listed;
}

export async function prepareSubmittedTrainee(
  page: Page,
  trainees: ProspectiveTraineePage,
  onboardingHr: OnboardingDocumentsHrPage,
  testInfo: TestInfo,
) {
  const { details, yopmail } = await requestDocumentsAndOpenMail(page);
  const requestSubject = await yopmail.waitForMailSubject(`${details.firstName} ${details.lastName}`);
  const credentials = await yopmail.readCredentials();
  saveLastTrainee({
    ...details,
    ...OnboardingApplicationPage.expectedPersonalDefaults(details.firstName),
    username: credentials.username,
    password: credentials.password,
  });

  const onboardingPage = await yopmail.openOnboardingPortal();
  const preOnboarding = new PreOnboardingPage(onboardingPage);
  await preOnboarding.expectLoaded();
  await preOnboarding.login(credentials.username, credentials.password);
  await preOnboarding.expectLoggedIn();
  await preOnboarding.goToApplication();

  const application = new OnboardingApplicationPage(onboardingPage);
  if (!(await application.isOnDocumentsPage())) {
    if (await application.genderCombobox.isVisible({ timeout: 5000 }).catch(() => false)) {
      const profile = await application.fillMandatoryIndianDetails(details.firstName, details.lastName);
      saveLastTrainee({
        ...loadLastTrainee()!,
        ...profile,
      });
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

export async function openSavedTraineeProfile(trainees: ProspectiveTraineePage, saved: SavedTrainee) {
  await trainees.searchTrainee(saved.email);
  let row = trainees.traineeRow(saved.email);
  if (!(await row.isVisible({ timeout: 8000 }).catch(() => false))) {
    await trainees.searchTrainee(saved.firstName);
    row = trainees.traineeRow(saved.email);
  }
  await expect(row).toBeVisible({ timeout: 15000 });
  await trainees.openTraineeProfile(saved);
}

export async function requestDocumentsAndOpenMail(page: Page) {
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

async function tryReuseTrainee(page: Page, trainees: ProspectiveTraineePage, saved: SavedTrainee) {
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

async function requestDocumentsFromProfile(page: Page) {
  const myInfo = new EmployeeMyInfoPage(page);
  await myInfo.expectBasicTab();
  const successText = await myInfo.requestDocuments();
  expect(successText).toContain('Email has been sent');
}
