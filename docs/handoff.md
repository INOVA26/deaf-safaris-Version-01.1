# Current project handoff

Last updated: 5 October 2026 (Africa/Dar_es_Salaam).

## GitHub commit and push — 5 October 2026

User explicitly requested commit and push. Reviewed the website source changes through Git diffs (VS Code UI is unavailable), including responsive layouts, full review lists, team cards, inner pages, banners and synchronized Hero slides. Fresh npm run check, all 44 tests, production build and diff whitespace checks pass. Preparing a scoped commit on main to origin (INOVA26/deaf-safaris-Version-01.1). Existing staged reference documents, domain CNAME and editor/agent instructions are excluded and preserved. Push confirmation will be recorded after it succeeds. Visual browser verification remains pending; a Git push is not proof of a live deployment.

## Latest Hero correction — left-moving image and content slides

5 October 2026. Removed the pictured pause/play button at the user's request. Hero now opts into a button-free slideshow: team/adventure, Kilimanjaro and Serengeti each have matching heading, description and image. Images enter from the right and leave to the left every eight seconds with a shared 900ms transition; copy enters from the right in sync. Initial slide appears immediately. Text occupies a shared grid footprint to prevent planner jumps. Planner fields remain in place.

Changed Hero.js, heroBackdrop.js, components.css, tokens.css and heroMotion.test.js. Retained reduced-motion, focus, hidden-tab/offscreen pauses, loaded-image checks and cleanup; Escape within Hero stops rotation. Static non-opted-in Heroes remain static. Added regression for copy/photo synchronization, wraparound, skipping unloaded photos, reduced motion, Escape and cleanup; markup test confirms no pause button.

Validation: all 44 tests and production build pass; diff whitespace check passes. Final npm run check passes (ESLint and Prettier). No rendered browser comparison, commit, push or deployment. Existing unrelated work preserved. Next: inspect mobile/desktop slide transitions and line wrapping in the local preview. This supersedes the prior icon-control/crossfade description below.

## Current milestone — image-first pages and changing Hero

5 October 2026. Implemented locally: About/Gallery direct navigation; reusable short full-width photo banner for inner pages; 11 destination detail routes from existing records; cards, featured trips and planning tiles open detail pages; destination CTA carries visit name into draft enquiry without discarding notes. Existing safari results retain their own photo banner. About gains story/values/team chapter buttons and a shorter introduction; Gallery becomes a responsive one/two/three-column grid with the existing accessible viewer. Hero now rotates again at the latest request, with an icon-only pause/play control and existing reduced-motion/visibility/focus safeguards.

New files: PageBanner.js and DestinationPages.js. Updated main.js, Header/Hero/AboutPage/TourCard/Places/FeaturedTrips/Planning, responsiveRows, component CSS/tokens, tests. Existing unrelated dirty/staged work preserved. References inspected: Private Tours Cape Town About, Simba homepage (HTML), Thomson Serengeti article. Used structure and existing project imagery, not copied company claims. Three new image attachments mentioned by user were not present. Waterfall/Napur remain explicitly unconfirmed and use an illustrative banner.

Final validation: npm test passes 43/43, including new destination/banner checks and updated header-link expectations; production build passes. Earlier repeat run timed out in Vite during a temporary machine slowdown; stopped that run and obtained the clean final pass. Final npm run check passes (ESLint and Prettier). Source diff reviewed. No rendered browser/screenshot comparison performed. No commit/push/deployment. Next: open local preview and inspect #about, #photo-gallery and #place-serengeti at phone/tablet/desktop widths, exercise Back/Forward and confirm banner crops against the missing references when supplied.

## Latest correction — visible dots and full review text

Repeated user report prompted reinspection. Previous 4px pagination gap was between 44px wrappers, not the visible dots. Corrected to 4px between visible 8px indicators (28px active pill); buttons retain 44px height but narrow width, with large 44px previous/next controls as the primary touch alternative. Arrows remain vertically centered. This supersedes the earlier wrapper-gap note.

Homepage review cards now render full escaped text on every device instead of mobile Read more excerpts. Visible count distinguishes sample/local set; all available records remain uncapped in both layouts. Other review pages keep their prior expanders. Pending async question asks whether user is viewing local preview or published website; local changes have never been deployed. Device-local review storage can also yield different sets on separate devices; no backend is present.

This correction changes ReviewPreview.js and components.css plus notes. Final lint/format, all 42 tests and production build pass; no commit/push/deployment. Need rendered confirmation once browser access or current screenshots are available.

## Latest follow-up — all reviews and promise controls

User repeated request to show all What People Say reviews like desktop, center promise chevrons vertically, and use a 4px dot gap. Implemented: removed six-review render cap for both layouts; compact reviews now use a normal one-column grid below 640px and two columns through 1087px, with every card visible down the page rather than in a swipe rail. Excluded review track from swipe helper and remove tabindex on compact layout, restoring it for desktop motion/reading pause. Sample/local disclosures remain.

Promise chevrons now sit at top:50% with vertical centering on compact layouts, visible at both edges. Content reserves side space to prevent overlap. Dots center at the bottom; shared --promise-dot-gap is 4px (between button hit areas, which remain 44px on mobile). Desktop dot gap also uses this token.

Changed ReviewPreview.js, responsiveRows.js, components.css, tokens.css and website.test.js. Regression verifies eight saved reviews are present in compact and desktop modes. All 42 tests, lint/format and production build pass. Local only, no commit/push/deployment. Browser rendering remains unavailable; exact visual alignment still requires rendered verification. Next: inspect at 320/375/768/1024px, check arrow/content separation and all review cards.

