import PropTypes from 'prop-types'
import ConnectedAlignmentButton from './ConnectedAlignmentButton'
import OutcomeSDKComponent from './OutcomeSDKComponent'


export default OutcomeSDKComponent(ConnectedAlignmentButton, {
  alignmentSetId: PropTypes.string,
  screenreaderNotification: PropTypes.func
})
