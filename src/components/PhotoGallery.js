import { galleryPhotos } from '../data/galleryPhotos.js';
import { escapeHtml } from '../utils/escapeHtml.js';

const symbol = (name) =>
  `<span class="material-symbols-rounded" aria-hidden="true">${name}</span>`;

export function PhotoGallery() {
  return `
    <section class="photo-gallery section-space" id="photo-gallery" aria-labelledby="photo-gallery-heading">
      <div class="container">
        <div class="photo-gallery__heading">
          <div><p class="eyebrow">Our photo gallery</p><h2 id="photo-gallery-heading">Tanzania, through our eyes.</h2></div>
          <p>People, places, and moments along the way.</p>
        </div>
        <div class="photo-gallery__grid">
          ${galleryPhotos
            .map(
              (photo, index) => `
            <button class="photo-gallery__tile" type="button" data-photo-index="${index}" aria-label="View photograph: ${escapeHtml(photo.title)}" aria-haspopup="dialog" aria-controls="photo-viewer" title="View photograph">
              <img src="${photo.src}" alt="${escapeHtml(photo.alt)}" ${photo.width ? `width="${photo.width}" height="${photo.height}"` : ''} loading="lazy" decoding="async" />
              <span class="photo-gallery__caption"><span><strong>${escapeHtml(photo.title)}</strong><span>${escapeHtml(photo.location)}</span></span>${symbol('open_in_full')}</span>
            </button>`,
            )
            .join('')}
        </div>
      </div>
      <dialog class="photo-viewer" id="photo-viewer" aria-labelledby="photo-viewer-title">
        <div class="photo-viewer__toolbar">
          <p id="photo-viewer-title">Deaf Safaris photo gallery</p>
          <button class="photo-viewer__control" data-photo-close type="button" aria-label="Close photograph" title="Close photograph" autofocus>${symbol('close')}</button>
        </div>
        <div class="photo-viewer__image-wrap"><img data-photo-image alt="" /></div>
        <div class="photo-viewer__footer">
          <p data-photo-caption role="status" aria-live="polite" aria-atomic="true"></p>
          <div class="photo-viewer__navigation">
            <button class="photo-viewer__control" data-photo-previous type="button" aria-label="Previous photograph" title="Previous photograph">${symbol('arrow_back')}</button>
            <span data-photo-position></span>
            <button class="photo-viewer__control" data-photo-next type="button" aria-label="Next photograph" title="Next photograph">${symbol('arrow_forward')}</button>
          </div>
        </div>
      </dialog>
    </section>`;
}

export function initPhotoGallery(root = document.querySelector('#photo-gallery')) {
  if (!root) return () => {};
  const dialog = root.querySelector('dialog');
  const photo = root.querySelector('[data-photo-image]');
  const caption = root.querySelector('[data-photo-caption]');
  const position = root.querySelector('[data-photo-position]');
  const buttons = [...root.querySelectorAll('[data-photo-index]')];
  const events = new AbortController();
  let selected = 0;
  let opener;
  const listen = (target, name, handler) =>
    target.addEventListener(name, handler, { signal: events.signal });
  const show = (index) => {
    selected = (index + galleryPhotos.length) % galleryPhotos.length;
    const item = galleryPhotos[selected];
    photo.src = item.src;
    photo.alt = item.alt;
    caption.textContent = `${item.title} / ${item.location}`;
    position.textContent = `${selected + 1} / ${galleryPhotos.length}`;
  };
  const close = () => {
    if (dialog.open) dialog.close();
  };
  buttons.forEach((button) => {
    listen(button, 'click', () => {
      opener = button;
      show(Number(button.dataset.photoIndex));
      dialog.showModal();
      document.body.classList.add('photo-viewer-open');
    });
  });
  listen(root.querySelector('[data-photo-close]'), 'click', close);
  listen(root.querySelector('[data-photo-previous]'), 'click', () =>
    show(selected - 1),
  );
  listen(root.querySelector('[data-photo-next]'), 'click', () => show(selected + 1));
  listen(dialog, 'keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(selected + (event.key === 'ArrowRight' ? 1 : -1));
  });
  listen(dialog, 'click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      close();
  });
  listen(dialog, 'close', () => {
    document.body.classList.remove('photo-viewer-open');
    if (!root.hidden) opener?.focus({ preventScroll: true });
  });
  listen(window, 'hashchange', close);
  return () => {
    close();
    document.body.classList.remove('photo-viewer-open');
    events.abort();
  };
}
