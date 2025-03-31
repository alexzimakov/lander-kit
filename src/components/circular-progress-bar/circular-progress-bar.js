import { html } from '../../util/html.js';
import { linear } from '../../util/easing-functions.js';
import { defineCustomElement } from '../../util/define-custom-element.js';
import styles from './circular-progress-bar.css?inline';

export class CircularProgressBar extends HTMLElement {
  static get observedAttributes() {
    return [
      'value',
      'rounded',
      'size',
      'track-width',
      'track-color',
      'progress-color',
    ];
  }

  constructor() {
    super();
    this._frameId = -1;
    this.render();
  }

  /**
   * @returns {number}
   */
  get value() {
    const value = Number(this.getAttribute('value'));
    if (!Number.isFinite(value) || value < 0) {
      return 0;
    }
    if (value > 100) {
      return 100;
    }
    return value;
  }

  /**
   * @param {number} value
   */
  set value(value) {
    if (Number.isFinite(value) && value >= 0 && value <= 100) {
      this.setAttribute('value', String(value));
    }
  }

  /**
   * @returns {number}
   */
  get size() {
    const value = this.getAttribute('size');
    if (value) {
      const size = Number(value);
      if (Number.isFinite(size) && size >= 0) {
        return size;
      }
    }
    return 64;
  }

  /**
   * @param {number}
   */
  set size(value) {
    if (Number.isFinite(value) && value >= 0) {
      this.setAttribute('size', String(value));
    };
  }

  /**
   * @returns {number}
   */
  get trackWidth() {
    const value = this.getAttribute('track-width');
    if (value) {
      const trackWidth = Number(value);
      if (Number.isFinite(trackWidth) && trackWidth >= 0) {
        return trackWidth;
      }
    }
    return 4;
  }

  /**
   * @param {number}
   */
  set trackWidth(value) {
    if (Number.isFinite(value) && value >= 0) {
      this.setAttribute('track-width', String(value));
    };
  }

  /**
   * @returns {string}
   */
  get trackColor() {
    return this.getAttribute('track-color') || '';
  }

  /**
   * @param {string}
   */
  set trackColor(value) {
    this.setAttribute('track-color', value);
  }

  /**
   * @returns {string}
   */
  get progressColor() {
    return this.getAttribute('progress-color') || '';
  }

  /**
   * @param {string}
   */
  set progressColor(value) {
    this.setAttribute('progress-color', value);
  }

  /**
   * @returns {boolean}
   */
  get isRounded() {
    const value = this.getAttribute('rounded');
    return value != null && value !== 'false';
  }

  /**
   * @returns {boolean}
   */
  set isRounded(value) {
    if (value) {
      this.setAttribute('rounded', '');
    } else {
      this.removeAttribute('rounded');
    }
  }

  /**
   * @param {number} value
   * @returns {object}
   */
  calcParams(value) {
    const size = this.size;
    const trackWidth = this.trackWidth;
    const radius = size / 2 - trackWidth;
    const center = size / 2;
    // https://nikitahl.com/svg-circle-progress
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * ((100 - value) / 100);

    return {
      width: size,
      height: size,
      r: radius,
      cx: center,
      cy: center,
      strokeWidth: trackWidth,
      strokeDasharray: circumference,
      strokeDashOffset: offset,
      strokeLinecap: this.isRounded ? 'round' : 'butt',
      fontSize: (size - trackWidth) * 0.22,
      trackColor: this.trackColor,
      progressColor: this.progressColor,
      progress: `${Math.round(value)}%`,
    };
  }

  /**
   * @param {number} value
   */
  update(value) {
    const {
      strokeDashOffset,
      trackColor,
      progressColor,
      progress,
    } = this.calcParams(value);

    const valueEl = this.shadowRoot.querySelector('.value');
    valueEl.innerText = progress;

    const trackEl = this.shadowRoot.querySelector('.track');
    if (trackEl) {
      trackEl.style.setProperty('--track-color', trackColor);
    } else {
      trackEl.style.removeProperty('--track-color');
    }

    const progressEl = this.shadowRoot.querySelector('.progress');
    progressEl.setAttribute('stroke-dashoffset', strokeDashOffset);
    if (progressColor) {
      progressEl.style.setProperty('--progress-color', progressColor);
    } else {
      trackEl.style.removeProperty('--progress-color');
    }
  }

