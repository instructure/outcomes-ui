import { connect } from 'react-redux'
import OutcomeView from '../components/OutcomeView'
import { getContextByScope } from '../store/context/selectors'

const mapStateToProps = (state, ownProps) => {
  const { scope } = ownProps

  return {
    context: getContextByScope(state, scope)?.data
  }
}

const ConnectedOutcomeView = connect(mapStateToProps)(OutcomeView)

export default ConnectedOutcomeView
