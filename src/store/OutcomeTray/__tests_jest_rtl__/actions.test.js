/* eslint-disable promise/always-return */
import { expect, describe, it, afterEach, jest } from '@jest/globals'
import { fromJS } from 'immutable'
import createMockStore, { scopeActions } from '../../../test/createMockStore_jest_rtl'
import * as actions from '../actions'
import { setError } from '../../context/actions'
import { setOutcomePickerState } from '../../OutcomePicker/actions'

const scopedActions = scopeActions({ ...actions, setError, setOutcomePickerState })

describe('OutcomeTray/actions', () => {

  const state = fromJS({
    scopeForTest: {
      OutcomePicker: {
        tray: {
          pagination: {
            page: 1,
            total: null,
          },
          list: [],
          selected: ['2','3','4']
        }
      }
    }
  })
  const outcomes = [{id: '1', name: 'red'}, {id: '2', name: 'blue'}]
  const response = {outcomes, total: 2}
  const service = { listOutcomes: jest.fn().mockResolvedValue(response) }
  afterEach(() => service.listOutcomes.mockClear())

  describe('getOutcomesList', () => {
    it('dispatches state change to loading', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.getOutcomesList())
        .then(() => {
          expect(store.getActions()[0]).toEqual(scopedActions.setOutcomePickerState('loading'))
        })
    })

    it('dispatches listOutcomes', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.getOutcomesList())
        .then(() => expect(service.listOutcomes).toHaveBeenCalledTimes(1))
    })

    it('dispatches in correct order', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.getOutcomesList())
        .then(() => {
          expect(store.getActions()[2]).toEqual(scopedActions.setOutcomeList(outcomes))
          expect(store.getActions()[3]).toEqual(scopedActions.setOutcomes(
            {
              [undefined]:
                {
                  '1': outcomes[0],
                  '2': outcomes[1]
                }
            }
          ))
          expect(store.getActions()[4]).toEqual(scopedActions.setListTotal(response.total))
          expect(store.getActions()[5]).toEqual(scopedActions.setOutcomePickerState('choosing'))
        })
    })

    it('dispatches setPage if a page is provided', () => {
      const store = createMockStore(state, service)
      return store.dispatch(actions.getOutcomesList({ page: 2 }))
        .then(() => expect(store.getActions()[0]).toEqual(scopedActions.setListPage(2)))
    })

    it('dispatches setError on listOutcomes failure', () => {
      const error = { message: 'foo bar baz' }
      const service = { listOutcomes: jest.fn().mockRejectedValue(error) }
      const store = createMockStore(state, service)
      return store.dispatch(actions.getOutcomesList())
        .then(() => {
          expect(store.getActions()).toHaveLength(3)
          expect(store.getActions()[2]).toEqual(scopedActions.setError(error))
        })
    })
  })

  describe('setInitialSelectedOutcomes', () => {
    const alignedOutcomes = [{ id: '1' }, { id: '999' }]
    const alignmentState = state.setIn(['scopeForTest', 'alignments', 'alignedOutcomes'], fromJS(alignedOutcomes))
    it('dispatches setSelectedOutcomeIds', () => {
      const store = createMockStore(alignmentState, service)
      return store.dispatch(actions.setInitialSelectedOutcomes())
        .then(() => {
          expect(store.getActions()).toHaveLength(1)
          expect(store.getActions()[0]).toEqual(scopedActions.setSelectedOutcomeIds(['1', '999']))
          expect(store.getActions()[0].payload).toEqual(['1', '999'])
        })
    })
  })
})
