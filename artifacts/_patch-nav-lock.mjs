import fs from 'fs';

function norm(s) {
  return s.replace(/\r\n/g, '\n');
}
function writePreserve(path, content, original) {
  const out = original.includes('\r\n') ? content.replace(/\n/g, '\r\n') : content;
  fs.writeFileSync(path, out);
}

const paths = {
  css: 'public/css/tsc-responsive.css',
  lock: 'public/css/tsc-desktop-nav-lock.css',
  js: 'public/js/tsc-components.js',
};

const lockCssRaw = fs.readFileSync(paths.lock, 'utf8');
if (!norm(lockCssRaw).includes('width: 205px')) {
  throw new Error('lock css missing 205');
}

const cssRaw = fs.readFileSync(paths.css, 'utf8');
let css = norm(cssRaw);

const oldSiteBrand = `  .tsc-desktop-site-brand {
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    height: auto;
    min-height: 72px;
    text-decoration: none;
    width: auto;
  }

  .tsc-desktop-site-brand img {
    display: block;
    filter: none !important;
    height: auto !important;
    max-height: 72px !important;
    max-width: 259px !important;
    mix-blend-mode: screen !important;
    object-fit: contain;
    width: auto !important;
  }`;

const newSiteBrand = `  .tsc-desktop-site-brand {
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    height: 51px;
    min-height: 54px;
    text-decoration: none;
    width: 205px;
  }

  .tsc-desktop-site-brand img {
    display: block;
    filter: brightness(0) invert(1);
    height: 51px !important;
    max-height: 51px;
    object-fit: contain;
    width: 205px !important;
  }

  .tsc-desktop-site-header-academy .tsc-desktop-site-brand img {
    height: 68px !important;
    max-height: 68px;
    width: 146px !important;
  }`;

if (!css.includes(oldSiteBrand)) {
  console.error('site brand block mismatch');
  process.exit(1);
}
css = css.replace(oldSiteBrand, newSiteBrand);

const oldLock = `/*
 * Locked desktop nav logos (main + academy share size; brand via JS src).
 * Main: tsc-logo-trim-nav.png · Academy: tsc-academy-logo-trim-nav.png
 * ~259×65 @ 1440 — do not shrink to mobile 205×51.
 */
@media (min-width: 1025px) {
  header .wixui-vector-image:has(.tsc-desktop-brand-link),
  header .wixui-vector-image:has(.tsc-desktop-brand-logo-unified),
  header [data-testid="vectorImage"]:has(.tsc-desktop-brand-link),
  header [data-testid="vectorImage"]:has(.tsc-desktop-brand-logo-unified) {
    height: auto !important;
    max-height: none !important;
    max-width: none !important;
    min-height: 72px !important;
    overflow: visible !important;
    width: auto !important;
  }

  .tsc-desktop-brand-link {
    align-items: center !important;
    display: flex !important;
    flex: 0 0 auto !important;
    height: auto !important;
    justify-content: flex-start !important;
    min-height: 72px !important;
    width: auto !important;
    max-width: none !important;
  }

  .tsc-desktop-brand-logo {
    display: block !important;
    object-fit: contain !important;
  }

  .tsc-desktop-brand-logo-unified,
  .tsc-desktop-site-header-academy .tsc-desktop-brand-logo-unified,
  header a[data-tsc-brand-logo="academy"] .tsc-desktop-brand-logo-unified,
  header a[data-tsc-brand-logo="main"] .tsc-desktop-brand-logo-unified {
    filter: none !important;
    height: auto !important;
    max-height: 72px !important;
    max-width: 259px !important;
    margin: 0 !important;
    mix-blend-mode: screen !important;
    object-fit: contain !important;
    object-position: left center !important;
    padding: 0 !important;
    width: auto !important;
  }
}`;

