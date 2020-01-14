import { Component } from 'react'
import PropTypes from 'prop-types'

export default class IfFeature extends Component {
  static propTypes = {
    children: PropTypes.node,
    features: PropTypes.array,
    name: PropTypes.string.isRequired
  }

  static defaultProps = {
    children: null,
    features: []
  }

  get isOn () {
    return this.props.features.includes(this.props.name)
  }

  render () {
    if (!this.isOn) {
      return null
    }
    return this.props.children
  }
}
