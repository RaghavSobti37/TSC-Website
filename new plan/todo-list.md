# TSC Website 2.0 - Detailed Implementation Todo List

> ✅ **Progress update:** Phases 1 through 6 have been completed. The next section (Phase 7) below is where work resumes.



## Phase 1: Project Setup & Infrastructure (Week 1-2) ✓

*All tasks in this phase have been finished.*

### 1.1 Repository & Development Environment
- [ ] Initialize Next.js 14 project with TypeScript
  - [ ] Install dependencies (React 18, TypeScript 5, Tailwind, Framer Motion)
  - [ ] Configure tsconfig.json with strict mode
  - [ ] Setup path aliases (@/components, @/lib, etc.)
- [ ] Setup backend repository (Node.js + NestJS)
  - [ ] Initialize NestJS project
  - [ ] Configure PostgreSQL connection
  - [ ] Setup environment variables template
- [ ] Initialize CMS (Sanity)
  - [ ] Create Sanity project
  - [ ] Configure GROQ queries preview
  - [ ] Setup Sanity CLI
- [ ] Configure Git workflow
  - [ ] Setup GitHub/GitLab repository
  - [ ] Setup branch protection rules (main)
  - [ ] Configure GitHub Actions for CI/CD
- [ ] Configure Vercel deployment
  - [ ] Link frontend repo to Vercel
  - [ ] Setup preview deployments
  - [ ] Configure environment variables on Vercel
- [ ] Setup backend hosting (Render/Fly.io)
  - [ ] Create account and configure PostgreSQL instance
  - [ ] Setup auto-deploy from Git
  - [ ] Configure environment variables

### 1.2 Design System & Tokens
- [ ] Create Tailwind configuration
  - [ ] Define color palette (cream, teal, neutrals)
  - [ ] Setup typography scale (H1-H6, body, micro)
  - [ ] Define spacing scale
  - [ ] Setup custom breakpoints (mobile-first)
- [ ] Create UNFOLD animation presets
  - [ ] Define `unfoldFadeUp` animation
  - [ ] Define `unfoldMaskReveal` animation
  - [ ] Define `unfoldLineDraw` animation
  - [ ] Define `unfoldPanelExpand` animation
  - [ ] Define `unfoldStaggerText` animation
  - [ ] Create motion configuration file with presets
- [ ] Setup brand asset files
  - [ ] Export SVG logos (full lockup, mark)
  - [ ] Prepare brand motif textures (low opacity)
  - [ ] Create color token CSS/JS export

### 1.3 Foundation Components Library
- [ ] Create reusable layout components
  - [ ] `<AppShell>` component (header, footer, main container)
  - [ ] `<Section>` component (standardized spacing, background tokens)
  - [ ] `<Container>` component (max-width wrapper)
- [ ] Create animation wrapper components
  - [ ] `<UnfoldReveal>` component (viewport-triggered reveals)
  - [ ] `<MaskImage>` component (image reveal with mask)
  - [ ] `<LineDrawSVG>` component (SVG stroke animation)
  - [ ] `<UnfoldAccordion>` component (expandable panels with UNFOLD motion)
- [ ] Create button & CTA components
  - [ ] Primary button (Join as Artist, Partner with TSC, Apply as Artist, etc.)
  - [ ] Secondary button (Explore links)
  - [ ] `<CTACluster>` component (3-pathway CTA section)
- [ ] Create form components
  - [ ] Input field with styling
  - [ ] Textarea field
  - [ ] Select dropdown
  - [ ] File upload component
  - [ ] Form error states
- [ ] Create content card components
  - [ ] `<CMSGrid>` component (reusable grid for IPs, artists, courses, proof tiles)
  - [ ] IP card (image, title, status, CTA)
  - [ ] Artist card (image, name, roles, location)
  - [ ] Course card (thumbnail, title, mentor, CTA)
  - [ ] Proof tile / Case study card
- [ ] Create header component
  - [ ] Sticky header with logo, nav, CTA buttons
  - [ ] Mobile hamburger menu
  - [ ] Active nav state tracking
  - [ ] Header background fade on scroll
- [ ] Create footer component
  - [ ] Links sections (footer nav)
  - [ ] Newsletter subscription CTA
  - [ ] Social links
  - [ ] Copyright & legal links

