import { type Locator, type Page } from '@playwright/test';

export class ManageShiftsPage {
  readonly page: Page;

  // =========================================================
  // MANAGE SHIFTS PAGE
  // =========================================================

  readonly pendingSubmissionTab: Locator;
  readonly publishedTab: Locator;
  readonly addNewButton: Locator;

  // =========================================================
  // SHIFT FORM
  // =========================================================

  readonly locationDropdown: Locator;
  readonly subLocationDropdown: Locator;

  readonly shiftCodeInput: Locator;
  readonly shiftNameInput: Locator;

  readonly colorInput: Locator;

  readonly startTimeInput: Locator;
  readonly endTimeInput: Locator;

  readonly allowedGracePeriodInput: Locator;
  readonly latesAllowedInput: Locator;
  readonly allowedBreakTimeInput: Locator;
  readonly halfDayMinHrsInput: Locator;
  readonly fullDayMinHrsInput: Locator;
  readonly preShiftBufferInput: Locator;
  readonly postShiftBufferInput: Locator;
  

  // =========================================================
  // BUTTONS
  // =========================================================

  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly updateButton: Locator;
  readonly publishButton: Locator;
  readonly cloneButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // =========================================================
    // MANAGE SHIFTS
    // =========================================================

    this.pendingSubmissionTab =
      page.getByRole('link', { name: /Pending for Submission/i });

    this.publishedTab =
      page.getByRole('link', { name: /Published/i });

    this.addNewButton =
      page.getByText('Add New', { exact: true }).first();

    // =========================================================
    // DROPDOWNS
    // =========================================================

    this.locationDropdown =
      page.getByRole('combobox', {
        name: 'Please select location'
      });

    this.subLocationDropdown =
      page.getByRole('combobox', {
        name: 'Please select sub location'
      });

    // =========================================================
    // TEXT INPUTS
    // =========================================================

    this.shiftCodeInput =
      page.getByRole('textbox', {
        name: 'Please enter shift code'
      });

    this.shiftNameInput =
      page.getByRole('textbox', {
        name: 'Please enter shift name'
      });

    // =========================================================
    // COLOR
    // =========================================================

    this.colorInput =
      page.locator('input[type="color"]').first();

    // =========================================================
    // TIME
    // =========================================================

    this.startTimeInput =
      page.getByRole('textbox').nth(3);

    this.endTimeInput =
      page.getByRole('textbox').nth(4);

    // =========================================================
    // NUMBER FIELDS
    // =========================================================

    this.allowedGracePeriodInput =
      page.getByRole('spinbutton').nth(0);

    this.latesAllowedInput =
      page.getByRole('spinbutton').nth(1);

    this.allowedBreakTimeInput =
      page.getByRole('spinbutton').nth(2);

    this.halfDayMinHrsInput =
      page.getByRole('spinbutton').nth(3);

    this.fullDayMinHrsInput =
      page.getByRole('spinbutton').nth(4);

    this.preShiftBufferInput =
      page.getByRole('spinbutton', {
        name: 'Please enter pre-shift buffer'
      });

    this.postShiftBufferInput =
      page.getByRole('spinbutton', {
        name: 'Please enter post-shift buffer'
      });

    // =========================================================
    // BUTTONS
    // =========================================================

    this.submitButton =
      page.getByRole('button', {
        name: 'Submit',
        exact: true
      });

    this.cancelButton =
      page.getByRole('button', {
        name: 'Cancel',
        exact: true
      });

    this.updateButton =
      page.getByRole('button', {
        name: 'Update',
        exact: true
      });

    this.publishButton =
      page.getByRole('button', {
        name: 'Publish',
        exact: true
      });

    this.cloneButton =
      page.getByRole('button', {
        name: 'Clone',
        exact: true
      });
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  async goto() {
    await this.page.goto(
      '/settings/employee-fields/manage-shifts/pending-for-submit',
      {
        waitUntil: 'domcontentloaded'
      }
    );
  }

  async openPublished() {
    await this.publishedTab.click();
  }

  async clickAddNew() {
    await this.addNewButton.click();
  }

  async openUpdate() {
    const actionCell = this.page
      .getByRole('row')
      .nth(1)
      .getByRole('cell')
      .last();

    await actionCell.locator('div').first().click();

    await actionCell
      .getByText('Update', { exact: true })
      .filter({ visible: true })
      .click();
  }

  // =========================================================
  // DROPDOWN ACTIONS
  // =========================================================

  async selectLocation(location: string) {
    await this.locationDropdown.click();

    await this.page.getByText(location, {
      exact: true
    }).click();
  }

  async selectSubLocation(subLocation: string) {
    await this.subLocationDropdown.click();

    await this.page.getByText(subLocation, {
      exact: true
    }).click();
  }
  async openView() {
  await this.page.locator('.text-center > .dropdown').first().click();
  await this.page.getByText('View', { exact: true }).first().click();
}
async openClone() {
  await this.page.locator('.text-center > .dropdown').first().click();
  await this.page.getByText('Clone', { exact: true }).first().click();
}


  // =========================================================
  // SHIFT DETAILS
  // =========================================================

  async fillShiftDetails(data: {
    shiftCode: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    allowedGracePeriod?: string;
    latesAllowed?: string;
    allowedBreakTime?: string;
    halfDayMinHrs?: string;
    fullDayMinHrs?: string;
    preShiftBuffer?: string;
    postShiftBuffer?: string;
  }) {
    await this.shiftCodeInput.fill(data.shiftCode);

    await this.shiftNameInput.fill(data.shiftName);

    await this.startTimeInput.fill(data.startTime);

    await this.endTimeInput.fill(data.endTime);

    if (data.allowedGracePeriod !== undefined) {
      await this.allowedGracePeriodInput.fill(
        data.allowedGracePeriod
      );
    }

    if (data.latesAllowed !== undefined) {
      await this.latesAllowedInput.fill(
        data.latesAllowed
      );
    }

    if (data.allowedBreakTime !== undefined) {
      await this.allowedBreakTimeInput.fill(
        data.allowedBreakTime
      );
    }

    if (data.halfDayMinHrs !== undefined) {
      await this.halfDayMinHrsInput.fill(
        data.halfDayMinHrs
      );
    }

    if (data.fullDayMinHrs !== undefined) {
      await this.fullDayMinHrsInput.fill(
        data.fullDayMinHrs
      );
    }

    if (data.preShiftBuffer !== undefined) {
      await this.preShiftBufferInput.fill(
        data.preShiftBuffer
      );
    }

    if (data.postShiftBuffer !== undefined) {
      await this.postShiftBufferInput.fill(
        data.postShiftBuffer
      );
    }
  }

  // =========================================================
  // BUTTON ACTIONS
  // =========================================================

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async update() {
    await this.updateButton.click();
  }

  async publish() {
    await this.publishButton.click();
  }

  async clone() {
    await this.cloneButton.click();
  }
}