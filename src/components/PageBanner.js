import landscape from '../assets/images/destinations/serengeti-2.jpg';
import { escapeHtml } from '../utils/escapeHtml.js';

export function PageBanner({
  title,
  subtitle = 'Deaf Safaris · Tanzania',
  photo,
} = {}) {
  return `<div class="page-banner">
    <img src="${escapeHtml(photo?.src || landscape)}" alt="${escapeHtml(photo?.alt || 'Illustrative Tanzania landscape with an acacia tree on the plains.')}" width="1280" height="853" decoding="async" />
    <div class="container page-banner__content">
      <nav aria-label="Breadcrumb"><a href="#home">Home</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(title)}</span></nav>
      <p>${escapeHtml(subtitle)}</p><h1 tabindex="-1">${escapeHtml(title)}</h1>
    </div>
  </div>`;
}
