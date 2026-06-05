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

Book-a-call bookings are proxied to the Taskmaster API on Render; IST conversion, rep assignment, WhatsApp, and Google Sheets sync run in the CRM.

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
3. API timestamps in IST, appends a row to the **Inqueries** Google Sheet, then forwards the payload to Taskmaster (`/api/webhooks/artist-enquiry`) to create a project task.
4. Success screen confirms receipt even if Taskmaster forward fails (errors logged server-side).

Entry points: header **Partner With Us**, brand CTA, artist pages (`/query?artist=YUGM`), and link hubs.

## Prerequisites

- Node.js 18+
- npm or yarn
- Vercel project linked to this repo (production: `theshakticollective.in`)

## Environment variables

Create `.env.local` for local dev (never commit). On **Vercel → Settings → Environment Variables**, set at least:

| Variable | Required | Example / notes |
| --- | --- | --- |
| `TASKMASTER_WEBHOOK_URL` | **Production (book-call)** | `https://taskmaster-jfw0.onrender.com/api/webhooks/book-call` |
| `BOOK_CALL_WEBHOOK_SECRET` | **Production (book-call)** | Same value as Taskmaster `BOOK_CALL_WEBHOOK_SECRET` |
| `CRM_WEBHOOK_URL` | Optional alias | Same value as above |
| `TASKMASTER_ARTIST_ENQUIRY_WEBHOOK_URL` | **Artist enquiry** | Default derived from `TASKMASTER_WEBHOOK_URL` or prod `…/artist-enquiry` |
| `ARTIST_ENQUIRY_WEBHOOK_SECRET` | Optional | Shared secret → `X-Webhook-Secret` header |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | **Artist enquiry** | Service account with Sheets access |
| `GOOGLE_PRIVATE_KEY` | **Artist enquiry / legacy** | PEM for the service account |
| `SPREADSHEET_ID` | Legacy routes only | Google Sheet ID if using local sheet APIs |
| `AISENSY_API_KEY` | Legacy routes only | Prefer CRM-side keys on Render |

Default production webhook URL (if env unset): `https://taskmaster-jfw0.onrender.com/api/webhooks/book-call`.

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
    ├── query.ts          # Enquiry → Sheets + Taskmaster webhook
    ├── book-call.ts      # Booking → Taskmaster webhook
    └── check-reminders.ts

public/artists/yugm/           # YUGM photos (hero, about, member cards)
public/artists/harshadduhita/  # Harshaduhita hero, portraits, live shots
components/sections/academy/
├── AmbassadorProgram.tsx    # Ambassador page sections
└── …
lib/forwardArtistEnquiry.ts  # Taskmaster artist-enquiry webhook helper
.github/workflows/        # send-reminders.yml (legacy cron)
docs/BOOKING_SYSTEM.md    # Book-a-call architecture notes
```

## Timezone logic (Book a Call)

When a user selects their country code:

1. Frontend applies a **1.5-hour buffer** in the user's local timezone.
2. Backend (Taskmaster CRM) recalibrates the slot to **IST**.
3. Spreadsheet entries and WhatsApp reminders stay in IST for the ops team.

## Technologies

- **Next.js 14** — React framework (Pages Router)
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Google Sheets API** — Artist enquiry CRM + legacy routes
- **Taskmaster CRM** — Artist enquiry tasks via webhook
- **Taskmaster CRM** — Book-a-call processing on Render
- **AiSensy** — WhatsApp automation (CRM-side)
- **GitHub Actions** — Scheduled reminders (legacy)

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
- Permanent redirect from legacy `/harshad-duhita` → `/harshadduhita` (`next.config.js`).
- Consolidated artist assets under `public/artists/harshadduhita/`; updated link hub and sitemap.
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
