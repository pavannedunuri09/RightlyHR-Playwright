# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: leaves.spec.ts >> Leaves >> 05. Cancel via kebab >> cancels a future-dated leave from Waiting For Approval via kebab menu
- Location: tests\leaves.spec.ts:517:9

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.dropdown-menu.show, .dropdown-menu[style*="display: block"]').getByText('Cancel Leave', { exact: true }).or(locator('table tbody tr').filter({ hasText: 'Oct 9,' }).first().locator('a.dropdown-item').filter({ hasText: 'Cancel Leave' }).filter({ visible: true })).first()

```

# Page snapshot

```yaml
- generic [ref=f2e4]:
  - generic [ref=f2e8]:
    - img "Company Logo" [ref=f2e10]
    - generic [ref=f2e11]:
      - generic [ref=f2e12] [cursor=pointer]
      - generic [ref=f2e20] [cursor=pointer]
      - generic [ref=f2e28] [cursor=pointer]
      - generic [ref=f2e39] [cursor=pointer]:
        - paragraph [ref=f2e40]: Saii Pavan Dinesh Teja
        - paragraph [ref=f2e41]: Chief Executive Officer
  - generic [ref=f2e47]:
    - generic [ref=f2e50]:
      - list [ref=f2e52]:
        - listitem [ref=f2e53] [cursor=pointer]:
          - img "Icon" [ref=f2e54]
          - text: Dashboard
        - listitem [ref=f2e55]:
          - generic [ref=f2e56]:
            - generic [ref=f2e57] [cursor=pointer]:
              - img "Icon" [ref=f2e58]
              - text: Employees
            - generic [ref=f2e59] [cursor=pointer]:
              - img "Icon" [ref=f2e60]
              - text: My Info
            - generic [ref=f2e61] [cursor=pointer]:
              - img "Icon" [ref=f2e62]
              - text: Reports
            - generic [ref=f2e65] [cursor=pointer]:
              - img "Icon" [ref=f2e66]
              - text: Time Off
            - generic [ref=f2e67] [cursor=pointer]:
              - img "Icon" [ref=f2e68]
              - text: Attendance
            - generic [ref=f2e71] [cursor=pointer]:
              - img "Icon" [ref=f2e72]
              - text: Project Management
            - generic [ref=f2e73] [cursor=pointer]:
              - img "Icon" [ref=f2e74]
              - text: Skill Set
            - generic [ref=f2e77] [cursor=pointer]:
              - img "Icon" [ref=f2e78]
              - text: On Behalf Of
            - generic [ref=f2e81] [cursor=pointer]:
              - img "Icon" [ref=f2e82]
              - text: Pending Approvals
            - generic [ref=f2e85] [cursor=pointer]:
              - img "Icon" [ref=f2e86]
              - text: PMS
        - listitem [ref=f2e87] [cursor=pointer]:
          - img "Icons" [ref=f2e90]
      - img "Powered By logo" [ref=f2e93]
    - generic [ref=f2e98]:
      - generic [ref=f2e100]:
        - generic [ref=f2e101]:
          - generic [ref=f2e102]:
            - text: Time Off
            - generic [ref=f2e103]: 
          - generic [ref=f2e105]: Leaves
          - generic [ref=f2e108] [cursor=pointer]
        - generic [ref=f2e112]:
          - generic [ref=f2e113]:
            - generic [ref=f2e114]: Select Employee
            - generic [ref=f2e116] [cursor=pointer]:
              - combobox "Select employee name" [ref=f2e117]
              - button "dropdown trigger" [ref=f2e118]
          - generic [ref=f2e122]:
            - generic [ref=f2e123]: Select Year
            - generic [ref=f2e126] [cursor=pointer]:
              - combobox "2026" [ref=f2e127]
              - button "dropdown trigger" [ref=f2e128]
          - button "Request Leave" [ref=f2e133] [cursor=pointer]
          - button "View Leave Summary" [ref=f2e135] [cursor=pointer]
      - generic [ref=f2e138]:
        - generic [ref=f2e139]:
          - generic [ref=f2e140]:
            - paragraph [ref=f2e141]: General Leave
            - generic [ref=f2e142]:
              - generic [ref=f2e143]:
                - paragraph [ref=f2e144]: Booked
                - paragraph [ref=f2e145]: "5.5"
              - generic [ref=f2e147]:
                - paragraph [ref=f2e148]: Processed
                - paragraph [ref=f2e149]: "3"
          - generic [ref=f2e150]: 3.5/12
        - generic [ref=f2e153]:
          - generic [ref=f2e154]:
            - paragraph [ref=f2e155]: Sick Leave
            - generic [ref=f2e156]:
              - generic [ref=f2e157]:
                - paragraph [ref=f2e158]: Booked
                - paragraph [ref=f2e159]: "0"
              - generic [ref=f2e161]:
                - paragraph [ref=f2e162]: Processed
                - paragraph [ref=f2e163]: "0"
          - generic [ref=f2e164]: 12/12
      - generic [ref=f2e167]:
        - list [ref=f2e171]:
          - listitem [ref=f2e172]:
            - generic [ref=f2e173] [cursor=pointer]:
              - img "Icon" [ref=f2e174]
              - generic [ref=f2e175]: Waiting For Approval (6)
          - listitem [ref=f2e177]:
            - generic [ref=f2e178] [cursor=pointer]:
              - img "Icon" [ref=f2e179]
              - generic [ref=f2e180]: Approved (2)
          - listitem [ref=f2e182]:
            - generic [ref=f2e183] [cursor=pointer]:
              - img "Icon" [ref=f2e184]
              - generic [ref=f2e185]: Processed (3)
          - listitem [ref=f2e187]:
            - generic [ref=f2e188] [cursor=pointer]:
              - img "Icon" [ref=f2e189]
              - generic [ref=f2e190]: Rejected (4)
          - listitem [ref=f2e192]:
            - generic [ref=f2e193] [cursor=pointer]:
              - img "Icon" [ref=f2e194]
              - generic [ref=f2e195]: Cancelled (0)
        - table [ref=f2e204]:
          - rowgroup [ref=f2e205]:
            - row [ref=f2e206]:
              - columnheader [ref=f2e207]:
                - checkbox [ref=f2e211] [cursor=pointer]
              - columnheader [ref=f2e213] [cursor=pointer]
              - columnheader [ref=f2e222] [cursor=pointer]
              - columnheader [ref=f2e231] [cursor=pointer]
              - columnheader [ref=f2e240] [cursor=pointer]
              - columnheader [ref=f2e249] [cursor=pointer]
              - columnheader [ref=f2e258] [cursor=pointer]
              - columnheader "Reason" [ref=f2e267]
              - columnheader "Status" [ref=f2e268]
              - columnheader "Action" [ref=f2e269]
          - rowgroup [ref=f2e270]:
            - row [ref=f2e271]:
              - cell [ref=f2e272]:
                - checkbox [ref=f2e276] [cursor=pointer]
              - cell "Oct 1, 2026" [ref=f2e278]
              - cell "General Leave" [ref=f2e279]
              - cell "0.5" [ref=f2e280]
              - cell "First Half" [ref=f2e281]
              - cell "Oct 5, 2026" [ref=f2e282]
              - cell "Oct 5, 2026" [ref=f2e283]
              - cell [ref=f2e284]:
                - generic [ref=f2e286] [cursor=pointer]
              - cell "Waiting for Approval" [ref=f2e291]
              - cell "" [ref=f2e292]:
                - generic [ref=f2e293]:
                  - generic [ref=f2e294] [cursor=pointer]: 
                  - text:   
            - row [ref=f2e296]:
              - cell [ref=f2e297]:
                - checkbox [ref=f2e301] [cursor=pointer]
              - cell "Oct 1, 2026" [ref=f2e303]
              - cell "General Leave" [ref=f2e304]
              - cell "0.5" [ref=f2e305]
              - cell "First Half" [ref=f2e306]
              - cell "Oct 6, 2026" [ref=f2e307]
              - cell "Oct 6, 2026" [ref=f2e308]
              - cell [ref=f2e309]:
                - generic [ref=f2e311] [cursor=pointer]
              - cell "Waiting for Approval" [ref=f2e316]
              - cell "" [ref=f2e317]:
                - generic [ref=f2e318]:
                  - generic [ref=f2e319] [cursor=pointer]: 
                  - text:   
            - row [ref=f2e321]:
              - cell [ref=f2e322]:
                - checkbox [ref=f2e326] [cursor=pointer]
              - cell "Oct 1, 2026" [ref=f2e328]
              - cell "General Leave" [ref=f2e329]
              - cell "0.5" [ref=f2e330]
              - cell "Second Half" [ref=f2e331]
              - cell "Oct 6, 2026" [ref=f2e332]
              - cell "Oct 6, 2026" [ref=f2e333]
              - cell [ref=f2e334]:
                - generic [ref=f2e336] [cursor=pointer]
              - cell "Waiting for Approval" [ref=f2e341]
              - cell "" [ref=f2e342]:
                - generic [ref=f2e343]:
                  - generic [ref=f2e344] [cursor=pointer]: 
                  - text:   
            - row [ref=f2e346]:
              - cell [ref=f2e347]:
                - checkbox [ref=f2e351] [cursor=pointer]
              - cell "Oct 1, 2026" [ref=f2e353]
              - cell "General Leave" [ref=f2e354]
              - cell "1" [ref=f2e355]
              - cell "Full Day" [ref=f2e356]
              - cell "Oct 9, 2026" [ref=f2e357]
              - cell "Oct 9, 2026" [ref=f2e358]
              - cell [ref=f2e359]:
                - generic [ref=f2e361] [cursor=pointer]
              - cell "Waiting for Approval" [ref=f2e366]
              - cell "  Approve  Reject  Check Balance" [ref=f2e367]:
                - generic [ref=f2e368]:
                  - generic [ref=f2e369] [cursor=pointer]: 
                  - list [ref=f2e371]:
                    - listitem [ref=f2e372]:
                      - generic [ref=f2e373] [cursor=pointer]:
                        - generic [ref=f2e374]: 
                        - text: Approve
                    - listitem [ref=f2e375]:
                      - generic [ref=f2e376] [cursor=pointer]:
                        - generic [ref=f2e377]: 
                        - text: Reject
                    - listitem [ref=f2e378]:
                      - generic [ref=f2e379] [cursor=pointer]:
                        - generic [ref=f2e380]: 
                        - text: Check Balance
            - row [ref=f2e381]:
              - cell [ref=f2e382]:
                - checkbox [ref=f2e386] [cursor=pointer]
              - cell "Oct 1, 2026" [ref=f2e388]
              - cell "General Leave" [ref=f2e389]
              - cell "1" [ref=f2e390]
              - cell "Full Day" [ref=f2e391]
              - cell "Oct 12, 2026" [ref=f2e392]
              - cell "Oct 12, 2026" [ref=f2e393]
              - cell [ref=f2e394]:
                - generic [ref=f2e396] [cursor=pointer]
              - cell "Waiting for Approval" [ref=f2e401]
              - cell "" [ref=f2e402]:
                - generic [ref=f2e403]:
                  - generic [ref=f2e404] [cursor=pointer]: 
                  - text:   
            - row [ref=f2e406]:
              - cell [ref=f2e407]:
                - checkbox [ref=f2e411] [cursor=pointer]
              - cell "Oct 1, 2026" [ref=f2e413]
              - cell "General Leave" [ref=f2e414]
              - cell "1" [ref=f2e415]
              - cell "Full Day" [ref=f2e416]
              - cell "Oct 19, 2026" [ref=f2e417]
              - cell "Oct 19, 2026" [ref=f2e418]
              - cell [ref=f2e419]:
                - generic [ref=f2e421] [cursor=pointer]
              - cell "Waiting for Approval" [ref=f2e426]
              - cell "" [ref=f2e427]:
                - generic [ref=f2e428]:
                  - generic [ref=f2e429] [cursor=pointer]: 
                  - text:   
