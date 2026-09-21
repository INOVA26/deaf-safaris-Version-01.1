import portrait from '../assets/images/about-mountain-portrait.jpg';
import wildlife from '../assets/images/savannah-giraffes.jpg';
import camp from '../assets/images/deaf-safaris/kilimanjaro-lemosho.jpg';
import group from '../assets/images/team-group.jpeg';
import sunset from '../assets/images/savannah-sunset.jpg';

const highlights = [
  [
    'guides',
    wildlife,
    'Expert guides',
    'Local insight and guidance for every step of your journey.',
  ],
  [
    'stays',
    camp,
    'Thoughtfully chosen stays',
    'Lodges, camps and hotels to suit your route and comfort.',
  ],
  [
    'groups',
    group,
    'Made for your people',
    'Personal journeys for families, couples and groups.',
  ],
  [
    'value',
    sunset,
    'More meaning. Great value.',
    'Your priorities and budget at the heart of the plan.',
  ],
];

export function About() {
  return `
    <section class="about section-space" id="our-story" aria-labelledby="about-heading">
      <div class="container about__grid">
        <div class="about__intro">
          <p class="about__eyebrow" data-i18n="about.preview.eyebrow">02 / About us</p>
          <h2 id="about-heading" data-i18n-html="about.preview.heading">Deaf Safaris.<br /><em>Travel beyond words.</em></h2>
          <p class="about__lead" data-i18n="about.preview.short">Your gateway to Tanzania, with connection at the heart of every journey.</p>
          <p class="about__description" data-i18n="about.preview.copy">We believe travel is about more than reaching a destination. It is the people, places and shared moments along the way. Discover Tanzania with your interests, pace and communication preferences in mind.</p>
          <ul class="about__highlights">
            ${highlights
              .map(
                ([key, image, title, description]) => `<li>
              <img src="${image}" alt="" width="64" height="64" loading="lazy" decoding="async" />
              <div><h3 data-i18n="about.preview.${key}.title">${title}</h3><p data-i18n="about.preview.${key}.copy">${description}</p></div>
            </li>`,
              )
              .join('')}
          </ul>
          <a class="button button--primary about__link" href="#about"><span data-i18n="about.preview.link">Get to know Deaf Safaris</span> <span aria-hidden="true">&rarr;</span></a>
          <a class="text-link about__guides-link" href="#guides">See our guides <span aria-hidden="true">&rarr;</span></a>
        </div>
        <figure class="about__portrait">
          <div class="about__portrait-stage">
            <img class="about__portrait-slide" src="${portrait}" data-i18n-alt="aboutPage.float.alt" alt="Ertines smiling on the snow near Kilimanjaro's glaciers." width="581" height="839" loading="lazy" decoding="async" />
            <img class="about__portrait-slide" src="${group}" alt="The Deaf Safaris team together at the Mount Kilimanjaro summit sign." width="900" height="1200" loading="lazy" decoding="async" />
            <span class="about__portrait-label">Founder-led in Tanzania</span>
          </div>
          <figcaption><span>Ertines and the Deaf Safaris team</span><span data-i18n="about.preview.location">Kilimanjaro, Tanzania</span></figcaption>
        </figure>
      </div>
    </section>
  `;
}
