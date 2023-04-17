import { List, Map, fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux-immutable'
import { NOT_FETCHING } from '../../constants'

import {
  setPage,
  setPageData,
  setUsers,
  setReportOutcomes,
  setRollups,
  setResults,
  setLoading,
  setLoadingRemainingPages,
  clearReportData
} from './actions'

const users = handleActions({
  [setUsers]: (_state, action) => fromJS(action.payload),
  [clearReportData]: (_state, _action) => Map()
}, Map())

const page = handleActions({
  [setPage]: (state, action) => fromJS(action.payload),
  [clearReportData]: (_state, _action) => fromJS({ number: void 0 })
}, fromJS({ number: void 0 }))

const pageData = handleActions({
  [setPageData]: (state, action) => fromJS(action.payload),
  [clearReportData]: (_state, _action) => Map()
}, Map())

const outcomes = handleActions({
  [setReportOutcomes]: (state, action) => fromJS(action.payload),
  [clearReportData]: (_state, _action) => Map()
}, Map())

const rollups = handleActions({
  [setRollups]: (state, action) => fromJS(action.payload),
  [clearReportData]: (_state, _action) => List()
}, List())

const loading = handleActions({
  [setLoading]: (state, action) => fromJS(action.payload),
  [clearReportData]: (_state, _action) => false
}, false)

const loadingRemainingPages = handleActions({
  [setLoadingRemainingPages]: (state, action) => fromJS(action.payload),
  [clearReportData]: (_state, _action) => NOT_FETCHING
}, NOT_FETCHING)

const results = handleActions({
  [setResults]: (state, action) => {
    const { outcomeId, results, seenResults } = action.payload
    const resultMap = results.map(({
      user_uuid: userId,
      percent_score: percentScore,
      points,
      points_possible: pointsPossible,
      attempt
    }) => {
      const ungulated = fromJS({
        userId, percentScore, points, pointsPossible, attempt: attempt ?? 1
      })
      return [userId.toString(), ungulated]
    })
    const fetchedResults = Map(resultMap)
    const allResults = Map([...fetchedResults, ...seenResults])
    return state.set(outcomeId, allResults)
  },
  [clearReportData]: (_state, _action) => Map()
}, Map())

const openReportAlignmentId = handleActions({
  VIEW_REPORT_ALIGNMENT: (state, action) => action.payload,
  CLOSE_REPORT_ALIGNMENT: () => null
}, null)

export default combineReducers({
  page,
  pageData,
  users,
  outcomes,
  results,
  rollups,
  openReportAlignmentId,
  loading,
  loadingRemainingPages
})
