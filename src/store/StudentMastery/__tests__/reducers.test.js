import { expect } from 'chai'
import { fromJS } from 'immutable'

import {
  setIndividualResults,
  setIndividualResultsState
} from '../actions'
import reducer from '../reducers'

describe('StudentMastery/reducers', () => {
  const state = fromJS({})

  describe('individualResults', () => {
    it('is updated by setIndividualResults', () => {
      const newResults = [
        {
          outcome_id: 2215,
          percent_score: 0.6666666666666666,
          points: 2,
          points_possible: 3
        }
      ]
      const newState = reducer(state, setIndividualResults(newResults))
      expect(newState.get('individualResults').toJS()).to.deep.equal(newResults)
    })

    it('defaults to empty array if null results', () => {
      const newState = reducer(state, setIndividualResults(null))
      expect(newState.get('individualResults').toJS()).to.deep.equal([])
    })
  })

  describe('state', () => {
    it('sets state', () => {
      const newState = reducer(state, setIndividualResultsState('loading'))
      expect(newState.get('state')).to.equal('loading')
    })
  })
})
