import { QuizPage } from './quiz-page.js';
import { QuizQuestionChangeEvent } from './quiz-question.js';
import { html } from '../../util/html.js';
import { t } from '../../util/format.js';
import styles from './quiz-form.css?inline';

export class QuizForm extends HTMLElement {
  constructor() {
    super();
    this._submitHandler = null;
    this.progressTitle = this.getAttribute('progress-title') || 'Question {n} of {total}';
    this.backButtonLabel = this.getAttribute('back-button-label') || 'Back';
    this.nextButtonLabel = this.getAttribute('next-button-label') || 'Next';
    this.submitButtonLabel = this.getAttribute('submit-button-label') || 'Finish';
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
    const value = this.getAttribute('hide-progress');
    return value != null && value !== 'false';
  }

  /**
   * @return {boolean}
   */
  get shouldHideBackButton() {
    const value = this.getAttribute('hide-back-button');
    return value != null && value !== 'false';
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
      progressBar: this.shadowRoot.querySelector('[data-element="progress-bar"]'),
    };
  }

  /**
   * @returns {QuizPage | null}
   */
  get currentPage() {
    const page = this.pages.find((page) => !page.hidden);
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
    const style = document.createElement('style');
    style.innerText = styles;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.shadowRoot.innerHTML = html`
      <div class="body">
        <div class="page">
          <div class="progress ${this.shouldHideProgress ? 'hidden' : ''}">
            <p class="progress__title" data-element="progress-title">
              !${this.progressTitle}
            </p>
            <div class="progress__bar" data-element="progress-bar"></div>
          </div>

          <slot data-element="children-slot"></slot>
          <div class="controls">
            <button
              class="btn btn_icon btn_outline ${this.shouldHideBackButton ? 'hidden' : ''}"
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
        elements.nextButton.removeAttribute('data-disabled');
        elements.nextButton.removeAttribute('tabindex');
      } else {
        elements.nextButton.setAttribute('data-disabled', '');
        elements.nextButton.setAttribute('tabindex', -1);
      }

      if (this.isLastPage(currentPage)) {
        elements.nextButton.setAttribute('type', 'submit');
        elements.nextButton.innerText = this.submitButtonLabel;
      } else {
        elements.nextButton.setAttribute('type', 'button');
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
      total: pages.length,
    });
    elements.progressBar.style.setProperty('--progress-value', (
      (currentPageIndex + 1) / pages.length * 100
    ).toFixed('2') + '%');
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
      if (nextButton.type === 'submit') {
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
    let onSubmit = window[this.getAttribute('onsubmit') || ''];
    if (typeof onSubmit !== 'function') {
      onSubmit = this._submitHandler;
    }

    if (onSubmit) {
      onSubmit(this.results, this);
    }
  }

  connectedCallback() {
    const elements = this.elements;
    elements.childrenSlot.addEventListener('slotchange', this.handleChildrenChange);
    elements.nextButton.addEventListener('click', this.handleNextButtonClick);
    elements.backButton.addEventListener('click', this.handleBackButtonClick);
    this.addEventListener(QuizQuestionChangeEvent.type, this.handleQuizQuestionChange);
  }

  disconnectedCallback() {
    const elements = this.elements;
    elements.childrenSlot.removeEventListener('slotchange', this.handleChildrenChange);
    elements.nextButton.removeEventListener('click', this.handleNextButtonClick);
    elements.backButton.removeEventListener('click', this.handleBackButtonClick);
    this.removeEventListener(QuizQuestionChangeEvent.type, this.handleQuizQuestionChange);
  }
}
