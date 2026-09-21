import { companyPhotos } from './companyPhotos.js';
import team from '../assets/images/team-group.jpeg';
import portrait from '../assets/images/about-mountain-portrait.jpg';

export const galleryPhotos = [
  {
    src: team,
    alt: 'The Deaf Safaris team holding their banner at the Uhuru Peak summit sign.',
    title: 'Together at the summit',
    location: 'Kilimanjaro',
    width: 975,
    height: 1280,
  },
  {
    ...companyPhotos.tarangire,
    title: 'A moment on the plains',
    location: 'Tarangire',
  },
  {
    ...companyPhotos.kilimanjaro,
    title: 'A camp above the clouds',
    location: 'Kilimanjaro',
  },
  {
    ...companyPhotos.giraffes,
    title: 'Life in the grasslands',
    location: 'Tanzania',
  },
  {
    src: portrait,
    alt: 'Ertines smiling in a blue jacket and red hat beside the Kilimanjaro glaciers.',
    title: 'Ertines on the mountain',
    location: 'Kilimanjaro',
    width: 581,
    height: 839,
  },
];
