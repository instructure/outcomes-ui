import React from 'react'
import { object } from '@storybook/addon-knobs'
import { defaultOutcomes } from '../../../.storybook/constants'
import OutcomeSelectionList from './'

export default {
  title: 'OutcomeSelectionList'
}

export const standard = () => (
  <OutcomeSelectionList
    setFocusedOutcome={ () => {} }
    isOutcomeSelected={ () => {} }
    selectOutcomeIds={ () => {} }
    deselectOutcomeIds={ () => {} }
    outcomes={ object('Outcomes', defaultOutcomes()) }
  />
)
