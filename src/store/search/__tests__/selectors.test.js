import { expect, describe, it } from '@jest/globals'
import { fromJS } from 'immutable'
import {
  getSearchText,
  getIsSearchLoading,
  getSearchEntries,
  getSearchPage,
  getSearchTotal
} from '../selectors'

describe('search/selectors', () => {
  const scope = 'scopeForTest'
  const state = fromJS({
    scopeForTest: {
      OutcomePicker: {
        search: {
          searchText: 'abc',
          isLoading: true,
          entries: [],
          pagination: {
            page: 7,
            total: 100
          }
        }
      }
    }
  })

  describe('getSearchText', () => {
    it('returns the search text', () => {
      expect(getSearchText(state, scope)).toBe('abc')
    })
  })

  describe('getIsSearchLoading', () => {
    it('returns the loading state', () => {
      expect(getIsSearchLoading(state, scope)).toBe(true)
    })
  })

  describe('getSearchEntries', () => {
    it('returns the search entries', () => {
      expect(getSearchEntries(state, scope)).toEqual([])
    })
  })

  describe('getSearchPage', () => {
    it('returns the current page', () => {
      expect(getSearchPage(state, scope)).toBe(7)
    })
  })

  describe('getSearchTotal', () => {
    it('returns the current total', () => {
      expect(getSearchTotal(state, scope)).toBe(100)
    })
  })
})
