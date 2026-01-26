import { expect, jest, describe, beforeEach, afterEach, it } from '@jest/globals'
import { fromJS } from 'immutable'
import {
  SET_SEARCH_TEXT,
  SET_SEARCH_LOADING,
  SET_SEARCH_ENTRIES
} from '../../../constants'
import createMockStore, { scopeActions } from '../../../test/createMockStore_jest_rtl'
import { setOutcomes } from '../../context/actions'

// Mock the debounce module
jest.mock('lodash/debounce', () => (fn) => (...args) => fn(...args))

// Import actions after mocking dependencies
import * as actions from '../actions'

const scopedActions = scopeActions({ ...actions, setOutcomes })

describe('search/actions', () => {
  const contextUuid = 'course_100'
  const selectedLaunchContext = {uuid: 'dummy_uuid', name: 'Dummy UUID'}
  const launchContexts = [
    {uuid: contextUuid, name: contextUuid},
    selectedLaunchContext
  ]
  const state = fromJS({
    scopeForTest: {
      config: {
        contextUuid: contextUuid
      },
      OutcomePicker: {
        search: {
          searchText: 'abc',
          pagination: {
            page: 1,
            total: null,
          },
          isLoading: true,
          entries: []
        }
      }
    }
  })

  describe('search updates', () => {
    const service = {
      getSearchResults: jest.fn().mockResolvedValue({})
    }
    beforeEach(() => {
      jest.clearAllMocks()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('updateSearchText', () => {
      it('handles search flow in the correct order', () => {
        const store = createMockStore(state, service)
        store.dispatch(actions.updateSearchText('def'))
        expect(store.getActions()[0]).toEqual(scopedActions.setSearchText('def'))
        expect(store.getActions()[1]).toEqual(scopedActions.setSearchPage(1))
        expect(store.getActions()[2]).toEqual(scopedActions.setSearchTotal(null))
        expect(store.getActions()[3]).toEqual(scopedActions.setSearchLoading(true))
        expect(store.getActions()).toHaveLength(5)
        expect(service.getSearchResults).toHaveBeenCalled()
        expect(service.getSearchResults.mock.calls[0]).toContain('def') // text
        expect(service.getSearchResults.mock.calls[0]).toContain(1) // page
        expect(service.getSearchResults.mock.calls[0]).toContain(contextUuid) // context
      })

      it('handles launch context selector', () => {
        const newState = state.merge({
          scopeForTest: {
            alignments: {
              launchContexts: launchContexts
            },
            OutcomePicker: {
              selectedLaunchContext: selectedLaunchContext
            }
          }
        })
        const store = createMockStore(newState, service)
        store.dispatch(actions.updateSearchText('def'))
        expect(store.getActions()[0]).toEqual(scopedActions.setSearchText('def'))
        expect(store.getActions()[1]).toEqual(scopedActions.setSearchPage(1))
        expect(store.getActions()[2]).toEqual(scopedActions.setSearchTotal(null))
        expect(store.getActions()[3]).toEqual(scopedActions.setSearchLoading(true))
        expect(store.getActions()).toHaveLength(5)
        expect(service.getSearchResults).toHaveBeenCalled()
        expect(service.getSearchResults.mock.calls[0]).toContain('def') // text
        expect(service.getSearchResults.mock.calls[0]).toContain(1) // page
        expect(service.getSearchResults.mock.calls[0]).toContain(selectedLaunchContext.uuid) // context
      })
    })

    describe('updateSearchPage', () => {
      it('triggers a search action', () => {
        const store = createMockStore(state, service)
        store.dispatch(actions.updateSearchPage(10))
        expect(store.getActions()[0]).toEqual(scopedActions.setSearchLoading(true))
        expect(store.getActions()[1]).toEqual(scopedActions.setSearchPage(10))
        expect(store.getActions()).toHaveLength(3)
        expect(service.getSearchResults).toHaveBeenCalled()
        expect(service.getSearchResults.mock.calls[0]).toContain('abc') // text
        expect(service.getSearchResults.mock.calls[0]).toContain(10) // page
      })
    })
  })

  describe('setSearchText', () => {
    it('creates an action', () => {
      const action = actions.setSearchText('elephant')
      expect(action.type).toBe(SET_SEARCH_TEXT)
      expect(action.payload).toBe('elephant')
    })
  })

  describe('setSearchLoading', () => {
    it('creates an action', () => {
      const action = actions.setSearchLoading(true)
      expect(action.type).toBe(SET_SEARCH_LOADING)
      expect(action.payload).toBe(true)
    })
  })

  describe('setSearchEntries', () => {
    it('creates an action', () => {
      const action = actions.setSearchEntries([1, 2, 3])
      expect(action.type).toBe(SET_SEARCH_ENTRIES)
      expect(action.payload).toEqual([1, 2, 3])
    })
  })

  describe('searchOutcomes', () => {
    const matches = [{ id: '1' }]
    const outcomes = {
      course_100: {
        1: { id: '1' },
        2: { id: '2' }
      }
    }
    const response = {
      matches: matches,
      outcomes: outcomes[contextUuid],
      total: 101
    }

    const service = { getSearchResults: jest.fn().mockResolvedValue(response) }

    it('handles search flow in the correct order', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.searchOutcomes('abc'))
        .then(() => {
          expect(store.getActions()[1]).toEqual(scopedActions.setOutcomes(outcomes))
          expect(store.getActions()[2]).toEqual(scopedActions.setSearchEntries(matches))
          expect(store.getActions()[3]).toEqual(scopedActions.setSearchTotal(101))
          expect(store.getActions()[4]).toEqual(scopedActions.setSearchLoading(false))
        })
    })

    it('does not set search entries if search query does not match', () => {
      const store = createMockStore(state, service)

      return store.dispatch(actions.searchOutcomes({ text: 'something else' }))
        .then(() => {
          expect(store.getActions().length).toBe(1)
        })
    })

    it('does not set search entries if search page does not match', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.searchOutcomes({ page: 12 }))
        .then(() => {
          expect(store.getActions().length).toBe(1)
        })
    })
  })
})
