import React from 'react'
import { themeable } from '@instructure/ui-themeable'
import { Text } from '@instructure/ui-elements'
import { ProgressBar } from '@instructure/ui-progress'
import t from 'format-message'

import { outcomeResultShape, scoringMethodShape } from '../../../store/shapes'
import convertToPoints from '../convertToPoints'

import theme from '../../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class Header extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcomeResult: outcomeResultShape.isRequired,
    scoringMethod: scoringMethodShape.isRequired
  }

  render () {
    const {
      outcomeResult,
      scoringMethod
    } = this.props

    const masteryPoints = convertToPoints(scoringMethod.mastery_percent, scoringMethod)

    return (
      <div>
        <div className={styles.masteryScoreSection}>
          <div className={styles.masteryScoreBoxAboveMastery}>
            <Text size="x-large">{outcomeResult.masteryCount}</Text>
            <Text size="small">{ t('Mastery at {mastery} pts', { mastery: masteryPoints }) }</Text>
          </div>
          <div className={styles.masteryScoreBoxBelowMastery}>
            <Text size="x-large">{outcomeResult.count - outcomeResult.masteryCount}</Text>
            <Text size="small">{ t('Didn\'t Meet') }</Text>
          </div>
        </div>
        <div className={styles.masteryBarGraph} data-automation='outcomeView__masteryBarGraph'>
          <ProgressBar
            size="small"
            screenReaderLabel={
              t('{count} of {total} met mastery', {
                count: outcomeResult.masteryCount,
                total: outcomeResult.count
              })
            }
            meterColor="success"
            valueMax={outcomeResult.count}
            valueNow={outcomeResult.masteryCount}
          />
          <div className={styles.masteryBarDetails} data-automation='outcomeView__masteryBarDetails'>
            <div className={styles.masteryCountText}>
              <Text size="small" data-automation='outcomeView__masteryCount'>
                { t('{count} Mastery at {mastery} pts', {
                  count: outcomeResult.masteryCount,
                  mastery: masteryPoints
                }) }
              </Text>
            </div>
            <Text size="small" data-automation='outcomeView__noMasteryCount'>
              { t("{count} Didn't Meet", {
                count: (outcomeResult.count - outcomeResult.masteryCount)
              }) }
            </Text>
          </div>
        </div>
      </div>
    )
  }
}
