import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-text'
import { Spinner } from '@instructure/ui-spinner'
import t from 'format-message'
import { themeable } from '@instructure/ui-themeable'
import { scoringMethodShape } from '../../../store/shapes'

import theme from '../../theme'
import styles from './styles.css'

const scoringText = (scoringMethod) => {
  switch (scoringMethod.algorithm) {
    case 'decaying_average':
      return t(
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

@themeable(theme, styles)
export default class MasteryDescription extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    artifactTypeName: PropTypes.string,
    displayMasteryPercentText: PropTypes.bool.isRequired,
    scoringMethod: scoringMethodShape
  }

  static defaultProps = {
    artifactTypeName: null,
    scoringMethod: null
  }

  render() {
    const { artifactTypeName, displayMasteryPercentText, scoringMethod } =
      this.props
    if (!scoringMethod) {
      return <Spinner renderTitle={t('Loading')} />
    }
    return (
      <div
        className={styles.scoreMastery}
        data-automation="outcomeView__scoreMethodDescription"
      >
        <div>
          <Text size="small">{scoringText(scoringMethod)}</Text>
        </div>
        {displayMasteryPercentText && artifactTypeName && (
          <div className={styles.scoreMasteryText}>
            <Text size="small">
              {masteryText(scoringMethod.mastery_percent, artifactTypeName)}
            </Text>
          </div>
        )}
      </div>
    )
  }
}
