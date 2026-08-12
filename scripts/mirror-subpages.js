const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const publicDir = path.join(__dirname, '..', 'public');
const pagesDir = path.join(publicDir, 'pages');
const cssDir = path.join(publicDir, 'css', 'pages');
const jsDir = path.join(publicDir, 'js', 'pages');
const sourceBase = 'https://meghanabhawalkarwo.wixstudio.com/my-site';
const productionOrigin = 'https://wix-site-clone-psi.vercel.app';

const subpages = [
  { title: 'MBA', route: '/mba', sourcePath: '/blank-7' },
  { title: 'Harshad Duhita', route: '/harshad-duhita', sourcePath: '/blank-10' },
  { title: 'Roots of Hindustani Classical', route: '/roots-of-hindustani-classical', sourcePath: '/blank-9-1' },
  { title: 'The HeART of Composition', route: '/the-heart-of-composition', sourcePath: '/blank-9' },
  { title: 'Blog 1', route: '/blog-1', sourcePath: '/blank-13' },
  { title: 'Instagram Feed Expand Mode', route: '/instagram-feed-expand-mode', sourcePath: '/popup-z6vw8' },
  { title: 'YUGM', route: '/yugm', sourcePath: '/blank-10-1' },
  { title: 'Mahaprbhu', route: '/mahaprbhu', sourcePath: '/blank-12-1-1' },
  { title: 'Mahavatar Narsimha', route: '/mahavatar-narsimha', sourcePath: '/blank-12' },
  { title: 'Hanuman ansh', route: '/hanuman-ansh', sourcePath: '/blank-12-1' },
  { title: 'Blog 3', route: '/blog-3', sourcePath: '/blank-13-1-1' },
  { title: 'Blog 2', route: '/blog-2', sourcePath: '/blank-13-1' },
  { title: 'Collab Q', route: '/collab-query', sourcePath: '/blank-6' },
  { title: 'Kalki', route: '/kalki', sourcePath: '/blank-12-1-1-1' },
  { title: 'Book An Artist', route: '/book-an-artist', sourcePath: '/blank-8-1' },
  { title: 'Artist Query', route: '/artist-query', sourcePath: '/blank-8-1-1' },
  { title: 'Book A Call', route: '/book-a-call', sourcePath: '/blank-8' },
];

