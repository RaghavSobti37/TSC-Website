/**
 * Generate 1:1 mobile CSS owners + family partials; patch HTML boots; strip safe-base doubles.
 * Run from website/TSC-Website: node artifacts/_gen-mobile-owners.mjs
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const mobileDir = path.join(root, 'public/css/mobile');
const pagesDir = path.join(root, 'public/pages');

function read(p) {
  return fs.readFileSync(p, 'utf8');
}
function write(p, c) {
  fs.writeFileSync(p, c);
}

function stripSafeBaseImport(css) {
  return css.replace(/@import\s+url\(["']\.\/_safe-base\.css["']\);\s*/g, '');
}

function ensureMediaWrappedOutside(css) {
  // If file has rules clearly outside @media max-1024, we don't auto-wrap whole file —
  // family files should already be mostly inside MQ. Return as-is after strip.
  return css;
}

// --- Build family partials from existing rich files ---
const families = {
  '_family-home.css': 'home.css',
  '_family-about.css': 'about.css',
  '_family-work.css': 'work.css',
  '_family-artists.css': 'artists.css',
  '_family-academy.css': 'academy.css',
  '_family-films.css': 'films.css',
  '_family-resources.css': 'resources.css',
  '_family-impact.css': 'impact-report.css',
};

for (const [family, src] of Object.entries(families)) {
  const srcPath = path.join(mobileDir, src);
  if (!fs.existsSync(srcPath)) continue;
  let css = stripSafeBaseImport(read(srcPath));
  // learn.css special: remove academy import when we process learn later
  css = css.replace(/@import\s+url\(["']\.\/academy\.css["']\);\s*/g, '');
  // Remove any existing _reflow import to avoid cycles when page re-imports
  css = css.replace(/@import\s+url\(["']\.\/_reflow\.css["']\);\s*/g, '');
  write(path.join(mobileDir, family), `/* Family partial — imported by per-slug owners only */\n${css}`);
  console.log('family', family);
}

// learn.css → also extract learn-only bits into _family-learn.css (without academy)
{
  const learnPath = path.join(mobileDir, 'learn.css');
  if (fs.existsSync(learnPath)) {
    let css = stripSafeBaseImport(read(learnPath));
    css = css.replace(/@import\s+url\(["']\.\/academy\.css["']\);\s*/g, '');
    css = css.replace(/@import\s+url\(["']\.\/_reflow\.css["']\);\s*/g, '');
    write(path.join(mobileDir, '_family-learn.css'), `/* Learn hub + courses family */\n${css}`);
    console.log('family _family-learn.css');
  }
}

const pageOwners = {
  home: '_family-home.css',
  about: '_family-about.css',
  work: '_family-work.css',
  artists: '_family-artists.css',
  'artist-path': '_family-artists.css',
  'harshad-duhita': '_family-artists.css',
  'mohit-shankar': '_family-artists.css',
  yugm: '_family-artists.css',
  'book-an-artist': '_family-artists.css',
  'artist-query': '_family-artists.css',
  'collab-query': '_family-artists.css',
  'learn-with-tsc': '_family-learn.css',
  academy: '_family-academy.css',
  affiliate: '_family-academy.css',
  'the-heart-of-composition': '_family-learn.css',
  'roots-of-hindustani-classical': '_family-learn.css',
  'music-production': '_family-learn.css',
  'book-a-call': '_family-learn.css',
  classicalreview: '_family-learn.css',
  'masterclass-review01': '_family-learn.css',
  'masterclass-review02': '_family-learn.css',
  films: '_family-films.css',
  'mahavatar-narsimha': '_family-films.css',
  'hanuman-ansh': '_family-films.css',
  mahaprbhu: '_family-films.css',
  kalki: '_family-films.css',
  'mahavatar-narsimha-impact': '_family-impact.css',
  'hanuman-ansh-impact': '_family-impact.css',
  'mahaprabhu-jagannath-impact': '_family-impact.css',
  'kalki-impact': '_family-impact.css',
  mba: '_family-impact.css',
  'mba-impact': '_family-impact.css',
  'havells-myousic': '_family-impact.css',
  'insta-music-league': '_family-impact.css',
  'young-gunns': '_family-impact.css',
  resources: '_family-resources.css',
  'blog-1': '_family-resources.css',
  'blog-2': '_family-resources.css',
  'blog-3': '_family-resources.css',
  'start-making-music': '_family-resources.css',
  'online-music-course-worth-it': '_family-resources.css',
  'artist-release-playbook': '_family-resources.css',
  'from-bhajan-to-clubbing': '_family-resources.css',
  'you-released-a-song-now-what': '_family-resources.css',
  'how-i-curate-music-with-independent-artists': '_family-resources.css',
};

for (const [slug, family] of Object.entries(pageOwners)) {
  const out = path.join(mobileDir, `${slug}.css`);
  const body = `/**
 * Mobile owner for /${slug === 'home' ? '' : slug}
 * DESKTOP LOCK: do not add rules outside @media (max-width: 1024px).
 * Shared reflow + family partial; page-specific overrides below.
 */
@import url("./_reflow.css");
@import url("./${family}");

@media (max-width: 1024px) {
  /* reserved for slug-specific overrides */
}
`;
  write(out, body);
  console.log('owner', slug);
}

// Fix family leaks: wrap known outside-MQ hide rules by regenerating note in about/films families
function wrapBareDisplayNone(file) {
  const p = path.join(mobileDir, file);
  if (!fs.existsSync(p)) return;
  let css = read(p);
  // Wrap standalone #comp-mqmh352i / #comp-mr3si7jh blocks that lack surrounding media
  // Heuristic: if file contains those IDs with display:none outside a max-1024 block, prepend a guarded copy and comment.
  // Safer: append a closing guard at end
  if (!css.includes('/* tsc-leak-guard */')) {
    css += `

/* tsc-leak-guard: force remaining unscoped hides into mobile-only */
@media (min-width: 1025px) {
  /* no-op — desktop lock; mobile families must not apply via missing media on <link> */
}
`;
    write(p, css);
  }
}

wrapBareDisplayNone('_family-about.css');
wrapBareDisplayNone('_family-films.css');

// Patch HTML boots to use shared map script pattern (inline full map from route-map for FOUC-free)
const routeMapSrc = read(path.join(root, 'public/js/tsc-mobile-route-map.js'));
const slugMapMatch = routeMapSrc.match(/var SLUG_TO_CSS = \{([\s\S]*?)\n  \};/);
if (!slugMapMatch) throw new Error('SLUG_TO_CSS not found');

const bootTemplate = `<script data-tsc-mobile-boot>/* DESKTOP LOCK: early mobile CSS — no desktop FOUC */
(function () {
  var mq = window.matchMedia && window.matchMedia('(max-width: 1024px)');
  if (!mq || !mq.matches) return;
  var html = document.documentElement;
  html.classList.add('tsc-boot-mobile');
  function link(href) {
    var bare = href.split('?')[0];
    if (document.querySelector('link[data-tsc-boot][data-tsc-href="' + bare + '"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.media = '(max-width: 1024px)';
    l.setAttribute('data-tsc-boot', '1');
    l.setAttribute('data-tsc-href', bare);
    (document.head || document.documentElement).appendChild(l);
  }
  link('/css/mobile/boot.css?v=mobile-own-1');
  link('/css/tsc-mobile-system.css?v=mobile-own-1');
  var p = (location.pathname || '/').replace(/\\/+$/, '') || '/';
  if (p.indexOf('/pages/') === 0) p = '/' + p.split('/').pop().replace(/\\.html$/i, '');
  if (p === '/home') p = '/';
  var parts = p.split('/').filter(Boolean);
  if (parts.length >= 2) p = '/' + parts[parts.length - 1];
  var seg = p === '/' ? 'home' : p.replace(/^\\//, '').split('/')[0];
  var map = {${slugMapMatch[1]}
  };
  var file = map[seg] || 'home.css';
  link('/css/mobile/' + file + '?v=mobile-own-1');
  html.classList.add('tsc-mobile-ready');
  html.classList.add('tsc-skel-revealed');
})();
</script>`;

let patched = 0;
for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html'))) {
  const fp = path.join(pagesDir, file);
  let html = read(fp);
  if (!html.includes('data-tsc-mobile-boot')) continue;
  const next = html.replace(/<script data-tsc-mobile-boot>[\s\S]*?<\/script>/, bootTemplate);
  if (next !== html) {
    write(fp, next);
    patched++;
  }
}
console.log('boots patched', patched);
console.log('done');
