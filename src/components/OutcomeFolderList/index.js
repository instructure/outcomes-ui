/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import OutcomeFolder from '../OutcomeFolder'
import { withStyle, jsx } from '@instructure/emotion'
import generateComponentTheme from '../theme'
import generateStyle from './styles'
import { stylesShape } from '../../store/shapes'

@withStyle(generateStyle, generateComponentTheme)
export default class OutcomeFolderList extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    getOutcomeSummary: PropTypes.func.isRequired,
    setActiveCollection: PropTypes.func.isRequired,
    outcomes: PropTypes.array.isRequired,
    toggleExpandedIds: PropTypes.func.isRequired,
    activeCollectionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    styles: stylesShape,
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
      <div css={this.props.styles.picker}>
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
