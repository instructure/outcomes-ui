import { describe, it, expect } from '@jest/globals'
import { fromJS } from 'immutable'
import { IN_PROGRESS, NOT_FETCHING } from '../../../constants'

import {
  setPage,
  setPageData,
  setRollups,
  setResults,
  setUsers,
  setReportOutcomes,
  setLoading,
  setLoadingRemainingPages,
  clearReportData,
  viewReportAlignment,
  closeReportAlignment
} from '../actions'
import reducer from '../reducers'

describe('reports/reducers', () => {
  // eslint-disable-next-line camelcase
  const user_uuid = '560fddd9-9b16-4e3a-969c-2f095e7afc78'
  const state = fromJS({
    outcomes: {
      100: { id: 100, label: 'blue', title: 'green' }
    },
    rollups: [
      {
        outcomeId: '100',
        averageScore: 0.8,
        count: 1,
        masteryCount: 1,
        childArtifactCount: 0,
      },
    ],
    results: {
      1955: {
        [user_uuid]: {
          user_uuid,
          percent_score: 0.8,
          points: 80.0,
          points_possible: 100.0
        }
      }
    },
    users: [
      { uuid: '100' },
      { uuid: '200' }
    ],
    openReportAlignmentId: 10
  })

  describe('page', () => {
    it('is updated by setPage', () => {
      const newPage = { number: 10, loading: true }
      const newState = reducer(state, setPage(newPage))
      expect(newState.get('page').toJS()).toEqual(newPage)
    })

    it('is cleared by clearReportData', () => {
      const newState = reducer(state, clearReportData())
      expect(newState.get('page').toJS()).toEqual({number: void 0})
    })
  })

  describe('pageData', () => {
    it('is updated by setPageData', () => {
      const newPageData = { perPage: 50, total: 597 }
      const newState = reducer(state, setPageData(newPageData))
      expect(newState.get('pageData').toJS()).toEqual(newPageData)
    })

    it('is cleared by clearReportData', () => {
      const newState = reducer(state, clearReportData())
      expect(newState.get('pageData').toJS()).toEqual({})
    })
  })

  describe('loading', () => {
    it('is updated by setLoading', () => {
      const newState = reducer(state, setLoading(true))
      expect(newState.get('loading')).toBe(true)
    })

    it('is cleared by clearReportData', () => {
      const newState = reducer(state, clearReportData())
      expect(newState.get('loading')).toBe(false)
    })
  })

  describe('loadingRemainingPages', () => {
    it('is updated by setLoadingRemainingPages', () => {
      const newState = reducer(state, setLoadingRemainingPages(IN_PROGRESS))
      expect(newState.get('loadingRemainingPages')).toEqual(IN_PROGRESS)
    })

    it('is cleared by clearReportData', () => {
      const newState = reducer(state, clearReportData())
      expect(newState.get('loadingRemainingPages')).toEqual(NOT_FETCHING)
    })
  })

  describe('outcomes', () => {
    it('is updated by setReportOutcomes', () => {
      const newOutcome = { 200: { id: 200, label: 'yellow', title: 'red' } }
      const newState = reducer(state, setReportOutcomes(newOutcome))
      expect(newState.get('outcomes').toJS()).toEqual(newOutcome)
    })

    it('is cleared by clearReportData', () => {
      const newState = reducer(state, clearReportData())
      expect(newState.get('outcomes').toJS()).toEqual({})
    })
  })

  describe('rollups', () => {
    it('is updated by setRollups', () => {
      const newRollup = { outcomeId: 200, averageScore: 0.9, count: 1, masteryCount: 1, childArtifactCount: 0 }
      const newState = reducer(state, setRollups([newRollup]))
      expect(newState.get('rollups').toJS()).toEqual([newRollup])
    })

    it('is cleared by clearReportData', () => {
      const newState = reducer(state, clearReportData())
      expect(newState.get('rollups').toJS()).toEqual([])
    })
  })

  describe('results', () => {
    it('is updated by setResults', () => {
      const result = { user_uuid, points: 95.0, points_possible: 100, attempt: 1 }
      const newResults = {
        outcomeId: '1955',
        results: [result],
        seenResults: new Map()
      }

      const newState = reducer(state, setResults(newResults))

      expect(newState.getIn(['results', '1955', user_uuid.toString()]).toJS())
        .toEqual({
          userId: user_uuid,
          percentScore: result.percent_score,
          points: result.points,
          pointsPossible: result.points_possible,
          attempt: result.attempt
        })
    })

    it('retains seenResults when updated', () => {
      const seenResult = { userId: 'old_user', points: 90.0, pointsPossible: 100 }
      const result = { user_uuid, points: 95.0, points_possible: 100 }
      const newResults = {
        outcomeId: '1955',
        results: [result],
        seenResults: new Map([[seenResult.userId, seenResult]])
      }

      const newState = reducer(state, setResults(newResults))
      expect(newState.getIn(['results', '1955', seenResult.userId]))
        .toEqual({
          userId: seenResult.userId,
          points: seenResult.points,
          pointsPossible: seenResult.pointsPossible
        })
    })

    it('is cleared by clearReportData', () => {
      const newState = reducer(state, clearReportData())
      expect(newState.get('results').toJS()).toEqual({})
    })
  })

  describe('openReportAlignmentId', () => {
    it('is set by VIEW_REPORT_ALIGNMENT', () => {
      const newState = reducer(state, viewReportAlignment(99))
      expect(newState.get('openReportAlignmentId')).toEqual(99)
    })

    it('is cleared by CLOSE_REPORT_ALIGNMENT', () => {
      const newState = reducer(state, closeReportAlignment(null))
      expect(newState.get('openReportAlignmentId')).toEqual(null)
    })
  })

  describe('users', () => {
    it('is updated by setUsers', () => {
      const newUsers = {0: [{ uuid: '200' }, { uuid: '300' }]}
      const newState = reducer(state, setUsers(newUsers))
      expect(newState.get('users').toJS()).toEqual(newUsers)
    })

    it('is cleared by clearReportData', () => {
      const newState = reducer(state, clearReportData())
      expect(newState.get('users').toJS()).toEqual({})
    })
  })
})
