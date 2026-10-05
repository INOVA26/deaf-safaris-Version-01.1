import { destinations } from '../data/destinations.js';
import { places } from './Places.js';
import { escapeHtml as e } from '../utils/escapeHtml.js';

// Use the same approved records as the cards; do not invent itineraries or photos.
export const detailPlaces = [
  ...new Map([...destinations, ...places].map((place) => [place.id, place])).values(),
];

export function DestinationPages() {
  return detailPlaces
    .map(
      (
        place,
      ) => `<section class="destination-page" id="place-${e(place.id)}" aria-labelledby="place-${e(place.id)}-heading" hidden>
    <div class="container destination-page__layout">
      <article class="destination-page__story">
        <p class="eyebrow">Explore Tanzania</p>
        <h2 id="place-${e(place.id)}-heading">${e(`Discover ${place.name}`)}</h2>
        <p class="destination-page__lead">${e(place.description || place.eyebrow)}</p>
        ${place.photos?.[0] ? `<figure><img src="${e(place.photos[0].src)}" alt="${e(place.photos[0].alt)}" width="900" height="600" loading="lazy" /><figcaption>${e(place.name)} · Travel inspiration</figcaption></figure>` : '<p class="destination-page__notice">A photograph of this specific place is awaiting confirmation. The page banner is illustrative of Tanzania.</p>'}
        <h3>What draws you here?</h3>
        <ul class="destination-page__highlights">${place.highlights.map(([, label]) => `<li>${e(label)}</li>`).join('')}</ul>
        <h3>A journey shaped around you</h3>
        <p>Tell us what you would like to experience, your preferred travel dates and the pace that suits your group. Include your signing or written communication preferences so the arrangements can be discussed before you travel.</p>
        <p>Routes, transport, entry arrangements and support need confirmation with the team. This page is travel inspiration, not a confirmed itinerary.</p>
        ${place.id === 'markets-place' ? '<p>Markets, school visits and street walks have no visit fee. School visits require advance arrangements; transport, purchases and gifts are separate.</p>' : ''}
        <a class="text-link" href="#photo-gallery">See more Tanzania photographs →</a>
      </article>
      <aside class="destination-page__aside" aria-label="Plan this visit">
        <p class="eyebrow">Your next chapter</p><h2>Visit ${e(place.name)}</h2>
        <p>${e(place.id === 'kilimanjaro' ? '$1,850 / per person · Marangu route, 5–6 days' : place.priceLabel ? `${place.priceLabel}${place.priceUnit ? ` / ${place.priceUnit}` : ''}` : 'Price and arrangements to be confirmed.')}</p>
        <a class="button button--dark" href="#enquiries" data-place-brief="${e(place.name)}">Plan this visit</a>
        <a class="text-link" href="#traveller-destinations">Explore all destinations</a>
      </aside>
    </div>
  </section>`,
    )
    .join('');
}
