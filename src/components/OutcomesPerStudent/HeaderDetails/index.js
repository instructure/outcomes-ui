import React from 'react'
import PropTypes from 'prop-types'
import { ApplyTheme, themeable } from '@instructure/ui-themeable'
import { Text } from '@instructure/ui-elements'
import { Progress, ProgressBar } from '@instructure/ui-progress'
import { Tooltip } from '@instructure/ui-overlays'
import t from 'format-message'

import theme from '../../theme'
import styles from './styles.css'

const numQuestionsText = (count, usesBank) => {
  if (count === null || count === void 0) {
    return null
  }
  if (usesBank) {
    return (
      <Tooltip tip={t('Variable due to All/Random selection from item bank')} variant="inverse">
        {t('Variable Questions')}
      </Tooltip>
    )
  }
  return t(`{
    count, plural,
        one {1 Question}
      other {# Questions}
  }`, { count })
}

@themeable(theme, styles)
export default class HeaderDetails extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcomeResult: PropTypes.object.isRequired,
    showRollups: PropTypes.bool.isRequired
  }

  render () {
    const { outcomeResult, showRollups } = this.props
    return (
      <div>
        <span className={styles.numQuestions} data-automation='outcomesPerStudent__numQuestions'>
          <Text size="small">
            { numQuestionsText(outcomeResult.childArtifactCount, outcomeResult.usesBank) }
          </Text>
        </span>
        { showRollups ? this.renderRollup(outcomeResult) : null }
      </div>
    )
  }

  renderRollup (outcomeResult) {
    const progressTheme = {
      [ProgressBar.theme]: {
        meterColorStart: this.theme.masteryBarColorStart,
        meterColorEnd: this.theme.masteryBarColorEnd
      }
    }
    return (
      <div>
        <ApplyTheme theme={progressTheme}>
          <Progress
            size="x-small"
            label={
              t('{count} of {total} met mastery', {
                count: outcomeResult.masteryCount,
                total: outcomeResult.count
              })
            }
            valueMax={outcomeResult.count}
            valueNow={outcomeResult.masteryCount}
          />
        </ApplyTheme>
        <div className={styles.masteryBarDetails} data-automation='outcomesPerStudent__masteryBarDetails'>
          <Text size="x-small" data-automation='outcomesPerStudent__masteryCount'>
            { t('{count} Mastery', { count: outcomeResult.masteryCount }) }
          </Text>
          <Text size="x-small" data-automation='outcomesPerStudent__noMasteryCount'>
            { t("{count} Didn't Meet", { count: (outcomeResult.count - outcomeResult.masteryCount) }) }
          </Text>
        </div>
      </div>
    )
  }
}
