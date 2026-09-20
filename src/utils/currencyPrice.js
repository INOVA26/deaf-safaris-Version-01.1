// Informational reference snapshot, quoted per EUR. Update all rates together.
// Source: https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html
export const currencyReference = {
  date: '2026-09-11',
  label: '11 Sep 2026',
  rates: { EUR: 1, USD: 1.1592, PLN: 4.325, KRW: 1556.56 },
};
const symbols = { USD: '$', EUR: '€', PLN: 'zł', KRW: '₩' };
const storageKey = 'deaf-safaris-display-currency';
const supported = (currency) => Object.hasOwn(symbols, currency);

export function priceFromUsd(amountUsd, currency) {
  if (!supported(currency) || !Number.isFinite(amountUsd) || amountUsd < 0) {
    throw new RangeError('A valid USD amount and supported currency are required.');
  }
  const amount =
    (amountUsd * currencyReference.rates[currency]) / currencyReference.rates.USD;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits:
      currency === 'USD' && Number.isInteger(amountUsd) ? 0 : undefined,
  }).format(amount);
  return {
    formatted,
    note:
      currency === 'USD'
        ? 'Draft price · Price to be confirmed'
        : `Approximate · ECB ${currencyReference.label} · Price to be confirmed`,
  };
}

export function initCurrencySelector(root, page = root.ownerDocument) {
  const menu = root.querySelector('#utility-currency');
  const trigger = root.querySelector(
    '.utility-bar__picker[popovertarget="utility-currency"]',
  );
  const label = trigger.querySelector('[data-preference-label]');
  const options = [...menu.querySelectorAll('input[name="utility-currency"]')];
  const prices = [...page.querySelectorAll('[data-price-usd]')];
  let storage;
  let initial = 'USD';
  try {
    storage = page.defaultView.localStorage;
    const saved = storage.getItem(storageKey);
    if (supported(saved)) initial = saved;
  } catch {
    // Selection still works when browser storage is unavailable.
  }

  function apply(currency) {
    if (!supported(currency)) return;
    for (const price of prices) {
      const { formatted, note } = priceFromUsd(
        Number(price.dataset.priceUsd),
        currency,
      );
      price.querySelector('[data-price-amount]').textContent = formatted;
      price.querySelector('[data-price-currency]').textContent =
        `/ person · ${currency}`;
      price.querySelector('[data-price-note]').textContent = note;
    }
    label.textContent = `${symbols[currency]} ${currency}`;
    label.innerHTML = `<span class="utility-bar__flag utility-bar__flag--${currency}" aria-hidden="true"></span> ${currency}`;
    trigger.setAttribute('aria-label', `Display currency: ${currency}`);
    options.forEach((option) => {
      option.checked = option.value === currency;
    });
  }
  function change(event) {
    const currency = event.target.value;
    if (event.target.name !== 'utility-currency' || !supported(currency)) return;
    apply(currency);
    try {
      storage?.setItem(storageKey, currency);
    } catch {
      // A blocked storage write must not undo the visible selection.
    }
  }
  apply(initial);
  menu.addEventListener('change', change);
  return () => menu.removeEventListener('change', change);
}
