import { List, Map } from 'immutable'
import { getOutcome } from '../context/selectors'

function restrict (state, scope) {
  return state.getIn([scope, 'alignments']) || Map()
}

export function getAlignedOutcomeIds (state, scope) {
  return getAlignedOutcomes(state, scope).map((o) => o.id)
}

export function getAlignedOutcomes (state, scope) {
  let alignedOutcomes = List()
  if (state && restrict(state, scope).get('alignedOutcomes')) {
    alignedOutcomes = restrict(state, scope).get('alignedOutcomes')
  }
  return alignedOutcomes.toJS().sort((a, b) => {
    const titleA = (a && a.title) || 'ZZZZZZZZZZZZ' // treat null as really large
    const titleB = (b && b.title) || 'ZZZZZZZZZZZZ' // treat null as really large
    return titleA.localeCompare(titleB)
  })
}

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

export function isOpen (state, scope, alignmentId) {
  return restrict(state, scope).get('openAlignmentId') === alignmentId
}

export function getOutcomeAlignmentSetId (state, scope) {
  return restrict(state, scope).get('alignmentSetId')
}
