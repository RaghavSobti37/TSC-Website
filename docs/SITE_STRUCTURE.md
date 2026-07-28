# Site structure

> **DESKTOP DESIGN LOCK — PERMANENT.** The desktop design (viewport >= 1025px) of the 9 primary pages in
> `public/pages/` is locked forever to commit `faf9dea`. Never change desktop rendering unless the site owner
> explicitly and specifically asks. Mobile work only inside `@media (max-width: 1024px)`.

Human/AI-readable map of The Shakti Collective public site.

## Source of truth

| Layer | Path | Role |
|-------|------|------|
| Full HTML | `public/pages/*.html` | Real mirrored page payloads |
| Route shells | `public/**/index.html` | Pretty-route entry files that redirect/boot into `public/pages/*.html` |
| Route map | `public/pages/routes.manifest.json` | Canonical routes, aliases, `allRoutes` |
| Site index | `public/site/**` | Nested taxonomy + `meta.json` / README per page |
| CSS | `public/css/pages/*.css` | Per-page styles |
| Responsive CSS | `public/css/tsc-responsive.css` | Shared responsive/mobile overrides |
| Mobile CSS | `public/css/mobile/*` + `public/css/tsc-mobile-system.css` | Mobile design system (runtime-injected) |
| JS | `public/js/pages/*.animations.js` | Per-page animations |
| Runtime polish | `public/js/content-replacements.js` | Header/footer/mobile shells, card swaps, CTA repairs, page-specific fixes |
| Prod routes | `vercel.json` | Rewrites, redirects, headers, cache rules |
| Local routes | `scripts/serve-mirror.js` | Manifest-driven rewrites, telemetry stubs, Thunderbolt/media fallbacks |
| Build verification | `scripts/build.js` | Static output validation before deploy |

## Build + serve flow

1. `scripts/mirror-wix-site.js` mirrors Wix source into `public/`, rewrites assets, and removes external telemetry/runtime leaks.
2. `scripts/generate-subpage-shells.js` creates pretty-route shells under `public/**/index.html`.
3. `scripts/serve-mirror.js` serves `public/` locally and resolves canonical/alias routes from `public/pages/routes.manifest.json`.
4. `vercel.json` mirrors those rewrites in production and adds redirect/header policy.
5. `scripts/build.js` verifies required output, Thunderbolt bootstraps, mirrored videos, favicon wiring, and runtime payload completeness.

## Mobile CSS map

Runtime wire lives in `public/js/tsc-components.js` via `wireMobileAssets()` (loaded by every page animations script). No HTML patcher.

| Asset | Path |
|-------|------|
| Tokens | `public/css/mobile/_tokens.css` (`@import` from system) |
| System | `public/css/tsc-mobile-system.css` + `public/js/tsc-mobile-system.js` |
| Home | `public/css/mobile/home.css` -> `/` |
| About | `public/css/mobile/about.css` -> `/about` |
| Work | `public/css/mobile/work.css` -> `/work`, `/mba`, `/havells-myousic`, `/insta-music-league`, `/young-gunns` |
| Artists | `public/css/mobile/artists.css` -> `/artists`, roster, `/artist-path` |
| Learn | `public/css/mobile/learn.css` -> `/learn-with-tsc`, `/academy`, course pages, `/book-a-call`, review forms |
| Films | `public/css/mobile/films.css` -> `/films`, film cases |
| Resources | `public/css/mobile/resources.css` -> `/resources`, blogs/articles |

Also sets `body[data-page]` (`home` for `/`; learn/course pages -> `learn-with-tsc`) and injects `.tsc-sticky-cta` if missing.

## Canonical URL policy

Canonical paths stay flat, e.g. `/mba`, `/harshad-duhita`, `/book-a-call`.
`public/site/**` does not change public URLs; it indexes them.

Common aliases that resolve to the same full page:

- `/work/mba` -> `/mba`
- `/work/havells-myousic` -> `/havells-myousic`
- `/work/insta-music-league` -> `/insta-music-league`
- `/work/young-gunns` -> `/young-gunns`
- `/artists/harshad-duhita` -> `/harshad-duhita`
- `/artists/yugm` -> `/yugm`
- `/artists/artist-path` -> `/artist-path`
- `/films/mahavatar-narsimha` -> `/mahavatar-narsimha`
- `/films/hanuman-ansh` -> `/hanuman-ansh`
- `/films/mahaprbhu` -> `/mahaprbhu`
- `/films/kalki` -> `/kalki`
- `/academy/roots-of-hindustani-classical` -> `/roots-of-hindustani-classical`
- `/academy/the-heart-of-composition` -> `/the-heart-of-composition`
- `/academy/learn-with-tsc` -> `/learn-with-tsc`
- `/resources/from-bhajan-to-clubbing` -> `/from-bhajan-to-clubbing`
- `/resources/you-released-a-song-now-what` -> `/you-released-a-song-now-what`
- `/forms/book-a-call` -> `/book-a-call`
- `/forms/book-an-artist` -> `/book-an-artist`
- `/forms/artist-query` -> `/artist-query`

## Site tree

