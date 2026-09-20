import { safariIdeas } from '../data/siteContent.js';

export function Experiences() {
  return `
    <section class="experiences section-space" id="safari-details" aria-labelledby="experiences-heading">
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">01 / Find your inspiration</p>
            <h2 id="experiences-heading">What calls you<br /><em>to the wild?</em></h2>
          </div>
          <p class="section-intro">A moment. A landscape. A feeling.<br />Start with the kind of journey you imagine.</p>
        </div>
        <div class="experience-grid" id="gallery" tabindex="-1" aria-label="Safari photo gallery">
          ${safariIdeas
            .map(
              (idea) => `
            <article class="experience-card">
              <div class="experience-card__visual experience-card__visual--${idea.theme}">
                <img src="${idea.photo.src}" alt="${idea.photo.alt}" width="${idea.photo.width}" height="${idea.photo.height}" loading="lazy" decoding="async" />
                <span aria-hidden="true">${idea.number}</span>
              </div>
              <div class="experience-card__body">
                <p class="eyebrow">${idea.category}</p>
                <h3>${idea.title}</h3>
                <p>${idea.description}</p>
                <a class="text-link" href="#enquiries">Plan around this idea <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          `,
            )
            .join('')}
        </div>
        <p class="section-note">Ideas and stock photography for inspiration, not confirmed safari packages. <a href="#photo-credits">Photo credits</a>.</p>
      </div>
    </section>
  `;
}
