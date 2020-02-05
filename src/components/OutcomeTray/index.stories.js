import React from 'react'
import { number, boolean, text } from '@storybook/addon-knobs'
import { defaultOutcomes, getOutcome, getOutcomeSummary } from '../../../.storybook/constants'
import OutcomeTray from './'

export default {
  title: 'OutcomeTray'
}

const defaultProps = {
  updateSearchText: () => {},
  setSearchLoading: () => {},
  setSearchEntries: () => {},
  isOpen: true,
  isSearchLoading: false,
  setActiveCollection: () => {},
  toggleExpandedIds: () => {},
  setFocusedOutcome: () => {},
  isOutcomeSelected: () => {},
  isOutcomeGroup: () => {},
  selectOutcomeIds: () => {},
  deselectOutcomeIds: () => {},
  getOutcomesList: () => {},
  updateSearchPage: () => {},
  closeOutcomePicker: () => {},
  resetOutcomePicker: () => {}
}

export const paginatedNoSearch = () => (
  <OutcomeTray {...defaultProps}
    searchText=""
    outcomes={ defaultOutcomes() }
    listPage={ number('Page Index', 1) }
    listTotal={ number('Total Outcomes', 987) }
    isFetching={ boolean('Is Loading', false) }
    searchEntries={ [] }
    searchTotal={ 0}
    searchPage={ 1 }
    getOutcome={ () => {} }
    getOutcomeSummary={ () => {} }
/>
)

export const searchResults = () => (
  <OutcomeTray {...defaultProps}
    searchText={ text('Search Text', 'Grade') }
    outcomes={ {} }
    listPage={ number('Page Index', 1) }
    listTotal={ number('Total Outcomes', 987) }
    isFetching={ boolean('Is Loading', false) }
    searchEntries={ defaultOutcomes() }
    searchTotal={ number('Total Search Results', 987 )}
    searchPage={ number('Search Page Index', 1) }
    getOutcome={ getOutcome }
    getOutcomeSummary={ getOutcomeSummary }
/>
)
