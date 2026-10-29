# Ula

Ula is a Tamil Nadu travel showcase featuring destination guides, detailed itineraries and stories that help visitors explore the region’s heritage, landscapes and experiences. Built as a static site with Astro, TypeScript, GSAP and Lenis, it is designed for deployment on Vercel.

## Features

- Six destination guides, three detailed trips, experience collections, journal stories and a practical travel guide.
- An interactive trip planner that saves choices locally and downloads a travel guide.
- Responsive photography with image credits and licensing information.
- Accessible browsing and itinerary reading without JavaScript, with reduced-motion support.
- Search and social metadata, a sitemap and deployment checks for production readiness.

The planner is a showcase: it does not make bookings or send traveler data. The contact form is also a demo and downloads a message rather than sending it.

## Local development

Use Node.js 24 (see `.nvmrc`).

```sh
npm ci
npm run dev -- --background --host 127.0.0.1 --port 4400
```

Manage the background server with `npm run astro -- dev status`, `npm run astro -- dev logs` and `npm run astro -- dev stop`.

## Build and validate

```sh
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4401
```

The build checks origin configuration, TypeScript/Astro diagnostics, every output page's metadata and CSP, and local links/assets. GitHub Actions repeats the build and checks production dependencies. Local builds are intentionally not indexable.

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel configuration and release verification. Vercel automatically supplies the production domain when system environment variables are enabled; `SITE_URL` is an optional explicit override. Robots, canonical URLs, social metadata, structured data and sitemap use the same origin. Preview deployments are not indexable.

## Project structure

```text
src/pages/        Astro pages and routes
src/components/   Reusable site components
src/data/         Destinations, trips, stories and photography data
src/styles/       Site styles and design tokens
public/           Static assets included in the deployed site
assets/           Source assets, photography credits and font license
design/           Design documentation
scripts/          Deployment and build verification scripts
.qa/              Browser, accessibility and performance checks
```

## Editing content

- `src/data/site.ts`: six destinations and the homepage story.
- `src/data/explore.ts`: experiences, trip summaries, seasons and FAQs.
- `src/data/trip-details.ts`: full daily itineraries, transport/stays, food, budget guidance, packing and FAQs.
- `src/data/journal.ts`: journal collection and additional stories.
- `src/styles/tokens.css`: Pearl + Botanical Ink palette and the self-hosted variable font.

Primary trip URLs are `/trips/[slug]/`. Vercel permanently redirects old `/routes/` URLs and `/about/` to their current pages. The sitemap lists primary pages.

## Showcase behavior

The planner stores valid choices on this device when storage is available and downloads a detailed text guide. It makes no bookings and sends no traveler data. Corrupt or obsolete saved choices are handled safely.

Contact remains a clearly labeled demo with `hello@ula.example`, as requested by the owner. It downloads a message locally and does not send email. Browsing and itinerary reading work without JavaScript; the contact form is hidden without JavaScript to avoid accidental submission of personal details in a URL.

## Assets and licenses

Photos are self-hosted WebP images. Author, license, source and modification notices are in `assets/tamil-nadu/credits.json` and the colophon. Original reference files remain under `assets/`; only `public/` assets and compiled pages are deployed. DM Sans is a self-hosted variable font under `assets/DM-Sans-OFL.txt`. Colors are documented in `design/PALETTE.md`.

## Browser and performance evidence

`.qa/production.mjs` validates the built site under its CSP, all pages with axe, responsive widths, downloads, failed image handling, blocked/corrupt storage and no-JavaScript behavior. `.qa/lighthouse.mjs` records mobile Lighthouse reports. The local fixture `.qa/serve-production.mjs` serves `dist/` at port 4401 with configured response headers; it is a QA fixture, not the production server. Latest evidence and limitations are recorded in `RELEASE.md`.

## Photography collection

Destination photography is curated from licensed Wikimedia Commons originals. All six main images and six supporting images have responsive 800/1600/2400-pixel AVIF and WebP variants (the Thanjavur detail source tops out at 1920 pixels). `src/components/Photo.astro` handles formats, resolution and focal points. `src/data/photography.ts` supplies accurate alt text and crop positions. Source selections, dimensions and licenses are recorded in `assets/tamil-nadu/photo-selection.json`; complete attributions remain on the photo credits page. Each destination guide has a distinct supporting photo, also used where appropriate in trip guides.
