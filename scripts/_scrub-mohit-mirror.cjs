/**
 * Comment-out / detach Mohit Shankar roster card from artists thunderbolt mirrors.
 * Keeps Harshad + Yugm. Wix rehydrates from these JSON files — removing parent child
 * link stops the third card from mounting.
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(
  __dirname,
  '..',
  'public',
  'assets',
  'mirror',
  'siteassets.parastorage.com',
  'pages',
  'pages',
  'thunderbolt'
);

const MOHIT_IDS = [
  'comp-mqutenq5',
  'comp-mqutenqa',
  'comp-mqutenqc3',
  'comp-mqutenqg1',
  'comp-mqutenqi',
  'comp-mqutenqk',
  'comp-mqutenqm',
  'comp-mqutenq5_relative',
  'comp-mqutenqc3_relative',
  'comp-mqutenqg1_relative'
];

function scrub(raw) {
  let out = raw;
  let changes = [];

  // Parent carousel children: Harshad, Yugm, Mohit → drop Mohit
  const beforeChildren = '"components":["comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5"]';
  const afterChildren = '"components":["comp-mqtpn27i","comp-mqtq8rsp"]';
  if (out.includes(beforeChildren)) {
    out = out.split(beforeChildren).join(afterChildren);
    changes.push('detached mqutenq5 from carousel children');
  }

  // Platform roles map: box26 → Mohit
  const beforeBox = '"box26":[{"compId":"comp-mqutenq5","role":"box26"}]';
  if (out.includes(beforeBox)) {
    out = out.split(beforeBox + ',').join('');
    out = out.split(',' + beforeBox).join('');
    out = out.split(beforeBox).join('');
    changes.push('removed box26 role map');
  }

  // Comment-style: blank Mohit name text so any leftover shell has no label
  if (/Mohit Shankar/.test(out)) {
    out = out.replace(/Mohit Shankar/g, '<!-- Mohit Shankar -->');
    // Fix broken JSON if we replaced inside HTML strings — use empty instead
    out = out.replace(/<!-- Mohit Shankar -->/g, '');
    changes.push('blanked Mohit Shankar text');
  }

  return { out, changes };
}

const files = fs.readdirSync(dir).filter((f) => {
  if (!f.includes('363e917e98e6d1f48f732c46aef87fd1')) return false;
  const t = fs.readFileSync(path.join(dir, f), 'utf8');
  return /mqutenq5|Mohit Shankar/.test(t);
});

if (!files.length) {
  console.log('No Mohit mirror files found');
  process.exit(0);
}

for (const f of files) {
  const p = path.join(dir, f);
  const raw = fs.readFileSync(p, 'utf8');
  const { out, changes } = scrub(raw);
  if (out === raw) {
    console.log(f, '→ no string patches applied (structure may differ)');
    continue;
  }
  fs.writeFileSync(p, out);
  console.log(f, '→', changes.join('; '));
  console.log('  still has carousel triple?', out.includes('"comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5"'));
  console.log('  Mohit text left?', /Mohit Shankar/.test(out));
  console.log('  mqutenq5 still referenced?', out.includes('comp-mqutenq5'));
}

console.log('done', files.length, 'files');
