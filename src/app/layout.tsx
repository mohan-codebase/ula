import type { Metadata, Viewport } from 'next';
import React from 'react';
import { site, journeys } from '../data/site';
import { routes, experiences } from '../data/explore';
import { deployment } from '../config/deployment';
import { ClientRuntime } from '../components/ClientRuntime';
import '../styles/main.css';
import '../styles/trip-details.css';

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL(deployment.origin),
  title: `Discover Tamil Nadu | ${site.name}`,
  description: site.description,
  robots: deployment.indexable ? 'index, follow' : 'noindex, nofollow',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    title: `Discover Tamil Nadu | ${site.name}`,
    description: site.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Ula: discover Tamil Nadu, from temple streets to the Nilgiri hills' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Discover Tamil Nadu | ${site.name}`,
    description: site.description,
    images: ['/og.png'],
  },
};

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/destinations/', match: '/journeys/' },
  { label: 'Experiences', href: '/experiences/' },
  { label: 'Trips', href: '/trips/', match: '/routes/' },
  { label: 'The journal', href: '/journal/' },
  { label: 'About us', href: '/about-us/', match: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/dm-sans-variable-9fea608a.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <link rel="stylesheet" href="/no-js.css" />
          <p className="no-js-message">
            You can browse every destination and itinerary. Interactive planning and message downloads need JavaScript.
          </p>
        </noscript>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div id="curtain" aria-hidden="true" data-phase="idle">
          <div className="curtain__accent" />
          <div className="curtain__panel">
            <div className="curtain__frame curtain__top">
              <span>VANAKKAM, TAMIL NADU.</span>
              <span>A LITTLE FURTHER.</span>
            </div>
            <div className="curtain__identity">
              <div className="curtain__wordmark">
                <span className="curtain__letter">u</span>
                <span className="curtain__letter">l</span>
                <span className="curtain__letter">a</span>
              </div>
              <span className="curtain__destination" data-transition-destination="">
                Tamil Nadu
              </span>
            </div>
            <div className="curtain__frame curtain__bottom">
              <span>ROOM TO WANDER.</span>
              <span>YOUR NEXT CHAPTER</span>
            </div>
          </div>
        </div>
        <div className="topline" role="region" aria-label="Travel notes">
          <span>VANAKKAM. WELCOME TO TAMIL NADU.</span>
          <span>TEMPLE TOWNS. HILL TRAILS. COASTAL DAYS.</span>
        </div>
        <header className="header">
          <a className="brand" href="/" aria-label="Ula home">
            ula
          </a>
          <nav aria-label="Main navigation" className="desktop-nav">
            {navigation.map((n) => (
              <a key={n.href} href={n.href}>
                <span>{n.label}</span>
              </a>
            ))}
          </nav>
          <button className="button nav-plan" data-plan="">
            <span>Plan a trip</span>
          </button>
          <button className="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-nav">
            <span />
            <span />
          </button>
          <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" hidden>
            {navigation.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
            <a href="/travel-guide/">Travel guide</a>
            <button data-plan="">Plan a trip</button>
          </nav>
        </header>
        {children}
        <footer>
          <div className="footer-invite">
            <div>
              <span>YOUR NEXT TAMIL NADU STORY STARTS HERE.</span>
              <h2>Where to next?</h2>
            </div>
            <button className="button button-light" data-plan="">
              <span>Plan your Tamil Nadu trip</span>
            </button>
          </div>
          <nav className="footer-link-groups" aria-label="Explore Ula">
            <section>
              <h3>Destinations</h3>
              <a href="/destinations/">All destinations</a>
              {journeys.map((j) => (
                <a key={j.slug} href={`/journeys/${j.slug}/`}>
                  {j.name}
                </a>
              ))}
            </section>
            <section>
              <h3>Experiences</h3>
              <a href="/experiences/">All experiences</a>
              {experiences.map((e) => (
                <a key={e.id} href={`/experiences/${e.id}/`}>
                  {e.label}
                </a>
              ))}
              <a href="/about-us/#culture">Food &amp; craft</a>
            </section>
            <section>
              <h3>Trips</h3>
              <a href="/trips/">All trips</a>
              {routes.map((r) => (
                <a key={r.slug} href={`/trips/${r.slug}/`}>
                  {r.name}
                </a>
              ))}
              <a href="/travel-guide/">Travel guide</a>
            </section>
            <section>
              <h3>Discover Ula</h3>
              <a href="/journal/">The journal</a>
              <a href="/travel-guide/#when-to-go">When to visit</a>
              <a href="/travel-guide/#travel-questions">Travel questions</a>
              <a href="/about-us/">About us</a>
              <a href="/contact/">Contact</a>
            </section>
          </nav>
          <div className="footer-wordmark" aria-hidden="true">
            ula
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Ula. Vanakkam, Tamil Nadu.</p>
            <a href="/about-us/">About us</a>
            <a href="/contact/">Contact</a>
            <a href="/colophon/">Photo credits</a>
            <a href="/privacy/">Privacy</a>
            <a href="/destinations/">Back to exploring </a>
          </div>
        </footer>
        <dialog id="planner" aria-labelledby="planner-title" data-lenis-prevent="">
          <button className="dialog-close" aria-label="Close trip planner">
            ×
          </button>
          <div className="planner-form">
            <span className="meta">YOUR NEXT CHAPTER</span>
            <h2 id="planner-title">
              A little daydream.
              <br />A real starting point.
            </h2>
            <p>Make a personal trip brief to save and come back to. This demo doesn&apos;t make bookings or send your details.</p>
            <form id="trip-form">
              <label>
                Where in Tamil Nadu?
                <select name="destination" required>
                  {journeys.map((j) => (
                    <option key={j.slug} value={j.slug}>
                      {j.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                A route to start with
                <select name="route">
                  <option value="">Build from my destination</option>
                  {routes.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.name} · {r.days} days
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-row">
                <label>
                  When would you like to go?
                  <input type="date" name="date" required />
                </label>
                <label>
                  Who&apos;s coming?
                  <select name="travelers" defaultValue="Two travelers">
                    <option>Just me</option>
                    <option>Two travelers</option>
                    <option>Friends or family</option>
                  </select>
                </label>
              </div>
              <label>
                Your kind of travel
                <select name="pace">
                  <option>Slow mornings, room to wander</option>
                  <option>A little adventure every day</option>
                  <option>Temples, local food and heritage</option>
                </select>
              </label>
              <button className="button" type="submit">
                <span>Create my trip brief</span>
              </button>
            </form>
          </div>
          <div className="planner-result" hidden>
            <span className="meta">SOMEWHERE TO START</span>
            <h2>
              Your next chapter
              <br />
              is taking shape.
            </h2>
            <div id="trip-summary" aria-live="polite" />
            <button className="button" id="download-brief">
              <span>Download my brief</span>
              <span className="arrow" aria-hidden="true">
                ↓
              </span>
            </button>
            <button className="text-link" id="edit-brief">
              Make a few changes
            </button>
            <p className="small">Saved in this browser when storage is available. Nothing has been booked.</p>
          </div>
        </dialog>
        <ClientRuntime />
      </body>
    </html>
  );
}
