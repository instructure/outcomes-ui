/* eslint-disable promise/always-return */
import { expect } from 'chai'
import { Map } from 'immutable'
import sinon from 'sinon'
import createMockStore, { scopeActions } from '../../../test/createMockStore'
import * as actions from '../actions'
import { setError } from '../../../store/context/actions'
import { setOutcomePickerState } from '../../../store/OutcomePicker/actions'

const scopedActions = scopeActions({ ...actions, setError, setOutcomePickerState })

describe('OutcomeTray/actions', () => {
  describe('loadOutcomeTray', () => {
    const outcomes = ['1', '2']
    const service = { listOutcomes: sinon.stub().returns(Promise.resolve(outcomes)) }
    afterEach(() => service.listOutcomes.resetHistory())

    it('dispatches state change to loading', () => {
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadOutcomeTray())
        .then(() => {
          expect(store.getActions()[0]).to.deep.equal(scopedActions.setOutcomePickerState('loading'))
        })
    })

    it('dispatches listOutcomes', () => {
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadOutcomeTray())
        .then(() => expect(service.listOutcomes.calledOnce).to.be.true)
    })

    it('dispatches state change to choosing', () => {
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadOutcomeTray())
        .then(() => expect(store.getActions()).to.deep.include(scopedActions.setOutcomePickerState('choosing')))
    })

    it('dispatches setOutcomeList', () => {
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadOutcomeTray())
        .then(() => expect(store.getActions()[2]).to.deep.equal(scopedActions.setOutcomeList(outcomes)))
    })

    it('dispatches setError on listOutcomes failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { listOutcomes: sinon.stub().returns(Promise.reject(error)) }
      const store = createMockStore(Map(), service)
      return store.dispatch(actions.loadOutcomeTray())
        .then(() => {
          expect(store.getActions()).to.have.length(3)
          expect(store.getActions()[2]).to.deep.equal(scopedActions.setError(error))
        })
    })
  })
})
