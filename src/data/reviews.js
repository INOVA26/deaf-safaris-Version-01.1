import serengeti from '../assets/images/serengeti.jpg';
import kilimanjaro from '../assets/images/kilimanjaro.jpg';
import sunset from '../assets/images/savannah-sunset.jpg';

// Sample content for the prototype. Published reviews need visitor approval and a backend.
export const featuredReviews = [
  {
    name: 'Jane Smith',
    date: '12 August 2025',
    createdAt: '2025-08-12T00:00:00.000Z',
    destination: 'Kilimanjaro',
    title: 'A proud moment at the summit',
    review:
      'Mount Kilimanjaro is so beautiful. Thank you Deaf Safaris, and thank you Eddy, for supporting me on the journey to the summit.',
    rating: 5,
    image: kilimanjaro,
    alt: 'Mount Kilimanjaro rising above the landscape.',
  },
  {
    name: 'Amina Joseph',
    date: '28 July 2025',
    createdAt: '2025-07-28T00:00:00.000Z',
    destination: 'Serengeti',
    title: 'The wild felt within reach',
    review:
      'The open plains and patient guiding made every moment feel welcoming. I felt included, prepared, and ready to take in the wildlife.',
    rating: 5,
    image: serengeti,
    alt: 'Giraffes walking across the Serengeti grasslands.',
  },
  {
    name: 'Daniel Mwita',
    date: '06 June 2025',
    createdAt: '2025-06-06T00:00:00.000Z',
    destination: 'Ngorongoro',
    title: 'A beautiful day to remember',
    review:
      'The crater views were unforgettable. Clear communication and thoughtful support made this feel like my adventure from beginning to end.',
    rating: 5,
    image: sunset,
    alt: 'Warm light across the Tanzanian savannah.',
  },
];