```text
public/site/
  README.md
  home/
  about/
  work/
    cases/mba/
  artists/
    roster/harshad-duhita/
    roster/yugm/
    artist-path/
  films/
    cases/mahavatar-narsimha/
    cases/hanuman-ansh/
    cases/mahaprbhu/
    cases/kalki/
  academy/
    courses/roots-of-hindustani-classical/
    courses/the-heart-of-composition/
    learn-with-tsc/
  resources/
    articles/...
  forms/
    book-a-call/
    book-an-artist/
    artist-query/
    collab-query/
    masterclass-review01/
    masterclass-review02/
    classicalreview/
```

Each indexed leaf has `README.md` + `meta.json` with `title`, `canonicalRoute`, `pageFile`, `css`, `js`, `section`, and `aliases`.

Some live routes exist in production output but are not yet indexed under `public/site/`: `/havells-myousic`, `/insta-music-league`, and `/young-gunns`.

## Full route table

| Canonical | Page file | Site index |
|-----------|-----------|------------|
| `/` | `pages/home.html` | `site/home/` |
| `/about` | `pages/about.html` | `site/about/` |
| `/work` | `pages/work.html` | `site/work/` |
| `/mba` | `pages/mba.html` | `site/work/cases/mba/` |
| `/havells-myousic` | `pages/havells-myousic.html` | not indexed in `public/site/` |
| `/insta-music-league` | `pages/insta-music-league.html` | not indexed in `public/site/` |
| `/young-gunns` | `pages/young-gunns.html` | not indexed in `public/site/` |
| `/artists` | `pages/artists.html` | `site/artists/` |
| `/harshad-duhita` | `pages/harshad-duhita.html` | `site/artists/roster/harshad-duhita/` |
| `/yugm` | `pages/yugm.html` | `site/artists/roster/yugm/` |
| `/artist-path` | `pages/artist-path.html` | `site/artists/artist-path/` |
| `/films` | `pages/films.html` | `site/films/` |
| `/mahavatar-narsimha` | `pages/mahavatar-narsimha.html` | `site/films/cases/mahavatar-narsimha/` |
| `/hanuman-ansh` | `pages/hanuman-ansh.html` | `site/films/cases/hanuman-ansh/` |
| `/mahaprbhu` | `pages/mahaprbhu.html` | `site/films/cases/mahaprbhu/` |
| `/kalki` | `pages/kalki.html` | `site/films/cases/kalki/` |
| `/academy` | `pages/academy.html` | `site/academy/` |
| `/roots-of-hindustani-classical` | `pages/roots-of-hindustani-classical.html` | `site/academy/courses/roots-of-hindustani-classical/` |
| `/the-heart-of-composition` | `pages/the-heart-of-composition.html` | `site/academy/courses/the-heart-of-composition/` |
| `/learn-with-tsc` | `pages/learn-with-tsc.html` | `site/academy/learn-with-tsc/` |
| `/resources` | `pages/resources.html` | `site/resources/` |
| `/from-bhajan-to-clubbing` | `pages/from-bhajan-to-clubbing.html` | `site/resources/articles/from-bhajan-to-clubbing/` |
| `/you-released-a-song-now-what` | `pages/you-released-a-song-now-what.html` | `site/resources/articles/you-released-a-song-now-what/` |
| `/blog-1` | `pages/blog-1.html` | `site/resources/articles/blog-1/` |
| `/blog-2` | `pages/blog-2.html` | `site/resources/articles/blog-2/` |
| `/blog-3` | `pages/blog-3.html` | `site/resources/articles/blog-3/` |
| `/book-a-call` | `pages/book-a-call.html` | `site/forms/book-a-call/` |
| `/book-an-artist` | `pages/book-an-artist.html` | `site/forms/book-an-artist/` |
| `/artist-query` | `pages/artist-query.html` | `site/forms/artist-query/` |
| `/collab-query` | `pages/collab-query.html` | `site/forms/collab-query/` |
| `/masterclass-review01` | `pages/masterclass-review01.html` | `site/forms/masterclass-review01/` |
| `/masterclass-review02` | `pages/masterclass-review02.html` | `site/forms/masterclass-review02/` |
| `/classicalreview` | `pages/classicalreview.html` | `site/forms/classicalreview/` |

## Shell examples

- `/about` -> `public/about/index.html` -> `/pages/about.html`
- `/work` -> `public/work/index.html` -> `/pages/work.html`
- `/artist-path` -> `public/artist-path/index.html` -> `/pages/artist-path.html`
- `/resources/you-released-a-song-now-what` -> `public/resources/you-released-a-song-now-what/index.html` -> `/pages/you-released-a-song-now-what.html`

Use `public/pages/*.html` when debugging full Wix payload/runtime.
Use route shells when debugging SEO, entry-path, or redirect behavior.

## Cryptic stubs removed

Physical folders matching `blank-*`, `about-8*`, `about-9*`, `work0*`, `work2*`, `work3*`, and `query/` were deleted.
Those paths now resolve via Vercel redirects, except `/query`, which stays a rewrite to `/book-an-artist`.

Named shells like `about/`, `work/`, and `films/` remain intentionally as lightweight canonical entry points.

## Regenerate

```bash
node scripts/restructure-site-tree.js
```

Do not reintroduce cryptic stubs via `generate-subpage-shells.js`; it intentionally skips them.
