import { bindActionCreators as bindScopedActionCreators } from 'multireducer'
import { connect } from 'react-redux'
import * as contextActions from '../store/context/actions'
import * as outcomePickerActions from '../store/OutcomePicker/actions'
import {
  getRootOutcomeIds,
  getCollectionData,
  makeGetOutcomeSummary
} from '../store/context/selectors'
import {
  getActiveCollection,
  getExpandedIds,
  makeIsOutcomeSelected,
  getActiveChildren,
  getSelectedLaunchContext
} from '../store/OutcomePicker/selectors'
import OutcomeTree from '../components/OutcomeTree'
import { getLaunchContexts } from '../store/alignments/selectors'

const mapStateToProps = (state, ownProps) => {
  const { scope } = ownProps
  return {
    activeChildren: getActiveChildren(state, scope),
    collections: getCollectionData(state, scope),
    getOutcomeSummary: makeGetOutcomeSummary(state, scope),
    isOutcomeSelected: makeIsOutcomeSelected(state, scope),
    rootOutcomeIds: getRootOutcomeIds(state, scope),
    activeCollection: getActiveCollection(state, scope),
    expandedIds: getExpandedIds(state, scope),
    launchContexts: getLaunchContexts(state, scope),
    selectedLaunchContext: getSelectedLaunchContext(state, scope)
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { scope } = ownProps
  return {
    ...bindScopedActionCreators(outcomePickerActions, dispatch, scope),
    ...bindScopedActionCreators(contextActions, dispatch, scope)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OutcomeTree)
