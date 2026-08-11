const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets', 'mirror');
const SITE_URL = 'https://wix-site-clone-psi.vercel.app';
const SOURCE_ORIGIN = 'https://meghanabhawalkarwo.wixstudio.com';
const SOURCE_BASE = `${SOURCE_ORIGIN}/my-site`;
const BRAND_NAME = 'The Shakti Collective';
const DEFAULT_DESCRIPTION = 'The Shakti Collective is a culture-first artist development ecosystem for singers, musicians, producers, storytellers, and conscious creative communities.';

const routes = [
  { source: SOURCE_BASE, path: '/', file: 'index.html', title: 'The Shakti Collective | Artist Development, Music Academy & Culture-First IP', description: DEFAULT_DESCRIPTION },
  { source: `${SOURCE_BASE}/blank`, path: '/about', file: 'about/index.html', title: 'About The Shakti Collective | Culture-First Artist Ecosystem', description: 'Learn how The Shakti Collective helps artists grow through mentorship, collaboration, storytelling, music education, and sustainable creative systems.' },
  { source: `${SOURCE_BASE}/blank-1`, path: '/work', file: 'work/index.html', title: 'Work With The Shakti Collective | Artist Development & Brand Collaborations', description: 'Explore The Shakti Collective work across artist development, brand collaborations, culture-first IP, music ecosystems, and creative storytelling.' },
  { source: `${SOURCE_BASE}/blank-2`, path: '/artists', file: 'artists/index.html', title: 'TSC Artists | Independent Artists, Singers, Musicians & Storytellers', description: 'Discover the artists, singers, musicians, producers, and storytellers growing within The Shakti Collective creative ecosystem.' },
  { source: `${SOURCE_BASE}/blank-4`, path: '/artist-path', file: 'artist-path/index.html', title: 'Artist Path | Sustainable Growth for Emerging Artists', description: 'Follow the artist path from spark and belief to learning, release readiness, collaboration, and go-to-market support.' },
  { source: `${SOURCE_BASE}/blank-3-1`, path: '/learn-with-tsc', file: 'learn-with-tsc/index.html', title: 'Learn With TSC | Mentorship-Led Music Learning', description: 'Learn with The Shakti Collective through mentorship-led music education, craft development, creative direction, and artist growth frameworks.' },
  { source: `${SOURCE_BASE}/blank-11`, path: '/films', file: 'films/index.html', title: 'TSC Films | Original Stories, Music Ecosystems & Culture-First Experiences', description: 'Explore films and original storytelling from The Shakti Collective, built around emotionally honest music, artists, and culture-first creative worlds.' },
  { source: `${SOURCE_BASE}/blank-5`, path: '/resources', file: 'resources/index.html', title: 'Artist Resources | Music, Creativity & Sustainable Career Building', description: 'Resources for artists seeking clarity, creative discipline, collaboration, audience building, and sustainable growth in the modern music ecosystem.' },
  { source: `${SOURCE_BASE}/blank-3`, path: '/academy', file: 'academy/index.html', title: 'TSC Academy | Music Mentorship for Artists and Creators', description: 'TSC Academy offers mentorship-led learning for singers, musicians, producers, and creators building craft, confidence, and artistic identity.' },
];

const prettyPagePaths = new Map([
  ['home', ''],
  ['blank', 'about'],
  ['blank-1', 'work'],
  ['blank-2', 'artists'],
  ['blank-4', 'artist-path'],
  ['blank-3-1', 'learn-with-tsc'],
  ['blank-11', 'films'],
  ['blank-5', 'resources'],
  ['blank-3', 'academy'],
]);

const sourceToClean = new Map(routes.map(route => [route.source, route.path]));
const resourceMap = new Map();
const resourceBodies = new Map();

function safeVariantPart(value, fallback) {
  return String(value || fallback).replace(/[^a-zA-Z0-9._-]+/g, '_');
}

function thunderboltVariantPath(parsed) {
  if (parsed.hostname !== 'siteassets.parastorage.com' || parsed.pathname !== '/pages/pages/thunderbolt' || !parsed.search) return null;
  const params = parsed.searchParams;
  const variant = [
    safeVariantPart(params.get('module'), 'module'),
    safeVariantPart(params.get('pageId'), 'page'),
    safeVariantPart(params.get('formFactor') || params.get('deviceType'), 'responsive'),
    safeVariantPart(params.get('fileId'), 'file'),
  ].join('--');
  return `/assets/mirror/${parsed.hostname}${parsed.pathname}/${variant}.json`;
}

