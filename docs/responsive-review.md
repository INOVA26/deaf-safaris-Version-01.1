# Responsive implementation and remaining browser review

4 October 2026. Local changes only; no commit or push for this task.

## Implemented changes

- Foundation: viewport-fit=cover was already present; added pseudo-element border-box and intrinsic media/form/grid constraints. Dynamic viewport units and safe-area gutters retained/restored. No html/body horizontal-overflow hiding.
- Header/Hero: compact navigation through 1087px, 180ms interruptible transitions, inert closed links, instant initialization/resize, 44px or larger controls. Existing link-click/Escape/outside-click closing remains. Captions now at least 12px, main copy 16px on small screens. Planner stacks on phones. The WhatsApp label and mobile contact entry occupy real layout space rather than covering controls.
- Cards: native scroll-snap phone rows with 84% cards and next-card preview. Named keyboard regions support arrows/Home/End. Tours, destinations, featured trips, welcome features, team, About values/pillars/gallery, planning tiles, photo gallery, reviews and results receive responsive layouts. Tablet collections use two columns where appropriate; desktop layout rules are retained.
- Reviews: phones/tablets display real unique cards without decorative motion copies. Long stories have phone-only Read more/Read less; all original text remains. Desktop animation/layout remains available.
- Performance: removed expensive mobile backdrop filters/photo blur, used 180–220ms interaction/reveal motion, retained reduced-motion behavior, and stopped mobile/tablet review animation frames. Added lazy loading to hidden About imagery and secondary Hero images, plus missing intrinsic image dimensions. The first Hero photo remains high priority.
- Source review corrected negative promise-heading margins, fixed-width result photos inside tablet grid cells, insufficient dot/close-button touch sizes and narrow file-input sizing. These are source findings, not proof of the original white-strip cause.

## Image weight

- Active zebra photo: 2,153,541-byte PNG replaced in delivery by 396,819-byte JPEG (81.6% smaller). Same 900 × 1600 dimensions; original retained.
- Logo: 471,608-byte 1774 × 887 PNG replaced in delivery by a proportional 512 × 256 transparent PNG, 49,318 bytes (89.5% smaller). Original retained.
- Remaining larger delivered images: tarangire-2.jpg ~557 KB, serengeti.jpg ~543 KB, chemka-2.jpg ~477 KB, ngorongoro-2.jpg ~465 KB, tarangire-3.jpg ~411 KB. These remain candidates for a future approved WebP/AVIF asset pipeline.
- Serval welcome-sign/giraffe-resting/giraffe-feeding PNGs are ~2.2–2.4 MB each, but are not imported into the current production build. Do not confuse repository size with downloaded page weight.
- No WebP encoder, Pillow, ImageMagick or ffmpeg was available. Used Windows' built-in encoder without adding a dependency. No WebP conversion is claimed.

## Validation and limitations

Implementation is not visually signed off. Earlier automatic approval review rejected browser launching, no browser tool is available, and no running remote-debugging browser was found. No workaround was used. A source fix or passing unit test does not establish zero horizontal overflow or visual quality at a particular width.

Requested widths still needing rendered verification: **320, 360, 375, 390, 412, 768, 1024, 1280, 1536px**. All nine remain unverified in device mode.

A dependency-free local browser audit is available in `scripts/responsive-audit.js`. It creates temporary same-origin iframes at all nine widths, visits Home/About/Explore/Planning/Photos/Reviews/Enquiries/Results, checks root scrolling and candidate overflow elements, captions under 12px, button targets under 44px and clipped Menu buttons, with the mobile menu both closed and open. It returns JSON locally and removes the frames. It does not send data externally. **The script has not been run in a browser here.**

Run in the developer console while the local site is open:

```js
const { auditResponsive } = await import('/scripts/responsive-audit.js');
const responsiveReport = await auditResponsive();
console.log(responsiveReport);
```

Then manually check each width in device mode: initial viewport and right edge; Menu open/link close/Escape; every swipe row and final card; Places expansion; planner submission/back; review stars/read-more/media previews; footer/contact controls; focus visibility; image crops; safe areas; 200% zoom; reduced motion; and simulated slow-network loading. Verify desktop screenshots at 1280/1536 against the pre-change version. The iframe audit cannot substitute for actual touch, safe areas, rendering/crop quality or a designer review.

