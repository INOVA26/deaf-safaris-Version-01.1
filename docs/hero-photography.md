# Hero photography

The homepage uses locally hosted acacia-sunset, elephant, and giraffe photographs from Pexels in both the Hero carousel and inspiration section. See [photo credits](photo-credits.md) for authors, source pages, sizes, and licence details.

Image imports, dimensions, and alternative text live in `src/data/photos.js`. Files live in `src/assets/images/`. The user-supplied logo remains in `Images/`.

Each Hero scene specifies its crop position in `src/components/Hero.js`. The main heading sits over the photograph with a graduated dark overlay for contrast. Planning controls use tinted translucent glass; captions sit in an unboxed footer. Source images have been visually inspected, but browser-based mobile and desktop crop verification remains outstanding because browser control was unavailable.

These are stock inspiration images, not representations of confirmed company tours. Replace them with approved business photography when available. When replacing an image, check the subject at mobile, tablet, and desktop widths, update its alternative text, and retain any required attribution.

The attached travel-page reference guides the panoramic Hero composition, centred heading, and planning bar. The subsequent screenshot feedback led to removing the supporting image card and reducing opaque surfaces.
