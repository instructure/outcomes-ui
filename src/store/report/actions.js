import { createAction } from 'redux-actions'
import { CALL_SERVICE } from '@instructure/redux-service-middleware'
import {
  getUsers,
  getPageLoading,
  getPageNumber,
  getResults,
  getHighestPageSeen,
  getPageCount,
  getRollups,
  getLoadingRemainingPages
} from './selectors'
import {
  SET_REPORT_PAGE,
  SET_REPORT_PAGE_DATA,
  SET_REPORT_OUTCOMES,
  SET_REPORT_ROLLUPS,
  SET_REPORT_RESULTS,
  SET_REPORT_USERS,
  VIEW_REPORT_ALIGNMENT,
  CLOSE_REPORT_ALIGNMENT,
  SET_REPORT_LOADING,
  SET_REMAINING_PAGES_LOADING,
  ALL_USERS,
  ERROR,
  IN_PROGRESS,
  COMPLETED
} from '../../constants'
import { getConfig } from '../config/selectors'
import { setError } from '../context/actions'

/*
 * action creators
 */
export const setReportOutcomes = createAction(SET_REPORT_OUTCOMES)
export const setRollups = createAction(SET_REPORT_ROLLUPS)
export const setResults = createAction(SET_REPORT_RESULTS)
export const viewReportAlignment = createAction(VIEW_REPORT_ALIGNMENT)
export const closeReportAlignment = createAction(CLOSE_REPORT_ALIGNMENT)
export const setUsers = createAction(SET_REPORT_USERS)
export const setPageData = createAction(SET_REPORT_PAGE_DATA)
export const setPage = createAction(SET_REPORT_PAGE)
export const setLoading = createAction(SET_REPORT_LOADING)
export const setLoadingRemainingPages = createAction(SET_REMAINING_PAGES_LOADING)

// Function calls to Outcome Service
export const loadUsers = (artifactType, artifactId, pageNumber) => {
  return (dispatch, getState, _arg, scope) => {
    const { host, jwt } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getUsers',
        args: [host, jwt, artifactType, artifactId, pageNumber]
      }
    })
  }
}

const getOutcomeResults = (artifactType, artifactId, outcomeId, userList) => {
  return (dispatch, getState, _arg, scope) => {
    const { host, jwt } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getOutcomeResults',
        args: [host, jwt, artifactType, artifactId, outcomeId, userList]
      }
    })
  }
}

const getOutcomeRollups = (artifactType, artifactId) => {
  return (dispatch, getState, _arg, scope) => {
    const { host, jwt } = getConfig(getState(), scope)
    return dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getOutcomeRollups',
        args: [host, jwt, artifactType, artifactId]
      }
    })
  }
}

// Functions for loading the Outcome Analysis Report
export const loadPage = (artifactType, artifactId, pageNumber, loadUsersOverride) => {
  return (dispatch, getState, _arg, scope) => {
    const hasSeenPage = getHighestPageSeen(getState(), scope) >= pageNumber
    const loading = getPageLoading(getState(), scope)
    if (!loading) {
      if (hasSeenPage) {
        dispatch(setPage({ number: pageNumber, loading: false }))
      } else {
        dispatch(setLoading(true))
        dispatch(setPage({ number: pageNumber, loading: true }))
        const usersPromiseChain = getUsersPromise(dispatch, artifactType, artifactId, pageNumber, loadUsersOverride)

        return usersPromiseChain
          .then(({users, perPage, total}) => {
            const pageData = { perPage, total }
            const seenUsers = getUsers(getState(), scope, ALL_USERS)
            const allUsers = {[pageNumber]: users, ...seenUsers}
            dispatch(setUsers(allUsers))
            return dispatch(setPageData(pageData))
          })
          .then(() => dispatch(loadRollups(artifactType, artifactId)))
          .then(() => dispatch(setPage({ number: pageNumber, loading: false })))
          .then(() => dispatch(setLoading(false)))
          .catch((e) => dispatch(setError(e)))
      }
    } else {
      return Promise.resolve()
    }
  }
}

