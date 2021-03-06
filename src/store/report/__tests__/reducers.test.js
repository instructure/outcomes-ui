import { expect } from 'chai'
import { fromJS } from 'immutable'

import {
  setPage,
  setPageData,
  setRollups,
  setResults,
  setUsers,
  viewReportAlignment,
  closeReportAlignment
} from '../actions'
import reducer from '../reducers'

describe('reports/reducers', () => {
  // eslint-disable-next-line camelcase
  const user_uuid = '560fddd9-9b16-4e3a-969c-2f095e7afc78'
  const state = fromJS({
    rollups: {
      100: { id: 100, label: 'blue', title: 'green' }
    },
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
      expect(newState.get('page').toJS()).to.deep.equal(newPage)
    })
  })

  describe('pageData', () => {
    it('is updated by setPageData', () => {
      const newPageData = { perPage: 50, total: 597 }
      const newState = reducer(state, setPageData(newPageData))
      expect(newState.get('pageData').toJS()).to.deep.equal(newPageData)
    })
  })

  describe('rollups', () => {
    it('is updated by setRollups', () => {
      const newRollup = { id: 200, label: 'yellow', title: 'red' }
      const newState = reducer(state, setRollups([newRollup]))
      expect(newState.get('rollups').toJS()).to.deep.equal([newRollup])
    })
  })

  describe('results', () => {
    it('is updated by setResults', () => {
      const result = { user_uuid, points: 95.0, points_possible: 100 }
      const newResults = {
        outcomeId: '1955',
        results: [result]
      }

      const newState = reducer(state, setResults(newResults))

      expect(newState.getIn(['results', '1955', user_uuid.toString()]).toJS())
        .to.deep.equal({
          userId: user_uuid,
          percentScore: result.percent_score,
          points: result.points,
          pointsPossible: result.points_possible
        })
    })
  })

  describe('openReportAlignmentId', () => {
    it('is set by VIEW_REPORT_ALIGNMENT', () => {
      const newState = reducer(state, viewReportAlignment(99))
      expect(newState.get('openReportAlignmentId')).to.equal(99)
    })

    it('is cleared by CLOSE_REPORT_ALIGNMENT', () => {
      const newState = reducer(state, closeReportAlignment(null))
      expect(newState.get('openReportAlignmentId')).to.equal(null)
    })
  })

  describe('users', () => {
    it('is updated by setUsers', () => {
      const newUsers = [{ uuid: '200' }, { uuid: '300' }]
      const newState = reducer(state, setUsers(newUsers))
      expect(newState.get('users').toJS()).to.deep.equal(newUsers)
    })
  })
})
