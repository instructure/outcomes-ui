/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from '@instructure/ui-checkbox'
import { Text } from '@instructure/ui-text'
import t from 'format-message'
import { withStyle, jsx } from '@instructure/emotion'
import OutcomeCheckbox from '../OutcomeCheckbox'
import { outcomeShape, stylesShape } from '../../store/shapes'

import generateComponentTheme from '../theme'
import generateStyle from './styles'

@withStyle(generateStyle, generateComponentTheme)
export default class OutcomeSelectionList extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    setFocusedOutcome: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    outcomes: PropTypes.arrayOf(outcomeShape).isRequired,
    styles: stylesShape,
  }

  allSelected() {
    const { outcomes, isOutcomeSelected } = this.props
    return outcomes.every((o) => isOutcomeSelected(o.id))
  }

  toggleAllSelected() {
    const { deselectOutcomeIds, selectOutcomeIds, outcomes } = this.props
    const ids = outcomes.map((o) => o.id)
    if (this.allSelected()) {
      deselectOutcomeIds(ids)
    } else {
      selectOutcomeIds(ids)
    }
  }

  selectAllText() {
    if (this.allSelected()) {
      return t('Deselect all')
    } else {
      return t('Select all')
    }
  }

  render() {
    const { outcomes, setFocusedOutcome } = this.props
    const { styles: styles, makeStyles: makeStyles, ...restProps} = this.props
    if (outcomes.length === 0) {
      return <div />
    }
    return (
      <div
        css={this.props.styles.picker}
        data-automation="outcomeSelectionList__picker"
      >
        <div css={this.props.styles.checkbox}>
          <Checkbox
            id="outcome-select-all"
            value="selectAll"
            checked={this.allSelected()}
            onChange={() => this.toggleAllSelected()}
            label={
              <div css={this.props.styles.checkboxLabel}>
                <Text size="small">{this.selectAllText()}</Text>
              </div>
            }
          />
        </div>
        {outcomes.map((o) => {
          return (
            <div key={o.id}>
              <OutcomeCheckbox
                outcome={o}
                setFocusedOutcome={setFocusedOutcome}
                {...restProps}
              />
            </div>
          )
        })}
      </div>
    )
  }
}
