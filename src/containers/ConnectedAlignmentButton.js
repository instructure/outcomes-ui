import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { connect } from 'react-redux'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import AlignmentButton from '../components/AlignmentButton'
import ConnectedOutcomeTray from './ConnectedOutcomeTray'


const mapStateToProps = (_state, _ownProps) => {
  return {
    tray: ConnectedOutcomeTray,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    ...bindScopedActionCreators(outcomePickerActions, dispatch, ownProps.scope),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AlignmentButton)
