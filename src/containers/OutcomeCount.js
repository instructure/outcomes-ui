import PropTypes from 'prop-types'
import AlignmentCount from './ConnectedAlignmentCount'
import OutcomeSDKComponent from './OutcomeSDKComponent'

export default OutcomeSDKComponent(AlignmentCount, {
  alignmentSetId: PropTypes.string.isRequired
})
