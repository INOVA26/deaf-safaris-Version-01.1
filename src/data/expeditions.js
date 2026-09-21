import serengeti from '../assets/images/serengeti.jpg';
import kilimanjaro from '../assets/images/kilimanjaro.jpg';
import { photos } from './photos.js';

// Reference design content. Itineraries and support remain draft proposals.
export const expeditions = [
  {
    title: 'Serengeti Wildlife Safari',
    destination: 'Serengeti',
    days: 3,
    duration: 'Draft itinerary · 3 days · 2 nights',
    image: serengeti,
    alt: 'Four giraffes on green grassland with hills behind them.',
    tag: 'Into the wild',
    description:
      'Wide-open plains, remarkable wildlife, and time to take it all in. Start a brief with your preferred pace and communication needs.',
  },
  {
    title: 'Ngorongoro Crater Escape',
    destination: 'Ngorongoro',
    days: 1,
    duration: 'Draft itinerary · 1 day · private journey',
    image: photos.sunset.src,
    alt: photos.sunset.alt,
    tag: 'Safari inspiration',
    description:
      'Imagine a personal day of wildlife encounters, scenic stops, and shared discoveries. Illustrative savannah photo; route to be confirmed.',
  },
  {
    title: 'Kilimanjaro Together',
    destination: 'Kilimanjaro',
    days: null,
    duration: 'Draft itinerary · route to be confirmed',
    image: kilimanjaro,
    alt: 'A tent below the snow-covered slopes of Mount Kilimanjaro.',
    tag: 'Reach new heights',
    description:
      'Make room for a bigger adventure. Include your route ideas, preferred pace, and communication preferences in your personal brief.',
  },
];
