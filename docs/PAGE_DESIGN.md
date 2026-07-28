# TSC Page Design Map

Generated from the local static site at `http://127.0.0.1:3000` after crawling every route in `public/pages/routes.manifest.json`.

## Shared Design Language

- **Visual tone:** editorial, culture-first, warm, cinematic, artist-led.
- **Core palette:** warm cream `#FFECD1`, deep teal `#083D3A`, forest teal `#126D5E`, oxblood `#3A1212`, terracotta `#B74B02`, clay `#B64D26`, black and white.
- **Typography:** large Signika-style display headings, Alan Sans / Madefor-style body copy, compact uppercase metadata and button labels.
- **Layout:** full-width Wix sections, generous vertical rhythm, layered image/video bands, repeated text/image cards, and footer-driven conversion links.
- **Interaction model:** mostly static links and CTAs, with Wix page reveal animation, local route normalization, local forms, and muted autoplay video where media exists.
- **Footer pattern:** quick links, social/contact entry points, "Stay in the collective" newsletter copy, and community CTA.

## Global Components

| Component | Design Notes | Behavior |
| --- | --- | --- |
| Header / nav | Transparent cream-toned Wix header with compact links: About, Work, Artists, Films, Resources, TSC Academy. | Links normalize to local routes. Book/artist CTAs route to `/query`. |
| Footer | Full-width footer band with brand mark, quick links, email/social links, newsletter/community copy. | Newsletter is free email input where forms are present. |
| CTA buttons | High-contrast rectangular Wix buttons, usually terracotta/deep-tone labels. | Local links only, no external Wix page aliases visible to users. |
| Forms | Cream/dark framed local form surfaces matching the page tone. | Submit is local only and shows a local success note. |
| Video media | Hero and film/profile media use local mirrored video assets. | All videos are forced muted by default, including before `play()`. |

## Primary Pages

| Route | Page Type | Design Structure | Media | Main Actions |
| --- | --- | --- | --- | --- |
| `/` | Home | Cinematic landing page with hero, ecosystem narrative, METEOR EFFECT problem section, artist growth sections, academy/work/artist CTAs. | Full hero video plus brand/image layers. | Learn Music, Build Stories, Collab with TSC, Book an Artist. |
| `/about` | Brand story | Long editorial company page with culture-forward positioning, beliefs, ecosystem pillars, and linked feature blocks. | Image-led section bands and repeated visual cards. | Know More links into Artists, Academy, Work, Artist Path, Films. |
| `/work` | Work / case-study index | Editorial overview plus project cards for cultural movements, brands, films, and IP work. | Case-study thumbnails and large image bands. | Case study navigation and footer links. |
| `/artists` | Artist ecosystem | Artist-facing landing page with ecosystem proposition, service pillars, and talent cards. | Artist profile imagery. | Explore Artists, Partner With Us, Learn More artist links. |
| `/artist-path` | Accelerator program | Program landing page with large promise headline, application CTAs, timeline/pricing/seat details, and growth curriculum blocks. | Program imagery and section accents. | Apply Now, Enroll Now. |
| `/learn-with-tsc` | Academy overview | Mentorship-led academy narrative with course previews, artist journey copy, and learning promise sections. | Course and mentor imagery. | Explore Courses, Know More course links. |
| `/academy` | Academy / course hub | Course catalog page with academy framing, course cards, testimonials/resources links, and floating book-call entry. | Course preview images. | Book a Call, course detail links. |
| `/films` | Film services | Cinematic film strategy page with audience-building proposition, approach, case examples, and production/release ecosystem copy. | Film stills and video media. | Film/work exploration CTAs. |
| `/resources` | Editorial resources | Resource page with academy/resource framing and a two-card "From the Blog" grid in the original Wix section. | Blog card images. | Read Blog links to `/from-bhajan-to-clubbing` and `/you-released-a-song-now-what`. |

## Subpages

