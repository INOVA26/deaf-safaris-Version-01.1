import { Brand } from './Brand.js';
import { destinationPhotoCredits } from '../data/destinationPhotos.js';
import { escapeHtml } from '../utils/escapeHtml.js';

export function Footer() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__grid">
          <div class="site-footer__brand">
            ${Brand({ lazy: true })}
            <p>Your next adventure.<br />Beyond words.</p>
          </div>
          <nav aria-label="Explore the website">
            <h2>Explore</h2>
            <a href="#destinations">Safari inspiration</a>
            <a href="#about">Our story</a>
            <a href="#guides">Meet our guides</a>
            <a href="#photo-gallery">Photo gallery</a>
            <a href="#planning">Plan your journey</a>
          </nav>
          <nav aria-label="Planning resources">
            <h2>Good to know</h2>
            <a href="#hero-planner">Plan your safari</a>
            <a href="#reviews">Write a review</a>
            <a href="#enquiries">Create a safari brief</a>
          </nav>
          <div class="site-footer__status">
            <h2>A website in the making</h2>
            <p>Confirmed safari details and contact information are coming next. This website is a design preview.</p>
          </div>
        </div>
        <div class="site-footer__bottom">
          <p>Deaf Safaris <span aria-hidden="true">/</span> Website preview</p>
          <a href="#main-content">Back to the beginning <span aria-hidden="true">↑</span></a>
        </div>
        <details class="photo-credits" id="photo-credits">
          <summary>Photography credits</summary>
          <p>Stock photography used for inspiration; these images do not represent confirmed Deaf Safaris tours.</p>
          <ul>
            <li>Acacia sunset: <a href="https://www.pexels.com/photo/sunset-in-african-savannah-landscape-30878973/">Wussol / Pexels</a>.</li>
            <li>Elephants: <a href="https://www.pexels.com/photo/elephants-on-a-safari-17212851/">Athuman Komora Garisse / Pexels</a>.</li>
            <li>Giraffes: <a href="https://www.pexels.com/photo/giraffes-on-savanna-17849766/">Mike Knibbs / Pexels</a>.</li>
          </ul>
          <p>Used under the <a href="https://www.pexels.com/license/">Pexels licence</a>. Images resized by Pexels and cropped to fit the layout.</p>
          <h3>Destination gallery photographs</h3>
          <p>Selected wildlife and mountain images, including the featured gallery: <a href="https://deafsafaris.co.tz/">Deaf Safaris</a>.</p>
          <p>Wikimedia Commons photographs, displayed with CSS cropping and zoom. Each image retains its linked licence; no photographer endorsement is implied.</p>
          <ul>${destinationPhotoCredits.map((photo) => `<li><a href="${escapeHtml(photo.source)}">${escapeHtml(photo.title)}</a> — ${escapeHtml(photo.author)} · ${photo.licenseUrl ? `<a href="${escapeHtml(photo.licenseUrl)}">${escapeHtml(photo.license)}</a>` : escapeHtml(photo.license)}.</li>`).join('')}</ul>
          <h3>Optional experience photographs</h3>
          <p>Illustrative Tanzania photographs, resized by Wikimedia Commons and cropped with CSS. They do not depict confirmed company outings. These photographs retain their original licences.</p>
          <ul>
            <li><a href="https://commons.wikimedia.org/wiki/File:Bicycling-in-rotary-tanzania.jpg">Bicycling in Tanzania</a> — Rasheedhrasheed · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.</li>
            <li><a href="https://commons.wikimedia.org/wiki/File:Local_market_at_Arusha.jpg">Local market at Arusha</a> — Eibrahim77 · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.</li>
          </ul>
        </details>
      </div>
    </footer>
  `;
}
