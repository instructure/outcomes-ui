import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from '@instructure/ui-forms'
import { Text } from '@instructure/ui-elements'
import t from 'format-message'
import themeable from '@instructure/ui-themeable'

import OutcomeCheckbox from '../OutcomeCheckbox'

import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class OutcomeSelectionList extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    setFocusedOutcome: PropTypes.func.isRequired,
    getOutcome: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    ids: PropTypes.array.isRequired
  }

  allSelected () {
    const { ids, isOutcomeSelected } = this.props
    return ids.every((id) => isOutcomeSelected(id))
  }

  toggleAllSelected () {
    const { deselectOutcomeIds, selectOutcomeIds, ids } = this.props
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
    const { ids, getOutcome, setFocusedOutcome } = this.props
    if (ids.length === 0) {
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
          ids.map((id) => {
            const o = getOutcome(id)
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
