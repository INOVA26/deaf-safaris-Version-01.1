import team from '../assets/images/team-group.jpeg';
import { companyPhotos } from '../data/companyPhotos.js';

const slides = [
  {
    image: team,
    title: 'Unforgettable adventure',
    location: 'Tanzania',
    copy: 'From mountain moments to wide-open plains, explore Tanzania with your interests, pace and communication preferences at the heart of your plans.',
  },
  {
    image: companyPhotos.tarangire.src,
    title: 'Discover the wild',
    location: 'Tarangire, Tanzania',
    copy: 'Explore elephant country and baobab landscapes. Share your interests and the pace you enjoy, then shape a wildlife journey around what matters to you.',
  },
  {
    image: companyPhotos.kilimanjaro.src,
    title: 'Mountain moments',
    location: 'Kilimanjaro, Tanzania',
    copy: 'Start with your mountain dreams. Discuss routes, experience and communication preferences with our team as you prepare for the journey ahead.',
  },
  {
    image: companyPhotos.arusha.src,
    title: 'A new perspective',
    location: 'Arusha, Tanzania',
    copy: 'Discover forest scenery, lake views and wildlife. Find inspiration for a day outdoors and tell us what you would love to experience.',
  },
  {
    image: companyPhotos.giraffes.src,
    title: 'A journey to share',
    location: 'Tanzania',
    copy: 'Bring your people, your curiosity and your ideas. Explore the possibilities together and create a personal safari brief at your own pace.',
  },
];

export function PromiseBanner() {
  return `<section class="reference-promise" aria-labelledby="promise-heading" aria-roledescription="carousel">
    ${slides.map((slide, index) => `<img class="reference-promise__photo${index === 0 ? ' is-active' : ''}" src="${slide.image}" alt="" loading="lazy" aria-hidden="true" data-promise-photo />`).join('')}
    <div class="reference-promise__content" aria-live="polite" aria-atomic="true">
      <span class="reference-pill">OUR PROMISES</span>
      <h2 id="promise-heading">${slides[0].title}</h2>
      <div class="reference-promise__meta"><span class="reference-promise__location"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></svg><span data-promise-location>${slides[0].location}</span></span><span class="reference-promise__divider" aria-hidden="true">|</span><a href="#reviews"><span class="reference-promise__stars" aria-hidden="true">★★★★★</span><span>Sample reviews</span></a></div>
      <p data-promise-copy>${slides[0].copy}</p>
    </div>
    <div class="reference-promise__dots" role="group" aria-label="Choose a promise slide">
      ${slides.map((slide, index) => `<button type="button" data-promise-slide="${index}" aria-label="Slide ${index + 1}: ${slide.title}" aria-pressed="${index === 0}"><span aria-hidden="true"></span></button>`).join('')}
    </div>
    <button class="button reference-promise__arrow reference-promise__arrow--previous" type="button" data-promise-direction="-1" aria-label="Previous promise slide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg></button>
    <button class="button reference-promise__arrow reference-promise__arrow--next" type="button" data-promise-direction="1" aria-label="Next promise slide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg></button>
  </section>`;
}

export function initPromiseBanner(root = document.querySelector('.reference-promise')) {
  if (!root) return () => {};
  const buttons = [...root.querySelectorAll('[data-promise-slide]')];
  const photos = [...root.querySelectorAll('[data-promise-photo]')];
  let activeIndex = 0;
  const choose = (index) => {
    const slide = slides[index];
    if (!slide) return;
    activeIndex = index;
    buttons.forEach((button, i) =>
      button.setAttribute('aria-pressed', String(i === index)),
    );
    photos.forEach((photo, i) => photo.classList.toggle('is-active', i === index));
    root.querySelector('#promise-heading').textContent = slide.title;
    root.querySelector('[data-promise-location]').textContent = slide.location;
    root.querySelector('[data-promise-copy]').textContent = slide.copy;
  };
  const click = (event) => {
    const arrow = event.target.closest('[data-promise-direction]');
    if (arrow) {
      choose(
        (activeIndex + Number(arrow.dataset.promiseDirection) + slides.length) %
          slides.length,
      );
      return;
    }
    const button = event.target.closest('[data-promise-slide]');
    if (button) choose(Number(button.dataset.promiseSlide));
  };
  const keydown = (event) => {
    const index = buttons.indexOf(event.target);
    if (index < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key))
      return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? buttons.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) %
            buttons.length;
    choose(next);
    buttons[next].focus();
  };
  root.addEventListener('click', click);
  root.addEventListener('keydown', keydown);
  return () => {
    root.removeEventListener('click', click);
    root.removeEventListener('keydown', keydown);
  };
}
