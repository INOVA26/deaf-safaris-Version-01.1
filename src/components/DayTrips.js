import { destinations } from '../data/destinations.js';
import { TourCard } from './TourCard.js';

export function DayTrips() {
  return `<div class="reference-trip-grid">${['arusha', 'tarangire', 'chemka']
    .map((id) =>
      TourCard(
        destinations.find((place) => place.id === id),
        { dayTrip: true },
      ),
    )
    .join('')}</div>`;
}