export const loadRollups = (artifactType, artifactId) => {
  return (dispatch, getState, _arg, scope) => {
    const pageNumber = getPageNumber(getState(), scope)
    const userList = getUserList(getState(), scope, pageNumber)
    const rollupsPromise = dispatch(getOutcomeRollups(artifactType, artifactId))

    return rollupsPromise.then((json) => {
      const outcomes = json.reduce((acc, el) => {
        return Object.assign(acc, {[el.outcome.id]: el.outcome})
      }, {})
      const rollups = json.map((el) => ({
        outcomeId: el.outcome.id,
        averageScore: el.average_score,
        count: el.count,
        masteryCount: el.mastery_count,
        childArtifactCount: el.child_artifact_count,
        usesBank: el.uses_bank
      }))

      dispatch(setReportOutcomes(outcomes))
      dispatch(setRollups(rollups))

      const resultPromises = json.map((el) => {
        const resultPromise = dispatch(getOutcomeResults(artifactType, artifactId, el.outcome.id, userList))
        return resultPromise
          .then((results) => {
            const seenResults = getResults(getState(), scope, el.outcome.id)
            dispatch(setResults({ outcomeId: el.outcome.id, results, seenResults }))
            return results
          })
          .catch((e) => dispatch(setError(e)))
      })

      return Promise.all(resultPromises)
    })
      .catch((e) => dispatch(setError(e)))
  }
}

// Functions for fetching the remaining data for the Outcome Analysis Report CSV Download
export const loadRemainingPages = (artifactType, artifactId, loadUsersOverride) => {
  return (dispatch, getState, _arg, scope) => {
    const loadingRemainingPages = getLoadingRemainingPages(getState(), scope)
    if (loadingRemainingPages !== IN_PROGRESS) {
      // If there was an error in the last fetch, then the only data that is guaranteed to be
      // loaded is up to the page the user is currently on
      const startPage = loadingRemainingPages === ERROR
        ? getPageNumber(getState(), scope)
        : getHighestPageSeen(getState(), scope) + 1
      const endPage = getPageCount(getState(), scope)
      dispatch(setLoadingRemainingPages(IN_PROGRESS))
      return dispatch(loadRemainingUsers(artifactType, artifactId, startPage, endPage, loadUsersOverride))
        .then(() => dispatch(loadRemainingResults(artifactType, artifactId, startPage, endPage)))
        .catch((e) => {
          dispatch(setError(e))
          dispatch(setLoadingRemainingPages(ERROR))
        })
    } else {
      return Promise.resolve()
    }
  }
}

export const loadRemainingUsers = (artifactType, artifactId, startPage, endPage, loadUsersOverride) => {
  return (dispatch, getState, _arg, scope) => {
    const userPromises = []
    for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
      const usersPromise = getUsersPromise(dispatch, artifactType, artifactId, pageNumber, loadUsersOverride)
      const usersPromiseChain = usersPromise
        .then(({users, perPage, total}) => {
          const pageData = { perPage, total }
          const seenUsers = getUsers(getState(), scope, ALL_USERS)
          const allUsers = {[pageNumber]: users, ...seenUsers}
          dispatch(setUsers(allUsers))
          dispatch(setPageData(pageData))
        })
      userPromises.push(usersPromiseChain)
    }
    return Promise.all(userPromises)
      .catch((e) => {
        dispatch(setError(e))
        dispatch(setLoadingRemainingPages(ERROR))
      })
  }
}

export const loadRemainingResults = (artifactType, artifactId, startPage, endPage) => {
  return (dispatch, getState, _arg, scope) => {
    const rollups = getRollups(getState(), scope)
    const resultPromises = []
    rollups.forEach((rollup) => {
      const outcomeId = rollup.outcomeId
      const paginatedUserList = getPaginatedUserList(getState(), scope, startPage, endPage)
      paginatedUserList.forEach((userList) => {
        const resultPromise = dispatch(getOutcomeResults(artifactType, artifactId, outcomeId, userList))
          .then((results) => {
            const seenResults = getResults(getState(), scope, outcomeId)
            dispatch(setResults({ outcomeId: outcomeId, results, seenResults }))
          })
        resultPromises.push(resultPromise)
      })
    })
    return Promise.all(resultPromises)
      .then(() => dispatch(setLoadingRemainingPages(COMPLETED)))
      .catch((e) => {
        dispatch(setError(e))
        dispatch(setLoadingRemainingPages(ERROR))
      })
  }
}

// Helpers
const getUsersPromise = (dispatch, artifactType, artifactId, pageNumber, loadUsersOverride) => {
  // if the override function is provided, we assume the upstream application has handled dispatching and is
  // returning a promise to us
  return loadUsersOverride ? loadUsersOverride(artifactType, artifactId, pageNumber) : dispatch(loadUsers(artifactType, artifactId, pageNumber))
}

export const getUserList = (state, scope, page) => {
  return getUsers(state, scope, page).map((user) => user.uuid)
}

export const getPaginatedUserList = (state, scope, startPage, endPage) => {
  const userList = []
  for (let i = startPage; i <= endPage; i++) {
    const users = getUserList(state, scope, i)
    userList.push(users)
  }
  return userList
}
