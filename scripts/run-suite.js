const { spawnSync } = require('child_process');
const path = require('path');

const playwrightCli = require.resolve('@playwright/test/cli');
const projects = [
  '01-login',
  '02-allocation',
  '03-remote-login',
  '04-wfh',
  '05-wfh-settings',
  '06-onbehalf-remote-login',
];

let failed = false;
for (const project of projects) {
  const result = spawnSync(
    process.execPath,
    [playwrightCli, 'test', `--project=${project}`, '--headed', '--workers=1'],
    { stdio: 'inherit', cwd: path.resolve(__dirname, '..') },
  );
  if (result.status !== 0) {
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
