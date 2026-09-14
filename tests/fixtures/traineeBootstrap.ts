import { expect, type Page, type TestInfo } from '@playwright/test';
import fs from 'fs';
import { ProspectiveTraineePage } from '../../pages/ProspectiveTraineePage';
import { EmployeeMyInfoPage } from '../../pages/EmployeeMyInfoPage';
import { YopmailPage } from '../../pages/YopmailPage';
import { PreOnboardingPage } from '../../pages/PreOnboardingPage';
import { OnboardingApplicationPage } from '../../pages/OnboardingApplicationPage';
import { OnboardingDocumentsHrPage } from '../../pages/OnboardingDocumentsHrPage';
import { TraineeOfferLetterPage } from '../../pages/TraineeOfferLetterPage';
import { PendingTraineeOfferApprovalPage } from '../../pages/PendingTraineeOfferApprovalPage';
import { TraineeOnboardRequestPage } from '../../pages/TraineeOnboardRequestPage';
import { TraineeJobPrepPage } from '../../pages/TraineeJobPrepPage';
import { EmployeeOnboardingInfoPage } from '../../pages/EmployeeOnboardingInfoPage';
import { PreOnboardingOfferLetterPage } from '../../pages/PreOnboardingOfferLetterPage';
import { PreOnboardingPostOfferPage } from '../../pages/PreOnboardingPostOfferPage';
import { loadLastTrainee, saveLastTrainee, isTraineeReusable, needsDocumentRequest, type SavedTrainee } from './lastTrainee';
import { createOnboardingFiles } from './onboardingFiles';
import { openPreOnboardingFromYopmail } from './onboardingCredentials';

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

export function resolveTraineeEmail(trainee: SavedTrainee): string {
  if (/@yopmail\.com/i.test(trainee.email)) {
    return trainee.email;
  }
  if (trainee.username && /@yopmail\.com/i.test(trainee.username)) {
    return trainee.username;
  }
  return trainee.email;
}

export function isTraineeEmailExcluded(email: string, exclude?: string | string[]) {
  const excludes = (Array.isArray(exclude) ? exclude : exclude ? [exclude] : [])
    .map((value) => value.toLowerCase())
    .filter(Boolean);
  if (excludes.length === 0) {
    return false;
  }
  const normalized = email.toLowerCase();
  const local = normalized.split('@')[0]?.replace(/\d+$/, '') ?? normalized;
  return excludes.some((excludeEmail) => {
    const excludeLocal = excludeEmail.split('@')[0]?.replace(/\d+$/, '') ?? excludeEmail;
    return normalized === excludeEmail || local === excludeLocal;
  });
}

export function hasValidEmployeeId(employeeId?: string) {
  if (!employeeId) {
    return false;
  }
  const trimmed = employeeId.trim();
  if (!trimmed || /^[-–—]+$/i.test(trimmed) || /^NA$/i.test(trimmed)) {
    return false;
  }
  const numeric = trimmed.replace(/\D/g, '');
  return numeric.length > 0;
}

export async function resolveProspectiveTraineeForDocuments(
  page: Page,
): Promise<SavedTrainee> {
  const saved = loadLastTrainee();
  const trainees = new ProspectiveTraineePage(page);
  await trainees.openTraineesList();

  if (saved) {
    await trainees.searchTrainee(saved.email);
    const row = trainees.traineeRow(saved.email);
    if (await row.isVisible({ timeout: 8000 }).catch(() => false)) {
      const fromRow = await trainees.readTraineeFromRow(row);
      const details = withOfferDefaults({ ...saved, ...fromRow, email: resolveTraineeEmail(saved) });
      saveLastTrainee(details);
      console.log(`Reusing saved prospective trainee ${details.email}`);
      return details;
    }
    console.log(`Saved trainee ${saved.email} is not in prospective list; creating a new trainee for Test-03`);
  } else {
    console.log('No saved trainee found; creating a new trainee for Test-03');
  }

  const details = ProspectiveTraineePage.uniqueTrainee();
  await trainees.openAddForm();
  await trainees.fillAndSubmit(details);
  await trainees.expectTraineeVisibleInList(details);
  saveLastTrainee(details);
  return details;
}

