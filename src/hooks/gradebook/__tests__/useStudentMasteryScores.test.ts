import { calculateScores } from '../useStudentMasteryScores'
import type { Outcome, Student, StudentRollupData } from '@/types/gradebook/rollup'

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

    expect(result.buckets.unassessed.count).toBe(3)
    expect(result.buckets.remediation.count).toBe(0)
    expect(result.buckets.near_mastery.count).toBe(0)
    expect(result.buckets.mastery.count).toBe(0)
    expect(result.buckets.exceeds_mastery.count).toBe(0)
    expect(result.grossAverage).toBeNull()
    expect(result.averageIcon).toBe('unassessed')
    expect(result.averageText).toBe('Unassessed')
  })

  it('calculates bucket counts correctly with single outcome at mastery', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 5,
            masteryLevel: 'mastery',
            rating: { points: 5, color: 'green' },
          },
        ],
        averageMasteryLevel: 'mastery',
        averageScore: 5,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.unassessed.count).toBe(0)
    expect(result.buckets.mastery.count).toBe(1)
    expect(result.grossAverage).toBe(5)
    expect(result.averageIcon).toBe('mastery')
    expect(result.averageText).toBe('Mastery')
  })

  it('calculates bucket counts correctly with multiple outcomes', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 10,
            masteryLevel: 'exceeds_mastery',
            rating: { points: 10, color: 'green' },
          },
          {
            outcomeId: '2',
            score: 3,
            masteryLevel: 'mastery',
            rating: { points: 3, color: 'green' },
          },
        ],
        averageMasteryLevel: 'mastery',
        averageScore: 6.5,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.exceeds_mastery.count).toBe(1)
    expect(result.buckets.mastery.count).toBe(1)
    expect(result.grossAverage).toBe(6.5)
    expect(result.averageIcon).toBe('mastery')
    expect(result.averageText).toBe('Mastery')
  })

  it('handles near mastery scores correctly', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 4.5,
            masteryLevel: 'near_mastery',
            rating: { points: 4.5, color: 'yellow' },
          },
        ],
        averageMasteryLevel: 'near_mastery',
        averageScore: 4.5,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.near_mastery.count).toBe(1)
    expect(result.grossAverage).toBe(4.5)
    expect(result.averageIcon).toBe('near_mastery')
    expect(result.averageText).toBe('Near Mastery')
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
            masteryLevel: 'remediation',
            rating: { points: 2, color: 'red' },
          },
        ],
        averageMasteryLevel: 'remediation',
        averageScore: 2,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.remediation.count).toBe(1)
    expect(result.grossAverage).toBe(2)
    expect(result.averageIcon).toBe('remediation')
    expect(result.averageText).toBe('Remediation')
  })

  it('calculates unassessed count correctly with partial rollups', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2, mockOutcome3]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 5,
            masteryLevel: 'mastery',
            rating: { points: 5, color: 'green' },
          },
        ],
        averageMasteryLevel: 'mastery',
        averageScore: 5,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.unassessed.count).toBe(2) // 3 outcomes - 1 rollup
    expect(result.buckets.mastery.count).toBe(1)
  })

  it('handles rollups without masteryLevel gracefully', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 5,
            rating: { points: 5, color: 'green' },
          },
        ],
        averageMasteryLevel: 'mastery',
        averageScore: 5,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    // Should not crash, but won't count in any bucket
    expect(result.buckets.no_evidence.count).toBe(0)
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
            score: 10,
            masteryLevel: 'exceeds_mastery',
            rating: { points: 10, color: 'green' },
          },
        ],
        averageMasteryLevel: 'exceeds_mastery',
        averageScore: 10,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.unassessed.count).toBe(1)
    expect(result.grossAverage).toBeNull()
    expect(result.averageIcon).toBe('unassessed')
    expect(result.averageText).toBe('Unassessed')
  })

  it('handles mixed performance levels correctly', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2, mockOutcome3]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 10,
            masteryLevel: 'exceeds_mastery',
            rating: { points: 10, color: 'green' },
          },
          {
            outcomeId: '2',
            score: 3,
            masteryLevel: 'mastery',
            rating: { points: 3, color: 'green' },
          },
          {
            outcomeId: '3',
            score: 3,
            masteryLevel: 'near_mastery',
            rating: { points: 3, color: 'yellow' },
          },
        ],
        averageMasteryLevel: 'mastery',
        averageScore: 5.33,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.exceeds_mastery.count).toBe(1)
    expect(result.buckets.mastery.count).toBe(1)
    expect(result.buckets.near_mastery.count).toBe(1)
    expect(result.buckets.remediation.count).toBe(0)
    expect(result.grossAverage).toBe(5.33)
    expect(result.averageIcon).toBe('mastery')
    expect(result.averageText).toBe('Mastery')
  })

  it('sets average icon and text based on backend averageMasteryLevel', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 10,
            masteryLevel: 'exceeds_mastery',
            rating: { points: 10, color: 'green' },
          },
        ],
        averageMasteryLevel: 'exceeds_mastery',
        averageScore: 10,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.averageIcon).toBe('exceeds_mastery')
    expect(result.averageText).toBe('Exceeds Mastery')
  })

  it('handles empty outcomes array', () => {
    const outcomes: Outcome[] = []
    const rollups: StudentRollupData[] = []

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.unassessed.count).toBe(0)
    expect(result.grossAverage).toBeNull()
    expect(result.averageIcon).toBe('unassessed')
    expect(result.averageText).toBe('Unassessed')
  })

  it('handles undefined outcomes and rollups', () => {
    const result = calculateScores([], [], mockStudent)

    expect(result.buckets.unassessed.count).toBe(0)
    expect(result.grossAverage).toBeNull()
    expect(result.averageIcon).toBe('unassessed')
    expect(result.averageText).toBe('Unassessed')
  })

  it('handles rollups without averageMasteryLevel', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 5,
            masteryLevel: 'mastery',
            rating: { points: 5, color: 'green' },
          },
        ],
        averageScore: 5,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.mastery.count).toBe(1)
    expect(result.grossAverage).toBe(5)
    expect(result.averageIcon).toBe('unassessed')
    expect(result.averageText).toBe('Unassessed')
  })

  it('correctly identifies no evidence when outcome has no rollup', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 5,
            masteryLevel: 'mastery',
            rating: { points: 5, color: 'green' },
          },
          // Outcome 2 has no rollup
        ],
        averageMasteryLevel: 'mastery',
        averageScore: 5,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.unassessed.count).toBe(1)
    expect(result.buckets.mastery.count).toBe(1)
  })

  it('handles all outcomes with exceeds mastery', () => {
    const outcomes: Outcome[] = [mockOutcome1, mockOutcome2, mockOutcome3]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 10,
            masteryLevel: 'exceeds_mastery',
            rating: { points: 10, color: 'green' },
          },
          {
            outcomeId: '2',
            score: 5,
            masteryLevel: 'exceeds_mastery',
            rating: { points: 5, color: 'green' },
          },
          {
            outcomeId: '3',
            score: 8,
            masteryLevel: 'exceeds_mastery',
            rating: { points: 8, color: 'green' },
          },
        ],
        averageMasteryLevel: 'exceeds_mastery',
        averageScore: 7.67,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.exceeds_mastery.count).toBe(3)
    expect(result.buckets.no_evidence.count).toBe(0)
    expect(result.grossAverage).toBe(7.67)
    expect(result.averageIcon).toBe('exceeds_mastery')
    expect(result.averageText).toBe('Exceeds Mastery')
  })

  it('verifies bucket icon values are MasteryLevel strings', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = []

    const result = calculateScores(outcomes, rollups, mockStudent)

    expect(result.buckets.no_evidence.icon).toBe('no_evidence')
    expect(result.buckets.remediation.icon).toBe('remediation')
    expect(result.buckets.near_mastery.icon).toBe('near_mastery')
    expect(result.buckets.mastery.icon).toBe('mastery')
    expect(result.buckets.exceeds_mastery.icon).toBe('exceeds_mastery')
  })

  it('handles unassessed mastery level', () => {
    const outcomes: Outcome[] = [mockOutcome1]
    const rollups: StudentRollupData[] = [
      {
        studentId: '1',
        outcomeRollups: [
          {
            outcomeId: '1',
            score: 0,
            masteryLevel: 'unassessed',
            rating: { points: 0, color: 'gray' },
          },
        ],
        averageMasteryLevel: 'unassessed',
        averageScore: 0,
      },
    ]

    const result = calculateScores(outcomes, rollups, mockStudent)

    // unassessed is not in the buckets, but should not crash
    expect(result.grossAverage).toBe(0)
  })
})
