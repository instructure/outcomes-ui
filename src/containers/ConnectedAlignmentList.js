import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { compose } from 'redux'
import { connect } from 'react-redux'
import AlignmentList from '../components/AlignmentList'
import WithAlignmentSet from '../components/WithAlignmentSet'
import { getAlignedOutcomes, makeIsOpen } from '../store/alignments/selectors'
import * as contextActions from '../store/context/actions'
import * as alignmentActions from '../store/alignments/actions'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import ConnectedOutcomePickerModal from './ConnectedOutcomePickerModal'
import ConnectedOutcomeTray from './ConnectedOutcomeTray'

const mapStateToProps = (state, ownProps) => {
  const { scope, pickerType } = ownProps
  return {
    addModal: pickerType === 'tray' ? ConnectedOutcomeTray : ConnectedOutcomePickerModal,
    alignedOutcomes: getAlignedOutcomes(state, scope),
    isOpen: makeIsOpen(state, scope)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { scope } = ownProps
  return {
    ...bindScopedActionCreators(contextActions, dispatch),
    ...bindScopedActionCreators(alignmentActions, dispatch, scope),
    ...bindScopedActionCreators(outcomePickerActions, dispatch, scope),
  }
}

const ConnectedAlignmentList = compose(
  connect(mapStateToProps, mapDispatchToProps),
  WithAlignmentSet
)(AlignmentList)

export default ConnectedAlignmentList
