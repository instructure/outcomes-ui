import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { connect } from 'react-redux'
import * as contextActions from '../store/context/actions'
import * as searchActions from '../store/search/actions'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import * as trayActions from '../store/OutcomeTray/actions'
import {
  isOutcomeGroup,
  getOutcomeSummary
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
  getSelectedOutcomeIds,
  isOutcomeSelected,
} from '../store/OutcomePicker/selectors'
import {
  getOutcomeList
} from '../store/OutcomeTray/selectors'
import { getAnyOutcome } from '../store/alignments/selectors'
import OutcomeTray from '../components/OutcomeTray'

function mapStateToProps (state, ownProps) {
  const { scope } = ownProps
  return {
    searchText: getSearchText(state, scope),
    isSearchLoading: getIsSearchLoading(state, scope),
    searchEntries: getSearchEntries(state, scope),
    searchPage: getSearchPage(state, scope),
    searchTotal: getSearchTotal(state, scope),
    getOutcome: getAnyOutcome.bind(null, state, scope),
    getOutcomeSummary: getOutcomeSummary.bind(null, state, scope),
    focusedOutcome: getFocusedOutcome(state, scope),
    outcomePickerState: getOutcomePickerState(state, scope),
    selectedOutcomeIds: getSelectedOutcomeIds(state, scope),
    isOutcomeSelected: isOutcomeSelected.bind(null, state, scope),
    isOutcomeGroup: isOutcomeGroup.bind(null, state, scope),
    outcomeList: getOutcomeList(state, scope),
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { screenreaderNotification, scope } = ownProps
  return {
    ...bindScopedActionCreators(outcomePickerActions, dispatch, scope),
    ...bindScopedActionCreators(contextActions, dispatch, scope),
    ...bindScopedActionCreators(searchActions, dispatch, scope),
    ...bindScopedActionCreators(trayActions, dispatch, scope),
    screenreaderNotification
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OutcomeTray)
