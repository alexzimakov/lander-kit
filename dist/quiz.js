(() => {
  // src/components/quiz/quiz-question.js
  var QuizQuestionChangeEvent = class _QuizQuestionChangeEvent extends CustomEvent {
    static get type() {
      return "quizQuestionChange";
    }
    constructor() {
      super(_QuizQuestionChangeEvent.type, { bubbles: true });
    }
  };
  var QuizQuestion = class extends HTMLElement {
    /**
     * @returns {QuizPage | null}
     */
    get parentPage() {
      let parent = this.parentElement;
      while (parent) {
        if (parent instanceof QuizPage) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    }
    /**
     * @returns {boolean}
     */
    get optional() {
      return this.hasAttribute("optional");
    }
    /**
     * @returns {string | string[]}
     */
    get value() {
      return "";
    }
    /**
     * @returns {boolean}
     */
    get valid() {
      if (this.optional) {
        return true;
      }
      return this.value.length > 0;
    }
    /**
     * @returns {string}
     */
    get name() {
      return this.getAttribute("name") || "";
    }
    /**
     * @returns {object}
     */
    get result() {
      return {
        name: this.name,
        value: this.value
      };
    }
  };

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

  // inline-css:src/components/quiz/quiz-page.css
  var quiz_page_default = ":host{--gap:40px}.container{gap:var(--gap);display:grid}";

  // src/components/quiz/quiz-page.js
  var QuizPage = class extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    /**
     * @returns {QuizForm | null}
     */
    get parentForm() {
      let parent = this.parentElement;
      while (parent) {
        if (parent instanceof QuizForm) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    }
    /**
     * @returns {QuizQuestion[]}
     */
    get questions() {
      return Array.from(this.children).filter((child) => child instanceof QuizQuestion);
    }
    /**
     * @returns {boolean}
     */
    get valid() {
      return this.questions.every((question) => question.valid);
    }
    /**
     * @returns {object[]}
     */
    get result() {
      return this.questions.map((question) => question.result);
    }
    render() {
      const style = document.createElement("style");
      style.innerText = quiz_page_default;
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }
      this.shadowRoot.innerHTML = html`
      <div class="container">
        <slot name=""></slot>
      </div>
    `;
      this.shadowRoot.prepend(style);
    }
  };

  // src/util/format.js
  function formatNumber(number, decimals = 0, decimalPoint = ".", thousandsSeparator = ",") {
    number = Number.isFinite(number) ? number : 0;
    decimals = Number.isFinite(decimals) ? Math.abs(decimals) : 0;
    const numberString = decimals ? number.toFixed(decimals) : String(Math.round(number));
    let [integer, fractional = ""] = numberString.split(".");
    if (integer.length > 3) {
      integer = integer.replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandsSeparator);
    }
    if (fractional.length < decimals) {
      fractional += "0".repeat(decimals - fractional.length);
    }
    return integer && fractional ? integer + decimalPoint + fractional : integer;
  }
  function t(message, params = {}, opts = {}) {
    const decimals = Number.isFinite(opts.decimals) ? opts.decimals : 0;
    const shouldFormatNumber = typeof opts.shouldFormatNumber === "boolean" ? opts.shouldFormatNumber : true;
    let result = message.replace(/\{([A-Za-z_\-\d]{1,32}):(.{1,256}?)\}/g, (_, token = "", options = "") => {
      const number = Number(params[token]) || 0;
      const replaceOptions = options.split("|");
      let index = number >= 0 && number <= 2 ? number : 0;
      if (replaceOptions[index] === void 0) {
        index = 0;
      }
      const option = replaceOptions[index] || "#";
      return shouldFormatNumber ? option.replace(/#/g, formatNumber(number, decimals, ".", ",")) : option.replace(/#/g, String(number));
    });
    Object.entries(params).forEach(([key, value]) => {
      result = result.split(`{${key}}`).join(value);
    });
    return result;
  }

  // inline-css:src/components/quiz/quiz-form.css
  var quiz_form_default = ':host{--button-min-height:40px;--button-padding:7px 19px;--button-font-size:16px;--button-font-weight:500;--button-line-height:24px;--button-disabled-opacity:.5;--button-color:#fff;--outline-button-color:#111827;--button-background:#111827;--outline-button-background:#fff;--button-border-width:1px;--button-border-style:solid;--button-border-color:#374151;--outline-button-border-color:#d1d5db;--button-border-radius:8px;--button-focus-ring-color:#374151;--button-focus-ring-width:2px;--button-focus-ring-offset:2px;--icon-button-size:40px;--icon-button-border-radius:50%;--controls-margin-top:40px;--controls-gap:12px;--controls-align:center;--page-padding:0;--page-max-width:576px;--page-background:none;--page-border-radius:12px;--page-border-width:1px;--page-border-style:solid;--page-border-color:transparent;--page-shadow:none;--progress-margin-bottom:40px;--progress-title-color:inherit;--progress-title-font-size:14px;--progress-title-font-weight:700;--progress-title-line-height:20px;--progress-title-align:center;--progress-title-margin-bottom:8px;--progress-bar-width:100%;--progress-bar-height:12px;--progress-bar-bg:#e5e7eb;--progress-bar-track-bg:linear-gradient(to right,#84cc16,#84cc16);--progress-bar-border-width:0;--progress-bar-border-style:solid;--progress-bar-border-color:transparent;--progress-bar-border-radius:3px;box-sizing:border-box;flex-direction:column;justify-content:center;align-items:center;display:flex}.page{box-sizing:border-box;width:100%;max-width:var(--page-max-width);padding:var(--page-padding);background:var(--page-background);border-color:var(--page-border-color);border-style:var(--page-border-style);border-width:var(--page-border-width);border-radius:var(--page-border-radius);box-shadow:var(--page-shadow)}.btn{box-sizing:border-box;min-height:var(--button-min-height);padding:var(--button-padding);font-family:inherit;font-size:var(--button-font-size);font-weight:var(--button-font-weight);line-height:var(--button-line-height);color:var(--button-color);appearance:none;cursor:default;background:var(--button-background);border-color:var(--button-border-color);border-style:var(--button-border-style);border-width:var(--button-border-width);border-radius:var(--button-border-radius);justify-content:center;align-items:center;display:inline-flex}.btn:focus-visible{outline:var(--button-focus-ring-color)solid var(--button-focus-ring-width);outline-offset:var(--button-focus-ring-offset)}.btn:disabled,.btn[data-disabled]{pointer-events:none;opacity:var(--button-disabled-opacity);outline:none}.btn_outline{--button-color:var(--outline-button-color);--button-background:var(--outline-button-background);--button-border-color:var(--outline-button-border-color)}.btn_icon{--button-border-radius:var(--icon-button-border-radius);width:var(--icon-button-size);height:var(--icon-button-size);min-height:initial;padding:0}.controls{gap:var(--controls-gap);align-items:center;justify-content:var(--controls-align);margin-top:var(--controls-margin-top);flex-wrap:wrap;display:flex}.progress{margin-bottom:var(--progress-margin-bottom)}.progress__title{padding:0 0 var(--progress-title-margin-bottom);font-size:var(--progress-title-font-size);font-weight:var(--progress-title-font-weight);line-height:var(--progress-title-line-height);text-align:var(--progress-title-align);margin:0}.progress__bar{--progress-value:10%;width:var(--progress-bar-width);height:var(--progress-bar-height);background:var(--progress-bar-bg);border-color:var(--progress-bar-border-color);border-style:var(--progress-bar-border-style);border-width:var(--progress-bar-border-width);border-radius:var(--progress-bar-border-radius);display:flex;position:relative;overflow:hidden}.progress__bar:before{content:"";background:var(--progress-bar-track-bg);width:100%;height:100%;clip-path:xywh(0 0 var(--progress-value)100%);position:absolute;top:0;left:0}.hidden,[hidden]{display:none!important}';

  // src/components/quiz/quiz-form.js
  var QuizForm = class extends HTMLElement {
    constructor() {
      super();
      this._submitHandler = null;
      this.progressTitle = this.getAttribute("progress-title") || "Question {n} of {total}";
      this.backButtonLabel = this.getAttribute("back-button-label") || "Back";
      this.nextButtonLabel = this.getAttribute("next-button-label") || "Next";
      this.submitButtonLabel = this.getAttribute("submit-button-label") || "Finish";
      this.handleChildrenChange = this.handleChildrenChange.bind(this);
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
      this.handleQuizQuestionChange = this.handleQuizQuestionChange.bind(this);
      this.render();
    }
    /**
     * @returns {QuizPage[]}
     */
    get pages() {
      return Array.from(this.children).filter((child) => child instanceof QuizPage);
    }
    /**
     * @return {boolean}
     */
    get shouldHideProgress() {
      const value = this.getAttribute("hide-progress");
      return value != null && value !== "false";
    }
    /**
     * @return {boolean}
     */
    get shouldHideBackButton() {
      const value = this.getAttribute("hide-back-button");
      return value != null && value !== "false";
    }
    /**
     * @returns {{
     *   childrenSlot: HTMLSlotElement;
     *   backButton: HTMLButtonElement;
     *   nextButton: HTMLButtonElement;
     *   progressTitle: HTMLElement;
     *   progressBar: HTMLElement;
     * }}
     */
    get elements() {
      return {
        childrenSlot: this.shadowRoot.querySelector('[data-element="children-slot"]'),
        backButton: this.shadowRoot.querySelector('[data-element="back-button"]'),
        nextButton: this.shadowRoot.querySelector('[data-element="next-button"]'),
        progressTitle: this.shadowRoot.querySelector('[data-element="progress-title"]'),
        progressBar: this.shadowRoot.querySelector('[data-element="progress-bar"]')
      };
    }
    /**
     * @returns {QuizPage | null}
     */
    get currentPage() {
      const page = this.pages.find((page2) => !page2.hidden);
      return page || null;
    }
    /**
     * @returns {Function | null}
     */
    get onSubmit() {
      return this._submitHandler;
    }
    /**
     * @param {Function | null}
     */
    set onSubmit(value) {
      this._submitHandler = value;
    }
    /**
     * @returns {object[]}
     */
    get results() {
      return this.pages.flatMap((page) => page.result);
    }
    /**
     * @param {QuizPage} page
     * @returns {boolean}
     */
    isFirstPage(page) {
      const pages = this.pages;
      if (pages.length > 0) {
        const index = pages.indexOf(page);
        return index === 0;
      }
      return false;
    }
    /**
     * @param {QuizPage} page
     * @returns {boolean}
     */
    isLastPage(page) {
      const pages = this.pages;
      if (pages.length > 0) {
        const index = pages.indexOf(page);
        return index === pages.length - 1;
      }
      return false;
    }
    /**
     * @param {QuizPage} page
     * @returns {boolean}
     */
    goToPageAfter(page) {
      const pages = this.pages;
      const index = pages.indexOf(page);
      const nextPage = pages[index + 1];
      if (nextPage) {
        page.hidden = true;
        nextPage.hidden = false;
        return true;
      }
      return false;
    }
    /**
     * @param {QuizPage} page
     * @returns {boolean}
     */
    goToPageBefore(page) {
      const pages = this.pages;
      const index = pages.indexOf(page);
      const prevPage = pages[index - 1];
      if (prevPage) {
        page.hidden = true;
        prevPage.hidden = false;
        return true;
      }
      return false;
    }
    render() {
      const style = document.createElement("style");
      style.innerText = quiz_form_default;
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }
      this.shadowRoot.innerHTML = html`
      <div class="page">
        <div class="progress ${this.shouldHideProgress ? "hidden" : ""}">
          <p class="progress__title" data-element="progress-title">
            !${this.progressTitle}
          </p>
          <div class="progress__bar" data-element="progress-bar"></div>
        </div>

        <slot data-element="children-slot"></slot>
        <div class="controls">
          <button
            class="btn btn_icon btn_outline ${this.shouldHideBackButton ? "hidden" : ""}"
            type="button"
            data-element="back-button"
            aria-label="!${this.backButtonLabel}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" />
            </svg>
          </button>
          <button
            class="btn"
            type="button"
            data-element="next-button"
          >
            !${this.nextButtonLabel}
          </button>
        </div>
      </div>
    `;
      this.shadowRoot.prepend(style);
    }
    updatePages() {
      const pages = this.pages;
      if (pages.length > 0) {
        const currentPage = pages.find((page) => !page.hidden) || pages[0];
        pages.forEach((page) => {
          if (page !== currentPage) {
            page.hidden = true;
          }
        });
      }
    }
    updateButtons() {
      const currentPage = this.currentPage;
      if (currentPage) {
        const elements = this.elements;
        if (elements.backButton) {
          elements.backButton.hidden = this.isFirstPage(currentPage);
        }
        if (currentPage.valid) {
          elements.nextButton.removeAttribute("data-disabled");
          elements.nextButton.removeAttribute("tabindex");
        } else {
          elements.nextButton.setAttribute("data-disabled", "");
          elements.nextButton.setAttribute("tabindex", -1);
        }
        if (this.isLastPage(currentPage)) {
          elements.nextButton.setAttribute("type", "submit");
          elements.nextButton.innerText = this.submitButtonLabel;
        } else {
          elements.nextButton.setAttribute("type", "button");
          elements.nextButton.innerText = this.nextButtonLabel;
        }
      }
    }
    updateProgress() {
      const elements = this.elements;
      const pages = this.pages;
      const currentPageIndex = pages.findIndex((page) => !page.hidden);
      elements.progressTitle.innerText = t(this.progressTitle, {
        n: currentPageIndex + 1,
        total: pages.length
      });
      elements.progressBar.style.setProperty("--progress-value", ((currentPageIndex + 1) / pages.length * 100).toFixed("2") + "%");
    }
    handleChildrenChange() {
      this.updatePages();
      this.updateButtons();
      this.updateProgress();
    }
    handleNextButtonClick() {
      const nextButton = this.elements.nextButton;
      const currentPage = this.currentPage;
      if (currentPage && currentPage.valid) {
        if (nextButton.type === "submit") {
          this.submit();
        } else {
          this.goToPageAfter(currentPage);
          this.updateButtons();
          this.updateProgress();
        }
      }
    }
    handleBackButtonClick() {
      const currentPage = this.currentPage;
      if (currentPage) {
        this.goToPageBefore(currentPage);
        this.updateButtons();
        this.updateProgress();
      }
    }
    /**
     * @param {QuizQuestionChangeEvent} event
     */
    handleQuizQuestionChange(event) {
      const question = event.target;
      if (this.contains(question)) {
        this.updateButtons();
      }
    }
    submit() {
      let onSubmit = window[this.getAttribute("onsubmit") || ""];
      if (typeof onSubmit !== "function") {
        onSubmit = this._submitHandler;
      }
      if (onSubmit) {
        onSubmit(this.results, this);
      }
    }
    connectedCallback() {
      const elements = this.elements;
      elements.childrenSlot.addEventListener("slotchange", this.handleChildrenChange);
      elements.nextButton.addEventListener("click", this.handleNextButtonClick);
      elements.backButton.addEventListener("click", this.handleBackButtonClick);
      this.addEventListener(QuizQuestionChangeEvent.type, this.handleQuizQuestionChange);
    }
    disconnectedCallback() {
      const elements = this.elements;
      elements.childrenSlot.removeEventListener("slotchange", this.handleChildrenChange);
      elements.nextButton.removeEventListener("click", this.handleNextButtonClick);
      elements.backButton.removeEventListener("click", this.handleBackButtonClick);
      this.removeEventListener(QuizQuestionChangeEvent.type, this.handleQuizQuestionChange);
    }
  };

  // inline-css:src/components/quiz/quiz-question.css
  var quiz_question_default = ':host{--title-margin:0 0 4px;--title-font-size:18px;--title-font-weight:700;--title-line-height:28px;--title-color:#101828;--message-font-size:16px;--message-font-weight:400;--message-line-height:24px;--message-color:#4a5565;--options-gap:16px;--options-margin:16px 0 0;text-align:center;width:100%;display:block}.title{margin:var(--title-margin);font-size:var(--title-font-size);font-weight:var(--title-font-weight);line-height:var(--title-line-height);color:var(--title-color);text-wrap:balance}slot[name=""]{gap:var(--options-gap);margin:var(--options-margin);display:grid}slot[name=message]{font-size:var(--message-font-size);font-weight:var(--message-font-weight);line-height:var(--message-line-height);color:var(--message-color);text-wrap:balance}';

  // src/components/quiz/quiz-checkbox-group.js
  var QuizCheckboxGroup = class extends QuizQuestion {
    constructor() {
      super();
      this.handleQuizOptionChange = this.handleQuizOptionChange.bind(this);
      this.render();
    }
    /**
     * @returns {QuizOption[]}
     */
    get options() {
      return Array.from(this.children).filter((child) => child instanceof QuizOption);
    }
    /**
     * @returns {string[]}
     */
    get value() {
      return this.options.filter((option) => option.checked).map((option) => option.value);
    }
    /**
     * @returns {object}
     */
    get result() {
      return { type: "checkbox", ...super.result };
    }
    render() {
      const title = this.getAttribute("title") || "";
      const style = document.createElement("style");
      style.innerText = quiz_question_default;
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }
      this.shadowRoot.innerHTML = html`
      <div class="title">!${title}</div>
      <slot name="message"></slot>
      <slot name=""></slot>
    `;
      this.shadowRoot.prepend(style);
    }
    /**
     * @param {QuizOptionChangeEvent} event
     */
    handleQuizOptionChange(event) {
      const option = event.target;
      if (this.options.includes(option)) {
        this.dispatchEvent(new QuizQuestionChangeEvent());
      }
    }
    connectedCallback() {
      this.addEventListener(QuizOptionChangeEvent.type, this.handleQuizOptionChange);
    }
    disconnectedCallback() {
      this.removeEventListener(QuizOptionChangeEvent.type, this.handleQuizOptionChange);
    }
  };

  // src/util/random.js
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function getRandomString(length = 5) {
    if (!Number.isInteger(length)) {
      throw new TypeError('Argument "length" must be an integer.');
    }
    if (length < 0) {
      throw new RangeError('Argument "length" must be \u2265 0.');
    }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i += 1) {
      result += chars[getRandomInt(0, chars.length - 1)];
    }
    return result;
  }

  // inline-css:src/components/quiz/quiz-option.css
  var quiz_option_default = ":host{--max-width:576px;--padding:16px 16px 16px 24px;--font-size:14px;--font-weight:500;--line-height:20px;--color:#111827;--checked-color:#fff;--background:#fff;--checked-background:#111827;--border-width:1px;--border-style:solid;--border-color:#d1d5db;--border-radius:8px;--checked-border-color:#374151;--shadow:#0000000d 0px 1px 2px 0px;--checked-shadow:none;--focus-ring-color:#374151;--focus-ring-width:2px;--focus-ring-offset:2px;--check-icon-color:inherit;width:100%;display:block;position:relative}.input{opacity:0;position:absolute}.label{box-sizing:border-box;padding:var(--padding);font-family:inherit;font-size:var(--font-size);font-weight:var(--font-weight);line-height:var(--line-height);color:var(--color);text-align:left;background:var(--background);border-color:var(--border-color);border-style:var(--border-style);border-width:var(--border-width);border-radius:var(--border-radius);box-shadow:var(--shadow);grid-template-columns:1fr auto;display:grid}.check-icon{visibility:hidden;color:var(--check-icon-color)}.input:focus-visible~.label{outline:var(--focus-ring-color)solid var(--focus-ring-width);outline-offset:var(--focus-ring-offset)}.input:checked~.label{--color:var(--checked-color);--background:var(--checked-background);--border-color:var(--checked-border-color);--shadow:var(--checked-shadow)}.input:checked~.label>.check-icon{visibility:visible}";

  // src/components/quiz/quiz-option.js
  var QuizOptionChangeEvent = class _QuizOptionChangeEvent extends CustomEvent {
    static get type() {
      return "quizOptionChange";
    }
    constructor() {
      super(_QuizOptionChangeEvent.type, { bubbles: true });
    }
  };
  var QuizOption = class extends HTMLElement {
    constructor() {
      super();
      this.id = getRandomString();
      this.handleChange = this.handleChange.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.render();
      this.input.checked = this.hasAttribute("checked");
    }
    /**
     * @returns {QuizRadioGroup | null}
     */
    get parentQuestion() {
      let parent = this.parentElement;
      while (parent) {
        if (parent instanceof QuizRadioGroup || parent instanceof QuizCheckboxGroup) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    }
    /**
     * @returns {string}
     */
    get value() {
      return this.getAttribute("value") || this.innerText || "";
    }
    /**
     * @return {HTMLInputElement | null}
     */
    get input() {
      return this.shadowRoot.querySelector("input");
    }
    /**
     * @returns {boolean}
     */
    get checked() {
      return this.input.checked;
    }
    /**
     * @param {boolean} value
     */
    set checked(value) {
      this.setChecked(value, { shouldDispatchEvent: true });
    }
    /**
     * @param {boolean} checked
     * @param {object} [opts]
     * @param {boolean} [opts.shouldDispatchEvent]
     */
    setChecked(checked, opts = {}) {
      this.input.checked = checked;
      if (opts.shouldDispatchEvent) {
        this.dispatchEvent(new QuizOptionChangeEvent());
      }
    }
    render() {
      const style = document.createElement("style");
      style.textContent = quiz_option_default;
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }
      this.shadowRoot.innerHTML = html`
      <input id="${this.id}" class="input" type="checkbox">
      <label for="${this.id}" class="label">
        <slot name=""></slot>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="20"
          height="20"
          fill="currentColor"
          class="check-icon"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
        </svg>
      </label>
    `;
      this.shadowRoot.prepend(style);
    }
    /**
     * @param {ChangeEvent} event
     */
    handleChange(event) {
      this.checked = event.target.checked;
    }
    /**
     * @param {KeyboardEvent} event
     */
    handleKeyDown(event) {
      if (event.key === "Enter") {
        this.checked = !this.checked;
      }
    }
    connectedCallback() {
      this.input.addEventListener("change", this.handleChange);
      this.input.addEventListener("keydown", this.handleKeyDown);
    }
    disconnectedCallback() {
      this.input.removeEventListener("change", this.handleChange);
      this.input.removeEventListener("keydown", this.handleKeyDown);
    }
  };

  // src/components/quiz/quiz-radio-group.js
  var QuizRadioGroup = class extends QuizQuestion {
    constructor() {
      super();
      this.handleQuizOptionChange = this.handleQuizOptionChange.bind(this);
      this.render();
    }
    /**
     * @returns {QuizOption[]}
     */
    get options() {
      return Array.from(this.children).filter((child) => child instanceof QuizOption);
    }
    /**
     * @returns {string}
     */
    get value() {
      const selectedOption = this.options.find((option) => option.checked);
      if (selectedOption) {
        return selectedOption.value;
      }
      return "";
    }
    /**
     * @returns {object}
     */
    get result() {
      return { type: "radio", ...super.result };
    }
    render() {
      const title = this.getAttribute("title") || "";
      const style = document.createElement("style");
      style.innerText = quiz_question_default;
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" });
      }
      this.shadowRoot.innerHTML = html`
      <div class="title">!${title}</div>
      <slot name="message"></slot>
      <slot name=""></slot>
    `;
      this.shadowRoot.prepend(style);
    }
    /**
     * @param {QuizOptionChangeEvent} event
     */
    handleQuizOptionChange(event) {
      const options = this.options;
      const selectedOption = event.target;
      if (options.includes(selectedOption)) {
        this.options.map((option) => {
          if (selectedOption !== option) {
            option.setChecked(false);
          }
        });
        this.dispatchEvent(new QuizQuestionChangeEvent());
      }
    }
    connectedCallback() {
      this.addEventListener(QuizOptionChangeEvent.type, this.handleQuizOptionChange);
    }
    disconnectedCallback() {
      this.removeEventListener(QuizOptionChangeEvent.type, this.handleQuizOptionChange);
    }
  };

  // src/util/define-custom-element.js
  function defineCustomElement(name, component) {
    if (customElements.get(name) === void 0) {
      customElements.define(name, component);
    }
  }

  // src/components/quiz/quiz.js
  defineCustomElement("quiz-form", QuizForm);
  defineCustomElement("quiz-page", QuizPage);
  defineCustomElement("quiz-radio-group", QuizRadioGroup);
  defineCustomElement("quiz-checkbox-group", QuizCheckboxGroup);
  defineCustomElement("quiz-option", QuizOption);
})();
