import { createAction } from 'redux-actions'
import { CALL_SERVICE } from 'inst-redux-service-middleware'
import { SET_ERROR, SET_FEATURES } from '../../constants'

export const setError = createAction(SET_ERROR)
export const setFeatures = createAction(SET_FEATURES)

export const loadFeatures = (host, jwt) => {
  return (dispatch) => {
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getFeatures',
        args: [host, jwt]
      }
    })
      .then(json => dispatch(setFeatures(json)))
      .catch((e) => {
        return dispatch(setError(e))
      })
  }
}
