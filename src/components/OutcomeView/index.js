/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-text'
import { View } from '@instructure/ui-view'
import t from 'format-message'

import {
  outcomeResultShape,
  scoringMethodShape,
  scoringTierShape,
  contextShape,
  stylesShape
} from '../../store/shapes'
import ScoringTiers from './ScoringTiers'
import MasteryCounts from './MasteryCounts'
import MasteryDescription from './MasteryDescription'
import { sanitizeHtml } from '../../lib/sanitize'
import { withStyle, jsx } from '@instructure/emotion'
import generateComponentTheme from '../theme'
import generateStyle from './styles'
import {
  contextConfiguredWithProficiencies,
  getScoringMethodFromContext,
  getScoringTiersFromContext
} from '../../util/proficienciesUtils'

@withStyle(generateStyle, generateComponentTheme)
export default class OutcomeView extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    context: contextShape,
    description: PropTypes.string.isRequired,
    friendlyDescription: PropTypes.string,
    outcomeResult: outcomeResultShape,
    title: PropTypes.string.isRequired,
    scoringMethod: scoringMethodShape,
    scoringTiers: PropTypes.arrayOf(scoringTierShape),
    artifactTypeName: PropTypes.string,
    displayMasteryDescription: PropTypes.bool,
    displayMasteryPercentText: PropTypes.bool,
    features: PropTypes.array,
    styles: stylesShape,
  }

  // eslint-disable-next-line no-undef
  static defaultProps = {
    context: null,
    outcomeResult: null,
    scoringMethod: null,
    scoringTiers: null,
    artifactTypeName: null,
    displayMasteryDescription: false,
    displayMasteryPercentText: false,
    friendlyDescription: null,
    features: []
  }

  getScoringMethod() {
    const { scoringMethod, context } = this.props
    return contextConfiguredWithProficiencies(context)
      ? getScoringMethodFromContext(context)
      : scoringMethod
  }

  getScoringTiers() {
    const { scoringTiers, context } = this.props
    if (scoringTiers?.length > 0) {
      return scoringTiers
    }
    return contextConfiguredWithProficiencies(context)
      ? getScoringTiersFromContext(context)
      : null
  }

  getDisplayMasteryInformation() {
    const { context, outcomeResult } = this.props

    return !(contextConfiguredWithProficiencies(context) && !outcomeResult)
  }

  render() {
    const {
      description,
      outcomeResult,
      title,
      artifactTypeName,
      displayMasteryDescription,
      displayMasteryPercentText,
      friendlyDescription,
      features
    } = this.props

    const scoringMethod = this.getScoringMethod()
    const scoringTiers = this.getScoringTiers()
    const displayMasteryInformation = this.getDisplayMasteryInformation()
    const displayMasteryCounts =
      scoringMethod && outcomeResult && displayMasteryInformation

    return (
      <div>
        <div css={this.props.styles.title} data-automation="outcomeView__title">
          <Text size="x-large" transform="uppercase">
            {title}
          </Text>
        </div>
        {displayMasteryCounts && (
          <MasteryCounts
            outcomeResult={outcomeResult}
            scoringMethod={scoringMethod}
          />
        )}
        {friendlyDescription && (
          <React.Fragment>
            <View
              as="div"
              margin={`${
                displayMasteryCounts ? 'medium' : 'x-small'
              } small 0 0`}
              padding="small small x-small small"
              background="secondary"
              data-automation="outcomeView__friendly_description_header"
            >
              <Text weight="bold">{t('Friendly Description')}</Text>
            </View>
            <View
              as="div"
              margin="0 small 0 0"
              padding="0 small small small"
              background="secondary"
              data-automation="outcomeView__friendly_description_expanded"
            >
              <Text>{friendlyDescription}</Text>
            </View>
          </React.Fragment>
        )}
        <div
          css={this.props.styles.description}
          data-automation="outcomeView__description"
        >
          <Text size="medium" wrap="break-word">
            <div
              dangerouslySetInnerHTML={{
                // eslint-disable-line react/no-danger
                __html: sanitizeHtml(description)
              }}
            />
          </Text>
        </div>
        {scoringTiers && scoringMethod && displayMasteryInformation && (
          <ScoringTiers
            outcomeResult={outcomeResult}
            scoringTiers={scoringTiers}
            scoringMethod={scoringMethod}
          />
        )}
        {displayMasteryDescription && displayMasteryInformation && (
          <MasteryDescription
            artifactTypeName={artifactTypeName}
            displayMasteryPercentText={displayMasteryPercentText}
            scoringMethod={scoringMethod}
            features={features}
          />
        )}
      </div>
    )
  }
}