## Files changed

- Layout and tokens: `src/styles/global.css`, `src/styles/tokens.css`, `src/styles/components.css`.
- Navigation/rails: `src/components/Header.js`, `src/utils/mobileMenu.js`, `src/utils/responsiveRows.js`, `src/utils/galleryCarousel.js`, `src/main.js`.
- Review behavior/content presentation: `src/components/ReviewPreview.js`, `ReviewCards.js`, new `ReviewText.js`.
- Image loading/delivery: `Hero.js`, `AboutPage.js`, `GalleryResources.js`, `PromiseBanner.js`, `SafariResults.js`, `Places.js`, `Brand.js`, `Footer.js`, `Guides.js`; two new delivery images noted above.
- Verification: `tests/responsive.test.js`, `tests/website.test.js`, `package.json`, `scripts/responsive-audit.js`.
- Continuity and provenance: this document, `docs/handoff.md`, `docs/progress.md`, `docs/photo-credits.md`.

## Local preview commands

From the repository root:

```powershell
npm run dev
```

Open http://127.0.0.1:5173/ . Reuse an already running verified server; the port is intentionally fixed.

For a production preview:

```powershell
npm run build
npm run preview
```

Open http://127.0.0.1:4173/ . Check code and tests with `npm run check` and `npm test`.

No brand/content decision is needed to continue. Remaining input is browser evidence and visual confirmation; a future WebP pipeline can be a separate tooling decision.

## 5 October continuation

- Fresh automated suite passes 41/41. Added phone Gallery stationary-reading/breakpoint coverage and results-row keyboard scrolling across filter rerenders.
- Phone Gallery uses manual dots while its cards use native scrolling. Automatic slide changes resume above the phone breakpoint, subject to existing reading/reduced-motion pauses.
- Shared mobile gutters now apply through 1087px; review rows reuse the safe-area-aware tour gutter for alignment. This affects reference containers/header/Hero/footer at 1024–1087px; wider desktop rules remain intact.
- All nine rendered widths remain unverified. Existing Edge processes are not exposed as remote-debug browser sessions; no browser tool is available. Historical launch rejection has not been bypassed.

The audit now also records expanded Places, all Gallery slide selections, visible swipe rows scrolled to their final card, and page bottom with the compact header. Its eight routes were checked against main.js. Script lint/syntax checks pass; these do not establish browser execution or visual completion. It still requires manual checking of the earlier Gallery slides' individual card ends, actual touch, image loading, keyboard focus and zoom.

## Mobile composition redesign after user feedback — 5 October

Team and footer now use the shared container edges. Phone Hero/section headings align left, cards share padding/radii, Gallery uses consistent 4:3 image-above-content cards, and team portraits sit inside their cards. Swipe rows remain 84%. Footer uses one column below 480px and two columns through 1087px. Wider desktop styling remains outside the new overrides.

Fresh check/test/build pass (41 tests). This is a new visual revision; earlier screenshots would not verify it. All requested rendered-width checks remain pending. Preview with npm run dev at http://127.0.0.1:5173/.

## Jambo reference revision — 5 October

The user's https://jambo.team/ reference supersedes the previous left-aligned mobile headings. Its live HTML/CSS was inspected, confirming centered Hero alignment, restrained text width, generous section spacing and rounded cards. Adapted those principles to phone Hero/section headers, a white planner panel, 38ch text widths, quieter card shadows and consistent spacing. Brand/content/swipe rows remain. Check/test/build ran successfully; source inspection is not rendered visual verification.

## Latest mobile Hero mockup — 5 October

The attached 371×735 user design supersedes the white Jambo-inspired phone planner. Current Hero uses a compact icon-menu header, centered title, glass three-column planner, white CTA, ruled three-column highlights, review row/button and bottom scroll cue. Phone WhatsApp is in the footer. Safari copy replaces the mockup's furniture placeholders; numeric business/review claims remain unconfirmed and were not inserted. Minimum readable text/tap targets are preserved, so height may exceed the reference. Fresh check/test/build pass (41 tests); actual rendered matching is pending.
