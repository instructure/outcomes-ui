import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { connect } from 'react-redux'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import * as searchActions from '../store/search/actions'
import { getOutcomePickerState, anyOutcomeSelected } from '../store/OutcomePicker/selectors'
import ConnectedOutcomePicker from './ConnectedOutcomePicker'
import OutcomePickerModal from '../components/OutcomePickerModal'

function mapStateToProps (state, ownProps) {
  const { scope } = ownProps
  return {
    outcomePicker: ConnectedOutcomePicker,
    outcomePickerState: getOutcomePickerState(state, scope),
    anyOutcomeSelected: anyOutcomeSelected(state, scope)
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    ...bindScopedActionCreators(outcomePickerActions, dispatch, ownProps.scope),
    ...bindScopedActionCreators(searchActions, dispatch, ownProps.scope)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OutcomePickerModal)
