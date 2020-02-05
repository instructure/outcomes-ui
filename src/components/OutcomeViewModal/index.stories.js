import React from 'react'
import { object, boolean } from '@storybook/addon-knobs'
import { outcomeWithoutResults, outcomeViewWithResults, outcomeRollup } from '../../../.storybook/constants'
import OutcomeViewModal from './'

export default {
  title: 'OutcomeViewModal'
}

export const noResults = () => (
  <OutcomeViewModal
    outcome={ object('Outcome', outcomeWithoutResults) }
    closeAlignment={ () => {} }
    isOpen={ true }
    artifactTypeName="Quiz"
    displayMasteryDescription={ boolean('Display Mastery Description', true) }
    displayMasteryPercentText={ boolean('Display Mastery Percent Text', true) }
  />
)

export const results = () => (
  <OutcomeViewModal
    outcome={ object('Outcome', outcomeViewWithResults) }
    outcomeResult={ object('Outcome Result', outcomeRollup) }
    closeAlignment={ () => {} }
    isOpen={ true }
    artifactTypeName="Quiz"
    displayMasteryDescription={ boolean('Display Mastery Description', true) }
    displayMasteryPercentText={ boolean('Display Mastery Percent Text', true) }
  />
)
