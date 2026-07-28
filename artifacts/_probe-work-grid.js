const fs = require('fs');
const css = fs.readFileSync('public/css/pages/work.css', 'utf8');

// Find all grid-area assignments for top-level sections
const re = /#(comp-[a-z0-9_]+)\{[^}]*grid-area:([^;]+);[^}]*\}/g;
let m;
const areas = [];
while ((m = re.exec(css))) {
  if (/comp-mp3okkrk|comp-mr4pxqsd|comp-mp2vlxyh|comp-mr69hwoy|comp-mruek03p|comp-mrueitxt|comp-mp2vlxyv/.test(m[1])) {
    areas.push({ id: m[1], area: m[2].trim() });
  }
}
console.log('Section grid areas:');
areas.forEach((a) => console.log(a.id, a.area));

// Also find header
const header = css.match(/#HEADER[^}]{0,200}|#SITE_HEADER[^}]{0,200}|comp-mp2vlxyv_r_comp-kbgajy18\{[^}]{0,300}/);
console.log('\nheader-ish', header && header[0].slice(0, 300));

const hdr = [...css.matchAll(/#(comp-mp2vlxyv[^,{]*)\{[^}]*grid-area:([^;]+)/g)];
hdr.forEach((x) => console.log(x[1], x[2]));
