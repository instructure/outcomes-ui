import React from 'react'
import { number, object } from '@storybook/addon-knobs'
import { defaultOutcomes } from '../../../.storybook/constants'
import SearchResults from './'

export default {
  title: 'SearchResults'
}

export const paginated = () => (
  <SearchResults
    setFocusedOutcome={ () => {} }
    isOutcomeSelected={ () => {} }
    selectOutcomeIds={ () => {} }
    deselectOutcomeIds={ () => {} }
    updateSearchPage={ () => {} }
    isSearchLoading={ false }
    searchEntries={ object('Outcomes', defaultOutcomes()) }
    searchTotal={ number('Search Total', 100) }
    searchPage={ number('Page Number', 1) }
  />
)
