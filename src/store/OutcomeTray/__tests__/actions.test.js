/* eslint-disable promise/always-return */
import { expect } from 'chai'
import { fromJS } from 'immutable'
import sinon from 'sinon'
import createMockStore, { scopeActions } from '../../../test/createMockStore'
import * as actions from '../actions'
import { setError } from '../../../store/context/actions'
import { setOutcomePickerState } from '../../../store/OutcomePicker/actions'

const scopedActions = scopeActions({ ...actions, setError, setOutcomePickerState })

describe('OutcomeTray/actions', () => {
  describe('getOutcomesList', () => {
    const state = fromJS({
      scopeForTest: {
        OutcomePicker: {
          tray: {
            pagination: {
              page: 1,
              total: null,
            },
            list: []
          }
        }
      }
    })
    const outcomes = [{id: '1', name: 'red'}, {id: '2', name: 'blue'}]
    const response = {outcomes, total: 2}
    const service = { listOutcomes: sinon.stub().returns(Promise.resolve(response)) }
    afterEach(() => service.listOutcomes.resetHistory())

    it('dispatches state change to loading', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.getOutcomesList())
        .then(() => {
          expect(store.getActions()[0]).to.deep.equal(scopedActions.setOutcomePickerState('loading'))
        })
    })

    it('dispatches listOutcomes', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.getOutcomesList())
        .then(() => expect(service.listOutcomes.calledOnce).to.be.true)
    })

    it('dispatches in correct order', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.getOutcomesList())
        .then(() => {
          expect(store.getActions()[1]).to.deep.equal(scopedActions.setSelectedOutcomeIds([]))
          expect(store.getActions()[3]).to.deep.equal(scopedActions.setOutcomeList(outcomes))
          expect(store.getActions()[4]).to.deep.equal(scopedActions.setOutcomes(
            {
              [undefined]:
                {
                  '1': outcomes[0],
                  '2': outcomes[1]
                }
            }
          ))
          expect(store.getActions()[5]).to.deep.equal(scopedActions.setListTotal(response.total))
          expect(store.getActions()[6]).to.deep.equal(scopedActions.setOutcomePickerState('choosing'))
        })
    })

    it('dispatches setPage if a page is provided', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.getOutcomesList({ page: 2 }))
        .then(() => expect(store.getActions()[0]).to.deep.equal(scopedActions.setListPage(2)))
    })

    it('dispatches setError on listOutcomes failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { listOutcomes: sinon.stub().returns(Promise.reject(error)) }
      const store = createMockStore(state, service)
      return store.dispatch(actions.getOutcomesList())
        .then(() => {
          expect(store.getActions()).to.have.length(4)
          expect(store.getActions()[3]).to.deep.equal(scopedActions.setError(error))
        })
    })
  })
})
