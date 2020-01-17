import { Map } from 'immutable'

function restrict (state) {
  return state.getIn(['OutcomePicker']).get('tray') || Map()
}

function pagination (state) {
  return restrict(state).get('pagination') || Map()
}

export function getOutcomeList (state) {
  const outcomes = restrict(state).get('list')
  return outcomes ? outcomes.toJS() : []
}

export function getListPage (state) {
  return pagination(state).get('page')
}

export function getListTotal (state) {
  return pagination(state).get('total')
}