```

# Test source

```ts
  1137 |     await this.forYourRoleTab.waitFor({ state: 'visible', timeout: 15000 });
  1138 |   }
  1139 | 
  1140 |   async readPendingCounts() {
  1141 |     await this.forYouTab.waitFor({ state: 'visible', timeout: 15000 });
  1142 |     await this.forYourRoleTab.waitFor({ state: 'visible', timeout: 15000 });
  1143 |     return {
  1144 |       leaves: await this.readTabCount(this.leavesPendingTab),
  1145 |       forYou: await this.readTabCount(this.forYouTab),
  1146 |       forYourRole: await this.readTabCount(this.forYourRoleTab),
  1147 |     };
  1148 |   }
  1149 | 
  1150 |   async openForYouTab() {
  1151 |     await this.forYouTab.click();
  1152 |     await this.page.waitForURL(/\/pending-approvals\/time-off\/leaves\/for-you/i, { timeout: 15000 }).catch(() => {});
  1153 |   }
  1154 | 
  1155 |   async openForYourRoleTab() {
  1156 |     await this.forYourRoleTab.click();
  1157 |     await this.page
  1158 |       .waitForURL(/\/pending-approvals\/time-off\/leaves\/for-your-role/i, { timeout: 15000 })
  1159 |       .catch(() => {});
  1160 |   }
  1161 | 
  1162 |   async waitForActionDialogToSettle() {
  1163 |     const success = this.successRecordsHeader
  1164 |       .or(this.approvedToast)
  1165 |       .or(this.processedToast)
  1166 |       .or(this.page.getByRole('dialog').getByText(/^Summary$/i));
  1167 |     const loadingButton = this.requestDialog().getByRole('button', { name: /Loading/i });
  1168 | 
  1169 |     await expect.poll(async () => {
  1170 |       if (await success.first().isVisible().catch(() => false)) {
  1171 |         return 'done';
  1172 |       }
  1173 |       if (await loadingButton.isVisible().catch(() => false)) {
  1174 |         return 'loading';
  1175 |       }
  1176 |       if (!(await this.requestDialog().isVisible().catch(() => false))) {
  1177 |         return 'done';
  1178 |       }
  1179 |       return 'open';
  1180 |     }, { timeout: 45000 }).toBe('done');
  1181 |   }
  1182 | 
  1183 |   async closeSuccessDialog(workedDates: string[] = []) {
  1184 |     await this.waitForActionDialogToSettle();
  1185 | 
  1186 |     const successFeedback = this.successRecordsHeader
  1187 |       .or(this.approvedToast)
  1188 |       .or(this.processedToast)
  1189 |       .or(this.page.getByText(/Success Records?/i));
  1190 | 
  1191 |     if (await successFeedback.first().isVisible().catch(() => false)) {
  1192 |       await this.page.keyboard.press('Escape');
  1193 |       const dialog = this.requestDialog();
  1194 |       await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(async () => {
  1195 |         await this.page.keyboard.press('Escape');
  1196 |         await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  1197 |       });
  1198 |     }
  1199 | 
  1200 |     if (workedDates.length > 0 && (await this.requestDialog().isVisible().catch(() => false)) === false) {
  1201 |       await this.waitForRequestRowsHidden(workedDates).catch(() => {});
  1202 |     }
  1203 |   }
  1204 | 
  1205 |   requestRow(workedDate: string) {
  1206 |     const dateLabel = workedDate.replace(/,$/, '').trim();
  1207 |     const monthDay = dateLabel.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  1208 |     const pattern = monthDay
  1209 |       ? new RegExp(`^${monthDay[1]}\\s+0?${Number(monthDay[2])}(,|\\s|$)`, 'i')
  1210 |       : new RegExp(`^${dateLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(,|\\s|$)`);
  1211 |     return this.page.getByRole('row').filter({
  1212 |       has: this.page.getByRole('cell', { name: pattern }),
  1213 |     }).filter({ hasText: EMPLOYEE_NAME });
  1214 |   }
  1215 | 
  1216 |   leaveRequestRow(dateCell: string) {
  1217 |     return this.leaveRow(dateCell).first();
  1218 |   }
  1219 | 
  1220 |   async openLeaveRowKebab(dateCell: string) {
  1221 |     const row = this.leaveRequestRow(dateCell);
  1222 |     await row.locator('.dropdown > a').click();
  1223 |   }
  1224 | 
  1225 |   async cancelLeaveRequest(dateCell: string) {
  1226 |     await this.waitingForApprovalTab.click();
  1227 |     await this.expandTablePageSize();
  1228 |     const row = this.leaveRequestRow(dateCell);
  1229 |     await row.waitFor({ state: 'visible', timeout: 15000 });
  1230 |     await row.scrollIntoViewIfNeeded();
  1231 |     await this.openLeaveRowKebab(dateCell);
  1232 | 
  1233 |     const cancelLeave = this.page
  1234 |       .locator('.dropdown-menu.show, .dropdown-menu[style*="display: block"]')
  1235 |       .getByText('Cancel Leave', { exact: true })
  1236 |       .or(row.locator('a.dropdown-item', { hasText: 'Cancel Leave' }).locator('visible=true'));
> 1237 |     await cancelLeave.first().click({ timeout: 15000 });
       |                               ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  1238 | 
  1239 |     const dialog = this.requestDialog();
  1240 |     await dialog.getByText(/Are you sure you want to cancel this leave request/i).waitFor({
  1241 |       state: 'visible',
  1242 |       timeout: 15000,
  1243 |     });
  1244 |     await dialog.getByRole('textbox', { name: 'Please enter cancellation reason' }).fill(
  1245 |       `Cancel future leave ${dateCell}`,
  1246 |     );
  1247 |     const submit = dialog.getByRole('button', { name: 'Submit', exact: true });
  1248 |     await expect(submit).toBeEnabled({ timeout: 10000 });
  1249 |     await submit.click();
  1250 |     await dialog.waitFor({ state: 'hidden', timeout: 15000 });
  1251 |   }
  1252 | 
  1253 |   async waitForRequestRows(workedDates: string[]) {
  1254 |     await this.expandTablePageSize();
  1255 |     const search = this.page.getByPlaceholder(/Search by employee/i);
  1256 |     if (await search.isVisible().catch(() => false)) {
  1257 |       await search.fill(EMPLOYEE_NAME.split(' ')[0]);
  1258 |       await this.page.waitForTimeout(800);
  1259 |     }
  1260 |     for (const workedDate of workedDates) {
  1261 |       await this.requestRow(workedDate).first().waitFor({ state: 'visible', timeout: 20000 });
  1262 |     }
  1263 |   }
  1264 | 
  1265 |   async waitForRequestRowsHidden(workedDates: string[]) {
  1266 |     for (const workedDate of workedDates) {
  1267 |       await this.requestRow(workedDate).waitFor({ state: 'hidden', timeout: 20000 });
  1268 |     }
  1269 |   }
  1270 | 
  1271 |   async approveAtCurrentQueue(workedDates: string[]) {
  1272 |     await this.waitForRequestRows(workedDates);
  1273 |     await this.selectRequests(workedDates);
  1274 |     const planned = workedDates.some((cell) => {
  1275 |       const input = workedDateToInput(cell);
  1276 |       return input ? daysFromToday(input) < 0 : false;
  1277 |     })
  1278 |       ? 'No'
  1279 |       : 'Yes';
  1280 |     if (await this.processButton.isVisible().catch(() => false)) {
  1281 |       await this.processSelected();
  1282 |     } else {
  1283 |       await this.approveSelected(planned);
  1284 |     }
  1285 |     await this.closeSuccessDialog(workedDates);
  1286 |   }
  1287 | 
  1288 |   async processAtCurrentQueue(workedDates: string[]) {
  1289 |     await this.waitForRequestRows(workedDates);
  1290 |     await this.selectRequests(workedDates);
  1291 |     await this.processSelected();
  1292 |     await this.closeSuccessDialog(workedDates);
  1293 |   }
  1294 | 
  1295 |   async rejectAtCurrentQueue(workedDates: string[]) {
  1296 |     await this.waitForRequestRows(workedDates);
  1297 |     await this.selectRequests(workedDates);
  1298 |     await this.rejectSelected();
  1299 |     await this.successRecordsHeader.or(this.rejectedToast).waitFor({ state: 'visible', timeout: 15000 });
  1300 |     await this.page.keyboard.press('Escape');
  1301 |     await this.requestDialog().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  1302 |   }
  1303 | 
  1304 |   /**
  1305 |    * When RM and TM are the same user, one For You approve sends the record to HR.
  1306 |    */
  1307 |   async sendToHrQueue(workedDates: string[]) {
  1308 |     await this.openForYouTab();
  1309 |     await this.approveAtCurrentQueue(workedDates);
  1310 |     await this.openForYourRoleTab();
  1311 |     await this.waitForRequestRows(workedDates);
  1312 |   }
  1313 | 
  1314 |   async rejectRequest(workedDate: string) {
  1315 |     const row = this.requestRow(workedDate).first();
  1316 |     const kebab = row.locator('.dropdown > a');
  1317 |     if (await kebab.isVisible().catch(() => false)) {
  1318 |       await kebab.click();
  1319 |       await row.getByText('Reject', { exact: true }).click();
  1320 |       const dialog = this.requestDialog();
  1321 |       await dialog.waitFor({ state: 'visible', timeout: 15000 });
  1322 |       const rejectedOption = dialog.getByRole('button', { name: 'Rejected' });
  1323 |       if (await rejectedOption.isVisible().catch(() => false)) {
  1324 |         await rejectedOption.click();
  1325 |       }
  1326 |       await dialog.getByRole('button', { name: 'Reject', exact: true }).click();
  1327 |       await this.successRecordsHeader.or(this.rejectedToast).waitFor({ state: 'visible', timeout: 15000 });
  1328 |       return;
  1329 |     }
  1330 |     await this.rejectAtCurrentQueue([workedDate]);
  1331 |   }
  1332 | 
  1333 |   async selectRequests(workedDates: string[]) {
  1334 |     for (const workedDate of [...new Set(workedDates)]) {
  1335 |       const rows = this.requestRow(workedDate);
  1336 |       const count = await rows.count();
  1337 |       for (let index = 0; index < count; index += 1) {
```