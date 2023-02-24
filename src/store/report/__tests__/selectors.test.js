import { expect } from 'chai'
import { Map, fromJS } from 'immutable'
import {
  getPageCount,
  getPageNumber,
  getRollups,
  getScore,
  isOpen,
  getUsers,
  getReportOutcome
} from '../selectors'

describe('report/selectors', () => {
  const state = fromJS({
    scopeForTest: {
      report: {
        page: { number: 2, loaded: true },
        pageData: { perPage: 50, total: 149 },
        rollups: [
          { a: 1, b: 2 }
        ],
        results: {
          1: {
            2: {
              percentScore: 0.5,
              points: 100,
              pointsPossible: 200
            }
          }
        },
        users: {
          2: [{ uuid: '100' }, { uuid: '200' }]
        },
        openReportAlignmentId: 12,
        outcomes: {
          123: {
            id: '123',
            label: 'foo'
          }
        }
      }
    }
  })

  describe('getPageCount', () => {
    it('returns the right page count', () => {
      expect(getPageCount(state, 'scopeForTest')).to.deep.equal(3)
    })

    it('returns null on initial load', () => {
      const newState = Map()
      expect(getPageCount(newState, 'scopeForTest')).to.deep.equal(null)
    })
  })

  describe('getCurrentPage', () => {
    it('returns the current page', () => {
      expect(getPageNumber(state, 'scopeForTest')).to.deep.equal(2)
    })
  })

  describe('getRollups', () => {
    it('retrieves the correct rollups', () => {
      expect(getRollups(state, 'scopeForTest')).to.deep.equal([{ a: 1, b: 2 }])
    })

    it('returns an empty array if no outcomes are selected', () => {
      const newState = Map()
      expect(getRollups(newState, 'scopeForTest')).to.deep.equal([])
    })
  })

  describe('getScore', () => {
    it('returns score if outcome id and user id are present', () => {
      expect(getScore(state, 'scopeForTest', '1', '2')).to.deep.equal({
        percentScore: 0.5,
        points: 100,
        pointsPossible: 200
      })
    })

    it('returns null if outcome is not present', () => {
      expect(getScore(state, 'scopeForTest', '2', '2')).to.equal(null)
    })

    it('returns null if user is not present', () => {
      expect(getScore(state, 'scopeForTest', '1', '3')).to.equal(null)
    })
  })

  describe('isOpen', () => {
    it('returns true if alignment id is openReportAlignmentId', () => {
      expect(isOpen(state, 'scopeForTest', 12)).to.be.true
    })

    it('returns false if another alignment id is openReportAlignmentId', () => {
      expect(isOpen(state, 'scopeForTest', 13)).to.be.false
    })

    it('returns false if no alignment is openReportAlignmentId', () => {
      const newState = Map()
      expect(isOpen(newState, 'scopeForTest', 12)).to.be.false
    })
  })

  describe('getUsers', () => {
    it('retrieves the correct users', () => {
      const pageNumber = getPageNumber(state, 'scopeForTest')
      expect(getUsers(state, 'scopeForTest', pageNumber)).to.deep.equal([{ uuid: '100' }, { uuid: '200' }])
    })

    it('returns an empty array if no users are present', () => {
      const newState = Map()
      expect(getUsers(newState, 'scopeForTest')).to.deep.equal([])
    })
  })

  describe('getReportOutcome', () => {
    it('retrieves the correct outcome', () => {
      expect(getReportOutcome(state, 'scopeForTest', '123')).to.deep.equal({ id: '123', label: 'foo' })
    })

    it('returns nil if no outcome is found', () => {
      expect(getReportOutcome(state, 'scopeForTest', '124')).to.equal(null)
    })
  })
})
