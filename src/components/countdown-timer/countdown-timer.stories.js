import './countdown-timer.js';
import { html } from '../../util/html.js';
import { buildAttrs } from '../../util/build-attrs.js';
import { CountdownTimer } from './countdown-timer.js';

export default {
  tags: ['autodocs'],
  render: ({
    end,
    locale,
    shouldHideDays,
  }) => {
    return html`
      <countdown-timer ${buildAttrs({
        end,
        locale,
        'hide-days': shouldHideDays,
      })}></countdown-timer>
    `;
  },
  argTypes: {
    end: { control: 'date' },
    locale: { control: 'text' },
    shouldHideDays: { control: 'boolean' },
  },
  args: {
    end: CountdownTimer.getDateAfter('5 hours 10 minutes 30 seconds').toISOString(),
    locale: 'en-US',
    shouldHideDays: false,
  },
};

export const Primary = {};
