/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { IconStarSolid, IconEmptyLine } from '@instructure/ui-icons'
import { Text } from '@instructure/ui-text'
import { Pill } from '@instructure/ui-pill'
import t from 'format-message'
import { withStyle, jsx } from '@instructure/emotion'
import {
  outcomeResultShape,
  scoringMethodShape,
  scoringTierShape,
  stylesShape
} from '../../../store/shapes'

import convertToPoints from '../convertToPoints'

import generateComponentTheme from '../../theme'
import generateStyle from './styles'

const valueBetweenTiers = (value, upperTier, lowerTier) => {
  if (upperTier && value > upperTier.percent) {
    return false
  }
  if (lowerTier && value <= lowerTier.percent) {
    return false
  }
  return true
}

const renderTier = (scoringMethod, tier, styles) => {
  return (
    <div
      key={tier.id}
      css={styles.scoringTier}
      data-automation="outcomeView__scoringTier"
    >
      <div css={styles.rating}>
        <div css={styles.score} className='outcomeViewScore' data-automation="outcomeView__score">
          <Text size="medium">
            {convertToPoints(tier.percent, scoringMethod)}
          </Text>
        </div>
        <div
          css={styles.description}
          data-automation="outcomeView__description"
        >
          <Text size="small">{tier.description}</Text>
        </div>
      </div>
      {tier.count != null && (
        <div
          css={styles.masteryCount}
          data-automation="outcomeView__masteryCount"
        >
          <Text size="small">
            {t(
              `{count, plural,
                one {1 Student}
                other {# Students}
              }`,
              { count: tier.count }
            )}
          </Text>
        </div>
      )}
    </div>
  )
}

const ScorePill = ({ className, icon, text, variant, styles, method }) => {
  const outerStyle = {
    ...styles.pill,
    ...className
  }
  return (
    <span
      css={outerStyle}
      data-automation={`outcomeView__${variant}Pill`}
      className={`outcomeView${method}`}
    >
      {icon}
      &nbsp;
      <Pill color={variant}>{text}</Pill>
    </span>
  )
}

// eslint-disable-next-line immutable/no-mutation
ScorePill.propTypes = {
  className: PropTypes.object.isRequired,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
  method: PropTypes.string.isRequired
}

const renderGap = (styles, scoringMethod, outcomeResult, upperTier, lowerTier) => {
  const mastery = scoringMethod.mastery_percent
  const average = outcomeResult ? outcomeResult.averageScore : null
  const components = [
    valueBetweenTiers(mastery, upperTier, lowerTier) && (
      <ScorePill
        key="mastery"
        text={`MASTERY ${convertToPoints(mastery, scoringMethod)} PTS`}
        className={styles.mastery}
        variant="success"
        icon={<IconStarSolid data-automation="outcomeView__masteryStar" />}
        styles={styles}
        method="Mastery"
      />
    )
  ]
  if (average !== null) {
    components.push(
      valueBetweenTiers(average, upperTier, lowerTier) && (
        <ScorePill
          key="average"
          text={`AVG. SCORE ${convertToPoints(average, scoringMethod)} PTS`}
          className={styles.average}
          variant="info"
          icon={<IconEmptyLine />}
          styles={styles}
          method="Average"
        />
      )
    )
  }
  return (
    <div css={styles.gap} className='outcomeViewGap'>
      {average !== null && average <= mastery
        ? components
        : components.reverse()}
    </div>
  )
}

@withStyle(generateStyle, generateComponentTheme)
export default class ScoringTiers extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    scoringTiers: PropTypes.arrayOf(scoringTierShape).isRequired,
    scoringMethod: scoringMethodShape.isRequired,
    outcomeResult: outcomeResultShape,
    styles: stylesShape,
  }

  static defaultProps = {
    outcomeResult: null
  }

  render() {
    const { outcomeResult, scoringTiers, scoringMethod } = this.props
    return (
      <div data-automation="outcomeView__scoringTiers">
        {renderGap(
          this.props.styles,
          scoringMethod,
          outcomeResult,
          null,
          ...scoringTiers.slice(0, 1),
        )}
        {scoringTiers.map((tier, i) => [
          renderTier(scoringMethod, tier, this.props.styles),
          renderGap(
            this.props.styles,
            scoringMethod,
            outcomeResult,
            ...scoringTiers.slice(i, i + 2),
          )
        ])}
      </div>
    )
  }
}
