import { handleActions } from 'redux-actions'
import { combineReducers  } from 'redux-immutable'
import { List, fromJS } from 'immutable'

import { setOutcomeList } from './actions'

const list = handleActions({
  [setOutcomeList]: (state, action) => fromJS(action.payload)
}, List())

export default combineReducers({
  list,
})
