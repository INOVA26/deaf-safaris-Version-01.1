import { ReviewText } from '../src/components/ReviewText.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createMobileMenu } from '../src/utils/mobileMenu.js';
import { initResponsiveRows } from '../src/utils/responsiveRows.js';

test('mobile menu interrupts stale closes and never leaves hidden links focusable', () => {
  const animations = [];
  const panel = {
    hidden: true,
    animate() {
      const animation = {
        cancel() {
          this.cancelled = true;
        },
      };
      animations.push(animation);
      return animation;
    },
  };
  const media = { matches: false };
  const menu = createMobileMenu(panel, { matchMedia: () => media });
  menu.show(true);
  assert.equal(panel.hidden, false);
  assert.equal(panel.inert, false);
  menu.show(false);
  assert.equal(panel.inert, true);
  const staleClose = animations[1];
  menu.show(true);
  staleClose.onfinish();
  assert.equal(panel.hidden, false);
  assert.equal(panel.inert, false);
  assert.equal(staleClose.cancelled, true);
  menu.show(false, true);
  assert.equal(panel.hidden, false);
  assert.equal(panel.inert, false);
  media.matches = true;
  menu.show(false);
  assert.equal(panel.hidden, true);
  menu.dispose();
});

test('mobile swipe rows support arrow keys, restore semantics on desktop, and clean up', () => {
  const mobile = Object.assign(new EventTarget(), { matches: true });
  const motion = { matches: true };
  const row = Object.assign(new EventTarget(), {
    attributes: {},
    clientWidth: 300,
    scrollWidth: 1000,
    scrollLeft: 0,
    getAttribute(name) {
      return this.attributes[name] ?? null;
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    removeAttribute(name) {
      delete this.attributes[name];
    },
    closest() {
      return {
        querySelector() {
          return { textContent: 'Tour ideas' };
        },
      };
    },
    scrollTo(options) {
      this.lastScroll = options;
    },
  });
  const dispose = initResponsiveRows(
    { querySelectorAll: () => [row] },
    {
      matchMedia: (query) => (query.includes('reduced-motion') ? motion : mobile),
    },
  );
  assert.equal(row.attributes.tabindex, '0');
  assert.match(row.attributes['aria-label'], /Tour ideas/);
  const key = new Event('keydown', { cancelable: true });
  Object.defineProperty(key, 'key', { value: 'ArrowRight' });
  row.dispatchEvent(key);
  assert.equal(key.defaultPrevented, true);
  assert.deepEqual(row.lastScroll, { left: 252, behavior: 'instant' });
  mobile.matches = false;
  mobile.dispatchEvent(new Event('change'));
  assert.equal(row.getAttribute('tabindex'), null);
  assert.equal(row.getAttribute('role'), null);
  dispose();
  assert.deepEqual(row.attributes, {});
});

test('long mobile stories disclose all original text safely; short stories stay simple', () => {
  assert.equal(ReviewText('A short story.'), '<blockquote>A short story.</blockquote>');
  const body = '<script>alert(1)</script> ' + 'Wonderful wildlife. '.repeat(30);
  const markup = ReviewText(body);
  assert.match(markup, /<details class="review-story__mobile">/);
  assert.match(markup, /Read more/);
  assert.match(markup, /Read less/);
  assert.doesNotMatch(markup, /<script>/);
  assert.match(markup, /&lt;script&gt;/);
  assert.equal((markup.match(/Wonderful wildlife\./g) || []).length >= 60, true);
});
