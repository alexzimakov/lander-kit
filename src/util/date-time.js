export const MILLISECONDS_IN_SECOND = 1000;
export const SECONDS_IN_DAY = 86400;
export const SECONDS_IN_HOUR = 3600;
export const SECONDS_IN_MINUTE = 60;

/**
 * @param {Date} date
 * @return {boolean}
 */
export function isDateValid(date) {
  return Number.isFinite(date.getTime());
}
