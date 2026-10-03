import { featuredPhotos as photos } from '../data/companyPhotos.js';
import { initGalleryMotion } from '../utils/galleryMotion.js';

export function FeaturedSafari() {
  return `<section class="featured-safari" id="featured-safari" aria-labelledby="featured-safari-heading" data-motion="paused">
    ${photos.map((background, index) => `<img class="featured-safari__backdrop${index === 0 ? ' is-active' : ''}" data-featured-background src="${background.src}" alt="" width="1280" height="853" loading="lazy" decoding="async" />`).join('')}
    <div class="container featured-safari__layout">
      <div class="featured-safari__copy">
        <h2 id="featured-safari-heading">Discover the Wild Heart of Tanzania</h2>
        <p class="featured-safari__description">From open savannahs to the slopes of Kilimanjaro, discover Tanzania at your own pace. Start your next adventure with Deaf Safaris.</p>
        <a class="button featured-safari__plan" href="#traveller-destinations">Explore Now</a>
      </div>
    </div>
  </section>`;
}

export function initFeaturedSafari(
  root = document.querySelector('#featured-safari'),
  _onPlan,
  { clock = window, page = document } = {},
) {
  if (!root) return () => {};
  const backgrounds = [...root.querySelectorAll('[data-featured-background]')];
  let active = 0;
  const motion = initGalleryMotion(
    root,
    () => {
      const next = (active + 1) % backgrounds.length;
      if (!backgrounds[next]?.complete || !backgrounds[next].naturalWidth) return;
      backgrounds[active].classList.remove('is-active');
      backgrounds[next].classList.add('is-active');
      active = next;
    },
    { clock, page },
  );
  return () => motion.dispose();
}
