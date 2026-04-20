# TSC Website - Universal Design Reference System Setup

## Overview

You now have access to **UI UX Pro Max** (also called **Antigravity Kit**), a professional AI-powered design intelligence toolkit containing:

- **67 UI Styles** with implementation guides
- **100 UX Reasoning Rules** and best practices
- **Google Fonts Pairings** for typography
- **Color Palettes** by product type
- **Landing Page Patterns** with conversion strategies
- **Anti-patterns** to avoid
- **Accessibility Standards** (WCAG AA)
- **Responsive Design Breakpoints** (375px, 768px, 1440px, 1920px)

## Quick Start

### Option 1: Use the Bash Script (Easiest)
```bash
cd c:\Users\ragha\OneDrive\Desktop\TSC-Website

# Make script executable
chmod +x design-reference.sh

# View help
./design-reference.sh

# Quick TSC references
./design-reference.sh tsc-glassmorphic
./design-reference.sh tsc-waves
./design-reference.sh tsc-artist
./design-reference.sh tsc-dark
./design-reference.sh tsc-typography
```

### Option 2: Direct Python Queries
```bash
# Full path for Windows
/c/Users/ragha/AppData/Local/Programs/Python/Python313/python \
  "c:\Users\ragha\OneDrive\Desktop\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\search.py" \
  "your query" \
  --domain [style|color|typography|landing|chart|ux|product]
```

## Search Commands for TSC Project

### Current Implementation References

**For Glassmorphic Navigation:**
```bash
./design-reference.sh style "glassmorphism premium frosted glass"
./design-reference.sh ux "sticky header scroll behavior"
```

**For Wave Button Animations:**
```bash
./design-reference.sh ux "organic wave animation motion"
./design-reference.sh style "kinetic responsive buttons"
```

**For Dark Hero Section:**
```bash
./design-reference.sh color "dark cinema cinematic video background"
./design-reference.sh style "dark luxury premium aesthetic"
```

**For Artist/Creator Brand:**
```bash
./design-reference.sh product "artist creative platform ecosystem"
./design-reference.sh typography "luxury creative editorial artist"
```

**For Mobile Optimization:**
```bash
./design-reference.sh ux "mobile navigation hamburger menu responsive"
./design-reference.sh landing "mobile first hero section conversion"
```

## Available Domains

| Domain | Use Case | Examples |
|--------|----------|----------|
| **style** | UI Style frameworks | Glassmorphism, Minimalism, Brutalism, Soft UI |
| **color** | Color palette recommendations | Dark themes, Luxury, Vibrant, Accessible |
| **typography** | Font pairings & hierarchy | Editorial, Modern, Premium, Friendly |
| **landing** | Page layouts & structure | Hero-centric, Feature showcase, Social proof |
| **chart** | Data visualization | Dashboard, Analytics, Performance metrics |
| **ux** | User experience patterns | Navigation, Hover states, Interactions |
| **product** | Product type guidance | SaaS, E-commerce, Portfolio, Creator platform |

## Available Tech Stacks

Tailored recommendations for:
- `nextjs` (Your current setup!)
- `react`
- `astro`
- `vue`
- `svelte`
- `html-tailwind` (Default)
- `shadcn`
- `flutter`
- `react-native`

## Integration Workflow

### 1. **Design Phase** - Get Inspiration
```bash
./design-reference.sh style "your design direction"
# Get style keywords, CSS implementations, AI prompts
```

### 2. **Development Phase** - Implementation Guide
```bash
./design-reference.sh nextjs "your component type"
# Get Next.js specific code patterns and examples
```

### 3. **Review Phase** - Quality Checklist
```bash
./design-reference.sh ux "accessibility design system"
# Get comprehensive testing and validation checklists
```

## Real-World Example: Adding a New Feature

**Scenario: Add a featured artists carousel**

```bash
# Step 1: Research best patterns
./design-reference.sh product "artist showcase feature carousel"

# Step 2: Get technical implementation
./design-reference.sh nextjs "carousel component animation"

# Step 3: Check UX guidelines
./design-reference.sh ux "image lazy loading accessibility"

# Step 4: Verify color usage
./design-reference.sh color "dark theme showcase accent colors"

# Step 5: Validate typography
./design-reference.sh typography "creative artist names labels"
```

## Output Includes

Each search result provides:

✅ **Style Guidelines**
- Primary colors, secondary colors, accent colors
- Effects & animations (duration, easing)
- Best use cases for your product type

✅ **Technical Implementation**
- CSS/Tailwind keywords
- Framework-specific guidance (Next.js, React, etc.)
- Performance notes
- Browser compatibility

✅ **Best Practices**
- Design system variables
- Implementation checklist
- Do's and don'ts
- Accessibility requirements

✅ **Anti-Patterns**
- What NOT to do
- Common mistakes
- Performance pitfalls
- Accessibility violations

## Making This Universal Reference

### Link to GitHub Library
```bash
# Your design reference is always available at:
c:\Users\ragha\OneDrive\Desktop\ui-ux-pro-max-skill

# And quick access script in your project:
c:\Users\ragha\OneDrive\Desktop\TSC-Website\design-reference.sh
```

### Add to Project Documentation
```markdown
# Design Reference
See `DESIGN_REFERENCE_SETUP.md` for quick commands.

For detailed design decisions, reference:
- `/design-reference.sh tsc-*` for quick patterns
- GitHub: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
```

### Environment Variables (Optional)
Create `.env.design` in your project:
```bash
DESIGN_LIBRARY_PATH=/c/Users/ragha/OneDrive/Desktop/ui-ux-pro-max-skill
PYTHON_PATH=/c/Users/ragha/AppData/Local/Programs/Python/Python313/python
```

## Tips for Best Results

1. **Be Specific with Queries**
   - ❌ "colors"
   - ✅ "dark luxury artist portfolio colors"

2. **Combine Domains**
   - Query style → Get CSS implementation
   - Query ux → Get interaction patterns
   - Query product → Get full strategy

3. **Use TSC Templates First**
   - Quick answers: `./design-reference.sh tsc-*`
   - Deep dives: `./design-reference.sh style "..."`

4. **Save Good Results**
   ```bash
   # Export search results to file
   ./design-reference.sh style "query" > design-notes.txt
   ```

5. **Reference During Code Review**
   - Check accessibility checklist before shipping
   - Verify anti-patterns before deployment
   - Cross-reference with design system variables

## Next Steps

1. ✅ **Setup Complete** - Library is ready
2. **Use in Development** - Run `./design-reference.sh` when needed
3. **Build Design System** - Use output as basis for components
4. **Document Decisions** - Reference library in code comments
5. **Team Alignment** - Share library access with collaborators

## Troubleshooting

**"Python not found"**
```bash
# Use full path:
/c/Users/ragha/AppData/Local/Programs/Python/Python313/python \
  path/to/script.py
```

**"Script permission denied"**
```bash
chmod +x design-reference.sh
```

**"No results found"**
- Try simpler keywords
- Check spelling
- Use `--domain` to narrow scope

## Resources

- **Official Website**: https://uupm.cc
- **GitHub Repository**: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **NPM Package**: `npm install -g uipro-cli`
- **Documentation**: See `CLAUDE.md` in the library

---

**Your design reference system is now ready!** 🎨✨
