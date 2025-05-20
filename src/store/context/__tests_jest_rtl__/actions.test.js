import { expect, jest, describe, it } from '@jest/globals'
import { Map, fromJS } from 'immutable'
import {
  SET_OUTCOMES,
  SET_ROOT_OUTCOME_IDS,
  SET_ERROR,
  SET_SCORING_METHOD
} from '../../../constants'
import createMockStore, { scopeActions } from '../../../test/createMockStore_jest_rtl'
import * as actions from '../actions'

const scopedActions = scopeActions(actions)

const response = {
  outcomes: [{id: 1}, {id: 2}],
  root_ids: [1, 2]
}

const stateWithoutOutcomes = fromJS({
  scopeForTest: {
    config: {
      contextUuid: 'course_100'
    }
  }
})

const stateWithOutcomes = fromJS({
  context: {
    outcomes: {
      course_100: [{ id: 1 }]
    },
    rootOutcomeIds: {
      course_100: [ 1 ]
    }
  },
  scopeForTest: {
    config: {
      contextUuid: 'course_100'
    }
  }
})

const stateWithSelectedLaunchContext = stateWithOutcomes.merge({
  scopeForTest: {
    OutcomePicker: {
      selectedLaunchContext: {uuid: 'selectedLaunchContext', name: 'selectedLaunchContext'}
    }
  }
})

const contextUuidIndex = 2
const outcomeIdsIndex = 3

