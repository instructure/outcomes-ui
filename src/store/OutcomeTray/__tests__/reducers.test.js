import { expect } from 'chai'
import { fromJS } from 'immutable'
import * as actions from '../actions'
import reducer from '../reducers'

describe('OutcomeTray/reducers', () => {
  const state = fromJS({ entries: [] })
  describe('list', () => {
    it('is set by setOutcomeList', () => {
      const next = reducer(state, actions.setOutcomeList(['1', '2']))
      expect(next.get('list')).to.deep.equal(fromJS(['1', '2']))
    })
  })
})
