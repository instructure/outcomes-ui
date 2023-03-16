/*
 * context
 */

export const SELECT_OUTCOME_IDS = 'SELECT_OUTCOME_IDS'
export const SET_ERROR = 'SET_ERROR'
export const SET_OUTCOMES = 'SET_OUTCOMES'
export const SET_OUTCOME_PICKER_STATE = 'SET_OUTCOME_PICKER_STATE'
export const SET_ROOT_OUTCOME_IDS = 'SET_ROOT_OUTCOME_IDS'
export const SET_SELECTED_OUTCOME_IDS = 'SET_SELECTED_OUTCOME_IDS'
export const UNSELECT_OUTCOME_IDS = 'UNSELECT_OUTCOME_IDS'
export const SET_SCORING_METHOD = 'SET_SCORING_METHOD'
export const SET_FEATURES = 'SET_FEATURES'
export const SET_CONTEXT = 'SET_CONTEXT'

/*
 * alignments
 */

export const SET_ALIGNMENTS = 'SET_ALIGNMENTS'
export const VIEW_ALIGNMENT = 'VIEW_ALIGNMENT'
export const CLOSE_ALIGNMENT = 'CLOSE_ALIGNMENT'
export const UPDATE_ALIGNMENT = 'UPDATE_ALIGNMENT'

/*
 * picker
 */

export const SET_FOCUSED_OUTCOME = 'SET_FOCUSED_OUTCOME'
export const SET_ACTIVE_COLLECTION_ID = 'SET_ACTIVE_COLLECTION_ID'
export const TOGGLE_EXPANDED_IDS = 'TOGGLE_EXPANDED_IDS'
export const SET_SCOPE = 'SET_SCOPE'
export const RESET_OUTCOME_PICKER = 'RESET_OUTCOME_PICKER'

/*
 * reporting
 */

export const SET_REPORT_PAGE = 'SET_REPORT_PAGE'
export const SET_REPORT_PAGE_DATA = 'SET_PAGE_DATA'
export const SET_REPORT_OUTCOMES = 'SET_REPORT_OUTCOMES'
export const SET_REPORT_ROLLUPS = 'SET_REPORT_ROLLUPS'
export const SET_REPORT_RESULTS = 'SET_REPORT_RESULTS'
export const SET_REPORT_USERS = 'SET_REPORT_USERS'
export const SET_REPORT_LOADING = 'SET_REPORT_LOADING'
export const SET_REMAINING_PAGES_LOADING = 'SET_REMAINING_PAGES_LOADING'
export const VIEW_REPORT_ALIGNMENT = 'VIEW_REPORT_ALIGNMENT'
export const CLOSE_REPORT_ALIGNMENT = 'CLOSE_REPORT_ALIGNMENT'
export const ALL_USERS = 'ALL_USERS'
export const NOT_FETCHING = 'NOT_FETCHING'
export const IN_PROGRESS = 'FETCHING_IN_PROGRESS'
export const ERROR = 'FETCHING_ERROR'
export const COMPLETED = 'FETCHING_COMPLETED'

// CSV Report Headers
export const STUDENT_NAME = 'student_name'
export const STUDENT_UUID = 'student_uuid'
export const ATTEMPT_COUNT = 'attempt_count'
export const ALIGNED_QUESTIONS_COUNT = 'aligned_questions_count'
export const LOR_POINTS = 'lor_points'
export const LOR_POINTS_POSSIBLE = 'lor_points_possible'
export const LO_NAME = 'lo_name'
export const LO_ID = 'lo_id'
export const LO_MASTERY_PERCENT = 'lo_mastery_percent'
export const LO_MASTERED = 'lo_mastered'

/*
 * search
 */
export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT'
export const SET_SEARCH_PAGE = 'SET_SEARCH_PAGE'
export const SET_SEARCH_LOADING = 'SET_SEARCH_LOADING'
export const SET_SEARCH_ENTRIES = 'SET_SEARCH_ENTRIES'
export const SET_SEARCH_TOTAL = 'SET_SEARCH_TOTAL'

/*
* tray
*/
export const SET_OUTCOME_LIST = 'SET_OUTCOME_LIST'
export const SET_LIST_PAGE = 'SET_LIST_PAGE'
export const SET_LIST_TOTAL = 'SET_LIST_TOTAL'

/*
 * student mastery
 */
export const SET_INDIVIDUAL_RESULTS = 'SET_INDIVIDUAL_RESULTS'
export const SET_INDIVIDUAL_RESULTS_STATE = 'SET_INDIVIDUAL_RESULTS_STATE'

/*
 * add feature flags here as strings
 * this being a function allows it to be stubbed in tests
*/

export const REPORT_DOWNLOAD_FF = 'report_download'
export const getFeatureFlags = () => {
  return [REPORT_DOWNLOAD_FF]
}

/*
 * calculation method
 */

export const HIGHEST = 'highest'
export const LATEST = 'latest'
export const N_MASTERY = 'n_mastery'
export const DECAYING_AVERAGE = 'decaying_average'
export const AVERAGE = 'average'

export const CALCULATION_METHODS = {
  [HIGHEST]: 'Highest Score',
  [LATEST]: 'Most Recent Score',
  [N_MASTERY]: 'Achieve Mastery {n} times',
  [DECAYING_AVERAGE]: 'Decaying Average - {percent}%/{complement}%',
  [AVERAGE]: 'Average'
}
