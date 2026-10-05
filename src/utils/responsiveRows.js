const selectors = [
  '.reference-trip-grid',
  '.reference-featured__grid',
  '.about-page__guides-grid:not([data-team-stack])',
  '.about-page__values-grid',
  '.about-page__pillars',
  '.about-page__gallery-grid',
  '.planning__destinations',
  '.reviews__list',
  '.local-experiences__grid',
  '.tour-gallery__slide',
];

export function scrollResponsiveRow(event, row, reducedMotion = false) {
  if (
    event.target !== row ||
    !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
  )
    return;
  event.preventDefault();
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? row.scrollWidth
        : row.scrollLeft +
          row.clientWidth * 0.84 * (event.key === 'ArrowRight' ? 1 : -1);
  row.scrollTo({ left: next, behavior: reducedMotion ? 'instant' : 'smooth' });
}

// Native overflow handles touch; a focusable, named region also supports keyboards.
export function initResponsiveRows(root = document, clock = window) {
  const mobile = clock.matchMedia('(max-width: 47.999rem)');
  const reduced = clock.matchMedia('(prefers-reduced-motion: reduce)');
  const rows = [...root.querySelectorAll(selectors.join(','))];
  const originals = rows.map((row) =>
    ['tabindex', 'role', 'aria-label'].map((name) => [name, row.getAttribute(name)]),
  );
  const restore = (row, index) =>
    originals[index].forEach(([name, value]) => {
      if (value === null) row.removeAttribute(name);
      else row.setAttribute(name, value);
    });
  const sync = () =>
    rows.forEach((row, index) => {
      if (!mobile.matches) {
        restore(row, index);
        return;
      }
      row.setAttribute('tabindex', '0');
      if (!row.getAttribute('role')) row.setAttribute('role', 'region');
      if (!row.getAttribute('aria-label')) {
        const heading = row.closest('section')?.querySelector('h2');
        row.setAttribute(
          'aria-label',
          `${heading?.textContent || 'Cards'} — scroll to explore`,
        );
      }
    });
  const onKey = (event) => {
    if (mobile.matches)
      scrollResponsiveRow(event, event.currentTarget, reduced.matches);
  };
  rows.forEach((row) => row.addEventListener('keydown', onKey));
  mobile.addEventListener('change', sync);
  sync();
  return () => {
    mobile.removeEventListener('change', sync);
    rows.forEach((row, index) => {
      row.removeEventListener('keydown', onKey);
      restore(row, index);
    });
  };
}
