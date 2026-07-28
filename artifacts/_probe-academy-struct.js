const fs = require('fs');
const a = fs.readFileSync('public/pages/academy.html', 'utf8');
// structure around first course card
const i = a.indexOf('id="comp-mpjvjuos"');
console.log(a.slice(i, i + 2500).replace(/\s+/g, ' ').slice(0, 2000));
console.log('\n---\n');
const j = a.indexOf('id="comp-mpjxxeqt"');
console.log(a.slice(j, j + 2000).replace(/\s+/g, ' ').slice(0, 1500));
// benefit section children
const b = a.indexOf('id="comp-mqwg28rw"');
console.log('\nbenefit container', b);
console.log(a.slice(b, b + 800).replace(/\s+/g, ' '));
