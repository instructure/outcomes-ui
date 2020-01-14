import { expect } from 'chai'
import { fromJS } from 'immutable'
import {
  getIndividualResults,
  getIndividualResultsState
} from '../selectors'

describe('report/selectors', () => {
  const state1 = fromJS({
    scopeForTest: {
      StudentMastery: {
        individualResults: [
          {
            outcome_id: 2215,
            percent_score: 0.6666666666666666,
            points: 2,
            points_possible: 3
          },
          {
            outcome_id: 2216,
            percent_score: 0.3333333333333333,
            points: 1,
            points_possible: 3
          }
        ],
        state: 'loaded'
      }
    }
  })

  const state2 = fromJS({
    scopeForTest: {
      StudentMastery: {
        individualResults: null
      }
    }
  })

  describe('getIndividualResults', () => {
    it('returns results', () => {
      expect(getIndividualResults(state1, 'scopeForTest').length).to.equal(2)
    })

    it('returns null when no results', () => {
      expect(getIndividualResults(state2, 'scopeForTest')).to.deep.equal(null)
    })
  })

  describe('getIndividualResultsState', () => {
    it('returns state', () => {
      expect(getIndividualResultsState(state1, 'scopeForTest')).to.deep.equal('loaded')
    })

    it('returns default state', () => {
      expect(getIndividualResultsState(state2, 'scopeForTest')).to.deep.equal('closed')
    })
  })
})
