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
    let prevTemplateString = raw[i];

    if (Array.isArray(value)) {
      value = value.join('');
    }

    if (prevTemplateString.endsWith('!')) {
      value = htmlEscape(value);
      prevTemplateString = prevTemplateString.slice(0, -1);
    }
    result += prevTemplateString;
    result += value;
  });
  result += raw[raw.length - 1];

  return stripIndent(result);
}

export function htmlEscape(str) {
  return str.replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}
