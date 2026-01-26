import { expect } from '@jest/globals'
import {
  formatDataIntoRow,
  hasMastery,
  fileName,
  getDate,
  formatPercentage
} from '../outcomesReportUtils'
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
} from '../../constants'

const user1 = {
  uuid: 'user1-uuid',
  full_name: 'Student 1'
}

const user2 = {
  uuid: 'user2-uuid',
  full_name: 'Student 2'
}

const rollup = {
  outcomeId: '1',
  childArtifactCount: 1,
  usesBank: false
}

const outcome = {
  id: '1',
  guid:'outcome-guid',
  group: false,
  label: 'outcome friendly name',
  title: 'outcome name',
  description: 'outcome description',
  external_id: 10,
  scoring_method: {
    algorithm: 'average',
    algorithm_data: {},
    mastery_percent: 0.6,
    points_possible: 5
  }
}

const masteryResult = {
  userId: user1.uuid,
  percentScore: 0.6667,
  points: 2,
  pointsPossible: 3,
  attempt: 1
}

const nonMasteryResult = {
  userId: user2.uuid,
  percentScore: 0.3333,
  points: 1,
  pointsPossible: 3,
  attempt: 1
}

describe('outcomesReportUtils', () => {
  describe('formatDataInRow', () => {
    it('returns the correct value for each row header', () => {
      const formattedRow = formatDataIntoRow(user1, outcome, rollup, masteryResult)
      expect(formattedRow[STUDENT_NAME]).toEqual(user1.full_name)
      expect(formattedRow[STUDENT_UUID]).toEqual(user1.uuid)
      expect(formattedRow[ATTEMPT_COUNT]).toEqual(masteryResult.attempt)
      expect(formattedRow[ALIGNED_QUESTIONS_COUNT]).toEqual(rollup.childArtifactCount)
      expect(formattedRow[LOR_POINTS]).toEqual(masteryResult.points)
      expect(formattedRow[LOR_POINTS_POSSIBLE]).toEqual(masteryResult.pointsPossible)
      expect(formattedRow[LO_NAME]).toEqual(outcome.title)
      expect(formattedRow[LO_ID]).toEqual(outcome.id)
      expect(formattedRow[LO_MASTERY_PERCENT]).toEqual(outcome.scoring_method.mastery_percent)
      expect(formattedRow[LO_MASTERED]).toEqual(true)
      expect(Object.keys(formattedRow)).toHaveLength(10)
    })

    describe('for aligned questions count row', () => {
      it('returns Variable Questions for aligned questions count if a bank was used', () => {
        const usesBank = {
          outcomeId: '1',
          usesBank: true
        }
        const formattedRow = formatDataIntoRow(user1, outcome, usesBank, masteryResult)
        expect(formattedRow[ALIGNED_QUESTIONS_COUNT]).toEqual('Variable Questions')
      })
    })
  })

  describe('hasMastery', () => {
    it('returns true if the student achieved mastery for the given outcome', () => {
      expect(hasMastery(masteryResult, outcome)).toEqual(true)
    })

    it('returns false if the student did not reach mastery for the given outcome', () => {
      expect(hasMastery(nonMasteryResult, outcome)).toEqual(false)
    })
  })

  describe('fileName', () => {
    it('returns the file name for the csv report', () => {
      const name = fileName(1)
      expect(name.includes('outcome_analysis_csv_')).toEqual(true)
      expect(name.includes('_quiz_1.csv')).toEqual(true)
    })
  })

  describe('getDate', () => {
    // Regex for yyyy-mm-dd format was found here:
    // https://stackoverflow.com/questions/22061723/regex-date-validation-for-yyyy-mm-dd
    it('returns the date in yyyy-mm-dd format', () => {
      expect(getDate().match(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/).length).toBeGreaterThan(0)
    })
  })

  describe('formatPercentage', () => {
    it('formats two numbers into a percentage', () => {
      expect(formatPercentage(50, 100)).toEqual(50)
      expect(formatPercentage(5, 10)).toEqual(50)
    })

    it('formats two numbers into a percentage and rounds', () => {
      expect(formatPercentage(1, 3)).toEqual(33)
    })
  })
})