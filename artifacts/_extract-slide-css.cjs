const fs = require('fs');
const css = fs.readFileSync('public/css/pages/academy.css', 'utf8');
const keys = ['mqwl0xfw', 'mqwl0xfz', 'transition', 'SlideshowRepeater', 'shift-x', 'nDlJtT'];
for (const k of keys) {
  let i = 0;
  let n = 0;
  while ((i = css.indexOf(k, i)) !== -1 && n < 3) {
    console.log('\n===', k, 'at', i, '===');
    console.log(css.slice(Math.max(0, i - 80), i + 200).replace(/\n/g, ' '));
    i += k.length;
    n++;
  }
}

// Find transition effect type near mqwl0xfw in html styles
const html = fs.readFileSync('public/pages/academy.html', 'utf8');
const m = html.match(/#comp-mqwl0xfw\{[^}]{0,800}/);
console.log('\nSTYLE BLOCK', m && m[0]);
const m2 = html.match(/comp-mqwl0xfw[^"]{0,200}transition[^"]{0,100}/i);
console.log('\nHTML ATTR', m2 && m2[0]);
