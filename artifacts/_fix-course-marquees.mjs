/**
 * Course pages: strip marquee price, start marquee, wire motion + chrome.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'the-heart-of-composition',
  'music-production',
  'roots-of-hindustani-classical',
];

const PRICE_RE =
  /<span class="tsc-course-price"[^>]*>[\s\S]*?<\/span>/gi;

const BOOT_SNIPPET = `
<script data-tsc-course-boot>
(function () {
  function link(href, media) {
    if (document.querySelector('link[data-tsc-course-boot][href="' + href + '"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    if (media) l.media = media;
    l.setAttribute('data-tsc-course-boot', '1');
    (document.head || document.documentElement).appendChild(l);
  }
  function script(src) {
    if (document.querySelector('script[data-tsc-course-boot][src="' + src.split('?')[0] + '"], script[src^="' + src.split('?')[0] + '"]')) return;
    var s = document.createElement('script');
    s.src = src;
    s.defer = true;
    s.setAttribute('data-tsc-course-boot', '1');
    (document.body || document.documentElement).appendChild(s);
  }
  link('/css/tsc-nav-overrides.css?v=kill-ads-strip-2');
  link('/css/tsc-responsive.css?v=kill-ads-strip-2');
  link('/css/tsc-wix-motion.css?v=course-marquee-1');
  link('/css/tsc-mobile-system.css?v=kill-ads-strip-2', '(max-width: 1024px)');
  link('/css/mobile/boot.css', '(max-width: 1024px)');
  link('/css/mobile/learn.css', '(max-width: 1024px)');
  script('/js/tsc-components.js?v=course-anim-1');
  script('/js/tsc-wix-motion.js?v=course-marquee-1');
})();
</script>
`;

function patch(file) {
  let html = fs.readFileSync(file, 'utf8');
  const beforePrice = (html.match(PRICE_RE) || []).length;
  html = html.replace(PRICE_RE, '');

  // Ensure marquee scrolls left
  html = html.replace(
    /data-marquee-animation=""/g,
    'data-marquee-animation="left"'
  );

  if (!html.includes('data-tsc-course-boot')) {
    if (html.includes('</body>')) {
      html = html.replace('</body>', BOOT_SNIPPET + '\n</body>');
    } else {
      html += BOOT_SNIPPET;
    }
  }

  // Keep page animation helper but clear cross-page "already played" poison
  // so enter motions can run again on course visits.
  const animMarker = 'wix-skip-played-animations';
  if (html.includes(animMarker) && !html.includes('data-tsc-course-anim-clear')) {
    html = html.replace(
      /<script defer id="wix-skip-played-animations"[^>]*><\/script>/,
      `<script data-tsc-course-anim-clear>
(function () {
  try { sessionStorage.removeItem('wix-motion-played-animations'); } catch (e) {}
})();
</script>
<script defer id="wix-skip-played-animations" src="/js/pages/${path.basename(file, '.html')}.animations.js"></script>`
    );
  }

  fs.writeFileSync(file, html);
  const afterPrice = (html.match(PRICE_RE) || []).length;
  const marquees = (html.match(/data-marquee-animation="left"/g) || []).length;
  console.log(
    path.basename(file),
    'priceRemoved',
    beforePrice,
    'priceLeft',
    afterPrice,
    'marqueeLeft',
    marquees,
    'boot',
    html.includes('data-tsc-course-boot')
  );
}

for (const slug of pages) {
  patch(path.join(root, 'public', 'pages', `${slug}.html`));
}
