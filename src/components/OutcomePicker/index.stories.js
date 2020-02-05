import React from 'react'
import { object, array, text, number } from '@storybook/addon-knobs'
import * as sbConstants from '../../../.storybook/constants'
import OutcomePicker from './'

export default {
  title: 'OutcomePicker'
}

const defaultProps = {
  toggleExpandedIds: () => {} ,
  setFocusedOutcome: () => {} ,
  focusedOutcome: null ,
  isOutcomeSelected: () => {} ,
  isOutcomeGroup: () => {} ,
  selectOutcomeIds: () => {} ,
  deselectOutcomeIds: () => {} ,
  setActiveCollection: () => {} ,
  setSearchLoading: () => {} ,
  setSearchEntries: () => {} ,
  isSearchLoading: true ,
  searchEntries: [] ,
  searchTotal: null ,
  updateSearchText: () => {} ,
  updateSearchPage: () => {} ,
  displayMasteryDescription: true ,
  displayMasteryPercentText: true ,
  allOutcomeIds: []
}

export const collapsed = () => (
  <div style={ { height: '100vh' } }>
    <OutcomePicker {...defaultProps}
      expandedIds={ array('Expanded Outcomes', []) }
      selectedOutcomeIds={ array('Aligned Outcome Ids', sbConstants.defaultOutcomeIds)}
      getOutcome={sbConstants.getOutcome}
      getOutcomeSummary={sbConstants.getOutcomeSummary}
      collections={object('Collections', sbConstants.defaultCollections)}
      rootOutcomeIds={ array('Root Outcome Ids',[1,2,3])}
      activeChildrenIds={ [] }
      activeCollection={{id: null, header: '', summary: '', description: ''}}
      features={ array('Features',['outcomes_search'])}
      searchText={text('Search Text', undefined)}
      searchPage={ number('Search Page', 1)}
    />
  </div>
)

export const expandedGroups = () => (
  <div style={ { height: '100vh' } }>
    <OutcomePicker {...defaultProps}
      expandedIds={ array('Expanded Outcomes', [1,4]) }
      focusedOutcome={ null }
      selectedOutcomeIds={ array('Aligned Outcome Ids', sbConstants.defaultOutcomeIds) }
      getOutcome={ sbConstants.getOutcome }
      getOutcomeSummary={ sbConstants.getOutcomeSummary }
      collections={ object('Collections', sbConstants.defaultCollections) }
      rootOutcomeIds={ array('Root Outcome Ids', [1,2,3]) }
      activeChildrenIds={ [] }
      activeCollection={ { id: null, header: '', summary: '', description: '' } }
      features={ array('Features', ['outcomes_search']) }
      searchText={ text('Search Text', undefined) }
      searchPage={ number('Search Page', 1) }
    />
  </div>
)

export const activeOutcomes = () => (
  <div style={ { height: '100vh' } }>
    <OutcomePicker {...defaultProps}
      expandedIds={ array('Expanded Outcomes', []) }
      focusedOutcome={ null }
      selectedOutcomeIds={ array('Aligned Outcome Ids', sbConstants.defaultOutcomeIds) }
      getOutcome={ sbConstants.getOutcome }
      getOutcomeSummary={ sbConstants.getOutcomeSummary }
      collections={ sbConstants.defaultCollections }
      rootOutcomeIds={ array('Root Outcome Ids', [1,2,3]) }
      activeChildrenIds={ sbConstants.defaultOutcomeIds }
      activeCollection={ object('Active Collection', sbConstants.defaultActiveCollection) }
      features={ array('Features', ['outcomes_search']) }
      searchText={ text('Search Text', undefined) }
      searchPage={ number('Search Page', 1) }
    />
  </div>
)
