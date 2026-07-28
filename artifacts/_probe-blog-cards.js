const fs = require('fs');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');
// Find parent of free tools title - look for grid containing both
for (const id of ['comp-mrd4n', 'comp-mrd4o', 'comp-mrd4u', 'comp-mp2vpkoa']) {
  let idx = 0, n = 0;
  while ((idx = css.indexOf(id, idx)) !== -1 && n < 2) {
    const slice = css.slice(idx, idx + 200);
    if (slice.includes('grid-template') || slice.includes('width:')) {
      console.log(id, '@', idx, slice.replace(/\s+/g, ' ').slice(0, 180));
    }
    idx += id.length; n++;
  }
}

// Blog card parent boxes width
for (const id of ['comp-mrdpew4h', 'comp-mrdq81q0', 'comp-mrdq8d4s', 'comp-mrdpqawy']) {
  const re = new RegExp(`#${id}\\{[^}]+\\}`);
  const m = css.match(re);
  console.log('\n', id, m ? m[0].match(/width:[^;]+|display:[^;]+|grid-template[^;]+/) : 'missing');
  if (m) console.log(m[0].slice(0, 280).replace(/\s+/g, ' '));
}
