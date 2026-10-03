import { featuredReviews } from '../data/reviews.js';
import { getStoredReviews, newestReviews } from '../utils/reviewStore.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { PawTrail } from './PawTrail.js';
import team from '../assets/images/team-group.jpeg';

// Illustrative layout content only; every card and the section disclose this.
const previewSamples = [
  ...featuredReviews,
  {
    name: 'Sophie Martin',
    rating: 5,
    destination: 'Tarangire',
    title: 'Time to take it all in',
    review:
      'Watching elephants beneath the baobabs was the highlight of our day. We loved having time to pause and enjoy the landscape.',
  },
  {
    name: 'David Chen',
    rating: 5,
    destination: 'Arusha National Park',
    title: 'A day of discovery',
    review:
      'Forest scenery, lake views and wildlife made every stop feel different. A lovely introduction to Tanzania’s natural beauty.',
  },
  {
    name: 'Grace Williams',
    rating: 5,
    destination: 'Kilimanjaro',
    title: 'Mountain memories',
    review:
      'From the forest paths to the wide mountain views, there was so much to remember. Sharing the journey made it even more special.',
  },
];

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
    : sample
      ? 'Sample traveller story'
      : 'Earlier review';
  return `<article class="review-quote">
    <header class="review-note__header">
      <span class="review-note__avatar" aria-hidden="true">${escapeHtml(initials)}</span>
      <div class="review-note__author"><h3>${escapeHtml(review.name)}</h3><span>${sample ? 'Sample traveller story' : 'Local traveller story'}</span><span class="sr-only">${dateLabel}</span></div>
      <span class="review-quote__mark" aria-hidden="true">“</span>
    </header>
    <h4 class="sr-only">${escapeHtml(review.title)}</h4>
    <blockquote>${escapeHtml(review.review)}</blockquote>
    <footer class="sr-only"><span>${escapeHtml(review.destination)}</span><span>${sample ? 'Sample review' : 'Local review'}</span></footer>
  </article>`;
}

export function ReviewPreview() {
  return `<section class="visitor-stories reference-reviews" id="latest-reviews" aria-labelledby="latest-reviews-heading">
    <img class="reference-reviews__background" src="${team}" alt="" loading="lazy" width="975" height="1280" />
    ${PawTrail()}
    <header class="reference-heading"><p class="reference-eyebrow">What People Say</p><h2 id="latest-reviews-heading">What the people think about us</h2><p class="sr-only" data-review-total></p></header>
    <div class="reference-reviews__track" id="home-review-track" data-latest-reviews tabindex="0" role="region" aria-label="Recent traveller reviews"></div>
    <div class="reference-reviews__echo" data-review-echo aria-hidden="true" inert></div>
    <button class="reference-reviews__pause" type="button" data-review-pause aria-pressed="false">Pause review motion</button>
    <a class="reference-reviews__more" href="#reviews">Read reviews &amp; write yours</a>
    <p class="reference-reviews__note" data-review-note></p>
    ${PawTrail()}
  </section>`;
}

export function initReviewPreview(root = document.querySelector('#latest-reviews')) {
  let measuredWidth = 0;
  let cycleWidth = 0;
  let echoOffset = 0;
  let trackOffset = 0;
  let paused = false;
  let frame;
  let previousTime = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pauseButton = root.querySelector('[data-review-pause]');
  const track = root.querySelector('[data-latest-reviews]');
  const echo = root.querySelector('[data-review-echo]');
  const render = () => {
    const reviews = getStoredReviews();
    const sample = !reviews.length;
    const ordered = newestReviews(sample ? previewSamples : reviews);
    const track = root.querySelector('[data-latest-reviews]');
    const cards = ordered.slice(0, 6).map((review) => reviewNote(review, sample));
    track.innerHTML = cards.join('');
    const width = root.clientWidth || 1920;
    measuredWidth = width;
    const cardWidth =
      track.querySelector('.review-quote')?.getBoundingClientRect().width || 378;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    // Include enough cards for the viewport plus the lower row's cropped lead-in.
    const count = Math.max(cards.length, Math.ceil(width / (cardWidth + gap)) + 2);
    for (let index = cards.length; index < count && cards.length; index += 1) {
      track.insertAdjacentHTML(
        'beforeend',
        `<div class="reference-reviews__duplicate" aria-hidden="true" inert>${cards[index % cards.length]}</div>`,
      );
    }
    const echo = root.querySelector('[data-review-echo]');
    if (echo)
      echo.innerHTML = cards.length
        ? Array.from(
            { length: count },
            (_, index) => cards[(index + 2) % cards.length],
          ).join('')
        : '';
    cycleWidth = count * (cardWidth + gap);
    // Duplicate a full cycle so wrapping never exposes an empty edge.
    if (cards.length) {
      track.insertAdjacentHTML(
        'beforeend',
        Array.from(
          { length: count },
          (_, index) =>
            `<div class="reference-reviews__duplicate" aria-hidden="true" inert>${cards[index % cards.length]}</div>`,
        ).join(''),
      );
      echo.innerHTML += echo.innerHTML;
    }
    track.scrollLeft = 0;
    trackOffset = 0;
    echoOffset = cycleWidth * 0.78;
    echo.style.transform = `translateX(${-echoOffset}px)`;
    root.querySelector('[data-review-total]').textContent =
      `${ordered.length} ${sample ? 'sample ' : ''}${ordered.length === 1 ? 'review' : 'reviews'} · Newest first`;
    root.querySelector('[data-review-note]').textContent = sample
      ? 'Illustrative reviews, not verified traveller submissions.'
      : 'Reviews saved on this device, not publicly published.';
  };
  const onStorage = (event) => {
    if (!event.key || event.key === 'deaf-safaris-reviews') render();
  };
  render();
  const syncMotion = () => {
    pauseButton.hidden = reducedMotion.matches;
    previousTime = 0;
  };
  const togglePause = () => {
    paused = !paused;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.textContent = paused ? 'Resume review motion' : 'Pause review motion';
  };
  const animate = (time) => {
    const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
    previousTime = time;
    if (
      !paused &&
      !reducedMotion.matches &&
      !document.hidden &&
      root.offsetParent !== null &&
      document.activeElement !== track &&
      cycleWidth
    ) {
      const distance = elapsed * 18;
      trackOffset = (trackOffset + distance) % cycleWidth;
      track.scrollLeft = trackOffset;
      echoOffset = (echoOffset - distance + cycleWidth) % cycleWidth;
      echo.style.transform = `translateX(${-echoOffset}px)`;
    } else {
      trackOffset = track.scrollLeft;
    }
    frame = requestAnimationFrame(animate);
  };
  syncMotion();
  pauseButton.addEventListener('click', togglePause);
  reducedMotion.addEventListener('change', syncMotion);
  frame = requestAnimationFrame(animate);
  const onResize = () => {
    if (root.clientWidth && root.clientWidth !== measuredWidth) render();
  };
  const observer =
    typeof ResizeObserver === 'function' ? new ResizeObserver(onResize) : null;
  observer?.observe(root);
  window.addEventListener('resize', onResize);
  window.addEventListener('reviews:updated', render);
  window.addEventListener('storage', onStorage);
  return () => {
    cancelAnimationFrame(frame);
    pauseButton.removeEventListener('click', togglePause);
    reducedMotion.removeEventListener('change', syncMotion);
    observer?.disconnect();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('reviews:updated', render);
    window.removeEventListener('storage', onStorage);
  };
}
