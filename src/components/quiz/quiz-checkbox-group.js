import { QuizQuestion, QuizQuestionChangeEvent } from './quiz-question.js';
import { QuizOption, QuizOptionChangeEvent } from './quiz-option.js';
import { html } from '../../util/html.js';
import styles from './quiz-question.css?inline';

export class QuizCheckboxGroup extends QuizQuestion {
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
    return this.options
      .filter((option) => option.checked)
      .map((option) => option.value);
  }

  /**
   * @returns {object}
   */
  get result() {
    return { type: 'checkbox', ...super.result };
  }

  render() {
    const title = this.getAttribute('title') || '';

    const style = document.createElement('style');
    style.innerText = styles;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
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
}
