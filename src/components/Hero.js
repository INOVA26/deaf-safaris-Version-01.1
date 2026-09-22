import teamPhoto from '../assets/images/team-group.jpeg';
import mountainPhoto from '../assets/images/destinations/kilimanjaro-2.jpg';
import plainsPhoto from '../assets/images/destinations/serengeti-2.jpg';
import { destinations } from '../data/destinations.js';

const icon = (name) =>
  `<span class="material-symbols-rounded" aria-hidden="true">${name}</span>`;

function field(name, label, options, placeholder = '') {
  const translationKey = {
    destination: 'planner.destination',
    season: 'planner.season',
    'sign-language': 'planner.sign',
    travellers: 'planner.travellers',
  }[name];
  return `<div class="hero__field"><div>
    <label id="hero-${name}-label" for="hero-${name}" data-i18n="${translationKey}">${label}</label>
    <select id="hero-${name}" name="${name}" aria-labelledby="hero-${name}-label">${placeholder ? `<option value="" selected>${placeholder}</option>` : ''}${options.map(([value, text, selected]) => `<option value="${value}" ${selected ? 'selected' : ''}>${text}</option>`).join('')}</select>
  </div></div>`;
}

export function Hero() {
  return `
    <section id="home" class="hero" aria-labelledby="hero-heading" data-backdrop-motion="paused">
      <div class="hero__backdrop">
        <img class="hero__background is-active" data-hero-photo src="${teamPhoto}" alt="A group holding a Deaf Safaris banner at the Mount Kilimanjaro summit sign." width="975" height="1280" fetchpriority="high" />
        <img class="hero__background hero__background--mountain" data-hero-photo src="${mountainPhoto}" alt="Mount Kilimanjaro's snowy summit above the clouds." aria-hidden="true" decoding="async" />
        <img class="hero__background" data-hero-photo src="${plainsPhoto}" alt="An acacia tree on the golden plains of Serengeti National Park." aria-hidden="true" decoding="async" />
      </div>
      <div class="hero__shade" aria-hidden="true"></div>
      <div class="container hero__body">
        <div class="hero__intro">
          <h1 id="hero-heading">Deaf Safaris<br /><span>Today &amp; Tomorrow</span></h1>
          <p class="hero__description" data-i18n="hero.description">From the heights of Kilimanjaro to the wilds of the Serengeti, imagine Tanzania through shared discovery. Start with your journey ideas and sign-language preferences.</p>
        </div>
        <form id="hero-planner" class="hero__planner" aria-label="Plan your safari" aria-describedby="hero-planner-note">
          <div class="hero__planner-row">
          ${field(
            'destination',
            'Where to?',
            [
              'Serengeti',
              'Ngorongoro',
              'Kilimanjaro',
              'Tarangire',
              'Arusha National Park',
              'Chemka Hot Springs',
              'Arusha Cultural Heritage Centre',
              'Help me choose',
            ].map((v) => [v, v]),
            'Choose a destination',
          )}
          ${field(
            'season',
            'Dates & season',
            [
              'Flexible dates',
              'January – March',
              'April – June',
              'July – October',
              'November – December',
            ].map((v) => [v, v]),
            'Choose your dates',
          )}
          ${field('travellers', 'Travellers', [
            ['1', '1 traveller'],
            ['2', '2 travellers', true],
            ['3-5', '3–5 travellers'],
            ['6+', '6+ travellers'],
          ])}
          <button class="button hero__planner-cta" type="submit"><span data-i18n="planner.submit">Search safaris</span></button>
          </div>
          <details class="hero__preferences"><summary>Sign-language preferences</summary>
          ${field(
            'sign-language',
            'Sign preference',
            [
              ['Discuss with our team', 'Discuss with our team'],
              ['ASL', 'American Sign Language (ASL)'],
              ['BSL', 'British Sign Language (BSL)'],
              ['International Sign', 'International Sign'],
              ['Tanzanian Sign Language', 'Tanzanian Sign Language'],
            ],
            'ASL, BSL, International…',
          )}
          </details>
        </form>
        <p class="hero__planner-note sr-only" id="hero-planner-note" data-i18n="planner.note">Explore safari ideas, then create a personal brief. Draft itineraries; dates and sign-language support to be confirmed.</p>
        <div class="hero__footer">
          <div class="hero__facts" aria-label="Explore Deaf Safaris">
            <a href="#destinations"><strong>${destinations.length}</strong><span>Destinations to explore</span></a>
            <a href="#guides"><strong>2</strong><span>Meet our guides</span></a>
            <a href="#about"><strong>Your pace</strong><span>Your Tanzania journey</span></a>
          </div>
          <div class="hero__motion-controls">
            <a class="hero__scroll" href="#destinations">${icon('mouse')}<span>Scroll down</span></a>
            <button class="hero__motion-toggle" type="button" data-backdrop-toggle aria-label="Pause background animation" title="Pause background animation" aria-pressed="false" hidden>${icon('pause')}</button>
          </div>
          <div class="hero__review-link">
            ${icon('forum')}
            <p>What visitors say<span>Stories from Tanzania</span></p>
            <a class="button" href="#reviews">Visit our reviews ${icon('arrow_forward')}</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initHeroPlanner(onSearch) {
  let previousSummary = '';
  const form = document.querySelector('#hero-planner');
  function submit(event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const answers = new FormData(form);
    if (onSearch && event.type === 'submit') {
      onSearch(answers);
      return;
    }
    const preferences = document.querySelector('#preferences');
    const summary = `Destination: ${answers.get('destination') || 'Help me choose'}\nSign preference: ${answers.get('sign-language') || 'Discuss with our team'}\nGroup size: ${answers.get('travellers')}\n`;
    const existing =
      previousSummary && preferences.value.startsWith(previousSummary)
        ? preferences.value.slice(previousSummary.length).replace(/^\n/, '')
        : preferences.value;
    if (summary.length + existing.length + 1 > preferences.maxLength) {
      document.querySelector('#brief-status').textContent =
        'Your notes are full. Shorten them before adding your safari preferences.';
      document.querySelector('#enquiry-form').hidden = false;
      document.querySelector('#brief-result').hidden = true;
      preferences.focus();
      return;
    }
    preferences.value = `${summary}\n${existing}`;
    previousSummary = summary;
    document.querySelector('#travel-window').value =
      answers.get('season') || 'Flexible dates';
    const travellers = answers.get('travellers');
    document.querySelector('#travellers').value = /^\d+$/.test(travellers)
      ? travellers
      : '';
    document.querySelector('#enquiry-form').hidden = false;
    document.querySelector('#brief-result').hidden = true;
    document.querySelector('#brief-status').textContent =
      'Your starting preferences have been added. Complete your personal brief below.';
    document.querySelector('#enquiries').scrollIntoView();
    preferences.focus({ preventScroll: true });
  }
  form.addEventListener('submit', submit);
  // Results reuse the same notes-preserving brief flow after a journey is chosen.
  form.addEventListener('planner:choose', submit);
  return () => {
    form.removeEventListener('submit', submit);
    form.removeEventListener('planner:choose', submit);
  };
}
