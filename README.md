# The Shakti Collective Static Site

> **DESKTOP DESIGN LOCK — PERMANENT.** The desktop design (viewport >= 1025px) of the 9 primary pages
> (`/`, `/about`, `/work`, `/artists`, `/artist-path`, `/learn-with-tsc`, `/films`, `/resources`, `/academy`)
> is locked forever to commit `faf9dea`. It was restored with `scripts/restore-faf9dea-desktop.js` and verified
> pixel-identical against that commit. Do **not** change desktop markup, styles, copy, or behavior of these pages
> unless the site owner explicitly and specifically asks for a desktop design change. All responsive/mobile work
> must live exclusively inside `@media (max-width: 1024px)` blocks or stylesheets linked with
> `media="(max-width: 1024px)"`.

Static mirror + cleaned local runtime for The Shakti Collective website.

## What this repo ships

- Full mirrored page payloads in `public/pages/*.html`
- Pretty-route shell files like `public/about/index.html` and `public/work/index.html`
- Local runtime assets in `public/js`, `public/css`, and `public/assets`
- Build/verification scripts for Vercel-ready static deploys

## Local workflow

```bash
npm install
npm run dev
```

`npm run dev` starts `scripts/serve-mirror.js`, serves `public/`, and resolves clean routes from `public/pages/routes.manifest.json`.

## Build

```bash
npm run build
```

Build pipeline:

1. `scripts/generate-subpage-shells.js`
2. `scripts/repair-runtime-assets.js`
3. `scripts/generate-page-asset-manifests.js`
4. `scripts/build.js`
5. `scripts/optimize-assets.js`

`scripts/build.js` is also guardrail step. It verifies required static output, dynamic Thunderbolt bootstrap, local favicon wiring, mirrored video renditions, worker patches, and per-page runtime payload coverage before deploy.

## Key runtime pieces

- `scripts/mirror-wix-site.js` mirrors Wix source into local `public/` output, rewrites asset URLs, removes Wix telemetry/Sentry hooks, and normalizes clean routes.
- `scripts/serve-mirror.js` handles local route rewrites, disabled telemetry endpoints, Thunderbolt JSON variants, and media fallbacks.
- `public/js/content-replacements.js` applies post-hydration page polish: brand-aware favicons/logos, mobile header/footer, mobile work + films shells, course mobile cards, Resources blog cards, CTA repairs, and artist-page fixes.
- `vercel.json` is source of truth for production rewrites, legacy redirects, security headers, and cache policy for mirrored assets.

## Route model

- Canonical public routes stay flat: `/about`, `/mba`, `/kalki`, `/book-a-call`
- Full page payloads live in `public/pages/*.html`
- Pretty route folders are lightweight entry shells that redirect to matching `/pages/*.html`
- Route manifest lives in `public/pages/routes.manifest.json`

## Useful scripts

- `npm run dev` - local static server
- `npm run build` - generate + verify deployable output
- `npm run mirror:subpages` - refresh mirrored subpages and runtime manifests
- `npm run repair:assets` - rewrite existing mirrored assets
- `npm run audit:production` - production audit
- `npm run audit:original` - compare against original Wix source
- `npm run audit:interactions` - interaction checks
- `npm run audit:navigation` - navigation checks
