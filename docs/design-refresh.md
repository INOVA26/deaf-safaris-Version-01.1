# Modern design refresh — 11 September 2026

The navigation takes structural inspiration from [Jambo.team](https://jambo.team/): a translucent white fixed bar, simple links with an underline interaction, and a compact floating shape after scrolling. Deaf Safaris keeps its own branding, safari content, and enquiry action. The reference's public markup and header styles were inspected; visual browser comparison was unavailable.

The page now uses a white background and locally hosted Inter. Shared display typography also uses Inter, so this update affects all section headings and controls. The source font is [Inter 4.1 by Rasmus Andersson](https://rsms.me/inter/), stored at `src/assets/fonts/InterVariable.woff2`; its SIL Open Font License is included as `Inter-LICENSE.txt`. There is no runtime font-CDN request.

## Hero behaviour

- The full accessible heading remains available while the visual line types, holds, and deletes “Beyond Words.”, “Into the Wild.”, and “At Your Pace.” in a repeating cycle. Screen readers receive the stable original heading.
- Three local photographs crossfade every 6.5 seconds. Buttons select a scene directly; only manual selection announces a change to screen readers.
- Auto-rotation stops while the photo panel is hovered or contains keyboard focus. It also stops when the page is hidden, the hero leaves the viewport, or reduced motion is requested.
- Pause animations stops auto-rotation and the mouse-scroll indicator and completes any unfinished typing. The user's pause choice is retained when visibility changes.
- Reduced-motion preferences suppress typing, automatic slides, CSS animation, and transitions. Manual scene controls remain available.
- The hero cleans up timers, event handlers, and its visibility observer during Vite hot replacement.

## Glass Hero revision after screenshot feedback

The two large pale cards were removed. A single tinted glass planning panel now sits over a wider photograph, with scene information and controls in a slim, unboxed footer. The overlay is lighter around the landscape, while the central heading and lower controls retain darker backing. Inter headings use a lighter weight and more natural letter spacing.

Dedicated photo-glass tokens provide a translucent tint, diagonal highlights, a fine border, inset reflection, shadow, and backdrop blur. The existing white navigation and other section styles retain their original tokens. Browsers without backdrop-filter receive a readable dark-panel fallback. Desktop Hero gutters remain 80px; its wider maximum width allows more of the landscape to fill large screens.

The complete heading is visible on arrival. Phrases hold for 4.2 seconds before deletion and retyping, with a shorter empty interval. Pause and reduced-motion behaviour remain intact. Mobile controls stay in normal flow and wrap without overlapping the heading.

Lint, formatting, all seven tests, and production build passed. Browser automation was unavailable for this revision; mobile and desktop screenshot verification remains outstanding.

## Transparent logo

The original user file remains at `Images/images_Logo.jpg`. The transparent PNG used by Header and Footer is `src/assets/images/deaf-safaris-logo-transparent.png` (1774 × 887). It was produced with the built-in image editing tool and inspected against a white background; the PNG corner alpha was confirmed as zero.

Final image-edit prompt:

> Use case: background-extraction. Edit target: supplied Deaf Safaris logo. Remove ONLY the flat off-white/light grey background and produce a PNG with real alpha transparency, not a checkerboard painted into the image. Preserve the exact existing black elephant, all facial details and white negative-space details, raised trunk, water drops, thin vertical separator, bird and acacia branch, exact black text DEAF and pale sand text SAFARIS, shapes, lettering and proportions. This is background removal, NOT a logo redesign. Do not add, redraw, stylize or change any mark. Crop empty outer margins closely around the complete artwork with a small transparent safety margin. Keep all branch tips, tusks and feet fully inside the canvas. Transparent background.

## Reference-inspired layout and visitor reviews

The attached travel reference guided the first panoramic Hero with centred typography and a planning bar. The subsequent glass revision above replaces its oversized cards. The existing navigation, Inter font, transparent logo, and factual safari content are retained.

Shared section spacing is now 80px. At desktop widths of 1024px and above, page gutters are 80px, with a maximum content width of 1280px. Smaller screens use 16px gutters and stacked planning controls. These shared spacing tokens affect every homepage section.

The Hero planning bar transfers the visitor's interest and group size to the existing brief form. It does not perform a destination search or create a booking.

`Reviews.js` provides a labelled 1–5 rating, optional display name and title, and a required review. Visitors can preview their words and download a plain-text copy. User content is rendered with `textContent`. There are no seeded testimonials or aggregate ratings. Reviews are not submitted, stored, or published; that requires an approved service and a decision about moderation.

Seven automated tests cover page links and labels, brief generation, review validation and export, the typing cycle, and Hero motion policy. Linting, formatting, tests, and production build passed for this update. The existing local preview returned HTTP 200.

## Browser review still needed

Browser control was unavailable. Check the white header and logo at 320, 768, and 1440 pixels; verify keyboard focus and Escape in the mobile menu; test manual/automatic image changes and Pause; and inspect the glass panel contrast over each photo. The event/timer tests cover motion policy but do not replace visual or assistive-technology testing.
