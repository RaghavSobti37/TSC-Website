const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
const start = html.indexOf('id="comp-mr3a7k38"');
console.log(html.slice(start, start + 2500));
