export function reviewSummary(reviews) {
  const valid = reviews.filter(
    ({ rating }) => Number.isInteger(rating) && rating >= 1 && rating <= 5,
  );
  const average = valid.length
    ? (valid.reduce((sum, review) => sum + review.rating, 0) / valid.length).toFixed(1)
    : '—';
  return `<div><p class="eyebrow">Reviews on this device</p><strong class="reviews__score">${average}</strong><p>${valid.length ? `${valid.length} saved reviews` : 'Be the first to share your experience'}</p><small>Personal reviews only. Sample stories are excluded.</small></div><div class="reviews__bars">${[
    5, 4, 3, 2, 1,
  ]
    .map((star) => {
      const count = valid.filter((review) => review.rating === star).length;
      return `<div><span aria-hidden="true">${star} ★</span><meter min="0" max="${valid.length || 1}" value="${count}" aria-label="${star} stars: ${count} reviews"></meter><span>${count}</span></div>`;
    })
    .join('')}</div>`;
}

export function initReviewComposer(form) {
  if (!form?.querySelector) return () => {};
  const rating = form.querySelector('#review-rating');
  const stars = [...form.querySelectorAll('[data-review-star]')];
  const input = form.querySelector('#review-media');
  const previews = form.querySelector('#review-media-previews');
  const status = form.querySelector('#review-media-status');
  const listeners = [];
  let urls = [];
  const listen = (target, type, handler) => {
    target.addEventListener(type, handler);
    listeners.push(() => target.removeEventListener(type, handler));
  };
  const sync = () =>
    stars.forEach((star) => {
      const value = Number(star.dataset.reviewStar);
      star.setAttribute('aria-pressed', String(value === Number(rating.value)));
      star.classList.toggle('is-filled', value <= Number(rating.value));
    });
  stars.forEach((star) =>
    listen(star, 'click', () => {
      rating.value = star.dataset.reviewStar;
      rating.dispatchEvent(new Event('change', { bubbles: true }));
    }),
  );
  listen(rating, 'change', sync);
  sync();
  const clear = () => {
    urls.forEach((url) => URL.revokeObjectURL(url));
    urls = [];
    previews.replaceChildren();
    status.textContent = '';
  };
  listen(input, 'change', () => {
    clear();
    const files = [...input.files];
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
    ];
    if (
      files.length > 4 ||
      files.some((file) => file.size > 10 * 1024 * 1024 || !allowed.includes(file.type))
    ) {
      status.textContent =
        'Choose up to 4 JPG, PNG, WebP, MP4 or WebM files, no larger than 10 MB each.';
      input.value = '';
      return;
    }
    files.forEach((file) => {
      const figure = document.createElement('figure');
      const media = document.createElement(
        file.type.startsWith('video/') ? 'video' : 'img',
      );
      const caption = document.createElement('figcaption');
      const url = URL.createObjectURL(file);
      urls.push(url);
      media.src = url;
      if (media.tagName === 'VIDEO') {
        media.controls = true;
        media.preload = 'metadata';
      } else media.alt = 'Your selected photo: ' + file.name;
      caption.textContent = file.name;
      figure.append(media, caption);
      previews.append(figure);
    });
    status.textContent = files.length
      ? `${files.length} private media previews. These are not saved with your review.`
      : '';
  });
  listen(form, 'reset', () => {
    clear();
    queueMicrotask(sync);
  });
  return () => {
    clear();
    listeners.forEach((remove) => remove());
  };
}
