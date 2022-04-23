import React from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'
import { IconButton } from '@instructure/ui-buttons'
import { Text } from '@instructure/ui-text'
import { IconTrashLine } from '@instructure/ui-icons'
import { themeable } from '@instructure/ui-themeable'
import OutcomeDescription from '../../OutcomeDescription'
import { outcomeShape } from '../../../store/shapes'

import theme from '../../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class AlignmentItem extends React.Component {
  static propTypes = {
    outcome: outcomeShape.isRequired,
    removeAlignment: PropTypes.func.isRequired,
    canManageOutcomes: PropTypes.bool.isRequired
  }

  static defaultProps = {
    canManageOutcomes: true
  }

  focus() {
    this.focusLink.focus()
  }

  renderDeleteButton() {
    const { outcome, removeAlignment, canManageOutcomes } = this.props
    if (canManageOutcomes) {
      return (
        <span
          className={styles.deleteButton}
          data-automation="outcomeAlignmentItem__delete"
        >
          <IconButton
            withBackground={false}
            withBorder={false}
            screenReaderLabel={t(`Remove ${outcome.title}`)}
            elementRef={(link) => {
              this.focusLink = link
            }} // eslint-disable-line immutable/no-mutation
            onClick={removeAlignment}
          >
            <IconTrashLine />
          </IconButton>
        </span>
      )
    }
  }

  render() {
    const { outcome } = this.props
    return (
      <React.Fragment>
        <Text size="small">{outcome.label}</Text>
        <div
          className={styles.outcomeTitle}
          data-automation="outcomeAlignmentItem__title"
        >
          <Text weight="bold" size="small">
            {outcome.title}
          </Text>
          {this.renderDeleteButton()}
        </div>
        <OutcomeDescription description={outcome.description} />
      </React.Fragment>
    )
  }
}