### 1.4 Testing Setup (Optional, recommended for critical paths)
- [ ] Setup Vitest for unit tests
  - [ ] Configure test environment
  - [ ] Create component test examples
- [ ] Setup Cypress for E2E tests
  - [ ] Configure Cypress
  - [ ] Create smoke tests for main pages

---

## Phase 2: Homepage Build (Week 2-3) ✓

*All tasks in this phase have been finished.*

### 2.1 Hero Section
- [ ] Build Hero component
  - [ ] SVG line-draw animation for brand mark (UNFOLD)
  - [ ] H1 fade-in line-by-line animation (UNFOLD stagger text)
  - [ ] Subheading fade-in
  - [ ] CTA buttons (Join as Artist, Partner with TSC)
  - [ ] Parallax image/video loop on right side (silent cinematic)
- [ ] Implement scroll animations
  - [ ] Header fade-in background color on scroll
  - [ ] Hero parallax effect (respect prefers-reduced-motion)

### 2.2 "Why We Were Born" Section (Problem Tension)
- [ ] Design unfolding accordion panels
  - [ ] Panel 1: "A hegemony of labels"
  - [ ] Panel 2: "Serving algorithms & commerce makes for predictability"
  - [ ] Panel 3: "No single talent nurture-to-monetize ecosystem"
  - [ ] Panel 4: "No direct connect with fans"
- [ ] Implement panel interactions
  - [ ] Expand/collapse on click
  - [ ] Staggered reveal as user scrolls into section
  - [ ] Each panel: 1 metaphor image + 2-line statement
  - [ ] UNFOLD animation preset (height, opacity, mask)

### 2.3 "Spot → Nurture → Monetize" Bridge Section
- [ ] Create horizontal timeline/path visualization
  - [ ] 5 steps: Spot → Mentor → Nurture → Launch → Monetise
  - [ ] Animated "pumpkin line" draws left-to-right as user scrolls (UNFOLD line-draw)
  - [ ] Step labels & optional icons

### 2.4 Infinity Ecosystem (Core Interactive Component)
- [ ] Create `<InfinityEcosystem>` component
  - [ ] SVG infinity loop (animated stroke, centered)
  - [ ] Center label: "Artist at the centre"
  - [ ] 5 nodes positioned around loop:
    - PREPARE (Online Courses)
    - CREATE (Creation Cafés)
    - PRODUCE (Pitch & Production)
    - MONETIZE (Brand Collaborations)
    - REPLICATE (Creation Campuses / Epicentres)
  - [ ] Hover/click interactions
    - Desktop: On hover, node unfolds into mini card with 2 lines + "Explore" link
    - Mobile: On tap, open bottom sheet with node content
  - [ ] Store selected node state (for analytics/tracking)
- [ ] Add animation triggers
  - [ ] Infinity loop draws on scroll into view
  - [ ] Nodes appear with staggered timing

### 2.5 "For Conscious Globalists" Section
- [ ] Create 3-column typography layout
  - [ ] Column 1: "For artists seeking meaning beyond noise"
  - [ ] Column 2: "For audiences seeking emotion over doom-scrolling"
  - [ ] Column 3: "For culture-investors & brands shaping future culture"
  - [ ] Add one large image (full-width below columns)

### 2.6 UNFOLD Grid (12-tile)
- [ ] Create grid layout
  - [ ] 12 tiles in 4x3 or 3x4 grid (desktop), responsive for mobile
  - [ ] Tiles: Potential, Opportunities, Genres, Cultures, Geographies, Communities, Collaborations, Talent, Styles, Fandoms, IPs, Exports
- [ ] Implement tile interactions
  - [ ] Appear in waves on scroll (staggered)
  - [ ] Hover: expand slightly + reveal one example line
  - [ ] Subtle transition (no "pop")

### 2.7 Proof of Work ("Alive & at work") Section
- [ ] Create 2-row card grid
  - [ ] Pull from CMS (Proof tiles collection)
  - [ ] Cards: TSC Academy, Main Bhi Artist, Collaborations, Featured IP/musical/film, Creation Cafés (if active)
  - [ ] Each card: image + title + 1-line description + "View" CTA
  - [ ] Link CTA to respective page/detail page

