export const contextConfiguredWithProficiencies = context => {
  return !!(context?.outcome_proficiency && context?.outcome_calculation_method)
}

const getMaxPoints = outcomeProficiencyRatings => {
  return outcomeProficiencyRatings
    .sort((r1, r2) => r1.points - r2.points)
    .reverse()[0]?.points
}

export const getMasteryPercent = context => {
  const outcomeProficiencyRatings = context?.outcome_proficiency?.outcome_proficiency_ratings || []

  const masteryPoints = outcomeProficiencyRatings.find(r => r.mastery)?.points

  const maxPoints = getMaxPoints(outcomeProficiencyRatings)

  if (masteryPoints !== undefined && ![0, undefined].includes(maxPoints)) {
    return masteryPoints / maxPoints
  }
}

export const getScoringMethodFromContext = context => {
  const {
    outcome_calculation_method: {
      calculation_method,
      calculation_int,
    },
    outcome_proficiency: {
      outcome_proficiency_ratings
    }
  } = context
  let algorithm_data = {}

  if (calculation_method === 'decaying_average') {
    algorithm_data.decaying_average_percent = calculation_int
  } else if (calculation_method === 'n_mastery') {
    algorithm_data.n_mastery_count = calculation_int
  }

  return {
    algorithm: context.outcome_calculation_method.calculation_method,
    algorithm_data,
    mastery_percent: getMasteryPercent(context),
    points_possible: getMaxPoints(outcome_proficiency_ratings)
  }
}

export const getScoringTiersFromContext = context => {
  const outcomeProficiencyRatings = context?.outcome_proficiency?.outcome_proficiency_ratings

  if (!outcomeProficiencyRatings) {
    return
  }

  const maxPoints = getMaxPoints(outcomeProficiencyRatings)

  return outcomeProficiencyRatings.map(rating => ({
    description: rating.description,
    percent: rating.points / maxPoints,
  }))
}
