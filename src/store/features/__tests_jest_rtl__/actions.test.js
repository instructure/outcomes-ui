import { expect, describe, it, beforeEach, afterEach, jest } from '@jest/globals'
import { Map } from 'immutable'

import * as constants from '../../../constants'
import createMockStore, { scopeActions } from '../../../test/createMockStore_jest_rtl'
import * as actions from '../actions'

const scopedActions = scopeActions(actions)

const response = ['feature_1', 'feature_2']

describe('features/actions', () => {
  describe('setFeatures', () => {
    it ('creates an action', () => {
      const action = actions.setFeatures(['feature_1'])
      expect(action.type).toBe(constants.SET_FEATURES)
      expect(action.payload).toEqual(['feature_1'])
    })
  })

  describe('loadFeatures', () => {
    describe('with existing feature flags', () =>  {
      beforeEach(() => {
        jest.spyOn(constants, 'getFeatureFlags').mockReturnValue(['feature_1', 'feature_2'])
      })

      afterEach(() => {
        jest.restoreAllMocks()
      })

      it('calls outcome service to load features', () => {
        const service = { getFeatures: jest.fn().mockResolvedValue(response) }
        const store = createMockStore(Map(), service)
        return store.dispatch(actions.loadFeatures())
          .then(() => {
            expect(service.getFeatures).toHaveBeenCalledTimes(1)
            return null
          })
      })

      it('dispatches setFeatures on outcome service success', () => {
        const service = { getFeatures: jest.fn().mockResolvedValue(response) }
        const store = createMockStore(Map(), service)

        return store.dispatch(actions.loadFeatures())
          .then(() => {
            expect(store.getActions()).toHaveLength(2)
            expect(store.getActions()).toContainEqual(scopedActions.setFeatures(['feature_1', 'feature_2']))
            return null
          })
      })

      it('dispatches setError on outcome service failure', () => {
        const error = { message: 'foo bar baz' }
        const service = { getFeatures: jest.fn().mockRejectedValue(error) }
        const store = createMockStore(Map(), service)
        return store.dispatch(actions.loadFeatures())
          .then(() => {
            expect(store.getActions()).toHaveLength(2)
            expect(store.getActions()[1]).toEqual(scopedActions.setError(error))
            return null
          })
      })
    })

    describe('with no existing feature flags', () => {
      beforeEach(() => {
        jest.spyOn(constants, 'getFeatureFlags').mockReturnValue([])
      })

      afterEach(() => {
        jest.restoreAllMocks()
      })

      it('does not call the outcome service to load features', () => {
        const service = { getFeatures: jest.fn().mockResolvedValue(response) }
        const store = createMockStore(Map(), service)
        return store.dispatch(actions.loadFeatures())
          .then(() => {
            expect(service.getFeatures).not.toHaveBeenCalled()
            return null
          })
      })
    })
  })
})
