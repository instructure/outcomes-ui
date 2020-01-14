import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import t from 'format-message'

import themeable from '@instructure/ui-themeable'
import { Billboard } from '@instructure/ui-billboard'
import { Flex } from '@instructure/ui-flex'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import { Heading, Text } from '@instructure/ui-elements'
import { View } from '@instructure/ui-view'

import OutcomeSelectionList from '../OutcomeSelectionList'
import OutcomeFolderList from '../OutcomeFolderList'
import OutcomeTags from '../OutcomeTags'
import OutcomeTree from '../OutcomeTree'
import OutcomeViewModal from '../OutcomeViewModal'
import IfFeature from '../IfFeature'
import SearchInput from '../SearchInput'
import SearchResults from '../SearchResults'
import AlignOutcomes from '../../icons/AlignOutcomes.svg'
import NoReport from '../../icons/NoReport.svg'
import theme from '../theme'
import styles from './styles.css'
import { outcomeShape } from '../../store/shapes'
import { sanitizeHtml } from '../../lib/sanitize'

@themeable(theme, styles)
class OutcomePicker extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    focusedOutcome: outcomeShape,
    expandedIds: PropTypes.array,
    toggleExpandedIds: PropTypes.func.isRequired,
    setFocusedOutcome: PropTypes.func.isRequired,
    selectedOutcomeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    getOutcome: PropTypes.func.isRequired,
    getOutcomeSummary: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    isOutcomeGroup: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    collections: PropTypes.object.isRequired,
    setActiveCollection: PropTypes.func.isRequired,
    rootOutcomeIds: PropTypes.array.isRequired,
    activeChildrenIds: PropTypes.array.isRequired,
    activeCollection: PropTypes.shape({
      id: PropTypes.string,
      header: PropTypes.string,
      summary: PropTypes.string,
      description: PropTypes.string
    }),
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
    updateSearchPage: PropTypes.func.isRequired
  }

  static defaultProps = {
    focusedOutcome: null,
    expandedIds: null,
    activeCollection: null,
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false,
    searchText: '',
    screenreaderNotification: null,
  }

  setRHS (rhs) {
    this.rhs = rhs // eslint-disable-line immutable/no-mutation
  }

  componentDidUpdate (oldProps, oldState) {
    const oldCollection = oldProps.activeCollection ? oldProps.activeCollection.id : null
    const newCollection = this.props.activeCollection ? this.props.activeCollection.id : null
    const parent = ReactDOM.findDOMNode(this) // eslint-disable-line react/no-find-dom-node
    if (oldCollection !== newCollection &&
      parent && !parent.contains(document.activeElement) &&
      this.rhs) {
      const next = this.rhs.querySelector('input') || this.rhs.querySelector('button')
      if (next) {
        next.focus()
      }
    }
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

  renderActiveCollection () {
    const { activeCollection } = this.props
    if (activeCollection && activeCollection.id) {
      return (
        <div className={styles.selectedOutcomeCollection}>
          <div>
            <Heading level="h3" as="h2" margin="0 0 x-small">{activeCollection.header}</Heading>
          </div>
          <div>
            <Text size="x-small">{activeCollection.summary}</Text>
          </div>
          <Text size="x-small">
            <div
              className={styles.outcomeDescription}
              dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                __html: sanitizeHtml(activeCollection.description)
              }}
            />
          </Text>
        </div>
      )
    } else {
      return (
        <Billboard
          message={t('Browse your outcomes using the group folders.')}
          heading={t('Align Outcomes')}
          headingAs="h3"
          headingLevel="h3"
          size="small"
          hero={<AlignOutcomes />}
          margin="medium"
        />
      )
    }
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
      getOutcome,
      setActiveCollection,
      toggleExpandedIds,
      setFocusedOutcome,
      isOutcomeSelected,
      selectOutcomeIds,
      deselectOutcomeIds,
      getOutcomeSummary,
      isOutcomeGroup
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
        getOutcome={getOutcome}
        setActiveCollection={setActiveCollection}
        toggleExpandedIds={toggleExpandedIds}
        setFocusedOutcome={setFocusedOutcome}
        isOutcomeSelected={isOutcomeSelected}
        selectOutcomeIds={selectOutcomeIds}
        deselectOutcomeIds={deselectOutcomeIds}
        getOutcomeSummary={getOutcomeSummary}
        isOutcomeGroup={isOutcomeGroup}
      />
    )
  }

  renderTreePickerMode () {
    const {
      getOutcome,
      isOutcomeGroup,
      activeChildrenIds,
      collections,
      setFocusedOutcome,
      getOutcomeSummary,
      isOutcomeSelected,
      selectOutcomeIds,
      deselectOutcomeIds,
      setActiveCollection,
      rootOutcomeIds,
      activeCollection,
      toggleExpandedIds,
      expandedIds,
    } = this.props

    const { groups, nonGroups } = activeChildrenIds.reduce((acc, val) => {
      isOutcomeGroup(val) ? acc.groups.push(val) : acc.nonGroups.push(val)
      return acc
    }, { groups: [], nonGroups: [] })

    return (
      <Flex alignItems="stretch" height="100%" width="100%">
        <Flex.Item width="30%">
          <div className={styles.outcomeTree} data-automation='outcomePicker__outcomeTree'>
            <OutcomeTree
              collections={collections}
              setActiveCollection={setActiveCollection}
              rootOutcomeIds={rootOutcomeIds}
              expandedIds={expandedIds}
              toggleExpandedIds={toggleExpandedIds}
            />
          </div>
        </Flex.Item>
        <Flex.Item size="0" shouldGrow display="flex" borderWidth="0 0 0 small">
          <Flex
             height="100%"
             width="100%"
             direction="column"
             alignItems="stretch"
             className={styles.outcomeContent}
             elementRef={(rhs) => this.setRHS(rhs)}
             data-automation="outcomePicker__outcomeContent"
             >
            <Flex.Item size="0" shouldGrow>
              { this.renderActiveCollection() }
              <OutcomeSelectionList
                setFocusedOutcome={setFocusedOutcome}
                ids={nonGroups}
                getOutcome={getOutcome}
                isOutcomeSelected={isOutcomeSelected}
                selectOutcomeIds={selectOutcomeIds}
                deselectOutcomeIds={deselectOutcomeIds}
              />
              <OutcomeFolderList
                ids={groups}
                getOutcome={getOutcome}
                setActiveCollection={setActiveCollection}
                getOutcomeSummary={getOutcomeSummary}
                toggleExpandedIds={toggleExpandedIds}
                activeCollectionId={activeCollection ? activeCollection.id : null}
              />
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
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
      collections,
      searchText,
    } = this.props

    if (collections === void 0) {
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
