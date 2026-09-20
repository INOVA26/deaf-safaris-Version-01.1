import { destinations } from '../data/destinations.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { initHorizontalCarousel } from '../utils/horizontalCarousel.js';

const categories = {
  kilimanjaro: 'Mountain',
  serengeti: 'Wildlife',
  ngorongoro: 'Crater safari',
  tarangire: 'Wildlife',
  arusha: 'Nature',
  chemka: 'Hot springs',
  culture: 'Culture',
};

export function DestinationListings() {
  return `<section class="destination-listings" id="traveller-destinations" aria-labelledby="destination-listings-heading">
    <div class="container">
      <h2 id="destination-listings-heading">More places. More memories.</h2>
      <div class="destination-listings__track" id="destination-listings-track" data-carousel-track tabindex="0" role="region" aria-label="Tanzania destinations">
        ${destinations
          .map(
            (
              place,
            ) => `<a class="destination-listing" href="#hero-planner" data-listing-destination="${escapeHtml(place.name)}">
          <img src="${place.photos[0].src}" alt="${escapeHtml(place.photos[0].alt)}" width="640" height="850" loading="lazy" decoding="async" />
          <span class="destination-listing__category">${categories[place.id]}</span>
          <span class="destination-listing__name">${place.label || place.name}<span aria-hidden="true">&nearr;</span></span>
        </a>`,
          )
          .join('')}
      </div>
      <div class="destination-listings__footer">
        <a class="button button--primary" href="#destinations">View all destinations <span aria-hidden="true">&rarr;</span></a>
        <div class="carousel-controls">
          <button class="carousel-arrow" data-carousel-previous type="button" aria-label="Previous destinations" title="Previous destinations" aria-controls="destination-listings-track">&larr;</button>
          <button class="carousel-arrow carousel-arrow--next" data-carousel-next type="button" aria-label="Next destinations" title="Next destinations" aria-controls="destination-listings-track">&rarr;</button>
        </div>
      </div>
    </div>
  </section>`;
}

export function initDestinationListings(
  root = document.querySelector('#traveller-destinations'),
  onChoose,
) {
  const carousel = initHorizontalCarousel(root);
  const choose = (event) => {
    const link = event.target.closest('[data-listing-destination]');
    if (
      !link ||
      !onChoose ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    onChoose(link.dataset.listingDestination);
  };
  root.addEventListener('click', choose);
  return () => {
    root.removeEventListener('click', choose);
    carousel.dispose();
  };
}
