/**
 * Probe Mohit structure inside artists thunderbolt mirror JSON.
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(
  'public',
  'assets',
  'mirror',
  'siteassets.parastorage.com',
  'pages',
  'pages',
  'thunderbolt'
);

const files = [
  'thunderbolt-features--19f989_363e917e98e6d1f48f732c46aef87fd1_1362.json--desktop--f145183b.bundle.min.json',
  'thunderbolt-platform--19f989_363e917e98e6d1f48f732c46aef87fd1_1362.json--desktop--1645f6a3.bundle.min.json'
];

for (const f of files) {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  console.log('\n===', f, 'len', raw.length, '===');
  const i = raw.indexOf('Mohit');
  if (i >= 0) console.log('Mohit ctx:', raw.slice(Math.max(0, i - 120), i + 160).replace(/\s+/g, ' '));
  const j = raw.indexOf('comp-mqutenq5');
  console.log('mqutenq5 first:', j);
  if (j >= 0) console.log('ctx:', raw.slice(Math.max(0, j - 200), j + 300).replace(/\s+/g, ' ').slice(0, 500));

  // Find parent children arrays that include mqutenq5
  const re = /"components"\s*:\s*\[[^\]]{0,800}mqutenq[^\]]{0,400}\]/g;
  let m;
  let n = 0;
  while ((m = re.exec(raw)) && n < 5) {
    console.log('components arr', n, m[0].slice(0, 400));
    n += 1;
  }

  // Also try components with mqutig8q nearby
  const k = raw.indexOf('comp-mqutig8q');
  if (k >= 0) {
    console.log('mqutig8q ctx:', raw.slice(k, k + 600).replace(/\s+/g, ' ').slice(0, 550));
  }
}
