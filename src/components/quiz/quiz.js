import { QuizForm } from './quiz-form.js';
import { QuizPage } from './quiz-page.js';
import { QuizRadioGroup } from './quiz-radio-group.js';
import { QuizCheckboxGroup } from './quiz-checkbox-group.js';
import { QuizOption } from './quiz-option.js';
import { defineCustomElement } from '../../util/define-custom-element.js';

defineCustomElement('quiz-form', QuizForm);
defineCustomElement('quiz-page', QuizPage);
defineCustomElement('quiz-radio-group', QuizRadioGroup);
defineCustomElement('quiz-checkbox-group', QuizCheckboxGroup);
defineCustomElement('quiz-option', QuizOption);
