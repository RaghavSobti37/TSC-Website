'use strict';

// Brings already-mirrored subpage HTML files up to the current runtime
// pipeline without re-scraping the live Wix site. Applies the same injections
// that scripts/mirror-subpages.js now bakes in at mirror time:
//   1. dynamic essential-viewer-model bootstrap (origin-aware)
//   2. fetch/XHR/Worker guard
//   3. data-tsc-runtime-config site-config patch (origin-aware, path rewrite)
//   4. accessTokensUrl pointed at the local mirror copy
// The patch functions are idempotent, so re-running is safe.
//
// Usage: node scripts/patch-subpage-runtime.cjs [page-slug ...]
// (defaults to the four form pages: artist-query book-a-call book-an-artist collab-query)

const fs = require('fs');
const path = require('path');
const shared = require('./mirror-shared.cjs');

const pagesDir = path.join(__dirname, '..', 'public', 'pages');
const targets = process.argv.length > 2
  ? process.argv.slice(2)
  : ['artist-query', 'book-a-call', 'book-an-artist', 'collab-query'];

// Build "\/assets\/mirror\/..." without writing a single backslash escape.
const slash = String.fromCharCode(92);
const escapeSlashes = value => value.split('/').join(slash + '/');
const accessTokensReplacement = escapeSlashes('/assets/mirror/meghanabhawalkarwo.wixstudio.com/my-site/_api/v1/access-tokens.json');

function fixAccessTokensUrl(html) {
  const marker = '"accessTokensUrl":"';
  let out = html;
  let idx = 0;
  let count = 0;
  while ((idx = out.indexOf(marker, idx)) !== -1) {
    const valueStart = idx + marker.length;
    const end = out.indexOf('"', valueStart);
    if (end === -1) break;
    out = out.slice(0, valueStart) + accessTokensReplacement + out.slice(end);
    idx = valueStart + accessTokensReplacement.length;
    count += 1;
  }
  return { html: out, count };
}

for (const slug of targets) {
  const file = path.join(pagesDir, `${slug}.html`);
  if (!fs.existsSync(file)) {
    console.error(`SKIP ${slug}: ${file} does not exist`);
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  const steps = {};

  const beforeBootstrap = html;
  html = shared.injectDynamicViewerModel(html);
  steps.viewerModel = html !== beforeBootstrap;

  const beforeGuard = html;
  html = shared.injectFetchGuardAfterViewerModel(html);
  steps.fetchGuard = html !== beforeGuard;

  const beforeConfig = html;
  html = shared.injectDynamicSiteConfig(html);
  steps.siteConfig = html !== beforeConfig;

  const fixed = fixAccessTokensUrl(html);
  html = fixed.html;

  fs.writeFileSync(file, html);
  console.log(
    `${slug}: viewerModel=${steps.viewerModel} fetchGuard=${steps.fetchGuard} siteConfig=${steps.siteConfig} accessTokensUrl=${fixed.count}`
  );
}