export async function tryLoadSavedTraineeFromList(
  trainees: ProspectiveTraineePage,
  saved: SavedTrainee,
  options?: { matchByName?: boolean },
): Promise<SavedTrainee | null> {
  const matchByName = options?.matchByName ?? true;
  const fullName = `${saved.firstName} ${saved.lastName}`.trim();
  const searches = [saved.email, saved.username, saved.employeeId, saved.firstName, fullName].filter(
    (value, index, all): value is string => !!value && all.indexOf(value) === index,
  );

  for (const query of searches) {
    await trainees.searchTrainee(query);

    const rowCandidates = [saved.email, saved.username, saved.employeeId].filter(
      (value): value is string => !!value,
    );
    if (matchByName && fullName.length > 1) {
      rowCandidates.push(fullName);
    }
    for (const email of [saved.email, saved.username].filter((value): value is string => !!value)) {
      const localPart = email.split('@')[0]?.replace(/\d+$/, '');
      if (localPart && !rowCandidates.includes(localPart)) {
        rowCandidates.push(localPart);
      }
    }

    let row: Awaited<ReturnType<typeof trainees.traineeRow>> | null = null;
    for (const candidate of rowCandidates) {
      const match = trainees.traineeRow(candidate);
      if (await match.isVisible({ timeout: 3000 }).catch(() => false)) {
        row = match;
        break;
      }
    }

    if (!row) {
      continue;
    }

    const fromSaved = await trainees.readTraineeFromRow(row);
    const savedEmployeeId = saved.employeeId?.replace(/\D/g, '') || '';
    const rowEmployeeId = fromSaved.employeeId?.replace(/\D/g, '') || '';
    if (savedEmployeeId && rowEmployeeId && savedEmployeeId !== rowEmployeeId) {
      console.log(
        `Skipping ${fromSaved.firstName} ${fromSaved.lastName}; employeeId ${fromSaved.employeeId} does not match saved ${saved.employeeId}`,
      );
      continue;
    }

    const identityEmail = saved.username ?? saved.email;
    const identityLocal = identityEmail.split('@')[0]?.replace(/\d+$/, '').toLowerCase() ?? '';
    const rowText = (await row.innerText()).toLowerCase();
    if (saved.firstName && fromSaved.firstName && saved.firstName.toLowerCase() !== fromSaved.firstName.toLowerCase()) {
      const savedEmail = resolveTraineeEmail(saved).toLowerCase();
      const rowEmail = resolveTraineeEmail(fromSaved).toLowerCase();
      const sameTrainee =
        savedEmail === rowEmail ||
        rowText.includes(savedEmail.split('@')[0] ?? '') ||
        rowText.includes(rowEmail.split('@')[0] ?? '');
      if (!sameTrainee) {
        console.log(`Skipping ${fromSaved.firstName}; first name does not match saved ${saved.firstName}`);
        continue;
      }
      console.log(
        `Correcting stale saved name ${saved.firstName} ${saved.lastName} to ${fromSaved.firstName} ${fromSaved.lastName}`,
      );
    }
    if (identityLocal && !matchByName) {
      const rowEmail = fromSaved.email.toLowerCase();
      const matchesIdentity =
        rowEmail.includes(identityLocal) ||
        rowText.includes(identityLocal) ||
        (
          !!saved.firstName &&
          !!saved.lastName &&
          rowText.includes(saved.firstName.toLowerCase()) &&
          rowText.includes(saved.lastName.toLowerCase())
        );
      if (!matchesIdentity) {
        console.log(`Skipping ${fromSaved.email || fromSaved.firstName}; does not match identity ${identityEmail}`);
        continue;
      }
    }

    console.log(`Reusing ${fromSaved.email} (${(await row.innerText()).replace(/\s+/g, ' ').trim()})`);
    return {
      ...saved,
      ...fromSaved,
      email: resolveTraineeEmail({ ...saved, ...fromSaved }),
    };
  }

  return null;
}

