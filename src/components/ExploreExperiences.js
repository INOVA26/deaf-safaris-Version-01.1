import { escapeHtml } from '../utils/escapeHtml.js';

// Prices and visit notes supplied by the site owner, 27 September 2026.
// Keep unrated places as curated ideas rather than claiming popularity data.
const experiences = [
  [
    'Street Food and Community Walking Tour',
    'Food & community',
    '$45',
    '1 day',
    'Explore local food and community life in Arusha.',
  ],
  [
    'Serval Wildlife',
    'Wildlife',
    '150K',
    '1 day',
    'A wildlife day-trip idea. Confirm transport and included activities when planning.',
  ],
  [
    'Arusha market · Sokoni',
    'Markets & culture',
    'Free visit',
    'Arusha',
    'Explore the market and local stalls. Food and purchases cost extra.',
  ],
  [
    'Maasai market & clothing',
    'Markets & culture',
    'Free visit',
    'Arusha',
    'Browse crafts and ask about trying Maasai clothing. Purchases and clothing activities may cost extra.',
  ],
  [
    'Local artists & cultural art',
    'Art & crafts',
    'Free visit',
    'Arusha',
    'Discover local artwork and craft stalls. Artwork purchases cost extra.',
  ],
  [
    'Arusha Clock Tower & craft shops',
    'Markets & culture',
    'Free visit',
    'Arusha',
    'Explore the Clock Tower area and nearby cultural craft shops. Purchases cost extra.',
  ],
  [
    'Cultural Heritage Centre',
    'Art & culture',
    'Free visit',
    'Arusha',
    'Explore cultural art and browse crafts. Purchases cost extra.',
  ],
  [
    'Meru Primary School for the Deaf',
    'Deaf community',
    'Free visit',
    'Arrange ahead',
    'Bring a gift for the school. Coordinate the visit and suitable gifts with the school in advance.',
  ],
  [
    'Themi school visit',
    'Deaf community',
    'Free visit',
    'Arrange ahead',
    'Bring a gift for the school. Coordinate the visit and suitable gifts with the school in advance.',
  ],
  [
    'Shanga',
    'Art & community',
    'Free visit',
    'Arusha',
    'Add a Shanga visit to your Arusha plans. Purchases and transport are separate.',
  ],
  [
    'Materuni waterfalls, coffee & Chemka hot springs',
    'Nature & coffee',
    'Price on request',
    'Day-trip idea',
    'Combine waterfall scenery, coffee and hot springs. Confirm the route and duration when planning.',
  ],
  [
    'Kilimanjaro day hike · Marangu route',
    'Mountain walks',
    'Price on request',
    'Day-trip idea',
    'Ask about a day hike towards Mandara Hut and the arrangements for your group.',
  ],
  [
    'Tanzanian cooking & food market',
    'Food & community',
    'Price on request',
    'Day-trip idea',
    'Add a market visit and cooking experience to your plans.',
  ],
];

export function ExploreExperiences() {
  return `<div class="local-experiences">
    <p class="eyebrow">More places to explore</p>
    <h3>Culture, community &amp; day trips</h3>
    <p class="local-experiences__intro">A selection of ideas for your journey. Free visits exclude transport, purchases and gifts. Confirm arrangements and what is included before travelling.</p>
    <div class="local-experiences__grid">${experiences
      .map(
        ([
          name,
          category,
          price,
          duration,
          description,
        ]) => `<article class="local-experience">
      <p class="eyebrow">${escapeHtml(category)}</p>
      <h4>${escapeHtml(name)}</h4>
      <p>${escapeHtml(description)}</p>
      <div class="local-experience__meta"><strong>${escapeHtml(price)}</strong><span>${escapeHtml(duration)}</span></div>
    </article>`,
      )
      .join('')}</div>
    <p class="local-experiences__intro">Have a place in mind? Include its name when you <a class="text-link" href="#enquiries">plan your journey</a>.</p>
  </div>`;
}
