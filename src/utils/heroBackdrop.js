import { createTypewriter } from './typewriter.js';

export function initHeroBackdrop(root, { clock = window, page = document } = {}) {
  const photos = [...root.querySelectorAll('[data-hero-photo]')];
  const toggle = root.querySelector('[data-backdrop-toggle]');
  // A static Hero needs neither a motion control nor background timers.
  const slideshow = root.dataset.heroSlideshow === 'true';
  const copies = slideshow ? [...root.querySelectorAll('[data-hero-copy]')] : [];
  if (!toggle && !slideshow) {
    root.dataset.backdropMotion = 'paused';
    return () => {};
  }
  const reduced = clock.matchMedia('(prefers-reduced-motion: reduce)');
  const typingElement = root.querySelector('[data-hero-typing]');
  const writer = typingElement
    ? createTypewriter(
        typingElement,
        ['Today & Tomorrow', 'Beyond Words', 'At Your Pace'],
        clock,
      )
    : null;
  const cleanups = [];
  let active = 0;
  let paused = false;
  let visible = true;
  let focused = root.contains(page.activeElement) && page.activeElement !== toggle;
  let timer;

  const listen = (target, event, handler) => {
    target.addEventListener(event, handler);
    cleanups.push(() => target.removeEventListener(event, handler));
  };
  const ready = (photo) => photo.complete && photo.naturalWidth > 0;

  function show(index) {
    root.dataset.heroSlideStarted = 'true';
    photos.forEach((photo, i) => {
      photo.classList.toggle('is-leaving', i === active && i !== index);
      photo.classList.toggle('is-active', i === index);
      photo.setAttribute('aria-hidden', String(i !== index));
    });
    copies.forEach((copy) => {
      const current = Number(copy.dataset.heroCopy) === index;
      copy.classList.toggle('is-active', current);
      copy.setAttribute('aria-hidden', String(!current));
    });
    active = index;
  }
  function advance() {
    for (let step = 1; step < photos.length; step++) {
      const next = (active + step) % photos.length;
      if (ready(photos[next])) {
        show(next);
        return;
      }
    }
  }
  function sync() {
    clock.clearInterval(timer);
    const running = !paused && !reduced.matches && !page.hidden && visible && !focused;
    root.dataset.backdropMotion = running ? 'running' : 'paused';
    writer?.setEnabled(running);
    if (toggle) {
      toggle.hidden = reduced.matches || photos.length < 2;
      toggle.setAttribute('aria-pressed', String(paused));
      const label = paused ? 'Play hero animation' : 'Pause hero animation';
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
      toggle.querySelector('span').textContent = paused ? 'Play' : 'Pause';
    }
    if (running && photos.length > 1) timer = clock.setInterval(advance, 8000);
  }
  if (toggle)
    listen(toggle, 'click', () => {
      paused = !paused;
      sync();
    });
  listen(root, 'focusin', (event) => {
    focused = event.target !== toggle;
    sync();
  });
  listen(root, 'focusout', (event) => {
    focused = root.contains(event.relatedTarget) && event.relatedTarget !== toggle;
    sync();
  });
  listen(root, 'keydown', (event) => {
    if (event.key === 'Escape') {
      paused = true;
      sync();
    }
  });
  listen(page, 'visibilitychange', sync);
  listen(reduced, 'change', sync);
  // Do not slide to an unfinished image; recover if the first image fails.
  photos.forEach((photo, index) =>
    listen(photo, 'load', () => {
      if (!ready(photos[active])) show(index);
    }),
  );
  const observer = clock.IntersectionObserver
    ? new clock.IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      })
    : null;
  observer?.observe(root);
  sync();
  return () => {
    writer?.stop();
    clock.clearInterval(timer);
    observer?.disconnect();
    cleanups.forEach((cleanup) => cleanup());
    root.dataset.backdropMotion = 'paused';
  };
}
