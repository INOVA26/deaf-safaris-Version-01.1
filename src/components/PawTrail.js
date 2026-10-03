export function PawTrail() {
  const paw =
    '<svg viewBox="0 0 80 80" fill="currentColor" focusable="false"><ellipse cx="15" cy="30" rx="9" ry="13" transform="rotate(-25 15 30)"/><ellipse cx="32" cy="17" rx="9" ry="13" transform="rotate(-8 32 17)"/><ellipse cx="52" cy="18" rx="9" ry="13" transform="rotate(15 52 18)"/><ellipse cx="68" cy="34" rx="9" ry="12" transform="rotate(28 68 34)"/><path d="M20 58c0-9 12-26 22-26s23 19 23 28c0 16-15 9-23 9s-22 7-22-11Z"/></svg>';
  return `<span class="paw-trail" aria-hidden="true"><span>${paw}</span><span>${paw}</span><span>${paw}</span></span>`;
}
