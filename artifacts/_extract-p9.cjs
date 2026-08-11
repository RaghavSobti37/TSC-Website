const fs = require('fs');
const css = fs.readFileSync('public/css/pages/academy.css', 'utf8');
const i = css.indexOf('.p9hNc1{');
console.log(css.slice(i, i + 600));
const j = css.indexOf('.xjQkF3{');
console.log('\nxjQkF3', css.slice(j, j + 400));
const k = css.indexOf('.fABPvj{');
console.log('\nfABPvj', css.slice(k, k + 400));
