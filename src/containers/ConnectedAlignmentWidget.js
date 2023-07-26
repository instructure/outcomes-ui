import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { compose } from 'redux'
import { connect } from 'react-redux'
import * as alignmentActions from '../store/alignments/actions'
import { getAlignedOutcomes } from '../store/alignments/selectors'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import AlignmentWidget from '../components/AlignmentWidget'
import WithArtifact from '../components/WithArtifact'
import ConnectedOutcomeTray from './ConnectedOutcomeTray'
import { getFeatures } from '../store/features/selectors'


const mapStateToProps = (state, ownProps) => {
  const { scope } = ownProps
  return {
    tray: ConnectedOutcomeTray,
    alignedOutcomes: getAlignedOutcomes(state, scope),
    features: getFeatures(state),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { scope } = ownProps
  return {
    ...bindScopedActionCreators(outcomePickerActions, dispatch, scope),
    ...bindScopedActionCreators(alignmentActions, dispatch, scope),
  }
}

const ConnectedAlignmentWidget = compose(
  connect(mapStateToProps, mapDispatchToProps),
  WithArtifact
)(AlignmentWidget)

export default ConnectedAlignmentWidget
