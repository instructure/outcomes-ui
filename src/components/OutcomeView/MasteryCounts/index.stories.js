import React from 'react'
import { object } from '@storybook/addon-knobs'
import { defaultScoringMethod, outcomeRollup } from '../../../../.storybook/constants'
import MasteryCounts from './'

export default {
  title: 'MasteryCounts'
}

export const standard = () => (
  <MasteryCounts
    outcomeResult={object('Outcome Result', outcomeRollup) }
    scoringMethod={object('Scoring Method', defaultScoringMethod)}
  />
)
