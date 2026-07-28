const fs = require('fs');
const cheerio = null;

function near(h, needle, radius = 800) {
  const i = h.indexOf(needle);
  if (i < 0) return null;
  return h.slice(Math.max(0, i - radius), i + radius);
}

function ids(slice) {
  return [...new Set([...slice.matchAll(/id="(comp-[a-z0-9_]+)"/g)].map((m) => m[1]))];
}

const h = fs.readFileSync('public/pages/artists.html', 'utf8');

// Section containers
for (const id of ['comp-mq6d6age', 'comp-mqtluqyy', 'comp-mqtngf8m', 'comp-mqtnpars']) {
  const re = new RegExp(`id="${id}"[\\s\\S]{0,400}`);
  const m = h.match(re);
  console.log('\nSECTION', id, m ? m[0].replace(/\\s+/g, ' ').slice(0, 280) : 'missing');
}

// What We Do cards - find all boxes near Artist Development
const s = near(h, 'Artist Development', 2000);
console.log('\nWhatWeDo ids', ids(s || ''));
console.log('WhatWeDo text snippets', [...(s || '').matchAll(/>([A-Z][^<]{3,40})</g)].map((m) => m[1]).slice(0, 20));

const s2 = near(h, 'Why TSC Artists', 2500);
console.log('\nPhilosophy ids', ids(s2 || ''));

const s3 = near(h, 'Meet Our Artists', 3000);
console.log('\nMeet ids', ids(s3 || ''));

// Check for mesh-layout / css grid styles in page css
const css = fs.readFileSync('public/css/pages/artists.css', 'utf8');
const hits = [];
for (const id of ['mqtlv8da', 'mqtlxa1z', 'mqtops1z', 'mqtoxvyf', 'mqtoxvyb', 'mqtnpars', 'mqtpn27i', 'mqtq8rsp', 'mqutenq5']) {
  const idx = css.indexOf(id);
  if (idx >= 0) {
    hits.push(id + ': ' + css.slice(idx, idx + 180).replace(/\s+/g, ' '));
  }
}
console.log('\nCSS hits', hits.length);
hits.forEach((x) => console.log(x.slice(0, 200)));
