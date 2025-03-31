import { html } from '../../util/html.js';
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
  }) => createCircularProgressBar({
    'value': value,
    'size': size,
    'track-width': trackWidth,
    'track-color': trackColor,
    'progress-color': progressColor,
    'rounded': rounded,
  }),
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
    ${createCircularProgressBar({
      'id': 'animated-progress-bar',
      'value': value,
      'size': size,
      'track-width': trackWidth,
      'track-color': trackColor,
      'progress-color': progressColor,
      'rounded': rounded,
    })}
    <script>
      document.querySelector('#animated-progress-bar').animateProgress(0, 100, '5s');
    </script>
  `,
};

/**
 * @param {object} props
 * @returns {string}
 */
function createCircularProgressBar(props) {
  const attrs = Object.entries(props)
    .filter(([, value]) => value != null)
    .map(([attr, value]) => `${attr}="${value}"`)
    .join(' ');
  return html`<circular-progress-bar ${attrs}></circular-progress-bar>`;
}
