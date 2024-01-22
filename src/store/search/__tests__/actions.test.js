import { expect } from 'chai'
import sinon from 'sinon'
import { fromJS } from 'immutable'
import {
  SET_SEARCH_TEXT,
  SET_SEARCH_LOADING,
  SET_SEARCH_ENTRIES
} from '../../../constants'
import createMockStore, { scopeActions } from '../../../test/createMockStore'
import * as actions from '../actions'
import { setOutcomes } from '../../../store/context/actions'

const scopedActions = scopeActions({ ...actions, setOutcomes })

describe('search/actions', () => {
  const contextUuid = 'course_100'
  const selectedSharedContext = {uuid: 'dummy_uuid', name: 'Dummy UUID'}
  const sharedContexts = [
    {uuid: contextUuid, name: contextUuid},
    selectedSharedContext
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
    let clock
    const service = { getSearchResults: sinon.stub().returns(Promise.resolve({})) }
    beforeEach(() => { clock = sinon.useFakeTimers() })
    afterEach(() => {
      clock.restore()
      service.getSearchResults.resetHistory()
    })

    describe('updateSearchText', () => {
      it('handles search flow in the correct order', () => {
        const store = createMockStore(state, service)
        store.dispatch(actions.updateSearchText('def'))
        expect(store.getActions()[0]).to.deep.equal(scopedActions.setSearchText('def'))
        expect(store.getActions()[1]).to.deep.equal(scopedActions.setSearchPage(1))
        expect(store.getActions()[2]).to.deep.equal(scopedActions.setSearchTotal(null))
        expect(store.getActions()[3]).to.deep.equal(scopedActions.setSearchLoading(true))
        expect(store.getActions()).to.have.length(4)
        clock.tick(250)
        expect(store.getActions()).to.have.length(5)
        expect(service.getSearchResults).to.have.been.called
        expect(service.getSearchResults.getCall(0).args).to.include('def') // text
        expect(service.getSearchResults.getCall(0).args).to.include(1) // page
        expect(service.getSearchResults.getCall(0).args).to.include(contextUuid) // context
      })

      it('handles shared context selector', () => {
        const newState = state.merge({
          scopeForTest: {
            OutcomePicker: {
              sharedContexts: sharedContexts,
              selectedSharedContext: selectedSharedContext
            }
          }
        })
        const store = createMockStore(newState, service)
        store.dispatch(actions.updateSearchText('def'))
        expect(store.getActions()[0]).to.deep.equal(scopedActions.setSearchText('def'))
        expect(store.getActions()[1]).to.deep.equal(scopedActions.setSearchPage(1))
        expect(store.getActions()[2]).to.deep.equal(scopedActions.setSearchTotal(null))
        expect(store.getActions()[3]).to.deep.equal(scopedActions.setSearchLoading(true))
        expect(store.getActions()).to.have.length(4)
        clock.tick(250)
        expect(store.getActions()).to.have.length(5)
        expect(service.getSearchResults).to.have.been.called
        expect(service.getSearchResults.getCall(0).args).to.include('def') // text
        expect(service.getSearchResults.getCall(0).args).to.include(1) // page
        expect(service.getSearchResults.getCall(0).args).to.include(selectedSharedContext.uuid) // context
      })
    })

    describe('updateSearchPage', () => {
      it('triggers a search action', () => {
        const store = createMockStore(state, service)
        store.dispatch(actions.updateSearchPage(10))
        expect(store.getActions()[0]).to.deep.equal(scopedActions.setSearchLoading(true))
        expect(store.getActions()[1]).to.deep.equal(scopedActions.setSearchPage(10))
        expect(store.getActions()).to.have.length(2)
        clock.tick(250)
        expect(store.getActions()).to.have.length(3)
        expect(service.getSearchResults).to.have.been.called
        expect(service.getSearchResults.getCall(0).args).to.include('abc') // text
        expect(service.getSearchResults.getCall(0).args).to.include(10) // page
      })
    })
  })

  describe('setSearchText', () => {
    it('creates an action', () => {
      const action = actions.setSearchText('elephant')
      expect(action.type).to.equal(SET_SEARCH_TEXT)
      expect(action.payload).to.equal('elephant')
    })
  })

  describe('setSearchLoading', () => {
    it('creates an action', () => {
      const action = actions.setSearchLoading(true)
      expect(action.type).to.equal(SET_SEARCH_LOADING)
      expect(action.payload).to.equal(true)
    })
  })

  describe('setSearchEntries', () => {
    it('creates an action', () => {
      const action = actions.setSearchEntries([1,2,3])
      expect(action.type).to.equal(SET_SEARCH_ENTRIES)
      expect(action.payload).to.eql([1,2,3])
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

    const service = { getSearchResults: () => new Promise(resolve => resolve(response)) }

    it('handles search flow in the correct order', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.searchOutcomes('abc'))
        .then(() => {
          expect(store.getActions()[1]).to.deep.equal(scopedActions.setOutcomes(outcomes))
          expect(store.getActions()[2]).to.deep.equal(scopedActions.setSearchEntries(matches))
          expect(store.getActions()[3]).to.deep.equal(scopedActions.setSearchTotal(101))
          expect(store.getActions()[4]).to.deep.equal(scopedActions.setSearchLoading(false))
        })
    })

    it('does not set search entries if search query does not match', () => {
      const store = createMockStore(state, service)

      return store.dispatch(actions.searchOutcomes({ text: 'something else' }))
        .then(() => {
          expect(store.getActions().length).to.equal(1)
        })
    })

    it('does not set search entries if search page does not match', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.searchOutcomes({ page: 12 }))
        .then(() => {
          expect(store.getActions().length).to.equal(1)
        })
    })
  })
})
