import React from 'react'
import { array, text, object } from '@storybook/addon-knobs'
import { View } from '@instructure/ui-view'
import * as sbConstants from '../../../.storybook/constants'
import OutcomePicker from './'

export default {
  title: 'OutcomePicker'
}

const defaultProps = {
  setFocusedOutcome: () => {},
  focusedOutcome: null,
  isOutcomeSelected: () => {},
  selectOutcomeIds: () => {},
  deselectOutcomeIds: () => {},
  setActiveCollection: () => {},
  setSearchLoading: () => {},
  setSearchEntries: () => {},
  isSearchLoading: true,
  searchEntries: [],
  searchTotal: null,
  updateSearchText: () => {},
  updateSearchPage: () => {},
  displayMasteryDescription: true,
  displayMasteryPercentText: true
}

export const collapsed = () => (
  <View as='div' height='100vh'>
    <OutcomePicker {...defaultProps}
      selectedOutcomes={ object('Outcomes', sbConstants.defaultOutcomes()) }
      features={ array('Features', ['outcomes_search']) }
      searchText={ text('Search Text', undefined) }
      searchPage={ 1 }
      searchEntries = { [] }
      treeView = { () => <div><br /> OutcomeTree Placeholder </div> }
      hasOutcomes = { true }
    />
  </View>
)
