import React from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'

import { themeable } from '@instructure/ui-themeable'
import { Billboard } from '@instructure/ui-billboard'
import { Flex } from '@instructure/ui-flex'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import { View } from '@instructure/ui-view'

import OutcomeTags from '../OutcomeTags'
import OutcomeViewModal from '../OutcomeViewModal'
import IfFeature from '../IfFeature'
import SearchInput from '../SearchInput'
import SearchResults from '../SearchResults'
import NoReport from '../../icons/NoReport.svg'
import theme from '../theme'
import styles from './styles.css'
import { outcomeShape } from '../../store/shapes'

@themeable(theme, styles)
class OutcomePicker extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    focusedOutcome: outcomeShape,
    setFocusedOutcome: PropTypes.func.isRequired,
    selectedOutcomeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    getOutcome: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    setActiveCollection: PropTypes.func.isRequired,
    artifactTypeName: PropTypes.string,
    displayMasteryDescription: PropTypes.bool,
    displayMasteryPercentText: PropTypes.bool,
    features: PropTypes.array.isRequired,
    searchText: PropTypes.string,
    setSearchLoading: PropTypes.func.isRequired,
    setSearchEntries: PropTypes.func.isRequired,
    isSearchLoading: PropTypes.bool.isRequired,
    searchEntries: PropTypes.array.isRequired,
    searchTotal: PropTypes.number.isRequired,
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
  }

  renderViewModal () {
    const {
      focusedOutcome,
      setFocusedOutcome,
      artifactTypeName,
      displayMasteryDescription,
      displayMasteryPercentText
    } = this.props

    return (
      focusedOutcome &&
        <OutcomeViewModal
          artifactTypeName={artifactTypeName}
          displayMasteryDescription={displayMasteryDescription}
          displayMasteryPercentText={displayMasteryPercentText}
          outcome={focusedOutcome}
          closeAlignment={() => setFocusedOutcome(null)}
          isOpen
        />
    )
  }

  renderSearchMode () {
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
      deselectOutcomeIds,
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

  renderTreePickerMode () {
    const { scope, treeView: OutcomeTree } = this.props
    return (
      <OutcomeTree
        scope={scope}
      />
    )
  }

  renderHeader () {
    const {
      selectedOutcomeIds,
      getOutcome,
      features,
      searchText,
      updateSearchText,
      deselectOutcomeIds
    } = this.props

    return (
      <View
        display="block"
        borderWidth="none none small none"
        padding={features.includes('outcomes_search') ?
        "small small medium small"
        :
        "small"
        }
        >
        <View
          display="block"
          padding="none none small none">
          <ScreenReaderContent>{t('Selected outcomes:')}</ScreenReaderContent>
          <OutcomeTags
            ids={selectedOutcomeIds}
            getOutcome={getOutcome}
            emptyText={t('No Outcomes are currently selected')}
            deselectOutcomeIds={deselectOutcomeIds}
          />
        </View>
        <IfFeature
          name={'outcomes_search'}
          features={features}
        >
          <SearchInput
            onChange={(_, value) => updateSearchText(value)}
            onClear={() => updateSearchText('')}
            searchText={searchText}
            />
          </IfFeature>
      </View>
    )
  }
  render () {
    const {
      hasOutcomes,
      searchText,
    } = this.props

    if (!hasOutcomes) {
      return (
        <Billboard
          message={t('To add or create outcomes, visit the Canvas outcomes page.')}
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
      <Flex direction="column" height="100%" width="100%" padding="x-small small 0 small">
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
