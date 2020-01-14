import { connect } from 'react-redux'
import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import OutcomesPerStudent from '../components/OutcomesPerStudent'
import {
  loadPage,
  viewReportAlignment,
  closeReportAlignment
} from '../store/report/actions'
import { setError } from '../store/context/actions'
import {
  getLoading,
  getPageCount,
  getPageNumber,
  getUsers,
  getReportOutcome,
  getRollups,
  getScore,
  isOpen,
  hasAnyOutcomes
} from '../store/report/selectors'

function mapStateToProps (state, ownProps) {
  const { scope } = ownProps
  return {
    pageCount: getPageCount(state, scope),
    currentPage: getPageNumber(state, scope),
    rollups: getRollups(state, scope),
    users: getUsers(state, scope),
    getReportOutcome: getReportOutcome.bind(null, state, scope),
    hasAnyOutcomes: hasAnyOutcomes(state, scope),
    getScore: getScore.bind(null, state, scope),
    isOpen: isOpen.bind(null, state, scope),
    loading: getLoading(state, scope)
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { scope } = ownProps
  return bindScopedActionCreators({
    loadPage,
    viewReportAlignment,
    closeReportAlignment,
    setError
  }, dispatch, scope)
}

const ConnectedOutcomesPerStudent = connect(
  mapStateToProps,
  mapDispatchToProps
)(OutcomesPerStudent)

export default ConnectedOutcomesPerStudent
