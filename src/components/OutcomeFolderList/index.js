import React from 'react'
import PropTypes from 'prop-types'
import themeable from '@instructure/ui-themeable'
import OutcomeFolder from '../OutcomeFolder'

import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class OutcomeFolderList extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    getOutcome: PropTypes.func.isRequired,
    getOutcomeSummary: PropTypes.func.isRequired,
    setActiveCollection: PropTypes.func.isRequired,
    ids: PropTypes.array.isRequired,
    toggleExpandedIds: PropTypes.func.isRequired,
    activeCollectionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }

  static defaultProps = {
    activeCollectionId: null
  }

  render () {
    const {
      ids,
      getOutcome,
      getOutcomeSummary,
      setActiveCollection,
      toggleExpandedIds,
      activeCollectionId
    } = this.props
    if (ids.length === 0) {
      return <div />
    }
    return (
      <div className={styles.picker}>
        {
          ids.map((id) => (
            <OutcomeFolder
              key={id}
              outcome={getOutcome(id)}
              getOutcomeSummary={getOutcomeSummary}
              setActiveCollection={setActiveCollection}
              toggleExpandedIds={toggleExpandedIds}
              activeCollectionId={activeCollectionId}
            />
          ))
        }
      </div>
    )
  }
}
