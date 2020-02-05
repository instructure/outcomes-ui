import React from 'react'
import { object, boolean } from '@storybook/addon-knobs'
import { defaultScoringMethod } from '../../../../.storybook/constants'
import MasteryDescription from './'

export default {
  title: 'MasteryDescription'
}

export const standard = () => (
  <MasteryDescription
    artifactTypeName="Quiz"
    displayMasteryPercentText={ boolean('Display Mastery Percent Text', true) }
    scoringMethod={ object('ScoringMethod', defaultScoringMethod) }
  />
)
