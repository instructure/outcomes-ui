import React from 'react'
import t from 'format-message'
import PropTypes from 'prop-types'

import { CloseButton } from '@instructure/ui-buttons'
import { Heading } from '@instructure/ui-elements'
import { Flex } from '@instructure/ui-flex'
import themeable from '@instructure/ui-themeable'
import { View } from '@instructure/ui-layout'
import { Tray } from '@instructure/ui-overlays'
import { Spinner } from '@instructure/ui-spinner'

import OutcomeList from './OutcomeList'
import SearchInput from '../SearchInput'
import SearchResults from '../SearchResults'
import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class OutcomeTray extends React.Component {
  static propTypes = {
    searchText: PropTypes.string.isRequired,
    updateSearchText: PropTypes.func.isRequired,
    setSearchLoading: PropTypes.func.isRequired,
    setSearchEntries: PropTypes.func.isRequired,
    isSearchLoading: PropTypes.bool.isRequired,
    searchEntries: PropTypes.array.isRequired,
    getOutcome: PropTypes.func.isRequired,
    getOutcomeSummary: PropTypes.func.isRequired,
    setActiveCollection: PropTypes.func.isRequired,
    toggleExpandedIds: PropTypes.func.isRequired,
    setFocusedOutcome: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    isOutcomeGroup: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    screenreaderNotification: PropTypes.func,
    liveRegion: PropTypes.element,
    mountNode: PropTypes.element,
    size: PropTypes.string,
    placement: PropTypes.string,
    searchTotal: PropTypes.number.isRequired,
    searchPage: PropTypes.number.isRequired,
    outcomes: PropTypes.array.isRequired,
    getOutcomesList: PropTypes.func.isRequired,
    updateSearchPage: PropTypes.func.isRequired,
    listPage: PropTypes.number.isRequired,
    listTotal: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    closeOutcomePicker: PropTypes.func.isRequired,
    resetOutcomePicker: PropTypes.func.isRequired
  }

  static defaultProps = {
    screenreaderNotification: null,
    liveRegion: null,
    mountNode: null,
    size: "regular",
    placement: "end"
  }

  componentDidUpdate (prevProps) {
    const { getOutcomesList, isOpen, updateSearchText } = this.props

    if (!prevProps.isOpen && isOpen) {
      getOutcomesList({ page: 1 })
      updateSearchText("")
    }
  }

  shouldComponentUpdate (nextProps) {
    // We don't want to rerender this component when the picker is closed as it's an unnecessary render
    // Also, if we are closing the tray, we don't want to allow a rerender as it's closing
    if (!this.props.isOpen && !nextProps.isOpen) {
      return false
    }
    return true
  }

  renderList () {
    const {
      outcomes,
      setFocusedOutcome,
      isOutcomeSelected,
      selectOutcomeIds,
      deselectOutcomeIds,
      isFetching,
      listPage,
      listTotal,
      getOutcomesList
    } = this.props

    return (
      <View
        display="block"
        padding="small none none none">
        <OutcomeList
          outcomes={outcomes}
          setFocusedOutcome={setFocusedOutcome}
          isOutcomeSelected={isOutcomeSelected}
          selectOutcomeIds={selectOutcomeIds}
          deselectOutcomeIds={deselectOutcomeIds}
          isLoading={isFetching}
          listPage={listPage}
          listTotal={listTotal}
          getOutcomesList={getOutcomesList}
        />
      </View>
    )
  }

  renderSearchMode () {
    const {
      screenreaderNotification,
      setSearchLoading,
      setSearchEntries,
      searchText,
      updateSearchPage,
      isSearchLoading,
      isOutcomeSelected,
      searchEntries,
      getOutcome,
      getOutcomeSummary,
      isOutcomeGroup,
      searchPage,
      searchTotal,
      toggleExpandedIds,
      setActiveCollection,
      selectOutcomeIds,
      deselectOutcomeIds,
      setFocusedOutcome
    } = this.props

    return (
      <SearchResults
        screenreaderNotification={screenreaderNotification}
        setSearchLoading={setSearchLoading}
        setSearchEntries={setSearchEntries}
        searchText={searchText}
        updateSearchPage={updateSearchPage}
        isSearchLoading={isSearchLoading}
        isOutcomeSelected={isOutcomeSelected}
        searchEntries={searchEntries}
        getOutcome={getOutcome}
        getOutcomeSummary={getOutcomeSummary}
        isOutcomeGroup={isOutcomeGroup}
        searchPage={searchPage}
        searchTotal={searchTotal}
        toggleExpandedIds={toggleExpandedIds}
        setActiveCollection={setActiveCollection}
        selectOutcomeIds={selectOutcomeIds}
        deselectOutcomeIds={deselectOutcomeIds}
        setFocusedOutcome={setFocusedOutcome}
      />
    )
  }

  renderBody () {
    const { searchText, isFetching } = this.props
    if (isFetching) {
      return (
        <Flex justifyItems="center">
          <Flex.Item padding="small">
            <Spinner renderTitle={t('Loading')} />
          </Flex.Item>
        </Flex>
      )
    }
    return searchText ? this.renderSearchMode() : this.renderList()
  }

  render () {
    const {
      liveRegion,
      mountNode,
      searchText,
      placement,
      size,
      updateSearchText,
      closeOutcomePicker,
      isOpen,
      resetOutcomePicker,
    } = this.props

    const trayProps = { placement, size }
    return (
      <Tray
        data-automation="outcomeTrayPicker__view"
        liveRegion={liveRegion}
        mountNode={mountNode}
        open={isOpen}
        onExiting={resetOutcomePicker}
        {...trayProps}
      >
        <div className={styles.trayContainer}>
          <Flex margin="none none small none">
            <Flex.Item shouldGrow shouldShrink>
              <Heading level="h3" margin="0 0 x-small">{t('Align Outcomes')}</Heading>
            </Flex.Item>
            <Flex.Item>
              <CloseButton onClick={closeOutcomePicker}>
                {t('Cancel')}
              </CloseButton>
            </Flex.Item>
          </Flex>
          <SearchInput
            onChange={(_, value) => updateSearchText(value)}
            onClear={() => updateSearchText('')}
            searchText={searchText}
          />
          {this.renderBody()}
        </div>
      </Tray>
    )
  }
}
