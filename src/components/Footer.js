import logoUrl from '../assets/images/deaf-safaris-logo-transparent.png';
import { PawTrail } from './PawTrail.js';

export function Footer() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__paw" aria-hidden="true">${PawTrail()}</div>
        <div class="site-footer__grid">
          <div class="site-footer__brand">
            <a class="reference-footer-brand" href="#home" aria-label="Deaf Safaris home"><img src="${logoUrl}" alt="Deaf Safaris" class="site-footer__logo" width="1774" height="887" loading="lazy" /></a>
            <p>Explore Tanzania through wildlife, mountain journeys and shared experiences. Your next adventure, beyond words.</p>
          </div>
          <nav aria-label="Explore the website">
            <h2>Quick Navigation</h2>
            <a href="#traveller-destinations">All Destinations</a>
            <a href="#guides">About Our Guides</a>
            <a href="#enquiries">Custom Itineraries</a>
            <a href="#planning">Planning Your Journey</a>
          </nav>
          <nav aria-label="Planning resources">
            <h2>Expeditions</h2>
            <a href="#hero-planner" data-trip-destination="Serengeti">Serengeti &amp; Ngorongoro</a>
            <a href="#hero-planner" data-trip-destination="Kilimanjaro">Kilimanjaro Hiking</a>
            <a href="#places">Places</a>
            <a href="#traveller-destinations">Cultural Experiences</a>
          </nav>
          <div class="site-footer__status">
            <h2>Stay Connected</h2>
            <p>Request travel inspiration and updates from our team.</p>
            <form class="site-footer__subscribe" data-footer-updates>
              <label class="sr-only" for="footer-email">Your email address</label>
              <input id="footer-email" name="email" type="email" autocomplete="email" placeholder="Your email address" required />
              <button class="button" type="submit">Join</button>
            </form>
            <small>Opens an email draft for you to send.</small>
          </div>
        </div>
        <div class="site-footer__bottom">
          <p>&copy; ${new Date().getFullYear()} Deaf Safaris Tanzania. Website preview.</p>
        </div>

      </div>
    </footer>
  `;
}

export function initFooter() {
  const form = document.querySelector('[data-footer-updates]');
  if (!form) return () => {};
  const onSubmit = (event) => {
    event.preventDefault();
    const email = new FormData(form).get('email');
    const body = encodeURIComponent(
      `Please send me Deaf Safaris travel updates at ${email}.`,
    );
    window.location.href = `mailto:info@deafsafaris.co.tz?subject=Travel%20updates&body=${body}`;
  };
  form.addEventListener('submit', onSubmit);
  return () => form.removeEventListener('submit', onSubmit);
}
