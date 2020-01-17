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
  const state = fromJS({
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
  })

  describe('getSearchText', () => {
    it('returns the search text', () => {
      expect(getSearchText(state)).to.equal('abc')
    })
  })

  describe('getIsSearchLoading', () => {
    it('returns the loading state', () => {
      expect(getIsSearchLoading(state)).to.equal(true)
    })
  })

  describe('getSearchEntries', () => {
    it('returns the search entries', () => {
      expect(getSearchEntries(state)).to.deep.equal([])
    })
  })

  describe('getSearchPage', () => {
    it('returns the current page', () => {
      expect(getSearchPage(state)).to.equal(7)
    })
  })

  describe('getSearchTotal', () => {
    it('returns the current total', () => {
      expect(getSearchTotal(state)).to.equal(100)
    })
  })
})
