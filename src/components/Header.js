import { Brand } from './Brand.js';
import { UtilityBar, initUtilityBar } from './UtilityBar.js';

export function Header() {
  return `
    <header class="site-header">
      ${UtilityBar()}
      <div class="site-header__inner">
        ${Brand()}
        <button class="menu-toggle button button--quiet" type="button" aria-expanded="false" aria-controls="primary-navigation" hidden>
          <span class="menu-toggle__label">Menu</span>
          <span class="menu-toggle__icon" aria-hidden="true"></span>
        </button>
        <nav id="primary-navigation" class="site-navigation" aria-label="Primary navigation">
          <ul class="site-nav">
            <li><a href="#home" data-i18n="nav.home">Home</a></li>
            <li><a href="#destinations" data-i18n="nav.nationalPark">National Park</a></li>
            <li><a href="#hero-planner" data-nav-destination="Kilimanjaro" data-i18n="nav.kilimanjaro">Kilimanjaro</a></li>
            <li><a href="#about" data-i18n="nav.about">About us</a></li>
            <li><a href="#photo-gallery" data-i18n="nav.gallery">Gallery</a></li>
            <li class="site-nav__mobile-action"><a class="button site-header__plan" href="#enquiries" data-i18n="nav.plan">Plan your Safari</a></li>
          </ul>
        </nav>
        <a class="button site-header__plan site-header__desktop-action" href="#enquiries" data-i18n="nav.plan">Plan your Safari</a>
      </div>
    </header>
  `;
}

export function initHeader() {
  const header = document.querySelector('.site-header');
  const toggle = header.querySelector('.menu-toggle');
  const navigation = header.querySelector('.site-navigation');
  const label = toggle.querySelector('.menu-toggle__label');
  const links = [...navigation.querySelectorAll('a:not(.button)')];
  const desktopAction = header.querySelector('.site-header__desktop-action');
  const utilityBar = header.querySelector('.utility-bar');
  const utilityPopovers = [...utilityBar.querySelectorAll('[popover]')];
  const disposeUtilityBar = initUtilityBar(utilityBar);
  const desktop = window.matchMedia('(min-width: 56rem)');
  const events = new AbortController();
  const listen = (target, type, handler, options = {}) => {
    target.addEventListener(type, handler, { ...options, signal: events.signal });
  };

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close' : 'Menu';
    navigation.hidden = !desktop.matches && !open;
  }

  function syncLayout() {
    const focusInNavigation = navigation.contains(document.activeElement);
    const focusOnToggle = document.activeElement === toggle;
    const focusOnDesktopAction = document.activeElement === desktopAction;
    toggle.hidden = desktop.matches;
    setOpen(false);
    if (!desktop.matches && (focusInNavigation || focusOnDesktopAction)) toggle.focus();
    if (desktop.matches && focusOnToggle) navigation.querySelector('a').focus();
    if (desktop.matches && document.activeElement.closest('.site-nav__mobile-action'))
      desktopAction.focus();
  }

  listen(toggle, 'click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  listen(header, 'click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.dataset.navDestination) {
      document.querySelector('#hero-destination').value = link.dataset.navDestination;
      document
        .querySelector('#hero-destination')
        .dispatchEvent(new Event('change', { bubbles: true }));
    }
    setOpen(false);
    const target = link.hash ? document.querySelector(link.hash) : null;
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  listen(document, 'keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  listen(document, 'click', (event) => {
    if (
      !header.contains(event.target) &&
      toggle.getAttribute('aria-expanded') === 'true'
    ) {
      const focusInNavigation = navigation.contains(document.activeElement);
      setOpen(false);
      if (focusInNavigation) toggle.focus();
    }
  });
  listen(desktop, 'change', syncLayout);
  const syncCurrentLink = () => {
    const hash = window.location.hash;
    const current = !hash || hash === '#main-content' ? '#home' : hash;
    links.forEach((link) => {
      if (link.hash === current)
        link.setAttribute('aria-current', current === '#about' ? 'page' : 'location');
      else link.removeAttribute('aria-current');
    });
  };
  listen(window, 'hashchange', syncCurrentLink);
  const syncScroll = () => {
    const scrolled = window.scrollY > 32;
    header.classList.toggle('is-scrolled', scrolled);
    if (scrolled && !utilityBar.hidden) {
      utilityPopovers.forEach((popover) => {
        if (popover.matches(':popover-open')) popover.hidePopover();
      });
      if (utilityBar.contains(document.activeElement)) {
        header.querySelector('.brand').focus({ preventScroll: true });
      }
    }
    utilityBar.hidden = scrolled;
  };
  listen(window, 'scroll', syncScroll, { passive: true });
  syncScroll();
  syncLayout();
  syncCurrentLink();
  return () => {
    events.abort();
    disposeUtilityBar();
  };
}
