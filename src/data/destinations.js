import { photosFor } from './destinationPhotos.js';

// Destination facts: docs/destination-content.md. These are travel ideas,
// not confirmed itineraries or promises of communication support.
const places = [
  {
    id: 'serengeti',
    name: 'Serengeti',
    eyebrow: 'Wide horizons. Unforgettable wildlife.',
    description:
      'The Serengeti’s sweeping grasslands set the scene for wildlife and wide-open views. Imagine time to watch, photograph and share what you see — then tell us your preferred pace and communication needs.',
    symbol: 'wildlife',
    highlights: [
      ['wildlife', 'Wildlife watching'],
      ['landscape', 'Open landscapes'],
      ['camera', 'Photography moments'],
    ],
  },
  {
    id: 'ngorongoro',
    name: 'Ngorongoro',
    eyebrow: 'A crater landscape full of possibility.',
    description:
      'Ngorongoro’s volcanic crater brings dramatic scenery and wildlife into one remarkable landscape. Start your wish list with scenic stops and shared discoveries, and include the signing or written communication you prefer.',
    symbol: 'landscape',
    highlights: [
      ['landscape', 'Crater scenery'],
      ['wildlife', 'Wildlife watching'],
      ['camera', 'Scenic stops'],
    ],
  },
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    eyebrow: 'Big mountain dreams begin with a conversation.',
    description:
      'Kilimanjaro rises from forested slopes to Africa’s highest summit. Share what draws you to the mountain, your experience and your communication preferences; routes, physical demands and support need individual discussion.',
    symbol: 'mountain',
    highlights: [
      ['mountain', 'Mountain landscapes'],
      ['camera', 'A new perspective'],
      ['pace', 'Your pace & goals'],
    ],
  },
  {
    id: 'tarangire',
    name: 'Tarangire',
    eyebrow: 'Elephants, baobabs and room to pause.',
    description:
      'Tarangire is known for its elephants and baobab-dotted landscapes. Build an idea around wildlife, photography and time to take it all in, with your group’s pace and communication preferences at the heart of your brief.',
    symbol: 'wildlife',
    highlights: [
      ['wildlife', 'Elephant country'],
      ['landscape', 'Baobab landscapes'],
      ['pace', 'Time to observe'],
    ],
  },
  {
    id: 'arusha',
    name: 'Arusha National Park',
    label: 'Arusha National Park',
    symbol: 'landscape',
    eyebrow: 'Forest paths, lake views and Mount Meru.',
    description:
      'Arusha National Park brings together Mount Meru, the Momella Lakes and wildlife-rich landscapes. Share whether you are drawn to scenery, wildlife or photography, along with the pace and communication arrangements you would like to discuss.',
    highlights: [
      ['mountain', 'Mount Meru scenery'],
      ['landscape', 'Momella Lakes'],
      ['wildlife', 'Wildlife watching'],
    ],
  },
  {
    id: 'chemka',
    name: 'Chemka Hot Springs',
    label: 'Chemka Hot Springs',
    symbol: 'water',
    eyebrow: 'Clear water. Green shade. A change of pace.',
    description:
      'Also known as Kikuletwa, Chemka’s clear springs offer a different side of the Kilimanjaro region. Add a nature stop to your wish list, then discuss access, water activities and communication arrangements before deciding what suits your group.',
    highlights: [
      ['water', 'Natural springs'],
      ['landscape', 'Leafy surroundings'],
      ['pace', 'A slower moment'],
    ],
  },
  {
    id: 'culture',
    name: 'Arusha Cultural Heritage Centre',
    label: 'Arts & culture',
    symbol: 'art',
    eyebrow: 'Stories told through art, craft and creativity.',
    description:
      'Explore an arts-and-culture idea around Arusha’s Cultural Heritage Centre. Let paintings, sculpture and craft spark your curiosity, and include your interests and preferred signing or written communication in your personal brief.',
    highlights: [
      ['art', 'Art & sculpture'],
      ['camera', 'Creative inspiration'],
      ['signing', 'Your communication preferences'],
    ],
  },
];

const order = [
  'kilimanjaro',
  'serengeti',
  'ngorongoro',
  'tarangire',
  'arusha',
  'chemka',
  'culture',
];
export const destinations = order.map((id) => ({
  ...places.find((place) => place.id === id),
  photos: photosFor(id),
}));
