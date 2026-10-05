# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-entitlements.spec.ts >> Load Entitlements >> 01. navigates to Load Entitlements and shows read-only employee detail fields
- Location: tests\load-entitlements.spec.ts:41:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByText('Employee Id', { exact: true }) to be visible

```

# Page snapshot

```yaml
- generic [ref=f2e4]:
  - generic [ref=f2e8]:
    - img "Company Logo" [ref=f2e10]
    - generic [ref=f2e11]:
      - generic [ref=f2e12] [cursor=pointer]
      - generic [ref=f2e20] [cursor=pointer]
      - generic [ref=f2e28] [cursor=pointer]: 
      - generic [ref=f2e32] [cursor=pointer]
      - generic [ref=f2e42] [cursor=pointer]:
        - generic [ref=f2e43]:
          - paragraph [ref=f2e44]: saii Pavan Dinesh Tejaa
          - paragraph [ref=f2e45]: QA Tester
        - img "Profile Image" [ref=f2e47]
  - generic [ref=f2e48]:
    - generic [ref=f2e51]:
      - list [ref=f2e53]:
        - listitem [ref=f2e54] [cursor=pointer]:
          - img "Icon" [ref=f2e55]
          - text: Dashboard
        - listitem [ref=f2e56]:
          - generic [ref=f2e57]:
            - generic [ref=f2e58] [cursor=pointer]:
              - img "Icon" [ref=f2e59]
              - text: My Info
            - generic [ref=f2e60] [cursor=pointer]:
              - img "Icon" [ref=f2e61]
              - text: Employees
            - generic [ref=f2e64] [cursor=pointer]:
              - img "Icon" [ref=f2e65]
              - text: Time Off
            - generic [ref=f2e66] [cursor=pointer]:
              - img "Icon" [ref=f2e67]
              - text: Attendance
            - generic [ref=f2e68] [cursor=pointer]:
              - img "Icon" [ref=f2e69]
              - text: Reports
            - generic [ref=f2e72] [cursor=pointer]:
              - img "Icon" [ref=f2e73]
              - text: Project Management
            - generic [ref=f2e74] [cursor=pointer]:
              - img "Icon" [ref=f2e75]
              - text: Skill Set
            - generic [ref=f2e78] [cursor=pointer]:
              - img "Icon" [ref=f2e79]
              - text: On Behalf Of
            - generic [ref=f2e82] [cursor=pointer]:
              - img "Icon" [ref=f2e83]
              - text: Pending Approvals
            - generic [ref=f2e86] [cursor=pointer]:
              - img "Icon" [ref=f2e87]
              - text: PMS
        - listitem [ref=f2e88] [cursor=pointer]:
          - img "Icons" [ref=f2e91]
      - img "Powered By logo" [ref=f2e94]
    - generic [ref=f2e98]:
      - generic [ref=f2e102]:
        - generic [ref=f2e103] [cursor=pointer]: Settings
        - generic [ref=f2e104]: 
        - generic [ref=f2e106]: Time Off
        - generic [ref=f2e107]: 
        - generic [ref=f2e109]: Load Entitlements
      - generic [ref=f2e112]:
        - generic [ref=f2e113]:
          - generic [ref=f2e114]:
            - generic [ref=f2e115]: Load Entitlements
            - generic [ref=f2e116]:
              - generic [ref=f2e117]:
                - generic [ref=f2e118]: Select Employee *
                - generic [ref=f2e120] [cursor=pointer]:
                  - combobox "Please select Employee" [expanded] [ref=f2e121]
                  - button "dropdown trigger" [expanded] [ref=f2e122]
                  - searchbox "Search by Employee Id or Name" [active] [ref=f2e132]:
                    - listbox "Option List" [ref=f2e133]:
                      - option "- rajendra singh" [ref=f2e135]
                      - option "- testing tour" [ref=f2e138]
                      - option "- sudhakar metapalli" [ref=f2e141]
                      - option "- bunny anumala" [ref=f2e144]
                      - option "- nalam ravindhra" [ref=f2e147]
                      - option "- rajesh zithwaday" [ref=f2e150]
                      - option "- Meera Menon" [ref=f2e153]
                      - option "- jagadish kinnera" [ref=f2e156]
                      - option "- vasavi G" [ref=f2e159]
                      - option "- somesh kumar" [ref=f2e162]
                      - option "- Harsha Teja" [ref=f2e165]
                      - option "- pavan sai" [ref=f2e168]
                      - option "- DArpita Bhanjara" [ref=f2e171]
                      - option "- Divya Reddy" [ref=f2e174]
                      - option "- Inter Employee" [ref=f2e177]
                      - option "- User undefined" [ref=f2e180]
                      - option "- Arpita Bhanja" [ref=f2e183]
                      - option "- User undefined" [ref=f2e186]
                      - option "- User undefined" [ref=f2e189]
                      - option "- Meera Sharma" [ref=f2e192]
                      - option "- Nandini Pillai" [ref=f2e195]
                      - option "- Rehman Dakait" [ref=f2e198]
                      - option "- Gfdgfd Dfffffffg" [ref=f2e201]
                      - option "- Nandini Joshi" [ref=f2e204]
                      - option "- Nandini Joshi" [ref=f2e207]
                      - option "- Soumya Soumya" [ref=f2e210]
                      - option "- Dfgfd Dfd" [ref=f2e213]
                      - option "- Asfa Asf" [ref=f2e216]
                      - option "- Vcbvc Bvbv" [ref=f2e219]
                      - option "- Kamal Simha" [ref=f2e222]
                      - option "- Sri vani" [ref=f2e225]
                      - option "- anatha lakshmi manjula" [ref=f2e228]
                      - option "- Hamza Ali Khan" [ref=f2e231]
                      - option "- naresh singaprolu" [ref=f2e234]
                      - option "- Graham Thomas" [ref=f2e237]
                      - option "- Mandy Joe" [ref=f2e240]
                      - option "- Ray Son" [ref=f2e243]
                      - option "rhr123332 - prospec contractor" [ref=f2e246]
                      - option "rHR119 - Pankaj Singh" [ref=f2e249]
                      - option "SNAD0045 - Dd Ddd" [ref=f2e252]
                      - option "SIS0245 - Bhavitha Reddy" [ref=f2e255]
                      - option "SDD302333 - Arpita Bhanja" [ref=f2e258]
                      - option "SDA1222333 - undefined undefined" [ref=f2e261]
                      - option "SD302333 - rishika ramswamy" [ref=f2e264]
                      - option "SD302262 - saii Pavan Dinesh Tejaa" [ref=f2e267]
                      - option "SD302139 - Kushhhh joee Bhuvanam" [ref=f2e270]
                      - option "SD302135 - Induu Priyaa" [ref=f2e273]
                      - option "SD302134 - jagadish Rathnavel" [ref=f2e276]
                      - option "SD3021334 - Anil Anilu" [ref=f2e279]
                      - option "SD302107 - Bavana sandhya" [ref=f2e282]
                      - option "SD302099 - Patlolla Akhil" [ref=f2e285]
                      - option "SD302024 - Poorna Ramisetti Sai" [ref=f2e288]
                      - option "SD3020113 - Uma Maheswara Sai Danda" [ref=f2e291]
                      - option "SD11160 - Dileep Kumar Bhuvanam" [ref=f2e294]
                      - option "RTH6237 - Vamsgi k Fgdgsdf" [ref=f2e297]
                      - option "RHR973094 - Meera Joshi" [ref=f2e300]
                      - option "RHR952798 - Kavya Rao" [ref=f2e303]
                      - option "RHR812558 - Siddharth Sharma" [ref=f2e306]
                      - option "RHR784253 - Sneha Mehta" [ref=f2e309]
                      - option "RHR767934 - Swetha Iyer" [ref=f2e312]
                      - option "RHR6238 - Tryhtr Gfhgf" [ref=f2e315]
                      - option "RHR515454 - Vikram Iyer" [ref=f2e318]
                      - option "RHR381657 - Varun Gupta" [ref=f2e321]
                      - option "RHR313837 - Manish Reddy" [ref=f2e324]
                      - option "RHR291121 - Kavya Joshi" [ref=f2e327]
                      - option "RHR234 - Sindhuja Priya" [ref=f2e330]
                      - option "RHR179803 - Nandini Joshi" [ref=f2e333]
                      - option "RHR154 - srikar kumar" [ref=f2e336]
                      - option "RHR132885 - Kavya Rao" [ref=f2e339]
                      - option "RHR125 - suresh singh" [ref=f2e342]
                      - option "RHR1232 - arpitha Bhanja" [ref=f2e345]
                      - option "RHR123 - Jack Jonny" [ref=f2e348]
                      - option "RHR12297 - Subhash Ch" [ref=f2e351]
                      - option "RHR118 - siddarth kumar" [ref=f2e354]
                      - option "RHR117 - gowtham nandha" [ref=f2e357]
                      - option "RHR116 - Pavan Nedunuri" [ref=f2e360]
                      - option "RHR115 - aravindh Kumar" [ref=f2e363]
                      - option "RHR111 - Indu Kumari" [ref=f2e366]
                      - option "RHR09 - krish kumar" [ref=f2e369]
                      - option "RHR067 - Arjun Iyer" [ref=f2e372]
                      - option "RHR061 - Adam Smith" [ref=f2e375]
                      - option "RHR06 - Sri keerthan" [ref=f2e378]
                      - option "RHR058 - Test EMP BCD" [ref=f2e381]
                      - option "RHR057 - Test Emp abc" [ref=f2e384]
                      - option "RHR056 - Sam Test One" [ref=f2e387]
                      - option "RHR055 - syed raj Ali pasha" [ref=f2e390]
                      - option "RHR054 - Sowmya Reddy" [ref=f2e393]
                      - option "RHR053 - Avinash Kour" [ref=f2e396]
                      - option "RHR052 - Hema Chandra Vedala" [ref=f2e399]
                      - option "RHR049 - Sagar Kumar Reddy" [ref=f2e402]
                      - option "RHR048 - Trisha S Pandey" [ref=f2e405]
                      - option "RHR047 - Dany Rathod" [ref=f2e408]
                      - option "RHR039 - roja g" [ref=f2e411]
                      - option "RHR037 - Pavani siri" [ref=f2e414]
                      - option "RHR036 - Swathi Rama Krishna Sumathi Ram priya Shekhar" [ref=f2e417]
                      - option "RHR035 - Testingqa Testingsda test" [ref=f2e420]
                      - option "RHR03 - Sai Test" [ref=f2e423]
                      - option "RHR028 - Sushma sri Sushii" [ref=f2e426]
                      - option "RHR026 - Sanjiv s Ram" [ref=f2e429]
                      - option "RHR024 - Tanya Sharma" [ref=f2e432]
                      - option "RHR0234 - Nani Tuityuit" [ref=f2e435]
                      - option "RHR0232 - Mnbmnbmnbmb Mnbmnb Mnb" [ref=f2e438]
                      - option "RHR023 - Mahija Preeth Singh" [ref=f2e441]
                      - option "RHR0228 - Fffffff Vamsi Fr" [ref=f2e444]
                      - option "RHR0227 - Manu Manu" [ref=f2e447]
                      - option "RHR021 - Raghu ram senthel" [ref=f2e450]
                      - option "RHR020 - krish nallamatu" [ref=f2e453]
                      - option "RHR02 - Hari Chandu" [ref=f2e456]
                      - option "RHR019 - Sri Hari" [ref=f2e459]
                      - option "RHR017 - kumar stel" [ref=f2e462]
                      - option "RHR016 - ram achanta" [ref=f2e465]
                      - option "RHR015 - kiran swami" [ref=f2e468]
                      - option "RHR014 - Nisha e3rtyj gyy" [ref=f2e471]
                      - option "RHR013 - Test User" [ref=f2e474]
                      - option "RHR011 - Raghav Juyal" [ref=f2e477]
                      - option "RHR010 - Sau Ram" [ref=f2e480]
                      - option "RHR0040 - Teja Dinesh" [ref=f2e483]
                      - option "RHR0036 - Kushal Raj" [ref=f2e486]
                      - option "RHR0032 - Jack omi omijack" [ref=f2e489]
                      - option "RHR0031 - omi prakash DHARAVATH" [ref=f2e492]
                      - option "RHR0027 - Kiran Sami Chanu" [ref=f2e495]
                      - option "RHR0025 - Pratyusha Gopal" [ref=f2e498]
                      - option "RHR0023 - Manoj Kumar" [ref=f2e501]
                      - option "RHR0020 - John joseph" [ref=f2e504]
                      - option "RHR0019 - Sitha Ram" [ref=f2e507]
                      - option "RHR0017 - Sony Kumari" [ref=f2e510]
                      - option "RHR0013 - Kavya Komali" [ref=f2e513]
                      - option "RHR0011 - Farida Abraham" [ref=f2e516]
                      - option "RHR0008 - test test" [ref=f2e519]
                      - option "RHR0007 - Francisco Wood" [ref=f2e522]
                      - option "RHR0006 - Chandrima A" [ref=f2e525]
                      - option "RHR0004 - DSP Mohammad Siraj" [ref=f2e528]
                      - option "RHR0002 - Testing Trainee" [ref=f2e531]
                      - option "RHR0001 - Rainer Unare" [ref=f2e534]
                      - option "RH54675 - Arpita ErwerwrQ Edison" [ref=f2e537]
                      - option "RH016 - Nageswara Rao Veeravalli" [ref=f2e540]
                      - option "FPST0160 - Santhosh Kumar" [ref=f2e543]
                      - option "FPST0140 - Re Reee" [ref=f2e546]
                      - option "FPST0136 - Santhosh Kumar" [ref=f2e549]
                      - option "FPST0134 - Qwerty Qwerty" [ref=f2e552]
                      - option "FPST0133 - Dfg Fgfg" [ref=f2e555]
                      - option "FPST0113 - Xzc Zczxc" [ref=f2e558]
                      - option "FPST0102 - Jkkkkj Jkkk" [ref=f2e561]
                      - option "FPST0097 - euttannau euttannau" [ref=f2e564]
                      - option "FPST0096 - Hnh Gfhgf" [ref=f2e567]
                      - option "FPST0094 - Dsf Dsf" [ref=f2e570]
                      - option "FPST0086 - Were Were" [ref=f2e573]
                      - option "FPST0069 - veddapa veddapa" [ref=f2e576]
                      - option "FPST0020 - kushitha bhuvanam" [ref=f2e579]
                      - option "FPS6233 - Dbv Vamsi Ccccc" [ref=f2e582]
                      - option "FPS6231 - Fghdghd Ghfdgh" [ref=f2e585]
                      - option "FPS6062da - Testing Probation" [ref=f2e588]
                      - option "FPS60623 - WerweR TherterT RtqwE" [ref=f2e591]
                      - option "FPS60623 - Tyurtutyut Etuty" [ref=f2e594]
                      - option "FPS60623 - Rrrr Rrrr" [ref=f2e597]
                      - option "FPS60622 - Kiran Sami" [ref=f2e600]
                      - option "FPS6062 - Test Probation Flow" [ref=f2e603]
                      - option "FPS6062 - Abc Test" [ref=f2e606]
                      - option "FPS6062 - Probation Flow" [ref=f2e609]
                      - option "FPS6062 - Micky Micky" [ref=f2e612]
                      - option "FPS60576 - Dhana Raj Jam" [ref=f2e615]
                      - option "FPS60576 - Govardhan Reddy Reddy Morsu" [ref=f2e618]
                      - option "FPS6055 - Rajesh Seepana" [ref=f2e621]
                      - option "FPS6053 - Ganga Gan Gavi" [ref=f2e624]
                      - option "FPS6049 - Trhwrth Htrthrs" [ref=f2e627]
                      - option "FPS6048 - rammm sai siiii" [ref=f2e630]
                      - option "FPS6044 - Mallesh Jollou Yadav" [ref=f2e633]
                      - option "FPS6043 - Sneha Snehaa" [ref=f2e636]
                      - option "FPS6041 - Test Test" [ref=f2e639]
                      - option "FPS6039 - Ruhan Shetty" [ref=f2e642]
                      - option "FPS6035 - Sneha Wankhade" [ref=f2e645]
                      - option "FPS6034 - Sneha Varma" [ref=f2e648]
                      - option "FPS6033 - Sravani Reddy" [ref=f2e651]
                      - option "FPS6030 - Malli Babu" [ref=f2e654]
                      - option "FPS6029 - Samith Raj Kumar" [ref=f2e657]
                      - option "FPS6028 - Vyshu Rao" [ref=f2e660]
                      - option "FPS6027 - Sam Reddy" [ref=f2e663]
                      - option "FPS6025 - Ravi Kumar" [ref=f2e666]
                      - option "FPS6024 - Pawan Pawan" [ref=f2e669]
                      - option "FPS6023 - Mounika Reddy" [ref=f2e672]
                      - option "FPS6022 - Sampurnesh Babu" [ref=f2e675]
                      - option "FPS6020 - Sindhu Reddy" [ref=f2e678]
                      - option "FPS6019 - Krishna Murali" [ref=f2e681]
                      - option "FPS6018 - Simple Simple" [ref=f2e684]
                      - option "FPS6017 - Rajesh Ragava" [ref=f2e687]
                      - option "FPS6016 - Neeru Neeru" [ref=f2e690]
                      - option "FPS6015 - Neha Rao" [ref=f2e693]
                      - option "FPS6013 - Test Test" [ref=f2e696]
                      - option "FPS6012 - Ruyu Rao" [ref=f2e699]
                      - option "FPS6011 - TressI RaO" [ref=f2e702]
                      - option "FPS6010 - Milo Rao" [ref=f2e705]
                      - option "FPS6008 - Prabhakar Tpr" [ref=f2e708]
                      - option "FPS6007 - Sharu Palamuri" [ref=f2e711]
                      - option "FPS6005 - Raaga Sanjay" [ref=f2e714]
                      - option "FPS6003 - Swapna Sundari" [ref=f2e717]
                      - option "FPS6002 - Sahithi Sahi" [ref=f2e720]
                      - option "FPS6001 - Vaishnavi Lalitha" [ref=f2e723]
                      - option "FPS5478 - Ravi Rao" [ref=f2e726]
                      - option "FPS5477 - Saranya Kumari" [ref=f2e729]
                      - option "FPS5476 - Babji Korada" [ref=f2e732]
                      - option "FPS5475 - Vyshnavi Tanuku" [ref=f2e735]
                      - option "FPS5474 - Rtre Rtyrty" [ref=f2e738]
                      - option "FPS5467 - Praveena Rao" [ref=f2e741]
                      - option "FPS5464 - Santhosh Kumar" [ref=f2e744]
                      - option "FPS5458 - Sampat Kumar Arja" [ref=f2e747]
                      - option "FPS5457 - Vaishnavi Arcot" [ref=f2e750]
                      - option "FPS5452 - Vandy Rao" [ref=f2e753]
                      - option "FPS5451 - Mani Deep" [ref=f2e756]
                      - option "FPS5447 - Naveen Reddy" [ref=f2e759]
                      - option "FPS5445 - Viraj Reddy" [ref=f2e762]
                      - option "FPS5436 - Vandhana Rao" [ref=f2e765]
                      - option "FPS5435 - Sanju Sanjay" [ref=f2e768]
                      - option "FPS5433 - Hemanth Kumar" [ref=f2e771]
                      - option "FPS5431 - Mounika Boinapally" [ref=f2e774]
                      - option "FPS5423 - Ramya Tamma" [ref=f2e777]
                      - option "FPS5422 - Sujith Krishna" [ref=f2e780]
                      - option "FPS5421 - Dinesh Kumar Kotapati" [ref=f2e783]
                      - option "FPS5409 - Usha Sri" [ref=f2e786]
                      - option "FPS5407 - Sriya Reddy" [ref=f2e789]
                      - option "FPS4392 - Naga Sai mavuri Reddy" [ref=f2e792]
                      - option "FPS4391 - Sowmya kishore Raj" [ref=f2e795]
                      - option "FPS4388 - Rajanya channu Raj" [ref=f2e798]
                      - option "FPS4387 - Apple seepana Raj" [ref=f2e801]
                      - option "FPS4383 - Nilesh varma Kumar" [ref=f2e804]
                      - option "FPS4382 - Sanju mavuri Reddy" [ref=f2e807]
                      - option "FPS4380 - Kajal morsu Kajol" [ref=f2e810]
                      - option "FPS4200 - Ganesh Babu ravuri" [ref=f2e813]
                      - option "FPS3377 - Sripathi Mamillapalli" [ref=f2e816]
                      - option "FPS3376 - Prasanth morsu Mitupally" [ref=f2e819]
                      - option "FPS3375 - Srikanth Bondu" [ref=f2e822]
                      - option "FPS3372 - Priyanka reddy Chakrahari Raj" [ref=f2e825]
                      - option "FPS3371 - Rupa Sai Devi" [ref=f2e828]
                      - option "FPS3370 - Praveen Kumar shetty Channu" [ref=f2e831]
                      - option "FPS3365 - Mallesh Jallolu" [ref=f2e834]
                      - option "FPS3361 - Chinni Rohini Reddy" [ref=f2e837]
                      - option "FPS3360 - Koushik shetty Anumasa" [ref=f2e840]
                      - option "FPS3359 - Samith Raj varma Chatla" [ref=f2e843]
                      - option "FPS3358 - Sandhya mavuri Tenugu" [ref=f2e846]
                      - option "FPS3357 - Sai Krishna kishore Kumar" [ref=f2e849]
                      - option "FPS33558 - Satish Kumar koratala" [ref=f2e852]
                      - option "FPS3355 - Arjun Chandra Goruganti" [ref=f2e855]
                      - option "FPS3354 - Govardhan Reddy" [ref=f2e858]
                      - option "FPS3353 - Sowri Babu Narisetty" [ref=f2e861]
                      - option "FPS3352 - Sahithi Mounika reddy Lankisetty" [ref=f2e864]
                      - option "FPS3345 - Priyanka shetty Raj" [ref=f2e867]
                      - option "FPS06039 - Reema Shetty" [ref=f2e870]
                      - option "FPS06038 - Samyukta Alakanti" [ref=f2e873]
                      - option "FPS0601 - Rama Rao" [ref=f2e876]
                      - option "FPS0600 - Bhavani seepana Rao" [ref=f2e879]
                      - option "FP5462 - Mudassir Mohammed" [ref=f2e882]
                      - option "FP5459 - Ramakrishna Naidu Shanshala" [ref=f2e885]
                      - option "EMP1004 - Priya S. Nair" [ref=f2e888]
                      - option "EMP1003 - Rahul Verma" [ref=f2e891]
                      - option "EMP1002 - Ananya R. Iyer" [ref=f2e894]
                      - option "DFD57567567 - Vishnu Siri Mouni" [ref=f2e897]
                      - option "9987 - Test CHECK Edison" [ref=f2e900]
                      - option "8709 - Meena Meena" [ref=f2e903]
                      - option "7777 - Test Probation Flow" [ref=f2e906]
                      - option "6454353 - Jahnavi sri" [ref=f2e909]
                      - option "55345345 - Yuiyu Uiyuiyu" [ref=f2e912]
                      - option "5466 - Test Retet Test" [ref=f2e915]
                      - option "54345 - Test CHECK NAME Edison" [ref=f2e918]
                      - option "4353453 - Test Emails Onetwo" [ref=f2e921]
                      - option "423534 - HariniNI A" [ref=f2e924]
                      - option "3555 - Nbmk Nmbn" [ref=f2e927]
                      - option "3345345 - Ramesh Mnb" [ref=f2e930]
                      - option "3242345 - Ajithh Mn" [ref=f2e933]
                      - option "312142 - Rohit Name" [ref=f2e936]
                      - option "1478 - Vvv Vvv" [ref=f2e939]
                      - option "12982 - Amit Verma" [ref=f2e942]
                      - option "12859 - Anjali Pillai" [ref=f2e945]
                      - option "1213 - Test Probation Employee" [ref=f2e948]
                - generic [ref=f2e957]: Employee Selection is required
              - generic [ref=f2e958]:
                - generic [ref=f2e959]: Work Email
                - textbox "Work Email" [disabled] [ref=f2e960]
              - generic [ref=f2e961]:
                - generic [ref=f2e962]: Date of Joining
                - textbox "Date of Joining" [disabled] [ref=f2e963]
              - generic [ref=f2e964]:
                - generic [ref=f2e965]: Location
                - textbox "Location" [disabled] [ref=f2e966]
              - generic [ref=f2e967]:
                - generic [ref=f2e968]: Sub Location
                - textbox "Sub Location" [disabled] [ref=f2e969]
              - generic [ref=f2e970]:
                - generic [ref=f2e971]: Shift
                - textbox "Shift" [disabled] [ref=f2e972]
          - button "Load Entitlements" [disabled] [ref=f2e974] [cursor=pointer]
        - text:  
