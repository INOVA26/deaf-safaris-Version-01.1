// Rotate while visible and idle; pause during pointer and keyboard interaction.
export function initGalleryCarousel(
  root = document.querySelector('#gallery'),
  clock = window,
) {
  if (!root) return () => {};
  const doc = root.ownerDocument;
  const track = root.querySelector('[data-gallery-track]');
  const viewport = root.querySelector('[data-gallery-viewport]');
  const slides = [...root.querySelectorAll('[data-gallery-slide]')];
  const dots = [...root.querySelectorAll('[data-gallery-dot]')];
  const announcement = root.querySelector('[data-gallery-announcement]');
  const motion = clock.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = clock.matchMedia('(max-width: 47.999rem)');
  const removers = [];
  let selected = 0;
  let hovering = false;
  let focused = false;
  let visible = !clock.IntersectionObserver;
  let timer;
  let gesture;
  let disposed = false;
  const listen = (target, type, handler) => {
    target.addEventListener(type, handler);
    removers.push(() => target.removeEventListener(type, handler));
  };
  const stop = () => {
    clock.clearTimeout(timer);
    timer = undefined;
  };
  const schedule = () => {
    stop();
    if (
      disposed ||
      focused ||
      hovering ||
      !visible ||
      root.hidden ||
      doc.hidden ||
      motion.matches ||
      mobile.matches
    )
      return;
    timer = clock.setTimeout(() => choose(selected + 1), 5000);
  };
  const choose = (index, manual = false) => {
    selected = (index + slides.length) % slides.length;
    track.style.transform = `translateX(calc(-${selected} * (100% + var(--gallery-layout-gap))))`;
    slides.forEach((slide, i) => {
      slide.inert = i !== selected;
      slide.setAttribute('aria-hidden', String(i !== selected));
      dots[i].setAttribute('aria-pressed', String(i === selected));
    });
    if (manual) announcement.textContent = slides[selected].getAttribute('aria-label');
    schedule();
  };
  listen(root, 'click', (event) => {
    const direction = event.target.closest('[data-gallery-direction]');
    const dot = event.target.closest('[data-gallery-dot]');
    if (direction) choose(selected + Number(direction.dataset.galleryDirection), true);
    else if (dot) choose(Number(dot.dataset.galleryDot), true);
  });
  listen(root, 'keydown', (event) => {
    const dot = event.target.closest('[data-gallery-dot]');
    if (!dot || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = Number(dot.dataset.galleryDot);
    choose(
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? slides.length - 1
          : index + (event.key === 'ArrowRight' ? 1 : -1),
      true,
    );
    dots[selected].focus();
  });
  listen(root, 'pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    hovering = true;
    schedule();
  });
  listen(root, 'pointerleave', () => {
    hovering = false;
    schedule();
  });
  listen(root, 'focusin', () => {
    focused = true;
    schedule();
  });
  listen(root, 'focusout', (event) => {
    if (root.contains(event.relatedTarget)) return;
    focused = false;
    schedule();
  });
  listen(viewport, 'pointerdown', (event) => {
    if (event.pointerType !== 'touch' || event.target.closest('a, button')) return;
    const row = event.target.closest('[data-gallery-slide]');
    if (row && row.scrollWidth > row.clientWidth + 1) return;
    gesture = { x: event.clientX, y: event.clientY, id: event.pointerId };
    stop();
  });
  listen(viewport, 'pointerup', (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = undefined;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
      choose(selected + (dx < 0 ? 1 : -1), true);
    else schedule();
  });
  listen(viewport, 'pointercancel', () => {
    gesture = undefined;
    schedule();
  });
  listen(doc, 'visibilitychange', schedule);
  listen(clock, 'hashchange', () => {
    gesture = undefined;
    schedule();
  });
  listen(motion, 'change', () => {
    schedule();
  });
  listen(mobile, 'change', schedule);
  const observer = clock.IntersectionObserver
    ? new clock.IntersectionObserver(
        (entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          schedule();
        },
        { threshold: 0.1 },
      )
    : null;
  observer?.observe(root);
  choose(0);
  return () => {
    disposed = true;
    stop();
    observer?.disconnect();
    removers.forEach((remove) => remove());
  };
}
