import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux-immutable'
import {fromJS, Set} from 'immutable'

import {RESET_OUTCOME_PICKER} from '../../constants'
import {
  resetExpandedIds,
  setFocusedOutcomeAction,
  toggleExpandedIds
} from './actions'
import search from '../search/reducers'
import tray from '../OutcomeTray/reducers'

const selectedLaunchContext = handleActions({
  SET_SELECTED_LAUNCH_CONTEXT: (state, action) => fromJS(action.payload)
}, null)

const focusedOutcome = handleActions({
  [setFocusedOutcomeAction]: (state, action) => action.payload
}, null)

const expandedIds = handleActions({
  [toggleExpandedIds]: (state, action) => {
    if (state.has(action.payload.id.toString()) && !action.payload.forceOpen) {
      return state.delete(action.payload.id.toString())
    } else {
      return state.add(action.payload.id.toString())
    }
  },
  [resetExpandedIds]: (state, action) => {
    return action.payload
  }
}, Set())

const selected = handleActions({
  SELECT_OUTCOME_IDS: (state, action) => {
    return state.union(action.payload.map((id) => id.toString()))
  },
  UNSELECT_OUTCOME_IDS: (state, action) => {
    return state.subtract(action.payload.map((id) => id.toString()))
  },
  SET_SELECTED_OUTCOME_IDS: (state, action) => {
    return Set(action.payload)
  }
}, Set())

const activeCollection = handleActions({
  SET_ACTIVE_COLLECTION_ID: (state, action) => {
    return action.payload
  }
}, null)

const state = handleActions({
  SET_OUTCOME_PICKER_STATE: (state, action) => action.payload
}, 'closed')

const OutcomePickerReducer = combineReducers({
  selectedLaunchContext,
  state,
  selected,
  focusedOutcome,
  activeCollection,
  expandedIds,
  search,
  tray,
})

export default (state, action) => {
  return action.type === RESET_OUTCOME_PICKER
    // When the reducer receives a close action, reset
    // the state of the picker to default values
    ? OutcomePickerReducer(undefined, action)
    : OutcomePickerReducer(state, action)
}
