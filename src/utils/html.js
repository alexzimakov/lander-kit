/**
 * @see https://2ality.com/2015/01/template-strings-html.html
 * @param {TemplateStringsArray} templateObject
 * @param {any[]} args
 * @returns
 */
export function html(templateObject, ...args) {
  const raw = templateObject.raw;

  let result = '';
  for (let i = 0; i < args.length; i += 1) {
    let arg = args[i];
    let lit = raw[i];
    if (Array.isArray(arg)) {
      arg = arg.join('');
    }
    if (lit.endsWith('!')) {
      arg = escapeHtml(arg);
      lit = lit.slice(0, -1);
    }
    result += lit;
    result += arg;
  }
  result += raw[raw.length - 1];

  return result;
}

export default html;

/**
 * Escapes HTML string.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}
