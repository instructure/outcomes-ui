import { compose } from 'redux'
import { connect } from 'react-redux'
import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import AlignmentCount from '../components/AlignmentCount'
import WithAlignmentSet from '../components/WithAlignmentSet'
import { getAlignedOutcomeCount } from '../store/alignments/selectors'
import { loadAlignments } from '../store/alignments/actions'

function mapStateToProps (state, ownProps) {
  const { scope } = ownProps
  return {
    count: getAlignedOutcomeCount(state, scope)
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { scope } = ownProps
  // eslint-disable react-redux/mapDispatchToProps-returns-object
  return bindScopedActionCreators({loadAlignments}, dispatch, scope)
}

const ConnectedAlignmentCount = compose(
  connect(mapStateToProps, mapDispatchToProps),
  WithAlignmentSet
)(AlignmentCount)

export default ConnectedAlignmentCount
