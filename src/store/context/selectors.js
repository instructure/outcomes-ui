import formatMessage from 'format-message'
import { Map } from 'immutable'

import { getConfig } from '../config/selectors'

function restrictHasIn (state, contextUuid, key) {
  return state.hasIn(['context', key, contextUuid])
}

function restrict (state, contextUuid) {
  return state.getIn(['context', contextUuid]) || Map()
}

export function getAllOutcomeIds (state, scope) {
  const { contextUuid } = getConfig(state, scope)
  let outcomes = []
  if (state && restrictHasIn(state, contextUuid, 'outcomes')) {
    outcomes = restrict(state, 'outcomes').get(contextUuid).keySeq().toJS()
  }
  return outcomes.slice(0, 10).map((id) => id.toString())
}

export function getOutcome (state, scope, id) {
  const { contextUuid } = getConfig(state, scope)
  const outcome = restrict(state, 'outcomes').getIn([contextUuid, id.toString()])
  return outcome ? outcome.toJS() : null
}

export function isOutcomeGroup (state, scope, id) {
  const outcome = getOutcome(state, scope, id)
  return outcome && (outcome.has_children || (outcome.child_ids && outcome.child_ids.length > 0))
}

export function getRootOutcomeIds (state, scope) {
  const { contextUuid } = getConfig(state, scope)
  const ids = restrict(state, 'rootOutcomeIds').get(contextUuid)
  return ids ? ids.toJS() : []
}

export function getOutcomeSummary (state, scope, id) {
  const { contextUuid } = getConfig(state, scope)
  const outcomes = restrict(state, 'outcomes').get(contextUuid)
  return getCollectionDetails(outcomes, id).descriptor
}

const cachedCollectionData = {}

export function getCollectionData (state, scope) {
  const { contextUuid } = getConfig(state, scope)
  let outcomes = {}
  if (state && restrictHasIn(state, contextUuid, 'outcomes')) {
    outcomes = restrict(state, 'outcomes').get(contextUuid)
  } else {
    return // return null so OutcomeTree doesn't try to render an empty object
  }
  if (cachedCollectionData[contextUuid] &&
      cachedCollectionData[contextUuid].outcomes === outcomes) {
    return cachedCollectionData[contextUuid].collections
  }
  const collections = {}
  for (const id of outcomes.keys()) { // eslint-disable-line no-restricted-syntax
    if (!isCollectionId(outcomes, id)) {
      continue // eslint-disable-line no-continue
    }
    collections[id] = getCollectionDetails(outcomes, id) // eslint-disable-line immutable/no-mutation
  }
  cachedCollectionData[contextUuid] = { outcomes, collections } // eslint-disable-line immutable/no-mutation
  return collections
}

const isCollectionId = (outcomes, id) => {
  return outcomes.has(id) &&
          (outcomes.getIn([id, 'has_children']) ||
          (outcomes.hasIn([id, 'child_ids']) && outcomes.getIn([id, 'child_ids']).size > 0))
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
  const outcome = outcomes.get(id).toJS()
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
