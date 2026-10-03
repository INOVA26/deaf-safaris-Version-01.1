import { initReviewComposer, reviewSummary } from '../utils/reviewComposer.js';
import { createReviewDraft, reviewAsText } from '../utils/reviewDraft.js';
import { destinations } from '../data/destinations.js';
import { featuredReviews } from '../data/reviews.js';
import {
  getStoredReviews,
  saveStoredReview,
  newestReviews,
} from '../utils/reviewStore.js';
import { ReviewCards } from './ReviewCards.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export function Reviews() {
  return `
    <section class="reviews section-space" id="reviews" aria-labelledby="reviews-heading" hidden>
      <div class="container">
        <a class="reviews__back text-link" href="#latest-reviews"><span aria-hidden="true">&larr;</span> Back to stories</a>
        <div class="reviews__heading">
          <div><p class="eyebrow">Your Tanzania stories</p><h2 id="reviews-heading" tabindex="-1">What visitors say</h2><p class="section-intro">The places you explored. The moments you remember.</p></div>
          <button class="button button--primary" type="button" data-write-review>Write a review <span aria-hidden="true">&rarr;</span></button>
        </div>
        <div class="reviews__grid">
        <div class="reviews__intro">
          <div class="reviews__summary" id="reviews-summary"></div>
          <div class="reviews__toolbar">
            <p id="reviews-count" role="status"></p>
            <div><label for="reviews-place-filter">Place visited</label><select id="reviews-place-filter"><option value="">All places</option>${destinations.map((place) => `<option>${escapeHtml(place.name)}</option>`).join('')}<option value="Tanzania">Other places in Tanzania</option></select></div>
          </div>
          <label class="reviews__order" for="reviews-sort">Sort reviews <select id="reviews-sort"><option value="newest">Newest</option><option value="highest">Highest rating</option><option value="lowest">Lowest rating</option></select></label>
          <div class="reviews__list" id="reviews-list"></div>
          <article class="review-preview" id="review-preview" aria-labelledby="review-preview-heading" hidden>
            <p class="eyebrow">Your private preview · Not published</p>
            <h3 id="review-preview-heading" tabindex="-1">Your review preview</h3>
            <p class="review-preview__rating" id="review-preview-rating"></p>
            <h4 id="review-preview-title"></h4>
            <p class="review-preview__body" id="review-preview-body"></p>
            <p class="review-preview__byline"><strong id="review-preview-name"></strong> · <span id="review-preview-destination"></span> · <span id="review-preview-experience"></span></p>
            <button class="button button--quiet" id="download-review" type="button">Download review (.txt)</button>
          </article>
        </div>
        <form class="review-form" id="review-form" aria-describedby="review-privacy">
          <div class="form-heading"><p class="eyebrow">Deaf Safaris Tanzania</p><h3>How was your experience?</h3><span>Your memories can help shape the next journey.</span></div>
          <div class="form-grid">
            <div class="form-field">
              <label for="review-name">Display name <span>(optional)</span></label>
              <input id="review-name" name="name" type="text" maxlength="80" autocomplete="nickname" placeholder="Your name or nickname" />
            </div>
            <div class="form-field">
              <label for="review-experience">What are you reviewing?</label>
              <select id="review-experience" name="experience"><option>Safari experience</option><option>Website experience</option></select>
            </div>
            <div class="form-field form-field--wide">
              <label for="review-destination">Where did you visit?</label>
              <select id="review-destination" name="destination" required><option value="">Choose a place</option>${destinations.map((place) => `<option>${escapeHtml(place.name)}</option>`).join('')}<option value="Tanzania">Other places in Tanzania</option></select>
            </div>
            <div class="review-rating form-field--wide">
              <div class="review-rating__heading">
                <span id="review-stars-label">Your rating</span>
                <output id="review-rating-value" for="review-rating" aria-live="off">3 / 5</output>
              </div>
              <input id="review-rating" name="rating" type="hidden" value="3" />
              <div class="review-stars" role="group" aria-labelledby="review-stars-label">${[1, 2, 3, 4, 5].map((value) => `<button type="button" data-review-star="${value}" aria-label="Rate ${value} out of 5 stars" aria-pressed="${value === 3}"><span aria-hidden="true">★</span></button>`).join('')}</div>
            </div>
            <div class="form-field form-field--wide">
              <label for="review-title">Review title <span>(optional)</span></label>
              <input id="review-title" name="title" type="text" maxlength="120" placeholder="Give your story a title" />
            </div>
            <div class="form-field form-field--wide">
              <label for="review-message">Your review <span>(required)</span></label>
              <textarea id="review-message" name="review" rows="5" minlength="20" maxlength="2000" required aria-describedby="review-length" placeholder="Share your experience. Please avoid personal contact details."></textarea>
              <p class="form-hint" id="review-length">20–2,000 characters. Review only your own experience.</p>
            </div>
          </div>
          <div class="review-media">
            <label class="review-media__picker" for="review-media">＋ Add photos or videos<input id="review-media" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" multiple aria-describedby="review-media-hint" /></label>
            <p class="form-hint" id="review-media-hint">Up to 4 files, 10 MB each. Private previews for this visit only; media is not uploaded or saved.</p>
            <p id="review-media-status" role="status"></p><div class="review-media__previews" id="review-media-previews"></div>
          </div>
          <p class="form-hint" id="review-privacy">Your review is saved on this device only. It is not submitted or published online.</p>
          <div class="review-form__actions"><button class="button button--quiet" type="reset">Clear draft</button><button class="button button--accent" type="submit">Save my review <span aria-hidden="true">&rarr;</span></button></div>
          <p class="form-hint" id="review-status" role="status"></p>
        </form>
        </div>
      </div>
    </section>
  `;
}

