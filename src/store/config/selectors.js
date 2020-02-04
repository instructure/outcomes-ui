import { Map } from 'immutable'
import { createSelector } from 'reselect'

function restrict (state, scope) {
  return state.getIn([scope, 'config']) || Map()
}

export const getConfig = createSelector(
  restrict,
  (config) => config.toJS()
)
