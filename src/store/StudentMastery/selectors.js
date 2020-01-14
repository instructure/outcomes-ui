import { Map } from 'immutable'

function restrict (state, scope) {
  return state.getIn([scope, 'StudentMastery']) || Map()
}

export function getIndividualResults (state, scope) {
  let individualResults = null
  if (state && restrict(state, scope).get('individualResults')) {
    individualResults = restrict(state, scope).get('individualResults')
  }
  return individualResults === null ? null : individualResults.toJS()
}

export function getIndividualResultsState (state, scope) {
  return restrict(state, scope).get('state') || 'closed'
}