export async function resolveActiveSavedTrainee(
  trainees: ProspectiveTraineePage,
  saved: SavedTrainee,
): Promise<SavedTrainee> {
  await trainees.openActiveTraineesList();

  const lookupOrder: Array<{ trainee: SavedTrainee; matchByName: boolean }> = [
    { trainee: saved, matchByName: true },
  ];
  if (saved.username && saved.username.toLowerCase() !== saved.email.toLowerCase()) {
    lookupOrder.unshift({
      trainee: { ...saved, email: saved.username },
      matchByName: true,
    });
  }

  for (const { trainee, matchByName } of lookupOrder) {
    const listed = await tryLoadSavedTraineeFromList(trainees, trainee, { matchByName });
    if (listed) {
      return withOfferDefaults(listed);
    }
  }

  throw new Error(
    `Active trainee not found for ${saved.email}${saved.employeeId ? ` (employeeId ${saved.employeeId})` : ''}. Run Test-13 first.`,
  );
}

export async function findActiveTraineeWithOnboardRequest(
  page: Page,
  trainees: ProspectiveTraineePage,
  options?: { excludeEmail?: string | string[]; maxPages?: number },
): Promise<SavedTrainee | null> {
  const exclude = options?.excludeEmail;
  await trainees.openActiveTraineesList();
  await trainees.clearTraineeSearch();
  await trainees.expandTablePageSize();

  for (let pageIndex = 0; pageIndex < (options?.maxPages ?? 5); pageIndex++) {
    const rows = page.getByRole('row').filter({ has: page.getByRole('cell') });
    const count = await rows.count();
    for (let index = 0; index < count; index++) {
      const row = rows.nth(index);
      const rowText = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      if (!rowText || /Request Date|Username|Showing \d+/i.test(rowText)) {
        continue;
      }

      const fromRow = await trainees.readTraineeFromRow(row);
      const email = resolveTraineeEmail(fromRow);
      if (!/@yopmail\.com/i.test(email)) {
        continue;
      }
      if (isTraineeEmailExcluded(email, exclude)) {
        continue;
      }

      try {
        await row.getByRole('cell').nth(1).click();
        await page.getByText('Personal', { exact: true }).or(page.getByText('Job', { exact: true })).first()
          .waitFor({ state: 'visible', timeout: 10000 });

        const manager = (await page.getByText('Reporting Manager', { exact: true })
          .locator('xpath=following-sibling::*[1]')
          .innerText()
          .catch(() => 'NA')).trim();
        if (/^NA$/i.test(manager)) {
          console.log(`${email} has no reporting manager; skipping`);
          await trainees.openActiveTraineesList();
          continue;
        }

        const resolved = withOfferDefaults({ ...fromRow, email });
        const onboard = new TraineeOnboardRequestPage(page);
        await onboard.openFromProfile();
        if (await onboard.requestButton.last().isVisible().catch(() => false)) {
          console.log(`Found onboard-ready trainee: ${resolved.firstName} ${resolved.lastName} (${email})`);
          return resolved;
        }

        const tableText = await page.locator('table').innerText().catch(() => '');
        if (/No Data Found/i.test(tableText)) {
          await prepareActiveTraineeForOnboard(page, resolved);
          await onboard.openFromProfile();
          if (await onboard.requestButton.last().isVisible().catch(() => false)) {
            console.log(`Prepared onboard-ready trainee: ${resolved.firstName} ${resolved.lastName} (${email})`);
            return resolved;
          }
        }

        console.log(`${email} does not have Request For Onboard; trying next active trainee`);
        await trainees.openActiveTraineesList();
      } catch (error) {
        console.log(`Could not evaluate ${email} for onboard request: ${error}`);
        await trainees.openActiveTraineesList();
      }
    }

    const next = page.locator('.p-paginator-next').last();
    if (!(await next.isVisible().catch(() => false))) {
      break;
    }
    const nextClass = (await next.getAttribute('class')) || '';
    if (nextClass.includes('p-disabled') || (await next.isDisabled().catch(() => false))) {
      break;
    }
    await next.click();
    await page.waitForTimeout(500);
  }

  return null;
}

