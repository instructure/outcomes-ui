import React from 'react'
import { text, object } from '@storybook/addon-knobs'
import { defaultOutcomes } from '../../../.storybook/constants'

import OutcomeTags from './'

export default {
  title: 'OutcomeTags'
}

export const noAlignedOutcomes = () => (
  <OutcomeTags
    outcomes={ [] }
    emptyText={ text('Empty Message', 'No Outcomes are currently selected') }
    deselectOutcomeIds={ ()=>{} }
  />
)

export const alignedOutcomes = () => (
  <OutcomeTags
    outcomes={ object('Outcomes', defaultOutcomes()) }
    emptyText="No Outcomes are currently selected"
    deselectOutcomeIds={ () => {} }
  />
)
