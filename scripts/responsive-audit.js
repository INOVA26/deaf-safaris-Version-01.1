// Run from the local site's browser console:
// const { auditResponsive } = await import('/scripts/responsive-audit.js');
// const report = await auditResponsive(); console.log(report);
// No browser is launched and no results leave this device.
const widths = [320, 360, 375, 390, 412, 768, 1024, 1280, 1536];
const pages = [
  '#home',
  '#about',
  '#traveller-destinations',
  '#planning',
  '#photo-gallery',
  '#reviews',
  '#enquiries',
  '#safaris',
];
const delay = (ms) => new Promise((resolve) => globalThis.setTimeout(resolve, ms));

// Only operate on this disposable frame, never on the visitor's open page.
async function inspectExpandedStates(win, record) {
  const doc = win.document;
  if (win.location.hash === '#home') {
    const places = doc.querySelector('#places [data-tour-toggle]');
    if (places?.getAttribute('aria-expanded') === 'false') {
      places.click();
      await delay(500);
      record('Places expanded');
    }
    for (const dot of doc.querySelectorAll('[data-gallery-dot]')) {
      dot.click();
      await delay(500);
      record(`Gallery slide ${Number(dot.dataset.galleryDot) + 1}`);
    }
  }
  const rows = [...doc.querySelectorAll('[role="region"][tabindex="0"]')].filter(
    (row) =>
      row.getBoundingClientRect().width > 0 &&
      !row.closest('[hidden], [inert]') &&
      row.scrollWidth > row.clientWidth + 1,
  );
  for (const row of rows) {
    row.scrollTo({ left: row.scrollWidth, behavior: 'instant' });
  }
  if (rows.length) {
    await delay(150);
    record('Swipe rows at final card');
    rows.forEach((row) => row.scrollTo({ left: 0, behavior: 'instant' }));
  }
  win.scrollTo({ top: doc.documentElement.scrollHeight, behavior: 'instant' });
  await delay(250);
  record('Page bottom / compact header');
  win.scrollTo({ top: 0, behavior: 'instant' });
  await delay(250);
}

function inspect(win) {
  const doc = win.document;
  const width = doc.documentElement.clientWidth;
  const visible = (element) => {
    const rect = element.getBoundingClientRect();
    const style = win.getComputedStyle(element);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      !element.closest('[hidden], [inert], .sr-only')
    );
  };
  const name = (element) =>
    element.id
      ? `#${element.id}`
      : `${element.tagName.toLowerCase()}.${[...element.classList].join('.')}`;
  const overflow = [...doc.body.querySelectorAll('*')]
    .filter((element) => {
      if (!visible(element)) return false;
      const rect = element.getBoundingClientRect();
      if (rect.left >= -1 && rect.right <= width + 1) return false;
      for (
        let parent = element.parentElement;
        parent && parent !== doc.body;
        parent = parent.parentElement
      ) {
        const clip = win.getComputedStyle(parent).overflowX;
        if (['auto', 'scroll', 'hidden', 'clip'].includes(clip)) return false;
      }
      return true;
    })
    .map(name);
  const smallText = [...doc.querySelectorAll('p, blockquote, label, small, figcaption')]
    .filter(
      (element) =>
        visible(element) &&
        !element.closest('.sr-only') &&
        parseFloat(win.getComputedStyle(element).fontSize) < 12,
    )
    .map(name);
  const smallTargets = [...doc.querySelectorAll('button, .button, .site-nav a')]
    .filter((element) => {
      if (!visible(element)) return false;
      const rect = element.getBoundingClientRect();
      return rect.width < 43.5 || rect.height < 43.5;
    })
    .map(name);
  return {
    viewport: width,
    pageWidth: doc.documentElement.scrollWidth,
    horizontalOverflow: doc.documentElement.scrollWidth > width + 1,
    overflowCandidates: overflow,
    captionsUnder12px: smallText,
    targetsUnder44px: smallTargets,
    menuClipped: (() => {
      const menu = doc.querySelector('.menu-toggle');
      if (!menu || !visible(menu)) return false;
      const rect = menu.getBoundingClientRect();
      return rect.left < 0 || rect.right > width;
    })(),
  };
}

export async function auditResponsive() {
  const doc = globalThis.document;
  const frame = doc.createElement('iframe');
  frame.title = 'Temporary local responsive layout audit';
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText =
    'position:fixed;left:-10000px;top:0;height:900px;border:0;opacity:0;pointer-events:none';
  const results = [];
  try {
    for (const width of widths) {
      frame.style.width = `${width}px`;
      const loaded = new Promise((resolve, reject) => {
        const timeout = globalThis.setTimeout(
          () => reject(new Error('Local audit frame did not load')),
          15000,
        );
        frame.onload = () => {
          globalThis.clearTimeout(timeout);
          resolve();
        };
      });
      frame.src = `${globalThis.location.origin}/#home`;
      if (!frame.isConnected) doc.body.append(frame);
      await loaded;
      await Promise.race([frame.contentDocument.fonts.ready, delay(5000)]);
      for (const hash of pages) {
        frame.contentWindow.location.hash = hash;
        await delay(350);
        const record = (state) =>
          results.push({
            width,
            hash,
            state,
            ...inspect(frame.contentWindow),
          });
        record('page');
        const toggle = frame.contentDocument.querySelector('.menu-toggle');
        if (toggle && !toggle.hidden) {
          toggle.click();
          await delay(250);
          results.push({
            width,
            hash,
            state: 'menu open',
            ...inspect(frame.contentWindow),
          });
          toggle.click();
          await delay(250);
        }
        await inspectExpandedStates(frame.contentWindow, record);
      }
    }
    return {
      testedAt: new Date().toISOString(),
      note: 'Browser layout checks only. Actual touch, safe areas, visual crop quality and reading order need manual review.',
      results,
    };
  } finally {
    frame.remove();
  }
}
