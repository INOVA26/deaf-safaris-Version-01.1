export const searchChoices = {
  destination: [
    'Serengeti',
    'Ngorongoro',
    'Kilimanjaro',
    'Tarangire',
    'Arusha National Park',
    'Chemka Hot Springs',
    'Arusha Cultural Heritage Centre',
    'Help me choose',
  ],
  season: [
    'Flexible dates',
    'January – March',
    'April – June',
    'July – October',
    'November – December',
  ],
  'sign-language': [
    'Discuss with our team',
    'ASL',
    'BSL',
    'International Sign',
    'Tanzanian Sign Language',
  ],
  travellers: ['1', '2', '3-5', '6+'],
};

// Only recognised planner values enter the URL or results summary.
export function normaliseSearch(values) {
  return Object.fromEntries(
    Object.entries(searchChoices).map(([key, choices]) => {
      const value = values.get(key);
      return [key, choices.includes(value) ? value : key === 'travellers' ? '2' : ''];
    }),
  );
}

export function safariSearchHash(values) {
  const params = new URLSearchParams(normaliseSearch(values));
  return `#safaris?${params}`;
}

export function readSafariSearch(hash) {
  return normaliseSearch(new URLSearchParams(hash.split('?')[1] || ''));
}

export function filterSafaris(
  tours,
  search,
  {
    category = 'all',
    duration = 'all',
    sort = 'recommended',
    savedOnly = false,
    saved = new Set(),
  } = {},
) {
  const results = tours.filter((tour) => {
    const destinationMatches =
      !search.destination ||
      search.destination === 'Help me choose' ||
      tour.destination === search.destination;
    const categoryMatches =
      category === 'all' ||
      (category === 'mountain'
        ? tour.destination === 'Kilimanjaro'
        : tour.destination !== 'Kilimanjaro');
    return (
      destinationMatches &&
      categoryMatches &&
      (duration === 'all' ||
        (duration === 'day' && tour.days === 1) ||
        (duration === 'multi' && tour.days > 1) ||
        (duration === 'flexible' && tour.days == null)) &&
      (!savedOnly || saved.has(tour.destination))
    );
  });
  return sort === 'az'
    ? results.sort((a, b) => a.title.localeCompare(b.title))
    : results;
}
