import PropTypes from 'prop-types'
import ConnectedAlignmentButton from './ConnectedAlignmentButton'
import OutcomeSDKComponent from './OutcomeSDKComponent'


export default OutcomeSDKComponent(ConnectedAlignmentButton, {
  artifactType: PropTypes.string,
  artifactId: PropTypes.string,
  screenreaderNotification: PropTypes.func
})
