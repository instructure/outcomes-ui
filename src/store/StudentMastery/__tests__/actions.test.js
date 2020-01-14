import { expect } from 'chai'
import { fromJS, Map } from 'immutable'
import sinon from 'sinon'

import * as actions from '../actions'
import { setError } from '../../context/actions'
import createMockStore, { scopeActions } from '../../../test/createMockStore'

const scopedActions = scopeActions({ ...actions, setError })

describe('StudentMastery/actions', () => {
  describe('loadIndividualResults', () => {
    it('does not dispatch actions when results are already in state', () => {
      const store = createMockStore(fromJS({
        scopeForTest: {
          StudentMastery: {
            individualResults: []
          }
        }
      }))
      return store.dispatch(actions.loadIndividualResults('quiz', '1', 'user1'))
        .then(() => {
          expect(store.getActions().length).to.equal(0)
          return null
        })
    })

    it('calls outcome service to load individual results', () => {
      const service = { getIndividualResults: sinon.stub().returns(Promise.resolve()) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadIndividualResults('quiz', '1', 'user1'))
        .then(() => {
          expect(service.getIndividualResults.calledOnce).to.be.true
          return null
        })
    })

    it('calls outcome service to load individual results', () => {
      const service = { getIndividualResults: sinon.stub().returns(Promise.resolve()) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadIndividualResults('quiz', '1', 'user1'))
        .then(() => {
          expect(store.getActions()).to.have.length(4)
          expect(store.getActions()[3]).to.deep.equal(scopedActions.setIndividualResultsState('loaded'))
          return null
        })
    })

    it('dispatches setError on outcome service failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { getIndividualResults: sinon.stub().returns(Promise.reject(error)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadIndividualResults('quiz', '1', 'user1'))
        .then(() => {
          expect(store.getActions()).to.have.length(3)
          expect(store.getActions()[2]).to.deep.equal(scopedActions.setError(error))
          return null
        })
    })
  })
})
