const fs = require('fs');
const a = fs.readFileSync('public/pages/academy.html', 'utf8');
['comp-mpjvjuos', 'comp-mpjxmose', 'comp-mpjxxeqt', 'comp-mpjyp1e7', 'Sandesh', 'Prasad', 'Luca'].forEach((id) => {
  const i = a.indexOf(id);
  console.log(id, i >= 0 ? i : 'MISSING');
});
const links = [...a.matchAll(/href="(\/(?:the-heart|roots|music)[^"]*)"/g)].map((m) => m[1]);
console.log('course links', [...new Set(links)]);

// Find course section structure around COURSES
const coursesIdx = a.indexOf('>COURSES<');
console.log('COURSES idx', coursesIdx);
if (coursesIdx >= 0) {
  console.log(a.slice(coursesIdx - 200, coursesIdx + 100).replace(/\s+/g, ' '));
}

// learn-with-tsc cards
const l = fs.readFileSync('public/pages/learn-with-tsc.html', 'utf8');
console.log('learn Luca', l.includes('Luca'));
console.log('learn cards pe3/pm/qh/rd2', ['comp-mrufx9pe3', 'comp-mrufx9pm', 'comp-mrufx9qh', 'comp-mrufx9rd2'].map((id) => [id, l.includes(id)]));

const cr = fs.readFileSync('public/js/content-replacements.js', 'utf8');
console.log('cr music-production', cr.includes('music-production'));
console.log('cr 3999', cr.includes('3999'), cr.includes('3,999'), cr.includes('₹'));
console.log('cr tsc-course-price', cr.includes('tsc-course-price'));
