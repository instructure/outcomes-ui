import React from 'react'
import { object, boolean } from '@storybook/addon-knobs'
import { basicOutcome } from '../../../.storybook/constants'
import Alignment from './'

export default {
  title: 'Alignment'
}

export const standard = () => (
  <Alignment
    outcome={ object('Outcome', basicOutcome) }
    removeAlignment={ () => {} }
    viewAlignment={ () => {} }
    closeAlignment={ () => {} }
    isOpen={ false }
    artifactTypeName="Quiz"
    displayMasteryDescription={ true }
    displayMasteryPercentText={ true }
    readOnly={ boolean('Read Only', false) }
    scope="Quiz::QuizId"
    index={1}
  />
)
