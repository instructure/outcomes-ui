import { Map } from 'immutable'
import { isEqual } from 'lodash'
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import createCachedSelector from 're-reselect'

import { getOutcome, isGroup, makeGetOutcomeSummary } from '../context/selectors'
import { getAnyOutcome } from '../alignments/selectors'

// Deep compare objects to avoid rerendering when contents are the same
const customDeepComparisonSelector = createSelectorCreator(defaultMemoize, isEqual)

function restrict (state, scope) {
  return state.getIn([scope, 'OutcomePicker']) || Map()
}

function selectedOutcomeIds (state, scope) {
  return restrict(state, scope).get('selected')
}

export const getSelectedOutcomeIds = createCachedSelector(
  selectedOutcomeIds,
  (ids) => ids ? ids.toJS() : []
) (
  (_state, scope) => scope
)

export function getFocusedOutcome (state, scope) {
  return restrict(state, scope).get('focusedOutcome')
}

export const getExpandedIds = createSelector(
  (state, scope) => restrict(state, scope).get('expandedIds'),
  (ids) => ids ? ids.toJS() : []
)

export const makeIsOutcomeSelected = createCachedSelector(
  selectedOutcomeIds,
  (selected) => (id) => selected ? selected.has(id.toString()) : false
) (
  (_state, scope) => scope
)

export const getSharedContexts = (state, scope) => {
  return restrict(state, scope).get('sharedContexts') || null
}

export function getSelectedSharedContext (state, scope) {
  return restrict(state, scope).get('selectedSharedContext') || null
}

export function anyOutcomeSelected (state, scope) {
  const ids = restrict(state, scope).get('selected')
  return ids ? !ids.isEmpty() : false
}

export function getActiveCollectionId (state, scope) {
  return restrict(state, scope).get('activeCollection') || ''
}

export const getOutcomePickerState = (state, scope) => restrict(state, scope).get('state')

const getActiveCollectionOutcome = (state, scope) => {
  const id = getActiveCollectionId(state, scope)
  return id ? getOutcome(state, scope, id) : null
}

export const getActiveCollection = createCachedSelector(
  getActiveCollectionOutcome,
  (state, scope) => {
    const id = getActiveCollectionId(state, scope)
    return id ? makeGetOutcomeSummary(state, scope)(id) : ''
  },
  (outcome, summary) => ({
    header: outcome ? outcome.title : '',
    id: outcome ? outcome.id : '',
    description: outcome ? outcome.description : '',
    summary,
  })
) (getActiveCollectionId)

export const getActiveChildren = createCachedSelector(
  (state, scope) => {
    const active = getActiveCollectionOutcome(state, scope)
    if (active && active.child_ids) {
      return active.child_ids.map((id) => getOutcome(state, scope, id))
    }
    return []
  },
  (childOutcomes) => {
    const { groups, nonGroups } = childOutcomes.reduce((acc, val) => {
      isGroup(val) ? acc.groups.push(val) : acc.nonGroups.push(val)
      return acc
    }, { groups: [], nonGroups: [] })
    return { groups, nonGroups }
  }
) (getActiveCollectionId, { selectorCreator: customDeepComparisonSelector})

export const getSelectedOutcomes = customDeepComparisonSelector(
  (state, scope) => getSelectedOutcomeIds(state, scope).map((id) => getAnyOutcome(state, scope, id)),
  (outcomes) => outcomes
)
