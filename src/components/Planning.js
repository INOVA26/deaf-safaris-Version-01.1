import { destinations } from '../data/destinations.js';
import { escapeHtml } from '../utils/escapeHtml.js';

function destinationTile(id, featured = false) {
  const destination = destinations.find((place) => place.id === id);
  const photo =
    id === 'chemka'
      ? destination.photos[0]
      : destination.photos.find((item) => item.file === `${id}-1.jpg`);

  return `<a class="planning__destination${featured ? ' planning__destination--featured' : ''}" href="#hero-planner" data-planning-destination="${escapeHtml(destination.name)}">
    <img src="${photo.src}" alt="${escapeHtml(photo.alt)}" width="1280" height="850" loading="lazy" decoding="async" />
    <span class="planning__location"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>Tanzania</span>
    <span class="planning__caption">
      <span><span class="planning__name">${destination.name}</span>${featured ? '<span class="planning__details">Natural springs &middot; Nature &middot; A slower pace</span>' : ''}</span>
      ${featured ? '<span class="planning__tile-arrow" aria-hidden="true">&rarr;</span>' : ''}
    </span>
  </a>`;
}

export function Planning() {
  return `
    <section class="planning section-space" id="planning" aria-labelledby="planning-heading">
      <div class="container planning__layout">
        <div class="planning__intro">
          <p class="planning__eyebrow">03 / Make room for possibility</p>
          <h2 id="planning-heading">Explore Tanzania's<br />most beautiful places.</h2>
          <p class="planning__description">From clear springs to mountain peaks, find a place that inspires your next adventure.</p>
          <a class="button button--primary planning__browse" href="#destinations">View all destinations <span aria-hidden="true">&rarr;</span></a>
        </div>
        <div class="planning__destinations">
          ${destinationTile('chemka', true)}
          ${destinationTile('kilimanjaro')}
          ${destinationTile('serengeti')}
        </div>
      </div>
    </section>
  `;
}

export function initPlanning(root = document.querySelector('#planning'), onChoose) {
  const selectDestination = (event) => {
    const link = event.target.closest('[data-planning-destination]');
    if (
      !link ||
      !onChoose ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    onChoose(link.dataset.planningDestination);
  };
  root.addEventListener('click', selectDestination);
  return () => root.removeEventListener('click', selectDestination);
}
