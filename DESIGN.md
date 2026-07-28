# The Shakti Collective Design System

> **DESKTOP DESIGN LOCK — PERMANENT.** The desktop design (viewport >= 1025px) of the 9 primary pages is locked
> forever to commit `faf9dea` and verified pixel-identical. Never change desktop layout, markup, styles, or copy
> unless the site owner explicitly and specifically requests a desktop change. Mobile/responsive improvements are
> allowed only inside `@media (max-width: 1024px)` or stylesheets linked with `media="(max-width: 1024px)"`.

## Design Direction

The website uses an editorial, culture-first visual language: warm, grounded, cinematic, and artist-led. The design should feel like a creative ecosystem rather than a SaaS dashboard or generic music landing page.

## Layout Principles

- Use immersive full-width sections with layered media, large type, and generous spacing.
- Preserve the existing single-page narrative rhythm: introduction, problem, artist journey, development stages, academy, work pillars, and contact/community.
- Keep navigation simple and direct: About, Work, Artists, Artist Path, Learn With TSC, Films, Resources, and TSC Academy.
- Avoid nested cards and overdecorated UI. Use section bands, text hierarchy, and media as the primary structure.

## Color Palette

| Token | Hex | Use |
| --- | --- | --- |
| Deep Teal | `#083D3A` | Primary brand depth, section backgrounds, theme color |
| Forest Teal | `#126D5E` | Secondary accents, active states, supporting fills |
| Warm Cream | `#FFECD1` | Primary background, soft panels, light text areas |
| Oxblood | `#3A1212` | Dramatic text, deep contrast, emotional emphasis |
| Terracotta | `#B74B02` | Warm accent, calls to action, highlight moments |
| Clay | `#B64D26` | Supporting accent and hover tone |
| Black | `#000000` | Core text and high-contrast UI |
| White | `#FFFFFF` | Reverse text and high-contrast surfaces |
| Muted Gray | `#757575` | Secondary copy and subtle UI text |
| Soft Blue Gray | `#CBDCE9` | Occasional atmospheric/supporting accent |

## Typography

Primary font families found in the site:

- `Signika`: expressive headings and strong display moments.
- `Madefor Text`: readable body and interface text.
- `Poppins`: supporting headings, labels, and clean UI text.
- `Helvetica Neue`, `Helvetica`, `Arial`, `sans-serif`: system fallbacks.
- Local bundled brand fonts: `wf_d08c6fe9ca9b47ccb21ecdcb7`, `wf_1615e2f9d1214a96a88382b24`, and related `wfont_*` aliases retained for visual continuity.

## Components

- Header: transparent-to-solid brand navigation with clear links.
- Hero: full-bleed local video background with brand mark and direct action links.
- CTA buttons: warm, high-contrast, short labels such as Learn Music, Build Stories, Collab with TSC, and Book an Artist.
- Journey sections: large narrative headings with concise explanatory copy.
- Footer/contact: social links, email, and community entry points.

## Motion And Media

- Hero video is local: `/assets/hero-bg.mp4`.
- Tiled section background is local: `/assets/section-tile-bg.png`.
- Motion should support atmosphere and identity. Avoid adding heavy decorative effects that compete with the artist narrative.

## Accessibility Notes

- Preserve visible focus styles.
- Maintain contrast between cream backgrounds and dark text.
- Keep button labels short and descriptive.
- Do not rely on color alone for navigation or calls to action.
