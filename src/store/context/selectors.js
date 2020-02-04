import formatMessage from 'format-message'
import { Map } from 'immutable'
import { createSelector } from 'reselect'
import createCachedSelector, { LruObjectCache } from 're-reselect'

import { getConfig } from '../config/selectors'

function restrict (state, contextUuid) {
  return state.getIn(['context', contextUuid]) || Map()
}

function getContextUuid (state, scope) {
  return getConfig(state, scope).contextUuid || ''
}

export const isGroup = (outcome) => {
  return outcome && (outcome.has_children || (outcome.child_ids && outcome.child_ids.length > 0))
}

const getContextOutcomes = createSelector(
  (state, scope) => {
    const uuid = getContextUuid(state, scope)
    return restrict(state, 'outcomes').get(uuid)
  },
  (contextOutcomes) => contextOutcomes ? contextOutcomes.toJS() : {}
)

export const hasContextOutcomes = (state, scope) => {
  const contextOutcomes = getContextOutcomes(state, scope)
  return Object.keys(contextOutcomes).length > 0
}

export const getOutcome = createCachedSelector(
  (state, scope, id) => {
    const uuid = getContextUuid(state, scope)
    return restrict(state, 'outcomes').getIn([uuid, id.toString()])
  },
  (outcome) => outcome ? outcome.toJS() : null
) ({
  keySelector: (state, scope, id) => `${getContextUuid(state, scope)}#${id}`,
  cacheObject: new LruObjectCache({cacheSize: 50})
})

export function isOutcomeGroup (state, scope, id) {
  const outcome = getOutcome(state, scope, id)
  return isGroup(outcome)
}

export const getRootOutcomeIds = createSelector(
  (state, scope) => {
    const uuid = getContextUuid(state, scope)
    return restrict(state, 'rootOutcomeIds').get(uuid)
  },
  (ids) => ids ? ids.toJS() : []
)

export const makeGetOutcomeSummary = createSelector(
  [getContextOutcomes],
  (outcomes) => (id) => getCollectionDetails(outcomes, id).descriptor
)

export const getCollectionData = createSelector(
  getContextOutcomes,
  (outcomes) => {
    if (outcomes.length === 0) {
      return // return null so tree doesnt try to render an empty object
    }
    const collections = {}
    for (const id of Object.keys(outcomes)) { // eslint-disable-line no-restricted-syntax
      if (!isCollectionId(outcomes, id)) {
        continue // eslint-disable-line no-continue
      }
      collections[id] = getCollectionDetails(outcomes, id) // eslint-disable-line immutable/no-mutation
    }
    return collections
  }
)

const isCollectionId = (outcomes, id) => {
  const outcome = outcomes[id]
  return outcome &&
          (outcome.has_children ||
          (outcome.child_ids && outcome.child_ids.length > 0))
}

const getGroupText = (count) => {
  if (!(count > 0)) { return }
  return formatMessage(`{
    count, plural,
    one {# Group}
    other {# Groups}
  }`, { count: count })
}

const getOutcomeText = (count) => {
  if (!(count > 0)) { return }
  return formatMessage(`{
    count, plural,
    one {# Outcome}
    other {# Outcomes}
  }`, { count: count })
}

export const getDescriptor = (groupCount, outcomeCount) => {
  const groupText = getGroupText(groupCount)
  const outcomeText = getOutcomeText(outcomeCount)
  if (groupText && outcomeText) {
    return `${groupText} | ${outcomeText}`
  } else if (groupText) {
    return groupText
  } else if (outcomeText) {
    return outcomeText
  }
  return ''
}

const getCollectionDetails = (outcomes, id) => {
  const outcome = outcomes[id.toString()]
  const childIds = outcome.child_ids || []
  const subcollections = childIds.filter((id) => isCollectionId(outcomes, id))
  const groupCount = subcollections.length
  const outcomeCount = childIds.length - groupCount
  return {
    ...outcome,
    name: outcome.title,
    collections: subcollections,
    descriptor: getDescriptor(groupCount, outcomeCount)
  }
}

export const getChildrenToLoad = (state, scope, id) => {
  const outcome = getOutcome(state, scope, id)
  if (!outcome || outcome.is_partial) { return [id] }
  if (!outcome.child_ids) { return [] }

  return outcome.child_ids.filter((id) => {
    const o = getOutcome(state, scope, id)
    return o.is_partial && o.has_children
  })
}
