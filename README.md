# The Shakti Collective Static Site

> **DESKTOP LOCK — FINAL** · stamp `desktop-lock-final-2026-08-12` · [`DESKTOP_LOCK.json`](DESKTOP_LOCK.json) · [`docs/DESKTOP_LOCK_FINAL.md`](docs/DESKTOP_LOCK_FINAL.md)
>
> Desktop (≥1025px) for the 9 primaries (`/`, `/about`, `/work`, `/artists`, `/artist-path`, `/learn-with-tsc`, `/films`, `/resources`, `/academy`)
> is locked to the [Wix clone](https://meghanabhawalkarwo.wixstudio.com/my-site). **Zero tolerance** for fonts, colors, logo sizing, navbar redesign, layout, or invented animation styles.
> Site-wide Wix enter/loop/scrub motion is locked to mirrored Thunderbolt payloads (`tsc-wix-motion.js` + `tsc-wix-authored-motion.js`).
> Allowed only: content/copy, footer link labels/hrefs (keep clone fonts/icons/per-page colors), form wiring, and owner-approved section hides.
> Mobile work stays inside `@media (max-width: 1024px)`. Rule: `.cursor/rules/desktop-lock.mdc`.

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

## Newsletter pipeline

Footer newsletter forms are rendered by the shared component in `public/js/tsc-components.js` and submit to `api/newsletter.js`. The API forwards signups to Taskmaster at `TASKMASTER_NEWSLETTER_WEBHOOK_URL` or `/api/webhooks/newsletter` using `NEWSLETTER_WEBHOOK_SECRET`.

Newsletter destination collection: `newslettersubscribers` (`NewsletterSubscriber` model in Taskmaster). **No Google Sheets** in the submit path.

## Forms guide

Full form → API → Taskmaster destination map: [`docs/FORMS_GUIDE.md`](docs/FORMS_GUIDE.md).

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

## Desktop lock + motion verify

With the mirror server on port 3001:

```bash
node artifacts/_verify-motion-all-pages.mjs
node artifacts/_spotcheck-motion-parity.mjs
```

Expect `failed:0` / local `paused:0`. Evidence: `artifacts/motion-verify-all-local.json`.
