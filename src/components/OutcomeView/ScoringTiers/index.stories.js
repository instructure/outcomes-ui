import React from 'react'
import { object } from '@storybook/addon-knobs'
import * as sbConstants from '../../../../.storybook/constants'
import ScoringTiers from './'

export default {
  title: 'ScoringTiers'
}

export const noResults = () => (
  <ScoringTiers
    outcomeResult={null}
    scoringTiers={object('ScoringTiers', sbConstants.defaultScoringTiers)}
    scoringMethod={object('ScoringMethod', sbConstants.defaultScoringMethod)}
  />
)

export const results = () => (
  <ScoringTiers
    outcomeResult={object('OutcomeResult', sbConstants.resultAverageScore)}
    scoringTiers={object('ScoringTiers', sbConstants.scoringTiersWithResults)}
    scoringMethod={object('ScoringMethod', sbConstants.defaultScoringMethod)}
  />
)
