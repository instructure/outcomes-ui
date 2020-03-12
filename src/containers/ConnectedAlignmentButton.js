import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { compose } from 'redux'
import { connect } from 'react-redux'
import * as alignmentActions from '../store/alignments/actions'
import { getAlignedOutcomes } from '../store/alignments/selectors'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import AlignmentButton from '../components/AlignmentButton'
import WithAlignmentSet from '../components/WithAlignmentSet'
import ConnectedOutcomeTray from './ConnectedOutcomeTray'


const mapStateToProps = (state, ownProps) => {
  const { scope } = ownProps
  return {
    tray: ConnectedOutcomeTray,
    alignedOutcomes: getAlignedOutcomes(state, scope),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { scope } = ownProps
  return {
    ...bindScopedActionCreators(outcomePickerActions, dispatch, scope),
    ...bindScopedActionCreators(alignmentActions, dispatch, scope),
  }
}

const ConnectedAlignmentButton = compose(
  connect(mapStateToProps, mapDispatchToProps),
  WithAlignmentSet
)(AlignmentButton)

export default ConnectedAlignmentButton
