/**
 * Checks if the given date is valid.
 * @param {Date} date
 * @return {boolean}
 */
export function isDateValid(date) {
  return Number.isFinite(date.getTime());
}

/**
 * Converts milliseconds to seconds.
 * @param {number} milliseconds
 * @returns {number}
 */
export function millisecondsToSecond(milliseconds) {
  const millisecondsInSecond = 1000;
  return Math.floor(milliseconds / millisecondsInSecond);
}

export default {
  isDateValid,
  millisecondsToSecond,
};
