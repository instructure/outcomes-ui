import { compose } from 'redux'
import { connect } from 'react-redux'
import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import StudentMastery from '../components/StudentMastery'
import {
  getIndividualResults,
  getIndividualResultsState
} from '../store/StudentMastery/selectors'
import { loadIndividualResults } from '../store/StudentMastery/actions'

function mapStateToProps (state, ownProps) {
  const { scope } = ownProps
  return {
    results: getIndividualResults(state, scope),
    state: getIndividualResultsState(state, scope)
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { scope } = ownProps
  return bindScopedActionCreators({ loadIndividualResults }, dispatch, scope)
}

const ConnectedStudentMastery = compose(
  connect(mapStateToProps, mapDispatchToProps)
)(StudentMastery)

export default ConnectedStudentMastery
