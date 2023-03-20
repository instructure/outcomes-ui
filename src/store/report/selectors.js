import { Map } from 'immutable'
import { ALL_USERS } from '../../constants'
import { formatDataIntoRow } from '../../util/outcomesReportUtils'

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

export function getLoadingRemainingPages (state, scope) {
  return state && restrict(state, scope).get('loadingRemainingPages')
}

export function getPageNumber (state, scope) {
  return state && restrict(state, scope).getIn(['page', 'number'])
}

export function getPageLoading (state, scope) {
  return state && restrict(state, scope).getIn(['page', 'loading'], false)
}

export function getUsers (state, scope, pageNumber) {
  return pageNumber == ALL_USERS ? getAllUsers(state, scope) : getUsersForPage(state, scope, pageNumber)
}

export function getHighestPageSeen (state, scope) {
  const seenPages = state && restrict(state, scope).get('users')
  const pagesList = seenPages && [...seenPages.keys()].map((pageNumber) => parseInt(pageNumber))
  return pagesList ? Math.max(...pagesList) : 0
}

export function getRollups (state, scope) {
  const rollups = state && restrict(state, scope).get('rollups')
  return rollups ? rollups.toJS() : []
}

export function getScore (state, scope, outcomeId, userId) {
  const score = state && restrict(state, scope).getIn(['results', outcomeId, userId])
  return score ? score.toJS() : null
}

export function getResults (state, scope, outcomeId) {
  const results = state && restrict(state, scope).getIn(['results', outcomeId])
  return results ? results : Map()
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

export function formatCSVData (state, scope) {
  const rows = []
  const users = Object.values(getAllUsers(state, scope)).flat()
  const rollups = getRollups(state, scope)
  users.forEach((user) => {
    rollups.forEach((rollup) => {
      const outcome = getReportOutcome(state, scope, rollup.outcomeId)
      const result = getScore(state, scope, rollup.outcomeId, user.uuid)
      if (result) {
        const row = formatDataIntoRow(user, outcome, rollup, result)
        rows.push(row)
      }
    })
  })
  return rows
}

// Helpers

const getAllUsers = (state, scope) => {
  const allUsers = state && restrict(state, scope).get('users')
  return allUsers ? allUsers.toJS() : {}
}

const getUsersForPage = (state, scope, pageNumber) => {
  const users = pageNumber != undefined && state && restrict(state, scope).getIn(['users', pageNumber.toString()])
  return users ? users.toJS() : []
}
