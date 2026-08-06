import fs from 'fs';
import path from 'path';

const root = 'c:/Users/ragha/OneDrive/Desktop/TSC Platform/website/TSC-Website/public';
fs.mkdirSync(path.join(root, 'affiliate'), { recursive: true });
fs.copyFileSync(path.join(root, 'pages/affiliate.html'), path.join(root, 'affiliate/index.html'));

const h = fs.readFileSync(path.join(root, 'pages/resources.html'), 'utf8');
const i = h.indexOf('id="comp-mrdq85ob"');
console.log(h.slice(i, i + 2500).replace(/\s+/g, ' ').slice(0, 1200));

const a = fs.readFileSync(path.join(root, 'pages/about.html'), 'utf8');
const oi = a.indexOf('TSC Originals');
const os = a.slice(oi, oi + 3000);
console.log('orig work', (os.match(/href="\/work"/g) || []).length, 'heart', (os.match(/the-heart-of-composition/g) || []).length);
const fi = a.indexOf('TSC Films partners');
const fsli = a.slice(fi, fi + 3000);
console.log('films', (fsli.match(/href="\/films"/g) || []).length);

const ar = fs.readFileSync(path.join(root, 'pages/artists.html'), 'utf8');
console.log('mohit', ar.includes('data-tsc-mohit-hidden') || ar.includes('tsc-hide-mohit'));
console.log('harshad links', (ar.match(/href="\/harshad-duhita"/g) || []).length);

const f = fs.readFileSync(path.join(root, 'pages/films.html'), 'utf8');
console.log('res btn', /comp-mqmkrjnm[\s\S]{0,500}href="\/resources"/.test(f));
console.log('mail', /comp-mqmkth8f[\s\S]{0,500}mailto:artist@/.test(f));
console.log('need gap', JSON.stringify((f.match(/They need[\s\S]{0,20}communities/) || [])[0]));
