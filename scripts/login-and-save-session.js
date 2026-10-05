const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const authDir = path.resolve(__dirname, '../.auth');
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
  const authFile = path.join(authDir, 'user.json');

  console.log('Opening browser for RightlyHR login...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com/login');
  console.log('Please log into your HR account in the browser window.');
  console.log('Waiting for successful login...');

  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 180000 });
  await page.waitForTimeout(3000);

  await context.storageState({ path: authFile });
  console.log('Authentication successful! Fresh session saved to .auth/user.json');
  await browser.close();
})().catch(err => {
  console.error('Login helper error:', err.message);
  process.exit(1);
});
