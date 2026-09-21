import { Footer } from './components/Footer.js';
import { Header, initHeader } from './components/Header.js';
import { Chat, initChat } from './components/Chat.js';
import { Hero, initHeroPlanner } from './components/Hero.js';
import { initPlannerDropdowns } from './utils/plannerDropdowns.js';
import { Destinations, initDestinations } from './components/Destinations.js';
import { initSafariIdeaCards } from './components/SafariIdeaCards.js';
import { FeaturedSafari, initFeaturedSafari } from './components/FeaturedSafari.js';
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
import './styles/global.css';
import './styles/components.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="page-intro">
    ${Header()}
    <main id="main-content" tabindex="-1">
      ${Hero()}
      ${Destinations()}
      ${About()}
      ${FeaturedSafari()}
      ${SafariResults()}
      ${AboutPage()}
      ${Planning()}
      ${Guides()}
      ${PhotoGallery()}
      ${ReviewPreview()}
      ${DestinationListings()}
      ${Reviews()}
      ${Enquiry()}
    </main>
  </div>
  ${Footer()}
  ${Chat()}
`;

const disposeHeader = initHeader();
const disposeChat = initChat();
const disposeSafariIdeaCards = initSafariIdeaCards();
const disposeAboutPage = initAboutPage();
const disposePhotoGallery = initPhotoGallery();
const disposeReviews = initReviews();
const disposeReviewPreview = initReviewPreview();
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
  document.querySelector('#hero-planner').scrollIntoView();
  document
    .querySelector(
      '.hero__select-trigger:not([hidden]), #hero-destination:not([hidden])',
    )
    .focus({ preventScroll: true });
}
const disposeDestinations = initDestinations(undefined, chooseDestination);
const disposeDestinationListings = initDestinationListings(
  undefined,
  chooseDestination,
);
const disposePlanning = initPlanning(undefined, chooseDestination);
const disposeFeaturedSafari = initFeaturedSafari(undefined, chooseDestination);
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
    disposeHeader();
    disposeChat();
    disposeAboutPage();
    disposePhotoGallery();
    disposeReviews();
    disposeReviewPreview();
    disposeHeroPlanner();
    disposePlannerDropdowns();
    disposeDestinations();
    disposeDestinationListings();
    disposePlanning();
    disposeFeaturedSafari();
    disposeSafariIdeaCards();
    results.dispose();
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
  const activePage = aboutPage
    ? 'about'
    : safariPage
      ? 'safaris'
      : reviewsPage
        ? 'reviews'
        : null;
  for (const section of document.querySelector('#main-content').children) {
    section.hidden = activePage
      ? section.id !== activePage
      : ['safaris', 'about', 'reviews'].includes(section.id);
  }
  document.title = aboutPage
    ? 'About us | Deaf Safaris'
    : safariPage
      ? 'Explore safaris | Deaf Safaris'
      : reviewsPage
        ? 'Traveller reviews | Deaf Safaris'
        : 'Deaf Safaris | Your Next Adventure. Beyond Words.';
  if (aboutPage) {
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
  } else if (wasSafariPage || wasAboutPage || wasReviewsPage) {
    document.getElementById(window.location.hash.slice(1) || 'home')?.scrollIntoView();
  }
}

window.addEventListener('hashchange', syncPageView);
syncPageView();
