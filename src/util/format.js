/**
 * @param {number} number
 * @param {number} [decimals]
 * @param {string} [decimalPoint]
 * @param {string} [thousandsSeparator]
 * @returns {string}
 */
export function formatNumber(number, decimals = 0, decimalPoint = '.', thousandsSeparator = ',') {
  number = Number.isFinite(number) ? number : 0;
  decimals = Number.isFinite(decimals) ? Math.abs(decimals) : 0;

  const numberString = decimals ? number.toFixed(decimals) : String(Math.round(number));
  let [integer, fractional = ''] = numberString.split('.');
  if (integer.length > 3) {
    integer = integer.replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandsSeparator);
  }
  if (fractional.length < decimals) {
    fractional += '0'.repeat(decimals - fractional.length);
  }

  return integer && fractional
    ? integer + decimalPoint + fractional
    : integer;
}

/**
 * Formats string.
 *
 * ```js
 * t('You have {n:# messages|# message| #messages}', { n: 0 });
 * // if n = 0 then 'You have 0 messages'
 * // if n = 1 then 'You have 1 message'
 * // if n > 1 then 'You have 10 messages'
 * ```
 *
 * ```js
 * t('{one} and {two}', { one: 'foo', two: 'bar' });
 * // returns 'foo and bar'
 * ```
 *
 * @param {string} message
 * @param {Record<string, number>} [params]
 * @param {{
 *   decimals?: number;
 *   shouldFormatNumber?: boolean;
 * }} [opts]
 * @returns
 */
export function t(message, params = {}, opts = {}) {
  const decimals = Number.isFinite(opts.decimals) ? opts.decimals : 0;
  const shouldFormatNumber = typeof opts.shouldFormatNumber === 'boolean' ? opts.shouldFormatNumber : true;

  let result = message.replace(/\{([A-Za-z_\-\d]{1,32}):(.{1,256}?)\}/g, (
    _,
    token = '',
    options = '',
  ) => {
    const number = Number(params[token]) || 0;
    const replaceOptions = options.split('|');

    let index = number >= 0 && number <= 2 ? number : 0;
    if (replaceOptions[index] === undefined) {
      index = 0;
    }
    const option = replaceOptions[index] || '#';

    return shouldFormatNumber
      ? option.replace(/#/g, formatNumber(number, decimals, '.', ','))
      : option.replace(/#/g, String(number));
  });

  Object.entries(params).forEach(([key, value]) => {
    result = result.split(`{${key}}`).join(value);
  });

  return result;
}
