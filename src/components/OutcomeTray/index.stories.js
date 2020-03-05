import React from 'react'
import { number, boolean, text, object } from '@storybook/addon-knobs'
import { defaultOutcomes } from '../../../.storybook/constants'
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
  saveOutcomePickerAlignments: () => Promise.resolve(),
  getOutcomesList: () => {},
  updateSearchPage: () => {},
  closeOutcomePicker: () => {},
  resetOutcomePicker: () => {}
}

export const paginatedNoSearch = () => (
  <OutcomeTray {...defaultProps}
    searchText=""
    outcomes={ object('Outcomes', defaultOutcomes()) }
    listPage={ number('Page Index', 1) }
    listTotal={ number('Total Outcomes', 987) }
    isFetching={ boolean('Is Loading', false) }
    searchEntries={ [] }
    searchTotal={ 0}
    searchPage={ 1 }
  />
)

export const searchResults = () => (
  <OutcomeTray {...defaultProps}
    searchText={ text('Search Text', 'Grade') }
    outcomes={ {} }
    listPage={ number('Page Index', 1) }
    listTotal={ number('Total Outcomes', 987) }
    isFetching={ boolean('Is Loading', false) }
    searchEntries={ object('Search Results', defaultOutcomes()) }
    searchTotal={ number('Total Search Results', 987 )}
    searchPage={ number('Search Page Index', 1) }
  />
)
