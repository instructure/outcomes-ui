import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { compose } from 'redux'
import { connect } from 'react-redux'
import OutcomeLabels from '../components/OutcomeLabels'
import WithAlignmentSet from '../components/WithAlignmentSet'
import { getAlignedOutcomes } from '../store/alignments/selectors'
import * as alignmentActions from '../store/alignments/actions'

const mapStateToProps = (state, ownProps) => {
  const { scope } = ownProps
  return {
    outcomes: getAlignedOutcomes(state, scope)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { scope } = ownProps
  return {
    ...bindScopedActionCreators(alignmentActions, dispatch, scope)
  }
}

const ConnectedAlignmentLabels = compose(
  connect(mapStateToProps, mapDispatchToProps),
  WithAlignmentSet
)(OutcomeLabels)

export default ConnectedAlignmentLabels
