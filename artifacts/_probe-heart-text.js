const fs = require('fs');
const h = fs.readFileSync('public/pages/the-heart-of-composition.html', 'utf8');

// asset refs
const css = [...h.matchAll(/the-heart-of-composition[^"'\s]*/g)];
console.log('refs', [...new Set(css.map((m) => m[0]))]);

// key visible text blocks
const texts = [
  'The heART of Music Composition',
  'COURSE 001',
  'Mentor: Sandesh Shandilya',
  'What You\'ll Learn',
  'Iconic Bollywood Soundtracks',
  'Award-Winning Composer',
  'Decades of Industry Experience',
  'Sandesh Curriculum',
  'It All Starts Here',
  'Dive deeper into advanced composition'
];
texts.forEach((t) => {
  const i = h.indexOf(t);
  if (i < 0) return console.log('MISSING', t);
  console.log('\n---', t);
  console.log(h.slice(i, i + 180).replace(/\s+/g, ' '));
});

// title tag
const title = h.match(/<title>[^<]+<\/title>/);
console.log('\ntitle', title && title[0]);
const og = [...h.matchAll(/property="og:title"[^>]*>/g)];
console.log('og', og.slice(0,2));
