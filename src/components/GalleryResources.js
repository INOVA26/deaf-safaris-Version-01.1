import { galleryPhotos } from '../data/galleryPhotos.js';
import { companyPhotos } from '../data/companyPhotos.js';
import { escapeHtml } from '../utils/escapeHtml.js';

const slides = [
  {
    name: 'Wildlife & inspiration',
    feature: companyPhotos.antelope,
    title: 'Tanzania through your lens',
    subtitle: 'Find your next story',
    copy: 'Wildlife, open landscapes and moments worth remembering. Take a closer look at Tanzania and imagine the journey you would love to make.',
    middle: companyPhotos.giraffes,
    middleTitle: 'Budget Guidelines',
    middleSubtitle: 'What shapes your safari cost?',
    middleCopy:
      'Your route, travel dates and preferred stays shape your budget. Start with our planning guide and build a brief around your priorities.',
    last: companyPhotos.tarangire,
    lastTitle: 'Top Trip Ideas',
    lastSubtitle: 'Find your kind of adventure',
    lastCopy:
      'From wildlife on the plains to mountain landscapes, explore Tanzania’s destinations and start your own wish list.',
  },
  {
    name: 'Mountain moments',
    feature: galleryPhotos[4],
    title: 'A different perspective',
    subtitle: 'Moments on the mountain',
    copy: 'Explore mountain photographs and get inspired by Kilimanjaro’s landscapes. Share your goals, experience and preferred pace as you plan.',
    middle: companyPhotos.kilimanjaro,
    middleTitle: 'Mountain Planning',
    middleSubtitle: 'Begin with your goals',
    middleCopy:
      'Think about your route, preparation and time on the mountain. Our planning guide is a starting point for your questions.',
    last: galleryPhotos[0],
    lastTitle: 'Journeys Together',
    lastSubtitle: 'Make room for shared moments',
    lastCopy:
      'See mountain and safari ideas, then tell us which places you would like to include in your journey.',
  },
  {
    name: 'Explore at your pace',
    feature: companyPhotos.arusha,
    title: 'Time to look a little closer',
    subtitle: 'Discover your Tanzania',
    copy: 'From quiet wildlife encounters to wide-open views, find inspiration in the gallery. Leave room for the moments that catch your eye.',
    middle: companyPhotos.tarangire,
    middleTitle: 'Your Safari, Your Pace',
    middleSubtitle: 'Start with what matters to you',
    middleCopy:
      'Note your interests, communication preferences and travel dates. Bring those ideas together in a personal safari brief.',
    last: companyPhotos.giraffes,
    lastTitle: 'Places to Explore',
    lastSubtitle: 'Build your own wish list',
    lastCopy:
      'Browse our destination collection for wildlife, landscapes and cultural inspiration, then choose what speaks to you.',
  },
  {
    name: 'Shared discoveries',
    feature: companyPhotos.giraffes,
    title: 'Memories made together',
    subtitle: 'A journey worth sharing',
    copy: 'Take inspiration from Tanzania’s wildlife and landscapes. Bring your favourite ideas together and imagine where your journey could lead.',
    middle: companyPhotos.arusha,
    middleTitle: 'Make It Personal',
    middleSubtitle: 'Plan around your interests',
    middleCopy:
      'Share the places you hope to see, your preferred pace and your communication needs in your personal travel brief.',
    last: companyPhotos.kilimanjaro,
    lastTitle: 'Beyond the Plains',
    lastSubtitle: 'Discover another view',
    lastCopy:
      'Explore mountain scenery alongside wildlife destinations and collect ideas for your own Tanzania journey.',
  },
];
const photo = (item) =>
  `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" width="640" height="480" loading="lazy" decoding="async" />`;

export function GalleryResources() {
  return `<section class="tour-gallery" id="gallery" aria-labelledby="gallery-heading" aria-roledescription="carousel">
    <div class="reference-container">
      <header class="tour-gallery__heading"><h2 id="gallery-heading">Gallery From Our Tours</h2><p>Discover Tanzania through our photographs.<br />Find inspiration for a journey shaped around you.</p></header>
      <p class="tour-gallery__label">Resources For Planning Your Safari</p>
      <div class="tour-gallery__viewport" data-gallery-viewport>
        <div class="tour-gallery__track" data-gallery-track>${slides
          .map(
            (slide, index) => `
          <div class="tour-gallery__slide" id="gallery-slide-${index + 1}" data-gallery-slide role="group" aria-roledescription="slide" aria-label="${index + 1} of ${slides.length}: ${escapeHtml(slide.name)}" ${index ? 'inert aria-hidden="true"' : 'aria-hidden="false"'}>
            <article class="tour-gallery__feature">${photo(slide.feature)}<div><h3>${escapeHtml(slide.title)}</h3><h4>${escapeHtml(slide.subtitle)}</h4><p>${escapeHtml(slide.copy)}</p><a class="button tour-gallery__link" href="#photo-gallery">Explore the gallery</a></div></article>
            <article class="tour-gallery__resource"><div><h3>${escapeHtml(slide.middleTitle)}</h3><h4>${escapeHtml(slide.middleSubtitle)}</h4><p>${escapeHtml(slide.middleCopy)}</p><a class="button tour-gallery__link" href="#planning">See our guide</a></div>${photo(slide.middle)}</article>
            <article class="tour-gallery__resource tour-gallery__resource--reverse">${photo(slide.last)}<div><h3>${escapeHtml(slide.lastTitle)}</h3><h4>${escapeHtml(slide.lastSubtitle)}</h4><p>${escapeHtml(slide.lastCopy)}</p><a class="button tour-gallery__link" href="#traveller-destinations">View our list</a></div></article>
          </div>`,
          )
          .join('')}</div>
      </div>
      <div class="tour-gallery__controls" role="group" aria-label="Gallery slideshow controls">
        <div class="tour-gallery__dots" role="group" aria-label="Choose a gallery slide">${slides.map((slide, index) => `<button type="button" data-gallery-dot="${index}" aria-label="Show ${escapeHtml(slide.name)}" aria-controls="gallery-slide-${index + 1}" aria-pressed="${index === 0}"><span aria-hidden="true"></span></button>`).join('')}</div>
      </div>
      <p class="sr-only" data-gallery-announcement role="status" aria-live="polite"></p>
    </div>
  </section>`;
}
