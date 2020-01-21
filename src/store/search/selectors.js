import { Map } from 'immutable'

function restrict (state, scope) {
  return state.getIn([scope, 'OutcomePicker']).get('search') || Map()
}

function pagination (state, scope) {
  return restrict(state, scope).get('pagination') || Map()
}

export function getSearchText (state, scope) {
  return restrict(state, scope).get('searchText')
}

export function getIsSearchLoading (state, scope) {
  return restrict(state, scope).get('isLoading')
}

export function getSearchEntries (state, scope) {
  const entries = restrict(state, scope).get('entries')
  return entries ? entries.toJS() : []
}

export function getSearchPage (state, scope) {
  return pagination(state, scope).get('page')
}

export function getSearchTotal (state, scope) {
  return pagination(state, scope).get('total')
}
