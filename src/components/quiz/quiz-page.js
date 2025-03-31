import { QuizForm } from './quiz-form.js';
import { QuizQuestion } from './quiz-question.js';
import { html } from '../../util/html.js';
import styles from './quiz-page.css?inline';

export class QuizPage extends HTMLElement {
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
    const style = document.createElement('style');
    style.innerText = styles;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.shadowRoot.innerHTML = html`
      <div class="container">
        <slot name=""></slot>
      </div>
    `;
    this.shadowRoot.prepend(style);
  }
}
