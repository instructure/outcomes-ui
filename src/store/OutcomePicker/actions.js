import { createAction } from 'redux-actions'
import { CALL_SERVICE } from '@instructure/redux-service-middleware'
import { getConfig } from '../config/selectors'
import {
  SELECT_OUTCOME_IDS,
  UNSELECT_OUTCOME_IDS,
  SET_SELECTED_OUTCOME_IDS,
  SET_OUTCOME_PICKER_STATE,
  SET_FOCUSED_OUTCOME,
  SET_ACTIVE_COLLECTION_ID,
  TOGGLE_EXPANDED_IDS,
  RESET_OUTCOME_PICKER,
  SET_SELECTED_LAUNCH_CONTEXT,
  RESET_EXPANDED_IDS
} from '../../constants'
import {
  loadRootOutcomes,
  loadMoreOutcomes,
  setError,
  setScoringMethod
} from '../context/actions'
import {getAlignedOutcomeIds, getAnyOutcome, getLaunchContexts} from '../alignments/selectors'
import {getSelectedOutcomeIds, getOutcomePickerState, getSelectedLaunchContext} from './selectors'
import { createAlignmentSet, updateAlignments, upsertArtifact } from '../alignments/actions'
import { setScope } from '../activePicker/actions'
import {Set} from 'immutable'

export const setSelectedLaunchContext = createAction(SET_SELECTED_LAUNCH_CONTEXT)
export const selectOutcomeIds = createAction(SELECT_OUTCOME_IDS)
export const deselectOutcomeIds = createAction(UNSELECT_OUTCOME_IDS)
export const setSelectedOutcomeIds = createAction(SET_SELECTED_OUTCOME_IDS)
export const setOutcomePickerState = createAction(SET_OUTCOME_PICKER_STATE)
export const setActiveCollectionFrd = createAction(SET_ACTIVE_COLLECTION_ID)
export const setFocusedOutcomeAction = createAction(SET_FOCUSED_OUTCOME)
export const toggleExpandedIds = createAction(TOGGLE_EXPANDED_IDS)
export const resetExpandedIds = createAction(RESET_EXPANDED_IDS)
export const resetOutcomePicker = createAction(RESET_OUTCOME_PICKER)

export const loadSelectedLaunchContext = () => {
  return (dispatch, getState, _arg, scope) => {
    const selected = getSelectedLaunchContext(getState(), scope)
    const launchContexts = getLaunchContexts(getState(), scope)
    if (launchContexts && launchContexts.length > 0 && !selected) {
      dispatch(setSelectedLaunchContext(launchContexts[0]))
    }
  }
}

export const loadOutcomePicker = () => {
  return (dispatch, getState, _arg, scope) => {
    dispatch(setOutcomePickerState('loading'))
    dispatch(loadSelectedLaunchContext())
    return dispatch(loadRootOutcomes())
      .then(() => dispatch(setSelectedOutcomeIds(getAlignedOutcomeIds(getState(), scope))))
      .then(() => dispatch(setOutcomePickerState('choosing')))
      .then(() => {
        return Promise.resolve()
      }) // allows chaining other thunks
  }
}

export const changeSelectedLaunchContext = (newSelectedLaunchContext) => {
  return (dispatch, getState, _arg, scope) => {
    dispatch(setOutcomePickerState('loading'))
    dispatch(setSelectedLaunchContext(newSelectedLaunchContext))
    // Reset activeCollection and expanded ids since we are moving to another context hierarchy
    dispatch(setActiveCollectionFrd(null))
    dispatch(resetExpandedIds(Set()))
    return dispatch(loadRootOutcomes())
      .then(() => dispatch(setOutcomePickerState('choosing')))
      .then(() => Promise.resolve()) // allows chaining other thunks
  }
}

export const setActiveCollection = (id) => {
  return (dispatch, getState, _arg, scope) => {
    dispatch(setActiveCollectionFrd(id))
    return dispatch(loadMoreOutcomes(id))
  }
}

export const setFocusedOutcome = (outcome) => {
  return (dispatch, getState, _arg, scope) => {
    if (!outcome || outcome.scoring_method) {
      dispatch(setFocusedOutcomeAction(outcome))
      return Promise.resolve()
    }
    const { host, jwt, contextUuid } = getConfig(getState(), scope)
    const selected = getSelectedLaunchContext(getState(), scope)
    const context = selected?.uuid || contextUuid
    // First dispatch brings up the outcome view,
    // second dispatch provides the scoring method
    dispatch(setFocusedOutcomeAction(outcome))
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getOutcome',
        args: [host, jwt, outcome.id, context]
      }
    })
      .then((json) => {
        dispatch(setScoringMethod({
          context_uuid: context,
          id: outcome.id,
          scoring_method: json.scoring_method
        }))
        return dispatch(setFocusedOutcomeAction(json))
      })
  }
}

export const saveOutcomePickerAlignments = (updateCallback, shouldUpdateArtifact = false) => {
  return (dispatch, getState, _arg, scope) => {
    dispatch(setOutcomePickerState('saving'))

    const state = getState()
    const outcomeIds = getSelectedOutcomeIds(state, scope)

    const updateAlignmentFunc = shouldUpdateArtifact ? upsertArtifact : createAlignmentSet
    return dispatch(updateAlignmentFunc(outcomeIds))
      .then(response => {
        if (shouldUpdateArtifact) {
          const outcomes = outcomeIds.map((id) => getAnyOutcome(state, scope, id))
          return dispatch(updateAlignments(response.guid, outcomes, updateCallback))
        }
        return dispatch(updateAlignments(response.guid, response.outcomes, updateCallback))
      })
      .then(() => dispatch(setOutcomePickerState('complete')))
      .catch(err => dispatch(setError(err)))
  }
}

export const openOutcomePicker = () => {
  return (dispatch, getState, _arg, scope) => {
    const pickerState = getOutcomePickerState(getState(), scope)
    if (pickerState !== 'choosing') {
      dispatch(setScope(scope))
      dispatch(setOutcomePickerState('loading'))
    }
  }
}

export const closeOutcomePicker = () => {
  return (dispatch, getState, _arg, _scope) => {
    dispatch(setScope(''))
    dispatch(setOutcomePickerState('closed'))
  }
}