  /**
   * @param {number} from
   * @param {number} to
   * @param {number|string} duration
   */
  animateProgress(from, to, duration) {
    if (!Number.isFinite(from)) {
      throw new TypeError('Argument "from" must be a number.');
    }
    if (from < 0 || from > 100) {
      throw new RangeError('Argument "from" must be ≥ 0 and ≤ 100.');
    }

    if (!Number.isFinite(to)) {
      throw new TypeError('Argument "to" must be a number.');
    }
    if (to < 0 || to > 100) {
      throw new RangeError('Argument "to" must be ≥ 0 and ≤ 100.');
    }

    if (from > to) {
      throw new RangeError('Argument "from" must be ≤ "to".');
    }

    if (typeof duration !== 'number' && typeof duration !== 'string') {
      throw new TypeError('Argument "duration" must be a number or a string.');
    }
    if (typeof duration === 'number' && !duration < 0) {
      throw new RangeError('Argument "duration" must be ≥ 0.');
    }
    if (typeof duration === 'string' && !duration.match(/^([0-9]+(\.[0-9]+)?|\.[0-9]+)(s|ms)$/)) {
      throw new RangeError('Argument "duration" must be specified in seconds (s) or milliseconds (ms), like 1.5s or 250ms.');
    }

    if (typeof duration === 'string') {
      if (duration.endsWith('ms')) {
        duration = parseFloat(duration);
      } else if (duration.endsWith('s')) {
        duration = parseFloat(duration) * 1000;
      }
    }

    cancelAnimationFrame(this._frameId);
    const diff = to - from;
    const start = Date.now();
    const updateProgress = () => {
      const timeElapsed = Date.now() - start;
      const t = timeElapsed / duration;
      const value = from + diff * linear(t);
      if (value < to) {
        this.update(value);
        this._frameId = requestAnimationFrame(updateProgress);
      } else {
        this.update(to);
        this.setAttribute('value', to);
        this._frameId = -1;
      }
    };
    updateProgress();
  }

  render() {
    const {
      width,
      height,
      r,
      cx,
      cy,
      strokeWidth,
      strokeDasharray,
      strokeDashOffset,
      strokeLinecap,
      fontSize,
      trackColor,
      progressColor,
      progress,
    } = this.calcParams(this.value);

    const style = document.createElement('style');
    style.innerText = styles;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.shadowRoot.innerHTML = html`
      <svg
        viewBox="0 0 ${width} ${height}"
        width="${width}"
        height="${height}"
      >
        <circle
          class="track"
          style="${trackColor ? `--track-color: ${trackColor}` : ''}"
          r="${r}"
          cx="${cx}"
          cy="${cy}"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${strokeDasharray}"
        ></circle>
        <circle
          class="progress"
          style="${progressColor ? `--progress-color: ${progressColor}` : ''}"
          r="${r}"
          cx="${cx}"
          cy="${cy}"
          fill="none"
          stroke="#22c55e"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${strokeDasharray}"
          stroke-dashoffset="${strokeDashOffset}"
          stroke-linecap="${strokeLinecap}"
        ></circle>
      </svg>
      <span class="value" style="font-size: ${fontSize}px">${progress}</span>
    `;
    this.shadowRoot.prepend(style);
  }

  attributeChangedCallback(name) {
    if (name === 'size' || name === 'track-width' || name === 'rounded') {
      this.render();
    } else if (name === 'value' || name === 'track-color' || name === 'progress-color') {
      this.update(this.value);
    }
  }
}

defineCustomElement('circular-progress-bar', CircularProgressBar);
