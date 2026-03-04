# TSC Website 2.0 - Tech Stack Definition

## Overview
A modern, culture-focused web platform with emphasis on motion design (UNFOLD), CMS-driven content, and lead routing. Desktop-first responsive design with sophisticated animation patterns.

---

## Frontend Stack

### Framework & Tooling
- **Next.js 14+** (React 18+)
  - App Router for file-based routing
  - Server components where applicable
  - API routes for proxy/integration
  - Built-in image optimization & static generation
  - Automatic code splitting

### Styling
- **Tailwind CSS 3.x** (Primary)
  - Utility-first approach for rapid component development
  - Custom theme tokens for cream, teal, and brand colors
  - Plugin support for animations (Tailwind Animate)

- **CSS Modules** (Secondary, for complex component-scoped styles)
  - Use when Tailwind utilities are insufficient
  - Scoped styling to prevent conflicts

### Animation & Motion
- **Framer Motion 10.x**
  - Scroll-based triggers (useViewportScroll, useTransform)
  - SVG stroke animations for line-draw effects
  - Staggered text reveals with perLineDuration presets
  - Mask reveal animations (clip-path orchestration)
  - Reduced motion accessibility detection

- **React Use Measure**
  - Viewport detection for scroll animations
  - Element dimension tracking for dynamic layouts

### Component Libraries & Utilities
- **Radix UI** (Headless components for accessibility)
  - Accordion (unfold panels)
  - Dialog (forms, modals)
  - Tabs (filters)
  - Select (dropdown menus)

- **Floating UI**
  - Positioning engine for tooltips, popovers

- **React Hook Form**
  - Form state management
  - Lightweight, minimal re-renders
  - Dynamic form field generation based on user selection

- **Zod**
  - TypeScript-first schema validation
  - Type-safe form validation

### Media & Assets
- **Next.js Image**
  - Automatic optimization (WebP, responsive sizes)
  - Lazy loading support

- **React Player**
  - Embed YouTube/Spotify silently for cinematic hero loop

### Development & Monitoring
- **TypeScript 5.x**
  - Strict mode enabled
  - Type safety for components, APIs, and CMS schemas

- **ESLint + Prettier**
  - Code quality standards
  - Automated formatting

- **Sentry** (Optional)
  - Error tracking for production site

---

## Backend Stack

### Runtime & Framework
- **Node.js 18+ LTS** (Latest LTS recommended)

- **NestJS 10.x** (Recommended primary choice)
  - Modular, scalable architecture
  - Built-in dependency injection
  - TypeScript support native
  - Validation pipes (@nestjs/common)
  - CORS middleware
  - Email module support (@nestjs-modules/mailer)
  - Environmental config (@nestjs/config)

- **Express.js 4.x** (Alternative if NestJS overengineered)
  - Lightweight, popular
  - Middleware ecosystem

### Database
- **PostgreSQL 14+**
  - ACID compliance for lead data integrity
  - JSON support for flexible schemas
  - Performance (indexing, replication ready)

- **TypeORM** (if NestJS)
  - ORM for type-safe database operations
  - Migration support
  - Relationship management

- **Prisma** (Alternative)
  - Modern, type-safe ORM
  - Auto-migrations
  - Great DX with schema validation

### Email Service
- **SendGrid** OR **Mailgun**
  - Transactional email for lead confirmations
  - Internal inbox routing

### CRM Integration (Optional)
- **HubSpot SDK** or **Zoho CRM SDK**
  - Lead push automation
  - Conditional routing based on lead type (artist/brand/producer)

### Validation & Security
- **class-validator** (NestJS)
  - DTO validation
  - Custom validators for email, links, file size

- **Helmet**
  - Security headers (CSRF, XSS, clickjacking protection)

- **Rate Limiting**
  - express-rate-limit or custom middleware
  - Prevent form abuse

### API Documentation
- **Swagger/OpenAPI**
  - Auto-generated API documentation
  - Live testing interface

---

## CMS (Choose One)

### Recommended: **Sanity** (Primary Recommendation)
- **Advantages:**
  - Headless CMS (decoupled from frontend)
  - GROQ query language for flexible content retrieval
  - Real-time collaboration
  - Portable Content Lake
  - Strong ecosystem & docs
  - SDKs for JavaScript/TypeScript

- **Pricing:** Free tier sufficient for MVP, scales with usage

- **Schemas to Configure:**
  - IP (Type, Status, Logline, Hero Image, Gallery, Cultural Rootedness, Contemporary Format, Partnerships, Monetisation Tags)
  - Artist (Name, Roles, Location, Bio, Images, Embeds, Booking enabled)
  - Course (Title, Mentor, Price, StartDate, Description, Outcomes, Modules)
  - ProofTile (Title, Category, Image, Summary, Link)
  - Collaboration CaseStudy (Title, Image, Summary, Link)
  - Newsletter Subscription (Email)

### Alternative: **Strapi V4**
- **Advantages:**
  - Open-source, self-hostable
  - Customizable admin UI
  - Built on Node.js

- **Disadvantages:**
  - More server infrastructure required
  - Community-driven (vs professionally backed)

### Alternative: **Contentful**
- **Advantages:**
  - Enterprise-grade, highly scalable
  - Excellent webhooks for triggering rebuilds

- **Disadvantages:**
  - Higher cost
  - More enterprise-focused

