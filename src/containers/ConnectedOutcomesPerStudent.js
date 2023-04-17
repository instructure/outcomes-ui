import { connect } from 'react-redux'
import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import OutcomesPerStudent from '../components/OutcomesPerStudent'
import {
  loadPage,
  loadRemainingPages,
  viewReportAlignment,
  closeReportAlignment,
  clearReportStore
} from '../store/report/actions'
import { setError } from '../store/context/actions'
import {
  formatCSVData,
  getLoading,
  getPageCount,
  getPageNumber,
  getUsers,
  getReportOutcome,
  getRollups,
  getScore,
  getLoadingRemainingPages,
  isOpen,
  hasAnyOutcomes
} from '../store/report/selectors'
import { getFeatures } from '../store/features/selectors'

function mapStateToProps (state, ownProps) {
  const { scope } = ownProps
  return {
    pageCount: getPageCount(state, scope),
    currentPage: getPageNumber(state, scope),
    rollups: getRollups(state, scope),
    users: getUsers(state, scope, getPageNumber(state, scope)),
    getReportOutcome: getReportOutcome.bind(null, state, scope),
    csvFetchingStatus: getLoadingRemainingPages(state, scope),
    formatCSVData: formatCSVData.bind(null, state, scope),
    hasAnyOutcomes: hasAnyOutcomes(state, scope),
    getScore: getScore.bind(null, state, scope),
    isOpen: isOpen.bind(null, state, scope),
    loading: getLoading(state, scope),
    features: getFeatures(state)
  }
}

/* eslint-disable react-redux/mapDispatchToProps-returns-object */
function mapDispatchToProps (dispatch, ownProps) {
  const { scope } = ownProps
  return bindScopedActionCreators({
    loadPage,
    loadRemainingPages,
    viewReportAlignment,
    closeReportAlignment,
    setError,
    clearReportStore
  }, dispatch, scope)
}
/* eslint-enable react-redux/mapDispatchToProps-returns-object */

const ConnectedOutcomesPerStudent = connect(
  mapStateToProps,
  mapDispatchToProps
)(OutcomesPerStudent)

export default ConnectedOutcomesPerStudent
