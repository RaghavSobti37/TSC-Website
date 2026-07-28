const fs = require('fs');
const h = fs.readFileSync('public/pages/artists.html', 'utf8');
['comp-mqtpn2877', 'comp-mqtq8rt23', 'comp-mqutenqi', 'comp-mqtpn27z', 'comp-mqtq8rt66', 'comp-mqutenqm'].forEach((id) => {
  const i = h.indexOf('id="' + id + '"');
  console.log('---', id, i);
  if (i >= 0) console.log(h.slice(i, i + 550).replace(/\s+/g, ' ').slice(0, 450));
});
