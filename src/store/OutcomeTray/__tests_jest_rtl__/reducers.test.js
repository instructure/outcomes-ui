import { it, expect } from '@jest/globals'
import { fromJS } from 'immutable'
import * as actions from '../actions'
import reducer from '../reducers'

describe('OutcomeTray/reducers', () => {
  const state = fromJS({ entries: [], pagination: { page: 1, total: null } })
  describe('list', () => {
    it('is set by setOutcomeList', () => {
      const next = reducer(state, actions.setOutcomeList(['1', '2']))
      expect(next.get('list')).toEqual(fromJS(['1', '2']))
    })
  })
  describe('page', () => {
    it('is set by setListPage', () => {
      const next = reducer(state, actions.setListPage(111))
      expect(next.get('pagination').get('page')).toEqual(111)
    })
  })

  describe('total', () => {
    it('is set by setListTotal', () => {
      const next = reducer(state, actions.setListTotal(9))
      expect(next.get('pagination').get('total')).toEqual(9)
    })
  })
})
