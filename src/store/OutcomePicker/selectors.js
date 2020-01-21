import { Map } from 'immutable'

import { getOutcome, getOutcomeSummary } from '../context/selectors'

function restrict (state, scope) {
  return state.getIn([scope, 'OutcomePicker']) || Map()
}

export function getSelectedOutcomeIds (state, scope) {
  const ids = restrict(state, scope).get('selected')
  return ids ? ids.toJS() : []
}

export function getFocusedOutcome (state, scope) {
  return restrict(state, scope).get('focusedOutcome')
}

export function getExpandedIds (state, scope) {
  const ids = restrict(state, scope).get('expandedIds')
  return ids ? ids.toJS() : []
}

export function isOutcomeSelected (state, scope, id) {
  const ids = restrict(state, scope).get('selected')
  return ids ? ids.has(id.toString()) : false
}

export function anyOutcomeSelected (state, scope) {
  const ids = restrict(state, scope).get('selected')
  return ids ? !ids.isEmpty() : false
}

export function getActiveCollectionId (state, scope) {
  return restrict(state, scope).get('activeCollection')
}

export function getActiveOutcomeHeader (state, scope) {
  const outcomeId = getActiveCollectionId(state, scope)
  if (!outcomeId) {
    return ''
  }
  const outcome = getOutcome(state, scope, outcomeId)
  return outcome ? outcome.title : ''
}

export function getActiveOutcomeSummary (state, scope) {
  const outcomeId = getActiveCollectionId(state, scope)
  if (!outcomeId) {
    return ''
  }
  return getOutcomeSummary(state, scope, outcomeId)
}

export function getActiveOutcomeDescription (state, scope) {
  const outcomeId = getActiveCollectionId(state, scope)
  if (!outcomeId) {
    return ''
  }
  const outcome = getOutcome(state, scope, outcomeId)
  return outcome ? outcome.description : ''
}

export const getOutcomePickerState = (state, scope) => restrict(state, scope).get('state')

export function getActiveChildrenIds (state, scope) {
  const activeId = getActiveCollectionId(state, scope)
  if (activeId) {
    const activeCollection = getOutcome(state, scope, activeId)
    if (activeCollection && activeCollection.child_ids) {
      return activeCollection.child_ids
    }
  }
  return []
}