```

# Test source

```ts
  128 |       this.shiftInput,
  129 |       this.firstNameInput,
  130 |       this.lastNameInput,
  131 |     ];
  132 |   }
  133 | 
  134 |   categoryTab(categoryName: string) {
  135 |     return this.page
  136 |       .getByRole('listitem')
  137 |       .filter({ hasText: categoryName })
  138 |       .or(this.categoryRow(categoryName))
  139 |       .first();
  140 |   }
  141 | 
  142 |   categoryRow(categoryName: string) {
  143 |     return this.entitlementsTable.getByRole('row').filter({ hasText: categoryName }).first();
  144 |   }
  145 | 
  146 |   completedEntitlementRow(categoryName: string) {
  147 |     return this.page
  148 |       .getByRole('row')
  149 |       .filter({ hasText: categoryName })
  150 |       .filter({ hasText: /Completed/i })
  151 |       .first();
  152 |   }
  153 | 
  154 |   async hasCompletedEntitlements() {
  155 |     const statusHeaderVisible = await this.page
  156 |       .getByRole('columnheader', { name: /Status/i })
  157 |       .isVisible()
  158 |       .catch(() => false);
  159 |     const completedVisible = await this.page
  160 |       .getByRole('cell', { name: /^Completed$/i })
  161 |       .first()
  162 |       .isVisible()
  163 |       .catch(() => false);
  164 |     return statusHeaderVisible && completedVisible;
  165 |   }
  166 | 
  167 |   async expectCompletedEntitlement(
  168 |     categoryName: string,
  169 |     days: string,
  170 |     frequency: string,
  171 |   ) {
  172 |     const row = this.completedEntitlementRow(categoryName);
  173 |     await expect(row).toBeVisible({ timeout: 15000 });
  174 |     const rowText = (await row.innerText()).replace(/\s+/g, ' ');
  175 |     expect(rowText).toContain(categoryName);
  176 |     expect(rowText).toContain(days);
  177 |     expect(rowText).toContain(frequency);
  178 |     expect(rowText).toMatch(/Completed/i);
  179 |   }
  180 | 
  181 |   entitlementDataRows() {
  182 |     return this.entitlementsTable.locator('tbody tr').filter({
  183 |       hasNotText: /No Data Found/i,
  184 |     });
  185 |   }
  186 | 
  187 |   async openDashboard() {
  188 |     if (!this.page.url().includes('/dashboard/emp')) {
  189 |       await this.page.goto('/dashboard/emp', { waitUntil: 'domcontentloaded' });
  190 |     }
  191 |     await this.page.waitForURL(/\/dashboard\/emp/, { timeout: 30000 });
  192 |     await this.page
  193 |       .getByText('Have a nice day at work!')
  194 |       .waitFor({ state: 'visible', timeout: 15000 });
  195 |   }
  196 | 
  197 |   async openSettingsTimeOff() {
  198 |     await this.settingsIcon.click();
  199 |     await this.page.waitForTimeout(1000);
  200 | 
  201 |     if (!(await this.timeOffPanel.isVisible({ timeout: 5000 }).catch(() => false))) {
  202 |       await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
  203 |       await this.page.waitForURL(/\/settings\/overview|\/settings/, { timeout: 15000 });
  204 |       await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  205 |       await this.page.waitForTimeout(500);
  206 |     }
  207 | 
  208 |     await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
  209 |     await this.timeOffPanel.scrollIntoViewIfNeeded().catch(() => {});
  210 |     await this.timeOffPanel.click({ force: true });
  211 |     await this.page.waitForTimeout(500);
  212 |   }
  213 | 
  214 |   async openFromDashboard() {
  215 |     await this.openDashboard();
  216 |     await this.openSettingsTimeOff();
  217 | 
  218 |     if (!(await this.loadEntitlementsLink.isVisible({ timeout: 5000 }).catch(() => false))) {
  219 |       await this.page.goto('/settings/overview', { waitUntil: 'domcontentloaded' });
  220 |       await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  221 |       await this.page.waitForTimeout(500);
  222 |       await this.timeOffPanel.waitFor({ state: 'visible', timeout: 15000 });
  223 |       await this.timeOffPanel.click({ force: true });
  224 |     }
  225 | 
  226 |     await this.loadEntitlementsLink.waitFor({ state: 'visible', timeout: 15000 });
  227 |     await this.loadEntitlementsLink.click();
> 228 |     await this.page.getByText('Employee Id', { exact: true }).waitFor({ state: 'visible', timeout: 15000 });
      |                                                               ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  229 |     await this.employeeCombobox.waitFor({ state: 'visible', timeout: 15000 });
  230 |     await this.loadEntitlementsButton.waitFor({ state: 'visible', timeout: 15000 });
  231 |   }
  232 | 
  233 |   async selectEmployee(
  234 |     searchText: string = LOAD_ENTITLEMENTS_EMPLOYEE.search,
  235 |     optionLabel: string = LOAD_ENTITLEMENTS_EMPLOYEE.optionLabel,
  236 |   ) {
  237 |     await this.employeeCombobox.click();
  238 |     await this.employeeSearchbox.waitFor({ state: 'visible', timeout: 5000 });
  239 |     await this.employeeSearchbox.fill(searchText);
  240 |     await this.page.waitForTimeout(800);
  241 | 
  242 |     const escaped = optionLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  243 |     const option = this.page
  244 |       .getByRole('option', { name: new RegExp(escaped, 'i') })
  245 |       .or(this.page.getByRole('listitem').filter({ hasText: new RegExp(escaped, 'i') }))
  246 |       .or(this.page.getByText(new RegExp(escaped, 'i')));
  247 |     await option.first().click({ timeout: 15000 });
  248 |     await this.page.waitForTimeout(1000);
  249 |   }
  250 | 
  251 |   async expectFieldReadOnly(field: Locator) {
  252 |     const disabled = await field.isDisabled().catch(() => false);
  253 |     const readOnly = (await field.getAttribute('readonly')) !== null;
  254 |     const ariaReadOnly = (await field.getAttribute('aria-readonly')) === 'true';
  255 |     const className = (await field.getAttribute('class').catch(() => '')) || '';
  256 |     const parentDisabled = await field
  257 |       .locator('xpath=ancestor::*[contains(@class,"p-disabled")][1]')
  258 |       .count()
  259 |       .then((count) => count > 0)
  260 |       .catch(() => false);
  261 | 
  262 |     expect(
  263 |       disabled || readOnly || ariaReadOnly || className.includes('p-disabled') || parentDisabled,
  264 |       'field should be read-only or disabled before employee selection',
  265 |     ).toBeTruthy();
  266 |   }
  267 | 
  268 |   async expectReadOnlyFieldsBeforeSelection() {
  269 |     await expect(this.employeeCombobox).toBeEnabled();
  270 | 
  271 |     for (const field of this.readOnlyFields()) {
  272 |       await expect(field).toBeVisible();
  273 |       await this.expectFieldReadOnly(field);
  274 |     }
  275 |   }
  276 | 
  277 |   async expectEmployeeDetailsPopulated(expected: LeaveAllocationBaseFilters) {
  278 |     await expect(this.workEmailInput).not.toHaveValue('');
  279 |     await expect(this.dateOfJoiningInput).not.toHaveValue('');
  280 |     await expect(this.locationInput).toHaveValue(new RegExp(expected.location, 'i'));
  281 |     await expect(this.subLocationInput).toHaveValue(new RegExp(expected.subLocation, 'i'));
  282 |     await expect(this.shiftInput).toHaveValue(new RegExp(expected.shift, 'i'));
  283 |   }
  284 | 
  285 |   async expectCategoryTabsVisible(categoryNames: string[]) {
  286 |     for (const categoryName of categoryNames) {
  287 |       await expect(this.categoryTab(categoryName)).toBeVisible({ timeout: 15000 });
  288 |     }
  289 |   }
  290 | 
  291 |   async selectCategoryTab(categoryName: string) {
  292 |     await this.categoryTab(categoryName).click();
  293 |     await this.page.waitForTimeout(500);
  294 |   }
  295 | 
  296 |   async expectEntitlementsTableVisible() {
  297 |     await expect(this.entitlementsTable).toBeVisible();
  298 |     await expect(this.categoryHeader.or(this.cycleHeader)).toBeVisible();
  299 |     await expect(this.entitlementDaysHeader).toBeVisible();
  300 |     await expect(this.entitlementDataRows().first()).toBeVisible({ timeout: 15000 });
  301 |   }
  302 | 
  303 |   async expectCategoryEntitlement(
  304 |     categoryName: string,
  305 |     expectation: EntitlementRowExpectation,
  306 |   ) {
  307 |     const tab = this.page.getByRole('listitem').filter({ hasText: categoryName }).first();
  308 |     if (await tab.isVisible().catch(() => false)) {
  309 |       await tab.click();
  310 |       await this.page.waitForTimeout(500);
  311 |     }
  312 | 
  313 |     const row = this.categoryRow(categoryName);
  314 |     await expect(row).toBeVisible({ timeout: 15000 });
  315 |     await expect(row).toContainText(expectation.days);
  316 | 
  317 |     if (await this.frequencyTypeLabel.isVisible().catch(() => false)) {
  318 |       await expect(
  319 |         this.page.getByText(new RegExp(`Frequency Type:\\s*${expectation.frequency}`, 'i')),
  320 |       ).toBeVisible();
  321 |     }
  322 | 
  323 |     if (expectation.cyclePattern) {
  324 |       const tableText = (await this.entitlementsTable.innerText()).replace(/\s+/g, ' ');
  325 |       if (expectation.cyclePattern.test(tableText)) {
  326 |         expect(tableText).toMatch(expectation.cyclePattern);
  327 |       }
  328 |     }
```