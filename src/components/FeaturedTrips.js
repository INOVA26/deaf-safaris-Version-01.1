import { destinations } from '../data/destinations.js';

export function FeaturedTrips() {
  return `<section class="reference-featured" aria-labelledby="featured-trips-heading"><div class="reference-container">
    <header class="reference-heading reference-heading--left"><h2 id="featured-trips-heading">Think about your next adventure</h2><p>Wide-open plains, mountain paths and wildlife. Start with the places that move you.</p></header>
    <div class="reference-featured__grid">${[
      'serengeti',
      'kilimanjaro',
      'tarangire',
      'ngorongoro',
    ]
      .map((id) => {
        const place = destinations.find((item) => item.id === id);
        return `<article class="reference-featured__card"><img src="${place.photos[0].src}" alt="${place.photos[0].alt}" loading="lazy" width="400" height="540" /><span class="reference-featured__tag">Tanzania · Travel inspiration</span><div><p>Explore Tanzania</p><h3>${place.name}</h3><footer><span>Your journey, your pace</span><a class="button" href="#place-${place.id}" aria-label="Explore ${place.name}">Explore trip</a></footer></div></article>`;
      })
      .join('')}</div>
  </div></section>`;
}
