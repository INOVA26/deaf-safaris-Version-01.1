import { destinations } from '../data/destinations.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import cyclingPhoto from '../assets/images/tanzania-cycling.jpg';
import marketPhoto from '../assets/images/arusha-market.jpg';
import { safariPriceGuides } from '../data/safariPriceGuides.js';

const ideas = [
  {
    destination: 'kilimanjaro',
    title: 'Kilimanjaro Day Hike',
    category: 'Mountain',
    details: [
      ['landscape', 'Hiking'],
      ['bicycle', 'Bike option'],
      ['camera', 'Photos'],
    ],
    description: 'Forest trails, with optional foothill cycling arranged separately.',
    photo: 1,
  },
  {
    destination: 'serengeti',
    title: 'Serengeti & Ngorongoro',
    category: 'Wildlife',
    details: [
      ['vehicle', 'Cruiser'],
      ['camp', 'Camping'],
      ['wifi', 'Wi-Fi'],
    ],
    description: 'Open plains, wildlife drives and nights under canvas.',
    photo: 1,
  },
  {
    destination: 'ngorongoro',
    title: 'Ngorongoro Crater',
    category: 'Crater safari',
    details: [
      ['vehicle', 'Cruiser'],
      ['landscape', 'Crater'],
      ['camera', 'Photos'],
    ],
    description: 'A crater safari with wildlife viewing and scenic photo stops.',
    photo: 0,
  },
  {
    destination: 'tarangire',
    title: 'Tarangire & the Baobabs',
    category: 'Nature',
    details: [
      ['vehicle', 'Cruiser'],
      ['landscape', 'Baobabs'],
      ['camera', 'Photos'],
    ],
    description: 'Elephant country, baobab landscapes and time to take it all in.',
    photo: 1,
  },
  {
    title: 'Explore by Bicycle',
    priceKey: 'cycling',
    category: 'Optional cycling',
    details: [
      ['bicycle', 'Cycling'],
      ['landscape', 'Scenery'],
      ['camera', 'Photos'],
    ],
    location: 'Moshi, Tanzania',
    description: 'A countryside ride around Moshi, with a route suited to your pace.',
    image: {
      src: cyclingPhoto,
      alt: 'A cyclist wearing a helmet riding along a city road in Tanzania.',
    },
  },
  {
    title: 'Arusha Market Walk',
    priceKey: 'market',
    category: 'Optional local visit',
    details: [
      ['walking', 'Walking'],
      ['market', 'Markets'],
      ['pin', 'Local life'],
    ],
    location: 'Arusha, Tanzania',
    description: 'Explore local stalls and everyday Arusha at an unhurried pace.',
    image: {
      src: marketPhoto,
      alt: 'Vendors and shoppers beside colourful vegetable stalls at a local market in Arusha.',
    },
  },
];

const paths = {
  camp: '<path d="m3 21 9-18 9 18H3Zm5 0 4-8 4 8M12 3l2-2m-2 2-2-2"/>',
  walking:
    '<circle cx="14" cy="4" r="2"/><path d="m7 21 3-6 2-7 4 4h4M5 11l4-3h3m-2 7 5 2 2 4"/>',
  bicycle:
    '<circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-10 5 10H5m5-10h6l3 10M8 7h4m3-4h2l2 5"/>',
  market:
    '<path d="M3 10h18l-2-6H5l-2 6Zm1 0v10h16V10M9 20v-6h6v6"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
  pace: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  landscape: '<path d="m3 19 6-9 5 6 3-4 4 7H3Z"/><circle cx="16" cy="5" r="2"/>',
  camera:
    '<path d="M8 6l2-3h4l2 3h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="3.5"/>',
  vehicle:
    '<path d="m5 5-2 7v7h3v-3h12v3h3v-7l-2-7H5Zm-2 7h18M7 5l-1 7m11-7 1 7M6 14h2m8 0h2"/>',
  wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="20" r=".7"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;

// A supporting inspiration list within destination discovery.
// Researched prices refer to comparable operators; company quotes remain individual.
export function SafariIdeaCards() {
  return `<div class="safari-ideas" aria-labelledby="safari-ideas-heading">
    <div class="container">
    <h3 class="sr-only" id="safari-ideas-heading">Safari experiences to explore</h3>
    <ul class="safari-ideas__grid" id="safari-ideas-grid">
      ${ideas
        .map((idea, index) => {
          const place = destinations.find((item) => item.id === idea.destination);
          const photo = idea.image || place.photos[idea.photo];
          const price = safariPriceGuides[idea.priceKey || idea.destination];
          const details = [['pace', price.duration], ...idea.details];
          return `<li${index >= 3 ? ' data-safari-idea-extra hidden' : ''}>
          <article class="safari-idea">
            <div class="safari-idea__photo">
              <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" width="640" height="480" loading="lazy" decoding="async" />
            </div>
            <div class="safari-idea__body">
              <div class="safari-idea__meta">
                <p class="safari-idea__price"><strong>US$${price.usd.toLocaleString('en-US')}</strong><span>/ person</span></p>
                <span class="safari-idea__category">${idea.category}</span>
              </div>
              <h4>${escapeHtml(idea.title)}</h4>
              <p class="safari-idea__description">${escapeHtml(idea.description)}</p>
              <ul class="safari-idea__details" aria-label="Trip details">
                ${details.map(([symbol, value]) => `<li>${icon(symbol)}<span>${escapeHtml(value)}</span></li>`).join('')}
              </ul>
            </div>
          </article>
        </li>`;
        })
        .join('')}
    </ul>
    <div class="safari-ideas__actions">
    <button class="button button--secondary safari-ideas__toggle" type="button" data-safari-ideas-toggle aria-expanded="false" aria-controls="safari-ideas-grid">
      <span>View all experiences</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <details class="safari-ideas__price-guide">
      <summary><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.5"/></svg><span>Price details</span></summary>
      <div class="safari-ideas__price-content">
      <h4>Plan with a clear picture of the costs</h4>
      <p>Published third-party starting rates, checked 15 September 2026. These are planning references, not confirmed Deaf Safaris prices. Your quote depends on dates, group size, itinerary and communication arrangements. Sign-language support is not confirmed in these reference rates.</p>
      <ul>${ideas
        .map((idea) => {
          const price = safariPriceGuides[idea.priceKey || idea.destination];
          return `<li><strong>${price.scope} · from US$${price.usd} per person.</strong> ${escapeHtml(price.conditions)} <a href="${escapeHtml(price.source)}">${escapeHtml(price.provider)}: published rate</a>.</li>`;
        })
        .join('')}</ul>
      <p>Itineraries and sign-language arrangements are to be confirmed.</p>
      </div>
    </details>
    <a class="safari-ideas__credits" href="#photo-credits">${icon('camera')}<span>Photo credits</span></a>
    </div>
    </div>
  </div>`;
}

export function initSafariIdeaCards(root = document.querySelector('.safari-ideas')) {
  const button = root.querySelector('[data-safari-ideas-toggle]');
  const label = button.querySelector('span');
  const extraCards = [...root.querySelectorAll('[data-safari-idea-extra]')];
  const toggle = () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    extraCards.forEach((card) => {
      card.hidden = !expanded;
    });
    button.setAttribute('aria-expanded', String(expanded));
    label.textContent = expanded ? 'Show fewer experiences' : 'View all experiences';
  };
  button.addEventListener('click', toggle);
  return () => button.removeEventListener('click', toggle);
}
