// Animate on entry without hiding content while observers or scripts load.
export function initScrollReveal(root = document, clock = window) {
  const motion = clock.matchMedia('(prefers-reduced-motion: reduce)');
  if (!clock.IntersectionObserver) return () => {};
  const running = new Map();
  const order = new Map();
  const observer = new clock.IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        if (motion.matches || target.contains(root.activeElement)) continue;
        const style = clock.getComputedStyle(target);
        const distance =
          style.getPropertyValue('--motion-reveal-distance').trim() || '24px';
        const animation = target.animate?.(
          [
            { opacity: 0, translate: `0 ${distance}` },
            { opacity: 1, translate: '0 0' },
          ],
          {
            duration:
              parseFloat(style.getPropertyValue('--motion-reveal-duration')) || 650,
            delay:
              (order.get(target) || 0) *
              (parseFloat(style.getPropertyValue('--motion-reveal-stagger')) || 70),
            fill: 'backwards',
            easing:
              style.getPropertyValue('--motion-reveal-easing').trim() || 'ease-out',
          },
        );
        if (animation) {
          running.set(target, animation);
          animation.onfinish = () => running.delete(target);
        }
      }
    },
    { threshold: 0, rootMargin: '0px 0px -48px 0px' },
  );
  for (const section of root.querySelectorAll(
    '#main-content > section:not(.hero), .site-footer',
  )) {
    const parts = section.querySelectorAll?.(
      '.reference-trips__heading, .reference-trip, .reference-welcome__photos, .reference-welcome__features > article',
    );
    if (parts?.length) {
      [...parts].forEach((part, index) => {
        order.set(part, index % 3);
        observer.observe(part);
      });
    } else {
      observer.observe(section);
    }
  }
  const stop = () => {
    for (const animation of running.values()) animation.cancel();
    running.clear();
  };
  const onFocus = (event) => {
    for (const [target, animation] of running) {
      if (target.contains(event.target)) {
        animation.cancel();
        running.delete(target);
      }
    }
  };
  motion.addEventListener('change', stop);
  root.addEventListener('focusin', onFocus);
  return () => {
    observer.disconnect();
    order.clear();
    stop();
    motion.removeEventListener('change', stop);
    root.removeEventListener('focusin', onFocus);
  };
}
