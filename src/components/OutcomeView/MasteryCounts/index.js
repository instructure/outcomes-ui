/** @jsx jsx */
import React from 'react'
import { Text } from '@instructure/ui-text'
import { ProgressBar } from '@instructure/ui-progress'
import t from 'format-message'
import { withStyle, jsx } from '@instructure/emotion'
import { outcomeResultShape, scoringMethodShape, stylesShape } from '../../../store/shapes'
import convertToPoints from '../convertToPoints'

import generateComponentTheme from '../../theme'
import generateStyle from './styles'

@withStyle(generateStyle, generateComponentTheme)
export default class MasteryCounts extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    outcomeResult: outcomeResultShape.isRequired,
    scoringMethod: scoringMethodShape.isRequired,
    styles: stylesShape,
  }

  render() {
    const { outcomeResult, scoringMethod } = this.props

    const masteryPoints = convertToPoints(
      scoringMethod.mastery_percent,
      scoringMethod
    )

    return (
      <div>
        <div css={this.props.styles.masteryScoreSection}>
          <div css={this.props.styles.masteryScoreBoxAboveMastery}>
            <Text size="x-large">{outcomeResult.masteryCount}</Text>
            <Text size="small">
              {t('Mastery at {mastery} pts', { mastery: masteryPoints })}
            </Text>
          </div>
          <div css={this.props.styles.masteryScoreBoxBelowMastery}>
            <Text size="x-large">
              {outcomeResult.count - outcomeResult.masteryCount}
            </Text>
            <Text size="small">{t("Didn't Meet")}</Text>
          </div>
        </div>
        <div
          css={this.props.styles.masteryBarGraph}
          data-automation="outcomeView__masteryBarGraph"
        >
          <ProgressBar
            size="small"
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
            data-automation="outcomeView__masteryBarDetails"
          >
            <div css={this.props.styles.masteryCountText}>
              <Text size="small" data-automation="outcomeView__masteryCount">
                {t('{count} Mastery at {mastery} pts', {
                  count: outcomeResult.masteryCount,
                  mastery: masteryPoints
                })}
              </Text>
            </div>
            <Text size="small" data-automation="outcomeView__noMasteryCount">
              {t("{count} Didn't Meet", {
                count: outcomeResult.count - outcomeResult.masteryCount
              })}
            </Text>
          </div>
        </div>
      </div>
    )
  }
}
