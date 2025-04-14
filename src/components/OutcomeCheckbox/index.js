/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-text'
import { Link } from '@instructure/ui-link'
import { Checkbox } from '@instructure/ui-checkbox'
import { outcomeShape, stylesShape } from '../../store/shapes'
import OutcomeDescription from '../OutcomeDescription'
import { View } from '@instructure/ui-view'
import t from 'format-message'
import { withStyle, jsx } from '@instructure/emotion'
import generateComponentTheme from '../theme'
import generateStyle from './styles'

@withStyle(generateStyle, generateComponentTheme)
export default class OutcomeCheckbox extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcome: outcomeShape.isRequired,
    setFocusedOutcome: PropTypes.func.isRequired,
    isOutcomeSelected: PropTypes.func.isRequired,
    selectOutcomeIds: PropTypes.func.isRequired,
    deselectOutcomeIds: PropTypes.func.isRequired,
    styles: stylesShape,
  }

  selected() {
    return this.props.isOutcomeSelected(this.props.outcome.id)
  }

  toggleOutcomeSelection() {
    if (this.selected()) {
      this.props.deselectOutcomeIds([this.props.outcome.id])
    } else {
      this.props.selectOutcomeIds([this.props.outcome.id])
    }
  }

  render() {
    const { outcome } = this.props
    const { id, description, title } = outcome
    return (
      <div css={this.props.styles.checkbox} className='OutcomeSelector'>
        <Checkbox
          id={`outcome-select-${id}`}
          value={id}
          checked={this.selected()}
          onChange={() => this.toggleOutcomeSelection()}
          label={
            <div css={this.props.styles.checkboxLabel}>
              <Link
                onClick={(e) => {
                  e.preventDefault()
                  this.props.setFocusedOutcome(outcome)
                }}
              >
                <Text size="small">
                  <span
                    css={this.props.styles.linkText}
                    data-automation="outcomeCheckbox__outcomeName"
                  >
                    <span css={this.props.styles.innerLinkText}>{title}</span>
                  </span>
                </Text>
              </Link>
            </div>
          }
        />
        {outcome.friendly_description && (
          <div css={this.props.styles.checkboxFriendlyDescription}>
            <View
              as="div"
              margin="x-small small 0 0"
              padding="x-small x-small 0"
              background="secondary"
              data-automation="outcomeCheckbox__friendly_description_header"
            >
              <Text size="x-small" weight="bold">
                {t('Friendly Description')}
              </Text>
            </View>
            <View
              as="div"
              margin="0 small 0 0"
              padding="0 x-small x-small"
              background="secondary"
              data-automation="outcomeCheckbox__friendly_description_expanded"
            >
              <Text size="x-small">{outcome.friendly_description}</Text>
            </View>
          </div>
        )}
        <div css={this.props.styles.checkboxDescription}>
          <OutcomeDescription description={description} maxLines={2} />
        </div>
      </div>
    )
  }
}
