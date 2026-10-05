import assert from 'node:assert/strict';
import test from 'node:test';
import { initGalleryCarousel } from '../src/utils/galleryCarousel.js';

function fixture(reduced = false, count = 3, phone = false) {
  const element = (selector = '', dataset = {}) =>
    Object.assign(new EventTarget(), {
      dataset,
      style: {},
      attributes: {},
      closest(query) {
        return query === selector ? this : null;
      },
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
      getAttribute(name) {
        return this.attributes[name];
      },
      focus() {
        this.focused = true;
      },
    });
  const slides = Array.from({ length: count }, (_, i) => {
    const slide = element();
    slide.setAttribute('aria-label', `${i + 1} of 3`);
    return slide;
  });
  const dots = slides.map((_, i) =>
    element('[data-gallery-dot]', { galleryDot: String(i) }),
  );
  const fields = Object.fromEntries(
    ['track', 'viewport', 'announcement'].map((name) => [
      `[data-gallery-${name}]`,
      element(`[data-gallery-${name}]`),
    ]),
  );
  const doc = Object.assign(element(), { hidden: false });
  const root = Object.assign(element(), {
    ownerDocument: doc,
    hidden: false,
    contains: (target) => dots.includes(target) || slides.includes(target),
    querySelector: (selector) => fields[selector],
    querySelectorAll: (selector) =>
      selector === '[data-gallery-slide]' ? slides : dots,
  });
  const motion = Object.assign(element(), { matches: reduced });
  const mobile = Object.assign(element(), { matches: phone });
  const timers = new Map();
  let nextId = 0;
  let observe;
  let disconnected = false;
  const clock = Object.assign(element(), {
    matchMedia: (query) => (query.includes('reduced-motion') ? motion : mobile),
    setTimeout(callback, ms) {
      assert.equal(ms, 5000);
      timers.set(++nextId, callback);
      return nextId;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    IntersectionObserver: class {
      constructor(callback) {
        observe = callback;
      }
      observe() {}
      disconnect() {
        disconnected = true;
      }
    },
  });
  const emit = (host, type, properties = {}) => {
    const event = new Event(type, { cancelable: true });
    for (const [name, value] of Object.entries(properties))
      Object.defineProperty(event, name, { value });
    host.dispatchEvent(event);
    return event;
  };
  const dispose = initGalleryCarousel(root, clock);
  return {
    root,
    doc,
    clock,
    slides,
    dots,
    motion,
    mobile,
    timers,
    fields,
    emit,
    dispose,
    visible(value) {
      observe([{ isIntersecting: value }]);
    },
    tick() {
      assert.equal(timers.size, 1);
      const [id, callback] = [...timers][0];
      timers.delete(id);
      callback();
    },
    click(target) {
      emit(root, 'click', { target });
    },
    active() {
      return slides.findIndex((slide) => !slide.inert);
    },
    disconnected: () => disconnected,
  };
}

test('gallery autoplay cycles three slides at five seconds and pauses offscreen, on hover and hidden tabs', () => {
  const f = fixture();
  assert.equal(f.timers.size, 0);
  f.visible(true);
  f.tick();
  assert.equal(f.active(), 1);
  f.tick();
  assert.equal(f.active(), 2);
  f.tick();
  assert.equal(f.active(), 0);
  assert.equal(f.dots[0].getAttribute('aria-pressed'), 'true');
  assert.equal(f.slides[1].getAttribute('aria-hidden'), 'true');
  assert.equal(f.fields['[data-gallery-announcement]'].textContent, undefined);
  f.emit(f.root, 'pointerenter', { pointerType: 'mouse' });
  assert.equal(f.timers.size, 0);
  f.emit(f.root, 'pointerleave');
  assert.equal(f.timers.size, 1);
  f.doc.hidden = true;
  f.emit(f.doc, 'visibilitychange');
  assert.equal(f.timers.size, 0);
  f.doc.hidden = false;
  f.emit(f.doc, 'visibilitychange');
  assert.equal(f.timers.size, 1);
  f.visible(false);
  assert.equal(f.timers.size, 0);
  f.visible(true);
  f.dispose();
  assert.equal(f.timers.size, 0);
  assert.equal(f.disconnected(), true);
  f.click(f.dots[2]);
  assert.equal(f.active(), 0);
});

test('gallery manual selection, keyboard, focus recovery and touch swipe retain a single accessible slide', () => {
  const f = fixture();
  f.visible(true);
  f.emit(f.root, 'focusin', { target: f.dots[0] });
  assert.equal(f.timers.size, 0);
  f.emit(f.root, 'focusout', { relatedTarget: f.dots[1] });
  assert.equal(f.timers.size, 0);
  f.emit(f.root, 'focusout', { relatedTarget: null });
  assert.equal(f.timers.size, 1);
  f.click(f.dots[2]);
  assert.equal(f.active(), 2);
  assert.equal(f.timers.size, 1);
  assert.equal(f.fields['[data-gallery-announcement]'].textContent, '3 of 3');
  const key = f.emit(f.root, 'keydown', { target: f.dots[2], key: 'ArrowRight' });
  assert.equal(key.defaultPrevented, true);
  assert.equal(f.active(), 0);
  assert.equal(f.dots[0].focused, true);
  assert.equal(f.slides.filter((s) => !s.inert).length, 1);
  const viewport = f.fields['[data-gallery-viewport]'];
  f.emit(viewport, 'pointerdown', {
    target: viewport,
    pointerType: 'touch',
    pointerId: 1,
    clientX: 200,
    clientY: 50,
  });
  f.emit(viewport, 'pointerup', { pointerId: 1, clientX: 80, clientY: 60 });
  assert.equal(f.active(), 1);
  f.emit(viewport, 'pointerdown', {
    target: viewport,
    pointerType: 'touch',
    pointerId: 2,
    clientX: 200,
    clientY: 50,
  });
  f.emit(viewport, 'pointerup', { pointerId: 2, clientX: 180, clientY: 160 });
  assert.equal(f.active(), 1);
  f.root.hidden = true;
  f.emit(f.clock, 'hashchange');
  assert.equal(f.timers.size, 0);
  f.dispose();
});

test('gallery reduced motion disables autoplay while manual navigation still works', () => {
  const f = fixture(true);
  f.visible(true);
  assert.equal(f.timers.size, 0);
  f.click(f.dots[1]);
  assert.equal(f.active(), 1);
  f.motion.matches = false;
  f.emit(f.motion, 'change');
  assert.equal(f.timers.size, 1);
  f.motion.matches = true;
  f.emit(f.motion, 'change');
  assert.equal(f.timers.size, 0);
  f.dispose();
});

test('gallery cycles through four slides and wraps to the first', () => {
  const f = fixture(false, 4);
  f.visible(true);
  for (const expected of [1, 2, 3, 0]) {
    f.tick();
    assert.equal(f.active(), expected);
  }
  f.click(f.dots[3]);
  assert.equal(f.active(), 3);
  assert.equal(f.dots[3].getAttribute('aria-pressed'), 'true');
  f.dispose();
});

test('phone gallery stays still while cards are read and resumes autoplay only on desktop', () => {
  const f = fixture(false, 4, true);
  f.visible(true);
  assert.equal(f.timers.size, 0);
  f.click(f.dots[2]);
  assert.equal(f.active(), 2);
  assert.equal(f.timers.size, 0);
  f.mobile.matches = false;
  f.emit(f.mobile, 'change');
  f.tick();
  assert.equal(f.active(), 3);
  f.mobile.matches = true;
  f.emit(f.mobile, 'change');
  assert.equal(f.timers.size, 0);
  f.dispose();
  f.mobile.matches = false;
  f.emit(f.mobile, 'change');
  assert.equal(f.timers.size, 0);
});
