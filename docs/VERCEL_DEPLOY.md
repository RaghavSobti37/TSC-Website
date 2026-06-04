# Vercel deployment (theshakticollective.in)

## Symptoms

- GitHub `main` has your commit, but Vercel Deployments does not show it.
- Live site returns **404** for new routes (e.g. `/tscacademy/ambassador`).
- Navbar changes are missing on production.

## Root cause

The site is hosted on **Vercel** (`Server: Vercel` response header), but production is serving an **older deployment** than `origin/main`. The code builds successfully locally; the gap is **deploy pipeline**, not application code.

## Fix (choose one)

### A. Manual redeploy (fastest)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your TSC-Website project.
2. **Settings → Git**: confirm repository `RaghavSobti37/TSC-Website` and production branch **`main`**.
3. **Deployments** → **Redeploy** the latest deployment, or **Create Deployment** from branch `main` / commit `cf3a5b0` (or newer).
4. Wait until status is **Ready**.
5. Verify:
   - https://theshakticollective.in/api/deployment-status → `deployedSha` starts with `cf3a5b0`
   - https://theshakticollective.in/tscacademy/ambassador → loads (not 404)
   - Academy navbar shows **Become an Affiliate**

### B. Deploy Hook + GitHub Actions (prevents recurrence)

1. Vercel → Project → **Settings → Git → Deploy Hooks** → Create hook for **Production** branch `main`.
2. Copy the hook URL.
3. GitHub → `RaghavSobti37/TSC-Website` → **Settings → Secrets → Actions** → New secret:
   - Name: `VERCEL_DEPLOY_HOOK`
   - Value: paste hook URL
4. Push to `main` (or run workflow **Deploy Production (Vercel)** manually). The workflow `.github/workflows/deploy-production.yml` POSTs to the hook on every `main` push.

### C. Reconnect Git integration

If commits never appear under Vercel → Deployments:

1. Vercel → Project → **Settings → Git** → **Disconnect**, then reconnect `RaghavSobti37/TSC-Website`.
2. Confirm the Vercel GitHub App has access to this repository (GitHub → Settings → Applications → Vercel).
3. Enable **Automatically deploy** for production branch `main`.

## Verify deployment

```bash
curl -s https://theshakticollective.in/api/deployment-status
```

Expect `"ambassadorDeployed": true` and `"deployedSha"` matching your latest commit on `main`.
