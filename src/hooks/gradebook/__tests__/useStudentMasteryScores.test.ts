import { pickBucketForScore, calculateScores } from '../useStudentMasteryScores'
import type { Outcome, Student, StudentRollupData } from '@/types/gradebook/rollup'
import { NoEvidenceIcon } from '@components/Gradebook/icons/NoEvidenceIcon'
import { RemediationIcon } from '@components/Gradebook/icons/RemediationIcon'
import { NearMasteryIcon } from '@components/Gradebook/icons/NearMasteryIcon'
import { MasteryIcon } from '@components/Gradebook/icons/MasteryIcon'
import { ExceedsMasteryIcon } from '@components/Gradebook/icons/ExceedsMasteryIcon'

const mockBuckets = {
  no_evidence: { name: 'No Evidence', icon: NoEvidenceIcon, count: 0 },
  remediation: { name: 'Remediation', icon: RemediationIcon, count: 0 },
  near_mastery: { name: 'Near Mastery', icon: NearMasteryIcon, count: 0 },
  mastery: { name: 'Mastery', icon: MasteryIcon, count: 0 },
  exceeds_mastery: { name: 'Exceeds Mastery', icon: ExceedsMasteryIcon, count: 0 },
}

describe('pickBucketForScore', () => {
  it('returns no_evidence bucket for null score', () => {
    expect(pickBucketForScore(null, mockBuckets)).toBe(mockBuckets.no_evidence)
  })

  it('returns exceeds_mastery bucket for positive scores', () => {
    expect(pickBucketForScore(0.1, mockBuckets)).toBe(mockBuckets.exceeds_mastery)
    expect(pickBucketForScore(1, mockBuckets)).toBe(mockBuckets.exceeds_mastery)
    expect(pickBucketForScore(5, mockBuckets)).toBe(mockBuckets.exceeds_mastery)
    expect(pickBucketForScore(100, mockBuckets)).toBe(mockBuckets.exceeds_mastery)
  })

  it('returns mastery bucket for zero score', () => {
    expect(pickBucketForScore(0, mockBuckets)).toBe(mockBuckets.mastery)
  })

  it('returns near_mastery bucket for negative scores between -1 and 0', () => {
    expect(pickBucketForScore(-0.1, mockBuckets)).toBe(mockBuckets.near_mastery)
    expect(pickBucketForScore(-0.5, mockBuckets)).toBe(mockBuckets.near_mastery)
    expect(pickBucketForScore(-0.9, mockBuckets)).toBe(mockBuckets.near_mastery)
  })

  it('returns remediation bucket for scores less than -1', () => {
    expect(pickBucketForScore(-1.1, mockBuckets)).toBe(mockBuckets.remediation)
    expect(pickBucketForScore(-2, mockBuckets)).toBe(mockBuckets.remediation)
    expect(pickBucketForScore(-10, mockBuckets)).toBe(mockBuckets.remediation)
  })

  it('returns near_mastery bucket for exactly -1', () => {
    expect(pickBucketForScore(-1, mockBuckets)).toBe(mockBuckets.near_mastery)
  })
})

