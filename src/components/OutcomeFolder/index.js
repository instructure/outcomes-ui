/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-text'
import { Link } from '@instructure/ui-link'
import { IconFolderSolid } from '@instructure/ui-icons'
import { withStyle, jsx } from '@instructure/emotion'
import generateComponentTheme from '../theme'
import generateStyle from './styles'
import { stylesShape } from '../../store/shapes'

@withStyle(generateStyle, generateComponentTheme)
export default class OutcomeFolder extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcome: PropTypes.object.isRequired,
    clickable: PropTypes.bool,
    getOutcomeSummary: PropTypes.func.isRequired,
    setActiveCollection: PropTypes.func.isRequired,
    toggleExpandedIds: PropTypes.func.isRequired,
    activeCollectionId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    styles: stylesShape,
  }

  // eslint-disable-next-line no-undef
  static defaultProps = {
    clickable: true,
    activeCollectionId: null
  }

  handleClick = (id) => {
    const { setActiveCollection, toggleExpandedIds, activeCollectionId } =
      this.props

    if (activeCollectionId) {
      toggleExpandedIds({ id: activeCollectionId, forceOpen: true })
    }
    setActiveCollection(id)
    toggleExpandedIds({ id, forceOpen: true })
  }

  renderTitle = (outcome) => {
    const { clickable } = this.props

    // Temporarily have the Folders rendered in search results
    // be unclickable, until we decide how to retrieve all
    // their ancestor outcomes and put them into state. A necessary
    // reqt in order to render the tree picker.
    return clickable ? (
      <Text size="small">
        <Link onClick={() => this.handleClick(outcome.id)}>
          {outcome.title}
        </Link>
      </Text>
    ) : (
      <Text size="x-small">{outcome.title}</Text>
    )
  }

  renderSummary(outcome) {
    const { getOutcomeSummary } = this.props
    if (getOutcomeSummary(outcome.id)) {
      return (
        <div css={this.props.styles.folderSummary}>
          <Text size="x-small">{getOutcomeSummary(outcome.id)}</Text>
        </div>
      )
    }
  }

  render() {
    const { outcome } = this.props
    return (
      <div css={this.props.styles.folder}>
        <div css={this.props.styles.folderIcon}>
          <IconFolderSolid />
        </div>
        <div css={this.props.styles.folderDetails}>
          <div data-automation="outcomeFolder__folderTitle">
            {this.renderTitle(outcome)}
          </div>
          {this.renderSummary(outcome)}
          <div css={this.props.styles.folderDescription}>
            <Text size="x-small">{outcome.label}</Text>
          </div>
        </div>
      </div>
    )
  }
}
