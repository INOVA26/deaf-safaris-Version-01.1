import teamPhoto from '../assets/images/team-group.jpeg';
import { expeditions } from '../data/expeditions.js';
import { featuredReviews } from '../data/reviews.js';
import { initHeroMotion } from '../utils/heroMotion.js';

// The fourth card invites a contribution without inventing another testimonial.
const heroReviews = [
  ...featuredReviews,
  {
    placeholder: true,
    name: 'Your story could be next',
    destination: 'Help me choose',
    heading: 'Your next adventure',
    review:
      'Have a Tanzania travel story to share? Create your own review draft and tell us about your experience.',
    image: teamPhoto,
    alt: 'A group holding a Deaf Safaris banner at the Mount Kilimanjaro summit sign.',
  },
];
const reviewLabel = (review) =>
  review.placeholder
    ? 'Share your story'
    : `${review.destination} review by ${review.name}`;

const iconPaths = {
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  hand: '<path d="M8 13V6a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v8-6a2 2 0 0 1 4 0v9a7 7 0 0 1-12 5l-5-6a2 2 0 0 1 3-3l2 2Z"/>',
  users:
    '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 4v2"/>',
  mountain: '<path d="m2 20 7-15 5 9 3-6 5 12ZM6 12l3 2 3-3"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]}</svg>`;

function reviewSlide(review, index) {
  return `<div class="hero__tour" data-tour ${index ? 'hidden' : ''} role="group" aria-roledescription="slide" aria-label="${index + 1} of ${heroReviews.length}: ${reviewLabel(review)}">
    <div class="hero__card-image">
      <img src="${review.image}" alt="${review.alt}" width="1400" height="1050" ${index ? 'loading="lazy"' : ''} />
      <span class="hero__image-badge" data-i18n="${review.placeholder ? 'reviews.shareStory' : 'reviews.visitorReview'}">${review.placeholder ? 'Share your story' : 'Visitor review'}</span>
      <h2 class="hero__image-title">${review.heading || (review.destination === 'Kilimanjaro' ? 'Mount Kilimanjaro' : review.destination)}</h2>
    </div>
    <div class="hero__review-panel">
      <p class="hero__review-meta"><strong>${review.name}</strong></p>
      <p class="hero__review-date">${review.placeholder ? 'Review placeholder · Saved only in this browser' : `${review.date} · <span data-i18n="reviews.sample">Sample review</span>`}</p>
      <p class="hero__review-description">${review.placeholder ? '' : `<span class="hero__review-rating" role="img" aria-label="${review.rating} out of 5 stars">${'★'.repeat(review.rating)}</span> `}${review.review} <a class="hero__review-more" href="#reviews" aria-label="More visitor reviews" data-i18n="reviews.more">More</a></p>
      <a href="#reviews" class="button button--accent hero__reviews-cta" hidden data-i18n="reviews.viewAll">View All Reviews</a>
    </div>
  </div>`;
}

function field(name, label, symbol, options, placeholder = '') {
  const translationKey = {
    destination: 'planner.destination',
    season: 'planner.season',
    'sign-language': 'planner.sign',
    travellers: 'planner.travellers',
  }[name];
  return `<div class="hero__field">${icon(symbol)}<div>
    <label id="hero-${name}-label" for="hero-${name}" data-i18n="${translationKey}">${label}</label>
    <select id="hero-${name}" name="${name}" aria-labelledby="hero-${name}-label">${placeholder ? `<option value="" selected>${placeholder}</option>` : ''}${options.map(([value, text, selected]) => `<option value="${value}" ${selected ? 'selected' : ''}>${text}</option>`).join('')}</select>
  </div></div>`;
}

export function Hero() {
  return `
    <section id="home" class="hero" aria-labelledby="hero-heading" data-motion="paused">
      <img class="hero__background is-active" data-hero-background src="${teamPhoto}" alt="A group holding a Deaf Safaris banner at the Mount Kilimanjaro summit sign." width="975" height="1280" fetchpriority="high" />
      ${expeditions.map((tour) => `<img class="hero__background" data-hero-background src="${tour.image}" alt="${tour.alt}" aria-hidden="true" loading="lazy" />`).join('')}
      <div class="hero__shade" aria-hidden="true"></div>
      <div class="hero__grid-overlay" aria-hidden="true"></div>
      <div class="hero__body">
        <div class="hero__main-grid">
          <div class="hero__intro">
            <p class="hero__eyebrow" data-i18n="hero.eyebrow">Tanzania, through your eyes</p>
            <h1 id="hero-heading"><span class="sr-only"><span data-i18n="hero.heading">Expeditions for</span> <span data-i18n="hero.typing">Today &amp; Tomorrow.</span></span><span aria-hidden="true"><span data-i18n="hero.heading">Expeditions for</span><span class="hero__typing-line"><span data-hero-typing data-i18n="hero.typing">Today &amp; Tomorrow.</span></span></span></h1>
            <p class="hero__description" data-i18n="hero.description">From the heights of Kilimanjaro to the wilds of the Serengeti, imagine Tanzania through shared discovery. Start with your journey ideas and sign-language preferences.</p>
            <div class="hero__actions">
              <a class="button hero__primary-cta" href="#destinations"><span data-i18n="hero.explore">Explore expeditions</span> <span class="hero__arrow-circle" aria-hidden="true">↗</span></a>
              <a class="button hero__secondary-cta" href="#about"><span data-i18n="hero.story">Our story</span> <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <section id="featured-expedition" class="hero__card" aria-label="Visitor reviews" aria-roledescription="carousel">
            ${heroReviews.map(reviewSlide).join('')}
            <div class="hero__price-row">
              <div data-price-usd="120">
                <p class="hero__price-label">Starting at</p>
                <p class="hero__price-value" aria-live="polite" aria-atomic="true"><strong data-price-amount>$120</strong><span data-price-currency>/ person · USD</span></p>
                <p class="hero__price-note" data-price-note>Draft price · Price to be confirmed</p>
              </div>
              <button class="button hero__price-action" data-plan-trip type="button">Plan this trip</button>
            </div>
            <div class="hero__card-footer" hidden>
              <div class="hero__dots" role="group" aria-label="Choose a review">
                ${heroReviews.map((review, index) => `<button type="button" data-tour-index="${index}" aria-label="Show ${reviewLabel(review)}" aria-pressed="${index === 0}"><span></span></button>`).join('')}
              </div>
              <span class="hero__counter" data-tour-count aria-hidden="true">Review 1 of ${heroReviews.length}</span>
              <div class="hero__arrows">
                <button type="button" data-tour-previous aria-label="Previous expedition">‹</button>
                <button type="button" data-tour-next aria-label="Next expedition">›</button>
              </div>
            </div>
            <p class="sr-only" data-tour-status role="status" aria-live="polite" aria-atomic="true"></p>
          </section>
        </div>
        <form id="hero-planner" class="hero__planner" aria-label="Plan your safari" aria-describedby="hero-planner-note">
          ${field(
            'destination',
            'Where to?',
            'pin',
            [
              'Serengeti',
              'Ngorongoro',
              'Kilimanjaro',
              'Tarangire',
              'Arusha National Park',
              'Chemka Hot Springs',
              'Arusha Cultural Heritage Centre',
              'Help me choose',
            ].map((v) => [v, v]),
            'Choose a destination',
          )}
          ${field(
            'season',
            'Dates & season',
            'calendar',
            [
              'Flexible dates',
              'January – March',
              'April – June',
              'July – October',
              'November – December',
            ].map((v) => [v, v]),
            'Choose your dates',
          )}
          ${field(
            'sign-language',
            'Sign preference',
            'hand',
            [
              ['Discuss with our team', 'Discuss with our team'],
              ['ASL', 'American Sign Language (ASL)'],
              ['BSL', 'British Sign Language (BSL)'],
              ['International Sign', 'International Sign'],
              ['Tanzanian Sign Language', 'Tanzanian Sign Language'],
            ],
            'ASL, BSL, International…',
          )}
          ${field('travellers', 'Travellers', 'users', [
            ['1', '1 traveller'],
            ['2', '2 travellers', true],
            ['3-5', '3–5 travellers'],
            ['6+', '6+ travellers'],
          ])}
          <button class="button hero__planner-cta" type="submit">${icon('search')} <span data-i18n="planner.submit">Search safaris</span></button>
        </form>
        <p class="hero__planner-note" id="hero-planner-note" data-i18n="planner.note">Explore safari ideas, then create a personal brief. Draft itineraries; dates and sign-language support to be confirmed.</p>
        <div class="hero__footer">
          <a class="hero__scroll" href="#destinations"><span class="hero__scroll-mouse" aria-hidden="true"><span></span></span><span>Scroll down <span aria-hidden="true">↓</span></span></a>
        </div>
      </div>
    </section>
  `;
}

export function initHero(root = document.querySelector('.hero'), motionOptions) {
  const slides = [...root.querySelectorAll('[data-tour]')];
  const dots = [...root.querySelectorAll('[data-tour-index]')];
  const disposers = [];
  let activeIndex = 0;
  const listen = (target, event, handler) => {
    target.addEventListener(event, handler);
    disposers.push(() => target.removeEventListener(event, handler));
  };
  function showTour(index, announce = true) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== activeIndex;
      dots[i].setAttribute('aria-pressed', String(i === activeIndex));
    });
    root.querySelector('[data-tour-count]').textContent =
      `Review ${activeIndex + 1} of ${slides.length}`;
    if (announce)
      root.querySelector('[data-tour-status]').textContent =
        `Review ${activeIndex + 1} of ${slides.length}: ${reviewLabel(heroReviews[activeIndex])}`;
  }
  root.querySelector('.hero__card-footer').hidden = false;
  dots.forEach((dot, index) => listen(dot, 'click', () => showTour(index)));
  listen(root.querySelector('[data-tour-previous]'), 'click', () =>
    showTour(activeIndex - 1),
  );
  listen(root.querySelector('[data-tour-next]'), 'click', () =>
    showTour(activeIndex + 1),
  );
  listen(root.querySelector('[data-plan-trip]'), 'click', (event) => {
    event.preventDefault();
    root.querySelector('#hero-destination').value =
      heroReviews[activeIndex].destination;
    root.querySelector('#hero-planner').requestSubmit();
  });
  disposers.push(
    initHeroMotion(root, () => showTour(activeIndex + 1, false), motionOptions),
  );
  return () => disposers.forEach((dispose) => dispose());
}

