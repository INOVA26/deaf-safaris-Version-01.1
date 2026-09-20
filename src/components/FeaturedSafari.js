import { featuredPhotos as photos } from '../data/companyPhotos.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { initGalleryMotion } from '../utils/galleryMotion.js';

const photo = photos[0];
const icon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export function FeaturedSafari() {
  return `<section class="featured-safari" id="featured-safari" aria-labelledby="featured-safari-heading" data-motion="paused">
    ${photos.map((background, index) => `<img class="featured-safari__backdrop${index === 0 ? ' is-active' : ''}" data-featured-background src="${background.src}" alt="" width="1280" height="853" loading="lazy" decoding="async" />`).join('')}
    <svg class="featured-safari__masks" width="0" height="0" aria-hidden="true" focusable="false"><defs>
      <clipPath id="featured-photo-mask" clipPathUnits="objectBoundingBox"><path d="M .545 .005 C .755 .005 .88 .09 .959 .259 C 1.04 .447 1.02 .664 .886 .823 C .798 .937 .651 1.008 .54 .99 C .40 .97 .358 .861 .31 .725 C .257 .586 .221 .493 .127 .449 C .079 .425 .026 .421 .031 .344 C .037 .248 .144 .138 .253 .072 C .345 .021 .445 .005 .545 .005 Z" /></clipPath>
      <clipPath id="featured-mint-mask" clipPathUnits="objectBoundingBox"><path d="M .263 .627 C .25 .71 .225 .832 .255 .891 C .288 .962 .389 .978 .49 .981 L .65 .9 .43 .59 Z" /></clipPath>
      <clipPath id="featured-sand-mask" clipPathUnits="objectBoundingBox"><path d="M .04 .39 C .005 .455 -.013 .545 .009 .587 C .026 .618 .061 .625 .118 .626 C .175 .627 .218 .644 .263 .665 L .40 .49 .10 .32 Z" /></clipPath>
    </defs></svg>
    <div class="container featured-safari__layout">
      <div class="featured-safari__art">
        <div class="featured-safari__shape featured-safari__shape--mint" aria-hidden="true"></div>
        <div class="featured-safari__shape featured-safari__shape--sand" aria-hidden="true"></div>
        <figure class="featured-safari__portrait">
          ${photos.map((frame, index) => `<div class="featured-safari__frame${index === 0 ? ' is-active' : ''}" data-featured-frame aria-hidden="${index !== 0}"><img src="${frame.src}" alt="${escapeHtml(frame.alt)}" width="1280" height="853" loading="lazy" decoding="async" /></div>`).join('')}
        </figure>
        <span class="featured-safari__photo-note">A glimpse of Tanzania</span>
      </div>
      <div class="featured-safari__copy">
        <p class="featured-safari__eyebrow">Your next safari story</p>
        <h2 id="featured-safari-heading">The wild heart<br />of <em>Tanzania.</em></h2>
        <p class="featured-safari__location">${icon('<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>')}<span>Wildlife inspiration from Deaf Safaris</span></p>
        <p class="featured-safari__description">Elephants beneath baobabs. Golden light across the grasslands. Imagine a day with time to watch, connect and take it all in.</p>
        <p class="featured-safari__invitation">Tell us your pace and signing preferences. Let’s shape your safari together.</p>
        <div class="featured-safari__actions">
          <a class="button featured-safari__plan" href="#hero-planner" data-featured-plan>Plan my safari ${icon('<path d="M5 12h14m-6-6 6 6-6 6"/>')}</a>
          <div class="featured-safari__utilities">
            <a class="button featured-safari__icon-link" href="#destinations" aria-label="Explore all destinations"><span class="featured-safari__tooltip" aria-hidden="true">Explore destinations</span>${icon('<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>')}</a>
            <a class="button featured-safari__icon-link" href="${escapeHtml(photo.source)}" aria-label="Photos from Deaf Safaris"><span class="featured-safari__tooltip" aria-hidden="true">Deaf Safaris photos</span>${icon('<path d="m8 6 2-3h4l2 3h3a2 2 0 0 1 2 2v11H3V8a2 2 0 0 1 2-2Z"/><circle cx="12" cy="12" r="3.5"/>')}</a>
          </div>
        </div>
        <p class="featured-safari__note">Journey inspiration · itinerary and signing support to be confirmed.</p>
      </div>
    </div>
  </section>`;
}

export function initFeaturedSafari(
  root = document.querySelector('#featured-safari'),
  onPlan,
  { clock = window, page = document } = {},
) {
  if (!root) return () => {};
  const link = root.querySelector('[data-featured-plan]');
  const plan = (event) => {
    if (!onPlan || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    onPlan('Tarangire');
  };
  link.addEventListener('click', plan);
  const backgrounds = [...root.querySelectorAll('[data-featured-background]')];
  const frames = [...root.querySelectorAll('[data-featured-frame]')];
  let active = 0;
  const motion = initGalleryMotion(
    root,
    () => {
      const next = (active + 1) % backgrounds.length;
      const nextImage = frames[next].querySelector('img');
      if (
        !backgrounds[next].complete ||
        !backgrounds[next].naturalWidth ||
        !nextImage.complete ||
        !nextImage.naturalWidth
      )
        return;
      backgrounds[active].classList.remove('is-active');
      backgrounds[next].classList.add('is-active');
      frames[active].classList.remove('is-active');
      frames[active].setAttribute('aria-hidden', 'true');
      frames[next].classList.add('is-active');
      frames[next].setAttribute('aria-hidden', 'false');
      active = next;
    },
    { clock, page },
  );
  return () => {
    link.removeEventListener('click', plan);
    motion.dispose();
  };
}
