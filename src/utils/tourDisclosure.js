export function initTourDisclosure(root = document, clock = window) {
  const motion = clock.matchMedia('(prefers-reduced-motion: reduce)');
  const disposers = [];
  for (const section of root.querySelectorAll('[data-tour-disclosure]')) {
    const button = section.querySelector('[data-tour-toggle]');
    const panel = section.querySelector('[data-tour-extra]');
    let expanded = button.getAttribute('aria-expanded') === 'true';
    let animation;
    const settle = () => {
      animation?.cancel();
      animation = null;
      panel.hidden = !expanded;
      panel.inert = !expanded;
      panel.style.removeProperty('overflow');
      button.setAttribute('aria-expanded', String(expanded));
      button.textContent = expanded ? 'Show Less' : 'More Details';
    };
    const finish = () => {
      settle();
      // Keep the focused bottom control reachable after a long mobile row closes.
      if (!expanded && root.activeElement === button) {
        button.scrollIntoView({
          block: 'nearest',
          behavior: motion.matches ? 'instant' : 'smooth',
        });
      }
    };
    const onClick = () => {
      const height = panel.hidden ? 0 : panel.getBoundingClientRect().height;
      animation?.cancel();
      expanded = !expanded;
      if (!expanded && panel.contains(root.activeElement)) button.focus();
      panel.inert = !expanded;
      button.setAttribute('aria-expanded', String(expanded));
      button.textContent = expanded ? 'Show Less' : 'More Details';
      if (motion.matches || !panel.animate) {
        finish();
        return;
      }
      panel.hidden = false;
      const endHeight = expanded ? panel.getBoundingClientRect().height : 0;
      panel.style.overflow = 'clip';
      const style = clock.getComputedStyle(panel);
      animation = panel.animate(
        [{ height: `${height}px` }, { height: `${endHeight}px` }],
        {
          duration:
            parseFloat(style.getPropertyValue('--motion-disclosure-duration')) || 420,
          easing: style.getPropertyValue('--motion-reveal-easing').trim() || 'ease-out',
        },
      );
      animation.onfinish = finish;
    };
    settle();
    button.addEventListener('click', onClick);
    motion.addEventListener('change', finish);
    clock.addEventListener('resize', settle);
    disposers.push(() => {
      settle();
      button.removeEventListener('click', onClick);
      motion.removeEventListener('change', finish);
      clock.removeEventListener('resize', settle);
    });
  }
  return () => disposers.forEach((dispose) => dispose());
}
