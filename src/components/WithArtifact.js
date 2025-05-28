import React from 'react'
import PropTypes from 'prop-types'

const WithArtifact = (ComponentClass) => class extends React.Component {
  static propTypes = {
    loadArtifact: PropTypes.func.isRequired,
    artifactId: PropTypes.string,
    artifactType: PropTypes.string,
    ...ComponentClass.propTypes
  }

  static defaultProps = {
    artifactId: '',
    artifactType: ''
  }

  static displayName = `WithArtifact(${ComponentClass.displayName})`

  UNSAFE_componentWillMount () {
    this.loadIfNeeded(this.props)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.loadIfNeeded(nextProps)
  }

  loadIfNeeded (props) {
    const { artifactId, artifactType, loadArtifact } = props
    if (!this.state || (this.state.artifactId !== artifactId && this.state.artifactType !== artifactType)) {
      this.setState({ artifactId, artifactType })
      loadArtifact({artifactId, artifactType})
    }
  }

  render () {
    return (
      <ComponentClass {...this.props} />
    )
  }
}

export default WithArtifact
