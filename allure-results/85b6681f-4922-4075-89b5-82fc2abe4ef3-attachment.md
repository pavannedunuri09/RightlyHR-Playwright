# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Contract.spec.ts >> Contract Flow - Part 1 >> TC05 - HR should submit mandatory fields and click Submit button
- Location: tests\Contract.spec.ts:129:13

# Error details

```
Error: locator.click: Error: strict mode violation: getByText('Jai Hind Enclave building') resolved to 21 elements:
    1) <span class="ng-star-inserted" _ngcontent-ng-c3000522930=""> Jai Hind Enclave building </span> aka getByText('Jai Hind Enclave building').first()
    2) <span class="ng-star-inserted" _ngcontent-ng-c3000522930=""> Jai Hind Enclave building </span> aka getByText('Jai Hind Enclave building').nth(1)
    3) <span class="ng-star-inserted" _ngcontent-ng-c3000522930=""> Jai Hind Enclave building </span> aka getByText('Jai Hind Enclave building').nth(2)
    4) <span class="ng-star-inserted" _ngcontent-ng-c3000522930=""> Jai Hind Enclave building </span> aka getByText('Jai Hind Enclave building').nth(3)
    5) <span class="ng-star-inserted" _ngcontent-ng-c3000522930=""> Jai Hind Enclave building </span> aka getByText('Jai Hind Enclave building').nth(4)
    6) <span class="ng-star-inserted" _ngcontent-ng-c3000522930=""> Jai Hind Enclave building </span> aka getByText('Jai Hind Enclave building').nth(5)
    7) <span class="ng-star-inserted" _ngcontent-ng-c3000522930=""> Jai Hind Enclave building </span> aka locator('tr:nth-child(8) > td:nth-child(6) > .ng-star-inserted')
    8) <span class="ng-star-inserted" _ngcontent-ng-c3000522930=""> Jai Hind Enclave building </span> aka locator('tr:nth-child(9) > td:nth-child(6) > .ng-star-inserted')
    9) <span class="ng-star-inserted" _ngcontent-ng-c3000522930=""> Jai Hind Enclave building </span> aka locator('tr:nth-child(10) > td:nth-child(6) > .ng-star-inserted')
    10) <span class="ng-star-inserted" _ngcontent-ng-c3000522930=""> Jai Hind Enclave building </span> aka locator('tr:nth-child(11) > td:nth-child(6) > .ng-star-inserted')
    ...

Call log:
  - waiting for getByText('Jai Hind Enclave building')

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
          - generic [ref=e102]:
            - generic [ref=e103]:
              - text: All Employees
              - generic [ref=e104]: 
            - generic [ref=e106]: Prospective Contractors
            - generic [ref=e109] [cursor=pointer]
          - generic [ref=e113]:
            - button [ref=e114] [cursor=pointer]: Add Contract Employee
            - button [ref=e115] [cursor=pointer]: Invite User
            - button [ref=e116] [cursor=pointer]: Generate Documents
            - button [ref=e119] [cursor=pointer]:
              - generic [ref=e120]: 
              - text: Applicable Policies
        - generic [ref=e121]:
          - list [ref=e124]:
            - listitem [ref=e125]:
              - generic [ref=e126] [cursor=pointer]:
                - generic [ref=e128]: Active
                - generic [ref=e129]: (204)
            - listitem [ref=e131]:
              - generic [ref=e132] [cursor=pointer]:
                - generic [ref=e134]: Prospective
                - generic [ref=e135]: (946)
            - listitem [ref=e137]:
              - generic [ref=e138] [cursor=pointer]:
                - generic [ref=e140]: Probation
                - generic [ref=e141]: (68)
            - listitem [ref=e143]:
              - generic [ref=e144] [cursor=pointer]:
                - generic [ref=e146]: Inactive
                - generic [ref=e147]: (117)
          - generic [ref=e148]:
            - tablist [ref=e153]:
              - tab [ref=e154] [cursor=pointer]:
                - link [ref=e155]:
                  - /url: /employee-management/prospective/employees
                  - text: Employees (694)
              - tab [ref=e156] [cursor=pointer]:
                - link [ref=e157]:
                  - /url: /employee-management/prospective/interns
                  - text: Trainees (225)
              - tab [selected] [ref=e158] [cursor=pointer]:
                - link [ref=e159]:
                  - /url: /employee-management/prospective/contract
                  - text: Contractors (27)
            - generic [ref=e162]:
              - generic [ref=e163]:
                - generic [ref=e164]: 
                - searchbox [ref=e166]
              - table [ref=e171]:
                - rowgroup [ref=e172]:
                  - row [ref=e173]:
                    - columnheader [ref=e174] [cursor=pointer]: Employee ID
                    - columnheader [ref=e183] [cursor=pointer]: Employee Name
                    - columnheader [ref=e192] [cursor=pointer]: Personal Email
                    - columnheader [ref=e201] [cursor=pointer]: Phone Number
                    - columnheader [ref=e210] [cursor=pointer]: Location
                    - columnheader [ref=e219] [cursor=pointer]: Sub Location
                    - columnheader [ref=e228] [cursor=pointer]: Designation
                    - columnheader [ref=e237] [cursor=pointer]: Sub Status
                - rowgroup [ref=e246]:
                  - row [ref=e247]:
                    - cell [ref=e248]: "12719"
                    - cell [ref=e249]:
                      - generic [ref=e250]: sinhania rathod
                    - cell [ref=e251]: rathodsinhania@yopmail.com
                    - cell [ref=e252]: +91 8765553553
                    - cell [ref=e253]: "-"
                    - cell [ref=e254]: "-"
                    - cell [ref=e255]: "-"
                    - cell [ref=e256]: NDA Letter Released
                  - row [ref=e257]:
                    - cell [ref=e258]: "13037"
                    - cell [ref=e259]:
                      - generic [ref=e260]: prospec contractor
                    - cell [ref=e261]: proscon1789578142043@yopmail.com
                    - cell [ref=e262]: "-"
                    - cell [ref=e263]: Hyderabad
                    - cell [ref=e264]: Jai Hind Enclave building
                    - cell [ref=e265]: Director of HR
                    - cell [ref=e266]: Employee Created
                  - row [ref=e267]:
                    - cell [ref=e268]: "13038"
                    - cell [ref=e269]:
                      - generic [ref=e270]: prospec contractor
                    - cell [ref=e271]: proscon1789578287284@yopmail.com
                    - cell [ref=e272]: "-"
                    - cell [ref=e273]: Hyderabad
                    - cell [ref=e274]: Jai Hind Enclave building
                    - cell [ref=e275]: Director of HR
                    - cell [ref=e276]: Employee Created
                  - row [ref=e277]:
                    - cell [ref=e278]: "13039"
                    - cell [ref=e279]:
                      - generic [ref=e280]: Vikram Rao
                    - cell [ref=e281]: proscon1789578958191@yopmail.com
                    - cell [ref=e282]: "-"
                    - cell [ref=e283]: Hyderabad
                    - cell [ref=e284]: Jai Hind Enclave building
                    - cell [ref=e285]: Director of HR
                    - cell [ref=e286]: Requested Documents
                  - row [ref=e287]:
                    - cell [ref=e288]: "13040"
                    - cell [ref=e289]:
                      - generic [ref=e290]: Kiran Reddy
                    - cell [ref=e291]: Kiran.Reddy@yopmail.com
                    - cell [ref=e292]: "-"
                    - cell [ref=e293]: Hyderabad
                    - cell [ref=e294]: Jai Hind Enclave building
                    - cell [ref=e295]: Director of HR
                    - cell [ref=e296]: Requested Documents
                  - row [ref=e297]:
                    - cell [ref=e298]: "13041"
                    - cell [ref=e299]:
                      - generic [ref=e300]: Prakash Sharma
                    - cell [ref=e301]: Prakash.Sharma@yopmail.com
                    - cell [ref=e302]: "-"
                    - cell [ref=e303]: Hyderabad
                    - cell [ref=e304]: Jai Hind Enclave building
                    - cell [ref=e305]: Director of HR
                    - cell [ref=e306]: Requested Documents
                  - row [ref=e307]:
                    - cell [ref=e308]: "13027"
                    - cell [ref=e309]:
                      - generic [ref=e310]: prospec contractorkuzg
                    - cell [ref=e311]: proscon1789125757579@yopmail.com
                    - cell [ref=e312]: +91 9874544645
                    - cell [ref=e313]: Hyderabad
                    - cell [ref=e314]: Jai Hind Enclave building
                    - cell [ref=e315]: Front End Developer
                    - cell [ref=e316]: NDA Letter Accepted
                  - row [ref=e317]:
                    - cell [ref=e318]: "13042"
                    - cell [ref=e319]:
                      - generic [ref=e320]: Anil Kumar
                    - cell [ref=e321]: Anil.Kumar@yopmail.com
                    - cell [ref=e322]: "-"
                    - cell [ref=e323]: Hyderabad
                    - cell [ref=e324]: Jai Hind Enclave building
                    - cell [ref=e325]: Director of HR
                    - cell [ref=e326]: Requested Documents
                  - row [ref=e327]:
                    - cell [ref=e328]: "13043"
                    - cell [ref=e329]:
                      - generic [ref=e330]: Arjun Naidu
                    - cell [ref=e331]: Arjun.Naidu@yopmail.com
                    - cell [ref=e332]: +91 9874544645
                    - cell [ref=e333]: Hyderabad
                    - cell [ref=e334]: Jai Hind Enclave building
                    - cell [ref=e335]: Director of HR
                    - cell [ref=e336]: Requested Documents
                  - row [ref=e337]:
                    - cell [ref=e338]: "13028"
                    - cell [ref=e339]:
                      - generic [ref=e340]: prospec contractorujvd
                    - cell [ref=e341]: proscon1789130176990@yopmail.com
                    - cell [ref=e342]: +91 9874544645
                    - cell [ref=e343]: Hyderabad
                    - cell [ref=e344]: Jai Hind Enclave building
                    - cell [ref=e345]: Front End Developer
                    - cell [ref=e346]: NDA Letter Accepted
                  - row [ref=e347]:
                    - cell [ref=e348]: "13029"
                    - cell [ref=e349]:
                      - generic [ref=e350]: prospec contractorwpnh
                    - cell [ref=e351]: proscon1789134084824@yopmail.com
                    - cell [ref=e352]: +91 9874544645
                    - cell [ref=e353]: Hyderabad
                    - cell [ref=e354]: Jai Hind Enclave building
                    - cell [ref=e355]: Front End Developer
                    - cell [ref=e356]: NDA Letter Accepted
                  - row [ref=e357]:
                    - cell [ref=e358]: "13044"
                    - cell [ref=e359]:
                      - generic [ref=e360]: Ravi Chandra
                    - cell [ref=e361]: Ravi.Chandra@yopmail.com
                    - cell [ref=e362]: +91 9874544645
                    - cell [ref=e363]: Hyderabad
                    - cell [ref=e364]: Jai Hind Enclave building
                    - cell [ref=e365]: Director of HR
                    - cell [ref=e366]: Requested Documents
                  - row [ref=e367]:
                    - cell [ref=e368]: "13030"
                    - cell [ref=e369]:
                      - generic [ref=e370]: prospec contractorhvwc
                    - cell [ref=e371]: proscon1789135053836@yopmail.com
                    - cell [ref=e372]: +91 9874544645
                    - cell [ref=e373]: Hyderabad
                    - cell [ref=e374]: Jai Hind Enclave building
                    - cell [ref=e375]: Front End Developer
                    - cell [ref=e376]: Documents Verified
                  - row [ref=e377]:
                    - cell [ref=e378]: "13045"
                    - cell [ref=e379]:
                      - generic [ref=e380]: Kiran Iyer
                    - cell [ref=e381]: Kiran.Iyer@yopmail.com
                    - cell [ref=e382]: +91 9874544645
                    - cell [ref=e383]: Hyderabad
                    - cell [ref=e384]: Jai Hind Enclave building
                    - cell [ref=e385]: Director of HR
                    - cell [ref=e386]: Requested Documents
                  - row [ref=e387]:
                    - cell [ref=e388]: "12700"
                    - cell [ref=e389]:
                      - generic [ref=e390]: sasi kumari
                    - cell [ref=e391]: kumarisasi@yopmail.com
                    - cell [ref=e392]: +91 8754749033
                    - cell [ref=e393]: "-"
                    - cell [ref=e394]: "-"
                    - cell [ref=e395]: "-"
                    - cell [ref=e396]: NDA Letter Released
                  - row [ref=e397]:
                    - cell [ref=e398]: "13046"
                    - cell [ref=e399]:
                      - generic [ref=e400]: Vikram Reddy
                    - cell [ref=e401]: Vikram.Reddy@yopmail.com
                    - cell [ref=e402]: "-"
                    - cell [ref=e403]: Hyderabad
                    - cell [ref=e404]: Jai Hind Enclave building
                    - cell [ref=e405]: Director of HR
                    - cell [ref=e406]: Requested Documents
                  - row [ref=e407]:
                    - cell [ref=e408]: "13047"
                    - cell [ref=e409]:
                      - generic [ref=e410]: Mahesh Kumar
                    - cell [ref=e411]: Mahesh.Kumar@yopmail.com
                    - cell [ref=e412]: "-"
                    - cell [ref=e413]: Hyderabad
                    - cell [ref=e414]: Jai Hind Enclave building
                    - cell [ref=e415]: Director of HR
                    - cell [ref=e416]: Requested Documents
                  - row [ref=e417]:
                    - cell [ref=e418]: "12740"
                    - cell [ref=e419]:
                      - generic [ref=e420]: Roshni Iyer
                    - cell [ref=e421]: Roshni@yopmail.com
                    - cell [ref=e422]: +91 9567567677
                    - cell [ref=e423]: "-"
                    - cell [ref=e424]: "-"
                    - cell [ref=e425]: "-"
                    - cell [ref=e426]: NDA Letter Released
                  - row [ref=e427]:
                    - cell [ref=e428]: "12984"
                    - cell [ref=e429]:
                      - generic [ref=e430]: Contract Employee
                    - cell [ref=e431]: contract.1788966844427161@yopmail.com
                    - cell [ref=e432]: "-"
                    - cell [ref=e433]: Hyderabad
                    - cell [ref=e434]: Jai Hind Enclave building
                    - cell [ref=e435]: Front End Developer
                    - cell [ref=e436]: Employee Created
                  - row [ref=e437]:
                    - cell [ref=e438]: "12711"
                    - cell [ref=e439]:
                      - generic [ref=e440]: rakesh mittal
                    - cell [ref=e441]: rakeshmittal@yopmail.com
                    - cell [ref=e442]: +91 8776487684
                    - cell [ref=e443]: "-"
                    - cell [ref=e444]: "-"
                    - cell [ref=e445]: "-"
                    - cell [ref=e446]: Offer Letter Generated
                  - row [ref=e447]:
                    - cell [ref=e448]: "13004"
                    - cell [ref=e449]:
                      - generic [ref=e450]: prospec contractoripvb
                    - cell [ref=e451]: proscon1789052288364@yopmail.com
                    - cell [ref=e452]: +91 9874544645
                    - cell [ref=e453]: Hyderabad
                    - cell [ref=e454]: Jai Hind Enclave building
                    - cell [ref=e455]: Front End Developer
                    - cell [ref=e456]: Documents Submitted
                  - row [ref=e457]:
                    - cell [ref=e458]: "12680"
                    - cell [ref=e459]:
                      - generic [ref=e460]: Julie James
                    - cell [ref=e461]: jj@yopmail.com
                    - cell [ref=e462]: +91 8549612473
                    - cell [ref=e463]: "-"
                    - cell [ref=e464]: "-"
                    - cell [ref=e465]: "-"
                    - cell [ref=e466]: Offer Letter Released
                  - row [ref=e467]:
                    - cell [ref=e468]: "13005"
                    - cell [ref=e469]:
                      - generic [ref=e470]: prospec contractoronfd
                    - cell [ref=e471]: proscon1789059820078@yopmail.com
                    - cell [ref=e472]: +91 9874544645
                    - cell [ref=e473]: Hyderabad
                    - cell [ref=e474]: Jai Hind Enclave building
                    - cell [ref=e475]: Front End Developer
                    - cell [ref=e476]: Documents Submitted
                  - row [ref=e477]:
                    - cell [ref=e478]: "13006"
                    - cell [ref=e479]:
                      - generic [ref=e480]: prospec contractorefrd
                    - cell [ref=e481]: proscon1789060682194@yopmail.com
                    - cell [ref=e482]: +91 9874544645
                    - cell [ref=e483]: Hyderabad
                    - cell [ref=e484]: Jai Hind Enclave building
                    - cell [ref=e485]: Front End Developer
                    - cell [ref=e486]: Documents Submitted
                  - row [ref=e487]:
                    - cell [ref=e488]: "12672"
                    - cell [ref=e489]:
                      - generic [ref=e490]: James Tets
                    - cell [ref=e491]: tt@yopmail.com
                    - cell [ref=e492]: +91 1234568566
                    - cell [ref=e493]: "-"
                    - cell [ref=e494]: "-"
                    - cell [ref=e495]: "-"
                    - cell [ref=e496]: Requested Documents
                  - row [ref=e497]:
                    - cell [ref=e498]: "13036"
                    - cell [ref=e499]:
                      - generic [ref=e500]: prospec contractor
                    - cell [ref=e501]: proscon1789577970616@yopmail.com
                    - cell [ref=e502]: "-"
                    - cell [ref=e503]: Hyderabad
                    - cell [ref=e504]: Jai Hind Enclave building
                    - cell [ref=e505]: Director of HR
                    - cell [ref=e506]: Requested Documents
                  - row [ref=e507]:
                    - cell [ref=e508]: "12701"
                    - cell [ref=e509]:
                      - generic [ref=e510]: sathish jonnala
                    - cell [ref=e511]: jonnalasathish@yopmail.com
                    - cell [ref=e512]: +91 7884747883
                    - cell [ref=e513]: Hyderabad
                    - cell [ref=e514]: Gachibowli
                    - cell [ref=e515]: Director of Customer Success
                    - cell [ref=e516]: Offer Letter Regenerated
                  - row [ref=e517]:
                    - cell [ref=e518]: "12580"
                    - cell [ref=e519]:
                      - generic [ref=e520]: Jagadeesh G
                    - cell [ref=e521]: jagadeeshmca18@gmail.com
                    - cell [ref=e522]: +91 9565463565
                    - cell [ref=e523]: Hyderabad
                    - cell [ref=e524]: Hitech City
                    - cell [ref=e525]: QA Tester
                    - cell [ref=e526]: Offer Letter Released
              - generic [ref=e528]:
                - generic [ref=e529]:
                  - combobox [ref=e530]
                  - generic [ref=e531]: Showing 1 - 28 of 28
                - generic [ref=e533]:
                  - button [disabled]
                  - button [disabled]
                  - button [ref=e535] [cursor=pointer]: "1"
                  - button [disabled]
                  - button [disabled]
  - dialog [ref=e537]:
    - document:
      - generic [ref=e540]:
        - generic [ref=e541]:
          - paragraph [ref=e543]: Add Contract Employee
          - img "Close Icon" [ref=e546] [cursor=pointer]
        - generic [ref=e548]:
          - generic [ref=e549]:
            - generic [ref=e550]:
              - generic [ref=e551]: First Name *
              - textbox "Please enter first name" [ref=e552]: prospec
            - generic [ref=e553]:
              - generic [ref=e554]: Middle Name
              - textbox "Please enter middle name" [ref=e555]
            - generic [ref=e556]:
              - generic [ref=e557]: Last Name*
              - textbox "Please enter last name" [ref=e558]: contractor
            - generic [ref=e559]:
              - generic [ref=e560]: Personal Email ID*
              - textbox "Please enter personal email ID" [ref=e561]: proscon@yopmail.com
            - generic [ref=e562]:
              - generic [ref=e563]: Designation*
              - generic [ref=e565] [cursor=pointer]:
                - combobox "Director of HR" [ref=e566]
                - button "dropdown trigger" [ref=e567]
            - generic [ref=e571]:
              - generic [ref=e572]: Employment Type *
              - generic [ref=e574] [cursor=pointer]:
                - combobox "Fresher" [ref=e575]
                - button "dropdown trigger" [ref=e576]
            - generic [ref=e580]:
              - generic [ref=e581]: Location *
              - generic [ref=e583] [cursor=pointer]:
                - combobox "Hyderabad" [ref=e584]
                - button "dropdown trigger" [ref=e585]
            - generic [ref=e589]:
              - generic [ref=e590]: Sublocation *
              - generic [ref=e592] [cursor=pointer]:
                - combobox "Please select sublocation" [expanded] [active] [ref=e593]
                - button "dropdown trigger" [expanded] [ref=e594]
                - listbox "Option List" [ref=e603]:
                  - option "Jai Hind Enclave building" [ref=e605]
                  - option "Nanakranguda" [ref=e608]
                  - option "Raidurg" [ref=e611]
                  - option "Charminar" [ref=e614]
                  - option "Ayyappa Society" [ref=e617]
                  - option "Nampally" [ref=e620]
                  - option "Hitech City" [ref=e623]
                  - option "Madhapur" [ref=e626]
                  - option "Gachibowli" [ref=e629]
                  - option "Mind Space" [ref=e632]
          - generic [ref=e635]:
            - button "Cancel" [ref=e636] [cursor=pointer]
            - button "Add" [disabled] [ref=e637] [cursor=pointer]
```

