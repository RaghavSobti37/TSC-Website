const fs = require('fs');
const html = fs.readFileSync('public/pages/academy.html', 'utf8');
const m = html.match(/#comp-mqwl0xfw\{[^}]+\}/);
console.log(m && m[0]);
const m2 = html.match(/comp-mqwl0xfw\{[^}]{0,1200}/);
console.log('\n', m2 && m2[0]);
