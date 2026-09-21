import portrait from '../assets/images/about-mountain-portrait.jpg';
import logo from '../assets/images/deaf-safaris-logo-transparent.png';

const guideCard = ({ name, role, image, alt, initials }) => `
  <article class="about-page__guide-card">
    <div class="about-page__guide-photo${image ? '' : ' about-page__guide-photo--placeholder'}">
      ${
        image
          ? `<img src="${image}" alt="${alt}" width="581" height="839" loading="lazy" decoding="async" />`
          : `<img class="about-page__guide-logo" src="${logo}" alt="" width="240" height="240" loading="lazy" decoding="async" />
             <span class="about-page__guide-initials" aria-hidden="true">${initials}</span>
             <span class="guides__placeholder-note">Portrait coming soon</span>`
      }
    </div>
    <div class="about-page__guide-info">
      <h3>${name}</h3>
      <p class="about-page__guide-role">${role}</p>
    </div>
  </article>`;

export function Guides(id = 'guides') {
  return `
    <section class="guides about-page__guides-wrap" id="${id}" aria-labelledby="${id}-heading">
      <div class="container">
        <div class="about-page__guides-head">
          <p class="about-page__eyebrow about-page__eyebrow--dark">
            <span class="about-page__eyebrow-dot about-page__eyebrow-dot--green" aria-hidden="true"></span>
            <span>Our guides</span>
          </p>
          <h2 id="${id}-heading">Meet our guides</h2>
          <p class="about-page__guides-intro">Ertines and Mike. The people behind Deaf Safaris.</p>
        </div>
        <div class="about-page__guides-grid">
          ${guideCard({
            name: 'Ertines',
            role: 'CEO, Deaf Safaris',
            image: portrait,
            alt: "Ertines smiling on the snow near Kilimanjaro's glaciers.",
          })}
          ${guideCard({
            name: 'Mike',
            role: 'Safari Guide',
            initials: 'M',
          })}
        </div>
        <div class="guides__action"><a class="button button--primary" href="#enquiries">Plan a journey with us <span aria-hidden="true">&rarr;</span></a></div>
      </div>
    </section>`;
}
