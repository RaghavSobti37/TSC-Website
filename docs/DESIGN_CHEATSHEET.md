# TSC Design Reference - Quick Cheat Sheet

## One-Liner Commands

```bash
cd c:\Users\ragha\OneDrive\Desktop\TSC-Website

# Glasmorphic navbar (matches your current nav)
bash design-reference.sh tsc-glassmorphic

# Wave button animations (your interactive buttons)
bash design-reference.sh tsc-waves

# Artist platform best practices
bash design-reference.sh tsc-artist

# Dark cinema theme (hero section)
bash design-reference.sh tsc-dark

# Premium typography for your brand
bash design-reference.sh tsc-typography
```

## Search by Domain (Examples)

```bash
# UI Styles
bash design-reference.sh style "soft ui minimalism"
bash design-reference.sh style "dark elegant premium"

# Colors
bash design-reference.sh color "luxury dark creative"
bash design-reference.sh color "cinema film aesthetic"

# Typography
bash design-reference.sh typography "editorial serif elegant"
bash design-reference.sh typography "modern sans-serif tech"

# Landing Pages
bash design-reference.sh landing "hero conversion cta"
bash design-reference.sh landing "creator portfolio showcase"

# UX Patterns
bash design-reference.sh ux "sticky navigation scroll"
bash design-reference.sh ux "interactive hover states"

# Product Strategy
bash design-reference.sh product "artist community platform"
bash design-reference.sh product "creator economy ecosystem"

# Charts & Data
bash design-reference.sh chart "analytics dashboard metrics"

# Framework-Specific (Next.js)
bash design-reference.sh nextjs "button component animation"
bash design-reference.sh nextjs "responsive navigation mobile"
```

## Integration with TSC Project

### Current Component References
- **Header.tsx** → `tsc-glassmorphic` + `nextjs "sticky header"`
- **WaveButton.tsx** → `tsc-waves` + `ux "interactive animation"`
- **HeroSection.tsx** → `tsc-dark` + `color "dark background"`
- **Typography** → `tsc-typography` + `style "creative editorial"`

### When Making Changes
1. **Before coding** → Run relevant design reference
2. **During review** → Check accessibility & anti-patterns
3. **Before shipping** → Verify checklist items

## Full Library Path

```
Location: c:\Users\ragha\OneDrive\Desktop\ui-ux-pro-max-skill

Data Files:
  - styles.csv (67 UI styles)
  - colors.csv (color palettes)
  - typography.csv (Google Fonts pairings)
  - ux.csv (100 UX rules)
  - landing.csv (page patterns)
  - charts.csv (data viz types)
  - products.csv (product strategies)

Tech Stacks:
  - nextjs/
  - react/
  - html-tailwind/
  - astro/
  - vue/
  - svelte/
```

## Example Workflow

**Adding a gradient button**
```bash
# 1. Get design guidelines
bash design-reference.sh style "gradient button premium"

# 2. Get Next.js implementation
bash design-reference.sh nextjs "gradient button animation"

# 3. Get color palette
bash design-reference.sh color "luxury gradient subtle"

# 4. Copy checklist from output
# [ ] Gradient direction consistent
# [ ] Hover state defined
# [ ] Accessibility: 4.5:1 contrast
# [ ] Performance: no jank
```

## Pro Tips

💡 **Save output to file**
```bash
bash design-reference.sh tsc-glassmorphic > glassmorphic-notes.md
```

💡 **Quick async checking during development**
```bash
# While coding, open another terminal:
bash design-reference.sh ux "accessibility checklist"
```

💡 **Team reference**
```bash
# Share design decisions with team:
bash design-reference.sh product "artist platform" > DESIGN_DECISIONS.md
git add DESIGN_DECISIONS.md
```

💡 **Search specificity matters**
```bash
❌ Bad: " design"
✅ Good: "dark luxury navigation dropdown mobile"

❌ Bad: "color"
✅ Good: "dark gold accent creator economy"
```

## Emergency Database Backup

All data is in:
```
ui-ux-pro-max-skill/src/ui-ux-pro-max/data/
```

If you need direct access to CSV files:
- `styles.csv` - All UI style definitions
- `colors.csv` - Color palette combinations
- `typography.csv` - Font pairings (Google Fonts)
- `landing.csv` - Page structure patterns
- `ux.csv` - UX best practices & anti-patterns
- `stacks/*.csv` - Framework-specific guidelines

## Commands Reference Card

```
QUICK TSC REFS:        DOMAINS:              STACKS:
tsc-glassmorphic       style                 nextjs ✓
tsc-waves              color                 react
tsc-artist             typography            astro
tsc-dark               landing               vue
tsc-typography         ux                    svelte
                       chart                 flutter
                       product               react-native
```

---

**Bookmark this file or the script for quick access!** 🎯
