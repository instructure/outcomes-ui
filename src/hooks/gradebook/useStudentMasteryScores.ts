import { useMemo } from 'react'
import type { FunctionComponent, SVGProps } from 'react'
import t from 'format-message'
import { Outcome, StudentRollupData, Student } from '@/types/gradebook/rollup'
import { NoEvidenceIcon } from '@components/Gradebook/icons/NoEvidenceIcon'
import { RemediationIcon } from '@components/Gradebook/icons/RemediationIcon'
import { NearMasteryIcon } from '@components/Gradebook/icons/NearMasteryIcon'
import { MasteryIcon } from '@components/Gradebook/icons/MasteryIcon'
import { ExceedsMasteryIcon } from '@components/Gradebook/icons/ExceedsMasteryIcon'

export interface MasteryBucket {
  name: string
  icon: FunctionComponent<SVGProps<SVGSVGElement>>
  count: number
}

export interface StudentMasteryScores {
  masteryRelativeAverage: number | null
  grossAverage: number | null
  averageIcon: FunctionComponent<SVGProps<SVGSVGElement>>
  averageText: string
  buckets: {
    [key: string]: MasteryBucket
  }
}

export const pickBucketForScore = (
  score: number | null,
  buckets: StudentMasteryScores['buckets'],
): MasteryBucket => {
  if (score === null) return buckets.no_evidence
  if (score > 0) return buckets.exceeds_mastery
  if (score === 0) return buckets.mastery
  if (score < -1) return buckets.remediation
  if (score < 0) return buckets.near_mastery
  return buckets.no_evidence
}

export const calculateScores = (
  outcomes: Outcome[],
  rollups: StudentRollupData[],
  student: Student,
): StudentMasteryScores => {
  const result: StudentMasteryScores = {
    masteryRelativeAverage: null,
    grossAverage: null,
    averageIcon: NoEvidenceIcon,
    averageText: '',
    buckets: {
      no_evidence: {
        name: t('No Evidence'),
        icon: NoEvidenceIcon,
        count: 0,
      },
      remediation: {
        name: t('Remediation'),
        icon: RemediationIcon,
        count: 0,
      },
      near_mastery: {
        name: t('Near Mastery'),
        icon: NearMasteryIcon,
        count: 0,
      },
      mastery: {
        name: t('Mastery'),
        icon: MasteryIcon,
        count: 0,
      },
      exceeds_mastery: {
        name: t('Exceeds Mastery'),
        icon: ExceedsMasteryIcon,
        count: 0,
      },
    },
  }

  const userOutcomeRollups = rollups?.find(r => r.studentId === student.id)?.outcomeRollups || []

  if (outcomes?.length)
    result.buckets.no_evidence.count = outcomes.length - userOutcomeRollups.length

  let grossTotalScore = 0
  let masteryRelativeTotalScore = 0
  let withResultsCount = 0

  userOutcomeRollups.forEach(rollup => {
    const outcome = outcomes?.find(o => o.id === rollup.outcomeId)
    if (!outcome) return
    const masteryScore = rollup.rating.points - outcome.mastery_points
    const bucket = pickBucketForScore(masteryScore, result.buckets)
    bucket.count++
    masteryRelativeTotalScore += masteryScore
    grossTotalScore += rollup.rating.points
    withResultsCount++
  })

  if (withResultsCount > 0) {
    result.masteryRelativeAverage = masteryRelativeTotalScore / withResultsCount
    result.grossAverage = grossTotalScore / withResultsCount
  }

  const averageBucket = pickBucketForScore(result.masteryRelativeAverage, result.buckets)
  result.averageIcon = averageBucket.icon
  result.averageText = averageBucket.name

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
