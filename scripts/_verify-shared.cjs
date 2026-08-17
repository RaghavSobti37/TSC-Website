'use strict';

const fs = require('fs');
const { execSync } = require('child_process');
const shared = require('./mirror-shared.cjs');

function assert(cond, label) {
  if (!cond) {
    console.error('FAIL:', label);
    process.exit(1);
  }
  console.log('OK:', label);
}

// 1. fetchGuardScript parses as valid JS
new Function(shared.fetchGuardScript.replace(/^<script[^>]*>/, '').replace(/<\/script>\s*$/, ''));
assert(true, 'fetchGuardScript parses');

// 2. standaloneRuntimeScript parses for a sample route list
const routesJson = JSON.stringify(['/', '/about', '/book-a-call']);
const runtime = shared.standaloneRuntimeScript(routesJson);
const runtimeJs = runtime.replace(/[\s\S]*<script[^>]*>/, '').replace(/<\/script>\s*$/, '');
new Function(runtimeJs);
assert(true, 'standaloneRuntimeScript parses');

// 3. fetchGuardScript matches the original mirrorFetchPatchScript from git HEAD
const orig = execSync('git show HEAD:scripts/mirror-subpages.js', { encoding: 'utf8' });
const start = orig.indexOf('const mirrorFetchPatchScript = `');
const end = orig.indexOf('`;', start);
const origTemplate = orig.slice(start + 'const mirrorFetchPatchScript = `'.length, end);
const origValue = eval('`' + origTemplate + '`'); // eslint-disable-line no-eval
const guardValue = shared.fetchGuardScript;
assert(
  guardValue === origValue,
  `fetchGuardScript === original (orig ${origValue.length} chars, shared ${guardValue.length} chars)`
);

// 4. essentialViewerBootstrap matches original injectDynamicViewerModel output shape
const origHtml =
  '<script>window.viewerModel = JSON.parse(document.getElementById(\'wix-essential-viewer-model\').textContent)</script>';
const patched = shared.injectDynamicViewerModel(origHtml);
assert(patched.includes('model.site.externalBaseUrl = origin;'), 'injectDynamicViewerModel produces bootstrap');

// 5. injectDynamicSiteConfig handles multi-line attribute form (subpage scrape format)
const siteConfigHtml =
  '<script type="application/json"\n    id="wix-viewer-model">{}</script>\n<script>window.viewerModel = JSON.parse(document.getElementById(\'wix-viewer-model\').textContent)</script>';
const patched2 = shared.injectDynamicSiteConfig(siteConfigHtml);
assert(patched2.includes('data-tsc-runtime-config'), 'injectDynamicSiteConfig matches multi-line script tag');

console.log('ALL SHARED MODULE CHECKS PASSED');
