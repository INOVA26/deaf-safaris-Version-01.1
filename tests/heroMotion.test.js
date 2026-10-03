import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';
import { createTypewriter } from '../src/utils/typewriter.js';
import { initHeroMotion } from '../src/utils/heroMotion.js';
import { initHeroBackdrop } from '../src/utils/heroBackdrop.js';
import { HeroWeather } from '../src/components/HeroWeather.js';

test('team includes Mike’s supplied portrait, senior role and the digital media profile', async () => {
  const server = await createServer({
    configLoader: 'native',
    resolve: { preserveSymlinks: true },
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  try {
    const { Guides } = await server.ssrLoadModule('/src/components/Guides.js');
    const { ReviewPreview } = await server.ssrLoadModule(
      '/src/components/ReviewPreview.js',
    );
    const markup = Guides();
    assert.equal((markup.match(/class="about-page__guide-card"/g) || []).length, 3);
    assert.match(markup, /Ertines/);
    assert.match(markup, /Mike/);
    assert.match(markup, /Senior Safari Guide/);
    assert.match(markup, /mike-profile.png/);
    assert.match(markup, /Hyune/);
    assert.match(markup, /Digital & Media/);
    assert.match(markup, /class="paw-trail" aria-hidden="true"/);
    assert.match(ReviewPreview(), /What the people think about us/);
    assert.match(ReviewPreview(), /data-review-note/);
  } finally {
    await server.close();
  }
});

test('weather notice explains rescheduling without a forecast widget', () => {
  const markup = HeroWeather();
  assert.match(markup, /Tanzania Meteorological Authority \(TMA\)/);
  assert.match(markup, /contact you to arrange alternative booking dates/);
  assert.doesNotMatch(markup, /<aside|<a |aria-live|data-season-advice/);
});

test('explore grid filters destinations, expands and hands a choice to the planner', async () => {
  const server = await createServer({
    configLoader: 'native',
    resolve: { preserveSymlinks: true },
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  try {
    const { DestinationListings, initDestinationListings } = await server.ssrLoadModule(
      '/src/components/DestinationListings.js',
    );
    assert.match(DestinationListings(), /All Tours &amp; Destinations/);
    const { Header } = await server.ssrLoadModule('/src/components/Header.js');
    assert.match(Header(), /href="#destinations">National Park/);
    assert.doesNotMatch(Header(), /nav.nationalPark/);
    assert.doesNotMatch(DestinationListings(), /data-carousel-track/);
    const cards = [
      'Mountain',
      'National parks',
      'Crater',
      'National parks',
      'National parks',
      'Hot springs',
      'Culture',
    ].map((category, i) => {
      const card = element();
      card.dataset = { placeCategory: category, listingDestination: `Place ${i}` };
      return card;
    });
    const buttons = ['All places', 'Mountain', 'National parks'].map((filter) => {
      const button = element();
      button.dataset.placeFilter = filter;
      return button;
    });
    const more = element();
    const count = {};
    const root = Object.assign(element(), {
      querySelectorAll: (selector) =>
        selector === '[data-listing-destination]' ? cards : buttons,
      querySelector: (selector) => (selector === '[data-places-more]' ? more : count),
    });
    let choice;
    const dispose = initDestinationListings(root, (value) => {
      choice = value;
    });
    const click = (selector, target, extra = {}) =>
      root.emit('click', {
        target: { closest: (query) => (query === selector ? target : null) },
        preventDefault() {},
        ...extra,
      });
    assert.equal(cards.filter((card) => !card.hidden).length, 6);
    click('[data-places-more]', more);
    assert.equal(cards.filter((card) => !card.hidden).length, 7);
    assert.equal(more.getAttribute('aria-expanded'), 'true');
    click('[data-place-filter]', buttons[2]);
    assert.equal(cards.filter((card) => !card.hidden).length, 3);
    assert.equal(more.hidden, true);
    assert.equal(buttons[2].getAttribute('aria-pressed'), 'true');
    click('[data-place-filter]', buttons[1]);
    assert.equal(count.textContent, '1 of 1 places');
    click(
      '[data-listing-link]',
      { dataset: { listingLink: 'Place 0' } },
      { ctrlKey: true },
    );
    assert.equal(choice, undefined);
    click('[data-listing-link]', { dataset: { listingLink: 'Place 0' } });
    assert.equal(choice, 'Place 0');
    click('[data-place-filter]', buttons[0]);
    assert.equal(cards.filter((card) => !card.hidden).length, 6);
    dispose();
    assert.equal(root.listeners.size, 0);
  } finally {
    await server.close();
  }
});

test('typing rotates through complete phrases and cancels pending work when paused', () => {
  const timers = new Map();
  let timerId = 0;
  const clock = {
    setTimeout(callback, delay) {
      timers.set(++timerId, { callback, delay });
      return timerId;
    },
    clearTimeout: (id) => timers.delete(id),
  };
  const typed = element();
  const phrases = ['Beyond Words.', 'Into the Wild.', 'At Your Pace.'];
  const writer = createTypewriter(typed, phrases, clock);
  writer.setEnabled(true);
  writer.setEnabled(true);
  assert.equal(timers.size, 1, 'Repeated updates must not start duplicate loops');
  assert.equal(typed.textContent, phrases[0], 'Show the full heading on arrival');
  const completed = [typed.textContent];
  for (let step = 0; step < 120 && completed.length < 4; step++) {
    const [id, timer] = timers.entries().next().value;
    timers.delete(id);
    timer.callback();
    if (phrases.includes(typed.textContent)) {
      completed.push(typed.textContent);
      assert.equal(
        [...timers.values()][0].delay,
        4200,
        'Hold each complete phrase for reading',
      );
    }
  }
  assert.deepEqual(completed, [...phrases, phrases[0]]);
  writer.setEnabled(false);
  assert.equal(timers.size, 0);
  assert.equal(typed.textContent, phrases[0]);
  writer.setEnabled(true);
  assert.equal(timers.size, 1);
  writer.stop();
  assert.equal(timers.size, 0);
  assert.equal(typed.textContent, phrases[0]);
});

// A small event/timer harness verifies playback policy without pretending to
// replace browser layout, keyboard, or assistive-technology testing.
function element() {
  const listeners = new Map();
  const attributes = new Map();
  const classes = new Set();
  return {
    listeners,
    textContent: '',
    dataset: {},
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      toggle: (name, on) => (on ? classes.add(name) : classes.delete(name)),
    },
    setAttribute: (name, value) => attributes.set(name, value),
    getAttribute: (name) => attributes.get(name),
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: (name) => listeners.delete(name),
    emit: (name, event = {}) => listeners.get(name)?.(event),
  };
}

function motionEnvironment() {
  const intervals = new Map();
  const timeouts = new Map();
  const media = Object.assign(element(), { matches: false });
  const page = Object.assign(element(), { hidden: false, activeElement: null });
  let timerId = 0;
  let intersection;
  let disconnected = false;
  const clock = {
    matchMedia: () => media,
    setInterval: (callback) => {
      intervals.set(++timerId, callback);
      return timerId;
    },
    clearInterval: (id) => intervals.delete(id),
    setTimeout: (callback) => {
      timeouts.set(++timerId, callback);
      return timerId;
    },
    clearTimeout: (id) => timeouts.delete(id),
    IntersectionObserver: class {
      constructor(callback) {
        intersection = callback;
      }
      observe() {}
      disconnect() {
        disconnected = true;
      }
    },
  };
  return {
    clock,
    page,
    media,
    intervals,
    timeouts,
    intersect: (isIntersecting) => intersection([{ isIntersecting }]),
    disconnected: () => disconnected,
  };
}

test('adventure banner links to Explore and rotates backgrounds with motion preferences', async () => {
  const server = await createServer({
    configLoader: 'native',
    resolve: { preserveSymlinks: true },
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  let dispose;
  try {
    const { FeaturedSafari, initFeaturedSafari } = await server.ssrLoadModule(
      '/src/components/FeaturedSafari.js',
    );
    const env = motionEnvironment();
    const markup = FeaturedSafari();
    assert.doesNotMatch(
      markup,
      /data-gallery-motion|Pause gallery|clipPath|featured-safari__art|data-featured-frame/,
    );
    assert.match(markup, /Discover the Wild Heart of Tanzania/);
    assert.match(markup, /href="#traveller-destinations">Explore Now/);
    const backgrounds = Array.from({ length: 3 }, (_, index) => ({
      complete: true,
      naturalWidth: 1280,
      active: index === 0,
      classList: {
        add() {
          backgrounds[index].active = true;
        },
        remove() {
          backgrounds[index].active = false;
        },
      },
    }));
    const root = Object.assign(element(), {
      matches: () => false,
      contains: () => false,
      querySelectorAll: () => backgrounds,
    });
    dispose = initFeaturedSafari(root, undefined, env);
    assert.equal(env.intervals.size, 0);
    env.intersect(true);
    assert.equal(env.intervals.size, 1);
    const tick = () => [...env.intervals.values()][0]();
    backgrounds[1].naturalWidth = 0;
    tick();
    assert.equal(
      backgrounds[0].active,
      true,
      'Retain the current photo until the next one has loaded',
    );
    backgrounds[1].naturalWidth = 1280;
    tick();
    assert.equal(backgrounds[1].active, true);
    assert.equal(backgrounds[0].active, false);
    tick();
    tick();
    assert.deepEqual(
      backgrounds.map((background) => background.active),
      [true, false, false],
    );
    root.emit('mouseenter');
    assert.equal(
      env.intervals.size,
      1,
      'Pointing at the photo does not prevent autoplay',
    );
    root.emit('mouseleave');
    root.emit('focusin');
    assert.equal(env.intervals.size, 0);
    root.emit('focusout', { relatedTarget: null });
    assert.equal(env.intervals.size, 1);
    env.intersect(false);
    assert.equal(env.intervals.size, 0);
    env.intersect(true);
    assert.equal(env.intervals.size, 1);
    env.page.hidden = true;
    env.page.emit('visibilitychange');
    assert.equal(env.intervals.size, 0);
    env.page.hidden = false;
    env.page.emit('visibilitychange');
    assert.equal(env.intervals.size, 1);
    env.media.matches = true;
    env.media.emit('change');
    assert.equal(env.intervals.size, 0);
    dispose();
    assert.equal(env.intervals.size, 0);
    assert.equal(env.disconnected(), true);
    assert.ok(
      [root, env.page, env.media].every((target) => target.listeners.size === 0),
    );
  } finally {
    dispose?.();
    await server.close();
  }
});

test('reference hero retains labelled safari search fields without unverified claims', async () => {
  const server = await createServer({
    configLoader: 'native',
    resolve: { preserveSymlinks: true },
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  try {
    const { Hero } = await server.ssrLoadModule('/src/components/Hero.js');
    const markup = Hero();
    assert.equal([...markup.matchAll(/class="hero__background is-active"/g)].length, 1);
    assert.match(markup, /team-group\.jpeg/);
    assert.match(markup, /Adventure for<br \/>Today &amp; Tomorrow/);
    assert.match(markup, /hero__review-previews/);
    assert.match(markup, /class="hero__planner-row"/);
    assert.doesNotMatch(markup, /Furniture|420\+|100%|Nations welcomed|12\+ reviews/);
    for (const id of ['destinations', 'guides', 'about', 'reviews']) {
      assert.ok(markup.includes(`href="#${id}"`));
    }
    for (const name of ['destination', 'season', 'sign-language', 'travellers']) {
      assert.ok(markup.includes(`id="hero-${name}"`));
      assert.ok(markup.includes(`for="hero-${name}"`));
    }
    assert.match(markup, /type="submit"/);
    assert.match(markup, /dates and sign-language support to be confirmed/);
  } finally {
    await server.close();
  }
});

test('hero backdrop cycles loaded images, pauses accessibly and cleans up', () => {
  const env = motionEnvironment();
  const photos = Array.from({ length: 3 }, () =>
    Object.assign(element(), { complete: true, naturalWidth: 1280 }),
  );
  const symbol = {};
  const toggle = Object.assign(element(), { querySelector: () => symbol });
  const field = {};
  const typed = element();
  const root = Object.assign(element(), {
    querySelectorAll: () => photos,
    querySelector: (selector) => (selector === '[data-hero-typing]' ? typed : toggle),
    contains: (target) => target === field || target === toggle,
  });
  const dispose = initHeroBackdrop(root, env);
  const tick = () => [...env.intervals.values()][0]();
  assert.equal(env.intervals.size, 1);
  assert.equal(env.timeouts.size, 1);
  assert.equal(typed.textContent, 'Today & Tomorrow');
  assert.equal(root.dataset.backdropMotion, 'running');
  tick();
  assert.equal(photos[1].getAttribute('aria-hidden'), 'false');
  photos[2].naturalWidth = 0;
  tick();
  assert.equal(photos[0].getAttribute('aria-hidden'), 'false');
  toggle.emit('click');
  assert.equal(env.intervals.size, 0);
  assert.equal(env.timeouts.size, 0);
  assert.equal(toggle.getAttribute('aria-pressed'), 'true');
  assert.equal(symbol.textContent, 'Play');
  toggle.emit('click');
  assert.equal(env.intervals.size, 1);
  root.emit('focusin', { target: field });
  assert.equal(env.intervals.size, 0);
  root.emit('focusout', { relatedTarget: null });
  assert.equal(env.intervals.size, 1);
  env.page.hidden = true;
  env.page.emit('visibilitychange');
  assert.equal(env.intervals.size, 0);
  env.page.hidden = false;
  env.page.emit('visibilitychange');
  env.intersect(false);
  assert.equal(env.intervals.size, 0);
  env.intersect(true);
  assert.equal(env.intervals.size, 1);
  env.media.matches = true;
  env.media.emit('change');
  assert.equal(env.intervals.size, 0);
  assert.equal(toggle.hidden, true);
  assert.equal(env.timeouts.size, 0);
  assert.equal(typed.textContent, 'Today & Tomorrow');
  assert.equal(root.dataset.backdropMotion, 'paused');
  env.media.matches = false;
  env.media.emit('change');
  assert.equal(env.intervals.size, 1);
  dispose();
  assert.equal(env.intervals.size, 0);
  assert.equal(env.timeouts.size, 0);
  assert.equal(env.disconnected(), true);
  assert.ok(
    [root, toggle, env.page, env.media, ...photos].every(
      (target) => target.listeners.size === 0,
    ),
  );
});

test('hero cycles images and typing, respects reading pauses and reduced motion, and clears timers', () => {
  const env = motionEnvironment();
  const focusedControl = element();
  const typed = element();
  const card = Object.assign(element(), { matches: () => false });
  const backgrounds = [element(), element(), element(), element()];
  const root = Object.assign(element(), {
    contains: (target) => target === focusedControl,
    querySelector: (selector) =>
      ({
        '[data-hero-typing]': typed,
        '.hero__card': card,
      })[selector],
    querySelectorAll: () => backgrounds,
  });
  let advances = 0;
  const dispose = initHeroMotion(root, () => advances++, env);
  try {
    assert.equal(env.intervals.size, 1);
    assert.equal(env.timeouts.size, 1);
    assert.equal(typed.textContent, 'Today & Tomorrow.');
    [...env.intervals.values()][0]();
    assert.equal(advances, 1);
    assert.equal(backgrounds[1].getAttribute('aria-hidden'), 'false');
    assert.equal(backgrounds[0].getAttribute('aria-hidden'), 'true');
    env.page.emit('visibilitychange');
    assert.equal(env.intervals.size, 1, 'No duplicate slideshow timers');
    card.emit('mouseenter');
    assert.equal(env.intervals.size, 0);
    assert.equal(env.timeouts.size, 0);
    card.emit('mouseleave');
    assert.equal(env.intervals.size, 1);
    root.emit('focusin');
    assert.equal(env.intervals.size, 0);
    root.emit('focusout', { relatedTarget: focusedControl });
    assert.equal(env.intervals.size, 0);
    root.emit('focusout', { relatedTarget: null });
    assert.equal(env.intervals.size, 1);
    env.page.hidden = true;
    env.page.emit('visibilitychange');
    assert.equal(env.intervals.size, 0);
    assert.equal(env.timeouts.size, 0);
    env.page.hidden = false;
    env.page.emit('visibilitychange');
    assert.equal(env.intervals.size, 1);
    env.intersect(false);
    assert.equal(env.intervals.size, 0);
    env.intersect(true);
    assert.equal(env.intervals.size, 1);
    env.media.matches = true;
    env.media.emit('change');
    assert.equal(env.intervals.size, 0);
    assert.equal(env.timeouts.size, 0);
    assert.equal(root.dataset.motion, 'paused');
    env.media.matches = false;
    env.media.emit('change');
    assert.equal(env.intervals.size, 1);
  } finally {
    dispose();
  }
  assert.equal(env.intervals.size, 0);
  assert.equal(env.timeouts.size, 0);
  assert.equal(root.listeners.size, 0);
  assert.equal(env.page.listeners.size, 0);
  assert.equal(env.disconnected(), true);
});

test('safari experience preview reveals and collapses the remaining cards', async () => {
  const server = await createServer({
    configLoader: 'native',
    resolve: { preserveSymlinks: true },
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  let dispose;
  try {
    const { SafariIdeaCards, initSafariIdeaCards } = await server.ssrLoadModule(
      '/src/components/SafariIdeaCards.js',
    );
    const html = SafariIdeaCards();
    const detailRows = [
      ...html.matchAll(/<ul class="safari-idea__details"[^>]*>([\s\S]*?)<\/ul>/g),
    ];
    assert.equal(detailRows.length, 6);
    for (const [, details] of detailRows) {
      assert.equal((details.match(/<li>/g) || []).length, 4);
      assert.doesNotMatch(details, /<small>/);
    }
    assert.match(detailRows[0][1], /Hiking/);
    assert.match(detailRows[0][1], /Bike option/);
    assert.doesNotMatch(detailRows[0][1], /Cruiser/);
    assert.match(detailRows[1][1], /Camping/);
    assert.match(detailRows[5][1], /Walking/);
    assert.doesNotMatch(html, /<span>From<\/span>|Guide price|Sign needs/);
    assert.equal((html.match(/<article class="safari-idea">/g) || []).length, 6);
    assert.equal((html.match(/data-safari-idea-extra hidden/g) || []).length, 3);
    const button = element();
    const label = { textContent: 'View all experiences' };
    button.querySelector = () => label;
    button.setAttribute('aria-expanded', 'false');
    const extraCards = Array.from({ length: 3 }, () => ({ hidden: true }));
    dispose = initSafariIdeaCards({
      querySelector: () => button,
      querySelectorAll: () => extraCards,
    });
    button.emit('click');
    assert.ok(extraCards.every((card) => !card.hidden));
    assert.equal(button.getAttribute('aria-expanded'), 'true');
    assert.equal(label.textContent, 'Show fewer experiences');
    button.emit('click');
    assert.ok(extraCards.every((card) => card.hidden));
    assert.equal(button.getAttribute('aria-expanded'), 'false');
    assert.equal(label.textContent, 'View all experiences');
    dispose();
    button.emit('click');
    assert.ok(extraCards.every((card) => card.hidden));
  } finally {
    dispose?.();
    await server.close();
  }
});

test('destination tabs support keyboard wrapping, a single selected panel, and planner handoff', async () => {
  const server = await createServer({
    configLoader: 'native',
    resolve: { preserveSymlinks: true },
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  let dispose;
  try {
    const { Destinations, initDestinations } = await server.ssrLoadModule(
      '/src/components/Destinations.js',
    );
    const { destinations } = await server.ssrLoadModule('/src/data/destinations.js');
    assert.doesNotMatch(Destinations(), /data-gallery-motion|Pause gallery/);
    assert.equal(destinations[0].name, 'Kilimanjaro');
    assert.equal(destinations.length, 7);
    assert.ok(destinations.every((place) => place.photos.length === 3));
    assert.equal(
      new Set(destinations.flatMap((place) => place.photos.map((photo) => photo.src)))
        .size,
      21,
    );
    assert.ok(
      destinations
        .flatMap((place) => place.photos)
        .every((photo) => photo.src && photo.alt && photo.license && photo.source),
    );
    const tabs = Array.from({ length: 7 }, () => element());
    let focused = -1;
    tabs.forEach((tab, index) => {
      tab.focus = () => {
        focused = index;
      };
    });
    const panels = tabs.map((_, index) => {
      const photos = Array.from({ length: 3 }, () =>
        Object.assign(element(), {
          querySelector: () => ({ complete: true, naturalWidth: 1280 }),
        }),
      );
      const credit = {};
      return {
        hidden: index !== 0,
        photos,
        credit,
        querySelector: () => credit,
        querySelectorAll: (selector) =>
          selector === '[data-destination-photo]' ? photos : [],
      };
    });
    const link = element();
    link.dataset.destinationChoice = 'Tarangire';
    const root = {
      querySelector: (selector) => controls[selector],
      querySelectorAll: (selector) =>
        ({
          '[role="tab"]': tabs,
          '[role="tabpanel"]': panels,
          '[data-destination-choice]': [link],
        })[selector],
    };
    const controls = Object.fromEntries(
      ['[data-destination-status]'].map((selector) => [selector, element()]),
    );
    let selectedDestination;
    let advance;
    let galleryDisposed = false;
    dispose = initDestinations(
      root,
      (destination) => {
        selectedDestination = destination;
      },
      {
        motionFactory: (_, callback) => {
          advance = callback;
          return {
            restart() {},
            dispose() {
              galleryDisposed = true;
            },
          };
        },
      },
    );
    assert.equal(panels[0].hidden, false);
    assert.equal(focused, -1, 'Initialization does not move keyboard focus');
    assert.equal(
      controls['[data-destination-status]'].textContent,
      '',
      'Initialization is not announced',
    );
    tabs[0].emit('click');
    const key = (index, value) =>
      tabs[index].emit('keydown', { key: value, preventDefault() {} });
    const assertSelected = (index) => {
      assert.deepEqual(
        panels.map((panel) => panel.hidden),
        tabs.map((_, i) => i !== index),
      );
      assert.equal(
        tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true').length,
        1,
      );
      assert.equal(tabs.filter((tab) => tab.tabIndex === 0).length, 1);
    };
    key(0, 'ArrowLeft');
    assertSelected(6);
    assert.equal(focused, 6);
    key(6, 'ArrowRight');
    assertSelected(0);
    key(0, 'End');
    assertSelected(6);
    key(6, 'Home');
    assertSelected(0);
    tabs[1].emit('click');
    assertSelected(1);
    advance();
    assert.equal(panels[1].photos[1].getAttribute('aria-hidden'), 'false');
    assert.equal(panels[1].credit.href, destinations[1].photos[1].source);
    advance();
    advance();
    assert.equal(panels[1].photos[0].getAttribute('aria-hidden'), 'false');
    assertSelected(1);
    assert.equal(
      panels[0].photos[1].getAttribute('aria-hidden'),
      undefined,
      'Hidden destination photos do not advance',
    );
    assert.equal(
      controls['[data-destination-status]'].textContent,
      destinations[1].name,
    );
    assert.equal(
      selectedDestination,
      undefined,
      'Switching tabs does not change the visitor’s planner',
    );
    link.emit('click', { preventDefault() {} });
    assert.equal(selectedDestination, 'Tarangire');
    const html = Destinations();
    assert.doesNotMatch(
      html,
      /destinations__playbar|data-destination-count|data-destination-next|data-destination-previous/,
    );
    assert.doesNotMatch(html, /destinations__thumbnails|data-destination-photo-index/);
    assert.doesNotMatch(html, /data-destination-playback/);
    assert.equal((html.match(/role="tab"/g) || []).length, 7);
    assert.equal((html.match(/role="tabpanel"/g) || []).length, 7);
    assert.equal(
      (html.match(/<figure class="destinations__visual">/g) || []).length,
      7,
    );
    assert.match(
      html,
      /Itineraries and sign-language arrangements are to be confirmed/,
    );
    dispose();
    assert.equal(galleryDisposed, true);
    assert.ok([...tabs, link].every((target) => target.listeners.size === 0));
  } finally {
    dispose?.();
    await server.close();
  }
});

test('planner preserves visitor notes, updates its own summary, and retains group ranges', async () => {
  const server = await createServer({
    configLoader: 'native',
    resolve: { preserveSymlinks: true },
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false },
    appType: 'custom',
  });
  const previousDocument = globalThis.document;
  const previousFormData = globalThis.FormData;
  let dispose;
  try {
    const { initHeroPlanner } = await server.ssrLoadModule('/src/components/Hero.js');
    const selectors = Object.fromEntries(
      [
        '#hero-planner',
        '#preferences',
        '#brief-status',
        '#enquiry-form',
        '#brief-result',
        '#travel-window',
        '#travellers',
        '#enquiries',
      ].map((selector) => [selector, element()]),
    );
    const values = new Map([
      ['destination', 'Serengeti'],
      ['season', 'July – October'],
      ['sign-language', 'ASL'],
      ['travellers', '3-5'],
    ]);
    globalThis.document = { querySelector: (selector) => selectors[selector] };
    globalThis.FormData = class {
      get(name) {
        return values.get(name);
      }
    };
    const preferences = selectors['#preferences'];
    preferences.value = 'Please use written communication.\nNingependa kuona tembo. 🐘';
    const original = preferences.value;
    preferences.maxLength = 2000;
    preferences.focus = () => {};
    selectors['#enquiries'].scrollIntoView = () => {};
    selectors['#hero-planner'].reportValidity = () => true;
    dispose = initHeroPlanner();
    const submit = () =>
      selectors['#hero-planner'].emit('submit', { preventDefault() {} });
    submit();
    assert.ok(preferences.value.endsWith(original));
    assert.match(preferences.value, /Group size: 3-5/);
    assert.equal(selectors['#travellers'].value, '');
    assert.equal(selectors['#travel-window'].value, 'July – October');
    values.set('destination', 'Kilimanjaro');
    values.set('travellers', '2');
    submit();
    assert.equal((preferences.value.match(/Destination:/g) || []).length, 1);
    assert.match(preferences.value, /Destination: Kilimanjaro/);
    assert.equal(selectors['#travellers'].value, '2');
    assert.ok(preferences.value.endsWith(original));
    values.set('destination', '');
    values.set('season', '');
    values.set('sign-language', '');
    submit();
    assert.match(preferences.value, /Destination: Help me choose/);
    assert.match(preferences.value, /Sign preference: Discuss with our team/);
    assert.equal(selectors['#travel-window'].value, 'Flexible dates');
    assert.ok(preferences.value.endsWith(original));
    preferences.value = 'a'.repeat(2000);
    submit();
    assert.equal(preferences.value, 'a'.repeat(2000), 'Never truncate visitor notes');
    assert.match(selectors['#brief-status'].textContent, /notes are full/);
    dispose();
    let searched;
    dispose = initHeroPlanner((answers) => {
      searched = answers.get('travellers');
    });
    selectors['#hero-planner'].emit('submit', { type: 'submit', preventDefault() {} });
    assert.equal(
      searched,
      '2',
      'Search opens results even if the existing brief is full',
    );
    assert.equal(
      preferences.value,
      'a'.repeat(2000),
      'Searching does not overwrite existing notes',
    );
    preferences.value = original;
    values.set('destination', 'Ngorongoro');
    selectors['#hero-planner'].emit('planner:choose', {
      type: 'planner:choose',
      preventDefault() {},
    });
    assert.match(preferences.value, /Destination: Ngorongoro/);
    assert.ok(
      preferences.value.endsWith(original),
      'Choosing a result carries preferences into the existing brief',
    );
    dispose();
    dispose = undefined;
    assert.equal(selectors['#hero-planner'].listeners.size, 0);
  } finally {
    dispose?.();
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    globalThis.FormData = previousFormData;
    await server.close();
  }
});
