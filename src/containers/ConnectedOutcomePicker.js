import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { connect } from 'react-redux'
import * as contextActions from '../store/context/actions'
import * as searchActions from '../store/search/actions'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import {
  hasContextOutcomes
} from '../store/context/selectors'
import {
  getSearchText,
  getIsSearchLoading,
  getSearchEntries,
  getSearchPage,
  getSearchTotal
} from '../store/search/selectors'
import {
  getFocusedOutcome,
  getOutcomePickerState,
  getSelectedOutcomes,
  makeIsOutcomeSelected
} from '../store/OutcomePicker/selectors'
import OutcomePicker from '../components/OutcomePicker'
import ConnectedOutcomeTree from './ConnectedOutcomeTree'

function mapStateToProps (state, ownProps) {
  const { artifactTypeName, displayMasteryDescription, displayMasteryPercentText, scope } = ownProps
  return {
    hasOutcomes: hasContextOutcomes(state, scope),
    focusedOutcome: getFocusedOutcome(state, scope),
    outcomePickerState: getOutcomePickerState(state, scope),
    selectedOutcomes: getSelectedOutcomes(state, scope),
    isOutcomeSelected: makeIsOutcomeSelected(state, scope),
    artifactTypeName: artifactTypeName,
    displayMasteryDescription: displayMasteryDescription,
    displayMasteryPercentText: displayMasteryPercentText,
    searchText: getSearchText(state, scope),
    isSearchLoading: getIsSearchLoading(state, scope),
    searchPage: getSearchPage(state, scope),
    searchEntries: getSearchEntries(state, scope),
    searchTotal: getSearchTotal(state, scope),
    treeView: ConnectedOutcomeTree
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { screenreaderNotification, scope } = ownProps
  return {
    ...bindScopedActionCreators(outcomePickerActions, dispatch, scope),
    ...bindScopedActionCreators(contextActions, dispatch, scope),
    ...bindScopedActionCreators(searchActions, dispatch, scope),
    screenreaderNotification
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OutcomePicker)
