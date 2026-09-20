import elephants from '../assets/images/deaf-safaris/tarangire-elephants.png';
import giraffes from '../assets/images/deaf-safaris/giraffe.png';
import antelope from '../assets/images/deaf-safaris/impala.png';
import arusha from '../assets/images/deaf-safaris/arusha-giraffe.png';
import kilimanjaro from '../assets/images/deaf-safaris/kilimanjaro-lemosho.jpg';

const photo = (src, file, alt) => ({
  src,
  file,
  alt,
  source: 'https://deafsafaris.co.tz/',
  original: `https://deafsafaris.co.tz/assets/images/background/${encodeURIComponent(file)}`,
  author: 'Deaf Safaris website',
  license: 'Website imagery supplied by user request; original rights not specified',
});
export const companyPhotos = {
  tarangire: photo(
    elephants,
    'elephants tarangire.png',
    'A herd of elephants gathered on grassy ground in Tarangire.',
  ),
  giraffes: photo(
    giraffes,
    'giraffe.png',
    'Adult giraffes and a calf standing together in grassland.',
  ),
  antelope: photo(
    antelope,
    'impala.png',
    'A horned antelope standing in golden grass.',
  ),
  arusha: photo(
    arusha,
    'giraffe arusha national park.png',
    'Giraffes and a calf in Arusha National Park.',
  ),
  kilimanjaro: photo(
    kilimanjaro,
    'lemosho.jpg',
    'A yellow tent below Kilimanjaro’s snowy summit slopes.',
  ),
};
export const featuredPhotos = [
  companyPhotos.tarangire,
  companyPhotos.giraffes,
  companyPhotos.antelope,
];
