import { Map, List } from 'immutable'
import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import { getOutcome } from '../context/selectors'

const restrict = (state, scope) => state.getIn([scope, 'alignments']) || Map()
const alignedOutcomes = (state, scope) => restrict(state, scope).get('alignedOutcomes') || List()
const openAlignmentId = (state, scope) => restrict(state, scope).get('openAlignmentId')

export const getLaunchContexts = createSelector(
  (state, scope) => restrict(state, scope).get('launchContexts'),
  (launchContexts) => launchContexts?.toJS() || null
)

export function getLaunchContextUuid(state, scope) {
  const launchContexts = getLaunchContexts(state, scope)
  return launchContexts?.slice(-1)[0]?.uuid || null
}

export const getAlignedOutcomes = createCachedSelector(
  alignedOutcomes,
  (alignedOutcomes) => alignedOutcomes.toJS().sort((a, b) => {
    const titleA = (a && a.title) || 'ZZZZZZZZZZZZ' // treat null as really large
    const titleB = (b && b.title) || 'ZZZZZZZZZZZZ' // treat null as really large
    return titleA.localeCompare(titleB)
  })
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
