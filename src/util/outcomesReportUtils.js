import t from 'format-message'
import {
  STUDENT_NAME,
  STUDENT_UUID,
  ATTEMPT_COUNT,
  ALIGNED_QUESTIONS_COUNT,
  LOR_POINTS,
  LOR_POINTS_POSSIBLE,
  LO_NAME,
  LO_ID,
  LO_MASTERY_PERCENT,
  LO_MASTERED
} from '../constants'

export const formatDataIntoRow = (user, outcome, rollup, result) => {
  return {
    [STUDENT_NAME]: user.full_name,
    [STUDENT_UUID]: user.uuid,
    [ATTEMPT_COUNT]: result.attempt,
    [ALIGNED_QUESTIONS_COUNT]: getAlignedQuestionsCount(rollup),
    [LOR_POINTS]: result.points,
    [LOR_POINTS_POSSIBLE]: result.pointsPossible,
    [LO_NAME]: outcome.title,
    [LO_ID]: outcome.id,
    [LO_MASTERY_PERCENT]: outcome.scoring_method.mastery_percent,
    [LO_MASTERED]: hasMastery(result, outcome)
  }
}

export const hasMastery = (result, outcome) => {
  return result && result.percentScore >= outcome.scoring_method.mastery_percent
}

export const fileName = (id) => {
  const date = getDate()
  return `outcome_analysis_csv_${date}_quiz_${id}.csv`
}

export const getDate = () => {
  // Found this solution on stackoverflow:
  // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  const now = new Date(Date.now())
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - (offset*60*1000)).toISOString().split('T')[0]
}

export const formatPercentage = (value, maxValue) => Math.round((value / maxValue) * 100)

// Note: Once OS has Item Bank alignments, this will need to be updated
const getAlignedQuestionsCount = (rollup) => {
  return rollup.usesBank ? t('Variable Questions') : rollup.childArtifactCount
}