export function initHeroPlanner(onSearch) {
  let previousSummary = '';
  const form = document.querySelector('#hero-planner');
  function submit(event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const answers = new FormData(form);
    if (onSearch && event.type === 'submit') {
      onSearch(answers);
      return;
    }
    const preferences = document.querySelector('#preferences');
    const summary = `Destination: ${answers.get('destination') || 'Help me choose'}\nSign preference: ${answers.get('sign-language') || 'Discuss with our team'}\nGroup size: ${answers.get('travellers')}\n`;
    const existing =
      previousSummary && preferences.value.startsWith(previousSummary)
        ? preferences.value.slice(previousSummary.length).replace(/^\n/, '')
        : preferences.value;
    if (summary.length + existing.length + 1 > preferences.maxLength) {
      document.querySelector('#brief-status').textContent =
        'Your notes are full. Shorten them before adding your safari preferences.';
      document.querySelector('#enquiry-form').hidden = false;
      document.querySelector('#brief-result').hidden = true;
      preferences.focus();
      return;
    }
    preferences.value = `${summary}\n${existing}`;
    previousSummary = summary;
    document.querySelector('#travel-window').value =
      answers.get('season') || 'Flexible dates';
    const travellers = answers.get('travellers');
    document.querySelector('#travellers').value = /^\d+$/.test(travellers)
      ? travellers
      : '';
    document.querySelector('#enquiry-form').hidden = false;
    document.querySelector('#brief-result').hidden = true;
    document.querySelector('#brief-status').textContent =
      'Your starting preferences have been added. Complete your personal brief below.';
    document.querySelector('#enquiries').scrollIntoView();
    preferences.focus({ preventScroll: true });
  }
  form.addEventListener('submit', submit);
  // Results reuse the same notes-preserving brief flow after a journey is chosen.
  form.addEventListener('planner:choose', submit);
  return () => {
    form.removeEventListener('submit', submit);
    form.removeEventListener('planner:choose', submit);
  };
}
