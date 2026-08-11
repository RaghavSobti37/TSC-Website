import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const h = fs.readFileSync(join(root, 'public/films/index.html'), 'utf8');

const ids = [
  'comp-mqmi3w4l3', 'comp-mqmi6yom7', 'comp-mqmi8cyg2', 'comp-mqmi8sv66', // focus names
  'comp-mqmi3w4k', 'comp-mqmi6yol3', 'comp-mqmi8cyf', 'comp-mqmi8sv51', // Focus labels
  'comp-mqmi6yny', 'comp-mqmi6ynz5', 'comp-mqmi6yo1', 'comp-mqmi6yo2', // hanuman meta
  'comp-mqmk8hzp', // Faith Communities clip target?
];

for (const id of ids) {
  const i = h.indexOf(`id="${id}"`);
  if (i < 0) {
    console.log(id, 'MISSING');
    continue;
  }
  const slice = h.slice(i, i + 350).replace(/\s+/g, ' ');
  console.log('\n', id, ':', slice.slice(0, 280));
}

// about hero: gradient/conch in about html?
const about = fs.readFileSync(join(root, 'public/about/index.html'), 'utf8');
console.log('\n=== ABOUT A markers ===');
console.log('THE SHAKTI COLLECTIVE', about.includes('THE SHAKTI') || about.includes('Shakti Collective'));
console.log('comp-mr1ttkgk (conch?)', about.includes('comp-mr1ttkgk'));
console.log('comp-mr1tvuqc (wordmark)', about.includes('comp-mr1tvuqc'));
console.log('comp-mr1tv44l (tagline)', about.includes('comp-mr1tv44l'));
console.log('comp-mp2vlkbh2 (hero)', about.includes('comp-mp2vlkbh2'));

// pages/about.css link?
console.log('about pages css linked?', /css\/pages\/about/.test(about));
console.log('about-mobile-hero linked?', about.includes('about-mobile-hero'));