---

## Hosting & Infrastructure

### Frontend Hosting
- **Vercel** (Recommended)
  - Native Next.js optimization
  - Automatic deployments from Git
  - Edge middleware support
  - Analytics built-in
  - Pricing: Free tier available, scales with usage

### Backend Hosting (API)
- **Render.com** (Easiest setup)
  - One-click Node deployment
  - Auto-SSL
  - PostgreSQL addon
  - Free tier with limitations

- **Fly.io** (Alternative)
  - Global edge deployment
  - Docker-native
  - Competitive pricing

- **AWS EC2** (If existing infrastructure)
  - More control, higher ops burden
  - Use RDS for managed PostgreSQL

### Asset CDN
- **Cloudflare** (Primary)
  - Global CDN for static assets
  - Image optimization (Cloudflare Image)
  - Cache busting
  - DDoS protection
  - Free tier available

### Backup & Database
- Managed PostgreSQL (Render, Railway, or AWS RDS)
  - Automated backups
  - High availability replicas

---

## Development Workflow

### Version Control & CI/CD
- **GitHub / GitLab**
  - Version control

- **GitHub Actions** (Built-in CI/CD)
  - Automated testing on push
  - Deploy to Vercel on merge to main
  - Database migrations on deploy

### Package Manager
- **pnpm** (Recommended)
  - Faster, more efficient than npm
  - Better monorepo support

- **npm 9+** (Alternative, simpler)

### Code Quality
- **ESLint**
  - React best practices
  - TypeScript strict rules

- **Prettier**
  - Code formatting

- **Husky + lint-staged**
  - Pre-commit hooks for linting/formatting

### Testing (Optional, recommended for critical paths)
- **Vitest** (Unit tests)
  - Next.js optimized

- **Cypress** (E2E tests)
  - Animation testing
  - Form interactions

---

## Motion Design & Animation Libraries

### Core Animation Libraries
- **Framer Motion** (Already listed above)
  - Primary animation engine

- **React Spring** (Optional alternative for physics-based animations)
  - If more subtle, spring-physics animations desired

### SVG Animation
- **SVG.js** OR **Snap.svg** (For complex SVG manipulation)
  - Stroke animation utilities
  - Mask management

- **Framer Motion + native SVG** (Usually sufficient)

### Accessibility for Motion
- **prefers-reduced-motion detection:**
  ```ts
  useReducedMotion() // Framer Motion hook
  ```
  - Disable parallax
  - Shorten durations
  - Switch line-draw to instant fade-in

---

## Environment & Configuration

### Environment Variables
```
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001 (dev) / https://api.tsc.com (prod)
NEXT_PUBLIC_CMS_URL=https://[sanity-project].sanity.io
NEXT_PUBLIC_CMS_TOKEN=xxx (public token if needed)

# Backend (.env)
DATABASE_URL=postgresql://...
NODE_ENV=development|production
JWT_SECRET=xxx
SENDGRID_API_KEY=xxx
SANITY_TOKEN=xxx
HUBSPOT_API_KEY=xxx (optional)
```

### Build Targets
- **Frontend:** SSG (static generation) for marketing pages, ISR (incremental static regeneration) for CMS-driven pages
- **Backend:** Containerized (Docker) for easy deployment

---

## Performance Targets

- **Lighthouse Scores:** 90+ on all metrics
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

- **Bundle Size:**
  - Main JS: < 150KB gzipped
  - CSS: < 50KB gzipped

---

## Summary Table

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Frontend** | Next.js | 14+ | SSR, SSG, optimal DX |
| | React | 18+ | Modern hooks, concurrency |
| | TypeScript | 5.x | Type safety |
| | Tailwind CSS | 3.x | Rapid UI development |
| | Framer Motion | 10.x | UNFOLD motion spec |
| **Backend** | Node.js | 18+ LTS | JavaScript ecosystem |
| | NestJS | 10.x | Scalable, modular |
| | PostgreSQL | 14+ | ACID, relational data |
| | TypeORM | 0.3+ | Type-safe ORM |
| **CMS** | Sanity | Latest | Headless, flexible |
| **Hosting** | Vercel | - | Next.js native |
| | Render / Fly.io | - | Node API hosting |
| | Cloudflare | - | Global CDN |
| **DevOps** | Docker | Latest | Containerization |
| | GitHub Actions | - | CI/CD automation |

---

## Estimated Project Timeline (High-Level)

1. **Setup Phase:** Tech stack initialization, design tokens, component library (2-3 weeks)
2. **Core Pages Phase:** Home, Ecosystem, interactive components (3-4 weeks)
3. **CMS Integration:** IPs, Artists, Courses, content schemas (2 weeks)
4. **Remaining Pages:** About, Artists, Collaborations, Insights, Contact (2 weeks)
5. **Backend & Forms:** Lead routing, integrations, API setup (1-2 weeks)
6. **Polish & Launch:** SEO, performance, accessibility, QA (1-2 weeks)

**Total estimate:** 12-16 weeks for full production-ready site

---

## Notes

- **Scalability:** All choices support scaling from MVP to enterprise.
- **Developer Experience:** Focus on TypeScript everywhere for consistency.
- **Maintenance:** Prefer managed services (Vercel, Render, Sanity) to reduce ops burden.
- **Flexibility:** CMS choice can be changed later; all are compatible with Next.js.
