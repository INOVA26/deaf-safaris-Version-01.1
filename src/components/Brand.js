import logoUrl from '../assets/images/deaf-safaris-logo-transparent.png';

export function Brand({ lazy = false } = {}) {
  return `
    <a class="brand brand--logo" href="#main-content" aria-label="Deaf Safaris: home">
      <img class="brand__image" src="${logoUrl}" width="1774" height="887" alt="Deaf Safaris — elephant and acacia tree logo" ${lazy ? 'loading="lazy"' : ''} />
    </a>
  `;
}
