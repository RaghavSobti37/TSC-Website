# Desktop Lock — FINAL

| Field | Value |
|-------|--------|
| **Status** | **LOCKED FINAL** |
| **Stamp** | `desktop-lock-final-2026-08-12` |
| **Viewport** | Desktop ≥ 1025px (verify at 1280×900) |
| **Reference** | [Wix Studio site](https://meghanabhawalkarwo.wixstudio.com/my-site) |
| **Date** | 2026-08-12 |

This stamp marks the clone-faithful **desktop** baseline as complete: layout, chrome, media crops, and Wix motion parity.

Machine-readable twin: [`../DESKTOP_LOCK.json`](../DESKTOP_LOCK.json). Cursor rule: [`.cursor/rules/desktop-lock.mdc`](../.cursor/rules/desktop-lock.mdc).

---

## What is locked

### Primary pages (permanent visual lock)

`/`, `/about`, `/work`, `/artists`, `/artist-path`, `/learn-with-tsc`, `/films`, `/resources`, `/academy`

Zero tolerance on desktop for fonts, colors, logo sizing, navbar redesign, layout/spacing, or **animation style** inventiveness. Match Wix clone only.

### Motion runtime (site-wide)

| Layer | File | Role |
|-------|------|------|
| Enter / loop unpause | `public/js/tsc-wix-motion.js` | Clears Thunderbolt “paused until done” on static mirror |
| Scrub / scroll / tilt | `public/js/tsc-wix-authored-motion.js` | Maps mirrored `thunderbolt-features` payloads → WAAPI |
| Motion CSS safety | `public/css/tsc-wix-motion.css` | End-state helpers; no invented keyframes |
| Media CDN crops | `scripts/serve-mirror.js` + `vercel.json` | Proxy `/assets/mirror/static.wixstatic.com/media/.../v1/...` to live Wix CDN |

Do **not** invent new timings. Use Wix named effects from mirrored features JSON only.

### Artist / course / film subpages

Same motion runtime. Authored payloads resolved via route map + `features_*` DOM discovery (`artifacts/route-payloads.generated.json`).

---

## Verification (evidence)

Commands (from repo root, with `node scripts/serve-mirror.js 3001`):

```bash
node artifacts/_verify-motion-all-pages.mjs   # expect failed:0
node artifacts/_spotcheck-motion-parity.mjs   # local paused:0 vs Wix
```

**Last green run (2026-08-12):**

- All mirrored routes: **45/45** `paused:0` — see `artifacts/motion-verify-all-local.json`
- Spot-check vs Wix: `/`, `/about`, `/yugm`, `/harshad-duhita`, `/films`, `/artist-path`, `/music-production` — local enter/loops running; authored scrub bound where payload has comps

Inactive slideshow `__item-*` slides may stay paused (Wix behavior).

---

## CSS ownership (desktop vs mobile)

| Layer | Where | Applies | Rule |
|-------|--------|---------|------|
| **Desktop (locked)** | Wix Thunderbolt CSS **inline** in `public/pages/*.html` (`<style data-url=…>` / standalone runtime) | ≥1025px (and baseline all viewports until mobile overrides) | Clone-faithful. Do not “polish.” |
| **Slim shared** | `public/css/tsc-responsive.css` | Shared chrome + intentional `@media (min-width: 1025px)` lock patches; mobile bands only inside `max-width: 1024px` | Keep slim. No new page `#comp-*` reflow here. |
| **Mobile owner (1:1)** | `public/css/mobile/<slug>.css` + `public/css/tsc-mobile-system.css` | **Only** via `media="(max-width: 1024px)"` — see `public/js/tsc-mobile-route-map.js` | One owner file per route slug. No desktop leak. |
| **Archive** | `public/css/pages/*.css` (primaries) | Not loaded for live ownership | Historical / offline reference only. Do not re-link for mobile. |

Route → file map: `public/js/tsc-mobile-route-map.js` (`SLUG_TO_CSS`, `MEDIA`).

Verify:

```bash
node artifacts/_verify-mobile-ownership.mjs
# expects server at http://127.0.0.1:3001 (or PORT); auto-starts serve-mirror if down
```

---

## Allowed after this lock

- Content / copy that does not change typography
- Footer link labels / hrefs (keep clone fonts/icons/per-page colors)
- Form wiring
- Owner-approved section hides (collapse-only)
- Mobile-only work inside `@media (max-width: 1024px)` / `public/css/mobile/<slug>.css`

## Forbidden without explicit owner ask

- Desktop visual “polish”
- New animation styles / timings not in Wix payloads
- `opacity: 1 !important` / `transform: none !important` / `animation: none !important` on motion comps
- Empty `{}` features JSON overwrites for pages that need scrub/enter data
- Breaking Wix CDN crop proxy for `static.wixstatic.com/media/.../v1/...`

---

## Agent checklist before desktop edits

1. Read this file + `.cursor/rules/desktop-lock.mdc`
2. Prefer mobile-scoped CSS/JS
3. After any desktop-touching change: verify 1280px + `node artifacts/_verify-motion-all-pages.mjs`
4. Do not raise this stamp unless owner re-opens the lock
