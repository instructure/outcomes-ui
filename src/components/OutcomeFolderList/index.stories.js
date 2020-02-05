import React from 'react'
import { array } from '@storybook/addon-knobs'
import { getOutcome, getOutcomeSummary, defaultOutcomeIds } from '../../../.storybook/constants'
import OutcomeFolderList from './'

export default {
  title: 'OutcomeFolderList'
}

export const standard = () => (
  <OutcomeFolderList
    ids={ array('Outcome Ids', defaultOutcomeIds) }
    getOutcome={ getOutcome }
    getOutcomeSummary={ getOutcomeSummary }
    setActiveCollection={ () => {} }
    toggleExpandedIds={ () => {} }
    activeCollectionId="1"
  />
)
