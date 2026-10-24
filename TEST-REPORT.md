# Ula: full-site mobile and security test report

Tested on 21 October 2026 against the current production build. Tools: Playwright with Chromium and WebKit touch/mobile emulation, axe-core WCAG 2/2.1/2.2 AA rules, Lighthouse 13 mobile simulation, npm audit, Astro/TypeScript checks, and build-output/link verification.

## Result

All implemented test suites pass after fixing a trip jump-link bug. No blocking findings remain within this test scope.

## Mobile coverage

31 generated HTML pages were checked, including the designed 404 and legacy URLs. Each was tested at six viewport sizes/orientations: 320×740, 375×812, 390×844, 430×932, 768×1024 and 844×390. Total: **186 viewport checks**.

- Zero horizontal-overflow findings, broken images, browser exceptions, unexpected CSP violations or axe findings in the all-page sweep.
- Captured full-page 390px screenshots for every page and reviewed representative collection, destination, trip, guide, About and Contact layouts. Banner screenshots cover all four slides at phone and desktop widths.
- Exercised all six mobile navigation destinations, destination filters, experience touch/keyboard tabs, all 12 month selectors and practical FAQs.
- Tested all three route-prefilled planners, editing, full guide downloads and storage clearing.
- Verified dialog focus containment and Escape, no-JavaScript browsing, blocked/corrupt/stale storage, failed hero-image handling and reduced motion.
- Separate suites pass for banner autoplay/pause/previous/next, page transitions including delayed fetches and back navigation, and all detailed trip pages.

## iPhone priority checks

Playwright WebKit passed **124 page/profile checks**: all 31 HTML pages using iPhone SE (320px), iPhone 13, iPhone 16 Pro Max and iPhone 13 landscape profiles. Every profile passed checks for horizontal overflow, images, heading structure, browser exceptions and unexpected CSP violations. The iPhone 13 all-page sweep also passed axe WCAG 2/2.1/2.2 AA rules.

Screenshot review found a missing hamburger/close icon at 701–1100px: the menu was functional, but its line styling only existed below 701px. Added the matching line and button styling for that breakpoint, including phone landscape, with a visible-icon regression assertion.

Each profile passed touch navigation to Contact, transition cleanup, all four banner selections/CTA targets, planner opening, date entry, brief download, editing and Escape dismissal. A separate normal-motion iPhone 13 run passed banner autoplay/pause/next, animated destination navigation and the itinerary anchors on all three trip pages.

Mobile Contact and planner fields now use at least 16px text. Computed sizes were verified in WebKit. This improves readability and addresses small-field focus zoom without disabling user zoom; actual keyboard/zoom behavior is not simulated by headless WebKit.

Evidence: `.shots/iphone/report.json`, `motion.json`, and screenshots. Reproduce with `node .qa/iphone.mjs` and `node .qa/iphone-motion.mjs` after starting the production fixture.

## Bug found and fixed

Trip section jumps could land above or below the intended heading. The application and Lenis both handled anchors, and the application offset duplicated Lenis's scroll-margin handling. The fix disables Lenis's extra anchor listener and passes one absolute target position with the sticky-nav margin applied once. All three trip jump-link regressions pass afterward.

An old trip test was also pointed at the development server and counted headings inside the Astro development toolbar. It now correctly tests the built site. This was a test-target correction, not a site defect.

## Security coverage

Nine groups of checks pass:

1. Configured MIME-sniffing, framing, referrer and unused device-permission headers are served by the local Vercel-config fixture.
2. Built pages have hash-restricted scripts and restricted object, connection, form and base sources. Script policy contains neither unsafe-inline nor unsafe-eval.
3. Browser enforcement blocks an injected unapproved inline script.
4. Browser enforcement blocks an unauthorized external fetch.
5. Requests for environment files, Git metadata, source files, package metadata and private asset directories return 404 from the static output.
6. Legacy routes permanently redirect within the same origin in the local fixture.
7. HTML/script payloads in Contact remain text in a download, with no execution, remote submission or query-string disclosure.
8. Saved-trip payloads are validated against known destinations/options and do not inject markup or alter object prototypes.
9. Published text artifacts have no matches for the tested private-key and credential-token patterns, and contain no source maps or environment/Git files.

`npm audit` across production **and development** dependencies reports zero advisories of any severity. Build, origin/configuration tests, local links, responsive assets and canonical/CSP metadata checks pass.

Inline **style** attributes remain allowed for GSAP animation. Inline scripts are hash-restricted. This is a static portfolio demo: there are no booking, payment, account or email-delivery endpoints to test. Contact remains explicitly local-only.

## Mobile Lighthouse

The current photo/banner build was measured against a compressed local production fixture:

| Page | Performance | Accessibility | Best practices | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 98 | 100 | 100 | 2.18 s | 0 | 0 ms |
| Destinations | 98 | 100 | 100 | 2.26 s | 0 | 0 ms |
| Nilgiri trip | 99 | 100 | 100 | 1.80 s | 0 | 0 ms |

Local SEO scores are deliberately lower because the local build uses noindex/Disallow and localhost canonical URLs. Production-origin resolution and preview/production indexing branches are covered by configuration tests and earlier build checks. Do not treat local noindex as a production SEO failure. Lighthouse is a simulated lab measurement, not field Core Web Vitals; INP and real user/network outcomes are not claimed.

## Evidence and reproduction

- `.shots/full-site/mobile-report.json`: every page, viewport, axe result and asset/CSP/error check.
- `.shots/full-site/*-mobile.png` and `mobile-overview.png`: mobile screenshots.
- `.shots/full-site/security-report.json` and `mobile-interactions.json`: security and touch-flow results.
- `.shots/production/checks.json`: all-page desktop/production regressions.
- `.shots/production/lighthouse-*.html`, `.json`: performance evidence.
- `.shots/dependency-audit-full.json`: dependency scan.
- `.shots/banner/`, `.shots/transition/`, `.shots/trip-details/`: focused suites.

Build with `npm run build`, start the local fixture with `node .qa/serve-production.mjs`, then run:

```sh
node .qa/full-mobile.mjs
node .qa/mobile-interactions.mjs
node .qa/security.mjs
node .qa/production.mjs
node .qa/banner.mjs
node .qa/transition.mjs
node .qa/trip-details.mjs
node .qa/lighthouse.mjs
npm audit
```

## Limits

These are local automated and screenshot-based checks in Chromium and Playwright WebKit, with mobile viewport/touch emulation. Playwright WebKit is not the installed Safari browser or a physical iPhone. Physical iOS/Android devices and Firefox were not tested. iOS keyboard behavior, browser chrome, notches/safe areas and real hardware performance remain unverified. The local fixture applies the configured Vercel headers and redirects; it does not prove actual Vercel deployment behavior. Live HTTPS/TLS, HSTS, CDN/cache behavior and hosted performance still need verification after deployment. No external penetration test was performed, and passing these checks is not a guarantee against every vulnerability.
