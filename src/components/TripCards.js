import { destinations } from '../data/destinations.js';
import { TourCard } from './TourCard.js';

export function TripCards() {
  return `<section class="reference-trips" id="destinations" aria-labelledby="tour-heading">
    <header class="reference-trips__heading"><h2 id="tour-heading">All Tour &amp; Destination</h2><a href="#traveller-destinations">See More Tours <span aria-hidden="true">→</span></a></header>
    <div class="reference-trip-grid">${['kilimanjaro', 'ngorongoro', 'serengeti']
      .map((id) => TourCard(destinations.find((place) => place.id === id)))
      .join('')}</div>
  </section>`;
}

export function initTripCards(chooseDestination) {
  const onClick = (event) => {
    const link = event.target.closest('[data-trip-destination]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    chooseDestination(link.dataset.tripDestination);
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
