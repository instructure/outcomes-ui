import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-elements'
import { themeable } from '@instructure/ui-themeable'

import { outcomeResultShape, scoringMethodShape, scoringTierShape } from '../../store/shapes'
import ScoringTiers from './ScoringTiers'
import MasteryCounts from './MasteryCounts'
import MasteryDescription from './MasteryDescription'
import { sanitizeHtml } from '../../lib/sanitize'

import theme from '../theme'
import styles from './styles.css'

@themeable(theme, styles)
export default class OutcomeView extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    description: PropTypes.string.isRequired,
    outcomeResult: outcomeResultShape,
    title: PropTypes.string.isRequired,
    scoringMethod: scoringMethodShape,
    scoringTiers: PropTypes.arrayOf(scoringTierShape),
    artifactTypeName: PropTypes.string,
    displayMasteryDescription: PropTypes.bool,
    displayMasteryPercentText: PropTypes.bool
  }

  // eslint-disable-next-line no-undef
  static defaultProps = {
    outcomeResult: null,
    scoringMethod: null,
    scoringTiers: null,
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false
  }

  render () {
    const {
      description,
      outcomeResult,
      title,
      scoringMethod,
      scoringTiers,
      artifactTypeName,
      displayMasteryDescription,
      displayMasteryPercentText
    } = this.props

    return (
      <div>
        <div className={styles.title} data-automation='outcomeView__title'>
          <Text size="x-large" transform="uppercase">
            {title}
          </Text>
        </div>
        {
        scoringMethod && outcomeResult &&
          <MasteryCounts
            outcomeResult={outcomeResult}
            scoringMethod={scoringMethod}
          />
      }
        <div className={styles.description} data-automation='outcomeView__description'>
          <Text size="medium">
            <div
              dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
              __html: sanitizeHtml(description)
            }}
            />
          </Text>
        </div>
        {
        scoringTiers && scoringMethod &&
          <ScoringTiers
            outcomeResult={outcomeResult}
            scoringTiers={scoringTiers}
            scoringMethod={scoringMethod}
          />
      }
        {
        displayMasteryDescription &&
          <MasteryDescription
            artifactTypeName={artifactTypeName}
            displayMasteryPercentText={displayMasteryPercentText}
            scoringMethod={scoringMethod}
          />
      }
      </div>
    )
  }
}
