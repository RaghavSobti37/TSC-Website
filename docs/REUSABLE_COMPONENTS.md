# Reusable Local Components

> **DESKTOP DESIGN LOCK — PERMANENT.** The desktop design (viewport >= 1025px) of the 9 primary pages is locked
> forever to commit `faf9dea`. Components must never alter desktop rendering of those pages unless the site owner
> explicitly and specifically asks. Mobile behavior only inside `@media (max-width: 1024px)` / matchMedia guards.

This static clone keeps original Wix page HTML/CSS intact where possible. Reusable behavior is layered through small local JavaScript components so repeated elements can be configured once and mounted into any page.

## Core file

`public/js/tsc-components.js`

Shared helpers exposed as `window.TSCComponents`:

- `ensureStylesheet(href)` loads a CSS file once.
- `mountFormInto(target, formDefinition, name, sharedOptions)` inserts a reusable local form before an existing Wix mount element.
- `mountStandaloneForm(target, formDefinition, name, sharedOptions)` renders a full standalone form page.
- `formMarkup(formDefinition, name, sharedOptions)` returns form HTML for any field config.
- `setText(selector, value)` updates a repeated Wix text node.
- `setImage(selector, imageConfig)` updates repeated card/media images.
- `updateButton(selector, buttonConfig)` updates repeated CTA buttons.
- `hideElement(selector)` hides repeated/unused Wix elements and removes them from keyboard/link flow.
- `normalizeNewsletter()` standardizes footer newsletter text.
- `normalizeArtistLinks()` standardizes artist booking CTAs to `/query`.
- `configureVideoPlayer()`, `muteVideos()`, and `patchMutedPlay()` keep video media muted by default and ensure videos render with native player controls.
- `applyOnSchedule(callback)` runs hydration-safe updates on initial load and timed passes.

## Page reveal animations

`public/js/tsc-animations.js`

This reusable animation layer adds scroll-triggered reveal behavior to repeated Wix sections, text blocks, images, buttons, boxes, local forms, and standalone editorial article blocks. It preserves each element's original transform before animating, so rotated/decorative Wix elements keep intended design.

## Forms

`public/js/forms.js`

Forms are pure data definitions. To reuse same form component on new page:

```js
ui.mountFormInto(
  document.querySelector('#existing-wix-mount-id'),
  {
    title: 'Example Form',
    fields: [
      { label: 'Full Name', type: 'text', required: true },
      { label: 'Email Address', type: 'email', required: true },
      { label: 'Message', type: 'textarea', full: true }
    ]
  },
  'exampleForm',
  shared
);
```

Supported field types:

- `text`
- `email`
- `tel`
- `url`
- `number`
- `date`
- `select`
- `textarea`
- `phoneCountry`
- `checkboxes`
- `radios`

## Content replacements and responsive shells

`public/js/content-replacements.js`

This file now does much more than text swaps. Main runtime modules:

- Resources blog cards: swaps featured cards to local editorial articles.
- Brand-aware head/header polish: switches favicons, logos, and academy/main-site header CTA by route.
- Mobile header/footer: injects compact navigation and accordion footer shells on smaller breakpoints.
- Course mobile shell: rebuilds `/the-heart-of-composition` and `/roots-of-hindustani-classical` hero/meta blocks for phones.
- Work mobile shell: replaces brittle Wix grid cards with local stacked cards on compact screens.
- Films mobile shell: replaces duplicated Wix sections with local feature cards and case-study cards on compact screens.
- Artist repairs: fixes duplicate hero sections, CTA targets, and hero copy on `/harshad-duhita` and `/yugm`.
- Home CTA repairs: reinjects What We Build card CTAs and links ecosystem CTA to WhatsApp community.
- Academy cleanup: removes stale mentor-session sections from academy overview pages.

Example Resources card config:

```js
updateBlogCard(slot, {
  title: 'Article Title',
  description: 'Short summary.',
  date: 'JUL 27',
  readTime: '12 mins',
  href: '/article-route',
  image: { src: '/assets/blogs/image.jpeg', alt: 'Image alt text' }
});
```

## Page bootstrap

`scripts/generate-subpage-shells.js`

Every generated page animation file loads scripts in this order:

1. `/js/tsc-components.js`
2. `/js/forms.js`
3. `/js/tsc-animations.js`
4. `/js/content-replacements.js`

Run this after changing page routing or script injection:

```bash
npm run build
```

## Rule for future edits

When element repeats across pages, add it as config object and call `TSCComponents` helper. Keep raw cloned Wix HTML/CSS untouched unless change is explicitly about page structure, route shells, or responsive runtime repair.
