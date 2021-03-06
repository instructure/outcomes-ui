import React from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'

import { Billboard } from '@instructure/ui-billboard'
import { Flex } from '@instructure/ui-flex'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import { View } from '@instructure/ui-view'

import OutcomeTags from '../OutcomeTags'
import OutcomeViewModal from '../OutcomeViewModal'
import SearchInput from '../SearchInput'
import SearchResults from '../SearchResults'
import NoReport from '../../icons/NoReport.svg'
import { outcomeShape } from '../../store/shapes'

class OutcomePicker extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    focusedOutcome: outcomeShape,
    setFocusedOutcome: PropTypes.func.isRequired,
    selectedOutcomes: PropTypes.arrayOf(outcomeShape).isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    setActiveCollection: PropTypes.func.isRequired,
    artifactTypeName: PropTypes.string,
    displayMasteryDescription: PropTypes.bool,
    displayMasteryPercentText: PropTypes.bool,
    searchText: PropTypes.string,
    setSearchLoading: PropTypes.func.isRequired,
    setSearchEntries: PropTypes.func.isRequired,
    isSearchLoading: PropTypes.bool.isRequired,
    searchEntries: PropTypes.array.isRequired,
    searchTotal: PropTypes.number,
    searchPage: PropTypes.number.isRequired,
    screenreaderNotification: PropTypes.func,
    updateSearchText: PropTypes.func.isRequired,
    updateSearchPage: PropTypes.func.isRequired,
    hasOutcomes: PropTypes.bool.isRequired,
    scope: PropTypes.string.isRequired,
    treeView: PropTypes.func.isRequired
  }

  static defaultProps = {
    focusedOutcome: null,
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false,
    searchText: '',
    screenreaderNotification: null,
    searchTotal: null
  }

  renderViewModal() {
    const {
      focusedOutcome,
      setFocusedOutcome,
      artifactTypeName,
      displayMasteryDescription,
      displayMasteryPercentText,
      scope
    } = this.props

    return (
      focusedOutcome && (
        <OutcomeViewModal
          artifactTypeName={artifactTypeName}
          displayMasteryDescription={displayMasteryDescription}
          displayMasteryPercentText={displayMasteryPercentText}
          outcome={focusedOutcome}
          scope={scope}
          closeAlignment={() => setFocusedOutcome(null)}
          isOpen
        />
      )
    )
  }

  renderSearchMode() {
    const {
      screenreaderNotification,
      setSearchLoading,
      setSearchEntries,
      updateSearchPage,
      searchText,
      isSearchLoading,
      searchEntries,
      searchPage,
      searchTotal,
      setActiveCollection,
      setFocusedOutcome,
      isOutcomeSelected,
      selectOutcomeIds,
      deselectOutcomeIds
    } = this.props

    return (
      <SearchResults
        screenreaderNotification={screenreaderNotification}
        setSearchLoading={setSearchLoading}
        setSearchEntries={setSearchEntries}
        searchText={searchText}
        updateSearchPage={updateSearchPage}
        isSearchLoading={isSearchLoading}
        searchEntries={searchEntries}
        searchPage={searchPage}
        searchTotal={searchTotal}
        setActiveCollection={setActiveCollection}
        setFocusedOutcome={setFocusedOutcome}
        isOutcomeSelected={isOutcomeSelected}
        selectOutcomeIds={selectOutcomeIds}
        deselectOutcomeIds={deselectOutcomeIds}
      />
    )
  }

  renderTreePickerMode() {
    const { scope, treeView: OutcomeTree } = this.props
    return <OutcomeTree scope={scope} />
  }

  renderHeader() {
    const {
      selectedOutcomes,
      searchText,
      updateSearchText,
      deselectOutcomeIds
    } = this.props

    return (
      <View
        display="block"
        borderWidth="none none small none"
        padding="small small medium small"
      >
        <View display="block" padding="none none small none">
          <ScreenReaderContent>{t('Selected outcomes:')}</ScreenReaderContent>
          <OutcomeTags
            outcomes={selectedOutcomes}
            emptyText={t('No Outcomes are currently selected')}
            deselectOutcomeIds={deselectOutcomeIds}
          />
        </View>
        <SearchInput
          onChange={(_, value) => updateSearchText(value)}
          onClear={() => updateSearchText('')}
          searchText={searchText}
        />
      </View>
    )
  }
  render() {
    const { hasOutcomes, searchText } = this.props

    if (!hasOutcomes) {
      return (
        <Billboard
          message={t(
            'To add or create outcomes, visit the Canvas outcomes page.'
          )}
          heading={t('There are no outcomes')}
          headingAs="h3"
          headingLevel="h3"
          size="small"
          hero={<NoReport />}
          margin="medium"
        />
      )
    }
    return (
      <Flex
        direction="column"
        height="100%"
        width="100%"
        padding="x-small small 0 small"
      >
        <Flex.Item>{this.renderHeader()}</Flex.Item>
        <Flex.Item shouldGrow maxHeight="100%" size="0">
          {searchText ? this.renderSearchMode() : this.renderTreePickerMode()}
          {this.renderViewModal()}
        </Flex.Item>
      </Flex>
    )
  }
}

export default OutcomePicker
