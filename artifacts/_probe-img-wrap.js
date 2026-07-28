const fs = require('fs');
const a = fs.readFileSync('public/pages/academy.html', 'utf8');
const heart = a.indexOf('id="comp-mqwdfgsa"');
console.log('HEART IMG', a.slice(heart, heart + 900));
console.log('---END heart img---');
const luca = a.indexOf('id="comp-mpjxxere2"');
console.log('LUCA IMG', a.slice(luca, luca + 900));