const requestedRoutes = new Set(process.argv.slice(2).map(value => {
  const clean = String(value || '').trim().replace(/^\/?pages\//, '').replace(/\.html$/, '');
  return clean ? `/${clean.replace(/^\//, '')}` : '';
}).filter(Boolean));

const hrefRewrites = new Map([
  ['/about-8', '/book-a-call'],
  ['/about-8-1', '/book-an-artist'],
  ['/about-8-1-1', '/artist-query'],
  ['/about-9', '/the-heart-of-composition'],
  ['/about-9-1', '/roots-of-hindustani-classical'],
  ['/work0', '/young-gunns'],
  ['/work0-1', '/yugm'],
  ['/work2', '/havells-myousic'],
  ['/work2-1', '/hanuman-ansh'],
  ['/work2-1-1', '/mahaprbhu'],
  ['/work2-1-1-1', '/kalki'],
  ['/work3', '/insta-music-league'],
  ['/work3-1', '/blog-2'],
  ['/work3-1-1', '/blog-3'],
  ['/blank-6', '/collab-query'],
  ['/blank-7', '/mba'],
  ['/blank-8', '/book-a-call'],
  ['/blank-8-1', '/book-an-artist'],
  ['/blank-8-1-1', '/artist-query'],
  ['/blank-9', '/the-heart-of-composition'],
  ['/blank-9-1', '/roots-of-hindustani-classical'],
  ['/blank-10', '/harshad-duhita'],
  ['/blank-10-1', '/yugm'],
  ['/blank-12', '/mahavatar-narsimha'],
  ['/blank-12-1', '/hanuman-ansh'],
  ['/blank-12-1-1', '/mahaprbhu'],
  ['/blank-12-1-1-1', '/kalki'],
  ['/blank-13', '/blog-1'],
  ['/blank-13-1', '/blog-2'],
  ['/blank-13-1-1', '/blog-3'],
]);

function slug(route) {
  return route.replace(/^\//, '');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rewriteUrls(html) {
  let output = html;
  output = output.split('https://static.parastorage.com').join('/assets/mirror/static.parastorage.com');
  output = output.split('//static.parastorage.com').join('/assets/mirror/static.parastorage.com');
  output = output.split('https://static.wixstatic.com').join('/assets/mirror/static.wixstatic.com');
  output = output.split('//static.wixstatic.com').join('/assets/mirror/static.wixstatic.com');
  output = output.split('https://video.wixstatic.com').join('/assets/mirror/video.wixstatic.com');
  output = output.split('//video.wixstatic.com').join('/assets/mirror/video.wixstatic.com');
  output = output.split('https://siteassets.parastorage.com').join('/assets/mirror/siteassets.parastorage.com');
  output = output.split('//siteassets.parastorage.com').join('/assets/mirror/siteassets.parastorage.com');
  output = output.split('https:\\/\\/static.parastorage.com').join('\\/assets\\/mirror\\/static.parastorage.com');
  output = output.split('https:\\/\\/static.wixstatic.com').join('\\/assets\\/mirror\\/static.wixstatic.com');
  output = output.split('https:\\/\\/video.wixstatic.com').join('\\/assets\\/mirror\\/video.wixstatic.com');
  output = output.split('https:\\/\\/siteassets.parastorage.com').join('\\/assets\\/mirror\\/siteassets.parastorage.com');
  output = output.split('https%3A%2F%2Fstatic.parastorage.com').join('%2Fassets%2Fmirror%2Fstatic.parastorage.com');
  output = output.split('https%3A%2F%2Fstatic.wixstatic.com').join('%2Fassets%2Fmirror%2Fstatic.wixstatic.com');
  output = output.split('https%3A%2F%2Fvideo.wixstatic.com').join('%2Fassets%2Fmirror%2Fvideo.wixstatic.com');
  output = output.split('https%3A%2F%2Fsiteassets.parastorage.com').join('%2Fassets%2Fmirror%2Fsiteassets.parastorage.com');
  output = output.replace(/https:\/\/frog\.wix\.com\/[^"')\\]+/g, '/assets/mirror/disabled-telemetry');
  output = output.replace(/https:\/\/panorama\.wixapps\.net\/[^"')\\]+/g, '/assets/mirror/disabled-telemetry');
  output = output.replace(/https:\/\/sentry-next\.wixpress\.com\/[^"')\\]+/g, '/assets/mirror/disabled-telemetry');
  output = output.split(sourceBase).join('/');
  output = output.split(sourceBase.replace(/\//g, '\\/')).join('\\/');
  output = output.split('https://meghanabhawalkarwo.wixstudio.com').join('/');
  output = output.split('https:\\/\\/meghanabhawalkarwo.wixstudio.com').join('\\/');
  for (const [from, to] of [...hrefRewrites.entries()].sort((a, b) => b[0].length - a[0].length)) {
    output = output.replace(new RegExp(`href="${escapeRegExp(from)}"`, 'g'), `href="${to}"`);
    output = output.replace(new RegExp(`href='${escapeRegExp(from)}'`, 'g'), `href='${to}'`);
    output = output.replace(new RegExp(escapeRegExp(from.replace(/\//g, '\\/')), 'g'), to.replace(/\//g, '\\/'));
  }
  return output;
}

function removeWixBadge(html) {
  return html
    .replace(/<div id="WIX_ADS"[\s\S]*?<\/div>(?=<div id="site-root")/i, '')
    .replace(/<!--\$-->\s*<div id="WIX_ADS"[\s\S]*?<\/div>\s*<!--\/\$-->/i, '')
    .replace(/<div id="WIX_ADS"[\s\S]*?<\/div>/i, '')
    .replace(/<a[^>]+href=["'](?:https?:)?\/\/wix\.com\/studio["'][\s\S]*?<\/a>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, script => script.includes('SENTRY_SDK_SOURCE') ? '' : script);
}

function extractStyles(html, pageSlug) {
  const styles = [];
  let first = true;
  const rewritten = html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (match, attrs, css) => {
    styles.push({ attrs: attrs.trim(), css });
    if (!first) return '';
    first = false;
    return `<link rel="stylesheet" href="/css/pages/${pageSlug}.css" data-tsc-page-style="${pageSlug}" data-tsc-standalone-runtime>`;
  });
  const css = styles.map((entry, index) => `/* style ${index + 1}${entry.attrs ? `: ${entry.attrs.replace(/\*\//g, '* /')}` : ''} */\n${entry.css.trim()}\n`).join('\n') + mirrorCleanupCss(pageSlug);
  fs.writeFileSync(path.join(cssDir, `${pageSlug}.css`), css, 'utf8');
  return rewritten;
}

function mirrorCleanupCss(pageSlug) {
  const heroTitleFix = pageSlug === 'harshad-duhita'
    ? '\n#comp-mqfgsqjf{opacity:1!important;--comp-opacity:1!important;}'
    : pageSlug === 'yugm'
      ? '\n#comp-mqhqa6y3{opacity:1!important;--comp-opacity:1!important;}'
      : '';
  return `\n/* TSC mirror cleanup */\n:root,body,#SITE_CONTAINER,#site-root{--wix-ads-height:0px!important;}\n#WIX_ADS{display:none!important;height:0!important;max-height:0!important;min-height:0!important;opacity:0!important;overflow:hidden!important;pointer-events:none!important;visibility:hidden!important;}\n#site-root{top:0!important;}${heroTitleFix}\n`;
}

function extractAnimationScript(html, pageSlug) {
  let extracted = '';
  const rewritten = html.replace(/<script\b([^>]*)\bid=["']wix-skip-played-animations["']([^>]*)>([\s\S]*?)<\/script>/i, (match, before, after, body) => {
    extracted = body.trim();
    return `<script id="wix-skip-played-animations" src="/js/pages/${pageSlug}.animations.js"></script>`;
  });
  fs.writeFileSync(path.join(jsDir, `${pageSlug}.animations.js`), `// Page animation bootstrap extracted for ${pageSlug}.\n${extracted || '// No animation bootstrap present.'}\n`, 'utf8');
  return rewritten;
}

const mirrorRuntimeScript = `
<style data-tsc-standalone-runtime>
:root, body { --wix-ads-height: 0px !important; }
#WIX_ADS, a[href*="wix.com/studio"] { display: none !important; visibility: hidden !important; height: 0 !important; }
</style>
<script data-tsc-standalone-runtime>
(function () {
  var siteRoutes = new Set(["/","/about","/work","/artists","/artist-path","/learn-with-tsc","/films","/resources","/academy","/book-a-call","/book-an-artist","/artist-query","/collab-query","/yugm","/harshad-duhita"]);
  var clearPlatformBadge = function () {
    var ads = document.getElementById("WIX_ADS");
    if (ads) {
      if (ads.childNodes.length) ads.replaceChildren();
      ads.setAttribute("aria-hidden", "true");
    }
    document.querySelectorAll('a[href*="wix.com/studio"]').forEach(function (link) { link.remove(); });
  };
  window.addEventListener("click", function (event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var target = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!target || target.target === "_blank" || target.hasAttribute("download")) return;
    var destination;
    try { destination = new URL(target.href, location.href); } catch (_) { return; }
    if (destination.origin !== location.origin || !siteRoutes.has(destination.pathname)) return;
    if (destination.pathname === location.pathname) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.assign(destination.pathname + destination.search + destination.hash);
  }, true);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", clearPlatformBadge);
  else clearPlatformBadge();
  new MutationObserver(clearPlatformBadge).observe(document.documentElement, { childList: true, subtree: true });
})();
<\/script>`;

const mirrorFetchPatchScript = `<script>
(function () {
  var mirrorBase = "/assets/mirror/meghanabhawalkarwo.wixstudio.com/my-site";
  var thunderboltVariantUrl = function (url) {
    try {
      var parsed = new URL(String(url || ""), location.origin);
      if (parsed.pathname !== "/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt" || !parsed.search) return url;
      var safe = function (value, fallback) { return String(value || fallback).replace(/[^a-zA-Z0-9._-]+/g, "_"); };
      var params = parsed.searchParams;
      var variant = [
        safe(params.get("module"), "module"),
        safe(params.get("pageId"), "page"),
        safe(params.get("formFactor") || params.get("deviceType"), "responsive"),
        safe(params.get("fileId"), "file")
      ].join("--");
      return "/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt/" + variant + ".json";
    } catch (_) {
      return url;
    }
  };
  var normalizeLocalUrl = function (url) {
    var text = String(url || "");
    if (/^https?:\\/\\/_partials\\//i.test(text)) return text.replace(/^https?:\\/\\/_partials/i, mirrorBase + "/_partials");
    if (/^\\/\\/\\_partials\\//i.test(text)) return text.replace(/^\\/\\/\\_partials/i, mirrorBase + "/_partials");
    if (/^https?:\\/\\/[^/]+\\/_partials\\//i.test(text)) return text.replace(/^https?:\\/\\/[^/]+\\/_partials/i, mirrorBase + "/_partials");
    if (/^\\/\\_partials\\//i.test(text)) return text.replace(/^\\/\\_partials/i, mirrorBase + "/_partials");
    if (/^https:\\/\\/meghanabhawalkarwo\\.wixstudio\\.com\\/my-site\\/_(?:partials|api)\\//i.test(text)) {
      return text.replace(/^https:\\/\\/meghanabhawalkarwo\\.wixstudio\\.com\\/my-site/i, mirrorBase);
    }
    return thunderboltVariantUrl(url);
  };
  var blocked = /(?:frog\\.wix\\.com|panorama\\.wixapps\\.net|sentry-next\\.wixpress\\.com|wix\\.com\\/studio|\\/_api\\/|\\/my-site\\/_api\\/)/i;
  var isBlockedUrl = function (url) {
    try {
      var parsed = new URL(String(url || ""), location.origin);
      if (parsed.origin === location.origin && parsed.pathname.indexOf("/assets/mirror/") === 0) return false;
    } catch (_) {}
    return blocked.test(String(url));
  };
  var okJson = function () {
    return Promise.resolve(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
  };
  if (navigator.sendBeacon) {
    var originalBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (url, data) {
      return isBlockedUrl(url) ? true : originalBeacon(url, data);
    };
  }
  if (window.fetch) {
    var originalFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      var url = typeof input === "string" ? input : input && input.url;
      var normalized = normalizeLocalUrl(url);
      if (typeof input === "string") input = normalized;
      else if (input && normalized !== url) input = new Request(normalized, input);
      return isBlockedUrl(url) ? okJson() : originalFetch(input, init);
    };
  }
  if (window.XMLHttpRequest) {
    var OriginalXhr = window.XMLHttpRequest;
    var originalOpen = OriginalXhr.prototype.open;
    OriginalXhr.prototype.open = function (method, url) {
      this.__blockedUrl = isBlockedUrl(url);
      arguments[1] = this.__blockedUrl ? "/api/disabled-telemetry" : normalizeLocalUrl(url);
      return originalOpen.apply(this, arguments);
    };
    var originalSend = OriginalXhr.prototype.send;
    OriginalXhr.prototype.send = function () {
      return originalSend.apply(this, arguments);
    };
  }
  if (window.Worker) {
    var OriginalWorker = window.Worker;
    window.Worker = function (url, options) {
      url = normalizeLocalUrl(url);
      if (blocked.test(String(url))) {
        return { postMessage: function () {}, terminate: function () {}, addEventListener: function () {}, removeEventListener: function () {}, dispatchEvent: function () { return false; } };
      }
      return new OriginalWorker(url, options);
    };
  }
  var imageDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (imageDescriptor && imageDescriptor.set) {
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      get: imageDescriptor.get,
      set: function (value) {
        value = normalizeLocalUrl(value);
        if (blocked.test(String(value))) return;
        return imageDescriptor.set.call(this, value);
      }
    });
  }
})();
<\/script>`;

function normalizeRuntime(html, page) {
  const escapedOrigin = productionOrigin.replace(/\//g, '\\/');
  const escapedRoute = page.route.replace(/\//g, '\\/');
  // Remove any existing standalone runtime injections
  let result = html
    .replace(/<style data-tsc-standalone-runtime>[\s\S]*?<\/style>\s*/g, '')
    .replace(/<script data-tsc-standalone-runtime>[\s\S]*?<\/script>\s*/g, '');
  // Fix viewer model URLs
  result = result
    .replace(/"externalBaseUrl":"(?:\\.|[^"\\])*"/g, `"externalBaseUrl":"${escapedOrigin}"`)
    .replace(/"baseUrl":"(?:\\.|[^"\\])*"/g, `"baseUrl":"${escapedOrigin}"`)
    .replace(/"siteUrl":"(?:\\.|[^"\\])*"/g, `"siteUrl":"${escapedOrigin}"`)
    .replace(/"requestUrl":"(?:\\.|[^"\\])*"/g, `"requestUrl":"${escapedOrigin}${escapedRoute}"`)
    .replace(/"accessTokensUrl":"(?:\\.|[^"\\])*"/g, `"accessTokensUrl":"\\/assets\\/mirror\\/meghanabhawalkarwo.wixstudio.com\\/my-site\\/_api\\/v1\\/access-tokens.json"`);
  // Inject standalone routing script into <head>
  result = result.replace(/<head([^>]*)>/i, `<head$1>\n${mirrorRuntimeScript}`);
  // Inject fetch/XHR patch right after window.viewerModel = JSON.parse(...)
  result = result.replace(
    /(<script>window\.viewerModel = JSON\.parse\(document\.getElementById\('wix-essential-viewer-model'\)\.textContent\)<\/script>)/,
    `<script>\nwindow.viewerModel = JSON.parse(document.getElementById('wix-essential-viewer-model').textContent);\n(function () {\n  var model = window.viewerModel;\n  if (!model) return;\n  var origin = location.origin;\n  model.site = model.site || {};\n  model.site.externalBaseUrl = origin;\n  model.requestUrl = new URL(location.pathname + location.search, origin).href;\n  model.accessTokensUrl = '/assets/mirror/meghanabhawalkarwo.wixstudio.com/my-site/_api/v1/access-tokens.json';\n  var topology = model.siteAssets && model.siteAssets.clientTopology;\n  if (topology) {\n    topology.moduleRepoUrl = origin + "/assets/mirror/static.parastorage.com/unpkg";\n    topology.fileRepoUrl = origin + "/assets/mirror/static.parastorage.com/services";\n  }\n})();\n<\/script>\n${mirrorFetchPatchScript}`
  );
  // Inject tsc-components.js before </body>
  result = result.replace(/<\/body>/, `\n<script src="/js/tsc-components.js?v=subpage-mirror-1" defer></script>\n</body>`);
  return result;
}

async function downloadReferencedAssets(html) {
  const refs = new Set();
  for (const match of html.matchAll(/\/assets\/mirror\/(?:static\.wixstatic\.com|video\.wixstatic\.com|static\.parastorage\.com|siteassets\.parastorage\.com)\/[^&"'<>)\s]+/g)) {
    refs.add(match[0].replace(/\*\/$/, ''));
  }
  for (const localRef of refs) {
    const cleanRef = localRef.split(/[?#]/)[0];
    const mediaMatch = cleanRef.match(/^\/assets\/mirror\/static\.wixstatic\.com\/media\/([^/]+)\/v1\//);
    const outputPath = mediaMatch
      ? path.join(publicDir, 'assets', 'mirror', 'static.wixstatic.com', 'original-media', decodeURIComponent(mediaMatch[1]))
      : path.join(publicDir, ...decodeURIComponent(cleanRef).replace(/^\/+/, '').split('/'));
    if (fs.existsSync(outputPath)) continue;
    const remoteUrl = mediaMatch
      ? `https://static.wixstatic.com/media/${encodeURIComponent(decodeURIComponent(mediaMatch[1]))}`
      : cleanRef.replace(/^\/assets\/mirror\/([^/]+)\//, 'https://$1/');
    try {
      const response = await fetch(remoteUrl);
      if (!response.ok) continue;
      const contentType = response.headers.get('content-type') || '';
      const bytes = Buffer.from(await response.arrayBuffer());
      const body = /javascript|css|json|svg|text/i.test(contentType) ? Buffer.from(rewriteUrls(bytes.toString('utf8')), 'utf8') : bytes;
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, body);
    } catch (_) {
      // Some optional Wix transforms are safely handled by runtime fallbacks.
    }
  }
}

async function main() {
  fs.mkdirSync(pagesDir, { recursive: true });
  fs.mkdirSync(cssDir, { recursive: true });
  fs.mkdirSync(jsDir, { recursive: true });
  const browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage();
    const pagesToMirror = requestedRoutes.size
      ? subpages.filter(subpage => requestedRoutes.has(subpage.route))
      : subpages;
    if (!pagesToMirror.length) {
      throw new Error(`No matching subpages for: ${[...requestedRoutes].join(', ')}`);
    }
    for (const subpage of pagesToMirror) {
      const url = `${sourceBase}${subpage.sourcePath}`;
      console.log(`Capturing ${url}`);
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      if (!response || !response.ok()) throw new Error(`Failed ${url}: ${response ? response.status() : 'no response'}`);
      let html = await response.text();
      const pageSlug = slug(subpage.route);
      html = normalizeRuntime(removeWixBadge(rewriteUrls(html)), subpage);
      html = extractStyles(html, pageSlug);
      html = extractAnimationScript(html, pageSlug);
      await downloadReferencedAssets(html);
      fs.writeFileSync(path.join(pagesDir, `${pageSlug}.html`), html, 'utf8');
    }
  } finally {
    await browser.close();
  }
  console.log(`Mirrored ${requestedRoutes.size ? requestedRoutes.size : subpages.length} real subpage HTML files.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
