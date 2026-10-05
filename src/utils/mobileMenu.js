// Cancel stale transitions when a visitor taps quickly or changes viewport size.
export function createMobileMenu(panel, clock = window) {
  const reduced = clock.matchMedia('(prefers-reduced-motion: reduce)');
  let animation;
  let revision = 0;
  const show = (open, desktop = false, instant = false) => {
    const current = ++revision;
    animation?.cancel();
    animation = undefined;
    const wasHidden = panel.hidden;
    panel.inert = !desktop && !open;
    if (desktop || instant || reduced.matches || !panel.animate) {
      panel.hidden = !desktop && !open;
      return;
    }
    if (open) panel.hidden = false;
    else if (wasHidden) return;
    animation = panel.animate(
      open
        ? [
            { opacity: 0, transform: 'translateY(-8px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ]
        : [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(-8px)' },
          ],
      { duration: 180, easing: 'ease-out' },
    );
    animation.onfinish = () => {
      if (current !== revision) return;
      panel.hidden = !open;
      animation = undefined;
    };
  };
  return {
    show,
    dispose() {
      revision += 1;
      animation?.cancel();
    },
  };
}
