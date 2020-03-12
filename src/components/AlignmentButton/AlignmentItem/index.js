import React from 'react'
import PropTypes from 'prop-types'
import t from 'format-message'
import { IconButton } from '@instructure/ui-buttons'
import { Text } from '@instructure/ui-elements'
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
  }

  focus () {
    this.focusLink.focus()
  }

  render() {
    const { outcome, removeAlignment } = this.props
    return (
      <React.Fragment>
        <Text size="small">{ outcome.label }</Text>
        <div className={styles.outcomeTitle}>
          <Text weight="bold" size="small">{ outcome.title }</Text>
          <span className={styles.deleteButton}>
            <IconButton
              withBackground={false}
              withBorder={false}
              screenReaderLabel={t(`Remove ${outcome.title}`)}
              elementRef={(link) => { this.focusLink = link }} // eslint-disable-line immutable/no-mutation
              onClick={removeAlignment} >
              <IconTrashLine />
            </IconButton>
          </span>
        </div>
        <OutcomeDescription description={outcome.description} />
      </React.Fragment>
    )
  }
}
