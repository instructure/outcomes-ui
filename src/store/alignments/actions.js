import { createAction } from 'redux-actions'
import { CALL_SERVICE } from '@instructure/redux-service-middleware'
import {
  SET_ALIGNMENTS,
  VIEW_ALIGNMENT,
  CLOSE_ALIGNMENT,
  UPDATE_ALIGNMENT,
  SET_LAUNCH_CONTEXTS
} from '../../constants'
import {getAlignedOutcomeIds, getAlignedOutcome, getOutcomeAlignmentSetId, getLaunchContextUuid} from './selectors'
import { getConfig } from '../config/selectors'
import { setError } from '../context/actions'
import {loadSelectedLaunchContext} from '../OutcomePicker/actions'

/*
 * action creators
 */
export const setLaunchContexts = createAction(SET_LAUNCH_CONTEXTS)
export const setAlignments = createAction(SET_ALIGNMENTS)
export const viewAlignmentAction = createAction(VIEW_ALIGNMENT)
export const closeAlignment = createAction(CLOSE_ALIGNMENT)
export const updateAlignment = createAction(UPDATE_ALIGNMENT)

export const loadLaunchContexts = (launchContexts) => {
  return (dispatch, _getState) => {
    return dispatch(setLaunchContexts(launchContexts))
  }
}

export const viewAlignment = (outcomeId) => {
  return (dispatch, getState, _arg, scope) => {
    const outcome = getAlignedOutcome(getState(), scope, outcomeId)
    dispatch(viewAlignmentAction(outcomeId))
    if (outcome && outcome.scoring_method) {
      return Promise.resolve()
    }
    const { host, jwt, contextUuid } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getOutcome',
        args: [host, jwt, outcomeId, contextUuid]
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
  return (dispatch) => {
    dispatch(setAlignments({ guid, outcomes }))
    if (updateCallback) {
      updateCallback({ guid, outcomes })
    }
    return Promise.resolve()
  }
}

export const loadAlignments = (alignmentSetId, launchContexts, updateCallback) => {
  return (dispatch, getState, _arg, scope) => {
    if (alignmentSetId && getOutcomeAlignmentSetId(getState(), scope) === alignmentSetId) {
      return Promise.resolve()
    }
    if (launchContexts) {
      dispatch(loadLaunchContexts(launchContexts))
      dispatch(loadSelectedLaunchContext())
    }
    const { host, jwt, contextUuid } = getConfig(getState(), scope)
    const launchContext = getLaunchContextUuid(getState(), scope)
    return dispatch(clearAlignmentSet())
      .then(() => {
        return dispatch({
          type: CALL_SERVICE,
          payload: {
            service: 'outcomes',
            method: 'getAlignments',
            args: [host, jwt, alignmentSetId, contextUuid, launchContext]
          }
        })
      })
      .then(json => dispatch(updateAlignments(json.guid, json.outcomes, updateCallback)))
      .catch(e => dispatch(setError(e)))
  }
}

export const removeAlignment = (alignmentId, updateCallback, shouldUpdateArtifact = false) => {
  return (dispatch, getState, _arg, scope) => {
    const newIds = getAlignedOutcomeIds(getState(), scope).filter((id) => id !== alignmentId)
    if (newIds.length === 0 && !shouldUpdateArtifact) {
      return dispatch(clearAlignmentSet(updateCallback))
    }

    const updateAlignmentFunc = shouldUpdateArtifact ? upsertArtifact : createAlignmentSet
    return dispatch(updateAlignmentFunc(newIds))
      .then(response => {
        if (shouldUpdateArtifact) {
          const newOutcomes = newIds.map((id) => getAlignedOutcome(getState(), scope, id))
          return dispatch(updateAlignments(response.guid, newOutcomes, updateCallback))
        }
        return dispatch(updateAlignments(response.guid, response.outcomes, updateCallback))
      })
      .catch(e => dispatch(setError(e)))
  }
}

export const createAlignmentSet = (outcomeIds) => {
  return (dispatch, getState, _arg, scope) => {
    const { host, jwt } = getConfig(getState(), scope)
    const launchContext = getLaunchContextUuid(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'createAlignmentSet',
        args: [host, jwt, outcomeIds, launchContext]
      }
    })
  }
}

export const clearAlignmentSet = (updateCallback) => {
  return (dispatch) => {
    dispatch(updateAlignments(null, [], updateCallback))
    return Promise.resolve()
  }
}

export const loadArtifact = () => {
  return (dispatch, getState, _arg, scope) => {
    const { host, jwt, artifactType, artifactId } = getConfig(getState(), scope)
    return dispatch(clearAlignmentSet())
      .then(() => {
        return dispatch({
          type: CALL_SERVICE,
          payload: {
            service: 'outcomes',
            method: 'getArtifact',
            args: [host, jwt, artifactType, artifactId]
          }
        })
      })
      .then(json => dispatch(updateAlignments(json.guid, json.outcomes)))
      .catch(e => dispatch(setError(e)))
  }
}

export const upsertArtifact = (outcomeIds) => {
  return (dispatch, getState, _arg, scope) => {
    const { host, jwt, artifactType, artifactId, contextUuid } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'upsertArtifact',
        args: [host, jwt, artifactType, artifactId, contextUuid, outcomeIds]
      }
    })
  }
}
