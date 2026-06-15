# TSC ↔ Taskmaster integration

TSC form routes are thin proxies to Taskmaster webhooks. No Google Sheets, HolySheet, or site-side AiSensy after cutover.

**Full contract (URLs, auth, payloads, deploy order):** [Taskmaster docs/TSC_TASKMASTER_INTEGRATION.md](https://github.com/RaghavSobti37/Taskmaster/blob/main/docs/TSC_TASKMASTER_INTEGRATION.md)

## Vercel env (quick reference)

| Variable | Purpose |
|----------|---------|
| `TASKMASTER_WEBHOOK_URL` | Book-call webhook |
| `TASKMASTER_ARTIST_ENQUIRY_WEBHOOK_URL` | Query/enquiry |
| `TASKMASTER_ARTIST_PATH_WEBHOOK_URL` | Artist path (CoreKnot legacy webhook) |
| `TSC_API_URL` | Platform API — Postgres storage for CoreKnot admin |
| `NEXT_PUBLIC_ARTIST_PATH_URL` | Program landing (`theartistpath.in`) |
| `TASKMASTER_NEWSLETTER_WEBHOOK_URL` | Footer newsletter |
| `TASKMASTER_MASTERCLASS_REVIEW_WEBHOOK_URL` | Review POST ingest |
| `*_WEBHOOK_SECRET` | Same values as Render (5 secrets) |

Copy from Taskmaster `docs/tsc-integration.env.example`.

## Local smoke

```bash
# Terminal 1 — Taskmaster :5000
# Terminal 2 — TSC :3000
node scripts/test-tsc-webhooks.mjs
```

Shared forward layer: `lib/taskmasterWebhook.ts`
