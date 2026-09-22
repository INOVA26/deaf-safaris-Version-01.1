export function initHeroBackdrop(root, { clock = window, page = document } = {}) {
  const photos = [...root.querySelectorAll('[data-hero-photo]')];
  const toggle = root.querySelector('[data-backdrop-toggle]');
  const reduced = clock.matchMedia('(prefers-reduced-motion: reduce)');
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
    photos.forEach((photo, i) => {
      photo.classList.toggle('is-active', i === index);
      photo.setAttribute('aria-hidden', String(i !== index));
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
    toggle.hidden = reduced.matches || photos.length < 2;
    toggle.setAttribute('aria-pressed', String(paused));
    const label = paused ? 'Play background animation' : 'Pause background animation';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    toggle.querySelector('span').textContent = paused ? 'play_arrow' : 'pause';
    if (running && photos.length > 1) timer = clock.setInterval(advance, 8000);
  }
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
  listen(page, 'visibilitychange', sync);
  listen(reduced, 'change', sync);
  // Do not crossfade to an unfinished image; recover if the first image fails.
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
    clock.clearInterval(timer);
    observer?.disconnect();
    cleanups.forEach((cleanup) => cleanup());
    root.dataset.backdropMotion = 'paused';
  };
}
