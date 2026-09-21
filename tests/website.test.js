import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';
import { createBrief } from '../src/utils/createBrief.js';
import { createReviewDraft, reviewAsText } from '../src/utils/reviewDraft.js';
import {
  filterSafaris,
  readSafariSearch,
  safariSearchHash,
} from '../src/utils/safariSearch.js';
import { priceFromUsd, initCurrencySelector } from '../src/utils/currencyPrice.js';
import {
  initDropdownSearch,
  matchesDropdownSearch,
} from '../src/utils/dropdownSearch.js';
import { applyLanguage } from '../src/utils/i18n.js';
import { newestReviews } from '../src/utils/reviewStore.js';
import { initHorizontalCarousel } from '../src/utils/horizontalCarousel.js';

test('horizontal carousels support bounded navigation, keyboard, resizing and reduced motion', () => {
  let reduced = false;
  let observerDisconnected = false;
  let resize;
  const clock = Object.assign(new EventTarget(), {
    matchMedia: () => ({ matches: reduced }),
    ResizeObserver: class {
      constructor(callback) {
        resize = callback;
      }
      observe() {}
      disconnect() {
        observerDisconnected = true;
      }
    },
  });
  const track = Object.assign(new EventTarget(), {
    scrollLeft: 0,
    clientWidth: 300,
    scrollWidth: 1050,
    scrollTo({ left, behavior }) {
      this.scrollLeft = left;
      this.behavior = behavior;
      this.dispatchEvent(new Event('scroll'));
    },
  });
  const previous = new EventTarget();
  const next = new EventTarget();
  const position = {};
  const carousel = initHorizontalCarousel(
    {
      querySelector: (selector) =>
        ({
          '[data-carousel-track]': track,
          '[data-carousel-previous]': previous,
          '[data-carousel-next]': next,
          '[data-carousel-position]': position,
        })[selector],
    },
    { clock },
  );
  const key = (value, target = track) => {
    const event = Object.assign(new Event('keydown', { cancelable: true }), {
      key: value,
    });
    if (target !== track) Object.defineProperty(event, 'target', { value: target });
    track.dispatchEvent(event);
    return event;
  };
  try {
    assert.equal(previous.disabled, true);
    assert.equal(next.disabled, false);
    assert.equal(position.textContent, '01 / 04');
    next.dispatchEvent(new Event('click'));
    assert.equal(track.scrollLeft, 300);
    assert.equal(track.behavior, 'smooth');
    assert.equal(position.textContent, '02 / 04');
    key('ArrowRight');
    assert.equal(track.scrollLeft, 600);
    key('End');
    assert.equal(track.scrollLeft, 750);
    assert.equal(next.disabled, true);
    assert.equal(position.textContent, '04 / 04');
    next.dispatchEvent(new Event('click'));
    assert.equal(track.scrollLeft, 750);
    reduced = true;
    previous.dispatchEvent(new Event('click'));
    assert.equal(track.scrollLeft, 450);
    assert.equal(track.behavior, 'instant');
    assert.equal(key('Home').defaultPrevented, true);
    assert.equal(track.scrollLeft, 0);
    key('ArrowLeft');
    assert.equal(track.scrollLeft, 0);
    assert.equal(key('ArrowRight', {}).defaultPrevented, false);
    assert.equal(track.scrollLeft, 0);
    assert.equal(key('Tab').defaultPrevented, false);
    track.clientWidth = 1050;
    clock.dispatchEvent(new Event('resize'));
    assert.equal(next.disabled, true);
    assert.equal(position.textContent, '01 / 01');
    track.clientWidth = 0;
    resize();
    assert.equal(position.textContent, '01 / 01');
    track.clientWidth = 300;
    resize();
    assert.equal(next.disabled, false);
  } finally {
    carousel.dispose();
  }
  assert.equal(observerDisconnected, true);
  next.dispatchEvent(new Event('click'));
  key('End');
  assert.equal(track.scrollLeft, 0, 'Disposal removes navigation listeners');
});

