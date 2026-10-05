import { PageBanner } from './components/PageBanner.js';
import { DestinationPages, detailPlaces } from './components/DestinationPages.js';
import { galleryPhotos } from './data/galleryPhotos.js';
import { initResponsiveRows } from './utils/responsiveRows.js';
import { Footer, initFooter } from './components/Footer.js';
import { Header, initHeader } from './components/Header.js';
import { Chat, initChat } from './components/Chat.js';
import { Hero, initHeroPlanner } from './components/Hero.js';
import { initHeroBackdrop } from './utils/heroBackdrop.js';
import { TripCards, initTripCards } from './components/TripCards.js';
import { Places } from './components/Places.js';
import { PromiseBanner, initPromiseBanner } from './components/PromiseBanner.js';
import { GalleryResources } from './components/GalleryResources.js';
import { initGalleryCarousel } from './utils/galleryCarousel.js';
import { FeaturedTrips } from './components/FeaturedTrips.js';
import { initPlannerDropdowns } from './utils/plannerDropdowns.js';
import { About } from './components/About.js';
import { Guides } from './components/Guides.js';
import { PhotoGallery, initPhotoGallery } from './components/PhotoGallery.js';
import { AboutPage, initAboutPage } from './components/AboutPage.js';
import { Planning, initPlanning } from './components/Planning.js';
import { Reviews, initReviews } from './components/Reviews.js';
import { ReviewPreview, initReviewPreview } from './components/ReviewPreview.js';
import {
  DestinationListings,
  initDestinationListings,
} from './components/DestinationListings.js';
import { Enquiry, initEnquiry } from './components/Enquiry.js';
import { SafariResults, initSafariResults } from './components/SafariResults.js';
import { safariSearchHash } from './utils/safariSearch.js';
import { initTourDisclosure } from './utils/tourDisclosure.js';
import { initScrollReveal } from './utils/scrollReveal.js';
import './styles/global.css';
import './styles/components.css';

const app = document.querySelector('#app');
let visiblePage = null;

app.innerHTML = `
  <div class="page-intro">
    ${Header()}
    <main id="main-content" tabindex="-1">
      <div id="page-banner" hidden></div>
      ${Hero()}
      ${About()}
      ${TripCards()}
      ${PromiseBanner()}
      ${Places()}
      ${ReviewPreview()}
      ${GalleryResources()}
      ${Guides()}
      ${FeaturedTrips()}
      ${SafariResults()}
      ${AboutPage()}
      ${Planning()}
      ${PhotoGallery()}
      ${DestinationListings()}
      ${DestinationPages()}
      ${Reviews()}
      ${Enquiry()}
    </main>
  </div>
  ${Footer()}
  ${Chat()}
`;

const disposeResponsiveRows = initResponsiveRows();
const disposeHeader = initHeader();
const disposeTourDisclosure = initTourDisclosure();
const disposeScrollReveal = initScrollReveal();
const disposeFooter = initFooter();
const disposeChat = initChat();
const disposeHeroBackdrop = initHeroBackdrop(document.querySelector('.hero'));
const disposeAboutPage = initAboutPage();
const disposePhotoGallery = initPhotoGallery();
const disposeReviews = initReviews();
const disposeReviewPreview = initReviewPreview();
const disposePromiseBanner = initPromiseBanner();
const disposeGalleryCarousel = initGalleryCarousel();
initEnquiry();
const disposeHeroPlanner = initHeroPlanner((answers) => {
  window.location.hash = safariSearchHash(answers);
});
const disposePlannerDropdowns = initPlannerDropdowns();
function restorePlanner(search) {
  for (const [name, value] of Object.entries(search)) {
    const select = document.querySelector(`#hero-${name}`);
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
function chooseDestination(destination) {
  restorePlanner({ destination });
  window.location.hash = '#hero-planner';
  syncPageView();
  document.querySelector('#hero-planner').scrollIntoView();
  document
    .querySelector(
      '.hero__select-trigger:not([hidden]), #hero-destination:not([hidden])',
    )
    .focus({ preventScroll: true });
}
const disposeTripCards = initTripCards(chooseDestination);
const disposeDestinationListings = initDestinationListings(
  undefined,
  chooseDestination,
);
const disposePlanning = initPlanning(undefined, chooseDestination);
const results = initSafariResults({
  onEdit(search) {
    restorePlanner(search);
    window.location.hash = '#hero-planner';
    syncPageView();
    document.querySelector('#hero-planner').scrollIntoView();
    document
      .querySelector(
        '.hero__select-trigger:not([hidden]), #hero-destination:not([hidden])',
      )
      .focus({ preventScroll: true });
  },
  onPlan(search) {
    restorePlanner(search);
    window.location.hash = '#enquiries';
    syncPageView();
    document
      .querySelector('#hero-planner')
      .dispatchEvent(new Event('planner:choose', { cancelable: true }));
  },
});
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    disposeTourDisclosure();
    disposeScrollReveal();
    disposeResponsiveRows();
    disposeHeader();
    disposeFooter();
    disposeChat();
    disposeHeroBackdrop();
    disposeAboutPage();
    disposePhotoGallery();
    disposeReviews();
    disposeReviewPreview();
    disposePromiseBanner();
    disposeGalleryCarousel();
    disposeHeroPlanner();
    disposePlannerDropdowns();
    disposeTripCards();
    disposeDestinationListings();
    disposePlanning();
    results.dispose();
    document.removeEventListener('click', preparePlaceEnquiry);
    window.removeEventListener('hashchange', syncPageView);
  });
}

