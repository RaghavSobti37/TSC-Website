const fs = require('fs');
const path = require('path');
const dir = path.join('public/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt');
const f = 'thunderbolt-features--19f989_363e917e98e6d1f48f732c46aef87fd1_1362.json--desktop--f145183b.bundle.min.json';
const raw = fs.readFileSync(path.join(dir, f), 'utf8');

const needle = '"components":["comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5"]';
const needle2 = '"components":["comp-mqtpn27i","comp-mqtq8rsp"]';
console.log('triple count', raw.split(needle).length - 1);
console.log('pair count', raw.split(needle2).length - 1);

// find all occurrences of mqutenq5 near mqtpn27i
let idx = 0;
let n = 0;
while ((idx = raw.indexOf('comp-mqutenq5', idx)) >= 0 && n < 15) {
  console.log(n, idx, raw.slice(Math.max(0, idx - 80), idx + 40).replace(/\s+/g, ' '));
  idx += 12;
  n += 1;
}

// Also check relative parent
const re = /"components":\[[^\]]{0,200}mqutenq5[^\]]{0,80}\]/g;
let m;
while ((m = re.exec(raw))) console.log('arr:', m[0]);
