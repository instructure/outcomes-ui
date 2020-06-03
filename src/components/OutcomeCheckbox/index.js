import React from 'react'
import PropTypes from 'prop-types'
import { Link, Text } from '@instructure/ui-elements'
import { Checkbox } from '@instructure/ui-forms'
import { themeable } from '@instructure/ui-themeable'
import { outcomeShape } from '../../store/shapes'
import OutcomeDescription from '../OutcomeDescription'

import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class OutcomeCheckbox extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcome: outcomeShape.isRequired,
    setFocusedOutcome: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired
  }

  selected () {
    return this.props.isOutcomeSelected(this.props.outcome.id)
  }

  toggleOutcomeSelection () {
    if (this.selected()) {
      this.props.deselectOutcomeIds([this.props.outcome.id])
    } else {
      this.props.selectOutcomeIds([this.props.outcome.id])
    }
  }

  render () {
    const { outcome } = this.props
    const { id, description, title } = outcome

    return (
      <div className={`OutcomeSelector ${styles.checkbox}`}>
        <Checkbox
          value={id}
          checked={this.selected()}
          onChange={() => this.toggleOutcomeSelection()}
          label={(
            <div className={styles.checkboxLabel}>
              <Link
                onClick={(e) => {
                  e.preventDefault()
                  this.props.setFocusedOutcome(outcome)
                }}
              >
                <Text size="small">
                  <span className={styles.linkText} data-automation="outcomeCheckbox__outcomeName">
                    <span className={styles.innerLinkText}>
                      {title}
                    </span>
                  </span>
                </Text>
              </Link>
            </div>
          )}
        />
        <div className={styles.checkboxDescription}>
          <OutcomeDescription description={description} />
        </div>
      </div>
    )
  }
}
