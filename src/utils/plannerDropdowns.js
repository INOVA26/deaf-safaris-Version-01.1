// Keep native selects as the form values and as a fallback without Popover support.
export function initPlannerDropdowns(form = document.querySelector('#hero-planner')) {
  const page = form.ownerDocument;
  const view = page.defaultView;
  if (!('showPopover' in view.HTMLElement.prototype)) return () => {};
  const events = new AbortController();
  const cleanups = [];
  const listen = (target, name, handler) =>
    target.addEventListener(name, handler, { signal: events.signal });
  for (const select of form.querySelectorAll('select')) {
    const label = page.getElementById(`${select.id}-label`);
    const trigger = page.createElement('button');
    trigger.type = 'button';
    trigger.className = 'hero__select-trigger';
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    const value = page.createElement('span');
    value.id = `${select.id}-value`;
    trigger.append(value);
    trigger.setAttribute('aria-labelledby', `${label.id} ${value.id}`);
    const menu = page.createElement('div');
    menu.id = `${select.id}-menu`;
    menu.className = 'hero__select-menu';
    menu.setAttribute('popover', 'auto');
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-labelledby', label.id);
    trigger.setAttribute('aria-controls', menu.id);
    trigger.setAttribute('popovertarget', menu.id);
    const choices = [...select.options].filter((option) => option.value);
    const rows = choices.map((choice, index) => {
      const row = page.createElement('div');
      row.className = 'hero__select-option';
      row.id = `${select.id}-option-${index}`;
      row.setAttribute('role', 'option');
      row.textContent = choice.textContent;
      menu.append(row);
      listen(row, 'pointerdown', (event) => event.preventDefault());
      listen(row, 'click', () => commit(index));
      return row;
    });
    let active = 0;
    let openingIndex = null;
    function sync() {
      value.textContent = select.selectedOptions[0]?.textContent || 'Choose an option';
      trigger.title = value.textContent;
      trigger.classList.toggle('is-placeholder', !select.value);
      rows.forEach((row, index) => {
        row.textContent = choices[index].textContent;
        row.setAttribute(
          'aria-selected',
          String(choices[index].value === select.value),
        );
      });
    }
    function highlight(index) {
      active = (index + rows.length) % rows.length;
      rows.forEach((row, i) => row.classList.toggle('is-active', i === active));
      trigger.setAttribute('aria-activedescendant', rows[active].id);
      rows[active].scrollIntoView({ block: 'nearest' });
    }
    function commit(index) {
      select.value = choices[index].value;
      select.dispatchEvent(new view.Event('input', { bubbles: true }));
      select.dispatchEvent(new view.Event('change', { bubbles: true }));
      menu.hidePopover();
      trigger.focus({ preventScroll: true });
    }
    listen(menu, 'beforetoggle', () => {
      menu.classList.remove('is-positioned');
    });
    listen(menu, 'toggle', () => {
      const open = menu.matches(':popover-open');
      trigger.setAttribute('aria-expanded', String(open));
      if (!open) {
        trigger.removeAttribute('aria-activedescendant');
        return;
      }
      sync();
      const rect = trigger.closest('.hero__field').getBoundingClientRect();
      const preferredWidth = select.name === 'travellers' ? 300 : 340;
      menu.style.width = `${Math.min(Math.max(rect.width, preferredWidth), view.innerWidth - 24)}px`;
      menu.style.left = `${Math.max(12, Math.min(rect.left, view.innerWidth - menu.offsetWidth - 12))}px`;
      const below = view.innerHeight - rect.bottom - 24;
      const above = rect.top - 24;
      const placeBelow = below >= Math.min(menu.scrollHeight, 360) || below >= above;
      menu.style.maxHeight = `${Math.max(0, Math.min(400, placeBelow ? below : above))}px`;
      menu.style.top = `${placeBelow ? rect.bottom + 12 : rect.top - menu.offsetHeight - 12}px`;
      menu.dataset.placement = placeBelow ? 'below' : 'above';
      highlight(
        openingIndex ??
          Math.max(
            0,
            choices.findIndex((choice) => choice.value === select.value),
          ),
      );
      openingIndex = null;
      menu.classList.add('is-positioned');
    });
    listen(trigger, 'keydown', (event) => {
      const open = menu.matches(':popover-open');
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        if (!open) {
          openingIndex =
            event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 : null;
          menu.showPopover();
          return;
        }
        highlight(
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? rows.length - 1
              : active + (event.key === 'ArrowDown' ? 1 : -1),
        );
      } else if (open && ['Enter', ' '].includes(event.key)) {
        event.preventDefault();
        commit(active);
      } else if (open && ['Escape', 'Tab'].includes(event.key)) {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
        }
        menu.hidePopover();
      } else if (
        event.key.length === 1 &&
        event.key !== ' ' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        const index = choices.findIndex((choice) =>
          choice.textContent
            .toLocaleLowerCase()
            .startsWith(event.key.toLocaleLowerCase()),
        );
        if (index >= 0) {
          event.preventDefault();
          if (open) highlight(index);
          else {
            openingIndex = index;
            menu.showPopover();
          }
        }
      }
    });
    listen(label, 'click', (event) => {
      event.preventDefault();
      trigger.focus();
      trigger.click();
    });
    listen(select, 'change', sync);
    listen(page, 'language:changed', sync);
    listen(form, 'submit', sync);
    listen(form, 'reset', () => view.queueMicrotask(sync));
    listen(view, 'resize', () => {
      if (menu.matches(':popover-open')) menu.hidePopover();
    });
    listen(view, 'scroll', () => {
      if (menu.matches(':popover-open')) menu.hidePopover();
    });
    select.after(trigger, menu);
    select.hidden = true;
    sync();
    cleanups.push(() => {
      trigger.remove();
      menu.remove();
      select.hidden = false;
    });
  }
  return () => {
    events.abort();
    cleanups.forEach((cleanup) => cleanup());
  };
}
