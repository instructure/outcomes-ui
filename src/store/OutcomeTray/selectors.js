import { Map } from 'immutable'
import createCachedSelector from 're-reselect'

const getTray = (state, scope) => state.getIn([scope, 'OutcomePicker', 'tray']) || Map()

export const getOutcomeList = createCachedSelector(
  (state, scope) => getTray(state, scope).get('list'),
  (list) => list ? list.toJS() : []
) (
  (_, scope) => scope
)

const pagination = (state, scope) => getTray(state, scope).get('pagination') || Map()

export const getListPage = (state, scope) => pagination(state, scope).get('page')

export const getListTotal = (state, scope) => pagination(state, scope).get('total')
