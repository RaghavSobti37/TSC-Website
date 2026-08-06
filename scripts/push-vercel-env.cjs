const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env.local');
const map = {};
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  if (!line || line.trim().startsWith('#') || !line.includes('=')) continue;
  const i = line.indexOf('=');
  map[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
}

const keys = [
  'BOOK_CALL_WEBHOOK_SECRET',
  'ARTIST_PATH_WEBHOOK_SECRET',
  'ARTIST_ENQUIRY_WEBHOOK_SECRET',
  'NEWSLETTER_WEBHOOK_SECRET',
  'MASTERCLASS_REVIEW_WEBHOOK_SECRET',
  'TASKMASTER_API_URL',
  'TASKMASTER_BASE_URL',
  'TASKMASTER_WEBHOOK_URL',
  'TASKMASTER_CONTACT_LEAD_WEBHOOK_URL',
  'TASKMASTER_ARTIST_ENQUIRY_WEBHOOK_URL',
  'TASKMASTER_ARTIST_PATH_WEBHOOK_URL',
  'TASKMASTER_NEWSLETTER_WEBHOOK_URL',
  'TASKMASTER_MASTERCLASS_REVIEW_WEBHOOK_URL',
];

const scope = 'raghavsobti37s-projects';
let ok = 0;
for (const key of keys) {
  const value = map[key];
  if (!value) {
    console.log('MISSING', key);
    continue;
  }
  for (const envName of ['production', 'preview', 'development']) {
    const r = spawnSync(
      'npx',
      ['--yes', 'vercel@latest', 'env', 'add', key, envName, '--scope', scope, '--force', '--yes', '--value', value],
      { cwd: root, encoding: 'utf8', shell: true }
    );
    const out = `${r.stdout || ''}\n${r.stderr || ''}`.trim();
    const pass = r.status === 0 || /already|Added|Saved|Updated/i.test(out);
    console.log(`${pass ? 'OK' : 'FAIL'}\t${key}\t${envName}\t${(out.split('\n').pop() || '').slice(0, 120)}`);
    if (pass) ok += 1;
  }
}
console.log(`ENV_WRITES ${ok}`);
process.exit(ok > 0 ? 0 : 1);
