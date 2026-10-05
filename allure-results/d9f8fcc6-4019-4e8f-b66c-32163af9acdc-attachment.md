# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: prospective-trainee.spec.ts >> Prospective Trainees >> Test-15: Request trainee onboard for saved active trainee
- Location: tests\prospective-trainee.spec.ts:639:7

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('dialog').filter({ hasText: /Update Job Info/i }).or(locator('ngb-modal-window.show, .modal.show').filter({ hasText: /Update Job Info/i })).first().getByRole('button', { name: 'Update' })
    - locator resolved to <button disabled type="button" _ngcontent-ng-c978817076="" class="custom-btn btn-primary">Update</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e11]:
      - generic [ref=e12] [cursor=pointer]
      - generic [ref=e20] [cursor=pointer]
      - generic [ref=e28] [cursor=pointer]: 
      - generic [ref=e32] [cursor=pointer]
      - generic [ref=e43] [cursor=pointer]:
        - paragraph [ref=e44]: saii Pavan Dinesh Tejaa
        - paragraph [ref=e45]: QA Tester
    - generic [ref=e48]:
      - list [ref=e53]:
        - listitem [ref=e54] [cursor=pointer]: Dashboard
        - listitem [ref=e56]:
          - generic [ref=e57]:
            - generic [ref=e58] [cursor=pointer]: My Info
            - generic [ref=e60] [cursor=pointer]: Employees
            - generic [ref=e62] [cursor=pointer]: Time Off
            - generic [ref=e66] [cursor=pointer]: Attendance
            - generic [ref=e68] [cursor=pointer]: Reports
            - generic [ref=e70] [cursor=pointer]: Project Management
            - generic [ref=e74] [cursor=pointer]: Skill Set
            - generic [ref=e76] [cursor=pointer]: On Behalf Of
            - generic [ref=e80] [cursor=pointer]: Pending Approvals
            - generic [ref=e84] [cursor=pointer]: PMS
        - listitem [ref=e88] [cursor=pointer]
      - generic [ref=e98]:
        - generic [ref=e99]:
          - generic [ref=e100]:
            - generic [ref=e101] [cursor=pointer]:
              - generic [ref=e102]: Active Trainee
              - generic [ref=e103]: 
            - generic [ref=e105]: Job Info
            - generic [ref=e108] [cursor=pointer]
          - button [ref=e113] [cursor=pointer]: Generate Credentials
        - generic [ref=e114]:
          - generic [ref=e117]:
            - generic [ref=e118]:
              - img [ref=e126] [cursor=pointer]
              - generic [ref=e127]:
                - paragraph [ref=e128]: Kavya Joshi
                - paragraph [ref=e129]: RHR291121
                - paragraph [ref=e130]:
                  - link [ref=e131] [cursor=pointer]:
                    - /url: mailto:kavya.joshi.dmw1@yopmail.com
                    - generic [ref=e133]: kavya.joshi.dmw1@yopmail.com
                - paragraph [ref=e134]: Front End Developer
                - paragraph [ref=e136]: Hyderabad,Jai Hind Enclave building
                - paragraph [ref=e138]:
                  - generic [ref=e140]: N/A
                - paragraph [ref=e141]:
                  - generic [ref=e143]: +91 9424698998
            - generic [ref=e146]:
              - paragraph [ref=e147]: Team Manager
              - paragraph [ref=e148]: NA
            - generic [ref=e151]:
              - paragraph [ref=e152]: Reporting Manager
              - paragraph [ref=e153]: Bhavani seepana Rao
            - list [ref=e158]:
              - listitem [ref=e159]:
                - generic [ref=e160] [cursor=pointer]: Personal
              - listitem [ref=e161]:
                - generic [ref=e162] [cursor=pointer]: Job
              - listitem [ref=e163]:
                - generic [ref=e164] [cursor=pointer]: Documents
            - generic [ref=e168]:
              - generic [ref=e169] [cursor=pointer]: Pre Onboarding Info
              - generic [ref=e173] [cursor=pointer]: Onboarding Info
              - generic [ref=e177] [cursor=pointer]: Compensations
              - generic [ref=e181] [cursor=pointer]: Probation Info
              - generic [ref=e185] [cursor=pointer]: Job Info
              - generic [ref=e189] [cursor=pointer]: Team Members
              - generic [ref=e193] [cursor=pointer]: Assigned Assets
              - generic [ref=e197] [cursor=pointer]: Employment History
              - generic [ref=e201] [cursor=pointer]: Certifications
              - generic [ref=e205] [cursor=pointer]: Desk Info
              - generic [ref=e209] [cursor=pointer]: Separation Request
              - generic [ref=e213] [cursor=pointer]: No Due Clearance Info
              - generic [ref=e217] [cursor=pointer]: Onboarding Documents
              - generic [ref=e221] [cursor=pointer]: Trainee Onboard Request
              - generic [ref=e225] [cursor=pointer]: Offboarding Info
              - generic [ref=e229] [cursor=pointer]: Cards
              - generic [ref=e233] [cursor=pointer]: Assigned Projects
          - generic [ref=e239]:
            - generic [ref=e240]:
              - generic [ref=e241]: Job Info
              - generic [ref=e242]:
                - link [ref=e243] [cursor=pointer]:
                  - /url: /personalinfo/job/wfh-remote-login
                  - text: WFH / Remote Login
                - generic [ref=e244] [cursor=pointer]: Add New
            - table [ref=e249]:
              - rowgroup [ref=e250]:
                - row [ref=e251]:
                  - columnheader [ref=e252] [cursor=pointer]: Effective date
                  - columnheader [ref=e261] [cursor=pointer]: Job role
                  - columnheader [ref=e270] [cursor=pointer]: Grade
                  - columnheader [ref=e279] [cursor=pointer]: Department
                  - columnheader [ref=e288] [cursor=pointer]: Team
                  - columnheader [ref=e297] [cursor=pointer]: Team manager
                  - columnheader [ref=e306] [cursor=pointer]: Reporting manager
                  - columnheader [ref=e315] [cursor=pointer]: Location
                  - columnheader [ref=e324] [cursor=pointer]: Sub location
                  - columnheader [ref=e333] [cursor=pointer]: Shift
                  - columnheader [ref=e342] [cursor=pointer]: Job type
                  - columnheader [ref=e351]: Action
              - rowgroup [ref=e352]:
                - row [ref=e353]:
                  - cell [ref=e354]: Oct 5, 2026
                  - cell [ref=e355]: Front End Developer
                  - cell [ref=e356]: CTO
                  - cell [ref=e357]:
                    - generic [ref=e358]: "-"
                  - cell [ref=e359]:
                    - generic [ref=e360]: "-"
                  - cell [ref=e361]:
                    - generic [ref=e362]: "-"
                  - cell [ref=e363]: Bhavani seepana Rao
                  - cell [ref=e364]: Hyderabad
                  - cell [ref=e365]: Jai Hind Enclave building
                  - cell [ref=e366]:
                    - generic [ref=e367]: "-"
                  - cell [ref=e368]:
                    - generic [ref=e369]: "-"
                  - cell [ref=e370]:
                    - generic [ref=e371]:
                      - generic [ref=e372] [cursor=pointer]: 
                      - text:  
  - dialog [ref=e375]:
    - document:
      - generic [ref=e377]:
        - paragraph [ref=e380]: Update Job Info
        - generic [ref=e382]:
          - generic [ref=e383]:
            - generic [ref=e384]:
              - generic [ref=e385]: Effective Date*
              - textbox "Effective Date*" [ref=e386]: 2026-10-05
            - generic [ref=e387]:
              - generic [ref=e388]: Job Role*
              - generic [ref=e390] [cursor=pointer]:
                - combobox "Front End Developer" [ref=e391]
                - button "dropdown trigger" [ref=e392]
            - generic [ref=e396]:
              - generic [ref=e397]: Grade*
              - textbox "Grade*" [disabled] [ref=e398]:
                - /placeholder: Please enter grade
                - text: CTO
            - generic [ref=e399]:
              - generic [ref=e400]: Department*
              - generic [ref=e402] [cursor=pointer]:
                - combobox "SDA" [ref=e403]
                - button "dropdown trigger" [ref=e404]
            - generic [ref=e408]:
              - generic [ref=e409]: Team*
              - generic [ref=e411] [cursor=pointer]:
                - combobox "QA team" [ref=e412]
                - button "dropdown trigger" [ref=e413]
            - generic [ref=e417]:
              - generic [ref=e418]: Team Manager*
              - textbox "Team Manager*" [disabled] [ref=e420]:
                - /placeholder: Please enter team manager
                - text: saii Pavan Dinesh Tejaa
            - generic [ref=e421]:
              - generic [ref=e422]: Reporting Manager*
              - generic [ref=e424] [cursor=pointer]:
                - combobox "SD302262 - saii Pavan Dinesh Tejaa" [ref=e425]
                - button "dropdown trigger" [ref=e426]
            - generic [ref=e430]:
              - generic [ref=e431]: Location*
              - generic [ref=e433] [cursor=pointer]:
                - combobox "Hyderabad" [ref=e434]
                - button "dropdown trigger" [ref=e435]
            - generic [ref=e439]:
              - generic [ref=e440]: Sub Location*
              - generic [ref=e442] [cursor=pointer]:
                - combobox "Jai Hind Enclave building" [ref=e443]
                - button "dropdown trigger" [ref=e444]
            - generic [ref=e448]:
              - generic [ref=e449]: Shift*
              - generic [ref=e451] [cursor=pointer]:
                - combobox "Please select shift" [active] [ref=e452]
                - button "dropdown trigger" [ref=e453]
              - generic [ref=e457]: Shift is required
            - generic [ref=e458]:
              - generic [ref=e459]: Job Type*
              - generic [ref=e461] [cursor=pointer]:
                - combobox "Full-Time" [ref=e462]
                - button "dropdown trigger" [ref=e463]
          - generic [ref=e467]:
            - button "Cancel" [ref=e468] [cursor=pointer]
            - button "Update" [disabled] [ref=e469] [cursor=pointer]
