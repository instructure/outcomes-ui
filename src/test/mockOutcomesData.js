/*
 * This file contains mock data for outcomes. This mock data is centralized in this file and imported by several
 * component test files.
 */

export const OUTCOME_1 = {
  id: '1',
  label: 'A1',
  title: 'tA1',
  description: 'dA1',
  friendly_description: 'fdA1',
  scoring_method: {
    algorithm: 'highest',
    algorithm_data: null,
    mastery_percent: 0.6,
    points_possible: 5,
    scoring_tiers: ratings
  }
}

export const OUTCOME_2 = {
  id: '2',
  label: 'B2',
  title: 'tB2',
  description: 'dB2',
  friendly_description: 'fdB2',
  scoring_method: {
    algorithm: 'latest',
    algorithm_data: null,
    mastery_percent: 0.6,
    points_possible: 5,
    scoring_tiers: ratings
  }
}

export const OUTCOME_3 = {
  id: '3',
  label: 'C3',
  title: 'tC3',
  description: 'dC3',
  friendly_description: 'fdC3',
  scoring_method: {
    algorithm: 'average',
    algorithm_data: null,
    mastery_percent: 0.6,
    points_possible: 5,
    scoring_tiers: ratings
  }
}

export const ratings = [
  { id: '91', description: 'Exceeds Expectations', percent: 1, count: 20 },
  { id: '92', description: 'Meets Expectations', percent: 0.6, count: 5 },
  { id: '93', description: 'Does Not Meet Expectations', percent: 0, count: 25 }
]
