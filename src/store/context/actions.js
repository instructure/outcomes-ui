import { createAction } from 'redux-actions'
import { CALL_SERVICE } from '@instructure/redux-service-middleware'
import t from 'format-message'
import {
  SET_ERROR,
  SET_OUTCOMES,
  SET_ROOT_OUTCOME_IDS,
  SET_CONTEXT,
  SET_SCORING_METHOD
} from '../../constants'
import { hasRootOutcomes, getChildrenToLoad, getContext } from './selectors'
import { getConfig } from '../config/selectors'

export const setContext = createAction(SET_CONTEXT)
export const setOutcomes = createAction(SET_OUTCOMES)
export const setRootOutcomeIds = createAction(SET_ROOT_OUTCOME_IDS)
export const setError = createAction(SET_ERROR)
export const setScoringMethod = createAction(SET_SCORING_METHOD)

export const loadContext = (host, jwt, contextUuid) => {
  return (dispatch, getState) => {
    if (getContext(getState(), contextUuid)) {
      return Promise.resolve()
    }

    dispatch(setContext({ [contextUuid]: { loading: true } }))

    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getContext',
        args: [host, jwt, contextUuid]
      }
    })
      .then(json => dispatch(setContext({ [contextUuid]: { loading: false, data: json } })))
      .catch((e) => {
        return dispatch(setError(e))
      })
  }
}

export const loadRootOutcomes = () => {
  return (dispatch, getState, _arg, scope) => {
    const { contextUuid } = getConfig(getState(), scope)
    if (hasRootOutcomes(getState(), scope)) {
      return Promise.resolve()
    }
    return dispatch(loadOutcomes(null))
      .then((json) => {
        Object.assign(json.outcomes, {
          root: {
            id: 'root',
            title: t('Home'),
            description: t('Home level groups and outcomes'),
            child_ids: json.root_ids.map((id) => id.toString())
          }
        })
        dispatch(setOutcomes({ [contextUuid]: json.outcomes }))
        dispatch(setRootOutcomeIds({ [contextUuid]: json.root_ids }))
        return Promise.resolve()
      }).catch((e) => {
        dispatch(setError(e))
      })
  }
}

export const loadMoreOutcomes = (id) => {
  return (dispatch, getState, _arg, scope) => {
    const { contextUuid } = getConfig(getState(), scope)

    const idsToLoad = getChildrenToLoad(getState(), scope, id)
    if (idsToLoad.length === 0) { return Promise.resolve() }

    return dispatch(loadOutcomes(idsToLoad))
      .then((json) => {
        dispatch(setOutcomes({ [contextUuid]: json.outcomes }))
        return Promise.resolve()
      }).catch((e) => {
        dispatch(setError(e))
      })
  }
}

const loadOutcomes = (ids) => {
  return (dispatch, getState, _arg, scope) => {
    const { host, jwt, contextUuid } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'loadOutcomes',
        args: [host, jwt, contextUuid, ids]
      }
    }).then((json) => {
      return Promise.resolve(json)
    })
  }
}
