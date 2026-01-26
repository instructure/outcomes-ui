import { fromJS } from 'immutable'
import { expect, describe, it } from '@jest/globals'
import * as actions from '../actions'
import reducer from '../reducers'

describe('search/reducers', () => {
  const state = fromJS({
    searchText: 'lion',
    isLoading: false,
    entries: [],
    pagination: {
      page: 1,
      total: 10
    }
  })

  describe('searchText', () => {
    it('is set by setSearchText', () => {
      const next = reducer(state, actions.setSearchText('elephant'))
      expect(next.get('searchText')).toBe('elephant')
    })
  })

  describe('isLoading', () => {
    it('is set by setSearchLoading', () => {
      const next = reducer(state, actions.setSearchLoading(true))
      expect(next.get('isLoading')).toBe(true)
    })
  })

  describe('entries', () => {
    it('is set by setSearchEntries', () => {
      const next = reducer(state, actions.setSearchEntries([]))
      expect(next.get('entries')).toEqual(fromJS([]))
    })
  })

  describe('page', () => {
    it('is set by setSearchPage', () => {
      const next = reducer(state, actions.setSearchPage(111))
      expect(next.get('pagination').get('page')).toBe(111)
    })
  })

  describe('total', () => {
    it('is set by setSearchTotal', () => {
      const next = reducer(state, actions.setSearchTotal(9))
      expect(next.get('pagination').get('total')).toBe(9)
    })
  })
})
