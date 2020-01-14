import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux-immutable'
import { fromJS } from 'immutable'

const individualResults = handleActions({
  SET_INDIVIDUAL_RESULTS: (state, action) => {
    return fromJS(action.payload || [])
  }
}, null)

const state = handleActions({
  SET_INDIVIDUAL_RESULTS_STATE: (state, action) => action.payload
}, 'closed')

export default combineReducers({
  individualResults,
  state
})
