import { Map, List } from 'immutable'
import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import { getOutcome } from '../context/selectors'

const restrict = (state, scope) => state.getIn([scope, 'alignments']) || Map()
const alignedOutcomes = (state, scope) => restrict(state, scope).get('alignedOutcomes') || List()
const openAlignmentId = (state, scope) => restrict(state, scope).get('openAlignmentId')

/**
 * LaunchContexts will be a list of at most 2 elements. It is only populated when we are aligning
 * outcomes to items in banks. The first element will always represent the root account context.
 * The second will be the context that the current user is in (root account, sub-account, or course).
 */
export const getLaunchContexts = createSelector(
  (state, scope) => restrict(state, scope).get('launchContexts'),
  (launchContexts) => launchContexts?.toJS() || null
)

/**
 * This returns the last element in the list of launch contexts. This will be equivalent to the
 * context that the current user is in (root account, sub-account, or course).
 */
export function getLaunchContextUuid(state, scope) {
  const launchContexts = getLaunchContexts(state, scope)
  return launchContexts?.slice(-1)[0]?.uuid || null
}

/**
 * This returns the first element in the list of launch contexts. This will be equivalent to the
 * root account context.
 */
export function getRootAccountContextUuid(state, scope) {
  const launchContexts = getLaunchContexts(state, scope)
  return launchContexts?.slice(0)[0]?.uuid || null
}

export function isLaunchingFromRootAccount(state, scope) {
  const rootAccountContextUuid = getRootAccountContextUuid(state, scope)
  const launchContextUuid = getLaunchContextUuid(state, scope)
  return rootAccountContextUuid && (rootAccountContextUuid === launchContextUuid)
}

export const getAlignedOutcomes = createCachedSelector(
  alignedOutcomes,
  (alignedOutcomes) => alignedOutcomes.toJS()
) (
  (_state, scope) => scope
)

export const getAlignedOutcomeIds = createSelector(
  getAlignedOutcomes,
  (outcomes) => outcomes.map((o) => o.id)
)

export function getAlignedOutcomeCount (state, scope) {
  if (state && restrict(state, scope).get('alignedOutcomes')) {
    return restrict(state, scope).get('alignedOutcomes').size
  }
  return 0
}

export const getAlignedOutcome = createSelector(
  (state, scope, id) => getAlignedOutcomes(state, scope).find((o) => o.id === id),
  (outcome) => outcome
)

function getOutcomeFromAnyContext(state, scope, id) {
  const launchContexts = getLaunchContexts(state, scope)

  if (launchContexts) {
    for (const launchContext of launchContexts) {
      const uuid = launchContext.uuid
      const o = state.getIn(['context', 'outcomes', uuid, id.toString()])
      if (o) {
        return o.toJS()
      }
    }
  }
  return null
}

export function getAnyOutcome (state, scope, id) {
  return getAlignedOutcome(
    state, scope, id
  ) || getOutcome(state, scope, id) || getOutcomeFromAnyContext(state, scope, id)
}

export function getOutcomeAlignmentSetId (state, scope) {
  return restrict(state, scope).get('alignmentSetId')
}

export const makeIsOpen = createCachedSelector(
  openAlignmentId,
  (openAlignments) => (id) => openAlignments === id
) (
  (_state, scope) => scope
)
