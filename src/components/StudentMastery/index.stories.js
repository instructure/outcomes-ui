import React from 'react'
import { object, boolean } from '@storybook/addon-knobs'
import { individualMasteryResults, individualNoMasteryResults } from '../../../.storybook/constants'
import StudentMastery from './'

export default {
  title: 'StudentMastery'
}

export const opportunitiesForGrowth = () => (
  <StudentMastery
    artifactType="quizzes.quiz"
    artifactId=""
    userUuid=""
    mastery={ boolean('Mastery', false) }
    masteryText={ null }
    loadIndividualResults={ () => {} }
    results={ object('NoMasteryResults', individualNoMasteryResults) }
    displayOutcomeLabel={ boolean('DisplayOutcomeLabel', true) }
    state="loaded"
  />
)

export const mastery = () => (
  <StudentMastery
    artifactType="quizzes.quiz"
    artifactId=""
    userUuid=""
    mastery={ boolean('Mastery', true) }
    masteryText={ null }
    loadIndividualResults={ () => {} }
    results={ object('MasteryResults', individualMasteryResults) }
    displayOutcomeLabel={ boolean('DisplayOutcomeLabel', true) }
    state="loaded"
  />
)

export const combinedResults = () => (
  <div>
    <StudentMastery
      artifactType="quizzes.quiz"
      artifactId=""
      userUuid=""
      mastery={ true }
      masteryText={ null }
      loadIndividualResults={ () => {} }
      results={ object('MasteryResults', individualMasteryResults) }
      displayOutcomeLabel={ boolean('DisplayOutcomeLabel', true) }
      state="loaded"
    />
    <StudentMastery
      artifactType="quizzes.quiz"
      artifactId=""
      userUuid=""
      mastery={ false }
      masteryText={ null }
      loadIndividualResults={ () => {} }
      results={ object('NoMasteryResults', individualNoMasteryResults) }
      displayOutcomeLabel={ boolean('DisplayOutcomeLabel', true) }
      state="loaded"
    />
  </div>
)
