import { featuredReviews } from '../data/reviews.js';
import { getStoredReviews, newestReviews } from '../utils/reviewStore.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { initHorizontalCarousel } from '../utils/horizontalCarousel.js';

function reviewNote(review, sample) {
  const initials = review.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => Array.from(word)[0])
    .join('');
  const timestamp = Date.parse(review.createdAt || review.date || '');
  const date = Number.isFinite(timestamp) ? new Date(timestamp) : null;
  const dateLabel = date
    ? new Intl.DateTimeFormat('en', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(date)
    : 'Earlier review';
  return `<article class="review-note">
    <header class="review-note__header">
      <span class="review-note__avatar" aria-hidden="true">${escapeHtml(initials)}</span>
      <div class="review-note__author"><h3>${escapeHtml(review.name)}</h3>${date ? `<time datetime="${date.toISOString()}">${dateLabel}</time>` : `<span>${dateLabel}</span>`}</div>
      <p class="review-note__rating" aria-label="${review.rating} out of 5 stars"><span aria-hidden="true">${'&#9733;'.repeat(review.rating)}${'&#9734;'.repeat(5 - review.rating)}</span><span aria-hidden="true">${review.rating}/5</span></p>
    </header>
    <h4 class="sr-only">${escapeHtml(review.title)}</h4>
    <blockquote>${escapeHtml(review.review)}</blockquote>
    <footer><span>${escapeHtml(review.destination)}</span><span>${sample ? 'Sample review' : 'Local review'}</span></footer>
  </article>`;
}

export function ReviewPreview() {
  return `<section class="review-overview section-space" id="latest-reviews" aria-labelledby="latest-reviews-heading">
    <div class="container">
      <div class="review-overview__heading">
        <div><p class="eyebrow">Traveller stories</p><h2 id="latest-reviews-heading">What visitors say</h2><p class="review-overview__intro" data-review-total></p></div>
        <div class="carousel-controls">
          <button class="carousel-arrow" data-carousel-previous type="button" aria-label="Previous reviews" title="Previous reviews" aria-controls="home-review-track">&larr;</button>
          <span class="carousel-position" data-carousel-position aria-live="polite" aria-atomic="true">01 / 01</span>
          <button class="carousel-arrow carousel-arrow--next" data-carousel-next type="button" aria-label="Next reviews" title="Next reviews" aria-controls="home-review-track">&rarr;</button>
        </div>
      </div>
      <div class="review-overview__rail">
        <div class="review-overview__track" id="home-review-track" data-latest-reviews data-carousel-track tabindex="0" role="region" aria-label="Recent traveller reviews"></div>
        <a class="review-overview__see-all" href="#reviews"><span>See all reviews</span><span class="review-overview__link-arrow" aria-hidden="true">&nearr;</span></a>
      </div>
      <p class="review-overview__note" data-review-note></p>
    </div>
  </section>`;
}

export function initReviewPreview(root = document.querySelector('#latest-reviews')) {
  let carousel;
  const render = () => {
    const reviews = getStoredReviews();
    const sample = !reviews.length;
    const ordered = newestReviews(sample ? featuredReviews : reviews);
    const track = root.querySelector('[data-latest-reviews]');
    track.innerHTML = ordered.map((review) => reviewNote(review, sample)).join('');
    track.scrollLeft = 0;
    root.querySelector('[data-review-total]').textContent =
      `${ordered.length} ${sample ? 'sample ' : ''}${ordered.length === 1 ? 'review' : 'reviews'} · Newest first`;
    root.querySelector('[data-review-note]').textContent = sample
      ? 'Illustrative reviews, not verified traveller submissions.'
      : 'Reviews saved on this device, not publicly published.';
    carousel?.refresh();
  };
  const onStorage = (event) => {
    if (!event.key || event.key === 'deaf-safaris-reviews') render();
  };
  render();
  carousel = initHorizontalCarousel(root);
  window.addEventListener('reviews:updated', render);
  window.addEventListener('storage', onStorage);
  return () => {
    carousel.dispose();
    window.removeEventListener('reviews:updated', render);
    window.removeEventListener('storage', onStorage);
  };
}
