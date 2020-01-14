import React from 'react'
import t from 'format-message'
import PropTypes from 'prop-types'
import { Spinner } from '@instructure/ui-spinner'
import { Flex } from '@instructure/ui-flex'
import themeable from '@instructure/ui-themeable'
import OutcomeCheckbox from '../../OutcomeCheckbox'
import styles from './styles.css'
import theme from '../../theme'

@themeable(theme, styles)
export default class OutcomeList extends React.Component {
  static propTypes = {
    outcomeList: PropTypes.array.isRequired,
    setFocusedOutcome: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    outcomePickerState: PropTypes.string.isRequired
  }

  render () {
    const {
      outcomeList,
      setFocusedOutcome,
      isOutcomeSelected,
      selectOutcomeIds,
      deselectOutcomeIds,
      outcomePickerState
    } = this.props

    if (outcomePickerState === 'loading') {
      return (
        <Flex justifyItems="center">
          <Flex.Item padding="small">
            <Spinner renderTitle={t('Loading')} />
          </Flex.Item>
        </Flex>
      )
    }

    return outcomeList.map(outcome => {
      return (
        <div key={outcome.id} className={styles.checkbox}>
          <OutcomeCheckbox
            outcome={outcome}
            setFocusedOutcome={setFocusedOutcome}
            isOutcomeSelected={isOutcomeSelected}
            selectOutcomeIds={selectOutcomeIds}
            deselectOutcomeIds={deselectOutcomeIds}
          />
        </div>
      )
    })
  }
}
