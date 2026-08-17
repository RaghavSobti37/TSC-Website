'use strict';

// Shared runtime injections for the Wix mirror pipelines (core routes in
// mirror-wix-site.js and remaining pages in mirror-subpages.js).
//
// The baked-in viewer models in a mirrored page point at whatever origin the
// site was scraped from (wix-site-clone-psi.vercel.app). When the same HTML is
// served from a custom domain or localhost, wix-thunderbolt builds a
// cross-origin Worker URL for clientWorker.*.bundle.min.js, browsers refuse to
// construct it, the platform worker never boots, and widgets that depend on it
// (including Wix Forms) silently fail to initialize.
//
// The two functions below patch the viewer models at runtime so every page
// works from any origin; the fetch guard keeps the platform from leaking
// requests to Wix telemetry or blocked _api endpoints. Keeping them in one
// module prevents the two pipelines from drifting apart on this logic.

const essentialViewerModelPattern = /<script>window\.viewerModel = JSON\.parse\(document\.getElementById\('wix-essential-viewer-model'\)\.textContent\);?<\/script>/;

const essentialViewerBootstrap = [
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

function injectDynamicViewerModel(html) {
  return html.replace(essentialViewerModelPattern, essentialViewerBootstrap);
}

const siteConfigPatch = [
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

function injectDynamicSiteConfig(html) {
  if (html.includes('data-tsc-runtime-config')) return html;
  // Whitespace between attributes varies between scrape pipelines (some pages
  // have a line break before id="wix-viewer-model"), so match tolerantly.
  const pattern = /(<script type="application\/json"\s+id="wix-viewer-model">[\s\S]*?<\/script>)/;
  return html.replace(pattern, '$1\n' + siteConfigPatch);
}

// Patches fetch/XHR/Worker/img.src so the mirror keeps working from any origin:
// normalizes _partials and thunderbolt site-assets URLs to local mirror paths,
// and swallows requests to Wix telemetry / blocked _api endpoints.
const fetchGuardScript = `<script data-tsc-fetch-guard>
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

// Anchor matches the essential-viewer bootstrap whether it is the original
// single-line script or the multi-line bootstrap injected above.
const essentialBootstrapAnchor = /(<script>\s*window\.viewerModel = JSON\.parse\(document\.getElementById\('wix-essential-viewer-model'\)\.textContent\);?[\s\S]*?<\/script>)/;

function injectFetchGuardAfterViewerModel(html) {
  if (html.includes('data-tsc-fetch-guard')) return html;
  return html.replace(essentialBootstrapAnchor, '$1\n' + fetchGuardScript);
}

function injectFetchGuardIntoHead(html) {
  if (html.includes('data-tsc-fetch-guard')) return html;
  return html.replace(/<head([^>]*)>/i, `<head$1>\n${fetchGuardScript}`);
}

function standaloneRuntimeScript(routesJson) {
  return [
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
}

function injectStandaloneRuntime(html, routesJson) {
  const cleaned = html
    .replace(/<style data-tsc-standalone-runtime>[\s\S]*?<\/style>\s*/g, '')
    .replace(/<script data-tsc-standalone-runtime>[\s\S]*?<\/script>\s*/g, '');
  return cleaned.replace(/<head([^>]*)>/i, `<head$1>\n${standaloneRuntimeScript(routesJson)}`);
}

module.exports = {
  essentialViewerBootstrap,
  injectDynamicViewerModel,
  siteConfigPatch,
  injectDynamicSiteConfig,
  fetchGuardScript,
  injectFetchGuardAfterViewerModel,
  injectFetchGuardIntoHead,
  standaloneRuntimeScript,
  injectStandaloneRuntime,
};
