import PropTypes from 'prop-types'
import AlignmentList from './ConnectedAlignmentList'
import OutcomeSDKComponent from './OutcomeSDKComponent'

export default OutcomeSDKComponent(AlignmentList, {
  alignmentSetId: PropTypes.string,
  emptySetHeading: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
  onModalOpen: PropTypes.func,
  onModalClose: PropTypes.func,
  artifactTypeName: PropTypes.string,
  displayMasteryDescription: PropTypes.bool,
  displayMasteryPercentText: PropTypes.bool,
  screenreaderNotification: PropTypes.func
})
