import portrait from '../assets/images/about-mountain-portrait.jpg';
import kilimanjaro from '../assets/images/kilimanjaro.jpg';
import sunset from '../assets/images/savannah-sunset.jpg';
import teamPhoto from '../assets/images/team-group.jpeg';
import gallery1 from '../assets/images/safari-elephants.jpg';
import gallery2 from '../assets/images/savannah-giraffes.jpg';
import gallery3 from '../assets/images/serengeti.jpg';
import gallery4 from '../assets/images/kilimanjaro.jpg';
import { Guides } from './Guides.js';

const icon = (path, label = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
       stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="${label ? 'false' : 'true'}"
       ${label ? `aria-label="${label}"` : ''}>${path}</svg>`;

const icons = {
  arrow: icon('<path d="M4 12h15m-6-6 6 6-6 6"/>'),
  signing: icon('<path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 8h8M8 12h5"/>'),
  compass: icon(
    '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/>',
  ),
  leaf: icon(
    '<path d="M20 3C9 2 3 7 4 14c1 6 9 8 13 2 3-4 3-9 3-13Z"/><path d="m3 21 11-12"/>',
  ),
  mountain: icon('<path d="m2 20 8-16 8 16H2Zm12-8 3-5 5 13h-4M7 10l3 2 3-2"/>'),
};

const africaSvg = `
<svg class="about-page__africa" viewBox="0 0 300 340" aria-hidden="true" focusable="false">
  <path d="
    M80,10 L100,8 L130,12 L165,10 L195,18 L220,30 L235,50
    L238,75 L230,95 L240,115 L248,140 L242,165
    L230,185 L215,205 L210,228 L215,250
    L205,270 L190,290 L170,310 L148,330
    L130,318 L112,298 L100,275 L90,255
    L78,235 L68,210 L55,190 L40,170
    L30,148 L25,125 L28,100 L22,78
    L30,58 L45,40 L62,24 Z
  " fill="currentColor" opacity="0.12"/>
</svg>`;

const text = (key, fallback) => `data-i18n="${key}">${fallback}`;
const html = (key, fallback) => `data-i18n-html="${key}">${fallback}`;

const eyebrow = (key, fallback, dark = false) => `
  <p class="about-page__eyebrow${dark ? ' about-page__eyebrow--dark' : ''}">
    <span class="about-page__eyebrow-dot${dark ? ' about-page__eyebrow-dot--green' : ''}" aria-hidden="true"></span>
    <span ${text(key, fallback)}</span>
  </p>`;

const pillar = (ico, headingKey, heading, subKey, sub) => `
  <li class="about-page__pillar">
    <span class="about-page__pillar-icon">${ico}</span>
    <strong ${text(headingKey, heading)}</strong>
    <span ${text(subKey, sub)}</span>
  </li>`;

const valueCard = (num, ico, headingKey, heading, copyKey, copy) => `
  <article class="about-page__value-card">
    <div class="about-page__value-top">
      <span class="about-page__value-num">${num}</span>
      <span class="about-page__value-icon">${ico}</span>
    </div>
    <h3 ${text(headingKey, heading)}</h3>
    <p ${text(copyKey, copy)}</p>
  </article>`;

const stat = (value, suffix, labelKey, label) => `
  <div class="about-page__stat" data-ap-stat>
    <span><span class="about-page__stat-value" data-ap-count="${value}">0</span><span class="about-page__stat-suffix">${suffix}</span></span>
    <span class="about-page__stat-label" ${text(labelKey, label)}</span>
  </div>`;

export function AboutPage() {
  return `
<section class="about-page" id="about" aria-labelledby="about-page-heading" hidden>
  <div class="about-page__hero-wrap">
    <div class="about-page__hero-bg">
      <img src="${kilimanjaro}" alt="" aria-hidden="true" width="1400" height="933" loading="eager" decoding="async" />
    </div>
    <div class="about-page__hero-overlay" aria-hidden="true"></div>
    <div class="about-page__africa-wrap" aria-hidden="true">${africaSvg}</div>

    <div class="container about-page__hero-inner">
      <nav class="about-page__breadcrumb" aria-label="Breadcrumb">
        <a href="#home" ${text('aboutPage.breadcrumb.home', 'Home')}</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page" ${text('aboutPage.breadcrumb.current', 'About us')}</span>
      </nav>

      <div class="about-page__hero-content">
        ${eyebrow('aboutPage.hero.eyebrow', 'Meet Deaf Safaris')}
        <h2 id="about-page-heading" tabindex="-1" ${html(
          'aboutPage.hero.heading',
          'A shared language.<br /><em>A world of adventure.</em>',
        )}</h2>
        <p class="about-page__lead" ${html(
          'aboutPage.hero.lead',
          'Tanzania is full of extraordinary moments.<br class="bp-hide" />We believe the joy of discovering them should be shared.',
        )}</p>
        <div class="about-page__hero-actions">
          <a class="button about-page__primary-btn" href="#enquiries">
            <span ${text('aboutPage.hero.primary', 'Shape my journey')}</span>
            ${icons.arrow}
          </a>
          <a class="about-page__ghost-link" href="#destinations">
            <span ${text('aboutPage.hero.secondary', 'Explore Tanzania')}</span>
            ${icons.arrow}
          </a>
        </div>
      </div>

      <figure class="about-page__float-card" data-i18n-aria-label="aboutPage.float.aria" aria-label="Founder at Kilimanjaro summit">
        <img src="${portrait}"
             data-i18n-alt="aboutPage.float.alt"
             alt="A smiling traveller in a blue jacket and red hat standing on snow near Kilimanjaro's glaciers."
             width="420" height="600" loading="eager" decoding="async" />
        <figcaption>
          <span class="about-page__card-label" ${text('aboutPage.float.label', 'Spirit of adventure')}</span>
          <strong ${html(
            'aboutPage.float.caption',
            "The view is better<br />when it's shared.",
          )}</strong>
        </figcaption>
      </figure>
    </div>

    <div class="about-page__scroll-hint" aria-hidden="true">
      <span></span>
    </div>
  </div>

  <div class="about-page__manifesto">
    <ul class="container about-page__pillars" role="list">
      ${pillar(
        icons.signing,
        'aboutPage.pillar.deaf',
        'Deaf &amp; hard-of-hearing travellers',
        'aboutPage.pillar.deafSub',
        'Communication first',
      )}
      ${pillar(
        icons.compass,
        'aboutPage.pillar.family',
        'Signing families &amp; friends',
        'aboutPage.pillar.familySub',
        'Everyone included',
      )}
      ${pillar(
        icons.mountain,
        'aboutPage.pillar.pace',
        'Your pace. Your possibilities.',
        'aboutPage.pillar.paceSub',
        'Journey your way',
      )}
    </ul>
  </div>

  <div class="container about-page__story-section" data-about-reveal>
    <div class="about-page__story-text">
      ${eyebrow('aboutPage.story.eyebrow', 'Our purpose', true)}
      <h2 ${html('aboutPage.story.heading', 'Connection is part<br />of the journey.')}</h2>
      <p class="about-page__story-lead" ${text(
        'aboutPage.story.lead',
        "A safari is more than the places on a map. It's a shared glance when wildlife appears, the space to ask a question, and the feeling of being part of the moment.",
      )}</p>
      <p class="about-page__story-body" ${text(
        'aboutPage.story.body',
        'Deaf Safaris brings together a deep love of Tanzania and a genuine focus on Deaf travel. From the open plains of the Serengeti to the icy trails of Kilimanjaro, we invite you to imagine a journey shaped around your interests and the way you communicate.',
      )}</p>
      <a class="about-page__text-link" href="#enquiries">
        <span ${text('aboutPage.story.cta', 'Tell us what matters to you')}</span>
        ${icons.arrow}
      </a>
    </div>

    <div class="about-page__story-visual">
      <div class="about-page__story-photo">
        <img src="${teamPhoto}"
             data-i18n-alt="aboutPage.story.alt"
             alt="The Deaf Safaris team holding a banner at the Mount Kilimanjaro summit sign."
             width="900" height="1200" loading="lazy" decoding="async" />
        <span class="about-page__story-badge" ${text('aboutPage.story.badge', 'Beyond words. Beyond the everyday.')}</span>
      </div>
      <div class="about-page__story-accent" aria-hidden="true">
        <img src="${sunset}" alt="" width="600" height="400" loading="lazy" decoding="async" aria-hidden="true" />
      </div>
    </div>
  </div>

  <div class="about-page__values-wrap" data-about-reveal>
    <div class="container">
      <div class="about-page__values-head">
        <div>
          ${eyebrow('aboutPage.values.eyebrow', 'The way we think about travel', true)}
          <h2 ${html('aboutPage.values.heading', 'Thoughtful from<br />the start.')}</h2>
        </div>
        <p class="about-page__values-intro" ${text(
          'aboutPage.values.intro',
          'Good journeys begin with understanding what makes yours personal.',
        )}</p>
      </div>
      <div class="about-page__values-grid">
        ${valueCard(
          '01',
          icons.signing,
          'aboutPage.value1.heading',
          'Communication comes first',
          'aboutPage.value1.body',
          'Share your preferred sign language, written communication needs and questions. Specific support is agreed before you travel so nothing is left to chance.',
        )}
        ${valueCard(
          '02',
          icons.compass,
          'aboutPage.value2.heading',
          'Make room for wonder',
          'aboutPage.value2.body',
          'A wildlife encounter, a mountain view or an afternoon discovering local art. Start with what excites you and the pace you enjoy - we shape the rest.',
        )}
        ${valueCard(
          '03',
          icons.leaf,
          'aboutPage.value3.heading',
          'Travel with care',
          'aboutPage.value3.body',
          'Respect wildlife, take time to understand local customs and approach every place with curiosity. The small choices are part of the journey, too.',
        )}
      </div>
    </div>
  </div>

  <div class="about-page__stats-wrap" data-about-reveal>
    <div class="container about-page__stats">
      ${stat(8, '+', 'aboutPage.stat.destinations', 'Destinations across Tanzania')}
      ${stat(4, '+', 'aboutPage.stat.languages', 'Sign languages supported')}
      ${stat(100, '%', 'aboutPage.stat.deafLed', 'Deaf-led experience')}
    </div>
  </div>

  ${Guides('about-guides')}

  <!-- ⑦ GALLERY SECTION ───────────────────────────────────────── -->
  <div class="about-page__gallery-wrap" data-about-reveal>
    <div class="container">
      <div class="about-page__gallery-head">
        ${eyebrow('aboutPage.gallery.eyebrow', 'Moments from the trail', true)}
        <h2 ${text('aboutPage.gallery.heading', 'Through our eyes')}</h2>
      </div>
      <div class="about-page__gallery-grid">
        <div class="about-page__gallery-item about-page__gallery-item--large">
          <img src="${gallery1}" alt="Elephants on safari" loading="lazy" decoding="async" />
        </div>
        <div class="about-page__gallery-item">
          <img src="${gallery2}" alt="Giraffes in the savannah" loading="lazy" decoding="async" />
        </div>
        <div class="about-page__gallery-item">
          <img src="${gallery3}" alt="Serengeti landscape" loading="lazy" decoding="async" />
        </div>
        <div class="about-page__gallery-item about-page__gallery-item--wide">
          <img src="${gallery4}" alt="Kilimanjaro mountain" loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  </div>

  <!-- ⑧ INVITATION CTA ────────────────────────────────────────── -->
  <div class="about-page__invitation" data-about-reveal>
    <div class="about-page__invitation-bg" aria-hidden="true">
      ${icons.mountain}
    </div>
    <div class="container about-page__invitation-inner">
      ${eyebrow('aboutPage.cta.eyebrow', 'Your next chapter')}
      <h2 ${html(
        'aboutPage.cta.heading',
        'Your Tanzania story<br /><em>starts with you.</em>',
      )}</h2>
      <p ${text(
        'aboutPage.cta.body',
        'Bring your ideas, your questions and your sense of adventure.',
      )}</p>
      <a class="button about-page__primary-btn about-page__invite-btn" href="#enquiries">
        <span ${text('aboutPage.cta.button', 'Start my safari brief')}</span>
        ${icons.arrow}
      </a>
    </div>
  </div>
</section>`;
}

export function initAboutPage(root = document.querySelector('#about')) {
  if (!root) return () => {};
  const disposers = [];

  if (typeof IntersectionObserver !== 'undefined') {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08 },
    );
    root
      .querySelectorAll('[data-about-reveal]')
      .forEach((element) => revealObserver.observe(element));
    disposers.push(() => revealObserver.disconnect());
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCount(element, target, duration = 1400) {
    if (reducedMotion) {
      element.textContent = target;
      return;
    }
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (typeof IntersectionObserver !== 'undefined') {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const count = entry.target.querySelector('[data-ap-count]');
          if (count) animateCount(count, Number(count.dataset.apCount));
          statObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 },
    );
    root
      .querySelectorAll('[data-ap-stat]')
      .forEach((element) => statObserver.observe(element));
    disposers.push(() => statObserver.disconnect());
  }

  return () => disposers.forEach((dispose) => dispose());
}
