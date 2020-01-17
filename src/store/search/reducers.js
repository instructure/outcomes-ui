import { handleActions } from 'redux-actions'
import { combineReducers  } from 'redux-immutable'
import { List, fromJS } from 'immutable'

import { setSearchText, setSearchLoading, setSearchEntries } from './actions'
import paginationReducer from '../utils/paginationReducer'

const searchText = handleActions({
  [setSearchText]: (state, action) => action.payload
}, '')

const isLoading = handleActions({
  [setSearchLoading]: (state, action) => action.payload
}, true)

const entries = handleActions({
  [setSearchEntries]: (state, action) => fromJS(action.payload)
}, List())


export default combineReducers({
  searchText,
  isLoading,
  entries,
  pagination: paginationReducer('SEARCH')
})