test('safari search URLs retain valid preferences and reject unsupported values', () => {
  const values = new URLSearchParams({
    destination: 'Ngorongoro',
    season: 'July – October',
    'sign-language': 'International Sign',
    travellers: '3-5',
  });
  assert.deepEqual(
    readSafariSearch(safariSearchHash(values)),
    Object.fromEntries(values),
  );
  assert.deepEqual(
    readSafariSearch(
      '#safaris?destination=%3Cscript%3E&travellers=999&season=tomorrow',
    ),
    { destination: '', season: '', 'sign-language': '', travellers: '2' },
  );
  assert.deepEqual(readSafariSearch('#safaris'), {
    destination: '',
    season: '',
    'sign-language': '',
    travellers: '2',
  });
});

test('safari results combine destination, category, saved and sorting filters without inventing availability', () => {
  const tours = [
    { title: 'Serengeti Wildlife Safari', destination: 'Serengeti' },
    { title: 'Ngorongoro Crater Escape', destination: 'Ngorongoro' },
    { title: 'Kilimanjaro Together', destination: 'Kilimanjaro' },
  ];
  const search = readSafariSearch('#safaris');
  assert.equal(filterSafaris(tours, search).length, 3);
  assert.equal(filterSafaris(tours, { ...search, destination: 'Tarangire' }).length, 0);
  assert.equal(
    filterSafaris(
      tours,
      { ...search, destination: 'Serengeti' },
      { category: 'mountain' },
    ).length,
    0,
  );
  assert.equal(
    filterSafaris(tours, search, { category: 'mountain' })[0].destination,
    'Kilimanjaro',
  );
  assert.deepEqual(
    filterSafaris(tours, search, {
      savedOnly: true,
      saved: new Set(['Serengeti']),
    }).map((tour) => tour.destination),
    ['Serengeti'],
  );
  assert.equal(filterSafaris(tours, search, { savedOnly: true }).length, 0);
  assert.equal(
    filterSafaris(tours, search, { sort: 'az' })[0].destination,
    'Kilimanjaro',
  );
  assert.equal(
    tours[0].destination,
    'Serengeti',
    'Sorting must not mutate the catalogue',
  );
  assert.equal(
    filterSafaris(tours, {
      ...search,
      season: 'July – October',
      'sign-language': 'ASL',
    }).length,
    3,
    'Dates and support are preferences, not confirmed availability',
  );
});

test('trip length filters use known draft durations and keep unconfirmed routes separate', () => {
  const tours = [
    { title: 'Serengeti', destination: 'Serengeti', days: 3 },
    { title: 'Ngorongoro', destination: 'Ngorongoro', days: 1 },
    { title: 'Kilimanjaro', destination: 'Kilimanjaro', days: null },
  ];
  const search = readSafariSearch('#safaris');
  for (const [duration, destination] of [
    ['day', 'Ngorongoro'],
    ['multi', 'Serengeti'],
    ['flexible', 'Kilimanjaro'],
  ]) {
    assert.deepEqual(
      filterSafaris(tours, search, { duration }).map((tour) => tour.destination),
      [destination],
    );
  }
  assert.equal(
    filterSafaris(tours, search, { duration: 'day', category: 'mountain' }).length,
    0,
  );
  assert.equal(
    filterSafaris(tours, search, {
      duration: 'multi',
      savedOnly: true,
      saved: new Set(['Ngorongoro']),
    }).length,
    0,
  );
});

