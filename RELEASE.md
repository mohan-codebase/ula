# Production readiness: Ula

Prepared on 21 October 2026 for deployment as an independent travel portfolio showcase on the owner's Vercel account.

## Completed

- Static Vercel configuration, Node.js 24, permanent redirects for legacy URLs, asset caching and security headers.
- One resolved deployment origin for canonicals, Open Graph, Twitter, JSON-LD, sitemap and robots. Verified production and preview builds with test domains; preview indexing is disabled.
- Build gates for origin validation, Astro/TypeScript checks, all 31 generated HTML pages, local asset/link existence, responsive sources and CSP metadata. CI repeats build and production-dependency checks.
- Astro-generated CSP hashes without unsafe inline scripts. Browser checks run with CSP enforcement enabled, including page transitions.
- A single fingerprinted variable font replaces four identical downloads. Destination photos have AVIF with WebP fallback; images are resized/compressed and noninitial hero photos load on selection.
- Invalid, stale, mismatched and blocked browser storage is handled. Failed hero loads retain the previous landscape and show a status message.
- No-JavaScript navigation and itinerary reading. The contact form is hidden without JavaScript to avoid accidental query-string submission of personal details.
- Current social preview and SVG/ICO/touch icons use the approved text-led branding.

## Validation

Production browser evidence: `.shots/production/checks.json`. The suite checks all 31 HTML pages and missing-page behavior, zero axe violations, zero CSP violations and zero browser exceptions, responsive widths from 320 to 1440 pixels, planner/contact downloads, full trip content, client navigation, malformed/blocked storage, failed hero loads and reduced-motion/no-JavaScript behavior.

`npm audit --omit=dev`: zero reported vulnerabilities. This reflects published advisories at the time of testing, not a guarantee against all security defects.

Mobile Lighthouse 13 lab results against the compressed static production QA fixture:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 99 | 100 | 100 | 100 | 1.94 s | 0 | 0 ms |
| Destinations | 98 | 100 | 100 | 100 | 2.33 s | 0 | 0 ms |
| Nilgiri trip | 99 | 100 | 100 | 100 | 1.97 s | 0 | 0 ms |

Reports: `.shots/production/lighthouse-*.html` and `.json`. Results vary by hardware and network. They are local simulated mobile lab measurements, not hosted Vercel measurements or field Core Web Vitals. INP needs real interaction/field data and is not claimed here.

## Intentional demo scope

Contact uses the owner-approved `hello@ula.example` placeholder and downloads a message locally; it does not send email. The planner creates personal itineraries without booking, payment, accounts or a database. These limitations are clearly described in the site.

## Deployment status

Ready to deploy as the specified portfolio showcase. No live Vercel deployment has been created or modified. The test hostname used during validation is not a real deployment. Follow `DEPLOYMENT.md`, then verify actual hosted URLs, 404/redirect behavior, HTTPS, CDN/security headers and mobile performance. The source derives the real origin from Vercel; a normal local build remains intentionally noindex.

## Later photography revision

All six destinations now have curated high-resolution main and supporting photographs with AVIF/WebP delivery, explicit crop focal points and updated license/alt text records. The build and full production browser/CSP/accessibility suite passed after these changes, along with desktop/mobile checks for six galleries and six hero states. The Lighthouse table above describes the preceding release build; it has not been remeasured for this photography revision.
