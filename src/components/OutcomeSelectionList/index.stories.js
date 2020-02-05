import React from 'react'
import { array } from '@storybook/addon-knobs'
import { getOutcome, defaultOutcomeIds } from '../../../.storybook/constants'
import OutcomeSelectionList from './'

export default {
  title: 'OutcomeSelectionList'
}

export const standard = () => (
  <OutcomeSelectionList
    setFocusedOutcome={ () => {} }
    getOutcome={ getOutcome }
    isOutcomeSelected={ () => {} }
    selectOutcomeIds={ () => {} }
    deselectOutcomeIds={ () => {} }
    ids={ array('Outcome Ids', defaultOutcomeIds) }
  />
)
