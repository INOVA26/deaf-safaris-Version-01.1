# Destination discovery section

The section immediately below the Hero follows the supplied reference: centred introduction, square icon-and-label destination buttons, a wide photograph, and an overlapping information card. The section uses square corners throughout. Kilimanjaro appears first, followed by Serengeti, Ngorongoro, Tarangire, Arusha National Park, Chemka Hot Springs and arts-and-culture inspiration at Arusha Cultural Heritage Centre. Content is maintained in `src/data/destinations.js`; markup and tab interaction are in `src/components/Destinations.js`.

The introduction addresses Deaf travellers, signing families and friends. Signing, written communication, pace and group preferences are invitations to shape a personal brief. They do not promise interpreters, specific sign languages, accessible routes, confirmed itineraries or bookable services. **Add to my safari** selects the destination in the existing planner while retaining its other choices.

## Geographic references

Checked on 14 September 2026:

- [TANAPA national parks](https://tanzaniaparks.go.tz/nationalparks): Tanzania national park context, including Serengeti.
- [TANAPA: Kilimanjaro](https://www.tanzaniaparks.go.tz/kilimanjaro/about): Africa’s highest mountain. Route suitability and support are left for individual discussion.
- [TANAPA: Tarangire](https://www.tanzaniaparks.go.tz/tarangire/about): elephants and baobab landscapes, supported by the official page’s indexed description.
- [Ngorongoro Conservation Area Authority](https://www.ncaa.go.tz/): the volcanic crater and wildlife, supported by the official site’s indexed description.
- [TANAPA: Arusha Meru Geopark](https://www.tanzaniaparks.go.tz/geoparks): Mount Meru, the Momella Lakes and surrounding landscapes.
- [Tanzania Tourism: Rundugai Hot Springs](https://www.tanzaniatourism.com/destination/rundugai-hot-springs): Chemka / Kikuletwa springs. The section presents Chemka as a springs-and-nature idea, not a wildlife park.
- [Arusha Cultural Heritage Centre](https://culturalheritagetz.com/visit/): art and craft context. No guided visit, interpreting service or opening schedule is promised by this preview.

No wildlife sighting, seasonal availability, journey duration or price is promised.

## Imagery and interaction

Each destination has three distinct Wikimedia Commons photographs downloaded locally and visually inspected. The opening image is an aerial photograph of Kilimanjaro. File, title, author, source and licence records are stored in `src/data/destinationPhotoCredits.json` and rendered in the Footer’s photography credits. English alternative text and photo sequence are defined in `src/data/destinationPhotos.js`. There are 21 images, approximately 6.55 MB in total; panels load their images as they are selected. Existing Hero assets and their provenance notes remain unchanged.

Tabs work with click, Enter/Space, Left/Right arrows and Home/End. Only the selected panel is visible. Each photo has a gentle zoom and crossfade; after three 6.5-second photo intervals, playback advances to the next destination and eventually wraps to Kilimanjaro. Automatic changes never move keyboard focus or announce each change. Three clickable image thumbnails replace the previous dot/line indicators. The top counter and navigation bar have been removed; a compact pause/play icon remains in the image corner, with an accessible label and tooltip. Interest-list icons use consistent strokes and square backgrounds in aligned rows.

Playback pauses while hovered, keyboard focus is within the section, the page is hidden, or the section is offscreen. Explicit pause survives visibility changes. Reduced-motion preferences disable autoplay and CSS animation; manual controls still work. The playback module clears timers and event listeners during hot reload. Buttons wrap on smaller screens, with consistent icon sizes and centred text. New style tokens are scoped to destination discovery.
