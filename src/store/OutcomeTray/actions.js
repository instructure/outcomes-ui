import { createAction } from 'redux-actions'
import { CALL_SERVICE } from 'inst-redux-service-middleware'
import { getConfig } from '../config/selectors'
import {
  SET_OUTCOME_LIST,
  SET_LIST_PAGE,
  SET_LIST_TOTAL
} from '../../constants'
import { setOutcomePickerState } from '../OutcomePicker/actions'
import { setError } from '../context/actions'
import { getListPage } from './selectors'

export const setOutcomeList = createAction(SET_OUTCOME_LIST)
export const setListPage = createAction(SET_LIST_PAGE)
export const setListTotal = createAction(SET_LIST_TOTAL)

export const getOutcomesList = ({ page } = {}) => {
  return (dispatch, getState, _arg, scope) => {
    const initialPage = page || getListPage(getState(), scope)
    if (page) {
      dispatch(setListPage(page))
    }
    dispatch(setOutcomePickerState('loading'))
    const { host, jwt, contextUuid } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'listOutcomes',
        args: [host, jwt, initialPage, contextUuid]
      }
    }).then((json) => {
      if (getListPage(getState(), scope) === initialPage) {
        dispatch(setOutcomeList(json.outcomes))
        dispatch(setListTotal(json.total))
        dispatch(setOutcomePickerState('choosing'))
      }
      return Promise.resolve(json.outcomes)
    }).catch((e) => {
      dispatch(setError(e))
    })
  }
}
