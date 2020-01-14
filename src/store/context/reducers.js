import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux-immutable'
import { Map, fromJS } from 'immutable'

const outcomes = handleActions({
  SET_OUTCOMES: (state, action) => {
    return state.mergeDeep(fromJS(action.payload))
  },
  SET_SCORING_METHOD: (state, action) => {
    return state.setIn([
      action.payload.context_uuid,
      action.payload.id,
      'scoring_method'
    ], fromJS(action.payload.scoring_method))
  }
}, Map())

const rootOutcomeIds = handleActions({
  SET_ROOT_OUTCOME_IDS: (state, action) => {
    return state.merge(fromJS(action.payload))
  }
}, Map())

export default combineReducers({
  outcomes,
  rootOutcomeIds
})
