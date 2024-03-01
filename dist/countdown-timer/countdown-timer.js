(function () {
  'use strict';

  function html(templateObject) {
    const raw = templateObject.raw;
    let result = '';
    for (let i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i += 1) {
      let arg = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
      let lit = raw[i];
      if (Array.isArray(arg)) {
        arg = arg.join('');
      }
      if (lit.endsWith('!')) {
        arg = escapeHtml(arg);
        lit = lit.slice(0, -1);
      }
      result += lit;
      result += arg;
    }
    result += raw[raw.length - 1];
    return result;
  }
  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#96;');
  }

  function isDateValid(date) {
    return Number.isFinite(date.getTime());
  }
  function millisecondsToSecond(milliseconds) {
    const millisecondsInSecond = 1000;
    return Math.floor(milliseconds / millisecondsInSecond);
  }

  const css = `:host{--digit-height:28px;--digit-gap:2px;--digit-pad-x:8px;--digit-color:#1f2937;--digit-bg-color:#d1d5db;--digit-border-radius:2px;--reel-gap:20px;--reel-border-radius:8px;--delimiter-color:#9ca3af;font-variant-numeric:tabular-nums;margin:0;padding:0;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:.875rem;font-weight:700;display:inline-flex;position:relative}.digit{justify-content:center;align-items:top;box-sizing:border-box;height:var(--digit-height);padding:0 var(--digit-pad-x);border-radius:var(--digit-border-radius);background:var(--digit-bg-color);color:var(--digit-color);display:inline-flex;overflow:hidden}.digit:before{content:attr(data-value);line-height:var(--digit-height);text-align:center;white-space:pre}.digit[data-prev-value]:before{content:attr(data-prev-value)"\a " attr(data-value);animation:.7s ease-in-out forwards countdown-move}.reel{border-radius:var(--reel-border-radius);display:inline-flex}.reel>:first-child{border-top-left-radius:inherit;border-bottom-left-radius:inherit}.reel>:last-child{border-top-right-radius:inherit;border-bottom-right-radius:inherit}.reel>.digit+.digit{margin-left:var(--digit-gap)}.delimiter{width:var(--reel-gap);color:var(--delimiter-color);flex-shrink:0;justify-content:center;align-items:center;display:inline-flex}.delimiter:before{content:":"}@keyframes countdown-move{0%{transform:translateY(0%)}to{transform:translateY(-100%)}}`;

  class CountdownTimer extends HTMLElement {
    static tagName = 'lk-countdown-timer';
    static template = document.createElement('template');
    static #_ = this.template.innerHTML = html`
      <style>
        ${css}
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
    static create(_ref) {
      let {
        date,
        locale = 'en'
      } = _ref;
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
      this.root = this.attachShadow({
        mode: 'open'
      });
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
      const hours = Math.floor(timeLeft % secondsInDay / secondsInHour);
      const minutes = Math.floor(timeLeft % secondsInHour / secondsInMinute);
      const seconds = Math.floor(timeLeft % secondsInMinute);
      const daysFormatter = new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: 'day',
        unitDisplay: 'long'
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
    updateDigit(element, value) {
      const prevValue = element.getAttribute('data-value') || '';
      if (prevValue !== value) {
        element.removeAttribute('data-prev-value');
        element.offsetTop;
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
    getElement(selector) {
      const element = this.root.querySelector(selector);
      if (!(element instanceof HTMLElement)) {
        throw new Error(`CountdownTimer: Descendant element '${selector}' not found.`);
      }
      return element;
    }
  }
  customElements.define(CountdownTimer.tagName, CountdownTimer);

  return CountdownTimer;

})();
