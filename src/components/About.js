import portrait from '../assets/images/about-mountain-portrait.jpg';
import group from '../assets/images/team-group.jpeg';
import safari from '../assets/images/destinations/ngorongoro-1.jpg';
import giraffes from '../assets/images/deaf-safaris/arusha-giraffe.png';
import { PawTrail } from './PawTrail.js';

const highlights = [
  [
    'Personal journeys',
    'Start with what inspires you. Shape your ideas around your interests, your people and your pace.',
  ],
  [
    'Shared understanding',
    'Tell us how you like to communicate. Include signing and written preferences in your plans.',
  ],
  [
    'Extraordinary places',
    'Explore mountain landscapes, open grasslands and Tanzania’s remarkable wildlife.',
  ],
  [
    'Thoughtful planning',
    'Keep your dates, route ideas and questions together in a personal safari brief.',
  ],
];

export function About() {
  return `<section class="reference-welcome" id="our-story" aria-labelledby="about-heading">
    <div class="reference-container">
      <header class="reference-heading"><p class="reference-eyebrow">Why Choose Us</p><h2 id="about-heading">Welcome to Deaf Safaris</h2><p>At Deaf Safaris, we believe that everyone deserves to experience the magic of the wild.<br />Discover Tanzania with your interests, pace and communication preferences in mind.</p></header>
      <div class="reference-welcome__grid">
        <div class="reference-welcome__photos">
          <img src="${group}" alt="The Deaf Safaris team at Kilimanjaro’s summit." loading="lazy" width="975" height="1280" />
          <img src="${safari}" alt="An elephant beside safari vehicles in Ngorongoro Crater." loading="lazy" width="640" height="420" />
          <img src="${giraffes}" alt="Giraffes together in Arusha National Park." loading="lazy" width="640" height="420" />
          <img src="${portrait}" alt="Ertines beside the Kilimanjaro glaciers." loading="lazy" width="581" height="839" />
        </div>
        <div class="reference-welcome__features">${PawTrail()}${highlights.map(([title, copy], index) => `<article><span class="reference-welcome__number">0${index + 1}</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div>
      </div>
    </div>
  </section>`;
}
