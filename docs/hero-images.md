# Homepage Hero Images

Replace `src/assets/images/hero-kilimanjaro.jpg` with your approved Kilimanjaro
photograph to change the opening background without editing the component.
Keep the filename and JPEG format. Prefer a landscape image at least 1920 pixels
wide, compressed below 600 KB. Rebuild and publish to update the live website.

The starter image is a copy of `src/assets/images/destinations/kilimanjaro-2.jpg`;
its existing source and licensing record remain in `src/data/destinationPhotos.js`.
It currently measures 1280 x 853 pixels. Do not remove the attribution record.

`src/components/Hero.js` defines the photo order and descriptive alternative text.
Update its alt text and dimensions when replacing the image. The mountain's focal
point is set by `.hero__background--mountain` in `src/styles/components.css`.

The slideshow changes photos every eight seconds. Each incoming photo zooms in
gently while the outgoing photo fades away. Pause, reduced-motion, hidden-tab,
off-screen, and keyboard-interaction states stop automatic motion.
