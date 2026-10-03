import { destinations } from '../data/destinations.js';
import { TourCard } from './TourCard.js';

const categories = {
  kilimanjaro: 'Mountain',
  serengeti: 'National parks',
  ngorongoro: 'Crater',
  tarangire: 'National parks',
  arusha: 'National parks',
  chemka: 'Hot springs',
  culture: 'Culture',
};
const filters = ['All places', ...new Set(Object.values(categories))];

export function DestinationListings() {
  return `<section class="explore-places section-space" id="traveller-destinations" aria-labelledby="destination-listings-heading">
    <div class="container">
      <header class="explore-places__heading"><div><h2 id="destination-listings-heading">All Tours &amp; Destinations</h2><p>Discover Tanzania's landscapes, cultures and unforgettable adventures.</p></div><a class="button button--outline" href="#destinations">Back to tours <span class="material-symbols-rounded" aria-hidden="true">arrow_back</span></a></header>
      <div class="explore-places__filters" role="group" aria-label="Filter destinations">${filters.map((filter, i) => `<button type="button" data-place-filter="${filter}" aria-pressed="${i === 0}" aria-controls="destination-listings-track">${filter}</button>`).join('')}</div>
      <p class="sr-only" data-place-count role="status"></p>
      <div class="reference-trip-grid reference-trip-grid--listing" id="destination-listings-track">
        ${destinations
          .map((place, i) =>
            TourCard(place, { category: categories[place.id], hidden: i > 5 }),
          )
          .join('')}
      </div>
      <div class="explore-places__more"><button class="button button--outline" type="button" data-places-more aria-expanded="false" aria-controls="destination-listings-track">Show all places <span class="material-symbols-rounded" aria-hidden="true">expand_more</span></button></div>
    </div>
  </section>`;
}

export function initDestinationListings(
  root = document.querySelector('#traveller-destinations'),
  onChoose,
) {
  const cards = [...root.querySelectorAll('[data-listing-destination]')];
  const buttons = [...root.querySelectorAll('[data-place-filter]')];
  const more = root.querySelector('[data-places-more]');
  const status = root.querySelector('[data-place-count]');
  let filter = 'All places';
  let expanded = false;
  function render() {
    const matching = cards.filter(
      (card) => filter === 'All places' || card.dataset.placeCategory === filter,
    );
    cards.forEach((card) => {
      card.hidden =
        !matching.includes(card) || (!expanded && matching.indexOf(card) >= 6);
    });
    buttons.forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.placeFilter === filter),
      ),
    );
    more.hidden = matching.length <= 6;
    more.setAttribute('aria-expanded', String(expanded));
    more.innerHTML = `${expanded ? 'Show fewer places' : 'Show all places'} <span class="material-symbols-rounded" aria-hidden="true">${expanded ? 'expand_less' : 'expand_more'}</span>`;
    status.textContent = `${Math.min(matching.length, expanded ? matching.length : 6)} of ${matching.length} places`;
  }
  function click(event) {
    const filterButton = event.target.closest('[data-place-filter]');
    if (filterButton) {
      filter = filterButton.dataset.placeFilter;
      expanded = false;
      render();
      return;
    }
    if (event.target.closest('[data-places-more]')) {
      expanded = !expanded;
      render();
      return;
    }
    const link = event.target.closest('[data-listing-link]');
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
    onChoose(link.dataset.listingLink);
  }
  render();
  root.addEventListener('click', click);
  return () => root.removeEventListener('click', click);
}