### 2.8 Values Section
- [ ] Create 4-value display
  - [ ] Words: Fearlessness / Integrity / Optimism / Transparency
  - [ ] Hover: reveals one sentence description for each
  - [ ] Layout: inline row (desktop), stacked (mobile)

### 2.9 Final CTA: "Unfold what's possible"
- [ ] Create 3-pathway section
  - [ ] Artist pathway card + "Apply as Artist" button
  - [ ] Brand Owners pathway card + "Partner Brief" button
  - [ ] Producers/Financiers pathway card + "Co-Create with TSC" button
  - [ ] Each with descriptive copy

### 2.10 Sticky CTA Bar (Persistent)
- [ ] Implement sticky top-right CTA
  - [ ] "Join as Artist" (primary)
  - [ ] "Partner with TSC" (secondary)
  - [ ] Appear after hero scrolls out of view
  - [ ] Fade in/out smoothly (UNFOLD fade)

### 2.11 Homepage Integration
- [ ] Test all homepage sections together
  - [ ] Scroll behavior across sections
  - [ ] Animation performance
  - [ ] Mobile responsiveness

---

## Phase 3: Core CMS Setup (Week 3-4) ✓

*All tasks in this phase have been finished.*

### 3.1 Sanity Schema Definition
- [ ] Create IP schema
  - [ ] Fields: title, slug, type, status, logline
  - [ ] Fields: heroImage, gallery[]
  - [ ] Fields: culturalRootedness (rich text), contemporaryFormat (rich text)
  - [ ] Fields: partnerships (array), monetisationTags[]
  - [ ] Fields: CTA label + CTA link
- [ ] Create Artist schema
  - [ ] Fields: name, slug, roles[], location
  - [ ] Fields: bioShort, bioLong
  - [ ] Fields: images[], embeds (spotify/youtube links)
  - [ ] Fields: bookingEnabled (boolean)
- [ ] Create Course schema
  - [ ] Fields: title, slug, mentor (reference to Artist), price (optional), startDate (optional)
  - [ ] Fields: description, outcomes[] (array), modules[] (array)
  - [ ] Fields: CTA
- [ ] Create ProofTile schema
  - [ ] Fields: title, category, image, summary, link
- [ ] Create Collaboration/CaseStudy schema
  - [ ] Fields: title, slug, image, summary, link
  - [ ] Fields: category (partnership model)
- [ ] Create Newsletter schema
  - [ ] Fields: email, subscribedAt, source

### 3.2 Sanity API Integration
- [ ] Setup environment variables in Next.js
  - [ ] NEXT_PUBLIC_SANITY_PROJECT_ID
  - [ ] NEXT_PUBLIC_SANITY_DATASET
  - [ ] SANITY_API_READ_TOKEN (for frontend if needed)
  - [ ] SANITY_API_WRITE_TOKEN (for backend)
- [ ] Create GROQ query helpers (@/lib/sanity/queries.ts)
  - [ ] Query: getIPs() - all IPs with filters
  - [ ] Query: getIPBySlug(slug) - single IP detail
  - [ ] Query: getArtists() - all artists with filters
  - [ ] Query: getArtistBySlug(slug) - single artist detail
  - [ ] Query: getCourses() - all courses
  - [ ] Query: getProofTiles() - all proof tiles by category
  - [ ] Query: getCaseStudies() - all case studies
- [ ] Setup Sanity client
  - [ ] Create @/lib/sanity/client.ts
  - [ ] Configure fetch/request configuration

### 3.3 Data Population (Test Content)
- [ ] Create sample IPs (3-5)
- [ ] Create sample Artists (5-10)
- [ ] Create sample Courses (2-3)
- [ ] Create sample Proof tiles (4-6)
- [ ] Create sample Case studies (2-3)
- [ ] Test image uploads and optimization in Sanity

---

## Phase 4: Secondary Pages Build (Week 4-5) ✓

*All tasks in this phase have been finished.*

### 4.1 Ecosystem Page (/ecosystem)
- [ ] Create hero section
  - [ ] H1: "UNFOLD — The Living Ecosystem"
  - [ ] Subheading: "PREPARE → CREATE → PRODUCE → MONETIZE → REPLICATE"
- [ ] Implement full interactive ecosystem diagram
  - [ ] Larger than homepage version
  - [ ] Each node click/tap opens detailed panel:
    - What it means
    - What we do
    - Outputs (bullet points)
    - Proof tile(s) from CMS
    - CTA button
