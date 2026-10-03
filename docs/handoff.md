# Current project handoff

Last updated: 3 October 2026 (Africa/Dar_es_Salaam).

## Current objective and stopping point

User requested dots-only Gallery controls, Mike’s profile/portrait, and a review area inspired by the supplied Google screenshots. Mike’s supplied profile artwork is integrated with a circular CSS portrait crop and Senior Safari Guide role. Gallery now has four real slides/dots and a dedicated 6px pagination gap; the slide/content gap remains 20px. User authorized committing and pushing the current website to GitHub. Preparing that commit; push pending.

## Implemented

- Gallery keeps the restored three-column design, four slides, five-second rotation and 20px gaps. Visible controls are now only four dots with an elongated active dot. Keyboard arrows/Home/End, touch swipe, focus/hover/offscreen pause and reduced-motion support remain. Autoplay resumes after focus leaves.
- Reviews page has a prominent composer, five selectable stars, local rating summary/breakdown, newest/highest/lowest sorting, and a clearer homepage review link. Samples never contribute to the summary.
- Up to four photo/video files (10 MB each) can be privately previewed. Media is explicitly session-only, never uploaded or stored with a review. Preview object URLs are revoked on replacement/reset/disposal.
- Review text retains existing device-only storage and download behavior. No public posting or Google integration is claimed. A real Google review URL was requested as an optional alternative.
- Calendar and Gallery layout remain in their restored state. Existing card, price, sample rating and expansion work is preserved.

## Files and checks

Affected: GalleryResources.js, galleryCarousel.js, Reviews.js, ReviewPreview.js, new reviewComposer.js, components.css, tokens.css, tests/galleryCarousel.test.js, new tests/reviewComposer.test.js, package.json and continuity notes.

- npm run check and npm run build: PASS after implementation.
- Three Gallery controller tests and five targeted review validation/download/order, page markup and tour-card tests: PASS.
- Two new composer tests: PASS (valid/empty summary, star selection, oversized media rejection and listener cleanup).
- No fresh browser visual check: earlier browser launch was rejected by automatic approval review. No workaround attempted. These are source/markup/controller checks.
- Full test suite: 37/37 PASS. npm run check/build PASS before remote synchronization. Updated stale team/review mocks and restored missing ratings on explicitly labelled preview samples so all six sample stories render.
- Fast-forwarded two remote workflow commits from origin/main without overwriting local edits. Website commit/push pending; unrelated staged documents/images/CNAME and local editor/rules changes remain excluded. Earlier rollback backup remains ignored under release-artifacts/before-646-rollback.

## Next concrete step

Mike portrait is complete. Finish GitHub commit/push and record the result. Review Gallery dots and review composer at desktop/mobile sizes. If a Google review URL is supplied, add a clearly labelled public-review link. Until then, keep local-saving and media-preview disclosures visible.

## Preserved prior requests and pending items

- Shared tour/Places/listing cards have exactly three feature items in one row, explicit per-person units on confirmed paid prices, No visit fee wording for Markets, and no Not yet rated text.
- User explicitly approved varied sample star ratings: `src/data/tourRatingSamples.js` defines 11 preview scores; five SVG stars and visible Sample rating labels must remain until genuine review data is supplied. Never publish these as real review aggregates/schema.
- Serval retains the main zebra photo and 150K / per person. Thumbnail strip removed at user request; original files preserved.
- Waterfall and Napur show $120 / per person. Identities are still unconfirmed: pending question asks whether they mean Materuni and Napuru. Candidate photos remain in ignored release-artifacts; do not insert a wrong location. Materuni candidate requires CC BY-SA attribution; Napuru candidate is CC0.
- Market, school and street visits have no visit fee. School visits require advance arrangements; transport/purchases/gifts are separate.
- Places starts with Chemka / Serval / Arts & Culture, expands to Waterfall / Napur / Markets and collapses back to three.
- Local preview uses fixed loopback ports 5173 dev / 4173 production preview. README records network-error recovery. Earlier broader Gallery goal was blocked on browser evidence; this new reference supersedes its design.
