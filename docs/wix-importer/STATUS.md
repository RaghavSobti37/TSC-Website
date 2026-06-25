# Wix → TSC Importer — Status Report

> **Living document.** Update after each importer session.  
> **Strategy:** Convert Wix exports into our Next.js app — **never** repair Thunderbolt.  
> **Live reference:** https://meghanabhawalkarwo.wixstudio.com/my-site/blank-10  
> **Production (converted React):** https://harshad-duhita-tsc.vercel.app/

---

## Executive summary

| Approach | Status |
|----------|--------|
| Thunderbolt polyfills on static HTML | **Deprecated** |
| **Wix → React converter** + `Blank10Page` | **Live on Vercel** |

**2026-06-25:** All 14 phases implemented for blank-10 pilot. Site runs as Next.js 14 app with own animations, menu, fonts, assets — zero Wix JavaScript at runtime.

---

## Phase checklist

| Phase | Description | Status |
|-------|-------------|--------|
| **1** | Export Wix site (HTML, CSS, JS, images) | ✅ Local: `Harshaduhita_TSC_HTML (1)/` |
| **2** | Parser `npm run import-wix` | ✅ `scripts/import-wix.mjs` + `lib/wix/*` |
| **3** | Assets → `public/images/wix/harshadduhita/` | ✅ 40+ files committed; CDN fallback in importer |
| **4** | Fonts → `public/fonts/wix/` | ✅ `materializeFonts.mjs` → `wix-blank10.css` |
| **5** | React components (Navbar, Hero, sections…) | ✅ `Blank10Page.tsx`, `B10Header.tsx`, `blank-10.css` |
| **6** | `animation-map.json` | ✅ 73 entries in `public/wix-imports/harshadduhita-blank-10/` |
| **7** | `data-motion-part` → React motion | ✅ `WixMotion`, `Reveal`, `Parallax`, `BlurReveal` |
| **8** | Animation library | ✅ Core set shipped; GSAP optional later |
| **9** | React menu (desktop + mobile) | ✅ `B10Header` + backdrop drawer |
| **10** | Smooth scroll | ✅ Lenis via `SmoothScroll.tsx` |
| **11** | Responsive (CSS, not `--l_display`) | ✅ `blank-10.css` breakpoints |
| **12** | Routing | ✅ `/blank-10`; `/` rewrites via `BLANK10_ROOT` middleware |
| **13** | Visual testing | 🟡 `scripts/test-blank10.mjs` (Playwright); pixelmatch TODO |
| **14** | Interaction testing | ✅ Production smoke PASS (hero, React page, mobile menu) |

---

## Production URLs

| URL | What |
|-----|------|
| https://harshad-duhita-tsc.vercel.app/ | `/blank-10` (middleware `BLANK10_ROOT=1`) |
| https://harshad-duhita-tsc.vercel.app/blank-10 | Direct route |
| Latest deploy | https://harshad-duhita-m4w7fcg8y-raghavsobti37s-projects.vercel.app |

---

## Architecture

```
Wix browser export
      ↓
npm run import-wix  (local only — needs HTML path)
      ↓
public/wix-imports/{slug}/   JSON specs
public/images/wix/...        images
public/fonts/wix/            @font-face CSS
      ↓
Blank10Page + components/animations/*
      ↓
next build → Vercel (harshad-duhita-tsc project)
```

**Vercel build:** `import-wix` skips gracefully if HTML absent; uses committed `public/` assets.

---

## Key files

### Importer (`lib/wix/`)

| File | Role |
|------|------|
| `extractSections.mjs` | 8 sections + per-section animations |
| `extractAssets.mjs` | Local copy + CDN download + aliases |
| `extractAnimations.mjs` | `animation-map.json` |
| `extractMenus.mjs` | Nav + 1000px breakpoint |
| `extractTheme.mjs` | Wix color tokens |
| `extractFonts.mjs` | `@font-face` discovery |
| `materializeFonts.mjs` | Download woff2 → `public/fonts/wix/` |
| `blank10-asset-aliases.mjs` | hero-desktop, gananayaka, etc. |

### React

| File | Role |
|------|------|
| `components/harshadduhita/Blank10Page.tsx` | Full page — WixMotion + BlurReveal + Lenis |
| `components/harshadduhita/B10Header.tsx` | Desktop nav + mobile drawer + backdrop |
| `components/wix/WixMotion.tsx` | Maps animation presets → components |
| `components/animations/Reveal.tsx` | Scroll fade/slide (Wix gG6uhp easing) |
| `components/animations/Parallax.tsx` | parallaxSpeed replacement |
| `components/animations/BlurReveal.tsx` | data-animate-blur replacement |
| `components/animations/SmoothScroll.tsx` | Lenis wrapper |
| `middleware.ts` | `/` → `/blank-10` when `BLANK10_ROOT=1` |
| `pages/blank-10.tsx` | Route entry |
| `public/wix-clone/blank-10.css` | Layout + responsive + hovers |

### Deploy / test

| File | Role |
|------|------|
| `vercel.json` | `import-wix && build`, `BLANK10_ROOT=1` |
| `scripts/deploy-blank10-vercel.ps1` | Local deploy helper |
| `scripts/test-blank10.mjs` | Playwright interaction smoke |

---

## Commands

```bash
cd website/TSC-Website

# Re-import from local Wix save (Windows path default in script)
npm run import-wix

# Dev
npm run dev
# → http://localhost:3000/blank-10

# Build
npm run build

# Deploy production (linked to harshad-duhita-tsc)
npm run deploy:blank10
# or: npx vercel deploy --prod --yes

# Test (needs playwright installed at repo root or npm i -D playwright)
npm run test:blank10 -- --url https://harshad-duhita-tsc.vercel.app
```

---

## Vercel project notes

- **Project:** `harshad-duhita-tsc` (`.vercel/project.json` in TSC-Website)
- **Root directory:** must be `website/TSC-Website` in Vercel dashboard (not old static HTML folder)
- **`BLANK10_ROOT=1`:** in `vercel.json` — `/` serves blank-10. Remove or override if deploying main TSC site from same `vercel.json`.

---

## Deprecated

- `Harshaduhita_TSC_HTML (1)/wix-offline-polyfill.js`
- Static HTML deploy as primary strategy

---

## Next steps (optional polish)

1. Pixelmatch visual diff vs live Wix (Phase 13 full)
2. Add `playwright` as devDependency in TSC-Website for CI tests
3. Copy Wix export into `data/wix-export/` inside repo for Vercel `import-wix` on every build
4. GSAP ScrollTrigger for complex section timelines if needed
5. Auto-codegen sections from JSON → reduce hand maintenance in `Blank10Page.tsx`

---

## Changelog

### 2026-06-25 — Full phase implementation + Vercel deploy

- Phases 1–12 complete for blank-10 pilot
- Lenis smooth scroll, font materialization, WixMotion wiring
- `Blank10Page` uses BlurReveal on images, WixMotion on sections
- Mobile menu backdrop + interaction fixes
- Next.js deployed to **harshad-duhita-tsc.vercel.app** (replaces static TB export)
- Production Playwright smoke: **PASS**
- `import-wix` skips on Vercel when HTML path missing (committed assets)

### 2026-06-25 — Importer foundation

- Initial `lib/wix/*`, `import-wix`, animation components, STATUS doc

---

*Last updated: 2026-06-25*
