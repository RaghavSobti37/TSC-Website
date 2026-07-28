const fs = require('fs');
const l = fs.readFileSync('public/pages/learn-with-tsc.html', 'utf8');
const start = l.indexOf('comp-mrufx9rd2');
const chunk = l.slice(start, start + 12000);
const km = chunk.indexOf('Know More');
console.log(chunk.slice(km - 400, km + 200));
console.log('---');
const cs = chunk.indexOf('Coming Soon');
console.log(chunk.slice(cs - 100, cs + 350));

// find button ids in luca section
const buttons = [...chunk.matchAll(/id="(comp-mrufx9[^"]+)"[^>]{0,80}(?:role="button"|lIkFMb)/g)];
console.log('buttons', buttons.map((m) => m[0].slice(0, 120)));
