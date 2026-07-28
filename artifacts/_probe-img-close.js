const fs = require('fs');
const a = fs.readFileSync('public/pages/academy.html', 'utf8');

function dumpClose(id) {
  const start = a.indexOf(`id="${id}"`);
  const wow = a.indexOf('</wow-image>', start);
  console.log('\n', id, a.slice(wow, wow + 250));
}
dumpClose('comp-mqwdfgsa');
dumpClose('comp-mpjxxere2');
dumpClose('comp-mrg43yyg');

// Know More button full
const bi = a.indexOf('id="comp-mpjxxery4"');
console.log('\nBTN', a.slice(bi - 40, bi + 450));
