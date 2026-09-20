export function matchesDropdownSearch(text, query) {
  const normalize = (value) =>
    value.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '').replaceAll('ł', 'l');
  const normalizedText = normalize(text);
  return normalize(query)
    .trim()
    .split(/\s+/)
    .every((word) => normalizedText.includes(word));
}

export function initDropdownSearch(menu) {
  const input = menu.querySelector('[data-dropdown-search]');
  const empty = menu.querySelector('[data-dropdown-empty]');
  const rows = [...menu.querySelectorAll('[data-search-text]')];
  const options = menu.querySelector('.utility-bar__options');
  const visibleRadios = () =>
    rows
      .filter((row) => !row.hidden)
      .map((row) => row.querySelector('input[type="radio"]'));
  function filter() {
    rows.forEach((row) => {
      row.hidden = !matchesDropdownSearch(row.dataset.searchText, input.value);
    });
    const visible = visibleRadios();
    const tabbable = visible.find((radio) => radio.checked) || visible[0];
    rows.forEach((row) => {
      const radio = row.querySelector('input[type="radio"]');
      radio.tabIndex = radio === tabbable ? 0 : -1;
    });
    empty.hidden = visible.length > 0;
    options.scrollTop = 0;
  }
  function keydown(event) {
    const visible = visibleRadios();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const radio = event.key === 'ArrowDown' ? visible[0] : visible.at(-1);
      radio?.focus();
    }
    if (event.key === 'Enter' && visible.length === 1) {
      event.preventDefault();
      visible[0].click();
      visible[0].focus();
    }
    if (event.key === 'Escape' && input.value) {
      event.preventDefault();
      event.stopPropagation();
      input.value = '';
      filter();
    }
  }
  input.addEventListener('input', filter);
  input.addEventListener('keydown', keydown);
  menu.addEventListener('change', filter);
  return {
    reset() {
      input.value = '';
      filter();
    },
    dispose() {
      input.removeEventListener('input', filter);
      input.removeEventListener('keydown', keydown);
      menu.removeEventListener('change', filter);
    },
  };
}
