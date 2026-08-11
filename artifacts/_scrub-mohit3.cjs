const fs = require('fs');
const p =
  'public/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt/thunderbolt-features--19f989_363e917e98e6d1f48f732c46aef87fd1_1362.json--desktop--f145183b.bundle.min.json';
let raw = fs.readFileSync(p, 'utf8');

// Drop from accessible trigger list too (comment-out complete)
const from = '"compIdsWithAccessibleTrigger":["comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5"]';
const to = '"compIdsWithAccessibleTrigger":["comp-mqtpn27i","comp-mqtq8rsp"]';
if (raw.includes(from)) {
  raw = raw.split(from).join(to);
  fs.writeFileSync(p, raw);
  console.log('dropped mohit from accessible triggers');
} else {
  console.log('accessible trigger already clean or different shape');
}

// Find who parents the three cards now
const re = /"components":\[[^\]]{0,300}comp-mqtpn27i[^\]]{0,200}\]/g;
let m;
while ((m = re.exec(raw))) console.log(m[0]);

console.log('any mqutenq5 in a components array with mqtpn?', /"components":\[[^\]]{0,200}mqtpn27i[^\]]{0,120}mqutenq/.test(raw));
