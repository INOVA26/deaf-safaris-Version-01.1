import { destinations } from '../data/destinations.js';
import fallbackImage from '../assets/images/savannah-sunset.jpg';
import { escapeHtml } from '../utils/escapeHtml.js';

export function ReviewCards(reviews, { compact = false, sample = false } = {}) {
  return reviews
    .map((review) => {
      const destination = destinations.find(
        (place) => place.name === review.destination,
      );
      const photo = destination?.photos[0];
      const timestamp = Date.parse(review.createdAt || review.date || '');
      const date = Number.isFinite(timestamp) ? new Date(timestamp) : null;
      const dateLabel = date
        ? new Intl.DateTimeFormat('en', {
            dateStyle: 'medium',
            timeZone: 'UTC',
          }).format(date)
        : 'Earlier review';
      return `<article class="review-card${compact ? ' review-card--compact' : ''}">
      <img src="${photo?.src || fallbackImage}" alt="${escapeHtml(photo?.alt || 'Sunset over the Tanzanian savannah.')}" width="640" height="400" loading="lazy" decoding="async" />
      <div class="review-card__body">
        <div class="review-card__meta"><p class="review-preview__rating" aria-label="${review.rating} out of 5 stars"><span aria-hidden="true">${'&#9733;'.repeat(review.rating)}${'&#9734;'.repeat(5 - review.rating)}</span></p><span class="review-card__source">${sample ? 'Sample review' : 'Local review'}</span></div>
        <p class="review-card__destination">${escapeHtml(review.destination)}</p>
        <h3>${escapeHtml(review.title)}</h3>
        <blockquote>${escapeHtml(review.review)}</blockquote>
        <p class="review-preview__byline"><strong>${escapeHtml(review.name)}</strong>${date ? `<time datetime="${date.toISOString()}">${dateLabel}</time>` : `<span>${dateLabel}</span>`}</p>
      </div>
    </article>`;
    })
    .join('');
}
