import credits from './destinationPhotoCredits.json';
import { companyPhotos } from './companyPhotos.js';

const files = import.meta.glob('../assets/images/destinations/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});

export { credits as destinationPhotoCredits };
const descriptions = {
  'kilimanjaro-1.jpg':
    'Mount Kilimanjaro rising above green plains in the morning mist.',
  'kilimanjaro-2.jpg':
    'An aerial view of Kilimanjaro’s snow-covered summit and surrounding clouds.',
  'kilimanjaro-3.jpg':
    'A trail through flowering shrubs and rocks on Kilimanjaro’s Shira moorlands.',
  'serengeti-1.jpg':
    'Golden sunrise over grassland and a distant hill in the Serengeti.',
  'serengeti-2.jpg':
    'An acacia tree standing in golden grassland in Serengeti National Park.',
  'serengeti-3.jpg':
    'A large weathered rock rising above green shrubs in the Serengeti.',
  'ngorongoro-1.jpg':
    'An elephant beside safari vehicles beneath the Ngorongoro crater walls.',
  'ngorongoro-2.jpg': 'A black-backed jackal standing in grass in Ngorongoro Crater.',
  'ngorongoro-3.jpg': 'A yellow Speke’s weaver perched on a green stem in Ngorongoro.',
  'tarangire-1.jpg':
    'Elephants moving through tall grass beside trees in Tarangire National Park.',
  'tarangire-2.jpg': 'Elephants gathered beneath a large baobab tree in Tarangire.',
  'tarangire-3.jpg': 'A herd of elephants with calves among trees in Tarangire.',
  'arusha-1.jpg': 'Banana plants on a hillside overlooking the Arusha landscape.',
  'arusha-2.jpg': 'A giraffe in front of wooded hills in Arusha National Park.',
  'arusha-3.jpg': 'Buffalo grazing in green grass in Arusha National Park.',
  'chemka-1.jpg':
    'Visitors enjoying the clear water under trees at Chemka Hot Springs.',
  'chemka-2.jpg':
    'Turquoise water shaded by palms and exposed roots at Chemka Hot Springs.',
  'chemka-3.jpg': 'Clear blue spring water framed by tree roots at Chemka.',
  'culture-1.jpg': 'The sculptural exterior of Arusha’s Cultural Heritage Centre.',
  'culture-2.jpg':
    'Sculptures outside a craft building at the Cultural Heritage Centre.',
  'culture-3.jpg': 'The archway entrance to Arusha’s Cultural Heritage Centre.',
};
const sequences = {
  kilimanjaro: [2, 1, 3],
  tarangire: [3, 2, 1],
  arusha: [2, 3, 1],
  chemka: [2, 3, 1],
};
export function photosFor(destination) {
  const photos = (sequences[destination] || [1, 2, 3])
    .map((number) =>
      credits.find((photo) => photo.file === `${destination}-${number}.jpg`),
    )
    .map((photo) => ({
      ...photo,
      src: files[`../assets/images/destinations/${photo.file}`],
      alt: descriptions[photo.file],
    }));
  if (companyPhotos[destination]) photos[0] = companyPhotos[destination];
  return photos;
}
