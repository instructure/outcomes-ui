import { createAction } from 'redux-actions'
import { CALL_SERVICE } from '@instructure/redux-service-middleware'
import { getUsers, getPageLoading } from './selectors'
import {
  SET_REPORT_PAGE,
  SET_REPORT_PAGE_DATA,
  SET_REPORT_OUTCOMES,
  SET_REPORT_ROLLUPS,
  SET_REPORT_RESULTS,
  SET_REPORT_USERS,
  VIEW_REPORT_ALIGNMENT,
  CLOSE_REPORT_ALIGNMENT,
  SET_REPORT_LOADING
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

export const loadPage = (artifactType, artifactId, pageNumber, loadUsersOverride) => {
  return (dispatch, getState, _arg, scope) => {
    const loading = getPageLoading(getState(), scope)
    if (!loading) {
      dispatch(setLoading(true))
      dispatch(setPage({ number: pageNumber, loading: true }))

      let usersPromiseChain
      if (loadUsersOverride) {
        // if the override function is provided, we assume the upstream application has handled dispatching and is
        // returning a promise to us
        usersPromiseChain = loadUsersOverride(artifactType, artifactId, pageNumber)
      } else {
        usersPromiseChain = dispatch(loadUsers(artifactType, artifactId, pageNumber))
      }

      return usersPromiseChain
        .then(({users, perPage, total}) => {
          const pageData = { perPage, total }
          dispatch(setUsers(users))
          return dispatch(setPageData(pageData))
        })
        .then(() => dispatch(loadRollups(artifactType, artifactId)))
        .then(() => dispatch(setPage({ number: pageNumber, loading: false })))
        .then(() => dispatch(setLoading(false)))
        .catch((e) => {
          return dispatch(setError(e))
        })
    } else {
      return Promise.resolve()
    }
  }
}

export const loadRollups = (artifactType, artifactId) => {
  return (dispatch, getState, _arg, scope) => {
    const { host, jwt } = getConfig(getState(), scope)
    const userList = getUsers(getState(), scope).map((user) => user.uuid)

    const jsonPromise = dispatch({
      type: CALL_SERVICE,
      payload: {
        service: 'outcomes',
        method: 'getOutcomeRollups',
        args: [host, jwt, artifactType, artifactId]
      }
    })

    return jsonPromise.then((json) => {
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

      const getOutcomeResults = (outcomeId) => dispatch({
        type: CALL_SERVICE,
        payload: {
          service: 'outcomes',
          method: 'getOutcomeResults',
          args: [host, jwt, artifactType, artifactId, outcomeId, userList]
        }
      })

      const resultPromises = json.map((el) => {
        return getOutcomeResults(el.outcome.id) // eslint-disable-line promise/no-nesting
          .then((results) => {
            dispatch(setResults({ outcomeId: el.outcome.id, results }))
            return results
          })
      })

      return Promise.all(resultPromises)
    })
      .catch((e) => {
        return dispatch(setError(e))
      })
  }
}
