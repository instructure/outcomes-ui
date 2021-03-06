import { Map } from 'immutable'

function restrict (state, scope) {
  return state.getIn([scope, 'report']) || Map()
}

export function getPageCount (state, scope) {
  if (state) {
    const pageData = restrict(state, scope).get('pageData')
    if (pageData) {
      const { total, perPage } = pageData.toJS()
      return Math.ceil(total / perPage)
    }
  }
  return null
}

export function getLoading (state, scope) {
  return state && restrict(state, scope).get('loading')
}

export function getPageNumber (state, scope) {
  return state && restrict(state, scope).getIn(['page', 'number'])
}

export function getPageLoading (state, scope) {
  return state && restrict(state, scope).getIn(['page', 'loading'], false)
}

export function getUsers (state, scope) {
  const users = state && restrict(state, scope).get('users')
  return users ? users.toJS() : []
}

export function getRollups (state, scope) {
  const rollups = state && restrict(state, scope).get('rollups')
  return rollups ? rollups.toJS() : []
}

export function getScore (state, scope, outcomeId, userId) {
  const score = state && restrict(state, scope).getIn(['results', outcomeId, userId])
  return score ? score.toJS() : null
}

export function isOpen (state, scope, outcomeId) {
  return restrict(state, scope).get('openReportAlignmentId') === outcomeId
}

export function getReportOutcome (state, scope, outcomeId) {
  const outcome = restrict(state, scope).getIn(['outcomes', outcomeId])
  return outcome ? outcome.toJS() : null
}

export function hasAnyOutcomes (state, scope) {
  return state && restrict(state, scope).getIn(['outcomes']).size > 0
}