describe('calculateScores', () => {
  const mockStudent: Student = {
    id: '1',
    name: 'Test Student',
    display_name: 'Test Student',
    sortable_name: 'Student, Test',
  }

  const mockOutcome1: Outcome = {
    id: '1',
    title: 'Outcome 1',
    calculation_method: 'decaying_average',
    points_possible: 10,
    mastery_points: 5,
    ratings: [
      { points: 10, color: 'green', description: 'Exceeds', mastery: false },
      { points: 5, color: 'green', description: 'Mastery', mastery: true },
      { points: 3, color: 'yellow', description: 'Near Mastery', mastery: false },
      { points: 0, color: 'red', description: 'Remediation', mastery: false },
    ],
  }

  const mockOutcome2: Outcome = {
    id: '2',
    title: 'Outcome 2',
    calculation_method: 'decaying_average',
    points_possible: 5,
    mastery_points: 3,
    ratings: [
      { points: 5, color: 'green', description: 'Exceeds', mastery: false },
      { points: 3, color: 'green', description: 'Mastery', mastery: true },
      { points: 2, color: 'yellow', description: 'Near Mastery', mastery: false },
      { points: 0, color: 'red', description: 'Remediation', mastery: false },
    ],
  }

  const mockOutcome3: Outcome = {
    id: '3',
    title: 'Outcome 3',
    calculation_method: 'decaying_average',
    points_possible: 8,
    mastery_points: 4,
    ratings: [
      { points: 8, color: 'green', description: 'Exceeds', mastery: false },
      { points: 4, color: 'green', description: 'Mastery', mastery: true },
      { points: 2, color: 'yellow', description: 'Near Mastery', mastery: false },
      { points: 0, color: 'red', description: 'Remediation', mastery: false },
    ],
  }

  it('returns correct buckets when student has no rollups', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2, mockOutcome3]
    const rollups: StudentRollupData[] = []

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.no_evidence.count).toBe(3)
    expect(result.buckets.remediation.count).toBe(0)
    expect(result.buckets.near_mastery.count).toBe(0)
    expect(result.buckets.mastery.count).toBe(0)
    expect(result.buckets.exceeds_mastery.count).toBe(0)
    expect(result.masteryRelativeAverage).toBeNull()
    expect(result.grossAverage).toBeNull()
  })

  it('calculates scores correctly with single outcome at mastery', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 5, color: 'green' },
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.no_evidence.count).toBe(0)
    expect(result.buckets.mastery.count).toBe(1)
    expect(result.masteryRelativeAverage).toBe(0) // 5 - 5 = 0
    expect(result.grossAverage).toBe(5)
    expect(result.averageText).toBe('Mastery')
  })

  it('calculates scores correctly with multiple outcomes', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 10, color: 'green' }, // 10 - 5 = +5 (exceeds)
          },
          {
            outcomeId: '2',
            score: 2,
            rating: { points: 3, color: 'green' }, // 3 - 3 = 0 (mastery)
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.exceeds_mastery.count).toBe(1)
    expect(result.buckets.mastery.count).toBe(1)
    expect(result.masteryRelativeAverage).toBe(2.5) // (5 + 0) / 2
    expect(result.grossAverage).toBe(6.5) // (10 + 3) / 2
  })

  it('handles near mastery scores correctly', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 4.5, color: 'yellow' }, // 4.5 - 5 = -0.5 (near mastery)
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.near_mastery.count).toBe(1)
    expect(result.masteryRelativeAverage).toBe(-0.5)
  })

  it('handles remediation scores correctly', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 2, color: 'red' }, // 2 - 5 = -3 (remediation)
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.remediation.count).toBe(1)
    expect(result.masteryRelativeAverage).toBe(-3)
  })

  it('calculates no evidence count correctly with partial rollups', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2, mockOutcome3]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 5, color: 'green' },
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.no_evidence.count).toBe(2) // 3 outcomes - 1 rollup
    expect(result.buckets.mastery.count).toBe(1)
  })

  it('ignores rollups with missing outcome references', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 5, color: 'green' },
          },
          {
            outcomeId: '999', // Non-existent outcome
            score: 2,
            rating: { points: 10, color: 'green' },
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.mastery.count).toBe(1)
    expect(result.masteryRelativeAverage).toBe(0)
    expect(result.grossAverage).toBe(5)
  })

  it('handles different student IDs correctly', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '999', // Different student
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 10, color: 'green' },
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.no_evidence.count).toBe(1)
    expect(result.masteryRelativeAverage).toBeNull()
    expect(result.grossAverage).toBeNull()
  })

  it('handles mixed performance levels correctly', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2, mockOutcome3]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 10, color: 'green' }, // +5 exceeds
          },
          {
            outcomeId: '2',
            score: 2,
            rating: { points: 3, color: 'green' }, // 0 mastery
          },
          {
            outcomeId: '3',
            score: 2,
            rating: { points: 3, color: 'yellow' }, // 3 - 4 = -1 (near mastery)
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.exceeds_mastery.count).toBe(1)
    expect(result.buckets.mastery.count).toBe(1)
    expect(result.buckets.near_mastery.count).toBe(1)
    expect(result.buckets.remediation.count).toBe(0)
    expect(result.masteryRelativeAverage).toBeCloseTo(1.33, 1) // (5 + 0 - 1) / 3
    expect(result.grossAverage).toBeCloseTo(5.33, 1) // (10 + 3 + 3) / 3
  })

  it('sets average icon and text based on average mastery score', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 10, color: 'green' }, // +5 exceeds
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.averageIcon).toBe(ExceedsMasteryIcon)
    expect(result.averageText).toBe('Exceeds Mastery')
  })

  it('handles empty outcomes array', () => {
    const outcomes: Outcome[] = []
    const rollups: StudentRollupData[] = []

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.no_evidence.count).toBe(0)
    expect(result.masteryRelativeAverage).toBeNull()
    expect(result.grossAverage).toBeNull()
  })

  it('handles undefined outcomes and rollups', () => {
    const result = calculateScores([], [], mockStudent)

    expect(result.buckets.no_evidence.count).toBe(0)
    expect(result.masteryRelativeAverage).toBeNull()
    expect(result.grossAverage).toBeNull()
    expect(result.averageIcon).toBe(NoEvidenceIcon)
    expect(result.averageText).toBe('No Evidence')
  })

  it('calculates near mastery boundary correctly', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 4, color: 'yellow' }, // 4 - 5 = -1 (boundary case)
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.near_mastery.count).toBe(1)
    expect(result.buckets.remediation.count).toBe(0)
    expect(result.masteryRelativeAverage).toBe(-1)
  })

  it('calculates remediation boundary correctly', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 3.9, color: 'red' }, // 3.9 - 5 = -1.1 (just into remediation)
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.remediation.count).toBe(1)
    expect(result.buckets.near_mastery.count).toBe(0)
    expect(result.masteryRelativeAverage).toBeCloseTo(-1.1, 2)
  })

  it('correctly identifies no evidence when outcome has no rollup', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 5, color: 'green' },
          },
          // Outcome 2 has no rollup
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.no_evidence.count).toBe(1)
    expect(result.buckets.mastery.count).toBe(1)
  })

  it('handles multiple outcomes with varying mastery thresholds', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2, mockOutcome3]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 2,
            rating: { points: 6, color: 'green' }, // 6 - 5 = +1 (exceeds)
          },
          {
            outcomeId: '2',
            score: 2,
            rating: { points: 4, color: 'green' }, // 4 - 3 = +1 (exceeds)
          },
          {
            outcomeId: '3',
            score: 2,
            rating: { points: 5, color: 'green' }, // 5 - 4 = +1 (exceeds)
          },
        ],
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.exceeds_mastery.count).toBe(3)
    expect(result.buckets.no_evidence.count).toBe(0)
    expect(result.masteryRelativeAverage).toBe(1) // (1 + 1 + 1) / 3
    expect(result.grossAverage).toBe(5) // (6 + 4 + 5) / 3
  })
})
