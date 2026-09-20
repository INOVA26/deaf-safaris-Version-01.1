# Photo credits

## Destination galleries — 14 September 2026

The discovery gallery uses three photographs for each of seven destinations. Eighteen are from the existing 21-image Wikimedia Commons collection in `src/assets/images/destinations/`; three lead images now come from the Deaf Safaris website, as documented below. Full Commons source, author and licence records are in `src/data/destinationPhotoCredits.json` and are also displayed in the website Footer. Each gallery image links to its source. Commons files are generated thumbnails, displayed with CSS cropping and zoom; the source photographs retain their stated Creative Commons or public-domain terms. The gallery assets do not imply confirmed tour availability or photographer endorsement.

The gallery replaces the former illustrative Ngorongoro sunset with photographs identified by their Commons sources as Ngorongoro. Kilimanjaro is shown first. All 21 local files were visually inspected before delivery. Gallery order and descriptive alternative text are in `src/data/destinationPhotos.js`.

## Deaf Safaris website gallery images — 16 September 2026

Downloaded from the user-requested website, visually inspected, and served locally from `src/assets/images/deaf-safaris/`. Source records are in `src/data/companyPhotos.js`. These files are reused at the user's request; the source website does not identify their original photographers or licence terms. No Creative Commons licence is assigned to them.

- `tarangire-elephants.png`: `https://deafsafaris.co.tz/assets/images/background/elephants%20tarangire.png` — used for Tarangire and the featured wildlife gallery.
- `giraffe.png`: `https://deafsafaris.co.tz/assets/images/background/giraffe.png` — featured wildlife gallery.
- `impala.png`: `https://deafsafaris.co.tz/assets/images/background/impala.png` — featured wildlife gallery; described generically as an antelope rather than relying on the filename for species identification.
- `arusha-giraffe.png`: `https://deafsafaris.co.tz/assets/images/background/giraffe%20arusha%20national%20park.png` — Arusha destination gallery.
- `kilimanjaro-lemosho.jpg`: `https://deafsafaris.co.tz/assets/images/background/lemosho.jpg` — Kilimanjaro destination gallery.

The featured heading now refers to Tanzania because not all featured wildlife photographs are identified as Tarangire. Existing licensed destination photographs remain alongside the three specifically matched website photographs.

## Existing stock and Hero imagery

These are stock inspiration photographs, not images of confirmed Deaf Safaris itineraries, staff, or services. Source pages and the [Pexels licence](https://www.pexels.com/license/) were checked on 10 September 2026. Files are served locally, so viewing the website does not request images from Pexels.

- `src/assets/images/savannah-sunset.jpg`: [Sunset in African Savannah Landscape](https://www.pexels.com/photo/sunset-in-african-savannah-landscape-30878973/) by Wussol. Used for the Hero and landscape inspiration card. Pexels compressed download, 1125 × 750, approximately 149 KB.
- `src/assets/images/safari-elephants.jpg`: [Elephants on a Safari](https://www.pexels.com/photo/elephants-on-a-safari-17212851/) by Athuman Komora Garisse. Pexels compressed download, 1125 × 750, approximately 193 KB.
- `src/assets/images/savannah-giraffes.jpg`: [Giraffes on Savanna](https://www.pexels.com/photo/giraffes-on-savanna-17849766/) by Mike Knibbs. Pexels compressed download, 900 × 1361, approximately 248 KB.

Images are resized by Pexels and displayed with CSS cropping. The Hero adds a dark overlay for readability. No photographer endorsement is implied. Visible credit links are available in the Footer.

The logo in `Images/images_Logo.jpg` was supplied and approved by the user. It is not a stock photograph.

## Expedition hero reference assets — 13 September 2026

Copied from the local reference project's `public/images/` in `Documents/Deaf Safars 1.0 version/deaf-safaris`:

- `src/assets/images/team-group.jpeg`: group holding a Deaf Safaris banner at the Kilimanjaro summit sign; Hero background.
- `src/assets/images/serengeti.jpg`: four giraffes on grassland; Serengeti draft expedition card.
- `src/assets/images/kilimanjaro.jpg`: tent below Kilimanjaro's snowy slopes; Kilimanjaro draft expedition card.

These retain their reference filenames. Their original photographer and licensing details were not included in the reference component and remain to be confirmed before publication. The reference's `ngorongoro.jpg` showed a climber in snow, so it was not copied; that card instead uses the licensed sunset photo above, explicitly labelled as illustrative safari inspiration. The original sunset photo also remains in the landscape inspiration section.
