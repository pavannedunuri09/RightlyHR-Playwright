# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: manage-shifts.spec.ts >> Manage Shifts >> TC05 - should create a new shift
- Location: tests\manage-shifts.spec.ts:226:7

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByText('Kerala', { exact: true })

```

# Page snapshot

```yaml
- generic [ref=f2e4]:
  - generic [ref=f2e8]:
    - img "Company Logo" [ref=f2e10]
    - generic [ref=f2e11]:
      - generic [ref=f2e12] [cursor=pointer]
      - generic [ref=f2e20] [cursor=pointer]: 
      - generic [ref=f2e24] [cursor=pointer]
      - generic [ref=f2e34] [cursor=pointer]:
        - generic [ref=f2e35]:
          - paragraph [ref=f2e36]: Pavan sai Dinesh Nedunuri
          - paragraph [ref=f2e37]: QA Tester
        - img "Profile Image" [ref=f2e39]
  - generic [ref=f2e40]:
    - generic [ref=f2e43]:
      - list [ref=f2e45]:
        - listitem [ref=f2e46] [cursor=pointer]:
          - img "Icon" [ref=f2e47]
          - text: Dashboard
        - listitem [ref=f2e48]:
          - generic [ref=f2e49]:
            - generic [ref=f2e50] [cursor=pointer]:
              - img "Icon" [ref=f2e51]
              - text: My Info
            - generic [ref=f2e52] [cursor=pointer]:
              - img "Icon" [ref=f2e53]
              - text: Employees
            - generic [ref=f2e54] [cursor=pointer]:
              - img "Icon" [ref=f2e55]
              - text: Policies
            - generic [ref=f2e56] [cursor=pointer]:
              - img "Icon" [ref=f2e57]
              - text: Pending Approvals
            - generic [ref=f2e58] [cursor=pointer]:
              - img "Icon" [ref=f2e59]
              - text: Reports
            - generic [ref=f2e60] [cursor=pointer]:
              - img "Icon" [ref=f2e61]
              - text: Holidays
            - generic [ref=f2e62] [cursor=pointer]:
              - img "Icon" [ref=f2e63]
              - text: Cards Management
            - generic [ref=f2e64] [cursor=pointer]:
              - img "Icon" [ref=f2e65]
              - text: Expenses
            - generic [ref=f2e66] [cursor=pointer]:
              - img "Icon" [ref=f2e67]
              - text: IT Support
            - generic [ref=f2e68] [cursor=pointer]:
              - img "Icon" [ref=f2e69]
              - text: Skill Set
            - generic [ref=f2e72] [cursor=pointer]:
              - img "Icon" [ref=f2e73]
              - text: Project Management
            - generic [ref=f2e76] [cursor=pointer]:
              - img "Icon" [ref=f2e77]
              - text: ATS
            - generic [ref=f2e80] [cursor=pointer]:
              - img "Icon" [ref=f2e81]
              - text: PMS
            - generic [ref=f2e84] [cursor=pointer]:
              - img "Icon" [ref=f2e85]
              - text: Time Off
        - listitem [ref=f2e86] [cursor=pointer]:
          - img "Icons" [ref=f2e89]
      - img "Powered By logo" [ref=f2e92]
    - generic [ref=f2e100]:
      - generic [ref=f2e102]:
        - generic [ref=f2e103] [cursor=pointer]:
          - text: Manage Shifts
          - generic [ref=f2e104]: 
        - generic [ref=f2e105]: Add Shifts
      - generic [ref=f2e106]:
        - generic [ref=f2e107]:
          - generic [ref=f2e108]:
            - generic [ref=f2e109]:
              - generic [ref=f2e110]: Year *
              - generic [ref=f2e112] [cursor=pointer]:
                - combobox "2026" [ref=f2e113]
                - button "dropdown trigger" [ref=f2e114]
            - generic [ref=f2e118]:
              - generic [ref=f2e119]: Location *
              - generic [ref=f2e121] [cursor=pointer]:
                - combobox "Please select location" [expanded] [active] [ref=f2e122]
                - button "dropdown trigger" [expanded] [ref=f2e123]
                - listbox "Option List" [ref=f2e132]:
                  - option "Andhra Prades" [ref=f2e134]
                  - option "Bangalore" [ref=f2e137]
                  - option "California" [ref=f2e140]
                  - option "Coimbatore" [ref=f2e143]
                  - option "Delhi" [ref=f2e146]
                  - option "Gujarat" [ref=f2e149]
                  - option "Hyderabad" [ref=f2e152]
                  - option "Kerela" [ref=f2e155]
                  - option "Mumbai" [ref=f2e158]
                  - option "Pune" [ref=f2e161]
                  - option "sdsd" [ref=f2e164]
                  - option "Tamilnadu" [ref=f2e167]
                  - option "USA" [ref=f2e170]
                  - option "Vijayawada" [ref=f2e173]
            - generic [ref=f2e176]:
              - generic [ref=f2e177]: Sub Location*
              - generic [ref=f2e178]:
                - generic:
                  - combobox "Please select sub location" [disabled]
                  - button "dropdown trigger"
            - button " Add New" [ref=f2e180] [cursor=pointer]:
              - generic [ref=f2e181]: 
              - text: Add New
          - generic [ref=f2e183]:
            - generic [ref=f2e184]:
              - generic [ref=f2e185]:
                - generic [ref=f2e186]: Shift Code *
                - textbox "Please enter shift code" [ref=f2e187]
              - generic [ref=f2e188]:
                - generic [ref=f2e189]: Shift Name*
                - textbox "Please enter shift name" [ref=f2e190]
              - generic [ref=f2e191]:
                - generic [ref=f2e192]: Color
                - textbox [ref=f2e193]: "#ffffff"
              - generic [ref=f2e194]:
                - generic [ref=f2e195]: Start Time*
                - textbox [ref=f2e196]
              - generic [ref=f2e197]:
                - generic [ref=f2e198]:
                  - generic [ref=f2e199]: End Time *
                  - button "" [ref=f2e202] [cursor=pointer]
                - textbox [ref=f2e204]
            - generic [ref=f2e205]:
              - generic [ref=f2e206]:
                - generic [ref=f2e207]: Allowed Grace Period (mins)*
                - spinbutton "Please enter Grace period" [ref=f2e208]: "15"
              - generic [ref=f2e209]:
                - generic [ref=f2e210]: Lates Allowed(Days)*
                - spinbutton "Please enter Lates allowed" [ref=f2e211]: "3"
              - generic [ref=f2e212]:
                - generic [ref=f2e213]: Allowed Break Time(Hrs)*
                - spinbutton "Please enter Break time" [ref=f2e214]: "1"
              - generic [ref=f2e215]:
                - generic [ref=f2e216]: Half Day Min Hrs*
                - spinbutton "Please enter Half day min hrs" [ref=f2e217]: "3"
              - generic [ref=f2e218]:
                - generic [ref=f2e219]: Full Day Min Hrs*
                - spinbutton "Please enter Full day min hrs" [ref=f2e220]: "6"
              - generic [ref=f2e221]:
                - generic [ref=f2e222]:
                  - generic [ref=f2e223]: Pre-Shift Buffer (mins) *
                  - generic [ref=f2e225] [cursor=pointer]
                - spinbutton "Please enter pre-shift buffer" [ref=f2e230]: "0"
              - generic [ref=f2e231]:
                - generic [ref=f2e232]:
                  - generic [ref=f2e233]: Post-Shift Buffer (mins)
                  - generic [ref=f2e235] [cursor=pointer]
                - spinbutton "Please enter post-shift buffer" [ref=f2e240]: "0"
        - generic [ref=f2e241]:
          - button "Cancel" [ref=f2e242] [cursor=pointer]
          - button "Submit" [disabled] [ref=f2e243] [cursor=pointer]
