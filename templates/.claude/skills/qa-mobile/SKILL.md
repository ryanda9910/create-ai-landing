---
name: qa-mobile
description: Run mobile QA checklist. Checks tap targets, overflow, accessibility, forms, and media on 375px viewport.
---

# QA Mobile Skill

Run this checklist before any deploy. Test at 375px (iPhone SE) and 390px (iPhone 14) viewports.

## Visual

- [ ] No horizontal overflow at 375px (check with `document.documentElement.scrollWidth > window.innerWidth`)
- [ ] All text readable at mobile size (no sub-12px)
- [ ] Images not cropped awkwardly on mobile
- [ ] Hero section not taller than 100dvh

## Tap Targets (WCAG 2.1 SC 2.5.5)

Minimum size: **44×44px**. Check every interactive element:

- [ ] All nav links (header + footer)
- [ ] All buttons
- [ ] All form inputs (height ≥ 44px)
- [ ] Social media links
- [ ] Logo / home link

Fix pattern for text links: add `py-2.5 block` — gives 46px with `text-body` (26px line-height).

## Forms

- [ ] Form wrapped in `<form onSubmit>` — NOT `<div>` + onClick
- [ ] Enter key submits the form
- [ ] Autofill works (email, name fields)
- [ ] Error messages visible and inline (not alert())
- [ ] Submit button has `type="submit"`

## Accessibility

- [ ] All `<nav>` elements have `aria-label`
- [ ] All images have meaningful `alt` text
- [ ] Focus-visible state visible on all interactive elements
- [ ] Color is NOT the only indicator for any state

## Media

- [ ] Video has `poster` fallback image
- [ ] Video respects `prefers-reduced-motion` (pause or hide if reduced)
- [ ] Audio has visible pause button ≥ 44px

## Performance (quick check)

- [ ] OG image exists and is NOT a black placeholder (`public/og-image.jpg`)
- [ ] No image > 500KB in initial load
- [ ] Hero media loads after initial paint (deferred)