test('dropdown search matches countries and currency codes without changing selection', () => {
  assert.ok(matchesDropdownSearch('de Deutsch Germany German', ' GERMAN '));
  assert.ok(matchesDropdownSearch('nl Nederlands Netherlands Dutch', 'dutch'));
  assert.ok(matchesDropdownSearch('PLN Polish złoty', 'zloty pln'));
  assert.ok(matchesDropdownSearch('ko 한국어 South Korea Korean', '한국'));
  assert.equal(matchesDropdownSearch('EUR Euro', 'USD'), false);
  const input = Object.assign(new EventTarget(), { value: '' });
  const empty = { hidden: true };
  const options = { scrollTop: 100 };
  const rows = ['USD US dollar', 'EUR Euro', 'PLN Polish złoty'].map(
    (searchText, index) => {
      const radio = {
        checked: index === 0,
        focus() {
          this.focused = true;
        },
        click() {
          this.clicked = true;
        },
      };
      return {
        dataset: { searchText },
        hidden: false,
        radio,
        querySelector: () => radio,
      };
    },
  );
  const menu = Object.assign(new EventTarget(), {
    querySelector: (selector) =>
      ({
        '[data-dropdown-search]': input,
        '[data-dropdown-empty]': empty,
        '.utility-bar__options': options,
      })[selector],
    querySelectorAll: () => rows,
  });
  const search = initDropdownSearch(menu);
  try {
    input.value = 'euro';
    input.dispatchEvent(new Event('input'));
    assert.deepEqual(
      rows.map((row) => row.hidden),
      [true, false, true],
    );
    assert.equal(rows[0].radio.checked, true);
    assert.equal(rows[1].radio.tabIndex, 0);
    const down = Object.assign(new Event('keydown', { cancelable: true }), {
      key: 'ArrowDown',
    });
    input.dispatchEvent(down);
    assert.equal(rows[1].radio.focused, true);
    input.value = 'no such currency';
    input.dispatchEvent(new Event('input'));
    assert.equal(empty.hidden, false);
    assert.ok(rows.every((row) => row.hidden));
    search.reset();
    assert.equal(input.value, '');
    assert.ok(rows.every((row) => !row.hidden));
    assert.equal(rows[0].radio.checked, true);
    assert.equal(empty.hidden, true);
  } finally {
    search.dispose();
  }
  input.value = 'euro';
  input.dispatchEvent(new Event('input'));
  assert.ok(rows.every((row) => !row.hidden));
});

test('USD prices convert through EUR reference rates and use each currency precision', () => {
  assert.equal(priceFromUsd(120, 'EUR').formatted, '€103.52');
  assert.match(priceFromUsd(120, 'PLN').formatted, /^zł\s?447\.72$/);
  assert.equal(priceFromUsd(120, 'KRW').formatted, '₩161,135');
  assert.equal(priceFromUsd(120, 'USD').formatted, '$120');
  assert.match(priceFromUsd(120, 'EUR').note, /Approximate.*11 Sep 2026/);
  for (const amount of [-1, NaN, Infinity]) {
    assert.throws(() => priceFromUsd(amount, 'EUR'), RangeError);
  }
  assert.throws(() => priceFromUsd(120, 'JPY'), RangeError);
});

test('currency selection updates the card, restores preference, and survives blocked storage', () => {
  function fixture(storage) {
    const menu = Object.assign(new EventTarget(), { name: 'utility-currency' });
    const options = ['USD', 'EUR', 'PLN', 'KRW'].map((value) => ({ value }));
    menu.querySelectorAll = () => options;
    const label = {};
    const trigger = {
      querySelector: () => label,
      setAttribute(name, value) {
        this[name] = value;
      },
    };
    const fields = {
      '[data-price-amount]': {},
      '[data-price-currency]': {},
      '[data-price-note]': {},
    };
    const price = {
      dataset: { priceUsd: '120' },
      querySelector: (selector) => fields[selector],
    };
    const page = {
      querySelectorAll: () => [price],
      defaultView: {
        get localStorage() {
          return storage;
        },
      },
    };
    const root = {
      ownerDocument: page,
      querySelector: (selector) => (selector === '#utility-currency' ? menu : trigger),
    };
    const dispose = initCurrencySelector(root);
    const choose = (value) => {
      menu.value = value;
      menu.dispatchEvent(new Event('change'));
    };
    return { fields, label, trigger, options, choose, dispose };
  }
  const saved = new Map();
  const storage = {
    getItem: (key) => saved.get(key),
    setItem: (key, value) => saved.set(key, value),
  };
  const app = fixture(storage);
  try {
    app.choose('EUR');
    assert.equal(app.fields['[data-price-amount]'].textContent, '€103.52');
    assert.equal(app.fields['[data-price-currency]'].textContent, '/ person · EUR');
    assert.equal(app.label.textContent, '€ EUR');
    assert.equal(app.options.find((option) => option.checked).value, 'EUR');
    const restored = fixture(storage);
    assert.equal(restored.fields['[data-price-amount]'].textContent, '€103.52');
    restored.dispose();
    for (const code of ['PLN', 'KRW', 'EUR', 'USD']) app.choose(code);
    assert.equal(app.fields['[data-price-amount]'].textContent, '$120');
    app.choose('JPY');
    assert.equal(app.fields['[data-price-amount]'].textContent, '$120');
  } finally {
    app.dispose();
  }
  app.choose('EUR');
  assert.equal(app.fields['[data-price-amount]'].textContent, '$120');
  const blocked = fixture({
    getItem() {
      throw new Error('Storage blocked');
    },
    setItem() {
      throw new Error('Storage blocked');
    },
  });
  try {
    blocked.choose('EUR');
    assert.equal(blocked.fields['[data-price-amount]'].textContent, '€103.52');
  } finally {
    blocked.dispose();
  }
});

