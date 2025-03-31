import { QuizRadioGroup } from './quiz-radio-group.js';
import { QuizCheckboxGroup } from './quiz-checkbox-group.js';
import { getRandomString } from '../../util/random.js';
import { html } from '../../util/html.js';
import styles from './quiz-option.css?inline';

export class QuizOptionChangeEvent extends CustomEvent {
  static get type() {
    return 'quizOptionChange';
  }

  constructor() {
    super(QuizOptionChangeEvent.type, { bubbles: true });
  }
}

export class QuizOption extends HTMLElement {
  constructor() {
    super();
    this.id = getRandomString();
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.render();
    this.input.checked = this.hasAttribute('checked');
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
    return this.getAttribute('value') || this.innerText || '';
  }

  /**
   * @return {HTMLInputElement | null}
   */
  get input() {
    return this.shadowRoot.querySelector('input');
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
    const style = document.createElement('style');
    style.textContent = styles;

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
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
    if (event.key === 'Enter') {
      this.checked = !this.checked;
    }
  }

  connectedCallback() {
    this.input.addEventListener('change', this.handleChange);
    this.input.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    this.input.removeEventListener('change', this.handleChange);
    this.input.removeEventListener('keydown', this.handleKeyDown);
  }
}
