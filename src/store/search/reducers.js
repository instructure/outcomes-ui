import { handleActions } from 'redux-actions'
import { combineReducers  } from 'redux-immutable'
import { List, fromJS } from 'immutable'

import { setSearchText, setSearchLoading, setSearchEntries, setSearchPage, setSearchTotal } from './actions'

const searchText = handleActions({
  [setSearchText]: (state, action) => action.payload
}, '')

const page = handleActions({
  [setSearchPage]: (state, action) => action.payload
}, 1)

const isLoading = handleActions({
  [setSearchLoading]: (state, action) => action.payload
}, true)

const entries = handleActions({
  [setSearchEntries]: (state, action) => fromJS(action.payload)
}, List())

const total = handleActions({
  [setSearchTotal]: (state, action) => action.payload
}, null)

export default combineReducers({
  searchText,
  page,
  isLoading,
  entries,
  total
})
