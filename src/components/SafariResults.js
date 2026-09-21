import { expeditions } from '../data/expeditions.js';
import kilimanjaroBanner from '../assets/images/destinations/kilimanjaro-2.jpg';
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
const icon = (name) =>
  `<span class="material-symbols-rounded" aria-hidden="true">${name}</span>`;
const travellerLabel = (value) =>
  value === '1' ? '1 traveller' : `${value.replace('-', '–')} travellers`;
const options = (values, selected, label = (value) => value) =>
  values
    .map(
      (value) =>
        `<option value="${escape(value)}" ${value === selected ? 'selected' : ''}>${escape(label(value))}</option>`,
    )
    .join('');
const radios = (name, choices, selected) =>
  choices
    .map(
      ([value, label]) =>
        `<label class="safari-results__choice"><input type="radio" name="${name}" value="${value}" data-focus-key="${name}-${value}" ${selected === value ? 'checked' : ''} />${label}</label>`,
    )
    .join('');

export function SafariResults() {
  return '<section id="safaris" class="safari-results" aria-labelledby="safari-results-heading" hidden></section>';
}

export function initSafariResults(
  { onPlan, onEdit },
  root = document.querySelector('#safaris'),
) {
  const saved = new Set();
  let category = 'all';
  let duration = 'all';
  let sort = 'recommended';
  let savedOnly = false;
  let search = readSafariSearch(window.location.hash);
  const events = new AbortController();

  function render() {
    const focusKey = root.contains(document.activeElement)
      ? document.activeElement.dataset.focusKey
      : null;
    const filtersOpen =
      root.querySelector?.('[data-results-filters]')?.open ??
      window.matchMedia?.('(min-width: 56rem)').matches ??
      false;
    search = readSafariSearch(window.location.hash);
    const results = filterSafaris(expeditions, search, {
      category,
      duration,
      sort,
      savedOnly,
      saved,
    });
    root.innerHTML = `
      <div class="safari-results__banner">
        <img class="safari-results__landscape" src="${kilimanjaroBanner}" alt="An aerial view of Mount Kilimanjaro's snow-covered summit and surrounding clouds." />
        <div class="container safari-results__banner-content">
          <a class="safari-results__back" href="#home">${icon('arrow_back')} Home</a>
          <h1 id="safari-results-heading" tabindex="-1">Deaf Safaris Tanzania</h1>
          <form class="safari-results__search" data-results-search aria-label="Find a safari">
            <div><label for="results-destination">Destination</label>
              <select id="results-destination" name="destination" data-focus-key="destination">
                <option value="">All Tanzania</option>
                ${options(searchChoices.destination, search.destination)}
              </select>
            </div>
            <div><label for="results-season">Travel period</label>
              <select id="results-season" name="season" data-focus-key="season">
                ${options(searchChoices.season, search.season || 'Flexible dates')}
              </select>
            </div>
            <div><label for="results-travellers">Travellers</label>
              <select id="results-travellers" name="travellers" data-focus-key="travellers">
                ${options(searchChoices.travellers, search.travellers, travellerLabel)}
              </select>
            </div>
            <button class="button button--dark" type="submit" data-focus-key="search">${icon('search')} Search safaris</button>
          </form>
        </div>
      </div>
      <div class="container safari-results__layout">
        <aside class="safari-results__sidebar" aria-label="Safari filters">
          <div class="safari-results__shortlist">
            <span>Your shortlist</span>
            <button type="button" class="safari-results__saved" data-saved-only data-focus-key="saved-only" aria-pressed="${savedOnly}">${icon('favorite')} Saved (${saved.size})</button>
          </div>
          <details class="safari-results__filter-panel" data-results-filters ${filtersOpen ? 'open' : ''}>
            <summary data-focus-key="filters">${icon('tune')} Filter journeys ${icon('expand_more')}</summary>
            <div class="safari-results__filter-fields">
              <fieldset><legend>Journey type</legend>
                ${radios(
                  'results-category',
                  [
                    ['all', 'All journeys'],
                    ['wildlife', 'Wildlife & plains'],
                    ['mountain', 'Mountain adventures'],
                  ],
                  category,
                )}
              </fieldset>
              <fieldset><legend>Trip length</legend>
                ${radios(
                  'results-duration',
                  [
                    ['all', 'Any length'],
                    ['day', 'Day trips'],
                    ['multi', 'Multi-day safaris'],
                    ['flexible', 'Route to be confirmed'],
                  ],
                  duration,
                )}
              </fieldset>
              <div class="safari-results__preference">
                <label for="results-sign-language">Sign-language preference</label>
                <select id="results-sign-language" data-focus-key="sign-language">
                  ${options(searchChoices['sign-language'], search['sign-language'] || 'Discuss with our team')}
                </select>
                <p>Tell us what works for you. Support is confirmed with our team before travel.</p>
              </div>
              <button class="text-link" type="button" data-clear data-focus-key="clear">${icon('restart_alt')} Reset filters</button>
            </div>
          </details>
          <div class="safari-results__help">
            ${icon('waving_hand')}
            <h2>A journey that fits you</h2>
            <p>Share your pace, interests and communication needs.</p>
            <button type="button" class="text-link" data-edit-search>Edit my preferences ${icon('arrow_forward')}</button>
          </div>
        </aside>
        <div class="safari-results__list">
          <div class="safari-results__toolbar">
            <p role="status" aria-live="polite"><strong>${results.length} ${results.length === 1 ? 'safari idea' : 'safari ideas'}</strong> in ${escape(search.destination && search.destination !== 'Help me choose' ? search.destination : 'Tanzania')}</p>
            <div><label for="results-sort">Sort by</label><select id="results-sort" data-focus-key="sort">
              <option value="recommended">Featured</option>
              <option value="az" ${sort === 'az' ? 'selected' : ''}>Name: A–Z</option>
            </select></div>
          </div>
          <p class="safari-results__notice">Draft itineraries. Dates, prices and sign-language support need confirmation. Your preference: ${escape(search['sign-language'] || 'Discuss with our team')}.</p>
          <div class="safari-results__grid">
            ${results
              .map(
                (tour) => `<article class="safari-result">
              <div class="safari-result__visual">
                <img src="${tour.image}" alt="${escape(tour.alt)}" width="900" height="720" loading="lazy" />
                <button class="safari-result__save" type="button" data-save="${tour.destination}" data-focus-key="save-${tour.destination}" aria-label="Save ${escape(tour.title)}" title="Save ${escape(tour.title)}" aria-pressed="${saved.has(tour.destination)}">${icon('favorite')}</button>
              </div>
              <div class="safari-result__body">
                <h2>${escape(tour.title)}</h2>
                <span class="safari-result__badge">${escape(tour.tag)}</span>
                <p class="safari-result__description">${escape(tour.description)}</p>
                <p class="safari-result__duration">${icon('schedule')} ${escape(tour.duration)}</p>
              </div>
              <div class="safari-result__footer">
                <span class="safari-result__location">${icon('location_on')} ${tour.destination}, Tanzania</span>
                <div class="safari-result__action"><span>Price to be confirmed</span><a href="#enquiries" data-plan="${tour.destination}" class="button button--dark">Create a brief ${icon('arrow_forward')}</a></div>
              </div>
            </article>`,
              )
              .join('')}
          </div>
          ${results.length ? '' : '<div class="safari-results__empty"><h2>No safari ideas match these filters yet.</h2><p>Try another destination or explore all our draft journeys.</p><button class="button button--dark" type="button" data-clear>Show all journeys</button></div>'}
          <div class="safari-results__footer"><div><h2>Something different in mind?</h2><p>Start with your own Tanzania adventure.</p></div><a class="text-link" href="#enquiries" data-plan="">Start a personal brief ${icon('arrow_forward')}</a></div>
          <p class="safari-results__footnote">Saves last until you reload this page. Photography is illustrative; see <a href="#photo-credits">photo credits</a>.</p>
        </div>
      </div>`;
    if (focusKey)
      (
        root.querySelector(`[data-focus-key="${focusKey}"]`) ||
        root.querySelector('[data-saved-only]')
      )?.focus({ preventScroll: true });
  }

  function updateSearch(changes) {
    window.location.hash = safariSearchHash(
      new URLSearchParams({ ...search, ...changes }),
    );
    render();
  }

  root.addEventListener(
    'submit',
    (event) => {
      if (!event.target.matches('[data-results-search]')) return;
      event.preventDefault();
      updateSearch(Object.fromEntries(new FormData(event.target)));
    },
    { signal: events.signal },
  );

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
        duration = 'all';
        savedOnly = false;
        updateSearch({ destination: '' });
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
      const target = event.target;
      if (target.name === 'results-category') category = target.value;
      else if (target.name === 'results-duration') duration = target.value;
      else if (target.id === 'results-sort') sort = target.value;
      else if (target.id === 'results-sign-language') {
        updateSearch({ 'sign-language': target.value });
        return;
      } else return;
      render();
    },
    { signal: events.signal },
  );
  return { render, dispose: () => events.abort() };
}
