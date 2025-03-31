import { QuizPage } from './quiz-page.js';
import { QuizQuestionChangeEvent } from './quiz-question.js';
import { html } from '../../util/html.js';
import styles from './quiz-form.css?inline';

export class QuizForm extends HTMLElement {
  constructor() {
    super();
    this._submitHandler = null;
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
  get shouldHideBackButton() {
    return this.hasAttribute('hide-back-button');
  }

  /**
   * @returns {HTMLSlotElement}
   */
  get defaultSlot() {
    return this.shadowRoot.querySelector('slot[name=""]');
  }

  /**
   * @returns {HTMLButtonElement | null}
   */
  get backButton() {
    return this.shadowRoot.querySelector('button.prev');
  }

  /**
   * @returns {HTMLButtonElement}
   */
  get nextButton() {
    return this.shadowRoot.querySelector('button.next');
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

    let backButton = '';
    if (!this.shouldHideBackButton) {
      backButton = html`
        <button
          class="btn btn_icon btn_outline prev"
          type="button"
          aria-label="${this.backButtonLabel}"
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
      `;
    }

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.shadowRoot.innerHTML = html`
      <div class="body">
        <div class="page">
          <slot name=""></slot>
          <div class="controls">
            ${backButton}
            <button class="btn next" type="button">
              ${this.nextButtonLabel}
            </button>
          </div>
        </div>
      </div>
    `;
    this.shadowRoot.prepend(style);
  }

  updatePages() {
    const pages = this.pages;
    const currentPage = pages.find((page) => !page.hidden);
    pages.forEach((page) => {
      if (page !== currentPage) {
        page.hidden = true;
      }
    });
  }

  updateButtons() {
    const currentPage = this.currentPage;
    if (currentPage) {
      if (this.backButton) {
        this.backButton.hidden = this.isFirstPage(currentPage);
      }

      if (currentPage.valid) {
        this.nextButton.removeAttribute('data-disabled');
      } else {
        this.nextButton.setAttribute('data-disabled', '');
      }

      if (this.isLastPage(currentPage)) {
        this.nextButton.setAttribute('type', 'submit');
        this.nextButton.innerText = this.submitButtonLabel;
      } else {
        this.nextButton.setAttribute('type', 'button');
        this.nextButton.innerText = this.nextButtonLabel;
      }
    }
  }

  handleChildrenChange() {
    this.updatePages();
    this.updateButtons();
  }

  handleNextButtonClick() {
    const nextButton = this.nextButton;
    const currentPage = this.currentPage;
    if (currentPage && currentPage.valid) {
      if (nextButton.type === 'submit') {
        this.submit();
      } else {
        this.goToPageAfter(currentPage);
        this.updateButtons();
      }
    }
  }

  handleBackButtonClick() {
    const currentPage = this.currentPage;
    if (currentPage) {
      this.goToPageBefore(currentPage);
      this.updateButtons();
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
    this.defaultSlot.addEventListener('slotchange', this.handleChildrenChange);
    this.nextButton.addEventListener('click', this.handleNextButtonClick);
    if (this.backButton) {
      this.backButton.addEventListener('click', this.handleBackButtonClick);
    }
    this.addEventListener(QuizQuestionChangeEvent.type, this.handleQuizQuestionChange);
  }

  disconnectedCallback() {
    this.defaultSlot.removeEventListener('slotchange', this.handleChildrenChange);
    this.nextButton.removeEventListener('click', this.handleNextButtonClick);
    if (this.backButton) {
      this.backButton.removeEventListener('click', this.handleBackButtonClick);
    }
    this.removeEventListener(QuizQuestionChangeEvent.type, this.handleQuizQuestionChange);
  }
}
