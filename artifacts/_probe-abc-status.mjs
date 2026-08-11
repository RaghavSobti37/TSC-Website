import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(join(root, 'public/films/index.html'), 'utf8');
const about = fs.readFileSync(join(root, 'public/about/index.html'), 'utf8');
const aboutPage = fs.readFileSync(join(root, 'public/pages/about.html'), 'utf8');

console.log('=== FILMS HTML LINKS ===');
for (const m of html.matchAll(/href=["']([^"']+)["']/g)) {
  if (/css|films/i.test(m[1])) console.log('href', m[1]);
}
for (const m of html.matchAll(/src=["']([^"']+)["']/g)) {
  if (/tsc|content|component|replacement|boot/i.test(m[1])) console.log('src', m[1]);
}

console.log('\n=== ABOUT HTML LINKS ===');
const aboutSrc = fs.existsSync(join(root, 'public/about/index.html')) ? about : aboutPage;
console.log('using', fs.existsSync(join(root, 'public/about/index.html')) ? 'about/index' : 'pages/about');
for (const m of aboutSrc.matchAll(/href=["']([^"']+)["']/g)) {
  if (/about|responsive|hero|mobile/i.test(m[1])) console.log('href', m[1]);
}
for (const m of aboutSrc.matchAll(/src=["']([^"']+)["']/g)) {
  if (/tsc|content|component|boot|about/i.test(m[1])) console.log('src', m[1]);
}

// How is films.css referenced?
const idx = html.indexOf('films.css');
console.log('\nfilms.css context:', html.slice(Math.max(0, idx - 100), idx + 80).replace(/\s+/g, ' '));

// Check if page CSS is inlined
console.log('inline style count', (html.match(/<style/g) || []).length);
console.log('link stylesheet count', (html.match(/rel=["']stylesheet["']/g) || []).length);

// raw Impact Report in films html
console.log('Impact Report in films html', (html.match(/Impact Report/g) || []).length);
console.log('Faith Communities in films html', (html.match(/Faith Communities/g) || []).length);

// about hero markers in about html / css
const responsive = fs.readFileSync(join(root, 'public/css/tsc-responsive.css'), 'utf8');
console.log('\n=== ABOUT HERO (A) ===');
console.log('desktop hero block present', responsive.includes('min-width') && responsive.includes('comp-mp2vlkbh2') && responsive.includes('comp-mr1tvuqc'));
console.log('mobile hero in max-width 1024', /@media \(max-width: 1024px\)[\s\S]*#comp-mp2vlkbh2/.test(responsive));
const mobileAbout = fs.readFileSync(join(root, 'public/css/mobile/about.css'), 'utf8');
console.log('mobile about THE SHAKTI', mobileAbout.includes('THE SHAKTI'));
console.log('mobile hero media scoped max-width', mobileAbout.includes('max-width: 1024px') || mobileAbout.includes('@media'));

// Check media query wrapping for about hero desktop vs mobile bleed
const heroNeedle = 'body[data-page="about"] #comp-mp2vlkbh2';
let i = 0, n = 0;
while ((i = responsive.indexOf(heroNeedle, i)) !== -1 && n < 12) {
  const pre = responsive.slice(Math.max(0, i - 500), i);
  const mqs = [...pre.matchAll(/@media[^{]+/g)].map((m) => m[0].trim());
  const last = mqs[mqs.length - 1] || '(none/top)';
  console.log(n, 'MQ:', last.slice(0, 80));
  i += heroNeedle.length;
  n++;
}
