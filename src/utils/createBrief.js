export function createBrief(answers = {}) {
  const value = (key, fallback) => String(answers[key] ?? '').trim() || fallback;

  return [
    'DEAF SAFARIS — MY SAFARI BRIEF',
    'Personal draft · Not sent · Not a booking',
    '',
    `Inspiration: ${value('interest', 'Open to ideas')}`,
    `Travellers: ${value('travellers', 'To be decided')}`,
    `Preferred travel dates: ${value('travelWindow', 'Flexible / to be decided')}`,
    '',
    'My interests, preferences, and questions:',
    value('preferences', 'To be discussed'),
    '',
    'Next step: confirm contact details, itinerary, availability, costs, and any communication or accessibility arrangements directly before making travel plans.',
  ].join('\n');
}
