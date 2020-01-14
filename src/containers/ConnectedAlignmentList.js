import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { compose } from 'redux'
import { connect } from 'react-redux'
import AlignmentList from '../components/AlignmentList'
import WithAlignmentSet from '../components/WithAlignmentSet'
import { getAlignedOutcomes, isOpen } from '../store/alignments/selectors'
import * as contextActions from '../store/context/actions'
import * as alignmentActions from '../store/alignments/actions'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import { getOutcomePickerState } from '../store/OutcomePicker/selectors'

import ConnectedOutcomePickerModal from './ConnectedOutcomePickerModal'
import ConnectedOutcomeTray from './ConnectedOutcomeTray'

const mapStateToProps = (state, ownProps) => {
  const { scope, pickerType } = ownProps
  return {
    addModal: pickerType === 'tray' ? ConnectedOutcomeTray : ConnectedOutcomePickerModal,
    outcomePickerState: getOutcomePickerState(state, scope),
    alignedOutcomes: getAlignedOutcomes(state, scope),
    isOpen: isOpen.bind(null, state, scope)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { scope, screenreaderNotification } = ownProps
  return {
    ...bindScopedActionCreators(contextActions, dispatch),
    ...bindScopedActionCreators(alignmentActions, dispatch, scope),
    ...bindScopedActionCreators(outcomePickerActions, dispatch, scope),
    screenreaderNotification
  }
}

const ConnectedAlignmentList = compose(
  connect(mapStateToProps, mapDispatchToProps),
  WithAlignmentSet
)(AlignmentList)

export default ConnectedAlignmentList
