import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'pages');
const pages = [
  'music-production.html',
  'roots-of-hindustani-classical.html',
  'the-heart-of-composition.html',
];

for (const name of pages) {
  const file = path.join(root, name);
  let html = fs.readFileSync(file, 'utf8');
  html = html
    .replace(/tsc-nav-overrides\.css\?v=[^'"]+/g, 'tsc-nav-overrides.css?v=courses-dropdown-1')
    .replace(/tsc-responsive\.css\?v=[^'"]+/g, 'tsc-responsive.css?v=courses-dropdown-1')
    .replace(/tsc-components\.js\?v=[^'"]+/g, 'tsc-components.js?v=courses-dropdown-1');
  fs.writeFileSync(file, html);
  console.log('updated', name);
}

// Verify JS parses
const js = fs.readFileSync(
  path.join(root, '..', 'js', 'tsc-components.js'),
  'utf8'
);
new Function(js);
console.log('tsc-components.js parse: OK');

// Sanity: course items + active helper present
if (!js.includes("label: 'A to Z of Music Production'")) throw new Error('missing A to Z label');
if (!js.includes('ensureAcademyCoursesInWixMenus')) throw new Error('missing inject helper');
if (!js.includes('ACADEMY_COURSE_HREFS')) throw new Error('missing COURSE_HREFS');
console.log('sanity: OK');
