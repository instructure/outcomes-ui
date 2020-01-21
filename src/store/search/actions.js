import { createAction } from 'redux-actions'
import { CALL_SERVICE } from 'inst-redux-service-middleware'
import { getConfig } from '../config/selectors'
import { getSearchText, getSearchPage } from './selectors'
import {
  SET_SEARCH_TEXT,
  SET_SEARCH_LOADING,
  SET_SEARCH_ENTRIES,
  SET_SEARCH_PAGE,
  SET_SEARCH_TOTAL
} from '../../constants'
import { setOutcomes } from '../context/actions'
import debounceLatestPromise from '../../util/debouceLatestPromise'

export const setSearchText = createAction(SET_SEARCH_TEXT)
export const setSearchLoading = createAction(SET_SEARCH_LOADING)
export const setSearchEntries = createAction(SET_SEARCH_ENTRIES)
export const setSearchPage = createAction(SET_SEARCH_PAGE)
export const setSearchTotal = createAction(SET_SEARCH_TOTAL)

const getSearchResultsDebounced = debounceLatestPromise((dispatch, ...args)  => dispatch(searchOutcomes(...args)), 250)

const getSearchResultsAction = (...args) => dispatch => getSearchResultsDebounced(dispatch, ...args)

export const searchOutcomes = ({ text, page }) => {
  return (dispatch, getState, _arg, scope) => {
    const initialText = text || getSearchText(getState(), scope)
    const initialPage = page || getSearchPage(getState(), scope)

    const { host, jwt, contextUuid } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getSearchResults',
        args: [host, jwt, initialText, initialPage, contextUuid]
      }
    })
    .then((json) => {
      if (getSearchText(getState(), scope) === initialText
        && getSearchPage(getState(), scope) === initialPage) {
        dispatch(setOutcomes({ [contextUuid]: json.outcomes }))
        dispatch(setSearchEntries(json.matches))
        dispatch(setSearchTotal(json.total))
        dispatch(setSearchLoading(false))
      }
      return Promise.resolve()
    })
  }
}

export const updateSearchText = (text) => {
  return (dispatch, _getState, _arg, _scope) => {
    dispatch(setSearchText(text))
    dispatch(setSearchPage(1))
    dispatch(setSearchTotal(null))
    if (text) {
      dispatch(setSearchLoading(true))
      dispatch(getSearchResultsAction({ text, page: 1 }))
    }
  }
}

export const updateSearchPage = (page) => {
  return (dispatch, _getState, _arg, _scope) => {
    dispatch(setSearchLoading(true))
    dispatch(setSearchPage(page))
    dispatch(getSearchResultsAction({ page }))
  }
}
