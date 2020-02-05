import React from 'react'
import { object } from '@storybook/addon-knobs'
import { outcomeWithScoring, defaultScore } from '../../../../.storybook/constants'
import Score from './'

export default {
  title: 'OutcomesPerStudent Score'
}

export const standard = () => (
  <Score
    outcome={ object('Outcome', outcomeWithScoring) }
    score={ object('Score', defaultScore) }
  />
)