| Route | Page Type | Design Structure | Media | Main Actions |
| --- | --- | --- | --- | --- |
| `/mba` | Case study | Case-study narrative for Main Bhi Artist with overview, challenge, approach, and outcome-style blocks. | Case-study images. | Internal navigation/footer. |
| `/harshad-duhita` | Artist profile | Profile page with artist intro, identity/skills, feature imagery, and booking-oriented flow. | Artist portraits/media. | Learn/booking links where present. |
| `/yugm` | Artist profile | Profile page for YUGM with hero media, music/identity copy, and artist story blocks. | Artist video/image media. | Artist inquiry paths where present. |
| `/roots-of-hindustani-classical` | Course detail | Academy course page with hero, curriculum promise, course details, and enrollment prompts. | Course visuals. | Book a Call / enroll intent. |
| `/the-heart-of-composition` | Course detail | Composition course detail with large educational headline, curriculum sections, and mentor/course positioning. | Course visuals. | Book a Call / enroll intent. |
| `/mahavatar-narsimha` | Film case study | Mythology/culture film case-study page with overview, challenge, strategy, and relevance framing. | Film imagery. | Internal navigation/footer. |
| `/hanuman-ansh` | Film case study | Spiritual/culture story page with audience positioning, project strategy, and impact narrative. | Film imagery. | Internal navigation/footer. |
| `/mahaprbhu` | Film case study | Jagannath/Mahaprabhu cultural story page with devotional/cinematic framing and audience development. | Film imagery. | Internal navigation/footer. |
| `/kalki` | Film case study | Cultural mythology case-study page with large headline, overview, approach, challenge, and strategy sections. | Film imagery. | Internal navigation/footer. |
| `/blog-1` | Legacy blog | Wix-style article page retained as a local subpage, no longer featured in Resources. | Article image. | Back/resources style links. |
| `/blog-2` | Legacy blog | Wix-style article page retained as a local subpage, removed from the featured Resources grid. | Article image. | Back/resources style links. |
| `/blog-3` | Legacy blog | Wix-style article page retained as a local subpage, removed from the featured Resources grid. | Article image. | Back/resources style links. |
| `/from-bhajan-to-clubbing` | Editorial article | Custom static editorial page with sticky header, split hero, article aside, long-form body, and related article band. | `/assets/blogs/indian-culture-mainstream.jpeg`. | Read on Medium, next article. |
| `/you-released-a-song-now-what` | Editorial article | Custom static editorial page matching the companion article design with split hero, aside, article body, and related band. | `/assets/blogs/song-release-now-what.jpeg`. | Read on Medium, previous article. |
| `/collab-query` | Collaboration chooser | Minimal query gateway with brand/artist choices inside cloned footer/header structure. | None. | Brand, Artist. |
| `/book-an-artist` | Artist booking form | Local form page inserted into the cloned page shell with booking fields and select controls. | Light page imagery from shell. | Submit local inquiry. |
| `/artist-query` | Artist Path application form | Long local application form with identity, footprint, craft, setup, gaps, and goals fields. | Light page imagery from shell. | Submit local application. |
| `/book-a-call` | Academy call form | Local academy call form with course select, name, country code, phone, email, date, and time slot. | Light page imagery from shell. | Submit local booking request. |
| `/masterclass-review01` | Review form | Standalone neutral review form with musician-type checkboxes, rating groups, pacing, and feedback textareas. | None. | Submit local review. |
| `/classicalreview` | Review form | Same standalone review form structure with the Classical Review title. | None. | Submit local review. |
| `/masterclass-review02` | Review form | Same standalone review form structure with a different masterclass title. | None. | Submit local review. |

## Responsive Notes

- Wix pages keep fixed-section visual identity at desktop and compress into stacked layouts on smaller widths through generated Wix CSS.
- Custom editorial blog pages switch from a two-column hero/article layout to single-column around `860px`.
- Custom form pages are single-column on mobile and preserve readable field widths with grouped select/input rows.

## Current Blog Section State

- The duplicate lower `tsc-medium-blog-band` below the Resources footer was removed.
- The original Resources "From the Blog" section now features two blogs in the existing Wix card design.
- The two older duplicate-design blog cards are no longer shown in the featured section.
- Featured links:
  - `/from-bhajan-to-clubbing`
  - `/you-released-a-song-now-what`
