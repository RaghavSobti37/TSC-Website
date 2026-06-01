# The Shakti Collective

<p align="center">
  <strong>Premium marketing site & booking funnel for TSC Academy</strong><br/>
  Next.js · Tailwind CSS · Framer Motion · Taskmaster CRM webhooks
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.3-e85d26?style=flat-square" alt="Version 2.0.3" />
  <img src="https://img.shields.io/badge/next-14-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## Overview

Public site for [The Shakti Collective](https://theshakticollective.in): courses, artists, resources, and the **[Book a Call](https://theshakticollective.in/book-a-call)** funnel. Bookings are proxied to the Taskmaster API on Render; heavy lifting (IST conversion, rep assignment, WhatsApp, Google Sheets) runs in the CRM.

## Key features

| Feature | Description |
| --- | --- |
| **Book a Call** | 3-step flow: course → contact → slot; 1.5h buffer in the visitor's timezone |
| **CRM handoff** | `POST /api/book-call` → `POST /api/webhooks/book-call` on Taskmaster |
| **Newsletter & forms** | Additional API routes for sheets and lead capture |
| **SEO** | Sitemap, robots.txt, structured static pages |

## Prerequisites

- Node.js 18+
- npm or yarn
- Vercel project linked to this repo (production: `theshakticollective.in`)

## Environment variables

Create `.env.local` for local dev. On **Vercel → Settings → Environment Variables**, set at least:

| Variable | Required | Example / notes |
| --- | --- | --- |
| `TASKMASTER_WEBHOOK_URL` | **Production** | `https://taskmaster-jfw0.onrender.com/api/webhooks/book-call` |
| `CRM_WEBHOOK_URL` | Optional alias | Same value as above |
| `SPREADSHEET_ID` | Legacy routes only | Google Sheet ID if using local sheet APIs |
| `AISENSY_API_KEY` | Legacy routes only | Prefer CRM-side keys on Render |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Optional | For routes that still write to Sheets from this app |
| `GOOGLE_PRIVATE_KEY` | Optional | PEM for the service account |

Default production webhook URL (if env unset): `https://taskmaster-jfw0.onrender.com/api/webhooks/book-call`.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Asset Setup**:
   Place your video assets in the `public/` directory:
   - `hero-video.mp4` (Hero Section)
   - `hero.mp4` (About Section)

3. **Development Server**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `pages/api/`: 
  - `book-call.ts`: Handles data entry to Google Sheets and sends WhatsApp confirmations.
  - `check-reminders.ts`: Cron-ready API that processes upcoming reminders (IST recalibrated).
- `.github/workflows/`:
  - `send-reminders.yml`: GitHub Action that triggers the reminder API every 10 minutes.
- `pages/book-a-call.tsx`: Timezone-aware frontend booking interface.

## 🌐 Timezone Logic

The system is designed for a global audience. When a user selects their country code:
1. The frontend calculates the 1.5-hour buffer relative to the **user's local time**.
2. The backend recalibrates the chosen slot to **Indian Standard Time (IST)**.
3. All spreadsheet entries and automated reminders are synchronized to IST to ensure the team never misses a call.

## ⚙️ Technologies Used

- **Next.js** - React Framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Google Sheets API** - CRM Integration
- **AiSensy API** - WhatsApp Automation
- **GitHub Actions** - Scheduled Reminders

## 🔍 SEO & Google Search Console

To ensure optimal indexing, visibility, and search performance:
1. **Sitemap**: Configured and aligned at `/sitemap.xml` (contains all core static pages, dynamic artist pages, courses, masterclasses, and insights). Old defunct routes have been removed.
2. **Robots.txt**: Served at `/robots.txt`, allowing crawler access for search bots (including AI search engines like OAI-SearchBot and PerplexityBot) and specifying the sitemap link.
3. **Verification**: If site ownership re-verification is required via meta tag, add `<meta name="google-site-verification" content="YOUR_TOKEN" />` within the `<Head>` component of `pages/_app.tsx`.

*Current version: 2.0.3*

## Changelog

### [2026-06-01] v2.0.3
- Fixed production `book-call` API: no longer calls `localhost`; uses `TASKMASTER_WEBHOOK_URL` with default `taskmaster-jfw0.onrender.com`.
- Improved error responses when CRM sync fails.

### [2026-05-27] v2.0.2
- Migrated Book-A-Call backend processing to Taskmaster CRM Webhook.
- Centralized Google Sheets and AiSensy synchronization within CRM core.