export async function findActiveTraineeWithPendingOnboardRequest(
  page: Page,
  trainees: ProspectiveTraineePage,
  options?: { excludeEmail?: string | string[]; maxPages?: number },
): Promise<SavedTrainee | null> {
  const exclude = options?.excludeEmail;
  await trainees.openActiveTraineesList();
  await trainees.clearTraineeSearch();
  await trainees.expandTablePageSize();

  for (let pageIndex = 0; pageIndex < (options?.maxPages ?? 3); pageIndex++) {
    const rows = page.getByRole('row').filter({ has: page.getByRole('cell') });
    const count = await rows.count();
    for (let index = 0; index < count; index++) {
      const row = rows.nth(index);
      const rowText = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
      if (!rowText || /Request Date|Username|Showing \d+/i.test(rowText)) {
        continue;
      }

      const fromRow = await trainees.readTraineeFromRow(row);
      const email = resolveTraineeEmail(fromRow);
      if (!/@yopmail\.com/i.test(email)) {
        continue;
      }
      if (isTraineeEmailExcluded(email, exclude)) {
        continue;
      }

      try {
        await row.getByRole('cell').nth(1).click();
        await page.getByText('Personal', { exact: true }).or(page.getByText('Job', { exact: true })).first()
          .waitFor({ state: 'visible', timeout: 10000 });

        const onboard = new TraineeOnboardRequestPage(page);
        await onboard.openFromProfile();
        const tableText = await page.locator('table').innerText().catch(() => '');
        if (/Waiting for Approval/i.test(tableText)) {
          const resolved = withOfferDefaults({ ...fromRow, email });
          console.log(`Found pending onboard request for ${resolved.firstName} ${resolved.lastName} (${email})`);
          return resolved;
        }

        await trainees.openActiveTraineesList();
      } catch (error) {
        console.log(`Could not evaluate pending onboard for ${email}: ${error}`);
        await trainees.openActiveTraineesList();
      }
    }

    const next = page.locator('.p-paginator-next').last();
    if (!(await next.isVisible().catch(() => false))) {
      break;
    }
    const nextClass = (await next.getAttribute('class')) || '';
    if (nextClass.includes('p-disabled') || (await next.isDisabled().catch(() => false))) {
      break;
    }
    await next.click();
    await page.waitForTimeout(500);
  }

  return null;
}

export async function activateProspectiveTraineeToActive(
  page: Page,
  trainees: ProspectiveTraineePage,
  employee: SavedTrainee,
): Promise<SavedTrainee> {
  await openSavedTraineeProfile(trainees, employee);
  const onboardingInfo = new EmployeeOnboardingInfoPage(page);
  await onboardingInfo.openFromProfile();
  await onboardingInfo.setStatusTraineeActiveAndSave();

  await trainees.goToTraineesList();
  await trainees.expectTraineeHiddenInList(employee.email);
  console.log(`${employee.email} removed from prospective trainees`);

  await trainees.openActiveTraineesList();
  await trainees.searchTrainee(employee.email);
  let activeRow = trainees.traineeRow(`${employee.firstName} ${employee.lastName}`);
  if (!(await activeRow.isVisible({ timeout: 5000 }).catch(() => false))) {
    await trainees.searchTrainee(employee.firstName);
    activeRow = trainees.traineeRow(`${employee.firstName} ${employee.lastName}`);
  }
  await expect(activeRow).toBeVisible({ timeout: 15000 });
  const fromRow = await trainees.readTraineeFromRow(activeRow);
  await trainees.openActiveTraineeProfile({ ...employee, ...fromRow, email: resolveTraineeEmail(employee) });

  let employeeId = fromRow.employeeId ?? employee.employeeId;
  if (hasValidEmployeeId(employeeId)) {
    console.log(`Using employee ID from active list: ${employeeId}`);
  } else {
    try {
      employeeId = await onboardingInfo.setEmployeeIdOnBasicInfo(employeeId);
    } catch (error) {
      console.log(`Could not set employee ID on Basic Info; continuing with list data. ${error}`);
    }
  }

  const resolved = withOfferDefaults({
    ...employee,
    ...fromRow,
    employeeId: hasValidEmployeeId(employeeId) ? employeeId : fromRow.employeeId ?? employee.employeeId,
    email: resolveTraineeEmail(employee),
  });
  saveLastTrainee(resolved);
  console.log(`${resolved.email} is in active trainees with employee ID ${resolved.employeeId}`);
  return resolved;
}

