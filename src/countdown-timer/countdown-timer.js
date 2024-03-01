import { html } from '../utils/html.js';
import { isDateValid, millisecondsToSecond } from '../utils/datetime.js';
import styles from './countdown.css?inline';

export class CountdownTimer extends HTMLElement {
  static tagName = 'lk-countdown-timer';
  static template = document.createElement('template');

  static {
    this.template.innerHTML = html`
      <style>
        ${styles}
      </style>

      <span class="reel" part="reel">
        <b class="digit timer-d" part="digit"></b>
      </span>
      <span class="delimiter" part="delimiter"></span>
      <span class="reel" part="reel">
        <b class="digit timer-h0" part="digit"></b>
        <b class="digit timer-h1" part="digit"></b>
      </span>
      <span class="delimiter" part="delimiter"></span>
      <span class="reel" part="reel">
        <b class="digit timer-m0" part="digit"></b>
        <b class="digit timer-m1" part="digit"></b>
      </span>
      <span class="delimiter" part="delimiter"></span>
      <span class="reel" part="reel">
        <b class="digit timer-s0" part="digit"></b>
        <b class="digit timer-s1" part="digit"></b>
      </span>
    `;
  }

  /**
   * Creates a CountdownTimer element.
   * @param {{
   *   date: Date | string;
   *   locale?: string;
   * }} params
   * @returns {HTMLElement}
   */
  static create({ date, locale = 'en' }) {
    const element = document.createElement(CountdownTimer.tagName);
    const datetime = date instanceof Date ? date.toISOString() : date;
    element.setAttribute('datetime', datetime);
    element.setAttribute('locale', locale);
    return element;
  }

  constructor() {
    super();

    this.intervalId = -1;
    this.foo = -1;
    this.updateTime = this.updateTime.bind(this);
    this.updateDigit = this.updateDigit.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);

    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(CountdownTimer.template.content.cloneNode(true));
  }

  updateTime() {
    const datetime = this.getAttribute('datetime') || '';
    const locale = this.getAttribute('locale') || undefined;

    const start = new Date();
    const end = new Date(datetime);
    let timeLeft = 0;
    if (isDateValid(end) && start < end) {
      timeLeft = millisecondsToSecond(end.getTime() - start.getTime());
    }

    const secondsInDay = 86400;
    const secondsInHour = 3600;
    const secondsInMinute = 60;
    const days = Math.floor(timeLeft / secondsInDay);
    const hours = Math.floor((timeLeft % secondsInDay) / secondsInHour);
    const minutes = Math.floor((timeLeft % secondsInHour) / secondsInMinute);
    const seconds = Math.floor(timeLeft % secondsInMinute);

    const daysFormatter = new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'day',
      unitDisplay: 'long',
    });
    const formattedDays = daysFormatter.format(days);
    const hours0 = String(Math.floor(hours / 10));
    const hours1 = String(hours % 10);
    const minutes0 = String(Math.floor(minutes / 10));
    const minutes1 = String(minutes % 10);
    const seconds0 = String(Math.floor(seconds / 10));
    const seconds1 = String(seconds % 10);
    this.updateDigit(this.getElement('.timer-d'), formattedDays);
    this.updateDigit(this.getElement('.timer-h0'), hours0);
    this.updateDigit(this.getElement('.timer-h1'), hours1);
    this.updateDigit(this.getElement('.timer-m0'), minutes0);
    this.updateDigit(this.getElement('.timer-m1'), minutes1);
    this.updateDigit(this.getElement('.timer-s0'), seconds0);
    this.updateDigit(this.getElement('.timer-s1'), seconds1);
  }

  /**
   * @param {HTMLElement} element
   * @param {string} value
   */
  updateDigit(element, value) {
    const prevValue = element.getAttribute('data-value') || '';
    if (prevValue !== value) {
      element.removeAttribute('data-prev-value');
      element.offsetTop; // Force calc layout.
      element.setAttribute('data-value', value);
      if (prevValue) {
        element.setAttribute('data-prev-value', prevValue);
      }
    }
  }

  connectedCallback() {
    this.updateTime();
    this.start();
  }

  disconnectedCallback() {
    this.stop();
  }

  start() {
    this.intervalId = window.setInterval(this.updateTime, 1000);
  }

  stop() {
    window.clearInterval(this.intervalId);
    this.intervalId = -1;
  }

  /**
   * Returns child element
   * @param {string} selector
   * @returns {HTMLElement}
   */
  getElement(selector) {
    const element = this.root.querySelector(selector);
    if (!(element instanceof HTMLElement)) {
      throw new Error(
        `CountdownTimer: Descendant element '${selector}' not found.`
      );
    }
    return element;
  }
}

customElements.define(CountdownTimer.tagName, CountdownTimer);
