import React from 'react'
import { object, number } from '@storybook/addon-knobs'
import { getOutcome, getOutcomeSummary, defaultOutcomeIdsAsObjects } from '../../../.storybook/constants'
import SearchResults from './'

export default {
  title: 'SearchResults'
}

export const paginated = () => (
  <SearchResults
    getOutcome={ getOutcome }
    setActiveCollection={ () => {} }
    toggleExpandedIds={ () => {} }
    setFocusedOutcome={ () => {} }
    isOutcomeSelected={ () => {} }
    selectOutcomeIds={ () => {} }
    deselectOutcomeIds={ () => {} }
    searchEntries={ object('Search Result Ids', defaultOutcomeIdsAsObjects()) }
    getOutcomeSummary={ getOutcomeSummary }
    isOutcomeGroup={ () => {} }
    searchTotal={ number('Search Total', 10)}
  />
)
