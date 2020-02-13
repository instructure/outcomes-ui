import React from 'react'
import PropTypes from 'prop-types'
import { themeable } from '@instructure/ui-themeable'
import OutcomeFolder from '../OutcomeFolder'

import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class OutcomeFolderList extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    getOutcomeSummary: PropTypes.func.isRequired,
    setActiveCollection: PropTypes.func.isRequired,
    outcomes: PropTypes.array.isRequired,
    toggleExpandedIds: PropTypes.func.isRequired,
    activeCollectionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }

  static defaultProps = {
    activeCollectionId: null
  }

  render () {
    const {
      outcomes,
      getOutcomeSummary,
      setActiveCollection,
      toggleExpandedIds,
      activeCollectionId
    } = this.props
    if (outcomes.length === 0) {
      return <div />
    }
    return (
      <div className={styles.picker}>
        {
          outcomes.map((outcome) => (
            <OutcomeFolder
              key={outcome.id}
              outcome={outcome}
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
