import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from '@instructure/ui-forms'
import { Text } from '@instructure/ui-elements'
import t from 'format-message'
import { themeable } from '@instructure/ui-themeable'

import OutcomeCheckbox from '../OutcomeCheckbox'
import { outcomeShape } from '../../store/shapes'

import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class OutcomeSelectionList extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    setFocusedOutcome: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    outcomes: PropTypes.arrayOf(outcomeShape).isRequired
  }

  allSelected () {
    const { outcomes, isOutcomeSelected } = this.props
    return outcomes.every((o) => isOutcomeSelected(o.id))
  }

  toggleAllSelected () {
    const { deselectOutcomeIds, selectOutcomeIds, outcomes } = this.props
    const ids = outcomes.map((o) => o.id)
    if (this.allSelected()) {
      deselectOutcomeIds(ids)
    } else {
      selectOutcomeIds(ids)
    }
  }

  selectAllText () {
    if (this.allSelected()) {
      return t('Deselect all')
    } else {
      return t('Select all')
    }
  }

  render () {
    const { outcomes, setFocusedOutcome } = this.props
    if (outcomes.length === 0) {
      return <div />
    }
    return (
      <div className={styles.picker} data-automation='outcomeSelectionList__picker'>
        <div className={styles.checkbox}>
          <Checkbox
            value="selectAll"
            checked={this.allSelected()}
            onChange={() => this.toggleAllSelected()}
            label={
              <div className={styles.checkboxLabel}>
                <Text size="small">{this.selectAllText()}</Text>
              </div>
            }
          />
        </div>
        {
          outcomes.map((o) => {
            return (
              <div key={o.id} className={styles.checkbox}>
                <OutcomeCheckbox
                  outcome={o}
                  setFocusedOutcome={setFocusedOutcome}
                  {...this.props}
                />
              </div>
            )
          })
        }
      </div>
    )
  }
}
