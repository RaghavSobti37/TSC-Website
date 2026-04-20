# TSC Website - Universal Design Reference Setup

## Installation Steps

### Step 1: Install Python Requirements (if not already installed)
```bash
python3 --version
# Should be Python 3.x
```

### Step 2: Navigate to the Design Asset Library
```bash
cd c:\Users\ragha\OneDrive\Desktop\ui-ux-pro-max-skill
```

### Step 3: Available Search Commands

The library provides searchable design intelligence across multiple domains:

#### By Design Domain
```bash
# UI Styles (glassmorphism, minimalism, brutalism, etc.)
python3 src/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style

# Color Palettes
python3 src/ui-ux-pro-max/scripts/search.py "dark elegance" --domain color

# Typography & Font Pairings
python3 src/ui-ux-pro-max/scripts/search.py "luxury brands" --domain typography

# Landing Page Patterns
python3 src/ui-ux-pro-max/scripts/search.py "SaaS hero" --domain landing

# Chart Types
python3 src/ui-ux-pro-max/scripts/search.py "performance metrics" --domain chart

# UX Best Practices
python3 src/ui-ux-pro-max/scripts/search.py "navigation patterns" --domain ux

# Product Type Recommendations
python3 src/ui-ux-pro-max/scripts/search.py "artist platform" --domain product
```

#### By Technology Stack
```bash
# For Next.js + React
python3 src/ui-ux-pro-max/scripts/search.py "button animation" --stack nextjs -n 5

# For HTML + Tailwind (default)
python3 src/ui-ux-pro-max/scripts/search.py "card component" --stack html-tailwind -n 10

# Available stacks: html-tailwind, react, nextjs, astro, vue, nuxtjs, svelte, react-native, flutter
```

### Step 4: Using with Your TSC Website Project

#### Quick Reference for Current Project
```bash
# Search for glassmorphic design patterns (what your nav uses)
python3 ../ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style -n 10

# Search for wave animation patterns
python3 ../ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "wave animation organic movement" --domain ux -n 5

# Search for dark theme color palettes
python3 ../ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "dark cinema cinematic" --domain color -n 10

# Search for luxury artist brand typography
python3 ../ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "artist creative luxury" --domain typography -n 5
```

### Step 5: Create a Local Reference Folder in Your Project
```bash
mkdir -p c:\Users\ragha\OneDrive\Desktop\TSC-Website\design-reference
```

### Step 6: Generated Design System Reports

Run the design system generator for your project type:
```bash
cd c:\Users\ragha\OneDrive\Desktop\ui-ux-pro-max-skill
python3 src/ui-ux-pro-max/scripts/search.py "artist creative platform" --domain product
```

This outputs:
- Recommended design patterns
- Color palettes
- Typography pairings  
- Anti-patterns to avoid
- Pre-delivery checklist
- Responsive breakpoints
- Accessibility standards

### Step 7: Make It Universal Reference

Add to your project's root as documentation:
```bash
# Create design guidelines document
cp c:\Users\ragha\OneDrive\Desktop\ui-ux-pro-max-skill/CLAUDE.md c:\Users\ragha\OneDrive\Desktop\TSC-Website/DESIGN_GUIDELINES.md
```

## Example Queries for Your TSC Project

```bash
# For glassmorphic navbar improvements
python3 ../ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "glassmorphism premium frosted glass" --domain style

# For wave button design patterns
python3 ../ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "organic wave animation interactive buttons" --domain ux

# For artist/creator platform best practices
python3 ../ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "creator economy artist portfolio platform" --domain product

# For dark theme cinema-like backgrounds
python3 ../ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "dark cinema video background" --domain color

# For premium typography
python3 ../ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "luxury premium editorial" --domain typography
```

## Database Contents

The library includes:
- **67 UI Styles** with AI prompts and CSS keywords
- **100 UX Reasoning Rules** and best practices
- **Font Pairings** from Google Fonts
- **Color Palettes** organized by product type
- **Landing Page Patterns** with conversion strategies
- **Chart Library Recommendations**
- **Anti-patterns** to avoid
- **Accessibility Checklists**
- **Responsive Design Standards** (375px, 768px, 1440px)

