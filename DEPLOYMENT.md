# Deploy Ula to your Vercel account

The application is ready for a static Vercel deployment. No server adapter, database, API key or paid service is required for the portfolio demo.

1. Import the repository into your own Vercel account.
2. Choose the directory containing this `package.json` as the Root Directory. In the current workspace that directory is `elsewhere`.
3. Use the Astro preset, Node.js 24, install command `npm ci`, build command `npm run build`, output directory `dist`. The checked-in `vercel.json` sets build/output and response headers.
4. Keep **Enable access to System Environment Variables** enabled. Ula uses `VERCEL_PROJECT_PRODUCTION_URL` for the stable production origin, then `VERCEL_URL` if needed. To choose a custom domain explicitly, set `SITE_URL` to its full HTTPS origin, for example `https://your-domain.com`, and rebuild.
5. Deploy a preview and perform the checks below. Promote through your Vercel account when satisfied.

## Automatic deployment behavior

- Canonicals, sitemap, robots, social URLs and WebSite structured data share the resolved origin.
- Vercel preview/development builds use `noindex, nofollow` and disallow crawling. Production builds allow indexing; the 404 remains noindex.
- A Vercel build fails if it cannot resolve a valid non-local HTTPS origin. It also rejects URL paths, credentials, fragments and query strings in `SITE_URL`.
- Asset hashes get immutable caching; public images have a shorter cache window. Security headers prevent framing, disable MIME sniffing and restrict unused device permissions. Astro generates script hashes for the page CSP.
- Existing `/about/` and `/routes/` links redirect to `/about-us/` and `/trips/`. No catch-all SPA rewrite is used, so missing routes retain HTTP 404.

## Verify on the actual deployment

- Open the homepage, destinations, one detailed trip, About Us and Contact on desktop and phone.
- Change the hero landscape, use destination filters, open a FAQ, navigate between pages and use the trip planner/download.
- Confirm the Contact page says it is a demo and does not claim to send email.
- Request an unknown URL and confirm HTTP 404. Confirm old URLs return permanent redirects.
- Inspect canonical, Open Graph and structured-data URLs and `/robots.txt` and `/sitemap-index.xml`; no localhost URLs should appear.
- Confirm security/cache headers in browser Network tools. Re-run mobile Lighthouse on the hosted preview or production URL: local lab results do not measure Vercel network delivery.

## Scope

Contact uses the owner's approved placeholder address and local download behavior. Real message delivery, booking, payments and accounts are outside this showcase's scope. Do not replace the demo notice with a success claim unless a real delivery service is connected and tested.

No deployment or account operation has been performed by these preparation changes. Actual Vercel routing, HTTPS, CDN headers and hosted performance must be verified after deploying in your account.
