export function createReviewDraft({
  name = '',
  experience = '',
  destination = '',
  rating = '',
  title = '',
  review = '',
} = {}) {
  const stars = Number(rating);
  const body = review.trim();
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    throw new Error('Choose a rating from 1 to 5.');
  }
  if (body.length < 20 || body.length > 2000) {
    throw new Error('Write a review between 20 and 2,000 characters.');
  }
  return {
    name: name.trim() || 'Visitor',
    experience: experience === 'Safari experience' ? experience : 'Website experience',
    destination: destination.trim() || 'Tanzania',
    rating: stars,
    title: title.trim() || 'My experience',
    review: body,
  };
}

export function reviewAsText(draft) {
  return [
    'DEAF SAFARIS — MY REVIEW DRAFT',
    'Personal preview. Not submitted or published.',
    '',
    `Name: ${draft.name}`,
    `Reviewing: ${draft.experience}`,
    `Place visited: ${draft.destination}`,
    `Rating: ${draft.rating} out of 5`,
    `Title: ${draft.title}`,
    '',
    draft.review,
  ].join('\n');
}
