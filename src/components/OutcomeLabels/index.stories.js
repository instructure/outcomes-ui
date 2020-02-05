import React from 'react'
import { text } from '@storybook/addon-knobs'
import { defaultOutcomes } from '../../../.storybook/constants'
import OutcomeLabels from './'

export default {
  title: 'OutcomeLabels'
}

export const noAlignedOutcomes = () => (
  <OutcomeLabels
    emptyText={ text('Empty Message', 'No Outcomes are currently selected') }
    outcomes={ [] }
  />
)

export const alignedOutcomes = () => (
  <OutcomeLabels
    emptyText="No Outcomes are currently selected"
    outcomes={ defaultOutcomes() }
  />
)
