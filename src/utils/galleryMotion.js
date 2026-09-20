export function initGalleryMotion(
  root,
  advance,
  { clock = window, page = document } = {},
) {
  const media = clock.matchMedia('(prefers-reduced-motion: reduce)');
  const disposers = [];
  let visible = !clock.IntersectionObserver;
  let focused = root.contains(page.activeElement);
  let timer;
  const listen = (target, name, handler) => {
    target.addEventListener(name, handler);
    disposers.push(() => target.removeEventListener(name, handler));
  };
  function sync() {
    clock.clearInterval(timer);
    timer = undefined;
    const running = visible && !focused && !page.hidden && !media.matches;
    root.dataset.motion = running ? 'playing' : 'paused';
    if (running) timer = clock.setInterval(advance, 6500);
  }
  listen(root, 'focusin', () => {
    focused = true;
    sync();
  });
  listen(root, 'focusout', (event) => {
    focused = root.contains(event.relatedTarget);
    sync();
  });
  listen(page, 'visibilitychange', sync);
  listen(media, 'change', sync);
  const observer = clock.IntersectionObserver
    ? new clock.IntersectionObserver(
        (entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          if (visible) root.classList.add('is-revealed');
          sync();
        },
        { threshold: 0.15 },
      )
    : null;
  observer?.observe(root);
  sync();
  return {
    restart: sync,
    dispose() {
      clock.clearInterval(timer);
      observer?.disconnect();
      disposers.forEach((dispose) => dispose());
      root.dataset.motion = 'paused';
    },
  };
}
