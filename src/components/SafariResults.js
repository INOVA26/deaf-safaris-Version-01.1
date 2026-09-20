import { expeditions } from '../data/expeditions.js';
import {
  filterSafaris,
  readSafariSearch,
  safariSearchHash,
  searchChoices,
} from '../utils/safariSearch.js';

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ],
  );
const heart =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';

export function SafariResults() {
  return '<section id="safaris" class="safari-results" aria-labelledby="safari-results-heading" hidden></section>';
}

export function initSafariResults(
  { onPlan, onEdit },
  root = document.querySelector('#safaris'),
) {
  const saved = new Set();
  let category = 'all';
  let sort = 'recommended';
  let savedOnly = false;
  let search = readSafariSearch(window.location.hash);
  const events = new AbortController();

  function render() {
    const focusKey = root.contains(document.activeElement)
      ? document.activeElement.dataset.focusKey
      : null;
    search = readSafariSearch(window.location.hash);
    const results = filterSafaris(expeditions, search, {
      category,
      sort,
      savedOnly,
      saved,
    });
    const travellers =
      search.travellers === '1'
        ? '1 traveller'
        : `${search.travellers.replace('-', '–')} travellers`;
    root.innerHTML = `
      <div class="safari-results__inner">
        <a class="safari-results__back" href="#home">← Back to home</a>
        <div class="safari-results__search" aria-label="Your search">
          <div><span>Where</span><strong>${escape(search.destination || 'Anywhere in Tanzania')}</strong></div>
          <div><span>When</span><strong>${escape(search.season || 'Flexible dates')}</strong></div>
          <div><span>Who</span><strong>${escape(travellers)}</strong></div>
          <button class="button button--dark" type="button" data-edit-search>Edit search <span aria-hidden="true">↗</span></button>
        </div>
        <div class="safari-results__heading">
          <div><p class="eyebrow">Find your next adventure</p><h1 id="safari-results-heading" tabindex="-1">${search.destination && search.destination !== 'Help me choose' ? `Explore ${escape(search.destination)}` : 'Explore Tanzania, your way.'}</h1></div>
          <p>Wild places. Shared discoveries.<br />A journey that starts with you.</p>
        </div>
        <div class="safari-results__toolbar">
          <div class="safari-results__categories" role="group" aria-label="Safari type">
            ${[
              ['all', 'All journeys'],
              ['wildlife', 'Wildlife & plains'],
              ['mountain', 'Mountain adventures'],
            ]
              .map(
                ([value, label]) =>
                  `<button type="button" data-category="${value}" data-focus-key="${value}" aria-pressed="${category === value}">${label}</button>`,
              )
              .join('')}
          </div>
          <button class="safari-results__saved" type="button" data-saved-only data-focus-key="saved-only" aria-pressed="${savedOnly}">${heart} Saved (${saved.size})</button>
        </div>
        <div class="safari-results__filters">
          <p role="status" aria-live="polite"><strong>${results.length} ${results.length === 1 ? 'safari idea' : 'safari ideas'}</strong> · Draft itineraries</p>
          <div><label for="results-destination">Destination</label><select id="results-destination" data-focus-key="destination"><option value="">All destinations</option>${searchChoices.destination
            .filter((value) => value !== 'Help me choose')
            .map(
              (value) =>
                `<option ${search.destination === value ? 'selected' : ''}>${value}</option>`,
            )
            .join('')}</select></div>
          <div><label for="results-sort">Sort by</label><select id="results-sort" data-focus-key="sort"><option value="recommended">Featured</option><option value="az" ${sort === 'az' ? 'selected' : ''}>Name: A–Z</option></select></div>
        </div>
        <p class="safari-results__notice">Dates, prices and sign-language support need confirmation. Your preference: ${escape(search['sign-language'] || 'Discuss with our team')}. These ideas are not availability results.</p>
        <div class="safari-results__grid">
          ${results
            .map(
              (tour) => `<article class="safari-result">
            <div class="safari-result__visual">
              <img src="${tour.image}" alt="${escape(tour.alt)}" width="900" height="720" loading="lazy" />
              <span class="safari-result__badge">${escape(tour.tag)}</span>
              <button class="safari-result__save" type="button" data-save="${tour.destination}" data-focus-key="save-${tour.destination}" aria-label="Save ${escape(tour.title)}" aria-pressed="${saved.has(tour.destination)}">${heart}</button>
            </div>
            <div class="safari-result__body">
              <p class="safari-result__location">${tour.destination} · Tanzania</p>
              <h2>${escape(tour.title)}</h2>
              <p class="safari-result__duration">${escape(tour.duration)}</p>
              <details><summary>About this journey <span aria-hidden="true">+</span></summary><p>${escape(tour.description)}</p></details>
              <div class="safari-result__action"><span>Price to be confirmed</span><a href="#enquiries" data-plan="${tour.destination}" class="text-link">Create a brief <span aria-hidden="true">↗</span></a></div>
            </div>
          </article>`,
            )
            .join('')}
        </div>
        ${results.length ? '' : '<div class="safari-results__empty"><h2>No safari ideas match these filters yet.</h2><p>Try another destination or explore all our draft journeys.</p><button class="button button--dark" type="button" data-clear>Show all journeys</button></div>'}
        <div class="safari-results__footer"><p>Something different in mind?<br /><strong>Make room for your own adventure.</strong></p><a class="button button--quiet" href="#enquiries" data-plan="">Start a personal brief <span aria-hidden="true">↗</span></a></div>
        <p class="safari-results__footnote">Saves last for this tab session. Photography is illustrative; see <a href="#photo-credits">photo credits</a>.</p>
      </div>`;
    if (focusKey)
      (
        root.querySelector(`[data-focus-key="${focusKey}"]`) ||
        root.querySelector('[data-saved-only]')
      ).focus({ preventScroll: true });
  }

  function updateDestination(destination) {
    const values = new URLSearchParams({ ...search, destination });
    window.location.hash = safariSearchHash(values);
    render();
  }

  root.addEventListener(
    'click',
    (event) => {
      const target = event.target.closest('button, a');
      if (!target) return;
      if (target.hasAttribute('data-edit-search')) onEdit(search);
      if (target.hasAttribute('data-category')) {
        category = target.dataset.category;
        render();
      }
      if (target.hasAttribute('data-save')) {
        const destination = target.dataset.save;
        if (saved.has(destination)) saved.delete(destination);
        else saved.add(destination);
        render();
      }
      if (target.hasAttribute('data-saved-only')) {
        savedOnly = !savedOnly;
        render();
      }
      if (target.hasAttribute('data-clear')) {
        category = 'all';
        savedOnly = false;
        updateDestination('');
      }
      if (target.hasAttribute('data-plan')) {
        event.preventDefault();
        onPlan({ ...search, destination: target.dataset.plan || search.destination });
      }
    },
    { signal: events.signal },
  );
  root.addEventListener(
    'change',
    (event) => {
      if (event.target.id === 'results-destination')
        updateDestination(event.target.value);
      if (event.target.id === 'results-sort') {
        sort = event.target.value;
        render();
      }
    },
    { signal: events.signal },
  );
  return { render, dispose: () => events.abort() };
}
