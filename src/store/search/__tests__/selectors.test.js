import { expect } from 'chai'
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
      expect(getSearchText(state, scope)).to.equal('abc')
    })
  })

  describe('getIsSearchLoading', () => {
    it('returns the loading state', () => {
      expect(getIsSearchLoading(state, scope)).to.equal(true)
    })
  })

  describe('getSearchEntries', () => {
    it('returns the search entries', () => {
      expect(getSearchEntries(state, scope)).to.deep.equal([])
    })
  })

  describe('getSearchPage', () => {
    it('returns the current page', () => {
      expect(getSearchPage(state, scope)).to.equal(7)
    })
  })

  describe('getSearchTotal', () => {
    it('returns the current total', () => {
      expect(getSearchTotal(state, scope)).to.equal(100)
    })
  })
})
