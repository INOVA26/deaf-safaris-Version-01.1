import { currencyReference, initCurrencySelector } from '../utils/currencyPrice.js';
import { initDropdownSearch } from '../utils/dropdownSearch.js';
import { applyLanguage } from '../utils/i18n.js';

const languages = [
  ['en-US', '🇺🇸', 'English', 'United States'],
  ['de', '🇩🇪', 'Deutsch', 'Germany', 'German'],
  ['pl', '🇵🇱', 'Polski', 'Poland', 'Polish'],
  ['ko', '🇰🇷', '한국어', 'South Korea', 'Korean'],
  ['nl', '🇳🇱', 'Nederlands', 'Netherlands', 'Dutch'],
];
const currencies = [
  ['USD', '🇺🇸', 'USD', 'US dollar'],
  ['EUR', '🇪🇺', 'EUR', 'Euro'],
  ['PLN', '🇵🇱', 'PLN', 'Polish złoty'],
  ['KRW', '🇰🇷', 'KRW', 'South Korean won'],
];
function flagMarkup(value, symbol) {
  return symbol
    ? `<span class="utility-bar__flag utility-bar__flag--${value}" aria-hidden="true"></span>`
    : `<span class="utility-bar__flag utility-bar__flag--remote" style="background-image: url('https://flagcdn.com/w40/${value.toLowerCase()}.png')" aria-hidden="true"></span>`;
}

function preferenceMenu(kind, title, choices, note) {
  return `
    <button class="utility-bar__picker" type="button" popovertarget="utility-${kind}" aria-haspopup="dialog" aria-expanded="false" aria-label="${title}: ${choices[0][2]}">
      <span data-preference-label="${kind}">${flagMarkup(choices[0][0], choices[0][1])} ${choices[0][2]}</span>
      <span class="utility-bar__chevron" aria-hidden="true"></span>
    </button>
    <div class="utility-bar__popover utility-bar__menu utility-bar__menu--${kind}" id="utility-${kind}" popover role="dialog" aria-labelledby="utility-${kind}-heading" aria-describedby="utility-${kind}-note">
      <div class="utility-bar__menu-heading">
        <h2 id="utility-${kind}-heading">${title}</h2>
        <button type="button" class="utility-bar__close" popovertarget="utility-${kind}" popovertargetaction="hide" aria-label="Close ${kind} options">×</button>
      </div>
      <div class="utility-bar__search">
        <label class="sr-only" for="utility-${kind}-search">Search ${kind === 'language' ? 'language or country' : 'currency'}</label>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>
        <input id="utility-${kind}-search" type="search" placeholder="Search ${kind === 'language' ? 'language or country' : 'currency'}..." autocomplete="off" spellcheck="false" data-dropdown-search aria-controls="utility-${kind}-choices" />
      </div>
      <fieldset class="utility-bar__choices">
        <legend class="sr-only">${title}</legend>
        <div class="utility-bar__options" id="utility-${kind}-choices">
        ${choices
          .map(
            ([value, symbol, name, country, alias = ''], index) => `
          <div class="utility-bar__choice" data-search-text="${value} ${name} ${country} ${alias}">
            <input id="utility-${kind}-${value}" type="radio" name="utility-${kind}" value="${value}" ${index === 0 ? 'checked' : ''} />
            <label for="utility-${kind}-${value}">
              ${flagMarkup(value, symbol)}
              <span class="utility-bar__option-text"><strong>${name}</strong><small>${country}</small></span>
              <span class="utility-bar__check" aria-hidden="true">✓</span>
            </label>
          </div>`,
          )
          .join('')}
        </div>
      </fieldset>
      <p class="utility-bar__empty" data-dropdown-empty role="status" hidden>No matches. Try another search.</p>
      <p class="utility-bar__menu-note" id="utility-${kind}-note">${note}</p>
    </div>`;
}

export function UtilityBar() {
  return `
    <div class="utility-bar" aria-label="Language and contact information">
      <div class="utility-bar__inner">
        <div class="utility-bar__preferences">
          ${preferenceMenu('language', 'Language preference', languages, 'English is currently available. Other website translations are coming soon.')}
          ${preferenceMenu('currency', 'Display currency', currencies, `Updates the card price using ECB reference rates from ${currencyReference.label}. Converted prices are approximate.`)}
        </div>
        <div class="utility-bar__contacts">
          <a href="tel:+255693442933">+255 693 442 933</a>
          <a href="mailto:Josephernesti82@gmail.com">Josephernesti82@gmail.com</a>
        </div>
        <div class="utility-bar__region">
          <span>Arusha, Tanzania</span>
          <button class="utility-bar__social" type="button" popovertarget="social-contact-info">Social media <span class="utility-bar__chevron" aria-hidden="true"></span></button>
        </div>
      </div>
      <div class="utility-bar__popover" id="social-contact-info" popover aria-labelledby="social-contact-heading">
        <h2 id="social-contact-heading">Follow Deaf Safaris</h2>
        <p>Our social-media links are coming soon.</p>
        <button class="button button--quiet" type="button" popovertarget="social-contact-info" popovertargetaction="hide">Close</button>
      </div>
    </div>
  `;
}

export function initUtilityBar(root = document.querySelector('.utility-bar')) {
  const disposeCurrency = initCurrencySelector(root);
  const searchDisposers = [];
  const events = new AbortController();
  const listen = (target, type, handler) =>
    target.addEventListener(type, handler, { signal: events.signal });
  for (const [kind, choices] of [
    ['language', languages],
    ['currency', currencies],
  ]) {
    const menu = root.querySelector(`#utility-${kind}`);
    const trigger = root.querySelector(
      `.utility-bar__picker[popovertarget="utility-${kind}"]`,
    );
    const label = trigger.querySelector('[data-preference-label]');
    const title = menu.querySelector('h2').textContent;
    const search = initDropdownSearch(menu);
    searchDisposers.push(search.dispose);
    listen(menu, 'toggle', () => {
      const open = menu.matches(':popover-open');
      trigger.setAttribute('aria-expanded', String(open));
      if (!open) return;
      const rect = trigger.getBoundingClientRect();
      menu.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8))}px`;
      menu.style.top = `${rect.bottom + 8}px`;
      menu.style.maxHeight = `${Math.max(0, window.innerHeight - rect.bottom - 24)}px`;
      search.reset();
      menu.querySelector('[data-dropdown-search]').focus({ preventScroll: true });
    });
    listen(menu, 'change', (event) => {
      if (kind === 'currency' || event.target.name !== `utility-${kind}`) return;
      const choice = choices.find(([value]) => value === event.target.value);
      if (!choice) return;
      label.textContent = `${choice[1]} ${choice[2]}`;
      label.innerHTML = `${flagMarkup(choice[0], choice[1])} ${choice[2]}`;
      trigger.setAttribute('aria-label', `${title}: ${choice[2]}`);
      if (kind === 'language') {
        applyLanguage(choice[0]);
        try {
          window.localStorage.setItem('deaf-safaris-language', choice[0]);
        } catch {
          // Translation still applies when browser storage is unavailable.
        }
      }
    });
  }
  try {
    applyLanguage(window.localStorage.getItem('deaf-safaris-language') || 'en-US');
  } catch {
    applyLanguage('en-US');
  }
  listen(window, 'resize', () => {
    root.querySelectorAll('[popover]').forEach((menu) => {
      if (menu.matches(':popover-open')) menu.hidePopover();
    });
  });
  return () => {
    events.abort();
    disposeCurrency();
    searchDisposers.forEach((dispose) => dispose());
  };
}