const newLock = `/*
 * DESKTOP NAV LOCK — do not restyle. Locked chrome sizes (HEAD):
 * main 205×51, academy 146×68. Mobile only inside max-width:1024px.
 */
@media (min-width: 1025px) {
  .tsc-desktop-brand-link {
    align-items: center !important;
    display: flex !important;
    flex: 0 0 auto !important;
    height: 51px !important;
    justify-content: flex-start !important;
    max-height: 51px !important;
    min-height: 51px !important;
    width: 205px !important;
  }

  .tsc-desktop-brand-logo {
    display: block !important;
    object-fit: contain !important;
  }

  .tsc-desktop-brand-logo-unified {
    height: 51px !important;
    max-height: 51px !important;
    min-height: 51px !important;
    mix-blend-mode: screen;
    width: 205px !important;
  }

  .tsc-desktop-site-header-academy .tsc-desktop-brand-link,
  header a[data-tsc-brand-logo="academy"] {
    height: 68px !important;
    max-height: 68px !important;
    min-height: 68px !important;
    width: 146px !important;
  }

  .tsc-desktop-site-header-academy .tsc-desktop-brand-logo-unified,
  header a[data-tsc-brand-logo="academy"] .tsc-desktop-brand-logo-unified {
    height: 68px !important;
    max-height: 68px !important;
    min-height: 68px !important;
    width: 146px !important;
  }

  header a[data-tsc-brand-logo="academy"] .tsc-desktop-brand-logo-unified,
  header .tsc-desktop-brand-logo-unified[src*="tsc-academy-logo"],
  header .tsc-desktop-brand-logo-unified[src*="academy-logo"] {
    filter: brightness(0) invert(1) !important;
    mix-blend-mode: normal !important;
  }
}`;

if (!css.includes(oldLock)) {
  console.error('lock media block mismatch');
  process.exit(1);
}
css = css.replace(oldLock, newLock);
writePreserve(paths.css, css, cssRaw);

const jsRaw = fs.readFileSync(paths.js, 'utf8');
let js = norm(jsRaw);

const oldSync = `  function syncLockedDesktopHeaderBrand(header, config) {
    if (!header || !config) return;
    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var logoSrc = logoSrcForConfig(config);
    var homeHref = config.academy ? '/academy' : '/';
    var candidates = Array.prototype.filter.call(header.querySelectorAll('a'), function(link) {
      var rect = link.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.left > 430) return false;
      return !!link.querySelector('img, svg, wix-vector-image, .wixui-vector-image') ||
        /shakti|academy|logo|brand/i.test(link.getAttribute('aria-label') || link.textContent || '');
    });
    var brandLink = candidates[0];
    if (!brandLink) return;
    brandLink.href = homeHref;
    brandLink.setAttribute('aria-label', brandName);
    brandLink.classList.add('tsc-desktop-brand-link');
    brandLink.dataset.tscBrandLogo = config.academy ? 'academy' : 'main';
    /* Skip only when correct mark present; re-inject if Wix wiped it (no forever hard-lock). */
    var existing = brandLink.querySelector('img.tsc-desktop-brand-logo-unified');
    if (existing && existing.getAttribute('src') === logoSrc) return;
    brandLink.innerHTML = '<img class="tsc-desktop-brand-logo tsc-desktop-brand-logo-unified" src="' + logoSrc + '" alt="' + escapeHtml(brandName) + '" decoding="async">';
  }`;

const newSync = `  function syncLockedDesktopHeaderBrand(header, config) {
    if (!header || !config) return;
    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var logoSrc = logoSrcForConfig(config);
    var homeHref = config.academy ? '/academy' : '/';
    var logoW = config.academy ? '146' : '205';
    var logoH = config.academy ? '68' : '51';
    var candidates = Array.prototype.filter.call(header.querySelectorAll('a'), function(link) {
      var rect = link.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.left > 430) return false;
      return !!link.querySelector('img, svg, wix-vector-image, .wixui-vector-image') ||
        /shakti|academy|logo|brand/i.test(link.getAttribute('aria-label') || link.textContent || '');
    });
    var brandLink = candidates[0];
    if (!brandLink) return;
    brandLink.href = homeHref;
    brandLink.setAttribute('aria-label', brandName);
    brandLink.classList.add('tsc-desktop-brand-link');
    brandLink.dataset.tscBrandLogo = config.academy ? 'academy' : 'main';
    var existing = brandLink.querySelector('img.tsc-desktop-brand-logo-unified');
    if (
      existing &&
      existing.getAttribute('src') === logoSrc &&
      existing.getAttribute('width') === logoW &&
      existing.getAttribute('height') === logoH
    ) {
      header.setAttribute('data-tsc-brand-locked', '1');
      return;
    }
    brandLink.innerHTML = '<img class="tsc-desktop-brand-logo tsc-desktop-brand-logo-unified" src="' + logoSrc + '" alt="' + escapeHtml(brandName) + '" width="' + logoW + '" height="' + logoH + '" decoding="async">';
    header.setAttribute('data-tsc-brand-locked', '1');
  }`;

