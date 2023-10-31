/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-text'
import { Spinner } from '@instructure/ui-spinner'
import t from 'format-message'
import { scoringMethodShape, stylesShape } from '../../../store/shapes'
import { NEW_DECAYING_AVERAGE_FF } from '../../../constants'
import { withStyle, jsx } from '@instructure/emotion'

import generateComponentTheme from '../../theme'
import generateStyle from './styles'

const renderUserFacingMethod = (scoringMethod, newDecayingAvgFFEnabled) => {
  const legacyDecayingAverage = t(
    'Mastery calculated by Decaying Average. Most recent counts as ' +
      '{recent_percent, number, percent} of mastery weight, average of all ' +
      'other results count as {remain_percent, number, percent} of weight. ' +
      'If there is only one result, the single score will be returned.',
    {
      recent_percent: scoringMethod.algorithm_data.decaying_average_percent,
      remain_percent:
        1.0 - scoringMethod.algorithm_data.decaying_average_percent
    }
  )

  if (newDecayingAvgFFEnabled) {
    switch (scoringMethod.algorithm) {
      case 'decaying_average':
        return t(
          'Mastery calculated by Weighted Average. Most recent counts as ' +
            '{recent_percent, number, percent} of mastery weight, average of all ' +
            'other results count as {remain_percent, number, percent} of weight. ' +
            'If there is only one result, the single score will be returned.',
          {
            recent_percent: scoringMethod.algorithm_data.decaying_average_percent,
            remain_percent:
              1.0 - scoringMethod.algorithm_data.decaying_average_percent
          }
        )
      case 'standard_decaying_average':
        return t(
          'Mastery calculated by Decaying Average. Between two assessments, ' +
            'the most recent assessment gets {recent_percent, number, percent} weight, ' +
            'and the first gets {remain_percent, number, percent}. For each additional assessment, ' +
            'the sum of the previous score calculations decay by an ' +
            'additional {remain_percent, number, percent}. ' +
            'If there is only one result, the single score will be returned.',
          {
            recent_percent: scoringMethod.algorithm_data.standard_decaying_average_percent,
            remain_percent:
              1.0 - scoringMethod.algorithm_data.standard_decaying_average_percent
          }
        )
    }
  } else {
    return legacyDecayingAverage
  }
}

const scoringText = (scoringMethod, newDecayingAvgFFEnabled) => {
  switch (scoringMethod.algorithm) {
    case 'decaying_average':
      return renderUserFacingMethod(scoringMethod, newDecayingAvgFFEnabled)
    case 'standard_decaying_average':
      return renderUserFacingMethod(scoringMethod, newDecayingAvgFFEnabled)
    case 'n_mastery':
      return t(
        'Mastery calculated by n Number of Times. Must achieve mastery at ' +
          'least {n_times, number} times.  Scores above mastery will be ' +
          'averaged to calculate final score.',
        {
          n_times: scoringMethod.algorithm_data.n_mastery_count
        }
      )
    case 'highest':
      return t(
        'Mastery calculated by Highest Score. Mastery score reflects the highest score of a graded assessment.'
      )
    case 'latest':
      return t(
        'Mastery calculated by Most Recent Score. Mastery score reflects the most recent graded assessment.'
      )
    case 'average':
      return t(
        'Mastery reflects Average Score. Calculated by dividing the sum of all item scores by the number of scores.'
      )
    default:
      return ''
  }
}

const masteryText = (masteryPercent, artifactTypeName) => {
  return t(
    'By aligning to this {artifact_type_name} if the student scores above' +
      ' {mastery_percent, number, percent} mastery will be achieved.',
    {
      mastery_percent: masteryPercent,
      artifact_type_name: artifactTypeName
    }
  )
}

@withStyle(generateStyle, generateComponentTheme)
export default class MasteryDescription extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    artifactTypeName: PropTypes.string,
    displayMasteryPercentText: PropTypes.bool.isRequired,
    scoringMethod: scoringMethodShape,
    features: PropTypes.array,
    styles: stylesShape,
  }

  static defaultProps = {
    artifactTypeName: null,
    scoringMethod: null,
    features: []
  }

  render() {
    const { artifactTypeName, displayMasteryPercentText, scoringMethod, features } =
      this.props
    const newDecayingAvgFFEnabled = features.includes(NEW_DECAYING_AVERAGE_FF)
    if (!scoringMethod) {
      return <Spinner renderTitle={t('Loading')} />
    }
    return (
      <div
        css={this.props.styles.scoreMastery}
        data-automation="outcomeView__scoreMethodDescription"
      >
        <div>
          <Text size="small">{scoringText(scoringMethod, newDecayingAvgFFEnabled)}</Text>
        </div>
        {displayMasteryPercentText && artifactTypeName && (
          <div css={this.props.styles.scoreMasteryText}>
            <Text size="small">
              {masteryText(scoringMethod.mastery_percent, artifactTypeName)}
            </Text>
          </div>
        )}
      </div>
    )
  }
}
