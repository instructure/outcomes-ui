import { Map } from 'immutable'

function restrict (state, scope) {
  return state.getIn([scope, 'OutcomePicker']).get('tray') || Map()
}

function pagination (state, scope) {
  return restrict(state, scope).get('pagination') || Map()
}

export function getOutcomeList (state, scope) {
  const outcomes = restrict(state, scope).get('list')
  return outcomes ? outcomes.toJS() : []
}

export function getListPage (state, scope) {
  return pagination(state, scope).get('page')
}

export function getListTotal (state, scope) {
  return pagination(state, scope).get('total')
}
