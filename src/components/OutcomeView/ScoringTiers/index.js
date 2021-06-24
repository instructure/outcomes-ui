import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { IconStarSolid, IconEmptyLine } from '@instructure/ui-icons'
import { Text } from '@instructure/ui-text'
import { Pill } from '@instructure/ui-pill'
import t from 'format-message'
import { themeable } from '@instructure/ui-themeable'
import {
  outcomeResultShape,
  scoringMethodShape,
  scoringTierShape
} from '../../../store/shapes'

import convertToPoints from '../convertToPoints'

import theme from '../../theme'
import styles from './styles.css'

const valueBetweenTiers = (value, upperTier, lowerTier) => {
  if (upperTier && value > upperTier.percent) {
    return false
  }
  if (lowerTier && value <= lowerTier.percent) {
    return false
  }
  return true
}

const renderTier = (scoringMethod, tier) => {
  return (
    <div
      key={tier.id}
      className={styles.scoringTier}
      data-automation="outcomeView__scoringTier"
    >
      <div className={styles.rating}>
        <div className={styles.score} data-automation="outcomeView__score">
          <Text size="medium">
            {convertToPoints(tier.percent, scoringMethod)}
          </Text>
        </div>
        <div
          className={styles.description}
          data-automation="outcomeView__description"
        >
          <Text size="small">{tier.description}</Text>
        </div>
      </div>
      {tier.count != null && (
        <div
          className={styles.masteryCount}
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

const ScorePill = ({ className, icon, text, variant }) => {
  const outerStyle = classNames({
    [styles.pill]: true,
    [className]: true
  })
  return (
    <span
      className={outerStyle}
      data-automation={`outcomeView__${variant}Pill`}
    >
      {icon}
      &nbsp;
      <Pill text={text} variant={variant} />
    </span>
  )
}

// eslint-disable-next-line immutable/no-mutation
ScorePill.propTypes = {
  className: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired
}

const renderGap = (scoringMethod, outcomeResult, upperTier, lowerTier) => {
  const mastery = scoringMethod.mastery_percent
  const average = outcomeResult ? outcomeResult.averageScore : null

  const components = [
    valueBetweenTiers(mastery, upperTier, lowerTier) && (
      <ScorePill
        key="mastery"
        text={`Mastery ${convertToPoints(mastery, scoringMethod)} pts`}
        className={styles.mastery}
        variant="success"
        icon={<IconStarSolid data-automation="outcomeView__masteryStar" />}
      />
    )
  ]
  if (average !== null) {
    components.push(
      valueBetweenTiers(average, upperTier, lowerTier) && (
        <ScorePill
          key="average"
          text={`Avg. Score ${convertToPoints(average, scoringMethod)} pts`}
          className={styles.average}
          variant="primary"
          icon={<IconEmptyLine />}
        />
      )
    )
  }
  return (
    <div className={styles.gap}>
      {average !== null && average <= mastery
        ? components
        : components.reverse()}
    </div>
  )
}

@themeable(theme, styles)
export default class ScoringTiers extends React.Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    scoringTiers: PropTypes.arrayOf(scoringTierShape).isRequired,
    scoringMethod: scoringMethodShape.isRequired,
    outcomeResult: outcomeResultShape
  }

  static defaultProps = {
    outcomeResult: null
  }

  render() {
    const { outcomeResult, scoringTiers, scoringMethod } = this.props
    return (
      <div data-automation="outcomeView__scoringTiers">
        {renderGap(
          scoringMethod,
          outcomeResult,
          null,
          ...scoringTiers.slice(0, 1)
        )}
        {scoringTiers.map((tier, i) => [
          renderTier(scoringMethod, tier),
          renderGap(
            scoringMethod,
            outcomeResult,
            ...scoringTiers.slice(i, i + 2)
          )
        ])}
      </div>
    )
  }
}
