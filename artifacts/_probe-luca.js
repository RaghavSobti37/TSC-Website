const fs = require('fs');

const a = fs.readFileSync('public/pages/academy.html', 'utf8');
const start = a.indexOf('comp-mpjxxeqt');
const chunk = a.slice(start, start + 12000);
const hrefs = [...chunk.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
console.log('academy luca hrefs', [...new Set(hrefs)]);
const knowIdx = chunk.indexOf('Know More');
console.log('around Know More:', chunk.slice(Math.max(0, knowIdx - 350), knowIdx + 120).replace(/\s+/g, ' '));

const l = fs.readFileSync('public/pages/learn-with-tsc.html', 'utf8');
const lstart = l.indexOf('comp-mrufx9rd2');
const lchunk = l.slice(lstart, lstart + 12000);
const lhrefs = [...lchunk.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
console.log('learn luca hrefs', [...new Set(lhrefs)]);

const h = fs.readFileSync('public/pages/the-heart-of-composition.html', 'utf8');
const eidx = h.indexOf('Enroll Now');
console.log('enroll context:', h.slice(eidx - 500, eidx + 200).replace(/\s+/g, ' '));

// heart title strings
for (const s of [
  'The heART of Music Composition',
  'Sandesh Shandilya',
  'COURSE 001',
  'the-heart-of-composition',
  'Music Composition'
]) {
  console.log(s, (h.match(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length);
}

// desktop courses menu in academy
const coursesIdx = a.indexOf('>Courses<');
console.log('courses menu snippet:', a.slice(coursesIdx, coursesIdx + 2500).replace(/\s+/g, ' ').slice(0, 1800));

// content-data courses
const cd = fs.readFileSync('public/js/content-data.js', 'utf8');
const cdIdx = cd.indexOf('/the-heart-of-composition');
console.log('content-data heart:', cd.slice(cdIdx - 50, cdIdx + 800));