## Latest follow-up — team screenshot

User supplied a stacked team design. Updated homepage team through 1087px: full-width white cards on brown, overlapping circular portraits with white rings/shadows, centered names/roles/copy, fluid gaps and rounded corners. Mike is now first in Guides.js (all renderings), then existing Ertines and Hyune. Kept existing identities, roles, biographies and approved images; did not reuse Mike's portrait for another person or copy placeholder prose.

Guides.js marks the homepage grid data-team-stack; responsiveRows.js excludes it from swipe semantics. About-page grids retain prior behavior. Components.css and tokens.css contain the scoped stack design. Wider desktop geometry remains unchanged. Lint/format and 42 tests pass; production build checked this turn. Visual render comparison remains pending. No commit/push/deployment.

Next: inspect portrait crops and vertical spacing at 320–1087px, confirm broader desktop remains intact. This reference supersedes the previous in-flow portrait/swipe-row treatment for the homepage team.

## Latest follow-up — full-page mobile reference

User requested removal of the pictured Hero Pause, matching the second full-page mobile mockup, and desktop-style reviews. Implemented: Hero button removed and controller creates no animation work without it; welcome features are a two-by-two grid; mobile tours use 92% swipe widths and 3:2 images; tighter tour headers and content-led promise height; reviews use two swipeable rows of unique white cards over the existing dark photo background. Sample disclosures and all existing content/prices/photos remain. Desktop reviews and their separate motion control remain unchanged.

Updated Hero.js, heroBackdrop.js, responsiveRows.js, components.css, tokens.css and tests/heroMotion.test.js. Welcome features no longer receive swipe-region semantics; reviews now receive keyboard scrolling. Tests pass 42/42. Final lint/format check and production build pass after the CSS-only copy-preservation adjustment. Browser visual comparison remains pending; no commit/push/deployment. Earlier Hero notes below describe the preceding state where they conflict.

## Latest objective and stopping point

User supplied a 371×735 mobile Hero mockup and asked to match its arrangement and smoothness. This supersedes Jambo's white planner styling for the phone Hero. Implemented source changes; visual rendering/sign-off still pending. No commit or push requested or made.

## Screenshot-led implementation

- Compact translucent homepage header, smaller logo and white icon-only menu. Menu's changing Menu/Close text remains available to assistive technology; tap target remains 44px.
- Centered two-line safari headline, compact introduction spacing, glass planner with three equal columns and a full-width white Start planning button. Fields keep 44px targets and 16px values; labels are 12px. Long selected values ellipsize in existing custom dropdowns.
- Existing Explore/Connect/Discover content now sits in three aligned columns between thin rules. Review preview row and wide white reviews button follow; scroll cue is visually last. Existing animation pause control remains accessible.
- WhatsApp hidden in the phone Hero and provided via the same ContactPrompt in the mobile footer. Desktop Hero contact remains, footer duplicate hidden above 767px.
- Glass panel uses bounded 8px backdrop blur when supported and an opaque fallback otherwise. Reduced-motion rules continue to apply.
- Preserved safari copy and factual/sample disclosures: furniture text, Wood options, 420+/100%/32 and 99.4% claims in the mockup were not introduced as business facts. Readable fonts/touch sizes may make the Hero taller than the screenshot; no forced clipping/height cap.
- Earlier card/gallery/section refinements remain. New application changes: src/styles/components.css, src/styles/tokens.css, src/components/Footer.js. Handoff/progress/review docs updated.

## Checks and limitations

Fresh npm run check, npm test (41/41) and npm run build pass. User attachment was visually inspected in conversation; it is a target design, not a render of the changed implementation. No browser comparison is claimed. Historical browser-launch policy rejection remains recorded; no workaround attempted.

## Next concrete step

Render the new Hero at 320, 360, 371/375, 390, 412 and tablet/desktop widths; compare screenshot spacing/crop and verify menu, three-field dropdowns, keyboard focus, footer WhatsApp and reduced motion. All-nine-width broader review remains outstanding. Preview: npm run dev, http://127.0.0.1:5173/. Preserve unrelated staged/unstaged/untracked work.

## Preserved prior requests and pending items

- Shared tour/Places/listing cards have exactly three feature items in one row, explicit per-person units on confirmed paid prices, No visit fee wording for Markets, and no Not yet rated text.
- User explicitly approved varied sample star ratings: `src/data/tourRatingSamples.js` defines 11 preview scores; five SVG stars and visible Sample rating labels must remain until genuine review data is supplied. Never publish these as real review aggregates/schema.
- Serval retains the main zebra photo and 150K / per person. Thumbnail strip removed at user request; original files preserved.
- Waterfall and Napur show $120 / per person. Identities are still unconfirmed: pending question asks whether they mean Materuni and Napuru. Candidate photos remain in ignored release-artifacts; do not insert a wrong location. Materuni candidate requires CC BY-SA attribution; Napuru candidate is CC0.
- Market, school and street visits have no visit fee. School visits require advance arrangements; transport/purchases/gifts are separate.
- Places starts with Chemka / Serval / Arts & Culture, expands to Waterfall / Napur / Markets and collapses back to three.
- Local preview uses fixed loopback ports 5173 dev / 4173 production preview. README records network-error recovery. Earlier broader Gallery goal was blocked on browser evidence; this new reference supersedes its design.
