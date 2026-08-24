# TSC site map (human + AI)

Readable index of every canonical public page. Real HTML lives in `public/pages/*.html`; this tree stores metadata and plain content for agents.

## Agent files

- [`/agent-design.md`](../agent-design.md) - design rules and page map
- [`/agent-content.md`](../agent-content.md) - compressed site copy and route index
- [`/llms.txt`](../llms.txt) - curated AI discovery index
- [`/llms-full.txt`](../llms-full.txt) - full AI-readable corpus
- [`/sitemap.xml`](../sitemap.xml) - canonical URL set

## Serving

1. `vercel.json` rewrites canonical route to `/pages/<file>.html`.
2. Legacy Wix aliases redirect or rewrite to canonical routes.
3. Each page folder has `meta.json`, `README.md`, and `content.md`.

## Pages

### home

- [Home](./home/) - `/` -> `pages/home.html`

### about

- [About](./about/) - `/about` -> `pages/about.html`

### work

- [Work](./work/) - `/work` -> `pages/work.html`
- [MBA](./work/cases/mba/) - `/mba` -> `pages/mba.html`
- [Havells mYOUsic](./work/cases/havells-myousic/) - `/havells-myousic` -> `pages/havells-myousic.html`
- [Insta Music League](./work/cases/insta-music-league/) - `/insta-music-league` -> `pages/insta-music-league.html`
- [The Young Gunns](./work/cases/young-gunns/) - `/young-gunns` -> `pages/young-gunns.html`

### artists

- [TSC Artists](./artists/) - `/artists` -> `pages/artists.html`
- [Artist Path](./artists/artist-path/) - `/artist-path` -> `pages/artist-path.html`
- [Harshad Duhita](./artists/roster/harshad-duhita/) - `/harshad-duhita` -> `pages/harshad-duhita.html`
- [Mohit Shankar](./artists/roster/mohit-shankar/) - `/mohit-shankar` -> `pages/mohit-shankar.html`
- [YUGM](./artists/roster/yugm/) - `/yugm` -> `pages/yugm.html`

### films

- [Films](./films/) - `/films` -> `pages/films.html`
- [Mahaprbhu](./films/cases/mahaprbhu/) - `/mahaprbhu` -> `pages/mahaprbhu.html`
- [Mahavatar Narsimha](./films/cases/mahavatar-narsimha/) - `/mahavatar-narsimha` -> `pages/mahavatar-narsimha.html`
- [Hanuman ansh](./films/cases/hanuman-ansh/) - `/hanuman-ansh` -> `pages/hanuman-ansh.html`
- [Mahavatar Narsimha Impact Report](./films/impact/mahavatar-narsimha-impact/) - `/mahavatar-narsimha-impact` -> `pages/mahavatar-narsimha-impact.html`
- [Hanuman Ansh Impact Report](./films/impact/hanuman-ansh-impact/) - `/hanuman-ansh-impact` -> `pages/hanuman-ansh-impact.html`
- [Mahaprabhu Jagannath Impact Report](./films/impact/mahaprabhu-jagannath-impact/) - `/mahaprabhu-jagannath-impact` -> `pages/mahaprabhu-jagannath-impact.html`
- [Kalki Impact Report](./films/impact/kalki-impact/) - `/kalki-impact` -> `pages/kalki-impact.html`
- [Kalki](./films/cases/kalki/) - `/kalki` -> `pages/kalki.html`

### resources

- [Resources](./resources/) - `/resources` -> `pages/resources.html`
- [How Do I Start Making Music If I Have No Experience?](./resources/articles/start-making-music/) - `/start-making-music` -> `pages/start-making-music.html`
- [The Artist Release Playbook](./resources/articles/artist-release-playbook/) - `/artist-release-playbook` -> `pages/artist-release-playbook.html`
- [Is an Online Music Course Worth It for Beginners?](./resources/articles/online-music-course-worth-it/) - `/online-music-course-worth-it` -> `pages/online-music-course-worth-it.html`
- [Indian Culture Mainstream Forms](./resources/articles/from-bhajan-to-clubbing/) - `/from-bhajan-to-clubbing` -> `pages/from-bhajan-to-clubbing.html`
- [You Released a Song. Now What?](./resources/articles/you-released-a-song-now-what/) - `/you-released-a-song-now-what` -> `pages/you-released-a-song-now-what.html`
- [How I Curate Music With Independent Artists](./resources/articles/how-i-curate-music-with-independent-artists/) - `/how-i-curate-music-with-independent-artists` -> `pages/how-i-curate-music-with-independent-artists.html`
- [Apply for Affiliate Program](./resources/affiliate-apply/) - `/affiliate-apply` -> `pages/affiliate-apply.html`

### academy

- [TSC Academy](./academy/) - `/academy` -> `pages/academy.html`
- [Roots of Hindustani Classical](./academy/courses/roots-of-hindustani-classical/) - `/roots-of-hindustani-classical` -> `pages/roots-of-hindustani-classical.html`
- [The HeART of Composition](./academy/courses/the-heart-of-composition/) - `/the-heart-of-composition` -> `pages/the-heart-of-composition.html`
- [A-Z of Music Production](./academy/courses/music-production/) - `/music-production` -> `pages/music-production.html`
- [All Courses Bundle](./academy/courses/course-bundle/) - `/course-bundle` -> `pages/course-bundle.html`

### forms

- [Collab Q](./forms/collab-query/) - `/collab-query` -> `pages/collab-query.html`
- [Book An Artist](./forms/book-an-artist/) - `/book-an-artist` -> `pages/book-an-artist.html`
- [Artist Path Query](./forms/artist-query/) - `/artist-query` -> `pages/artist-query.html`
- [Book A Call](./forms/book-a-call/) - `/book-a-call` -> `pages/book-a-call.html`
- [Masterclass Review 01](./forms/masterclass-review01/) - `/masterclass-review01` -> `pages/masterclass-review01.html`
- [Classical Review](./forms/classicalreview/) - `/classicalreview` -> `pages/classicalreview.html`
- [Masterclass Review 02](./forms/masterclass-review02/) - `/masterclass-review02` -> `pages/masterclass-review02.html`
- [Affiliate Program](./forms/affiliate/) - `/affiliate` -> `pages/affiliate.html`
