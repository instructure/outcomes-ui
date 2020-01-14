import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { connect } from 'react-redux'
import * as contextActions from '../store/context/actions'
import * as searchActions from '../store/search/actions'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import {
  getRootOutcomeIds,
  getCollectionData,
  getAllOutcomeIds,
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
  getActiveChildrenIds,
  getSelectedOutcomeIds,
  isOutcomeSelected,
  getActiveCollectionId,
  getActiveOutcomeHeader,
  getActiveOutcomeSummary,
  getActiveOutcomeDescription,
  getExpandedIds
} from '../store/OutcomePicker/selectors'
import { getAnyOutcome } from '../store/alignments/selectors'
import { getFeatures } from '../store/features/selectors'
import OutcomePicker from '../components/OutcomePicker'

function mapStateToProps (state, ownProps) {
  const { artifactTypeName, displayMasteryDescription, displayMasteryPercentText, scope } = ownProps
  return {
    collections: getCollectionData(state, scope),
    allOutcomeIds: getAllOutcomeIds(state, scope),
    rootOutcomeIds: getRootOutcomeIds(state, scope),
    activeChildrenIds: getActiveChildrenIds(state, scope),
    getOutcome: getAnyOutcome.bind(null, state, scope),
    getOutcomeSummary: getOutcomeSummary.bind(null, state, scope),
    focusedOutcome: getFocusedOutcome(state, scope),
    expandedIds: getExpandedIds(state, scope),
    outcomePickerState: getOutcomePickerState(state, scope),
    selectedOutcomeIds: getSelectedOutcomeIds(state, scope),
    isOutcomeSelected: isOutcomeSelected.bind(null, state, scope),
    isOutcomeGroup: isOutcomeGroup.bind(null, state, scope),
    activeCollection: {
      id: getActiveCollectionId(state, scope),
      header: getActiveOutcomeHeader(state, scope),
      summary: getActiveOutcomeSummary(state, scope),
      description: getActiveOutcomeDescription(state, scope)
    },
    artifactTypeName: artifactTypeName,
    displayMasteryDescription: displayMasteryDescription,
    displayMasteryPercentText: displayMasteryPercentText,
    features: getFeatures(state),
    searchText: getSearchText(state, scope),
    isSearchLoading: getIsSearchLoading(state, scope),
    searchPage: getSearchPage(state, scope),
    searchEntries: getSearchEntries(state, scope),
    searchTotal: getSearchTotal(state, scope)
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
