import React from 'react'
import { text } from '@storybook/addon-knobs'
import OutcomePickerLoader from './'

export default {
  title: 'OutcomePickerLoader'
}

export const activeOutcomes = () => (
  <OutcomePickerLoader
    loadOutcomePicker={ () => {} }
    setFocusedOutcome={ () => {} }
    outcomePickerState={ text('Picker State', 'loading') }
    outcomePicker={ () => null }
    scope=""
    artifactTypeName=""
    displayMasteryDescription={ true }
    displayMasteryPercentText={ true }
  />
)
