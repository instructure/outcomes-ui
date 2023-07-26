import { connect } from 'react-redux'
import OutcomeView from '../components/OutcomeView'
import { getContextByScope } from '../store/context/selectors'
import { getFeatures } from '../store/features/selectors'

const mapStateToProps = (state, ownProps) => {
  const { scope } = ownProps

  return {
    context: getContextByScope(state, scope)?.data,
    features: getFeatures(state),
  }
}

const ConnectedOutcomeView = connect(mapStateToProps)(OutcomeView)

export default ConnectedOutcomeView
