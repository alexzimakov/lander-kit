import { fn } from '@storybook/test';
import { html } from '../../util/html.js';
import { buildAttrs } from '../../util/build-attrs.js';
import './quiz.js';

export default {
  tags: ['autodocs'],
  render: ({
    shouldHideBackButton,
    shouldHideProgress,
    backButtonLabel,
    nextButtonLabel,
    submitButtonLabel,
  }) => {
    return html`
      <quiz-form ${buildAttrs({
        'id': 'quiz',
        'hide-back-button': shouldHideBackButton,
        'hide-progress': shouldHideProgress,
        'back-button-label': backButtonLabel,
        'next-button-label': nextButtonLabel,
        'submit-button-label': submitButtonLabel,
      })}>
        <quiz-page>
          <quiz-radio-group name="sex" title="What is your gender?">
            <div slot="message">
              Let us know how you identify. This helps us better understand our audience.
            </div>
            <quiz-option value="male">Male 👨</quiz-option>
            <quiz-option value="female">Female 👩</quiz-option>
            <quiz-option value="unknown">Prefer not to say 🤐</quiz-option>
          </quiz-radio-group>

          <quiz-radio-group name="age" title="What is your age group?">
            <quiz-option>Under 18</quiz-option>
            <quiz-option>18–24</quiz-option>
            <quiz-option>25–34</quiz-option>
            <quiz-option>35–44</quiz-option>
            <quiz-option>45-54</quiz-option>
            <quiz-option>55+</quiz-option>
          </quiz-radio-group>
        </quiz-page>

        <quiz-page>
          <quiz-radio-group name="social_media_use" title="How often do you use social media?">
            <quiz-option>Several times a day</quiz-option>
            <quiz-option>Once a day</quiz-option>
            <quiz-option>A few times a week</quiz-option>
            <quiz-option>Rarely</quiz-option>
            <quiz-option>Never</quiz-option>
          </quiz-radio-group>
        </quiz-page>

        <quiz-page>
          <quiz-checkbox-group name="transport" title="What is your preferred mode of transportation?">
            <quiz-option>Car 🚗</quiz-option>
            <quiz-option>Bicycle 🚴‍♀️</quiz-option>
            <quiz-option>Public transit 🚌</quiz-option>
            <quiz-option>Walking 🚶‍♂️</quiz-option>
            <quiz-option>Ride-sharing services 🚖</quiz-option>
          </quiz-checkbox-group>
        </quiz-page>

        <quiz-page>
          <quiz-checkbox-group name="movies" title="Which type of movies do you enjoy the most?">
            <quiz-option>Action 💥</quiz-option>
            <quiz-option>Comedy 😂</quiz-option>
            <quiz-option>Drama 🎭</quiz-option>
            <quiz-option>Horror 👻</quiz-option>
            <quiz-option>Documentary 📚</quiz-option>
          </quiz-checkbox-group>
        </quiz-page>

        <quiz-page>
          <quiz-checkbox-group name="motivation" title="What motivates you the most">
            <quiz-option>Personal growth 🌱</quiz-option>
            <quiz-option>Recognition 🏆</quiz-option>
            <quiz-option>Financial rewards 💰</quiz-option>
            <quiz-option>Team success 🤝</quiz-option>
            <quiz-option>Passion for the subject ️🔥</quiz-option>
          </quiz-checkbox-group>
        </quiz-page>
      </quiz-form>

      <script>
        (function () {
          const quizForm = document.querySelector('#quiz');
          quizForm.onSubmit = (results) => {
            alert('Quiz results:\n\n' + JSON.stringify(results, null, 4));
          };
        })();
      </script>
    `;
  },
  argTypes: {
    shouldHideBackButton: { control: 'boolean' },
    shouldHideProgress: { control: 'boolean' },
    backButtonLabel: { control: 'text' },
    nextButtonLabel: { control: 'text' },
    onSubmit: { action: 'onSubmit' },
  },
  args: {
    shouldHideBackButton: false,
    shouldHideProgress: false,
    backButtonLabel: 'Back',
    nextButtonLabel: 'Next',
    submitButtonLabel: 'Submit',
    onSubmit: fn(),
  },
};

export const Default = {};
