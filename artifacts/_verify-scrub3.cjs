const fs = require('fs');
const p =
  'public/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt/thunderbolt-features--19f989_363e917e98e6d1f48f732c46aef87fd1_1362.json--desktop--f145183b.bundle.min.json';
const raw = fs.readFileSync(p, 'utf8');
const needle = 'comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5';
let i = 0;
let n = 0;
while ((i = raw.indexOf(needle, i)) >= 0 && n < 10) {
  console.log(n, i, raw.slice(i - 40, i + needle.length + 50));
  i += needle.length;
  n += 1;
}
console.log('count', n);
console.log('includes check', raw.includes('"comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5"'));

// Also scrub artists.html warmup if needed
const htmlPath = 'public/pages/artists.html';
const html = fs.readFileSync(htmlPath, 'utf8');
console.log('html has same triple', html.includes(needle));
const hi = html.indexOf(needle);
if (hi >= 0) console.log('html ctx', html.slice(hi - 40, hi + 120));

// relative parent that owns cards - find mqutig8q_relative components
const rel = raw.indexOf('comp-mqutig8q_relative');
console.log('mqutig8q_relative', rel >= 0 ? raw.slice(rel, rel + 250) : 'missing');
