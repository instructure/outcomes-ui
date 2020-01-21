import { Map } from 'immutable'
import { createSelectorCreator, defaultMemoize } from 'reselect'
import createCachedSelector from 're-reselect'
import { isEqual } from 'lodash'
import { getAnyOutcome } from '../alignments/selectors'

const customDeepComparisonSelector = createSelectorCreator(defaultMemoize, isEqual)
const getSearch = (state, scope) => state.getIn([scope, 'OutcomePicker', 'search']) || Map()

export const getSearchEntries = createCachedSelector(
  (state, scope) => {
    let entries = getSearch(state, scope).get('entries')
    entries = entries ? entries.toJS() : []
    return entries.map((entry) => getAnyOutcome(state, scope, entry.id))
  },
  (entries) => entries,
) (
  (_state, scope) => scope,
  {
    // Deep comparison: https://github.com/toomuchdesign/re-reselect/issues/31
    selectorCreator: customDeepComparisonSelector
  }
)

export const getSearchText = (state, scope) => getSearch(state, scope).get('searchText')

export const getIsSearchLoading = (state, scope) => getSearch(state, scope).get('isLoading')

const pagination = (state, scope) => getSearch(state, scope).get('pagination') || Map()

export const getSearchPage = (state, scope) => pagination(state, scope).get('page')

export const getSearchTotal = (state, scope) => pagination(state, scope).get('total')
