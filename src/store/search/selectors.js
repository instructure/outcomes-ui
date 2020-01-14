import { Map } from 'immutable'

function restrict (state) {
  return state.getIn(['OutcomePicker']).get('search') || Map()
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
  return restrict(state).get('page')
}

export function getSearchTotal (state) {
  return restrict(state).get('total')
}
