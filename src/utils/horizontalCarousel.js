export function initHorizontalCarousel(root, { clock = window } = {}) {
  const track = root.querySelector('[data-carousel-track]');
  const previous = root.querySelector('[data-carousel-previous]');
  const next = root.querySelector('[data-carousel-next]');
  const position = root.querySelector('[data-carousel-position]');
  const disposers = [];
  const listen = (target, type, handler) => {
    target.addEventListener(type, handler);
    disposers.push(() => target.removeEventListener(type, handler));
  };
  const maximum = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const refresh = () => {
    const max = maximum();
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
    const pages = track.clientWidth ? Math.ceil(max / track.clientWidth) + 1 : 1;
    const current =
      max && next.disabled
        ? pages
        : Math.min(pages, Math.round(track.scrollLeft / (track.clientWidth || 1)) + 1);
    if (position)
      position.textContent = `${String(current).padStart(2, '0')} / ${String(pages).padStart(2, '0')}`;
  };
  const scrollTo = (left) =>
    track.scrollTo({
      left: Math.max(0, Math.min(maximum(), left)),
      behavior: clock.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  listen(previous, 'click', () => scrollTo(track.scrollLeft - track.clientWidth));
  listen(next, 'click', () => scrollTo(track.scrollLeft + track.clientWidth));
  listen(track, 'scroll', refresh);
  listen(track, 'keydown', (event) => {
    if (event.target !== track) return;
    const targets = {
      ArrowLeft: track.scrollLeft - track.clientWidth,
      ArrowRight: track.scrollLeft + track.clientWidth,
      Home: 0,
      End: maximum(),
    };
    if (!Object.hasOwn(targets, event.key)) return;
    event.preventDefault();
    scrollTo(targets[event.key]);
  });
  listen(clock, 'resize', refresh);
  const observer = clock.ResizeObserver ? new clock.ResizeObserver(refresh) : null;
  observer?.observe(track);
  refresh();
  return {
    refresh,
    dispose() {
      observer?.disconnect();
      disposers.forEach((dispose) => dispose());
    },
  };
}
