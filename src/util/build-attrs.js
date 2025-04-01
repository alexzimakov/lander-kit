import { html } from './html.js';

/**
 * @param {object} attrs
 * @returns {string}
 */
export function buildAttrs(attrs) {
  return Object.entries(attrs)
    .filter(([, value]) => value != null)
    .map(([attr, value]) => html`${attr}="!${value}"`)
    .join(' ');
}
