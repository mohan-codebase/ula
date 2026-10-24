# Elsewhere

## Brief
An English-language travel inspiration site for curious independent travelers. Its job is to turn an evocative destination into a practical, personal starting point. Assumed brand: Elsewhere, fictional. All journeys are illustrative, with no booking or payment claims. Trip planner creates a local, downloadable brief; no personal data is sent.

## Three territories
| Concept | Anchor | Signature / screenshot | Emotion | Originality / fit / feasibility / portability |
| --- | --- | --- | --- | --- |
| A. The departure board | Travelers choose where to go next | Board letters resolve into a landscape | Anticipation | 3 / 4 / 5 / 4 |
| B. An open field journal | Travel unfolds through observations and collected places | A destination index turns the landscape and its field note together | Discovery | 4 / 5 / 5 / 2 |
| C. Latitude | Distance changes perspective | A coordinate line crosses an oversized geographic word | Expansiveness | 4 / 4 / 3 / 3 |

Selected B: every trip starts with curiosity; one scene, one observation, and a route into the details.

## Concept card
Idea: A field journal that opens onto the places you could be.
Metaphor: An explorer's notebook of landscapes, route sketches and observations.
Signature: Four destination tabs turn the hero landscape, location label and journey link on one chapter variable, using a masked photographic wipe.
Emotion: The quiet pull of a place you haven't been.
Motion verb: Turn, like a page caught by a breeze.
Screenshot: Oversized yellow type on a mountain panorama, a circular compass stamp and the destination index.

## System
Ground notebook #f7f7f0, forest ink #183c2f, muted #61675e, line #d8ddd2, sunlight accent #f4df76, curtain #183c2f. This is forest and sunlight from landscape photography, not terracotta editorial.
DM Sans self-hosted from Google Fonts, 400 body, 500 UI, 600 display, 700 wordmark. No secondary family.
12-column desktop grid, 48px outer gutter, 24px internal gutter. 20px mobile gutter. Display tracking -0.065em, leading .96; body 16px/1.6. One radius 3px except circular stamps and functional pill controls.
One easing family expo.out/expo.inOut; 220ms controls, 650ms page turns. No loader; photographs and navigation must be available immediately. No WebGL needed.
One GSAP ticker drives Lenis. All page effects registered through onPage with teardown. Reduced motion has native scrolling and instant state changes.
Quiet at rest by design: a travel notebook waits for its reader. Its destination turn and consistent arrow motion carry the life, without an idle decoration.

## Compositions
Header: [brand] [destinations / our approach / journal] [plan a trip]
Hero: [huge type / intro / action ........ compass] over a full landscape; [location .... index tabs]
Intro: [small notebook icon / label] [large statement / body]
Destinations: [heading .. category filters]; [large landscape | tall portrait]; [portrait | large landscape]
Approach: [oversized quote + route line] [three numbered steps]
Journal: [wide image] [article heading / excerpt / action]
Footer: [yellow invitation / planner action]; [giant wordmark]; [credits / demo disclosure]
Inner: [breadcrumb] [title / field note] [full image] [day-by-day route | sticky trip summary]
404: [off-route symbol] [This is the scenic detour.] [home link]

Genericness check: replaced prices, stock testimonials, and three feature cards with a destination index, field notes, varied image scales and a practical local itinerary brief. Final accessory removed: no pointer follower or decorative running clock.

## Tamil Nadu revision
The site now focuses exclusively on Tamil Nadu tourism. Six destinations anchor temple towns, hills and coastal escapes. The hero says “Tamil Nadu. A world of wonder.” Photography identifies the actual featured places and carries individual Creative Commons attributions. The journal follows a morning in Madurai. The six-tab index scrolls within its own row on small screens, and long destination names use a smaller mobile scale. Routes are suggestions, with official destination sources linked on their pages. The established forest/yellow palette and page-turn interaction are retained.

## Ula identity
The selected showcase name is Ula. Header and footer wordmarks use lowercase “ula”; document titles, structured metadata, the colophon and downloadable briefs use Ula. Tamil Nadu remains the destination focus. This is a personal portfolio concept intended for the owner’s Vercel account.

## Ula color system
Selected Coastal Ink + Temple Vermilion for the Tamil Nadu showcase: Kolam ivory #F8F5EE, coastal ink #203C4B, temple vermilion #A84732, brass gold #DDB568, temple sand #EEE6D8 and stone #64615B. The cultural references are interpretive, drawing on coastline, temple surfaces and textile contrast. Vermilion carries main actions; gold is a small highlight. Hero titles use ivory for clarity, the approach section uses coastal ink, and the footer uses sand. Typography and layouts are retained. Color roles and usage live in design/PALETTE.md.

## Owner-directed premium revision
The owner rejected the earthy vermilion palette as insufficiently premium. The selected direction is now Pearl + Botanical Ink: #FAFAF7 pearl, #17211D ink, #C7B69A champagne, #ECEDE8 platinum, #656962 stone and #CFD3CD silver. Interface colors are neutral; Tamil Nadu photography supplies regional color. Main light-surface controls use ink, hero/footer actions use champagne, and the footer is dark. Remove the tilted, shadowed journal-note treatment in favor of a quiet pearl panel. This supersedes the previous palette.

## Inner page collection

Collection pages use a shared split heading and the established pearl/botanical palette. Experiences alternate landscape images with short editorial introductions; their detail pages connect places and routes. The journal uses a lead story with two supporting stories. About pairs a coastal panorama with the project purpose; the travel guide uses practical notes, seasons and FAQs. Navigation opens dedicated pages and marks the current collection. Long destination names wrap within narrow article columns.

## Detailed trip pages

A sticky horizontal contents bar anchors a long-form guide beside a compact planner panel. The plan is divided into actual travel days, then loose morning/afternoon/evening blocks. Numbering represents the itinerary sequence. Overnight bases, condition-dependent alternatives and practical sections support independent planning. On phones the planner follows the guide and jump links remain available in a horizontally scrollable bar. Scroll offsets honor sticky navigation. The content stays fully visible under reduced motion.

## Refined page transition

Navigation uses a champagne leading layer followed by botanical ink, both travelling left to right. A large three-letter Ula wordmark enters within a mask, accompanied by the next page's destination or collection name. The cover takes about 0.55 seconds while the next document loads; the reveal takes about 0.63 seconds. There is no artificial first-load delay, countdown or fabricated progress. Slow page fetches retain the covered state. Reduced motion uses a short fade. Root busy state and pointer interception clear at completion or fetch failure.
