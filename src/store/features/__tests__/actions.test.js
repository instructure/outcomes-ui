import { expect } from 'chai'
import { Map } from 'immutable'
import sinon from 'sinon'

import { SET_FEATURES } from '../../../constants'
import createMockStore, { scopeActions } from '../../../test/createMockStore'
import * as actions from '../actions'

const scopedActions = scopeActions(actions)

const response = ['feature_1', 'feature_2']

describe('features/actions', () => {
  describe('setFeatures', () => {
    it ('creates an action', () => {
      const action = actions.setFeatures(['feature_1'])
      expect(action.type).to.equal(SET_FEATURES)
      expect(action.payload).to.deep.equal(['feature_1'])
    })
  })

  describe('loadFeatures', () => {
    it('calls outcome service to load features', () => {
      const service = { getFeatures: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadFeatures())
        .then(() => {
          expect(service.getFeatures.calledOnce).to.be.true
          return null
        })
    })

    it('dispatches setFeatures on outcome service success', () => {
      const service = { getFeatures: sinon.stub().returns(Promise.resolve(response)) }
      const store = createMockStore(Map(), service)

      return store.dispatch(actions.loadFeatures())
        .then(() => {
          expect(store.getActions()).to.have.length(2)
          expect(store.getActions()).to.deep.include(scopedActions.setFeatures(['feature_1', 'feature_2']))
          return null
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { getFeatures: sinon.stub().returns(Promise.reject(error)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadFeatures())
        .then(() => {
          expect(store.getActions()).to.have.length(2)
          expect(store.getActions()[1]).to.deep.equal(scopedActions.setError(error))
          return null
        })
    })
  })
})
