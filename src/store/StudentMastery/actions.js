import { createAction } from 'redux-actions'
import { CALL_SERVICE } from 'inst-redux-service-middleware'
import {
  SET_INDIVIDUAL_RESULTS,
  SET_INDIVIDUAL_RESULTS_STATE
} from '../../constants'
import { getIndividualResults } from './selectors'
import { getConfig } from '../config/selectors'
import { setError } from '../context/actions'

export const setIndividualResults = createAction(SET_INDIVIDUAL_RESULTS)
export const setIndividualResultsState = createAction(SET_INDIVIDUAL_RESULTS_STATE)

export const loadIndividualResults = (artifactType, artifactId, userUuid) => {
  return (dispatch, getState, _arg, scope) => {
    const { host, jwt } = getConfig(getState(), scope)
    if (getIndividualResults(getState(), scope) !== null) {
      return Promise.resolve()
    }
    dispatch(setIndividualResultsState('loading'))
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getIndividualResults',
        args: [host, jwt, artifactType, artifactId, userUuid]
      }
    })
      .then((json) => {
        return dispatch(setIndividualResults(json))
      })
      .then(() => dispatch(setIndividualResultsState('loaded')))
      .catch((e) => {
        return dispatch(setError(e))
      })
  }
}
