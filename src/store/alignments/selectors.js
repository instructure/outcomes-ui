import { List, Map } from 'immutable'
import createCachedSelector from 're-reselect'
import { getOutcome } from '../context/selectors'

const restrict = (state, scope) => state.getIn([scope, 'alignments']) || Map()
const alignedOutcomes = (state, scope) => restrict(state, scope).get('alignedOutcomes') || List()
const openAlignmentId = (state, scope) => restrict(state, scope).get('openAlignmentId')

export function getAlignedOutcomeIds (state, scope) {
  return getAlignedOutcomes(state, scope).map((o) => o.id)
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

export function getAlignedOutcomeCount (state, scope) {
  if (state && restrict(state, scope).get('alignedOutcomes')) {
    return restrict(state, scope).get('alignedOutcomes').size
  }
  return 0
}

export function getAlignedOutcome (state, scope, id) {
  const outcomes = getAlignedOutcomes(state, scope)
  return outcomes.find((outcome) => outcome.id === id)
}

export function getAnyOutcome (state, scope, id) {
  return getAlignedOutcome(state, scope, id) || getOutcome(state, scope, id)
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

