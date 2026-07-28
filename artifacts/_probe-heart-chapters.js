const fs = require('fs');
const h = fs.readFileSync('public/pages/the-heart-of-composition.html', 'utf8');

// Find h1 in main
const main = h.indexOf('<main');
const h1s = [...h.slice(main, main + 50000).matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
console.log('h1s', h1s.map((m) => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()));

// Curriculum-ish chapter titles near "What You'll Learn"
const wyl = h.indexOf("What You'll Learn");
console.log('after WYL:', h.slice(wyl, wyl + 3000).replace(/<[^>]+>/g, ' | ').replace(/\s+/g, ' ').slice(0, 1500));

// Find chapter list items after mentor bio
const chapters = [
  'Aamad', 'Bhaav', 'Nature', 'Samarpan', 'Subconscious', 'Collaborat', 'Melody', 'Breath', 'Capstone', 'Hooks'
];
chapters.forEach((c) => {
  const re = new RegExp(`.{0,30}${c}.{0,60}`, 'i');
  const m = h.slice(main, main + 200000).match(re);
  if (m) console.log('ch', m[0].replace(/<[^>]+>/g, '').slice(0, 80));
});
