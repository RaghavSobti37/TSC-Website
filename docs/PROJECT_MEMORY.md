# TSC Website agent context

Production: **https://theshakticollective.in** (Vercel). CRM: **https://taskmaster-jfw0.onrender.com** (Render).

All `/api/*` form routes are thin proxies to Taskmaster webhooks — see `docs/INTEGRATION.md` and Taskmaster `docs/TSC_TASKMASTER_INTEGRATION.md`.

Shared forward layer: `lib/taskmasterWebhook.ts`.

Production requires all `TASKMASTER_*_WEBHOOK_URL` and matching `*_WEBHOOK_SECRET` env vars on Vercel (no hardcoded hosts in prod except public reviews fallback).

Legacy removed from API routes: Google Sheets, HolySheet, site AiSensy. `send-reminders` GitHub Action disabled.

Smoke: `node scripts/test-tsc-webhooks.mjs` (local) or hit production `/api/newsletter` etc. after deploy.
