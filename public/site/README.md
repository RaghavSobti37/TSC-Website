# TSC site map (human + AI)

Readable index of every public page. **Real HTML lives in `public/pages/*.html`.**
This tree co-locates metadata only — canonical URLs stay flat (`/mba`, `/about`, …).

## How serving works

1. `vercel.json` rewrites route → `/pages/<file>.html`
2. Local: `scripts/serve-mirror.js` loads `public/pages/routes.manifest.json`
3. Legacy cryptic paths (`/blank-*`, `/about-8*`, `/work0*`, …) → **301** to canonical
4. Optional nested aliases (`/work/mba`, `/films/kalki`, …) rewrite to same HTML

## Primary pages

- **Home** — [`home/`](./home/) → `/` (`pages/home.html`)
- **About** — [`about/`](./about/) → `/about` (`pages/about.html`)
- **Work** — [`work/`](./work/) → `/work` (`pages/work.html`)
- **TSC Artists** — [`artists/`](./artists/) → `/artists` (`pages/artists.html`)
- **Artist Path** — [`artists/artist-path/`](./artists/artist-path/) → `/artist-path` (`pages/artist-path.html`)
- **Films** — [`films/`](./films/) → `/films` (`pages/films.html`)
- **TSC Academy** — [`academy/`](./academy/) → `/academy` (`pages/academy.html`)
- **Learn With TSC** — [`academy/learn-with-tsc/`](./academy/learn-with-tsc/) → `/learn-with-tsc` (`pages/learn-with-tsc.html`)
- **Resources** — [`resources/`](./resources/) → `/resources` (`pages/resources.html`)

## All pages by section

### home

- [Home](./home/) — `/`

### about

- [About](./about/) — `/about`

### work

- [Work](./work/) — `/work`
- [MBA](./work/cases/mba/) — `/mba`

### artists

- [TSC Artists](./artists/) — `/artists`
- [Harshad Duhita](./artists/roster/harshad-duhita/) — `/harshad-duhita`
- [YUGM](./artists/roster/yugm/) — `/yugm`
- [Artist Path](./artists/artist-path/) — `/artist-path`

### films

- [Films](./films/) — `/films`
- [Mahavatar Narsimha](./films/cases/mahavatar-narsimha/) — `/mahavatar-narsimha`
- [Hanuman ansh](./films/cases/hanuman-ansh/) — `/hanuman-ansh`
- [Mahaprbhu](./films/cases/mahaprbhu/) — `/mahaprbhu`
- [Kalki](./films/cases/kalki/) — `/kalki`

### academy

- [TSC Academy](./academy/) — `/academy`
- [Roots of Hindustani Classical](./academy/courses/roots-of-hindustani-classical/) — `/roots-of-hindustani-classical`
- [The HeART of Composition](./academy/courses/the-heart-of-composition/) — `/the-heart-of-composition`
- [Learn With TSC](./academy/learn-with-tsc/) — `/learn-with-tsc`

### resources

- [Resources](./resources/) — `/resources`
- [Indian Culture Mainstream Forms](./resources/articles/from-bhajan-to-clubbing/) — `/from-bhajan-to-clubbing`
- [How I Curate Music With Independent Artists](./resources/articles/how-i-curate-music-with-independent-artists/) — `/how-i-curate-music-with-independent-artists`
- [You Released a Song. Now What?](./resources/articles/you-released-a-song-now-what/) — `/you-released-a-song-now-what`
- [Blog 1](./resources/articles/blog-1/) — `/blog-1`
- [Blog 2](./resources/articles/blog-2/) — `/blog-2`
- [Blog 3](./resources/articles/blog-3/) — `/blog-3`

### forms

- [Book A Call](./forms/book-a-call/) — `/book-a-call`
- [Book An Artist](./forms/book-an-artist/) — `/book-an-artist`
- [Artist Path Query](./forms/artist-query/) — `/artist-query`
- [Collab Q](./forms/collab-query/) — `/collab-query`
- [Masterclass Review 01](./forms/masterclass-review01/) — `/masterclass-review01`
- [Masterclass Review 02](./forms/masterclass-review02/) — `/masterclass-review02`
- [Classical Review](./forms/classicalreview/) — `/classicalreview`

See also: [`docs/SITE_STRUCTURE.md`](../../docs/SITE_STRUCTURE.md).

## LLM discovery

- [`/llms.txt`](../llms.txt) — curated index for AI agents ([llmstxt.org](https://llmstxt.org/))
- [`/llms-full.txt`](../llms-full.txt) — full Markdown corpus companion
- [`/about.md`](../about.md) — plain About page (prefer over Wix HTML)
- [`/sitemap.xml`](../sitemap.xml) — urlset of all canonical pages
- Each leaf folder has `README.md` (meta + copy) and `content.md` (copy only)
