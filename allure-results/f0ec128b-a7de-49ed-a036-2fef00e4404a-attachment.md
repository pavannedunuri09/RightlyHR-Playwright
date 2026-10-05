# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leave-category.spec.ts >> Leave Category Foundation >> Add Leave Category validations >> 07. creates General Leave category with required details and enables Save
- Location: tests\leave-category.spec.ts:108:9

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /Pending\s+For\s+Submission\s*\(\d+\)/i }).or(getByRole('tab', { name: /Pending\s+For\s+Submission\s*\(\d+\)/i })).first()

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e8]:
    - img "Company Logo" [ref=e10]
    - generic [ref=e11]:
      - generic [ref=e12] [cursor=pointer]
      - generic [ref=e20] [cursor=pointer]: 
      - generic [ref=e24] [cursor=pointer]
      - generic [ref=e34] [cursor=pointer]:
        - generic [ref=e35]:
          - paragraph [ref=e36]: Sai Pavan Dinesh
          - paragraph [ref=e37]: QA Tester
        - img "Profile Image" [ref=e39]
  - generic [ref=e40]:
    - generic [ref=e43]:
      - list [ref=e45]:
        - listitem [ref=e46] [cursor=pointer]:
          - img "Icon" [ref=e47]
          - text: Dashboard
        - listitem [ref=e48]:
          - generic [ref=e49]:
            - generic [ref=e50] [cursor=pointer]:
              - img "Icon" [ref=e51]
              - text: My Info
            - generic [ref=e52] [cursor=pointer]:
              - img "Icon" [ref=e53]
              - text: Employees
            - generic [ref=e54] [cursor=pointer]:
              - img "Icon" [ref=e55]
              - text: Policies
            - generic [ref=e56] [cursor=pointer]:
              - img "Icon" [ref=e57]
              - text: Pending Approvals
            - generic [ref=e58] [cursor=pointer]:
              - img "Icon" [ref=e59]
              - text: Reports
            - generic [ref=e60] [cursor=pointer]:
              - img "Icon" [ref=e61]
              - text: Holidays
            - generic [ref=e62] [cursor=pointer]:
              - img "Icon" [ref=e63]
              - text: Cards Management
            - generic [ref=e64] [cursor=pointer]:
              - img "Icon" [ref=e65]
              - text: Expenses
            - generic [ref=e66] [cursor=pointer]:
              - img "Icon" [ref=e67]
              - text: IT Support
            - generic [ref=e68] [cursor=pointer]:
              - img "Icon" [ref=e69]
              - text: Skill Set
            - generic [ref=e72] [cursor=pointer]:
              - img "Icon" [ref=e73]
              - text: Project Management
            - generic [ref=e76] [cursor=pointer]:
              - img "Icon" [ref=e77]
              - text: ATS
            - generic [ref=e80] [cursor=pointer]:
              - img "Icon" [ref=e81]
              - text: PMS
            - generic [ref=e84] [cursor=pointer]:
              - img "Icon" [ref=e85]
              - text: Time Off
        - listitem [ref=e86] [cursor=pointer]:
          - img "Icons" [ref=e89]
      - img "Powered By logo" [ref=e92]
    - generic [ref=e97]:
      - generic [ref=e100]:
        - generic [ref=e101]:
          - generic [ref=e102]:
            - generic [ref=e103]:
              - generic [ref=e104]: Good Evening,
              - generic [ref=e105]: Sai Pavan Dinesh!
            - generic [ref=e106]:
              - generic [ref=e107] [cursor=pointer]: Home
              - generic [ref=e108] [cursor=pointer]: Team
              - generic [ref=e109] [cursor=pointer]: Organization
          - generic [ref=e111]:
            - generic [ref=e112]: Have a nice day at work!
            - generic [ref=e114]:
              - img "Icon" [ref=e116]
              - generic [ref=e117]:
                - generic [ref=e118]: 22:07:44
                - generic [ref=e119]: October 1, 2026
        - generic [ref=e120]:
          - generic [ref=e122]:
            - generic [ref=e123]: Quick Links
            - generic [ref=e125] [cursor=pointer]
          - generic [ref=e130]:
            - generic [ref=e132]:
              - generic [ref=e133]:
                - button "Select quick link" [ref=e134] [cursor=pointer]
                - img "IT Support" [ref=e136]
                - generic [ref=e137] [cursor=pointer]: IT Support
              - generic [ref=e139]:
                - img "My Info" [ref=e140]
                - generic [ref=e141] [cursor=pointer]: My Info
              - generic [ref=e143]:
                - img "Holidays" [ref=e144]
                - generic [ref=e145] [cursor=pointer]: Holidays
              - generic [ref=e147]:
                - img "Leaves" [ref=e148]
                - generic [ref=e149] [cursor=pointer]: Leaves
              - generic [ref=e151]:
                - img "Blood Bank" [ref=e152]
                - generic [ref=e153] [cursor=pointer]: Blood Bank
              - generic [ref=e155]:
                - img "Policies" [ref=e156]
                - generic [ref=e157] [cursor=pointer]: Policies
              - generic [ref=e159]:
                - img "Calendar" [ref=e160]
                - generic [ref=e161] [cursor=pointer]: Calendar
              - generic [ref=e163]:
                - img "Timesheets" [ref=e164]
                - generic [ref=e165] [cursor=pointer]: Timesheets
              - generic [ref=e167]:
                - img "Expenses" [ref=e168]
                - generic [ref=e169] [cursor=pointer]: Expenses
              - generic [ref=e171]:
                - img "Personalization" [ref=e172]
                - generic [ref=e173] [cursor=pointer]: Personalization
            - button "Scroll quick links right" [ref=e175] [cursor=pointer]:
              - generic [ref=e176]: 
        - generic [ref=e177]:
          - generic [ref=e179]:
            - generic [ref=e180]:
              - generic [ref=e181]:
                - generic [ref=e182]: Consumed Leave Types
                - generic [ref=e184] [cursor=pointer]
              - generic [ref=e189]:
                - text: Leaves Consumed
                - generic [ref=e190]: ":"
                - generic [ref=e191]: "0"
                - generic [ref=e192]: /0
            - generic [ref=e193]:
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - paragraph: No Data Found...
          - generic [ref=e194]:
            - generic [ref=e196]:
              - generic [ref=e197]: My Team Members (131)
              - generic [ref=e199] [cursor=pointer]
            - generic [ref=e206]:
              - tablist [ref=e208]:
                - tab "Aman Singh Mobile Developer" [selected] [ref=e209]:
                  - generic [ref=e211]:
                    - generic [ref=e216]: Aman Singh
                    - generic [ref=e217]: Mobile Developer
                - tab "Ben Max Chief Executive Officer" [selected] [ref=e218]:
                  - generic [ref=e220]:
                    - generic [ref=e225]: Ben Max
                    - generic [ref=e226]: Chief Executive Officer
                - tab "Bhavani seepana Rao Chief Operating Officer" [selected] [ref=e227]:
                  - generic [ref=e229]:
                    - generic [ref=e234]: Bhavani seepana Rao
                    - generic [ref=e235]: Chief Operating Officer
                - tab "Chandhana Reddy Executive BGC" [selected] [ref=e236]:
                  - generic [ref=e238]:
                    - generic [ref=e243]: Chandhana Reddy
                    - generic [ref=e244]: Executive BGC
                - tab "Chandhra Chandhu Cham sda" [selected] [ref=e245]:
                  - generic [ref=e247]:
                    - generic [ref=e252]: Chandhra Chandhu Cham
                    - generic [ref=e253]: sda
                - tab "deva simha Sr. Director of Learning" [selected] [ref=e254]:
                  - generic [ref=e256]:
                    - generic [ref=e261]: deva simha
                    - generic [ref=e262]: Sr. Director of Learning
                - tab "Dfgfd Dfd Chief Executive Officer" [selected] [ref=e263]:
                  - generic [ref=e265]:
                    - generic [ref=e270]: Dfgfd Dfd
                    - generic [ref=e271]: Chief Executive Officer
                - tab "First Shyam Compliance Auditor" [selected] [ref=e272]:
                  - generic [ref=e274]:
                    - generic [ref=e279]: First Shyam
                    - generic [ref=e280]: Compliance Auditor
                - tab "Glen Max Software Engineer" [selected] [ref=e281]:
                  - generic [ref=e283]:
                    - generic [ref=e288]: Glen Max
                    - generic [ref=e289]: Software Engineer
                - tab "Kapil Kumar Varma Executive Assistant" [selected] [ref=e290]:
                  - generic [ref=e292]:
                    - generic [ref=e297]: Kapil Kumar Varma
                    - generic [ref=e298]: Executive Assistant
                - tab "Mahija Preeth Singh Chief Executive Officer" [selected] [ref=e299]:
                  - generic [ref=e301]:
                    - generic [ref=e306]: Mahija Preeth Singh
                    - generic [ref=e307]: Chief Executive Officer
                - tab "Mallesh Jallolu General Application" [selected] [ref=e308]:
                  - generic [ref=e310]:
                    - generic [ref=e315]: Mallesh Jallolu
                    - generic [ref=e316]: General Application
                - tab "omi prakash DHARAVATH QA Tester" [selected] [ref=e317]:
                  - generic [ref=e319]:
                    - generic [ref=e324]: omi prakash DHARAVATH
                    - generic [ref=e325]: QA Tester
                - tab "Pavan Test testing Role" [selected] [ref=e326]:
                  - generic [ref=e328]:
                    - generic [ref=e333]: Pavan Test
                    - generic [ref=e334]: testing Role
                - tab "Poorna Sai Executive BGC" [selected] [ref=e335]:
                  - generic [ref=e337]:
                    - generic [ref=e342]: Poorna Sai
                    - generic [ref=e343]: Executive BGC
                - tab "Raghav Juyal Executive BGC" [selected] [ref=e344]:
                  - generic [ref=e346]:
                    - generic [ref=e351]: Raghav Juyal
                    - generic [ref=e352]: Executive BGC
                - tab "shankar pratap QA Tester" [selected] [ref=e353]:
                  - generic [ref=e355]:
                    - generic [ref=e360]: shankar pratap
                    - generic [ref=e361]: QA Tester
                - tab "Sushma sri Palagiri QA Tester" [selected] [ref=e362]:
                  - generic [ref=e364]:
                    - generic [ref=e369]: Sushma sri Palagiri
                    - generic [ref=e370]: QA Tester
                - tab "Uma Maheswara Sai Danda Front End Developer" [selected] [ref=e371]:
                  - generic [ref=e373]:
                    - generic [ref=e375]: Uma Maheswara Sai Danda
                    - generic [ref=e376]: Front End Developer
                - tab "Vardhan vadhu Executive BGC" [selected] [ref=e377]:
                  - generic [ref=e379]:
                    - generic [ref=e384]: Vardhan vadhu
                    - generic [ref=e385]: Executive BGC
                - tab "Anil Dev IT Security Engineer" [selected] [ref=e386]:
                  - generic [ref=e388]:
                    - generic [ref=e393]: Anil Dev
                    - generic [ref=e394]: IT Security Engineer
                - tab "Anviya Mahi QA Tester" [selected] [ref=e395]:
                  - generic [ref=e397]:
                    - generic [ref=e402]: Anviya Mahi
                    - generic [ref=e403]: QA Tester
                - tab "Indu sri Kumar QA Tester" [selected] [ref=e404]:
                  - generic [ref=e406]:
                    - generic [ref=e411]: Indu sri Kumar
                    - generic [ref=e412]: QA Tester
                - tab "raghu jaiswa Executive BGC" [selected] [ref=e413]:
                  - generic [ref=e415]:
                    - generic [ref=e420]: raghu jaiswa
                    - generic [ref=e421]: Executive BGC
                - tab "Sau Ram QA Tester" [selected] [ref=e422]:
                  - generic [ref=e424]:
                    - generic [ref=e429]: Sau Ram
                    - generic [ref=e430]: QA Tester
                - tab "Swapna sri Controller" [selected] [ref=e431]:
                  - generic [ref=e433]:
                    - generic [ref=e438]: Swapna sri
                    - generic [ref=e439]: Controller
                - tab "Akhil Raj QA Tester" [selected] [ref=e440]:
                  - generic [ref=e442]:
                    - generic [ref=e447]: Akhil Raj
                    - generic [ref=e448]: QA Tester
                - tab "Akrithi Varma HR Administrator" [selected] [ref=e449]:
                  - generic [ref=e451]:
                    - generic [ref=e456]: Akrithi Varma
                    - generic [ref=e457]: HR Administrator
                - tab "Andrew Sin Front End Developer" [selected] [ref=e458]:
                  - generic [ref=e460]:
                    - generic [ref=e465]: Andrew Sin
                    - generic [ref=e466]: Front End Developer
                - tab "Anil N/A Kurapati Executive BGC" [selected] [ref=e467]:
                  - generic [ref=e469]:
                    - generic [ref=e474]: Anil N/A Kurapati
                    - generic [ref=e475]: Executive BGC
                - tab "Anurag Kulakarni Front End Developer" [selected] [ref=e476]:
                  - generic [ref=e478]:
                    - generic [ref=e483]: Anurag Kulakarni
                    - generic [ref=e484]: Front End Developer
                - tab "arpitha N/A Bhanja Chief Operating Officer" [selected] [ref=e485]:
                  - generic [ref=e487]:
                    - generic [ref=e492]: arpitha N/A Bhanja
                    - generic [ref=e493]: Chief Operating Officer
                - tab "Avinash Kour Demand Generation Manager" [selected] [ref=e494]:
                  - generic [ref=e496]:
                    - generic [ref=e501]: Avinash Kour
                    - generic [ref=e502]: Demand Generation Manager
                - tab "Barun N/A Jain Software Engineer" [selected] [ref=e503]:
                  - generic [ref=e505]:
                    - generic [ref=e510]: Barun N/A Jain
                    - generic [ref=e511]: Software Engineer
                - tab "Ben s Addams Testing Role QA" [selected] [ref=e512]:
                  - generic [ref=e514]:
                    - generic [ref=e519]: Ben s Addams
                    - generic [ref=e520]: Testing Role QA
                - tab "Bhavitha Sri Palagiri Palagiri Executive BGC" [selected] [ref=e521]:
                  - generic [ref=e523]:
                    - generic [ref=e525]: Bhavitha Sri Palagiri Palagiri
                    - generic [ref=e526]: Executive BGC
                - tab "Chandrima A QA Tester" [selected] [ref=e527]:
                  - generic [ref=e529]:
                    - generic [ref=e534]: Chandrima A
                    - generic [ref=e535]: QA Tester
                - tab "Classic Login Tester qa snad" [selected] [ref=e536]:
                  - generic [ref=e538]:
                    - generic [ref=e543]: Classic Login
                    - generic [ref=e544]: Tester qa snad
                - tab "Dany Rathod QA Tester" [selected] [ref=e545]:
                  - generic [ref=e547]:
                    - generic [ref=e552]: Dany Rathod
                    - generic [ref=e553]: QA Tester
                - tab "Dbv Vamsi Ccccc Instructional Designer" [selected] [ref=e554]:
                  - generic [ref=e556]:
                    - generic [ref=e561]: Dbv Vamsi Ccccc
                    - generic [ref=e562]: Instructional Designer
                - tab "Dhana Raj Jam Financial Analyst" [selected] [ref=e563]:
                  - generic [ref=e565]:
                    - generic [ref=e570]: Dhana Raj Jam
                    - generic [ref=e571]: Financial Analyst
                - tab "Dinesh Kumar Kotapati Executive BGC" [selected] [ref=e572]:
                  - generic [ref=e574]:
                    - generic [ref=e579]: Dinesh Kumar Kotapati
                    - generic [ref=e580]: Executive BGC
                - tab "DSP Mohammad Siraj QA Tester" [selected] [ref=e581]:
                  - generic [ref=e583]:
                    - generic [ref=e588]: DSP Mohammad Siraj
                    - generic [ref=e589]: QA Tester
                - tab "Employee Test Chief Executive Officer" [selected] [ref=e590]:
                  - generic [ref=e592]:
                    - generic [ref=e597]: Employee Test
                    - generic [ref=e598]: Chief Executive Officer
                - tab "Gandhi Goud Executive BGC" [selected] [ref=e599]:
                  - generic [ref=e601]:
                    - generic [ref=e606]: Gandhi Goud
                    - generic [ref=e607]: Executive BGC
                - tab "Hari Roy Front End Developer" [selected] [ref=e608]:
                  - generic [ref=e610]:
                    - generic [ref=e615]: Hari Roy
                    - generic [ref=e616]: Front End Developer
                - tab "Harini N/A A Chief Executive Officer" [selected] [ref=e617]:
                  - generic [ref=e619]:
                    - generic [ref=e624]: Harini N/A A
                    - generic [ref=e625]: Chief Executive Officer
                - tab "Hema Chandra Vedala QA Tester" [selected] [ref=e626]:
                  - generic [ref=e628]:
                    - generic [ref=e633]: Hema Chandra Vedala
                    - generic [ref=e634]: QA Tester
                - tab "Hemanth N/A Kumar Executive BGC" [selected] [ref=e635]:
                  - generic [ref=e637]:
                    - generic [ref=e642]: Hemanth N/A Kumar
                    - generic [ref=e643]: Executive BGC
                - tab "Inter N/A Employee Content Marketer" [selected] [ref=e644]:
                  - generic [ref=e646]:
                    - generic [ref=e651]: Inter N/A Employee
                    - generic [ref=e652]: Content Marketer
                - tab "Jack omi omijack QA Tester" [selected] [ref=e653]:
                  - generic [ref=e655]:
                    - generic [ref=e660]: Jack omi omijack
                    - generic [ref=e661]: QA Tester
                - tab "john samual Front End Developer" [selected] [ref=e662]:
                  - generic [ref=e664]:
                    - generic [ref=e669]: john samual
                    - generic [ref=e670]: Front End Developer
                - tab "Kajal morsu Kajol Director of HR" [selected] [ref=e671]:
                  - generic [ref=e673]:
                    - generic [ref=e678]: Kajal morsu Kajol
                    - generic [ref=e679]: Director of HR
                - tab "Karthikeya Muni Chief Executive Officer" [selected] [ref=e680]:
                  - generic [ref=e682]:
                    - generic [ref=e687]: Karthikeya Muni
                    - generic [ref=e688]: Chief Executive Officer
                - tab "Kavya Sri QA Tester" [selected] [ref=e689]:
                  - generic [ref=e691]:
                    - generic [ref=e696]: Kavya Sri
                    - generic [ref=e697]: QA Tester
                - tab "Keerthi Sri Front End Developer" [selected] [ref=e698]:
                  - generic [ref=e700]:
                    - generic [ref=e705]: Keerthi Sri
                    - generic [ref=e706]: Front End Developer
                - tab "Koushik shetty Anumasa General Application" [selected] [ref=e707]:
                  - generic [ref=e709]:
                    - generic [ref=e714]: Koushik shetty Anumasa
                    - generic [ref=e715]: General Application
                - tab "Koushik Anumasa HR Specialist" [selected] [ref=e716]:
                  - generic [ref=e718]:
                    - generic [ref=e723]: Koushik Anumasa
                    - generic [ref=e724]: HR Specialist
                - tab "Koushik NV Anumasa Front End Developer" [selected] [ref=e725]:
                  - generic [ref=e727]:
                    - generic [ref=e732]: Koushik NV Anumasa
                    - generic [ref=e733]: Front End Developer
                - tab "krish kumar Executive BGC" [selected] [ref=e734]:
                  - generic [ref=e736]:
                    - generic [ref=e741]: krish kumar
                    - generic [ref=e742]: Executive BGC
                - tab "Krish Kapoor QA Tester" [selected] [ref=e743]:
                  - generic [ref=e745]:
                    - generic [ref=e750]: Krish Kapoor
                    - generic [ref=e751]: QA Tester
                - tab "kumar stel Chief Operating Officer" [selected] [ref=e752]:
                  - generic [ref=e754]:
                    - generic [ref=e759]: kumar stel
                    - generic [ref=e760]: Chief Operating Officer
                - tab "Kushh Joee Bhuu IT Security Engineer" [selected] [ref=e761]:
                  - generic [ref=e763]:
                    - generic [ref=e765]: Kushh Joee Bhuu
                    - generic [ref=e766]: IT Security Engineer
                - tab "Mani N/A Deep QA Tester" [selected] [ref=e767]:
                  - generic [ref=e769]:
                    - generic [ref=e774]: Mani N/A Deep
                    - generic [ref=e775]: QA Tester
                - tab "Manu N/A Manu QA Tester" [selected] [ref=e776]:
                  - generic [ref=e778]:
                    - generic [ref=e783]: Manu N/A Manu
                    - generic [ref=e784]: QA Tester
                - tab "Micky N/A Micky Devops Engineer" [selected] [ref=e785]:
                  - generic [ref=e787]:
                    - generic [ref=e792]: Micky N/A Micky
                    - generic [ref=e793]: Devops Engineer
                - tab "Naga Chaitanya QA Tester" [selected] [ref=e794]:
                  - generic [ref=e796]:
                    - generic [ref=e801]: Naga Chaitanya
                    - generic [ref=e802]: QA Tester
                - tab "Naga Sai mavuri Reddy Chief Financial Officer" [selected] [ref=e803]:
                  - generic [ref=e805]:
                    - generic [ref=e810]: Naga Sai mavuri Reddy
                    - generic [ref=e811]: Chief Financial Officer
                - tab "Nageswara Rao Veeravalli Director of IT" [selected] [ref=e812]:
                  - generic [ref=e814]:
                    - generic [ref=e816]: Nageswara Rao Veeravalli
                    - generic [ref=e817]: Director of IT
                - tab "Nani s Siri Chief Operating Officer" [selected] [ref=e818]:
                  - generic [ref=e820]:
                    - generic [ref=e825]: Nani s Siri
                    - generic [ref=e826]: Chief Operating Officer
                - tab "Naveen N/A Reddy QA Tester" [selected] [ref=e827]:
                  - generic [ref=e829]:
                    - generic [ref=e831]: Naveen N/A Reddy
                    - generic [ref=e832]: QA Tester
                - tab "Nbmk N/A Nmbn Demand Generation Manager" [selected] [ref=e833]:
                  - generic [ref=e835]:
                    - generic [ref=e840]: Nbmk N/A Nmbn
                    - generic [ref=e841]: Demand Generation Manager
                - tab "Neeru shetty Neeraja Customer Implementation Manager" [selected] [ref=e842]:
                  - generic [ref=e844]:
                    - generic [ref=e849]: Neeru shetty Neeraja
                    - generic [ref=e850]: Customer Implementation Manager
                - tab "Nilesh varma Kumar Customer Success Advocate" [selected] [ref=e851]:
                  - generic [ref=e853]:
                    - generic [ref=e858]: Nilesh varma Kumar
                    - generic [ref=e859]: Customer Success Advocate
                - tab "Om Prakash sda" [selected] [ref=e860]:
                  - generic [ref=e862]:
                    - generic [ref=e867]: Om Prakash
                    - generic [ref=e868]: sda
                - tab "Omi Bhaooo Web Designer" [selected] [ref=e869]:
                  - generic [ref=e871]:
                    - generic [ref=e876]: Omi Bhaooo
                    - generic [ref=e877]: Web Designer
                - tab "Prasanth morsu Mitupally Director of HR" [selected] [ref=e878]:
                  - generic [ref=e880]:
                    - generic [ref=e885]: Prasanth morsu Mitupally
                    - generic [ref=e886]: Director of HR
                - tab "Praveena N/A Rao Chief Executive Officer" [selected] [ref=e887]:
                  - generic [ref=e889]:
                    - generic [ref=e894]: Praveena N/A Rao
                    - generic [ref=e895]: Chief Executive Officer
                - tab "raja ranganath Executive BGC" [selected] [ref=e896]:
                  - generic [ref=e898]:
                    - generic [ref=e903]: raja ranganath
                    - generic [ref=e904]: Executive BGC
                - tab "raja rudrangi Front End Developer" [selected] [ref=e905]:
                  - generic [ref=e907]:
                    - generic [ref=e912]: raja rudrangi
                    - generic [ref=e913]: Front End Developer
                - tab "Rajesh Kinnera Software Engineer" [selected] [ref=e914]:
                  - generic [ref=e916]:
                    - generic [ref=e921]: Rajesh Kinnera
                    - generic [ref=e922]: Software Engineer
                - tab "Raju sri Chinnu HR Administrator" [selected] [ref=e923]:
                  - generic [ref=e925]:
                    - generic [ref=e930]: Raju sri Chinnu
                    - generic [ref=e931]: HR Administrator
                - tab "Raju Sri Dasari Compliance Auditor" [selected] [ref=e932]:
                  - generic [ref=e934]:
                    - generic [ref=e939]: Raju Sri Dasari
                    - generic [ref=e940]: Compliance Auditor
                - tab "ram raju Executive BGC" [selected] [ref=e941]:
                  - generic [ref=e943]:
                    - generic [ref=e948]: ram raju
                    - generic [ref=e949]: Executive BGC
                - tab "Ramakrishna Naidu Shanshala Demand Generation Manager" [selected] [ref=e950]:
                  - generic [ref=e952]:
                    - generic [ref=e957]: Ramakrishna Naidu Shanshala
                    - generic [ref=e958]: Demand Generation Manager
                - tab "Ramesh N/A Mnb Chief Operating Officer" [selected] [ref=e959]:
                  - generic [ref=e961]:
                    - generic [ref=e966]: Ramesh N/A Mnb
                    - generic [ref=e967]: Chief Operating Officer
                - tab "Ramya N/A Tamma Director of HR" [selected] [ref=e968]:
                  - generic [ref=e970]:
                    - generic [ref=e975]: Ramya N/A Tamma
                    - generic [ref=e976]: Director of HR
                - tab "Reema N/A Shetty Customer Education Manager" [selected] [ref=e977]:
                  - generic [ref=e979]:
                    - generic [ref=e984]: Reema N/A Shetty
                    - generic [ref=e985]: Customer Education Manager
                - tab "Rohit N/A Name Customer Success Advocate" [selected] [ref=e986]:
                  - generic [ref=e988]:
                    - generic [ref=e993]: Rohit N/A Name
                    - generic [ref=e994]: Customer Success Advocate
                - tab "Rrrr N/A Rrrr Sales Director" [selected] [ref=e995]:
                  - generic [ref=e997]:
                    - generic [ref=e1002]: Rrrr N/A Rrrr
                    - generic [ref=e1003]: Sales Director
                - tab "Rupa Sai Devi Front End Developer" [selected] [ref=e1004]:
                  - generic [ref=e1006]:
                    - generic [ref=e1011]: Rupa Sai Devi
                    - generic [ref=e1012]: Front End Developer
                - tab "Sagar Kumar Reddy UX Designer" [selected] [ref=e1013]:
                  - generic [ref=e1015]:
                    - generic [ref=e1020]: Sagar Kumar Reddy
                    - generic [ref=e1021]: UX Designer
                - tab "Sahithi Lankisetty Customer Retention Manager" [selected] [ref=e1022]:
                  - generic [ref=e1024]:
                    - generic [ref=e1029]: Sahithi Lankisetty
                    - generic [ref=e1030]: Customer Retention Manager
                - tab "sai Krishna SK Chief Executive Officer" [selected] [ref=e1031]:
                  - generic [ref=e1033]:
                    - generic [ref=e1038]: sai Krishna SK
                    - generic [ref=e1039]: Chief Executive Officer
                - tab "Sai N/A Test Executive BGC" [selected] [ref=e1040]:
                  - generic [ref=e1042]:
                    - generic [ref=e1047]: Sai N/A Test
                    - generic [ref=e1048]: Executive BGC
                - tab "Sameeer Sri Front End Developer" [selected] [ref=e1049]:
                  - generic [ref=e1051]:
                    - generic [ref=e1056]: Sameeer Sri
                    - generic [ref=e1057]: Front End Developer
                - tab "Samyukta N/A Alakanti Chief Executive Officer" [selected] [ref=e1058]:
                  - generic [ref=e1060]:
                    - generic [ref=e1065]: Samyukta N/A Alakanti
                    - generic [ref=e1066]: Chief Executive Officer
                - tab "Sandhya mavuri Tenugu Customer Success Advocate" [selected] [ref=e1067]:
                  - generic [ref=e1069]:
                    - generic [ref=e1074]: Sandhya mavuri Tenugu
                    - generic [ref=e1075]: Customer Success Advocate
                - tab "Sanju mavuri Reddy Customer Retention Manager" [selected] [ref=e1076]:
                  - generic [ref=e1078]:
                    - generic [ref=e1083]: Sanju mavuri Reddy
                    - generic [ref=e1084]: Customer Retention Manager
                - tab "Sanju N/A Sanjay QA Tester" [selected] [ref=e1085]:
                  - generic [ref=e1087]:
                    - generic [ref=e1092]: Sanju N/A Sanjay
                    - generic [ref=e1093]: QA Tester
                - tab "Santhosh Kumar Ale Executive BGC" [selected] [ref=e1094]:
                  - generic [ref=e1096]:
                    - generic [ref=e1098]: Santhosh Kumar Ale
                    - generic [ref=e1099]: Executive BGC
                - tab "shanmuka pratap Corporate Trainer" [selected] [ref=e1100]:
                  - generic [ref=e1102]:
                    - generic [ref=e1107]: shanmuka pratap
                    - generic [ref=e1108]: Corporate Trainer
                - tab "Sharukh Khan Front End Developer" [selected] [ref=e1109]:
                  - generic [ref=e1111]:
                    - generic [ref=e1116]: Sharukh Khan
                    - generic [ref=e1117]: Front End Developer
                - tab "Smith Junior QA Tester" [selected] [ref=e1118]:
                  - generic [ref=e1120]:
                    - generic [ref=e1125]: Smith Junior
                    - generic [ref=e1126]: QA Tester
                - tab "Sneha N/A Wankhade sda" [selected] [ref=e1127]:
                  - generic [ref=e1129]:
                    - generic [ref=e1134]: Sneha N/A Wankhade
                    - generic [ref=e1135]: sda
                - tab "Sneha N/A Snehaa General Application" [selected] [ref=e1136]:
                  - generic [ref=e1138]:
                    - generic [ref=e1140]: Sneha N/A Snehaa
                    - generic [ref=e1141]: General Application
                - tab "Sony N/A Kumari QA Tester" [selected] [ref=e1142]:
                  - generic [ref=e1144]:
                    - generic [ref=e1149]: Sony N/A Kumari
                    - generic [ref=e1150]: QA Tester
                - tab "Soumya N/A Soumya Chief Executive Officer" [selected] [ref=e1151]:
                  - generic [ref=e1153]:
                    - generic [ref=e1158]: Soumya N/A Soumya
                    - generic [ref=e1159]: Chief Executive Officer
                - tab "Sowmya kishore Raj Chief Executive Officer" [selected] [ref=e1160]:
                  - generic [ref=e1162]:
                    - generic [ref=e1167]: Sowmya kishore Raj
                    - generic [ref=e1168]: Chief Executive Officer
                - tab "Sree Lila QA Tester" [selected] [ref=e1169]:
                  - generic [ref=e1171]:
                    - generic [ref=e1176]: Sree Lila
                    - generic [ref=e1177]: QA Tester
                - tab "Sri Hari Executive BGC" [selected] [ref=e1178]:
                  - generic [ref=e1180]:
                    - generic [ref=e1185]: Sri Hari
                    - generic [ref=e1186]: Executive BGC
                - tab "Srikanth Bondu Demand Generation Manager" [selected] [ref=e1187]:
                  - generic [ref=e1189]:
                    - generic [ref=e1194]: Srikanth Bondu
                    - generic [ref=e1195]: Demand Generation Manager
                - tab "Subhash N/A Ch Executive BGC" [selected] [ref=e1196]:
                  - generic [ref=e1198]:
                    - generic [ref=e1203]: Subhash N/A Ch
                    - generic [ref=e1204]: Executive BGC
                - tab "Suchi s Ram Chief Executive Officer" [selected] [ref=e1205]:
                  - generic [ref=e1207]:
                    - generic [ref=e1212]: Suchi s Ram
                    - generic [ref=e1213]: Chief Executive Officer
                - tab "Sujith N/A Krishna Executive BGC" [selected] [ref=e1214]:
                  - generic [ref=e1216]:
                    - generic [ref=e1221]: Sujith N/A Krishna
                    - generic [ref=e1222]: Executive BGC
                - tab "Swathi Nair QA Tester" [selected] [ref=e1223]:
                  - generic [ref=e1225]:
                    - generic [ref=e1230]: Swathi Nair
                    - generic [ref=e1231]: QA Tester
                - tab "Tanuja Rani Front End Developer" [selected] [ref=e1232]:
                  - generic [ref=e1234]:
                    - generic [ref=e1239]: Tanuja Rani
                    - generic [ref=e1240]: Front End Developer
                - tab "Teju s Sai testing Role" [selected] [ref=e1241]:
                  - generic [ref=e1243]:
                    - generic [ref=e1248]: Teju s Sai
                    - generic [ref=e1249]: testing Role
                - tab "Test User Executive BGC" [selected] [ref=e1250]:
                  - generic [ref=e1252]:
                    - generic [ref=e1257]: Test User
                    - generic [ref=e1258]: Executive BGC
                - tab "Test Prosp Executive BGC" [selected] [ref=e1259]:
                  - generic [ref=e1261]:
                    - generic [ref=e1266]: Test Prosp
                    - generic [ref=e1267]: Executive BGC
                - tab "Test N/A Probation Flow Chief Executive Officer" [selected] [ref=e1268]:
                  - generic [ref=e1270]:
                    - generic [ref=e1275]: Test N/A Probation Flow
                    - generic [ref=e1276]: Chief Executive Officer
                - tab "Testing N/A Probation Executive BGC" [selected] [ref=e1277]:
                  - generic [ref=e1279]:
                    - generic [ref=e1284]: Testing N/A Probation
                    - generic [ref=e1285]: Executive BGC
                - tab "Testingqa Testingsda test QA Tester" [selected] [ref=e1286]:
                  - generic [ref=e1288]:
                    - generic [ref=e1293]: Testingqa Testingsda test
                    - generic [ref=e1294]: QA Tester
                - tab "Trainee dimcon Executive BGC" [selected] [ref=e1295]:
                  - generic [ref=e1297]:
                    - generic [ref=e1302]: Trainee dimcon
                    - generic [ref=e1303]: Executive BGC
                - tab "Trainee two dimcon Executive BGC" [selected] [ref=e1304]:
                  - generic [ref=e1306]:
                    - generic [ref=e1311]: Trainee two dimcon
                    - generic [ref=e1312]: Executive BGC
                - tab "Trisha S Pandey Front End Developer" [selected] [ref=e1313]:
                  - generic [ref=e1315]:
                    - generic [ref=e1320]: Trisha S Pandey
                    - generic [ref=e1321]: Front End Developer
                - tab "Tyurtutyut N/A Etuty HR Specialist" [selected] [ref=e1322]:
                  - generic [ref=e1324]:
                    - generic [ref=e1326]: Tyurtutyut N/A Etuty
                    - generic [ref=e1327]: HR Specialist
                - tab "Vamsi N Vamsi QA Tester" [selected] [ref=e1328]:
                  - generic [ref=e1330]:
                    - generic [ref=e1332]: Vamsi N Vamsi
                    - generic [ref=e1333]: QA Tester
                - tab "Vandhana N/A Rao Chief Executive Officer" [selected] [ref=e1334]:
                  - generic [ref=e1336]:
                    - generic [ref=e1341]: Vandhana N/A Rao
                    - generic [ref=e1342]: Chief Executive Officer
                - tab "Vani Bhatra Training Manager" [selected] [ref=e1343]:
                  - generic [ref=e1345]:
                    - generic [ref=e1350]: Vani Bhatra
                    - generic [ref=e1351]: Training Manager
                - tab "Wilson Raj Director of IT" [selected] [ref=e1352]:
                  - generic [ref=e1354]:
                    - generic [ref=e1359]: Wilson Raj
                    - generic [ref=e1360]: Director of IT
              - button "Next" [ref=e1361] [cursor=pointer]
      - generic [ref=e1365]:
        - generic [ref=e1366]:
          - generic [ref=e1367]: Upcoming Work Anniversaries
          - img "Brithday Icon" [ref=e1369]
          - generic [ref=e1370]:
            - generic [ref=e1371]:
              - generic [ref=e1372]: Vandy Rao , 3rd Work Anniversary
              - generic [ref=e1375]: Oct 4, 2026
            - generic [ref=e1376]:
              - generic [ref=e1377]: Test Test , 2nd Work Anniversary
              - generic [ref=e1380]: Oct 4, 2026
            - generic [ref=e1381]:
              - generic [ref=e1382]: patlolla Patil , 2nd Work Anniversary
              - generic [ref=e1385]: Oct 5, 2026
            - generic [ref=e1386]:
              - generic [ref=e1387]: Omi Bhaooo , 1st Work Anniversary
              - generic [ref=e1390]: Oct 5, 2026
            - generic [ref=e1391]:
              - generic [ref=e1392]: Mani Deep , 3rd Work Anniversary
              - generic [ref=e1395]: Oct 6, 2026
            - generic [ref=e1396]:
              - generic [ref=e1397]: Pavan Test , 1st Work Anniversary
              - generic [ref=e1400]: Oct 6, 2026
            - generic [ref=e1401]:
              - generic [ref=e1402]: Test Edison , 2nd Work Anniversary
              - generic [ref=e1405]: Oct 8, 2026
            - generic [ref=e1406]:
              - generic [ref=e1407]: Edison E , 2nd Work Anniversary
              - generic [ref=e1410]: Oct 8, 2026
            - generic [ref=e1411]:
              - generic [ref=e1412]: Test Onetwo , 2nd Work Anniversary
              - generic [ref=e1415]: Oct 8, 2026
            - generic [ref=e1416]:
              - generic [ref=e1417]: Ramesh Mnb , 2nd Work Anniversary
              - generic [ref=e1420]: Oct 9, 2026
            - generic [ref=e1421]:
              - generic [ref=e1422]: Samith Raj Kumar , 3rd Work Anniversary
              - generic [ref=e1425]: Oct 13, 2026
            - generic [ref=e1426]:
              - generic [ref=e1427]: Malli Babu , 3rd Work Anniversary
              - generic [ref=e1430]: Oct 13, 2026
            - generic [ref=e1431]:
              - generic [ref=e1432]: Praveena Rao , 3rd Work Anniversary
              - generic [ref=e1435]: Oct 14, 2026
            - generic [ref=e1436]:
              - generic [ref=e1437]: Vandhana Rao , 3rd Work Anniversary
              - generic [ref=e1440]: Oct 16, 2026
            - generic [ref=e1441]:
              - generic [ref=e1442]: Ajith Mnb , 2nd Work Anniversary
              - generic [ref=e1445]: Oct 17, 2026
            - generic [ref=e1446]:
              - generic [ref=e1447]: Milo Rao , 3rd Work Anniversary
              - generic [ref=e1450]: Oct 18, 2026
            - generic [ref=e1451]:
              - generic [ref=e1452]: Vyshu Rao , 3rd Work Anniversary
              - generic [ref=e1455]: Oct 19, 2026
            - generic [ref=e1456]:
              - generic [ref=e1457]: Samyukta Alakanti , 3rd Work Anniversary
              - generic [ref=e1460]: Oct 20, 2026
            - generic [ref=e1461]:
              - generic [ref=e1462]: Sneha Snehaa , 3rd Work Anniversary
              - generic [ref=e1465]: Oct 20, 2026
            - generic [ref=e1466]:
              - generic [ref=e1467]: Vaishnavi Arcot , 3rd Work Anniversary
              - generic [ref=e1470]: Oct 21, 2026
            - generic [ref=e1471]:
              - generic [ref=e1472]: Test Test , 3rd Work Anniversary
              - generic [ref=e1475]: Oct 23, 2026
            - generic [ref=e1476]:
              - generic [ref=e1477]: Reema Shetty , 3rd Work Anniversary
              - generic [ref=e1480]: Oct 24, 2026
            - generic [ref=e1481]:
              - generic [ref=e1482]: Meena Meena , 2nd Work Anniversary
              - generic [ref=e1485]: Oct 24, 2026
            - generic [ref=e1486]:
              - generic [ref=e1487]: Krishna Murali , 3rd Work Anniversary
              - generic [ref=e1490]: Oct 30, 2026
            - generic [ref=e1491]:
              - generic [ref=e1492]: Test Test , 3rd Work Anniversary
              - generic [ref=e1495]: Oct 30, 2026
        - generic [ref=e1496]:
          - generic [ref=e1497]: Upcoming Birthdays
          - img "Brithday Icon" [ref=e1499]
          - generic [ref=e1500]:
            - generic [ref=e1501]:
              - generic [ref=e1502]: Geeta Madhuri's Birthday
              - generic [ref=e1505]: Oct 5 2026
            - generic [ref=e1506]:
              - generic [ref=e1507]: Sagar Kumar Reddy's Birthday
              - generic [ref=e1510]: Oct 6 2026
            - generic [ref=e1511]:
              - generic [ref=e1512]: Tanuja Rani's Birthday
              - generic [ref=e1515]: Oct 12 2026
            - generic [ref=e1516]:
              - generic [ref=e1517]: First Shyam's Birthday
              - generic [ref=e1520]: Oct 13 2026
            - generic [ref=e1521]:
              - generic [ref=e1522]: Swapna sri's Birthday
              - generic [ref=e1525]: Oct 14 2026
            - generic [ref=e1526]:
              - generic [ref=e1527]: Ganga Gan Gavi's Birthday
              - generic [ref=e1530]: Oct 14 2026
            - generic [ref=e1531]:
              - generic [ref=e1532]: Test Probation Flow's Birthday
              - generic [ref=e1535]: Oct 15 2026
            - generic [ref=e1536]:
              - generic [ref=e1537]: Hari Chandu's Birthday
              - generic [ref=e1540]: Oct 16 2026
            - generic [ref=e1541]:
              - generic [ref=e1542]: Hari Roy's Birthday
              - generic [ref=e1545]: Oct 17 2026
            - generic [ref=e1546]:
              - generic [ref=e1547]: Sneha Wankhade's Birthday
              - generic [ref=e1550]: Oct 19 2026
            - generic [ref=e1551]:
              - generic [ref=e1552]: Probation Flow's Birthday
              - generic [ref=e1555]: Oct 22 2026
            - generic [ref=e1556]:
              - generic [ref=e1557]: Raghav Juyal's Birthday
              - generic [ref=e1560]: Oct 23 2026
        - generic [ref=e1561]:
          - img "Brithday Icon" [ref=e1563]
          - region [ref=e1567]:
            - generic [ref=e1571]:
              - generic "0" [ref=e1572]:
                - generic [ref=e1574]:
                  - paragraph [ref=e1575]: Swathi Nair
                  - paragraph [ref=e1576]: Welcome Onboard...
              - generic "0" [ref=e1577]:
                - generic [ref=e1579]:
                  - paragraph [ref=e1580]: Swathi Nair
                  - paragraph [ref=e1581]: Welcome Onboard...
              - generic [ref=e1584]:
                - paragraph [ref=e1585]: Swathi Nair
                - paragraph [ref=e1586]: Welcome Onboard...
