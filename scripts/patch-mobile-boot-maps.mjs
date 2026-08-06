/**
 * Batch-patch TSC-Website mobile boot maps + safety timeout.
 * Run: node scripts/patch-mobile-boot-maps.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(__dirname, '..', 'public');

const NEW_MAP_ENTRIES = `    home: '/css/mobile/home.css?v=mission-quote-even-1',
    about: '/css/mobile/about.css?v=academy-one-2',
    work: '/css/mobile/work.css?v=academy-one-2',
    mba: '/css/mobile/impact-report.css?v=academy-one-2',
    'mba-impact': '/css/mobile/impact-report.css?v=academy-one-2',
    'havells-myousic': '/css/mobile/impact-report.css?v=academy-one-2',
    'insta-music-league': '/css/mobile/work.css?v=academy-one-2',
    'young-gunns': '/css/mobile/work.css?v=academy-one-2',
    artists: '/css/mobile/artists.css?v=academy-one-2',
    'artist-path': '/css/mobile/artists.css?v=academy-one-2',
    'harshad-duhita': '/css/mobile/artists.css?v=academy-one-2',
    yugm: '/css/mobile/artists.css?v=academy-one-2',
    'book-an-artist': '/css/mobile/artists.css?v=academy-one-2',
    'artist-query': '/css/mobile/artists.css?v=academy-one-2',
    'collab-query': '/css/mobile/artists.css?v=academy-one-2',
    'learn-with-tsc': '/css/mobile/learn.css?v=academy-one-2',
    academy: '/css/mobile/academy.css?v=academy-one-2',
    affiliate: '/css/mobile/academy.css?v=academy-one-2',
    'the-heart-of-composition': '/css/mobile/learn.css?v=academy-one-2',
    'roots-of-hindustani-classical': '/css/mobile/learn.css?v=academy-one-2',
    'music-production': '/css/mobile/learn.css?v=academy-one-2',
    'book-a-call': '/css/mobile/learn.css?v=academy-one-2',
    films: '/css/mobile/films.css?v=academy-one-2',
    'mahavatar-narsimha': '/css/mobile/films.css?v=academy-one-2',
    'hanuman-ansh': '/css/mobile/films.css?v=academy-one-2',
    mahaprbhu: '/css/mobile/films.css?v=academy-one-2',
    kalki: '/css/mobile/films.css?v=academy-one-2',
    resources: '/css/mobile/resources.css?v=academy-one-2',
    'blog-1': '/css/mobile/resources.css?v=academy-one-2',
    'blog-2': '/css/mobile/resources.css?v=academy-one-2',
    'blog-3': '/css/mobile/resources.css?v=academy-one-2',
    'start-making-music': '/css/mobile/resources.css?v=academy-one-2',
    'online-music-course-worth-it': '/css/mobile/resources.css?v=academy-one-2',
    'artist-release-playbook': '/css/mobile/resources.css?v=academy-one-2',
    'from-bhajan-to-clubbing': '/css/mobile/resources.css?v=academy-one-2',
    'you-released-a-song-now-what': '/css/mobile/resources.css?v=academy-one-2',
    'how-i-curate-music-with-independent-artists': '/css/mobile/resources.css?v=academy-one-2'`;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const mapRe = /var map = \{[\s\S]*?\n  \};/;
const timeoutRe = /setTimeout\(function \(\) \{ html\.classList\.add\('tsc-mobile-ready'\); \}, 4000\);/;
const newTimeout = `setTimeout(function () {
    html.classList.add('tsc-mobile-ready');
    html.classList.add('tsc-skel-revealed');
  }, 1500);`;

let patched = 0;
for (const file of walk(publicRoot)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('data-tsc-mobile-boot')) continue;
  let next = html;
  if (mapRe.test(next)) {
    next = next.replace(mapRe, `var map = {\n${NEW_MAP_ENTRIES}\n  };`);
  }
  if (timeoutRe.test(next)) {
    next = next.replace(timeoutRe, newTimeout);
  }
  // films version drift
  next = next.replace(
    /films: '\/css\/mobile\/films\.css\?v=impact-phone-1'/g,
    "films: '/css/mobile/films.css?v=academy-one-2'"
  );
  if (next !== html) {
    fs.writeFileSync(file, next);
    patched++;
  }
}
console.log('patched', patched, 'html files');