export async function ensureActiveTraineeEmployeeId(
  page: Page,
  trainees: ProspectiveTraineePage,
  employee: SavedTrainee,
): Promise<SavedTrainee> {
  let updated = await syncTraineeFromActiveList(trainees, employee);
  if (hasValidEmployeeId(updated.employeeId)) {
    saveLastTrainee(updated);
    console.log(`Using employee ID from active list: ${updated.employeeId}`);
    return updated;
  }

  await trainees.openActiveTraineeProfile(updated);
  const onboardingInfo = new EmployeeOnboardingInfoPage(page);
  try {
    const employeeId = await onboardingInfo.setEmployeeIdOnBasicInfo(updated.employeeId);
    if (hasValidEmployeeId(employeeId)) {
      updated = withOfferDefaults({ ...updated, employeeId });
    }
  } catch (error) {
    console.log(`Could not set employee ID on Basic Info; continuing with list data. ${error}`);
  }
  await page.keyboard.press('Escape').catch(() => {});

  updated = await syncTraineeFromActiveList(trainees, updated);
  if (!hasValidEmployeeId(updated.employeeId)) {
    console.log(`No employee ID available for ${updated.email}; continuing onboard flow without one`);
  } else {
    console.log(`Synced active trainee identity: ${updated.firstName} ${updated.lastName} (${updated.employeeId})`);
  }
  saveLastTrainee(updated);
  return updated;
}

export async function syncTraineeFromActiveList(
  trainees: ProspectiveTraineePage,
  employee: SavedTrainee,
): Promise<SavedTrainee> {
  await trainees.openActiveTraineesList();
  await trainees.searchTrainee(employee.email);
  let row = trainees.traineeRow(employee.email);
  if (!(await row.isVisible({ timeout: 5000 }).catch(() => false))) {
    await trainees.searchTrainee(employee.firstName);
    row = trainees.traineeRow(`${employee.firstName} ${employee.lastName}`);
  }
  if (!(await row.isVisible({ timeout: 5000 }).catch(() => false))) {
    return employee;
  }
  const fromRow = await trainees.readTraineeFromRow(row);
  return withOfferDefaults({ ...employee, ...fromRow, email: resolveTraineeEmail(employee) });
}

export async function prepareActiveTraineeForOnboard(page: Page, employee: SavedTrainee) {
  await page.keyboard.press('Escape').catch(() => {});
  const personal = page.getByText('Personal', { exact: true });
  if (await personal.isVisible({ timeout: 5000 }).catch(() => false)) {
    await personal.click({ timeout: 10000 });
  }

  const onboardingInfo = new EmployeeOnboardingInfoPage(page);
  const basicTab = page.getByText('Personal', { exact: true }).or(page.getByText('Basic Info', { exact: true }));
  if (await basicTab.first().isVisible().catch(() => false)) {
    try {
      const profileEmployeeId = await onboardingInfo.readEmployeeIdFromBasicInfo();
      if (!hasValidEmployeeId(profileEmployeeId)) {
        employee.employeeId = await onboardingInfo.setEmployeeIdOnBasicInfo(employee.employeeId);
      } else {
        employee.employeeId = profileEmployeeId ?? employee.employeeId;
        console.log(`Employee ID already on Basic Info: ${employee.employeeId}`);
      }
    } catch (error) {
      console.log(`Could not update employee ID on Basic Info; continuing onboard prep. ${error}`);
    }
  }
  saveLastTrainee({ ...loadLastTrainee(), ...employee, employeeId: employee.employeeId });

  const prep = new TraineeJobPrepPage(page);
  const personalEmail = resolveTraineeEmail(employee);
  const workEmail = personalEmail.replace('@', '1@');
  await prep.ensureWorkEmail(workEmail);
  await prep.ensureJobInfo();
  await page.keyboard.press('Escape').catch(() => {});
}

