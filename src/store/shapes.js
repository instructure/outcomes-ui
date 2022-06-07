import PropTypes from 'prop-types'

export const scoringMethodShape = PropTypes.shape({
  algorithm: PropTypes.isRequired,
  algorithm_data: PropTypes.object,
  mastery_percent: PropTypes.number,
  points_possible: PropTypes.number,
  scoring_tiers: PropTypes.arrayOf(scoringTierShape)
})

export const outcomeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  guid: PropTypes.string,
  label: PropTypes.string,
  title: PropTypes.string.isRequired,
  friendly_description: PropTypes.string,
  description: PropTypes.string,
  scoring_method: scoringMethodShape,
  group: PropTypes.bool,
})

export const outcomeResultShape = PropTypes.shape({
  averageScore: PropTypes.number.isRequired,
  childArtifactCount: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  masteryCount: PropTypes.number.isRequired,
  outcomeId: PropTypes.string.isRequired,
  usesBank: PropTypes.bool
})

export const scoringTierShape = PropTypes.shape({
  description: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  count: PropTypes.number
})

export const individualResultShape = PropTypes.shape({
  outcome: outcomeShape.isRequired,
  outcome_id: PropTypes.number.isRequired,
  outcome_rollup: PropTypes.shape({
    average_score: PropTypes.number.isRequired
  }).isRequired,
  percent_score: PropTypes.number.isRequired
})

export const outcomeCalculationMethodShape = PropTypes.shape({
  calculation_method: PropTypes.string.isRequired,
  calculation_int: PropTypes.number
})

export const outcomeProficiencyRatingShape = PropTypes.shape({
  color: PropTypes.string.isRequired,
  mastery: PropTypes.bool.isRequired,
  points: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
})

export const outcomeProficiencyShape = PropTypes.shape({
  outcome_proficiency_ratings: PropTypes.arrayOf(outcomeProficiencyRatingShape).isRequired
})

export const contextShape = PropTypes.shape({
  outcome_calculation_method: outcomeCalculationMethodShape,
  outcome_proficiency: outcomeProficiencyShape
})

export const nMasteryDataShape = PropTypes.shape({
  n_mastery_count: PropTypes.number.isRequired
})

export const decayingAverageDataShape = PropTypes.shape({
  decaying_average_percent: PropTypes.number.isRequired
})

export const algorithmDataShape = PropTypes.oneOf([nMasteryDataShape, decayingAverageDataShape])