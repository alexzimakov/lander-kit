import { html } from '../../util/html.js';
import { buildAttrs } from '../../util/build-attrs.js';
import './circular-progress-bar.js';

export default {
  tags: ['autodocs'],
  render: ({
    value = 0,
    size,
    trackWidth,
    trackColor,
    progressColor,
    rounded,
  }) => html`
    <circular-progress-bar ${buildAttrs({
      'value': value,
      'size': size,
      'track-width': trackWidth,
      'track-color': trackColor,
      'progress-color': progressColor,
      'rounded': rounded,
    })}></circular-progress-bar>
  `,
  argTypes: {
    value: { control: 'number', min: 0, max: 100 },
    size: { control: 'number', min: 0 },
    trackWidth: { control: 'number', min: 0 },
    trackColor: { control: 'color' },
    progressColor: { control: 'color' },
    rounded: { control: 'boolean' },
  },
  args: {
    value: 62,
  },
};

export const Default = {
};

export const AnimateProgress = {
  render: ({
    value = 0,
    size,
    trackWidth,
    trackColor,
    progressColor,
    rounded,
  }) => html`
    <circular-progress-bar ${buildAttrs({
      'id': 'animated-progress-bar',
      'value': value,
      'size': size,
      'track-width': trackWidth,
      'track-color': trackColor,
      'progress-color': progressColor,
      'rounded': rounded,
    })}></circular-progress-bar>
    <script>
      document.querySelector('#animated-progress-bar').animateProgress(0, 100, '5s');
    </script>
  `,
};