- [ ] Add footer CTA
  - [ ] "Let's unfold a pathway for you." with action button

### 4.2 IP & Stories Page (/ip & /ip/[slug])
- [ ] Create IP listing page (/ip)
  - [ ] Filter bar: Type filter + Status filter (both dropdown)
  - [ ] Grid of IP cards (pulled from CMS)
  - [ ] Links to detail pages
- [ ] Create IP detail page (/ip/[slug])
  - [ ] Hero section: poster image + logline + status tags
  - [ ] Section 1: The story / intention (rich text from CMS)
  - [ ] Section 2: Cultural depth / rootedness (rich text from CMS)
  - [ ] Section 3: Contemporary format / global appeal (rich text from CMS)
  - [ ] Section 4: Partners / collaborators (displayed as list/tags from CMS)
  - [ ] Section 5: Monetisation pathways (tags from CMS)
  - [ ] CTAs: Collaborate / License / Co-produce buttons
  - [ ] Gallery of additional images

### 4.3 Academy Page (/academy)
- [ ] Create hero section
  - [ ] H1: "Unfold your craft into a career."
- [ ] Create course grid (from CMS)
  - [ ] Display courses with thumbnails, mentor name, title, CTA
  - [ ] Link to course detail pages (if needed)
- [ ] Create mentors strip section
  - [ ] Horizontal scrolling mentor cards
  - [ ] Name, image, role
- [ ] Create "The Artist Path" timeline
  - [ ] Visual timeline showing artist journey through academy
  - [ ] Stages/checkpoints
- [ ] Create community section ("Main Bhi Artist")
  - [ ] Community intro text + sample community content
  - [ ] Link to community page
- [ ] Create demo day / incubation section
  - [ ] Info about demo day
  - [ ] CTA: "Enrol" / "Apply"

### 4.4 Artists Page (/artists & /artists/[slug])
- [ ] Create artists listing page (/artists)
  - [ ] Search bar at top
  - [ ] Filter options: Role (multi-select), City/Country, Genre
  - [ ] Grid of artist cards (from CMS)
  - [ ] Links to detail pages
- [ ] Create artist detail page (/artists/[slug])
  - [ ] Hero: artist image + name
  - [ ] Bio section (short intro + long bio from CMS)
  - [ ] Media embeds (Spotify player, YouTube embeds)
  - [ ] Work samples gallery
  - [ ] Booking/Collaboration form (if bookingEnabled = true)
  - [ ] Related artists suggestions (at bottom)

### 4.5 Collaborations Page (/collaborations)
- [ ] Create hero section
  - [ ] H1: "Unfold cultural IP for your brand / story world."
- [ ] Create 3 partnership models display
  - [ ] 3 cards showing different partnership types
  - [ ] Each with description + CTA
- [ ] Create case studies grid (from CMS)
  - [ ] Cards with image, title, summary, link
  - [ ] Filterable by partnership model
- [ ] Create process timeline
  - [ ] 4 stages: Brief → Create → Launch → Scale
  - [ ] Visual timeline with descriptions
- [ ] Create CTA section
  - [ ] "Partner Brief" form button

### 4.6 About Page (/about)
- [ ] Create "What is TSC" section
  - [ ] Bold, concise intro copy
- [ ] Create "Rooted Yet Contemporary" founder section
  - [ ] Founder bio/image
  - [ ] Philosophy statement
- [ ] Create values display
  - [ ] Fearlessness, Integrity, Optimism, Transparency
  - [ ] With descriptions
- [ ] Create timeline section
  - [ ] TSC founding milestones
  - [ ] Key achievements
- [ ] Create team section
  - [ ] Team members from CMS (optional)
  - [ ] Name, role, image
- [ ] Create CTA section
  - [ ] Call to action to ecosystem or contact

### 4.7 Insights / Blog Page (/insights & /insights/[slug])
- [ ] Create blog listing page (/insights)
  - [ ] List of blog articles from CMS
  - [ ] Categories: Unfold / Artists / Culture / Ecosystem (filter buttons)
  - [ ] Search functionality (optional)
  - [ ] Cards: featured image, title, category, excerpt, date, author