test('reviews validate ratings and reject empty, short, or oversized messages', () => {
  const review = 'The photography helped me imagine my next adventure.';
  for (const rating of ['', '0', '6', '2.5', 'invalid']) {
    assert.throws(() => createReviewDraft({ rating, review }), /rating/);
  }
  for (const message of ['', ' '.repeat(30), 'Too short', 'a'.repeat(2001)]) {
    assert.throws(
      () => createReviewDraft({ rating: '4', review: message }),
      /characters/,
    );
  }
});

test('review downloads preserve visitor words and clearly remain unpublished drafts', () => {
  const review = 'Nimefurahia picha za tembo. 🐘\n<Questions & ideas>';
  const draft = createReviewDraft({ rating: '4', review: `  ${review}  ` });
  assert.equal(draft.name, 'Visitor');
  assert.equal(draft.review, review);
  assert.equal(draft.experience, 'Website experience');
  const download = reviewAsText(draft);
  assert.ok(download.includes(review));
  assert.match(download, /Not submitted or published/);
  assert.match(download, /Rating: 4 out of 5/);
  assert.match(download, /Place visited: Tanzania/);
});

test('latest reviews sort by date rather than rating and tolerate old or invalid records', () => {
  const draft = createReviewDraft({
    rating: 5,
    review: 'An unforgettable journey through Tanzania.',
  });
  const older = {
    ...draft,
    title: 'Older five stars',
    createdAt: '2025-01-01T00:00:00Z',
  };
  const recent = {
    ...draft,
    title: 'Recent two stars',
    rating: 2,
    createdAt: '2026-08-01T00:00:00Z',
  };
  const legacy = { ...draft, title: 'Undated' };
  const values = [legacy, older, null, { rating: 99 }, recent];
  assert.deepEqual(
    newestReviews(values).map((review) => review.title),
    ['Recent two stars', 'Older five stars', 'Undated'],
  );
  assert.equal(values[0], legacy, 'Sorting does not mutate the source');
});

