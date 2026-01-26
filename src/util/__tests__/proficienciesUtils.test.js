import { expect } from '@jest/globals'
import { contextConfiguredWithProficiencies, getMasteryPercent, getScoringMethodFromContext, getScoringTiersFromContext } from '../proficienciesUtils'

const contextWithProficiencies = {
  id: 1,
  outcome_proficiency: {
    outcome_proficiency_ratings: [{
      color: 'FF00FF',
      mastery: false,
      points: 5.0,
      description: 'Exceeds Expectations'
    }, {
      color: 'FF00FF',
      mastery: true,
      points: 3.0,
      description: 'Meets Expectations.'
    }, {
      color: 'FF00FF',
      mastery: false,
      points: 0.0,
      description: 'Does Not Meet Expectations'
    }]
  },
  outcome_calculation_method: {
    calculation_method: 'highest',
    calculation_int: null,
  }
}

const contextWithoutProficiencies = {
  id: 1
}

describe('contextConfiguredWithProficiencies', () => {
  it('returns true when context has proficiencies', () => {
    expect(contextConfiguredWithProficiencies(contextWithProficiencies)).toEqual(true)
  })

  it('returns false when context doesnt have proficiencies', () => {
    expect(contextConfiguredWithProficiencies(contextWithoutProficiencies)).toEqual(false)
  })
})

describe('getMasteryPercent', () => {
  it('returns correct mastery percent', () => {
    expect(getMasteryPercent(contextWithProficiencies)).toEqual(0.6)
  })

  it('returns undefined when can not calculate', () => {
    expect(getMasteryPercent(contextWithoutProficiencies)).not.toBeDefined()
  })
})

describe('getScoringMethodFromContext', () => {
  it('returns correct scoring method for highest', () => {
    expect(getScoringMethodFromContext(contextWithProficiencies)).toEqual({
      algorithm: 'highest',
      algorithm_data: {},
      mastery_percent: 0.6,
      points_possible: 5
    })
  })

  it('returns correct scoring method for decaying_average', () => {
    expect(getScoringMethodFromContext({
      ...contextWithProficiencies,
      outcome_calculation_method: {
        calculation_method: 'decaying_average',
        calculation_int: 65,
      }
    })).toEqual({
      algorithm: 'decaying_average',
      algorithm_data: {
        decaying_average_percent: 0.65
      },
      mastery_percent: 0.6,
      points_possible: 5
    })
  })

  it('returns correct scoring method for n_mastery', () => {
    expect(getScoringMethodFromContext({
      ...contextWithProficiencies,
      outcome_calculation_method: {
        calculation_method: 'n_mastery',
        calculation_int: 5,
      }
    })).toEqual({
      algorithm: 'n_mastery',
      algorithm_data: {
        n_mastery_count: 5
      },
      mastery_percent: 0.6,
      points_possible: 5
    })
  })
})

describe('getScoringTiersFromContext', () => {
  it('returns correct scoring method for highest', () => {
    expect(getScoringTiersFromContext(contextWithProficiencies)).toEqual(
      expect.arrayContaining([
        {
          description: 'Does Not Meet Expectations', percent: 0
        },
        {
          description: 'Meets Expectations.', percent: 0.6
        },
        {
          description: 'Exceeds Expectations', percent: 1
        }
      ])
    )
  })

  it('returns undefined when context doesnt have proficiencies', () => {
    expect(getScoringTiersFromContext(contextWithoutProficiencies)).not.toBeDefined()
  })

  it('translates default description keys', () => {
    const context = {
      id: 1,
      outcome_proficiency: {
        outcome_proficiency_ratings: [{
          color: 'FF00FF',
          mastery: false,
          points: 4.0,
          description: 'DEFAULT_EXCEEDS_MASTERY'
        }, {
          color: 'FF00FF',
          mastery: true,
          points: 3.0,
          description: 'DEFAULT_MASTERY'
        }, {
          color: 'FF00FF',
          mastery: true,
          points: 2.0,
          description: 'DEFAULT_NEAR_MASTERY'
        }, {
          color: 'FF00FF',
          mastery: true,
          points: 1.0,
          description: 'DEFAULT_BELOW_MASTERY'
        }, {
          color: 'FF00FF',
          mastery: false,
          points: 0.0,
          description: 'DEFAULT_NO_EVIDENCE'
        }]
      }
    }
    expect(getScoringTiersFromContext(context).map(tier => tier.description)).toEqual([
      'Exceeds Mastery',
      'Mastery',
      'Near Mastery',
      'Below Mastery',
      'No Evidence'
    ])
  })
})
