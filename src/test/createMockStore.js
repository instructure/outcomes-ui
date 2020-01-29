import configureStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import sinon from 'sinon'
import { Map } from 'immutable'
import serviceMiddleware from '@instructure/redux-service-middleware'
import { wrapAction, wrapDispatch } from 'multireducer'

const mockService = {
  loadOutcomes: sinon.stub().returns(Promise.resolve([])),
  getAlignments: sinon.stub().returns(Promise.resolve([])),
  createAlignmentSet: sinon.stub().returns(Promise.resolve({guid: 'newguid'})),
  outcomePickerState: 'closed'
}

export default function createMockStore (state = Map(), outcomesService = mockService, scope = 'scopeForTest') {
  const baseStore = configureStore([
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