test('review submission updates recent stories, filters places, escapes content and survives blocked storage', async () => {
  const server = await createServer({
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  const previous = {
    document: globalThis.document,
    window: globalThis.window,
    FormData: globalThis.FormData,
  };
  let disposeReviews;
  let disposePreview;
  try {
    const { initReviews, Reviews } = await server.ssrLoadModule(
      '/src/components/Reviews.js',
    );
    const { initReviewPreview } = await server.ssrLoadModule(
      '/src/components/ReviewPreview.js',
    );
    const makeElement = () =>
      Object.assign(new EventTarget(), {
        value: '',
        innerHTML: '',
        textContent: '',
        hidden: false,
        style: {
          setProperty(name, value) {
            this[name] = value;
          },
        },
        setAttribute(name, value) {
          this[name] = value;
        },
        focus() {
          this.focused = true;
        },
        scrollIntoView() {
          this.scrolled = true;
        },
        reportValidity: () => true,
        setCustomValidity(value) {
          this.validity = value;
        },
      });
    const fields = Object.fromEntries(
      [
        '#review-form',
        '#review-message',
        '#review-rating',
        '#review-rating-value',
        '#review-status',
        '#reviews-list',
        '#reviews-place-filter',
        '#reviews-count',
        '[data-write-review]',
        '#review-destination',
        '#review-preview-name',
        '#review-preview-experience',
        '#review-preview-title',
        '#review-preview-destination',
        '#review-preview-body',
        '#review-preview-rating',
        '#review-preview',
        '#review-preview-heading',
        '#download-review',
      ].map((selector) => [selector, makeElement()]),
    );
    const preview = makeElement();
    Object.assign(preview, { scrollLeft: 0, clientWidth: 600, scrollWidth: 1000 });
    const previewFields = Object.fromEntries(
      [
        '[data-review-total]',
        '[data-review-note]',
        '[data-carousel-previous]',
        '[data-carousel-next]',
        '[data-carousel-position]',
      ].map((selector) => [selector, makeElement()]),
    );
    previewFields['[data-latest-reviews]'] = preview;
    previewFields['[data-carousel-track]'] = preview;
    let stored = '[]';
    let blocked = false;
    globalThis.window = Object.assign(new EventTarget(), {
      localStorage: {
        getItem: () => stored,
        setItem(key, value) {
          assert.equal(key, 'deaf-safaris-reviews');
          if (blocked) throw new Error('Storage blocked');
          stored = value;
        },
      },
    });
    globalThis.document = { querySelector: (selector) => fields[selector] };
    const values = {
      name: '<img src=x onerror=alert(1)>',
      title: 'Chemka visit',
      destination: 'Chemka Hot Springs',
      experience: 'Safari experience',
      rating: '3',
      review: 'A beautiful afternoon by the springs. <script>bad()</script>',
    };
    globalThis.FormData = class extends Map {
      constructor() {
        super(Object.entries(values));
      }
    };
    fields['#review-rating'].value = '3';
    disposeReviews = initReviews();
    assert.equal(fields['#review-rating-value'].textContent, '3 / 5');
    for (const [value, progress] of [
      ['1', '0%'],
      ['5', '100%'],
      ['3', '50%'],
    ]) {
      fields['#review-rating'].value = value;
      fields['#review-rating'].dispatchEvent(new Event('input'));
      assert.equal(fields['#review-rating'].style['--rating-progress'], progress);
      assert.equal(
        fields['#review-rating']['aria-valuetext'],
        `${value} out of 5 stars`,
      );
      assert.equal(fields['#review-rating-value'].textContent, `${value} / 5`);
    }
    disposePreview = initReviewPreview({
      querySelector: (selector) => previewFields[selector],
    });
    assert.match(preview.innerHTML, /Sample review/);
    assert.match(previewFields['[data-review-total]'].textContent, /3 sample reviews/);
    assert.match(Reviews(), /<option>Chemka Hot Springs<\/option>/);
    fields['[data-write-review]'].dispatchEvent(new Event('click'));
    assert.equal(fields['#review-destination'].focused, true);
    assert.equal(fields['#review-form'].scrolled, true);
    fields['#reviews-place-filter'].value = 'Tarangire';
    fields['#reviews-place-filter'].dispatchEvent(new Event('change'));
    assert.match(fields['#reviews-list'].innerHTML, /No reviews for this place/);
    const submit = () =>
      fields['#review-form'].dispatchEvent(new Event('submit', { cancelable: true }));
    submit();
    assert.equal(fields['#reviews-place-filter'].value, '');
    assert.match(preview.innerHTML, /Chemka visit/);
    assert.match(previewFields['[data-review-total]'].textContent, /1 review/);
    assert.match(preview.innerHTML, /&lt;script&gt;/);
    assert.doesNotMatch(preview.innerHTML, /<script>|src="undefined"|Sample review/);
    assert.match(fields['#review-status'].textContent, /saved on this device/);
    assert.ok(Number.isFinite(Date.parse(JSON.parse(stored)[0].createdAt)));
    blocked = true;
    values.title = 'Newest lower-rated visit';
    values.destination = 'Tanzania';
    values.rating = '1';
    submit();
    assert.match(fields['#review-status'].textContent, /session only/);
    assert.ok(
      preview.innerHTML.indexOf(values.title) <
        preview.innerHTML.indexOf('Chemka visit'),
    );
    assert.doesNotMatch(preview.innerHTML, /src="undefined"/);
    fields['#reviews-place-filter'].value = 'Chemka Hot Springs';
    fields['#reviews-place-filter'].dispatchEvent(new Event('change'));
    assert.match(fields['#reviews-list'].innerHTML, /Chemka visit/);
    assert.doesNotMatch(fields['#reviews-list'].innerHTML, /Newest lower-rated visit/);
    blocked = false;
    submit();
    const storedReviews = JSON.parse(stored);
    assert.equal(
      storedReviews.length,
      3,
      'A later successful save retains session-only reviews',
    );
    disposeReviews();
    disposePreview();
    fields['#review-destination'].focused = false;
    fields['[data-write-review]'].dispatchEvent(new Event('click'));
    assert.equal(fields['#review-destination'].focused, false);
  } finally {
    disposeReviews?.();
    disposePreview?.();
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
    await server.close();
  }
});

test('about page copy translates text, rich headings, and accessible media labels', async () => {
  const server = await createServer({
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  try {
    const { AboutPage } = await server.ssrLoadModule('/src/components/AboutPage.js');
    const html = AboutPage();
    assert.match(html, /data-i18n="aboutPage.hero.primary"/);
    assert.match(html, /data-i18n-html="aboutPage.hero.heading"/);
    assert.match(html, /data-i18n-alt="aboutPage.float.alt"/);
    assert.match(html, /data-i18n-aria-label="aboutPage.float.aria"/);
    assert.match(html, /id="about-guides-heading"/);
    assert.match(html, />Ertines</);
    assert.match(html, />Mike</);
    assert.match(html, /CEO, Deaf Safaris/);

    const plain = translatedElement({ i18n: 'aboutPage.hero.primary' });
    const rich = translatedElement({ i18nHtml: 'aboutPage.hero.heading' });
    const image = translatedElement({ i18nAlt: 'aboutPage.float.alt' });
    const figure = translatedElement({ i18nAriaLabel: 'aboutPage.float.aria' });
    const root = {
      documentElement: {},
      querySelectorAll: (selector) =>
        ({
          '[data-i18n]': [plain],
          '[data-i18n-html]': [rich],
          '[data-i18n-alt]': [image],
          '[data-i18n-aria-label]': [figure],
          '[data-i18n-placeholder]': [],
          '[data-i18n-title]': [],
        })[selector] || [],
      dispatchEvent() {},
    };

    applyLanguage('nl', root);
    assert.equal(root.documentElement.lang, 'nl');
    assert.equal(plain.textContent, 'Vorm mijn reis');
    assert.match(rich.innerHTML, /Een gedeelde taal/);
    assert.match(rich.innerHTML, /<em>Een wereld vol avontuur\.<\/em>/);
    assert.match(image.attributes.alt, /Kilimanjaro/);
    assert.equal(
      figure.attributes['aria-label'],
      'Oprichter op de top van Kilimanjaro',
    );
  } finally {
    await server.close();
  }
});

test('an empty brief stays useful and cannot be mistaken for a sent enquiry', () => {
  const brief = createBrief({ preferences: '   ', travelWindow: '' });
  assert.match(brief, /Personal draft · Not sent · Not a booking/);
  assert.match(brief, /Open to ideas/);
  assert.match(brief, /Flexible \/ to be decided/);
  assert.doesNotMatch(brief, /undefined|null/);
});

test('the brief preserves multiline and international visitor preferences', () => {
  const preferences =
    'Please use written communication.\nNingependa kuona tembo. 🐘\n<Questions & ideas>';
  const brief = createBrief({
    travellers: '3',
    travelWindow: ' September ',
    preferences,
  });
  assert.ok(brief.includes(preferences));
  assert.match(brief, /Travellers: 3/);
  assert.match(brief, /Preferred travel dates: September\n/);
});

function translatedElement(dataset) {
  return {
    dataset,
    attributes: {},
    textContent: '',
    innerHTML: '',
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  };
}

test('results controls save journeys, recover from empty searches, and hand preferences to the brief', async () => {
  const server = await createServer({
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  let results;
  try {
    const { initSafariResults } = await server.ssrLoadModule(
      '/src/components/SafariResults.js',
    );
    globalThis.document = { activeElement: null };
    globalThis.window = {
      location: {
        hash: '#safaris?season=July+%E2%80%93+October&sign-language=ASL&travellers=3-5',
      },
    };
    const root = Object.assign(new EventTarget(), {
      innerHTML: '',
      contains: () => false,
    });
    let planned;
    let edited;
    results = initSafariResults(
      {
        onPlan: (search) => {
          planned = search;
        },
        onEdit: (search) => {
          edited = search;
        },
      },
      root,
    );
    const click = (attribute, value = '') => {
      const key = attribute
        .slice(5)
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const target = {
        dataset: { [key]: value },
        hasAttribute: (name) => name === attribute,
        closest() {
          return this;
        },
      };
      const event = new Event('click', { cancelable: true });
      Object.defineProperty(event, 'target', { value: target });
      root.dispatchEvent(event);
    };
    results.render();
    assert.equal((root.innerHTML.match(/<article /g) || []).length, 3);
    assert.match(root.innerHTML, /3–5 travellers/);
    assert.match(root.innerHTML, /Your preference: ASL/);
    click('data-save', 'Serengeti');
    assert.match(root.innerHTML, /Saved \(1\)/);
    click('data-saved-only');
    assert.equal((root.innerHTML.match(/<article /g) || []).length, 1);
    click('data-plan', 'Serengeti');
    assert.deepEqual(planned, {
      destination: 'Serengeti',
      season: 'July – October',
      'sign-language': 'ASL',
      travellers: '3-5',
    });
    click('data-save', 'Serengeti');
    assert.match(root.innerHTML, /No safari ideas match/);
    click('data-clear');
    assert.equal((root.innerHTML.match(/<article /g) || []).length, 3);
    globalThis.window.location.hash = '#safaris?destination=Tarangire';
    results.render();
    assert.match(root.innerHTML, /No safari ideas match/);
    click('data-edit-search');
    assert.equal(edited.destination, 'Tarangire');
    click('data-clear');
    assert.equal(readSafariSearch(globalThis.window.location.hash).destination, '');
    assert.equal((root.innerHTML.match(/<h1\b/g) || []).length, 1);
    assert.match(root.innerHTML, /Deaf Safaris Tanzania/);
    assert.match(root.innerHTML, /aria-label="Safari filters"/);
    const change = (target) => {
      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: target });
      root.dispatchEvent(event);
    };
    change({ name: 'results-duration', value: 'day' });
    assert.equal((root.innerHTML.match(/<article /g) || []).length, 1);
    assert.match(root.innerHTML, /Ngorongoro Crater Escape/);
    change({ name: 'results-category', value: 'mountain' });
    assert.match(root.innerHTML, /No safari ideas match/);
    click('data-clear');
    assert.equal((root.innerHTML.match(/<article /g) || []).length, 3);
    change({ id: 'results-sort', value: 'az' });
    assert.ok(
      root.innerHTML.indexOf('<h2>Kilimanjaro') <
        root.innerHTML.indexOf('<h2>Ngorongoro'),
    );
    change({ id: 'results-sign-language', value: 'BSL' });
    assert.equal(readSafariSearch(window.location.hash)['sign-language'], 'BSL');
    const previousFormData = globalThis.FormData;
    try {
      globalThis.FormData = class {
        constructor(form) {
          return new Map(form.values);
        }
      };
      const form = {
        matches: (selector) => selector === '[data-results-search]',
        values: [
          ['destination', 'Serengeti'],
          ['season', 'January – March'],
          ['travellers', '6+'],
        ],
      };
      const submit = new Event('submit', { cancelable: true });
      Object.defineProperty(submit, 'target', { value: form });
      root.dispatchEvent(submit);
      assert.equal(submit.defaultPrevented, true);
      assert.deepEqual(readSafariSearch(window.location.hash), {
        destination: 'Serengeti',
        season: 'January – March',
        travellers: '6+',
        'sign-language': 'BSL',
      });
      assert.equal((root.innerHTML.match(/<article /g) || []).length, 1);
      click('data-plan', 'Serengeti');
      assert.equal(planned.travellers, '6+');
      assert.equal(planned['sign-language'], 'BSL');
    } finally {
      globalThis.FormData = previousFormData;
    }
    for (const [, control] of root.innerHTML.matchAll(
      /<select\b[^>]*\bid="([^"]+)"/g,
    )) {
      assert.ok(root.innerHTML.includes(`for="${control}"`));
    }
    results.dispose();
    const html = root.innerHTML;
    click('data-category', 'mountain');
    assert.equal(root.innerHTML, html, 'Disposing removes delegated event handlers');
  } finally {
    results?.dispose();
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    await server.close();
  }
});

test('photo viewer wraps, handles keyboard navigation, restores focus, and cleans up', async () => {
  const server = await createServer({
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  let dispose;
  try {
    const { initPhotoGallery } = await server.ssrLoadModule(
      '/src/components/PhotoGallery.js',
    );
    const { galleryPhotos } = await server.ssrLoadModule('/src/data/galleryPhotos.js');
    const classes = new Set();
    globalThis.document = {
      body: {
        classList: {
          add: (name) => classes.add(name),
          remove: (name) => classes.delete(name),
        },
      },
    };
    globalThis.window = new EventTarget();
    const fields = Object.fromEntries(
      [
        'dialog',
        '[data-photo-image]',
        '[data-photo-caption]',
        '[data-photo-position]',
        '[data-photo-close]',
        '[data-photo-previous]',
        '[data-photo-next]',
      ].map((name) => [name, new EventTarget()]),
    );
    const dialog = fields.dialog;
    dialog.open = false;
    dialog.showModal = () => {
      dialog.open = true;
    };
    dialog.close = () => {
      dialog.open = false;
      dialog.dispatchEvent(new Event('close'));
    };
    const buttons = galleryPhotos.map((_, index) =>
      Object.assign(new EventTarget(), {
        dataset: { photoIndex: String(index) },
        focus() {
          this.focused = true;
        },
      }),
    );
    dispose = initPhotoGallery({
      hidden: false,
      querySelector: (selector) => fields[selector],
      querySelectorAll: () => buttons,
    });
    const click = (element) => element.dispatchEvent(new Event('click'));
    click(buttons.at(-1));
    assert.equal(dialog.open, true);
    assert.equal(classes.has('photo-viewer-open'), true);
    assert.equal(fields['[data-photo-image]'].alt, galleryPhotos.at(-1).alt);
    click(fields['[data-photo-next]']);
    assert.equal(fields['[data-photo-image]'].src, galleryPhotos[0].src);
    click(fields['[data-photo-previous]']);
    assert.equal(fields['[data-photo-position]'].textContent, '5 / 5');
    const left = Object.assign(new Event('keydown', { cancelable: true }), {
      key: 'ArrowLeft',
    });
    dialog.dispatchEvent(left);
    assert.equal(left.defaultPrevented, true);
    assert.equal(fields['[data-photo-image]'].src, galleryPhotos[3].src);
    click(fields['[data-photo-close]']);
    assert.equal(dialog.open, false);
    assert.equal(buttons.at(-1).focused, true);
    assert.equal(classes.has('photo-viewer-open'), false);
    click(buttons[0]);
    window.dispatchEvent(new Event('hashchange'));
    assert.equal(dialog.open, false);
    click(buttons[0]);
    dispose();
    assert.equal(classes.has('photo-viewer-open'), false);
    click(buttons[0]);
    assert.equal(dialog.open, false, 'Disposed controls no longer open the viewer');
  } finally {
    dispose?.();
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    await server.close();
  }
});

test('rendered sections have unique IDs, working internal links, and labelled inputs', async () => {
  const server = await createServer({
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  try {
    const names = [
      'Header',
      'Hero',
      'Destinations',
      'FeaturedSafari',
      'SafariResults',
      'About',
      'Guides',
      'PhotoGallery',
      'AboutPage',
      'Planning',
      'ReviewPreview',
      'DestinationListings',
      'Reviews',
      'Enquiry',
      'Footer',
      'Chat',
    ];
    const rendered = await Promise.all(
      names.map(async (name) => {
        const module = await server.ssrLoadModule(`/src/components/${name}.js`);
        return module[name]();
      }),
    );
    const html = `<main id="main-content">${rendered.join('')}</main>`;
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, 'Duplicate element IDs');
    for (const [, destination] of html.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(ids.includes(destination), `Missing link target: ${destination}`);
    }
    for (const [, destination] of html.matchAll(/popovertarget="([^"]+)"/g)) {
      assert.ok(ids.includes(destination), `Missing popover target: ${destination}`);
    }
    for (const [, destination] of html.matchAll(/aria-controls="([^"]+)"/g)) {
      assert.ok(ids.includes(destination), `Missing control target: ${destination}`);
    }
    for (const [, control] of html.matchAll(
      /<(?:input|select|textarea)\b[^>]*\bid="([^"]+)"/g,
    )) {
      assert.ok(html.includes(`for="${control}"`), `Missing label for ${control}`);
    }
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.ok(html.includes('aria-controls="primary-navigation"'));
    assert.ok(html.includes('role="status"'));
  } finally {
    await server.close();
  }
});
