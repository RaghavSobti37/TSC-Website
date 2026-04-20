# TSC Website - Comprehensive Testing Checklist

## Phase 8: Testing Plan

### Navigation & Layout
- [ ] Header sticky behavior and logo visibility
- [ ] Navigation menu items routing correctly
- [ ] Mobile hamburger menu opens/closes
- [ ] Footer links working correctly
- [ ] All internal links navigate properly

### Homepage (/)
- [ ] Hero section displays brand mark animation
- [ ] Why We Were Born accordion expands/collapses
- [ ] Timeline animation triggers on scroll
- [ ] Infinity Ecosystem diagram renders and responds to interactions
- [ ] UNFOLD Grid tiles expand on hover
- [ ] Proof of Work cards display correctly
- [ ] Values section reveals descriptions on hover
- [ ] Sticky CTA buttons appear after scrolling
- [ ] All page sections have correct background colors

### About Page (/about)
- [ ] Team members display with real images (Rohit, Sandesh, Shakti)
- [ ] Team member images load correctly from /assets
- [ ] Mission statement displays correctly
- [ ] Values section shows all 4 core values
- [ ] Timeline milestones display with years

### IP Listing Page (/ip)
- [ ] All 4 IPs load from CMS data
- [ ] Type filter works correctly
- [ ] Status filter works correctly
- [ ] Combined filtering works properly
- [ ] Cards display IP hero images
- [ ] CTA links route to detail pages

### IP Detail Pages (/ip/[slug])
- [ ] /ip/main-bhi-artist loads correctly
- [ ] /ip/tsc-academy loads correctly
- [ ] /ip/creation-cafes loads correctly
- [ ] /ip/unfold-manifesto loads correctly
- [ ] Hero image displays correctly
- [ ] All IP information displays (logline, description, culturaI rootedness, etc.)
- [ ] Partnerships list displays correctly
- [ ] Monetization tags display as badges
- [ ] Back to all IP button works

### Academy Page (/academy)
- [ ] Courses load from CMS (Music Production, Storytelling Through Film)
- [ ] Course mentor names display correctly
- [ ] Course images display correctly
- [ ] Artist Path timeline displays all 4 stages
- [ ] Mentor cards display with all 4 mentors
- [ ] Community section displays with correct image
- [ ] Demo Day stats display (12, 4, 50+)
- [ ] Both CTA buttons are interactive

### Collaborations Page (/collaborations)
- [ ] Partnership Models section displays 3 items
- [ ] Process timeline displays 4 stages with icons
- [ ] Case Studies section displays 4 proof tiles
- [ ] Timeline alternates left/right on desktop
- [ ] All CTAs are clickable

### Insights Page (/insights)
- [ ] All 4 articles load from CMS
- [ ] Filter buttons work (All, Unfold, Artists, Culture, Ecosystem)
- [ ] Article cards display correctly
- [ ] Featured images load correctly
- [ ] Category badges display
- [ ] Newsletter form displays (email input + subscribe button)

### Article Detail Pages (/insights/[slug])
- [ ] /insights/unfold-motion loads correctly
- [ ] /insights/emerging-talent-investment loads correctly
- [ ] /insights/cultural-production-hyperlocal loads correctly
- [ ] /insights/ecosystem-impact-one-year loads correctly
- [ ] Featured article image displays
- [ ] Article title and metadata display
- [ ] Article content (from cms-data) displays properly
- [ ] Related articles section shows 2 related articles
- [ ] Back to insights button works

### Artist Pages (/artists/[slug])
- [ ] /artists/amaey loads with correct image and bio
- [ ] /artists/deepank loads with correct image and bio
- [ ] /artists/laksh loads with correct image and bio
- [ ] Artist roles display as badges
- [ ] Location displays correctly
- [ ] Genres/disciplines display as tags
- [ ] Social media links present and clickable
- [ ] Booking CTA button appears for all artists

### Ecosystem Page (/ecosystem)
- [ ] Infinity loop diagram renders
- [ ] SVG animation plays on load
- [ ] 5 nodes display around the loop
- [ ] Nodes are interactive (hover effects on desktop)
- [ ] Node detail cards display when selected
- [ ] Mobile version shows bottom sheet instead

### Contact Page (/contact)
- [ ] User type selector displays 3 options
- [ ] Clicking artist option shows artist form
- [ ] Clicking brand option shows brand form
- [ ] Clicking producer option shows producer form
- [ ] Dynamic form fields appear based on selection
- [ ] Form validation works
- [ ] Submit button shows loading state
- [ ] Success message appears after submission
- [ ] Change selection button resets form

### Animations & Motion
- [ ] Scroll animations trigger when elements enter viewport
- [ ] UNFOLD animations are smooth (fadeUp, slideInLeft, slideInRight, scaleUp)
- [ ] Hover effects work (buttons, cards, links)
- [ ] Icon animations work on interactive elements
- [ ] Text animations stagger properly on multi-line text
- [ ] Reduced motion preference is respected (if enabled in OS)

### Responsiveness
- [ ] All pages display correctly on mobile (375px)
- [ ] All pages display correctly on tablet (768px)
- [ ] All pages display correctly on desktop (1024px+)
- [ ] Navigation adapts to mobile
- [ ] Grid layouts reflow to single column on mobile
- [ ] Touch interactions work on mobile (taps, scrolls)
- [ ] Images scale properly at all breakpoints

### Performance
- [ ] Page load time is acceptable
- [ ] Images load without layout shift
- [ ] No console errors
- [ ] No TypeScript errors in browser console
- [ ] Network requests complete successfully

### Accessibility
- [ ] Keyboard navigation works (Tab through interactive elements)
- [ ] Focus indicators visible
- [ ] Form labels associated with inputs
- [ ] Alt text present on images
- [ ] Color contrast meets WCAG standards
- [ ] Skip to content links present

### Cross-Page Navigation
- [ ] Home → About works
- [ ] Home → IP works
- [ ] IP → IP Detail works
- [ ] About → Academy works
- [ ] Academy → Contact works
- [ ] Contact → Academy works (back link)
- [ ] Insights → Article Detail works
- [ ] Article Detail → Related Articles work

## Data Verification

### CMS Data Loaded
- [ ] 4 IPs loaded from cms-data.json
- [ ] 3 Artists loaded correctly with images from /assets
- [ ] 2 Courses loaded with mentor information
- [ ] 4 Articles loaded with full content
- [ ] 4 Proof Tiles loaded
- [ ] 3 Team members loaded with images:
  - Rohit Sharma (Founder & CEO) from /assets/rohit.png
  - Sandesh Kumar (Chief Creative Officer) from /assets/sandesh.jpg
  - Shakti Anand (Director of Programs) from /assets/shakti 2.png

### Real Assets Used
- [ ] banner.jpg displays for flagship IP
- [ ] tsc academy.png displays for academy
- [ ] BLU01769.jpg displays for creation cafes
- [ ] only-logo.svg displays for manifesto
- [ ] amaey.jpeg displays for artist
- [ ] deepank.jpg displays for artist
- [ ] laksh.jpg displays for artist
- [ ] All team member images display correctly

## Final Sign-Off
- All pages rendering correctly: ___
- All interactive elements working: ___
- All CMS data connected: ___
- All animations smooth and accessible: ___
- Responsive design verified: ___
- No console errors: ___
- Performance acceptable: ___
