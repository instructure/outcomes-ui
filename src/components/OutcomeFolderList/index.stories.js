import React from 'react'
import { object } from '@storybook/addon-knobs'
import { getOutcome, getOutcomeSummary, defaultOutcomes } from '../../../.storybook/constants'
import OutcomeFolderList from './'

export default {
  title: 'OutcomeFolderList'
}

export const standard = () => (
  <OutcomeFolderList
    getOutcome={ getOutcome }
    getOutcomeSummary={ getOutcomeSummary }
    outcomes={ object('Outcomes', defaultOutcomes()) }
    setActiveCollection={ () => {} }
    toggleExpandedIds={ () => {} }
    activeCollectionId="1"
  />
)
