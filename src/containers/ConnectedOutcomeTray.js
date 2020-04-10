import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { connect } from 'react-redux'
import * as contextActions from '../store/context/actions'
import * as activePickerActions from '../store/activePicker/actions'
import * as searchActions from '../store/search/actions'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import * as trayActions from '../store/OutcomeTray/actions'
import {
  getSearchText,
  getIsSearchLoading,
  getSearchEntries,
  getSearchPage,
  getSearchTotal
} from '../store/search/selectors'
import {
  getFocusedOutcome,
  getSelectedOutcomeIds,
  getOutcomePickerState,
  makeIsOutcomeSelected,
} from '../store/OutcomePicker/selectors'
import {
  getOutcomeList,
  getListPage,
  getListTotal
} from '../store/OutcomeTray/selectors'
import OutcomeTray from '../components/OutcomeTray'
import { isOpen } from '../store/activePicker/selectors'

function mapStateToProps (state, ownProps) {
  const { scope } = ownProps
  return {
    searchText: getSearchText(state, scope),
    isSearchLoading: getIsSearchLoading(state, scope),
    searchEntries: getSearchEntries(state, scope),
    searchPage: getSearchPage(state, scope),
    searchTotal: getSearchTotal(state, scope),
    isOpen: isOpen(state, scope),
    isFetching: getOutcomePickerState(state, scope) === 'loading',
    selectedOutcomeIds: getSelectedOutcomeIds(state, scope),
    isOutcomeSelected: makeIsOutcomeSelected(state, scope),
    outcomes: getOutcomeList(state, scope),
    listPage: getListPage(state, scope),
    listTotal: getListTotal(state, scope),
    focusedOutcome: getFocusedOutcome(state, scope)
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { screenreaderNotification, scope } = ownProps
  return {
    ...bindScopedActionCreators(outcomePickerActions, dispatch, scope),
    ...bindScopedActionCreators(activePickerActions, dispatch),
    ...bindScopedActionCreators(contextActions, dispatch, scope),
    ...bindScopedActionCreators(searchActions, dispatch, scope),
    ...bindScopedActionCreators(trayActions, dispatch, scope),
    screenreaderNotification
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OutcomeTray)
