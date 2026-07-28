/*
 * DESKTOP LOCK (>=1025px): injects early HEAD boot + body component loader into
 * primary pages (and optionally all public HTML). Mobile CSS links BEFORE paint
 * so desktop mesh never flashes. Components still delayed briefly for Wix hydrate.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'public');
const pagesDir = path.join(root, 'pages');

const primaryFiles = [
  'home.html', 'about.html', 'work.html', 'artists.html', 'artist-path.html',
  'learn-with-tsc.html', 'films.html', 'resources.html', 'academy.html'
];

const HEAD_BOOT = `<script data-tsc-mobile-boot>/* DESKTOP LOCK: early mobile CSS — no desktop FOUC */
(function () {
  var mq = window.matchMedia && window.matchMedia('(max-width: 1024px)');
  if (!mq || !mq.matches) return;
  var html = document.documentElement;
  html.classList.add('tsc-boot-mobile');
  function link(href) {
    if (document.querySelector('link[data-tsc-boot][href="' + href + '"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.media = '(max-width: 1024px)';
    l.setAttribute('data-tsc-boot', '1');
    (document.head || document.documentElement).appendChild(l);
  }
  link('/css/mobile/boot.css');
  link('/css/tsc-mobile-system.css');
  var p = (location.pathname || '/').replace(/\\/$/, '') || '/';
  if (p.indexOf('/pages/') === 0) p = p.replace('/pages', '').replace(/\\.html$/, '') || '/';
  var seg = p === '/' ? 'home' : p.replace(/^\\//, '').split('/')[0];
  var map = {
    home: '/css/mobile/home.css',
    about: '/css/mobile/about.css',
    work: '/css/mobile/work.css',
    mba: '/css/mobile/work.css',
    artists: '/css/mobile/artists.css',
    'artist-path': '/css/mobile/artists.css',
    'harshad-duhita': '/css/mobile/artists.css',
    yugm: '/css/mobile/artists.css',
    'book-an-artist': '/css/mobile/artists.css',
    'artist-query': '/css/mobile/artists.css',
    'collab-query': '/css/mobile/artists.css',
    'learn-with-tsc': '/css/mobile/learn.css',
    academy: '/css/mobile/learn.css',
    'the-heart-of-composition': '/css/mobile/learn.css',
    'roots-of-hindustani-classical': '/css/mobile/learn.css',
    'music-production': '/css/mobile/learn.css',
    'book-a-call': '/css/mobile/learn.css',
    films: '/css/mobile/films.css',
    'mahavatar-narsimha': '/css/mobile/films.css',
    'hanuman-ansh': '/css/mobile/films.css',
    mahaprbhu: '/css/mobile/films.css',
    kalki: '/css/mobile/films.css',
    resources: '/css/mobile/resources.css',
    'blog-1': '/css/mobile/resources.css',
    'blog-2': '/css/mobile/resources.css',
    'blog-3': '/css/mobile/resources.css',
    'start-making-music': '/css/mobile/resources.css',
    'online-music-course-worth-it': '/css/mobile/resources.css',
    'artist-release-playbook': '/css/mobile/resources.css'
  };
  if (map[seg]) link(map[seg]);
  else link('/css/mobile/home.css');
  /* safety: never leave page invisible */
  setTimeout(function () { html.classList.add('tsc-mobile-ready'); }, 4000);
})();
</script>`;

const BODY_LOADER = `<script data-tsc-mobile-loader>/* DESKTOP LOCK: mobile-only enhancements, never at >=1025px */
(function () {
  var mq = window.matchMedia && window.matchMedia('(max-width: 1024px)');
  if (!mq) return;
  var up = window.matchMedia('(min-width: 1025px)');
  var onUp = function (e) { if (e.matches) location.reload(); };
  if (up.addEventListener) up.addEventListener('change', onUp); else if (up.addListener) up.addListener(onUp);
  if (!mq.matches) return;
  var markReady = function () {
    document.documentElement.classList.add('tsc-mobile-ready');
  };
  var inject = function () {
    if (document.querySelector('script[data-tsc-components-boot]')) return;
    var s = document.createElement('script');
    s.src = '/js/tsc-components.js';
    s.defer = true;
    s.setAttribute('data-tsc-components-boot', '1');
    s.onload = markReady;
    s.onerror = markReady;
    document.head.appendChild(s);
  };
  /* Inject ASAP after DOM — no artificial delay (local FOUC felt like hung load) */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  } else {
    inject();
  }
})();
</script>`;

function patchHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (html.includes('data-tsc-mobile-boot')) {
    html = html.replace(/<script data-tsc-mobile-boot>[\s\S]*?<\/script>/, HEAD_BOOT);
  } else {
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, '<head$1>\n' + HEAD_BOOT);
    } else {
      html = HEAD_BOOT + html;
    }
  }
  changed = true;

  if (html.includes('data-tsc-mobile-loader')) {
    html = html.replace(/<script data-tsc-mobile-loader>[\s\S]*?<\/script>/, BODY_LOADER);
  } else {
    const idx = html.lastIndexOf('</body>');
    if (idx >= 0) {
      html = `${html.slice(0, idx)}${BODY_LOADER}\n${html.slice(idx)}`;
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  return changed;
}

let n = 0;
for (const file of primaryFiles) {
  const fp = path.join(pagesDir, file);
  if (!fs.existsSync(fp)) continue;
  patchHtml(fp);
  console.log('boot+loader -> pages/' + file);
  n++;
}

/* Also patch thin route shells under public (index.html files) */
function walk(dir, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'assets' || ent.name === 'mirror' || ent.name === 'css' || ent.name === 'js') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name === 'index.html') out.push(p);
  }
}
const shells = [];
walk(root, shells);
for (const fp of shells) {
  const html = fs.readFileSync(fp, 'utf8');
  /* only thin shells / short pages that already reference components or are site routes */
  if (html.length > 80000) continue; /* skip huge mirrored Wix dumps if any */
  if (!html.includes('tsc-components') && !html.includes('data-tsc-mobile') && html.length > 5000) continue;
  patchHtml(fp);
  console.log('boot+loader -> ' + path.relative(root, fp));
  n++;
}

console.log('Done. Patched ' + n + ' files.');
