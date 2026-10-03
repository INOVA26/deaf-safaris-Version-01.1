import test from 'node:test';
import assert from 'node:assert/strict';
import { initReviewComposer, reviewSummary } from '../src/utils/reviewComposer.js';

test('review summary uses only valid saved ratings and has an honest empty state', () => {
  assert.match(reviewSummary([]), /Be the first/);
  const html = reviewSummary([
    { rating: 5 },
    { rating: 3 },
    { rating: 9 },
    { rating: '5' },
  ]);
  assert.match(html, /reviews__score">4.0/);
  assert.match(html, /2 saved reviews/);
  assert.match(html, /5 stars: 1 reviews/);
  assert.match(html, /Sample stories are excluded/);
});

test('review stars update the submitted value and oversized media is rejected before URL creation', () => {
  const node = () =>
    Object.assign(new EventTarget(), {
      value: '',
      textContent: '',
      attributes: {},
      setAttribute(key, value) {
        this.attributes[key] = value;
      },
      classList: { toggle() {} },
      replaceChildren() {},
    });
  const stars = [1, 2, 3, 4, 5].map((value) =>
    Object.assign(node(), { dataset: { reviewStar: String(value) } }),
  );
  const fields = Object.fromEntries(
    ['rating', 'media', 'media-previews', 'media-status'].map((id) => [
      `#review-${id}`,
      node(),
    ]),
  );
  fields['#review-rating'].value = '3';
  const form = Object.assign(node(), {
    querySelector: (key) => fields[key],
    querySelectorAll: () => stars,
  });
  const dispose = initReviewComposer(form);
  stars[4].dispatchEvent(new Event('click'));
  assert.equal(fields['#review-rating'].value, '5');
  assert.equal(stars[4].attributes['aria-pressed'], 'true');
  assert.equal(stars[2].attributes['aria-pressed'], 'false');
  fields['#review-media'].files = [{ type: 'image/png', size: 11 * 1024 * 1024 }];
  fields['#review-media'].dispatchEvent(new Event('change'));
  assert.match(fields['#review-media-status'].textContent, /no larger than 10 MB/);
  dispose();
  stars[0].dispatchEvent(new Event('click'));
  assert.equal(fields['#review-rating'].value, '5');
});