function syncPageView() {
  const safariPage = window.location.hash.split('?')[0] === '#safaris';
  const aboutPage = window.location.hash === '#about';
  const reviewsPage = window.location.hash === '#reviews';
  const wasSafariPage = document.body.classList.contains('safaris-page');
  const wasAboutPage = document.body.classList.contains('about-page-view');
  const wasReviewsPage = document.body.classList.contains('reviews-page');
  document.body.classList.toggle('safaris-page', safariPage);
  document.body.classList.toggle('about-page-view', aboutPage);
  document.body.classList.toggle('reviews-page', reviewsPage);
  const extraPages = [
    'enquiries',
    'planning',
    'photo-gallery',
    'traveller-destinations',
    ...detailPlaces.map((place) => `place-${place.id}`),
  ];
  const extraPage = extraPages.find((id) => window.location.hash === `#${id}`);
  const wasExtraPage = document.body.classList.contains('detail-page');
  document.body.classList.toggle('detail-page', Boolean(extraPage));
  const activePage =
    extraPage ||
    (aboutPage ? 'about' : safariPage ? 'safaris' : reviewsPage ? 'reviews' : null);
  const pageChanged = visiblePage !== activePage;
  visiblePage = activePage;
  document.body.classList.toggle('home-page', !activePage);
  for (const section of document.querySelector('#main-content').children) {
    if (section.id === 'page-banner') continue;
    section.hidden = activePage
      ? section.id !== activePage
      : ['safaris', 'about', 'reviews', ...extraPages].includes(section.id);
  }
  const detailTitles = {
    ...Object.fromEntries(
      detailPlaces.map((place) => [`place-${place.id}`, place.name]),
    ),
    about: 'About us',
    reviews: 'Traveller reviews',
    enquiries: 'Plan your safari',
    planning: 'Planning your journey',
    'photo-gallery': 'Photo gallery',
    'traveller-destinations': 'Explore Tanzania',
  };
  const banner = document.querySelector('#page-banner');
  const showBanner = Boolean(activePage && !safariPage);
  banner.hidden = !showBanner;
  document.body.classList.toggle('page-with-banner', showBanner);
  if (showBanner && pageChanged) {
    const place = detailPlaces.find((item) => `place-${item.id}` === activePage);
    banner.innerHTML = PageBanner({
      title: detailTitles[activePage],
      photo: place?.photos?.[0] || (aboutPage ? galleryPhotos[0] : undefined),
    });
  }
  document.title = extraPage
    ? `${detailTitles[extraPage]} | Deaf Safaris`
    : aboutPage
      ? 'About us | Deaf Safaris'
      : safariPage
        ? 'Explore safaris | Deaf Safaris'
        : reviewsPage
          ? 'Traveller reviews | Deaf Safaris'
          : 'Deaf Safaris | Your Next Adventure. Beyond Words.';
  if (extraPage) {
    if (pageChanged) {
      const target = document.getElementById(extraPage);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  } else if (aboutPage) {
    if (!wasAboutPage) {
      document.querySelector('#about-page-heading').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  } else if (safariPage) {
    results.render();
    if (!wasSafariPage) {
      document.querySelector('#safari-results-heading').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  } else if (reviewsPage) {
    if (!wasReviewsPage) {
      document.querySelector('#reviews-heading').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  } else if (wasSafariPage || wasAboutPage || wasReviewsPage || wasExtraPage) {
    const target = document.getElementById(window.location.hash.slice(1) || 'home');
    target?.setAttribute('tabindex', '-1');
    target?.focus({ preventScroll: true });
    target?.scrollIntoView();
  }
  if (showBanner && pageChanged) {
    banner.querySelector('h1').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function preparePlaceEnquiry(event) {
  const link = event.target.closest('[data-place-brief]');
  if (!link) return;
  const notes = document.querySelector('#preferences');
  const brief = `Destination: ${link.dataset.placeBrief}`;
  if (!notes.value.includes(brief) && notes.value.length + brief.length < 2000)
    notes.value = `${brief}\n${notes.value}`;
  document.querySelector('#enquiry-form').hidden = false;
  document.querySelector('#brief-result').hidden = true;
  document.querySelector('#brief-status').textContent =
    `Planning a visit to ${link.dataset.placeBrief}. Your existing notes are preserved.`;
}
document.addEventListener('click', preparePlaceEnquiry);

window.addEventListener('hashchange', syncPageView);
syncPageView();
