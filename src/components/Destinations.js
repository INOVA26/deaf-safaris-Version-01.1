import { destinations } from '../data/destinations.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { SafariIdeaCards } from './SafariIdeaCards.js';
import { initGalleryMotion } from '../utils/galleryMotion.js';

const paths = {
  water:
    '<path d="M12 3c-2 3-6 7-6 11a6 6 0 0 0 12 0c0-4-4-8-6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/>',
  art: '<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.5-3.3 1.8 1.8 0 0 1 1.4-2.9H18A3 3 0 0 0 21 12a9 9 0 0 0-9-9Z"/><circle cx="7.5" cy="10" r="0.75"/><circle cx="11" cy="7" r="0.75"/><circle cx="15.5" cy="8" r="0.75"/>',
  wildlife:
    '<ellipse cx="5" cy="10" rx="1.5" ry="2"/><ellipse cx="9.5" cy="5.5" rx="1.5" ry="2"/><ellipse cx="14.5" cy="5.5" rx="1.5" ry="2"/><ellipse cx="19" cy="10" rx="1.5" ry="2"/><path d="M7 16c1.5-1 2-4 5-4s3.5 3 5 4c2.5 3 0 5.5-3 4a4 4 0 0 0-4 0c-3 1.5-5.5-1-3-4Z"/>',
  landscape: '<path d="m3 19 6-9 5 6 3-4 4 7H3Z"/><circle cx="16" cy="5" r="2"/>',
  camera:
    '<path d="M8 6l2-3h4l2 3h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="3.5"/>',
  mountain: '<path d="m2 20 8-16 8 16H2Zm12-8 3-5 5 13h-4M7 10l3 2 3-2"/>',
  pace: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  signing:
    '<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2Z"/><path d="M7 8h10M7 12h6"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;

export function Destinations() {
  return `<section id="destinations" class="destinations" aria-labelledby="destinations-heading">
    <div class="container">
      <div class="destinations__intro">
        <h2 id="destinations-heading">Explore Tanzania’s Highlights</h2>
        <p>Discover mountains, wildlife and culture with Deaf travellers, signing families and friends in mind. Find a place that inspires your next journey.</p>
      </div>
      <div class="destinations__tabs" role="tablist" aria-label="Explore Tanzania destinations">
        ${destinations.map((place, index) => `<button type="button" role="tab" id="destination-tab-${place.id}" aria-controls="destination-panel-${place.id}" aria-selected="${index === 0}" tabindex="${index === 0 ? '0' : '-1'}"><span>${place.label || place.name}</span></button>`).join('')}
      </div>
      <p class="sr-only" data-destination-status role="status" aria-live="polite"></p>
      <div class="destinations__showcase" id="gallery" tabindex="-1" aria-label="Tanzania destination gallery" data-motion="paused">
        ${destinations
          .map(
            (
              place,
              index,
            ) => `<div class="destinations__panel" id="destination-panel-${place.id}" role="tabpanel" aria-labelledby="destination-tab-${place.id}" tabindex="0" ${index ? 'hidden' : ''}>
          <figure class="destinations__visual">
            ${place.photos.map((photo, photoIndex) => `<div class="destinations__photo${photoIndex === 0 ? ' is-active' : ''}" data-destination-photo aria-hidden="${photoIndex !== 0}"><img ${index === 0 ? 'src' : 'data-src'}="${photo.src}" alt="${escapeHtml(photo.alt)}" width="1280" height="850" loading="lazy" decoding="async" /></div>`).join('')}
            <figcaption><span>${place.label || place.name}</span> · <a data-destination-credit href="${escapeHtml(place.photos[0].source)}">Photo credit</a></figcaption>
          </figure>
          <div class="destinations__card">
            <div class="destinations__copy"><h3>${place.name}</h3><p>${place.description}</p></div>
            <div class="destinations__details">
              <ul class="destinations__highlights" aria-label="Journey inspiration">
                ${[...place.highlights, ...(place.highlights.some(([symbol]) => symbol === 'signing') ? [] : [['signing', 'Signing preferences']])].map(([symbol, text]) => `<li data-highlight="${symbol}"><span class="destinations__highlight-icon">${icon(symbol)}</span><span>${text}</span></li>`).join('')}
              </ul>
              <a class="button button--quiet destinations__cta" href="#hero-planner" data-destination-choice="${place.name}">Explore this destination <span aria-hidden="true">↗</span><span class="sr-only">: ${place.name}</span></a>
            </div>
          </div>
        </div>`,
          )
          .join('')}
      </div>
    </div>
    ${SafariIdeaCards()}
  </section>`;
}

export function initDestinations(
  root = document.querySelector('#destinations'),
  onChoose,
  { motionFactory = typeof window === 'undefined' ? null : initGalleryMotion } = {},
) {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];
  const status = root.querySelector('[data-destination-status]');
  const disposers = [];
  let selected = 0;
  let motion;
  const photoIndices = panels.map(() => 0);
  const listen = (target, name, handler) => {
    target.addEventListener(name, handler);
    disposers.push(() => target.removeEventListener(name, handler));
  };
  function activate(index, focus = false, announce = true) {
    selected = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === selected));
      tab.tabIndex = i === selected ? 0 : -1;
      panels[i].hidden = i !== selected;
    });
    for (const image of panels[selected].querySelectorAll('img[data-src]')) {
      image.src = image.dataset.src;
      image.removeAttribute('data-src');
    }
    if (announce) status.textContent = destinations[selected].name;
    if (focus) tabs[selected].focus({ preventScroll: true });
    motion?.restart();
  }
  tabs.forEach((tab, index) => {
    listen(tab, 'click', () => activate(index));
    listen(tab, 'keydown', (event) => {
      const next = {
        ArrowRight: index + 1,
        ArrowLeft: index - 1,
        Home: 0,
        End: tabs.length - 1,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      activate(next, true);
    });
  });
  if (onChoose) {
    for (const link of root.querySelectorAll('[data-destination-choice]')) {
      listen(link, 'click', (event) => {
        event.preventDefault();
        onChoose(link.dataset.destinationChoice);
      });
    }
  }
  activate(0, false, false);
  if (motionFactory) {
    motion = motionFactory(root.querySelector('#gallery'), () => {
      const frames = [...panels[selected].querySelectorAll('[data-destination-photo]')];
      const current = photoIndices[selected];
      const next = (current + 1) % frames.length;
      const image = frames[next].querySelector('img');
      if (!image.complete || !image.naturalWidth) return;
      frames[current].classList.remove('is-active');
      frames[current].setAttribute('aria-hidden', 'true');
      frames[next].classList.add('is-active');
      frames[next].setAttribute('aria-hidden', 'false');
      panels[selected].querySelector('[data-destination-credit]').href =
        destinations[selected].photos[next].source;
      photoIndices[selected] = next;
    });
  }
  return () => {
    motion?.dispose();
    disposers.forEach((dispose) => dispose());
  };
}
