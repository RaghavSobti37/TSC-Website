const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
const start = html.indexOf('id="comp-mr3si7ip2"');
const end = html.indexOf('id="comp-mr3si7jh"');
const chunk = html.slice(start, end);
console.log(
  chunk
    .replace(/></g, '>\n<')
    .replace(/id="/g, '\nid="')
    .slice(0, 3500)
);
