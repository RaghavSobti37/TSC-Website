const fs = require('fs');
const h = fs.readFileSync('public/pages/work.html', 'utf8');

// Extract hero-related HTML chunks
const markers = [
  'comp-mp3okkrk',
  'comp-mr67cfit',
  'comp-mr68f97q',
  'comp-mr4pwv07',
  'comp-mr68ntw5',
  'comp-mr67bhxu',
  'comp-mr4ozdiu',
  'comp-mr68qf6k',
  'comp-mr69296t',
  'comp-mr4pxqsd',
];

for (const id of markers) {
  const re = new RegExp(`id="${id}"[^>]{0,400}`);
  const m = h.match(re);
  console.log('\n===', id, '===');
  console.log(m ? m[0].replace(/\s+/g, ' ').slice(0, 350) : 'NOT FOUND');
}

// Text after caption
const cap = h.indexOf('platforms or original');
console.log('\nCAPTION CONTEXT:');
console.log(h.slice(cap - 200, cap + 250).replace(/\s+/g, ' '));

// Quote card text
const q = h.indexOf('every initiative begins');
console.log('\nQUOTE CONTEXT:');
console.log(h.slice(q - 300, q + 400).replace(/\s+/g, ' '));

// Check how mobile css is loaded - look in work.css or runtime
const workCss = fs.readFileSync('public/css/pages/work.css', 'utf8');
console.log('\nwork.css length', workCss.length);
console.log('mobile import?', /mobile\/work/.test(workCss));
console.log('PAGE_SECTIONSmg2rv snippet:', (workCss.match(/PAGE_SECTIONSmg2rv[^}]{0,200}/) || [])[0]);
console.log('comp-mr67cfit:', (workCss.match(/#comp-mr67cfit\{[^}]{0,300}/) || [])[0]);
console.log('comp-mr68ntw5:', (workCss.match(/#comp-mr68ntw5\{[^}]{0,300}/) || [])[0]);
console.log('comp-mr68qf6k:', (workCss.match(/#comp-mr68qf6k\{[^}]{0,300}/) || [])[0]);
console.log('comp-mr4pwv07:', (workCss.match(/#comp-mr4pwv07\{[^}]{0,300}/) || [])[0]);
console.log('comp-mr69296t:', (workCss.match(/#comp-mr69296t\{[^}]{0,300}/) || [])[0]);