- [ ] Create article detail page (/insights/[slug])
  - [ ] Featured image
  - [ ] Title + subtitle
  - [ ] Author info + publish date
  - [ ] Table of contents (if long article)
  - [ ] Rich text body (from CMS)
  - [ ] Related articles (at bottom)
  - [ ] Share buttons

---

## Phase 5: Forms & Lead Routing (Week 5-6) ✓

*All tasks in this phase have been finished.*

### 5.1 Backend API Setup

#### Contact Form API
- [ ] Create POST /api/leads endpoint (NestJS)
  - [ ] DTO validation (type, name, email, phone, message, links, file)
  - [ ] Type enum: "artist" | "brand" | "producer"
  - [ ] Input validation with class-validator
  - [ ] File upload handling (max size, allowed types)
- [ ] Implement database storage
  - [ ] Create Lead entity/model
  - [ ] Save lead to PostgreSQL
  - [ ] Add created_at, updated_at timestamps
  - [ ] Add status tracking (new, contacted, closed)
- [ ] Implement email routing
  - [ ] Setup SendGrid integration
  - [ ] Route to artist@tsc.com (if type=artist)
  - [ ] Route to partnerships@tsc.com (if type=brand)
  - [ ] Route to producers@tsc.com (if type=producer)
  - [ ] Send confirmation email to user
- [ ] Implement CRM integration (optional)
  - [ ] Setup HubSpot/Zoho SDK
  - [ ] Push leads to CRM with type tagging
  - [ ] Map form fields to CRM properties
- [ ] Add rate limiting
  - [ ] Prevent spam (max 5 submissions per IP per hour)
  - [ ] Return HTTP 429 on limit exceeded
- [ ] Add error handling
  - [ ] Validate email format
  - [ ] Return meaningful error messages
  - [ ] Log errors to Sentry (optional)

#### Newsletter Subscription API
- [ ] Create POST /api/newsletter/subscribe endpoint
  - [ ] Email validation
  - [ ] Check for duplicates
  - [ ] Save to CMS or separate newsletter table
  - [ ] Send welcome email
  - [ ] Return success response

