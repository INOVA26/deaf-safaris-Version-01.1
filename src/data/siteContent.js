import { photos } from './photos.js';

// Editorial inspiration, not a list of confirmed Deaf Safaris packages.
// Add only approved business facts, contact details, and licensed image imports.
export const safariIdeas = [
  {
    number: '01',
    title: 'Wildlife encounters',
    category: 'For the curious',
    description:
      'The anticipation of a sighting. The quiet of watching. Start with the wildlife you would love to see.',
    theme: 'wildlife',
    photo: photos.elephants,
  },
  {
    number: '02',
    title: 'Wide-open landscapes',
    category: 'For the explorers',
    description:
      'Open horizons, changing light, and room to pause. Let the landscapes inspire your wish list.',
    theme: 'landscapes',
    photo: photos.sunset,
  },
  {
    number: '03',
    title: 'A slower kind of journey',
    category: 'For the unhurried',
    description:
      'More time to notice the little things. Think about the pace that would make a journey feel like yours.',
    theme: 'slow',
    photo: photos.giraffes,
  },
];

export const planningSteps = [
  {
    title: 'Find your inspiration',
    text: 'Choose what draws you in: wildlife, landscapes, photography, or simply time away.',
  },
  {
    title: 'Make it personal',
    text: 'Note your preferred dates, group size, pace, and communication preferences.',
  },
  {
    title: 'Keep your questions close',
    text: 'Save a brief to discuss once contact details and safari arrangements are confirmed.',
  },
];
