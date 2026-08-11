const fs = require('fs');
const path = require('path');
const dir = path.join('public/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt');

function patchFile(f, patches) {
  const p = path.join(dir, f);
  let raw = fs.readFileSync(p, 'utf8');
  const before = raw;
  for (const [from, to, label] of patches) {
    const count = raw.split(from).length - 1;
    if (count) {
      raw = raw.split(from).join(to);
      console.log(f, '→', label, 'x' + count);
    } else {
      console.log(f, 'skip', label);
    }
  }
  if (raw !== before) fs.writeFileSync(p, raw);
  return raw;
}

const features = 'thunderbolt-features--19f989_363e917e98e6d1f48f732c46aef87fd1_1362.json--desktop--f145183b.bundle.min.json';
const platform = 'thunderbolt-platform--19f989_363e917e98e6d1f48f732c46aef87fd1_1362.json--desktop--1645f6a3.bundle.min.json';

// Show context around page component lists
{
  const raw = fs.readFileSync(path.join(dir, features), 'utf8');
  const i = raw.indexOf('"comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5"');
  console.log('page list idx', i);
  if (i >= 0) console.log(raw.slice(i - 100, i + 180));
  const j = raw.indexOf('"comp-mqtpn27i_relative","comp-mqtq8rsp_relative","comp-mqutenq5_relative"');
  console.log('rel list idx', j);
  if (j >= 0) console.log(raw.slice(j - 80, j + 200));
  const k = raw.indexOf('"box26":"comp-mqutenq5"');
  console.log('box26 idx', k, k >= 0 ? raw.slice(k - 40, k + 60) : '');
}

const featuresPatches = [
  [
    '"comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5",',
    '"comp-mqtpn27i","comp-mqtq8rsp",',
    'page components drop mohit'
  ],
  [
    '"comp-mqtpn27i_relative","comp-mqtq8rsp_relative","comp-mqutenq5_relative",',
    '"comp-mqtpn27i_relative","comp-mqtq8rsp_relative",',
    'page relative drop mohit'
  ],
  [
    '"box26":"comp-mqutenq5",',
    '',
    'drop box26 map'
  ]
];

const platformPatches = [
  [
    '"box26":[{"compId":"comp-mqutenq5","role":"box26"}],',
    '',
    'drop box26 role (comma after)'
  ],
  [
    ',"box26":[{"compId":"comp-mqutenq5","role":"box26"}]',
    '',
    'drop box26 role (comma before)'
  ]
];

patchFile(features, featuresPatches);
patchFile(platform, platformPatches);

// Verify
const raw = fs.readFileSync(path.join(dir, features), 'utf8');
console.log('VERIFY triple children', raw.includes('"comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5"'));
console.log('VERIFY Mohit text', /Mohit Shankar/.test(raw));
console.log('VERIFY box26', raw.includes('"box26":"comp-mqutenq5"'));
