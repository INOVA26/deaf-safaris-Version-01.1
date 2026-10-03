import { escapeHtml } from '../utils/escapeHtml.js';
import { tourRatingSamples } from '../data/tourRatingSamples.js';

const star =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55-4.76-4.64 6.58-.96Z"/></svg>';

function sampleRating(id) {
  const score = tourRatingSamples[id];
  if (score === undefined) return '';
  const label = score.toFixed(1);
  const stars = Array.from({ length: 5 }, (_, index) => {
    const fill = Math.round(Math.max(0, Math.min(1, score - index)) * 100);
    return `<span class="reference-trip__star">${star}<span class="reference-trip__star-fill" style="width: ${fill}%">${star}</span></span>`;
  }).join('');
  return `<div class="reference-trip__rating" role="img" aria-label="Sample rating: ${label} out of 5. Demonstration only, not guest reviews.">
    <span class="reference-trip__rating-line"><span class="reference-trip__rating-stars" aria-hidden="true">${stars}</span><span class="reference-trip__rating-score">${label}</span></span>
    <span class="reference-trip__rating-label">Sample rating</span>
  </div>`;
}

const symbols = {
  market:
    '<path d="M3 10h18l-2-6H5l-2 6Zm1 0v10h16V10M9 20v-6h6v6"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
  walking:
    '<circle cx="14" cy="4" r="2"/><path d="m7 21 3-6 2-7 4 4h4M5 11l4-3h3m-2 7 5 2 2 4"/>',
  school: '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-6h6v6M8 11h.01M16 11h.01"/>',
  mountain: '<path d="m2 20 7-13 4 7 3-5 6 11H2Z"/><path d="m7 11 2 2 2-2"/>',
  camera: '<path d="M3 7h4l2-3h6l2 3h4v13H3Z"/><circle cx="12" cy="13" r="4"/>',
  pace: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  wildlife:
    '<ellipse cx="5" cy="7" rx="2" ry="3"/><ellipse cx="11" cy="5" rx="2" ry="3"/><ellipse cx="18" cy="7" rx="2" ry="3"/><path d="M5 17c0-4 4-7 7-7s7 3 7 7c0 5-5 1-7 1s-7 4-7-1Z"/>',
  landscape: '<path d="m2 20 7-13 4 7 3-5 6 11H2Z"/>',
  water: '<path d="M2 8q3-4 6 0t6 0t8 0M2 13q3-4 6 0t6 0t8 0M2 18q3-4 6 0t6 0t8 0"/>',
  art: '<path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4 2 2 0 0 1 0-4h3a4 4 0 0 0 4-4c0-4-5-6-9-6Z"/><path d="M7 8h.01M12 6h.01M6 13h.01M17 8h.01"/>',
  signing:
    '<path d="M7 12V6a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v9a6 6 0 0 1-10 5l-6-7a2 2 0 0 1 3-2l3 3"/>',
};
const compactLabels = {
  'Wildlife watching': 'Wildlife',
  'Open landscapes': 'Open plains',
  'Photography moments': 'Photo stops',
  'Crater scenery': 'Crater views',
  'Mount Meru scenery': 'Mount Meru',
  'Baobab landscapes': 'Baobabs',
  'Time to observe': 'Your pace',
  'Your communication preferences': 'Your pace',
  'Creative inspiration': 'Creativity',
  'Art & sculpture': 'Art',
  'A slower moment': 'Your pace',
  'Leafy surroundings': 'Nature',
  'Place to explore': 'Explore',
};

// One photo-card design for homepage tours and the complete destination listing.
// Existing Marangu route price source: https://deafsafaris.co.tz/ (27 September 2026).
export function TourCard(place, { dayTrip = false, category, hidden = false } = {}) {
  const photo = place.photos?.[0];
  const name = escapeHtml(place.name);
  const priceLabel = place.id === 'kilimanjaro' ? '$1,850' : place.priceLabel;
  const priceUnit = place.id === 'kilimanjaro' ? 'per person' : place.priceUnit;
  const details =
    place.id === 'kilimanjaro'
      ? [
          ['pace', '5–6 days'],
          ['mountain', 'Marangu route'],
          ['landscape', 'Mountain huts'],
        ]
      : dayTrip
        ? [['pace', 'Full day'], ...place.highlights.slice(0, 2)]
        : place.highlights;
  const linkAttribute = category ? 'data-listing-link' : 'data-trip-destination';
  const href = place.enquiryOnly ? '#enquiries' : '#hero-planner';
  const linkData = place.enquiryOnly ? '' : `${linkAttribute}="${name}"`;
  return `<article class="reference-trip" ${category ? `data-listing-destination="${name}" data-place-category="${escapeHtml(category)}"` : ''} ${hidden ? 'hidden' : ''}>
    <div class="reference-trip__media">
    <a class="reference-trip__image" href="${href}" ${linkData} aria-label="Plan a journey to ${name}">
      ${photo ? `<img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" loading="lazy" decoding="async" width="640" height="440" ${photo.position ? `style="object-position: ${escapeHtml(photo.position)}"` : ''} />` : '<span class="reference-trip__photo-pending">Photo pending</span>'}
      <span class="reference-trip__tag">${escapeHtml(category || place.badge || (dayTrip ? 'Day trip' : 'Safari inspiration'))}</span>
    </a>
    </div>
    <div class="reference-trip__body">
      <div class="reference-trip__meta"><div class="reference-trip__price"><strong>${escapeHtml(priceLabel || 'Price pending')}</strong>${priceLabel && priceUnit ? `<span>/ ${escapeHtml(priceUnit)}</span>` : ''}</div>${sampleRating(place.id)}</div>
      <h3><a href="${href}" ${linkData}>${name}</a></h3>
      <p>${escapeHtml(place.id === 'kilimanjaro' ? 'Climb the Marangu route with mountain hut accommodation.' : place.eyebrow)}</p>
      <ul>${details.map(([symbol, label]) => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${symbols[symbol] || symbols.landscape}</svg><span>${escapeHtml(compactLabels[label] || label)}</span></li>`).join('')}</ul>
    </div>
  </article>`;
}
