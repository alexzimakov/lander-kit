import { CountdownTimer } from './countdown-timer';

export default {
  title: 'Countdown Timer',
  tags: ['autodocs'],
  render: CountdownTimer.create,
};

export const Primary = {
  args: {
    date: generateDateInFuture(),
    locale: 'ru',
  },
};

/**
 * Creates date in future.
 * @param {Date} [from]
 * @returns
 */
function generateDateInFuture(from = new Date()) {
  return new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate() + 3,
    from.getHours() + 5,
    from.getMinutes() + 8,
    from.getSeconds() + 13
  ).toISOString();
}
