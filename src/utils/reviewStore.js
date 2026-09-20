const reviewStorageKey = 'deaf-safaris-reviews';
let unsavedReviews = [];

function validReview(review) {
  return (
    review &&
    typeof review === 'object' &&
    ['name', 'title', 'review', 'destination'].every(
      (field) => typeof review[field] === 'string',
    ) &&
    Number.isInteger(review.rating) &&
    review.rating >= 1 &&
    review.rating <= 5
  );
}

export function newestReviews(reviews) {
  const timestamp = (review) => Date.parse(review.createdAt || review.date || '') || 0;
  return [...reviews].filter(validReview).sort((a, b) => timestamp(b) - timestamp(a));
}

export function getStoredReviews() {
  try {
    const value = window.localStorage.getItem(reviewStorageKey);
    const reviews = value ? JSON.parse(value) : [];
    return newestReviews([
      ...unsavedReviews,
      ...(Array.isArray(reviews) ? reviews : []),
    ]);
  } catch {
    return newestReviews(unsavedReviews);
  }
}

export function saveStoredReview(review) {
  const savedReview = { ...review, createdAt: new Date().toISOString() };
  const reviews = newestReviews([savedReview, ...getStoredReviews()]);
  try {
    window.localStorage.setItem(reviewStorageKey, JSON.stringify(reviews));
    unsavedReviews = [];
    return { reviews, persisted: true };
  } catch {
    unsavedReviews = [savedReview, ...unsavedReviews];
    return { reviews, persisted: false };
  }
}

export function topStoredReview(reviews = getStoredReviews()) {
  return [...reviews].sort((a, b) => b.rating - a.rating)[0] || null;
}
