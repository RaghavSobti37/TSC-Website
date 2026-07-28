const fs = require('fs');
const h = fs.readFileSync('public/pages/artists.html', 'utf8');

const titles = [
  'Artist Development',
  'Audience Building',
  'Brand Partnerships',
  'Content Production',
  'Live Experiences',
  'Community',
  'Distribution',
  'Storytelling',
  'Music',
  'Film',
  'Theatre'
];

for (const t of titles) {
  let idx = 0;
  let n = 0;
  while ((idx = h.indexOf(t, idx)) >= 0 && n < 3) {
    const slice = h.slice(Math.max(0, idx - 600), idx + 80);
    const boxes = [...slice.matchAll(/id="(comp-[a-z0-9]+)"[^>]*wixui-box/g)].map((m) => m[1]);
    const all = [...slice.matchAll(/id="(comp-[a-z0-9]+)"/g)].map((m) => m[1]);
    console.log(t, 'boxes', boxes.slice(-3), 'near', all.slice(-6));
    idx += t.length;
    n++;
  }
}

// Parent of What We Do - find container children with class HFEOE3 (box)
const sectionStart = h.indexOf('id="comp-mqtluqyy"');
const sectionEnd = h.indexOf('id="comp-mqtngf8m"');
const sec = h.slice(sectionStart, sectionEnd);
const boxes = [...sec.matchAll(/id="(comp-[a-z0-9]+)"[^>]*class="[^"]*wixui-box/g)].map((m) => m[1]);
console.log('\nWhatWeDo section boxes', boxes);

const philStart = h.indexOf('id="comp-mqtngf8m"');
const philEnd = h.indexOf('id="comp-mqtnpars"');
const phil = h.slice(philStart, philEnd);
const philBoxes = [...phil.matchAll(/id="(comp-[a-z0-9]+)"[^>]*class="[^"]*wixui-box/g)].map((m) => m[1]);
console.log('Philosophy section boxes', philBoxes);

const meetStart = h.indexOf('id="comp-mqtnpars"');
const meet = h.slice(meetStart, meetStart + 8000);
const meetBoxes = [...meet.matchAll(/id="(comp-[a-z0-9]+)"[^>]*class="[^"]*wixui-box/g)].map((m) => m[1]);
console.log('Meet section boxes', meetBoxes);

// Hero CTAs
const heroStart = h.indexOf('id="comp-mq6d6age"');
const hero = h.slice(heroStart, sectionStart);
const btns = [...hero.matchAll(/id="(comp-[a-z0-9]+)"[^>]*wixui-button/g)].map((m) => m[1]);
console.log('Hero buttons', btns);
