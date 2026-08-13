/**
 * Inject mobile boot + route-map script on every public/pages/*.html
 */
import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'public/pages');
const bootSrc = fs.readFileSync(path.join(pagesDir, 'home.html'), 'utf8');
const bootMatch = bootSrc.match(/<script data-tsc-mobile-boot>[\s\S]*?<\/script>/);
if (!bootMatch) throw new Error('no boot in home.html');
const boot = bootMatch[0];

const routeMapTag =
  '<script src="/js/tsc-mobile-route-map.js?v=mobile-own-1"></script>';

let bootAdded = 0;
let mapAdded = 0;

for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html'))) {
  const fp = path.join(pagesDir, file);
  let html = fs.readFileSync(fp, 'utf8');
  let changed = false;

  if (!html.includes('data-tsc-mobile-boot')) {
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, (m) => m + '\n' + boot);
      bootAdded++;
      changed = true;
    } else {
      console.warn('no head', file);
    }
  }

  if (!html.includes('tsc-mobile-route-map.js')) {
    // Prefer immediately before tsc-components.js
    if (html.includes('tsc-components.js')) {
      html = html.replace(
        /(<script[^>]*src="[^"]*tsc-components\.js[^"]*"[^>]*><\/script>)/,
        routeMapTag + '\n$1'
      );
      // also script('/js/tsc-components...') pattern in courses
      html = html.replace(
        /(script\('\/js\/tsc-components\.js[^']*'\);)/,
        "script('/js/tsc-mobile-route-map.js?v=mobile-own-1');\n  $1"
      );
      mapAdded++;
      changed = true;
    } else {
      // before </head>
      html = html.replace(/<\/head>/i, routeMapTag + '\n</head>');
      mapAdded++;
      changed = true;
    }
  }

  if (changed) fs.writeFileSync(fp, html);
}

console.log({ bootAdded, mapAdded, total: fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html')).length });
