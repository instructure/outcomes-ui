import { Map } from 'immutable'

function restrict (state) {
  return state.getIn(['OutcomePicker']).get('tray') || Map()
}

export function getOutcomeList (state) {
  const outcomes = restrict(state).get('list')
  return outcomes ? outcomes.toJS() : []
}
