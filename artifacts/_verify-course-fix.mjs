import fs from 'fs';

const pages = [
  'the-heart-of-composition',
  'music-production',
  'roots-of-hindustani-classical',
];
let fail = 0;
for (const p of pages) {
  const h = fs.readFileSync(`public/pages/${p}.html`, 'utf8');
  const checks = [
    ['no price class', !h.includes('tsc-course-price')],
    ['no 3999 near marquee', !/marquee-item-text[\s\S]{0,120}3,?999/.test(h)],
    ['marquee left', h.includes('data-marquee-animation="left"')],
    ['course boot', h.includes('data-tsc-course-boot')],
    ['motion script', h.includes('tsc-wix-motion.js')],
  ];
  for (const [name, ok] of checks) {
    console.log(ok ? 'PASS' : 'FAIL', p, name);
    if (!ok) fail++;
  }
}
const motion = fs.readFileSync('public/js/tsc-wix-motion.js', 'utf8');
console.log(motion.includes('function startMarquees') ? 'PASS' : 'FAIL', 'startMarquees fn');
if (!motion.includes('function startMarquees')) fail++;
const css = fs.readFileSync('public/css/tsc-wix-motion.css', 'utf8');
console.log(css.includes('.tsc-course-price') ? 'PASS' : 'FAIL', 'css hides price');
if (!css.includes('.tsc-course-price')) fail++;
// invalid CSS property must not exist
console.log(!css.includes('data-marquee-animation: left') ? 'PASS' : 'FAIL', 'no invalid css attr');
if (css.includes('data-marquee-animation: left')) fail++;
process.exit(fail ? 1 : 0);
