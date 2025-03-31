/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @param {number} [length]
 * @returns {string}
 */
export function getRandomString(length = 5) {
  if (!Number.isInteger(length)) {
    throw new TypeError('Argument "length" must be an integer.');
  }
  if (length < 0) {
    throw new RangeError('Argument "length" must be ≥ 0.');
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    + 'abcdefghijklmnopqrstuvwxyz'
    + '0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars[getRandomInt(0, chars.length - 1)];
  }

  return result;
}