# Test source

```ts
  102 |             { exact: true }
  103 |         );
  104 |     }
  105 | 
  106 |     // --------------------------------------------------
  107 |     // TC01
  108 |     // --------------------------------------------------
  109 | 
  110 |     async clickEmployees() {
  111 |         await this.employees.waitFor({
  112 |             state: 'visible',
  113 |             timeout: 15000
  114 |         });
  115 | 
  116 |         await this.employees.click();
  117 | 
  118 |         await this.page.waitForTimeout(1000);
  119 |     }
  120 | 
  121 |     // --------------------------------------------------
  122 |     // TC02
  123 |     // --------------------------------------------------
  124 | 
  125 |     async clickProspectiveEmployee() {
  126 |         await this.prospectiveEmployeeTab.waitFor({
  127 |             state: 'visible',
  128 |             timeout: 15000
  129 |         });
  130 | 
  131 |         await this.prospectiveEmployeeTab.click();
  132 | 
  133 |         await this.page.waitForTimeout(1000);
  134 |     }
  135 | 
  136 |     // --------------------------------------------------
  137 |     // TC03
  138 |     // --------------------------------------------------
  139 | 
  140 |     async clickContractTab() {
  141 |         await this.contractorsTab.waitFor({
  142 |             state: 'visible',
  143 |             timeout: 15000
  144 |         });
  145 | 
  146 |         await this.contractorsTab.click();
  147 | 
  148 |         await this.page.waitForTimeout(1000);
  149 |     }
  150 | 
  151 |     // --------------------------------------------------
  152 |     // TC04
  153 |     // --------------------------------------------------
  154 | 
  155 |     async clickAddContractEmployee() {
  156 |         await this.addContractEmployeeButton.waitFor({
  157 |             state: 'visible',
  158 |             timeout: 15000
  159 |         });
  160 | 
  161 |         await this.addContractEmployeeButton.click();
  162 | 
  163 |         await this.page.waitForTimeout(1000);
  164 |     }
  165 | 
  166 |     // --------------------------------------------------
  167 |     // TC05
  168 |     // --------------------------------------------------
  169 | 
  170 |     async fillContractEmployeeDetails() {
  171 | 
  172 |         await this.firstNameInput.fill('prospec');
  173 | 
  174 |         await this.lastNameInput.fill('contractor');
  175 | 
  176 |         await this.personalEmailInput.fill(
  177 |             'proscon@yopmail.com'
  178 |         );
  179 | 
  180 |         await this.designationDropdown.click();
  181 | 
  182 |         await this.page.getByRole('option', {
  183 |             name: 'Director of HR'
  184 |         }).click();
  185 | 
  186 |         await this.employmentTypeDropdown.click();
  187 | 
  188 |         await this.page.getByRole('option', {
  189 |             name: 'Fresher'
  190 |         }).click();
  191 | 
  192 |         await this.locationDropdown.click();
  193 | 
  194 |         await this.page.getByRole('option', {
  195 |             name: 'Hyderabad'
  196 |         }).click();
  197 | 
  198 |         await this.sublocationDropdown.click();
  199 | 
  200 |         await this.page.getByText(
  201 |             'Jai Hind Enclave building'
> 202 |         ).click();
      |           ^ Error: locator.click: Error: strict mode violation: getByText('Jai Hind Enclave building') resolved to 21 elements:
  203 |     }
  204 | 
  205 |     async clickAdd() {
  206 |         await this.addButton.click();
  207 | 
  208 |         await this.page.waitForTimeout(1500);
  209 |     }
  210 | 
  211 |     // --------------------------------------------------
  212 |     // TC06
  213 |     // --------------------------------------------------
  214 | 
  215 |     async clickCreatedEmployee() {
  216 |         await this.page.getByText(
  217 |             'prospec contractor',
  218 |             { exact: true }
  219 |         ).waitFor({
  220 |             state: 'visible',
  221 |             timeout: 15000
  222 |         });
  223 | 
  224 |         await this.page.getByText(
  225 |             'prospec contractor',
  226 |             { exact: true }
  227 |         ).click();
  228 | 
  229 |         await this.page.waitForTimeout(1500);
  230 |     }
  231 | 
  232 |     // --------------------------------------------------
  233 |     // TC07
  234 |     // --------------------------------------------------
  235 | 
  236 |     async clickRequestDocuments() {
  237 |         await this.requestDocumentsButton.waitFor({
  238 |             state: 'visible',
  239 |             timeout: 15000
  240 |         });
  241 | 
  242 |         await this.requestDocumentsButton.click();
  243 | 
  244 |         await this.page.waitForTimeout(1000);
  245 |     }
  246 | 
  247 |     // --------------------------------------------------
  248 |     // TC08
  249 |     // --------------------------------------------------
  250 | 
  251 |     async openYopmail() {
  252 | 
  253 |         const yopmailPage = await this.page.context().newPage();
  254 | 
  255 |         await yopmailPage.goto(
  256 |             'https://yopmail.com/en/'
  257 |         );
  258 | 
  259 |         await yopmailPage.waitForLoadState(
  260 |             'domcontentloaded'
  261 |         );
  262 | 
  263 |         return yopmailPage;
  264 |     }
  265 | 
  266 |     // --------------------------------------------------
  267 |     // TC09
  268 |     // --------------------------------------------------
  269 | 
  270 |     async openYopmailInbox(
  271 |         yopmailPage: Page,
  272 |         emailName: string
  273 |     ) {
  274 | 
  275 |         const loginField = yopmailPage.getByRole(
  276 |             'textbox',
  277 |             { name: 'Login' }
  278 |         );
  279 | 
  280 |         await loginField.waitFor({
  281 |             state: 'visible',
  282 |             timeout: 15000
  283 |         });
  284 | 
  285 |         await loginField.fill(emailName);
  286 | 
  287 |         await yopmailPage.getByTitle(
  288 |             'Check Inbox @yopmail.com'
  289 |         ).click();
  290 | 
  291 |         await yopmailPage.waitForTimeout(3000);
  292 |     }
  293 | 
  294 |     // --------------------------------------------------
  295 |     // TC10
  296 |     // --------------------------------------------------
  297 | 
  298 |     async getCredentialsFromEmail(
  299 |         yopmailPage: Page
  300 |     ) {
  301 | 
  302 |         const mailFrame = yopmailPage.locator(
```