export function initReviews() {
  const form = document.querySelector('#review-form');
  const body = document.querySelector('#review-message');
  const status = document.querySelector('#review-status');
  const reviewList = document.querySelector('#reviews-list');
  const filter = document.querySelector('#reviews-place-filter');
  const rating = document.querySelector('#review-rating');
  const ratingValue = document.querySelector('#review-rating-value');
  const disposers = [initReviewComposer(form)];
  const sort = document.querySelector('#reviews-sort');
  const listen = (target, type, handler) => {
    target.addEventListener(type, handler);
    disposers.push(() => target.removeEventListener(type, handler));
  };
  const syncRating = () => {
    const value = Number(rating.value);
    rating.style.setProperty('--rating-progress', `${((value - 1) / 4) * 100}%`);
    rating.setAttribute('aria-valuetext', `${value} out of 5 stars`);
    ratingValue.textContent = `${value} / 5`;
  };
  syncRating();
  listen(rating, 'input', syncRating);
  listen(rating, 'change', syncRating);
  let draft;
  const renderReviews = () => {
    const reviews = getStoredReviews();
    const sample = !reviews.length;
    const visible = newestReviews(sample ? featuredReviews : reviews).filter(
      (review) => !filter.value || review.destination === filter.value,
    );
    if (sort?.value === 'highest') visible.sort((a, b) => b.rating - a.rating);
    if (sort?.value === 'lowest') visible.sort((a, b) => a.rating - b.rating);
    const summary = document.querySelector('#reviews-summary');
    if (summary) summary.innerHTML = reviewSummary(reviews);
    reviewList.innerHTML = visible.length
      ? ReviewCards(visible, { sample })
      : '<p class="reviews__list-empty">No reviews for this place yet. Share your experience using the form.</p>';
    document.querySelector('#reviews-count').textContent =
      `${visible.length} ${sample ? 'sample ' : 'saved '}${visible.length === 1 ? 'review' : 'reviews'}`;
  };
  renderReviews();
  listen(filter, 'change', renderReviews);
  if (sort) listen(sort, 'change', renderReviews);
  listen(form, 'reset', () =>
    queueMicrotask(() => {
      syncRating();
      body.setCustomValidity('');
      status.textContent = '';
    }),
  );
  listen(window, 'storage', (event) => {
    if (!event.key || event.key === 'deaf-safaris-reviews') renderReviews();
  });
  listen(document.querySelector('[data-write-review]'), 'click', () => {
    document.querySelector('#review-destination').focus({ preventScroll: true });
    form.scrollIntoView({ block: 'start' });
  });
  listen(body, 'input', () => body.setCustomValidity(''));
  listen(form, 'submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    try {
      draft = createReviewDraft(Object.fromEntries(new FormData(form)));
    } catch (error) {
      status.textContent = error.message;
      body.setCustomValidity(error.message);
      body.reportValidity();
      return;
    }
    const fields = ['name', 'experience', 'title', 'destination'];
    fields.forEach((field) => {
      document.querySelector(`#review-preview-${field}`).textContent = draft[field];
    });
    document.querySelector('#review-preview-body').textContent = draft.review;
    document.querySelector('#review-preview-rating').textContent =
      `${draft.rating} out of 5 stars`;
    const saved = saveStoredReview(draft);
    filter.value = '';
    renderReviews();
    document.querySelector('#review-preview').hidden = false;
    status.textContent = saved.persisted
      ? 'Your review is saved on this device and appears in the latest stories. It has not been published online.'
      : 'Your review is visible for this session only because browser storage is unavailable. Download it to keep a copy.';
    window.dispatchEvent(new Event('reviews:updated'));
    document.querySelector('#review-preview-heading').focus();
  });
  listen(document.querySelector('#download-review'), 'click', () => {
    if (!draft) return;
    const url = URL.createObjectURL(
      new Blob([reviewAsText(draft)], { type: 'text/plain;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deaf-safaris-my-review.txt';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Download requested. Your review has not been submitted.';
  });
  return () => disposers.forEach((dispose) => dispose());
}
