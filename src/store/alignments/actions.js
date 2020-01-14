import { createAction } from 'redux-actions'
import { CALL_SERVICE } from 'inst-redux-service-middleware'
import {
  SET_ALIGNMENTS,
  VIEW_ALIGNMENT,
  CLOSE_ALIGNMENT,
  UPDATE_ALIGNMENT
} from '../../constants'
import { getAlignedOutcomeIds, getAlignedOutcome, getOutcomeAlignmentSetId } from './selectors'
import { getConfig } from '../config/selectors'
import { setError } from '../context/actions'

/*
 * action creators
 */
export const setAlignments = createAction(SET_ALIGNMENTS)
export const viewAlignmentAction = createAction(VIEW_ALIGNMENT)
export const closeAlignment = createAction(CLOSE_ALIGNMENT)
export const updateAlignment = createAction(UPDATE_ALIGNMENT)

export const viewAlignment = (outcomeId) => {
  return (dispatch, getState, _arg, scope) => {
    const outcome = getAlignedOutcome(getState(), scope, outcomeId)
    dispatch(viewAlignmentAction(outcomeId))
    if (outcome && outcome.scoring_method) {
      return Promise.resolve()
    }
    const { host, jwt } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getOutcome',
        args: [host, jwt, outcomeId]
      }
    })
      .then((json) => {
        return dispatch(updateAlignment({
          outcome: json
        }))
      })
  }
}

export const updateAlignments = (guid, outcomes, updateCallback) => {
  return (dispatch, getState) => {
    dispatch(setAlignments({ guid, outcomes }))
    if (updateCallback) {
      updateCallback({ guid, outcomes })
    }
    return Promise.resolve()
  }
}

export const loadAlignments = (alignmentSetId, updateCallback) => {
  return (dispatch, getState, _arg, scope) => {
    if (alignmentSetId && getOutcomeAlignmentSetId(getState(), scope) === alignmentSetId) {
      return Promise.resolve()
    }
    const { host, jwt } = getConfig(getState(), scope)
    return dispatch(clearAlignmentSet())
      .then(() => {
        return dispatch({
          type: CALL_SERVICE,
          payload: {
            service: 'outcomes',
            method: 'getAlignments',
            args: [host, jwt, alignmentSetId]
          }
        })
      })
      .then(json => dispatch(updateAlignments(json.guid, json.outcomes, updateCallback)))
      .catch(e => dispatch(setError(e)))
  }
}

export const removeAlignment = (alignmentId, updateCallback) => {
  return (dispatch, getState, _arg, scope) => {
    const state = getState()
    const alignedIds = getAlignedOutcomeIds(state, scope)
    const newIds = alignedIds.filter((id) => id !== alignmentId)
    if (newIds.length > 0) {
      const newOutcomes = newIds.map((id) => getAlignedOutcome(state, scope, id))
      return dispatch(createAlignmentSet(newIds))
        .then((response) => {
          return dispatch(updateAlignments(response.guid, newOutcomes, updateCallback))
        })
        .catch((err) => {
          dispatch(setError(err))
        })
    } else {
      return dispatch(clearAlignmentSet(updateCallback))
    }
  }
}

export const createAlignmentSet = (alignedOutcomeIds) => {
  return (dispatch, getState, _arg, scope) => {
    const { host, jwt } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'createAlignmentSet',
        args: [host, jwt, alignedOutcomeIds]
      }
    })
  }
}

export const clearAlignmentSet = (updateCallback) => {
  return (dispatch, getState) => {
    dispatch(updateAlignments(null, [], updateCallback))
    return Promise.resolve()
  }
}