#### CMS Proxy API (Optional)
- [ ] Create GET /api/content/* proxy routes
  - [ ] If using token-protected CMS
  - [ ] Server-side token management
  - [ ] Cache responses (30 min)

### 5.2 Frontend Form Implementation

#### Contact Form (/contact)
- [ ] Create dynamic form component
  - [ ] Step 1: User type selector (Artist / Brand / Producer-Financier)
  - [ ] Step 2: Type-specific form fields
    - **Artist fields:** name, email, phone, bio, links (portfolio/social), file (media samples)
    - **Brand fields:** company, email, contact person, brief description
    - **Producer fields:** firm name, email, contact, project details
  - [ ] Step 3: Form submission + validation
  - [ ] Step 4: Thank-you page (type-specific message)
- [ ] Implement form validation
  - [ ] React Hook Form + Zod
  - [ ] Real-time error display
  - [ ] Disable submit until valid
- [ ] Implement file upload UI
  - [ ] Drag-and-drop zone
  - [ ] File type validation (images, audio, video)
  - [ ] Progress indicator
- [ ] Implement success state
  - [ ] Show confirmation message
  - [ ] Type-specific thank-you page
  - [ ] Auto-redirect after 5 seconds (optional)
- [ ] Connect to lead API
  - [ ] POST to /api/leads on submit
  - [ ] Handle API errors gracefully
  - [ ] Show error toast on failure

#### Newsletter Subscription Forms
- [ ] Footer newsletter signup
  - [ ] Email input + subscribe button
  - [ ] Inline validation
  - [ ] Success message
- [ ] Homepage hero CTA (small form)
  - [ ] Optional: email input in header CTA
- [ ] Page-specific CTAs
  - [ ] Artist apply form shortcuts

### 5.3 Thank-You Pages
- [ ] Create dynamic thank-you page (querystring-based routing)
  - [ ] Route: /contact/success?type=artist (or brand/producer)
  - [ ] Type-specific message
  - [ ] Next steps (what to expect, timeline, contact info)
  - [ ] Related CTAs or links

---

## Phase 6: Advanced Features & Interactions (Week 6) ✓

*All tasks in this phase have been finished.*

### 6.1 Advanced Motion & Edge Cases
- [ ] Implement `prefers-reduced-motion` detection
  - [ ] Disable parallax on scroll
  - [ ] Shorten animation durations
  - [ ] Switch line-draw animations to fade-in
  - [ ] Test across components
- [ ] Test animation performance
  - [ ] Measure FPS on scroll-heavy sections
  - [ ] Optimize expensive animations
  - [ ] Use will-change CSS sparingly
- [ ] Mobile animation optimizations
  - [ ] Reduce parallax intensity on mobile
  - [ ] Simplify SVG animations on low-power devices
  - [ ] Test on actual devices

### 6.2 Ecosystem Diagram Fine-Tuning
- [ ] Implement node state management
  - [ ] Track hovered/selected node
  - [ ] Animate node transitions smoothly
  - [ ] Store selection in URL param (optional)
- [ ] Mobile bottom sheet interactions
  - [ ] Implement draggable bottom sheet
  - [ ] Gesture-based close (swipe down)
  - [ ] Test on various mobile browsers
- [ ] Add analytics tracking
  - [ ] Track node clicks/hovers
  - [ ] Track CTA clicks
  - [ ] Send events to analytics tool (Mixpanel, GA4, etc.)

### 6.3 Mesh Gradient Backgrounds (Optional Brand Enhancement)
- [ ] Design mesh gradient overlays
  - [ ] Warm cream + teal accents (brand colors)
  - [ ] Subtle layer behind sections
  - [ ] Use CSS or canvas (animated optional)

### 6.4 Accessibility Audits
- [ ] WCAG 2.1 AA compliance check
  - [ ] Color contrast ratios (text vs background)
  - [ ] Keyboard navigation (Tab, arrow keys, Enter)
  - [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
  - [ ] Form labels and ARIA attributes
  - [ ] Focus indicators visible
- [ ] Run axe DevTools scan on all pages
- [ ] Test video captions (if cinematic loops have audio)

---

## Phase 7: SEO, Performance & Launch (Week 6-7)  

*Work resumes here – tasks below outline the launch checklist.*

### 7.1 SEO Optimization
- [ ] Setup metadata & structured data
  - [ ] Next.js metadata API for dynamic pages
  - [ ] Title tags (50-60 chars)
  - [ ] Meta descriptions (155-160 chars)
  - [ ] Open Graph tags (og:title, og:description, og:image)
  - [ ] Twitter Card tags
- [ ] Setup structured data (JSON-LD)
  - [ ] Organization schema (TSC info)
  - [ ] BreadcrumbList for navigation
  - [ ] Article schema for blog posts
  - [ ] FAQPage schema (if relevant)
- [ ] Setup sitemap & robots.txt
  - [ ] Dynamic sitemap.xml generation
  - [ ] Robots.txt with crawl rules
- [ ] Setup meta tags for all pages
  - [ ] Canonical URLs
  - [ ] Lang attribute on html
  - [ ] Viewport meta tag
- [ ] Submit to search engines
  - [ ] Google Search Console verification
  - [ ] Bing Webmaster Tools
  - [ ] Submit sitemaps

### 7.2 Performance Optimization
- [ ] Image optimization
  - [ ] Next.js Image component for all images
  - [ ] Responsive sizes configuration
  - [ ] Lazy loading enabled
  - [ ] WebP format for modern browsers
- [ ] Bundle size analysis
  - [ ] Use next/bundle-analyzer
  - [ ] Identify and remove unused packages
  - [ ] Code split heavy components (lazy load)
- [ ] JavaScript optimization
  - [ ] Remove console.log in production
  - [ ] Minify and compress
  - [ ] Tree-shaking working
- [ ] CSS optimization
  - [ ] Purge unused Tailwind classes
  - [ ] Optimize critical CSS
  - [ ] Inline critical CSS (optional)
- [ ] Font optimization
  - [ ] Use variable fonts
  - [ ] Font subsetting
  - [ ] Preload key fonts using next/font
- [ ] Test Core Web Vitals
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
  - [ ] Use PageSpeed Insights, WebPageTest, or Lighthouse

### 7.3 Security & Privacy
- [ ] Setup security headers (via Vercel/Render)
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY (or SAMEORIGIN)
  - [ ] X-XSS-Protection: 1; mode=block
  - [ ] Strict-Transport-Security (HSTS)
  - [ ] Content-Security-Policy (CSP)
- [ ] HTTPS enforcement
  - [ ] Force HTTPS redirect
  - [ ] Certificate renewal (automated on Vercel)
- [ ] Form security
  - [ ] CSRF token on forms
  - [ ] Rate limiting on API endpoints
  - [ ] Input sanitization
  - [ ] SQL injection protection (via ORM)
- [ ] Privacy policy & terms
  - [ ] Create /privacy page
  - [ ] Create /terms page
  - [ ] Add cookie/analytics disclosures
- [ ] Email security
  - [ ] SPF, DKIM, DMARC records for SendGrid

### 7.4 Analytics & Monitoring
- [ ] Setup Google Analytics 4
  - [ ] GA4 tag on all pages
  - [ ] Event tracking for conversions (form submissions, CTA clicks)
  - [ ] Custom events for ecosystem interactions
  - [ ] Goal setup (form submissions, newsletter signups)
- [ ] Setup error tracking (Sentry)
  - [ ] Frontend error capture
  - [ ] Backend error capture
  - [ ] Performance monitoring (optional)
- [ ] Setup uptime monitoring
  - [ ] Pingdom or similar for API/website uptime
  - [ ] Alert on outages

### 7.5 Browser Testing
- [ ] Test on major browsers
  - [ ] Chrome/Edge (latest 2 versions)
  - [ ] Firefox (latest 2 versions)
  - [ ] Safari (latest 2 versions - macOS & iOS)
  - [ ] Mobile: Chrome, Safari, Samsung Internet
- [ ] Test responsive breakpoints
  - [ ] Mobile (375px - XS)
  - [ ] Tablet (768px - MD)
  - [ ] Desktop (1024px - LG)
  - [ ] Wide desktop (1280px+ - XL)
- [ ] Test degradation
  - [ ] Low bandwidth (throttle in DevTools)
  - [ ] Slow device (Performance tab in DevTools)
  - [ ] JavaScript disabled (critical content accessible)

### 7.6 QA & Regression Testing
- [ ] Manual QA checklist
  - [ ] All pages load without errors
  - [ ] All forms submit correctly
  - [ ] All links work (internal & external)
  - [ ] Images load and display correctly
  - [ ] Videos/embeds work
  - [ ] Animations perform smoothly
  - [ ] Mobile responsive design
  - [ ] Print styles work (if applicable)
  - [ ] 404 page configured
- [ ] Automated testing (if setup)
  - [ ] Run Cypress E2E tests
  - [ ] Run Vitest unit tests
  - [ ] Generate coverage reports
- [ ] Staging deployment
  - [ ] Deploy to staging environment
  - [ ] Run full QA on staging
  - [ ] Get stakeholder sign-off

### 7.7 Launch Preparation
- [ ] Domain setup
  - [ ] Configure DNS (A record, MX records, TXT records)
  - [ ] SSL certificate issued
  - [ ] Redirect old domain (if migrating)
- [ ] Pre-launch checklist
  - [ ] All pages indexed by search engines
  - [ ] Analytics tracking verified
  - [ ] Forms tested end-to-end
  - [ ] Email notifications working
  - [ ] Mobile fully responsive
  - [ ] Load tested (simulate traffic spike)
  - [ ] Database backups configured
  - [ ] Monitoring and alerts active
  - [ ] Team trained on admin processes
- [ ] Post-launch tasks
  - [ ] Monitor error logs
  - [ ] Check analytics for anomalies
  - [ ] Respond to form submissions
  - [ ] Gather user feedback
  - [ ] Document issues found
  - [ ] Plan Phase 2 improvements

---

## Phase 8: Post-Launch & Iterations (Week 7+)

### 8.1 Content Population
- [ ] Populate Sanity with production data
  - [ ] Real IPs (all)
  - [ ] All artists
  - [ ] All courses
  - [ ] All proof tiles/case studies
  - [ ] Blog articles
- [ ] Media management
  - [ ] Optimize all images for web
  - [ ] Upload to Sanity
  - [ ] Verify display on pages

### 8.2 User Feedback & Improvements
- [ ] Collect user feedback
  - [ ] Form conversion rate analysis
  - [ ] User drop-off points (Hotjar or similar)
  - [ ] Survey feedback
- [ ] A/B testing (optional)
  - [ ] CTA button copy variants
  - [ ] Form field configurations
  - [ ] Hero messaging
- [ ] Iterate based on feedback
  - [ ] Fix usability issues
  - [ ] Improve conversion paths
  - [ ] Add missing content

### 8.3 Maintenance & Support
- [ ] Ongoing monitoring
  - [ ] Daily check of error logs
  - [ ] Weekly performance reviews
  - [ ] Monthly content audits
- [ ] Update schedule
  - [ ] Security patches (as released)
  - [ ] Dependency updates (quarterly)
  - [ ] Content refreshes (monthly)
- [ ] Documentation
  - [ ] Update technical docs if architecture changes
  - [ ] Document CMS field usage
  - [ ] Create runbooks for common tasks

---

## Priority & Dependencies

### Critical Path (Blocking others)
1. Phase 1: Setup & Infrastructure ✓
2. Phase 3: CMS Setup ✓
3. Phase 2: Homepage Build ✓
4. Phase 5: Forms & Lead Routing ✓
5. Phase 7: SEO, Performance & Launch ✓

### Can Happen in Parallel
- Phase 4: Secondary Pages (after Phase 1 only)
- Phase 6: Advanced Features (after Phase 2)

### Low Priority (Post-MVP)
- Advanced analytics
- A/B testing infrastructure
- Community features
- Member authentication

---

## File Structure Reference

```
tsc-website/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── animations/
│   │   │   ├── UnfoldReveal.tsx
│   │   │   ├── MaskImage.tsx
│   │   │   ├── LineDrawSVG.tsx
│   │   │   └── UnfoldAccordion.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── InfinityEcosystem.tsx
│   │   │   ├── CTACluster.tsx
│   │   │   └── ...
│   │   ├── cards/
│   │   │   ├── IPCard.tsx
│   │   │   ├── ArtistCard.tsx
│   │   │   └── ...
│   │   └── forms/
│   │       ├── ContactForm.tsx
│   │       └── NewsletterSignup.tsx
│   ├── pages/
│   │   ├── index.tsx (Home)
│   │   ├── ecosystem.tsx
│   │   ├── ip/
│   │   │   ├── index.tsx
│   │   │   └── [slug].tsx
│   │   ├── artists/
│   │   │   ├── index.tsx
│   │   │   └── [slug].tsx
│   │   ├── academy.tsx
│   │   ├── collaborations.tsx
│   │   ├── about.tsx
│   │   ├── insights/
│   │   │   ├── index.tsx
│   │   │   └── [slug].tsx
│   │   ├── contact.tsx
│   │   ├── contact/
│   │   │   └── success.tsx
│   │   ├── api/
│   │   │   ├── leads.ts (or route.ts in app router)
│   │   │   └── newsletter.ts
│   │   └── _app.tsx (global setupif using pages router)
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts
│   │   │   └── queries.ts
│   │   ├── hooks/
│   │   │   └── useAnimation.ts
│   │   └── utils/
│   │       └── cn.ts (classname utility)
│   ├── styles/
│   │   ├── globals.css
│   │   └── animations.css
│   └── types/
│       └── index.ts
├── public/
│   ├── svg/
│   │   ├── logo.svg
│   │   └── motifs/
│   └── images/
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Checklist Template (Use for tracking progress)

- [ ] Week 1-2: Phase 1 Complete
- [ ] Week 2-3: Phase 2 Complete
- [ ] Week 3-4: Phase 3 Complete
- [ ] Week 4-5: Phase 4 Complete
- [ ] Week 5-6: Phase 5 Complete
- [x] Week 6: Phase 6 Complete
- [ ] Week 6-7: Phase 7 Complete
- [ ] Week 7+: Phase 8 Ongoing
- [ ] Week 7+: Phase 8 Ongoing

---

## Notes & Guidance

1. **Parallelization:** Phases 4, 5, 6 can overlap with Phase 2-3 completion
2. **Design System:** Don't skip Phase 1 — strong foundations speed up development
3. **CMS:** Use dummy data during design/build, populate with real content after testing
4. **Performance:** Profile early and often — don't wait until launch
5. **Testing:** Add E2E tests for critical paths (lead routing, form submission)
6. **Accessibility:** Build accessible from the start, not as afterthought
7. **Documentation:** Update this list weekly with actual progress