function resetPublicDir() {
  fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function extensionFor(url, contentType = '') {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname).split(/[?#]/)[0];
  if (ext && ext.length <= 8) return ext;
  if (contentType.includes('javascript')) return '.js';
  if (contentType.includes('css')) return '.css';
  if (contentType.includes('font/woff2')) return '.woff2';
  if (contentType.includes('font/woff')) return '.woff';
  if (contentType.includes('svg')) return '.svg';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('mp4')) return '.mp4';
  if (contentType.includes('json')) return '.json';
  return '.bin';
}

function localAssetPath(url, contentType = '') {
  const key = url.replace(/^\/\//, 'https://');
  if (resourceMap.has(key)) return resourceMap.get(key);
  const parsed = new URL(key);
  const thunderboltPath = thunderboltVariantPath(parsed);
  if (thunderboltPath) {
    resourceMap.set(key, thunderboltPath);
    return thunderboltPath;
  }
  const ext = extensionFor(key, contentType);
  let pathname = parsed.pathname;
  if (pathname.endsWith('/')) pathname = `${pathname}index${ext}`;
  else if (!path.extname(pathname) && !(contentType.includes('json') && parsed.search)) pathname = `${pathname}${ext}`;
  const safePath = pathname
    .split('/')
    .filter(Boolean)
    .map(part => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    })
    .map(part => part.replace(/[<>:"\\|?*]/g, '_'))
    .join('/');
  const localPath = `/assets/mirror/${parsed.hostname}/${safePath}`;
  resourceMap.set(key, localPath);
  return localPath;
}

function shouldStoreResponse(url, resourceType, contentType) {
  if (!/^https?:\/\//i.test(url)) return false;
  if (resourceType === 'document') return false;
  if ((resourceType === 'xhr' || resourceType === 'fetch') && !/json|javascript|css|svg|text/i.test(contentType || '')) return false;
  return /javascript|css|image|font|video|audio|json|svg|text\/plain/i.test(contentType || '');
}

function rewriteAllUrls(text) {
  let output = text;
  const escapedSiteUrl = SITE_URL.replace(/\//g, '\\/');
  const sourceMirrorBase = `/assets/mirror/${new URL(SOURCE_ORIGIN).hostname}/my-site`;
  const rewriteLiteral = (from, to) => {
    output = output.split(from).join(to);
    output = output.split(from.replace(/^https:/, '')).join(to);
    output = output.split(encodeURI(from)).join(to);
    output = output.split(encodeURIComponent(from)).join(encodeURIComponent(to));
    output = output.split(from.replace(/\//g, '\\/')).join(to.replace(/\//g, '\\/'));
  };
  rewriteLiteral(`${SOURCE_BASE}/_partials`, `${sourceMirrorBase}/_partials`);
  rewriteLiteral(`${SOURCE_BASE}/_api`, `${sourceMirrorBase}/_api`);
  output = output.split('http://_partials/').join(`${sourceMirrorBase}/_partials/`);
  output = output.split('https://_partials/').join(`${sourceMirrorBase}/_partials/`);
  output = output.split('//_partials/').join(`${sourceMirrorBase}/_partials/`);
  output = output.split('http:\\/\\/_partials\\/').join(`${sourceMirrorBase.replace(/\//g, '\\/')}\\/_partials\\/`);
  output = output.split('https:\\/\\/_partials\\/').join(`${sourceMirrorBase.replace(/\//g, '\\/')}\\/_partials\\/`);
  output = output.split('%2F_partials%2F').join(`${encodeURIComponent(sourceMirrorBase)}%2F_partials%2F`);
  const entries = [...resourceMap.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [absolute, local] of entries) {
    output = output.split(absolute).join(local);
    output = output.split(absolute.replace(/^https:/, '')).join(local);
    output = output.split(encodeURI(absolute)).join(local);
    output = output.split(encodeURIComponent(absolute)).join(encodeURIComponent(local));
    output = output.split(absolute.replace(/\//g, '\\/')).join(local.replace(/\//g, '\\/'));
  }
  for (const route of [...routes].sort((a, b) => b.source.length - a.source.length)) {
    const sourceRelativePath = new URL(route.source).pathname.replace(/^\/my-site/, '') || '/';
    const cleanRelativePath = route.path === '/' ? '/' : route.path;
    output = output
      .split(`".${sourceRelativePath}":`)
      .join(`".${cleanRelativePath}":`);
    output = output
      .split(`".${sourceRelativePath.replace(/\//g, '\\/')}":`)
      .join(`".${cleanRelativePath.replace(/\//g, '\\/')}":`);
    output = output.split(route.source).join(route.path);
    output = output.split(route.source.replace(/^https:/, '')).join(route.path);
    output = output.split(encodeURIComponent(route.source)).join(route.path);
  }
  output = output.split(SOURCE_BASE).join('/');
  output = output.split(SOURCE_ORIGIN).join('/');
  output = output.split(encodeURIComponent(SOURCE_BASE)).join(encodeURIComponent('/'));
  output = output.split(encodeURIComponent(SOURCE_ORIGIN)).join(encodeURIComponent('/'));
  output = output.split(SOURCE_BASE.replace(/\//g, '\\/')).join('\\/');
  output = output.split(SOURCE_ORIGIN.replace(/\//g, '\\/')).join('\\/');
  output = output.split('https://static.parastorage.com').join('/assets/mirror/static.parastorage.com');
  output = output.split('//static.parastorage.com').join('/assets/mirror/static.parastorage.com');
  output = output.split('https://static.wixstatic.com').join('/assets/mirror/static.wixstatic.com');
  output = output.split('//static.wixstatic.com').join('/assets/mirror/static.wixstatic.com');
  output = output.split('https://video.wixstatic.com').join('/assets/mirror/video.wixstatic.com');
  output = output.split('//video.wixstatic.com').join('/assets/mirror/video.wixstatic.com');
  output = output.split('https://siteassets.parastorage.com').join('/assets/mirror/siteassets.parastorage.com');
  output = output.split('//siteassets.parastorage.com').join('/assets/mirror/siteassets.parastorage.com');
  output = output.split('https%3A%2F%2Fstatic.parastorage.com').join('%2Fassets%2Fmirror%2Fstatic.parastorage.com');
  output = output.split('https%3A%2F%2Fstatic.wixstatic.com').join('%2Fassets%2Fmirror%2Fstatic.wixstatic.com');
  output = output.split('https%3A%2F%2Fvideo.wixstatic.com').join('%2Fassets%2Fmirror%2Fvideo.wixstatic.com');
  output = output.split('https%3A%2F%2Fsiteassets.parastorage.com').join('%2Fassets%2Fmirror%2Fsiteassets.parastorage.com');
  output = output.split('https:\\/\\/static.parastorage.com').join('\\/assets\\/mirror\\/static.parastorage.com');
  output = output.split('https:\\/\\/static.wixstatic.com').join('\\/assets\\/mirror\\/static.wixstatic.com');
  output = output.split('https:\\/\\/video.wixstatic.com').join('\\/assets\\/mirror\\/video.wixstatic.com');
  output = output.split('https:\\/\\/siteassets.parastorage.com').join('\\/assets\\/mirror\\/siteassets.parastorage.com');
  output = output.replace(/https:\/\/frog\.wix\.com\/[^"')\\]+/g, '/assets/mirror/disabled-telemetry');
  output = output.replace(/http:\/\/frog\.wix\.com\/[^"')\\]+/g, '/assets/mirror/disabled-telemetry');
  output = output.replace(/https:\/\/panorama\.wixapps\.net\/[^"')\\]+/g, '/assets/mirror/disabled-telemetry');
  output = output.replace(/https:\/\/sentry-next\.wixpress\.com\/[^"')\\]+/g, '/assets/mirror/disabled-telemetry');
  output = output.replace(/"sentryDsn":"(?:\\.|[^"\\])*"/g, '"sentryDsn":""');
  output = output
    .replace(/"externalBaseUrl":"\\\/"/g, `"externalBaseUrl":"${escapedSiteUrl}"`)
    .replace(/"baseUrl":"\\\/"/g, `"baseUrl":"${escapedSiteUrl}"`)
    .replace(/"siteUrl":"\\\/"/g, `"siteUrl":"${escapedSiteUrl}"`);
  const accessTokensPath = `${sourceMirrorBase}/_api/v1/access-tokens`;
  output = output
    .split(accessTokensPath)
    .join(`${accessTokensPath}.json`)
    .split(accessTokensPath.replace(/\//g, '\\/'))
    .join((accessTokensPath + '.json').replace(/\//g, '\\/'))
    .split(encodeURIComponent(accessTokensPath))
    .join(encodeURIComponent(`${accessTokensPath}.json`));
  const accessTokensJsonPath = `${accessTokensPath}.json`;
  for (const variant of [
    accessTokensJsonPath,
    accessTokensJsonPath.replace(/\//g, '\\/'),
    encodeURIComponent(accessTokensJsonPath),
  ]) {
    while (output.includes(`${variant}.json`)) {
      output = output.split(`${variant}.json`).join(variant);
    }
  }
  for (const [wixPath, prettyPath] of prettyPagePaths) {
    output = output
      .split(`"pageFullPath":"${wixPath}"`)
      .join(`"pageFullPath":"${prettyPath}"`)
      .split(`\\"pageFullPath\\":\\"${wixPath}\\"`)
      .join(`\\"pageFullPath\\":\\"${prettyPath}\\"`)
      .split(`"pageUriSEO":"${wixPath}"`)
      .join(`"pageUriSEO":"${prettyPath}"`)
      .split(`\\"pageUriSEO\\":\\"${wixPath}\\"`)
      .join(`\\"pageUriSEO\\":\\"${prettyPath}\\"`);
  }
  return output;
}

function removeWixBadge(html) {
  return html
    .replace(/<div id="WIX_ADS"[\s\S]*?<\/div>(?=<div id="site-root")/i, '')
    .replace(/<a[^>]+href=["'](?:https?:)?\/\/wix\.com\/studio["'][\s\S]*?<\/a>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, script => {
      return script.includes('SENTRY_SDK_SOURCE') ? '' : script;
    });
}

function injectIndependenceGuards(html) {
  const guard = `<script>
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
    if (/^\\/_partials\\//i.test(text)) return text.replace(/^\\/_partials/i, mirrorBase + "/_partials");
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
        return {
          postMessage: function () {},
          terminate: function () {},
          addEventListener: function () {},
          removeEventListener: function () {},
          dispatchEvent: function () { return false; }
        };
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
</script>`;
  return html.replace(/<head([^>]*)>/i, `<head$1>\n${guard}`);
}

function injectDynamicViewerModel(html) {
  const pattern = /<script>window\.viewerModel = JSON\.parse\(document\.getElementById\('wix-essential-viewer-model'\)\.textContent\);?<\/script>/;
  const bootstrap = [
    '<script>',
    "window.viewerModel = JSON.parse(document.getElementById('wix-essential-viewer-model').textContent);",
    '(function () {',
    '  var model = window.viewerModel;',
    '  if (!model) return;',
    '  var origin = location.origin;',
    '  model.site = model.site || {};',
    '  model.site.externalBaseUrl = origin;',
    '  model.requestUrl = new URL(location.pathname + location.search, origin).href;',
    '  var topology = model.siteAssets && model.siteAssets.clientTopology;',
    '  if (topology) {',
    '    topology.moduleRepoUrl = origin + "/assets/mirror/static.parastorage.com/unpkg";',
    '    topology.fileRepoUrl = origin + "/assets/mirror/static.parastorage.com/services";',
    '  }',
    '})();',
    '</script>',
  ].join('\n');
  return html.replace(pattern, bootstrap);
}

function injectDynamicSiteConfig(html) {
  if (html.includes('data-tsc-runtime-config')) return html;
  const pattern = /(<script type="application\/json" id="wix-viewer-model">[\s\S]*?<\/script>)/;
  const patch = [
    '<script data-tsc-runtime-config>',
    '(function () {',
    '  var element = document.getElementById("wix-viewer-model");',
    '  if (!element) return;',
    '  var model = JSON.parse(element.textContent);',
    '  var origin = location.origin;',
    '  function canonicalPathname() {',
    '    var path = location.pathname || "/";',
    '    var match = path.match(/^\\/pages\\/([^/]+)\\.html$/);',
    '    if (!match) return path;',
    '    return match[1] === "home" ? "/" : "/" + match[1];',
    '  }',
    '  var runtimePath = canonicalPathname();',
    '  if (runtimePath !== location.pathname) {',
    '    history.replaceState(history.state, "", runtimePath + location.search + location.hash);',
    '  }',
    '  var href = new URL(runtimePath + location.search, origin).href;',
    '  var config = model.siteFeaturesConfigs || {};',
    '  if (config.router) config.router.baseUrl = origin;',
    '  if (config.routerFetch) config.routerFetch.externalBaseUrl = origin;',
    '  if (config.seo && config.seo.context) {',
    '    config.seo.context.siteUrl = origin;',
    '    config.seo.context.defaultUrl = runtimePath;',
    '  }',
    '  model.requestUrl = href;',
    '  if (model.site) model.site.externalBaseUrl = origin;',
    '  var assets = model.siteAssets || {};',
    '  var modules = assets.modulesParams || {};',
    '  Object.keys(modules).forEach(function (key) {',
    '    if (modules[key] && modules[key].externalBaseUrl) modules[key].externalBaseUrl = origin;',
    '  });',
    '  var topology = assets.clientTopology;',
    '  if (topology) {',
    '    topology.moduleRepoUrl = origin + "/assets/mirror/static.parastorage.com/unpkg";',
    '    topology.fileRepoUrl = origin + "/assets/mirror/static.parastorage.com/services";',
    '  }',
    '  element.textContent = JSON.stringify(model);',
    '})();',
    '</script>',
  ].join('\n');
  return html.replace(pattern, '$1\n' + patch);
}

function injectStandaloneRuntime(html) {
  const cleaned = html
    .replace(/<style data-tsc-standalone-runtime>[\s\S]*?<\/style>\s*/g, '')
    .replace(/<script data-tsc-standalone-runtime>[\s\S]*?<\/script>\s*/g, '');
  const routesJson = JSON.stringify(routes.map(route => route.path));
  const runtime = [
    '<style data-tsc-standalone-runtime>',
    ':root, body { --wix-ads-height: 0px !important; }',
    '#WIX_ADS, a[href*="wix.com/studio"] { display: none !important; visibility: hidden !important; height: 0 !important; }',
    '</style>',
    '<script data-tsc-standalone-runtime>',
    '(function () {',
    `  var siteRoutes = new Set(${routesJson});`,
    '  var clearPlatformBadge = function () {',
    '    var ads = document.getElementById("WIX_ADS");',
    '    if (ads) {',
    '      if (ads.childNodes.length) ads.replaceChildren();',
    '      ads.setAttribute("aria-hidden", "true");',
    '    }',
    '    document.querySelectorAll(\'a[href*="wix.com/studio"]\').forEach(function (link) { link.remove(); });',
    '  };',
    '  window.addEventListener("click", function (event) {',
    '    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;',
    '    var target = event.target instanceof Element ? event.target.closest("a[href]") : null;',
    '    if (!target || target.target === "_blank" || target.hasAttribute("download")) return;',
    '    var destination;',
    '    try { destination = new URL(target.href, location.href); } catch (_) { return; }',
    '    if (destination.origin !== location.origin || !siteRoutes.has(destination.pathname)) return;',
    '    if (destination.pathname === location.pathname) return;',
    '    event.preventDefault();',
    '    event.stopImmediatePropagation();',
    '    location.assign(destination.pathname + destination.search + destination.hash);',
    '  }, true);',
    '  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", clearPlatformBadge);',
    '  else clearPlatformBadge();',
    '  new MutationObserver(clearPlatformBadge).observe(document.documentElement, { childList: true, subtree: true });',
    '})();',
    '</script>',
  ].join('\n');
  return cleaned.replace(/<head([^>]*)>/i, `<head$1>\n${runtime}`);
}

function normalizeRuntimeConfig(html, route) {
  const escapedSite = SITE_URL.replace(/\//g, '\\/');
  const escapedRequest = `${SITE_URL}${route.path === '/' ? '/' : route.path}`.replace(/\//g, '\\/');
  return injectStandaloneRuntime(injectDynamicSiteConfig(injectDynamicViewerModel(html
    .replace(/"externalBaseUrl":"\\\/"/g, `"externalBaseUrl":"${escapedSite}"`)
    .replace(/"requestUrl":"(?:\\.|[^"\\])*"/g, `"requestUrl":"${escapedRequest}"`)
    .replace(/"(moduleRepoUrl|fileRepoUrl)":"((?:\\.|[^"\\])*)"/g, (match, key, value) => {
      return value.startsWith('\\/assets\\/mirror\\/') ? `"${key}":"${escapedSite}${value}"` : match;
    }))));
}

function seoJsonLd(route) {
  const canonical = `${SITE_URL}${route.path === '/' ? '/' : route.path}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: BRAND_NAME,
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
      email: 'Artist@theshakticollective.in',
      sameAs: [
        'https://www.instagram.com/the_shakti_collective/',
        'https://youtube.com/@theshakticollective',
        'https://www.facebook.com/people/The-Shakti-Collective/61575006284507/',
        'https://www.linkedin.com/company/theshakticollective',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: route.title,
      description: route.description,
      about: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
      dateModified: '2026-07-24',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is The Shakti Collective?',
          acceptedAnswer: { '@type': 'Answer', text: DEFAULT_DESCRIPTION },
        },
        {
          '@type': 'Question',
          name: 'How does The Shakti Collective support artists?',
          acceptedAnswer: { '@type': 'Answer', text: 'The Shakti Collective supports artists through mentorship, learning frameworks, collaboration, storytelling, artist development systems, brand partnerships, and go-to-market guidance.' },
        },
      ],
    },
  ].map(item => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join('\n  ');
}

function applySeo(html, route) {
  const canonical = `${SITE_URL}${route.path === '/' ? '/' : route.path}`;
  const seoBlock = `
  <title>${route.title}</title>
  <meta name="description" content="${route.description}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#083D3A">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${BRAND_NAME}">
  <meta property="og:title" content="${route.title}">
  <meta property="og:description" content="${route.description}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${route.title}">
  <meta name="twitter:description" content="${route.description}">
  ${seoJsonLd(route)}`;

  const cleaned = html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name=["']description["'][^>]*>/gi, '')
    .replace(/\s*<meta\s+name=["']robots["'][^>]*>/gi, '')
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/\s*<link\s+rel=["'](?:icon|apple-touch-icon|manifest)["'][^>]*>/gi, '')
    .replace(/\s*<meta\s+(?:property|name)=["'](?:og|twitter):[^"']+["'][^>]*>/gi, '')
    .replace(/\s*<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, '')
    .replace('</head>', `${seoBlock}\n</head>`);
  return injectIndependenceGuards(cleaned);
}

function writeSupportFiles() {
  const sitemapUrls = routes.map(route => {
    const loc = `${SITE_URL}${route.path === '/' ? '/' : route.path}`;
    const priority = route.path === '/' ? '1.0' : '0.8';
    return `  <url><loc>${loc}</loc><lastmod>2026-07-24</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
  }).join('\n');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml

# LLM-friendly site maps (https://llmstxt.org/)
# LLMs: ${SITE_URL}/llms.txt
# LLMs-Full: ${SITE_URL}/llms-full.txt
`);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'site.webmanifest'), JSON.stringify({
    name: BRAND_NAME,
    short_name: 'TSC',
    description: DEFAULT_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFECD1',
    theme_color: '#083D3A',
  }, null, 2));
}

async function exerciseLoadedRoute(page) {
  const bodyHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const step = Math.max(300, Math.floor(viewportHeight * 0.65));
  for (let top = 0; top < bodyHeight; top += step) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
}

async function loadAndExerciseRoute(page, route) {
  console.log(`Capturing ${route.source}`);
  await page.goto(route.source, { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1500)));
  await exerciseLoadedRoute(page);
}

async function captureRoute(page, route) {
  console.log(`Capturing ${route.source}`);
  const response = await page.goto(route.source, { waitUntil: 'domcontentloaded', timeout: 90000 });
  if (!response || !response.ok()) {
    throw new Error(`Failed to capture ${route.source}: ${response ? response.status() : 'no response'}`);
  }
  // Keep the server document pristine. page.content() serializes scripts injected by
  // Thunderbolt after hydration, causing those chunks to execute out of order later.
  const html = await response.text();
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1500)));
  await exerciseLoadedRoute(page);
  const routeFile = path.join(PUBLIC_DIR, route.file);
  fs.mkdirSync(path.dirname(routeFile), { recursive: true });
  fs.writeFileSync(routeFile, normalizeRuntimeConfig(applySeo(removeWixBadge(rewriteAllUrls(html)), route), route));
}

async function ensureReferencedAssets() {
  const knownRuntimeAssets = [
    '/assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/module-executor.81334661.chunk.min.js',
    '/assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/clientWorker.196162d7.bundle.min.js',
  ];
  const htmlFiles = routes.map(route => path.join(PUBLIC_DIR, route.file));
  const references = new Set();
  for (const asset of knownRuntimeAssets) references.add(asset);
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/\/assets\/mirror\/(?:static\.wixstatic\.com|video\.wixstatic\.com|static\.parastorage\.com|siteassets\.parastorage\.com)\/[^&"'<>)\s]+/g)) {
      references.add(match[0]);
    }
    for (const match of html.matchAll(/video\/[a-zA-Z0-9_]+\/(?:360p|480p|720p|1080p)\/mp4\/file\.mp4/g)) {
      references.add('/assets/mirror/video.wixstatic.com/' + match[0]);
    }
  }
  for (const localPath of references) {
    const decodedLocalPath = localPath.split('/').map(part => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    }).join('/');
    const outputPath = path.join(PUBLIC_DIR, decodedLocalPath);
    if (fs.existsSync(outputPath)) continue;
    const remoteUrl = decodedLocalPath.replace(/^\/assets\/mirror\/([^/]+)\//, 'https://$1/');
    try {
      const response = await fetch(remoteUrl);
      if (!response.ok) continue;
      const contentType = response.headers.get('content-type') || '';
      const downloaded = Buffer.from(await response.arrayBuffer());
      const body = /javascript|css|json|svg|text/i.test(contentType)
        ? Buffer.from(rewriteAllUrls(downloaded.toString('utf8')), 'utf8')
        : downloaded;
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, body);
      console.log(`Fetched referenced asset ${remoteUrl}`);
    } catch {
      // Optional late-loading media can fail independently of the static page.
    }
  }
}

async function ensureOriginalMediaAssets() {
  const mediaNames = new Set();
  for (const url of resourceMap.keys()) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname !== 'static.wixstatic.com') continue;
      const match = parsed.pathname.match(/^\/media\/([^/]+)/);
      if (match) mediaNames.add(decodeURIComponent(match[1]));
    } catch {
      // Ignore malformed third-party URLs collected from optional runtime requests.
    }
  }
  const mirroredMediaDir = path.join(ASSETS_DIR, 'static.wixstatic.com', 'media');
  if (fs.existsSync(mirroredMediaDir)) {
    for (const entry of fs.readdirSync(mirroredMediaDir, { withFileTypes: true })) {
      if (entry.name !== 'original-media') mediaNames.add(entry.name);
    }
  }
  for (const mediaName of mediaNames) {
    const outputPath = path.join(ASSETS_DIR, 'static.wixstatic.com', 'original-media', mediaName);
    if (fs.existsSync(outputPath)) continue;
    try {
      const response = await fetch(`https://static.wixstatic.com/media/${encodeURIComponent(mediaName)}`);
      if (!response.ok) continue;
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, Buffer.from(await response.arrayBuffer()));
    } catch {
      // A transformed variant can still serve when an original is unavailable.
    }
  }
}

function patchWorkerAssets() {
  const marker = '/* tsc-independent-worker */';
  const workerGuard = `${marker}\n(function () {
  var originalFetch = self.fetch.bind(self);
  var blocked = /(?:frog\\.wix\\.com|panorama\\.wixapps\\.net|sentry-next\\.wixpress\\.com|\\/assets\\/mirror\\/disabled-telemetry|\\/_api\\/)/i;
  var normalize = function (url) {
    try {
      var parsed = new URL(String(url || ""), self.location.origin);
      if (parsed.pathname !== "/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt" || !parsed.search) return url;
      var safe = function (value, fallback) { return String(value || fallback).replace(/[^a-zA-Z0-9._-]+/g, "_"); };
      var params = parsed.searchParams;
      var variant = [safe(params.get("module"), "module"), safe(params.get("pageId"), "page"), safe(params.get("formFactor") || params.get("deviceType"), "responsive"), safe(params.get("fileId"), "file")].join("--");
      return "/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt/" + variant + ".json";
    } catch (_) { return url; }
  };
  self.fetch = function (input, init) {
    var url = typeof input === "string" ? input : input && input.url;
    if (blocked.test(String(url))) return Promise.resolve(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    var normalized = normalize(url);
    if (typeof input === "string") input = normalized;
    else if (input && normalized !== url) input = new Request(normalized, input);
    return originalFetch(input, init);
  };
  try { Object.defineProperty(self.navigator, "sendBeacon", { value: function () { return true; } }); } catch (_) {}
})();\n`;
  const stack = [ASSETS_DIR];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(file);
      else if (/clientWorker\..*\.js$/i.test(entry.name)) {
        const body = fs.readFileSync(file, 'utf8');
        if (!body.startsWith(marker)) fs.writeFileSync(file, `${workerGuard}${rewriteAllUrls(body)}\n${workerGuard}`);
      }
    }
  }
}

function rewriteExistingTextAssets() {
  const textExtensions = new Set(['.js', '.css', '.json', '.svg', '.map', '.html']);
  const stack = [ASSETS_DIR];
  let changed = 0;
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(file);
      } else if (textExtensions.has(path.extname(entry.name).toLowerCase())) {
        const before = fs.readFileSync(file, 'utf8');
        const after = rewriteAllUrls(before);
        if (after !== before) {
          fs.writeFileSync(file, after);
          changed += 1;
        }
      }
    }
  }
  for (const route of routes) {
    const file = path.join(PUBLIC_DIR, route.file);
    if (!fs.existsSync(file)) continue;
    const before = fs.readFileSync(file, 'utf8');
    const after = injectStandaloneRuntime(injectDynamicSiteConfig(rewriteAllUrls(before)));
    if (after !== before) {
      fs.writeFileSync(file, after);
      changed += 1;
    }
  }
  console.log(`Rewrote ${changed} existing mirrored text assets.`);
}

async function main() {
  resetPublicDir();
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 });
  page.on('response', async response => {
    try {
      const request = response.request();
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      if (!response.ok() || !shouldStoreResponse(url, request.resourceType(), contentType)) return;
      const localPath = localAssetPath(url, contentType);
      const body = await response.buffer();
      resourceBodies.set(url, { body, contentType, localPath });
    } catch {
      // Some cross-origin or streaming responses cannot be buffered; skip them.
    }
  });

  for (const route of routes) {
    await captureRoute(page, route);
  }
  for (const viewport of [
    { width: 768, height: 1024, deviceScaleFactor: 1 },
    { width: 390, height: 844, deviceScaleFactor: 1 },
  ]) {
    await page.setViewport(viewport);
    for (const route of routes) {
      await loadAndExerciseRoute(page, route);
    }
  }
  await browser.close();

  for (const [url, resource] of resourceBodies.entries()) {
    const localPath = resource.localPath || localAssetPath(url, resource.contentType);
    const outputPath = path.join(PUBLIC_DIR, localPath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const isText = /javascript|css|json|svg|text/i.test(resource.contentType);
    const body = isText ? Buffer.from(rewriteAllUrls(resource.body.toString('utf8')), 'utf8') : resource.body;
    fs.writeFileSync(outputPath, body);
  }

  await ensureReferencedAssets();
  await ensureOriginalMediaAssets();
  patchWorkerAssets();

  writeSupportFiles();
  const favicon = [...resourceMap.values()].find(file => /\.(ico|png|svg)$/i.test(file));
  if (favicon) {
    const source = path.join(PUBLIC_DIR, favicon);
    if (fs.existsSync(source)) fs.copyFileSync(source, path.join(PUBLIC_DIR, 'favicon.ico'));
  } else {
    fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), '');
  }

  const manifest = {
    routes: routes.map(({ source, path, file }) => ({ source, path, file })),
    assets: resourceBodies.size,
    generatedAt: new Date().toISOString(),
    sourceRepo: 'https://github.com/AhmadIbrahiim/Website-downloader.git',
  };
  fs.writeFileSync(path.join(PUBLIC_DIR, 'mirror-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Mirrored ${routes.length} pages and ${resourceBodies.size} assets.`);
}

if (process.argv.includes('--rewrite-existing-assets')) {
  rewriteExistingTextAssets();
  ensureOriginalMediaAssets().catch(error => {
    console.error(error);
    process.exit(1);
  });
} else {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
