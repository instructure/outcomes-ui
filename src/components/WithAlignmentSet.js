import React from 'react'
import PropTypes from 'prop-types'

const WithAlignmentSet = (ComponentClass) => class extends React.Component {
  static propTypes = {
    loadAlignments: PropTypes.func.isRequired,
    alignmentSetId: PropTypes.string,
    ...ComponentClass.propTypes
  }

  static defaultProps = {
    alignmentSetId: null
  }

  static displayName = `WithAlignmentSet(${ComponentClass.displayName})`

  componentWillMount () {
    this.loadIfNeeded(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.loadIfNeeded(nextProps)
  }

  loadIfNeeded (props) {
    const { alignmentSetId, loadAlignments, launchContexts } = props
    if (!this.state || this.state.alignmentSetId !== alignmentSetId) {
      this.setState({ alignmentSetId })
      loadAlignments(alignmentSetId, launchContexts)
    }
  }

  render () {
    return (
      <ComponentClass {...this.props} />
    )
  }
}

export default WithAlignmentSet
