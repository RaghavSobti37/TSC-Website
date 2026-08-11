# TSC Website — Forms Guide

Where each public form submits, and where the data lands.

**Iron rule:** there is **no Google Sheets** pipeline for these forms. All production destinations are **CoreKnot / Taskmaster** (MongoDB collections via webhook routes on `https://taskmaster-jfw0.onrender.com`).

Local Taskmaster: `http://127.0.0.1:5000`.

---

## Quick map

| Form | Page route(s) | Client | Vercel API | Taskmaster webhook | Dest / notes |
|------|---------------|--------|------------|--------------------|--------------|
| Newsletter | All pages (footer) | `tsc-components.js` `bindNewsletterSubmit` | [`api/newsletter.js`](../api/newsletter.js) | `POST /api/webhooks/newsletter` | Collection `newslettersubscribers` (`NewsletterSubscriber`). Secret: `NEWSLETTER_WEBHOOK_SECRET`. |
| Book a Call | `/book-a-call` | `forms.js` → `bookCall` | [`api/book-call.js`](../api/book-call.js) | `POST /api/webhooks/book-call` | CRM lead. Secret: `BOOK_CALL_WEBHOOK_SECRET`. |
| Book an Artist | `/book-an-artist`, `/query` | `forms.js` → `bookArtist` | [`api/query.js`](../api/query.js) | `POST /api/webhooks/artist-enquiry` | CRM artist enquiry. Secret: `ARTIST_ENQUIRY_WEBHOOK_SECRET`. |
| Artist Path apply | `/artist-query` | `forms.js` → `artistPath` | [`api/artist-path.js`](../api/artist-path.js) | `POST /api/webhooks/artist-path` | Artist Path pipeline. |
| Collaborate With TSC | `/collab-query` | `forms.js` → `collabQuery` | [`api/leads.js`](../api/leads.js) | `POST /api/webhooks/contact-lead` | Contact / collab lead. Secret: `ARTIST_ENQUIRY_WEBHOOK_SECRET`. |
| Masterclass Review 01 | `/masterclass-review01` | `forms.js` → `review01` | [`api/reviews.js`](../api/reviews.js) | `POST /api/webhooks/masterclass-review` | Reviews store. |
| Masterclass Review 02 | `/masterclass-review02` | `forms.js` → `review02` | [`api/reviews02.js`](../api/reviews02.js) | same family | Reviews store. |
| Classical Review | `/classicalreview` | `forms.js` → `classicalReview` | [`api/reviews.js`](../api/reviews.js) | same family | Reviews store. |

Shared forwarder: [`api/_lib/taskmaster.cjs`](../api/_lib/taskmaster.cjs).

---

## Env vars (Vercel + local)

| Variable | Used by |
|----------|---------|
| `TASKMASTER_API_URL` / `TASKMASTER_BASE_URL` | Base host override |
| `TASKMASTER_NEWSLETTER_WEBHOOK_URL` | Newsletter (optional full URL) |
| `NEWSLETTER_WEBHOOK_SECRET` | Newsletter HMAC / secret header |
| `BOOK_CALL_WEBHOOK_SECRET` | Book a Call |
| `ARTIST_ENQUIRY_WEBHOOK_SECRET` | Book Artist + Collab / contact-lead |
| (artist-path / reviews secrets as configured in each API file) | Artist Path + reviews |

---

## Admin / CRM visibility

After webhook success, leads appear in CoreKnot (Taskmaster) CRM under the platform tenant **The Shakti Collective**:

- Artist enquiries / book-artist / collab → CRM leads (source tags include `tsc-website`)
- Newsletter → `newslettersubscribers` collection (not a CRM lead by default)
- Book a Call → CRM via book-call webhook

There is **no** linked Google Sheet in this repo’s submit path. If ops export to Sheets, that is outside this website codebase.

---

## Client wiring

- Form field defs: [`public/js/forms.js`](../public/js/forms.js)
- Submit + endpoints: [`public/js/tsc-components.js`](../public/js/tsc-components.js) (`formEndpoint`, `payloadForForm`, `bindLocalSubmit`)
- Footer newsletter markup + bind: same file (`mountDesktopFooter` / `mountMobileFooter`)

On failure the UI shows the API error string, or: `Form route missing. Please email artist@theshakticollective.in.`

## Local smoke notes

`npm run dev` (`scripts/serve-mirror.js`) serves static pages only — **`/api/*` returns 404** locally.

Handlers under `api/*.js` are Vercel serverless. Smoke them on a Vercel preview/prod deploy, or by `require()`-ing the handler with webhook secrets set.

Expected without secrets: `*_WEBHOOK_SECRET is not set` (route wiring OK; env missing).