```

# Test source

```ts
  791 |     } catch {
  792 |       await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
  793 |       await this.page.waitForURL(/\/settings\/overview|\/settings/, { timeout: 15000 }).catch(() => {});
  794 |     }
  795 |     await this.page.waitForTimeout(500);
  796 |   }
  797 | 
  798 |   async ensureSettingsOverview() {
  799 |     if (!this.page.url().match(/\/settings/)) {
  800 |       await this.openDashboard();
  801 |       await this.clickSettingsIcon();
  802 |     }
  803 |     if (!this.page.url().includes('/settings/overview')) {
  804 |       await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
  805 |       await this.page.waitForURL(/\/settings\/overview|\/settings/, { timeout: 15000 }).catch(() => {});
  806 |     }
  807 |     for (let step = 0; step < 4; step += 1) {
  808 |       await this.page.evaluate((offset) => window.scrollBy(0, offset), step % 2 === 0 ? 500 : -400);
  809 |       await this.page.waitForTimeout(250);
  810 |     }
  811 |   }
  812 | 
  813 |   timeOffSettingsToggle(): Locator {
  814 |     return this.page
  815 |       .locator('p-accordion-header, [data-pc-name="accordionheader"], .p-accordionheader, button')
  816 |       .filter({ hasText: /^Time\s*Off$/i })
  817 |       .first()
  818 |       .or(this.timeOffPanel)
  819 |       .or(this.page.locator('#settings-panel-2'));
  820 |   }
  821 | 
  822 |   async expandTimeOffSettingsPanel() {
  823 |     await this.ensureSettingsOverview();
  824 | 
  825 |     if (await this.leaveCategoryLink.isVisible({ timeout: 2000 }).catch(() => false)) {
  826 |       return;
  827 |     }
  828 | 
  829 |     const toggle = this.timeOffSettingsToggle();
  830 |     await toggle.scrollIntoViewIfNeeded().catch(() => {});
  831 |     await toggle.waitFor({ state: 'visible', timeout: 20000 });
  832 |     const expanded = await toggle.getAttribute('aria-expanded');
  833 |     const active = await toggle.getAttribute('data-p-active');
  834 |     if (expanded !== 'true' && active !== 'true') {
  835 |       await toggle.click({ force: true });
  836 |       await this.page.waitForTimeout(800);
  837 |     }
  838 |   }
  839 | 
  840 |   async openLeaveCategoryListDirect(): Promise<boolean> {
  841 |     const paths = [
  842 |       '/settings/time-off/leave-category/pending-for-submission',
  843 |       '/settings/time-off/leave-category/pending-for-submit',
  844 |       '/settings/time-off/leave-category',
  845 |     ];
  846 |     for (const path of paths) {
  847 |       await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  848 |       if (await this.pendingTab.isVisible({ timeout: 5000 }).catch(() => false)) {
  849 |         return true;
  850 |       }
  851 |       if (await this.addNewButton.isVisible({ timeout: 3000 }).catch(() => false)) {
  852 |         return true;
  853 |       }
  854 |     }
  855 |     return false;
  856 |   }
  857 | 
  858 |   async openSettingsTimeOff() {
  859 |     if (await this.openLeaveCategoryListDirect()) {
  860 |       return;
  861 |     }
  862 |     await this.expandTimeOffSettingsPanel();
  863 |   }
  864 | 
  865 |   async openFromDashboard() {
  866 |     await this.openDashboard();
  867 | 
  868 |     if (await this.openLeaveCategoryListDirect()) {
  869 |       await this.pendingTab.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  870 |       await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  871 |       return;
  872 |     }
  873 | 
  874 |     await this.expandTimeOffSettingsPanel();
  875 | 
  876 |     if (!(await this.leaveCategoryLink.isVisible({ timeout: 5000 }).catch(() => false))) {
  877 |       if (await this.openLeaveCategoryListDirect()) {
  878 |         await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  879 |         return;
  880 |       }
  881 |       await this.expandTimeOffSettingsPanel();
  882 |     }
  883 | 
  884 |     await this.leaveCategoryLink.waitFor({ state: 'visible', timeout: 20000 });
  885 |     await this.leaveCategoryLink.click();
  886 |     await this.pendingTab.waitFor({ state: 'visible', timeout: 15000 });
  887 |     await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  888 |   }
  889 | 
  890 |   async switchToPending() {
> 891 |     await this.pendingTab.click();
      |                           ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  892 |     await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  893 |   }
  894 | 
  895 |   async switchToPublished() {
  896 |     await this.publishedTab.click();
  897 |     await this.addNewButton.waitFor({ state: 'visible', timeout: 15000 });
  898 |   }
  899 | 
  900 |   async tabCount(tab: Locator): Promise<number> {
  901 |     const label = (await tab.innerText()).trim();
  902 |     const match = label.match(/\((\d+)\)/);
  903 |     if (!match) {
  904 |       throw new Error(`No record count found in tab label: "${label}"`);
  905 |     }
  906 |     return Number(match[1]);
  907 |   }
  908 | 
  909 |   async openAddForm() {
  910 |     await this.addNewButton.click();
  911 |     await this.yearDropdown.waitFor({ state: 'visible', timeout: 15000 });
  912 |     await this.cancelButton.waitFor({ state: 'visible', timeout: 15000 });
  913 |   }
  914 | 
  915 |   categoryDataWithResolvedHierarchy<T extends LeaveCategoryFormData>(data: T): T {
  916 |     if (!this.resolvedHierarchy) {
  917 |       return data;
  918 |     }
  919 |     return { ...data, ...this.resolvedHierarchy };
  920 |   }
  921 | 
  922 |   dropdownOptionCandidates(optionName: string): string[] {
  923 |     const aliases: Record<string, string[]> = {
  924 |       Kerala: ['Kerala', 'Kerela'],
  925 |       Kerela: ['Kerela', 'Kerala'],
  926 |       'Morining Test': ['Morining Test', 'Morning Test', 'Flexible', 'General'],
  927 |       General: ['General', 'Flexible'],
  928 |     };
  929 |     return aliases[optionName] ?? [optionName];
  930 |   }
  931 | 
  932 |   async selectDropdownOptionPreferOrFirst(
  933 |     resolveDropdown: () => Locator,
  934 |     optionName: string,
  935 |   ): Promise<string> {
  936 |     const dropdown = resolveDropdown();
  937 |     const current = (await this.readComboboxValue(dropdown).catch(() => '')).trim();
  938 |     const preferred = this.dropdownOptionCandidates(optionName);
  939 |     if (
  940 |       current
  941 |       && !/^(please select|select )/i.test(current)
  942 |       && preferred.some((name) => current.toLowerCase() === name.toLowerCase())
  943 |     ) {
  944 |       return current;
  945 |     }
  946 | 
  947 |     try {
  948 |       await this.selectDropdownOption(dropdown, optionName);
  949 |     } catch {
  950 |       await this.selectDropdownOptionByIndex(resolveDropdown(), 0);
  951 |     }
  952 |     await this.page.waitForTimeout(300);
  953 |     const value = (await this.readComboboxValue(resolveDropdown())).trim();
  954 |     if (!value || /^(please select|select )/i.test(value)) {
  955 |       throw new Error(`Could not select a value for dropdown (wanted "${optionName}")`);
  956 |     }
  957 |     return value;
  958 |   }
  959 | 
  960 |   async selectDropdownOption(dropdown: Locator, optionName: string) {
  961 |     const candidates = this.dropdownOptionCandidates(optionName);
  962 |     let lastError: unknown;
  963 | 
  964 |     for (const name of candidates) {
  965 |       try {
  966 |         await dropdown.scrollIntoViewIfNeeded().catch(() => {});
  967 |         await dropdown.click();
  968 |         const search = this.page.getByRole('searchbox').first();
  969 |         if (await search.isVisible({ timeout: 1000 }).catch(() => false)) {
  970 |           await search.fill(name);
  971 |           await this.page.waitForTimeout(400);
  972 |         }
  973 |         const option = this.page.getByRole('option', { name, exact: true });
  974 |         await option.waitFor({ state: 'visible', timeout: 15000 });
  975 |         await option.click();
  976 |         return;
  977 |       } catch (error) {
  978 |         lastError = error;
  979 |         await this.page.keyboard.press('Escape').catch(() => {});
  980 |         await this.page.waitForTimeout(200);
  981 |       }
  982 |     }
  983 | 
  984 |     throw lastError instanceof Error
  985 |       ? lastError
  986 |       : new Error(`Could not select dropdown option "${optionName}"`);
  987 |   }
  988 | 
  989 |   async selectDropdownOptionIfNeeded(dropdown: Locator, optionName: string) {
  990 |     const currentValue = await this.readComboboxValue(dropdown);
  991 |     if (currentValue.toLowerCase() === optionName.toLowerCase()) {
```