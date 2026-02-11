import { useMemo } from 'react'
import t from 'format-message'
import { Outcome, StudentRollupData, Student, MasteryLevel } from '@/types/gradebook/rollup'

export interface MasteryBucket {
  name: string
  icon: MasteryLevel
  count: number
}

export interface StudentMasteryScores {
  grossAverage: number | null
  averageIcon: MasteryLevel
  averageText: string
  buckets: {
    [key: string]: MasteryBucket
  }
}

export const calculateScores = (
  outcomes: Outcome[],
  rollups: StudentRollupData[],
  student: Student,
): StudentMasteryScores => {
  const result: StudentMasteryScores = {
    grossAverage: null,
    averageIcon: 'unassessed',
    averageText: t('Unassessed'),
    buckets: {
      unassessed: {
        name: t('Unassessed'),
        icon: 'unassessed',
        count: 0,
      },
      no_evidence: {
        name: t('No Evidence'),
        icon: 'no_evidence',
        count: 0,
      },
      remediation: {
        name: t('Remediation'),
        icon: 'remediation',
        count: 0,
      },
      near_mastery: {
        name: t('Near Mastery'),
        icon: 'near_mastery',
        count: 0,
      },
      mastery: {
        name: t('Mastery'),
        icon: 'mastery',
        count: 0,
      },
      exceeds_mastery: {
        name: t('Exceeds Mastery'),
        icon: 'exceeds_mastery',
        count: 0,
      },
    },
  }

  const userRollupData = rollups?.find(r => r.studentId === student.id)
  const userOutcomeRollups = userRollupData?.outcomeRollups || []

  if (outcomes?.length)
    result.buckets.unassessed.count = outcomes.length - userOutcomeRollups.length

  userOutcomeRollups.forEach(rollup => {
    // Use backend-calculated masteryLevel
    const masteryLevel = rollup.masteryLevel
    if (masteryLevel) {
      const bucket = result.buckets[masteryLevel]
      if (bucket) {
        bucket.count++
      }
    }
  })

  // Use backend-calculated average score
  result.grossAverage = userRollupData?.averageScore ?? null

  // Use backend-calculated average mastery level
  const averageMasteryLevel = userRollupData?.averageMasteryLevel
  if (averageMasteryLevel) {
    const averageBucket = result.buckets[averageMasteryLevel]
    result.averageIcon = averageBucket.icon
    result.averageText = averageBucket.name
  }

  return result
}

interface UseStudentMasteryScoresProps {
  student: Student | null
  outcomes: Outcome[]
  rollups: StudentRollupData[]
}

export const useStudentMasteryScores = ({
  student,
  outcomes,
  rollups,
}: UseStudentMasteryScoresProps): StudentMasteryScores | null => {
  return useMemo(() => {
    if (!student) return null
    return calculateScores(outcomes, rollups, student)
  }, [student, outcomes, rollups])
}