if (!js.includes(oldSync)) {
  console.error('sync fn mismatch');
  process.exit(1);
}
js = js.replace(oldSync, newSync);

js = js.replace(
  /ensureStylesheet\('\/css\/tsc-desktop-nav-lock\.css\?v=[^']+'\);\n  ensureStylesheet\('\/css\/tsc-nav-overrides\.css\?v=[^']+'\);\n  ensureStylesheet\('\/css\/tsc-responsive\.css\?v=[^']+'\);/,
  "ensureStylesheet('/css/tsc-nav-overrides.css?v=desktop-top-1');\n  ensureStylesheet('/css/tsc-responsive.css?v=nav-lock-4');\n  ensureStylesheet('/css/tsc-desktop-nav-lock.css?v=nav-lock-4');"
);

const goodInline = `    /* Locked chrome: main 205×51, academy 146×68. Do not restyle. */
    style.textContent = [
      '@media (min-width:1025px){',
      '.tsc-desktop-brand-link{align-items:center!important;display:flex!important;flex:0 0 auto!important;height:51px!important;max-height:51px!important;min-height:51px!important;justify-content:flex-start!important;width:205px!important;}',
      '.tsc-desktop-brand-logo,.tsc-desktop-brand-logo-unified{display:block!important;height:51px!important;max-height:51px!important;min-height:51px!important;mix-blend-mode:screen!important;object-fit:contain!important;width:205px!important;}',
      '.tsc-desktop-site-header-academy .tsc-desktop-brand-link,header a[data-tsc-brand-logo="academy"]{height:68px!important;max-height:68px!important;min-height:68px!important;width:146px!important;}',
      '.tsc-desktop-site-header-academy .tsc-desktop-brand-logo-unified,header a[data-tsc-brand-logo="academy"] .tsc-desktop-brand-logo-unified{height:68px!important;max-height:68px!important;min-height:68px!important;width:146px!important;}',
      'header a[data-tsc-brand-logo="academy"] .tsc-desktop-brand-logo-unified,header .tsc-desktop-brand-logo-unified[src*="tsc-academy-logo"],header .tsc-desktop-brand-logo-unified[src*="academy-logo"]{filter:brightness(0) invert(1)!important;mix-blend-mode:normal!important;}',
      '.tsc-desktop-site-brand{align-items:center;display:inline-flex;flex:0 0 auto;height:51px;min-height:54px;text-decoration:none;width:205px;}',
      '.tsc-desktop-site-brand img{display:block;filter:brightness(0) invert(1);height:51px!important;max-height:51px!important;object-fit:contain;width:205px!important;}',
      '.tsc-desktop-site-header-academy .tsc-desktop-site-brand img{height:68px!important;max-height:68px!important;width:146px!important;}',
      '}'
    ].join('');`;

const inlineAny = /    \/\* Locked[\s\S]*?style\.textContent = \[[\s\S]*?\]\.join\(''\);/;
if (!inlineAny.test(js)) {
  console.error('inline not found');
  process.exit(1);
}
js = js.replace(inlineAny, goodInline);

writePreserve(paths.js, js, jsRaw);

console.log('patched ok');
console.log('responsive brand 205?', /tsc-desktop-brand-logo-unified \{[\s\S]*?width: 205px/.test(norm(fs.readFileSync(paths.css, 'utf8'))));
console.log('logoW?', /logoW = config/.test(norm(fs.readFileSync(paths.js, 'utf8'))));
