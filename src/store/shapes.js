import PropTypes from 'prop-types'

export const scoringMethodShape = PropTypes.shape({
  algorithm: PropTypes.isRequired,
  algorithm_data: PropTypes.object,
  mastery_percent: PropTypes.number
})

export const outcomeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  guid: PropTypes.string,
  label: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  scoring_method: scoringMethodShape,
  group: PropTypes.boolean,
})

export const outcomeResultShape = PropTypes.shape({
  averageScore: PropTypes.number.isRequired,
  childArtifactCount: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  masteryCount: PropTypes.number.isRequired,
  outcomeId: PropTypes.string.isRequired,
  usesBank: PropTypes.boolean
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
