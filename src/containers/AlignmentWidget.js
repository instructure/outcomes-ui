import PropTypes from 'prop-types'
import ConnectedAlignmentWidget from './ConnectedAlignmentWidget'
import OutcomeSDKComponent from './OutcomeSDKComponent'


export default OutcomeSDKComponent(ConnectedAlignmentWidget, {
  artifactType: PropTypes.string,
  artifactId: PropTypes.string,
  screenreaderNotification: PropTypes.func
})