export async function submitFreshOnboardRequest(page: Page, employee: SavedTrainee) {
  const onboard = new TraineeOnboardRequestPage(page);
  await onboard.openFromProfile();
  await onboard.expectRequestButtonVisible();
  try {
    await onboard.submitRequest();
    return;
  } catch (error) {
    const tableText = await page.locator('table').innerText().catch(() => '');
    if (/Waiting for Approval/i.test(tableText)) {
      console.log('Onboard request is already waiting for approval');
      return;
    }
    if (!isOnboardPrepRequired(error)) {
      throw error;
    }
    console.log(`Onboard request failed; updating Basic Info / Contact Info / Job Info before retry. ${error}`);
    await prepareActiveTraineeForOnboard(page, employee);
    await onboard.openFromProfile();
    await onboard.expectRequestButtonVisible();
    await onboard.submitRequest();
  }
}

function isOnboardPrepRequired(error: unknown) {
  const message = String(error).toLowerCase();
  return /unable to proceed|job details|not updated|employee id|work mail|basic info|contact info|job info|mandatory|required|please update|validation/i.test(message);
}

export async function submitOnboardRequestDirect(page: Page) {
  const onboard = new TraineeOnboardRequestPage(page);
  await onboard.openFromProfile();
  await onboard.expectRequestButtonVisible();
  await onboard.submitRequest();
  console.log('Raised Request For Onboard without Basic Info / Contact Info / Job Info prep');
}

export async function ensureOnboardRequestPending(page: Page, employee: SavedTrainee) {
  const trainees = new ProspectiveTraineePage(page);
  const onboard = new TraineeOnboardRequestPage(page);
  await trainees.openActiveTraineeProfile(employee);
  await onboard.openFromProfile();
  const tableText = await page.locator('table').innerText().catch(() => '');
  if (/Waiting for Approval/i.test(tableText)) {
    console.log(`Using existing pending onboard request for ${employee.email}`);
    return;
  }
  if (await onboard.requestButton.last().isVisible().catch(() => false)) {
    await submitFreshOnboardRequest(page, employee);
    return;
  }
  throw new Error(`${employee.email} has no pending onboard request and cannot submit a new one`);
}

export async function ensurePendingOnboardRequestTrainee(
  page: Page,
  testInfo: TestInfo,
  options?: { excludeEmail?: string | string[] },
): Promise<SavedTrainee> {
  const trainees = new ProspectiveTraineePage(page);
  const excludeEmail = options?.excludeEmail;

  const pending = await findActiveTraineeWithPendingOnboardRequest(page, trainees, { excludeEmail });
  if (pending) {
    return pending;
  }

  const ready = await findActiveTraineeWithOnboardRequest(page, trainees, { excludeEmail });
  if (ready) {
    await submitFreshOnboardRequest(page, ready);
    return ready;
  }

  console.log('No pending or onboard-ready trainee found; creating a new active trainee with onboard request');
  return bootstrapActiveTraineeWithPendingOnboardRequest(page, testInfo);
}

export async function bootstrapActiveTraineeWithPendingOnboardRequest(
  page: Page,
  testInfo: TestInfo,
): Promise<SavedTrainee> {
  const employee = await ensureReleasedOfferTrainee(page, testInfo);
  return finishActiveTraineeOnboardBootstrap(page, testInfo, employee);
}

export async function bootstrapFreshActiveTraineeWithOnboardRequest(
  page: Page,
  testInfo: TestInfo,
): Promise<SavedTrainee> {
  console.log('Creating a fresh active trainee with pending onboard request');
  const employee = await createNewVerifiedTrainee(page, testInfo);
  await generateOfferAndRequestApproval(page, testInfo, employee);
  await approveAndReleaseOffer(page, testInfo, employee);
  return finishActiveTraineeOnboardBootstrap(page, testInfo, employee);
}

