import PropTypes from 'prop-types'
import AlignmentLabels from './ConnectedAlignmentLabels'
import OutcomeSDKComponent from './OutcomeSDKComponent'

export default OutcomeSDKComponent(AlignmentLabels, {
  alignmentSetId: PropTypes.string,
  emptyText: PropTypes.string
})
