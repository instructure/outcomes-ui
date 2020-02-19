import React from 'react'
import { object, boolean, text } from '@storybook/addon-knobs'
import { defaultOutcomes } from '../../../.storybook/constants'
import AlignmentList from './'

export default {
  title: 'AlignmentList'
}


export const alignedOutcomes = () => (
  <AlignmentList
    alignedOutcomes={ object('Outcomes', defaultOutcomes()) }
    emptySetHeading='Align Institution outcomes to this question'
    removeAlignment={ () => {} }
    viewAlignment={ () => {} }
    closeAlignment={ () => {} }
    openOutcomePicker={ () => {} }
    isOpen={ () => {} }
    artifactTypeName="Quiz"
    displayMasteryDescription={ true }
    displayMasteryPercentText={ true }
    readOnly={ boolean('Read Only', false) }
    scope=""
    addModal={ () => null }
    outcomePickerState="closed"
    pickerType="dialog"
  />
)

export const noAlignedOutcomes = () => (
  <AlignmentList
    alignedOutcomes={ [] }
    emptySetHeading={ text('Empty Message', 'Align Institution outcomes to this question') }
    removeAlignment={ () => {} }
    viewAlignment={ () => {} }
    closeAlignment={ () => {} }
    openOutcomePicker={()=> {}}
    isOpen={ () => {} }
    artifactTypeName="Quiz"
    displayMasteryDescription={ true }
    displayMasteryPercentText={ true }
    readOnly={ boolean('Read Only', false) }
    scope=""
    addModal={ () => null }
    outcomePickerState="closed"
    pickerType="dialog"
  />
)
