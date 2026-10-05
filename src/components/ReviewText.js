import { escapeHtml } from '../utils/escapeHtml.js';

// Keep the complete story on desktop and make unusually long phone cards optional.
export function ReviewText(text) {
  const full = `<blockquote>${escapeHtml(text)}</blockquote>`;
  if (text.length <= 320) return full;
  const excerpt = text.slice(0, 220).replace(/\s+\S*$/, '');
  return `<div class="review-story"><div class="review-story__desktop">${full}</div><details class="review-story__mobile"><summary><span class="review-story__excerpt">${escapeHtml(excerpt)}…</span><span class="review-story__more">Read more</span><span class="review-story__less">Read less</span></summary>${full}</details></div>`;
}
