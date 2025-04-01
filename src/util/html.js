import { stripIndent } from './strip-indent.js';

/**
 * @see https://exploringjs.com/es6/ch_template-literals.html#sec_html-tag-function-implementation
 * @param {TemplateStringsArray} templateStrings
 * @param {...unknown} values
 * @returns {string}
 */
export function html(templateStrings, ...values) {
  const raw = templateStrings.raw;

  let result = '';
  values.forEach((value, i) => {
    let literal = raw[i];

    if (value == null) {
      value = '';
    } else if (Array.isArray(value)) {
      value = value.join('');
    } else if (typeof value === 'object') {
      value = JSON.stringify(value);
    } else {
      value = String(value);
    }

    if (literal.endsWith('!')) {
      value = htmlEscape(value);
      literal = literal.slice(0, -1);
    }
    result += literal;
    result += value;
  });
  result += raw[raw.length - 1];

  return stripIndent(result);
}

/**
 * @param {string} str
 * @returns {string}
 */
export function htmlEscape(str) {
  return str.replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}
