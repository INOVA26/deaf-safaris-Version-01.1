import { destinations } from '../data/destinations.js';
import { TourCard } from './TourCard.js';
import marketPhoto from '../assets/images/arusha-market.jpg';
import zebras from '../assets/images/serval-wildlife/zebras.png';

// Names follow the owner's requested order. Unconfirmed venues/photos remain drafts.
const places = [
  {
    ...destinations.find((place) => place.id === 'chemka'),
    name: 'Chemka Hot Spring',
  },
  {
    id: 'wildlife-place',
    name: 'Serval Wildlife',
    priceLabel: '150K',
    priceUnit: 'per person',
    photos: [
      {
        src: zebras,
        alt: 'A visitor holding a basket between two zebras at Serval Wildlife.',
        position: 'center 60%',
      },
    ],
    eyebrow:
      'Discover Serval Wildlife, with giraffes and zebras. Plan your visit with us.',
    highlights: [
      ['wildlife', 'Wildlife'],
      ['camera', 'Photos'],
      ['pace', 'Plan ahead'],
    ],
  },
  {
    ...destinations.find((place) => place.id === 'culture'),
    name: 'Arts & Culture',
  },
  {
    id: 'waterfall-place',
    name: 'Waterfall',
    priceLabel: '$120',
    priceUnit: 'per person',
    photos: [],
    eyebrow: 'Waterfall visit — location and arrangements awaiting confirmation.',
    highlights: [
      ['water', 'Waterfall'],
      ['camera', 'Photos'],
      ['pace', 'Plan ahead'],
    ],
  },
  {
    id: 'napur-place',
    name: 'Napur',
    priceLabel: '$120',
    priceUnit: 'per person',
    photos: [],
    eyebrow:
      'Draft place — spelling, location and visit details awaiting confirmation.',
    highlights: [
      ['landscape', 'Place to explore'],
      ['camera', 'Photos'],
      ['pace', 'Plan ahead'],
    ],
  },
  {
    id: 'markets-place',
    name: 'Markets',
    priceLabel: 'No visit fee',
    photos: [{ src: marketPhoto, alt: 'Market scene in Arusha.' }],
    eyebrow: 'Enjoy local markets and discover everyday life in Arusha.',
    highlights: [
      ['market', 'Markets'],
      ['walking', 'Street walks'],
      ['school', 'School visits'],
    ],
  },
].map((place) => ({ ...place, enquiryOnly: true, badge: 'Places' }));

export function Places() {
  return `<section class="reference-trips" id="places" aria-labelledby="places-heading" data-tour-disclosure>
    <h2 class="sr-only" id="places-heading">Places</h2>
    <div class="reference-trip-grid">${places
      .slice(0, 3)
      .map((place) => TourCard(place))
      .join('')}</div>
    <div class="tour-extra" id="more-places" data-tour-extra hidden><div class="reference-trip-grid">${places
      .slice(3)
      .map((place) => TourCard(place))
      .join('')}</div>
      <p class="reference-trips__visit-note"><strong>Enjoy more of Arusha — no visit fee.</strong> Explore local markets, stroll the streets or <a href="#enquiries">arrange a school visit with us in advance.</a> Transport, purchases and gifts are separate.</p>
    </div>
    <div class="reference-trips__actions"><button class="button reference-more" type="button" data-tour-toggle aria-expanded="false" aria-controls="more-places">More Details</button></div>
  </section>`;
}
