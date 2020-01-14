import { handleActions } from 'redux-actions'
import { fromJS, List } from 'immutable'

export default handleActions({
  SET_FEATURES: (state, action) => {
    return fromJS(action.payload)
  }
}, List())
