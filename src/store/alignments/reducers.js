import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux-immutable'
import { fromJS, Map } from 'immutable'

const alignedOutcomes = handleActions({
  SET_ALIGNMENTS: (state, action) => {
    return fromJS(action.payload.outcomes || [])
  },
  UPDATE_ALIGNMENT: (state, action) => {
    const outcomeId = action.payload.outcome.id
    const idx = state.findIndex(o => o.get('id') === outcomeId)
    if (idx === -1) {
      return state
    }
    const { outcome } = action.payload
    return state.set(idx, Map(outcome))
  }
}, null)

const openAlignmentId = handleActions({
  VIEW_ALIGNMENT: (state, action) => action.payload,
  CLOSE_ALIGNMENT: () => null
}, null)

const alignmentSetId = handleActions({
  SET_ALIGNMENTS: (state, action) => {
    return action.payload.guid || null
  }
}, null)

export default combineReducers({
  alignedOutcomes,
  openAlignmentId,
  alignmentSetId
})