async function finishActiveTraineeOnboardBootstrap(
  page: Page,
  testInfo: TestInfo,
  employee: SavedTrainee,
): Promise<SavedTrainee> {
  const trainees = new ProspectiveTraineePage(page);

  const mailTab = await page.context().newPage();
  const yopmail = new YopmailPage(mailTab);
  await yopmail.openInbox(employee.email);
  await yopmail.waitForMailMatching(
    new RegExp(`${employee.firstName}[\\s\\S]*Offer Letter Issued|Offer Letter Issued`, 'i'),
    45000,
  );
  const { portal, preOnboarding, employee: activeEmployee } = await openPreOnboardingFromYopmail(yopmail, employee);
  saveLastTrainee(activeEmployee);
  if (await preOnboarding.goToApplicationButton.isVisible().catch(() => false)) {
    await preOnboarding.goToApplication();
  }

  const offerLetter = new PreOnboardingOfferLetterPage(portal);
  await offerLetter.goToOfferDecision();
  await offerLetter.acceptIfNeeded();

  const files = createOnboardingFiles(testInfo.outputDir);
  const postOffer = new PreOnboardingPostOfferPage(portal);
  await postOffer.addAcademicRecordIfNeeded(files.image);
  await postOffer.fillEmergencyContactsIfNeeded();
  await postOffer.addEmploymentHistoryIfNeeded(files.pdf);
  await postOffer.expectReviewPage();
  await postOffer.submitApplication();
  await portal.close();
  await mailTab.close();

  await page.bringToFront();
  await trainees.goToTraineesList();
  const listed = await loadSavedTraineeFromList(trainees, activeEmployee);
  const resolved = await activateProspectiveTraineeToActive(page, trainees, listed);
  await prepareActiveTraineeForOnboard(page, resolved);
  await submitOnboardRequestDirect(page);
  saveLastTrainee(resolved);
  console.log(`Bootstrapped active trainee with pending onboard request: ${resolved.email}`);
  return resolved;
}

export async function readTraineeStatus(trainees: ProspectiveTraineePage, email: string) {
  await trainees.searchTrainee(email);
  const row = trainees.traineeRow(email);
  if (!(await row.isVisible({ timeout: 5000 }).catch(() => false))) {
    await trainees.searchTrainee(email.split('@')[0] ?? email);
    const fallback = trainees.traineeRow(email);
    if (!(await fallback.isVisible({ timeout: 5000 }).catch(() => false))) {
      return '';
    }
    return (await fallback.innerText()).replace(/\s+/g, ' ').trim();
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
      if (status) {
        console.log(`${listed.email} found with status "${status}"; reusing saved trainee`);
        saveLastTrainee(withOfferDefaults(listed));
        return withOfferDefaults(listed);
      }
    }
  }

  const submitted = await trainees.findDocumentsSubmittedTrainee();
  if (submitted) {
    const resolved = withOfferDefaults(submitted);
    console.log(`Using Documents Submitted trainee ${resolved.email} from list scan`);
    saveLastTrainee(resolved);
    return resolved;
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
  if (fs.existsSync(downloadPath)) {
    await testInfo.attach('trainee-offer-letter', { path: downloadPath, contentType: 'application/pdf' });
  }

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
  const requestSubject = await yopmail.waitForMailSubject(`${details.firstName} ${details.lastName}`, 240000, details.email);
  await yopmail.openMatchingMailInViewer(/Request for Documents Upload|Request for Documents/i);
  let credentials: { username: string; password: string } | null = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      credentials = await yopmail.readCredentials();
      break;
    } catch (error) {
      console.log(`Yopmail credentials not ready yet (attempt ${attempt + 1}/4): ${error}`);
      await yopmail.page.waitForTimeout(3000);
      await yopmail.openMatchingMailInViewer(/Request for Documents Upload|Request for Documents/i);
    }
  }
  if (!credentials) {
    throw new Error(`Could not read Username/Password from Yopmail for ${details.email}`);
  }
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
