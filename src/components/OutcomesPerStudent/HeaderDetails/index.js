/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-text'
import { ProgressBar } from '@instructure/ui-progress'
import { Tooltip } from '@instructure/ui-tooltip'
import t from 'format-message'
import { withStyle, jsx } from '@instructure/emotion'
import generateComponentTheme from '../../theme'
import generateStyle from './styles'
import { stylesShape } from '../../../store/shapes'

const numQuestionsText = (count, usesBank) => {
  if (count === null || count === void 0) {
    return null
  }
  if (usesBank) {
    return (
      <Tooltip
        renderTip={t('Variable due to All/Random selection from item bank')}
        color="primary"
      >
        {t('Variable Questions')}
      </Tooltip>
    )
  }
  return t(
    `{
    count, plural,
        one {1 Question}
      other {# Questions}
  }`,
    { count }
  )
}

@withStyle(generateStyle, generateComponentTheme)
export default class HeaderDetails extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcomeResult: PropTypes.object.isRequired,
    showRollups: PropTypes.bool.isRequired,
    styles: stylesShape,
  }

  render() {
    const { outcomeResult, showRollups } = this.props
    return (
      <div>
        <span
          css={this.props.styles.numQuestions}
          data-automation="outcomesPerStudent__numQuestions"
        >
          <Text size="small">
            {numQuestionsText(
              outcomeResult.childArtifactCount,
              outcomeResult.usesBank
            )}
          </Text>
        </span>
        {showRollups ? this.renderRollup(outcomeResult) : null}
      </div>
    )
  }

  renderRollup(outcomeResult) {
    return (
      <div>
        <ProgressBar
          size="x-small"
          screenReaderLabel={t('{count} of {total} met mastery', {
            count: outcomeResult.masteryCount,
            total: outcomeResult.count
          })}
          meterColor="success"
          valueMax={outcomeResult.count}
          valueNow={outcomeResult.masteryCount}
        />
        <div
          css={this.props.styles.masteryBarDetails}
          data-automation="outcomesPerStudent__masteryBarDetails"
        >
          <Text
            size="x-small"
            data-automation="outcomesPerStudent__masteryCount"
          >
            {t('{count} Mastery', { count: outcomeResult.masteryCount })}
          </Text>
          <Text
            size="x-small"
            data-automation="outcomesPerStudent__noMasteryCount"
          >
            {t("{count} Didn't Meet", {
              count: outcomeResult.count - outcomeResult.masteryCount
            })}
          </Text>
        </div>
      </div>
    )
  }
}
