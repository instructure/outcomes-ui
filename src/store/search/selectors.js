import { Map } from 'immutable'

function restrict (state) {
  return state.getIn(['OutcomePicker']).get('search') || Map()
}

function pagination (state) {
  return restrict(state).get('pagination') || Map()
}

export function getSearchText (state) {
  return restrict(state).get('searchText')
}

export function getIsSearchLoading (state) {
  return restrict(state).get('isLoading')
}

export function getSearchEntries (state) {
  const entries = restrict(state).get('entries')
  return entries ? entries.toJS() : []
}

export function getSearchPage (state) {
  return pagination(state).get('page')
}

export function getSearchTotal (state) {
  return pagination(state).get('total')
}
