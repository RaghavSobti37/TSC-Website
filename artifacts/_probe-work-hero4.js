const fs = require('fs');
const css = fs.readFileSync('public/css/pages/work.css', 'utf8');

const ids = [
  'comp-mp3okkrk',
  'comp-mr4pxqsd',
  'comp-mp2vlxyh',
  'comp-mr69hwoy',
  'comp-mruek03p',
  'comp-mrueitxt',
  'comp-mr68f97q',
  'comp-mr68ntw5',
  'comp-mr68qf6k',
  'comp-mr67bhxu',
  'comp-mr4ozdiu',
  'comp-mr69296t',
  'comp-mr67cfit',
  'comp-mr4pwv07',
];

for (const id of ids) {
  const re = new RegExp(`#${id}\\{[^}]+\\}`, 'g');
  const all = css.match(re) || [];
  // Prefer layout rule with grid-area / --l_display
  const interesting = all.filter((x) => /grid-area|--l_display|height:|width:|margin|justify-self|align-self/.test(x));
  console.log('\n====', id, 'rules', all.length, '====');
  (interesting.length ? interesting : all).slice(0, 3).forEach((r) => {
    console.log(r.replace(/([;{])/g, '$1\n  ').slice(0, 500));
  });
}

// container children grid areas inside hero
const heroContainer = css.match(/#comp-mp3okkrk[^#]{0,2000}/);
console.log('\nHERO CONTAINER chunk:\n', (heroContainer && heroContainer[0].slice(0, 1500)) || 'none');

// Look for mesh-container for mp3okkrk
const mesh = css.match(/\.comp-mp3okkrk-container\{[^}]+\}/);
console.log('\nmesh container', mesh && mesh[0]);
