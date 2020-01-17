import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux-immutable'

const paginationReducer = (actionRoot) => {
  const SET_PAGE = `SET_${actionRoot}_PAGE`
  const SET_TOTAL = `SET_${actionRoot}_TOTAL`

  const page = handleActions({
    [SET_PAGE]: (_state, action) => {
      return action.payload
    }
  }, 1)

  const total = handleActions({
    [SET_TOTAL]: (_state, action) => {
      return action.payload
    }
  }, null)

  return combineReducers({ page, total })
}

export default paginationReducer