describe('context/actions', () => {
  describe('setOutcomes', () => {
    it('creates an action', () => {
      const action = actions.setOutcomes([])
      expect(action.type).toBe(SET_OUTCOMES)
      expect(action.payload).toEqual([])
    })
  })

  describe('setRootOutcomeIds', () => {
    it('creates an action', () => {
      const action = actions.setRootOutcomeIds([])
      expect(action.type).toBe(SET_ROOT_OUTCOME_IDS)
      expect(action.payload).toEqual([])
    })
  })

  describe('setError', () => {
    it('creates an action', () => {
      const action = actions.setError('foo')
      expect(action.type).toBe(SET_ERROR)
      expect(action.payload).toEqual('foo')
    })
  })

  describe('setScoringMethod', () => {
    it('creates an action', () => {
      const payload = {
        id: 1,
        context_uuid: '',
        scoring_method: {}
      }
      const action = actions.setScoringMethod(payload)
      expect(action.type).toBe(SET_SCORING_METHOD)
      expect(action.payload).toEqual(payload)
    })
  })

  describe('loadOutcomes', () => {
    it('does not call any actions when outcomes already loaded', () => {
      const store = createMockStore(stateWithOutcomes)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()).toHaveLength(0)
        })
    })

    it('calls outcome service to load outcomes', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(service.loadOutcomes).toHaveBeenCalledTimes(1)
        })
    })

    it('calls outcome service to load outcomes with selected launch context', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithSelectedLaunchContext, service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(service.loadOutcomes).toHaveBeenCalledTimes(1)
          expect(service.loadOutcomes.mock.calls[0]).toContain('selectedLaunchContext')
        })
    })

    it('dispatches setOutcomes on outcome service success', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithoutOutcomes, service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()).toContainEqual(scopedActions.setOutcomes({ course_100: response.outcomes }))
          expect(store.getActions()[1].payload.course_100).toBeDefined()
        })
    })

    it('dispatches setOutcomes on outcome service success with selected launch context', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithSelectedLaunchContext, service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()).toContainEqual(scopedActions.setOutcomes(
            { selectedLaunchContext: response.outcomes }
          ))
          expect(store.getActions()[1].payload.selectedLaunchContext).toBeDefined()
        })
    })

    it('creates a root level outcome to store roots if root ids are present', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()[1].payload).toBeDefined()
        })
    })

    it('does not create a root level outcome if root ids are not present', () => {
      const service = {
        loadOutcomes: jest.fn().mockResolvedValue({
          outcomes: [{id: 1}, {id: 2}],
          root_ids: []
        })
      }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()[1].payload.root).toBeUndefined()
        })
    })

    it('dispatches setRootOutcomeIds on outcome service success', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithoutOutcomes, service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()).toContainEqual(scopedActions.setRootOutcomeIds({ course_100: response.root_ids }))
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { loadOutcomes: jest.fn().mockRejectedValue(error) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadRootOutcomes())
        .then(() => {
          expect(store.getActions()).toHaveLength(2)
          expect(store.getActions()[1]).toEqual(scopedActions.setError(error))
        })
    })
  })

  describe('loadMoreOutcomes', () => {
    it('calls loadOutcomes for unloaded children', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithOutcomes, service)
      return store.dispatch(actions.loadMoreOutcomes('1'))
        .then(() => {
          expect(service.loadOutcomes).toHaveBeenCalledTimes(1)
          expect(service.loadOutcomes.mock.calls[0][contextUuidIndex]).toBe('course_100')
          expect(service.loadOutcomes.mock.calls[0][outcomeIdsIndex]).toEqual(['1'])
        })
    })

    it('calls loadOutcomes for unloaded children when launch context is selected', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithSelectedLaunchContext, service)

      return store.dispatch(actions.loadMoreOutcomes('1'))
        .then(() => {
          expect(service.loadOutcomes).toHaveBeenCalledTimes(1)
          expect(service.loadOutcomes.mock.calls[0][contextUuidIndex]).toBe('selectedLaunchContext')
          expect(service.loadOutcomes.mock.calls[0][outcomeIdsIndex]).toEqual(['1'])
        })
    })

    it('adds its outcomes to the state', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithOutcomes, service)
      return store.dispatch(actions.loadMoreOutcomes('1'))
        .then(() => {
          expect(store.getActions()).toContainEqual(scopedActions.setOutcomes({ course_100: response.outcomes }))
        })
    })

    it('adds its outcomes to the state under the selected launch context', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithSelectedLaunchContext, service)
      return store.dispatch(actions.loadMoreOutcomes('1'))
        .then(() => {
          expect(store.getActions()).toContainEqual(
            scopedActions.setOutcomes({ selectedLaunchContext: response.outcomes })
          )
        })
    })

    it('does not add its root ids to the state', () => {
      const service = { loadOutcomes: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithoutOutcomes, service)
      return store.dispatch(actions.loadMoreOutcomes('1'))
        .then(() => {
          expect(store.getActions()).not.toContainEqual(
            scopedActions.setRootOutcomeIds({ course_100: response.root_ids })
          )
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { loadOutcomes: jest.fn().mockRejectedValue(error) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadMoreOutcomes('12'))
        .then(() => {
          expect(store.getActions()).toHaveLength(2)
          expect(store.getActions()[1]).toEqual(scopedActions.setError(error))
        })
    })
  })

  describe('loadContext', () => {
    const response = {
      id: 1
    }

    const stateWithoutContext = fromJS({
      context: {
        contexts: {}
      }
    })

    const stateWithContext = fromJS({
      context: {
        contexts: {
          '1': {
            loading: false,
            data: {
              id: 1
            }
          }
        }
      }
    })

    const stateWithContextLoading = fromJS({
      context: {
        contexts: {
          '1': {
            loading: true
          }
        }
      }
    })

    it('calls getContext for unloaded children', () => {
      const service = { getContext: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithoutContext, service)
      return store.dispatch(actions.loadContext('host', 'jwt', '1'))
        .then(() => {
          expect(service.getContext).toHaveBeenCalledTimes(1)
          expect(service.getContext.mock.calls[0][2]).toBe('1')
        })
    })

    it('adds its context to the state', () => {
      const service = { getContext: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithoutContext, service)
      return store.dispatch(actions.loadContext('host', 'jwt', '1'))
        .then(() => {
          expect(store.getActions()).toContainEqual(scopedActions.setContext({ '1': { loading: false, data: response } }))
        })
    })

    it('does not calls service when its already loaded', () => {
      const service = { getContext: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithContext, service)
      return store.dispatch(actions.loadContext('host', 'jwt', '1'))
        .then(() => {
          expect(store.getActions().length).toBe(0)
        })
    })

    it('does not calls service when its loading', () => {
      const service = { getContext: jest.fn().mockResolvedValue(response) }
      const store = createMockStore(stateWithContextLoading, service)
      return store.dispatch(actions.loadContext('host', 'jwt', '1'))
        .then(() => {
          expect(store.getActions().length).toBe(0)
        })
    })

    it('dispatches setError on service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { getContext: jest.fn().mockRejectedValue(error) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadContext('host', 'jwt', '12'))
        .then(() => {
          expect(store.getActions()).toHaveLength(3)
          expect(store.getActions()[2]).toEqual(scopedActions.setError(error))
        })
    })
  })
})
