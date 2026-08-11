import fs from 'fs';

const path = 'public/js/tsc-components.js';
const raw = fs.readFileSync(path, 'utf8');
const crlf = raw.includes('\r\n');
let js = raw.replace(/\r\n/g, '\n');

const goodInline = `    /* Locked chrome: main 205x51, academy 146x68. Do not restyle. */
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

const inlineRe = /    \/\* (?:Cap max-h|Locked)[\s\S]*?style\.textContent = \[[\s\S]*?\]\.join\(''\);/;
if (!inlineRe.test(js)) {
  console.error('inline block not found');
  process.exit(1);
}
js = js.replace(inlineRe, goodInline);

const syncRe = /  function syncLockedDesktopHeaderBrand\(header, config\) \{[\s\S]*?\n  \}\n\n  \/\* About hero shankha/;
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
  }

  /* About hero shankha`;

if (!syncRe.test(js)) {
  console.error('sync not found');
  process.exit(1);
}
js = js.replace(syncRe, newSync);

js = js.replace(/tsc-desktop-nav-lock\.css\?v=[^'"]+/g, 'tsc-desktop-nav-lock.css?v=nav-lock-5');
js = js.replace(/tsc-responsive\.css\?v=[^'"]+/g, 'tsc-responsive.css?v=nav-lock-5');

const orderRe =
  /ensureStylesheet\('\/css\/tsc-desktop-nav-lock\.css\?v=nav-lock-5'\);\n  ensureStylesheet\('\/css\/tsc-nav-overrides\.css\?v=[^']+'\);\n  ensureStylesheet\('\/css\/tsc-responsive\.css\?v=nav-lock-5'\);/;
if (orderRe.test(js)) {
  js = js.replace(
    orderRe,
    "ensureStylesheet('/css/tsc-nav-overrides.css?v=desktop-top-1');\n  ensureStylesheet('/css/tsc-responsive.css?v=nav-lock-5');\n  ensureStylesheet('/css/tsc-desktop-nav-lock.css?v=nav-lock-5');"
  );
}

fs.writeFileSync(path, crlf ? js.replace(/\n/g, '\r\n') : js);
console.log('ok');
console.log('inline205', js.includes('width:205px!important'));
console.log('no259inline', !js.includes('max-width:259px'));
console.log('logoW', js.includes("logoW = config.academy"));
