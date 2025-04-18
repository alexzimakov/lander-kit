(() => {
  // src/util/date-time.js
  var MILLISECONDS_IN_SECOND = 1e3;
  var SECONDS_IN_DAY = 86400;
  var SECONDS_IN_HOUR = 3600;
  var SECONDS_IN_MINUTE = 60;
  function isDateValid(date) {
    return Number.isFinite(date.getTime());
  }

  // src/util/define-custom-element.js
  function defineCustomElement(name, component) {
    if (customElements.get(name) === void 0) {
      customElements.define(name, component);
    }
  }

  // src/util/strip-indent.js
  function stripIndent(str) {
    const lines = str.split("\n");
    let minIndent = 0;
    if (lines.length > 0) {
      lines.forEach((line) => {
        const matches = line.match(/^[ \t]*(?=\S)/gm);
        if (matches) {
          const indent = matches[0].length;
          if (indent > 0 && (minIndent === 0 || indent < minIndent)) {
            minIndent = indent;
          }
        }
      });
    }
    return lines.map((line) => line.slice(minIndent)).join("\n").trim();
  }

  // src/util/html.js
  function html(templateStrings, ...values) {
    const raw = templateStrings.raw;
    let result = "";
    values.forEach((value, i) => {
      let literal = raw[i];
      if (value == null) {
        value = "";
      } else if (Array.isArray(value)) {
        value = value.join("");
      } else if (typeof value === "object") {
        value = JSON.stringify(value);
      } else {
        value = String(value);
      }
      if (literal.endsWith("!")) {
        value = htmlEscape(value);
        literal = literal.slice(0, -1);
      }
      result += literal;
      result += value;
    });
    result += raw[raw.length - 1];
    return stripIndent(result);
  }
  function htmlEscape(str) {
    return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, "&#96;");
  }

  // inline-css:src/components/countdown-timer/countdown-timer.css
  var countdown_timer_default = ':host{--digit-height:36px;--digit-inline-padding:10px;--digit-gap:2px;--digit-color:#111827;--digit-background:#0d234430;--digit-border-radius:2px;--reel-gap:20px;--reel-border-radius:9px;--delimiter-color:#111827;font-variant-numeric:tabular-nums;margin:0;padding:0;font-size:16px;font-weight:700;display:inline-flex;position:relative}.digit{box-sizing:border-box;height:var(--digit-height);padding:0 var(--digit-inline-padding);color:var(--digit-color);background:var(--digit-background);border-radius:var(--digit-border-radius);justify-content:center;align-items:stretch;display:inline-flex;overflow:hidden}.digit:before{line-height:var(--digit-height);text-align:center;white-space:pre;content:attr(data-value)}@keyframes move-digit{0%{transform:translateY(0%)}to{transform:translateY(-100%)}}.digit[data-prev-value]:before{content:attr(data-prev-value)"\\a " attr(data-value);animation:.7s ease-in-out forwards move-digit}.reel{border-radius:var(--reel-border-radius);display:inline-flex}.reel>:first-child{border-top-left-radius:inherit;border-bottom-left-radius:inherit}.reel>:last-child{border-top-right-radius:inherit;border-bottom-right-radius:inherit}.reel>.digit+.digit{margin-left:var(--digit-gap)}.delimiter{width:var(--reel-gap);color:var(--delimiter-color);flex-shrink:0;justify-content:center;align-items:center;display:inline-flex}.delimiter:before{content:":"}[hidden]{display:none!important}';

  // src/components/countdown-timer/countdown-timer.js
  var CountdownTimer = class extends HTMLElement {
    constructor() {
      super();
      this.intervalId = -1;
      this.updateTime = this.updateTime.bind(this);
      this.updateDigit = this.updateDigit.bind(this);
      this.start = this.start.bind(this);
      this.pause = this.pause.bind(this);
      this.render();
    }
    /**
     * @returns {Date}
     */
    get end() {
      const value = this.getAttribute("end") || "";
      const date = new Date(value);
      if (isDateValid(date)) {
        return date;
      }
      return /* @__PURE__ */ new Date();
    }
    /**
     * @param {string} value
     */
    set end(value) {
      this.getAttribute("end", value);
    }
    /**
     * @returns {string}
     */
    get locale() {
      return this.getAttribute("locale") || "en";
    }
    /**
     * @param {string} value
     */
    set locale(value) {
      this.setAttribute("locale", value);
    }
    /**
     * @returns {boolean}
     */
    get shouldHideDays() {
      const value = this.getAttribute("hide-days");
      return value != null && value !== "false";
    }
    /**
     * @param {boolean} value
     */
    set shouldHideDays(value) {
      if (value) {
        this.setAttribute("hide-days", "");
      } else {
        this.removeAttribute("hide-days");
      }
    }
    /**
     * @returns {{
     *   days: HTMLElement;
     *   hours0: HTMLElement;
     *   hours1: HTMLElement;
     *   minutes0: HTMLElement;
     *   minutes1: HTMLElement;
     *   seconds0: HTMLElement;
     *   seconds1: HTMLElement;
     * }}
     */
    get elements() {
      return {
        days: this.shadowRoot.querySelector('[data-element="days"]'),
        hours0: this.shadowRoot.querySelector('[data-element="hours0"]'),
        hours1: this.shadowRoot.querySelector('[data-element="hours1"]'),
        minutes0: this.shadowRoot.querySelector('[data-element="minutes0"]'),
        minutes1: this.shadowRoot.querySelector('[data-element="minutes1"]'),
        seconds0: this.shadowRoot.querySelector('[data-element="seconds0"]'),
        seconds1: this.shadowRoot.querySelector('[data-element="seconds1"]')
      };
    }
    render() {
      const style = document.createElement("style");
      style.innerText = countdown_timer_default;
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }
      this.shadowRoot.innerHTML = html`
      <span class="reel" ${this.shouldHideDays ? "hidden" : ""}>
        <b class="digit" data-element="days"></b>
      </span>
      <span class="delimiter" ${this.shouldHideDays ? "hidden" : ""}></span>
      <span class="reel">
        <b class="digit" data-element="hours0"></b>
        <b class="digit" data-element="hours1"></b>
      </span>
      <span class="delimiter"></span>
      <span class="reel">
        <b class="digit" data-element="minutes0"></b>
        <b class="digit" data-element="minutes1"></b>
      </span>
      <span class="delimiter"></span>
      <span class="reel">
        <b class="digit" data-element="seconds0"></b>
        <b class="digit" data-element="seconds1"></b>
      </span>
    `;
      this.shadowRoot.prepend(style);
    }
    updateTime() {
      const locale = this.locale;
      const start = /* @__PURE__ */ new Date();
      const end = this.end;
      let timeLeft = 0;
      if (start < end) {
        timeLeft = (end.getTime() - start.getTime()) / MILLISECONDS_IN_SECOND;
      }
      const days = Math.floor(timeLeft / SECONDS_IN_DAY);
      const hours = Math.floor(timeLeft % SECONDS_IN_DAY / SECONDS_IN_HOUR);
      const minutes = Math.floor(timeLeft % SECONDS_IN_HOUR / SECONDS_IN_MINUTE);
      const seconds = Math.floor(timeLeft % SECONDS_IN_MINUTE);
      const daysFormatter = new Intl.NumberFormat(locale, {
        style: "unit",
        unit: "day",
        unitDisplay: "long"
      });
      const formattedDays = daysFormatter.format(days);
      const hours0 = String(Math.floor(hours / 10));
      const hours1 = String(hours % 10);
      const minutes0 = String(Math.floor(minutes / 10));
      const minutes1 = String(minutes % 10);
      const seconds0 = String(Math.floor(seconds / 10));
      const seconds1 = String(seconds % 10);
      const elements = this.elements;
      this.updateDigit(elements.days, formattedDays);
      this.updateDigit(elements.hours0, hours0);
      this.updateDigit(elements.hours1, hours1);
      this.updateDigit(elements.minutes0, minutes0);
      this.updateDigit(elements.minutes1, minutes1);
      this.updateDigit(elements.seconds0, seconds0);
      this.updateDigit(elements.seconds1, seconds1);
    }
    /**
     * @param {HTMLElement} element
     * @param {string} value
     */
    updateDigit(element, value) {
      const prevValue = element.getAttribute("data-value") || "";
      if (prevValue !== value) {
        element.removeAttribute("data-prev-value");
        element.offsetTop;
        element.setAttribute("data-value", value);
        if (prevValue) {
          element.setAttribute("data-prev-value", prevValue);
        }
      }
    }
    start() {
      this.intervalId = setInterval(this.updateTime, 1e3);
    }
    pause() {
      clearInterval(this.intervalId);
      this.intervalId = -1;
    }
    connectedCallback() {
      this.updateTime();
      this.start();
    }
    disconnectedCallback() {
      this.pause();
    }
    /**
     * @param {string} after
     * @param {Date} [from]
     * @returns {Date}
     */
    static getDateAfter(after, from = /* @__PURE__ */ new Date()) {
      const date = new Date(from);
      const matches = after.match(
        /^(?<days>(1 day)|(\d+ days) )?(?<hours>(1 hour)|(\d+ hours) )?(?<minutes>(1 minute)|(\d+ minutes) )?(?<seconds>(1 second)|(\d+ seconds))?$/
      );
      if (matches && matches.groups) {
        const { days, hours, minutes, seconds } = matches.groups;
        if (days) {
          date.setDate(date.getDate() + parseInt(days, 10));
        }
        if (hours) {
          date.setHours(date.getHours() + parseInt(hours, 10));
        }
        if (minutes) {
          date.setMinutes(date.getMinutes() + parseInt(minutes, 10));
        }
        if (seconds) {
          date.setSeconds(date.getSeconds() + parseInt(seconds, 10));
        }
      }
      return date;
    }
  };
  defineCustomElement("countdown-timer", CountdownTimer);
})();
