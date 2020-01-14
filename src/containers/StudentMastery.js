import PropTypes from 'prop-types'
import ConnectedStudentMastery from './ConnectedStudentMastery'
import OutcomeSDKComponent from './OutcomeSDKComponent'

export default OutcomeSDKComponent(ConnectedStudentMastery, {
  mastery: PropTypes.bool.isRequired,
  userUuid: PropTypes.string.isRequired
})