```

# Test source

```ts
  118 | 
  119 |     this.allowedBreakTimeInput =
  120 |       page.getByRole('spinbutton').nth(2);
  121 | 
  122 |     this.halfDayMinHrsInput =
  123 |       page.getByRole('spinbutton').nth(3);
  124 | 
  125 |     this.fullDayMinHrsInput =
  126 |       page.getByRole('spinbutton').nth(4);
  127 | 
  128 |     this.preShiftBufferInput =
  129 |       page.getByRole('spinbutton', {
  130 |         name: 'Please enter pre-shift buffer'
  131 |       });
  132 | 
  133 |     this.postShiftBufferInput =
  134 |       page.getByRole('spinbutton', {
  135 |         name: 'Please enter post-shift buffer'
  136 |       });
  137 | 
  138 |     // =========================================================
  139 |     // BUTTONS
  140 |     // =========================================================
  141 | 
  142 |     this.submitButton =
  143 |       page.getByRole('button', {
  144 |         name: 'Submit',
  145 |         exact: true
  146 |       });
  147 | 
  148 |     this.cancelButton =
  149 |       page.getByRole('button', {
  150 |         name: 'Cancel',
  151 |         exact: true
  152 |       });
  153 | 
  154 |     this.updateButton =
  155 |       page.getByRole('button', {
  156 |         name: 'Update',
  157 |         exact: true
  158 |       });
  159 | 
  160 |     this.publishButton =
  161 |       page.getByRole('button', {
  162 |         name: 'Publish',
  163 |         exact: true
  164 |       });
  165 | 
  166 |     this.cloneButton =
  167 |       page.getByRole('button', {
  168 |         name: 'Clone',
  169 |         exact: true
  170 |       });
  171 |   }
  172 | 
  173 |   // =========================================================
  174 |   // NAVIGATION
  175 |   // =========================================================
  176 | 
  177 |   async goto() {
  178 |     await this.page.goto(
  179 |       '/settings/employee-fields/manage-shifts/pending-for-submit',
  180 |       {
  181 |         waitUntil: 'domcontentloaded'
  182 |       }
  183 |     );
  184 |   }
  185 | 
  186 |   async openPublished() {
  187 |     await this.publishedTab.click();
  188 |   }
  189 | 
  190 |   async clickAddNew() {
  191 |     await this.addNewButton.click();
  192 |   }
  193 | 
  194 |   async openUpdate() {
  195 |     const actionCell = this.page
  196 |       .getByRole('row')
  197 |       .nth(1)
  198 |       .getByRole('cell')
  199 |       .last();
  200 | 
  201 |     await actionCell.locator('div').first().click();
  202 | 
  203 |     await actionCell
  204 |       .getByText('Update', { exact: true })
  205 |       .filter({ visible: true })
  206 |       .click();
  207 |   }
  208 | 
  209 |   // =========================================================
  210 |   // DROPDOWN ACTIONS
  211 |   // =========================================================
  212 | 
  213 |   async selectLocation(location: string) {
  214 |     await this.locationDropdown.click();
  215 | 
  216 |     await this.page.getByText(location, {
  217 |       exact: true
> 218 |     }).click();
      |        ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  219 |   }
  220 | 
  221 |   async selectSubLocation(subLocation: string) {
  222 |     await this.subLocationDropdown.click();
  223 | 
  224 |     await this.page.getByText(subLocation, {
  225 |       exact: true
  226 |     }).click();
  227 |   }
  228 |   async openView() {
  229 |   await this.page.locator('.text-center > .dropdown').first().click();
  230 |   await this.page.getByText('View', { exact: true }).first().click();
  231 | }
  232 | async openClone() {
  233 |   await this.page.locator('.text-center > .dropdown').first().click();
  234 |   await this.page.getByText('Clone', { exact: true }).first().click();
  235 | }
  236 | 
  237 | 
  238 |   // =========================================================
  239 |   // SHIFT DETAILS
  240 |   // =========================================================
  241 | 
  242 |   async fillShiftDetails(data: {
  243 |     shiftCode: string;
  244 |     shiftName: string;
  245 |     startTime: string;
  246 |     endTime: string;
  247 |     allowedGracePeriod?: string;
  248 |     latesAllowed?: string;
  249 |     allowedBreakTime?: string;
  250 |     halfDayMinHrs?: string;
  251 |     fullDayMinHrs?: string;
  252 |     preShiftBuffer?: string;
  253 |     postShiftBuffer?: string;
  254 |   }) {
  255 |     await this.shiftCodeInput.fill(data.shiftCode);
  256 | 
  257 |     await this.shiftNameInput.fill(data.shiftName);
  258 | 
  259 |     await this.startTimeInput.fill(data.startTime);
  260 | 
  261 |     await this.endTimeInput.fill(data.endTime);
  262 | 
  263 |     if (data.allowedGracePeriod !== undefined) {
  264 |       await this.allowedGracePeriodInput.fill(
  265 |         data.allowedGracePeriod
  266 |       );
  267 |     }
  268 | 
  269 |     if (data.latesAllowed !== undefined) {
  270 |       await this.latesAllowedInput.fill(
  271 |         data.latesAllowed
  272 |       );
  273 |     }
  274 | 
  275 |     if (data.allowedBreakTime !== undefined) {
  276 |       await this.allowedBreakTimeInput.fill(
  277 |         data.allowedBreakTime
  278 |       );
  279 |     }
  280 | 
  281 |     if (data.halfDayMinHrs !== undefined) {
  282 |       await this.halfDayMinHrsInput.fill(
  283 |         data.halfDayMinHrs
  284 |       );
  285 |     }
  286 | 
  287 |     if (data.fullDayMinHrs !== undefined) {
  288 |       await this.fullDayMinHrsInput.fill(
  289 |         data.fullDayMinHrs
  290 |       );
  291 |     }
  292 | 
  293 |     if (data.preShiftBuffer !== undefined) {
  294 |       await this.preShiftBufferInput.fill(
  295 |         data.preShiftBuffer
  296 |       );
  297 |     }
  298 | 
  299 |     if (data.postShiftBuffer !== undefined) {
  300 |       await this.postShiftBufferInput.fill(
  301 |         data.postShiftBuffer
  302 |       );
  303 |     }
  304 |   }
  305 | 
  306 |   // =========================================================
  307 |   // BUTTON ACTIONS
  308 |   // =========================================================
  309 | 
  310 |   async submit() {
  311 |     await this.submitButton.click();
  312 |   }
  313 | 
  314 |   async cancel() {
  315 |     await this.cancelButton.click();
  316 |   }
  317 | 
  318 |   async update() {
```