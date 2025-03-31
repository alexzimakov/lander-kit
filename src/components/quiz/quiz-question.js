import { QuizPage } from './quiz-page.js';

export class QuizQuestionChangeEvent extends CustomEvent {
  static get type() {
    return 'quizQuestionChange';
  }

  constructor() {
    super(QuizQuestionChangeEvent.type, { bubbles: true });
  }
}

export class QuizQuestion extends HTMLElement {
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
    return this.hasAttribute('optional');
  }

  /**
   * @returns {string | string[]}
   */
  get value() {
    return '';
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
    return this.getAttribute('name') || '';
  }

  /**
   * @returns {object}
   */
  get result() {
    return {
      name: this.name,
      value: this.value,
    };
  }
}
