import { createTypewriter } from './typewriter.js';

export const heroPhrases = [
  'Today & Tomorrow.',
  'Your Next Adventure.',
  'Shared Discovery.',
];

export function initHeroMotion(
  root,
  advanceTour,
  { clock = window, page = document } = {},
) {
  const backgrounds = [...root.querySelectorAll('[data-hero-background]')];
  const card = root.querySelector('.hero__card');
  const reducedMotion = clock.matchMedia('(prefers-reduced-motion: reduce)');
  const writer = createTypewriter(
    root.querySelector('[data-hero-typing]'),
    heroPhrases,
    clock,
  );
  const disposers = [];
  let focused = root.contains(page.activeElement);
  let hovered = card.matches(':hover');
  let visible = true;
  let backgroundIndex = 0;
  let timer;

  function listen(target, event, handler) {
    target.addEventListener(event, handler);
    disposers.push(() => target.removeEventListener(event, handler));
  }

  function sync() {
    clock.clearInterval(timer);
    const enabled =
      !reducedMotion.matches && !page.hidden && visible && !focused && !hovered;
    root.dataset.motion = enabled ? 'running' : 'paused';
    writer.setEnabled(enabled);
    if (enabled)
      timer = clock.setInterval(() => {
        backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
        backgrounds.forEach((background, index) => {
          background.classList.toggle('is-active', index === backgroundIndex);
          background.setAttribute('aria-hidden', String(index !== backgroundIndex));
        });
        advanceTour();
      }, 6500);
  }

  listen(card, 'mouseenter', () => {
    hovered = true;
    sync();
  });
  listen(card, 'mouseleave', () => {
    hovered = false;
    sync();
  });
  listen(root, 'focusin', () => {
    focused = true;
    sync();
  });
  listen(root, 'focusout', (event) => {
    focused = root.contains(event.relatedTarget);
    sync();
  });
  listen(page, 'visibilitychange', sync);
  listen(reducedMotion, 'change', sync);
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
    writer.stop();
    observer?.disconnect();
    disposers.forEach((dispose) => dispose());
  };
}
