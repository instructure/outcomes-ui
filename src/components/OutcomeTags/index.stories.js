import React from 'react'
import { array, text } from '@storybook/addon-knobs'
import { getOutcome, defaultOutcomeIds } from '../../../.storybook/constants'

import OutcomeTags from './'

export default {
  title: 'OutcomeTags'
}

export const noAlignedOutcomes = () => (
  <OutcomeTags
    ids={ [] }
    emptyText={ text('Empty Message', 'No Outcomes are currently selected') }
    getOutcome={ ()=>{} }
    deselectOutcomeIds={ ()=>{} }
  />
)

export const alignedOutcomes = () => (
  <OutcomeTags
    ids={ array('Outcome IDs', defaultOutcomeIds) }
    emptyText="No Outcomes are currently selected"
    getOutcome={ getOutcome }
    deselectOutcomeIds={ () => {} }
  />
)
