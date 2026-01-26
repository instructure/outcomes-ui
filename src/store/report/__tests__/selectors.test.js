import { describe, it, expect } from '@jest/globals'
import { Map, fromJS } from 'immutable'
import {
  formatCSVData,
  getPageCount,
  getPageNumber,
  getRollups,
  getScore,
  isOpen,
  getUsers,
  getReportOutcome,
  getHighestPageSeen
} from '../selectors'

describe('report/selectors', () => {
  const state = fromJS({
    scopeForTest: {
      report: {
        page: { number: 2, loaded: true },
        pageData: { perPage: 50, total: 149 },
        rollups: [
          { outcomeId: '123', usesBank: false, childArtifactCount: 0 }
        ],
        results: {
          123: {
            10: {
              percentScore: 0.5,
              points: 100,
              pointsPossible: 200,
              attempt: 1
            },
            20: {
              percentScore: 0.6,
              points: 120,
              pointsPossible: 200,
              attempt: 1
            },
            100: {
              percentScore: 0.5,
              points: 100,
              pointsPossible: 200,
              attempt: 1
            },
            200: {
              percentScore: 0.6,
              points: 120,
              pointsPossible: 200,
              attempt: 1
            }
          }
        },
        users: {
          1: [{ uuid: '10', full_name: 'Student 1' }, { uuid: '20', full_name: 'Student 2' }],
          2: [{ uuid: '100', full_name: 'Student 3' }, { uuid: '200', full_name: 'Student 4' }]
        },
        openReportAlignmentId: 12,
        outcomes: {
          123: {
            id: '123',
            label: 'foo',
            title: 'foobar',
            scoring_method: {
              mastery_percent: 0.6
            }
          }
        }
      }
    }
  })

  describe('getPageCount', () => {
    it('returns the right page count', () => {
      expect(getPageCount(state, 'scopeForTest')).toEqual(3)
    })

    it('returns null on initial load', () => {
      const newState = Map()
      expect(getPageCount(newState, 'scopeForTest')).toEqual(null)
    })
  })

  describe('getCurrentPage', () => {
    it('returns the current page', () => {
      expect(getPageNumber(state, 'scopeForTest')).toEqual(2)
    })
  })

  describe('getRollups', () => {
    it('retrieves the correct rollups', () => {
      expect(getRollups(state, 'scopeForTest')).toEqual([
        { outcomeId: '123', usesBank: false, childArtifactCount: 0 }
      ])
    })

    it('returns an empty array if no outcomes are selected', () => {
      const newState = Map()
      expect(getRollups(newState, 'scopeForTest')).toEqual([])
    })
  })

  describe('getScore', () => {
    it('returns score if outcome id and user id are present', () => {
      expect(getScore(state, 'scopeForTest', '123', '10')).toEqual({
        percentScore: 0.5,
        points: 100,
        pointsPossible: 200,
        attempt: 1
      })
    })

    it('returns null if outcome is not present', () => {
      expect(getScore(state, 'scopeForTest', '2', '2')).toEqual(null)
    })

    it('returns null if user is not present', () => {
      expect(getScore(state, 'scopeForTest', '1', '3')).toEqual(null)
    })
  })

  describe('isOpen', () => {
    it('returns true if alignment id is openReportAlignmentId', () => {
      expect(isOpen(state, 'scopeForTest', 12)).toBe(true)
    })

    it('returns false if another alignment id is openReportAlignmentId', () => {
      expect(isOpen(state, 'scopeForTest', 13)).toBe(false)
    })

    it('returns false if no alignment is openReportAlignmentId', () => {
      const newState = Map()
      expect(isOpen(newState, 'scopeForTest', 12)).toBe(false)
    })
  })

  describe('getUsers', () => {
    it('retrieves the correct users', () => {
      const pageNumber = getPageNumber(state, 'scopeForTest')
      expect(getUsers(state, 'scopeForTest', pageNumber)).toEqual([
        { uuid: '100', full_name: 'Student 3' },
        { uuid: '200', full_name: 'Student 4' }
      ])
    })

    it('returns an empty array if no users are present', () => {
      const newState = Map()
      expect(getUsers(newState, 'scopeForTest')).toEqual([])
    })
  })

  describe('getReportOutcome', () => {
    it('retrieves the correct outcome', () => {
      expect(getReportOutcome(state, 'scopeForTest', '123')).toEqual({
        id: '123',
        label: 'foo',
        title: 'foobar',
        scoring_method: {
          mastery_percent: 0.6
        }
      })
    })

    it('returns nil if no outcome is found', () => {
      expect(getReportOutcome(state, 'scopeForTest', '124')).toEqual(null)
    })
  })

  describe('getHighestPageSeen', () => {
    it('retrieves the highest page the user has viewed', () => {
      expect(getHighestPageSeen(state, 'scopeForTest')).toEqual(2)
    })

    it('returns 0 if no pages have been viewed', () => {
      const newState = Map()
      expect(getHighestPageSeen(newState, 'scopeForTest')).toEqual(0)
    })
  })

  describe('formatCSVData', () => {
    it('has a row for each user result', () => {
      const formattedData = formatCSVData(state, 'scopeForTest')
      expect(formattedData).toHaveLength(4)
    })
  })
})
