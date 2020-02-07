import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import t from 'format-message'

import themeable from '@instructure/ui-themeable'
import { Billboard } from '@instructure/ui-billboard'
import { Flex } from '@instructure/ui-flex'
import { Heading, Text } from '@instructure/ui-elements'

import OutcomeSelectionList from '../OutcomeSelectionList'
import OutcomeFolderList from '../OutcomeFolderList'
import TreeBrowser from './TreeBrowser'
import AlignOutcomes from '../../icons/AlignOutcomes.svg'
import theme from '../theme'
import styles from './styles.css'
import { sanitizeHtml } from '../../lib/sanitize'

@themeable(theme, styles)
class OutcomeTree extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    expandedIds: PropTypes.array,
    toggleExpandedIds: PropTypes.func.isRequired,
    setFocusedOutcome: PropTypes.func.isRequired,
    getOutcomeSummary: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    collections: PropTypes.object.isRequired,
    setActiveCollection: PropTypes.func.isRequired,
    rootOutcomeIds: PropTypes.array.isRequired,
    activeChildren: PropTypes.shape({
      groups: PropTypes.array,
      nonGroups: PropTypes.array,
    }),
    activeCollection: PropTypes.shape({
      id: PropTypes.string,
      header: PropTypes.string,
      summary: PropTypes.string,
      description: PropTypes.string
    }),
  }

  static defaultProps = {
    expandedIds: null,
    activeCollection: null,
    activeChildren: {
      groups: [],
      nonGroups: []
    }
  }

  setRHS (rhs) {
    this.rhs = rhs // eslint-disable-line immutable/no-mutation
  }

  componentDidUpdate (oldProps) {
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

  renderActiveCollection () {
    const { activeCollection } = this.props
    return activeCollection && activeCollection.id ? (
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
    ) : (
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

  render () {
    const {
      activeChildren,
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
    const { groups, nonGroups } = activeChildren
    return (
      <Flex alignItems="stretch" height="100%" width="100%">
        <Flex.Item width="30%">
          <div className={styles.outcomeTree} data-automation='outcomePicker__outcomeTree'>
            <TreeBrowser
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
                outcomes={nonGroups}
                isOutcomeSelected={isOutcomeSelected}
                selectOutcomeIds={selectOutcomeIds}
                deselectOutcomeIds={deselectOutcomeIds}
              />
              <OutcomeFolderList
                outcomes={groups}
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
}

export default OutcomeTree
