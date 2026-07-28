/*
 * DESKTOP LOCK (>=1025px): injects the sanctioned mobile-only loader into the 9 locked
 * primary pages. The loader runs ONLY when matchMedia('(max-width: 1024px)') matches at
 * load, and reloads the page if the viewport crosses up into desktop, so the locked
 * faf9dea desktop rendering is never altered. Idempotent.
 */
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'public', 'pages');
const files = ['home.html', 'about.html', 'work.html', 'artists.html', 'artist-path.html',
  'learn-with-tsc.html', 'films.html', 'resources.html', 'academy.html'];

const loader = `<script data-tsc-mobile-loader>/* DESKTOP LOCK: mobile-only enhancements, never at >=1025px */
(function () {
  var mq = window.matchMedia && window.matchMedia('(max-width: 1024px)');
  if (!mq) return;
  var up = window.matchMedia('(min-width: 1025px)');
  var onUp = function (e) { if (e.matches) location.reload(); };
  if (up.addEventListener) up.addEventListener('change', onUp); else if (up.addListener) up.addListener(onUp);
  if (!mq.matches) return;
  var inject = function () {
    // tsc-components wires mobile CSS/chrome and loads content-replacements.js
    // (primary pages no longer ship page *.animations.js under desktop lock).
    var s = document.createElement('script');
    s.src = '/js/tsc-components.js';
    s.defer = true;
    document.head.appendChild(s);
  };
  // Wait for Wix Thunderbolt hydration to settle before touching DOM/styles,
  // otherwise scroll-driven animations crash and React unmounts page sections.
  var start = function () { setTimeout(inject, 1500); };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
</script>`;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const marker = 'data-tsc-mobile-loader';
  if (html.includes(marker)) {
    // replace existing loader block
    html = html.replace(/<script data-tsc-mobile-loader>[\s\S]*?<\/script>/, loader);
  } else {
    const idx = html.lastIndexOf('</body>');
    if (idx < 0) { console.error(`no </body> in ${file}`); process.exit(1); }
    html = `${html.slice(0, idx)}${loader}\n${html.slice(idx)}`;
  }
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`loader -> ${file}`);
}
