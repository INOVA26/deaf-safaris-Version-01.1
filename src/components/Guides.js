import portrait from '../assets/images/about-mountain-portrait.jpg';
import mikePortrait from '../assets/images/mike-profile.png';
import logo from '../assets/images/deaf-safaris-logo-transparent.png';
import { PawTrail } from './PawTrail.js';

const guideCard = ({
  name,
  role,
  image,
  alt,
  initials,
  detail,
  symbol,
  profileCrop,
}) => `
  <article class="about-page__guide-card">
    <div class="about-page__guide-photo${image ? '' : ' about-page__guide-photo--placeholder'}">
      ${
        profileCrop
          ? `<div class="guides__portrait-crop"><img src="${image}" alt="${alt}" width="960" height="654" loading="lazy" decoding="async" /></div>`
          : image
            ? `<img src="${image}" alt="${alt}" width="581" height="839" loading="lazy" decoding="async" />`
            : `<img class="about-page__guide-logo" src="${logo}" alt="" width="240" height="240" loading="lazy" decoding="async" />
             <span class="about-page__guide-initials" aria-hidden="true">${initials}</span>
             <span class="guides__placeholder-note">Portrait coming soon</span>`
      }
    </div>
    <div class="about-page__guide-info">
      <h3>${name}</h3>
      <p class="about-page__guide-role"><span class="material-symbols-rounded" aria-hidden="true">${symbol}</span>${role}</p>
      <p class="guides__detail">${detail}</p>
    </div>
  </article>`;

export function Guides(id = 'guides') {
  return `
    <section class="guides about-page__guides-wrap" id="${id}" aria-labelledby="${id}-heading">
      <div class="container">
        <div class="about-page__guides-head">
          ${PawTrail()}
          <p class="about-page__eyebrow about-page__eyebrow--dark">
            <span class="about-page__eyebrow-dot about-page__eyebrow-dot--green" aria-hidden="true"></span>
            <span>The people behind the journey</span>
          </p>
          <h2 id="${id}-heading">Meet our team</h2>
          <p class="about-page__guides-intro">The people behind your journey. Get to know Deaf Safaris Tanzania.</p>
        </div>
        <div class="about-page__guides-grid">
          ${guideCard({
            name: 'Ertines',
            role: 'CEO, Deaf Safaris',
            symbol: 'explore',
            detail: 'Ertines leads Deaf Safaris Tanzania.',
            image: portrait,
            alt: "Ertines smiling on the snow near Kilimanjaro's glaciers.",
          })}
          ${guideCard({
            name: 'Mike',
            role: 'Senior Safari Guide',
            image: mikePortrait,
            profileCrop: true,
            alt: 'Mike wearing a Deaf Safaris Tanzania shirt.',
            symbol: 'landscape',
            detail: 'Part of our two-person guiding team.',
          })}
          ${guideCard({
            name: 'Hyune',
            role: 'Digital & Media',
            initials: 'H',
            symbol: 'devices',
            detail:
              'Hyune supports the Deaf Safaris digital presence and creative media.',
          })}
        </div>
        <div class="guides__action"><a class="button button--primary" href="#enquiries">Plan a journey with us <span aria-hidden="true">&rarr;</span></a></div>
      </div>
    </section>`;
}
