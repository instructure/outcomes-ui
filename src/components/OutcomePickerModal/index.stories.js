import React from 'react'
import { boolean, text } from '@storybook/addon-knobs'
import OutcomePickerModal from './'

export default {
  title: 'OutcomePickerModal'
}

export const standard = () => (
  <OutcomePickerModal
    outcomePickerState={ text('Picker State', 'choosing') }
    resetOutcomePicker={ () => {} }
    loadOutcomePicker={ () => {} }
    setFocusedOutcome={ () => {} }
    saveOutcomePickerAlignments={ () => {} }
    anyOutcomeSelected={ boolean('Outcome Selected', true) }
    onModalClose={ () => {} }
    onModalOpen={ () => {} }
    onUpdate={ () => {} }
    trigger={ this }
    scope=""
    artifactTypeName="Quiz"
    displayMasteryDescription={ true }
    displayMasteryPercentText={ true }
    screenreaderNotification={ () => {} }
    liveRegion=""
    mountNode={ () => {} }
    outcomePicker={ () => (<div><br/>Outcome Picker would go here</div>) }
  />
)