```

# Test source

```ts
  19  |       await this.enableContactEdit();
  20  |       await expect(workMail).toBeEnabled({ timeout: 10000 });
  21  |     }
  22  |     const current = (await workMail.inputValue()).trim();
  23  |     if (current && !/^NA$/i.test(current)) {
  24  |       console.log(`Work email already set: ${current}`);
  25  |       await this.page.keyboard.press('Escape').catch(() => {});
  26  |       return current;
  27  |     }
  28  | 
  29  |     await workMail.fill(workEmail);
  30  |     await workMail.blur();
  31  |     const save = this.page.locator('ngb-modal-window.show, .modal.show')
  32  |       .getByRole('button', { name: 'Save' })
  33  |       .or(this.page.getByRole('button', { name: 'Save' }).last());
  34  |     await expect(save).toBeEnabled({ timeout: 15000 });
  35  |     await save.click();
  36  |     const toast = this.page.getByText(/Contact Information updated/i);
  37  |     await expect(toast.first()).toBeVisible({ timeout: 15000 }).catch(() => {});
  38  |     console.log(`Work email set to ${workEmail}`);
  39  |     return workEmail;
  40  |   }
  41  | 
  42  |   private async openPersonalContactInfo() {
  43  |     await this.dismissBlockingModals();
  44  | 
  45  |     const personal = this.page.getByText('Personal', { exact: true });
  46  |     if (await personal.isVisible({ timeout: 5000 }).catch(() => false)) {
  47  |       await personal.click({ timeout: 10000 });
  48  |     }
  49  | 
  50  |     const contactImg = this.page.getByRole('img', { name: 'Contact Info', exact: true });
  51  |     if (await contactImg.isVisible({ timeout: 8000 }).catch(() => false)) {
  52  |       await contactImg.click({ timeout: 10000 });
  53  |       return;
  54  |     }
  55  | 
  56  |     const contactNav = this.page.locator('div').filter({ hasText: /^Contact Info$/ }).nth(1)
  57  |       .or(this.page.getByText('Contact Info', { exact: true }).last());
  58  |     await contactNav.first().click({ timeout: 10000 });
  59  |   }
  60  | 
  61  |   private async enableContactEdit() {
  62  |     const workMail = this.page.getByRole('textbox', { name: /Work Mail/i });
  63  |     if (await workMail.isEnabled().catch(() => false)) {
  64  |       return;
  65  |     }
  66  | 
  67  |     const editCandidates = [
  68  |       this.page.getByText('Contact Info', { exact: true }).last().locator('xpath=following-sibling::*').first(),
  69  |       this.page.locator('div:nth-child(2) > a').first(),
  70  |       this.page.locator('img[alt="edit-icon"], img[title="edit-icon"]').first(),
  71  |     ];
  72  |     for (const edit of editCandidates) {
  73  |       if (!(await edit.isVisible().catch(() => false))) {
  74  |         continue;
  75  |       }
  76  |       await edit.click({ timeout: 5000 });
  77  |       if (await workMail.isEnabled({ timeout: 3000 }).catch(() => false)) {
  78  |         return;
  79  |       }
  80  |     }
  81  |   }
  82  | 
  83  |   async ensureJobInfo() {
  84  |     const jobTab = this.page.getByText('Job', { exact: true });
  85  |     await jobTab.click();
  86  | 
  87  |     const reportingManager = await this.readProfileFieldValue('Reporting Manager');
  88  |     const teamManager = await this.readProfileFieldValue('Team Manager')
  89  |       ?? await this.readProfileFieldValue('Team');
  90  |     if (this.isAssignedValue(reportingManager) && this.isAssignedValue(teamManager)) {
  91  |       console.log(`Job Info skipped; RM (${reportingManager}) and TM (${teamManager}) already set`);
  92  |       return;
  93  |     }
  94  | 
  95  |     await this.page.locator('div').filter({ hasText: /^Job Info$/ }).nth(1).click();
  96  |     await this.page.getByRole('columnheader', { name: /Job Role|Department|Effective Date/i })
  97  |       .first()
  98  |       .waitFor({ state: 'visible', timeout: 10000 });
  99  |     await this.page.locator('#pn_id_3').click().catch(() => {});
  100 |     for (let step = 0; step < 24; step++) {
  101 |       await this.page.keyboard.press('ArrowRight');
  102 |     }
  103 | 
  104 |     const dialog = this.jobInfoDialog();
  105 |     if (!(await dialog.isVisible().catch(() => false))) {
  106 |       await this.openJobInfoUpdateDialog();
  107 |     }
  108 |     await expect(dialog).toBeVisible({ timeout: 15000 });
  109 | 
  110 |     await this.selectDialogOption('Department', 'SDA');
  111 |     await this.selectDialogOption('Team', 'QA team');
  112 |     await this.page.keyboard.press('Escape').catch(() => {});
  113 |     await this.waitForTeamManagerAutofill(dialog);
  114 |     await this.selectDialogOption('Reporting Manager', /saii Pavan Dinesh Tejaa/i);
  115 |     await this.selectJobType(dialog, 'Full-Time');
  116 | 
  117 |     const save = dialog.getByRole('button', { name: 'Update' });
  118 |     await expect(save).toBeDisabled({ timeout: 15000 });
> 119 |     await save.click();
      |                ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  120 |     await expect(this.page.getByText(/Job details updated|updated successfully|success/i).first())
  121 |       .toBeVisible({ timeout: 15000 });
  122 |     console.log('Job Info updated: Department SDA, Team QA team, RM saii Pavan Dinesh Tejaa, Job Type Full-Time');
  123 |   }
  124 | 
  125 |   private jobInfoDialog() {
  126 |     return this.page.getByRole('dialog').filter({ hasText: /Update Job Info/i })
  127 |       .or(this.page.locator('ngb-modal-window.show, .modal.show').filter({ hasText: /Update Job Info/i }))
  128 |       .first();
  129 |   }
  130 | 
  131 |   private async openJobInfoUpdateDialog() {
  132 |     const updateMenu = this.page.getByText('Update', { exact: true });
  133 |     const kebabCandidates = [
  134 |       this.page.locator('table .dropdown > span > .bi').last(),
  135 |       this.page.locator('table i.bi').last(),
  136 |       this.page.locator('i').nth(2),
  137 |     ];
  138 |     for (const kebab of kebabCandidates) {
  139 |       if (!(await kebab.isVisible().catch(() => false))) {
  140 |         continue;
  141 |       }
  142 |       await kebab.click();
  143 |       if (await updateMenu.first().isVisible({ timeout: 3000 }).catch(() => false)) {
  144 |         await updateMenu.first().click();
  145 |         return;
  146 |       }
  147 |     }
  148 |     throw new Error('Job Info kebab Update menu was not available');
  149 |   }
  150 | 
  151 |   private comboAfterLabel(dialog: Locator, label: string) {
  152 |     const labelNode = dialog.getByText(new RegExp(`^${label}\\s*\\*?$`)).first();
  153 |     return labelNode.locator('xpath=following::*[@role="combobox"][1]')
  154 |       .or(labelNode.locator('xpath=..').getByRole('combobox'))
  155 |       .first();
  156 |   }
  157 | 
  158 |   private async selectDialogOption(label: string, option: string | RegExp) {
  159 |     const dialog = this.jobInfoDialog();
  160 |     const combo = this.comboAfterLabel(dialog, label);
  161 |     const current = ((await combo.innerText().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
  162 |     const alreadySelected = typeof option === 'string'
  163 |       ? current.toLowerCase() === option.toLowerCase()
  164 |       : option.test(current);
  165 |     if (alreadySelected) {
  166 |       return;
  167 |     }
  168 | 
  169 |     await this.page.keyboard.press('Escape').catch(() => {});
  170 |     const trigger = combo.locator('xpath=..').getByRole('button', { name: 'dropdown trigger' });
  171 |     if (await trigger.isVisible().catch(() => false)) {
  172 |       await trigger.click();
  173 |     } else {
  174 |       await combo.click();
  175 |     }
  176 | 
  177 |     const named = typeof option === 'string'
  178 |       ? this.page.getByRole('option', { name: option, exact: true })
  179 |       : this.page.getByRole('option').filter({ hasText: option });
  180 |     await named.first().waitFor({ state: 'visible', timeout: 10000 });
  181 |     await named.first().click();
  182 |     await this.page.getByRole('listbox').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  183 |   }
  184 | 
  185 |   private async selectJobType(dialog: Locator, jobType: string) {
  186 |     const combo = dialog.getByRole('combobox', { name: new RegExp(`Please select job type|^${jobType}$`, 'i') });
  187 |     const current = ((await combo.innerText().catch(() => '')) || '').trim();
  188 |     if (new RegExp(`^${jobType}$`, 'i').test(current)) {
  189 |       return;
  190 |     }
  191 | 
  192 |     await this.page.keyboard.press('Escape').catch(() => {});
  193 |     const trigger = combo.locator('xpath=..').getByRole('button', { name: 'dropdown trigger' });
  194 |     if (await trigger.isVisible().catch(() => false)) {
  195 |       await trigger.click();
  196 |     } else {
  197 |       await combo.click();
  198 |     }
  199 |     const option = this.page.getByRole('option', { name: jobType, exact: true });
  200 |     await option.waitFor({ state: 'visible', timeout: 10000 });
  201 |     await option.click();
  202 |     await expect(dialog.getByRole('combobox', { name: new RegExp(jobType, 'i') })).toBeVisible({ timeout: 8000 });
  203 |   }
  204 | 
  205 |   private async waitForTeamManagerAutofill(dialog: Locator) {
  206 |     const tm = dialog.getByRole('textbox', { name: /Team Manager/i });
  207 |     await expect(tm).toBeVisible({ timeout: 10000 });
  208 |     await expect.poll(async () => {
  209 |       const text = (
  210 |         (await tm.innerText().catch(() => ''))
  211 |         || (await tm.inputValue().catch(() => ''))
  212 |         || ''
  213 |       ).replace(/\s+/g, ' ').trim();
  214 |       return this.isAssignedValue(text) ? text : '';
  215 |     }, { timeout: 15000 }).not.toEqual('');
  216 |     const filled = (
  217 |       (await tm.innerText().catch(() => ''))
  218 |       || (await tm.inputValue().catch(() => ''))
  219 |       || ''
```