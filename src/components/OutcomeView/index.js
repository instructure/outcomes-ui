import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-elements'
import { themeable } from '@instructure/ui-themeable'

import { outcomeResultShape, scoringMethodShape, scoringTierShape, contextShape } from '../../store/shapes'
import ScoringTiers from './ScoringTiers'
import MasteryCounts from './MasteryCounts'
import MasteryDescription from './MasteryDescription'
import { sanitizeHtml } from '../../lib/sanitize'

import theme from '../theme'
import styles from './styles.css'
import { contextConfiguredWithProficiencies, getScoringMethodFromContext, getScoringTiersFromContext } from '../../util/proficienciesUtils'

@themeable(theme, styles)
export default class OutcomeView extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    context: contextShape,
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
    context: null,
    outcomeResult: null,
    scoringMethod: null,
    scoringTiers: null,
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false
  }

  getScoringMethod() {
    const { scoringMethod, context } = this.props

    return contextConfiguredWithProficiencies(context) ?
      getScoringMethodFromContext(context) :
      scoringMethod
  }

  getScoringTiers() {
    const { scoringTiers, context } = this.props

    return contextConfiguredWithProficiencies(context) ?
      getScoringTiersFromContext(context) :
      scoringTiers
  }

  getDisplayMasteryInformation() {
    const {
      context,
      outcomeResult
    } = this.props

    return !(contextConfiguredWithProficiencies(context) && !outcomeResult)
  }

  render () {
    const {
      description,
      outcomeResult,
      title,
      artifactTypeName,
      displayMasteryDescription,
      displayMasteryPercentText
    } = this.props

    const scoringMethod = this.getScoringMethod()
    const scoringTiers = this.getScoringTiers()
    const displayMasteryInformation = this.getDisplayMasteryInformation()

    return (
      <div>
        <div className={styles.title} data-automation='outcomeView__title'>
          <Text size="x-large" transform="uppercase">
            {title}
          </Text>
        </div>
        {
          scoringMethod && outcomeResult && displayMasteryInformation &&
          <MasteryCounts
            outcomeResult={outcomeResult}
            scoringMethod={scoringMethod}
          />
        }
        <div className={styles.description} data-automation='outcomeView__description'>
          <Text size="medium" wrap="break-word">
            <div
              dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
                __html: sanitizeHtml(description)
              }}
            />
          </Text>
        </div>

        {
          scoringTiers && scoringMethod && displayMasteryInformation &&
          <ScoringTiers
            outcomeResult={outcomeResult}
            scoringTiers={scoringTiers}
            scoringMethod={scoringMethod}
          />
        }

        {
          displayMasteryDescription && displayMasteryInformation &&
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
