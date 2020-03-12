import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@instructure/ui-elements'
import { TruncateText } from '@instructure/ui-truncate-text'

export default class OutcomeDescription extends React.Component {
  static propTypes = {
    truncate: PropTypes.bool,
    description: PropTypes.string.isRequired,
  }

  static defaultProps = {
    truncate: true
  }

  stripHtmlTags (text) {
    const doc = new DOMParser().parseFromString(text, 'text/html')
    return doc.body.textContent || ''
  }

  render () {
    const { truncate, description } = this.props
    const strippedText = this.stripHtmlTags(description)
    return (
      <Text size="x-small">
        { truncate
          ? <TruncateText maxLines={2} position="end">{ strippedText }</TruncateText>
          : strippedText
        }
      </Text>
    )
  }
}
