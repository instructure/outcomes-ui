import { jest } from '@jest/globals'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import { Map } from 'immutable'
import serviceMiddleware from '@instructure/redux-service-middleware'
import { wrapAction, wrapDispatch } from 'multireducer'

const mockService = {
  loadOutcomes: jest.fn().mockResolvedValue([]),
  getAlignments: jest.fn().mockResolvedValue([]),
  getContext: jest.fn().mockResolvedValue({}),
  createAlignmentSet: jest.fn().mockResolvedValue({guid: 'newguid'}),
  outcomePickerState: 'closed'
}

export default function createMockStore (state = Map(), outcomesService = mockService, scope = 'scopeForTest') {
  const baseStore = configureMockStore([
    thunkMiddleware,
    serviceMiddleware({ outcomes: outcomesService })
  ])(state)
  return { ...baseStore, dispatch: wrapDispatch(baseStore.dispatch, scope) }
}

export function scopeActions (actions, scope = 'scopeForTest') {
  return Object.keys(actions).reduce((set, key) => {
    return Object.assign(set, {
      [key]: (arg) => wrapAction(actions[key](arg), scope)
    })
  }, {})
}
