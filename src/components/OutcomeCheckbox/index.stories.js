import React from 'react'
import { object } from '@storybook/addon-knobs'
import { basicOutcome } from '../../../.storybook/constants'
import OutcomeCheckbox from './'

export default {
  title: 'OutcomeCheckbox'
}

export const standard = () => (
  <OutcomeCheckbox
    outcome={ object('Outcome', basicOutcome) }
    setFocusedOutcome={ () => {} }
    isOutcomeSelected={ () => {} }
    selectOutcomeIds={ () => {} }
    deselectOutcomeIds= { () => {} }
  />
)
