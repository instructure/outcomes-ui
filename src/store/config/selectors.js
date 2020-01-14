import { Map } from 'immutable'

function restrict (state, scope) {
  return state.getIn([scope, 'config']) || Map()
}

export function getConfig (state, scope) {
  const config = restrict(state, scope)
  return config ? config.toJS() : {}
}
