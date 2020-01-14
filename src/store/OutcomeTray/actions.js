import { createAction } from 'redux-actions'
import { CALL_SERVICE } from 'inst-redux-service-middleware'
import { getConfig } from '../config/selectors'
import {
  SET_OUTCOME_LIST
} from '../../constants'
import { setOutcomePickerState } from '../OutcomePicker/actions'
import { setError } from '../context/actions'

export const setOutcomeList = createAction(SET_OUTCOME_LIST)

export const loadOutcomeTray = () => {
  return (dispatch, getState, _arg, scope) => {
    dispatch(setOutcomePickerState('loading'))
    const { host, jwt, contextUuid } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'listOutcomes',
        args: [host, jwt, contextUuid]
      }
    }).then((outcomes) => {
      dispatch(setOutcomeList(outcomes))
      dispatch(setOutcomePickerState('choosing'))
      return Promise.resolve(outcomes)
    }).catch((e) => {
      dispatch(setError(e))
    })
  }
}
