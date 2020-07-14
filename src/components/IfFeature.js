import { Component } from 'react'
import PropTypes from 'prop-types'

import { getFeatureFlags } from '../constants'

export default class IfFeature extends Component {
  static propTypes = {
    children: PropTypes.node,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired
  }

  static defaultProps = {
    children: null
  }

  get invalidFeature () {
    return !getFeatureFlags().includes(this.props.name)
  }

  get isOn () {
    return this.props.features.includes(this.props.name)
  }

  render () {
    if (this.invalidFeature) {
      throw new Error(`${this.props.name} not listed as a feature flag in constants.js!`)
    }
    if (!this.isOn) {
      return null
    }
    return this.props.children
  }
}
