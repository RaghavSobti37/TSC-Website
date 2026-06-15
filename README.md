# The Shakti Collective

<p align="center">
  <strong>Premium marketing site, artist profiles & booking funnels for TSC</strong><br/>
  Next.js · Tailwind CSS · Framer Motion · Taskmaster CRM webhooks
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.8-e85d26?style=flat-square" alt="Version 2.0.8" />
  <img src="https://img.shields.io/badge/next-14-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## Overview

Public site for [The Shakti Collective](https://theshakticollective.in): artist profiles, brand partnerships, academy courses, and conversion funnels.

| Route | Purpose |
| --- | --- |
| `/` | Marketing homepage |
| `/yugm` | YUGM band profile — hero, achievements, member cards, booking CTA |
| `/harshadduhita` | Harshaduhita Collective — EPK-driven profile, discography, booking CTA |
| `/links/yugm` | Link-in-bio hub for YUGM (query call, email, website, socials) |
| `/links/harshad-and-duhita` | Link-in-bio hub for Harshaduhita Collective |
| `/query` | **Artist Enquiry** — 3-step collaboration form (Google Sheets + Taskmaster task) |
| `/book-a-call` | **Academy Book a Call** — timezone-aware slot booking via Taskmaster CRM |
| `/tscacademy` | TSC Academy marketing hub — courses, mentors, initiatives |
| `/tscacademy/ambassador` | **Ambassador Program** — referral overview; CTAs link to Exly affiliate onboarding |

Book-a-call and all other form submissions proxy to the Taskmaster API on Render; IST conversion, rep assignment, WhatsApp, and Data Hub sync run in the CRM.

Ambassador registration opens [Exly affiliate onboarding](https://tscacademy.exlyapp.com/affiliate/onboarding/login) in a new tab (₹500 referral discount / ₹500 ambassador cashback).

## Key features

| Feature | Description |
| --- | --- |
| **Artist Enquiry** | 3-step form at `/query` → `POST /api/query` → Google Sheets (`Inqueries` tab) + Taskmaster webhook |
| **Book a Call** | 3-step flow: course → contact → slot; 1.5h buffer in the visitor's timezone |
| **CRM handoff** | `POST /api/book-call` → `POST /api/webhooks/book-call` on Taskmaster |
| **Artist pages** | Dedicated profiles (YUGM, Harshaduhita Collective) with link hubs under `/links/*` |
| **Academy Ambassador** | Landing page at `/tscacademy/ambassador`; navbar **Become an Affiliate** on all academy routes |
| **Newsletter & forms** | Additional API routes for sheets and lead capture |
| **SEO** | Sitemap, robots.txt, structured static pages |

## Artist Enquiry flow

1. Visitor completes the 3-step wizard at `/query` (contact → collaboration → logistics).
2. Frontend posts JSON to `/api/query`.
3. API forwards the payload to Taskmaster (`/api/webhooks/artist-enquiry`) to create a project task.
4. Success screen confirms receipt (Taskmaster errors logged server-side).

Entry points: header **Partner With Us**, brand CTA, artist pages (`/query?artist=YUGM`), and link hubs.

## Prerequisites

- Node.js 18+
- npm or yarn
- Vercel project linked to this repo (production: `theshakticollective.in`)

## Environment variables

Create `.env.local` for local dev (never commit). On **Vercel → Settings → Environment Variables**, set at least:

| Variable | Required | Example / notes |
| --- | --- | --- |
| `TASKMASTER_WEBHOOK_URL` | **Production** | `https://taskmaster-jfw0.onrender.com/api/webhooks/book-call` |
| `BOOK_CALL_WEBHOOK_SECRET` | **Production** | Same as Taskmaster `BOOK_CALL_WEBHOOK_SECRET` |
| `TASKMASTER_ARTIST_ENQUIRY_WEBHOOK_URL` | **Production** | `…/artist-enquiry` |
| `ARTIST_ENQUIRY_WEBHOOK_SECRET` | **Production** | `X-Webhook-Secret` header |
| `TASKMASTER_ARTIST_PATH_WEBHOOK_URL` | **Production** | `…/artist-path` |
| `ARTIST_PATH_WEBHOOK_SECRET` | **Production** | Shared with Render + Platform API |
| `TSC_API_URL` | **Production** | `https://api.theshakticollective.in/api` — Postgres via Platform API |
| `NEXT_PUBLIC_ARTIST_PATH_URL` | Optional | Program landing (`https://theartistpath.in`) |
| `TASKMASTER_NEWSLETTER_WEBHOOK_URL` | **Production** | `…/newsletter` |
| `NEWSLETTER_WEBHOOK_SECRET` | **Production** | Shared with Render |
| `TASKMASTER_MASTERCLASS_REVIEW_WEBHOOK_URL` | **Production** | `…/masterclass-review` |
| `MASTERCLASS_REVIEW_WEBHOOK_SECRET` | **Production** | Shared with Render |
| `TASKMASTER_BASE_URL` | Optional | Public reviews GET proxy base |

Full matrix: [docs/INTEGRATION.md](docs/INTEGRATION.md) and Taskmaster `docs/tsc-integration.env.example`.

**Remove from Vercel after cutover:** `GOOGLE_*`, `HOLYSHEET_*`, `AISENSY_*`, `SPREADSHEET_ID`.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Asset setup**
   - Hero/about videos: `public/hero-video.mp4`, `public/hero.mp4`
   - Artist media: `public/artists/<slug>/` (e.g. `public/artists/yugm/`, `public/artists/harshadduhita/`)

3. **Development server**
   ```bash
   npm run dev
   ```

## Project structure

```
pages/
├── tscacademy.tsx        # Academy homepage
├── tscacademy/
│   └── ambassador.tsx    # Ambassador program landing
├── yugm.tsx              # YUGM artist profile
├── harshadduhita.tsx     # Harshaduhita Collective artist profile
├── links/yugm.tsx        # YUGM link-in-bio hub
├── links/harshad-and-duhita.tsx  # Harshaduhita link-in-bio hub
├── query.tsx             # Artist enquiry wizard
├── book-a-call.tsx       # Academy call booking UI
└── api/
    ├── query.ts          # Enquiry → Taskmaster webhook
    ├── artist-path.ts    # Artist path → Taskmaster webhook
    ├── newsletter.ts     # Newsletter → Taskmaster webhook
    ├── reviews.ts        # Masterclass review 01 proxy
    └── reviews02.ts      # Masterclass review 02 proxy

lib/taskmasterWebhook.ts       # Shared forward layer
lib/forwardMasterclassReview.ts
lib/forwardArtistEnquiry.ts
docs/INTEGRATION.md
scripts/test-tsc-webhooks.mjs  # Local/prod proxy smoke
```

## Timezone logic (Book a Call)

When a user selects their country code:

1. Frontend applies a **1.5-hour buffer** in the user's local timezone.
2. Backend (Taskmaster CRM) recalibrates the slot to **IST**.
3. WhatsApp confirmations and CRM records are handled on Render.

## Technologies

- **Next.js 14** — React framework (Pages Router)
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Taskmaster CRM** — All form processing on Render
- **AiSensy** — WhatsApp on Taskmaster (book-call, artist-path)

## Deployment (Vercel)

Production: **theshakticollective.in** on Vercel. Pushes to `main` should auto-deploy; if Vercel does not show a new commit, see [docs/VERCEL_DEPLOY.md](docs/VERCEL_DEPLOY.md).

Check live commit: `GET /api/deployment-status` (returns `VERCEL_GIT_COMMIT_SHA` on Vercel).

Optional: add GitHub secret `VERCEL_DEPLOY_HOOK` so `.github/workflows/deploy-production.yml` triggers a deploy on every `main` push.

## SEO & Google Search Console

1. **Sitemap** — `/sitemap.xml` (static pages, artists, courses, insights)
2. **Robots.txt** — `/robots.txt` with sitemap link
3. **Verification** — Add Google site verification meta in `pages/_app.tsx` if needed

*Current version: 2.0.8*

## Changelog

### [2026-06-05] v2.0.8
- Added **Harshaduhita Collective** artist page at `/harshadduhita` with EPK content: hero, Who Are We (duo bios), milestones, live repertoire, discography, and booking contact.
- Removed legacy `/harshad-duhita` route; consolidated artist assets under `public/artists/harshadduhita/`; updated link hub and sitemap.
- Added `npm run audit:exposure` pre-commit exposure scan.

### [2026-06-04] v2.0.7
- Added **TSC Academy Ambassador Program** at `/tscacademy/ambassador` with hero, win-win-win overview, referral steps, and Exly registration CTAs.
- Academy navbar: **Become an Affiliate** (gradient pill → ambassador page) alongside **Main Website**.
- Responsive two-column “How It Works” section with Learn / Earn / Give back cards.

### [2026-06-01] v2.0.5
- Artist enquiry (`/api/query`) forwards to Taskmaster after Google Sheets append; email notifications removed.
- Added `lib/forwardArtistEnquiry.ts` with env-based webhook URL resolution.

### [2026-06-01] v2.0.4
- Refreshed **YUGM artist page** (`/yugm`): new hero/about imagery, member photo cards, unified contact email (`artist@theshakticollective.in`).
- Updated **YUGM link hub** (`/links/yugm`): new avatar, social links (Instagram, YouTube, Spotify), query-call CTA.
- Added artist assets under `public/artists/yugm/`.
- README expanded with artist enquiry flow, route map, and env var docs.

### [2026-06-01] v2.0.3
- Fixed production `book-call` API: no longer calls `localhost`; uses `TASKMASTER_WEBHOOK_URL` with default `taskmaster-jfw0.onrender.com`.
- Improved error responses when CRM sync fails.

### [2026-05-27] v2.0.2
- Migrated Book-A-Call backend processing to Taskmaster CRM Webhook.
- Centralized Google Sheets and AiSensy synchronization within CRM core.
