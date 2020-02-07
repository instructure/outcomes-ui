import { handleActions } from 'redux-actions'

export default handleActions({
  SET_SCOPE: (_state, action) => action.payload,
}, '')
